import type { Metadata } from "next";

import { Tx } from "@/components/i18n/tx";
import { OfferingForm } from "@/components/dashboard/offering_form";
import { OfferingList } from "@/components/dashboard/offering_list";
import { TestimonialForm } from "@/components/dashboard/testimonial_form";
import { TestimonialsList } from "@/components/dashboard/testimonials_list";

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
		</section>
	);
}
