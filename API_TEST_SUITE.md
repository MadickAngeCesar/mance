# API Test Suite & Verification

**Date:** March 28, 2026  
**Status:** Ready for Testing

---

## Overview

This document provides comprehensive tests for all 12 API sequences to verify:
1. ✅ All endpoints respond correctly
2. ✅ Authentication & authorization work
3. ✅ Data is persisted correctly
4. ✅ Fixes applied work as expected
5. ✅ Error handling is robust

---

## Test Environment Setup

### Requirements:
- Database with seed data
- Environment variables configured (.env)
- API server running on `localhost:3000`
- Admin credentials for testing

### Before Starting:
```bash
# Ensure database is migrated
pnpm prisma migrate dev

# Start development server
pnpm dev

# Server should be running at http://localhost:3000
```

---

## Test Cases by Feature

### ✅ 1. Authentication Flow Tests

#### Test 1.1: Sign In with Valid Credentials
```
Method: POST
URL: http://localhost:3000/api/auth/sign-in
Body: {
  "email": "admin@example.com",
  "password": "your-password",
  "rememberMe": false
}

Expected Response:
- Status: 200 OK
- Cookie: access_token (httpOnly, secure)
- Body: {
    "ok": true,
    "data": {
      "token": { "accessToken", "tokenType": "Bearer", "expiresIn": 86400 },
      "user": { "id", "email", "displayName", "role": "admin", ... }
    }
  }
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] `access_token` cookie is set
- [ ] Response includes user data
- [ ] Role is "admin"
- [ ] Expires in 24 hours (86400 seconds)

---

#### Test 1.2: Sign In with Invalid Credentials
```
Method: POST
URL: http://localhost:3000/api/auth/sign-in
Body: {
  "email": "admin@example.com",
  "password": "wrong-password"
}

Expected Response:
- Status: 401 Unauthorized
- Body: {"ok": false, "error": "Invalid email or password"}
```

**Verification Steps:**
- [ ] Response status is 401
- [ ] Error message is "Invalid email or password"
- [ ] No cookie is set

---

#### Test 1.3: Refresh Token with rememberMe=true
```
Method: POST
URL: http://localhost:3000/api/auth/sign-in
Body: {
  "email": "admin@example.com",
  "password": "your-password",
  "rememberMe": true
}

Expected Response:
- Status: 200 OK
- Cookies: access_token (24h) + refresh_token (7d)
- Body includes refreshToken
```

**Verification Steps:**
- [ ] Both access_token and refresh_token cookies are set
- [ ] refresh_token maxAge is 604800 seconds (7 days)

---

### ✅ 2. Blog CRUD Tests (FIXED)

#### Test 2.1: List Public Published Articles
```
Method: GET
URL: http://localhost:3000/api/blogs?published=published&page=1&limit=10
Auth: None (public)

Expected Response:
- Status: 200 OK
- Includes pagination metadata
- Body contains article list
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Response includes `meta` with page, limit, total, pages
- [ ] Articles have publishedAt !== null

---

#### Test 2.2: View Published Article (Public - FIXED)
```
Method: GET
URL: http://localhost:3000/api/blogs/[published-slug]
Auth: None (public)

Expected Response:
- Status: 200 OK
- Body: Article data with views incremented
```

**Verification Steps:**
- [ ] Response status is 200 (no auth required)
- [ ] Article includes publishedAt date
- [ ] Views count incremented

---

#### Test 2.3: View Draft Article (Admin Only - FIXED)
```
Method: GET
URL: http://localhost:3000/api/blogs/[draft-slug]
Auth: Bearer {access_token} or Cookie
Header: Authorization: Bearer {token}

Expected Response:
- Status: 200 OK (with admin token)
- Status: 403 Forbidden (without token or non-admin)
```

**Verification Steps:**
- [ ] Without token: Status is 403
- [ ] With admin token: Status is 200
- [ ] Non-admin user: Status is 403

---

#### Test 2.4: Create Article (Admin Only)
```
Method: POST
URL: http://localhost:3000/api/blogs
Auth: Bearer {access_token} - Admin required
Body: {
  "title": "Test Article",
  "slug": "test-article-001",
  "category": "tech",
  "excerpt": "Test excerpt",
  "content": "<p>Test content</p>",
  "coverImageUrl": "https://example.com/image.jpg",
  "tags": ["test", "api"],
  "featured": false,
  "publishedAt": null
}

Expected Response:
- Status: 201 Created
- Body: Created article object
```

**Verification Steps:**
- [ ] Response status is 201
- [ ] Article is saved to database
- [ ] publishedAt is null (draft)
- [ ] Non-admin gets 403

---

#### Test 2.5: Publish Article (Triggers Newsletter)
```
Method: PATCH
URL: http://localhost:3000/api/blogs/[article-id]
Auth: Bearer {access_token} - Admin required
Body: {
  "publishedAt": "2026-03-28T12:00:00Z"
}

Expected Response:
- Status: 200 OK
- Newsletter campaign triggered
- SubscriberCampaign record created
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Article.publishedAt is set
- [ ] Check database: SubscriberCampaign created with status='QUEUED' or 'SENDING'
- [ ] SubscriberCampaignDelivery records created for active subscribers
- [ ] Emails queued for sending

**Database Check:**
```sql
SELECT * FROM subscriber_campaign 
WHERE content_id = '[article-id]' 
ORDER BY created_at DESC LIMIT 1;
```

---

#### Test 2.6: Delete Article
```
Method: DELETE
URL: http://localhost:3000/api/blogs/[article-id]
Auth: Bearer {access_token} - Admin required

Expected Response:
- Status: 200 OK
- Article deleted from database
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Article no longer exists in database
- [ ] Non-admin gets 403

---

### ✅ 3. Project CRUD Tests (FIXED)

#### Test 3.1: View Published Project (Public - FIXED)
```
Method: GET
URL: http://localhost:3000/api/projects/[published-slug]
Auth: None (public)

Expected Response:
- Status: 200 OK
- Project data
- Views incremented
```

**Verification Steps:**
- [ ] Response status is 200 (no auth needed)
- [ ] Project.publishedAt is set
- [ ] Views incremented

---

#### Test 3.2: View Draft Project (Admin Only - FIXED)
```
Method: GET
URL: http://localhost:3000/api/projects/[draft-slug]
Auth: Bearer {access_token} - Admin required

Expected Response:
- Status: 200 OK (admin) / 403 Forbidden (public)
```

**Verification Steps:**
- [ ] Public user: 403
- [ ] Admin user: 200

---

#### Test 3.3: Create Project
```
Method: POST
URL: http://localhost:3000/api/projects
Auth: Bearer {access_token} - Admin required
Body: {
  "title": "Test Project",
  "slug": "test-project-001",
  "summary": "Project summary",
  "content": "<p>Project details</p>",
  "stack": ["React", "TypeScript"],
  "coverImageUrl": "https://example.com/cover.jpg",
  "tags": ["portfolio"]
}

Expected Response:
- Status: 201 Created
```

**Verification Steps:**
- [ ] Response status is 201
- [ ] Project saved to database

---

#### Test 3.4: Publish Project (Triggers Newsletter)
```
Method: PATCH
URL: http://localhost:3000/api/projects/[project-id]
Auth: Bearer {access_token} - Admin required
Body: {
  "publishedAt": "2026-03-28T12:00:00Z"
}

Expected Response:
- Status: 200 OK
- Newsletter campaign created
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] publishedAt is set
- [ ] SubscriberCampaign created
- [ ] Emails queued for subscribers

---

### ✅ 4. Contact Message Tests

#### Test 4.1: Submit Contact Form (Public)
```
Method: POST
URL: http://localhost:3000/api/messages
Auth: None (public)
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "I'm interested in your services",
  "source": "web"
}

Expected Response:
- Status: 201 Created
- Message persisted
- Admin email sent
- Visitor acknowledgment sent
```

**Verification Steps:**
- [ ] Response status is 201
- [ ] Message record created in database
- [ ] Check admin inbox for notification email
- [ ] Check sender's inbox for acknowledgment email
- [ ] Response includes created message object

**Email Verification:**
- Admin should receive: "New contact message" subject
- Visitor should receive: "We received your message" subject

---

#### Test 4.2: List Messages (Admin Only)
```
Method: GET
URL: http://localhost:3000/api/messages?page=1&limit=10
Auth: Bearer {access_token} - Admin required

Expected Response:
- Status: 200 OK
- List of messages
- Pagination metadata
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Admin can see all messages
- [ ] Public user gets 401/403

---

#### Test 4.3: Mark Message as Read (FIXED)
```
Method: PATCH
URL: http://localhost:3000/api/messages/[message-id]
Auth: Bearer {access_token} - Admin required
Body: {
  "isRead": true
}

Expected Response:
- Status: 200 OK
- Message updated
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Message.isRead is true
- [ ] Only valid fields accepted (isRead, name, email, etc.)
- [ ] Invalid fields rejected

---

#### Test 4.4: Invalid Message Update (FIXED)
```
Method: PATCH
URL: http://localhost:3000/api/messages/[message-id]
Auth: Bearer {access_token} - Admin required
Body: {
  "isRead": true,
  "receivedAt": "2099-01-01T00:00:00Z"
}

Expected Response:
- Status: 200 OK (allows valid fields)
OR
- Status: 400 Bad Request (rejects invalid fields)
```

**Verification Steps:**
- [ ] Validation schema prevents malicious updates
- [ ] Only `name`, `email`, `subject`, `message`, `isRead` allowed
- [ ] Field updates are restricted

---

### ✅ 5. Newsletter Subscription Tests

#### Test 5.1: Subscribe to Newsletter (Public)
```
Method: POST
URL: http://localhost:3000/api/subscribers
Auth: None (public)
Body: {
  "email": "subscriber@example.com",
  "source": "web"
}

Expected Response:
- Status: 201 Created (new subscriber)
```

**Verification Steps:**
- [ ] Response status is 201
- [ ] Subscriber record created
- [ ] Response includes created subscriber object
- [ ] subscribedAt is set

---

#### Test 5.2: Resubscribe (Already Subscribed)
```
Method: POST
URL: http://localhost:3000/api/subscribers
Auth: None (public)
Body: {
  "email": "subscriber@example.com",
  "source": "web"
}

Expected Response:
- Status: 200 OK (already subscribed)
OR
- Status: 409 Conflict (already subscribed)

According to behavior in code: If active, returns 409 Conflict
```

**Verification Steps:**
- [ ] First request: 201 Created
- [ ] Second request: 409 Conflict
- [ ] Active field remains true

---

#### Test 5.3: Reactivate Inactive Subscriber
```
Method: POST
URL: http://localhost:3000/api/subscribers
Auth: None (public)
Body: {
  "email": "inactive@example.com",
  "source": "web"
}

Expected Response:
- Status: 200 OK
- Subscriber reactivated
- Response includes: meta: { reactivated: true }
```

**Verification Steps:**
- [ ] Subscriber.active changed from false to true
- [ ] Response includes reactivated flag
- [ ] subscribedAt not changed

---

#### Test 5.4: List Subscribers (Admin Only)
```
Method: GET
URL: http://localhost:3000/api/subscribers?active=active&page=1&limit=20
Auth: Bearer {access_token} - Admin required

Expected Response:
- Status: 200 OK
- List of active subscribers
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Only active subscribers returned (if filter applied)
- [ ] Pagination metadata included

---

### ✅ 6. Services Management Tests

#### Test 6.1: List Services (Public)
```
Method: GET
URL: http://localhost:3000/api/services?page=1&limit=10
Auth: None (public)

Expected Response:
- Status: 200 OK
- Services list
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Services list returned
- [ ] No auth required

---

#### Test 6.2: Create Service (Admin Only)
```
Method: POST
URL: http://localhost:3000/api/services
Auth: Bearer {access_token} - Admin required
Body: {
  "title": "Web Development",
  "description": "Custom website development",
  "price": 5000,
  "currency": "USD"
}

Expected Response:
- Status: 201 Created
```

**Verification Steps:**
- [ ] Response status is 201
- [ ] Service created
- [ ] Linked to brand profile
- [ ] Non-admin gets 403

---

### ✅ 7. Testimonials Tests

#### Test 7.1: List Testimonials (Public)
```
Method: GET
URL: http://localhost:3000/api/testimonials?limit=50
Auth: None (public)

Expected Response:
- Status: 200 OK
- Testimonials list
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Testimonials returned

---

#### Test 7.2: Create Testimonial (Admin Only)
```
Method: POST
URL: http://localhost:3000/api/testimonials
Auth: Bearer {access_token} - Admin required
Body: {
  "clientName": "Jane Smith",
  "clientRoleCompany": "CEO at TechCorp",
  "text": "Great service!",
  "rating": 5,
  "avatarUrl": "https://example.com/avatar.jpg"
}

Expected Response:
- Status: 201 Created
```

**Verification Steps:**
- [ ] Response status is 201
- [ ] Testimonial created
- [ ] Non-admin gets 403

---

### ✅ 8. Dashboard Profile Tests

#### Test 8.1: Get Brand Profile (Public)
```
Method: GET
URL: http://localhost:3000/api/profile
Auth: None (public)

Expected Response:
- Status: 200 OK
- Brand profile with all related data
- Fallback data if database unavailable
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Includes: aboutSummary, contactDetails, socialLinks, offerings

---

#### Test 8.2: Update Profile (Admin Only)
```
Method: PATCH
URL: http://localhost:3000/api/profile
Auth: Bearer {access_token} - Admin required
Body: {
  "brandProfile": {
    "headline": "Updated headline"
  },
  "aboutSummary": {
    "biography": "New bio"
  }
}

Expected Response:
- Status: 200 OK
- Profile updated
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Profile fields updated
- [ ] Non-admin gets 403

---

### ✅ 9. Dashboard Settings Tests

#### Test 9.1: Get User Settings (Authenticated)
```
Method: GET
URL: http://localhost:3000/api/settings
Auth: Bearer {access_token}

Expected Response:
- Status: 200 OK
- Current user data
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Returns authenticated user's info
- [ ] No auth: 401

---

#### Test 9.2: Update Display Name (Authenticated)
```
Method: PATCH
URL: http://localhost:3000/api/settings
Auth: Bearer {access_token}
Body: {
  "displayName": "New Name"
}

Expected Response:
- Status: 200 OK
- User updated
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] displayName changed
- [ ] No auth: 401

---

#### Test 9.3: Change Password (Authenticated)
```
Method: PATCH
URL: http://localhost:3000/api/settings
Auth: Bearer {access_token}
Body: {
  "currentPassword": "old-password",
  "newPassword": "new-secure-password"
}

Expected Response:
- Status: 200 OK
- Password changed
- Can sign in with new password
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Old password no longer works
- [ ] New password works: Test 1.1 with new password

---

### ✅ 10. Dashboard Overview Tests

#### Test 10.1: Get Dashboard Stats (Admin Only)
```
Method: GET
URL: http://localhost:3000/api/overview
Auth: Bearer {access_token} - Admin required

Expected Response:
- Status: 200 OK
- Stats object:
  {
    "totalMessages": number,
    "unreadMessages": number,
    "totalSubscribers": number,
    "activeSubscribers": number,
    "totalArticles": number,
    "publishedArticles": number,
    "totalProjects": number,
    "publishedProjects": number,
    "totalCampaignsSent": number
  }
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] All stats fields present
- [ ] Stats are integers
- [ ] Non-admin gets 403

---

### ✅ 11. Lab Detail View Tests (FIXED)

#### Test 11.1: View Published Article Detail (Public)
```
Method: GET
URL: http://localhost:3000/api/blogs/[published-article-id]
Auth: None (public)

Expected Response:
- Status: 200 OK
- Article data
- Views incremented
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Article returned
- [ ] views counter increased
- [ ] No auth required

---

#### Test 11.2: View Published Project Detail (Public)
```
Method: GET
URL: http://localhost:3000/api/projects/[published-project-id]
Auth: None (public)

Expected Response:
- Status: 200 OK
- Project data
- Views incremented
```

**Verification Steps:**
- [ ] Response status is 200
- [ ] Project returned
- [ ] views counter increased

---

### ✅ 12. Error Handling Tests

#### Test 12.1: Invalid JSON
```
Method: POST
URL: http://localhost:3000/api/messages
Body: invalid json {

Expected Response:
- Status: 400 Bad Request
```

**Verification Steps:**
- [ ] Response status is 400

---

#### Test 12.2: Missing Required Fields
```
Method: POST
URL: http://localhost:3000/api/subscribers
Body: {
  "email": "incomplete"
}

Expected Response:
- Status: 400 Bad Request
```

**Verification Steps:**
- [ ] Response status is 400
- [ ] Error includes validation details

---

#### Test 12.3: Not Found
```
Method: GET
URL: http://localhost:3000/api/blogs/non-existent-id
Auth: Bearer {token}

Expected Response:
- Status: 404 Not Found
```

**Verification Steps:**
- [ ] Response status is 404
- [ ] Error message: "Article not found"

---

## Test Execution Checklist

### Phase 1: Core Authentication (5 tests)
- [ ] 1.1 - Valid sign-in
- [ ] 1.2 - Invalid credentials
- [ ] 1.3 - Remember me (refresh token)

### Phase 2: Public Content Access (4 tests)
- [ ] 2.1 - List published articles
- [ ] 2.2 - View published article (public)
- [ ] 3.1 - View published project (public)
- [ ] 5.1 - Subscribe to newsletter

### Phase 3: Admin CRUD Operations (8 tests)
- [ ] 2.3 - Draft protection
- [ ] 2.4 - Create article
- [ ] 2.5 - Publish article (newsletter trigger)
- [ ] 3.2 - Draft project protection
- [ ] 3.3 - Create project
- [ ] 3.4 - Publish project (newsletter trigger)
- [ ] 6.2 - Create service
- [ ] 8.2 - Update profile

### Phase 4: Message & Admin Features (6 tests)
- [ ] 4.1 - Submit contact form
- [ ] 4.2 - List messages (admin only)
- [ ] 4.3 - Mark message as read (validation test)
- [ ] 7.2 - Create testimonial
- [ ] 9.2 - Update settings
- [ ] 10.1 - Dashboard stats

### Phase 5: Edge Cases & Security (4 tests)
- [ ] 2.6 - Delete article
- [ ] 5.2 - Duplicate subscription
- [ ] 12.2 - Invalid input validation
- [ ] 12.3 - Not found error

---

## Newsletter Campaign Test (Integration)

### Manual Newsletter Broadcast Test

**Setup:**
1. Create 3+ active subscribers via `POST /api/subscribers`
2. Create a draft article
3. Verify no campaign created

**Test Flow:**
```
1. PATCH /api/blogs/[id] with publishedAt = NOW
   → SubscriberCampaign created with status='QUEUED'
   
2. Check database:
   SELECT * FROM subscriber_campaign 
   WHERE content_id = '[id]' 
   LIMIT 1;
   → status should be 'SENDING' or 'COMPLETED'
   
3. Check SubscriberCampaignDelivery:
   SELECT * FROM subscriber_campaign_delivery 
   WHERE campaign_id = '[campaign-id]';
   → 3 records, all with status='SENT' or 'QUEUED'
   
4. Check email logs:
   → 3 emails queued for sending
   → Each email has valid template with content link
   
5. Monitor SMTP delivery:
   → Emails processed in batches (MAIL_BATCH_SIZE=25)
   → Retries happen with exponential backoff if failed
```

**Expected Results:**
- ✅ Campaign created immediately
- ✅ All subscribers receive email
- ✅ Delivery status tracked
- ✅ Retries work on failure

---

## Performance Tests (Optional)

### Load Test: List Articles
```
Method: GET
URL: http://localhost:3000/api/blogs?page=1&limit=100
Repeat: 10 times concurrently

Expected:
- All responses 200 OK
- Response time < 500ms each
```

### Load Test: Create Message
```
Method: POST
URL: http://localhost:3000/api/messages
Repeat: 50 times sequentially
Body: Different email/name each time

Expected:
- All responses 201 Created
- All messages persisted
- No bottleneck on email sending
```

---

## Summary Checklist

After running all tests, verify:

- [ ] All 12 API sequences working
- [ ] Public articles accessible without auth ✅ FIXED
- [ ] Draft articles protected ✅ FIXED
- [ ] Message validation working ✅ FIXED
- [ ] Newsletter broadcasts sent on publish
- [ ] Admin auth working properly
- [ ] Pagination working
- [ ] Error handling consistent
- [ ] Database operations atomic
- [ ] Email notifications sending
- [ ] View counts incrementing
- [ ] No SQL injection vulnerabilities

---

## Issues Fixed ✅

1. ✅ **Public Article Access** - Articles can now be viewed publicly if published
2. ✅ **Public Project Access** - Projects can now be viewed publicly if published
3. ✅ **Message Validation** - PATCH endpoint now uses MessageUpdateSchema

---

## Next Steps

1. Run full test suite against staging environment
2. Load test newsletter campaign with 1000+ subscribers
3. Test database failover and error messages
4. Security audit of all admin-protected endpoints
5. Performance optimization if needed

