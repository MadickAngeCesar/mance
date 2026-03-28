import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LabArticleUpdateSchema, ApiResponse } from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { WorkKind } from "@/lib/generated/prisma/client";
import { triggerNewsletterCampaignForPublishedContent } from "@/lib/email-workflows";

/**
 * GET /api/blogs/[id]
 * Get a single blog article by ID (or slug)
 */
async function handleGet(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const { id } = params;

  // Try to find by ID first, then by slug
  let article = await prisma.labArticle.findUnique({
    where: { id },
  });

  if (!article) {
    article = await prisma.labArticle.findUnique({
      where: { slug: id },
    });
  }

  if (!article) {
    throw ApiError.notFound("Article not found");
  }

  // Increment view count
  await prisma.labArticle.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  });

  const response: ApiResponse = {
    ok: true,
    data: article,
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/blogs/[id]
 * Update a blog article
 */
async function handlePatch(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireRole(request, "admin");

  const { id } = params;
  const body = await request.json();
  const data = LabArticleUpdateSchema.partial().parse(body);

  const existing = await prisma.labArticle.findUnique({
    where: { id },
    select: {
      publishedAt: true,
    },
  });

  if (!existing) {
    throw ApiError.notFound("Article not found");
  }

  const article = await prisma.labArticle.update({
    where: { id },
    data,
  });

  const becamePublished = !existing.publishedAt && Boolean(article.publishedAt);
  if (becamePublished) {
    try {
      await triggerNewsletterCampaignForPublishedContent({
        contentType: WorkKind.ARTICLE,
        contentId: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
      });
    } catch (error) {
      console.error("Newsletter campaign trigger failed for article:", error);
    }
  }

  const response: ApiResponse = {
    ok: true,
    data: article,
  };

  return NextResponse.json(response);
}

/**
 * DELETE /api/blogs/[id]
 * Delete a blog article
 */
async function handleDelete(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await prisma.labArticle.delete({
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
