import type { Metadata } from "next";

import { LabList } from "@/components/lab/lab_list";

export const metadata: Metadata = {
  title: "Lab | MAC TECH",
};

export default function LabPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Portfolio Lab</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          Explore practical builds, architecture notes, and engineering articles from MAC TECH.
        </p>
      </section>
      <LabList />
    </main>
  );
}
