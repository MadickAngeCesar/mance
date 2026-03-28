# Sequence Diagram Coverage Matrix

This document maps planned frontend-backend interactions to sequence diagrams, based on the portfolio checklist and the current pages/components.

## Public Pages

- Home contact form: components/home/contact.tsx
  - Diagram: docs/diagrams/sequences/home_contact_inquiry_sequence.mmd
  - Planned backend: /api/messages

- Contact submission email delivery (admin notification + visitor acknowledgment): components/home/contact.tsx
  - Diagram: docs/diagrams/sequences/contact_submission_email_delivery_sequence.mmd
  - Planned backend: /api/messages with Nodemailer over Gmail SMTP

- Lab newsletter signup: components/lab/news_letter.tsx
  - Diagram: docs/diagrams/sequences/newsletter_subscription_sequence.mmd
  - Planned backend: /api/subscribers

- Lab listing, search, filter, pagination: components/lab/lab_list.tsx
  - Diagram: docs/diagrams/sequences/lab_listing_discovery_sequence.mmd
  - Planned backend: /api/blogs and /api/projects

- Lab detail by slug and view tracking: app/(public)/lab/[slug]/page.tsx
  - Diagram: docs/diagrams/sequences/lab_detail_view_tracking_sequence.mmd
  - Planned backend: /api/blogs/:slug, /api/projects/:slug, /api/overview/views

- Services booking call-to-action and intake routing: components/services/booking_cta.tsx
  - Diagram: docs/diagrams/sequences/services_booking_intake_sequence.mmd
  - Planned backend: /api/messages

- Sign in flow (JWT + bcrypt target architecture): app/(public)/sign-in/page.tsx and components/public/login_form.tsx
  - Diagram: docs/diagrams/sequences/auth_sign_in_sequence.mmd
  - Planned backend: /api/auth/sign-in

## Dashboard Pages

- Overview metrics and snapshots: app/dashboard/(overview)/page.tsx
  - Diagram: docs/diagrams/sequences/dashboard_overview_metrics_sequence.mmd
  - Planned backend: /api/overview

- Blog article management (create/edit/delete/list): app/dashboard/blogs/page.tsx and components/dashboard/article_form.tsx
  - Diagram: docs/diagrams/sequences/dashboard_blogs_crud_sequence.mmd
  - Planned backend: /api/blogs

- Publish-triggered newsletter broadcast for new article/blog/project: app/dashboard/blogs/page.tsx and app/dashboard/projects/page.tsx
  - Diagram: docs/diagrams/sequences/publish_newsletter_broadcast_sequence.mmd
  - Planned backend: /api/subscribers/campaigns with Nodemailer over Gmail SMTP

- Project management (create/edit/delete/list): app/dashboard/projects/page.tsx and components/dashboard/project_form.tsx
  - Diagram: docs/diagrams/sequences/dashboard_projects_crud_sequence.mmd
  - Planned backend: /api/projects

- Services and testimonials management: app/dashboard/services/page.tsx
  - Diagram: docs/diagrams/sequences/dashboard_services_crud_sequence.mmd
  - Planned backend: /api/services

- Subscribers operations (list/search/delete): app/dashboard/subscribers/page.tsx and components/dashboard/subscribers_list.tsx
  - Diagram: docs/diagrams/sequences/dashboard_subscribers_management_sequence.mmd
  - Planned backend: /api/subscribers

- Profile and settings update flow: app/dashboard/settings/page.tsx and components/dashboard/profile_form.tsx
  - Diagram: docs/diagrams/sequences/dashboard_settings_profile_update_sequence.mmd
  - Planned backend: /api/profile and /api/settings

- Message inbox triage (search/filter/mark read): app/dashboard/messages/page.tsx and components/dashboard/message_list.tsx
  - Diagram: docs/diagrams/sequences/dashboard_messages_triage_sequence.mmd
  - Planned backend: /api/messages

## Existing Cross-Flow Diagram

- Contact to message and subscriber conversion (already present)
  - Diagram: docs/diagrams/contact_message_sequence.mmd

## Notes

- Current app uses placeholder data in many components. These diagrams define the target interaction contracts for the upcoming API implementation.
- Keep endpoint names synchronized with final route handlers under app/api/* during backend implementation.
