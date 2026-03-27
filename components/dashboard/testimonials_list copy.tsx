"use client";

import { useMemo, useState } from "react";
import { Eye, PencilLine, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TestimonialForm } from "@/components/dashboard/testimonial_form";
import { testimonials } from "@/lib/placeholder-data";

export function TestimonialsList() {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		return testimonials.filter((testimonial) => {
			return (
				testimonial.clientName.toLowerCase().includes(query.toLowerCase()) ||
				testimonial.clientRoleCompany.toLowerCase().includes(query.toLowerCase())
			);
		});
	}, [query]);

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
							<Button variant="ghost" size="icon-sm" aria-label="Delete testimonial">
								<Trash2 className="size-4" />
							</Button>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}