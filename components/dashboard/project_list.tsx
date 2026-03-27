"use client";

import { useMemo, useState } from "react";
import { Eye, PencilLine, Search, Trash2 } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
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
import { ProjectForm } from "@/components/dashboard/project_form";
import { labProjects } from "@/lib/placeholder-data";

const PAGE_SIZE = 5;

export function ProjectList() {
	const { language } = useLanguage();
	const [query, setQuery] = useState("");
	const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "standard">("all");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		return labProjects.filter((project) => {
			const matchesQuery =
				project.title.toLowerCase().includes(query.toLowerCase()) ||
				project.tags.join(" ").toLowerCase().includes(query.toLowerCase());
			const matchesFeatured =
				featuredFilter === "all" ||
				(featuredFilter === "featured" ? project.featured : !project.featured);
			return matchesQuery && matchesFeatured;
		});
	}, [featuredFilter, query]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const offset = (currentPage - 1) * PAGE_SIZE;
	const paginated = filtered.slice(offset, offset + PAGE_SIZE);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">{language === "FR" ? "Portfolio des projets" : "Project Portfolio"}</CardTitle>
				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={query}
							onChange={(event) => {
								setQuery(event.target.value);
								setPage(1);
							}}
							placeholder={language === "FR" ? "Rechercher par titre ou tags" : "Search project title or tags"}
							className="pl-8"
						/>
					</div>
					<select
						className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
						value={featuredFilter}
						onChange={(event) => {
							setFeaturedFilter(event.target.value as "all" | "featured" | "standard");
							setPage(1);
						}}
					>
						<option value="all">{language === "FR" ? "Tous les projets" : "All projects"}</option>
						<option value="featured">{language === "FR" ? "En vedette seulement" : "Featured only"}</option>
						<option value="standard">{language === "FR" ? "Standards seulement" : "Standard only"}</option>
					</select>
				</div>
			</CardHeader>
			<CardContent className="space-y-3 pt-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{language === "FR" ? "Projet" : "Project"}</TableHead>
							<TableHead>{language === "FR" ? "Stack" : "Stack"}</TableHead>
							<TableHead>{language === "FR" ? "Statut" : "Status"}</TableHead>
							<TableHead>{language === "FR" ? "Vues" : "Views"}</TableHead>
							<TableHead>{language === "FR" ? "Actions" : "Actions"}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginated.map((project) => (
							<TableRow key={project.id}>
								<TableCell>
									<div className="space-y-1">
										<p className="font-medium">{project.title}</p>
										<p className="text-xs text-muted-foreground">/{project.slug}</p>
									</div>
								</TableCell>
								<TableCell className="max-w-65 truncate">{project.stack.join(", ")}</TableCell>
								<TableCell>
									<Badge variant={project.featured ? "default" : "outline"}>
										{project.featured ? (language === "FR" ? "En vedette" : "Featured") : (language === "FR" ? "Publie" : "Published")}
									</Badge>
								</TableCell>
								<TableCell>{project.views.toLocaleString()}</TableCell>
								<TableCell>
									<div className="flex gap-1">
										<Button variant="ghost" size="icon-sm" aria-label="View project">
											<Eye className="size-4" />
										</Button>
										<ProjectForm
											mode="edit"
											initialProject={project}
											trigger={
												<Button variant="ghost" size="icon-sm" aria-label="Edit project">
													<PencilLine className="size-4" />
												</Button>
											}
										/>
										<Button variant="ghost" size="icon-sm" aria-label="Delete project">
											<Trash2 className="size-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

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