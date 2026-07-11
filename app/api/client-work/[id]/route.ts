import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ClientWorkUpdateSchema, ApiResponse } from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * PATCH /api/client-work/[id]
 * Update a client work entry (admin only)
 */
async function handlePatch(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(request, "admin");
  const { id } = await params;
  const body = await request.json();
  const data = ClientWorkUpdateSchema.parse({ ...body, id });

  const existing = await prisma.clientWork.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Client work not found.", 404);
  }

  const { id: _id, ...updateData } = data;
  const updated = await prisma.clientWork.update({
    where: { id },
    data: updateData,
  });

  const response: ApiResponse = { ok: true, data: updated };
  return NextResponse.json(response);
}

/**
 * DELETE /api/client-work/[id]
 * Delete a client work entry (admin only)
 */
async function handleDelete(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(request, "admin");
  const { id } = await params;

  const existing = await prisma.clientWork.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Client work not found.", 404);
  }

  await prisma.clientWork.delete({ where: { id } });

  const response: ApiResponse = { ok: true };
  return NextResponse.json(response);
}

export const PATCH = createApiHandler(handlePatch);
export const DELETE = createApiHandler(handleDelete);
