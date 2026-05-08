import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import { offerings as fallbackOfferings } from "@/lib/placeholder-data";

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

    const offeringsData = offerings.length > 0 ? offerings : fallbackOfferings;

	return (
		<section className="space-y-5" id="offerings">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">
                    <Tx en="Service Offerings" fr="Offres de Services" />
                </h2>
				<p className="mt-1 text-sm text-muted-foreground">
                    <Tx
                        en="Web development, IT support and consulting, digital transformation, and technical writing."
                        fr="Développement web, support et conseil IT, transformation numérique et rédaction technique."
                    />
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				{offeringsData.map((offering) => (
					<Card key={offering.id} className="h-full border-border/80">
						<CardHeader className="space-y-2 text-center">
							<CardTitle>
                                <Tx en={offering.title} fr={offering.titleFr || offering.title} />
                            </CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm leading-6 text-muted-foreground">
                                <Tx en={offering.description} fr={offering.descriptionFr || offering.description} />
                            </p>
							<ul className="space-y-1 text-sm text-muted-foreground">
                                <Tx
                                    en={
                                        offering.features.map((feature: string) => (
                                            <li key={`${offering.id}-${feature}`} className="flex items-start gap-2">
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                                                <span>{feature}</span>
                                            </li>
                                        ))
                                    }
                                    fr={
                                        (offering.featuresFr && offering.featuresFr.length > 0)
                                        ? offering.featuresFr.map((feature: string) => (
                                            <li key={`${offering.id}-${feature}`} className="flex items-start gap-2">
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                                                <span>{feature}</span>
                                            </li>
                                        ))
                                        : offering.features.map((feature: string) => (
                                            <li key={`${offering.id}-${feature}`} className="flex items-start gap-2">
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                                                <span>{feature}</span>
                                            </li>
                                        ))
                                    }
                                />
							</ul>
						</CardContent>
						<CardFooter>
							<Button asChild className="w-full">
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
