import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ExternalLink, Github } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown_renderer";
import { Tx } from "@/components/i18n/tx";
import { LikeButton } from "@/components/lab/like_button";
import type { LabProject } from "@/lib/definitions";

type ProjectSpecProps = {
	project: LabProject;
};

function formatDate(value?: string) {
	if (!value) {
		return null;
	}

	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) {
		return null;
	}

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(parsedDate);
}

export function ProjectSpec({ project }: ProjectSpecProps) {
	const isPlaceholder = project.tags.includes("placeholder");
	const publishedOn = formatDate(project.publishedAt);

	return (
		<article className="space-y-6 sm:space-y-8">
			<header className="space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="rounded-full">
						Project
					</Badge>
					{isPlaceholder ? (
						<Badge variant="secondary" className="rounded-full">
							Placeholder Preview
						</Badge>
					) : null}
					{project.featured ? <Badge className="rounded-full">Featured</Badge> : null}
				</div>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
				<p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{project.summary}</p>
			</header>

			<div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
				<aside className="space-y-5 order-first lg:order-last lg:col-span-4 lg:sticky lg:top-24 self-start">
					<div className="relative h-56 overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-72 lg:h-80">
						<Image
							src={project.coverImageUrl}
							alt={`${project.title} cover image`}
							fill
							sizes="(min-width: 1024px) 33vw, 100vw"
							className="object-cover"
							priority
						/>
					</div>

					<Card className="border-border/80">
						<CardContent className="space-y-4 pt-4">
							<div>
								<p className="text-xs uppercase tracking-wide text-muted-foreground">Tech stack</p>
								<div className="mt-2 flex flex-wrap gap-1.5">
									{project.stack.map((tech) => (
										<Badge key={`${project.id}-${tech}`} variant="secondary" className="rounded-full">
											{tech}
										</Badge>
									))}
								</div>
							</div>
							{publishedOn ? (
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<CalendarDays className="size-3.5" />
									Published {publishedOn}
								</div>
							) : null}
							<div className="text-xs text-muted-foreground flex flex-col gap-3">
								<span>{project.views.toLocaleString()} views</span>
								<div>
									<LikeButton id={project.id} initialLikes={project.likes} kind="project" />
								</div>
							</div>
							<div className="flex flex-col gap-2">
								{project.demoUrl ? (
									<Button asChild className="w-full justify-between">
										<Link href={project.demoUrl} target="_blank" rel="noreferrer noopener">
											Live Demo <ExternalLink className="size-3.5" />
										</Link>
									</Button>
								) : null}
								{project.repoUrl ? (
									<Button asChild variant="outline" className="w-full justify-between">
										<Link href={project.repoUrl} target="_blank" rel="noreferrer noopener">
											Source Code <Github className="size-3.5" />
										</Link>
									</Button>
								) : null}
							</div>
						</CardContent>
					</Card>
				</aside>

				<section className="space-y-5 order-last lg:order-first lg:col-span-8">
					{(project.problem || project.solution) ? (
						<div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-border/80 bg-card/10 p-5 leading-relaxed">
							{project.problem && (
								<div className="space-y-1.5 border-l-2 border-rose-500/40 pl-4">
									<h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
										<Tx en="Problem Context" fr="Contexte du Problème" />
									</h3>
									<p className="text-xs leading-relaxed text-muted-foreground">
										<Tx en={project.problem} fr={project.problem} />
									</p>
								</div>
							)}
							{project.solution && (
								<div className="space-y-1.5 border-l-2 border-emerald-500/40 pl-4">
									<h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
										<Tx en="Solution Delivered" fr="Solution Livrée" />
									</h3>
									<p className="text-xs leading-relaxed text-muted-foreground">
										<Tx en={project.solution} fr={project.solution} />
									</p>
								</div>
							)}
						</div>
					) : null}

					<Card className="border-border/80">
						<CardContent className="pt-4">
							<MarkdownRenderer content={project.content} />
						</CardContent>
					</Card>

					{project.tags.length > 0 ? (
						<div className="flex flex-wrap gap-1.5">
							{project.tags.map((tag) => (
								<Badge key={`${project.id}-${tag}`} variant="outline" className="rounded-full">
									#{tag}
								</Badge>
							))}
						</div>
					) : null}
				</section>
			</div>

			{project.screenshotUrls.length ? (
				<section className="space-y-3">
					<h2 className="text-xl font-semibold tracking-tight">Screenshots</h2>
					<div className="grid gap-3 sm:grid-cols-2">
						{project.screenshotUrls.map((screenshot, index) => (
							<div key={screenshot} className="space-y-2">
								<div className="relative h-44 overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-56 lg:h-64">
									<Image
										src={screenshot}
										alt={`${project.title} screenshot ${index + 1}`}
										fill
										sizes="(min-width: 640px) 50vw, 100vw"
										className="object-cover"
									/>
								</div>
								<p className="text-xs text-muted-foreground">Screenshot {index + 1}</p>
							</div>
						))}
					</div>
				</section>
			) : null}
		</article>
	);
}
