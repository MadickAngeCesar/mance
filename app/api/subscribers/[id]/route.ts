import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/validators";
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
 * GET /api/subscribers/[id]
 * Get a single subscriber by ID
 */
async function handleGet(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");

  const id = await resolveId(context);

  const subscriber = await prisma.subscriber.findUnique({
    where: { id },
    include: { deliveries: true },
  });

  if (!subscriber) {
    throw ApiError.notFound("Subscriber not found");
  }

  const response: ApiResponse = {
    ok: true,
    data: subscriber,
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/subscribers/[id]
 * Update subscriber (e.g., deactivate)
 */
async function handlePatch(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");

  const id = await resolveId(context);
  const body = await request.json();

  const subscriber = await prisma.subscriber.update({
    where: { id },
    data: body,
  });

  const response: ApiResponse = {
    ok: true,
    data: subscriber,
  };

  return NextResponse.json(response);
}

/**
 * DELETE /api/subscribers/[id]
 * Delete a subscriber
 */
async function handleDelete(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");

  const id = await resolveId(context);

  await prisma.subscriber.delete({
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
