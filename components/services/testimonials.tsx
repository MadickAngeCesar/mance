import Image from "next/image";
import { Star, Quote, CalendarDays, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";



export async function Testimonials() {
	let testimonials: any[] = [];

	try {
		testimonials = await prisma.testimonial.findMany({
			orderBy: { createdAt: "desc" },
		});
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Testimonials query failed, rendering empty state:", error);
		}
	}

	const testimonialsData = testimonials;

	return (
		<section className="space-y-6" id="testimonials">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
					<Tx en="Client Testimonials" fr="Témoignages Clients" />
				</h2>
				<p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
					<Tx
						en="Read what startup founders, technical leads, and business operations directors say about collaborating together."
						fr="Découvrez ce que disent les fondateurs de startups, les responsables techniques et les directeurs des opérations."
					/>
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{testimonialsData.map((item) => (
					<Card
						key={item.id}
						className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
					>
						{/* Double Quote Styling Indicator */}
						<div className="absolute top-5 right-5 text-primary/10 select-none pointer-events-none">
							<Quote className="size-8" />
						</div>

						<CardHeader className="space-y-3 pb-3">
							{/* Star Rating Indicator */}
							<div className="flex items-center gap-0.5 text-amber-400" aria-label={`${item.rating} out of 5 stars`}>
								{Array.from({ length: 5 }).map((_, index) => (
									<Star
										key={`${item.id}-${index}`}
										className="size-3.5"
										fill={index < item.rating ? "currentColor" : "none"}
									/>
								))}
							</div>

							<div className="flex items-center gap-3">
								<div className="relative size-10 overflow-hidden rounded-full border border-border/70 bg-muted/40">
									<Image
										src={item.avatarUrl || "/images/Profile.jpg"}
										alt={`${item.clientName} avatar`}
										fill
										sizes="40px"
										className="object-cover"
									/>
								</div>
								<div>
									<h3 className="text-sm font-bold text-foreground leading-tight">{item.clientName}</h3>
									<p className="text-[11px] text-muted-foreground mt-0.5">
										<Tx en={item.clientRoleCompany} fr={item.clientRoleCompanyFr || item.clientRoleCompany} />
									</p>
								</div>
							</div>
						</CardHeader>

						<CardContent className="flex flex-1 flex-col justify-between space-y-4 pt-0">
							{/* Quote text */}
							<p className="text-xs leading-relaxed text-muted-foreground italic">
								&ldquo;<Tx en={item.text} fr={item.textFr || item.text} />&rdquo;
							</p>

							<div className="space-y-2 border-t border-border/40 pt-3">
								{/* Project Reference name */}
								<div className="flex items-center gap-1.5 text-[10px] text-primary/95 font-medium">
									<ExternalLink className="size-3" />
									<Tx en={item.projectReference} fr={item.projectReferenceFr || item.projectReference} />
								</div>
								
								{/* Date Label */}
								<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
									<CalendarDays className="size-3" />
									<Tx en={item.dateLabel} fr={item.dateLabelFr || item.dateLabel} />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
