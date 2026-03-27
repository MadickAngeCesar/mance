import type { Metadata } from "next";

import { LabList } from "@/components/lab/lab_list";

export const metadata: Metadata = {
  title: "Lab | MAC TECH",
};

export default function LabPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="space-y-4 text-center rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">Portfolio and Writing</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">My Lab Work</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          Explore project case studies, technical articles, and personal reflections with practical notes on
          architecture, implementation, and lessons learned.
        </p>
      </section>
      <LabList />
    </main>
  );
}
