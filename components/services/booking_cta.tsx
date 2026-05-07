import Link from "next/link";
import { CalendarDays, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";

export async function BookingCta() {
	let bookingCta: {
		title: string;
		titleFr: string | null;
		description: string;
		descriptionFr: string | null;
		ctaText: string;
		ctaTextFr: string | null;
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
					<CardTitle className="text-xl sm:text-2xl">
                        <Tx en={bookingCta?.title ?? "Book a discovery call"} fr={bookingCta?.titleFr || bookingCta?.title || "Réserver un appel de découverte"} />
                    </CardTitle>
					<p className="text-sm leading-6 text-muted-foreground">
                        <Tx
                            en={bookingCta?.description ?? "Let's discuss your goals, scope, and delivery timeline."}
                            fr={bookingCta?.descriptionFr || bookingCta?.description || "Discutons de vos objectifs, de la portée et du calendrier de livraison."}
                        />
                    </p>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col text-center gap-2 text-sm items-center text-muted-foreground">
						<div className="inline-flex items-center gap-2">
							<CalendarDays className="size-4 text-foreground" />
							<span><Tx en="30-minute discovery call" fr="Appel de découverte de 30 minutes" /></span>
						</div>
						<div className="inline-flex items-center gap-2">
							<MessageSquareText className="size-4 text-foreground" />
							<span><Tx en="Clear scope, timeline, and next steps" fr="Portée, calendrier et prochaines étapes clairs" /></span>
						</div>
					</div>
					<div className="flex flex-col sm:justify-center gap-2 sm:flex-row">
						<Button asChild>
							<Link href={bookingCta?.ctaUrl?.startsWith("/") ? bookingCta.ctaUrl : "/#contact"}>
                                <Tx en={bookingCta?.ctaText ?? "Start a project"} fr={bookingCta?.ctaTextFr || bookingCta?.ctaText || "Démarrer un projet"} />
                            </Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/">
                                <Tx en="Back to Home" fr="Retour à l'accueil" />
                            </Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
