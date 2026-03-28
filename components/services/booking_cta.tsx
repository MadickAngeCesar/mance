import Link from "next/link";
import { CalendarDays, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingCta } from "@/lib/placeholder-data";

export function BookingCta() {
	return (
		<section id="booking">
			<Card className="border-border/80 bg-muted/20">
				<CardHeader className="text-center space-y-2">
					<CardTitle className="text-xl sm:text-2xl">{bookingCta.title}</CardTitle>
					<p className="text-sm leading-6 text-muted-foreground">{bookingCta.description}</p>
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
							<Link href={bookingCta.ctaUrl}>{bookingCta.ctaText}</Link>
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