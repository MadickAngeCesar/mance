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
        <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/60 px-6 py-10 text-center sm:px-10 sm:py-12">
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
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.52 0.05 285 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(0.52 0.05 285 / 0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            {/* Pulsing Active Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <Tx en="Standard of Excellence" fr="Norme d'Excellence" />
            </span>

            {/* Heading */}
            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              <Tx
                en={
                  <>
                    Engineering custom{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(135deg, oklch(0.64 0.2 290), oklch(0.76 0.13 220))",
                      }}
                    >
                      Services
                    </span>
                  </>
                }
                fr={
                  <>
                    Ingénierie de{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(135deg, oklch(0.64 0.2 290), oklch(0.76 0.13 220))",
                      }}
                    >
                      Services
                    </span>{" "}
                    sur mesure
                  </>
                }
              />
            </h1>

            {/* Sub-tagline */}
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              <Tx
                en="I provide web development, IT support and consulting, digital transformation, and technical writing, with a clear workflow from consultation to launch and support."
                fr="Je fournis du développement web, du support et du conseil en informatique, de la transformation numérique et de la rédaction technique, avec un flux de travail clair, de la consultation au lancement et au support."
              />
            </p>
          </div>
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
