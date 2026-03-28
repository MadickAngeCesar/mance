"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Plus, Save } from "lucide-react";

import { emitDashboardDataChanged } from "@/components/dashboard/data-events";
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
import { apiRequest } from "@/lib/client-api";

type WorkflowStageItem = {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  details: string;
};

type WorkflowStageFormProps = {
  mode?: "create" | "edit";
  initialStage?: WorkflowStageItem;
  trigger?: ReactNode;
};

export function WorkflowStageForm({ mode = "create", initialStage, trigger }: WorkflowStageFormProps) {
  const isEditMode = mode === "edit";
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const step = Number(formData.get("step") ?? 0);
    const title = String(formData.get("title") ?? "").trim();
    const subtitle = String(formData.get("subtitle") ?? "").trim();
    const details = String(formData.get("details") ?? "").trim();

    if (!step || !title || !subtitle || !details) {
      setError("Step, title, subtitle, and details are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode && initialStage) {
        await apiRequest(`/api/workflow-stages/${initialStage.id}`, {
          method: "PATCH",
          auth: true,
          body: JSON.stringify({ step, title, subtitle, details }),
        });
      } else {
        await apiRequest("/api/workflow-stages", {
          method: "POST",
          auth: true,
          body: JSON.stringify({ step, title, subtitle, details }),
        });
      }

      emitDashboardDataChanged("services");
      setOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save workflow stage.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copy =
    language === "FR"
      ? {
          create: "Ajouter une etape",
          title: isEditMode ? "Modifier l'etape" : "Ajouter une etape",
          description: "Configurez les etapes de delivery affichees sur la page services.",
          save: isEditMode ? "Mettre a jour" : "Enregistrer",
        }
      : {
          create: "Add Stage",
          title: isEditMode ? "Edit Stage" : "Add Stage",
          description: "Configure delivery workflow stages shown on the services page.",
          save: isEditMode ? "Update Stage" : "Save Stage",
        };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline">
            <Plus className="size-4" />
            {copy.create}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border/70 px-4 pt-4 pb-3">
            <DialogTitle className="text-base">{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-4 py-4">
            <div className="space-y-1.5">
              <label htmlFor="workflow-step" className="text-xs font-medium text-muted-foreground">
                Step
              </label>
              <Input
                id="workflow-step"
                name="step"
                type="number"
                min={1}
                defaultValue={initialStage?.step ?? 1}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="workflow-title" className="text-xs font-medium text-muted-foreground">
                Title
              </label>
              <Input id="workflow-title" name="title" defaultValue={initialStage?.title} required />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="workflow-subtitle" className="text-xs font-medium text-muted-foreground">
                Subtitle
              </label>
              <Input id="workflow-subtitle" name="subtitle" defaultValue={initialStage?.subtitle} required />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="workflow-details" className="text-xs font-medium text-muted-foreground">
                Details
              </label>
              <Textarea id="workflow-details" name="details" rows={4} defaultValue={initialStage?.details} required />
            </div>
          </div>

          <DialogFooter>
            {error ? <p className="w-full text-sm text-destructive">{error}</p> : null}
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
