import { Cpu, Building2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";



export async function About() {
	let profile: any = null;
	const counts = { lab: 0, client: 0, academy: 0 };
	let education: any[] = [];
	let experience: any[] = [];

	try {
		const results = await Promise.all([

			prisma.brandProfile.findFirst({
				select: {
					aboutSummary: {
						select: {
							biography: true,
							biographyFr: true,
							cvDownloadUrl: true,
							linkedinResumeSource: true,
							interests: true,
							interestsFr: true,
						},
					},
				},
			}),
			prisma.education.findMany({ orderBy: { displayOrder: "asc" } }),
			prisma.experience.findMany({ orderBy: { displayOrder: "asc" } }),
			prisma.labProject.count(),
			prisma.clientWork.count(),
			prisma.academyResource.count(),
		]);
		profile = results[0];
		education = results[1];
		experience = results[2];
		counts.lab = results[3] as number;
		counts.client = results[4] as number;
		counts.academy = results[5] as number;
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("About section query failed, rendering fallback content:", error);
		}
	}

	const aboutSummary = {
		biography: profile?.aboutSummary?.biography ?? "",
		biographyFr: profile?.aboutSummary?.biographyFr ?? "",
		cvDownloadUrl: profile?.aboutSummary?.cvDownloadUrl ?? "",
		linkedinResumeSource: profile?.aboutSummary?.linkedinResumeSource ?? "",
		interests: (profile?.aboutSummary?.interests && profile.aboutSummary.interests.length > 0) ? profile.aboutSummary.interests : [],
		interestsFr: (profile?.aboutSummary?.interestsFr && profile.aboutSummary.interestsFr.length > 0) ? profile.aboutSummary.interestsFr : [],
	};

    const educationData = education;
    const experienceData = experience;

	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">
                        <Tx en="About" fr="À propos" />
                    </h2>
					<p className="mt-1 text-sm text-muted-foreground">
                        <Tx
                            en="Professional summary, education, and experience."
                            fr="Résumé professionnel, éducation et expérience."
                        />
                    </p>
				</div>
				<Button asChild variant="outline">
					<a href={aboutSummary.cvDownloadUrl} download>
						<Tx en="Download CV" fr="Télécharger le CV" />
					</a>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle><Tx en="Biography" fr="Biographie" /></CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm leading-7 text-muted-foreground">
					<p><Tx en={aboutSummary.biography} fr={aboutSummary.biographyFr} /></p>
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle><Tx en="Education and Certification" fr="Éducation et Certification" /></CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{educationData.map((item) => (
							<div key={`${item.title}-${item.institution}`} className="space-y-1">
								<p className="font-medium">
                                    <Tx en={item.title} fr={item.titleFr || item.title} />
                                </p>
								<p className="text-sm text-muted-foreground">
									<Tx en={item.institution} fr={item.institutionFr || item.institution} /> · {item.period}
								</p>
								{(item.location || item.locationFr) ? (
                                    <p className="text-xs text-muted-foreground">
                                        <Tx en={item.location} fr={item.locationFr || item.location} />
                                    </p>
                                ) : null}
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle><Tx en="Work Experience" fr="Expérience Professionnelle" /></CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{experienceData.map((item) => (
							<div key={`${item.role}-${item.company}`} className="space-y-1">
								<p className="font-medium">
                                    <Tx en={item.role} fr={item.roleFr || item.role} />
                                </p>
								<p className="text-sm text-muted-foreground">
									<Tx en={item.company} fr={item.companyFr || item.company} /> · {item.period}
								</p>
								<p className="text-xs leading-6 text-muted-foreground">
                                    <Tx en={item.summary} fr={item.summaryFr || item.summary} />
                                </p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-2">
				<Tx
                    en={
                        aboutSummary.interests.map((interest: string) => (
                            <Badge key={interest} variant="secondary" className="rounded-full">
                                {interest}
                            </Badge>
                        ))
                    }
                    fr={
                        aboutSummary.interestsFr.length > 0
                        ? aboutSummary.interestsFr.map((interest: string) => (
                            <Badge key={interest} variant="secondary" className="rounded-full">
                                {interest}
                            </Badge>
                        ))
                        : aboutSummary.interests.map((interest: string) => (
                            <Badge key={interest} variant="secondary" className="rounded-full">
                                {interest}
                            </Badge>
                        ))
                    }
                />
			</div>
		<div className="flex flex-wrap justify-center gap-3 pt-6 border-t border-border/40 mt-6">
			<Badge
				variant="outline"
				className="flex items-center gap-2 text-xs font-semibold py-2 px-4 rounded-xl border-primary/20 bg-primary/5 text-primary transition-all duration-300 hover:scale-[1.02] hover:bg-primary/10"
			>
				<Cpu className="size-3.5" />
				<span>{counts.lab}</span>
				<span className="text-muted-foreground font-normal">
					<Tx en="Lab Cases" fr="Cas Labo" />
				</span>
			</Badge>
			<Badge
				variant="outline"
				className="flex items-center gap-2 text-xs font-semibold py-2 px-4 rounded-xl border-violet-500/20 bg-violet-500/5 text-violet-400 transition-all duration-300 hover:scale-[1.02] hover:bg-violet-500/10"
			>
				<Building2 className="size-3.5" />
				<span>{counts.client}</span>
				<span className="text-muted-foreground font-normal">
					<Tx en="Client Works" fr="Travaux Clients" />
				</span>
			</Badge>
			<Badge
				variant="outline"
				className="flex items-center gap-2 text-xs font-semibold py-2 px-4 rounded-xl border-cyan-500/20 bg-cyan-500/5 text-cyan-400 transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-500/10"
			>
				<GraduationCap className="size-3.5" />
				<span>{counts.academy}</span>
				<span className="text-muted-foreground font-normal">
					<Tx en="Educational Content" fr="Contenu Éducatif" />
				</span>
			</Badge>
		</div>
		</section>
	);
}
