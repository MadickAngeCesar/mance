import type { Metadata } from "next";
import type { AcademyResourceExtended } from "@/lib/definitions";

import { AcademyHero } from "@/components/academy/academy-hero";
import { AcademyClient } from "@/components/academy/academy-client";
import { AcademyNewsletter } from "@/components/academy/academy-newsletter";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Academy | MAC TECH",
  description:
    "Curated articles, cheat sheets, and books on web development, DevOps, and computer science — free downloads and premium editions.",
};

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  let dbResources: any[] = [];
  let dbArticles: any[] = [];

  try {
    [dbResources, dbArticles] = await Promise.all([
      prisma.academyResource.findMany({
        where: {
          publishedAt: { not: null },
        },
      }),
      prisma.labArticle.findMany({
        where: {
          publishedAt: { not: null },
        },
      }),
    ]);
  } catch (error) {
    console.error("Database query failed for academy page, using fallback:", error);
  }

  const formattedResources: AcademyResourceExtended[] = dbResources.map((res) => ({
    id: res.id,
    title: res.title,
    titleFr: res.titleFr,
    description: res.description,
    descriptionFr: res.descriptionFr,
    content: res.content,
    contentFr: res.contentFr,
    type: res.type as "ARTICLE" | "GUIDE" | "BOOK" | "COURSE",
    slug: res.slug,
    coverImageUrl: res.coverImageUrl,
    tags: res.tags,
    views: res.views,
    publishedAt: res.publishedAt ? res.publishedAt.toISOString() : undefined,
    isFree: true,
    likes: 0,
    difficulty: "Intermediate",
  }));

  const formattedArticles: AcademyResourceExtended[] = dbArticles.map((art) => ({
    id: art.id,
    title: art.title,
    titleFr: art.titleFr,
    description: art.excerpt,
    descriptionFr: art.excerptFr,
    content: art.content,
    contentFr: art.contentFr,
    type: "ARTICLE",
    slug: art.slug,
    coverImageUrl: art.coverImageUrl,
    tags: art.tags,
    views: art.views,
    publishedAt: art.publishedAt ? art.publishedAt.toISOString() : undefined,
    isFree: true,
    likes: art.likes,
    difficulty: "Intermediate",
  }));

  let resourcesData = [...formattedResources, ...formattedArticles];



  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 overflow-hidden">
      {/* Hero */}
      <AcademyHero />

      {/* Interactive content grid */}
      <AcademyClient resources={resourcesData} />

      {/* Newsletter */}
      <AcademyNewsletter />
    </main>
  );
}
