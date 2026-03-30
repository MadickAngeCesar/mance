# Supabase Storage Setup Guide

This guide walks you through setting up Supabase Storage for image uploads in your Mance project.

## Step 1: Create a Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up with your email or GitHub account
3. Create a new project:
   - **Project name:** `mance` (or your preferred name)
   - **Password:** Create a secure password
   - **Region:** Choose closest to your users (e.g., `us-east-1` for North America)
   - **Pricing Plan:** Start with Free (500MB storage, 2GB bandwidth/month)

## Step 2: Get Your API Keys

1. After project creation, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Your will see:
   - **Project URL** (looks like: `https://xxxxxxxxxxx.supabase.co`)
   - **API Keys** section with:
     - **anon (public)** key
     - **service_role (secret)** key

## Step 3: Update Your `.env` File

Edit `.env` and replace the placeholder values with your actual Supabase credentials:

```env
# Supabase (for file storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Important:** Use the **service_role** key (not the anon key) for server-side uploads.

## Step 4: Create Storage Bucket

1. In your Supabase dashboard, click **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Set:
   - **Name:** `uploads`
   - **Privacy:** Public (so CDN can serve images)
   - Check "Confirm I understand..." checkbox
4. Click **Create bucket**

## Step 5: Configure Bucket Permissions

1. Click on the **`uploads`** bucket you just created
2. Go to **Policies** tab
3. Add these policies for public access:

### Permission: SELECT (Read)
- **Everyone** can select objects
- SQL: `true`

### Permission: INSERT (Upload)
- **Authenticated users** can insert
- SQL: `(auth.role() = 'authenticated')`

### Permission: UPDATE (Replace)
- **Authenticated users** can update
- SQL: `(auth.role() = 'authenticated')`

4. Click **Save Policy** for each

## Step 6: Test the Setup

### Test locally:
```bash
pnpm dev
```

1. Go to `http://localhost:3000/dashboard` (sign in first)
2. Create a new project and upload a screenshot
3. Should see success message with uploaded URL
4. Visit the URL in browser - image should load

### Expected URL format:
```
https://your-project-id.supabase.co/storage/v1/object/public/uploads/project-screenshot/1711846200000-abc123.jpg
```

## Step 7: Verify in Supabase Dashboard

1. Go to Supabase **Storage** > **uploads** bucket
2. Should see your uploaded images organized by kind:
   - `project-cover/` — Project cover images
   - `project-screenshot/` — Project screenshots
   - `article-cover/` — Article cover images
   - etc.

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env` file has both:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Restart dev server: `pnpm dev`

### Error: "Failed to upload file"
- Check bucket permissions (Step 5)
- Verify bucket name is `uploads` (case-sensitive)
- Check file size < 10MB

### Images return 404
- Verify bucket is set to **Public**
- Check file exists in Supabase dashboard
- Try accessing the URL directly in browser

### "ANON key" error
- You used the wrong API key
- Use **service_role** key, NOT the anon key

## Costs

### Free Tier (Default)
- 500 MB storage
- 2 GB bandwidth/month
- FREE for personal projects

### Paid Tier (Optional)
- $5/month base
- $0.15 per GB storage after 500MB
- $0.12 per GB bandwidth after 2GB
- Only upgrade if you exceed limits

## Migration from Old Storage

Your existing Prisma database already stores image URLs. They will continue to work:
- Old: `/uploads/...` paths (served from Next.js public folder)
- New: Supabase CDN URLs (served globally with edge caching)

Both work simultaneously during migration. No schema changes needed!

## Next Steps

1. ✅ Create Supabase project
2. ✅ Configure storage bucket
3. ✅ Add API keys to `.env`
4. ✅ Test uploads through dashboard
5. ✅ All future uploads use Supabase

Your forms already updated to support file uploads. Just add Supabase credentials and you're ready!
