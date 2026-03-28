"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PencilLine, Search, Trash2 } from "lucide-react";

import { DASHBOARD_DATA_EVENT } from "@/components/dashboard/data-events";
import { WorkflowStageForm } from "@/components/dashboard/workflow_stage_form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/client-api";

type WorkflowStageItem = {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  details: string;
};

export function WorkflowStageList() {
  const [stages, setStages] = useState<WorkflowStageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadStages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const first = await apiRequest<WorkflowStageItem[]>("/api/workflow-stages?page=1&limit=50", {
        auth: true,
      });

      const firstData = first.data ?? [];
      const pages = Number((first.meta as { pages?: number } | undefined)?.pages ?? 1);

      if (!Number.isFinite(pages) || pages <= 1) {
        setStages(firstData);
      } else {
        const requests: Array<ReturnType<typeof apiRequest<WorkflowStageItem[]>>> = [];
        for (let page = 2; page <= pages; page += 1) {
          requests.push(apiRequest<WorkflowStageItem[]>(`/api/workflow-stages?page=${page}&limit=50`, { auth: true }));
        }

        const rest = await Promise.all(requests);
        setStages([...firstData, ...rest.flatMap((result) => result.data ?? [])]);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load workflow stages.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStages();
  }, [loadStages]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ domain?: string }>;
      if (custom.detail?.domain === "services") {
        void loadStages();
      }
    };

    window.addEventListener(DASHBOARD_DATA_EVENT, handler);
    return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
  }, [loadStages]);

  const handleDelete = async (id: string) => {
    const previous = stages;
    setStages((current) => current.filter((item) => item.id !== id));

    try {
      await apiRequest(`/api/workflow-stages/${id}`, {
        method: "DELETE",
        auth: true,
      });
    } catch (deleteError) {
      setStages(previous);
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete workflow stage.");
    }
  };

  const filtered = useMemo(() => {
    return [...stages]
      .filter((stage) => {
        const q = query.toLowerCase();
        return (
          stage.title.toLowerCase().includes(q) ||
          stage.subtitle.toLowerCase().includes(q) ||
          stage.details.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.step - b.step);
  }, [query, stages]);

  return (
    <Card>
      <CardHeader className="gap-3 border-b border-border/70 pb-4">
        <CardTitle className="text-base">Delivery Workflow</CardTitle>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search workflow stage"
            className="pl-8"
          />
        </div>
      </CardHeader>

      <CardContent className="grid gap-3 pt-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading workflow stages...</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {filtered.map((stage) => (
          <div key={stage.id} className="rounded-lg border border-border/70 bg-card/70 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{stage.title}</p>
                <p className="text-sm text-muted-foreground">{stage.subtitle}</p>
              </div>
              <Badge variant="outline">Step {stage.step}</Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{stage.details}</p>

            <div className="mt-3 flex gap-1">
              <WorkflowStageForm
                mode="edit"
                initialStage={stage}
                trigger={
                  <Button variant="ghost" size="icon-sm" aria-label="Edit workflow stage">
                    <PencilLine className="size-4" />
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete workflow stage"
                onClick={() => void handleDelete(stage.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {!isLoading && filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No workflow stages found.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
