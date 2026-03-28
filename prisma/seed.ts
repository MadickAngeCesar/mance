import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  SkillCategory,
  SocialPlatform,
  FreelancePlatformName,
  WorkKind,
  CampaignStatus,
  DeliveryStatus,
} from "../lib/generated/prisma/client";
import {
  aboutSummary,
  bookingCta,
  brandProfile,
  clientWork,
  contactDetails,
  education,
  experience,
  labArticles,
  labProjects,
  mainWorkHighlights,
  messagePreviews,
  offerings,
  skills,
  subscriberPreviews,
  testimonials,
  workflowStages,
} from "../lib/placeholder-data";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function mapSkillCategory(value: string): SkillCategory {
  switch (value) {
    case "Frontend":
      return SkillCategory.FRONTEND;
    case "Backend":
      return SkillCategory.BACKEND;
    case "DevOps":
      return SkillCategory.DEVOPS;
    case "IT Support":
      return SkillCategory.IT_SUPPORT;
    case "Tools":
      return SkillCategory.TOOLS;
    case "Languages":
      return SkillCategory.LANGUAGES;
    default:
      return SkillCategory.TOOLS;
  }
}

function mapWorkKind(value: string): WorkKind {
  switch (value) {
    case "project":
      return WorkKind.PROJECT;
    case "client-work":
      return WorkKind.CLIENT_WORK;
    case "article":
      return WorkKind.ARTICLE;
    default:
      return WorkKind.ARTICLE;
  }
}

function mapSocialPlatform(value: string): SocialPlatform {
  switch (value) {
    case "GitHub":
      return SocialPlatform.GITHUB;
    case "LinkedIn":
      return SocialPlatform.LINKEDIN;
    case "WhatsApp":
      return SocialPlatform.WHATSAPP;
    case "Facebook":
      return SocialPlatform.FACEBOOK;
    default:
      return SocialPlatform.GITHUB;
  }
}

function mapFreelancePlatform(value: string): FreelancePlatformName {
  switch (value) {
    case "Upwork":
      return FreelancePlatformName.UPWORK;
    case "Freelancer":
      return FreelancePlatformName.FREELANCER;
    case "Fiverr":
      return FreelancePlatformName.FIVERR;
    default:
      return FreelancePlatformName.UPWORK;
  }
}

async function main() {
  await prisma.$transaction([
    prisma.subscriberCampaignDelivery.deleteMany(),
    prisma.subscriberCampaign.deleteMany(),
    prisma.authEvent.deleteMany(),
    prisma.authUser.deleteMany(),
    prisma.message.deleteMany(),
    prisma.subscriber.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.clientWork.deleteMany(),
    prisma.labArticle.deleteMany(),
    prisma.labProject.deleteMany(),
    prisma.bookingCta.deleteMany(),
    prisma.workflowStage.deleteMany(),
    prisma.offering.deleteMany(),
    prisma.mainWorkHighlight.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.experience.deleteMany(),
    prisma.education.deleteMany(),
    prisma.socialLink.deleteMany(),
    prisma.freelancePlatform.deleteMany(),
    prisma.contactDetails.deleteMany(),
    prisma.aboutSummary.deleteMany(),
    prisma.brandProfile.deleteMany(),
  ]);

  const createdBrand = await prisma.brandProfile.create({
    data: {
      ...brandProfile,
    },
  });

  await prisma.aboutSummary.create({
    data: {
      ...aboutSummary,
      brandProfileId: createdBrand.id,
    },
  });

  const createdContact = await prisma.contactDetails.create({
    data: {
      email: contactDetails.email,
      phone: contactDetails.phone,
      location: contactDetails.location,
      brandProfileId: createdBrand.id,
    },
  });

  await prisma.socialLink.createMany({
    data: contactDetails.socialLinks.map((item, index) => ({
      platform: mapSocialPlatform(item.platform),
      label: item.label,
      url: item.url,
      displayOrder: index + 1,
      contactDetailsId: createdContact.id,
    })),
  });

  await prisma.freelancePlatform.createMany({
    data: contactDetails.freelancePlatforms.map((item, index) => ({
      name: mapFreelancePlatform(item.name),
      url: item.url,
      handle: item.handle,
      displayOrder: index + 1,
      contactDetailsId: createdContact.id,
    })),
  });

  await prisma.education.createMany({
    data: education.map((item, index) => ({
      title: item.title,
      institution: item.institution,
      period: item.period,
      location: item.location,
      displayOrder: index + 1,
    })),
  });

  await prisma.experience.createMany({
    data: experience.map((item, index) => ({
      role: item.role,
      company: item.company,
      period: item.period,
      summary: item.summary,
      displayOrder: index + 1,
    })),
  });

  await prisma.skill.createMany({
    data: skills.map((item) => ({
      name: item.name,
      category: mapSkillCategory(item.category),
      proficiency: item.proficiency,
      iconSlug: item.iconSlug,
      displayOrder: item.order,
    })),
  });

  await prisma.mainWorkHighlight.createMany({
    data: mainWorkHighlights.map((item) => ({
      externalId: item.id,
      title: item.title,
      kind: mapWorkKind(item.kind),
      summary: item.summary,
      href: item.href,
      featured: item.featured,
      imageUrl: item.imageUrl,
      brandProfileId: createdBrand.id,
    })),
  });

  await prisma.offering.createMany({
    data: offerings.map((item) => ({
      externalId: item.id,
      title: item.title,
      description: item.description,
      features: item.features,
      ctaText: item.ctaText,
      ctaUrl: item.ctaUrl,
      brandProfileId: createdBrand.id,
    })),
  });

  await prisma.workflowStage.createMany({
    data: workflowStages.map((item) => ({
      step: item.step,
      title: item.title,
      subtitle: item.subtitle,
      details: item.details,
      brandProfileId: createdBrand.id,
    })),
  });

  await prisma.bookingCta.create({
    data: bookingCta,
  });

  const createdClientWorks = await Promise.all(
    clientWork.map((item) =>
      prisma.clientWork.create({
        data: {
          externalId: item.id,
          slug: item.slug,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          projectUrl: item.projectUrl,
          stack: item.stack,
          content: item.content,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
      })
    )
  );

  await prisma.labProject.createMany({
    data: labProjects.map((item) => ({
      externalId: item.id,
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      content: item.content,
      stack: item.stack,
      coverImageUrl: item.coverImageUrl,
      screenshotUrls: item.screenshotUrls,
      demoUrl: item.demoUrl,
      repoUrl: item.repoUrl,
      featured: item.featured,
      views: item.views,
      tags: item.tags,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
    })),
  });

  await prisma.labArticle.createMany({
    data: labArticles.map((item) => ({
      externalId: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      excerpt: item.excerpt,
      content: item.content,
      coverImageUrl: item.coverImageUrl,
      tags: item.tags,
      views: item.views,
      featured: Boolean(item.featured),
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
    })),
  });

  await prisma.testimonial.createMany({
    data: testimonials.map((item, index) => ({
      externalId: item.id,
      clientName: item.clientName,
      clientRoleCompany: item.clientRoleCompany,
      text: item.text,
      avatarUrl: item.avatarUrl,
      rating: item.rating,
      projectReference: item.projectReference,
      dateLabel: item.date,
      clientWorkId: createdClientWorks[index % createdClientWorks.length]?.id,
    })),
  });

  await prisma.message.createMany({
    data: messagePreviews.map((item) => ({
      externalId: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      receivedAt: new Date(item.receivedAt),
      isRead: item.isRead,
      source: "seed",
    })),
  });

  const subscribers = await Promise.all(
    subscriberPreviews.map((item) =>
      prisma.subscriber.create({
        data: {
          externalId: item.id,
          email: item.email,
          source: item.source,
          subscribedAt: new Date(item.subscribedAt),
        },
      })
    )
  );

  const firstArticle = await prisma.labArticle.findFirst({ orderBy: { publishedAt: "desc" } });

  if (firstArticle) {
    const campaign = await prisma.subscriberCampaign.create({
      data: {
        title: `New article: ${firstArticle.title}`,
        slug: firstArticle.slug,
        contentType: WorkKind.ARTICLE,
        contentId: firstArticle.id,
        status: CampaignStatus.COMPLETED,
        sentAt: new Date(),
      },
    });

    await prisma.subscriberCampaignDelivery.createMany({
      data: subscribers.map((subscriber) => ({
        campaignId: campaign.id,
        subscriberId: subscriber.id,
        status: DeliveryStatus.SENT,
        provider: "gmail-smtp",
        providerMsgId: `seed-${campaign.slug}-${subscriber.externalId}`,
        sentAt: new Date(),
      })),
    });
  }

  await prisma.authUser.create({
    data: {
      email: "admin@mance.dev",
      displayName: "MAC TECH Admin",
      role: "admin",
      isActive: true,
    },
  });

  console.log("Prisma seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
