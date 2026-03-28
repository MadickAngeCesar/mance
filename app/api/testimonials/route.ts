import { NextRequest, NextResponse } from "next/server";

import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") ?? "50");

  const testimonials = await prisma.testimonial.findMany({
    take: Number.isNaN(limit) ? 50 : Math.min(Math.max(limit, 1), 200),
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    ok: true,
    data: testimonials,
  });
}

async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();

  const created = await prisma.testimonial.create({
    data: {
      externalId: `testimonial-${Date.now()}`,
      clientName: String(body.clientName ?? ""),
      clientRoleCompany: String(body.clientRoleCompany ?? ""),
      text: String(body.text ?? ""),
      avatarUrl: body.avatarUrl ? String(body.avatarUrl) : null,
      rating: Number(body.rating ?? 5),
      projectReference: String(body.projectReference ?? ""),
      dateLabel: String(body.date ?? body.dateLabel ?? ""),
    },
  });

  return NextResponse.json(
    {
      ok: true,
      data: created,
    },
    { status: 201 }
  );
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
