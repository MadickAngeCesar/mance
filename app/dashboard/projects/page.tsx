import type { Metadata } from "next";

import { Tx } from "@/components/i18n/tx";
import { ProjectForm } from "@/components/dashboard/project_form";
import { ProjectList } from "@/components/dashboard/project_list";

export const metadata: Metadata = {
	title: "Projects | Dashboard",
};

export default function ProjectsDashboardPage() {
	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight"><Tx en="Projects Management" fr="Gestion des projets" /></h1>
					<p className="text-sm text-muted-foreground">
						<Tx en="Maintain your project portfolio, case-study metadata, and showcase links." fr="Gerez votre portfolio de projets, les metadonnees des etudes de cas et les liens de presentation." />
					</p>
				</div>
				<ProjectForm />
			</div>

			<ProjectList />
		</section>
	);
}
