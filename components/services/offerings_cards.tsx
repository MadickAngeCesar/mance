import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";



export async function OfferingsCards() {
	let offerings: any[] = [];

	try {
		offerings = await prisma.offering.findMany({
			orderBy: { createdAt: "desc" },
		});
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Offerings query failed, rendering empty state:", error);
		}
	}

	const offeringsData = offerings;

	return (
		<section className="space-y-6" id="offerings">
			<div className="text-center space-y-2">
				<h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
					<Tx en="Service Offerings" fr="Offres de Services" />
				</h2>
				<p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
					<Tx
						en="Tailored engineering services designed to help organizations build stable web products, support IT infrastructures, and transition to automated pipelines."
						fr="Services d'ingénierie adaptés pour concevoir des produits web stables, soutenir l'infrastructure IT et automatiser les pipelines."
					/>
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-3">
				{offeringsData.map((offering, idx) => (
					<Card
						key={offering.id}
						className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
					>
						{/* Subtle top border glow for the featured cards */}
						{idx === 0 && (
							<div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-violet-500" />
						)}

						<CardHeader className="space-y-3 text-center pb-4 pt-6">
							<CardTitle className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
								<Tx en={offering.title} fr={offering.titleFr || offering.title} />
							</CardTitle>
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
						</CardHeader>

						<CardContent className="flex-1 space-y-5 pb-6">
							<p className="text-xs leading-relaxed text-muted-foreground text-center">
								<Tx en={offering.description} fr={offering.descriptionFr || offering.description} />
							</p>

							<ul className="space-y-2 text-xs text-muted-foreground leading-normal">
								<Tx
									en={offering.features.map((feature: string) => (
										<li key={`${offering.id}-${feature}`} className="flex items-start gap-2.5">
											<div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
												<Check className="size-2.5" />
											</div>
											<span className="text-foreground/90">{feature}</span>
										</li>
									))}
									fr={(offering.featuresFr && offering.featuresFr.length > 0)
										? offering.featuresFr.map((feature: string) => (
											<li key={`${offering.id}-${feature}`} className="flex items-start gap-2.5">
												<div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
													<Check className="size-2.5" />
												</div>
												<span className="text-foreground/90">{feature}</span>
											</li>
										))
										: offering.features.map((feature: string) => (
											<li key={`${offering.id}-${feature}`} className="flex items-start gap-2.5">
												<div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
													<Check className="size-2.5" />
												</div>
												<span className="text-foreground/90">{feature}</span>
											</li>
										))
									}
								/>
							</ul>
						</CardContent>

						<CardFooter className="pt-2 pb-6">
							<Button
								asChild
								variant={idx === 0 ? "default" : "outline"}
								className={`w-full font-semibold transition-all duration-300 ${
									idx === 0
										? "bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/20"
										: "hover:bg-primary hover:text-primary-foreground hover:border-transparent"
								}`}
							>
								<Link href={offering.ctaUrl?.startsWith("/") ? offering.ctaUrl : "/#contact"}>
									<Tx en={offering.ctaText} fr={offering.ctaTextFr || offering.ctaText} />
								</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
}
