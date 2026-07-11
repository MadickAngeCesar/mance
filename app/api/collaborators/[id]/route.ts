import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TeamMemberUpdateSchema, ApiResponse } from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * PATCH /api/collaborators/[id]
 * Update a collaborator (admin only)
 */
async function handlePatch(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(request, "admin");
  const { id } = await params;
  const body = await request.json();
  const data = TeamMemberUpdateSchema.parse({ ...body, id });

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Collaborator not found.", 404);
  }

  const { id: _id, ...updateData } = data;
  const updated = await prisma.teamMember.update({
    where: { id },
    data: updateData,
  });

  const response: ApiResponse = { ok: true, data: updated };
  return NextResponse.json(response);
}

/**
 * DELETE /api/collaborators/[id]
 * Delete a collaborator (admin only)
 */
async function handleDelete(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(request, "admin");
  const { id } = await params;

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Collaborator not found.", 404);
  }

  await prisma.teamMember.delete({ where: { id } });

  const response: ApiResponse = { ok: true };
  return NextResponse.json(response);
}

export const PATCH = createApiHandler(handlePatch);
export const DELETE = createApiHandler(handleDelete);
