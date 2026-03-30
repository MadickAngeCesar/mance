import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient, STORAGE_BUCKET } from "@/lib/supabase";


const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
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

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (configError) {
    console.error("Supabase configuration error:", configError);
    throw new ApiError(
      "Supabase admin key is missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.",
      500
    );
  }

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
  const baseName = sanitizeFileName(path.basename(file.name || "image"));
  const ext = extensionFromMimeType(file.type, baseName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const fileName = `${timestamp}-${random}${ext}`;

  // Upload to Supabase Storage
  const filePath = `${kind}/${fileName}`;

  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, new Uint8Array(bytes), {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new ApiError(
        `Supabase upload failed: ${error.message}. Check that bucket \"${STORAGE_BUCKET}\" exists and is accessible.`,
        500
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return NextResponse.json({
      ok: true,
      data: { url: urlData.publicUrl },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Upload error:", error);
    throw new ApiError("Unable to upload file to Supabase Storage.", 500);
  }
}

export const POST = createApiHandler(handlePost);
