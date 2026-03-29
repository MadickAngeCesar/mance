import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export async function MainWork() {
	const mainWorkHighlights = await prisma.mainWorkHighlight.findMany({
		orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
	});

	const fallbackItems =
		mainWorkHighlights.length === 0
			? await Promise.all([
					prisma.labProject.findMany({
						where: { publishedAt: { not: null } },
						orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
						take: 3,
					}),
					prisma.labArticle.findMany({
						where: { publishedAt: { not: null } },
						orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
						take: 3,
					}),
				])
			: [[], []];

	const [fallbackProjects, fallbackArticles] = fallbackItems;

	const items =
		mainWorkHighlights.length > 0
			? mainWorkHighlights
			: [
					...fallbackProjects.map((item) => ({
						id: item.id,
						title: item.title,
						kind: "PROJECT",
						summary: item.summary,
						href: `/lab/${item.slug}`,
						featured: item.featured,
						imageUrl: item.coverImageUrl || "/images/Profile.jpg",
					})),
					...fallbackArticles.map((item) => ({
						id: item.id,
						title: item.title,
						kind: "ARTICLE",
						summary: item.excerpt,
						href: `/lab/${item.slug}`,
						featured: item.featured,
						imageUrl: item.coverImageUrl || "/images/Profile.jpg",
					})),
				].sort((a, b) => Number(b.featured) - Number(a.featured));

	return (
		<section className="space-y-5">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">Main Work</h2>
				<p className="mt-1 text-sm text-muted-foreground">Featured projects, client work, and articles.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{items.length === 0 ? (
					<p className="text-sm text-muted-foreground md:col-span-3">No featured work has been published yet.</p>
				) : null}
				{items.map((item, index) => (
					<Card
						key={item.id}
						className={`overflow-hidden border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 ${index >= 3 ? "hidden lg:flex" : "flex"}`}
					>
						<div className="relative h-40 w-full border-b border-border/60 bg-muted/40">
							<Image
								src={item.imageUrl}
								alt={`${item.title} preview image`}
								fill
								sizes="(min-width: 768px) 33vw, 100vw"
								className="object-contain p-4 transition-transform duration-300 group-hover/card:scale-[1.02]"
							/>
						</div>
						<CardHeader>
							<div className="flex items-center justify-between gap-3">
								<Badge variant="outline" className="rounded-full capitalize">
									{item.kind.replace("_", " ").toLowerCase()}
								</Badge>
								{item.featured ? <Badge className="rounded-full">Featured</Badge> : null}
							</div>
							<CardTitle className="pt-2 text-lg">{item.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm leading-6 text-muted-foreground">{item.summary}</p>
							<Link className="text-sm font-medium underline-offset-4 hover:underline" href={item.href}>
								Open details
							</Link>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
