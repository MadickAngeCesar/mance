import { NextRequest, NextResponse } from "next/server";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse, WorkflowStageUpdateSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function resolveId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

/**
 * PATCH /api/workflow-stages/[id]
 * Update workflow stage (admin only)
 */
async function handlePatch(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");
  const id = await resolveId(context);

  const body = await request.json();
  const data = WorkflowStageUpdateSchema.omit({ id: true }).parse(body);

  const existing = await prisma.workflowStage.findUnique({
    where: { id },
  });

  if (!existing) {
    throw ApiError.notFound("Workflow stage not found");
  }

  const stage = await prisma.workflowStage.update({
    where: { id },
    data,
  });

  const response: ApiResponse = {
    ok: true,
    data: stage,
  };

  return NextResponse.json(response);
}

/**
 * DELETE /api/workflow-stages/[id]
 * Delete workflow stage (admin only)
 */
async function handleDelete(
  request: NextRequest,
  context: RouteContext
) {
  await requireRole(request, "admin");
  const id = await resolveId(context);

  const existing = await prisma.workflowStage.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw ApiError.notFound("Workflow stage not found");
  }

  await prisma.workflowStage.delete({
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
