import { readFile } from "fs/promises";
import os from "os";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { ApiError, createApiHandler } from "@/lib/api-utils";

export const runtime = "nodejs";

const FALLBACK_UPLOADS_ROOT = path.join(os.tmpdir(), "mance-uploads");
const PUBLIC_UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const PUBLIC_IMAGES_ROOT = path.join(process.cwd(), "public", "images");

type RouteContext = {
  params: Promise<{ path: string[] }> | { path: string[] };
};

const MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

function isSafePathSegment(segment: string) {
  return /^[A-Za-z0-9._-]+$/.test(segment) && segment !== "." && segment !== "..";
}

async function resolveSegments(context: RouteContext) {
  const params = await context.params;
  const segments = params.path;

  if (!Array.isArray(segments) || segments.length < 2) {
    throw ApiError.notFound("Upload not found");
  }

  if (!segments.every(isSafePathSegment)) {
    throw ApiError.badRequest("Invalid upload path");
  }

  return segments;
}

async function handleGet(_request: NextRequest, context: RouteContext) {
  const segments = await resolveSegments(context);
  const fallbackUnsafeFilePath = path.join(FALLBACK_UPLOADS_ROOT, ...segments);
  const fallbackResolvedFilePath = path.resolve(fallbackUnsafeFilePath);
  const fallbackResolvedRoot = path.resolve(FALLBACK_UPLOADS_ROOT);

  if (!fallbackResolvedFilePath.startsWith(`${fallbackResolvedRoot}${path.sep}`)) {
    throw ApiError.badRequest("Invalid upload path");
  }

  const publicUnsafeFilePath = path.join(PUBLIC_UPLOADS_ROOT, ...segments);
  const publicResolvedFilePath = path.resolve(publicUnsafeFilePath);
  const publicResolvedRoot = path.resolve(PUBLIC_UPLOADS_ROOT);

  if (!publicResolvedFilePath.startsWith(`${publicResolvedRoot}${path.sep}`)) {
    throw ApiError.badRequest("Invalid upload path");
  }

  let fileBytes: Buffer | null = null;
  let resolvedPathForMime = fallbackResolvedFilePath;
  try {
    fileBytes = await readFile(fallbackResolvedFilePath);
  } catch (error) {
    console.warn("Fallback upload read failed; trying public upload path.", error);
    try {
      fileBytes = await readFile(publicResolvedFilePath);
      resolvedPathForMime = publicResolvedFilePath;
    } catch (publicError) {
      console.warn("Public upload read failed; serving placeholder image.", publicError);
      try {
        fileBytes = await readFile(path.join(PUBLIC_IMAGES_ROOT, "Profile.jpg"));
        resolvedPathForMime = path.join(PUBLIC_IMAGES_ROOT, "Profile.jpg");
      } catch (placeholderError) {
        console.error("Placeholder image read failed:", placeholderError);
      }
    }
  }

  if (!fileBytes) {
    throw ApiError.notFound("Upload not found");
  }

  const extension = path.extname(resolvedPathForMime).toLowerCase();
  const contentType = MIME_BY_EXTENSION[extension] ?? "application/octet-stream";

  return new NextResponse(new Uint8Array(fileBytes), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export const GET = createApiHandler(handleGet);
