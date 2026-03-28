import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleSpec } from "@/components/lab/article_spec";
import { ClientWorkSpec } from "@/components/lab/client_work_spec";
import { ProjectSpec } from "@/components/lab/project_spec";
import { prisma } from "@/lib/prisma";
import { clientWork, labArticles, labProjects } from "@/lib/placeholder-data";
import { isDatabaseUnavailableError } from "@/lib/api-utils";

type LabDetailPageProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [
    ...labProjects.map((project) => ({ slug: project.slug })),
    ...labArticles.map((article) => ({ slug: article.slug })),
    ...clientWork
      .filter((item) => Boolean(item.slug))
      .map((item) => ({ slug: item.slug as string })),
  ];
}

async function getLabEntryBySlug(slug: string) {
  try {
    const [project, article] = await Promise.all([
      prisma.labProject.findUnique({ where: { slug } }),
      prisma.labArticle.findUnique({ where: { slug } }),
    ]);

    if (project && project.publishedAt) {
      return { kind: "project" as const, data: project };
    }

    if (article && article.publishedAt) {
      return { kind: "article" as const, data: article };
    }
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }
  }

  const fallbackProject = labProjects.find((item) => item.slug === slug);
  if (fallbackProject) {
    return { kind: "project" as const, data: fallbackProject };
  }

  const fallbackArticle = labArticles.find((item) => item.slug === slug);
  if (fallbackArticle) {
    return { kind: "article" as const, data: fallbackArticle };
  }

  const fallbackClientWork = clientWork.find((item) => item.slug === slug);
  if (fallbackClientWork) {
    return { kind: "client-work" as const, data: fallbackClientWork };
  }

  return null;
}

async function getLabNavigation(slug: string) {
  try {
    const [projects, articles] = await Promise.all([
      prisma.labProject.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true, title: true, publishedAt: true },
      }),
      prisma.labArticle.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true, title: true, publishedAt: true },
      }),
    ]);

    const entries = [...projects, ...articles].sort(
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

  const fallbackEntries = [
    ...labProjects.map((project) => ({ slug: project.slug, title: project.title, publishedAt: project.publishedAt })),
    ...labArticles.map((article) => ({ slug: article.slug, title: article.title, publishedAt: article.publishedAt })),
    ...clientWork
      .filter((item) => Boolean(item.slug))
      .map((item) => ({ slug: item.slug as string, title: item.title, publishedAt: item.publishedAt })),
  ].sort((a, b) => getPublishedTime(b.publishedAt) - getPublishedTime(a.publishedAt));

  const fallbackIndex = fallbackEntries.findIndex((entry) => entry.slug === slug);
  if (fallbackIndex < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: fallbackEntries[fallbackIndex - 1] ?? null,
    next: fallbackEntries[fallbackIndex + 1] ?? null,
  };
}

export async function generateMetadata({ params }: LabDetailPageProps): Promise<Metadata> {
  const entry = await getLabEntryBySlug(params.slug);

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

function getPublishedTime(publishedAt?: string) {
  return publishedAt ? new Date(publishedAt).getTime() : 0;
}

export default async function LabDetailPage({ params }: LabDetailPageProps) {
  const entry = await getLabEntryBySlug(params.slug);
  const navigation = await getLabNavigation(params.slug);

  if (entry?.kind === "project") {
    const project = {
      ...entry.data,
      demoUrl: entry.data.demoUrl ?? undefined,
      repoUrl: entry.data.repoUrl ?? undefined,
      publishedAt: entry.data.publishedAt ? entry.data.publishedAt.toISOString() : undefined,
    };

    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ProjectSpec project={project} />
        <div className="grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
          {navigation.previous ? (
            <Link href={`/lab/${navigation.previous.slug}`} className="rounded-lg border border-border/70 p-3 text-sm hover:bg-muted/40">
              <span className="block text-xs text-muted-foreground">Previous</span>
              <span className="font-medium">{navigation.previous.title}</span>
            </Link>
          ) : <div />}
          {navigation.next ? (
            <Link href={`/lab/${navigation.next.slug}`} className="rounded-lg border border-border/70 p-3 text-sm hover:bg-muted/40 sm:text-right">
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="font-medium">{navigation.next.title}</span>
            </Link>
          ) : null}
        </div>
      </main>
    );
  }

  if (entry?.kind === "article") {
    const article = {
      ...entry.data,
      publishedAt: entry.data.publishedAt ? entry.data.publishedAt.toISOString() : undefined,
    };

    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ArticleSpec article={article} />
        <div className="grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
          {navigation.previous ? (
            <Link href={`/lab/${navigation.previous.slug}`} className="rounded-lg border border-border/70 p-3 text-sm hover:bg-muted/40">
              <span className="block text-xs text-muted-foreground">Previous</span>
              <span className="font-medium">{navigation.previous.title}</span>
            </Link>
          ) : <div />}
          {navigation.next ? (
            <Link href={`/lab/${navigation.next.slug}`} className="rounded-lg border border-border/70 p-3 text-sm hover:bg-muted/40 sm:text-right">
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="font-medium">{navigation.next.title}</span>
            </Link>
          ) : null}
        </div>
      </main>
    );
  }

  if (entry?.kind === "client-work") {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ClientWorkSpec clientWorkItem={entry.data} />
        <div className="grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
          {navigation.previous ? (
            <Link href={`/lab/${navigation.previous.slug}`} className="rounded-lg border border-border/70 p-3 text-sm hover:bg-muted/40">
              <span className="block text-xs text-muted-foreground">Previous</span>
              <span className="font-medium">{navigation.previous.title}</span>
            </Link>
          ) : <div />}
          {navigation.next ? (
            <Link href={`/lab/${navigation.next.slug}`} className="rounded-lg border border-border/70 p-3 text-sm hover:bg-muted/40 sm:text-right">
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="font-medium">{navigation.next.title}</span>
            </Link>
          ) : null}
        </div>
      </main>
    );
  }

  notFound();
}
