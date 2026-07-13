import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tx } from "@/components/i18n/tx";
import type { ClientWorkItem } from "@/lib/definitions";

type ClientWorkSpecProps = {
	clientWorkItem: ClientWorkItem;
};

export function ClientWorkSpec({ clientWorkItem }: ClientWorkSpecProps) {
	return (
		<article className="space-y-6">
			<header className="space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="rounded-full">
						Client Work
					</Badge>
					<Badge variant="secondary" className="rounded-full">
						Placeholder Preview
					</Badge>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{clientWorkItem.title}</h1>
				<p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{clientWorkItem.description}</p>
				<div className="flex flex-wrap gap-1.5">
					{clientWorkItem.stack.map((tech) => (
						<Badge key={`${clientWorkItem.id}-${tech}`} variant="secondary" className="rounded-full">
							{tech}
						</Badge>
					))}
				</div>
			</header>

			<div className="relative h-64 w-full overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-96">
				<Image
					src={clientWorkItem.imageUrl}
					alt={`${clientWorkItem.title} cover image`}
					fill
					sizes="(min-width: 1024px) 960px, 100vw"
					className="object-cover"
					priority
				/>
			</div>

			<Card className="border-border/80">
				<CardContent className="pt-4 space-y-4">
					<p className="text-sm leading-7 text-muted-foreground sm:text-base">
						{clientWorkItem.content ??
							"Placeholder client-work body. Replace this with real project background, implementation details, and outcomes."}
					</p>
					<div className="pt-2">
						<Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
							<Link href={`/contact?subject=Web Development&message=Hi, I am interested in a digital solution similar to "${clientWorkItem.title}".`}>
								<Tx en="Start a Similar Project" fr="Démarrer un projet similaire" />
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</article>
	);
}
