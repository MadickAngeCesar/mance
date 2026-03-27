import Link from "next/link";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Tx } from "@/components/i18n/tx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalMobileMenu, PortalSidebar } from "@/components/dashboard/portal_nav";
import { brandProfile } from "@/lib/placeholder-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <PortalMobileMenu />
            <div className="leading-none">
              <p className="text-sm font-semibold tracking-wide">{brandProfile.currentName}</p>
              <p className="text-xs text-muted-foreground"><Tx en="Administration Portal" fr="Portail d'administration" /></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Badge variant="outline" className="hidden sm:inline-flex"><Tx en="Secure Session" fr="Session securisee" /></Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/"><Tx en="View Website" fr="Voir le site" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        <PortalSidebar />
        <main className="min-h-[calc(100vh-56px)] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
