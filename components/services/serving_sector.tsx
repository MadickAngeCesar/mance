"use client";

import { Activity, ShoppingBag, GraduationCap, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tx } from "@/components/i18n/tx";

type SectorItem = {
	id: string;
	icon: React.ComponentType<any>;
	titleEn: string;
	titleFr: string;
	descEn: string;
	descFr: string;
	valuesEn: string[];
	valuesFr: string[];
	accentClass: string;
};

const sectors: SectorItem[] = [
	{
		id: "healthcare",
		icon: Activity,
		titleEn: "Healthcare & Biotech",
		titleFr: "Santé et Biotech",
		descEn: "Operations dashboards, appointment tracking systems, and secure data interfaces designed for clinical administration.",
		descFr: "Tableaux de bord d'opérations, systèmes de suivi de rendez-vous et interfaces de données sécurisées pour l'administration clinique.",
		valuesEn: ["Patient scheduling portals", "HIPAA/GDPR security guidelines", "Admin analytics pipelines"],
		valuesFr: ["Portails de planification patients", "Directives de sécurité HIPAA/RGPD", "Pipelines d'analyse admin"],
		accentClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
	},
	{
		id: "saas",
		icon: ShoppingBag,
		titleEn: "SaaS & E-Commerce",
		titleFr: "SaaS et E-Commerce",
		descEn: "Scalable subscription applications, dashboard controllers, and payment processor integrations (Stripe, Paypal) with clean checkout pipelines.",
		descFr: "Applications d'abonnement évolutives, contrôleurs de tableaux de bord et intégrations de processeurs de paiement (Stripe, Paypal).",
		valuesEn: ["Custom checkout flows", "Subscription billing engines", "Role-based user management"],
		valuesFr: ["Flux de paiement personnalisés", "Moteurs de facturation d'abonnements", "Gestion des utilisateurs par rôles"],
		accentClass: "text-violet-400 border-violet-500/20 bg-violet-500/5",
	},
	{
		id: "edtech",
		icon: GraduationCap,
		titleEn: "EdTech & Learning Hubs",
		titleFr: "EdTech et Hubs d'Apprentissage",
		descEn: "Online learning portals, content delivery frameworks for guides/books, and interactive course completion features.",
		descFr: "Portails d'apprentissage en ligne, frameworks de diffusion de guides/livres et fonctionnalités de validation de cours.",
		valuesEn: ["Downloadable ebook systems", "Course completion tracking", "Interactive resource libraries"],
		valuesFr: ["Systèmes de livres numériques", "Suivi de validation des cours", "Bibliothèques de ressources"],
		accentClass: "text-blue-400 border-blue-500/20 bg-blue-500/5",
	},
	{
		id: "smb",
		icon: Building2,
		titleEn: "SMB & Workflow Automation",
		titleFr: "PME et Automatisation de Workflows",
		descEn: "Replacing manual spreadsheets with database-backed portals, automated status workflows, and visual pipeline management.",
		descFr: "Remplacement des tableurs manuels par des portails de bases de données et des workflows de statut automatisés.",
		valuesEn: ["Lead intake pipelines", "Automated email workflows", "Consolidated business dashboards"],
		valuesFr: ["Pipelines d'acquisition de leads", "Workflows d'e-mails automatisés", "Tableaux de bord d'activité consolidés"],
		accentClass: "text-amber-400 border-amber-500/20 bg-amber-500/5",
	},
];

export function ServingSector() {
	return (
		<section className="space-y-6" id="sectors">
			<div className="text-center">
				<h2 className="text-2xl font-semibold tracking-tight">
					<Tx en="Target Sectors & Industry Expertise" fr="Secteurs Cibles et Expertise Métier" />
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					<Tx
						en="Software solutions custom-tailored for the operational demands of specialized industries."
						fr="Solutions logicielles adaptées sur mesure aux exigences opérationnelles des secteurs spécialisés."
					/>
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{sectors.map((sector) => {
					const Icon = sector.icon;
					return (
						<Card
							key={sector.id}
							className={`flex flex-col border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 ${sector.accentClass}`}
						>
							<CardHeader className="pb-3">
								<div className="flex size-10 items-center justify-center rounded-lg bg-background/50 border border-current/10 mb-3">
									<Icon className="size-5" />
								</div>
								<CardTitle className="text-lg font-semibold text-foreground">
									<Tx en={sector.titleEn} fr={sector.titleFr} />
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col flex-1 gap-4">
								<p className="text-xs text-muted-foreground leading-relaxed flex-1">
									<Tx en={sector.descEn} fr={sector.descFr} />
								</p>
								<div className="border-t border-border/40 pt-3">
									<ul className="space-y-1.5 text-[11px] text-muted-foreground">
										<Tx
											en={sector.valuesEn.map((val, idx) => (
												<li key={`${sector.id}-v-${idx}`} className="flex items-center gap-1.5">
													<span className="size-1 rounded-full bg-primary" />
													<span>{val}</span>
												</li>
											))}
											fr={sector.valuesFr.map((val, idx) => (
												<li key={`${sector.id}-v-${idx}`} className="flex items-center gap-1.5">
													<span className="size-1 rounded-full bg-primary" />
													<span>{val}</span>
												</li>
											))}
										/>
									</ul>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
