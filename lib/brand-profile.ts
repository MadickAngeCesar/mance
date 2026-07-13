import { prisma } from "@/lib/prisma";

const defaultBrandProfile = {
	currentName: "MAC TECH",
	previousName: "Mac.dev",
	currentDomain: "mance.dev",
	previousDomain: "mac.dev",
	ownerName: "Madick Ange Cesar",
	roleTagline: "Full-Stack JavaScript Developer · IT Specialist",
	roleTaglineFr: "Développeur JavaScript Full-Stack · Spécialiste IT",
	headline: "Building digital solutions for businesses, teams, and founders.",
	headlineFr: "Construire des solutions numériques pour les entreprises, les équipes et les fondateurs.",
	subTagline:
		"I design and ship practical web platforms with strong engineering, dependable IT operations, and clear communication from kickoff to launch.",
	subTaglineFr: "Je concevais et livrais des plateformes web pratiques avec une ingénierie solide, des opérations IT fiables et une communication claire du coup d'envoi au lancement.",
	freelanceAvailabilityLabel: "Freelance projects",
	freelanceAvailabilityLabelFr: "Projets freelance",
	jobAvailabilityLabel: "Long-term work",
	jobAvailabilityLabelFr: "Travail à long terme",
};

const defaultAboutSummary = {
	biography:
		"I am a Full-Stack JavaScript Developer and IT Specialist focused on building practical digital solutions: business websites, web applications, technical support systems, and automation workflows. I combine modern software engineering with real-world IT operations to help organizations scale with confidence.",
	biographyFr: "Je suis un développeur JavaScript Full-Stack et un spécialiste IT concentré sur la construction de solutions numériques pratiques : sites web d'entreprise, applications web, systèmes de support technique et workflows d'automatisation. Je combine l'ingénierie logicielle moderne avec des opérations IT réelles pour aider les organisations à évoluer en toute confiance.",
	cvDownloadUrl: "/MadickAngeCesar_FullStack_Resume_EN.pdf",
	linkedinResumeSource: "Profile.pdf metadata: Resume generated from profile (LinkedIn)",
	interests: [
		"Product Engineering",
		"Cloud Infrastructure",
		"Developer Experience",
		"Cybersecurity Basics",
		"Technical Writing",
	],
};

const defaultContactDetails = {
	email: "hello@mance.dev",
	phone: "+509 0000 0000",
	location: "Port-au-Prince, Haiti",
};

export async function ensureBrandProfile() {
  const existing = await prisma.brandProfile.findFirst();
  if (existing) {
    return existing;
  }

  return prisma.brandProfile.create({
    data: {
      currentName: defaultBrandProfile.currentName,
      previousName: defaultBrandProfile.previousName,
      currentDomain: defaultBrandProfile.currentDomain,
      previousDomain: defaultBrandProfile.previousDomain,
      ownerName: defaultBrandProfile.ownerName,
      roleTagline: defaultBrandProfile.roleTagline,
      roleTaglineFr: defaultBrandProfile.roleTaglineFr,
      headline: defaultBrandProfile.headline,
      headlineFr: defaultBrandProfile.headlineFr,
      subTagline: defaultBrandProfile.subTagline,
      subTaglineFr: defaultBrandProfile.subTaglineFr,
      freelanceAvailabilityLabel: defaultBrandProfile.freelanceAvailabilityLabel,
      freelanceAvailabilityLabelFr: defaultBrandProfile.freelanceAvailabilityLabelFr,
      jobAvailabilityLabel: defaultBrandProfile.jobAvailabilityLabel,
      jobAvailabilityLabelFr: defaultBrandProfile.jobAvailabilityLabelFr,
    },
  });
}

export async function ensureBrandProfileRelations(brandProfileId: string) {
  await prisma.aboutSummary.upsert({
    where: { brandProfileId },
    update: {},
    create: {
      brandProfileId,
      biography: defaultAboutSummary.biography,
      biographyFr: defaultAboutSummary.biographyFr,
      cvDownloadUrl: defaultAboutSummary.cvDownloadUrl,
      linkedinResumeSource: defaultAboutSummary.linkedinResumeSource,
      interests: defaultAboutSummary.interests,
    },
  });

  await prisma.contactDetails.upsert({
    where: { brandProfileId },
    update: {},
    create: {
      brandProfileId,
      email: defaultContactDetails.email,
      phone: defaultContactDetails.phone,
      location: defaultContactDetails.location,
    },
  });
}

