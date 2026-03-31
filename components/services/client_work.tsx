import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export async function ClientWork() {
	let projects: Array<{
		id: string;
		title: string;
		summary: string;
		coverImageUrl: string;
		stack: string[];
		slug: string;
	}> = [];

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
					summary: item.description,
					coverImageUrl: item.imageUrl,
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
		description: item.summary,
		imageUrl: item.coverImageUrl || "/images/Profile.jpg",
		stack: item.stack,
		projectUrl: `/lab/${item.slug}`,
	}));

	return (
		<section className="space-y-5" id="client-work">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">Selected Client Work</h2>
				<p className="mt-1 text-sm text-muted-foreground">Recent builds and internal platforms delivered for teams.</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
				{items.length === 0 ? (
					<p className="text-sm text-muted-foreground md:col-span-3">No client work linked to testimonials has been published yet.</p>
				) : null}
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
							<CardTitle className="text-lg">{item.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
							<div className="flex flex-wrap gap-1.5">
								{item.stack.map((tech) => (
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
									View project <ArrowUpRight className="size-3.5" />
								</Link>
							) : null}
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}