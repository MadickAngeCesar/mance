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

type LabFilter = "all" | "projects" | "articles" | "case-studies";
type LabSort = "recent" | "views" | "alpha";

type CombinedLabItem = {
	id: string;
	title: string;
	summary: string;
	href: string;
	coverImageUrl: string;
	tags: string[];
	kind: "project" | "article";
	featured: boolean;
	views: number;
	meta: string;
	publishedAt?: string;
	isCaseStudy: boolean;
};

type ProjectItem = {
	id: string;
	title: string;
	summary: string;
	slug: string;
	coverImageUrl: string;
	tags: string[];
	featured: boolean;
	views: number;
	publishedAt?: string;
};

type ArticleItem = {
	id: string;
	title: string;
	excerpt: string;
	slug: string;
	coverImageUrl: string;
	tags: string[];
	featured: boolean;
	views: number;
	category: string;
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

const filterOptions: Array<{ value: LabFilter; label: string }> = [
	{ value: "all", label: "All" },
	{ value: "projects", label: "Projects" },
	{ value: "articles", label: "Articles" },
	{ value: "case-studies", label: "Case Studies" },
];

export function LabList() {
	const [projects, setProjects] = useState<ProjectItem[]>([]);
	const [articles, setArticles] = useState<ArticleItem[]>([]);
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
				const [projectsResult, articlesResult] = await Promise.allSettled([
					fetchAllPages<ProjectItem>("/api/projects?published=published&sort=newest&featured=all"),
					fetchAllPages<ArticleItem>("/api/blogs?published=published&sort=newest&featured=all"),
				]);

				if (!isMounted) {
					return;
				}

				const loadedProjects =
					projectsResult.status === "fulfilled"
						? projectsResult.value
								.filter((item) => Boolean(item.slug))
								.map((item) => ({
									...item,
									coverImageUrl: item.coverImageUrl || "/images/Profile.jpg",
								}))
						: [];

				const loadedArticles =
					articlesResult.status === "fulfilled"
						? articlesResult.value
								.filter((item) => Boolean(item.slug))
								.map((item) => ({
									...item,
									coverImageUrl: item.coverImageUrl || "/images/Profile.jpg",
								}))
						: [];

				setProjects(loadedProjects);
				setArticles(loadedArticles);

				if (projectsResult.status === "rejected" && articlesResult.status === "rejected") {
					throw new Error("Unable to load projects and articles for lab page.");
				}

				if (projectsResult.status === "rejected") {
					setLoadError("Projects could not be loaded. Showing available articles.");
				}

				if (articlesResult.status === "rejected") {
					setLoadError("Articles could not be loaded. Showing available projects.");
				}
			} catch (error) {
				if (!isMounted) {
					return;
				}
				setLoadError(error instanceof Error ? error.message : "Unable to load lab content.");
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

	const featuredProjects = useMemo(
		() => projects.filter((project) => Boolean(project.featured)),
		[projects]
	);

	const featuredProject = useMemo(() => {
		return [...featuredProjects].sort((a, b) => {
			const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
			const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
			return bTime - aTime;
		})[0];
	}, [featuredProjects]);

	const featuredArticle = useMemo(
		() =>
			[...articles]
				.filter((article) => Boolean(article.featured))
				.sort((a, b) => {
					const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
					const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
					return bTime - aTime;
				})[0],
		[articles]
	);

	const allItems = useMemo<CombinedLabItem[]>(() => {
		const projectItems = projects.map((project) => ({
			id: project.id,
			title: project.title,
			summary: project.summary,
			href: `/lab/${project.slug}`,
			coverImageUrl: project.coverImageUrl,
			tags: project.tags,
			kind: "project" as const,
			featured: project.featured,
			views: project.views,
			meta: "Project",
			publishedAt: project.publishedAt,
			isCaseStudy: project.tags.some((tag: string) => tag.toLowerCase() === "case-study"),
		}));

		const articleItems = articles.map((article) => ({
			id: article.id,
			title: article.title,
			summary: article.excerpt,
			href: `/lab/${article.slug}`,
			coverImageUrl: article.coverImageUrl,
			tags: article.tags,
			kind: "article" as const,
			featured: Boolean(article.featured),
			views: article.views,
			meta: article.category,
			publishedAt: article.publishedAt,
			isCaseStudy:
				article.category.toLowerCase() === "case study" ||
				article.tags.some((tag: string) => tag.toLowerCase() === "case-study"),
		}));

		return [...projectItems, ...articleItems];
	}, [articles, projects]);

	const filteredItems = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();

		const byFilter = allItems.filter((item) => {
			if (filter === "projects") return item.kind === "project";
			if (filter === "articles") return item.kind === "article";
			if (filter === "case-studies") return item.isCaseStudy;
			return true;
		});

		const bySearch = byFilter.filter((item) => {
			if (!normalizedQuery) return true;
			const haystack = `${item.title} ${item.summary} ${item.tags.join(" ")} ${item.meta}`.toLowerCase();
			return haystack.includes(normalizedQuery);
		});

		return bySearch.sort((a, b) => {
			if (sortBy === "views") return b.views - a.views;
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
			{isLoading ? (
				<p className="text-sm text-muted-foreground">Loading lab content...</p>
			) : null}
			{loadError ? (
				<p className="text-sm text-destructive">{loadError}</p>
			) : null}
			<div className="grid items-start gap-6 sm:grid-cols-2">
				{featuredProject ? (
					<div className="space-y-3">
						<h3 className="text-xl text-center font-semibold tracking-tight">Featured Project</h3>
						<LabCard
							title={featuredProject.title}
							summary={featuredProject.summary}
							href={`/lab/${featuredProject.slug}`}
							coverImageUrl={featuredProject.coverImageUrl}
							tags={featuredProject.tags}
							kind="project"
							featured={featuredProject.featured}
							views={featuredProject.views}
							meta="Project"
							publishedAt={featuredProject.publishedAt}
						/>
					</div>
				) : null}

				{featuredArticle ? (
					<div className="space-y-3">
						<h3 className="text-xl text-center font-semibold tracking-tight">Featured Article</h3>
						<LabCard
							title={featuredArticle.title}
							summary={featuredArticle.excerpt}
							href={`/lab/${featuredArticle.slug}`}
							coverImageUrl={featuredArticle.coverImageUrl}
							tags={featuredArticle.tags}
							kind="article"
							featured={true}
							views={featuredArticle.views}
							meta={featuredArticle.category}
							publishedAt={featuredArticle.publishedAt}
						/>
					</div>
				) : null}
			</div>

			<Separator />

			<div className="space-y-5">
				<div className="text-center">
					<h2 className="text-2xl font-semibold tracking-tight">Browse Projects and Articles</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Use search, filters, and sorting to navigate case studies, projects, and technical writing.
					</p>
				</div>

				<div className="grid gap-3 rounded-xl border border-border/70 bg-card/40 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
					<Input
						value={query}
						onChange={(event) => onQueryChange(event.target.value)}
						placeholder="Search title, tags, or excerpt"
					/>
					<select
						value={sortBy}
						onChange={(event) => onSortChange(event.target.value as LabSort)}
						className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						<option value="recent">Sort: Recent</option>
						<option value="views">Sort: Most viewed</option>
						<option value="alpha">Sort: Alphabetical</option>
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
							{option.label}
						</button>
					))}
				</div>

				<div className="grid sm:grid-cols-2 gap-4 lg:grid-cols-3">
					{paginatedItems.map((item) => (
						<LabCard
							key={item.id}
							title={item.title}
							summary={item.summary}
							href={item.href}
							coverImageUrl={item.coverImageUrl}
							tags={item.tags}
							kind={item.kind}
							featured={item.featured}
							views={item.views}
							meta={item.meta}
							publishedAt={item.publishedAt}
						/>
					))}
				</div>

				{paginatedItems.length === 0 ? (
					<p className="text-sm text-muted-foreground">No items match your current search and filters.</p>
				) : null}

				<Pagination>
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