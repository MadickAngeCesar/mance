import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";

type MailRecipient = string | string[];

export type MailPayload = {
  to: MailRecipient;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export type MailDeliveryResult = {
  messageId: string;
  accepted: string[];
  rejected: string[];
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

let transporter: Transporter | null = null;

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM ?? user;

  if (!host || !portRaw || !user || !pass || !from) {
    return null;
  }

  const port = Number(portRaw);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid positive number.");
  }

  return {
    host,
    port,
    secure: parseBoolean(process.env.SMTP_SECURE, port === 465),
    user,
    pass,
    from,
  };
}

export function isMailConfigured() {
  return Boolean(getSmtpConfig());
}

function normalizeAddressList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (typeof entry === "string" ? entry : ""))
    .filter(Boolean);
}

function getTransporter() {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM.");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return { transporter, from: config.from };
}

export async function sendMail(payload: MailPayload): Promise<MailDeliveryResult> {
  const { transporter: smtpTransporter, from } = getTransporter();

  const options: SendMailOptions = {
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
    headers: payload.headers,
  };

  const info = await smtpTransporter.sendMail(options);

  return {
    messageId: info.messageId,
    accepted: normalizeAddressList((info as { accepted?: unknown }).accepted),
    rejected: normalizeAddressList((info as { rejected?: unknown }).rejected),
  };
}