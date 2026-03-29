"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, PencilLine, Search, Trash2 } from "lucide-react";

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
import { DASHBOARD_DATA_EVENT } from "@/components/dashboard/data-events";
import { TestimonialForm } from "@/components/dashboard/testimonial_form";
import { apiRequest } from "@/lib/client-api";
import type { TestimonialItem } from "@/lib/definitions";

export function TestimonialsList() {
	const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");

	const loadTestimonials = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiRequest<any[]>("/api/testimonials?limit=100", {
				auth: true,
			});
			setTestimonials(
				(response.data ?? []).map((item) => ({
					id: item.id,
					clientName: item.clientName,
					clientRoleCompany: item.clientRoleCompany,
					text: item.text,
					avatarUrl: item.avatarUrl ?? undefined,
					rating: item.rating,
					projectReference: item.projectReference,
					date: item.dateLabel,
				}))
			);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Unable to load testimonials.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadTestimonials();
	}, [loadTestimonials]);

	useEffect(() => {
		const handler = (event: Event) => {
			const custom = event as CustomEvent<{ domain?: string }>;
			if (custom.detail?.domain === "services") {
				void loadTestimonials();
			}
		};

		window.addEventListener(DASHBOARD_DATA_EVENT, handler);
		return () => window.removeEventListener(DASHBOARD_DATA_EVENT, handler);
	}, [loadTestimonials]);

	const handleDelete = async (id: string) => {
		const previous = testimonials;
		setTestimonials((current) => current.filter((testimonial) => testimonial.id !== id));
		try {
			await apiRequest(`/api/testimonials/${id}`, {
				method: "DELETE",
				auth: true,
			});
		} catch (deleteError) {
			setTestimonials(previous);
			setError(deleteError instanceof Error ? deleteError.message : "Unable to delete testimonial.");
		}
	};

	const filtered = useMemo(() => {
		return testimonials.filter((testimonial) => {
			return (
				testimonial.clientName.toLowerCase().includes(query.toLowerCase()) ||
				testimonial.clientRoleCompany.toLowerCase().includes(query.toLowerCase())
			);
		});
	}, [query, testimonials]);

	return (
		<Card>
			<CardHeader className="gap-3 border-b border-border/70 pb-4">
				<CardTitle className="text-base">Testimonials</CardTitle>
				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search client or company"
						className="pl-8"
					/>
				</div>
			</CardHeader>
			<CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
				{isLoading ? <p className="text-sm text-muted-foreground">Loading testimonials...</p> : null}
				{error ? <p className="text-sm text-destructive">{error}</p> : null}
				{filtered.map((testimonial) => (
					<div key={testimonial.id} className="rounded-lg border border-border/70 bg-card/70 p-3">
						<div className="flex flex-wrap items-start justify-between gap-2">
							<div className="space-y-1">
								<p className="font-medium">{testimonial.clientName}</p>
								<p className="text-sm text-muted-foreground">{testimonial.clientRoleCompany}</p>
							</div>
							<Badge variant="outline">{testimonial.rating}/5</Badge>
						</div>
						<p className="mt-2 text-sm text-muted-foreground">{testimonial.text}</p>
						<p className="mt-2 text-xs text-muted-foreground">{testimonial.projectReference} · {testimonial.date}</p>
						<div className="mt-3 flex gap-1">
							<Button variant="ghost" size="icon-sm" aria-label="View testimonial">
								<Eye className="size-4" />
							</Button>
							<TestimonialForm
								mode="edit"
								initialTestimonial={testimonial}
								trigger={
									<Button variant="ghost" size="icon-sm" aria-label="Edit testimonial">
										<PencilLine className="size-4" />
									</Button>
								}
							/>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="ghost" size="icon-sm" aria-label="Delete testimonial">
										<Trash2 className="size-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent size="sm">
									<AlertDialogHeader>
										<AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
										<AlertDialogDescription>
											This will permanently delete the testimonial from {testimonial.clientName}.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction variant="destructive" onClick={() => void handleDelete(testimonial.id)}>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				))}
				{!isLoading && filtered.length === 0 ? (
					<p className="text-sm text-muted-foreground">No testimonials found for this search.</p>
				) : null}
			</CardContent>
		</Card>
	);
}
