"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PencilLine, Search, Trash2 } from "lucide-react";

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
import { AcademyResourceForm } from "@/components/dashboard/academy_resource_form";
import { apiRequest } from "@/lib/client-api";

type AcademyResourceItem = {
	id: string;
	title: string;
	titleFr?: string | null;
	slug: string;
	description: string;
	descriptionFr?: string | null;
	content: string;
	contentFr?: string | null;
	type: "ARTICLE" | "GUIDE" | "BOOK" | "COURSE";
	coverImageUrl: string;
	tags: string[];
	views: number;
	publishedAt?: string | null;
};

const PAGE_SIZE = 8;

const TYPE_LABELS: Record<string, { en: string; fr: string }> = {
	ARTICLE: { en: "Article", fr: "Article" },
	GUIDE: { en: "Guide", fr: "Guide" },
	BOOK: { en: "Book", fr: "Livre" },
	COURSE: { en: "Course", fr: "Cours" },
};

export function AcademyResourceList() {
	const { language } = useLanguage();
	const [resources, setResources] = useState<AcademyResourceItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<"all" | "ARTICLE" | "GUIDE" | "BOOK" | "COURSE">("all");
	const [page, setPage] = useState(1);

	const loadResources = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiRequest<AcademyResourceItem[]>("/api/academy?limit=200&published=all", {
				auth: true,
			});
			setResources(response.data ?? []);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load resources.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadResources();
	}, [loadResources]);

	useEffect(() => {
		const handler = (event: Event) => {
			const custom = event as CustomEvent<{ domain?: string }>;
			if (custom.detail?.domain === "blogs") {
				void loadResources();
			}
		};
		window.addEventListener(DASHBOARD_DATA_EVENT, handler);
		return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
	}, [loadResources]);

	const handleDelete = async (id: string) => {
		const previous = resources;
		setResources((current) => current.filter((r) => r.id !== id));
		try {
			await apiRequest(`/api/academy/${id}`, { method: "DELETE", auth: true });
		} catch (deleteError) {
			setResources(previous);
			setError(deleteError instanceof Error ? deleteError.message : "Unable to delete.");
		}
	};

	const filtered = useMemo(() => {
		return resources.filter((r) => {
			const matchesQuery =
				r.title.toLowerCase().includes(query.toLowerCase()) ||
				r.tags.join(" ").toLowerCase().includes(query.toLowerCase());
			const matchesType = typeFilter === "all" || r.type === typeFilter;
			return matchesQuery && matchesType;
		});
	}, [resources, query, typeFilter]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">
					{language === "FR" ? "Ressources de l'Académie" : "Academy Resources"}
				</CardTitle>
				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={query}
							onChange={(e) => { setQuery(e.target.value); setPage(1); }}
							placeholder={language === "FR" ? "Rechercher par titre ou tags" : "Search title or tags"}
							className="pl-8"
						/>
					</div>
					<select
						className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm"
						value={typeFilter}
						onChange={(e) => { setTypeFilter(e.target.value as typeof typeFilter); setPage(1); }}
					>
						<option value="all">{language === "FR" ? "Tous les types" : "All types"}</option>
						<option value="ARTICLE">Article</option>
						<option value="GUIDE">Guide</option>
						<option value="BOOK">{language === "FR" ? "Livre" : "Book"}</option>
						<option value="COURSE">{language === "FR" ? "Cours" : "Course"}</option>
					</select>
				</div>
			</CardHeader>
			<CardContent className="space-y-3 pt-4">
				{isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{language === "FR" ? "Ressource" : "Resource"}</TableHead>
							<TableHead>{language === "FR" ? "Type" : "Type"}</TableHead>
							<TableHead>{language === "FR" ? "Statut" : "Status"}</TableHead>
							<TableHead>{language === "FR" ? "Vues" : "Views"}</TableHead>
							<TableHead>{language === "FR" ? "Actions" : "Actions"}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginated.map((resource) => (
							<TableRow key={resource.id}>
								<TableCell>
									<div className="space-y-0.5">
										<p className="font-medium">{resource.title}</p>
										<p className="text-xs text-muted-foreground">/{resource.slug}</p>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant="outline" className="text-xs">
										{TYPE_LABELS[resource.type]?.[language === "FR" ? "fr" : "en"] ?? resource.type}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge variant={resource.publishedAt ? "default" : "outline"}>
										{resource.publishedAt
											? (language === "FR" ? "Publié" : "Published")
											: (language === "FR" ? "Brouillon" : "Draft")}
									</Badge>
								</TableCell>
								<TableCell className="text-sm">{resource.views.toLocaleString()}</TableCell>
								<TableCell>
									<div className="flex gap-1">
										<AcademyResourceForm
											mode="edit"
											initialResource={resource}
											trigger={
												<Button variant="ghost" size="icon-sm" aria-label="Edit resource">
													<PencilLine className="size-4" />
												</Button>
											}
										/>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="ghost" size="icon-sm" aria-label="Delete resource">
													<Trash2 className="size-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent size="sm">
												<AlertDialogHeader>
													<AlertDialogTitle>Delete resource?</AlertDialogTitle>
													<AlertDialogDescription>
														This will permanently delete &quot;{resource.title}&quot;.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction variant="destructive" onClick={() => void handleDelete(resource.id)}>
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
					<p className="text-sm text-muted-foreground">No resources found for the current filters.</p>
				) : null}
				<Pagination className="justify-end">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
						</PaginationItem>
						{Array.from({ length: pageCount }, (_, i) => i + 1).map((value) => (
							<PaginationItem key={value}>
								<PaginationLink href="#" isActive={value === currentPage} onClick={(e) => { e.preventDefault(); setPage(value); }}>
									{value}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(pageCount, p + 1)); }} />
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</CardContent>
		</Card>
	);
}
