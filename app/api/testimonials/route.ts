import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TestimonialCreateSchema = z.object({
  clientName: z.string().min(1).max(200),
  clientRoleCompany: z.string().min(1).max(200),
  clientRoleCompanyFr: z.string().max(200).optional().nullable(),
  text: z.string().min(1).max(3000),
  textFr: z.string().min(1).max(3000).optional().nullable(),
  avatarUrl: z
    .string()
    .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Invalid avatar URL")
    .optional(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  projectReference: z.string().max(300).optional(),
  projectReferenceFr: z.string().max(300).optional().nullable(),
  date: z.string().max(100).optional(),
  dateLabel: z.string().max(100).optional(),
  dateLabelFr: z.string().max(100).optional().nullable(),
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
      externalId: `testimonial-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      clientName: parsed.clientName,
      clientRoleCompany: parsed.clientRoleCompany,
      clientRoleCompanyFr: parsed.clientRoleCompanyFr ?? null,
      text: parsed.text,
      textFr: parsed.textFr ?? null,
      avatarUrl: parsed.avatarUrl ?? null,
      rating: parsed.rating,
      projectReference: parsed.projectReference ?? "",
      projectReferenceFr: parsed.projectReferenceFr ?? null,
      dateLabel: parsed.date ?? parsed.dateLabel ?? "",
      dateLabelFr: parsed.dateLabelFr ?? null,
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
