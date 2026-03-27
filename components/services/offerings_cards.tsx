import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { offerings } from "@/lib/placeholder-data";

export function OfferingsCards() {
	return (
		<section className="space-y-5" id="offerings">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">Service Offerings</h2>
				<p className="mt-1 text-sm text-muted-foreground">Delivery models designed for business outcomes and reliability.</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				{offerings.map((offering) => (
					<Card key={offering.id} className="h-full border-border/80">
						<CardHeader className="space-y-2">
							<Badge variant="outline" className="w-fit rounded-full">
								Service
							</Badge>
							<CardTitle>{offering.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm leading-6 text-muted-foreground">{offering.description}</p>
							<ul className="space-y-1 text-sm text-muted-foreground">
								{offering.features.map((feature) => (
									<li key={`${offering.id}-${feature}`} className="flex items-start gap-2">
										<span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
										<span>{feature}</span>
									</li>
								))}
							</ul>
						</CardContent>
						<CardFooter>
							<Button asChild className="w-full">
								<Link href={offering.ctaUrl}>{offering.ctaText}</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
}
