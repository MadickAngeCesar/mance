import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export async function About() {
	let profile: {
		aboutSummary: {
			biography: string;
			cvDownloadUrl: string;
			linkedinResumeSource: string;
			interests: string[];
		} | null;
	} | null = null;
	let education: Array<{ title: string; institution: string; period: string; location: string | null }> = [];
	let experience: Array<{ role: string; company: string; period: string; summary: string }> = [];

	try {
		[profile, education, experience] = await Promise.all([
			prisma.brandProfile.findFirst({
				select: {
					aboutSummary: {
						select: {
							biography: true,
							cvDownloadUrl: true,
							linkedinResumeSource: true,
							interests: true,
						},
					},
				},
			}),
			prisma.education.findMany({ orderBy: { displayOrder: "asc" } }),
			prisma.experience.findMany({ orderBy: { displayOrder: "asc" } }),
		]);
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("About section query failed, rendering fallback content:", error);
		}
	}

	const aboutSummary = {
		biography: profile?.aboutSummary?.biography ?? "Biography is not available yet.",
		cvDownloadUrl: profile?.aboutSummary?.cvDownloadUrl ?? "/MadickAngeCesar_FullStack_Resume_EN.pdf",
		linkedinResumeSource: profile?.aboutSummary?.linkedinResumeSource ?? "",
		interests: profile?.aboutSummary?.interests ?? [],
	};

	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">About</h2>
					<p className="mt-1 text-sm text-muted-foreground">Professional summary, education, and experience.</p>
				</div>
				<Button asChild variant="outline">
					<a href={aboutSummary.cvDownloadUrl} download>
						Download CV
					</a>
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
						{education.length === 0 ? <p className="text-sm text-muted-foreground">No education entries yet.</p> : null}
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
						{experience.length === 0 ? <p className="text-sm text-muted-foreground">No work experience entries yet.</p> : null}
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
				{aboutSummary.interests.length === 0 ? <p className="text-sm text-muted-foreground">No interests configured yet.</p> : null}
			</div>
		</section>
	);
}