import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TestimonialUpdateSchema = z.object({
  clientName: z.string().min(1).max(200).optional(),
  clientRoleCompany: z.string().min(1).max(200).optional(),
  text: z.string().min(1).max(3000).optional(),
  avatarUrl: z
    .string()
    .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Invalid avatar URL")
    .optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  projectReference: z.string().max(300).optional(),
  date: z.string().max(100).optional(),
  dateLabel: z.string().max(100).optional(),
});

async function handleGet(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: params.id },
  });

  if (!testimonial) {
    throw ApiError.notFound("Testimonial not found");
  }

  return NextResponse.json({
    ok: true,
    data: testimonial,
  });
}

async function handlePatch(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const body = TestimonialUpdateSchema.parse(await request.json());

  const updated = await prisma.testimonial.update({
    where: { id: params.id },
    data: {
      clientName: body.clientName,
      clientRoleCompany: body.clientRoleCompany,
      text: body.text,
      avatarUrl: body.avatarUrl ?? null,
      rating: body.rating,
      projectReference: body.projectReference,
      dateLabel: body.date ?? body.dateLabel,
    },
  });

  return NextResponse.json({
    ok: true,
    data: updated,
  });
}

async function handleDelete(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  await prisma.testimonial.delete({
    where: { id: params.id },
  });

  return NextResponse.json({
    ok: true,
    data: { id: params.id },
  });
}

export const GET = createApiHandler(handleGet);
export const PATCH = createApiHandler(handlePatch);
export const DELETE = createApiHandler(handleDelete);
