import type { Metadata } from "next";

import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { MainWork } from "@/components/home/main_work";
import { Skills } from "@/components/home/skills";
import { TeamSection } from "@/components/home/team";

export const metadata: Metadata = {
  title: "Home | MAC TECH",
};

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Hero />
      <About />
      <MainWork />
      <Skills />
      <TeamSection />
      <Contact />
    </main>
  );
}
