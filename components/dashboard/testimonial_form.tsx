"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
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
import type { TestimonialItem } from "@/lib/definitions";

type TestimonialFormProps = {
	mode?: "create" | "edit";
	initialTestimonial?: TestimonialItem;
	trigger?: ReactNode;
};

export function TestimonialForm({ mode = "create", initialTestimonial, trigger }: TestimonialFormProps) {
	const { language } = useLanguage();
	const isEditMode = mode === "edit";
	const [open, setOpen] = useState(false);
	const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(null);

	type ProjectListMeta = { pages?: number };

	const fetchAllProjects = async () => {
		const basePath = "/api/projects?published=all&featured=all&sort=newest";
		const first = await apiRequest<any[]>(`${basePath}&page=1&limit=50`, { auth: true });
		const firstData = first.data ?? [];
		const pages = Number((first.meta as ProjectListMeta | undefined)?.pages ?? 1);

		if (!Number.isFinite(pages) || pages <= 1) {
			return firstData;
		}

		const requests: Array<ReturnType<typeof apiRequest<any[]>>> = [];
		for (let page = 2; page <= pages; page += 1) {
			requests.push(apiRequest<any[]>(`${basePath}&page=${page}&limit=50`, { auth: true }));
		}

		const rest = await Promise.all(requests);
		return [...firstData, ...rest.flatMap((result) => result.data ?? [])];
	};

	useEffect(() => {
		let isMounted = true;

		async function loadProjects() {
			try {
				const data = await fetchAllProjects();
				if (isMounted) {
					setProjects(
						data
							.filter((project) => Boolean(project?.id && project?.title))
							.map((project) => ({ id: project.id, title: project.title }))
					);
				}
			} catch {
				if (isMounted) {
					setProjects([]);
				}
			}
		}

		void loadProjects();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setIsSubmitting(true);
		setError(null);

		try {
			let avatarUrl = String(formData.get("avatarUrl") ?? "") || undefined;
			const avatarFile = formData.get("avatarFile");
			if (avatarFile instanceof File && avatarFile.size > 0) {
				const uploadFormData = new FormData();
				uploadFormData.append("file", avatarFile);
				uploadFormData.append("kind", "testimonial-avatar");

				const uploadResponse = await apiRequest<{ url: string }>("/api/uploads", {
					method: "POST",
					auth: true,
					body: uploadFormData,
				});

				avatarUrl = uploadResponse.data?.url ?? avatarUrl;
				setUploadedAvatarUrl(avatarUrl ?? null);
			}

			const payload = {
				clientName: String(formData.get("clientName") ?? ""),
				clientRoleCompany: String(formData.get("clientRoleCompany") ?? ""),
				rating: Number(formData.get("rating") ?? 5),
				avatarUrl,
				projectReference: String(formData.get("projectReference") ?? ""),
				text: String(formData.get("text") ?? ""),
				date: String(formData.get("date") ?? ""),
			};

			if (isEditMode && initialTestimonial) {
				await apiRequest(`/api/testimonials/${initialTestimonial.id}`, {
					method: "PATCH",
					auth: true,
					body: JSON.stringify(payload),
				});
			} else {
				await apiRequest("/api/testimonials", {
					method: "POST",
					auth: true,
					body: JSON.stringify(payload),
				});
			}

			emitDashboardDataChanged("services");
			setOpen(false);
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to save testimonial.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const copy = useMemo(() => {
		if (language === "FR") {
			return {
				create: "Creer un temoignage",
				title: isEditMode ? "Modifier le temoignage" : "Creer un temoignage",
				description: "Ajoutez une preuve sociale avec contexte client et impact du projet.",
				name: "Nom du client",
				role: "Role et entreprise",
				rating: "Evaluation",
				avatar: "URL avatar",
				avatarUpload: "Televerser l'avatar",
				project: "Projet client (optionnel)",
				projectNone: "Aucun projet selectionne",
				quote: "Citation",
				save: isEditMode ? "Mettre a jour le temoignage" : "Enregistrer le temoignage",
			};
		}

		return {
			create: "Create Testimonial",
			title: isEditMode ? "Edit Testimonial" : "Create Testimonial",
			description: "Capture social proof with role/company context and delivery impact notes.",
			name: "Client Name",
			role: "Role and Company",
			rating: "Rating",
			avatar: "Avatar Image URL",
			avatarUpload: "Upload Avatar Image",
			project: "Client Project (optional)",
			projectNone: "No linked project",
			quote: "Quote",
			save: isEditMode ? "Update Testimonial" : "Save Testimonial",
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
			<DialogContent className="max-w-xl p-0">
				<form onSubmit={handleSubmit}>
				<DialogHeader className="border-b border-border/70 px-4 pt-4 pb-3">
					<DialogTitle className="text-base">{copy.title}</DialogTitle>
					<DialogDescription>{copy.description}</DialogDescription>
				</DialogHeader>
				<div className="max-h-[70vh] space-y-3 overflow-y-auto px-4 pt-4">
					<div className="grid gap-3 md:grid-cols-2">
					<div className="space-y-1.5">
						<label htmlFor="testimonial-name" className="text-xs font-medium text-muted-foreground">
							{copy.name}
						</label>
						<Input id="testimonial-name" name="clientName" placeholder="Sarah Jean" defaultValue={initialTestimonial?.clientName} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="testimonial-role" className="text-xs font-medium text-muted-foreground">
							{copy.role}
						</label>
						<Input id="testimonial-role" name="clientRoleCompany" placeholder="Founder, BrightPath Studio" defaultValue={initialTestimonial?.clientRoleCompany} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="testimonial-rating" className="text-xs font-medium text-muted-foreground">
							{copy.rating}
						</label>
						<select id="testimonial-rating" name="rating" className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm" defaultValue={String(initialTestimonial?.rating ?? 5)}>
							<option value="5">{language === "FR" ? "5 etoiles" : "5 stars"}</option>
							<option value="4">{language === "FR" ? "4 etoiles" : "4 stars"}</option>
							<option value="3">{language === "FR" ? "3 etoiles" : "3 stars"}</option>
						</select>
					</div>
					<div className="space-y-1.5">
						<label htmlFor="testimonial-image" className="text-xs font-medium text-muted-foreground">
							{copy.avatar}
						</label>
						<Input id="testimonial-image" name="avatarUrl" placeholder="https://mance.dev/images/clients/sarah-jean.jpg" defaultValue={initialTestimonial?.avatarUrl} />
						<label htmlFor="testimonial-image-file" className="mt-2 block text-xs font-medium text-muted-foreground">
							{copy.avatarUpload}
						</label>
						<Input id="testimonial-image-file" name="avatarFile" type="file" accept="image/*" />
						{uploadedAvatarUrl ? <p className="text-xs text-muted-foreground">Uploaded: {uploadedAvatarUrl}</p> : null}
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="testimonial-project" className="text-xs font-medium text-muted-foreground">
							{copy.project}
						</label>
						<select id="testimonial-project" name="projectReference" className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm" defaultValue={initialTestimonial?.projectReference ?? ""}>
							<option value="">{copy.projectNone}</option>
							{projects.map((project) => (
								<option key={project.id} value={project.title}>
									{project.title}
								</option>
							))}
						</select>
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<label htmlFor="testimonial-text" className="text-xs font-medium text-muted-foreground">
							{copy.quote}
						</label>
						<Textarea id="testimonial-text" name="text" placeholder="MAC TECH translated our rough idea into a complete platform..." rows={4} defaultValue={initialTestimonial?.text} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="testimonial-date" className="text-xs font-medium text-muted-foreground">
							{language === "FR" ? "Date" : "Date"}
						</label>
						<Input id="testimonial-date" name="date" placeholder="January 2025" defaultValue={initialTestimonial?.date} />
					</div>
					<div className="space-y-1.5">
						<label htmlFor="testimonial-project-reference" className="text-xs font-medium text-muted-foreground">
							{language === "FR" ? "Reference projet" : "Project Reference"}
						</label>
						<Input id="testimonial-project-reference" placeholder="Project: Service Business Platform" defaultValue={initialTestimonial?.projectReference} disabled />
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