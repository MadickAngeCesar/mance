import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TestimonialCreateSchema = z.object({
  clientName: z.string().min(1).max(200),
  clientRoleCompany: z.string().min(1).max(200),
  text: z.string().min(1).max(3000),
  avatarUrl: z
    .string()
    .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Invalid avatar URL")
    .optional(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  projectReference: z.string().max(300).optional(),
  date: z.string().max(100).optional(),
  dateLabel: z.string().max(100).optional(),
});

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

  const parsed = TestimonialCreateSchema.parse(await request.json());

  const created = await prisma.testimonial.create({
    data: {
      externalId: `testimonial-${Date.now()}`,
      clientName: parsed.clientName,
      clientRoleCompany: parsed.clientRoleCompany,
      text: parsed.text,
      avatarUrl: parsed.avatarUrl ?? null,
      rating: parsed.rating,
      projectReference: parsed.projectReference ?? "",
      dateLabel: parsed.date ?? parsed.dateLabel ?? "",
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
