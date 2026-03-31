import type { Metadata } from "next";

import { Tx } from "@/components/i18n/tx";
import { BookingCta } from "@/components/services/booking_cta";
import { ClientWork } from "@/components/services/client_work";
import { OfferingsCards } from "@/components/services/offerings_cards";
import { Testimonials } from "@/components/services/testimonials";
import { Workflow } from "@/components/services/workflow";

export const metadata: Metadata = {
  title: "Services | MAC TECH",
};

export const dynamic = "force-dynamic";

export default function ServicesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="space-y-4 text-center justify-center rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-primary"><Tx en="Professional Services" fr="Services professionnels" /></p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl"><Tx en="Services" fr="Services" /></h1>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          <Tx
            en="I provide web development, IT support and consulting, digital transformation, and technical writing, with a clear workflow from consultation to launch and support."
            fr="Je propose le developpement web, le support et conseil IT, la transformation digitale et la redaction technique, avec un workflow clair de la consultation au lancement puis au support."
          />
        </p>
      </section>

      <OfferingsCards />
      <Workflow />
      <ClientWork />
      <Testimonials />
      <BookingCta />
    </main>
  );
}
