import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleSpec } from "@/components/lab/article_spec";
import { ClientWorkSpec } from "@/components/lab/client_work_spec";
import { ProjectSpec } from "@/components/lab/project_spec";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/api-utils";

type LabDetailPageProps = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
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

  try {
    const workItem = await prisma.clientWork.findUnique({ where: { slug } });
    if (workItem && workItem.publishedAt) {
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
        select: { slug: true, title: true, publishedAt: true },
      }),
      prisma.labArticle.findMany({
        where: { publishedAt: { not: null } },
        select: { slug: true, title: true, publishedAt: true },
      }),
      prisma.clientWork.findMany({
        where: {
          slug: { not: null },
          publishedAt: { not: null },
        },
        select: { slug: true, title: true, publishedAt: true },
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
  const entry = await getLabEntryBySlug(params.slug);
  const navigation = await getLabNavigation(params.slug);

  if (entry?.kind === "project") {
    const project = {
      ...entry.data,
      demoUrl: entry.data.demoUrl ?? undefined,
      repoUrl: entry.data.repoUrl ?? undefined,
      publishedAt: toIsoString(entry.data.publishedAt),
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
      publishedAt: toIsoString(entry.data.publishedAt),
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
    const clientWorkItem = {
      ...entry.data,
      projectUrl: entry.data.projectUrl ?? undefined,
      slug: entry.data.slug ?? undefined,
      content: entry.data.content ?? undefined,
      publishedAt: toIsoString(entry.data.publishedAt),
    };

    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ClientWorkSpec clientWorkItem={clientWorkItem} />
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
