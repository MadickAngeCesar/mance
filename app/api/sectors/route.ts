import { NextRequest, NextResponse } from "next/server";

import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { ensureBrandProfile } from "@/lib/brand-profile";
import { prisma } from "@/lib/prisma";
import {
  ApiResponse,
  TargetSectorCreateSchema,
  TargetSectorQuerySchema,
} from "@/lib/validators";

/**
 * GET /api/sectors
 * List target sectors with pagination
 */
async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = TargetSectorQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  const skip = (query.page - 1) * query.limit;

  const [sectors, total] = await Promise.all([
    prisma.targetSector.findMany({
      skip,
      take: query.limit,
      orderBy: { displayOrder: "asc" },
    }),
    prisma.targetSector.count(),
  ]);

  const response: ApiResponse = {
    ok: true,
    data: sectors,
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
 * POST /api/sectors
 * Create target sector (admin only)
 */
async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();
  const data = TargetSectorCreateSchema.parse(body);
  const brand = await ensureBrandProfile();

  const slug = data.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const sector = await prisma.targetSector.create({
    data: {
      ...data,
      slug,
      brandProfileId: brand.id,
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: sector,
  };

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
