# Phase 2 Implementation Guide
## API Foundation by Domain

This document outlines Phase 2 completion, including all API routes, authentication, error handling, and request logging.

## What Was Implemented

### 1. Request Logging and Error Handling (`lib/api-utils.ts`)

**Unified Error Handling:**
- `ApiError` class with structured error types
- Built-in status codes (404, 401, 403, 409, 400, 422)
- Automatic error logging and response formatting

**Request Logging:**
- `logRequest()` - logs method, path, status, duration
- `createApiHandler()` - wraps routes with auto-logging and error boundaries
- Console output format: `[timestamp] METHOD PATH STATUS DUMs`

**Example usage:**
```typescript
export const GET = createApiHandler(handleGet);
```

### 2. Authentication System (`lib/auth.ts`)

**Utilities:**
- `hashPassword()` / `verifyPassword()` - bcryptjs password management
- `generateAccessToken()` - JWT access tokens (24h expiration)
- `generateRefreshToken()` - JWT refresh tokens (7d expiration)
- `verifyToken()` - JWT validation and decoding
- `extractTokenFromRequest()` - Bearer token extraction
- `requireAuth()` - auth guard middleware
- `requireRole()` - role-based access control (RBAC)
- `createAuthenticatedApiHandler()` - type-safe authenticated route wrapper

**JWT Configuration:**
- Algorithm: HS256
- Secret: `process.env.JWT_SECRET` (set in .env!)
- Access token: 24 hours
- Refresh token: 7 days

### 3. Complete Validator Schemas (`lib/validators.ts`)

All request/response schemas with Zod:

**Messages:**
- `MessageCreateSchema` - submit contact form
- `MessageUpdateSchema` - update message status
- `MessageQuerySchema` - list with pagination & filtering

**Subscribers:**
- `SubscriberCreateSchema` - subscribe email
- `SubscriberUpdateSchema` - update subscription
- `SubscriberQuerySchema` - list with active filter

**Blogs (Lab Articles):**
- `LabArticleCreateSchema` - create article
- `LabArticleUpdateSchema` - update article
- `LabArticleQuerySchema` - list with category, featured, publish filters

**Projects (Lab Projects):**
- `LabProjectCreateSchema` - create project
- `LabProjectUpdateSchema` - update project
- `LabProjectQuerySchema` - list with tag, featured filters

**Services/Offerings:**
- `ServiceCreateSchema` - create service
- `ServiceUpdateSchema` - update service
- `ServiceQuerySchema` - list with pagination

**Profile/Brand:**
- `BrandProfileUpdateSchema` - update brand info
- `AboutSummaryUpdateSchema` - update bio and interests
- `ContactDetailsUpdateSchema` - update contact info

**Overview/Stats:**
- `OverviewStatsSchema` - dashboard stats (admin only)

**Authentication:**
- `AuthSignInSchema` - email + password + remember me
- `AuthRefreshSchema` - refresh token input
- `AuthTokenSchema` - JWT token response
- `AuthUserResponseSchema` - user info response

### 4. Complete Phase 2 API Routes

#### Messages API (Fully Implemented)
```
GET    /api/messages              - List with pagination, sort, read filter
POST   /api/messages              - Create from contact form
GET    /api/messages/[id]         - Fetch single message
PATCH  /api/messages/[id]         - Mark as read, update
DELETE /api/messages/[id]         - Delete message
```

#### Subscribers API (Fully Implemented)
```
GET    /api/subscribers           - List with active filter
POST   /api/subscribers           - Subscribe (handles reactivation)
GET    /api/subscribers/[id]      - Fetch with campaign deliveries
PATCH  /api/subscribers/[id]      - Update active status
DELETE /api/subscribers/[id]      - Unsubscribe
```

#### Blogs API (Fully Implemented)
```
GET    /api/blogs                 - List with category, featured, sort filters
POST   /api/blogs                 - Create article
GET    /api/blogs/[id]            - By ID or slug, auto-increments views
PATCH  /api/blogs/[id]            - Update article
DELETE /api/blogs/[id]            - Delete article
```

#### Projects API (Fully Implemented)
```
GET    /api/projects              - List with tag, featured, sort filters
POST   /api/projects              - Create project
GET    /api/projects/[id]         - By ID or slug, auto-increments views
PATCH  /api/projects/[id]         - Update project
DELETE /api/projects/[id]         - Delete project
```

#### Services API (NEW - Phase 2)
```
GET    /api/services              - List offerings
POST   /api/services              - Create service (admin only)
GET    /api/services/[id]         - Fetch service
PATCH  /api/services/[id]         - Update (admin only)
DELETE /api/services/[id]         - Delete (admin only)
```

#### Profile API (NEW - Phase 2)
```
GET    /api/profile               - Get brand profile + about + contact
PATCH  /api/profile               - Update profile sections (admin only)
```

#### Settings API (NEW - Phase 2)
```
GET    /api/settings              - Get current user settings (authenticated)
PATCH  /api/settings              - Update password/email (authenticated)
```

#### Overview API (NEW - Phase 2)
```
GET    /api/overview              - Dashboard stats (admin only)
```

#### Auth API (NEW - Phase 2)
```
POST   /api/auth/sign-in          - Authenticate and get tokens
POST   /api/auth/refresh          - Refresh access token
POST   /api/auth/logout           - Log out (logs event)
```

### 5. Standard API Response Format

All endpoints return consistent response:
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

**Example Success (200):**
```json
{
  "ok": true,
  "data": [
    { "id": "msg-1", "subject": "Hello", ... }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

**Example Error (400):**
```json
{
  "ok": false,
  "error": "Invalid email address"
}
```

### 6. Authentication Workflow

#### Sign In Flow
```bash
POST /api/auth/sign-in
{
  "email": "admin@mance.dev",
  "password": "password123",
  "rememberMe": true
}

# Response (200)
{
  "ok": true,
  "data": {
    "token": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 86400,
      "tokenType": "Bearer"
    },
    "user": {
      "id": "user-1",
      "email": "admin@mance.dev",
      "displayName": "Admin",
      "role": "admin",
      "isActive": true
    }
  }
}
```

#### Using Access Token
```bash
GET /api/settings
Authorization: Bearer eyJ...
```

#### Refresh Token
```bash
POST /api/auth/refresh
{
  "refreshToken": "eyJ..."
}

# Response (200) - new tokens issued
{
  "ok": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 86400,
    "tokenType": "Bearer"
  }
}
```

#### Sign Out
```bash
POST /api/auth/logout
Authorization: Bearer eyJ...

# Response (200) - logs auth event, token cleanup on client
{
  "ok": true,
  "data": { "message": "Logged out successfully" }
}
```

### 7. Authorization Guards

**Unauthenticated Endpoints (public):**
- POST /api/messages (submit contact)
- POST /api/subscribers (subscribe)
- GET /api/blogs
- GET /api/blogs/[id]
- GET /api/projects
- GET /api/projects/[id]
- GET /api/services
- GET /api/profile
- POST /api/auth/sign-in
- POST /api/auth/refresh

**Authenticated Endpoints (any logged-in user):**
- GET /api/settings
- PATCH /api/settings
- POST /api/auth/logout

**Admin-Only Endpoints:**
- GET /api/messages
- PATCH /api/messages/[id]
- DELETE /api/messages/[id]
- GET /api/subscribers
- PATCH /api/subscribers/[id]
- DELETE /api/subscribers/[id]
- POST /api/blogs
- PATCH /api/blogs/[id]
- DELETE /api/blogs/[id]
- POST /api/projects
- PATCH /api/projects/[id]
- DELETE /api/projects/[id]
- POST /api/services
- PATCH /api/services/[id]
- DELETE /api/services/[id]
- PATCH /api/profile
- GET /api/overview

## Setup Instructions

### 1. Environment Variables
Add to `.env`:
```bash
# Auth
JWT_SECRET="your-super-secret-key-change-this-in-production"
```

### 2. Pre-seed Admin User
The seed script creates a default admin user:
```
email: admin@mance.dev
password: (not hashed in seed, set via API)
role: admin
```

> ⚠️ **Important:** Change the default password after first login!

To set password programmatically:
```bash
pnpm prisma studio

# Update AuthUser record directly with hashed password
# Or use settings API after signing in
```

### 3. Testing Authentication

**Get Access Token:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mance.dev",
    "password": "your-password",
    "rememberMe": true
  }'
```

**Use Token in Protected Route:**
```bash
curl http://localhost:3000/api/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Handling Guarantees

All API routes include:
- ✅ Try-catch wrapping with error logging
- ✅ Validation error messages from Zod
- ✅ HTTP status codes matching error types
- ✅ Structured error response format
- ✅ Request logging (method, path, status, duration)
- ✅ Authentication guard enforcement

## File Manifest - Phase 2

**New/Modified Library Files:**
- `lib/api-utils.ts` - Error handling & request logging
- `lib/auth.ts` - JWT, password hashing, auth guards
- `lib/validators.ts` - All Zod schemas (expanded)

**New API Routes:**
- `app/api/services/route.ts` - Services list/create
- `app/api/services/[id]/route.ts` - Service detail/update/delete
- `app/api/profile/route.ts` - Brand profile get/update
- `app/api/settings/route.ts` - User settings get/update
- `app/api/overview/route.ts` - Dashboard stats (admin)
- `app/api/auth/sign-in/route.ts` - Sign in
- `app/api/auth/refresh/route.ts` - Token refresh
- `app/api/auth/logout/route.ts` - Sign out

**Updated API Routes (refactored with error handling):**
- `app/api/messages/route.ts`
- `app/api/messages/[id]/route.ts`
- `app/api/subscribers/route.ts`
- `app/api/subscribers/[id]/route.ts`
- `app/api/blogs/route.ts`
- `app/api/blogs/[id]/route.ts`
- `app/api/projects/route.ts`
- `app/api/projects/[id]/route.ts`

## Exit Criteria (Phase 2 Complete) ✅

- [x] All 9 domain APIs fully implemented with CRUD
- [x] Consistent API response format across all endpoints
- [x] Request logging with method, path, status, duration
- [x] Error boundaries with structured error handling
- [x] Authentication (sign-in, refresh, logout)
- [x] Authorization guards (admin, authenticated, public)
- [x] Zod validators for all request/response schemas
- [x] JWT tokens (access + refresh)
- [x] Password hashing with bcryptjs
- [x] Database event logging for auth events

## Next Steps: Phase 3

### Frontend Data Wiring
- Replace placeholder imports with API calls in components
- Add loading, error, empty states
- Implement optimistic updates
- Update all dashboard and public forms

### Components to Update
- `components/dashboard/article_form.tsx` → POST /api/blogs
- `components/dashboard/article_list.tsx` → GET /api/blogs
- `components/dashboard/message_list.tsx` → GET /api/messages
- `components/home/contact.tsx` → POST /api/messages
- `components/lab/news_letter.tsx` → POST /api/subscribers
- All form components → use API validators

## Production Checklist

- [ ] Set `JWT_SECRET` to strong random value
- [ ] Set initial admin password
- [ ] Configure rate limiting on public endpoints
- [ ] Add API request logging to external service
- [ ] Set up monitoring for 5xx errors
- [ ] Document API in OpenAPI/Swagger
- [ ] Add API versioning strategy
- [ ] Test all auth flows end-to-end
- [ ] Review all error messages for info leaks
