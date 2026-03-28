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
			slug: String(formData.get("slug") ?? ""),
			summary: String(formData.get("summary") ?? ""),
			content: markdownDetails,
			coverImageUrl: toAbsoluteUrl(String(formData.get("coverImageUrl") ?? "")),
			stack: String(formData.get("stack") ?? "")
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean),
			demoUrl: String(formData.get("demoUrl") ?? "") || undefined,
			repoUrl: String(formData.get("repoUrl") ?? "") || undefined,
			tags: initialProject?.tags ?? [],
			screenshotUrls: initialProject?.screenshotUrls ?? [],
		};

		try {
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
				labelStack: "Stack technique",
				labelDemo: "URL de demo",
				labelRepo: "URL du depot",
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
			labelStack: "Tech Stack",
			labelDemo: "Demo URL",
			labelRepo: "Repository URL",
			preview: "Markdown Preview",
			saveDraft: "Save Draft",
			publish: isEditMode ? "Update Project" : "Publish Project",
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
							</div>
							<div className="space-y-1.5">
								<label htmlFor="project-stack" className="text-xs font-medium text-muted-foreground">
									{copy.labelStack}
								</label>
								<Input id="project-stack" name="stack" placeholder="Next.js, TypeScript, Prisma, PostgreSQL" defaultValue={initialProject?.stack.join(", ")} />
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
						<Button variant="outline" type="button">{copy.saveDraft}</Button>
						<Button type="submit" disabled={isSubmitting}>
							<Rocket className="size-4" />
							{isSubmitting ? "Saving..." : copy.publish}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}