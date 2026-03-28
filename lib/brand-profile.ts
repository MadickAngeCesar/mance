import { prisma } from "@/lib/prisma";
import { aboutSummary, brandProfile, contactDetails } from "@/lib/placeholder-data";

export async function ensureBrandProfile() {
  const existing = await prisma.brandProfile.findFirst();
  if (existing) {
    return existing;
  }

  return prisma.brandProfile.create({
    data: {
      currentName: brandProfile.currentName,
      previousName: brandProfile.previousName,
      currentDomain: brandProfile.currentDomain,
      previousDomain: brandProfile.previousDomain,
      ownerName: brandProfile.ownerName,
      roleTagline: brandProfile.roleTagline,
      headline: brandProfile.headline,
      subTagline: brandProfile.subTagline,
      freelanceAvailabilityLabel: brandProfile.freelanceAvailabilityLabel,
      jobAvailabilityLabel: brandProfile.jobAvailabilityLabel,
    },
  });
}

export async function ensureBrandProfileRelations(brandProfileId: string) {
  await prisma.aboutSummary.upsert({
    where: { brandProfileId },
    update: {},
    create: {
      brandProfileId,
      biography: aboutSummary.biography,
      cvDownloadUrl: aboutSummary.cvDownloadUrl,
      linkedinResumeSource: aboutSummary.linkedinResumeSource,
      interests: aboutSummary.interests,
    },
  });

  await prisma.contactDetails.upsert({
    where: { brandProfileId },
    update: {},
    create: {
      brandProfileId,
      email: contactDetails.email,
      phone: contactDetails.phone,
      location: contactDetails.location,
    },
  });
}
