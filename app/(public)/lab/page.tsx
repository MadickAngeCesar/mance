import type { Metadata } from "next";

import { LabList } from "@/components/lab/lab_list";
// import { NewsLetter } from "@/components/lab/news_letter";
import { GsapSection } from "@/components/home/gsap-section";
import { Tx } from "@/components/i18n/tx";
import { CtaSection } from "@/components/lab/cta_section";

export const metadata: Metadata = {
  title: "Lab | MAC TECH",
};

export const dynamic = "force-dynamic";

export default function LabPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 overflow-hidden">
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
              <Tx en="Research & Engineering" fr="Recherche & Ingénierie" />
            </span>

            {/* Heading */}
            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              <Tx
                en={
                  <>
                    Explore my{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(135deg, oklch(0.64 0.2 290), oklch(0.76 0.13 220))",
                      }}
                    >
                      Lab Work
                    </span>
                  </>
                }
                fr={
                  <>
                    Mon travail de{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(135deg, oklch(0.64 0.2 290), oklch(0.76 0.13 220))",
                      }}
                    >
                      Laboratoire
                    </span>
                  </>
                }
              />
            </h1>

            {/* Sub-tagline */}
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              <Tx
                en="Explore project case studies, technical articles, and personal reflections with practical notes on architecture, implementation, and lessons learned."
                fr="Explorez des études de cas de projets, des articles techniques et des réflexions personnelles avec des notes pratiques sur l'architecture, la mise en œuvre et les leçons apprises."
              />
            </p>
          </div>
        </section>
      </GsapSection>

      <GsapSection animation="fade-up" delay={0.2}>
        <LabList />
      </GsapSection>

      <GsapSection animation="fade-up" delay={0.1}>
        <CtaSection />
      </GsapSection>

      {/*<GsapSection animation="slide-left" delay={0.1}>
        <NewsLetter />
      </GsapSection>*/}
    </main>
  );
}
