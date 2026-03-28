import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  LabProjectCreateSchema,
  LabProjectQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { createApiHandler, isDatabaseUnavailableError } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { WorkKind } from "@/lib/generated/prisma/client";
import { triggerNewsletterCampaignForPublishedContent } from "@/lib/email-workflows";
import { labProjects as fallbackLabProjects } from "@/lib/placeholder-data";

/**
 * GET /api/projects
 * List all lab projects with pagination and filtering
 */
async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsedQuery = LabProjectQuerySchema.safeParse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    featured: searchParams.get("featured"),
    sort: searchParams.get("sort"),
    published: searchParams.get("published"),
    tag: searchParams.get("tag"),
  });
  const query = parsedQuery.success
    ? parsedQuery.data
    : LabProjectQuerySchema.parse({
        page: 1,
        limit: 10,
        featured: "all",
        sort: "newest",
        published: "published",
      });

  // Build filter
  let where: any = {};

  if (query.featured === "featured") {
    where.featured = true;
  } else if (query.featured === "unfeatured") {
    where.featured = false;
  }

  if (query.published === "published") {
    where.publishedAt = { not: null };
  } else if (query.published === "draft") {
    where.publishedAt = null;
  }

  if (query.tag) {
    where.tags = { has: query.tag };
  }

  // Calculate pagination
  const skip = (query.page - 1) * query.limit;

  // Determine sort order
  let orderBy: any = { publishedAt: "desc" };
  if (query.sort === "oldest") {
    orderBy = { publishedAt: "asc" };
  } else if (query.sort === "views") {
    orderBy = { views: "desc" };
  }

  let projects;
  let total;

  try {
    [projects, total] = await Promise.all([
      prisma.labProject.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
      }),
      prisma.labProject.count({ where }),
    ]);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    const filtered = fallbackLabProjects.filter((item) => {
      if (query.featured === "featured" && !item.featured) {
        return false;
      }
      if (query.featured === "unfeatured" && item.featured) {
        return false;
      }
      if (query.published === "published" && !item.publishedAt) {
        return false;
      }
      if (query.published === "draft" && item.publishedAt) {
        return false;
      }
      if (query.tag && !item.tags.includes(query.tag)) {
        return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (query.sort === "views") {
        return b.views - a.views;
      }

      const aTs = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTs = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      if (query.sort === "oldest") {
        return aTs - bTs;
      }
      return bTs - aTs;
    });

    total = filtered.length;
    projects = filtered.slice(skip, skip + query.limit).map((item) => ({
      id: item.id,
      externalId: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      content: item.content,
      stack: item.stack,
      coverImageUrl: item.coverImageUrl,
      screenshotUrls: item.screenshotUrls,
      demoUrl: item.demoUrl ?? null,
      repoUrl: item.repoUrl ?? null,
      featured: item.featured,
      views: item.views,
      tags: item.tags,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
      createdAt: item.publishedAt ? new Date(item.publishedAt) : new Date(0),
      updatedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(0),
    }));
  }

  const response: ApiResponse = {
    ok: true,
    data: projects,
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
 * POST /api/projects
 * Create a new lab project
 */
async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();
  const data = LabProjectCreateSchema.parse(body);

  const project = await prisma.labProject.create({
    data: {
      externalId: `project-${Date.now()}`,
      ...data,
    },
  });

  if (project.publishedAt) {
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

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
