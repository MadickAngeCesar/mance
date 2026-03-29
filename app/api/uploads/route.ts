import { mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

export const runtime = "nodejs";

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const PUBLIC_UPLOADS_ROOT = path.join(PUBLIC_ROOT, "uploads");
const PUBLIC_PROFILE_DIR = path.join(PUBLIC_ROOT, "images");
const FALLBACK_UPLOADS_ROOT = path.join(os.tmpdir(), "mance-uploads");

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".avif",
  ".heic",
  ".heif",
  ".webp",
  ".gif",
  ".svg",
]);

type UploadedFile = {
  name: string;
  type: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

function asUploadedFile(value: FormDataEntryValue | null): UploadedFile | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<UploadedFile>;
  if (
    typeof candidate.name !== "string" ||
    typeof candidate.type !== "string" ||
    typeof candidate.size !== "number" ||
    typeof candidate.arrayBuffer !== "function"
  ) {
    return null;
  }

  return candidate as UploadedFile;
}

function sanitizeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/-+/g, "-");
}

function sanitizeKind(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "generic";
}

function extensionFromMimeType(type: string, fallbackName: string) {
  const byMime: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/avif": ".avif",
    "image/heic": ".heic",
    "image/heif": ".heif",
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
  const file = asUploadedFile(form.get("file"));
  const kind = sanitizeKind(String(form.get("kind") ?? "generic"));

  if (!file) {
    throw ApiError.badRequest("Missing file field.");
  }

  const extension = path.extname(file.name || "").toLowerCase();
  const hasAllowedMime = Boolean(file.type) && ALLOWED_TYPES.has(file.type);
  const hasAllowedExtension = ALLOWED_EXTENSIONS.has(extension);

  if (!hasAllowedMime && !hasAllowedExtension) {
    throw ApiError.badRequest(
      `Unsupported image file \"${file.name || "unknown"}\" (${file.type || "unknown"}). Allowed types: ${Array.from(ALLOWED_TYPES).join(", ")}.`
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw ApiError.badRequest("Image is too large. Maximum size is 10MB.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // Profile image keeps a stable path so existing UI can read it without DB schema changes.
  if (kind === "profile") {
    try {
      await mkdir(PUBLIC_PROFILE_DIR, { recursive: true });
      const profilePath = path.join(PUBLIC_PROFILE_DIR, "Profile.jpg");
      await writeFile(profilePath, bytes);

      return NextResponse.json({
        ok: true,
        data: { url: "/images/Profile.jpg" },
      });
    } catch (error) {
      console.error("Profile upload to public directory failed:", error);
    }

    try {
      const fallbackProfileDir = path.join(FALLBACK_UPLOADS_ROOT, "profile");
      await mkdir(fallbackProfileDir, { recursive: true });
      const fallbackProfilePath = path.join(fallbackProfileDir, "Profile.jpg");
      await writeFile(fallbackProfilePath, bytes);

      return NextResponse.json({
        ok: true,
        data: { url: "/api/uploads/files/profile/Profile.jpg" },
      });
    } catch (error) {
      console.error("Profile upload fallback write failed:", error);
      throw new ApiError(
        "Unable to store profile image. Configure writable storage for uploads.",
        503
      );
    }
  }

  const baseName = sanitizeFileName(path.basename(file.name || "image"));
  const ext = extensionFromMimeType(file.type, baseName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const fileName = `${timestamp}-${random}${ext}`;

  try {
    const uploadDir = path.join(PUBLIC_UPLOADS_ROOT, kind);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, bytes);

    return NextResponse.json({
      ok: true,
      data: { url: `/uploads/${kind}/${fileName}` },
    });
  } catch (error) {
    console.error("Upload write to public directory failed:", error);
  }

  try {
    const fallbackDir = path.join(FALLBACK_UPLOADS_ROOT, kind);
    await mkdir(fallbackDir, { recursive: true });
    const fallbackPath = path.join(fallbackDir, fileName);
    await writeFile(fallbackPath, bytes);

    return NextResponse.json({
      ok: true,
      data: { url: `/api/uploads/files/${kind}/${fileName}` },
    });
  } catch (error) {
    console.error("Upload fallback write failed:", error);
    throw new ApiError(
      "Unable to store uploaded image. Configure writable storage for uploads.",
      503
    );
  }
}

export const POST = createApiHandler(handlePost);
