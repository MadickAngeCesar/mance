import Link from "next/link";
import { CalendarDays, MessageSquareText } from "lucide-react";

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
					<CardTitle className="text-xl sm:text-2xl">{bookingCta?.title ?? "Book a discovery call"}</CardTitle>
					<p className="text-sm leading-6 text-muted-foreground">{bookingCta?.description ?? "Let's discuss your goals, scope, and delivery timeline."}</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col text-center gap-2 text-sm items-center text-muted-foreground">
						<div className="inline-flex items-center gap-2">
							<CalendarDays className="size-4 text-foreground" />
							<span>30-minute discovery call</span>
						</div>
						<div className="inline-flex items-center gap-2">
							<MessageSquareText className="size-4 text-foreground" />
							<span>Clear scope, timeline, and next steps</span>
						</div>
					</div>
					<div className="flex flex-col sm:justify-center gap-2 sm:flex-row">
						<Button asChild>
							<Link href={bookingCta?.ctaUrl?.startsWith("/") ? bookingCta.ctaUrl : "/#contact"}>{bookingCta?.ctaText ?? "Start a project"}</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/">Back to Home</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}