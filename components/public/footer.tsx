import Image from "next/image";
import Link from "next/link";
import { Facebook, Github, Linkedin, MessageCircle, Coffee } from "lucide-react";

import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";

function isValidHref(value: string | null | undefined) {
	if (!value) {
		return false;
	}

	if (value.startsWith("/")) {
		return true;
	}

	try {
		const parsed = new URL(value);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

export async function Footer() {
	const year = new Date().getFullYear();
	let contact: {
		socialLinks: Array<{ id: string; platform: string; label: string; url: string }>;
	} | null = null;
	let about: { cvDownloadUrl: string } | null = null;

	try {
		[contact, about] = await Promise.all([
			prisma.contactDetails.findFirst({
				include: {
					socialLinks: {
						orderBy: { displayOrder: "asc" },
					},
				},
			}),
			prisma.aboutSummary.findFirst({
				select: { cvDownloadUrl: true },
			}),
		]);
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Footer data query failed, rendering fallback footer:", error);
		}
	}

	const socialIcons = {
		GITHUB: Github,
		LINKEDIN: Linkedin,
		WHATSAPP: MessageCircle,
		FACEBOOK: Facebook,
	} as const;

	return (
		<footer className="mt-16 border-t border-border/70 bg-card/60 backdrop-blur-md">
			<div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 grid-cols-1 sm:grid-cols-2 lg:flex lg:items-start lg:justify-between lg:px-8">
				
				{/* Brand, Logo & Quote */}
				<div className="space-y-4 max-w-sm">
					<div className="inline-flex items-center gap-2">
						<Image
							src="/images/mac_tech_logo.png"
							alt="MAC TECH logo"
							width={28}
							height={28}
							className="h-auto w-auto rounded-md"
						/>
						<p className="text-base font-semibold tracking-wide">MAC TECH</p>
					</div>
					<p className="text-xs text-muted-foreground leading-relaxed">
						<Tx
							en="Building digital solutions and automated pipelines for modern organizations."
							fr="Concevoir des solutions numériques et des pipelines automatisés pour les organisations modernes."
						/>
					</p>
					
					{/* Short Quote */}
					<p className="text-xs text-muted-foreground/80 italic leading-relaxed pt-1">
						&ldquo;<Tx
							en="Crafting stable code and automated systems to solve complex business challenges."
							fr="Concevoir du code stable et des systèmes automatisés pour résoudre les défis complexes."
						/>&rdquo;
					</p>

					{/* Social Links */}
					<div className="pt-2">
						<div className="flex items-center gap-2">
							{(contact?.socialLinks ?? []).map((link) => {
								const Icon = socialIcons[link.platform as keyof typeof socialIcons];
								if (!Icon || !isValidHref(link.url)) {
									return null;
								}
								return (
									<a
										key={link.id}
										href={link.url}
										target="_blank"
										rel="noreferrer noopener"
										className="inline-flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/20"
										aria-label={link.label || link.platform}
									>
										<Icon className="size-4" />
									</a>
								);
							})}
						</div>
					</div>
				</div>

				{/* Nav Links column */}
				<div className="space-y-3">
					<p className="text-xs font-bold uppercase tracking-wider text-foreground">
						<Tx en="Navigation" fr="Navigation" />
					</p>
					<div className="grid gap-2 text-xs text-muted-foreground">
						<Link href="/" className="transition-colors hover:text-foreground">
							<Tx en="Home" fr="Accueil" />
						</Link>
						<Link href="/services" className="transition-colors hover:text-foreground">
							<Tx en="Services" fr="Services" />
						</Link>
						<Link href="/lab" className="transition-colors hover:text-foreground">
							<Tx en="Portfolio Lab" fr="Lab de Portfolio" />
						</Link>
						<Link href="/academy" className="transition-colors hover:text-foreground">
							<Tx en="Academy Hub" fr="Espace Académie" />
						</Link>
					</div>
				</div>

				{/* Resources and Download */}
				<div className="space-y-3">
					<p className="text-xs font-bold uppercase tracking-wider text-foreground">
						<Tx en="Resources" fr="Ressources" />
					</p>
					<div className="grid gap-2 text-xs text-muted-foreground">
						<a
							href={about?.cvDownloadUrl || "/MadickAngeCesar_FullStack_Resume_EN.pdf"}
							download
							className="transition-colors hover:text-foreground"
						>
							<Tx en="⬇️ Resume - English (PDF)" fr="⬇️ CV - Anglais (PDF)" />
						</a>
						<a
							href={about?.cvDownloadUrl || "/MadickAngeCesar_FullStack_CV_FR.pdf"}
							download
							className="transition-colors hover:text-foreground"
						>
							<Tx en="⬇️ Resume - French (PDF)" fr="⬇️ CV - Français (PDF)" />
						</a>
						<Link href="/sign-in" className="transition-colors hover:text-foreground">
							<Tx en="Dashboard" fr="Tableau de bord" />
						</Link>
					</div>
				</div>

				{/* Buy Me a Coffee Column */}
				<div className="space-y-3 lg:text-right lg:items-end flex flex-col items-start">
					<p className="text-xs font-bold uppercase tracking-wider text-foreground">
						<Tx en="Support Work" fr="Soutenir mon travail" />
					</p>
					<p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] lg:text-right">
						<Tx
							en="Support the hosting and building of free open-source software tools."
							fr="Soutenez l'hébergement et le développement d'outils logiciels libres."
						/>
					</p>
					<div className="pt-1">
						<Link
							href="/lab"
							className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/10"
						>
							<Coffee className="size-4 shrink-0" />
							<span>
								<Tx en="Buy me a coffee" fr="M'offrir un café" />
							</span>
						</Link>
					</div>
				</div>

			</div>
			
			<div className="border-t border-border/70 px-4 py-6 text-center text-[11px] text-muted-foreground sm:px-6 lg:px-8">
				© {year} MAC TECH. All rights reserved.
			</div>
		</footer>
	);
}
