# Email Delivery Stages (Nodemailer + Gmail SMTP)

This document defines the implementation stages for outgoing email in this portfolio project.

## 1. SMTP and Secrets Setup

- Provider: Gmail SMTP
- Transport host: smtp.gmail.com
- Transport port: 465 (secure) or 587 (STARTTLS)
- Auth: Gmail account with App Password
- Environment variables:
  - SMTP_HOST
  - SMTP_PORT
  - SMTP_SECURE
  - SMTP_USER
  - SMTP_PASS
  - MAIL_FROM
  - CONTACT_NOTIFY_TO

## 2. Mail Service Layer

- Build a reusable mail service module using Nodemailer transporter.
- Centralize template rendering for:
  - contact admin notification
  - contact visitor acknowledgment
  - newsletter campaign broadcast
- Return normalized result object: accepted, rejected, messageId, providerResponse.

## 3. Contact Form Email Stage

- Trigger path: POST /api/messages
- Steps:
  1. Validate and persist message in database.
  2. Send admin notification email.
  3. Send visitor acknowledgment email.
  4. Record delivery status in logs or database table.
  5. Return success/failure state to frontend.

## 4. Publish Newsletter Stage

- Trigger path: publish action in /api/blogs or /api/projects
- Steps:
  1. Ensure content is published.
  2. Fetch active subscribers.
  3. Create campaign record and batch jobs.
  4. Send batched email via Nodemailer transport.
  5. Track sent, failed, retried metrics.
  6. Expose campaign summary to dashboard.

## 5. Reliability and Safety

- Use retry policy for transient SMTP failures.
- Add backoff between batches to avoid provider throttling.
- Include idempotency key on campaign trigger to prevent duplicate sends.
- Validate recipient list and suppress unsubscribed addresses.
- Record bounce/rejection responses when available.

## 6. Observability

- Structured logs for each send attempt with messageId.
- Metrics to expose in dashboard:
  - delivery rate
  - failure rate
  - retry count
  - campaign duration

## 7. Local and Production Modes

- Local dev: use a sandbox transport option or gated send mode.
- Production: Gmail SMTP with app password and rate-limited batch send.

## Related Diagrams

- docs/diagrams/sequences/contact_submission_email_delivery_sequence.mmd
- docs/diagrams/sequences/publish_newsletter_broadcast_sequence.mmd
- docs/diagrams/sequences/home_contact_inquiry_sequence.mmd
- docs/diagrams/sequences/dashboard_blogs_crud_sequence.mmd
