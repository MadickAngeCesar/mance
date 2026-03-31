import type { Metadata } from "next";

import { Tx } from "@/components/i18n/tx";
import { LabList } from "@/components/lab/lab_list";
import { NewsLetter } from "@/components/lab/news_letter";

export const metadata: Metadata = {
  title: "Lab | MAC TECH",
};

export const dynamic = "force-dynamic";

export default function LabPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="space-y-4 text-center rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-primary"><Tx en="Portfolio and Writing" fr="Portfolio et redaction" /></p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl"><Tx en="My Lab Work" fr="Mes travaux du Lab" /></h1>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">
          <Tx
            en="Explore project case studies, technical articles, and personal reflections with practical notes on architecture, implementation, and lessons learned."
            fr="Explorez des etudes de cas, des articles techniques et des retours d'experience avec des notes pratiques sur l'architecture, l'implementation et les enseignements tires."
          />
        </p>
      </section>
      <LabList />
      <NewsLetter />
    </main>
  );
}
