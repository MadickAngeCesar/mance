"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Briefcase,
  Building2,
  Users,
  AlertCircle,
  Cpu,
  CheckCircle2,
  X,
} from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TargetSector } from "@/lib/definitions";

type SectorCardProps = {
  sector: TargetSector;
};

const iconMap = {
  Hotel: Building2,
  Briefcase: Briefcase,
  Activity: Activity,
  Users: Users,
};

const accentMap = {
  Hotel: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  Briefcase: "text-violet-400 border-violet-500/20 bg-violet-500/5",
  Activity: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  Users: "text-amber-400 border-amber-500/20 bg-amber-500/5",
};

export function SectorCard({ sector }: SectorCardProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const Icon = iconMap[sector.iconSlug as keyof typeof iconMap] || Briefcase;
  const accentClass = accentMap[sector.iconSlug as keyof typeof accentMap] || accentMap.Briefcase;

  const displayTitle = language === "FR" && sector.titleFr ? sector.titleFr : sector.title;
  const displayDesc = language === "FR" && sector.descriptionFr ? sector.descriptionFr : sector.description;

  const displayChallenges = language === "FR" && sector.challengesFr?.length ? sector.challengesFr : sector.challenges;
  const displaySolutions = language === "FR" && sector.solutionsFr?.length ? sector.solutionsFr : sector.solutions;
  const displayBenefits = language === "FR" && sector.benefitsFr?.length ? sector.benefitsFr : sector.benefits;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          id={sector.slug}
          className={`flex flex-col border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 cursor-pointer select-none ${accentClass}`}
        >
          <CardHeader className="pb-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-background/50 border border-current/10 mb-3">
              <Icon className="size-5" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {displayTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 gap-4">
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              {displayDesc}
            </p>
            <div className="border-t border-border/40 pt-3">
              <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                {displayBenefits.slice(0, 3).map((benefit, idx) => (
                  <li key={`${sector.id}-b-${idx}`} className="flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-primary" />
                    <span className="line-clamp-1">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-6 bg-card border-border/70 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b border-border/40 pb-4 flex flex-row items-center gap-3">
          <div className={`flex size-12 items-center justify-center rounded-xl bg-background/50 border border-current/25 ${accentClass}`}>
            <Icon className="size-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-foreground">
              {displayTitle}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
              {displayDesc}
            </p>
          </div>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3 pt-6 overflow-y-auto pr-1">
          {/* Column 1: Challenges */}
          <div className="space-y-4 rounded-xl border border-destructive/10 bg-destructive/5 p-4 flex flex-col">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {language === "FR" ? "Problèmes & Défis" : "Challenges"}
              </h3>
            </div>
            <ul className="space-y-3 flex-1 text-xs text-muted-foreground leading-relaxed">
              {displayChallenges.map((challenge, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-destructive font-semibold">0{idx + 1}.</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-4 rounded-xl border border-primary/10 bg-primary/5 p-4 flex flex-col">
            <div className="flex items-center gap-2 text-primary">
              <Cpu className="size-5" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {language === "FR" ? "Notre Solution" : "Our Solution"}
              </h3>
            </div>
            <ul className="space-y-3 flex-1 text-xs text-muted-foreground leading-relaxed">
              {displaySolutions.map((solution, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary font-semibold">0{idx + 1}.</span>
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Outcomes */}
          <div className="space-y-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4 flex flex-col">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="size-5" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {language === "FR" ? "Bénéfices & Impact" : "Business Impact"}
              </h3>
            </div>
            <ul className="space-y-3 flex-1 text-xs text-muted-foreground leading-relaxed">
              {displayBenefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-emerald-400 font-semibold">0{idx + 1}.</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
