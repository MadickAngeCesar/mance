import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  LabArticleCreateSchema,
  LabArticleQuerySchema,
  ApiResponse,
} from "@/lib/validators";
import { createApiHandler, isDatabaseUnavailableError } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { WorkKind } from "@/lib/generated/prisma/client";
import { triggerNewsletterCampaignForPublishedContent } from "@/lib/email-workflows";
import { labArticles as fallbackLabArticles } from "@/lib/placeholder-data";

/**
 * GET /api/blogs
 * List all blog articles with pagination and filtering
 */
async function handleGet(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsedQuery = LabArticleQuerySchema.safeParse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    category: searchParams.get("category"),
    featured: searchParams.get("featured"),
    sort: searchParams.get("sort"),
    published: searchParams.get("published"),
  });
  const query = parsedQuery.success
    ? parsedQuery.data
    : LabArticleQuerySchema.parse({
        page: 1,
        limit: 10,
        featured: "all",
        sort: "newest",
        published: "published",
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

  let articles;
  let total;

  try {
    [articles, total] = await Promise.all([
      prisma.labArticle.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
      }),
      prisma.labArticle.count({ where }),
    ]);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    const filtered = fallbackLabArticles.filter((item) => {
      if (query.category && item.category !== query.category) {
        return false;
      }
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
    articles = filtered.slice(skip, skip + query.limit).map((item) => ({
      id: item.id,
      externalId: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      excerpt: item.excerpt,
      content: item.content,
      coverImageUrl: item.coverImageUrl,
      tags: item.tags,
      views: item.views,
      featured: item.featured,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
      createdAt: item.publishedAt ? new Date(item.publishedAt) : new Date(0),
      updatedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(0),
    }));
  }

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
