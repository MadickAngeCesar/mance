"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Languages, Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Services", href: "/services" },
	{ label: "Lab", href: "/lab" },
	{ label: "Contact", href: "/#contact" },
];

export function Navbar() {
	const [language, setLanguage] = useState<"EN" | "FR">("EN");
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
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="gap-1.5">
								<Languages className="size-3.5" />
								{language}
								<ChevronDown className="size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem onSelect={() => setLanguage("EN")}>English</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setLanguage("FR")}>Francais</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button asChild size="sm" className="hidden md:inline-flex">
						<Link href="/#contact">Start a Project</Link>
					</Button>

					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon-sm" className="md:hidden" aria-label="Open navigation menu">
								<Menu className="size-4" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-72">
							<SheetHeader>
								<SheetTitle>Navigation</SheetTitle>
								<SheetDescription>Quick links to the core sections of the portfolio.</SheetDescription>
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
										{link.label}
									</Link>
								))}
								<Button asChild className="mt-2">
									<Link href="/#contact">Start a Project</Link>
								</Button>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
