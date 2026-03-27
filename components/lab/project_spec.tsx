import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LabProject } from "@/lib/definitions";

type ProjectSpecProps = {
	project: LabProject;
};

export function ProjectSpec({ project }: ProjectSpecProps) {
	const isPlaceholder = project.tags.includes("placeholder");

	return (
		<article className="space-y-6">
			<header className="space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="rounded-full">
						Project
					</Badge>
					{isPlaceholder ? <Badge variant="secondary" className="rounded-full">Placeholder Preview</Badge> : null}
					{project.featured ? <Badge className="rounded-full">Featured</Badge> : null}
				</div>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
				<p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{project.summary}</p>
				<div className="flex flex-wrap gap-1.5">
					{project.stack.map((tech) => (
						<Badge key={`${project.id}-${tech}`} variant="secondary" className="rounded-full">
							{tech}
						</Badge>
					))}
				</div>
				<div className="flex flex-wrap gap-2">
					{project.demoUrl ? (
						<Button asChild>
							<Link href={project.demoUrl} target="_blank" rel="noreferrer noopener">
								Live Demo <ExternalLink className="size-3.5" />
							</Link>
						</Button>
					) : null}
					{project.repoUrl ? (
						<Button asChild variant="outline">
							<Link href={project.repoUrl} target="_blank" rel="noreferrer noopener">
								Source Code <Github className="size-3.5" />
							</Link>
						</Button>
					) : null}
				</div>
			</header>

			<div className="relative h-64 w-full overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-96">
				<Image
					src={project.coverImageUrl}
					alt={`${project.title} cover image`}
					fill
					sizes="(min-width: 1024px) 960px, 100vw"
					className="object-cover"
					priority
				/>
			</div>

			<Card className="border-border/80">
				<CardContent className="pt-1">
					<p className="text-sm leading-7 text-muted-foreground sm:text-base">{project.content}</p>
				</CardContent>
			</Card>

			<section className="grid gap-3 sm:grid-cols-2">
				<Card className="border-border/80">
					<CardContent className="space-y-2 pt-1">
						<h2 className="text-base font-semibold tracking-tight">Problem</h2>
						<p className="text-sm leading-6 text-muted-foreground">
							{project.summary}
						</p>
					</CardContent>
				</Card>
				<Card className="border-border/80">
					<CardContent className="space-y-2 pt-1">
						<h2 className="text-base font-semibold tracking-tight">Solution</h2>
						<p className="text-sm leading-6 text-muted-foreground">
							{project.content}
						</p>
					</CardContent>
				</Card>
			</section>

			{project.screenshotUrls.length ? (
				<section className="space-y-3">
					<h2 className="text-xl font-semibold tracking-tight">Screenshots</h2>
					<div className="grid gap-3 sm:grid-cols-2">
						{project.screenshotUrls.map((screenshot) => (
							<div key={screenshot} className="relative h-52 overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-64">
								<Image
									src={screenshot}
									alt={`${project.title} screenshot`}
									fill
									sizes="(min-width: 640px) 50vw, 100vw"
									className="object-cover"
								/>
							</div>
						))}
					</div>
				</section>
			) : null}
		</article>
	);
}
