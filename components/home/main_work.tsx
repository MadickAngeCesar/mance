import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";



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
	const items: MainWorkItem[] = [];

	try {
        const [labResult, clientWorkResult, labArticleResult] = await Promise.all([
            prisma.labProject.findMany({
                where: { publishedAt: { not: null } },
                take: 1,
                orderBy: { publishedAt: 'desc' }
            }),
            prisma.clientWork.findMany({
                where: { publishedAt: { not: null } },
                take: 1,
                orderBy: { publishedAt: 'desc' }
            }),
            prisma.labArticle.findMany({
                where: { publishedAt: { not: null } },
                take: 1,
                orderBy: { publishedAt: 'desc' }
            })
        ]);

        if (labResult[0]) {
            items.push({
                id: labResult[0].id,
                title: labResult[0].title,
                titleFr: labResult[0].titleFr,
                kind: "PROJECT",
                summary: labResult[0].summary,
                summaryFr: labResult[0].summaryFr,
                href: `/lab/${labResult[0].slug}`,
                featured: labResult[0].featured,
                imageUrl: labResult[0].coverImageUrl || "/images/Profile.jpg",
            });
        }

        if (clientWorkResult[0]) {
            items.push({
                id: clientWorkResult[0].id,
                title: clientWorkResult[0].title,
                titleFr: clientWorkResult[0].titleFr,
                kind: "CLIENT_WORK",
                summary: clientWorkResult[0].description,
                summaryFr: clientWorkResult[0].descriptionFr,
                href: clientWorkResult[0].slug ? `/lab/${clientWorkResult[0].slug}` : `/services`,
                featured: false,
                imageUrl: clientWorkResult[0].imageUrl || "/images/Profile.jpg",
            });
        }

        if (labArticleResult[0]) {
            items.push({
                id: labArticleResult[0].id,
                title: labArticleResult[0].title,
                titleFr: labArticleResult[0].titleFr,
                kind: "ARTICLE",
                summary: labArticleResult[0].excerpt,
                summaryFr: labArticleResult[0].excerptFr,
                href: `/lab/${labArticleResult[0].slug}`,
                featured: false,
                imageUrl: labArticleResult[0].coverImageUrl || "/images/Profile.jpg",
            });
        }
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Main work query failed:", error);
		}
	}

	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    <Tx en="Recent Work" fr="Travaux Récents" />
                </h2>
				<p className="mt-1 text-sm text-muted-foreground">
                    <Tx
                        en="Recent projects, client work, and articles."
                        fr="Projets récents, travaux clients et articles."
                    />
                </p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{items.map((item) => (
					<Card
						key={item.id}
						className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
					>
						<div className="relative h-44 w-full overflow-hidden border-b border-border/60 bg-muted/20">
							<Image
								src={item.imageUrl}
								alt={`${item.title} preview image`}
								fill
								sizes="(min-width: 768px) 33vw, 100vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent opacity-60" />
						</div>

						<CardHeader className="space-y-2 pb-2">
							<div className="flex items-center justify-between gap-3">
								<Badge variant="outline" className="rounded-full capitalize text-[10px] bg-secondary/20 border-border/60">
									<Tx
										en={item.kind.replace("_", " ").toLowerCase()}
										fr={
											item.kind === "PROJECT" ? "Projet" :
											item.kind === "CLIENT_WORK" ? "Travail Client" :
											"Article"
										}
									/>
								</Badge>
								{item.featured && (
									<Badge className="rounded-full text-[10px] bg-primary/10 border-primary/20 text-primary uppercase">
										<Tx en="Featured" fr="Vedette" />
									</Badge>
								)}
							</div>
							<CardTitle className="pt-1 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
								<Tx en={item.title} fr={item.titleFr || item.title} />
							</CardTitle>
						</CardHeader>

						<CardContent className="flex flex-1 flex-col justify-between space-y-4 pt-0">
							<p className="text-xs leading-relaxed text-muted-foreground flex-1 line-clamp-3">
								<Tx en={item.summary} fr={item.summaryFr || item.summary} />
							</p>
							<div className="pt-2">
								<Button
									asChild
									className="w-full justify-between group/btn bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300"
								>
									<Link href={item.href}>
										<span className="font-semibold text-xs tracking-wide uppercase">
											<Tx en="Open details" fr="Voir les détails" />
										</span>
										<ChevronRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
