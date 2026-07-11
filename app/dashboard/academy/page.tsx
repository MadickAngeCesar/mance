import type { Metadata } from "next";
import { Tx } from "@/components/i18n/tx";
import { AcademyResourceForm } from "@/components/dashboard/academy_resource_form";
import { AcademyResourceList } from "@/components/dashboard/academy_resource_list";

export const metadata: Metadata = {
	title: "Academy | Dashboard",
};

export default function AcademyDashboardPage() {
	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">
						<Tx en="Academy Content Management" fr="Gestion du contenu Académie" />
					</h1>
					<p className="text-sm text-muted-foreground">
						<Tx
							en="Create, edit, and publish articles, guides, books, and courses for the Academy page."
							fr="Créez, modifiez et publiez des articles, guides, livres et cours pour la page Académie."
						/>
					</p>
				</div>
				<AcademyResourceForm />
			</div>

			<AcademyResourceList />
		</section>
	);
}
