import type { Metadata } from "next";
import {
  academyResources as fallbackResources,
  type AcademyResourceExtended,
} from "@/lib/placeholder-data";
import { AcademyHero } from "@/components/academy/academy-hero";
import { AcademyClient } from "@/components/academy/academy-client";
import { AcademyNewsletter } from "@/components/academy/academy-newsletter";

export const metadata: Metadata = {
  title: "Academy | MAC TECH",
  description:
    "Curated articles, cheat sheets, and books on web development, DevOps, and computer science — free downloads and premium editions.",
};

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  // TODO: Fetch from DB once AcademyResource model is added to Prisma schema.
  // For now, use the rich placeholder dataset.
  const resourcesData: AcademyResourceExtended[] = fallbackResources;

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
