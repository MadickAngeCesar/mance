import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mainWorkHighlights } from "@/lib/placeholder-data";

export function MainWork() {
	return (
		<section className="space-y-5">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">Main Work</h2>
				<p className="mt-1 text-sm text-muted-foreground">Featured projects, client work, and articles.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{mainWorkHighlights.map((item, index) => (
					<Card
						key={item.id}
						className={`overflow-hidden border-border/80 ${index >= 3 ? "hidden lg:flex" : "flex"}`}
					>
						<div className="relative h-40 w-full border-b border-border/60 bg-muted/40">
							<Image
								src={item.imageUrl}
								alt={`${item.title} preview image`}
								fill
								className="object-contain p-4"
							/>
						</div>
						<CardHeader>
							<div className="flex items-center justify-between gap-3">
								<Badge variant="outline" className="rounded-full capitalize">
									{item.kind}
								</Badge>
								{item.featured ? <Badge className="rounded-full">Featured</Badge> : null}
							</div>
							<CardTitle className="pt-2 text-lg">{item.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm leading-6 text-muted-foreground">{item.summary}</p>
							<Link className="text-sm font-medium underline-offset-4 hover:underline" href={item.href}>
								Open details
							</Link>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
