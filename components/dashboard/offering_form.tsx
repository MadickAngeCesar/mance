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
	const [title, setTitle] = useState(initialOffering?.title ?? "");
	const [titleFr, setTitleFr] = useState(initialOffering?.titleFr ?? "");
	const [ctaText, setCtaText] = useState(initialOffering?.ctaText ?? "");
	const [ctaTextFr, setCtaTextFr] = useState(initialOffering?.ctaTextFr ?? "");

	const slugify = (value: string) =>
		value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");

	const inferredCtaUrl = `/services?offering=${encodeURIComponent(slugify(ctaText || title || "service"))}#booking`;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setIsSubmitting(true);
		setError(null);

		const title = String(formData.get("title") ?? "").trim();
		const ctaText = String(formData.get("ctaText") ?? "").trim();
		const description = String(formData.get("description") ?? "").trim();

		if (!title || !description) {
			setError("Title and description are required.");
			setIsSubmitting(false);
			return;
		}

		const inferredFromForm = `/services?offering=${encodeURIComponent(slugify(ctaText || title || "service"))}#booking`;

		const titleFr = String(formData.get("titleFr") ?? "").trim() || null;
		const descriptionFr = String(formData.get("descriptionFr") ?? "").trim() || null;
		const ctaTextFr = String(formData.get("ctaTextFr") ?? "").trim() || null;

		const payload = {
			title,
			titleFr,
			description,
			descriptionFr,
			features: String(formData.get("features") ?? "")
				.split("\n")
				.map((value) => value.trim())
				.filter(Boolean),
			featuresFr: String(formData.get("featuresFr") ?? "")
				.split("\n")
				.map((value) => value.trim())
				.filter(Boolean),
			ctaText: ctaText || "Start a project",
			ctaTextFr: ctaTextFr || "Démarrer un projet",
			ctaUrl: inferredFromForm,
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
			if (!isEditMode) {
				setTitle("");
				setTitleFr("");
				setCtaText("");
				setCtaTextFr("");
			}
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
				labelTitle: "Titre (EN)",
				labelTitleFr: "Titre (FR)",
				labelDescription: "Description (EN)",
				labelDescriptionFr: "Description (FR)",
				labelFeatures: "Fonctionnalites EN (une par ligne)",
				labelFeaturesFr: "Fonctionnalites FR (une par ligne)",
				labelCtaText: "Texte du CTA (EN)",
				labelCtaTextFr: "Texte du CTA (FR)",
				labelCtaUrl: "URL du CTA (automatique)",
				save: isEditMode ? "Mettre a jour l'offre" : "Enregistrer l'offre",
			};
		}

		return {
			create: "Create Offering",
			title: isEditMode ? "Edit Offering" : "Create Offering",
			description: "Define value proposition, bullets, and action link for each service package.",
			labelTitle: "Title (EN)",
			labelTitleFr: "Title (FR)",
			labelDescription: "Description (EN)",
			labelDescriptionFr: "Description (FR)",
			labelFeatures: "Features EN (one per line)",
			labelFeaturesFr: "Features FR (one per line)",
			labelCtaText: "CTA Text (EN)",
			labelCtaTextFr: "CTA Text (FR)",
			labelCtaUrl: "CTA URL (auto)",
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
					<div className="space-y-1.5">
						<label htmlFor="offering-title" className="text-xs font-medium text-muted-foreground">
							{copy.labelTitle}
						</label>
						<Input
							id="offering-title"
							name="title"
							placeholder="Web Product Development"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							required
						/>
					</div>
					<div className="space-y-1.5">
						<label htmlFor="offering-title-fr" className="text-xs font-medium text-muted-foreground">
							{copy.labelTitleFr}
						</label>
						<Input
							id="offering-title-fr"
							name="titleFr"
							placeholder="Développement de Produits Web"
							value={titleFr}
							onChange={(event) => setTitleFr(event.target.value)}
						/>
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-description" className="text-xs font-medium text-muted-foreground">
							{copy.labelDescription}
						</label>
						<Textarea id="offering-description" name="description" placeholder="Summarize expected outcomes and delivery scope." rows={3} defaultValue={initialOffering?.description} required />
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-description-fr" className="text-xs font-medium text-muted-foreground">
							{copy.labelDescriptionFr}
						</label>
						<Textarea id="offering-description-fr" name="descriptionFr" placeholder="Résumez les résultats attendus et la portée de la livraison." rows={3} defaultValue={initialOffering?.descriptionFr ?? ""} />
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-features" className="text-xs font-medium text-muted-foreground">
							{copy.labelFeatures}
						</label>
						<Textarea id="offering-features" name="features" placeholder="Next.js architecture and setup&#10;API and database integration&#10;Auth, roles, and dashboard features" rows={4} defaultValue={initialOffering?.features.join("\n")} />
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-features-fr" className="text-xs font-medium text-muted-foreground">
							{copy.labelFeaturesFr}
						</label>
						<Textarea id="offering-features-fr" name="featuresFr" placeholder="Architecture et configuration Next.js&#10;Intégration d'API et de bases de données" rows={4} defaultValue={initialOffering?.featuresFr?.join("\n") ?? ""} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="offering-cta-text" className="text-xs font-medium text-muted-foreground">
							{copy.labelCtaText}
						</label>
						<Input
							id="offering-cta-text"
							name="ctaText"
							placeholder="Start a web project"
							value={ctaText}
							onChange={(event) => setCtaText(event.target.value)}
						/>
					</div>
					<div className="space-y-1.5">
						<label htmlFor="offering-cta-text-fr" className="text-xs font-medium text-muted-foreground">
							{copy.labelCtaTextFr}
						</label>
						<Input
							id="offering-cta-text-fr"
							name="ctaTextFr"
							placeholder="Démarrer un projet web"
							value={ctaTextFr}
							onChange={(event) => setCtaTextFr(event.target.value)}
						/>
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-cta-url" className="text-xs font-medium text-muted-foreground">
							{copy.labelCtaUrl}
						</label>
						<Input id="offering-cta-url" name="ctaUrl" value={inferredCtaUrl} readOnly />
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