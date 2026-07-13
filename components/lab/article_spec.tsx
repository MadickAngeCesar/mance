import Image from "next/image";
import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown_renderer";
import { LikeButton } from "@/components/lab/like_button";
import type { LabArticle } from "@/lib/definitions";

type ArticleSpecProps = {
	article: LabArticle;
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

export function ArticleSpec({ article }: ArticleSpecProps) {
	const isPlaceholder = article.tags.includes("placeholder") || article.category.toLowerCase() === "placeholder";
	const publishedOn = formatDate(article.publishedAt);
	const readingTimeMinutes = Math.ceil(article.content.split(/\s+/).length / 200);

	return (
		<article className="space-y-6 sm:space-y-8">
			<header className="space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="rounded-full">
						Article
					</Badge>
					{isPlaceholder ? (
						<Badge variant="secondary" className="rounded-full">
							Placeholder Preview
						</Badge>
					) : null}
					<Badge variant="secondary" className="rounded-full">
						{article.category}
					</Badge>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{article.title}</h1>
				<p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{article.excerpt}</p>
			</header>

			<div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
				<aside className="space-y-5 order-first lg:order-last lg:col-span-4 lg:sticky lg:top-24 self-start">
					<div className="relative h-56 overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-72 lg:h-80">
						<Image
							src={article.coverImageUrl}
							alt={`${article.title} cover image`}
							fill
							sizes="(min-width: 1024px) 33vw, 100vw"
							className="object-cover"
							priority
						/>
					</div>

					<Card className="border-border/80">
						<CardContent className="space-y-3 pt-4">
							{publishedOn ? (
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<CalendarDays className="size-3.5" />
									{publishedOn}
								</div>
							) : null}
							<div className="text-xs text-muted-foreground flex flex-col gap-3">
								<span>~{readingTimeMinutes} min read • {article.views.toLocaleString()} views</span>
								<div className="pt-1">
									<LikeButton id={article.id} initialLikes={article.likes} kind="article" />
								</div>
							</div>
						</CardContent>
					</Card>
				</aside>

				<section className="space-y-5 order-last lg:order-first lg:col-span-8">
					<Card className="border-border/80">
						<CardContent className="pt-4">
							<MarkdownRenderer content={article.content} />
						</CardContent>
					</Card>

					{article.tags.length > 0 ? (
						<div className="flex flex-wrap gap-1.5">
							{article.tags.map((tag) => (
								<Badge key={`${article.id}-${tag}`} variant="outline" className="rounded-full">
									#{tag}
								</Badge>
							))}
						</div>
					) : null}
				</section>
			</div>
		</article>
	);
}