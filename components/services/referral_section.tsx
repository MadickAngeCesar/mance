import { motion } from "framer-motion";
import { Gift, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Tx } from "@/components/i18n/tx";
import { Button } from "@/components/ui/button";

export function ReferralSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/60 px-6 py-12 text-center sm:px-10 sm:py-16 mt-16 mb-8">
      {/* Decorative glowing blobs */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.64 0.2 290 / 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.76 0.13 220 / 0.12) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Grid background overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%239C92AC' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl space-y-6">
        <div className="flex justify-center mb-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Gift className="size-8" />
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          <Tx en="Refer a Client, Earn Rewards" fr="Parrainez un Client, Gagnez des Récompenses" />
        </h2>

        <p className="text-base text-muted-foreground sm:text-lg leading-relaxed">
          <Tx
            en="Know a business that needs a digital upgrade? Refer a client and earn a commission when their project launches."
            fr="Connaissez-vous une entreprise qui a besoin d'une mise à niveau numérique ? Parrainez un client et gagnez une commission lorsque son projet est lancé."
          />
        </p>

        <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto pt-4 text-left">
           <div className="flex items-start gap-3 rounded-xl bg-background/50 p-4 border border-border/50">
             <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
             <div className="text-sm">
                <p className="font-semibold text-foreground"><Tx en="1. Refer" fr="1. Parrainer" /></p>
                <p className="text-muted-foreground"><Tx en="Connect me with a business." fr="Mettez-moi en contact avec une entreprise." /></p>
             </div>
           </div>
           <div className="flex items-start gap-3 rounded-xl bg-background/50 p-4 border border-border/50">
             <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
             <div className="text-sm">
                <p className="font-semibold text-foreground"><Tx en="2. Build" fr="2. Construire" /></p>
                <p className="text-muted-foreground"><Tx en="We successfully launch the project." fr="Nous lançons le projet avec succès." /></p>
             </div>
           </div>
           <div className="flex items-start gap-3 rounded-xl bg-background/50 p-4 border border-border/50">
             <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
             <div className="text-sm">
                <p className="font-semibold text-foreground"><Tx en="3. Earn" fr="3. Gagner" /></p>
                <p className="text-muted-foreground"><Tx en="Receive a % commission." fr="Recevez une commission en %." /></p>
             </div>
           </div>
        </div>

        <div className="pt-6">
          <Link href="/contact?subject=Referral">
            <Button size="lg" className="rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <Tx en="Become a Partner" fr="Devenir Partenaire" />
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
