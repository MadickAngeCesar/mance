"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

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
import { messagePreviews } from "@/lib/placeholder-data";

import { MessageCard } from "@/components/dashboard/message_card";

const PAGE_SIZE = 4;

export function MessageList() {
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "read" | "new">("all");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		return messagePreviews.filter((message) => {
			const matchesQuery =
				message.name.toLowerCase().includes(query.toLowerCase()) ||
				message.subject.toLowerCase().includes(query.toLowerCase()) ||
				message.email.toLowerCase().includes(query.toLowerCase());
			const matchesStatus =
				statusFilter === "all" || (statusFilter === "read" ? message.isRead : !message.isRead);
			return matchesQuery && matchesStatus;
		});
	}, [query, statusFilter]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const start = (currentPage - 1) * PAGE_SIZE;
	const paginated = filtered.slice(start, start + PAGE_SIZE);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">Inbox Messages</CardTitle>
				<div className="flex flex-col gap-2 md:flex-row md:items-center">
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={query}
							onChange={(event) => {
								setQuery(event.target.value);
								setPage(1);
							}}
							placeholder="Search sender, subject, or email"
							className="pl-8"
						/>
					</div>
					<select
						className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
						value={statusFilter}
						onChange={(event) => {
							setStatusFilter(event.target.value as "all" | "read" | "new");
							setPage(1);
						}}
					>
						<option value="all">All</option>
						<option value="new">New</option>
						<option value="read">Read</option>
					</select>
				</div>
			</CardHeader>
			<CardContent className="space-y-3 pt-4">
				<div className="grid gap-3">
					{paginated.map((message) => (
						<MessageCard key={message.id} message={message} />
					))}
				</div>

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