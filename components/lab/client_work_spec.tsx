"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/i18n/language-provider";
import { Tx } from "@/components/i18n/tx";
import type { ClientWorkItem } from "@/lib/definitions";

type ClientWorkSpecProps = {
	clientWorkItem: ClientWorkItem;
};

export function ClientWorkSpec({ clientWorkItem }: ClientWorkSpecProps) {
	const { language } = useLanguage();
	return (
		<article className="space-y-6">
			<header className="space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="rounded-full">
						<Tx en="Client Work" fr="Travail Client" />
					</Badge>
					<Badge variant="secondary" className="rounded-full">
						<Tx en="Placeholder Preview" fr="Aperçu fictif" />
					</Badge>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					<Tx en={clientWorkItem.title} fr={clientWorkItem.titleFr || clientWorkItem.title} />
				</h1>
				<p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
					<Tx en={clientWorkItem.description} fr={clientWorkItem.descriptionFr || clientWorkItem.description} />
				</p>
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
					alt={language === "FR" ? `${clientWorkItem.titleFr || clientWorkItem.title} image de couverture` : `${clientWorkItem.title} cover image`}
					fill
					sizes="(min-width: 1024px) 960px, 100vw"
					className="object-cover"
					priority
				/>
			</div>

			<Card className="border-border/80">
				<CardContent className="pt-4 space-y-4">
					<p className="text-sm leading-7 text-muted-foreground sm:text-base">
						{language === "FR"
							? (clientWorkItem.contentFr ||
								clientWorkItem.content ||
								"Corps du travail client fictif. Remplacez-le par le contexte réel du projet, les détails de mise en œuvre et les résultats.")
							: (clientWorkItem.content ||
								"Placeholder client-work body. Replace this with real project background, implementation details, and outcomes.")}
					</p>
					<div className="pt-2">
						<Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
							<Link
								href={
									language === "FR"
										? `/contact?subject=Développement Web&message=Bonjour, je suis intéressé par une solution numérique similaire à "${clientWorkItem.titleFr || clientWorkItem.title}".`
										: `/contact?subject=Web Development&message=Hi, I am interested in a digital solution similar to "${clientWorkItem.title}".`
								}
							>
								<Tx en="Start a Similar Project" fr="Démarrer un projet similaire" />
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</article>
	);
}
