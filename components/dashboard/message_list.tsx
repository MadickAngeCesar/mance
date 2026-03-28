"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { apiRequest } from "@/lib/client-api";

import { MessageCard } from "@/components/dashboard/message_card";
import { DASHBOARD_DATA_EVENT } from "@/components/dashboard/data-events";
import type { MessagePreview } from "@/lib/definitions";

const PAGE_SIZE = 4;

type ApiMessage = MessagePreview & {
	source?: string | null;
};

export function MessageList() {
	const [messages, setMessages] = useState<ApiMessage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "read" | "new">("all");
	const [page, setPage] = useState(1);

	const loadMessages = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiRequest<ApiMessage[]>("/api/messages?limit=100", {
				auth: true,
			});
			setMessages(response.data ?? []);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load messages.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadMessages();
	}, [loadMessages]);

	useEffect(() => {
		const handler = (event: Event) => {
			const custom = event as CustomEvent<{ domain?: string }>;
			if (custom.detail?.domain === "messages") {
				void loadMessages();
			}
		};

		window.addEventListener(DASHBOARD_DATA_EVENT, handler);
		return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
	}, [loadMessages]);

	const setPending = (id: string, active: boolean) => {
		setPendingIds((current) => {
			const next = new Set(current);
			if (active) {
				next.add(id);
			} else {
				next.delete(id);
			}
			return next;
		});
	};

	const handleToggleRead = async (id: string, nextRead: boolean) => {
		const previous = messages;
		setPending(id, true);
		setMessages((current) =>
			current.map((item) => (item.id === id ? { ...item, isRead: nextRead } : item))
		);

		try {
			await apiRequest(`/api/messages/${id}`, {
				method: "PATCH",
				auth: true,
				body: JSON.stringify({ isRead: nextRead }),
			});
		} catch (updateError) {
			setMessages(previous);
			setError(updateError instanceof Error ? updateError.message : "Unable to update message.");
		} finally {
			setPending(id, false);
		}
	};

	const handleDelete = async (id: string) => {
		const previous = messages;
		setPending(id, true);
		setMessages((current) => current.filter((item) => item.id !== id));

		try {
			await apiRequest(`/api/messages/${id}`, {
				method: "DELETE",
				auth: true,
			});
		} catch (deleteError) {
			setMessages(previous);
			setError(deleteError instanceof Error ? deleteError.message : "Unable to delete message.");
		} finally {
			setPending(id, false);
		}
	};

	const handleReply = async (id: string, payload: { subject?: string; body: string }) => {
		setPending(id, true);
		setError(null);

		try {
			await apiRequest(`/api/messages/${id}/reply`, {
				method: "POST",
				auth: true,
				body: JSON.stringify(payload),
			});

			setMessages((current) =>
				current.map((item) => (item.id === id ? { ...item, isRead: true } : item))
			);
		} catch (replyError) {
			setError(replyError instanceof Error ? replyError.message : "Unable to send reply.");
		} finally {
			setPending(id, false);
		}
	};

	const filtered = useMemo(() => {
		return messages.filter((message) => {
			const matchesQuery =
				message.name.toLowerCase().includes(query.toLowerCase()) ||
				message.subject.toLowerCase().includes(query.toLowerCase()) ||
				message.email.toLowerCase().includes(query.toLowerCase());
			const matchesStatus =
				statusFilter === "all" || (statusFilter === "read" ? message.isRead : !message.isRead);
			return matchesQuery && matchesStatus;
		});
	}, [messages, query, statusFilter]);

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
				{isLoading ? <p className="text-sm text-muted-foreground">Loading messages...</p> : null}
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
				<div className="grid gap-3">
					{paginated.map((message) => (
						<MessageCard
							key={message.id}
							message={message}
							onToggleRead={handleToggleRead}
							onReply={handleReply}
							onDelete={handleDelete}
							isPending={pendingIds.has(message.id)}
						/>
					))}
				</div>
				{!isLoading && paginated.length === 0 ? (
					<p className="text-sm text-muted-foreground">No messages found for the current filters.</p>
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