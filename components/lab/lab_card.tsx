import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tx } from "@/components/i18n/tx";

type LabCardProps = {
	title: string;
	titleFr?: string;
	summary: string;
	summaryFr?: string;
	href: string;
	coverImageUrl: string;
	tags: string[];
	kind: "project" | "article";
	featured?: boolean;
	views: number;
	meta: string;
	publishedAt?: string;
};

export function LabCard({ title, titleFr, summary, summaryFr, href, coverImageUrl, tags, kind, featured = false, views, meta, publishedAt }: LabCardProps) {
	const normalizedCoverImageUrl = (() => {
		if (!coverImageUrl) {
			return "/images/Profile.jpg";
		}

		if (coverImageUrl.startsWith("/")) {
			return coverImageUrl;
		}

		try {
			const parsed = new URL(coverImageUrl);
			if (
				parsed.hostname === "localhost" ||
				parsed.hostname === "127.0.0.1" ||
				parsed.hostname === "mance.dev" ||
				parsed.hostname === "www.mance.dev"
			) {
				return `${parsed.pathname}${parsed.search}`;
			}
		} catch {
			return coverImageUrl;
		}

		return coverImageUrl;
	})();

	const formattedDate = publishedAt
		? new Date(publishedAt).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			timeZone: "UTC",
		})
		: null;

	return (
		<Card className="h-full border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10">
			<div className="relative h-44 w-full border-b border-border/60 bg-muted/40">
				<Image
					src={normalizedCoverImageUrl}
					alt={`${title} cover image`}
					fill
					sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					className="object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
				/>
			</div>
			<CardHeader className="space-y-2">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="rounded-full capitalize">
						<Tx en={kind} fr={kind === "project" ? "projet" : "article"} />
					</Badge>
					{featured ? <Badge className="rounded-full"><Tx en="Featured" fr="Mis en avant" /></Badge> : null}
				</div>
				<CardTitle className="text-lg">
					<Tx en={title} fr={titleFr || title} />
				</CardTitle>
				<p className="text-xs text-muted-foreground">
					{meta}
					{formattedDate ? ` · ${formattedDate}` : ""} · {views.toLocaleString()} <Tx en="views" fr="vues" />
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm leading-6 text-muted-foreground">
					<Tx en={summary} fr={summaryFr || summary} />
				</p>
				<div className="flex flex-wrap gap-1.5">
					{tags.map((tag) => (
						<Badge key={`${title}-${tag}`} variant="secondary" className="rounded-full text-[11px]">
							{tag}
						</Badge>
					))}
				</div>
				<Link href={href} className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
					<Tx en="Read details" fr="Voir les détails" /> <ArrowUpRight className="size-3.5" />
				</Link>
			</CardContent>
		</Card>
	);
}
