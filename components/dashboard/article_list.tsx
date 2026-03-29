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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DASHBOARD_DATA_EVENT } from "@/components/dashboard/data-events";
import { ArticleForm } from "@/components/dashboard/article_form";
import { apiRequest } from "@/lib/client-api";
import type { LabArticle } from "@/lib/definitions";

const PAGE_SIZE = 5;

export function ArticleList() {
	const { language } = useLanguage();
	const [articles, setArticles] = useState<LabArticle[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [page, setPage] = useState(1);

	const loadArticles = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiRequest<LabArticle[]>("/api/blogs?limit=100&published=all", {
				auth: true,
			});
			setArticles(response.data ?? []);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load articles.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadArticles();
	}, [loadArticles]);

	useEffect(() => {
		const handler = (event: Event) => {
			const custom = event as CustomEvent<{ domain?: string }>;
			if (custom.detail?.domain === "blogs") {
				void loadArticles();
			}
		};

		window.addEventListener(DASHBOARD_DATA_EVENT, handler);
		return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
	}, [loadArticles]);

	const handleDelete = async (id: string) => {
		const previous = articles;
		setArticles((current) => current.filter((article) => article.id !== id));
		try {
			await apiRequest(`/api/blogs/${id}`, {
				method: "DELETE",
				auth: true,
			});
		} catch (deleteError) {
			setArticles(previous);
			setError(deleteError instanceof Error ? deleteError.message : "Unable to delete article.");
		}
	};

	const categories = useMemo(
		() => ["all", ...Array.from(new Set(articles.map((article) => article.category.toLowerCase())))],
		[articles]
	);

	const filtered = useMemo(() => {
		return articles.filter((article) => {
			const matchesQuery =
				article.title.toLowerCase().includes(query.toLowerCase()) ||
				article.tags.join(" ").toLowerCase().includes(query.toLowerCase());
			const matchesCategory =
				categoryFilter === "all" || article.category.toLowerCase() === categoryFilter;
			return matchesQuery && matchesCategory;
		});
	}, [articles, categoryFilter, query]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const offset = (currentPage - 1) * PAGE_SIZE;
	const paginated = filtered.slice(offset, offset + PAGE_SIZE);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">{language === "FR" ? "Bibliotheque d'articles" : "Articles Library"}</CardTitle>
				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={query}
							onChange={(event) => {
								setQuery(event.target.value);
								setPage(1);
							}}
							placeholder={language === "FR" ? "Rechercher par titre ou tag" : "Search by title or tag"}
							className="pl-8"
						/>
					</div>
					<select
						className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
						value={categoryFilter}
						onChange={(event) => {
							setCategoryFilter(event.target.value);
							setPage(1);
						}}
					>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category === "all" ? (language === "FR" ? "Toutes les categories" : "All categories") : category}
							</option>
						))}
					</select>
				</div>
			</CardHeader>
			<CardContent className="space-y-3 pt-4">
				{isLoading ? <p className="text-sm text-muted-foreground">Loading articles...</p> : null}
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{language === "FR" ? "Article" : "Article"}</TableHead>
							<TableHead>{language === "FR" ? "Categorie" : "Category"}</TableHead>
							<TableHead>{language === "FR" ? "Statut" : "Status"}</TableHead>
							<TableHead>{language === "FR" ? "Vues" : "Views"}</TableHead>
							<TableHead>{language === "FR" ? "Actions" : "Actions"}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginated.map((article) => (
							<TableRow key={article.id}>
								<TableCell>
									<div className="space-y-1">
										<p className="font-medium">{article.title}</p>
										<p className="text-xs text-muted-foreground">/{article.slug}</p>
									</div>
								</TableCell>
								<TableCell>{article.category}</TableCell>
								<TableCell>
										<Badge variant={article.publishedAt ? "default" : "outline"}>
											{article.publishedAt
												? language === "FR"
													? "Publie"
													: "Published"
												: language === "FR"
													? "Brouillon"
													: "Draft"}
										</Badge>
								</TableCell>
								<TableCell>{article.views.toLocaleString()}</TableCell>
								<TableCell>
									<div className="flex gap-1">
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label="View article"
											onClick={() => window.open(`/lab/${article.slug}`, "_blank", "noopener,noreferrer")}
										>
											<Eye className="size-4" />
										</Button>
										<ArticleForm
											mode="edit"
											initialArticle={article}
											trigger={
												<Button variant="ghost" size="icon-sm" aria-label="Edit article">
													<PencilLine className="size-4" />
												</Button>
											}
										/>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="ghost" size="icon-sm" aria-label="Delete article">
													<Trash2 className="size-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent size="sm">
												<AlertDialogHeader>
													<AlertDialogTitle>Delete article?</AlertDialogTitle>
													<AlertDialogDescription>
														This will permanently delete {article.title}.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction variant="destructive" onClick={() => void handleDelete(article.id)}>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{!isLoading && paginated.length === 0 ? (
					<p className="text-sm text-muted-foreground">No articles found for the current filters.</p>
				) : null}

				<Pagination className="justify-end">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(event) => {
									event.preventDefault();
									setPage((current) => Math.max(1, current - 1));
								}}
							/>
						</PaginationItem>
						{Array.from({ length: pageCount }, (_, index) => {
							const value = index + 1;
							return (
								<PaginationItem key={value}>
									<PaginationLink
										href="#"
										isActive={value === currentPage}
										onClick={(event) => {
											event.preventDefault();
											setPage(value);
										}}
									>
										{value}
									</PaginationLink>
								</PaginationItem>
							);
						})}
						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(event) => {
									event.preventDefault();
									setPage((current) => Math.min(pageCount, current + 1));
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</CardContent>
		</Card>
	);
}