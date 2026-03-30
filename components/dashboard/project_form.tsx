"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Plus, Rocket } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
import type { LabProject } from "@/lib/definitions";

type ProjectFormProps = {
	mode?: "create" | "edit";
	initialProject?: LabProject;
	trigger?: ReactNode;
};

export function ProjectForm({ mode = "create", initialProject, trigger }: ProjectFormProps) {
	const isEditMode = mode === "edit";
	const { language } = useLanguage();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [markdownDetails, setMarkdownDetails] = useState(initialProject?.content ?? "");
	const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | null>(null);
	const [uploadedScreenshots, setUploadedScreenshots] = useState<string[]>(initialProject?.screenshotUrls ?? []);

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
				uploadFormData.append("kind", "project-cover");

				const uploadResponse = await apiRequest<{ url: string }>("/api/uploads", {
					method: "POST",
					auth: true,
					body: uploadFormData,
				});

				coverImageUrl = normalizeMediaUrl(uploadResponse.data?.url ?? coverImageUrl);
				setUploadedCoverUrl(coverImageUrl);
			}

			// Upload screenshot files
			const screenshotFiles = formData.getAll("screenshotFiles") as File[];
			let screenshotUrls = [...uploadedScreenshots]; // Start with existing screenshots

			for (const file of screenshotFiles) {
				if (file instanceof File && file.size > 0) {
					const uploadFormData = new FormData();
					uploadFormData.append("file", file);
					uploadFormData.append("kind", "project-screenshot");

					const uploadResponse = await apiRequest<{ url: string }>("/api/uploads", {
						method: "POST",
						auth: true,
						body: uploadFormData,
					});

					const uploadedUrl = normalizeMediaUrl(uploadResponse.data?.url ?? "");
					if (uploadedUrl) {
						screenshotUrls.push(uploadedUrl);
					}
				}
			}

			setUploadedScreenshots(screenshotUrls);

			const toOptionalAbsoluteUrl = (value: string) => {
				if (!value.trim()) {
					return undefined;
				}
				return normalizeMediaUrl(value);
			};

			const payload = {
				title: String(formData.get("title") ?? ""),
				slug: String(formData.get("slug") ?? ""),
				summary: String(formData.get("summary") ?? ""),
				content: markdownDetails,
				coverImageUrl,
				featured: formData.get("featured") === "on",
				stack: String(formData.get("stack") ?? "")
					.split(",")
					.map((item) => item.trim())
					.filter(Boolean),
				tags: String(formData.get("tags") ?? "")
					.split(",")
					.map((item) => item.trim())
					.filter(Boolean),
				screenshotUrls,
				demoUrl: toOptionalAbsoluteUrl(String(formData.get("demoUrl") ?? "")),
				repoUrl: toOptionalAbsoluteUrl(String(formData.get("repoUrl") ?? "")),
				publishedAt:
					intent === "publish"
						? initialProject?.publishedAt ?? new Date().toISOString()
						: null,
			};

			if (isEditMode && initialProject) {
				await apiRequest(`/api/projects/${initialProject.id}`, {
					method: "PATCH",
					auth: true,
					body: JSON.stringify(payload),
				});
			} else {
				await apiRequest("/api/projects", {
					method: "POST",
					auth: true,
					body: JSON.stringify(payload),
				});
			}

			emitDashboardDataChanged("projects");
			setOpen(false);
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to save project.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const copy = useMemo(() => {
		if (language === "FR") {
			return {
				create: "Creer un projet",
				title: isEditMode ? "Modifier le projet" : "Creer un projet",
				description: "Gerez les metadonnees du projet, la stack technique et les liens externes.",
				labelTitle: "Titre",
				labelSummary: "Resume",
				labelDetails: "Contenu detaille (Markdown)",
				labelImage: "URL image de couverture",
				labelImageUpload: "Televerser l'image de couverture",
				labelStack: "Stack technique",
				labelTags: "Tags",
				labelScreenshots: "Televerser les captures d'ecran",
				labelDemo: "URL de demo",
				labelRepo: "URL du depot",
				labelFeatured: "Mis en avant",
				preview: "Apercu Markdown",
				saveDraft: "Enregistrer le brouillon",
				publish: isEditMode ? "Mettre a jour" : "Publier le projet",
			};
		}

		return {
			create: "Create Project",
			title: isEditMode ? "Edit Project" : "Create Project",
			description: "Maintain project metadata, technical stack, and external links for your lab showcase.",
			labelTitle: "Title",
			labelSummary: "Summary",
			labelDetails: "Detailed Content (Markdown)",
			labelImage: "Cover Image URL",
			labelImageUpload: "Upload Cover Image",
			labelStack: "Tech Stack",
			labelTags: "Tags",
			labelScreenshots: "Upload Screenshots",
			labelDemo: "Demo URL",
			labelRepo: "Repository URL",
			labelFeatured: "Featured",
			preview: "Markdown Preview",
			saveDraft: "Save Draft",
			publish: isEditMode ? "Update Project" : "Publish Project",
		};
	}, [isEditMode, language]);

	return (
		<Dialog open={open} onOpenChange={(newOpen) => {
			setOpen(newOpen);
			if (!newOpen && !isEditMode) {
				setUploadedScreenshots([]);
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
			<DialogContent className="max-w-2xl p-0">
				<form onSubmit={handleSubmit}>
					<DialogHeader className="border-b border-border/70 px-4 pt-4 pb-3">
						<DialogTitle className="text-base">{copy.title}</DialogTitle>
						<DialogDescription>{copy.description}</DialogDescription>
					</DialogHeader>
					<div className="max-h-[70vh] space-y-3 overflow-y-auto px-4 pt-4">
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="project-title" className="text-xs font-medium text-muted-foreground">
									{copy.labelTitle}
								</label>
								<Input id="project-title" name="title" placeholder="Finance CRM Modernization" defaultValue={initialProject?.title} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="project-slug" className="text-xs font-medium text-muted-foreground">
									Slug
								</label>
								<Input id="project-slug" name="slug" placeholder="finance-crm-modernization" defaultValue={initialProject?.slug} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="project-summary" className="text-xs font-medium text-muted-foreground">
									{copy.labelSummary}
								</label>
								<Textarea id="project-summary" name="summary" placeholder="Short problem and solution summary." rows={3} defaultValue={initialProject?.summary} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="project-content" className="text-xs font-medium text-muted-foreground">
									{copy.labelDetails}
								</label>
								<Textarea
									id="project-content"
									placeholder={language === "FR" ? "Ecrivez le contenu detaille en Markdown." : "Write detailed content in Markdown."}
									rows={8}
									value={markdownDetails}
									onChange={(event) => setMarkdownDetails(event.target.value)}
								/>
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<p className="text-xs font-medium text-muted-foreground">{copy.preview}</p>
								<div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border/70 bg-card/50 p-3">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{markdownDetails || (language === "FR" ? "Aucun contenu pour le moment." : "No content yet.")}
									</ReactMarkdown>
								</div>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="project-image" className="text-xs font-medium text-muted-foreground">
									{copy.labelImage}
								</label>
								<Input id="project-image" name="coverImageUrl" placeholder="https://mance.dev/images/lab/portfolio-platform-1.jpg" defaultValue={initialProject?.coverImageUrl} />
								<label htmlFor="project-image-file" className="mt-2 block text-xs font-medium text-muted-foreground">
									{copy.labelImageUpload}
								</label>
								<Input id="project-image-file" name="coverImageFile" type="file" accept="image/*" />
								{uploadedCoverUrl ? <p className="text-xs text-muted-foreground">Uploaded: {uploadedCoverUrl}</p> : null}
							</div>
							<div className="space-y-1.5">
								<label htmlFor="project-stack" className="text-xs font-medium text-muted-foreground">
									{copy.labelStack}
								</label>
								<Input id="project-stack" name="stack" placeholder="Next.js, TypeScript, Prisma, PostgreSQL" defaultValue={initialProject?.stack.join(", ")} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="project-tags" className="text-xs font-medium text-muted-foreground">
									{copy.labelTags}
								</label>
								<Input id="project-tags" name="tags" placeholder="platform, case-study, nextjs" defaultValue={initialProject?.tags.join(", ")} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="project-screenshots" className="text-xs font-medium text-muted-foreground">
									{copy.labelScreenshots}
								</label>
								<Input
									id="project-screenshots"
									name="screenshotFiles"
									type="file"
									accept="image/*"
									multiple
								/>
								{uploadedScreenshots.length > 0 ? (
									<div className="space-y-1.5">
										<p className="text-xs text-muted-foreground">Uploaded screenshots:</p>
										<div className="space-y-1">
											{uploadedScreenshots.map((url, index) => (
												<p key={`${url}-${index}`} className="text-xs text-muted-foreground break-all">
													{index + 1}. {url}
												</p>
											))}
										</div>
									</div>
								) : null}
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground" htmlFor="project-featured">
									<input
										id="project-featured"
										name="featured"
										type="checkbox"
										defaultChecked={Boolean(initialProject?.featured)}
										className="size-4 rounded border-input"
									/>
									{copy.labelFeatured}
								</label>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="project-demo" className="text-xs font-medium text-muted-foreground">
									{copy.labelDemo}
								</label>
								<Input id="project-demo" name="demoUrl" placeholder="https://mance.dev" defaultValue={initialProject?.demoUrl} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="project-repo" className="text-xs font-medium text-muted-foreground">
									{copy.labelRepo}
								</label>
								<Input id="project-repo" name="repoUrl" placeholder="https://github.com/mance-dev/portfolio-platform" defaultValue={initialProject?.repoUrl} />
							</div>
						</div>
					</div>

					<DialogFooter>
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