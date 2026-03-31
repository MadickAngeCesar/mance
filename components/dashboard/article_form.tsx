"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Plus, WandSparkles } from "lucide-react";

import { emitDashboardDataChanged } from "@/components/dashboard/data-events";
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
import { MarkdownRenderer } from "@/components/ui/markdown_renderer";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/client-api";
import type { LabArticle } from "@/lib/definitions";
import { cn } from "@/lib/utils";

type ArticleFormProps = {
	mode?: "create" | "edit";
	initialArticle?: LabArticle;
	trigger?: ReactNode;
};

export function ArticleForm({ mode = "create", initialArticle, trigger }: ArticleFormProps) {
	const isEditMode = mode === "edit";
	const { language } = useLanguage();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [markdownContent, setMarkdownContent] = useState(initialArticle?.content ?? "");
	const [editorView, setEditorView] = useState<"write" | "preview">("write");
	const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | null>(null);

	const normalizeMediaUrl = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) {
			return trimmed;
		}

		if (trimmed.startsWith("/")) {
			return trimmed;
		}

		try {
			const parsed = new URL(trimmed);
			if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
				return `${parsed.pathname}${parsed.search}`;
			}
		} catch {
			return trimmed;
		}

		return trimmed;
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const intent = formData.get("intent") === "draft" ? "draft" : "publish";
		setIsSubmitting(true);
		setError(null);

		try {
			let coverImageUrl = normalizeMediaUrl(String(formData.get("coverImageUrl") ?? ""));
			const coverImageFile = formData.get("coverImageFile");
			if (coverImageFile instanceof File && coverImageFile.size > 0) {
				const uploadFormData = new FormData();
				uploadFormData.append("file", coverImageFile);
				uploadFormData.append("kind", "article-cover");

				const uploadResponse = await apiRequest<{ url: string }>("/api/uploads", {
					method: "POST",
					auth: true,
					body: uploadFormData,
				});

				coverImageUrl = normalizeMediaUrl(uploadResponse.data?.url ?? coverImageUrl);
				setUploadedCoverUrl(coverImageUrl);
			}

			const payload = {
				title: String(formData.get("title") ?? ""),
				excerpt: String(formData.get("excerpt") ?? ""),
				coverImageUrl,
				slug: String(formData.get("slug") ?? ""),
				category: String(formData.get("category") ?? ""),
				featured: formData.get("featured") === "on",
				tags: String(formData.get("tags") ?? "")
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
				content: markdownContent,
				publishedAt:
					intent === "publish"
						? initialArticle?.publishedAt ?? new Date().toISOString()
						: null,
			};

			if (isEditMode && initialArticle) {
				await apiRequest(`/api/blogs/${initialArticle.id}`, {
					method: "PATCH",
					auth: true,
					body: JSON.stringify(payload),
				});
			} else {
				await apiRequest("/api/blogs", {
					method: "POST",
					auth: true,
					body: JSON.stringify(payload),
				});
			}

			emitDashboardDataChanged("blogs");
			setOpen(false);
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to save article.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const copy = useMemo(() => {
		if (language === "FR") {
			return {
				create: "Creer un article",
				title: isEditMode ? "Modifier l'article" : "Creer un article",
				description: "Redigez un article technique en Markdown puis publiez-le dans le Lab.",
				labelTitle: "Titre",
				labelDescription: "Description courte",
				labelImage: "URL de l'image de couverture",
				labelImageUpload: "Televerser l'image de couverture",
				labelSlug: "URL / Slug",
				labelCategory: "Categorie",
				labelTags: "Tags",
				labelContent: "Contenu (Markdown)",
				placeholderContent: "Ecrivez votre contenu en Markdown avec titres, listes et blocs de code.",
				preview: "Apercu Markdown",
				write: "Ecrire",
				previewOnly: "Apercu",
				saveDraft: "Enregistrer le brouillon",
				publish: isEditMode ? "Mettre a jour" : "Publier l'article",
				labelFeatured: "Mis en avant",
			};
		}

		return {
			create: "Create Article",
			title: isEditMode ? "Edit Article" : "Create Article",
			description: "Draft long-form technical writing in Markdown, then publish it to the lab.",
			labelTitle: "Title",
			labelDescription: "Short Description",
			labelImage: "Cover Image URL",
			labelImageUpload: "Upload Cover Image",
			labelSlug: "Article URL / Slug",
			labelCategory: "Category",
			labelTags: "Tags",
			labelContent: "Content (Markdown)",
			placeholderContent: "Write markdown content with headings, lists, links, and code blocks.",
			preview: "Markdown Preview",
			write: "Write",
			previewOnly: "Preview",
			saveDraft: "Save Draft",
			publish: isEditMode ? "Update Article" : "Publish Article",
			labelFeatured: "Featured",
		};
	}, [isEditMode, language]);

	return (
		<Dialog
			open={open}
			onOpenChange={(newOpen) => {
				setOpen(newOpen);
				if (!newOpen) {
					setEditorView("write");
					setMarkdownContent(initialArticle?.content ?? "");
					setUploadedCoverUrl(null);
					setError(null);
				}
			}}
		>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button type="button">
						<Plus className="size-4" />
						{copy.create}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-4xl p-0">
				<form onSubmit={handleSubmit} className="flex max-h-[92vh] flex-col sm:max-h-[88vh]">
					<DialogHeader className="border-b border-border/70 px-4 pt-4 pb-3">
						<DialogTitle className="text-base">{copy.title}</DialogTitle>
						<DialogDescription>{copy.description}</DialogDescription>
					</DialogHeader>
					<div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pt-4 pb-4 sm:px-5">
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="article-title" className="text-xs font-medium text-muted-foreground">
									{copy.labelTitle}
								</label>
								<Input
									id="article-title"
									name="title"
									placeholder="Designing Reliable Form Pipelines in Next.js"
									defaultValue={initialArticle?.title}
								/>
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="article-description" className="text-xs font-medium text-muted-foreground">
									{copy.labelDescription}
								</label>
								<Textarea
									id="article-description"
									name="excerpt"
									placeholder="Concise summary for cards and SEO snippets."
									rows={3}
									defaultValue={initialArticle?.excerpt}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="article-image" className="text-xs font-medium text-muted-foreground">
									{copy.labelImage}
								</label>
								<Input
									id="article-image"
									name="coverImageUrl"
									placeholder="https://mance.dev/images/lab/your-article-cover.jpg"
									defaultValue={initialArticle?.coverImageUrl}
								/>
								<label htmlFor="article-image-file" className="mt-2 block text-xs font-medium text-muted-foreground">
									{copy.labelImageUpload}
								</label>
								<Input id="article-image-file" name="coverImageFile" type="file" accept="image/*" />
								{uploadedCoverUrl ? (
									<p className="text-xs text-muted-foreground">Uploaded: {uploadedCoverUrl}</p>
								) : null}
							</div>
							<div className="space-y-1.5">
								<label htmlFor="article-url" className="text-xs font-medium text-muted-foreground">
									{copy.labelSlug}
								</label>
								<Input
									id="article-url"
									name="slug"
									placeholder="reliable-form-pipelines-nextjs"
									defaultValue={initialArticle?.slug}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="article-category" className="text-xs font-medium text-muted-foreground">
									{copy.labelCategory}
								</label>
								<select
									id="article-category"
									name="category"
									className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
									defaultValue={initialArticle?.category ?? "Engineering"}
								>
									<option>Engineering</option>
									<option>Case Study</option>
									<option>Tutorial</option>
									<option>Research</option>
									<option>IT Support</option>
									<option>Product Design</option>
									<option>Business</option>
								</select>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="article-tags" className="text-xs font-medium text-muted-foreground">
									{copy.labelTags}
								</label>
								<Input
									id="article-tags"
									name="tags"
									placeholder="nextjs, zod, forms"
									defaultValue={initialArticle?.tags.join(", ")}
								/>
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground" htmlFor="article-featured">
									<input
										id="article-featured"
										name="featured"
										type="checkbox"
										defaultChecked={Boolean(initialArticle?.featured)}
										className="size-4 rounded border-input"
									/>
									{copy.labelFeatured}
								</label>
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<div className="flex items-center justify-between gap-3">
									<label htmlFor="article-content" className="text-xs font-medium text-muted-foreground">
										{copy.labelContent}
									</label>
									<div className="inline-flex rounded-lg border border-border/70 bg-muted/40 p-0.5 md:hidden">
										<button
											type="button"
											onClick={() => setEditorView("write")}
											className={cn(
												"rounded-md px-2.5 py-1 text-xs font-medium transition",
												editorView === "write" ? "bg-background text-foreground" : "text-muted-foreground",
											)}
										>
											{copy.write}
										</button>
										<button
											type="button"
											onClick={() => setEditorView("preview")}
											className={cn(
												"rounded-md px-2.5 py-1 text-xs font-medium transition",
												editorView === "preview" ? "bg-background text-foreground" : "text-muted-foreground",
											)}
										>
											{copy.previewOnly}
										</button>
									</div>
								</div>
								<div className="grid gap-3 md:grid-cols-2">
									<div className={cn("space-y-1.5", editorView === "preview" ? "hidden md:block" : undefined)}>
										<Textarea
											id="article-content"
											placeholder={copy.placeholderContent}
											rows={14}
											className="min-h-60 md:min-h-72"
											value={markdownContent}
											onChange={(event) => setMarkdownContent(event.target.value)}
										/>
									</div>
									<div className={cn("space-y-1.5", editorView === "write" ? "hidden md:block" : undefined)}>
										<p className="hidden text-xs font-medium text-muted-foreground md:block">{copy.preview}</p>
										<div className="max-h-[48vh] overflow-y-auto rounded-lg border border-border/70 bg-card/50 p-3">
											<MarkdownRenderer
												content={markdownContent}
												emptyState={language === "FR" ? "Aucun contenu pour le moment." : "No content yet."}
												className="text-sm"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<DialogFooter className="sticky bottom-0 mt-auto">
						{error ? <p className="w-full text-sm text-destructive">{error}</p> : null}
						<Button variant="outline" type="submit" name="intent" value="draft" disabled={isSubmitting}>
							{copy.saveDraft}
						</Button>
						<Button type="submit" name="intent" value="publish" disabled={isSubmitting}>
							<WandSparkles className="size-4" />
							{isSubmitting ? "Saving..." : copy.publish}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
