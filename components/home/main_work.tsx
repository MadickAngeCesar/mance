import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import { labProjects as fallbackProjects, academyResources as fallbackResources, clientWork as fallbackClientWork } from "@/lib/placeholder-data";

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
        const [labResult, clientWorkResult, academyResult] = await Promise.all([
            prisma.labProject.findMany({ take: 1, orderBy: { createdAt: 'desc' } }),
            prisma.clientWork.findMany({ take: 1, orderBy: { createdAt: 'desc' } }),
            prisma.academyResource.findMany({ take: 1, orderBy: { createdAt: 'desc' } })
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
        } else if (fallbackProjects[0]) {
            items.push({
                id: fallbackProjects[0].id,
                title: fallbackProjects[0].title,
                titleFr: fallbackProjects[0].titleFr || null,
                kind: "PROJECT",
                summary: fallbackProjects[0].summary,
                summaryFr: fallbackProjects[0].summaryFr || null,
                href: `/lab/${fallbackProjects[0].slug}`,
                featured: fallbackProjects[0].featured,
                imageUrl: fallbackProjects[0].coverImageUrl || "/images/Profile.jpg",
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
                href: `/services`,
                featured: false,
                imageUrl: clientWorkResult[0].imageUrl || "/images/Profile.jpg",
            });
        } else if (fallbackClientWork[0]) {
            items.push({
                id: fallbackClientWork[0].id,
                title: fallbackClientWork[0].title,
                titleFr: fallbackClientWork[0].titleFr || null,
                kind: "CLIENT_WORK",
                summary: fallbackClientWork[0].description,
                summaryFr: fallbackClientWork[0].descriptionFr || null,
                href: `/services`,
                featured: false,
                imageUrl: fallbackClientWork[0].imageUrl || "/images/Profile.jpg",
            });
        }

        if (academyResult[0]) {
            items.push({
                id: academyResult[0].id,
                title: academyResult[0].title,
                titleFr: academyResult[0].titleFr,
                kind: "ARTICLE",
                summary: academyResult[0].description,
                summaryFr: academyResult[0].descriptionFr,
                href: `/academy`,
                featured: false,
                imageUrl: academyResult[0].coverImageUrl || "/images/Profile.jpg",
            });
        } else if (fallbackResources[0]) {
            items.push({
                id: fallbackResources[0].id,
                title: fallbackResources[0].title,
                titleFr: fallbackResources[0].titleFr || null,
                kind: "ARTICLE",
                summary: fallbackResources[0].description,
                summaryFr: fallbackResources[0].descriptionFr || null,
                href: `/academy`,
                featured: false,
                imageUrl: fallbackResources[0].coverImageUrl || "/images/Profile.jpg",
            });
        }
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Main work query failed:", error);
		}
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
						className={`overflow-hidden border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 flex flex-col`}
					>
						<div className="relative h-40 w-full border-b border-border/60 bg-muted/40">
							<Image
								src={item.imageUrl}
								alt={`${item.title} preview image`}
								fill
								sizes="(min-width: 768px) 33vw, 100vw"
								className="object-cover p-0 transition-transform duration-300 group-hover/card:scale-[1.02]"
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
						<CardContent className="space-y-4 flex-1 flex flex-col justify-end">
							<p className="text-sm leading-6 text-muted-foreground flex-1">
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
