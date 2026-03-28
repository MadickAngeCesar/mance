# MAC TECH Portfolio - Implementation Roadmap

This roadmap defines the execution path from current state to production-ready completion.

## Current State (Baseline)

- Frontend pages and dashboard UI are implemented with placeholder-driven data.
- Prisma schema and seed script are implemented.
- Database schema has been applied via `prisma db push` and seeded.
- Sequence, architecture, and ER diagrams are documented.
- Email flow design is documented for Nodemailer + Gmail SMTP.

## Completion Definition

The project is complete when all items below are true:

- Every dashboard/public feature reads and writes real PostgreSQL data.
- Auth is fully implemented with JWT + bcrypt and role/session guards.
- Contact and newsletter email workflows are live with delivery tracking.
- Dashboard CRUD is fully functional for blogs, projects, services, settings, messages, and subscribers.
- Tests (unit + integration + smoke) pass in CI.
- Production deployment and observability are in place.

## Phase Plan

## Phase 1 - Data and Prisma Stabilization

Goal: lock schema evolution, clean migration workflow, and standardize DB access.

Tasks:
- Add `lib/prisma.ts` (singleton Prisma client factory with adapter setup).
- Replace any remaining placeholder-only reads in server layers with Prisma queries.
- Configure reliable migration workflow for local dev:
  - Option A: keep `db push` in local and create SQL snapshots for releases.
  - Option B: fix local postgres runtime and switch back to `migrate dev`.
- Create seed idempotency check and optional partial seed mode (`--only core`).

Deliverables:
- Shared Prisma client module.
- Confirmed migration strategy documented in repo.
- Seed command stable and repeatable.

Exit Criteria:
- `pnpm prisma:generate` passes.
- `pnpm prisma:seed` passes repeatedly.
- DB reset and reseed can be done in less than 5 minutes.

## Phase 2 - API Foundation by Domain

Goal: implement all route handlers mapped in sequence diagrams.

Tasks:
- Implement typed route handlers under `app/api/*` for:
  - `messages`
  - `subscribers`
  - `blogs`
  - `projects`
  - `services`
  - `profile`
  - `settings`
  - `overview`
  - `auth`
- Add Zod request/response contracts in `lib/actions.ts` or `lib/validators/*`.
- Add consistent API response format (`ok`, `data`, `error`, `meta`).

Deliverables:
- Working CRUD and list endpoints for all dashboard domains.
- Validation and error handling standard applied to all endpoints.

Exit Criteria:
- Manual API smoke test pass for all endpoints.
- No UI flow depends on hardcoded placeholder reads for mutable domains.

## Phase 3 - Frontend Data Wiring

Goal: connect existing UI components to live APIs without regressions.

Tasks:
- Replace read/write flows in:
  - `components/dashboard/*form.tsx`
  - `components/dashboard/*list*.tsx`
  - `components/home/contact.tsx`
  - `components/lab/news_letter.tsx`
  - `components/lab/lab_list.tsx`
- Add loading, empty, and error states for each async data path.
- Introduce optimistic update where useful (message read status, subscriber delete).

Deliverables:
- Fully connected dashboard and public submission flows.
- UX states for slow/failing requests.

Exit Criteria:
- Core journeys complete with real data:
  - publish blog/project
  - submit contact form
  - subscribe newsletter
  - manage subscribers/messages

## Phase 4 - Authentication and Authorization

Goal: secure admin routes and API operations.

Tasks:
- Implement `POST /api/auth/sign-in`, `/refresh`, `/logout`.
- Add password hashing and verification via `bcryptjs`.
- Add JWT issuance/refresh with `jose`.
- Add server-side auth guard for `/dashboard/*` and sensitive APIs.
- Add auth event logging to `AuthEvent`.

Deliverables:
- Real sign-in flow (replacing demo credentials logic).
- Protected dashboard and API endpoints.

Exit Criteria:
- Unauthenticated user cannot access dashboard APIs.
- Token refresh and logout behavior match auth sequence diagram.

## Phase 5 - Email Workflows (Nodemailer + Gmail SMTP)

Goal: production-grade transactional and campaign email flows.

Tasks:
- Implement reusable mail service module with Nodemailer transport.
- Implement contact email fanout:
  - admin notification
  - visitor acknowledgment
- Implement publish-triggered newsletter campaign:
  - campaign creation
  - batch delivery
  - delivery status updates in `SubscriberCampaignDelivery`
- Add retry/backoff and idempotency protections.

Deliverables:
- Working Gmail SMTP integration with env config.
- Persisted delivery records and campaign status updates.

Exit Criteria:
- Contact form sends both email types reliably.
- Publishing new content can trigger campaign to active subscribers.

## Phase 6 - Quality, Testing, and Hardening

Goal: prevent regressions and prepare for release.

Tasks:
- Add test setup for:
  - unit tests (validators, utility functions)
  - integration tests (API routes with test DB)
  - smoke tests for critical user paths
- Add lint/typecheck/test scripts and CI pipeline.
- Add rate limiting and abuse protection for public forms.
- Add structured logging and error boundaries.

Deliverables:
- CI workflow with required checks.
- Test coverage for business-critical paths.

Exit Criteria:
- CI green on every PR.
- Critical path tests stable.

## Phase 7 - Deployment and Operations

Goal: production rollout with monitoring and rollback safety.

Tasks:
- Prepare environment docs for production secrets.
- Configure deployment target and migration runbook.
- Add monitoring dashboards:
  - API error rate
  - email delivery success/failure
  - DB health
- Finalize backup and restore process.

Deliverables:
- Deployment checklist and runbook.
- Production observability baseline.

Exit Criteria:
- Successful staging to production promotion.
- Post-deploy verification checklist completed.

## Sequenced Sprint Plan

## Sprint A (Now)

- Phase 1 completion.
- Core APIs: `messages`, `subscribers`, `blogs`, `projects`.
- Wire contact form and newsletter form to live APIs.

## Sprint B

- Remaining APIs: `services`, `profile`, `settings`, `overview`, `auth`.
- Dashboard forms/lists fully connected.
- Auth guard enforcement.

## Sprint C

- Email campaign and delivery tracking end-to-end.
- Test automation and CI stabilization.
- Pre-production hardening.

## Task Board Template

Use these statuses per item:

- `todo`
- `in-progress`
- `blocked`
- `review`
- `done`

Suggested board columns:

- Backend API
- Frontend Integration
- Auth and Security
- Email and Campaigns
- Testing and QA
- Deployment

## Risks and Mitigations

- Prisma migration instability in local runtime:
  - Mitigation: decide one canonical local DB strategy and document it.
- Gmail SMTP rate limits:
  - Mitigation: batch and retry strategy with campaign status tracking.
- UI regressions during data wiring:
  - Mitigation: add smoke tests before replacing placeholder usage.

## Operational Commands

- Generate client: `pnpm prisma:generate`
- Apply schema (current fallback): `pnpm prisma db push --accept-data-loss`
- Seed data: `pnpm prisma:seed`
- Start app: `pnpm dev`

## Tracking Links

- ER diagram: `docs/diagrams/entity_relationship.mmd`
- Architecture diagram: `docs/diagrams/platform_architecture.mmd`
- Sequence coverage matrix: `docs/diagrams/sequence_coverage.md`
- Email stages: `docs/email_delivery_stages.md`
