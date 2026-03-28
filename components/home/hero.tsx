import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

function getFreelanceAvailabilityText(label: string) {
	const now = new Date();
	const day = now.getDay();
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	if (day >= 1 && day <= 5) {
		return `${label}: Available today`;
	}

	const nextBusinessDay = 8 - day;
	const nextDate = new Date(now);
	nextDate.setDate(now.getDate() + nextBusinessDay);
	return `${label}: Available ${dayNames[nextDate.getDay()]}`;
}

export async function Hero() {
	const profile = await prisma.brandProfile.findFirst({
		select: {
			currentName: true,
			ownerName: true,
			roleTagline: true,
			headline: true,
			subTagline: true,
			freelanceAvailabilityLabel: true,
			jobAvailabilityLabel: true,
		},
	});

	const brand = {
		currentName: profile?.currentName ?? "MAC TECH",
		ownerName: profile?.ownerName ?? "MAC TECH",
		roleTagline: profile?.roleTagline ?? "Technology and digital solutions",
		headline: profile?.headline ?? "Building practical digital products",
		subTagline:
			profile?.subTagline ??
			"We design and deliver modern web solutions for organizations and founders.",
		freelanceAvailabilityLabel: profile?.freelanceAvailabilityLabel ?? "Freelance",
		jobAvailabilityLabel: profile?.jobAvailabilityLabel ?? "Career",
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
					<p className="text-sm font-medium text-muted-foreground">{brand.roleTagline}</p>
					<p className="text-base font-semibold text-foreground">{brand.headline}</p>
					<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
						{brand.subTagline}
					</p>
					<div className="hidden sm:flex sm:flex-wrap items-center justify-center gap-3">
						<Badge variant="outline" className="rounded-full border-primary/40 text-primary">
							{getFreelanceAvailabilityText(brand.freelanceAvailabilityLabel)}
						</Badge>
						<Button asChild>
							<Link href="/lab">Explore my work</Link>
						</Button>
						<Badge variant="outline" className="rounded-full border-cyan-500/50 text-cyan-700">
							{brand.jobAvailabilityLabel}: Open to interviews
						</Badge>
					</div>
                    <div className="sm:hidden flex flex-wrap items-center justify-center gap-3">
						<Badge variant="outline" className="rounded-full border-primary/40 text-primary">
							{getFreelanceAvailabilityText(brand.freelanceAvailabilityLabel)}
						</Badge>
						<Badge variant="outline" className="rounded-full border-cyan-500/50 text-cyan-700">
							{brand.jobAvailabilityLabel}: Open to interviews
						</Badge>
						<Button asChild>
							<Link href="/lab">Explore my work</Link>
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