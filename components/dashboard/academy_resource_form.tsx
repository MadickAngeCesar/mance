"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Plus, Rocket } from "lucide-react";

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

type AcademyResourceItem = {
	id: string;
	title: string;
	titleFr?: string | null;
	slug: string;
	description: string;
	descriptionFr?: string | null;
	content: string;
	contentFr?: string | null;
	type: "ARTICLE" | "GUIDE" | "BOOK" | "COURSE";
	coverImageUrl: string;
	tags: string[];
	publishedAt?: string | null;
};

type AcademyResourceFormProps = {
	mode?: "create" | "edit";
	initialResource?: AcademyResourceItem;
	trigger?: ReactNode;
};

export function AcademyResourceForm({ mode = "create", initialResource, trigger }: AcademyResourceFormProps) {
	const isEditMode = mode === "edit";
	const { language } = useLanguage();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const intent = formData.get("intent");
		setIsSubmitting(true);
		setError(null);

		try {
			let coverImageUrl = String(formData.get("coverImageUrl") ?? "");
			const coverImageFile = formData.get("coverImageFile");
			if (coverImageFile instanceof File && coverImageFile.size > 0) {
				const uploadFormData = new FormData();
				uploadFormData.append("file", coverImageFile);
				uploadFormData.append("kind", "academy-cover");

				const uploadResponse = await apiRequest<{ url: string }>("/api/uploads", {
					method: "POST",
					auth: true,
					body: uploadFormData,
				});

				coverImageUrl = uploadResponse.data?.url ?? coverImageUrl;
				setUploadedCoverUrl(coverImageUrl);
			}

			const payload = {
				title: String(formData.get("title") ?? ""),
				titleFr: String(formData.get("titleFr") ?? "") || null,
				slug: String(formData.get("slug") ?? ""),
				description: String(formData.get("description") ?? ""),
				descriptionFr: String(formData.get("descriptionFr") ?? "") || null,
				content: String(formData.get("content") ?? ""),
				contentFr: String(formData.get("contentFr") ?? "") || null,
				type: String(formData.get("type") ?? "ARTICLE"),
				coverImageUrl,
				tags: String(formData.get("tags") ?? "")
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
				publishedAt: intent === "publish"
					? (initialResource?.publishedAt ?? new Date().toISOString())
					: null,
			};

			if (isEditMode && initialResource) {
				await apiRequest(`/api/academy/${initialResource.id}`, {
					method: "PATCH",
					auth: true,
					body: JSON.stringify(payload),
				});
			} else {
				await apiRequest("/api/academy", {
					method: "POST",
					auth: true,
					body: JSON.stringify(payload),
				});
			}

			emitDashboardDataChanged("blogs"); // Re-use blogs domain for academy refresh
			setOpen(false);
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to save resource.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const copy = useMemo(() => {
		if (language === "FR") {
			return {
				create: "Ajouter une ressource",
				title: isEditMode ? "Modifier la ressource" : "Ajouter une ressource",
				description: "Gérez les articles, guides, livres et cours de l'Académie.",
				labelTitle: "Titre (EN)", labelTitleFr: "Titre (FR)",
				labelSlug: "Slug URL", labelType: "Type",
				labelDesc: "Description (EN)", labelDescFr: "Description (FR)",
				labelContent: "Contenu (Markdown)",
				labelContentFr: "Contenu FR (Markdown)",
				labelImage: "URL Image de couverture",
				labelImageUpload: "Téléverser l'image de couverture",
				labelTags: "Tags (séparés par virgule)",
				saveDraft: "Brouillon", publish: isEditMode ? "Mettre à jour" : "Publier",
			};
		}
		return {
			create: "Add Resource",
			title: isEditMode ? "Edit Resource" : "Add Academy Resource",
			description: "Manage articles, guides, books and courses for the Academy page.",
			labelTitle: "Title (EN)", labelTitleFr: "Title (FR)",
			labelSlug: "URL Slug", labelType: "Type",
			labelDesc: "Description (EN)", labelDescFr: "Description (FR)",
			labelContent: "Content (Markdown)",
			labelContentFr: "Content FR (Markdown)",
			labelImage: "Cover Image URL",
			labelImageUpload: "Upload Cover Image",
			labelTags: "Tags (comma-separated)",
			saveDraft: "Save Draft", publish: isEditMode ? "Update" : "Publish",
		};
	}, [isEditMode, language]);

	return (
		<Dialog open={open} onOpenChange={(newOpen) => {
			setOpen(newOpen);
			if (!newOpen) {
				setError(null);
				setUploadedCoverUrl(null);
			}
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
								<label htmlFor="ar-title" className="text-xs font-medium text-muted-foreground">{copy.labelTitle}</label>
								<Input id="ar-title" name="title" required placeholder="Mastering TypeScript" defaultValue={initialResource?.title} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="ar-title-fr" className="text-xs font-medium text-muted-foreground">{copy.labelTitleFr}</label>
								<Input id="ar-title-fr" name="titleFr" placeholder="Maîtriser TypeScript" defaultValue={initialResource?.titleFr ?? ""} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="ar-slug" className="text-xs font-medium text-muted-foreground">{copy.labelSlug}</label>
								<Input id="ar-slug" name="slug" required placeholder="mastering-typescript" defaultValue={initialResource?.slug} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="ar-type" className="text-xs font-medium text-muted-foreground">{copy.labelType}</label>
								<select
									id="ar-type"
									name="type"
									defaultValue={initialResource?.type ?? "ARTICLE"}
									className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
								>
									<option value="ARTICLE">Article</option>
									<option value="GUIDE">Guide / Cheat Sheet</option>
									<option value="BOOK">Book</option>
									<option value="COURSE">Course</option>
								</select>
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="ar-desc" className="text-xs font-medium text-muted-foreground">{copy.labelDesc}</label>
								<Textarea id="ar-desc" name="description" rows={2} required placeholder="A short description for this resource." defaultValue={initialResource?.description} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="ar-desc-fr" className="text-xs font-medium text-muted-foreground">{copy.labelDescFr}</label>
								<Textarea id="ar-desc-fr" name="descriptionFr" rows={2} placeholder="Description en français." defaultValue={initialResource?.descriptionFr ?? ""} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="ar-content" className="text-xs font-medium text-muted-foreground">{copy.labelContent}</label>
								<Textarea id="ar-content" name="content" rows={6} placeholder="# Full Markdown content..." defaultValue={initialResource?.content} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="ar-content-fr" className="text-xs font-medium text-muted-foreground">{copy.labelContentFr}</label>
								<Textarea id="ar-content-fr" name="contentFr" rows={4} placeholder="# Contenu en Markdown..." defaultValue={initialResource?.contentFr ?? ""} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="ar-image" className="text-xs font-medium text-muted-foreground">{copy.labelImage}</label>
								<Input id="ar-image" name="coverImageUrl" required placeholder="https://mance.dev/images/academy/typescript-guide.jpg" defaultValue={initialResource?.coverImageUrl} />
								<label htmlFor="ar-image-file" className="mt-2 block text-xs font-medium text-muted-foreground">{copy.labelImageUpload}</label>
								<Input id="ar-image-file" name="coverImageFile" type="file" accept="image/*" />
								{uploadedCoverUrl ? <p className="text-xs text-muted-foreground">Uploaded: {uploadedCoverUrl}</p> : null}
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="ar-tags" className="text-xs font-medium text-muted-foreground">{copy.labelTags}</label>
								<Input id="ar-tags" name="tags" placeholder="typescript, javascript, web-dev" defaultValue={initialResource?.tags.join(", ")} />
							</div>
						</div>
					</div>

					<DialogFooter className="sticky bottom-0 mt-auto border-t border-border/70 bg-background px-4 py-3">
						{error ? <p className="w-full text-sm text-destructive">{error}</p> : null}
						<Button variant="outline" type="submit" name="intent" value="draft" disabled={isSubmitting}>
							{copy.saveDraft}
						</Button>
						<Button type="submit" name="intent" value="publish" disabled={isSubmitting}>
							<Rocket className="size-4" />
							{isSubmitting ? "Saving..." : copy.publish}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
