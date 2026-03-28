import { CampaignStatus, DeliveryStatus, WorkKind } from "@/lib/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

type RetryResult<T> = {
  value?: T;
  attempts: number;
  error?: string;
};

export type ContactFanoutInput = {
  messageId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type PublishedContentInput = {
  contentType: WorkKind;
  contentId: string;
  slug: string;
  title: string;
  excerpt?: string | null;
};

const MAIL_BATCH_SIZE = Number(process.env.MAIL_BATCH_SIZE ?? 25);
const MAIL_RETRY_ATTEMPTS = Number(process.env.MAIL_RETRY_ATTEMPTS ?? 3);
const MAIL_INITIAL_BACKOFF_MS = Number(process.env.MAIL_INITIAL_BACKOFF_MS ?? 300);
const MAIL_PROVIDER_NAME = "gmail-smtp";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mance.dev").replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncateError(error: unknown, max = 1000) {
  const message = error instanceof Error ? error.message : "Unknown email error";
  return message.slice(0, max);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithRetry<T>(
  task: () => Promise<T>,
  attempts = MAIL_RETRY_ATTEMPTS,
  initialBackoffMs = MAIL_INITIAL_BACKOFF_MS
): Promise<RetryResult<T>> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const value = await task();
      return { value, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        const waitMs = initialBackoffMs * 2 ** (attempt - 1);
        await sleep(waitMs);
      }
    }
  }

  return {
    attempts,
    error: truncateError(lastError),
  };
}

export async function sendContactEmailFanout(input: ContactFanoutInput) {
  const notifyAddress = process.env.CONTACT_NOTIFY_TO;
  if (!notifyAddress) {
    throw new Error("CONTACT_NOTIFY_TO is required to send contact notification emails.");
  }

  const correlationId = `contact-${input.messageId}`;

  const escapedName = escapeHtml(input.name);
  const escapedEmail = escapeHtml(input.email);
  const escapedSubject = escapeHtml(input.subject);
  const escapedMessage = escapeHtml(input.message).replace(/\n/g, "<br />");

  const adminSend = runWithRetry(() =>
    sendMail({
      to: notifyAddress,
      subject: `[Contact] ${input.subject}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>From:</strong> ${escapedName} (${escapedEmail})</p>
        <p><strong>Subject:</strong> ${escapedSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage}</p>
      `,
      text: `New contact message\nFrom: ${input.name} (${input.email})\nSubject: ${input.subject}\n\n${input.message}`,
      replyTo: input.email,
      headers: {
        "X-Idempotency-Key": `${correlationId}-admin`,
      },
    })
  );

  const visitorSend = runWithRetry(() =>
    sendMail({
      to: input.email,
      subject: "We received your message",
      html: `
        <h2>Thanks for reaching out, ${escapedName}</h2>
        <p>Your message has been received and we will get back to you soon.</p>
        <p><strong>Your subject:</strong> ${escapedSubject}</p>
      `,
      text: `Thanks for reaching out, ${input.name}. We received your message and will reply soon.`,
      headers: {
        "X-Idempotency-Key": `${correlationId}-visitor`,
      },
    })
  );

  const [adminResult, visitorResult] = await Promise.all([adminSend, visitorSend]);

  return {
    adminDelivered: Boolean(adminResult.value),
    visitorDelivered: Boolean(visitorResult.value),
    adminAttempts: adminResult.attempts,
    visitorAttempts: visitorResult.attempts,
    adminError: adminResult.error,
    visitorError: visitorResult.error,
  };
}

function buildCampaignEmail(content: PublishedContentInput, recipientEmail: string) {
  const contentUrl = `${getBaseUrl()}/lab/${content.slug}`;
  const excerpt = content.excerpt?.trim();

  const subject = `New update: ${content.title}`;
  const html = `
    <h2>${escapeHtml(content.title)}</h2>
    ${excerpt ? `<p>${escapeHtml(excerpt)}</p>` : ""}
    <p><a href="${contentUrl}">Read now</a></p>
    <p style="color:#6b7280; font-size:12px;">Sent to ${escapeHtml(recipientEmail)}</p>
  `;
  const text = `${content.title}\n${excerpt ? `${excerpt}\n` : ""}${contentUrl}`;

  return { subject, html, text };
}

async function sendCampaignDelivery(
  delivery: {
    id: string;
    subscriber: { email: string; externalId: string };
  },
  campaignId: string,
  content: PublishedContentInput
) {
  const message = buildCampaignEmail(content, delivery.subscriber.email);
  const idempotencyKey = `campaign-${campaignId}-subscriber-${delivery.subscriber.externalId}`;

  const result = await runWithRetry(() =>
    sendMail({
      to: delivery.subscriber.email,
      subject: message.subject,
      html: message.html,
      text: message.text,
      headers: {
        "X-Idempotency-Key": idempotencyKey,
      },
    })
  );

  if (!result.value) {
    await prisma.subscriberCampaignDelivery.update({
      where: { id: delivery.id },
      data: {
        status: DeliveryStatus.FAILED,
        provider: MAIL_PROVIDER_NAME,
        error: result.error,
      },
    });
    return;
  }

  await prisma.subscriberCampaignDelivery.update({
    where: { id: delivery.id },
    data: {
      status: DeliveryStatus.SENT,
      provider: MAIL_PROVIDER_NAME,
      providerMsgId: result.value.messageId,
      sentAt: new Date(),
      error: null,
    },
  });
}

export async function triggerNewsletterCampaignForPublishedContent(content: PublishedContentInput) {
  const existingCampaign = await prisma.subscriberCampaign.findFirst({
    where: {
      contentType: content.contentType,
      contentId: content.contentId,
    },
  });

  if (
    existingCampaign &&
    (existingCampaign.status === CampaignStatus.QUEUED ||
      existingCampaign.status === CampaignStatus.SENDING ||
      existingCampaign.status === CampaignStatus.COMPLETED)
  ) {
    return {
      campaignId: existingCampaign.id,
      status: existingCampaign.status,
      skipped: true,
    };
  }

  const campaign = existingCampaign
    ? await prisma.subscriberCampaign.update({
        where: { id: existingCampaign.id },
        data: {
          title: content.title,
          slug: content.slug,
          status: CampaignStatus.QUEUED,
          scheduledAt: new Date(),
          sentAt: null,
        },
      })
    : await prisma.subscriberCampaign.create({
        data: {
          title: content.title,
          slug: content.slug,
          contentType: content.contentType,
          contentId: content.contentId,
          status: CampaignStatus.QUEUED,
          scheduledAt: new Date(),
        },
      });

  const subscribers = await prisma.subscriber.findMany({
    where: { active: true },
    select: {
      id: true,
      email: true,
      externalId: true,
    },
  });

  if (subscribers.length === 0) {
    await prisma.subscriberCampaign.update({
      where: { id: campaign.id },
      data: {
        status: CampaignStatus.COMPLETED,
        sentAt: new Date(),
      },
    });

    return {
      campaignId: campaign.id,
      status: CampaignStatus.COMPLETED,
      delivered: 0,
      failed: 0,
    };
  }

  await prisma.subscriberCampaignDelivery.createMany({
    data: subscribers.map((subscriber) => ({
      campaignId: campaign.id,
      subscriberId: subscriber.id,
      status: DeliveryStatus.QUEUED,
    })),
    skipDuplicates: true,
  });

  await prisma.subscriberCampaign.update({
    where: { id: campaign.id },
    data: { status: CampaignStatus.SENDING },
  });

  const pendingDeliveries = await prisma.subscriberCampaignDelivery.findMany({
    where: {
      campaignId: campaign.id,
      status: {
        in: [DeliveryStatus.QUEUED, DeliveryStatus.FAILED],
      },
    },
    include: {
      subscriber: {
        select: {
          email: true,
          externalId: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  for (let index = 0; index < pendingDeliveries.length; index += MAIL_BATCH_SIZE) {
    const batch = pendingDeliveries.slice(index, index + MAIL_BATCH_SIZE);
    await Promise.all(
      batch.map((delivery) => sendCampaignDelivery(delivery, campaign.id, content))
    );
  }

  const [delivered, failed] = await Promise.all([
    prisma.subscriberCampaignDelivery.count({
      where: { campaignId: campaign.id, status: DeliveryStatus.SENT },
    }),
    prisma.subscriberCampaignDelivery.count({
      where: { campaignId: campaign.id, status: DeliveryStatus.FAILED },
    }),
  ]);

  const campaignStatus = failed > 0 ? CampaignStatus.FAILED : CampaignStatus.COMPLETED;
  await prisma.subscriberCampaign.update({
    where: { id: campaign.id },
    data: {
      status: campaignStatus,
      sentAt: new Date(),
    },
  });

  return {
    campaignId: campaign.id,
    status: campaignStatus,
    delivered,
    failed,
  };
}