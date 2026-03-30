import Image from "next/image";
import { CalendarDays } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
		<article className="space-y-8">
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

			<div className="grid gap-8 md:grid-cols-3">
				<aside className="space-y-5 md:col-span-1">
					<div className="relative h-64 overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-72 md:h-80">
						<Image
							src={article.coverImageUrl}
							alt={`${article.title} cover image`}
							fill
							sizes="(min-width: 1024px) 30vw, 100vw"
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
							<div className="text-xs text-muted-foreground">
								~{readingTimeMinutes} min read • {article.views.toLocaleString()} views
							</div>
						</CardContent>
					</Card>
				</aside>

				<section className="space-y-5 md:col-span-2">
					<Card className="border-border/80">
						<CardContent className="prose prose-sm max-w-none pt-4 text-muted-foreground dark:prose-invert sm:prose-base">
							<ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
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