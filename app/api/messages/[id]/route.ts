import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MessageUpdateSchema, ApiResponse } from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function resolveId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

/**
 * GET /api/messages/[id]
 * Get a single message by ID
 */
async function handleGet(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");

  const id = await resolveId(context);

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
  context: RouteContext
) {
  await requireRole(request, "admin");

  const id = await resolveId(context);
  const body = await request.json();
  const data = MessageUpdateSchema.omit({ id: true }).partial().parse(body);

  const existing = await prisma.message.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound("Message not found");
  }

  const message = await prisma.message.update({
    where: { id },
    data,
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
  context: RouteContext
) {
  await requireRole(request, "admin");

  const id = await resolveId(context);

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
