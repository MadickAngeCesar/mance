import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ClientWorkCreateSchema,
  ClientWorkQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/client-work
 * List all client work entries with pagination and filtering
 */
async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsedQuery = ClientWorkQuerySchema.safeParse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    sort: searchParams.get("sort"),
    published: searchParams.get("published"),
  });

  const query = parsedQuery.success
    ? parsedQuery.data
    : ClientWorkQuerySchema.parse({});

  const where: any = {};

  if (query.published === "published") {
    where.publishedAt = { not: null };
  } else if (query.published === "draft") {
    where.publishedAt = null;
  }

  const skip = (query.page - 1) * query.limit;
  const orderBy: any = query.sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  const [works, total] = await Promise.all([
    prisma.clientWork.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
    }),
    prisma.clientWork.count({ where }),
  ]);

  const response: ApiResponse = {
    ok: true,
    data: works,
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
 * POST /api/client-work
 * Create a new client work entry (admin only)
 */
async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();
  const data = ClientWorkCreateSchema.parse(body);

  const work = await prisma.clientWork.create({
    data: {
      externalId: `client-work-${Date.now()}`,
      ...data,
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: work,
  };

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
