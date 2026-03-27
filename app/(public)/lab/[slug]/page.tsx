import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleSpec } from "@/components/lab/article_spec";
import { ProjectSpec } from "@/components/lab/project_spec";
import { labArticles, labProjects } from "@/lib/placeholder-data";

export const metadata: Metadata = {
  title: "Lab | MAC TECH",
};

type LabDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return [
    ...labProjects.map((project) => ({ slug: project.slug })),
    ...labArticles.map((article) => ({ slug: article.slug })),
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

  return {
    title: "Not Found | Lab | MAC TECH",
  };
}

export default function LabDetailPage({ params }: LabDetailPageProps) {
  const project = labProjects.find((item) => item.slug === params.slug);
  if (project) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ProjectSpec project={project} />
      </main>
    );
  }

  const article = labArticles.find((item) => item.slug === params.slug);
  if (article) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ArticleSpec article={article} />
      </main>
    );
  }

  notFound();
}
