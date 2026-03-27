import type { Metadata } from "next";

import { BookingCta } from "@/components/services/booking_cta";
import { ClientWork } from "@/components/services/client_work";
import { OfferingsCards } from "@/components/services/offerings_cards";
import { Testimonials } from "@/components/services/testimonials";
import { Workflow } from "@/components/services/workflow";

export const metadata: Metadata = {
  title: "Services | MAC TECH",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Services</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          I help organizations ship dependable web products, improve technical operations, and make better delivery
          decisions with clear execution plans.
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
