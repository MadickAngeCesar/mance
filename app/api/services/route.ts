import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ServiceCreateSchema,
  ServiceQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/services
 * List all services/offerings with pagination
 */
async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = ServiceQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  const skip = (query.page - 1) * query.limit;

  const [services, total] = await Promise.all([
    prisma.offering.findMany({
      skip,
      take: query.limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.offering.count(),
  ]);

  const response: ApiResponse = {
    ok: true,
    data: services,
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
 * POST /api/services
 * Create a new service (admin only)
 */
async function handlePost(request: NextRequest) {
  // Check authentication
  await requireRole(request, "admin");

  const body = await request.json();
  const data = ServiceCreateSchema.parse(body);

  // Get brand profile (there should be only one)
  const brand = await prisma.brandProfile.findFirst();
  if (!brand) {
    throw ApiError.notFound("Brand profile not found");
  }

  const service = await prisma.offering.create({
    data: {
      externalId: `service-${Date.now()}`,
      ...data,
      brandProfileId: brand.id,
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: service,
  };

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
