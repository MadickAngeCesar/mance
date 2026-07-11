import type { Metadata } from "next";

import { LabList } from "@/components/lab/lab_list";
import { NewsLetter } from "@/components/lab/news_letter";
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
        <section className="space-y-4 text-center rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            <Tx en="Portfolio and Writing" fr="Portfolio et Rédaction" />
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            <Tx en="My Lab Work" fr="Mon Travail de Laboratoire" />
          </h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            <Tx
              en="Explore project case studies, technical articles, and personal reflections with practical notes on architecture, implementation, and lessons learned."
              fr="Explorez des études de cas de projets, des articles techniques et des réflexions personnelles avec des notes pratiques sur l'architecture, la mise en œuvre et les leçons apprises."
            />
          </p>
        </section>
      </GsapSection>

      <GsapSection animation="fade-up" delay={0.2}>
        <LabList />
      </GsapSection>

      <GsapSection animation="fade-up" delay={0.1}>
        <CtaSection />
      </GsapSection>

      <GsapSection animation="slide-left" delay={0.1}>
        <NewsLetter />
      </GsapSection>
    </main>
  );
}
