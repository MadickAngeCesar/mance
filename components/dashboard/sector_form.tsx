"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emitDashboardDataChanged } from "@/components/dashboard/data-events";
import { apiRequest } from "@/lib/client-api";
import type { TargetSector } from "@/lib/definitions";

type SectorFormProps = {
  mode?: "create" | "edit";
  initialSector?: TargetSector;
  trigger?: ReactNode;
};

export function SectorForm({ mode = "create", initialSector, trigger }: SectorFormProps) {
  const isEditMode = mode === "edit";
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialSector?.title ?? "");
  const [titleFr, setTitleFr] = useState(initialSector?.titleFr ?? "");
  const [iconSlug, setIconSlug] = useState(initialSector?.iconSlug ?? "Briefcase");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);
    setError(null);

    const title = String(formData.get("title") ?? "").trim();
    const titleFr = String(formData.get("titleFr") ?? "").trim() || null;
    const description = String(formData.get("description") ?? "").trim();
    const descriptionFr = String(formData.get("descriptionFr") ?? "").trim() || null;
    const displayOrder = parseInt(String(formData.get("displayOrder") ?? "0"), 10);

    if (!title || !description) {
      setError("Title and description are required.");
      setIsSubmitting(false);
      return;
    }

    const parseLines = (text: string) =>
      text
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean);

    const payload = {
      title,
      titleFr,
      description,
      descriptionFr,
      iconSlug,
      displayOrder,
      challenges: parseLines(String(formData.get("challenges") ?? "")),
      challengesFr: parseLines(String(formData.get("challengesFr") ?? "")),
      solutions: parseLines(String(formData.get("solutions") ?? "")),
      solutionsFr: parseLines(String(formData.get("solutionsFr") ?? "")),
      benefits: parseLines(String(formData.get("benefits") ?? "")),
      benefitsFr: parseLines(String(formData.get("benefitsFr") ?? "")),
    };

    try {
      if (isEditMode && initialSector) {
        await apiRequest(`/api/sectors/${initialSector.id}`, {
          method: "PATCH",
          auth: true,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/sectors", {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        });
      }

      emitDashboardDataChanged("sectors");
      setOpen(false);
      if (!isEditMode) {
        setTitle("");
        setTitleFr("");
        setIconSlug("Briefcase");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save target sector.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copy = useMemo(() => {
    if (language === "FR") {
      return {
        create: "Ajouter un secteur",
        title: isEditMode ? "Modifier le secteur" : "Ajouter un secteur cible",
        description: "Configurez les defis, solutions et benefices pour ce secteur d'activite.",
        labelTitle: "Titre (EN)",
        labelTitleFr: "Titre (FR)",
        labelDescription: "Description (EN)",
        labelDescriptionFr: "Description (FR)",
        labelIcon: "Icone",
        labelDisplayOrder: "Ordre d'affichage",
        labelChallenges: "Defis (EN - un par ligne)",
        labelChallengesFr: "Defis (FR - un par ligne)",
        labelSolutions: "Solutions (EN - un par ligne)",
        labelSolutionsFr: "Solutions (FR - un par ligne)",
        labelBenefits: "Benefices (EN - un par ligne)",
        labelBenefitsFr: "Benefices (FR - un par ligne)",
        save: isEditMode ? "Mettre a jour" : "Enregistrer",
      };
    }

    return {
      create: "Add Sector",
      title: isEditMode ? "Edit Sector" : "Add Target Sector",
      description: "Configure challenges, solutions, and benefits for this target industry.",
      labelTitle: "Title (EN)",
      labelTitleFr: "Title (FR)",
      labelDescription: "Description (EN)",
      labelDescriptionFr: "Description (FR)",
      labelIcon: "Icon",
      labelDisplayOrder: "Display Order",
      labelChallenges: "Challenges (EN - one per line)",
      labelChallengesFr: "Challenges (FR - one per line)",
      labelSolutions: "Solutions (EN - one per line)",
      labelSolutionsFr: "Solutions (FR - one per line)",
      labelBenefits: "Benefits (EN - one per line)",
      labelBenefitsFr: "Benefits (FR - one per line)",
      save: isEditMode ? "Update Sector" : "Save Sector",
    };
  }, [isEditMode, language]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">
            <Plus className="size-4" />
            {copy.create}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border/70 px-4 pt-4 pb-3">
            <DialogTitle className="text-base">{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="sector-title" className="text-xs font-medium text-muted-foreground">
                  {copy.labelTitle}
                </label>
                <Input
                  id="sector-title"
                  name="title"
                  placeholder="Healthcare & Hospitals"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="sector-title-fr" className="text-xs font-medium text-muted-foreground">
                  {copy.labelTitleFr}
                </label>
                <Input
                  id="sector-title-fr"
                  name="titleFr"
                  placeholder="Sante & Hopitaux"
                  value={titleFr}
                  onChange={(event) => setTitleFr(event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sector-icon" className="text-xs font-medium text-muted-foreground">
                  {copy.labelIcon}
                </label>
                <select
                  id="sector-icon"
                  value={iconSlug}
                  onChange={(event) => setIconSlug(event.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Hotel">Hotel (Real Estate / Hotels)</option>
                  <option value="Briefcase">Briefcase (Firms / Professional Services)</option>
                  <option value="Activity">Activity (Healthcare & Medical)</option>
                  <option value="Users">Users (NGOs & Associations)</option>
                  <option value="Store">Store (SMEs & Local Businesses)</option>
                  <option value="GraduationCap">GraduationCap (EduTech & Learning Hubs)</option>
                  <option value="Laptop">Laptop (IT & Tech Services)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sector-display-order" className="text-xs font-medium text-muted-foreground">
                  {copy.labelDisplayOrder}
                </label>
                <Input
                  id="sector-display-order"
                  name="displayOrder"
                  type="number"
                  defaultValue={initialSector?.displayOrder ?? 0}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="sector-description" className="text-xs font-medium text-muted-foreground">
                  {copy.labelDescription}
                </label>
                <Textarea
                  id="sector-description"
                  name="description"
                  placeholder="Describe the services and outcomes tailored to this sector..."
                  rows={2}
                  defaultValue={initialSector?.description}
                  required
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="sector-description-fr" className="text-xs font-medium text-muted-foreground">
                  {copy.labelDescriptionFr}
                </label>
                <Textarea
                  id="sector-description-fr"
                  name="descriptionFr"
                  placeholder="Decrivez les services et resultats adaptes a ce secteur..."
                  rows={2}
                  defaultValue={initialSector?.descriptionFr ?? ""}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sector-challenges" className="text-xs font-medium text-muted-foreground">
                  {copy.labelChallenges}
                </label>
                <Textarea
                  id="sector-challenges"
                  name="challenges"
                  placeholder="Outdated administrative tools&#10;Complex data regulations"
                  rows={4}
                  defaultValue={initialSector?.challenges?.join("\n") ?? ""}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sector-challenges-fr" className="text-xs font-medium text-muted-foreground">
                  {copy.labelChallengesFr}
                </label>
                <Textarea
                  id="sector-challenges-fr"
                  name="challengesFr"
                  placeholder="Outils administratifs obsoletes&#10;Reglementations complexes"
                  rows={4}
                  defaultValue={initialSector?.challengesFr?.join("\n") ?? ""}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sector-solutions" className="text-xs font-medium text-muted-foreground">
                  {copy.labelSolutions}
                </label>
                <Textarea
                  id="sector-solutions"
                  name="solutions"
                  placeholder="Custom patient check-in portals&#10;Secure HIPAA-compliant databases"
                  rows={4}
                  defaultValue={initialSector?.solutions?.join("\n") ?? ""}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sector-solutions-fr" className="text-xs font-medium text-muted-foreground">
                  {copy.labelSolutionsFr}
                </label>
                <Textarea
                  id="sector-solutions-fr"
                  name="solutionsFr"
                  placeholder="Portails personnalises d'admission&#10;Bases de donnees securisees et conformes"
                  rows={4}
                  defaultValue={initialSector?.solutionsFr?.join("\n") ?? ""}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sector-benefits" className="text-xs font-medium text-muted-foreground">
                  {copy.labelBenefits}
                </label>
                <Textarea
                  id="sector-benefits"
                  name="benefits"
                  placeholder="30% reduction in patient waiting times&#10;100% compliance with data privacy audits"
                  rows={4}
                  defaultValue={initialSector?.benefits?.join("\n") ?? ""}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sector-benefits-fr" className="text-xs font-medium text-muted-foreground">
                  {copy.labelBenefitsFr}
                </label>
                <Textarea
                  id="sector-benefits-fr"
                  name="benefitsFr"
                  placeholder="Reduction de 30% du temps d'attente&#10;Conformite totale lors des audits"
                  rows={4}
                  defaultValue={initialSector?.benefitsFr?.join("\n") ?? ""}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border/70 px-4 py-3">
            {error ? <p className="text-sm text-destructive mr-auto">{error}</p> : null}
            <Button type="submit" disabled={isSubmitting}>
              <Save className="size-4" />
              {isSubmitting ? "Saving..." : copy.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
