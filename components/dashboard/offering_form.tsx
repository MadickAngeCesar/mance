"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emitDashboardDataChanged } from "@/components/dashboard/data-events";
import { apiRequest } from "@/lib/client-api";
import type { Offering } from "@/lib/definitions";

type OfferingFormProps = {
	mode?: "create" | "edit";
	initialOffering?: Offering;
	trigger?: ReactNode;
};

export function OfferingForm({ mode = "create", initialOffering, trigger }: OfferingFormProps) {
	const isEditMode = mode === "edit";
	const { language } = useLanguage();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toAbsoluteUrl = (value: string) => {
		if (!value.startsWith("/")) {
			return value;
		}
		if (typeof window === "undefined") {
			return value;
		}
		return new URL(value, window.location.origin).toString();
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setIsSubmitting(true);
		setError(null);

		const payload = {
			title: String(formData.get("title") ?? ""),
			description: String(formData.get("description") ?? ""),
			features: String(formData.get("features") ?? "")
				.split("\n")
				.map((value) => value.trim())
				.filter(Boolean),
			ctaText: String(formData.get("ctaText") ?? ""),
			ctaUrl: toAbsoluteUrl(String(formData.get("ctaUrl") ?? "")),
		};

		try {
			if (isEditMode && initialOffering) {
				await apiRequest(`/api/services/${initialOffering.id}`, {
					method: "PATCH",
					auth: true,
					body: JSON.stringify(payload),
				});
			} else {
				await apiRequest("/api/services", {
					method: "POST",
					auth: true,
					body: JSON.stringify(payload),
				});
			}

			emitDashboardDataChanged("services");
			setOpen(false);
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to save offering.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const copy = useMemo(() => {
		if (language === "FR") {
			return {
				create: "Creer une offre",
				title: isEditMode ? "Modifier l'offre" : "Creer une offre",
				description: "Definissez la proposition de valeur, les points cles et le lien d'action.",
				labelTitle: "Titre",
				labelDescription: "Description",
				labelFeatures: "Fonctionnalites (une par ligne)",
				labelCtaText: "Texte du CTA",
				labelCtaUrl: "URL du CTA",
				save: isEditMode ? "Mettre a jour l'offre" : "Enregistrer l'offre",
			};
		}

		return {
			create: "Create Offering",
			title: isEditMode ? "Edit Offering" : "Create Offering",
			description: "Define value proposition, bullets, and action link for each service package.",
			labelTitle: "Title",
			labelDescription: "Description",
			labelFeatures: "Features (one per line)",
			labelCtaText: "CTA Text",
			labelCtaUrl: "CTA URL",
			save: isEditMode ? "Update Offering" : "Save Offering",
		};
	}, [isEditMode, language]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button type="button">
						<Plus className="size-4" />
						{copy.create}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-2xl p-0">
				<form onSubmit={handleSubmit}>
				<DialogHeader className="border-b border-border/70 px-4 pt-4 pb-3">
					<DialogTitle className="text-base">{copy.title}</DialogTitle>
					<DialogDescription>{copy.description}</DialogDescription>
				</DialogHeader>
				<div className="max-h-[70vh] space-y-3 overflow-y-auto px-4 pt-4">
					<div className="grid gap-3 md:grid-cols-2">
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-title" className="text-xs font-medium text-muted-foreground">
							{copy.labelTitle}
						</label>
						<Input id="offering-title" name="title" placeholder="Web Product Development" defaultValue={initialOffering?.title} />
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-description" className="text-xs font-medium text-muted-foreground">
							{copy.labelDescription}
						</label>
						<Textarea id="offering-description" name="description" placeholder="Summarize expected outcomes and delivery scope." rows={3} defaultValue={initialOffering?.description} />
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-features" className="text-xs font-medium text-muted-foreground">
							{copy.labelFeatures}
						</label>
						<Textarea id="offering-features" name="features" placeholder="Next.js architecture and setup&#10;API and database integration&#10;Auth, roles, and dashboard features" rows={5} defaultValue={initialOffering?.features.join("\n")} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="offering-cta-text" className="text-xs font-medium text-muted-foreground">
							{copy.labelCtaText}
						</label>
						<Input id="offering-cta-text" name="ctaText" placeholder="Start a web project" defaultValue={initialOffering?.ctaText} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="offering-cta-url" className="text-xs font-medium text-muted-foreground">
							{copy.labelCtaUrl}
						</label>
						<Input id="offering-cta-url" name="ctaUrl" placeholder="https://mance.dev/services#booking" defaultValue={initialOffering?.ctaUrl} />
					</div>
					</div>
				</div>

				<DialogFooter>
					{error ? <p className="w-full text-sm text-destructive">{error}</p> : null}
					<Button type="submit" disabled={isSubmitting}>
						<Save className="size-4" />
						{isSubmitting ? "Saving..." : copy.save}
					</Button>
				</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}