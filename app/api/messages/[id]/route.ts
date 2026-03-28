import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/messages/[id]
 * Get a single message by ID
 */
async function handleGet(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const { id } = params;

  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    throw ApiError.notFound("Message not found");
  }

  const response: ApiResponse = {
    ok: true,
    data: message,
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/messages/[id]
 * Update message (e.g., mark as read)
 */
async function handlePatch(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const { id } = params;
  const body = await request.json();

  const message = await prisma.message.update({
    where: { id },
    data: body,
  });

  const response: ApiResponse = {
    ok: true,
    data: message,
  };

  return NextResponse.json(response);
}

/**
 * DELETE /api/messages/[id]
 * Delete a message
 */
async function handleDelete(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const { id } = params;

  await prisma.message.delete({
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
