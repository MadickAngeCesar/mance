import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { LabArticle } from "@/lib/definitions";

type ArticleSpecProps = {
	article: LabArticle;
};

export function ArticleSpec({ article }: ArticleSpecProps) {
	const isPlaceholder = article.tags.includes("placeholder") || article.category.toLowerCase() === "placeholder";

	return (
		<article className="space-y-6">
			<header className="space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="rounded-full">
						Article
					</Badge>
					{isPlaceholder ? <Badge variant="secondary" className="rounded-full">Placeholder Preview</Badge> : null}
					<Badge variant="secondary" className="rounded-full">
						{article.category}
					</Badge>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{article.title}</h1>
				<p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{article.excerpt}</p>
				<div className="flex flex-wrap gap-1.5">
					{article.tags.map((tag) => (
						<Badge key={`${article.id}-${tag}`} variant="secondary" className="rounded-full">
							{tag}
						</Badge>
					))}
				</div>
				<p className="text-xs text-muted-foreground">{article.views.toLocaleString()} views</p>
			</header>

			<div className="relative h-64 w-full overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-96">
				<Image
					src={article.coverImageUrl}
					alt={`${article.title} cover image`}
					fill
					sizes="(min-width: 1024px) 960px, 100vw"
					className="object-cover"
					priority
				/>
			</div>

			<Card className="border-border/80">
				<CardContent className="pt-1">
					<p className="text-sm leading-7 text-muted-foreground sm:text-base">{article.content}</p>
				</CardContent>
			</Card>
		</article>
	);
}