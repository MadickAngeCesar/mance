import type { Metadata } from "next";

import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { MainWork } from "@/components/home/main_work";
import { Skills } from "@/components/home/skills";
import { GsapSection } from "@/components/home/gsap-section";
import { TeamSection } from "@/components/home/team";

export const metadata: Metadata = {
  title: "Home | MAC TECH",
};

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 overflow-hidden">
      <GsapSection animation="fade-up" delay={0.1}>
        <Hero />
      </GsapSection>
      <GsapSection animation="fade-up" delay={0.2}>
        <About />
      </GsapSection>
      <GsapSection animation="slide-left" delay={0.1}>
        <MainWork />
      </GsapSection>
      <GsapSection animation="fade-up" delay={0.1}>
        <Skills />
      </GsapSection>
      <GsapSection animation="fade-up" delay={0.1}>
        <TeamSection />
      </GsapSection>
      <GsapSection animation="slide-right" delay={0.1}>
        <Contact />
      </GsapSection>
    </main>
  );
}
