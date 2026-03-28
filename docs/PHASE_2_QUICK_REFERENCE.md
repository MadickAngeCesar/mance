# Phase 2 Quick Reference

## Core Concepts

| Concept | Location | Purpose |
|---------|----------|---------|
| **Centralized Errors** | `lib/api-utils.ts` | ApiError class with factory methods (notFound, unauthorized, etc.) |
| **Auto Logging** | `lib/api-utils.ts` | createApiHandler wraps routes with logging + timing |
| **JWT Auth** | `lib/auth.ts` | generateAccessToken, verifyToken, requireAuth middleware |
| **Validators** | `lib/validators.ts` | Zod schemas for all 9 domains |

## Standard Route Pattern

```typescript
// app/api/[domain]/route.ts
import { createApiHandler, ApiError } from "@/lib/api-utils";
import { requireRole, requireAuth } from "@/lib/auth";
import { 
  DomainCreateSchema, 
  DomainQuerySchema 
} from "@/lib/validators";

async function handleGet(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const validated = DomainQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });
  
  const items = await prisma.domain.findMany({
    skip: (validated.page - 1) * validated.limit,
    take: validated.limit,
  });
  
  return NextResponse.json({ ok: true, data: items, meta: { page: validated.page } });
}

async function handlePost(request: NextRequest) {
  await requireRole(request, "admin"); // If protected
  
  const body = await request.json();
  const validated = DomainCreateSchema.parse(body);
  
  const created = await prisma.domain.create({ data: validated });
  
  return NextResponse.json({ ok: true, data: created }, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
```

## Error Throwing

```typescript
// Automatic response format
throw ApiError.notFound("Message not found");        // 404
throw ApiError.unauthorized("Invalid token");       // 401
throw ApiError.forbidden("Admin access required");   // 403
throw ApiError.conflict("Email already exists");     // 409
throw ApiError.badRequest("Invalid input");         // 400
```

## Authentication in Routes

```typescript
// Required: Bearer token in Authorization header
const user = await requireAuth(request);
// user: { userId: string, email: string, role: "admin"|"user" }

// Optional: Check specific role
await requireRole(request, "admin");
// Throws 403 if user.role !== "admin"
```

## Validation Example

```typescript
// Create schema
const validated = MessageCreateSchema.parse({
  subject: "Hello",
  message: "...",
  email: "user@example.com"
});
// Throws ZodError (caught by createApiHandler) with field details

// Query schema
const query = MessageQuerySchema.parse({
  page: "2",
  limit: "10",
  read: "false" // optional filter
});
```

## API Response Examples

**200 OK (list):**
```json
{
  "ok": true,
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 50, "pages": 5 }
}
```

**201 Created:**
```json
{ "ok": true, "data": { "id": "new-123", ... } }
```

**400 Bad Request (validation):**
```json
{
  "ok": false,
  "error": "Validation error: Invalid email format at path 'email'"
}
```

**401 Unauthorized:**
```json
{ "ok": false, "error": "Missing or invalid token" }
```

**403 Forbidden:**
```json
{ "ok": false, "error": "Admin access required" }
```

**404 Not Found:**
```json
{ "ok": false, "error": "Message not found" }
```

**409 Conflict:**
```json
{ "ok": false, "error": "Email already exists" }
```

**500 Server Error:**
```json
{ "ok": false, "error": "Internal server error" }
```

## Testing with cURL

**Sign In:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mance.dev",
    "password": "password123",
    "rememberMe": true
  }'
```

**Use Token (Protected Route):**
```bash
curl http://localhost:3000/api/overview \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Refresh Token:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJ..."}'
```

**Sign Out:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJ..."
```

## Logging Output

Every request logs to console:
```
[2024-11-20T15:30:45.123Z] GET /api/messages?page=1 200 45ms
[2024-11-20T15:30:46.456Z] POST /api/messages 201 120ms
[2024-11-20T15:30:47.789Z] POST /api/auth/sign-in 200 200ms
[2024-11-20T15:30:48.012Z] GET /api/overview 403 5ms
```

## Domains & Routes Summary

| Domain | Public | Authenticated | Admin |
|--------|--------|---|---|
| **Messages** | POST contact | - | GET, PATCH, DELETE |
| **Subscribers** | POST subscribe | - | GET, PATCH, DELETE |
| **Blogs** | GET list, GET detail | - | POST, PATCH, DELETE |
| **Projects** | GET list, GET detail | - | POST, PATCH, DELETE |
| **Services** | GET list, GET detail | - | POST, PATCH, DELETE |
| **Profile** | GET full profile | - | PATCH sections |
| **Settings** | - | GET, PATCH | - |
| **Overview** | - | - | GET stats |
| **Auth** | POST sign-in, refresh | POST logout | - |

## Debugging Tips

1. **Invalid token error?** Check `JWT_SECRET` in `.env`
2. **CORS issues?** Ensure routes are under `/api/` path
3. **404 on write?** Verify admin role with `GET /api/overview` first
4. **Validation failing?** Use Zod error details in response
5. **Check logs:** Look for `[timestamp] METHOD PATH STATUS DURATIONms`

## Key Files

- **Infrastructure:** `lib/api-utils.ts`, `lib/auth.ts`, `lib/validators.ts`
- **Routes:** `app/api/[domain]/route.ts` and `app/api/[domain]/[id]/route.ts`
- **Configuration:** `.env` (JWT_SECRET), `prisma/schema.prisma`
- **Documentation:** `docs/PHASE_2_COMPLETE.md` (full guide)
