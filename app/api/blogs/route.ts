import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  LabArticleCreateSchema,
  LabArticleQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { WorkKind } from "@prisma/client";
import { triggerNewsletterCampaignForPublishedContent } from "@/lib/email-workflows";

/**
 * GET /api/blogs
 * List all blog articles with pagination and filtering
 */
async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = LabArticleQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    category: searchParams.get("category"),
    featured: searchParams.get("featured"),
    sort: searchParams.get("sort"),
    published: searchParams.get("published"),
  });

  // Build filter
  let where: any = {};

  if (query.category) {
    where.category = query.category;
  }

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

  // Calculate pagination
  const skip = (query.page - 1) * query.limit;

  // Determine sort order
  let orderBy: any = { publishedAt: "desc" };
  if (query.sort === "oldest") {
    orderBy = { publishedAt: "asc" };
  } else if (query.sort === "views") {
    orderBy = { views: "desc" };
  }

  // Fetch articles and total count
  const [articles, total] = await Promise.all([
    prisma.labArticle.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
    }),
    prisma.labArticle.count({ where }),
  ]);

  const response: ApiResponse = {
    ok: true,
    data: articles,
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
 * POST /api/blogs
 * Create a new blog article
 */
async function handlePost(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();
  const data = LabArticleCreateSchema.parse(body);

  const article = await prisma.labArticle.create({
    data: {
      externalId: `article-${Date.now()}`,
      ...data,
    },
  });

  if (article.publishedAt) {
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

  return NextResponse.json(response, { status: 201 });
}

export const GET = createApiHandler(handleGet);
export const POST = createApiHandler(handlePost);
