import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { isMailConfigured, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const ReplySchema = z.object({
  subject: z.string().min(1).max(200).optional(),
  body: z.string().min(1, "Reply body is required.").max(5000),
});

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function handlePost(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");

  if (!isMailConfigured()) {
    throw new ApiError("Email service is not configured.", 503);
  }

  const payload = ReplySchema.parse(await request.json());
  const params = await context.params;
  const message = await prisma.message.findUnique({ where: { id: params.id } });

  if (!message) {
    throw ApiError.notFound("Message not found");
  }

  const subject = payload.subject?.trim() || `Re: ${message.subject}`;
  const escapedBody = escapeHtml(payload.body).replace(/\n/g, "<br />");

  const delivery = await sendMail({
    to: message.email,
    subject,
    html: `
      <p>Hello ${escapeHtml(message.name)},</p>
      <p>${escapedBody}</p>
      <p>Best regards,<br />MAC TECH</p>
    `,
    text: `Hello ${message.name},\n\n${payload.body}\n\nBest regards,\nMAC TECH`,
    replyTo: process.env.MAIL_FROM,
    headers: {
      "X-Idempotency-Key": `reply-${message.id}-${Date.now()}`,
    },
  });

  await prisma.message.update({
    where: { id: message.id },
    data: { isRead: true },
  });

  return NextResponse.json({
    ok: true,
    data: {
      id: message.id,
      messageId: delivery.messageId,
      subject,
    },
  });
}

export const POST = createApiHandler(handlePost);
