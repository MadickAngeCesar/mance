"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Globe, Mail, PencilLine, Search, Trash2 } from "lucide-react";

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
import { CollaboratorForm } from "@/components/dashboard/collaborator_form";
import { apiRequest } from "@/lib/client-api";

type TeamMemberItem = {
	id: string;
	name: string;
	role: string;
	roleFr?: string | null;
	speciality: string;
	specialityFr?: string | null;
	imageUrl: string;
	linkedIn?: string | null;
	whatsApp?: string | null;
	email?: string | null;
	website?: string | null;
	displayOrder: number;
};

const PAGE_SIZE = 5;

export function CollaboratorList() {
	const { language } = useLanguage();
	const [members, setMembers] = useState<TeamMemberItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);

	const loadMembers = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiRequest<TeamMemberItem[]>("/api/collaborators", {
				auth: true,
			});
			setMembers(response.data ?? []);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load collaborators.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadMembers();
	}, [loadMembers]);

	useEffect(() => {
		const handler = (event: Event) => {
			const custom = event as CustomEvent<{ domain?: string }>;
			if (custom.detail?.domain === "profile") {
				void loadMembers();
			}
		};
		window.addEventListener(DASHBOARD_DATA_EVENT, handler);
		return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
	}, [loadMembers]);

	const handleDelete = async (id: string) => {
		const previous = members;
		setMembers((current) => current.filter((m) => m.id !== id));
		try {
			await apiRequest(`/api/collaborators/${id}`, { method: "DELETE", auth: true });
		} catch (deleteError) {
			setMembers(previous);
			setError(deleteError instanceof Error ? deleteError.message : "Unable to delete.");
		}
	};

	const filtered = useMemo(() => {
		return members.filter((m) =>
			m.name.toLowerCase().includes(query.toLowerCase()) ||
			m.role.toLowerCase().includes(query.toLowerCase())
		);
	}, [members, query]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">
					{language === "FR" ? "Liste des Collaborateurs" : "Collaborators List"}
				</CardTitle>
				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(e) => { setQuery(e.target.value); setPage(1); }}
						placeholder={language === "FR" ? "Rechercher par nom ou rôle" : "Search by name or role"}
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
							<TableHead>{language === "FR" ? "Nom" : "Name"}</TableHead>
							<TableHead>{language === "FR" ? "Rôle" : "Role"}</TableHead>
							<TableHead>{language === "FR" ? "Spécialité" : "Speciality"}</TableHead>
							<TableHead>{language === "FR" ? "Contacts & Liens" : "Contacts & Links"}</TableHead>
							<TableHead>{language === "FR" ? "Actions" : "Actions"}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginated.map((member) => (
							<TableRow key={member.id}>
								<TableCell className="font-medium">{member.name}</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{language === "FR" ? (member.roleFr || member.role) : member.role}
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{language === "FR" ? (member.specialityFr || member.speciality) : member.speciality}
								</TableCell>
								<TableCell>
									<div className="flex gap-2 text-muted-foreground">
										{member.email && (
											<a href={`mailto:${member.email}`} title={member.email}>
												<Mail className="size-4 hover:text-primary" />
											</a>
										)}
										{member.website && (
											<a href={member.website.startsWith("http") ? member.website : `https://${member.website}`} target="_blank" rel="noopener noreferrer" title={member.website}>
												<Globe className="size-4 hover:text-primary" />
											</a>
										)}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex gap-1">
										<CollaboratorForm
											mode="edit"
											initialMember={member}
											trigger={
												<Button variant="ghost" size="icon-sm" aria-label="Edit collaborator">
													<PencilLine className="size-4" />
												</Button>
											}
										/>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="ghost" size="icon-sm" aria-label="Delete collaborator">
													<Trash2 className="size-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent size="sm">
												<AlertDialogHeader>
													<AlertDialogTitle>Delete collaborator?</AlertDialogTitle>
													<AlertDialogDescription>
														This will permanently delete &quot;{member.name}&quot; from display.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction variant="destructive" onClick={() => void handleDelete(member.id)}>
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
					<p className="text-sm text-muted-foreground">No collaborators found.</p>
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
