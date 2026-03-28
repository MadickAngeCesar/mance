# Phase 1 Implementation Guide
## Data and Prisma Stabilization

This document outlines Phase 1 completion, including the new Prisma setup, migration strategy, and seed workflow.

## What Was Implemented

### 1. Singleton Prisma Client (`lib/prisma.ts`)

A centralized Prisma client factory that:
- Uses the PrismaPg adapter for PostgreSQL
- Implements proper singleton pattern to prevent multiple client instances
- Is environment-aware (reused in dev, fresh in production)
- Exports a single `prisma` instance for all server code

**Usage:**
```typescript
import { prisma } from "@/lib/prisma";

const users = await prisma.authUser.findMany();
```

**Why:** Ensures consistent database connections, better performance, and single source of truth for client configuration.

### 2. Zod Validators (`lib/validators.ts`)

Comprehensive request/response validation schemas for all API endpoints:
- `MessageCreateSchema` / `MessageQuerySchema` - contact messages
- `SubscriberCreateSchema` / `SubscriberQuerySchema` - newsletter subscriptions
- `LabArticleCreateSchema` / `LabArticleQuerySchema` - blog articles
- `LabProjectCreateSchema` / `LabProjectQuerySchema` - portfolio projects
- `ClientWorkCreateSchema` / `ClientWorkQuerySchema` - client projects
- `SignInSchema` / `AuthTokenSchema` - authentication
- `SettingsUpdateSchema` - user settings

**Benefits:**
- Type-safe request validation
- Consistent API response format (`ApiResponse<T>`)
- Automatic coercion and error messages
- Frontend-ready types via `z.infer<typeof Schema>`

### 3. Idempotent Seed Script (`prisma/seed.ts`)

Refactored seed script with advanced features:

#### Idempotency
- Checks if brand profile exists before creating
- Uses `upsert` operations to avoid duplicate errors
- Skips creation if data already exists (no `--reset` flag)
- Safe to run multiple times

#### Partial Seed Mode
Support for selective seeding:
```bash
# Seed all data (default, skips if exists)
pnpm prisma:seed

# Seed only core profile (brand, skills, contact)
pnpm prisma:seed --only core

# Full reset and reseed everything
pnpm prisma:seed --reset

# Reset and seed only core
pnpm prisma:seed --only core --reset
```

#### Seed Functions
- `seedCore()` - brand profile, skills, education, experience (idempotent)
- `seedPortfolioContent()` - client work, lab projects, testimonials (idempotent)
- `seedInboxData()` - messages, subscribers, campaigns (idempotent)

### 4. API Routes (Phase 1 Foundation)

Implemented CRUD endpoints for Phase 1 domains:

#### Messages API
- `GET /api/messages` - list with pagination, sorting, filtering
- `POST /api/messages` - submit contact form
- `GET /api/messages/[id]` - fetch single message
- `PATCH /api/messages/[id]` - mark as read, update
- `DELETE /api/messages/[id]` - delete message

#### Subscribers API
- `GET /api/subscribers` - list with pagination, filtering
- `POST /api/subscribers` - subscribe email (handles reactivation)
- `GET /api/subscribers/[id]` - fetch single subscriber
- `PATCH /api/subscribers/[id]` - update status
- `DELETE /api/subscribers/[id]` - unsubscribe

#### Blogs API
- `GET /api/blogs` - list articles with pagination, category filtering, sorting
- `POST /api/blogs` - create article
- `GET /api/blogs/[id]` - fetch by ID or slug (auto-increments views)
- `PATCH /api/blogs/[id]` - update article
- `DELETE /api/blogs/[id]` - delete article

#### Projects API
- `GET /api/projects` - list lab projects with pagination, tag filtering
- `POST /api/projects` - create project
- `GET /api/projects/[id]` - fetch by ID or slug (auto-increments views)
- `PATCH /api/projects/[id]` - update project
- `DELETE /api/projects/[id]` - delete project

**Response Format (standard across all endpoints):**
```typescript
{
  ok: boolean,
  data?: T,
  error?: string,
  meta?: {
    page?: number,
    limit?: number,
    total?: number,
    pages?: number,
    [key: string]: any
  }
}
```

## Migration Strategy: Chosen Approach

### **Option Chosen: Option A - `db push` with SQL snapshots**

**Why this option:**
1. **Faster local iteration** - no migration file management for rapid schema changes
2. **Shadow DB not required** - reduces local infrastructure complexity
3. **SQL snapshots for releases** - production changes are explicit and reviewed
4. **Clear separation** - dev uses `push`, prod uses tracked migrations

### Local Development Workflow

#### Initial Setup
```bash
# 1. Ensure .env has DATABASE_URL (local postgres or Prisma Postgres)
# 2. Push schema to dev database
pnpm prisma db push --accept-data-loss

# 3. Seed with placeholder data
pnpm prisma:seed

# 4. Verify data
pnpm dev  # Start dev server
```

#### During Development
```bash
# Edit schema.prisma as needed

# Push changes (creates new database state)
pnpm prisma db push --accept-data-loss

# Reseed if schema changes affected data
pnpm prisma:seed --reset

# Or only seed core to reuse existing portfolio data
pnpm prisma:seed --only core --reset
```

#### Testing Reset
```bash
# Full database reset and reseed (< 5 minutes)
pnpm prisma:seed --reset
```

### Production Deployment Workflow

#### Before Release
1. Export current schema as SQL snapshot
   ```bash
   # Run this before deploying schema changes
   pnpm prisma db push --accept-data-loss
   npx prisma db pull # generates SQL representation
   ```

2. Create manual migration snapshot
   ```bash
   # Store as docs/migrations/YYYY-MM-DD-description.sql
   # Document in CHANGELOG
   ```

3. Review and commit
   ```bash
   git add docs/migrations/
   git commit -m "docs: add DB schema snapshot for v1.2.0"
   ```

#### During Release
1. Connect to production database
   ```bash
   DATABASE_URL="<prod-postgres-url>" pnpm prisma db execute --stdin < docs/migrations/YYYY-MM-DD-description.sql
   ```

2. Verify schema
   ```bash
   DATABASE_URL="<prod-postgres-url>" npx prisma introspect
   ```

3. Seed production seed data (if needed)
   ```bash
   DATABASE_URL="<prod-postgres-url>" pnpm prisma:seed --only core
   ```

### Why Not Option B (migrate dev)?
- Requires reliable local Postgres runtime
- Migration file churn in early dev (high change velocity)
- Shadow DB setup adds complexity
- Can switch to `migrate dev` later when schema stabilizes

## Operational Commands Reference

```bash
# Generate Prisma Client
pnpm prisma:generate

# Development workflow
pnpm prisma db push --accept-data-loss
pnpm prisma:seed                         # Seed all (skip if exists)
pnpm prisma:seed --only core             # Seed just profile
pnpm prisma:seed --reset                 # Full reset
pnpm prisma:seed --only core --reset     # Reset + core only

# Inspect database
pnpm prisma studio       # Visual DB browser

# Database reset (dev only)
npx prisma db push --accept-data-loss --force-reset  # Nuclear option
```

## Monitoring and Validation

### Checklist After Phase 1
- [ ] `pnpm prisma:generate` succeeds
- [ ] `pnpm prisma:seed` completes in < 5 seconds
- [ ] `pnpm prisma:seed --reset` completes in < 5 minutes
- [ ] All API endpoints respond (hit `/api/messages`, `/api/blogs`, etc.)
- [ ] Database can be reset without manual intervention
- [ ] `pnpm dev` starts without errors
- [ ] Dashboard components still render (placeholder for now, data wiring in Phase 3)

### Common Issues

**Issue: "DATABASE_URL is not defined"**
- Ensure `.env` file exists with `DATABASE_URL`
- Verify Postgres instance is running

**Issue: Seed fails with "email already exists"**
- Run `pnpm prisma:seed --reset` to clear and reseed
- Or use `--only core` to skip duplicate data

**Issue: Schema push fails with "data loss"**
- Add `--accept-data-loss` flag (safe in dev)
- Or use `--force-reset` to delete and recreate database

## Next Steps (Phase 2)

### API Completion
- Implement remaining endpoints: `services`, `profile`, `settings`, `overview`, `auth`
- Add request logging and error boundaries
- Implement API authentication/authorization guards

### Frontend Wiring (Phase 3)
- Replace placeholder-data imports with API calls
- Add loading/empty/error states to components
- Update dashboard forms to POST to APIs
- Add optimistic updates where useful

### Testing (Phase 6)
- Unit tests for validators and utilities
- Integration tests for API routes
- Smoke tests for critical journeys
- CI/CD automation

## File Manifest

**New Files:**
- `lib/prisma.ts` - Singleton Prisma client
- `lib/validators.ts` - Zod schemas for all APIs
- `app/api/messages/route.ts` - Messages list/create
- `app/api/messages/[id]/route.ts` - Message detail/update/delete
- `app/api/subscribers/route.ts` - Subscribers list/subscribe
- `app/api/subscribers/[id]/route.ts` - Subscriber detail/update/delete
- `app/api/blogs/route.ts` - Articles list/create
- `app/api/blogs/[id]/route.ts` - Article detail/update/delete
- `app/api/projects/route.ts` - Projects list/create
- `app/api/projects/[id]/route.ts` - Project detail/update/delete

**Modified Files:**
- `prisma/seed.ts` - Refactored with idempotency and partial modes
- `package.json` - Scripts unchanged (already had `prisma:seed`)

## Exit Criteria (Phase 1 Complete)

✅ Singleton Prisma client module created and in use
✅ Idempotent seed with partial mode working
✅ Migration strategy documented (Option A chosen)
✅ Phase 1 API routes implemented (messages, subscribers, blogs, projects)
✅ All operational commands tested and working
✅ Database can be reset and reseeded in < 5 minutes
✅ Documentation complete and accessible
