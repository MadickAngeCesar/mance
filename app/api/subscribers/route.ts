import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  SubscriberCreateSchema,
  SubscriberQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/subscribers
 * List all subscribers with pagination and filtering
 */
async function handleGet(request: NextRequest) {
  await requireRole(request, "admin");

  const searchParams = request.nextUrl.searchParams;
  const query = SubscriberQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    active: searchParams.get("active"),
    sort: searchParams.get("sort"),
  });

  // Build filter
  let where: any = {};
  if (query.active === "active") {
    where.active = true;
  } else if (query.active === "inactive") {
    where.active = false;
  }

  // Calculate pagination
  const skip = (query.page - 1) * query.limit;

  // Determine sort order
  const orderBy: any =
    query.sort === "oldest"
      ? { subscribedAt: "asc" }
      : { subscribedAt: "desc" };

  // Fetch subscribers and total count
  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
    }),
    prisma.subscriber.count({ where }),
  ]);

  const response: ApiResponse = {
    ok: true,
    data: subscribers,
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
 * POST /api/subscribers
 * Subscribe a new email to the newsletter
 */
async function handlePost(request: NextRequest) {
  const body = await request.json();
  const data = SubscriberCreateSchema.parse(body);

  // Check if email already exists
  const existing = await prisma.subscriber.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    // If inactive, reactivate
    if (!existing.active) {
      const updated = await prisma.subscriber.update({
        where: { id: existing.id },
        data: { active: true },
      });
      const response: ApiResponse = {
        ok: true,
        data: updated,
        meta: { reactivated: true },
      };
      return NextResponse.json(response, { status: 200 });
    }

    // Already active
    throw ApiError.conflict("Email already subscribed");
  }

  const subscriber = await prisma.subscriber.create({
    data: {
      externalId: `sub-${Date.now()}`,
      ...data,
      subscribedAt: new Date(),
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: subscriber,
  };

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
