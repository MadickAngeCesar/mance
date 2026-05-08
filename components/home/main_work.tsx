import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import { mainWorkHighlights as fallbackWork, labProjects as fallbackProjects, labArticles as fallbackArticles } from "@/lib/placeholder-data";

type MainWorkItem = {
	id: string;
	title: string;
	titleFr: string | null;
	kind: string;
	summary: string;
	summaryFr: string | null;
	href: string;
	featured: boolean;
	imageUrl: string;
};

export async function MainWork() {
	let mainWorkHighlights: MainWorkItem[] = [];

	try {
		const rows = await prisma.mainWorkHighlight.findMany({
			orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
		});
		mainWorkHighlights = rows.map((item) => ({
			id: item.id,
			title: item.title,
			titleFr: item.titleFr,
			kind: item.kind,
			summary: item.summary,
			summaryFr: item.summaryFr,
			href: item.href,
			featured: item.featured,
			imageUrl: item.imageUrl,
		}));
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Main work highlights query failed, using fallback content:", error);
		}
	}

	let fallbackItems: [any[], any[]] = [[], []];

	if (mainWorkHighlights.length === 0) {
		try {
			fallbackItems = await Promise.all([
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
			]);
		} catch (error) {
			if (!isDatabaseUnavailableError(error)) {
				console.error("Main work fallback query failed:", error);
			}
		}
	}

	const [labProjects, labArticles] = fallbackItems;

	let items: MainWorkItem[] = mainWorkHighlights;

    if (items.length === 0 && labProjects.length === 0 && labArticles.length === 0) {
        // Full fallback to placeholder-data
        items = fallbackWork.map(item => ({
            ...item,
            titleFr: item.titleFr || item.title,
            summaryFr: item.summaryFr || item.summary,
            kind: item.kind.toUpperCase()
        }));
    } else if (items.length === 0) {
        items = [
            ...labProjects.map((item) => ({
                id: item.id,
                title: item.title,
                titleFr: item.titleFr,
                kind: "PROJECT",
                summary: item.summary,
                summaryFr: item.summaryFr,
                href: `/lab/${item.slug}`,
                featured: item.featured,
                imageUrl: item.coverImageUrl || "/images/Profile.jpg",
            })),
            ...labArticles.map((item) => ({
                id: item.id,
                title: item.title,
                titleFr: item.titleFr,
                kind: "ARTICLE",
                summary: item.excerpt,
                summaryFr: item.excerptFr,
                href: `/lab/${item.slug}`,
                featured: item.featured,
                imageUrl: item.coverImageUrl || "/images/Profile.jpg",
            })),
        ].sort((a, b) => Number(b.featured) - Number(a.featured));
    }

	return (
		<section className="space-y-5">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">
                    <Tx en="Main Work" fr="Travail Principal" />
                </h2>
				<p className="mt-1 text-sm text-muted-foreground">
                    <Tx
                        en="Featured projects, client work, and articles."
                        fr="Projets mis en avant, travaux clients et articles."
                    />
                </p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{items.map((item, index) => (
					<Card
						key={item.id}
						className={`overflow-hidden border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 ${index >= 3 ? "hidden lg:flex flex-col" : "flex flex-col"}`}
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
									<Tx
                                        en={item.kind.replace("_", " ").toLowerCase()}
                                        fr={
                                            item.kind === "PROJECT" ? "Projet" :
                                            item.kind === "CLIENT_WORK" ? "Travail Client" :
                                            "Article"
                                        }
                                    />
								</Badge>
								{item.featured ? (
                                    <Badge className="rounded-full">
                                        <Tx en="Featured" fr="Mis en avant" />
                                    </Badge>
                                ) : null}
							</div>
							<CardTitle className="pt-2 text-lg">
                                <Tx en={item.title} fr={item.titleFr || item.title} />
                            </CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm leading-6 text-muted-foreground">
                                <Tx en={item.summary} fr={item.summaryFr || item.summary} />
                            </p>
							<Link className="text-sm font-medium underline-offset-4 hover:underline" href={item.href}>
								<Tx en="Open details" fr="Voir les détails" />
							</Link>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
