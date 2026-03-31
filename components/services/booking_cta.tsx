import Link from "next/link";
import { CalendarDays, MessageSquareText } from "lucide-react";

import { Tx } from "@/components/i18n/tx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export async function BookingCta() {
	let bookingCta: {
		title: string;
		description: string;
		ctaText: string;
		ctaUrl: string;
	} | null = null;

	try {
		bookingCta = await prisma.bookingCta.findFirst({
			orderBy: { updatedAt: "desc" },
		});
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			throw error;
		}
	}

	return (
		<section id="booking">
			<Card className="border-border/80 bg-muted/20">
				<CardHeader className="text-center space-y-2">
					<CardTitle className="text-xl sm:text-2xl">{bookingCta?.title ?? <Tx en="Book a discovery call" fr="Reservez un appel de decouverte" />}</CardTitle>
					<p className="text-sm leading-6 text-muted-foreground">{bookingCta?.description ?? <Tx en="Let's discuss your goals, scope, and delivery timeline." fr="Discutons de vos objectifs, du perimetre et du calendrier de livraison." />}</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col text-center gap-2 text-sm items-center text-muted-foreground">
						<div className="inline-flex items-center gap-2">
							<CalendarDays className="size-4 text-foreground" />
							<span><Tx en="30-minute discovery call" fr="Appel de decouverte de 30 minutes" /></span>
						</div>
						<div className="inline-flex items-center gap-2">
							<MessageSquareText className="size-4 text-foreground" />
							<span><Tx en="Clear scope, timeline, and next steps" fr="Perimetre clair, calendrier et prochaines etapes" /></span>
						</div>
					</div>
					<div className="flex flex-col sm:justify-center gap-2 sm:flex-row">
						<Button asChild>
							<Link href={bookingCta?.ctaUrl?.startsWith("/") ? bookingCta.ctaUrl : "/#contact"}>{bookingCta?.ctaText ?? <Tx en="Start a project" fr="Demarrer un projet" />}</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/"><Tx en="Back to Home" fr="Retour a l'accueil" /></Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}