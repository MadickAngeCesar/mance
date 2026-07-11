import type { Metadata } from "next";

import { LabList } from "@/components/lab/lab_list";
import { NewsLetter } from "@/components/lab/news_letter";
import { GsapSection } from "@/components/home/gsap-section";
import { Tx } from "@/components/i18n/tx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Lightbulb, Users } from "lucide-react";

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
        <section className="py-8">
            <div className="grid gap-6 sm:grid-cols-3">
                <Card className="flex flex-col border-border/70 bg-card/40 text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                            <Users className="size-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl"><Tx en="Participate" fr="Participer" /></CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-6">
                        <p className="text-sm text-muted-foreground flex-1">
                            <Tx en="Apply to participate in an ongoing open-source or lab project." fr="Postulez pour participer à un projet open-source ou de laboratoire en cours." />
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/#contact"><Tx en="Apply Now" fr="Postuler" /> <ArrowRight className="ml-2 size-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="flex flex-col border-border/70 bg-card/40 text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                            <HeartHandshake className="size-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl"><Tx en="Support" fr="Soutenir" /></CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-6">
                        <p className="text-sm text-muted-foreground flex-1">
                            <Tx en="Donate to support the development and hosting of these projects." fr="Faites un don pour soutenir le développement et l'hébergement de ces projets." />
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="https://buymeacoffee.com/mance" target="_blank"><Tx en="Donate" fr="Faire un don" /> <ArrowRight className="ml-2 size-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="flex flex-col border-border/70 bg-card/40 text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                            <Lightbulb className="size-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl"><Tx en="Propose" fr="Proposer" /></CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-6">
                        <p className="text-sm text-muted-foreground flex-1">
                            <Tx en="Have a great idea? Propose a project to work on together." fr="Vous avez une excellente idée ? Proposez un projet sur lequel travailler ensemble." />
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/#contact"><Tx en="Propose Idea" fr="Proposer une idée" /> <ArrowRight className="ml-2 size-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
      </GsapSection>

      <GsapSection animation="slide-left" delay={0.1}>
        <NewsLetter />
      </GsapSection>
    </main>
  );
}
