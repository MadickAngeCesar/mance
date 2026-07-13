import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";



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
					clientName: item.clientName,
					clientNameFr: item.clientNameFr,
					stack: item.stack,
					slug: item.slug as string,
				}));
		}
	} catch (error) {
		console.error("Client work query failed:", error);
		projects = [];
	}

	const items = projects.map((item) => ({
		id: item.id,
		title: item.title,
		titleFr: item.titleFr,
		description: item.summary,
		descriptionFr: item.summaryFr,
		imageUrl: item.coverImageUrl || "/images/Profile.jpg",
		clientName: item.clientName,
		clientNameFr: item.clientNameFr,
		stack: item.stack,
		projectUrl: `/lab/${item.slug}`,
	}));

	return (
		<section className="space-y-6" id="client-work">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
					<Tx en="Selected Client Work" fr="Travaux Clients Sélectionnés" />
				</h2>
				<p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
					<Tx
						en="Recent web applications, internal dashboards, and workflow automation systems built for business teams."
						fr="Applications web récentes, tableaux de bord internes et systèmes d'automatisation construits pour des équipes professionnelles."
					/>
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
				{items.map((item) => (
					<Card
						key={item.id}
						className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
					>
						<div className="relative h-44 w-full overflow-hidden border-b border-border/60 bg-muted/20">
							<Image
								src={item.imageUrl}
								alt={`${item.title} preview image`}
								fill
								sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent opacity-60" />
						</div>

						<CardHeader className="space-y-2 pb-2">
							{item.clientName && (
								<div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
									<Building className="size-3" />
									<Tx en={item.clientName} fr={item.clientNameFr || item.clientName} />
								</div>
							)}
							<CardTitle className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
								<Tx en={item.title} fr={item.titleFr || item.title} />
							</CardTitle>
						</CardHeader>

						<CardContent className="flex flex-1 flex-col justify-between space-y-4">
							<p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
								<Tx en={item.description} fr={item.descriptionFr || item.description} />
							</p>

							<div className="flex flex-wrap gap-1.5">
								{item.stack.map((tech: string) => (
									<Badge
										key={`${item.id}-${tech}`}
										variant="outline"
										className="rounded-full text-[10px] bg-secondary/20 font-mono text-secondary-foreground border-border/60"
									>
										{tech}
									</Badge>
								))}
							</div>

							{item.projectUrl ? (
								<div className="pt-2">
									<Button
										asChild
										className="w-full justify-between group/btn bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300"
									>
										<Link href={item.projectUrl}>
											<span className="font-semibold text-xs tracking-wide uppercase">
												<Tx en="Explore Case Study" fr="Explorer l'Étude" />
											</span>
											<ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
										</Link>
									</Button>
								</div>
							) : null}
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
