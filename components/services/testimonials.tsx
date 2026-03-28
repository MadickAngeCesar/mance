import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export async function Testimonials() {
	const testimonials = await prisma.testimonial.findMany({
		orderBy: { createdAt: "desc" },
	});

	return (
		<section className="space-y-5" id="testimonials">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">Client Testimonials</h2>
				<p className="mt-1 text-sm text-muted-foreground">Feedback from founders, operations teams, and product leaders.</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
				{testimonials.length === 0 ? (
					<p className="text-sm text-muted-foreground md:col-span-3">No testimonials published yet.</p>
				) : null}
				{testimonials.map((item) => (
					<Card key={item.id} className="h-full border-border/80">
						<CardHeader className="space-y-2">
							<div className="flex items-center gap-1 text-amber-500" aria-label={`${item.rating} out of 5 stars`}>
								{Array.from({ length: 5 }).map((_, index) => (
									<Star
										key={`${item.id}-${index}`}
										className="size-3.5"
										fill={index < item.rating ? "currentColor" : "none"}
									/>
								))}
							</div>
							<CardTitle className="text-base">{item.clientName}</CardTitle>
							<p className="text-xs text-muted-foreground">{item.clientRoleCompany}</p>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm leading-6 text-muted-foreground">&ldquo;{item.text}&rdquo;</p>
							<p className="text-xs text-muted-foreground">{item.projectReference}</p>
							<p className="text-xs font-medium text-muted-foreground/90">{item.dateLabel}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}