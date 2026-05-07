import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";

export async function Testimonials() {
	let testimonials: Array<{
		id: string;
		rating: number;
		clientName: string;
		clientRoleCompany: string;
		clientRoleCompanyFr: string | null;
		text: string;
		textFr: string | null;
		projectReference: string;
		projectReferenceFr: string | null;
		dateLabel: string;
		dateLabelFr: string | null;
	}> = [];

	try {
		testimonials = await prisma.testimonial.findMany({
			orderBy: { createdAt: "desc" },
		});
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Testimonials query failed, rendering empty state:", error);
		}
	}

	return (
		<section className="space-y-5" id="testimonials">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">
                    <Tx en="Client Testimonials" fr="Témoignages Clients" />
                </h2>
				<p className="mt-1 text-sm text-muted-foreground">
                    <Tx
                        en="Feedback from founders, operations teams, and product leaders."
                        fr="Retours de fondateurs, d'équipes opérationnelles et de leaders de produits."
                    />
                </p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
				{testimonials.length === 0 ? (
					<p className="text-sm text-muted-foreground md:col-span-3">
                        <Tx en="No testimonials published yet." fr="Aucun témoignage publié pour l'instant." />
                    </p>
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
							<p className="text-xs text-muted-foreground">
                                <Tx en={item.clientRoleCompany} fr={item.clientRoleCompanyFr || item.clientRoleCompany} />
                            </p>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm leading-6 text-muted-foreground">&ldquo;<Tx en={item.text} fr={item.textFr || item.text} />&rdquo;</p>
							<p className="text-xs text-muted-foreground">
                                <Tx en={item.projectReference} fr={item.projectReferenceFr || item.projectReference} />
                            </p>
							<p className="text-xs font-medium text-muted-foreground/90">
                                <Tx en={item.dateLabel} fr={item.dateLabelFr || item.dateLabel} />
                            </p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
