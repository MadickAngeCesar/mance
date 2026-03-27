"use client";

import { useMemo, useState } from "react";
import { Eye, PencilLine, Search, Trash2 } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OfferingForm } from "@/components/dashboard/offering_form";
import { offerings } from "@/lib/placeholder-data";

export function OfferingList() {
	const { language } = useLanguage();
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		return offerings.filter((offering) => {
			return (
				offering.title.toLowerCase().includes(query.toLowerCase()) ||
				offering.description.toLowerCase().includes(query.toLowerCase())
			);
		});
	}, [query]);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">{language === "FR" ? "Offres de services" : "Service Offerings"}</CardTitle>
				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={language === "FR" ? "Rechercher par titre de service" : "Search by service title"}
						className="pl-8"
					/>
				</div>
			</CardHeader>
			<CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
				{filtered.map((offering) => (
					<div key={offering.id} className="rounded-lg border border-border/70 bg-card/70 p-3">
						<div className="flex flex-wrap items-start justify-between gap-2">
							<div className="space-y-1">
								<p className="font-medium">{offering.title}</p>
								<p className="text-sm text-muted-foreground">{offering.description}</p>
							</div>
							<Badge variant="outline">{offering.features.length} {language === "FR" ? "elements" : "features"}</Badge>
						</div>
						<ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
							{offering.features.map((feature) => (
								<li key={feature}>• {feature}</li>
							))}
						</ul>
						<div className="mt-3 flex gap-1">
							<Button variant="ghost" size="icon-sm" aria-label="View offering">
								<Eye className="size-4" />
							</Button>
							<OfferingForm
								mode="edit"
								initialOffering={offering}
								trigger={
									<Button variant="ghost" size="icon-sm" aria-label="Edit offering">
										<PencilLine className="size-4" />
									</Button>
								}
							/>
							<Button variant="ghost" size="icon-sm" aria-label="Delete offering">
								<Trash2 className="size-4" />
							</Button>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}