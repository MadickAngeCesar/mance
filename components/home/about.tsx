import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";
import { aboutSummary as fallbackAbout, education as fallbackEducation, experience as fallbackExperience } from "@/lib/placeholder-data";

export async function About() {
	let profile: any = null;
	let education: any[] = [];
	let experience: any[] = [];

	try {
		[profile, education, experience] = await Promise.all([
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
		]);
	} catch (error) {
		if (!isDatabaseUnavailableError(error)) {
			console.error("About section query failed, rendering fallback content:", error);
		}
	}

	const aboutSummary = {
		biography: profile?.aboutSummary?.biography ?? fallbackAbout.biography,
		biographyFr: profile?.aboutSummary?.biographyFr ?? fallbackAbout.biographyFr,
		cvDownloadUrl: profile?.aboutSummary?.cvDownloadUrl ?? fallbackAbout.cvDownloadUrl,
		linkedinResumeSource: profile?.aboutSummary?.linkedinResumeSource ?? fallbackAbout.linkedinResumeSource,
		interests: (profile?.aboutSummary?.interests && profile.aboutSummary.interests.length > 0) ? profile.aboutSummary.interests : fallbackAbout.interests,
		interestsFr: (profile?.aboutSummary?.interestsFr && profile.aboutSummary.interestsFr.length > 0) ? profile.aboutSummary.interestsFr : fallbackAbout.interestsFr,
	};

    const educationData = education.length > 0 ? education : fallbackEducation;
    const experienceData = experience.length > 0 ? experience : fallbackExperience;

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
		</section>
	);
}
