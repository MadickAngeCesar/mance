import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LabCardProps = {
	title: string;
	summary: string;
	href: string;
	coverImageUrl: string;
	tags: string[];
	kind: "project" | "article";
	featured?: boolean;
	views: number;
	meta: string;
};

export function LabCard({ title, summary, href, coverImageUrl, tags, kind, featured = false, views, meta }: LabCardProps) {
	return (
		<Card className="h-full border-border/80">
			<div className="relative h-44 w-full border-b border-border/60 bg-muted/40">
				<Image src={coverImageUrl} alt={`${title} cover image`} fill className="object-cover" />
			</div>
			<CardHeader className="space-y-2">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="rounded-full capitalize">
						{kind}
					</Badge>
					{featured ? <Badge className="rounded-full">Featured</Badge> : null}
				</div>
				<CardTitle className="text-lg">{title}</CardTitle>
				<p className="text-xs text-muted-foreground">{meta} · {views.toLocaleString()} views</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm leading-6 text-muted-foreground">{summary}</p>
				<div className="flex flex-wrap gap-1.5">
					{tags.map((tag) => (
						<Badge key={`${title}-${tag}`} variant="secondary" className="rounded-full text-[11px]">
							{tag}
						</Badge>
					))}
				</div>
				<Link href={href} className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
					Read details <ArrowUpRight className="size-3.5" />
				</Link>
			</CardContent>
		</Card>
	);
}
