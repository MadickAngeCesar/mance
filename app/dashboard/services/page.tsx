import type { Metadata } from "next";

import { Tx } from "@/components/i18n/tx";
import { OfferingForm } from "@/components/dashboard/offering_form";
import { OfferingList } from "@/components/dashboard/offering_list";
import { TestimonialForm } from "@/components/dashboard/testimonial_form";
import { TestimonialsList } from "@/components/dashboard/testimonials_list";
import { WorkflowStageForm } from "@/components/dashboard/workflow_stage_form";
import { WorkflowStageList } from "@/components/dashboard/workflow_stage_list";
import { ClientWorkForm } from "@/components/dashboard/client_work_form";
import { ClientWorkList } from "@/components/dashboard/client_work_list";

export const metadata: Metadata = {
  title: "Services | Dashboard",
};

export default function ServicesDashboardPage() {
	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight"><Tx en="Services Management" fr="Gestion des services" /></h1>
					<p className="text-sm text-muted-foreground">
						<Tx en="Manage service offerings, package details, and testimonial proof used on your public services page." fr="Gerez les offres de services, les details des packages et les temoignages affiches sur votre page Services." />
					</p>
				</div>
				<OfferingForm />
			</div>

			<OfferingList />

			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="space-y-1">
					<h2 className="text-xl font-semibold tracking-tight"><Tx en="Delivery Workflow" fr="Workflow de delivery" /></h2>
					<p className="text-sm text-muted-foreground">
						<Tx en="Create, edit, and order workflow stages displayed in Services." fr="Creez, modifiez et ordonnez les etapes du workflow affichees sur Services." />
					</p>
				</div>
				<WorkflowStageForm />
			</div>

			<WorkflowStageList />

			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="space-y-1">
					<h2 className="text-xl font-semibold tracking-tight"><Tx en="Testimonials" fr="Temoignages" /></h2>
					<p className="text-sm text-muted-foreground">
						<Tx en="Manage social proof cards linked to delivered projects." fr="Gerez les cartes de preuve sociale liees aux projets realises." />
					</p>
				</div>
				<TestimonialForm />
			</div>

			<div className="grid gap-3">
				<TestimonialsList />
			</div>

			{/* Client Work Section */}
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div className="space-y-1">
					<h2 className="text-xl font-semibold tracking-tight"><Tx en="Client Work" fr="Projets Clients" /></h2>
					<p className="text-sm text-muted-foreground">
						<Tx en="Manage delivered client projects displayed on the Services page." fr="Gérez les projets clients livrés affichés sur la page Services." />
					</p>
				</div>
				<ClientWorkForm />
			</div>

			<ClientWorkList />
		</section>
	);
}
