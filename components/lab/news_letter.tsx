"use client";

import { FormEvent, useState } from "react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/client-api";

export function NewsLetter() {
	const { language } = useLanguage();
	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);

		setStatus("submitting");
		setError(null);

		try {
			await apiRequest("/api/subscribers", {
				method: "POST",
				body: JSON.stringify({
					email: String(formData.get("email") ?? ""),
					source: "public-lab-newsletter",
				}),
			});

			form.reset();
			setStatus("success");
		} catch (submitError) {
			setStatus("error");
			setError(submitError instanceof Error ? submitError.message : language === "FR" ? "Impossible de s'abonner maintenant." : "Unable to subscribe now.");
		}
	};

	return (
		<section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8">
			<div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
			<div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-6">
				<div className="space-y-2">
					<p className="text-xs font-medium uppercase tracking-wide text-primary">{language === "FR" ? "Newsletter" : "Newsletter"}</p>
					<h2 className="text-2xl font-semibold tracking-tight">{language === "FR" ? "Recevez les nouveaux posts du Lab" : "Get New Lab Posts in Your Inbox"}</h2>
					<p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
						{language === "FR" ? "Une courte mise a jour a chaque publication d'etude de cas, article technique ou note d'implementation." : "A short update when I publish a new case study, technical article, or implementation note."}
					</p>
				</div>

				<form className="grid w-full gap-3 sm:grid-cols-[1fr_auto] lg:min-w-107.5" onSubmit={handleSubmit}>
					<Input
						type="email"
						name="email"
						required
						placeholder="you@example.com"
						aria-label={language === "FR" ? "Adresse email" : "Email address"}
						className="h-11"
					/>
					<Button type="submit" className="h-11 px-6" disabled={status === "submitting"}>
						{status === "submitting" ? (language === "FR" ? "Abonnement..." : "Subscribing...") : language === "FR" ? "S'abonner" : "Subscribe"}
					</Button>
					{status === "success" ? (
						<p className="text-sm text-green-600 sm:col-span-2">{language === "FR" ? "Vous etes abonne. Merci." : "You are subscribed. Thank you."}</p>
					) : null}
					{status === "error" ? (
						<p className="text-sm text-destructive sm:col-span-2">{error ?? (language === "FR" ? "Impossible de s'abonner." : "Unable to subscribe.")}</p>
					) : null}
				</form>
			</div>
		</section>
	);
}
