"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Languages, Menu } from "lucide-react";

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

	return (
		<header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="inline-flex items-center gap-2">
					<Image src="/images/mac_tech_logo.png" alt="MAC TECH logo" width={28} height={28} className="rounded-md" />
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
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
							</SheetHeader>
							<nav className="grid gap-2 px-4 pb-4">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className="rounded-md border border-border/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
