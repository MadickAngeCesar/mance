import { NextRequest, NextResponse } from "next/server";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse, TargetSectorUpdateSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function resolveId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

/**
 * PATCH /api/sectors/[id]
 * Update target sector (admin only)
 */
async function handlePatch(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");
  const id = await resolveId(context);

  const body = await request.json();
  const data = TargetSectorUpdateSchema.omit({ id: true }).parse(body);

  const existing = await prisma.targetSector.findUnique({
    where: { id },
  });

  if (!existing) {
    throw ApiError.notFound("Target sector not found");
  }

  // Update slug if title is updated
  let slug = existing.slug;
  if (data.title && data.title !== existing.title) {
    slug = data.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const sector = await prisma.targetSector.update({
    where: { id },
    data: {
      ...data,
      slug,
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: sector,
  };

  return NextResponse.json(response);
}

/**
 * DELETE /api/sectors/[id]
 * Delete target sector (admin only)
 */
async function handleDelete(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");
  const id = await resolveId(context);

  const existing = await prisma.targetSector.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw ApiError.notFound("Target sector not found");
  }

  await prisma.targetSector.delete({
    where: { id },
  });

  const response: ApiResponse = {
    ok: true,
    data: { id },
  };

  return NextResponse.json(response);
}

export const PATCH = createApiHandler(handlePatch);
export const DELETE = createApiHandler(handleDelete);
