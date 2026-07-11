import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  LabProjectCreateSchema,
  LabProjectQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { WorkKind } from "@/lib/generated/prisma/client";
import { triggerNewsletterCampaignForPublishedContent } from "@/lib/email-workflows";

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
  const where: any = {};

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

  const [projects, total] = await Promise.all([
    prisma.labProject.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
    }),
    prisma.labProject.count({ where }),
  ]);

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
