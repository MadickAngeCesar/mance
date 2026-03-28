import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export async function ClientWork() {
	const clientWork = await prisma.clientWork.findMany({
		where: { publishedAt: { not: null } },
		orderBy: { publishedAt: "desc" },
	});

	return (
		<section className="space-y-5" id="client-work">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">Selected Client Work</h2>
				<p className="mt-1 text-sm text-muted-foreground">Recent builds and internal platforms delivered for teams.</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
				{clientWork.length === 0 ? (
					<p className="text-sm text-muted-foreground md:col-span-3">No client work has been published yet.</p>
				) : null}
				{clientWork.map((item) => (
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