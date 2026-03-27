"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
	{ label: { EN: "Home", FR: "Accueil" }, href: "/" },
	{ label: { EN: "Services", FR: "Services" }, href: "/services" },
	{ label: { EN: "Lab", FR: "Lab" }, href: "/lab" },
	{ label: { EN: "Contact", FR: "Contact" }, href: "/#contact" },
];

export function Navbar() {
	const { language } = useLanguage();
	const pathname = usePathname();

	const isActive = (href: string) => {
		if (href.startsWith("/#")) {
			return pathname === "/";
		}
		return pathname === href;
	};

	return (
		<header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="inline-flex items-center gap-2">
					<Image src="/images/mac_tech_logo.png" alt="MAC TECH logo" width={28} height={28} className="h-auto w-auto rounded-md" />
					<div className="leading-none">
						<p className="text-sm font-semibold tracking-wide">MAC TECH</p>
						<p className="text-[11px] text-muted-foreground">mance.dev</p>
					</div>
				</Link>

				<nav className="hidden items-center gap-5 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"border-b border-transparent pb-0.5 text-sm transition-colors hover:text-foreground",
								isActive(link.href)
									? "border-primary/60 font-medium text-foreground"
									: "text-muted-foreground"
							)}
							aria-current={isActive(link.href) ? "page" : undefined}
						>
							{link.label[language]}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<LanguageSwitcher />

					<Button asChild size="sm" className="hidden md:inline-flex">
						<Link href="/#contact">{language === "FR" ? "Demarrer un projet" : "Start a Project"}</Link>
					</Button>

					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon-sm" className="md:hidden" aria-label="Open navigation menu">
								<Menu className="size-4" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-72">
							<SheetHeader>
								<SheetTitle>{language === "FR" ? "Navigation" : "Navigation"}</SheetTitle>
								<SheetDescription>{language === "FR" ? "Liens rapides vers les sections principales du portfolio." : "Quick links to the core sections of the portfolio."}</SheetDescription>
							</SheetHeader>
							<nav className="grid gap-2 px-4 pb-4">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											"rounded-md border border-border/70 px-3 py-2 text-sm transition-colors hover:text-foreground",
											isActive(link.href)
												? "bg-primary/10 text-foreground"
												: "text-muted-foreground"
										)}
										aria-current={isActive(link.href) ? "page" : undefined}
									>
										{link.label[language]}
									</Link>
								))}
								<Button asChild className="mt-2">
									<Link href="/#contact">{language === "FR" ? "Demarrer un projet" : "Start a Project"}</Link>
								</Button>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
