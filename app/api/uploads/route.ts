import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

export const runtime = "nodejs";

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
  const kind = String(form.get("kind") ?? "generic").toLowerCase();

  if (!file) {
    throw ApiError.badRequest("Missing file field.");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw ApiError.badRequest(
      `Unsupported image type \"${file.type || "unknown"}\". Allowed: ${Array.from(ALLOWED_TYPES).join(", ")}.`
    );
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
    try {
      await writeFile(profilePath, bytes);
    } catch (error) {
      console.error("Profile upload write failed:", error);
      throw new ApiError("Unable to store profile image on server.", 503);
    }

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

  try {
    await writeFile(filePath, bytes);
  } catch (error) {
    console.error("Upload write failed:", error);
    throw new ApiError("Unable to store uploaded image on server.", 503);
  }

  return NextResponse.json({
    ok: true,
    data: { url: `/uploads/${kind || "generic"}/${fileName}` },
  });
}

export const POST = createApiHandler(handlePost);
