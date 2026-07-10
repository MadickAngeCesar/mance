import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { academyResources as fallbackResources } from "@/lib/placeholder-data";
import { GsapSection } from "@/components/home/gsap-section";

export const metadata: Metadata = {
  title: "Academy | MAC TECH",
};

export const dynamic = "force-dynamic";

export default async function AcademyPage() {
  let resources: any[] = [];
  try {
    resources = await prisma.academyResource.findMany({
        orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
        console.error("Academy resources query failed:", error);
    }
  }

  const resourcesData = resources.length > 0 ? resources : fallbackResources;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 overflow-hidden">
      <GsapSection animation="fade-up" delay={0.1}>
        <section className="space-y-4 text-center rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            <Tx en="Learning Resources" fr="Ressources d'apprentissage" />
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            <Tx en="Academy" fr="Académie" />
          </h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            <Tx
              en="Explore articles, quick guides, books and online courses related to computer sciences."
              fr="Explorez des articles, des guides rapides, des livres et des cours en ligne liés aux sciences de l'informatique."
            />
          </p>
        </section>
      </GsapSection>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resourcesData.map((resource, i) => (
          <GsapSection key={resource.id} animation="fade-up" delay={0.1 + (i % 3) * 0.1}>
            <Card className="h-full overflow-hidden border-border/80">
              <div className="relative aspect-video">
                 <Image
                  src={resource.coverImageUrl || "/images/mac_tech_logo.png"}
                  alt={resource.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{resource.type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {resource.publishedAt ? new Date(resource.publishedAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 mt-2">
                  <Tx en={resource.title} fr={resource.titleFr || resource.title} />
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  <Tx en={resource.description} fr={resource.descriptionFr || resource.description} />
                </CardDescription>
              </CardHeader>
            </Card>
          </GsapSection>
        ))}
        {resourcesData.length === 0 && (
           <p className="text-center text-muted-foreground col-span-full">
            <Tx en="No resources found." fr="Aucune ressource trouvée." />
           </p>
        )}
      </div>
    </main>
  );
}
