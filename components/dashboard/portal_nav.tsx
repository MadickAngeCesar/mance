"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	BookOpenText,
	FolderKanban,
	GraduationCap,
	LayoutDashboard,
	Mail,
	Menu,
	Settings,
	Sparkles,
	Users,
} from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
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

const dashboardNavItems = [
	{ href: "/dashboard", label: { EN: "Overview", FR: "Apercu" }, icon: LayoutDashboard },
	{ href: "/dashboard/blogs", label: { EN: "Blogs", FR: "Articles" }, icon: BookOpenText },
	{ href: "/dashboard/messages", label: { EN: "Messages", FR: "Messages" }, icon: Mail },
	{ href: "/dashboard/projects", label: { EN: "Projects", FR: "Projets" }, icon: FolderKanban },
	{ href: "/dashboard/services", label: { EN: "Services", FR: "Services" }, icon: Sparkles },
	{ href: "/dashboard/academy", label: { EN: "Academy", FR: "Académie" }, icon: GraduationCap },
	{ href: "/dashboard/subscribers", label: { EN: "Subscribers", FR: "Abonnes" }, icon: Users },
	{ href: "/dashboard/settings", label: { EN: "Settings", FR: "Parametres" }, icon: Settings },
];

function DashboardNavList({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
	const { language } = useLanguage();
	const pathname = usePathname();

	return (
		<nav className={cn("grid gap-1", className)}>
			{dashboardNavItems.map((item) => {
				const Icon = item.icon;
				const isActive =
					pathname === item.href ||
					(item.href === "/dashboard" && pathname === "/dashboard/");

				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={onNavigate}
						className={cn(
							"inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
							isActive
								? "border-primary/35 bg-primary/12 text-foreground"
								: "border-border/70 text-muted-foreground hover:text-foreground"
						)}
						aria-current={isActive ? "page" : undefined}
					>
						<Icon className="size-4" />
						<span>{item.label[language]}</span>
					</Link>
				);
			})}
		</nav>
	);
}

export function PortalSidebar() {
	return (
		<aside className="hidden w-64 shrink-0 border-r border-border/70 p-4 lg:block">
			<DashboardNavList />
		</aside>
	);
}

export function PortalMobileMenu() {
	const { language } = useLanguage();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon-sm" className="lg:hidden" aria-label="Open dashboard menu">
					<Menu className="size-4" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-72">
				<SheetHeader>
					<SheetTitle>{language === "FR" ? "Menu du tableau de bord" : "Dashboard Menu"}</SheetTitle>
					<SheetDescription>{language === "FR" ? "Naviguez dans les sections d'administration." : "Navigate administration sections."}</SheetDescription>
				</SheetHeader>
				<DashboardNavList className="px-4 pb-4" />
			</SheetContent>
		</Sheet>
	);
}
