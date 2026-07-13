import Link from "next/link";
import { CalendarDays, MessageSquareText, Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";



export async function BookingCta() {
	let bookingCta: any = null;

	try {
		bookingCta = await prisma.bookingCta.findFirst({
			orderBy: { updatedAt: "desc" },
		});
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			throw error;
		}
	}

	if (!bookingCta) {
		return null;
	}
	const ctaData = bookingCta;

	return (
		<section id="booking" className="py-4">
			<Card className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/25 backdrop-blur-md p-6 sm:p-10 shadow-2xl">
				{/* Top/Right abstract gradient bubble glow */}
				<div className="absolute -top-24 -right-24 -z-10 size-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
				<div className="absolute -bottom-24 -left-24 -z-10 size-64 rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

				<div className="grid gap-6 md:grid-cols-12 md:gap-10 md:items-center">
					{/* Text Column */}
					<div className="md:col-span-7 space-y-4 text-left">
						<div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary uppercase tracking-wide w-fit">
							<Sparkles className="size-3" />
							<Tx en="Let's build together" fr="Bâtissons ensemble" />
						</div>

						<CardHeader className="p-0 space-y-3">
							<CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-tight">
								<Tx en={ctaData.title} fr={ctaData.titleFr || ctaData.title} />
							</CardTitle>
							<p className="text-sm leading-relaxed text-muted-foreground">
								<Tx
									en={ctaData.description}
									fr={ctaData.descriptionFr || ctaData.description}
								/>
							</p>
						</CardHeader>

						<CardContent className="p-0">
							<div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
								<div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-secondary/15 p-3.5">
									<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<CalendarDays className="size-4" />
									</div>
									<span className="font-medium text-foreground/80">
										<Tx en="30-minute discovery call" fr="Appel de découverte de 30 min" />
									</span>
								</div>

								<div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-secondary/15 p-3.5">
									<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<MessageSquareText className="size-4" />
									</div>
									<span className="font-medium text-foreground/80">
										<Tx en="Scope, timeline & next steps" fr="Périmètre, calendrier & étapes" />
									</span>
								</div>
							</div>
						</CardContent>
					</div>

					{/* Action Column */}
					<div className="md:col-span-5 flex flex-col gap-3 justify-center">
						<Button
							asChild
							size="lg"
							className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-6 shadow-xl shadow-primary/10 group transition-all duration-300"
						>
							<Link href={/*ctaData.ctaUrl?.startsWith("/") ? ctaData.ctaUrl : */"/#contact"}>
								<span className="uppercase text-xs tracking-wider">
									<Tx en={ctaData.ctaText} fr={ctaData.ctaTextFr || ctaData.ctaText} />
								</span>
								<ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</Button>

						<Button
							asChild
							variant="outline"
							size="lg"
							className="w-full py-6 font-semibold border-border hover:bg-secondary/30 transition-all duration-300"
						>
							<Link href="/">
								<Tx en="Back to Home" fr="Retour à l'accueil" />
							</Link>
						</Button>
					</div>
				</div>
			</Card>
		</section>
	);
}
