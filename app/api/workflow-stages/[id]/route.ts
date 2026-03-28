import { NextRequest, NextResponse } from "next/server";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse, WorkflowStageUpdateSchema } from "@/lib/validators";

/**
 * PATCH /api/workflow-stages/[id]
 * Update workflow stage (admin only)
 */
async function handlePatch(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const body = await request.json();
  const data = WorkflowStageUpdateSchema.omit({ id: true }).parse(body);

  const existing = await prisma.workflowStage.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    throw ApiError.notFound("Workflow stage not found");
  }

  const stage = await prisma.workflowStage.update({
    where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  await prisma.workflowStage.delete({
    where: { id: params.id },
  });

  const response: ApiResponse = {
    ok: true,
    data: { id: params.id },
  };

  return NextResponse.json(response);
}

export const PATCH = createApiHandler(handlePatch);
export const DELETE = createApiHandler(handleDelete);
