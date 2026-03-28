import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ServiceCreateSchema,
  ServiceQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { ensureBrandProfile } from "@/lib/brand-profile";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildOfferingCtaUrl(input: { title: string; ctaText: string }) {
  const source = input.ctaText || input.title;
  const offering = slugify(source || "service");
  return `/services?offering=${encodeURIComponent(offering)}#booking`;
}

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

  const brand = await ensureBrandProfile();

  const service = await prisma.offering.create({
    data: {
      externalId: `service-${Date.now()}`,
      ...data,
      ctaUrl: buildOfferingCtaUrl({
        title: data.title,
        ctaText: data.ctaText,
      }),
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
