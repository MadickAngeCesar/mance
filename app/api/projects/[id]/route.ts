import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LabProjectUpdateSchema, ApiResponse } from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { WorkKind } from "@/lib/generated/prisma/client";
import { triggerNewsletterCampaignForPublishedContent } from "@/lib/email-workflows";

/**
 * GET /api/projects/[id]
 * Get a single lab project by ID (or slug)
 * Public can view published projects, only admin can view drafts
 */
async function handleGet(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Try to find by ID first, then by slug
  let project = await prisma.labProject.findUnique({
    where: { id },
  });

  if (!project) {
    project = await prisma.labProject.findUnique({
      where: { slug: id },
    });
  }

  if (!project) {
    throw ApiError.notFound("Project not found");
  }

  // Only admins can view draft projects
  if (!project.publishedAt) {
    await requireRole(request, "admin");
  }

  // Increment view count
  await prisma.labProject.update({
    where: { id: project.id },
    data: { views: { increment: 1 } },
  });

  const response: ApiResponse = {
    ok: true,
    data: project,
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/projects/[id]
 * Update a lab project
 */
async function handlePatch(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const { id } = params;
  const body = await request.json();
  const data = LabProjectUpdateSchema.partial().parse(body);

  const existing = await prisma.labProject.findUnique({
    where: { id },
    select: {
      publishedAt: true,
    },
  });

  if (!existing) {
    throw ApiError.notFound("Project not found");
  }

  const project = await prisma.labProject.update({
    where: { id },
    data,
  });

  const becamePublished = !existing.publishedAt && Boolean(project.publishedAt);
  if (becamePublished) {
    try {
      await triggerNewsletterCampaignForPublishedContent({
        contentType: WorkKind.PROJECT,
        contentId: project.id,
        slug: project.slug,
        title: project.title,
        excerpt: project.summary,
      });
    } catch (error) {
      console.error("Newsletter campaign trigger failed for project:", error);
    }
  }

  const response: ApiResponse = {
    ok: true,
    data: project,
  };

  return NextResponse.json(response);
}

/**
 * DELETE /api/projects/[id]
 * Delete a lab project
 */
async function handleDelete(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await prisma.labProject.delete({
    where: { id },
  });

  const response: ApiResponse = {
    ok: true,
    data: { id },
  };

  return NextResponse.json(response);
}

export const GET = createApiHandler(handleGet);
export const PATCH = createApiHandler(handlePatch);
export const DELETE = createApiHandler(handleDelete);
