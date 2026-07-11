"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, Briefcase, Cpu, GraduationCap, Mail, ChevronRight } from "lucide-react";

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
	{ label: { EN: "Home", FR: "Accueil" }, href: "/", icon: Home },
	{ label: { EN: "Services", FR: "Services" }, href: "/services", icon: Briefcase },
	{ label: { EN: "Lab", FR: "Lab" }, href: "/lab", icon: Cpu },
	{ label: { EN: "Academy", FR: "Académie" }, href: "/academy", icon: GraduationCap },
	{ label: { EN: "Contact", FR: "Contact" }, href: "/#contact", icon: Mail },
];

export function Navbar() {
	const { language } = useLanguage();
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isActive = (href: string) => {
		return pathname === href;
	};

	return (
		<header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				
				{/* Logo / Title */}
				<Link href="/" className="inline-flex items-center gap-2 group">
					<Image
						src="/images/mac_tech_logo.png"
						alt="MAC TECH logo"
						width={28}
						height={28}
						className="h-auto w-auto rounded-md transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="leading-none">
						<p className="text-sm font-semibold tracking-wide text-foreground">MAC TECH</p>
						<p className="text-[11px] text-muted-foreground">mance.dev</p>
					</div>
				</Link>

				{/* Desktop Navigation Links */}
				<nav className="hidden items-center gap-6 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"border-b-2 border-transparent pb-1 text-[15px] font-medium tracking-wide transition-all duration-200 hover:text-foreground",
								isActive(link.href)
									? "border-primary text-foreground"
									: "text-muted-foreground/90"
							)}
							aria-current={isActive(link.href) ? "page" : undefined}
						>
							{link.label[language]}
						</Link>
					))}
				</nav>

				{/* CTA / Mobile Action Button */}
				<div className="flex items-center gap-2.5">
					<LanguageSwitcher />

					<Button asChild size="sm" className="hidden md:inline-flex bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
						<Link href="/#contact">{language === "FR" ? "Démarrer un projet" : "Start a Project"}</Link>
					</Button>

					{mounted ? (
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" size="icon-sm" className="md:hidden border-border/80 hover:bg-secondary/30" aria-label="Open navigation menu">
									<Menu className="size-4.5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-80 border-l border-border/80 bg-background/95 backdrop-blur-md p-6 flex flex-col justify-between">
								<div className="space-y-6">
									<SheetHeader className="text-left border-b border-border/40 pb-4">
										<div className="flex items-center gap-2">
											<Image
												src="/images/mac_tech_logo.png"
												alt="MAC TECH logo"
												width={24}
												height={24}
												className="rounded-md"
											/>
											<SheetTitle className="text-lg font-bold tracking-tight">MAC TECH</SheetTitle>
										</div>
										<SheetDescription className="text-xs text-muted-foreground mt-1">
											{language === "FR" ? "Ingénierie logicielle & solutions cloud" : "Software engineering & cloud solutions"}
										</SheetDescription>
									</SheetHeader>
									
									{/* Mobile Navigation List */}
									<nav className="flex flex-col gap-2.5">
										{navLinks.map((link) => {
											const Icon = link.icon;
											return (
												<Link
													key={link.href}
													href={link.href}
													className={cn(
														"flex items-center justify-between rounded-xl border border-border/50 px-4 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-secondary/30 group",
														isActive(link.href)
															? "bg-primary/10 text-primary border-primary/20"
															: "text-muted-foreground"
													)}
													aria-current={isActive(link.href) ? "page" : undefined}
												>
													<div className="flex items-center gap-3">
														<div className={cn(
															"flex size-8 items-center justify-center rounded-lg border",
															isActive(link.href)
																? "bg-primary/10 border-primary/20 text-primary"
																: "bg-background border-border/70 text-muted-foreground group-hover:text-foreground"
														)}>
															<Icon className="size-4" />
														</div>
														<span className="group-hover:text-foreground transition-colors">{link.label[language]}</span>
													</div>
													<ChevronRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
												</Link>
											);
										})}
									</nav>
								</div>

								{/* Mobile Drawer Footer */}
								<div className="border-t border-border/40 pt-4 flex flex-col gap-3">
									<Button asChild className="w-full bg-primary text-primary-foreground font-semibold py-5">
										<Link href="/#contact">{language === "FR" ? "Démarrer un projet" : "Start a Project"}</Link>
									</Button>
									<p className="text-[10px] text-center text-muted-foreground/60">
										© {new Date().getFullYear()} MAC TECH. All rights reserved.
									</p>
								</div>
							</SheetContent>
						</Sheet>
					) : (
						<Button variant="outline" size="icon-sm" className="md:hidden" aria-label="Open navigation menu" type="button">
							<Menu className="size-4" />
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
