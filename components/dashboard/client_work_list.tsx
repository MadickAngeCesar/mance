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
import { ClientWorkForm } from "@/components/dashboard/client_work_form";
import { apiRequest } from "@/lib/client-api";

type ClientWorkItem = {
	id: string;
	title: string;
	titleFr?: string | null;
	description: string;
	descriptionFr?: string | null;
	clientName?: string | null;
	clientNameFr?: string | null;
	imageUrl: string;
	projectUrl?: string | null;
	stack: string[];
	slug?: string | null;
	publishedAt?: string | null;
};

const PAGE_SIZE = 5;

export function ClientWorkList() {
	const { language } = useLanguage();
	const [works, setWorks] = useState<ClientWorkItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);

	const loadWorks = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiRequest<ClientWorkItem[]>("/api/client-work?limit=100&published=all", {
				auth: true,
			});
			setWorks(response.data ?? []);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load client work.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadWorks();
	}, [loadWorks]);

	useEffect(() => {
		const handler = (event: Event) => {
			const custom = event as CustomEvent<{ domain?: string }>;
			if (custom.detail?.domain === "services") {
				void loadWorks();
			}
		};
		window.addEventListener(DASHBOARD_DATA_EVENT, handler);
		return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
	}, [loadWorks]);

	const handleDelete = async (id: string) => {
		const previous = works;
		setWorks((current) => current.filter((w) => w.id !== id));
		try {
			await apiRequest(`/api/client-work/${id}`, { method: "DELETE", auth: true });
		} catch (deleteError) {
			setWorks(previous);
			setError(deleteError instanceof Error ? deleteError.message : "Unable to delete.");
		}
	};

	const filtered = useMemo(() => {
		return works.filter((w) =>
			w.title.toLowerCase().includes(query.toLowerCase()) ||
			(w.clientName ?? "").toLowerCase().includes(query.toLowerCase())
		);
	}, [works, query]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">
					{language === "FR" ? "Projets Clients" : "Client Work Portfolio"}
				</CardTitle>
				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(e) => { setQuery(e.target.value); setPage(1); }}
						placeholder={language === "FR" ? "Rechercher par titre ou client" : "Search by title or client"}
						className="pl-8"
					/>
				</div>
			</CardHeader>
			<CardContent className="space-y-3 pt-4">
				{isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{language === "FR" ? "Projet" : "Project"}</TableHead>
							<TableHead>{language === "FR" ? "Client" : "Client"}</TableHead>
							<TableHead>{language === "FR" ? "Stack" : "Stack"}</TableHead>
							<TableHead>{language === "FR" ? "Statut" : "Status"}</TableHead>
							<TableHead>{language === "FR" ? "Actions" : "Actions"}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginated.map((work) => (
							<TableRow key={work.id}>
								<TableCell>
									<div className="space-y-0.5">
										<p className="font-medium">{work.title}</p>
										{work.slug ? <p className="text-xs text-muted-foreground">/{work.slug}</p> : null}
									</div>
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{work.clientName ?? "—"}
								</TableCell>
								<TableCell className="max-w-48 truncate text-sm text-muted-foreground">
									{work.stack.join(", ") || "—"}
								</TableCell>
								<TableCell>
									<Badge variant={work.publishedAt ? "default" : "outline"}>
										{work.publishedAt
											? (language === "FR" ? "Publié" : "Published")
											: (language === "FR" ? "Brouillon" : "Draft")}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex gap-1">
										{work.projectUrl ? (
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="View project"
												onClick={() => window.open(work.projectUrl!, "_blank", "noopener,noreferrer")}
											>
												<Eye className="size-4" />
											</Button>
										) : null}
										<ClientWorkForm
											mode="edit"
											initialWork={work}
											trigger={
												<Button variant="ghost" size="icon-sm" aria-label="Edit client work">
													<PencilLine className="size-4" />
												</Button>
											}
										/>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="ghost" size="icon-sm" aria-label="Delete client work">
													<Trash2 className="size-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent size="sm">
												<AlertDialogHeader>
													<AlertDialogTitle>Delete client work?</AlertDialogTitle>
													<AlertDialogDescription>
														This will permanently delete &quot;{work.title}&quot;.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction variant="destructive" onClick={() => void handleDelete(work.id)}>
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
					<p className="text-sm text-muted-foreground">No client work entries found.</p>
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
