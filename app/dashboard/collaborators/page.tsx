import type { Metadata } from "next";
import { Tx } from "@/components/i18n/tx";
import { CollaboratorForm } from "@/components/dashboard/collaborator_form";
import { CollaboratorList } from "@/components/dashboard/collaborator_list";

export const metadata: Metadata = {
	title: "Collaborators | Dashboard",
};

export default function CollaboratorsDashboardPage() {
	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">
						<Tx en="Freelance Collaborators" fr="Collaborateurs Freelances" />
					</h1>
					<p className="text-sm text-muted-foreground">
						<Tx
							en="Manage other freelancers and friends displayed on your public homepage."
							fr="Gérez les profils des freelances et amis affichés sur votre page d'accueil publique."
						/>
					</p>
				</div>
				<CollaboratorForm />
			</div>

			<CollaboratorList />
		</section>
	);
}
