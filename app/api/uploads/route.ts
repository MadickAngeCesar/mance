import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

function sanitizeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/-+/g, "-");
}

function extensionFromMimeType(type: string, fallbackName: string) {
  const byMime: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };

  if (byMime[type]) {
    return byMime[type];
  }

  const ext = path.extname(fallbackName);
  return ext || ".bin";
}

async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "generic").toLowerCase();

  if (!(file instanceof File)) {
    throw ApiError.badRequest("Missing file field.");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw ApiError.badRequest("Only image uploads are supported.");
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw ApiError.badRequest("Image is too large. Maximum size is 10MB.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // Profile image keeps a stable path so existing UI can read it without DB schema changes.
  if (kind === "profile") {
    const profileDir = path.join(process.cwd(), "public", "images");
    await mkdir(profileDir, { recursive: true });
    const profilePath = path.join(profileDir, "Profile.jpg");
    await writeFile(profilePath, bytes);

    return NextResponse.json({
      ok: true,
      data: { url: "/images/Profile.jpg" },
    });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", kind || "generic");
  await mkdir(uploadDir, { recursive: true });

  const baseName = sanitizeFileName(path.basename(file.name || "image"));
  const ext = extensionFromMimeType(file.type, baseName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const fileName = `${timestamp}-${random}${ext}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, bytes);

  return NextResponse.json({
    ok: true,
    data: { url: `/uploads/${kind || "generic"}/${fileName}` },
  });
}

export const POST = createApiHandler(handlePost);
