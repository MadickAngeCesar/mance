import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

const serviceCategoryById: Record<string, string> = {
	"web-product-development": "Web Development",
	"it-support-operations": "IT Support and Consulting",
	"digital-transformation": "Digital Transformation",
	"technical-writing": "Technical Writing",
};

export async function OfferingsCards() {
	const offerings = await prisma.offering.findMany({
		orderBy: { createdAt: "desc" },
	});

	return (
		<section className="space-y-5" id="offerings">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">Service Offerings</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Web development, IT support and consulting, digital transformation, and technical writing.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				{offerings.length === 0 ? (
					<p className="text-sm text-muted-foreground sm:col-span-3">No offerings published yet.</p>
				) : null}
				{offerings.map((offering) => (
					<Card key={offering.id} className="h-full border-border/80">
						<CardHeader className="space-y-2 text-center">
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
								<Link href={offering.ctaUrl || "/#contact"}>{offering.ctaText}</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
}
