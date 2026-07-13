import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { ArticleSpec } from "@/components/lab/article_spec";
import { ClientWorkSpec } from "@/components/lab/client_work_spec";
import { ProjectSpec } from "@/components/lab/project_spec";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { GsapSection } from "@/components/home/gsap-section";
import { Tx } from "@/components/i18n/tx";

type LabDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const [projects, articles, workItems] = await Promise.all([
      prisma.labProject.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true },
      }),
      prisma.labArticle.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true },
      }),
      prisma.clientWork.findMany({
        where: {
          slug: { not: null },
          publishedAt: { not: null },
        },
        select: { slug: true },
      }),
    ]);

    return [
      ...projects.map((item) => ({ slug: item.slug })),
      ...articles.map((item) => ({ slug: item.slug })),
      ...workItems.map((item) => ({ slug: item.slug as string })),
    ];
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      console.error("generateStaticParams failed for /lab/[slug], using empty params:", error);
    }

    return [];
  }
}

async function getLabEntryBySlug(slug: string) {
  try {
    const project = await prisma.labProject.findFirst({
      where: {
        slug,
        publishedAt: { not: null },
      },
    });

    if (project) {
      const updatedProject = await prisma.labProject.update({
        where: { id: project.id },
        data: { views: { increment: 1 } },
      });
      return { kind: "project" as const, data: updatedProject };
    }

    const article = await prisma.labArticle.findFirst({
      where: {
        slug,
        publishedAt: { not: null },
      },
    });

    if (article) {
      const updatedArticle = await prisma.labArticle.update({
        where: { id: article.id },
        data: { views: { increment: 1 } },
      });
      return { kind: "article" as const, data: updatedArticle };
    }
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }
  }

  try {
    const workItem = await prisma.clientWork.findFirst({
      where: {
        slug,
        publishedAt: { not: null },
      },
    });
    if (workItem) {
      return { kind: "client-work" as const, data: workItem };
    }
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }
  }

  return null;
}

async function getLabNavigation(slug: string) {
  try {
    const [projects, articles, workItems] = await Promise.all([
      prisma.labProject.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true, title: true, titleFr: true, publishedAt: true },
      }),
      prisma.labArticle.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true, title: true, titleFr: true, publishedAt: true },
      }),
      prisma.clientWork.findMany({
        where: {
          slug: { not: null },
          publishedAt: { not: null },
        },
        select: { slug: true, title: true, titleFr: true, publishedAt: true },
      }),
    ]);

    const entries = [...projects, ...articles, ...workItems].sort(
      (a, b) => getPublishedTime(b.publishedAt?.toISOString()) - getPublishedTime(a.publishedAt?.toISOString())
    );
    const index = entries.findIndex((entry) => entry.slug === slug);
    if (index >= 0) {
      return {
        previous: entries[index - 1] ?? null,
        next: entries[index + 1] ?? null,
      };
    }
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }
  }

  return { previous: null, next: null };
}

export async function generateMetadata({ params }: LabDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getLabEntryBySlug(slug);

  if (entry?.kind === "project") {
    const project = entry.data;
    return {
      title: `${project.title} | Lab | MAC TECH`,
      description: project.summary,
    };
  }

  if (entry?.kind === "article") {
    const article = entry.data;
    return {
      title: `${article.title} | Lab | MAC TECH`,
      description: article.excerpt,
    };
  }

  if (entry?.kind === "client-work") {
    const clientWorkItem = entry.data;
    return {
      title: `${clientWorkItem.title} | Lab | MAC TECH`,
      description: clientWorkItem.description,
    };
  }

  return {
    title: "Not Found | Lab | MAC TECH",
  };
}

function toIsoString(value?: string | Date | null) {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return undefined;
  }

  return parsedDate.toISOString();
}

function getPublishedTime(publishedAt?: string | Date | null) {
  const parsedDate = parseDate(publishedAt);
  return parsedDate ? parsedDate.getTime() : 0;
}

function parseDate(value?: string | Date | null) {
  if (!value) {
    return null;
  }

  const parsedDate = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export default async function LabDetailPage({ params }: LabDetailPageProps) {
  const { slug } = await params;
  const entry = await getLabEntryBySlug(slug);
  const navigation = await getLabNavigation(slug);

  if (entry?.kind === "project") {
    const project = {
      ...entry.data,
      demoUrl: entry.data.demoUrl ?? undefined,
      repoUrl: entry.data.repoUrl ?? undefined,
      publishedAt: toIsoString(entry.data.publishedAt),
    };

    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 lg:px-8">
        <GsapSection animation="fade-up" delay={0.05}>
          <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-2">
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span><Tx en="Back to Lab" fr="Retour au Lab" /></span>
            </Link>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
              <Tx en="Lab / Project Details" fr="Lab / Détails du Projet" />
            </div>
          </div>
        </GsapSection>

        <GsapSection animation="fade-up" delay={0.1}>
          <ProjectSpec project={project} />
        </GsapSection>

        <GsapSection animation="fade-up" delay={0.2}>
          <div className="grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2 mt-4">
            {navigation.previous ? (
              <Link
                href={`/lab/${navigation.previous.slug}`}
                className="group flex flex-col justify-between gap-2 rounded-xl border border-border/70 bg-card/40 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <ChevronLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span><Tx en="Previous Entry" fr="Entrée Précédente" /></span>
                </div>
                <span className="font-medium text-foreground leading-snug wrap-break-word">
                  <Tx en={navigation.previous.title} fr={navigation.previous.titleFr || navigation.previous.title} />
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {navigation.next ? (
              <Link
                href={`/lab/${navigation.next.slug}`}
                className="group flex flex-col justify-between gap-2 rounded-xl border border-border/70 bg-card/40 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 sm:text-right sm:items-end"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span><Tx en="Next Entry" fr="Entrée Suivante" /></span>
                  <ChevronRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <span className="font-medium text-foreground leading-snug wrap-break-word">
                  <Tx en={navigation.next.title} fr={navigation.next.titleFr || navigation.next.title} />
                </span>
              </Link>
            ) : null}
          </div>
        </GsapSection>
      </main>
    );
  }

  if (entry?.kind === "article") {
    const article = {
      ...entry.data,
      publishedAt: toIsoString(entry.data.publishedAt),
    };

    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 lg:px-8">
        <GsapSection animation="fade-up" delay={0.05}>
          <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-2">
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span><Tx en="Back to Lab" fr="Retour au Lab" /></span>
            </Link>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
              <Tx en="Lab / Article Details" fr="Lab / Détails de l'Article" />
            </div>
          </div>
        </GsapSection>

        <GsapSection animation="fade-up" delay={0.1}>
          <ArticleSpec article={article} />
        </GsapSection>

        <GsapSection animation="fade-up" delay={0.2}>
          <div className="grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2 mt-4">
            {navigation.previous ? (
              <Link
                href={`/lab/${navigation.previous.slug}`}
                className="group flex flex-col justify-between gap-2 rounded-xl border border-border/70 bg-card/40 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <ChevronLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span><Tx en="Previous Entry" fr="Entrée Précédente" /></span>
                </div>
                <span className="font-medium text-foreground leading-snug wrap-break-word">
                  <Tx en={navigation.previous.title} fr={navigation.previous.titleFr || navigation.previous.title} />
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {navigation.next ? (
              <Link
                href={`/lab/${navigation.next.slug}`}
                className="group flex flex-col justify-between gap-2 rounded-xl border border-border/70 bg-card/40 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 sm:text-right sm:items-end"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span><Tx en="Next Entry" fr="Entrée Suivante" /></span>
                  <ChevronRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <span className="font-medium text-foreground leading-snug wrap-break-word">
                  <Tx en={navigation.next.title} fr={navigation.next.titleFr || navigation.next.title} />
                </span>
              </Link>
            ) : null}
          </div>
        </GsapSection>
      </main>
    );
  }

  if (entry?.kind === "client-work") {
    const clientWorkItem = {
      ...entry.data,
      projectUrl: entry.data.projectUrl ?? undefined,
      slug: entry.data.slug ?? undefined,
      content: entry.data.content ?? undefined,
      publishedAt: toIsoString(entry.data.publishedAt),
    };

    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 lg:px-8">
        <GsapSection animation="fade-up" delay={0.05}>
          <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span><Tx en="Back to Services" fr="Retour aux Services" /></span>
            </Link>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
              <Tx en="Lab / Client Work Details" fr="Lab / Détails du Travail Client" />
            </div>
          </div>
        </GsapSection>

        <GsapSection animation="fade-up" delay={0.1}>
          <ClientWorkSpec clientWorkItem={clientWorkItem} />
        </GsapSection>

        <GsapSection animation="fade-up" delay={0.2}>
          <div className="grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2 mt-4">
            {navigation.previous ? (
              <Link
                href={`/lab/${navigation.previous.slug}`}
                className="group flex flex-col justify-between gap-2 rounded-xl border border-border/70 bg-card/40 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <ChevronLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span><Tx en="Previous Entry" fr="Entrée Précédente" /></span>
                </div>
                <span className="font-medium text-foreground leading-snug wrap-break-word">
                  <Tx en={navigation.previous.title} fr={navigation.previous.titleFr || navigation.previous.title} />
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {navigation.next ? (
              <Link
                href={`/lab/${navigation.next.slug}`}
                className="group flex flex-col justify-between gap-2 rounded-xl border border-border/70 bg-card/40 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 sm:text-right sm:items-end"
              >
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span><Tx en="Next Entry" fr="Entrée Suivante" /></span>
                  <ChevronRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <span className="font-medium text-foreground leading-snug wrap-break-word">
                  <Tx en={navigation.next.title} fr={navigation.next.titleFr || navigation.next.title} />
                </span>
              </Link>
            ) : null}
          </div>
        </GsapSection>
      </main>
    );
  }

  notFound();
}
