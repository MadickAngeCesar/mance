import { NextRequest, NextResponse } from "next/server";

import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { ensureBrandProfile } from "@/lib/brand-profile";
import { prisma } from "@/lib/prisma";
import {
  ApiResponse,
  WorkflowStageCreateSchema,
  WorkflowStageQuerySchema,
} from "@/lib/validators";

/**
 * GET /api/workflow-stages
 * List workflow stages with pagination
 */
async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = WorkflowStageQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  const skip = (query.page - 1) * query.limit;

  const [stages, total] = await Promise.all([
    prisma.workflowStage.findMany({
      skip,
      take: query.limit,
      orderBy: { step: "asc" },
    }),
    prisma.workflowStage.count(),
  ]);

  const response: ApiResponse = {
    ok: true,
    data: stages,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit),
    },
  };

  return NextResponse.json(response);
}

/**
 * POST /api/workflow-stages
 * Create workflow stage (admin only)
 */
async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();
  const data = WorkflowStageCreateSchema.parse(body);
  const brand = await ensureBrandProfile();

  const stage = await prisma.workflowStage.create({
    data: {
      ...data,
      brandProfileId: brand.id,
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: stage,
  };

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
