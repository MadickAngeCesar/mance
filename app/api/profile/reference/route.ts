import { NextRequest, NextResponse } from "next/server";

import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function handleGet(request: NextRequest) {
  await requireRole(request, "admin");

  const [education, experience, skills] = await Promise.all([
    prisma.education.findMany({
      orderBy: { displayOrder: "asc" },
    }),
    prisma.experience.findMany({
      orderBy: { displayOrder: "asc" },
    }),
    prisma.skill.findMany({
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    data: {
      education,
      experience,
      skills,
    },
  });
}

export const GET = createApiHandler(handleGet);
