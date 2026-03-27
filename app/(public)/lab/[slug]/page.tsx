import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleSpec } from "@/components/lab/article_spec";
import { ClientWorkSpec } from "@/components/lab/client_work_spec";
import { ProjectSpec } from "@/components/lab/project_spec";
import { clientWork, labArticles, labProjects } from "@/lib/placeholder-data";

type LabDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return [
    ...labProjects.map((project) => ({ slug: project.slug })),
    ...labArticles.map((article) => ({ slug: article.slug })),
    ...clientWork
      .filter((item) => Boolean(item.slug))
      .map((item) => ({ slug: item.slug as string })),
  ];
}

export function generateMetadata({ params }: LabDetailPageProps): Metadata {
  const project = labProjects.find((item) => item.slug === params.slug);
  if (project) {
    return {
      title: `${project.title} | Lab | MAC TECH`,
      description: project.summary,
    };
  }

  const article = labArticles.find((item) => item.slug === params.slug);
  if (article) {
    return {
      title: `${article.title} | Lab | MAC TECH`,
      description: article.excerpt,
    };
  }

  const clientWorkItem = clientWork.find((item) => item.slug === params.slug);
  if (clientWorkItem) {
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

function getLabNavigation(slug: string) {
  const entries = [
    ...labProjects.map((project) => ({ slug: project.slug, title: project.title, publishedAt: project.publishedAt })),
    ...labArticles.map((article) => ({ slug: article.slug, title: article.title, publishedAt: article.publishedAt })),
    ...clientWork
      .filter((item) => Boolean(item.slug))
      .map((item) => ({
        slug: item.slug as string,
        title: item.title,
        publishedAt: item.publishedAt,
      })),
  ].sort((a, b) => getPublishedTime(b.publishedAt) - getPublishedTime(a.publishedAt));

  const index = entries.findIndex((entry) => entry.slug === slug);
  if (index < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: entries[index - 1] ?? null,
    next: entries[index + 1] ?? null,
  };
}

export default function LabDetailPage({ params }: LabDetailPageProps) {
  const project = labProjects.find((item) => item.slug === params.slug);
  const navigation = getLabNavigation(params.slug);
  if (project) {
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

  const article = labArticles.find((item) => item.slug === params.slug);
  if (article) {
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

  const clientWorkItem = clientWork.find((item) => item.slug === params.slug);
  if (clientWorkItem) {
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
