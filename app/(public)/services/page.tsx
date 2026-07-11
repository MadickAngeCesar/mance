import type { Metadata } from "next";

import { BookingCta } from "@/components/services/booking_cta";
import { ClientWork } from "@/components/services/client_work";
import { OfferingsCards } from "@/components/services/offerings_cards";
import { Testimonials } from "@/components/services/testimonials";
import { Workflow } from "@/components/services/workflow";
import { ServingSector } from "@/components/services/serving_sector";
import { GsapSection } from "@/components/home/gsap-section";
import { Tx } from "@/components/i18n/tx";

export const metadata: Metadata = {
  title: "Services | MAC TECH",
};

export const dynamic = "force-dynamic";

export default function ServicesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 overflow-hidden">
      {/* 1. Hero Section */}
      <GsapSection animation="fade-up" delay={0.1}>
        <section className="space-y-4 text-center justify-center rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            <Tx en="Professional Services" fr="Services professionnels" />
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            <Tx en="Services" fr="Services" />
          </h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            <Tx
              en="I provide web development, IT support and consulting, digital transformation, and technical writing, with a clear workflow from consultation to launch and support."
              fr="Je fournis du développement web, du support et du conseil en informatique, de la transformation numérique et de la rédaction technique, avec un flux de travail clair, de la consultation au lancement et au support."
            />
          </p>
        </section>
      </GsapSection>

      {/* 2. Offerings Section */}
      <GsapSection animation="fade-up" delay={0.2}>
        <OfferingsCards />
      </GsapSection>

      {/* 3. Workflow Section */}
      <GsapSection animation="slide-left" delay={0.1}>
        <Workflow />
      </GsapSection>

      {/* 4. Serving Sector Section */}
      <GsapSection animation="fade-up" delay={0.1}>
        <ServingSector />
      </GsapSection>

      {/* 5. Client Projects (ClientWork) Section */}
      <GsapSection animation="slide-right" delay={0.1}>
        <ClientWork />
      </GsapSection>

      {/* 6. Client Testimonials Section */}
      <GsapSection animation="fade-up" delay={0.1}>
        <Testimonials />
      </GsapSection>

      {/* 7. Call to Action (BookingCta) Section */}
      <GsapSection animation="fade-up" delay={0.1}>
        <BookingCta />
      </GsapSection>
    </main>
  );
}
