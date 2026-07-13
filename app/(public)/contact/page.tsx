import type { Metadata } from "next";

import { Contact } from "@/components/home/contact";
import { GsapSection } from "@/components/home/gsap-section";

export const metadata: Metadata = {
  title: "Contact | MAC TECH",
};

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 overflow-hidden">
      <GsapSection animation="fade-up" delay={0.1}>
        <Contact />
      </GsapSection>
    </main>
  );
}
