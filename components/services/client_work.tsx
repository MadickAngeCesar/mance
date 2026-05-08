import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import { clientWork as fallbackClientWork } from "@/lib/placeholder-data";

export async function ClientWork() {
	let projects: any[] = [];

	try {
		const testimonials = await prisma.testimonial.findMany({
			where: {
				projectReference: {
					not: "",
				},
			},
			select: {
				projectReference: true,
			},
		});

		const normalizeReference = (value: string) =>
			value
				.trim()
				.replace(/^project\s*:\s*/i, "")
				.trim();

		const referencedTitles = Array.from(
			new Set(
				testimonials
					.map((item) => normalizeReference(item.projectReference))
					.filter(Boolean),
			),
		);

		if (referencedTitles.length > 0) {
			projects = await prisma.labProject.findMany({
				where: {
					publishedAt: { not: null },
					title: { in: referencedTitles },
				},
				orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
				take: 12,
			});
		}

		if (projects.length === 0) {
			const referencedSlugs = Array.from(
				new Set(
					testimonials
						.map((item) => normalizeReference(item.projectReference).toLowerCase().replace(/\s+/g, "-"))
						.filter(Boolean),
				),
			);

			if (referencedSlugs.length > 0) {
				projects = await prisma.labProject.findMany({
					where: {
						publishedAt: { not: null },
						slug: { in: referencedSlugs },
					},
					orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
					take: 12,
				});
			}
		}

		if (projects.length === 0) {
			const linkedClientWork = await prisma.clientWork.findMany({
				where: {
					publishedAt: { not: null },
					testimonials: { some: {} },
				},
				orderBy: { publishedAt: "desc" },
				take: 12,
			});

			projects = linkedClientWork
				.filter((item) => Boolean(item.slug))
				.map((item) => ({
					id: item.id,
					title: item.title,
					titleFr: item.titleFr,
					summary: item.description,
					summaryFr: item.descriptionFr,
					coverImageUrl: item.imageUrl,
					stack: item.stack,
					slug: item.slug as string,
				}));
		}
	} catch (error) {
		console.error("Client work query failed:", error);
		projects = [];
	}

	const items = projects.length > 0
        ? projects.map((item) => ({
            id: item.id,
            title: item.title,
            titleFr: item.titleFr,
            description: item.summary,
            descriptionFr: item.summaryFr,
            imageUrl: item.coverImageUrl || "/images/Profile.jpg",
            stack: item.stack,
            projectUrl: `/lab/${item.slug}`,
        }))
        : fallbackClientWork.map(item => ({
            ...item,
            titleFr: item.titleFr || item.title,
            description: item.description,
            descriptionFr: item.descriptionFr || item.description,
            imageUrl: item.imageUrl || "/images/Profile.jpg",
            projectUrl: item.projectUrl
        }));

	return (
		<section className="space-y-5" id="client-work">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">
                    <Tx en="Selected Client Work" fr="Travaux Clients Sélectionnés" />
                </h2>
				<p className="mt-1 text-sm text-muted-foreground">
                    <Tx
                        en="Recent builds and internal platforms delivered for teams."
                        fr="Réalisations récentes et plateformes internes livrées pour les équipes."
                    />
                </p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
				{items.map((item) => (
					<Card key={item.id} className="h-full border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10">
						<div className="relative h-44 w-full border-b border-border/60 bg-muted/40">
							<Image
								src={item.imageUrl}
								alt={`${item.title} preview image`}
								fill
								sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
								className="object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
							/>
						</div>
						<CardHeader className="space-y-2">
							<CardTitle className="text-lg">
                                <Tx en={item.title} fr={item.titleFr || item.title} />
                            </CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm leading-6 text-muted-foreground">
                                <Tx en={item.description} fr={item.descriptionFr || item.description} />
                            </p>
							<div className="flex flex-wrap gap-1.5">
								{item.stack.map((tech: string) => (
									<Badge key={`${item.id}-${tech}`} variant="outline" className="rounded-full text-[11px]">
										{tech}
									</Badge>
								))}
							</div>
							{item.projectUrl ? (
								<Link
									href={item.projectUrl}
									className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
								>
									<Tx en="View project" fr="Voir le projet" /> <ArrowUpRight className="size-3.5" />
								</Link>
							) : null}
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
