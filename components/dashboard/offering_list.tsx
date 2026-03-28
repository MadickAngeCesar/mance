"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, PencilLine, Search, Trash2 } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DASHBOARD_DATA_EVENT } from "@/components/dashboard/data-events";
import { OfferingForm } from "@/components/dashboard/offering_form";
import { apiRequest } from "@/lib/client-api";
import type { Offering } from "@/lib/definitions";

export function OfferingList() {
	const { language } = useLanguage();
	const [offerings, setOfferings] = useState<Offering[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");

	const loadOfferings = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiRequest<Offering[]>("/api/services?limit=100", {
				auth: true,
			});
			setOfferings(response.data ?? []);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load offerings.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadOfferings();
	}, [loadOfferings]);

	useEffect(() => {
		const handler = (event: Event) => {
			const custom = event as CustomEvent<{ domain?: string }>;
			if (custom.detail?.domain === "services") {
				void loadOfferings();
			}
		};

		window.addEventListener(DASHBOARD_DATA_EVENT, handler);
		return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
	}, [loadOfferings]);

	const handleDelete = async (id: string) => {
		const previous = offerings;
		setOfferings((current) => current.filter((offering) => offering.id !== id));
		try {
			await apiRequest(`/api/services/${id}`, {
				method: "DELETE",
				auth: true,
			});
		} catch (deleteError) {
			setOfferings(previous);
			setError(deleteError instanceof Error ? deleteError.message : "Unable to delete offering.");
		}
	};

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
				{isLoading ? <p className="text-sm text-muted-foreground">Loading offerings...</p> : null}
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
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
							<Button variant="ghost" size="icon-sm" aria-label="Delete offering" onClick={() => void handleDelete(offering.id)}>
								<Trash2 className="size-4" />
							</Button>
						</div>
					</div>
				))}
				{!isLoading && filtered.length === 0 ? (
					<p className="text-sm text-muted-foreground">No offerings found for this search.</p>
				) : null}
			</CardContent>
		</Card>
	);
}