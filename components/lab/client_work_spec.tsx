import Image from "next/image";

import { Tx } from "@/components/i18n/tx";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
						<Tx en="Client Work" fr="Travail client" />
					</Badge>
					<Badge variant="secondary" className="rounded-full">
						<Tx en="Placeholder Preview" fr="Apercu temporaire" />
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
				<CardContent className="pt-1">
					<p className="text-sm leading-7 text-muted-foreground sm:text-base">
						{clientWorkItem.content ??
							<Tx en="Placeholder client-work body. Replace this with real project background, implementation details, and outcomes." fr="Contenu temporaire du travail client. Remplacez par le contexte reel du projet, les details d'implementation et les resultats." />}
					</p>
				</CardContent>
			</Card>
		</article>
	);
}
