import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";

function getFreelanceAvailabilityText(label: string, language: "EN" | "FR") {
	const now = new Date();
	const day = now.getDay();
	const dayNames = language === "EN"
        ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        : ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

	if (day >= 1 && day <= 5) {
		return language === "EN" ? `${label}: Available today` : `${label} : Disponible aujourd'hui`;
	}

	const nextBusinessDay = 8 - day;
	const nextDate = new Date(now);
	nextDate.setDate(now.getDate() + nextBusinessDay);

    if (language === "EN") {
        return `${label}: Available ${dayNames[nextBusinessDay % 7]}`;
    } else {
        return `${label} : Disponible ${dayNames[nextBusinessDay % 7]}`;
    }
}

export async function Hero() {
	let profile: {
		currentName: string;
		ownerName: string;
		roleTagline: string;
		roleTaglineFr: string | null;
		headline: string;
		headlineFr: string | null;
		subTagline: string;
		subTaglineFr: string | null;
		freelanceAvailabilityLabel: string;
		freelanceAvailabilityLabelFr: string | null;
		jobAvailabilityLabel: string;
		jobAvailabilityLabelFr: string | null;
	} | null = null;

	try {
		profile = await prisma.brandProfile.findFirst({
			select: {
				currentName: true,
				ownerName: true,
				roleTagline: true,
				roleTaglineFr: true,
				headline: true,
				headlineFr: true,
				subTagline: true,
				subTaglineFr: true,
				freelanceAvailabilityLabel: true,
				freelanceAvailabilityLabelFr: true,
				jobAvailabilityLabel: true,
				jobAvailabilityLabelFr: true,
			},
		});
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("Hero section query failed, rendering fallback content:", error);
		}
	}

	const brand = {
		currentName: profile?.currentName ?? "MAC TECH",
		ownerName: profile?.ownerName ?? "MAC TECH",
		roleTagline: profile?.roleTagline ?? "Technology and digital solutions",
		roleTaglineFr: profile?.roleTaglineFr ?? "Solutions technologiques et numériques",
		headline: profile?.headline ?? "Building practical digital products",
		headlineFr: profile?.headlineFr ?? "Construire des produits numériques pratiques",
		subTagline:
			profile?.subTagline ??
			"We design and deliver modern web solutions for organizations and founders.",
		subTaglineFr:
			profile?.subTaglineFr ??
			"Nous concevons et livrons des solutions web modernes pour les organisations et les fondateurs.",
		freelanceAvailabilityLabel: profile?.freelanceAvailabilityLabel ?? "Freelance",
		freelanceAvailabilityLabelFr: profile?.freelanceAvailabilityLabelFr ?? "Freelance",
		jobAvailabilityLabel: profile?.jobAvailabilityLabel ?? "Career",
		jobAvailabilityLabelFr: profile?.jobAvailabilityLabelFr ?? "Carrière",
	};

	return (
		<section className="rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card to-accent/30 p-6 sm:p-10">
			<div className="grid items-center gap-8 md:grid-cols-[130px_1fr_130px]">
				<div className="mx-auto size-28 overflow-hidden rounded-2xl ring-2 ring-border md:size-32">
					<Image
						src="/images/Profile.jpg"
						alt={`${brand.ownerName} portrait`}
						width={256}
						height={256}
						className="h-full w-full object-cover"
						priority
					/>
				</div>

				<div className="space-y-4 text-center">
					<Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
						{brand.currentName}
					</Badge>
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						{brand.ownerName}
					</h1>
					<p className="text-sm font-medium text-muted-foreground">
                        <Tx en={brand.roleTagline} fr={brand.roleTaglineFr} />
                    </p>
					<p className="text-base font-semibold text-foreground">
                        <Tx en={brand.headline} fr={brand.headlineFr} />
                    </p>
					<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
						<Tx en={brand.subTagline} fr={brand.subTaglineFr} />
					</p>
					<div className="hidden sm:flex sm:flex-wrap items-center justify-center gap-3">
						<Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                            <Tx
                                en={getFreelanceAvailabilityText(brand.freelanceAvailabilityLabel, "EN")}
                                fr={getFreelanceAvailabilityText(brand.freelanceAvailabilityLabelFr, "FR")}
                            />
						</Badge>
						<Button asChild>
							<Link href="/lab">
                                <Tx en="Explore my work" fr="Explorer mon travail" />
                            </Link>
						</Button>
						<Badge variant="outline" className="rounded-full border-cyan-500/50 text-cyan-700">
                            <Tx
                                en={`${brand.jobAvailabilityLabel}: Open to interviews`}
                                fr={`${brand.jobAvailabilityLabelFr} : Ouvert aux entretiens`}
                            />
						</Badge>
					</div>
                    <div className="sm:hidden flex flex-wrap items-center justify-center gap-3">
						<Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                            <Tx
                                en={getFreelanceAvailabilityText(brand.freelanceAvailabilityLabel, "EN")}
                                fr={getFreelanceAvailabilityText(brand.freelanceAvailabilityLabelFr, "FR")}
                            />
						</Badge>
						<Badge variant="outline" className="rounded-full border-cyan-500/50 text-cyan-700">
                            <Tx
                                en={`${brand.jobAvailabilityLabel}: Open to interviews`}
                                fr={`${brand.jobAvailabilityLabelFr} : Ouvert aux entretiens`}
                            />
						</Badge>
						<Button asChild>
							<Link href="/lab">
                                <Tx en="Explore my work" fr="Explorer mon travail" />
                            </Link>
						</Button>
					</div>
				</div>

				<div className="mx-auto hidden rounded-2xl border border-border bg-background p-4 md:block">
					<Image
						src="/images/mac_tech_logo.png"
						alt={`${brand.currentName} logo`}
						width={120}
						height={120}
						className="h-auto w-auto"
					/>
				</div>
			</div>
		</section>
	);
}
