import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import { brandProfile as fallbackBrand } from "@/lib/placeholder-data";
import { ThreeBackground } from "./three-background";

function getFreelanceAvailabilityText(label: string, language: "EN" | "FR") {
	const now = new Date();
	const day = now.getDay();
	const dayNames = language === "EN"
        ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        : ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

	if (day >= 1 && day <= 6) {
		return language === "EN" ? `${label}: Available today` : `${label} : Disponible aujourd'hui`;
	}

	// Sunday -> Available Monday
	const nextDayIndex = 1;

    if (language === "EN") {
        return `${label}: Available ${dayNames[nextDayIndex]}`;
    } else {
        return `${label} : Disponible ${dayNames[nextDayIndex]}`;
    }
}
export async function Hero() {
	let profile: any = null;

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
		currentName: profile?.currentName ?? fallbackBrand.currentName,
		ownerName: profile?.ownerName ?? fallbackBrand.ownerName,
		roleTagline: profile?.roleTagline ?? fallbackBrand.roleTagline,
		roleTaglineFr: profile?.roleTaglineFr ?? fallbackBrand.roleTaglineFr,
		headline: profile?.headline ?? fallbackBrand.headline,
		headlineFr: profile?.headlineFr ?? fallbackBrand.headlineFr,
		subTagline: profile?.subTagline ?? fallbackBrand.subTagline,
		subTaglineFr: profile?.subTaglineFr ?? fallbackBrand.subTaglineFr,
		freelanceAvailabilityLabel: profile?.freelanceAvailabilityLabel ?? fallbackBrand.freelanceAvailabilityLabel,
		freelanceAvailabilityLabelFr: profile?.freelanceAvailabilityLabelFr ?? fallbackBrand.freelanceAvailabilityLabelFr,
		jobAvailabilityLabel: profile?.jobAvailabilityLabel ?? fallbackBrand.jobAvailabilityLabel,
		jobAvailabilityLabelFr: profile?.jobAvailabilityLabelFr ?? fallbackBrand.jobAvailabilityLabelFr,
	};

	return (
		<section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card to-accent/30 p-6 sm:p-10">
			<ThreeBackground />
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
                                fr={getFreelanceAvailabilityText(brand.freelanceAvailabilityLabelFr || brand.freelanceAvailabilityLabel, "FR")}
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
                                fr={`${brand.jobAvailabilityLabelFr || brand.jobAvailabilityLabel} : Ouvert aux entretiens`}
                            />
						</Badge>
					</div>
                    <div className="sm:hidden flex flex-wrap items-center justify-center gap-3">
						<Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                            <Tx
                                en={getFreelanceAvailabilityText(brand.freelanceAvailabilityLabel, "EN")}
                                fr={getFreelanceAvailabilityText(brand.freelanceAvailabilityLabelFr || brand.freelanceAvailabilityLabel, "FR")}
                            />
						</Badge>
						<Badge variant="outline" className="rounded-full border-cyan-500/50 text-cyan-700">
                            <Tx
                                en={`${brand.jobAvailabilityLabel}: Open to interviews`}
                                fr={`${brand.jobAvailabilityLabelFr || brand.jobAvailabilityLabel} : Ouvert aux entretiens`}
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
