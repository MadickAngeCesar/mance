import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ServiceUpdateSchema, ApiResponse } from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildOfferingCtaUrl(input: { title?: string; ctaText?: string }) {
  const source = input.ctaText || input.title || "service";
  const offering = slugify(source);
  return `/services?offering=${encodeURIComponent(offering)}#booking`;
}

/**
 * GET /api/services/[id]
 * Get a single service by ID
 */
async function handleGet(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const service = await prisma.offering.findUnique({
    where: { id },
  });

  if (!service) {
    throw ApiError.notFound("Service not found");
  }

  const response: ApiResponse = {
    ok: true,
    data: service,
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/services/[id]
 * Update a service (admin only)
 */
async function handlePatch(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const { id } = params;
  const body = await request.json();
  const data = ServiceUpdateSchema.partial().parse(body);

  const existing = await prisma.offering.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound("Service not found");
  }

  const nextTitle = data.title ?? existing.title;
  const nextCtaText = data.ctaText ?? existing.ctaText;

  const service = await prisma.offering.update({
    where: { id },
    data: {
      ...data,
      ctaUrl: buildOfferingCtaUrl({ title: nextTitle, ctaText: nextCtaText }),
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: service,
  };

  return NextResponse.json(response);
}

/**
 * DELETE /api/services/[id]
 * Delete a service (admin only)
 */
async function handleDelete(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const { id } = params;

  await prisma.offering.delete({
    where: { id },
  });

  const response: ApiResponse = {
    ok: true,
    data: { id },
  };

  return NextResponse.json(response);
}

export const GET = createApiHandler(handleGet);
export const PATCH = createApiHandler(handlePatch);
export const DELETE = createApiHandler(handleDelete);
