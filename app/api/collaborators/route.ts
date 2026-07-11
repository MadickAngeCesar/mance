import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TeamMemberCreateSchema, ApiResponse } from "@/lib/validators";
import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/collaborators
 * List all collaborators (team members)
 */
async function handleGet() {
  const members = await prisma.teamMember.findMany({
    orderBy: { displayOrder: "asc" },
  });

  const response: ApiResponse = {
    ok: true,
    data: members,
  };

  return NextResponse.json(response);
}

/**
 * POST /api/collaborators
 * Create a new collaborator (admin only)
 */
async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();
  const data = TeamMemberCreateSchema.parse(body);

  const member = await prisma.teamMember.create({
    data,
  });

  const response: ApiResponse = {
    ok: true,
    data: member,
  };

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
