import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  MessageCreateSchema,
  MessageQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { sendContactEmailFanout } from "@/lib/email-workflows";

/**
 * GET /api/messages
 * List all messages with pagination and filtering
 */
async function handleGet(request: NextRequest) {
  await requireRole(request, "admin");

  const searchParams = request.nextUrl.searchParams;
  const query = MessageQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    sort: searchParams.get("sort"),
    isRead: searchParams.get("isRead"),
  });

  // Build filter
  let where: any = {};
  if (query.isRead === "read") {
    where.isRead = true;
  } else if (query.isRead === "unread") {
    where.isRead = false;
  }

  // Calculate pagination
  const skip = (query.page - 1) * query.limit;

  // Determine sort order
  const orderBy: any =
    query.sort === "oldest"
      ? { createdAt: "asc" }
      : query.sort === "unread"
        ? [{ isRead: "asc" }, { createdAt: "desc" }]
        : { createdAt: "desc" };

  // Fetch messages and total count
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
    }),
    prisma.message.count({ where }),
  ]);

  const response: ApiResponse = {
    ok: true,
    data: messages,
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
 * POST /api/messages
 * Create a new message (from contact form)
 */
async function handlePost(request: NextRequest) {
  const body = await request.json();
  const data = MessageCreateSchema.parse(body);

  const message = await prisma.message.create({
    data: {
      externalId: `msg-${Date.now()}`,
      ...data,
      receivedAt: new Date(),
    },
  });

  try {
    await sendContactEmailFanout({
      messageId: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
    });
  } catch (error) {
    console.error("Contact email fanout failed:", error);
  }

  const response: ApiResponse = {
    ok: true,
    data: message,
  };

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
