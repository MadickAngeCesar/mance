"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Heart,
  Eye,
  Download,
  ShoppingCart,
  ChevronDown,
  FileText,
  Zap,
  BookOpen,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Tx } from "@/components/i18n/tx";
import type { AcademyResourceExtended } from "@/lib/definitions";

// ─── Constants ──────────────────────────────────────────────────────────────
const PAGE_SIZE = 9;

type TypeFilter = "ALL" | "ARTICLE" | "GUIDE" | "BOOK";
type DifficultyFilter = "ALL" | "Beginner" | "Intermediate" | "Advanced";
type AccessFilter = "ALL" | "FREE" | "PAID";
type SortKey = "newest" | "liked" | "viewed" | "az";

const TYPE_TABS: { key: TypeFilter; labelEn: string; labelFr: string; icon: React.ElementType }[] = [
  { key: "ALL", labelEn: "All", labelFr: "Tout", icon: SlidersHorizontal },
  { key: "ARTICLE", labelEn: "Articles", labelFr: "Articles", icon: FileText },
  { key: "GUIDE", labelEn: "Cheat Sheets", labelFr: "Aide-mémoires", icon: Zap },
  { key: "BOOK", labelEn: "Books", labelFr: "Livres", icon: BookOpen },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const TYPE_COLORS: Record<string, string> = {
  ARTICLE: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  GUIDE: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  BOOK: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  COURSE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const TYPE_LABELS: Record<string, { en: string; fr: string }> = {
  ARTICLE: { en: "Article", fr: "Article" },
  GUIDE: { en: "Cheat Sheet", fr: "Aide-mémoire" },
  BOOK: { en: "Book", fr: "Livre" },
  COURSE: { en: "Course", fr: "Cours" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ResourceCard({
  resource,
  liked,
  likeCount,
  onLike,
}: {
  resource: AcademyResourceExtended;
  liked: boolean;
  likeCount: number;
  onLike: (id: string) => void;
}) {
  const date = resource.publishedAt
    ? new Date(resource.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_oklch(0.64_0.2_290/0.3)]">
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        <Image
          src={resource.coverImageUrl || "/images/mac_tech_logo.png"}
          alt={resource.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Free / Paid overlay pill */}
        <div className="absolute left-3 top-3">
          {resource.isFree ? (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-1 text-xs font-bold text-emerald-400 backdrop-blur-sm">
              <Tx en="Free" fr="Gratuit" />
            </span>
          ) : (
            <span className="rounded-full border border-primary/30 bg-background/80 px-2.5 py-1 text-xs font-bold text-primary backdrop-blur-sm">
              ${resource.price}
            </span>
          )}
        </div>
        {/* Difficulty pill */}
        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${DIFFICULTY_COLORS[resource.difficulty] ?? ""}`}
          >
            <Tx
              en={resource.difficulty}
              fr={
                resource.difficulty === "Beginner"
                  ? "Débutant"
                  : resource.difficulty === "Intermediate"
                  ? "Intermédiaire"
                  : "Avancé"
              }
            />
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Type + Date row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[resource.type] ?? ""}`}
          >
            {resource.type === "ARTICLE" && <FileText className="h-3 w-3" />}
            {resource.type === "GUIDE" && <Zap className="h-3 w-3" />}
            {resource.type === "BOOK" && <BookOpen className="h-3 w-3" />}
            <Tx
              en={TYPE_LABELS[resource.type]?.en ?? resource.type}
              fr={TYPE_LABELS[resource.type]?.fr ?? resource.type}
            />
          </span>
          {date && (
            <span className="text-xs text-muted-foreground">{date}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
          <Tx en={resource.title} fr={resource.titleFr ?? resource.title} />
        </h3>

        {/* Description */}
        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          <Tx
            en={resource.description}
            fr={resource.descriptionFr ?? resource.description}
          />
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary/60 px-2 py-0.5 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer: stats + CTA */}
        <div className="mt-1 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button
              id={`like-${resource.id}`}
              aria-label="Like"
              onClick={() => onLike(resource.id)}
              className={`group/like flex items-center gap-1 transition-colors ${liked ? "text-rose-400" : "hover:text-rose-400"}`}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-all ${liked ? "fill-rose-400 scale-110" : "group-hover/like:scale-110"}`}
              />
              <span className="tabular-nums">{likeCount}</span>
            </button>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {resource.views.toLocaleString()}
            </span>
          </div>

          {/* CTA */}
          {resource.type === "ARTICLE" ? (
            <a href={resource.downloadUrl || `/lab/${resource.slug}`}>
              <Button
                id={`read-${resource.id}`}
                size="sm"
                className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <Tx en="Read" fr="Lire" />
              </Button>
            </a>
          ) : resource.isFree ? (
            <a href={resource.downloadUrl ?? "#"} download>
              <Button
                id={`download-${resource.id}`}
                size="sm"
                className="h-8 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <Download className="h-3.5 w-3.5" />
                <Tx en="Download" fr="Télécharger" />
              </Button>
            </a>
          ) : (
            <a href={resource.buyUrl ?? "#"} target="_blank" rel="noopener noreferrer">
              <Button
                id={`buy-${resource.id}`}
                size="sm"
                className="h-8 gap-1.5"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <Tx en={`Buy $${resource.price}`} fr={`Acheter ${resource.price}$`} />
              </Button>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Main Client Component ───────────────────────────────────────────────────

interface AcademyClientProps {
  resources: AcademyResourceExtended[];
}

export function AcademyClient({ resources }: AcademyClientProps) {
  // ── Filter / Sort state ──
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("ALL");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  // ── Like state (local) ──
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likeDelta, setLikeDelta] = useState<Record<string, number>>({});

  const handleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setLikeDelta((d) => ({ ...d, [id]: (d[id] ?? 0) - 1 }));
      } else {
        next.add(id);
        setLikeDelta((d) => ({ ...d, [id]: (d[id] ?? 0) + 1 }));
      }
      return next;
    });
  }, []);

  // ── Filtered + sorted list ──
  const filtered = useMemo(() => {
    let result = [...resources];

    if (typeFilter !== "ALL") {
      result = result.filter((r) => r.type === typeFilter);
    }
    if (difficultyFilter !== "ALL") {
      result = result.filter((r) => r.difficulty === difficultyFilter);
    }
    if (accessFilter === "FREE") result = result.filter((r) => r.isFree);
    if (accessFilter === "PAID") result = result.filter((r) => !r.isFree);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q))
      );
    }

    switch (sortKey) {
      case "newest":
        result.sort((a, b) =>
          (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
        );
        break;
      case "liked":
        result.sort(
          (a, b) =>
            b.likes + (likeDelta[b.id] ?? 0) - (a.likes + (likeDelta[a.id] ?? 0))
        );
        break;
      case "viewed":
        result.sort((a, b) => b.views - a.views);
        break;
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [resources, typeFilter, difficultyFilter, accessFilter, search, sortKey, likeDelta]);

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const sortLabels: Record<SortKey, { en: string; fr: string }> = {
    newest: { en: "Newest", fr: "Plus récent" },
    liked: { en: "Most Liked", fr: "Plus aimé" },
    viewed: { en: "Most Viewed", fr: "Plus vu" },
    az: { en: "A → Z", fr: "A → Z" },
  };

  const goPage = (n: number) => {
    setPage(Math.max(1, Math.min(n, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Control bar ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Type tabs */}
        <div
          role="tablist"
          aria-label="Content type filter"
          className="flex flex-wrap gap-2"
        >
          {TYPE_TABS.map(({ key, labelEn, labelFr, icon: Icon }) => (
            <button
              key={key}
              id={`tab-${key.toLowerCase()}`}
              role="tab"
              aria-selected={typeFilter === key}
              onClick={() => { setTypeFilter(key); setPage(1); }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                typeFilter === key
                  ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_-4px_oklch(0.64_0.2_290/0.4)]"
                  : "border-border/50 bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <Tx en={labelEn} fr={labelFr} />
            </button>
          ))}
        </div>

        {/* Search + secondary filters row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="academy-search"
              type="search"
              placeholder="Search resources…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl border border-border/50 bg-card/60 py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/60 px-1 py-1">
            {(["ALL", "Beginner", "Intermediate", "Advanced"] as DifficultyFilter[]).map(
              (d) => (
                <button
                  key={d}
                  id={`difficulty-${d.toLowerCase()}`}
                  onClick={() => { setDifficultyFilter(d); setPage(1); }}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                    difficultyFilter === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Tx
                    en={d === "ALL" ? "All Levels" : d}
                    fr={
                      d === "ALL"
                        ? "Tous niveaux"
                        : d === "Beginner"
                        ? "Débutant"
                        : d === "Intermediate"
                        ? "Intermédiaire"
                        : "Avancé"
                    }
                  />
                </button>
              )
            )}
          </div>

          {/* Free / Paid toggle */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/60 px-1 py-1">
            {(["ALL", "FREE", "PAID"] as AccessFilter[]).map((a) => (
              <button
                key={a}
                id={`access-${a.toLowerCase()}`}
                onClick={() => { setAccessFilter(a); setPage(1); }}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  accessFilter === a
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tx
                  en={a === "ALL" ? "All" : a === "FREE" ? "Free" : "Paid"}
                  fr={a === "ALL" ? "Tout" : a === "FREE" ? "Gratuit" : "Payant"}
                />
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              id="sort-dropdown-trigger"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Tx en="Sort:" fr="Trier :" />
              <span className="font-medium text-foreground">
                <Tx en={sortLabels[sortKey].en} fr={sortLabels[sortKey].fr} />
              </span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-20 mt-1.5 min-w-44 overflow-hidden rounded-xl border border-border/60 bg-popover shadow-lg">
                {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                  <button
                    key={k}
                    id={`sort-${k}`}
                    onClick={() => { setSortKey(k); setSortOpen(false); setPage(1); }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent/60 ${
                      sortKey === k ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    <Tx en={sortLabels[k].en} fr={sortLabels[k].fr} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-muted-foreground">
          <Tx
            en={`Showing ${paginated.length} of ${filtered.length} resources`}
            fr={`Affichage de ${paginated.length} sur ${filtered.length} ressources`}
          />
        </p>
      </div>

      {/* ── Cards grid ───────────────────────────────────────────── */}
      {paginated.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/50 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            <Tx en="No resources match your filters." fr="Aucune ressource ne correspond à vos filtres." />
          </p>
          <button
            onClick={() => { setTypeFilter("ALL"); setDifficultyFilter("ALL"); setAccessFilter("ALL"); setSearch(""); setPage(1); }}
            className="text-sm text-primary underline-offset-2 hover:underline"
          >
            <Tx en="Clear filters" fr="Effacer les filtres" />
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              liked={likedIds.has(resource.id)}
              likeCount={resource.likes + (likeDelta[resource.id] ?? 0)}
              onLike={handleLike}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); if (safePage > 1) goPage(safePage - 1); }}
                className={safePage === 1 ? "pointer-events-none opacity-40" : ""}
                text="Prev"
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const show =
                n === 1 ||
                n === totalPages ||
                Math.abs(n - safePage) <= 1;

              const showEllipsisBefore =
                n === safePage - 2 && safePage - 2 > 1;
              const showEllipsisAfter =
                n === safePage + 2 && safePage + 2 < totalPages;

              if (!show && !showEllipsisBefore && !showEllipsisAfter) return null;

              if (showEllipsisBefore || showEllipsisAfter) {
                return (
                  <PaginationItem key={`ellipsis-${n}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    isActive={n === safePage}
                    onClick={(e) => { e.preventDefault(); goPage(n); }}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); if (safePage < totalPages) goPage(safePage + 1); }}
                className={safePage === totalPages ? "pointer-events-none opacity-40" : ""}
                text="Next"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
