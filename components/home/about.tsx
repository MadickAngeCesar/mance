import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDatabaseUnavailableError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { Tx } from "@/components/i18n/tx";

export async function About() {
	let profile: {
		aboutSummary: {
			biography: string;
			biographyFr: string | null;
			cvDownloadUrl: string;
			linkedinResumeSource: string;
			interests: string[];
			interestsFr: string[];
		} | null;
	} | null = null;
	let education: Array<{
        title: string;
        titleFr: string | null;
        institution: string;
        institutionFr: string | null;
        period: string;
        location: string | null;
        locationFr: string | null;
    }> = [];
	let experience: Array<{
        role: string;
        roleFr: string | null;
        company: string;
        companyFr: string | null;
        period: string;
        summary: string;
        summaryFr: string | null;
    }> = [];

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
		biography: profile?.aboutSummary?.biography ?? "Biography is not available yet.",
		biographyFr: profile?.aboutSummary?.biographyFr ?? "La biographie n'est pas encore disponible.",
		cvDownloadUrl: profile?.aboutSummary?.cvDownloadUrl ?? "/MadickAngeCesar_FullStack_Resume_EN.pdf",
		linkedinResumeSource: profile?.aboutSummary?.linkedinResumeSource ?? "",
		interests: profile?.aboutSummary?.interests ?? [],
		interestsFr: profile?.aboutSummary?.interestsFr ?? [],
	};

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
						{education.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                <Tx en="No education entries yet." fr="Aucune entrée d'éducation pour l'instant." />
                            </p>
                        ) : null}
						{education.map((item) => (
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
						{experience.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                <Tx en="No work experience entries yet." fr="Aucune expérience professionnelle pour l'instant." />
                            </p>
                        ) : null}
						{experience.map((item) => (
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
                        aboutSummary.interests.map((interest) => (
                            <Badge key={interest} variant="secondary" className="rounded-full">
                                {interest}
                            </Badge>
                        ))
                    }
                    fr={
                        aboutSummary.interestsFr.length > 0
                        ? aboutSummary.interestsFr.map((interest) => (
                            <Badge key={interest} variant="secondary" className="rounded-full">
                                {interest}
                            </Badge>
                        ))
                        : aboutSummary.interests.map((interest) => (
                            <Badge key={interest} variant="secondary" className="rounded-full">
                                {interest}
                            </Badge>
                        ))
                    }
                />
				{(aboutSummary.interests.length === 0 && aboutSummary.interestsFr.length === 0) ? (
                    <p className="text-sm text-muted-foreground">
                        <Tx en="No interests configured yet." fr="Aucun intérêt configuré pour l'instant." />
                    </p>
                ) : null}
			</div>
		</section>
	);
}
