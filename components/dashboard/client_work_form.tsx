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

type ClientWorkItem = {
	id: string;
	title: string;
	titleFr?: string | null;
	description: string;
	descriptionFr?: string | null;
	clientName?: string | null;
	clientNameFr?: string | null;
	imageUrl: string;
	projectUrl?: string | null;
	stack: string[];
	slug?: string | null;
	publishedAt?: string | null;
};

type ClientWorkFormProps = {
	mode?: "create" | "edit";
	initialWork?: ClientWorkItem;
	trigger?: ReactNode;
};

export function ClientWorkForm({ mode = "create", initialWork, trigger }: ClientWorkFormProps) {
	const isEditMode = mode === "edit";
	const { language } = useLanguage();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setIsSubmitting(true);
		setError(null);

		try {
			const intent = formData.get("intent") === "draft" ? null : new Date().toISOString();

			const payload = {
				title: String(formData.get("title") ?? ""),
				titleFr: String(formData.get("titleFr") ?? "") || null,
				slug: String(formData.get("slug") ?? "") || null,
				description: String(formData.get("description") ?? ""),
				descriptionFr: String(formData.get("descriptionFr") ?? "") || null,
				clientName: String(formData.get("clientName") ?? "") || null,
				clientNameFr: String(formData.get("clientNameFr") ?? "") || null,
				imageUrl: String(formData.get("imageUrl") ?? ""),
				projectUrl: String(formData.get("projectUrl") ?? "") || null,
				stack: String(formData.get("stack") ?? "")
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
				publishedAt: intent,
			};

			if (isEditMode && initialWork) {
				await apiRequest(`/api/client-work/${initialWork.id}`, {
					method: "PATCH",
					auth: true,
					body: JSON.stringify(payload),
				});
			} else {
				await apiRequest("/api/client-work", {
					method: "POST",
					auth: true,
					body: JSON.stringify(payload),
				});
			}

			emitDashboardDataChanged("services");
			setOpen(false);
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to save client work.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const copy = useMemo(() => {
		if (language === "FR") {
			return {
				create: "Ajouter un projet client",
				title: isEditMode ? "Modifier le projet client" : "Ajouter un projet client",
				description: "Gérez les projets livrés aux clients pour la page Services.",
				labelTitle: "Titre (EN)",
				labelTitleFr: "Titre (FR)",
				labelSlug: "Slug URL",
				labelDesc: "Description (EN)",
				labelDescFr: "Description (FR)",
				labelClient: "Nom du client (EN)",
				labelClientFr: "Nom du client (FR)",
				labelImage: "URL de l'image",
				labelProject: "URL du projet",
				labelStack: "Stack technique",
				saveDraft: "Enregistrer brouillon",
				publish: isEditMode ? "Mettre à jour" : "Publier",
			};
		}
		return {
			create: "Add Client Work",
			title: isEditMode ? "Edit Client Work" : "Add Client Work",
			description: "Manage delivered client projects shown on the Services page.",
			labelTitle: "Title (EN)",
			labelTitleFr: "Title (FR)",
			labelSlug: "URL Slug",
			labelDesc: "Description (EN)",
			labelDescFr: "Description (FR)",
			labelClient: "Client Name (EN)",
			labelClientFr: "Client Name (FR)",
			labelImage: "Cover Image URL",
			labelProject: "Project URL",
			labelStack: "Tech Stack",
			saveDraft: "Save Draft",
			publish: isEditMode ? "Update" : "Publish",
		};
	}, [isEditMode, language]);

	return (
		<Dialog open={open} onOpenChange={(newOpen) => {
			setOpen(newOpen);
			if (!newOpen) setError(null);
		}}>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button type="button">
						<Plus className="size-4" />
						{copy.create}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-3xl p-0">
				<form onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
					<DialogHeader className="border-b border-border/70 px-4 pt-4 pb-3">
						<DialogTitle className="text-base">{copy.title}</DialogTitle>
						<DialogDescription>{copy.description}</DialogDescription>
					</DialogHeader>

					<div className="min-h-0 flex-1 overflow-y-auto space-y-3 px-4 py-4">
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-1.5">
								<label htmlFor="cw-title" className="text-xs font-medium text-muted-foreground">{copy.labelTitle}</label>
								<Input id="cw-title" name="title" required placeholder="Healthcare CRM Portal" defaultValue={initialWork?.title} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="cw-title-fr" className="text-xs font-medium text-muted-foreground">{copy.labelTitleFr}</label>
								<Input id="cw-title-fr" name="titleFr" placeholder="Portail CRM Santé" defaultValue={initialWork?.titleFr ?? ""} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="cw-slug" className="text-xs font-medium text-muted-foreground">{copy.labelSlug}</label>
								<Input id="cw-slug" name="slug" placeholder="healthcare-crm-portal" defaultValue={initialWork?.slug ?? ""} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="cw-desc" className="text-xs font-medium text-muted-foreground">{copy.labelDesc}</label>
								<Textarea id="cw-desc" name="description" rows={3} required placeholder="A short description of the delivered project." defaultValue={initialWork?.description} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="cw-desc-fr" className="text-xs font-medium text-muted-foreground">{copy.labelDescFr}</label>
								<Textarea id="cw-desc-fr" name="descriptionFr" rows={2} placeholder="Description en français." defaultValue={initialWork?.descriptionFr ?? ""} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="cw-client" className="text-xs font-medium text-muted-foreground">{copy.labelClient}</label>
								<Input id="cw-client" name="clientName" placeholder="MedCorp Inc." defaultValue={initialWork?.clientName ?? ""} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="cw-client-fr" className="text-xs font-medium text-muted-foreground">{copy.labelClientFr}</label>
								<Input id="cw-client-fr" name="clientNameFr" placeholder="MedCorp Inc." defaultValue={initialWork?.clientNameFr ?? ""} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="cw-image" className="text-xs font-medium text-muted-foreground">{copy.labelImage}</label>
								<Input id="cw-image" name="imageUrl" required placeholder="https://mance.dev/images/work/project.jpg" defaultValue={initialWork?.imageUrl} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="cw-project-url" className="text-xs font-medium text-muted-foreground">{copy.labelProject}</label>
								<Input id="cw-project-url" name="projectUrl" placeholder="https://client-project.com" defaultValue={initialWork?.projectUrl ?? ""} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="cw-stack" className="text-xs font-medium text-muted-foreground">{copy.labelStack}</label>
								<Input id="cw-stack" name="stack" placeholder="Next.js, PostgreSQL, Prisma" defaultValue={initialWork?.stack.join(", ")} />
							</div>
						</div>
					</div>

					<DialogFooter className="sticky bottom-0 mt-auto border-t border-border/70 bg-background px-4 py-3">
						{error ? <p className="w-full text-sm text-destructive">{error}</p> : null}
						<Button variant="outline" type="submit" name="intent" value="draft" disabled={isSubmitting}>
							{copy.saveDraft}
						</Button>
						<Button type="submit" name="intent" value="publish" disabled={isSubmitting}>
							<Save className="size-4" />
							{isSubmitting ? "Saving..." : copy.publish}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
