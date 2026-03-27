import Image from "next/image";
import Link from "next/link";
import { Facebook, Github, Linkedin, MessageCircle } from "lucide-react";

import { contactDetails } from "@/lib/placeholder-data";

export function Footer() {
	const year = new Date().getFullYear();

	const socialIcons = {
		GitHub: Github,
		LinkedIn: Linkedin,
		WhatsApp: MessageCircle,
		Facebook: Facebook,
	} as const;

	return (
		<footer className="mt-16 border-t border-border/70 bg-card/60">
			<div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:flex lg:items-start lg:justify-between lg:px-8">
				<div className="space-y-3">
					<div className="inline-flex items-center gap-2">
						<Image
							src="/images/mac_tech_logo.png"
							alt="MAC TECH logo"
							width={28}
							height={28}
							className="h-auto w-auto rounded-md"
						/>
						<p className="text-base font-semibold">MAC TECH</p>
					</div>
					<p className="text-sm text-muted-foreground">Building digital solutions for modern organizations.</p>
					<p className="text-xs text-muted-foreground">mance.dev</p>
					<div className="pt-2">
						<div className="flex items-center gap-2">
							{contactDetails.socialLinks.map((link) => {
								const Icon = socialIcons[link.platform];
								return (
									<Link
										key={link.platform}
										href={link.url}
										target="_blank"
										rel="noreferrer noopener"
										className="inline-flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
										aria-label={link.platform}
									>
										<Icon className="size-4" />
									</Link>
								);
							})}
						</div>
					</div>
				</div>

				<div className="space-y-2 lg:justify-self-end lg:text-right">
					<p className="text-sm font-semibold">Resources</p>
					<div className="grid gap-1 text-sm text-muted-foreground">
						<Link href="/MadickAngeCesar_FullStack_Resume_EN.pdf" download className="transition-colors hover:text-foreground">
							Resume (PDF)
						</Link>
						<Link href="/sign-in" className="transition-colors hover:text-foreground">Dashboard</Link>
						<Link href="/lab" className="transition-colors hover:text-foreground">Portfolio Lab</Link>
						<Link href="/services" className="transition-colors hover:text-foreground">Service Details</Link>
					</div>
				</div>
			</div>
			<div className="border-t border-border/70 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
				© {year} MAC TECH. All rights reserved.
			</div>
		</footer>
	);
}
