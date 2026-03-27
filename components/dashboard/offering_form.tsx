"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
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
import type { Offering } from "@/lib/definitions";

type OfferingFormProps = {
	mode?: "create" | "edit";
	initialOffering?: Offering;
	trigger?: ReactNode;
};

export function OfferingForm({ mode = "create", initialOffering, trigger }: OfferingFormProps) {
	const isEditMode = mode === "edit";
	const { language } = useLanguage();
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
		<Dialog>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button type="button">
						<Plus className="size-4" />
						{copy.create}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-2xl p-0">
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
						<Input id="offering-title" placeholder="Web Product Development" defaultValue={initialOffering?.title} />
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-description" className="text-xs font-medium text-muted-foreground">
							{copy.labelDescription}
						</label>
						<Textarea id="offering-description" placeholder="Summarize expected outcomes and delivery scope." rows={3} defaultValue={initialOffering?.description} />
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="offering-features" className="text-xs font-medium text-muted-foreground">
							{copy.labelFeatures}
						</label>
						<Textarea id="offering-features" placeholder="Next.js architecture and setup&#10;API and database integration&#10;Auth, roles, and dashboard features" rows={5} defaultValue={initialOffering?.features.join("\n")} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="offering-cta-text" className="text-xs font-medium text-muted-foreground">
							{copy.labelCtaText}
						</label>
						<Input id="offering-cta-text" placeholder="Start a web project" defaultValue={initialOffering?.ctaText} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="offering-cta-url" className="text-xs font-medium text-muted-foreground">
							{copy.labelCtaUrl}
						</label>
						<Input id="offering-cta-url" placeholder="/services#booking" defaultValue={initialOffering?.ctaUrl} />
					</div>
					</div>
				</div>

				<DialogFooter>
					<Button type="button">
						<Save className="size-4" />
						{copy.save}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}