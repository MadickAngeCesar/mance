import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aboutSummary, education, experience } from "@/lib/placeholder-data";

export function About() {
	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">About</h2>
					<p className="mt-1 text-sm text-muted-foreground">Professional summary, education, and experience.</p>
				</div>
				<Button asChild variant="outline">
					<Link href={aboutSummary.cvDownloadUrl} download>
						Download CV
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Biography</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm leading-7 text-muted-foreground">
					<p>{aboutSummary.biography}</p>
					<p className="text-xs text-muted-foreground/80">{aboutSummary.linkedinResumeSource}</p>
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Education and Certification</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{education.map((item) => (
							<div key={`${item.title}-${item.institution}`} className="space-y-1">
								<p className="font-medium">{item.title}</p>
								<p className="text-sm text-muted-foreground">
									{item.institution} · {item.period}
								</p>
								{item.location ? <p className="text-xs text-muted-foreground">{item.location}</p> : null}
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Work Experience</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{experience.map((item) => (
							<div key={`${item.role}-${item.company}`} className="space-y-1">
								<p className="font-medium">{item.role}</p>
								<p className="text-sm text-muted-foreground">
									{item.company} · {item.period}
								</p>
								<p className="text-xs leading-6 text-muted-foreground">{item.summary}</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-2">
				{aboutSummary.interests.map((interest) => (
					<Badge key={interest} variant="secondary" className="rounded-full">
						{interest}
					</Badge>
				))}
			</div>
		</section>
	);
}