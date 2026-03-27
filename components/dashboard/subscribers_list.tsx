"use client";

import { useMemo, useState } from "react";
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
import { subscriberPreviews } from "@/lib/placeholder-data";

export function SubscribersList() {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		return subscriberPreviews.filter((subscriber) => {
			return (
				subscriber.email.toLowerCase().includes(query.toLowerCase()) ||
				subscriber.source.toLowerCase().includes(query.toLowerCase())
			);
		});
	}, [query]);

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
									<Button variant="ghost" size="icon-sm" type="button" aria-label="Delete subscriber">
										<Trash2 className="size-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}