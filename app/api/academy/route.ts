import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AcademyResourceCreateSchema,
  AcademyResourceQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/academy
 * List academy resources with pagination and filtering
 */
async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsedQuery = AcademyResourceQuerySchema.safeParse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    type: searchParams.get("type"),
    sort: searchParams.get("sort"),
    published: searchParams.get("published"),
  });

  const query = parsedQuery.success
    ? parsedQuery.data
    : AcademyResourceQuerySchema.parse({});

  const where: any = {};

  if (query.type && query.type !== "all") {
    where.type = query.type;
  }

  if (query.published === "published") {
    where.publishedAt = { not: null };
  } else if (query.published === "draft") {
    where.publishedAt = null;
  }

  const skip = (query.page - 1) * query.limit;

  let orderBy: any = { createdAt: "desc" };
  if (query.sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (query.sort === "views") {
    orderBy = { views: "desc" };
  }

  const [resources, total] = await Promise.all([
    prisma.academyResource.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
    }),
    prisma.academyResource.count({ where }),
  ]);

  const response: ApiResponse = {
    ok: true,
    data: resources,
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
 * POST /api/academy
 * Create a new academy resource (admin only)
 */
async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();
  const data = AcademyResourceCreateSchema.parse(body);

  const resource = await prisma.academyResource.create({
    data: {
      externalId: `academy-${Date.now()}`,
      ...data,
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: resource,
  };

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
