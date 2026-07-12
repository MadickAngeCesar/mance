"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, PencilLine, Search, Trash2 } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DASHBOARD_DATA_EVENT } from "@/components/dashboard/data-events";
import { SectorForm } from "@/components/dashboard/sector_form";
import { apiRequest } from "@/lib/client-api";
import type { TargetSector } from "@/lib/definitions";

export function SectorList() {
  const { language } = useLanguage();
  const [sectors, setSectors] = useState<TargetSector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadSectors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<TargetSector[]>("/api/sectors?limit=100", {
        auth: true,
      });
      setSectors(response.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load target sectors.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSectors();
  }, [loadSectors]);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ domain?: string }>;
      if (custom.detail?.domain === "sectors") {
        void loadSectors();
      }
    };

    window.addEventListener(DASHBOARD_DATA_EVENT, handler);
    return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
  }, [loadSectors]);

  const handleDelete = async (id: string) => {
    const previous = sectors;
    setSectors((current) => current.filter((sector) => sector.id !== id));
    try {
      await apiRequest(`/api/sectors/${id}`, {
        method: "DELETE",
        auth: true,
      });
    } catch (deleteError) {
      setSectors(previous);
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete target sector.");
    }
  };

  const filtered = useMemo(() => {
    return sectors.filter((sector) => {
      const searchTitle = sector.title.toLowerCase();
      const searchTitleFr = (sector.titleFr ?? "").toLowerCase();
      const searchDesc = sector.description.toLowerCase();
      const searchDescFr = (sector.descriptionFr ?? "").toLowerCase();
      const searchTerm = query.toLowerCase();

      return (
        searchTitle.includes(searchTerm) ||
        searchTitleFr.includes(searchTerm) ||
        searchDesc.includes(searchTerm) ||
        searchDescFr.includes(searchTerm)
      );
    });
  }, [sectors, query]);

  return (
    <Card>
      <CardHeader className="gap-3 border-b border-border/70 pb-4">
        <CardTitle className="text-base">
          {language === "FR" ? "Secteurs cibles" : "Target Sectors"}
        </CardTitle>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={language === "FR" ? "Rechercher par titre de secteur" : "Search by sector title"}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading target sectors...</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {filtered.map((sector) => {
          const displayTitle = language === "FR" && sector.titleFr ? sector.titleFr : sector.title;
          const displayDesc = language === "FR" && sector.descriptionFr ? sector.descriptionFr : sector.description;

          return (
            <div key={sector.id} className="rounded-lg border border-border/70 bg-card/70 p-3 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="font-medium">{displayTitle}</p>
                    <p className="text-xs text-muted-foreground line-clamp-3">{displayDesc}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {sector.iconSlug}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                  <div>
                    <span className="font-medium text-foreground block">
                      {sector.challenges.length}
                    </span>
                    {language === "FR" ? "Défis" : "Challenges"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground block">
                      {sector.solutions.length}
                    </span>
                    Solutions
                  </div>
                  <div>
                    <span className="font-medium text-foreground block">
                      {sector.benefits.length}
                    </span>
                    {language === "FR" ? "Bénéfices" : "Benefits"}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-1 justify-start border-t border-border/40 pt-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="View public sector section"
                  onClick={() => window.open(`/services#${sector.slug}`, "_blank", "noopener,noreferrer")}
                >
                  <Eye className="size-4" />
                </Button>
                <SectorForm
                  mode="edit"
                  initialSector={sector}
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label="Edit sector">
                      <PencilLine className="size-4" />
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Delete sector">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete sector?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {displayTitle} and its associated flyer data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction variant="destructive" onClick={() => void handleDelete(sector.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
        {!isLoading && filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-full">No target sectors found.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
