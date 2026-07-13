"use client";

import { useEffect, useMemo, useState } from "react";

import { LabCard } from "@/components/lab/lab_card";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import { Tx } from "@/components/i18n/tx";
import { useLanguage } from "@/components/i18n/language-provider";
import { calculateVectorMatchScore } from "@/lib/vector-search";

type LabFilter = "all" | "projects" | "case-studies";
type LabSort = "recent" | "views" | "alpha" | "likes";

type CombinedLabItem = {
	id: string;
	title: string;
	titleFr?: string;
	summary: string;
	summaryFr?: string;
	href: string;
	coverImageUrl: string;
	tags: string[];
	kind: "project";
	featured: boolean;
	views: number;
	likes: number;
	problem?: string | null;
	problemFr?: string | null;
	solution?: string | null;
	solutionFr?: string | null;
	matchScore?: number;
	meta: string;
	publishedAt?: string;
	isCaseStudy: boolean;
};

type ProjectItem = {
	id: string;
	title: string;
	titleFr?: string;
	summary: string;
	summaryFr?: string;
	slug: string;
	coverImageUrl: string;
	tags: string[];
	featured: boolean;
	views: number;
	likes: number;
	problem?: string | null;
	problemFr?: string | null;
	solution?: string | null;
	solutionFr?: string | null;
	publishedAt?: string;
};

type PaginatedMeta = {
	pages?: number;
};

async function fetchAllPages<T>(basePath: string) {
	const first = await apiRequest<T[]>(`${basePath}${basePath.includes("?") ? "&" : "?"}page=1&limit=50`);
	const firstData = first.data ?? [];
	const firstPages = Number((first.meta as PaginatedMeta | undefined)?.pages ?? 1);

	if (!Number.isFinite(firstPages) || firstPages <= 1) {
		return firstData;
	}

	const pageRequests: Array<ReturnType<typeof apiRequest<T[]>>> = [];
	for (let page = 2; page <= firstPages; page += 1) {
		pageRequests.push(apiRequest<T[]>(`${basePath}${basePath.includes("?") ? "&" : "?"}page=${page}&limit=50`));
	}

	const pageResults = await Promise.all(pageRequests);
	const pageData = pageResults.flatMap((result) => result.data ?? []);

	return [...firstData, ...pageData];
}

const filterOptions: Array<{ value: LabFilter; labelEn: string; labelFr: string }> = [
	{ value: "all", labelEn: "All Projects", labelFr: "Tous les projets" },
	{ value: "projects", labelEn: "Projects", labelFr: "Projets" },
	{ value: "case-studies", labelEn: "Case Studies", labelFr: "Études de cas" },
];

export function LabList() {
	const { language } = useLanguage();
	const [projects, setProjects] = useState<ProjectItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState<LabFilter>("all");
	const [sortBy, setSortBy] = useState<LabSort>("recent");
	const [page, setPage] = useState(1);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function loadData() {
			setIsLoading(true);
			setLoadError(null);
			try {
				const projectsResult = await fetchAllPages<ProjectItem>("/api/projects?published=all&sort=newest&featured=all");

				if (!isMounted) return;

				const loadedProjects = projectsResult
					.filter((item) => Boolean(item.slug))
					.map((item) => ({
						...item,
						coverImageUrl: item.coverImageUrl || "/images/Profile.jpg",
					}));

				setProjects(loadedProjects);
			} catch (error) {
				if (!isMounted) return;
				setLoadError(error instanceof Error ? error.message : "Unable to load lab projects.");
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		void loadData();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 1024px)");
		const handleViewportChange = () => setIsDesktop(mediaQuery.matches);

		handleViewportChange();
		mediaQuery.addEventListener("change", handleViewportChange);

		return () => mediaQuery.removeEventListener("change", handleViewportChange);
	}, []);

	const itemsPerPage = isDesktop ? 6 : 4;

	const featuredProject = useMemo(() => {
		return [...projects]
			.filter((project) => Boolean(project.featured))
			.sort((a, b) => {
				const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
				const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
				return bTime - aTime;
			})[0];
	}, [projects]);

	const allItems = useMemo<CombinedLabItem[]>(() => {
		return projects.map((project) => ({
			id: project.id,
			title: project.title,
			titleFr: project.titleFr,
			summary: project.summary,
			summaryFr: project.summaryFr,
			href: `/lab/${project.slug}`,
			coverImageUrl: project.coverImageUrl,
			tags: project.tags,
			kind: "project" as const,
			featured: project.featured,
			views: project.views,
			likes: project.likes ?? 0,
			problem: project.problem,
			problemFr: project.problemFr,
			solution: project.solution,
			solutionFr: project.solutionFr,
			meta: "Project",
			publishedAt: project.publishedAt,
			isCaseStudy: project.tags.some((tag: string) => tag.toLowerCase() === "case-study"),
		}));
	}, [projects]);

	const filteredItems = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();

		const byFilter = allItems.filter((item) => {
			if (filter === "projects") return !item.isCaseStudy;
			if (filter === "case-studies") return item.isCaseStudy;
			return true;
		});

		if (!normalizedQuery) {
			return byFilter
				.map((item) => ({ ...item, matchScore: undefined }))
				.sort((a, b) => {
					if (sortBy === "views") return b.views - a.views;
					if (sortBy === "likes") return b.likes - a.likes;
					if (sortBy === "alpha") return a.title.localeCompare(b.title);

					const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
					const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
					return bTime - aTime;
				});
		}

		// Calculate vector similarity score
		const scoredItems = byFilter.map((item) => {
			const score = calculateVectorMatchScore(normalizedQuery, {
				id: item.id,
				title: item.title,
				titleFr: item.titleFr,
				summary: item.summary,
				summaryFr: item.summaryFr,
				problem: item.problem,
				problemFr: item.problemFr,
				solution: item.solution,
				solutionFr: item.solutionFr,
				tags: item.tags,
				stack: item.tags,
				meta: item.meta,
			});
			return { ...item, matchScore: score };
		});

		// Filter out 0% match scores to keep results relevant
		const matchedItems = scoredItems.filter((item) => item.matchScore > 0);

		// Sort by match score first, then fallback to user selection
		return matchedItems.sort((a, b) => {
			const scoreDiff = b.matchScore - a.matchScore;
			if (Math.abs(scoreDiff) > 2) {
				return scoreDiff;
			}

			if (sortBy === "views") return b.views - a.views;
			if (sortBy === "likes") return b.likes - a.likes;
			if (sortBy === "alpha") return a.title.localeCompare(b.title);

			const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
			const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
			return bTime - aTime;
		});
	}, [allItems, filter, query, sortBy]);

	const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
	const safePage = Math.min(page, totalPages);
	const paginatedItems = filteredItems.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

	const changePage = (nextPage: number) => {
		setPage(Math.min(Math.max(nextPage, 1), totalPages));
	};

	const onFilterChange = (nextFilter: LabFilter) => {
		setFilter(nextFilter);
		setPage(1);
	};

	const onSortChange = (nextSort: LabSort) => {
		setSortBy(nextSort);
		setPage(1);
	};

	const onQueryChange = (value: string) => {
		setQuery(value);
		setPage(1);
	};

	return (
		<section className="space-y-8">
			{isLoading ? <p className="text-sm text-muted-foreground"><Tx en="Loading projects..." fr="Chargement des projets..." /></p> : null}
			{loadError ? (
				<p className="text-sm text-destructive">{loadError}</p>
			) : null}

			{featuredProject ? (
				<>
					<div className="space-y-3">
						<h3 className="text-xl text-center font-semibold tracking-tight">
							<Tx en="Featured Project" fr="Projet en vedette" />
						</h3>
						<div className="mx-auto max-w-lg">
							<LabCard
								id={featuredProject.id}
								title={featuredProject.title}
								titleFr={featuredProject.titleFr}
								summary={featuredProject.summary}
								summaryFr={featuredProject.summaryFr}
								href={`/lab/${featuredProject.slug}`}
								coverImageUrl={featuredProject.coverImageUrl}
								tags={featuredProject.tags}
								kind="project"
								featured={featuredProject.featured}
								views={featuredProject.views}
								likes={featuredProject.likes}
								problem={featuredProject.problem}
								problemFr={featuredProject.problemFr}
								solution={featuredProject.solution}
								solutionFr={featuredProject.solutionFr}
								meta="Project"
								publishedAt={featuredProject.publishedAt}
							/>
						</div>
					</div>
					<Separator />
				</>
			) : null}

			<div className="space-y-5">
				<div className="text-center">
					<h2 className="text-2xl font-semibold tracking-tight">
						<Tx en="Browse Projects" fr="Parcourir les projets" />
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						<Tx
							en="Use search, filters, and sorting to navigate case studies and engineering projects."
							fr="Utilisez la recherche, les filtres et le tri pour parcourir les études de cas et les projets."
						/>
					</p>
				</div>

				<div className="grid gap-3 rounded-xl border border-border/70 bg-card/40 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
					<Input
						value={query}
						onChange={(event) => onQueryChange(event.target.value)}
						placeholder={language === "FR" ? "Recherche vectorielle (ex. dashboard Next.js / cloud automation)" : "Vector search (e.g. Next.js dashboard / cloud automation)"}
					/>
					<select
						value={sortBy}
						onChange={(event) => onSortChange(event.target.value as LabSort)}
						className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						<option value="recent">{language === "FR" ? "Tri : Récent" : "Sort: Recent"}</option>
						<option value="views">{language === "FR" ? "Tri : Les plus vus" : "Sort: Most viewed"}</option>
						<option value="likes">{language === "FR" ? "Tri : Les plus aimés" : "Sort: Most liked"}</option>
						<option value="alpha">{language === "FR" ? "Tri : Alphabétique" : "Sort: Alphabetical"}</option>
					</select>
				</div>

				<div className="flex flex-wrap justify-center gap-2">
					{filterOptions.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => onFilterChange(option.value)}
							className={cn(
								"rounded-full border px-3 py-1.5 text-sm transition-colors",
								filter === option.value
									? "border-primary/50 bg-primary/10 text-foreground"
									: "border-border/70 text-muted-foreground hover:text-foreground"
							)}
						>
							<Tx en={option.labelEn} fr={option.labelFr} />
						</button>
					))}
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{isLoading
						? Array.from({ length: itemsPerPage }).map((_, index) => (
							<div
								key={`loading-card-${index}`}
								className="h-90 animate-pulse rounded-xl border border-border/70 bg-card/40"
							/>
						))
						: paginatedItems.map((item) => (
							<LabCard
								key={item.id}
								id={item.id}
								title={item.title}
								titleFr={item.titleFr}
								summary={item.summary}
								summaryFr={item.summaryFr}
								href={item.href}
								coverImageUrl={item.coverImageUrl}
								tags={item.tags}
								kind={item.kind}
								featured={item.featured}
								views={item.views}
								likes={item.likes}
								problem={item.problem}
								problemFr={item.problemFr}
								solution={item.solution}
								solutionFr={item.solutionFr}
								matchScore={item.matchScore}
								meta={item.meta}
								publishedAt={item.publishedAt}
							/>
						))}
				</div>

				{!isLoading && paginatedItems.length === 0 ? (
					<p className="py-8 text-center text-sm text-muted-foreground">
						<Tx en="No projects match your current search and filters." fr="Aucun projet ne correspond à votre recherche et à vos filtres actuels." />
					</p>
				) : null}

				<Pagination className={isLoading ? "pointer-events-none opacity-50" : ""}>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(event) => {
									event.preventDefault();
									changePage(safePage - 1);
								}}
								className={safePage === 1 ? "pointer-events-none opacity-50" : ""}
							/>
						</PaginationItem>

						{Array.from({ length: totalPages }).map((_, index) => {
							const pageNumber = index + 1;
							return (
								<PaginationItem key={pageNumber}>
									<PaginationLink
										href="#"
										isActive={safePage === pageNumber}
										onClick={(event) => {
											event.preventDefault();
											changePage(pageNumber);
										}}
									>
										{pageNumber}
									</PaginationLink>
								</PaginationItem>
							);
						})}

						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(event) => {
									event.preventDefault();
									changePage(safePage + 1);
								}}
								className={safePage === totalPages ? "pointer-events-none opacity-50" : ""}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</section>
	);
}