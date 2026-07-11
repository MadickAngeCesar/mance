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
import { emitDashboardDataChanged } from "@/components/dashboard/data-events";
import { apiRequest } from "@/lib/client-api";

type TeamMemberItem = {
	id: string;
	name: string;
	role: string;
	roleFr?: string | null;
	speciality: string;
	specialityFr?: string | null;
	imageUrl: string;
	linkedIn?: string | null;
	whatsApp?: string | null;
	email?: string | null;
	website?: string | null;
	displayOrder: number;
};

type CollaboratorFormProps = {
	mode?: "create" | "edit";
	initialMember?: TeamMemberItem;
	trigger?: ReactNode;
};

export function CollaboratorForm({ mode = "create", initialMember, trigger }: CollaboratorFormProps) {
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
			const payload = {
				name: String(formData.get("name") ?? ""),
				role: String(formData.get("role") ?? ""),
				roleFr: String(formData.get("roleFr") ?? "") || null,
				speciality: String(formData.get("speciality") ?? ""),
				specialityFr: String(formData.get("specialityFr") ?? "") || null,
				imageUrl: String(formData.get("imageUrl") ?? "") || "/images/Profile.jpg",
				linkedIn: String(formData.get("linkedIn") ?? "") || null,
				whatsApp: String(formData.get("whatsApp") ?? "") || null,
				email: String(formData.get("email") ?? "") || null,
				website: String(formData.get("website") ?? "") || null,
				displayOrder: Number(formData.get("displayOrder") ?? "1"),
			};

			if (isEditMode && initialMember) {
				await apiRequest(`/api/collaborators/${initialMember.id}`, {
					method: "PATCH",
					auth: true,
					body: JSON.stringify(payload),
				});
			} else {
				await apiRequest("/api/collaborators", {
					method: "POST",
					auth: true,
					body: JSON.stringify(payload),
				});
			}

			// We emit a dashboard data changed event. We can register "profile" or a new domain.
			// Let's use "profile" as it manages team data.
			emitDashboardDataChanged("profile");
			setOpen(false);
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Unable to save collaborator.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const copy = useMemo(() => {
		if (language === "FR") {
			return {
				create: "Ajouter un collaborateur",
				title: isEditMode ? "Modifier le collaborateur" : "Ajouter un collaborateur",
				description: "Gérez les profils des freelances et amis avec qui vous collaborez.",
				labelName: "Nom",
				labelRole: "Rôle (EN)",
				labelRoleFr: "Rôle (FR)",
				labelSpec: "Spécialité (EN)",
				labelSpecFr: "Spécialité (FR)",
				labelImage: "URL Image de profil",
				labelLinkedIn: "Lien LinkedIn",
				labelWhatsApp: "Lien WhatsApp / Numéro",
				labelEmail: "Email",
				labelWebsite: "Site Web",
				labelOrder: "Ordre d'affichage",
				save: isEditMode ? "Mettre à jour" : "Ajouter",
			};
		}
		return {
			create: "Add Collaborator",
			title: isEditMode ? "Edit Collaborator" : "Add Collaborator",
			description: "Manage profiles of other freelancers and partners you collaborate with.",
			labelName: "Name",
			labelRole: "Role (EN)",
			labelRoleFr: "Role (FR)",
			labelSpec: "Speciality (EN)",
			labelSpecFr: "Speciality (FR)",
			labelImage: "Profile Image URL",
			labelLinkedIn: "LinkedIn Link",
			labelWhatsApp: "WhatsApp Link / Number",
			labelEmail: "Email Address",
			labelWebsite: "Website URL",
			labelOrder: "Display Order",
			save: isEditMode ? "Update" : "Add",
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
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="collab-name" className="text-xs font-medium text-muted-foreground">{copy.labelName}</label>
								<Input id="collab-name" name="name" required placeholder="John Doe" defaultValue={initialMember?.name} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="collab-role" className="text-xs font-medium text-muted-foreground">{copy.labelRole}</label>
								<Input id="collab-role" name="role" required placeholder="UI/UX Designer" defaultValue={initialMember?.role} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="collab-role-fr" className="text-xs font-medium text-muted-foreground">{copy.labelRoleFr}</label>
								<Input id="collab-role-fr" name="roleFr" placeholder="Designer UI/UX" defaultValue={initialMember?.roleFr ?? ""} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="collab-spec" className="text-xs font-medium text-muted-foreground">{copy.labelSpec}</label>
								<Input id="collab-spec" name="speciality" required placeholder="Figma, Prototyping, User Research" defaultValue={initialMember?.speciality} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="collab-spec-fr" className="text-xs font-medium text-muted-foreground">{copy.labelSpecFr}</label>
								<Input id="collab-spec-fr" name="specialityFr" placeholder="Figma, Maquettage, Recherche Utilisateur" defaultValue={initialMember?.specialityFr ?? ""} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="collab-image" className="text-xs font-medium text-muted-foreground">{copy.labelImage}</label>
								<Input id="collab-image" name="imageUrl" required placeholder="https://mance.dev/images/collabs/john.jpg" defaultValue={initialMember?.imageUrl} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="collab-linkedin" className="text-xs font-medium text-muted-foreground">{copy.labelLinkedIn}</label>
								<Input id="collab-linkedin" name="linkedIn" placeholder="https://linkedin.com/in/johndoe" defaultValue={initialMember?.linkedIn ?? ""} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="collab-whatsapp" className="text-xs font-medium text-muted-foreground">{copy.labelWhatsApp}</label>
								<Input id="collab-whatsapp" name="whatsApp" placeholder="https://wa.me/..." defaultValue={initialMember?.whatsApp ?? ""} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="collab-email" className="text-xs font-medium text-muted-foreground">{copy.labelEmail}</label>
								<Input id="collab-email" name="email" type="email" placeholder="john@example.com" defaultValue={initialMember?.email ?? ""} />
							</div>
							<div className="space-y-1.5">
								<label htmlFor="collab-website" className="text-xs font-medium text-muted-foreground">{copy.labelWebsite}</label>
								<Input id="collab-website" name="website" placeholder="https://johndoe.dev" defaultValue={initialMember?.website ?? ""} />
							</div>
							<div className="space-y-1.5 md:col-span-2">
								<label htmlFor="collab-order" className="text-xs font-medium text-muted-foreground">{copy.labelOrder}</label>
								<Input id="collab-order" name="displayOrder" type="number" min="1" placeholder="1" defaultValue={initialMember?.displayOrder ?? 1} />
							</div>
						</div>
					</div>

					<DialogFooter className="sticky bottom-0 mt-auto border-t border-border/70 bg-background px-4 py-3">
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
