import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OverviewStatsSchema, ApiResponse } from "@/lib/validators";
import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/overview
 * Get dashboard overview stats (admin only)
 */
async function handleGet(request: NextRequest) {
  await requireRole(request, "admin");

  // Fetch all stats in parallel
  const [
    totalMessages,
    unreadMessages,
    totalSubscribers,
    activeSubscribers,
    totalArticles,
    publishedArticles,
    totalProjects,
    publishedProjects,
    totalCampaignsSent,
  ] = await Promise.all([
    prisma.message.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { active: true } }),
    prisma.labArticle.count(),
    prisma.labArticle.count({ where: { publishedAt: { not: null } } }),
    prisma.labProject.count(),
    prisma.labProject.count({ where: { publishedAt: { not: null } } }),
    prisma.subscriberCampaign.count({
      where: { status: "COMPLETED" },
    }),
  ]);

  const stats = OverviewStatsSchema.parse({
    totalMessages,
    unreadMessages,
    totalSubscribers,
    activeSubscribers,
    totalArticles,
    publishedArticles,
    totalProjects,
    publishedProjects,
    totalCampaignsSent,
  });

  const response: ApiResponse = {
    ok: true,
    data: stats,
  };

  return NextResponse.json(response);
}

export const GET = createApiHandler(handleGet);
