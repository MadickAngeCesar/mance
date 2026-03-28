"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DASHBOARD_DATA_EVENT } from "@/components/dashboard/data-events";
import { apiRequest } from "@/lib/client-api";

type SubscriberItem = {
	id: string;
	email: string;
	source: string;
	subscribedAt: string;
	active: boolean;
};

export function SubscribersList() {
	const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
	const [query, setQuery] = useState("");

	const loadSubscribers = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiRequest<SubscriberItem[]>("/api/subscribers?limit=100", {
				auth: true,
			});
			setSubscribers(response.data ?? []);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load subscribers.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadSubscribers();
	}, [loadSubscribers]);

	useEffect(() => {
		const handler = (event: Event) => {
			const custom = event as CustomEvent<{ domain?: string }>;
			if (custom.detail?.domain === "subscribers") {
				void loadSubscribers();
			}
		};

		window.addEventListener(DASHBOARD_DATA_EVENT, handler);
		return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
	}, [loadSubscribers]);

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

	const handleDelete = async (id: string) => {
		const previous = subscribers;
		setPending(id, true);
		setSubscribers((current) => current.filter((item) => item.id !== id));

		try {
			await apiRequest(`/api/subscribers/${id}`, {
				method: "DELETE",
				auth: true,
			});
		} catch (deleteError) {
			setSubscribers(previous);
			setError(deleteError instanceof Error ? deleteError.message : "Unable to delete subscriber.");
		} finally {
			setPending(id, false);
		}
	};

	const filtered = useMemo(() => {
		return subscribers.filter((subscriber) => {
			return (
				subscriber.email.toLowerCase().includes(query.toLowerCase()) ||
				subscriber.source.toLowerCase().includes(query.toLowerCase())
			);
		});
	}, [query, subscribers]);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">Newsletter Subscribers</CardTitle>
				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search email or source"
						className="pl-8"
					/>
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				{isLoading ? <p className="pb-3 text-sm text-muted-foreground">Loading subscribers...</p> : null}
				{error ? <p className="pb-3 text-sm text-destructive">{error}</p> : null}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Email</TableHead>
							<TableHead>Source</TableHead>
							<TableHead>Subscribed At</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((subscriber) => (
							<TableRow key={subscriber.id}>
								<TableCell>{subscriber.email}</TableCell>
								<TableCell>{subscriber.source}</TableCell>
								<TableCell>{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="icon-sm"
										type="button"
										aria-label="Delete subscriber"
										onClick={() => void handleDelete(subscriber.id)}
										disabled={pendingIds.has(subscriber.id)}
									>
										<Trash2 className="size-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{!isLoading && filtered.length === 0 ? (
					<p className="pt-3 text-sm text-muted-foreground">No subscribers found for this search.</p>
				) : null}
			</CardContent>
		</Card>
	);
}