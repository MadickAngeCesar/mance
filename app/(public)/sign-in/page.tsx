import type { Metadata } from "next";

import { ArrowRight, ShieldCheck } from "lucide-react";

import { Tx } from "@/components/i18n/tx";
import { Badge } from "@/components/ui/badge";
import { LoginForm } from "@/components/public/login_form";
import { brandProfile, contactDetails } from "@/lib/placeholder-data";

export const metadata: Metadata = {
  title: `Sign In | ${brandProfile.currentName}`,
  description: "Sign in to the MAC TECH dashboard to manage projects, inquiries, services, and content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
	const dashboardSections = [
		{ en: "Message and lead inbox", fr: "Boite de messages et prospects" },
		{ en: "Project and service records", fr: "Suivi des projets et services" },
		{ en: "Client testimonials and subscribers", fr: "Temoignages clients et abonnes" },
		{ en: "Publishing pipeline for lab content", fr: "Pipeline de publication pour le Lab" },
	];

	return (
		<section className="relative isolate overflow-hidden">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,oklch(0.67_0.2_290/0.17),transparent_40%),radial-gradient(circle_at_90%_8%,oklch(0.76_0.13_220/0.16),transparent_35%),linear-gradient(180deg,oklch(0.18_0.02_275)_0%,oklch(0.16_0.02_275)_100%)]"
			/>

			<div className="mx-auto w-full gap-8 px-4 py-12 sm:px-6 sm:grid sm:grid-cols-[1.1fr_0.9fr] sm:py-16">
				<div className="hidden sm:grid items-start gap-8">
					<Badge variant="secondary" className="border border-primary/30 bg-primary/15 text-primary">
						{brandProfile.currentName} Admin
					</Badge>

					<div className="space-y-3">
						<h1 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
							<Tx en="Secure sign-in for your portfolio operations hub." fr="Connexion securisee pour votre hub d'operations portfolio." />
						</h1>
						<p className="max-w-xl text-sm text-muted-foreground sm:text-base">
							{brandProfile.roleTagline}. <Tx en="Access the workspace that centralizes delivery, communication, and publishing." fr="Accedez a l'espace qui centralise la livraison, la communication et la publication." />
						</p>
					</div>

					<div className="grid gap-2 text-sm text-muted-foreground">
						{dashboardSections.map((item) => (
							<div key={item.en} className="inline-flex items-start gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 backdrop-blur-sm">
								<ArrowRight className="mt-0.5 size-4 text-accent" />
								<span><Tx en={item.en} fr={item.fr} /></span>
							</div>
						))}
					</div>

					<div className="inline-flex items-start gap-2 rounded-lg border border-accent/35 bg-accent/10 px-3 py-2 text-xs text-muted-foreground">
						<ShieldCheck className="mt-0.5 size-4 text-accent" />
						<p>
							<Tx en="Authentication API is prepared for JWT + bcrypt integration per portfolio requirements." fr="L'API d'authentification est prete pour l'integration JWT + bcrypt selon les exigences du portfolio." />
							 {" "}
							<Tx en="Need credentials? Reach out via" fr="Besoin d'identifiants ? Contactez" /> {contactDetails.email}.
						</p>
					</div>
				</div>

				<div>
					<LoginForm />
				</div>
			</div>
		</section>
	);
}
