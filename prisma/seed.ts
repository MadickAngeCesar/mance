import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  SkillCategory,
  SocialPlatform,
  FreelancePlatformName,
  WorkKind,
  CampaignStatus,
  DeliveryStatus,
  AcademyResourceType,
} from "../lib/generated/prisma/client";
import { prisma } from "../lib/prisma";
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
  academyResources,
  teamMembers,
  targetSectors,
} from "./seed-data";

// Parse CLI arguments to support partial seeding
const args = process.argv.slice(2);
const onlyCore = args.includes("--only") && args.includes("core");
const reset = args.includes("--reset");

interface SeedOptions {
  onlyCore?: boolean;
  reset?: boolean;
}

const ADMIN_EMAIL = "admin@mance.dev";
const ADMIN_DISPLAY_NAME = "MAC TECH Admin";
const ADMIN_DEFAULT_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "MacTech@2026";
const ADMIN_BCRYPT_ROUNDS = 10;

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

/**
 * Seed core profile data (idempotent).
 * Creates or updates the main brand profile with contact details, skills, and workflow.
 */
async function seedCore(options: SeedOptions) {
  console.log("🌱 Seeding core profile data...");
  console.log("DEBUG: DATABASE_URL =", process.env.DATABASE_URL);
  console.log("DEBUG: DIRECT_DATABASE_URL =", process.env.DIRECT_DATABASE_URL);
  console.log("DEBUG: prisma client is initialized");

  // If reset is true, clear all data
  if (options.reset) {
    console.log("🔄 Resetting all data...");
    await prisma.subscriberCampaignDelivery.deleteMany();
    await prisma.subscriberCampaign.deleteMany();
    await prisma.authEvent.deleteMany();
    await prisma.authUser.deleteMany();
    await prisma.message.deleteMany();
    await prisma.subscriber.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.clientWork.deleteMany();
    await prisma.labArticle.deleteMany();
    await prisma.labProject.deleteMany();
    await prisma.bookingCta.deleteMany();
    await prisma.workflowStage.deleteMany();
    await prisma.offering.deleteMany();
    await prisma.mainWorkHighlight.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.socialLink.deleteMany();
    await prisma.freelancePlatform.deleteMany();
    await prisma.contactDetails.deleteMany();
    await prisma.aboutSummary.deleteMany();
    await prisma.brandProfile.deleteMany();
    await prisma.academyResource.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.targetSector.deleteMany();
  }

  // Check if profile already exists or needs creation/update
  let brandProfileId: string;
  const existingBrand = await prisma.brandProfile.findFirst();

  if (existingBrand) {
    brandProfileId = existingBrand.id;
    await prisma.brandProfile.update({
      where: { id: brandProfileId },
      data: {
        ...brandProfile,
      },
    });
    console.log("✓ Brand profile updated");
  } else {
    const createdBrand = await prisma.brandProfile.create({
      data: {
        ...brandProfile,
      },
    });
    brandProfileId = createdBrand.id;
    console.log("✓ Brand profile created");
  }

  // Create or update about summary
  await prisma.aboutSummary.upsert({
    where: { brandProfileId },
    update: {
      ...aboutSummary,
    },
    create: {
      ...aboutSummary,
      brandProfileId,
    },
  });
  console.log("✓ About summary created/updated");

  // Create or update contact details
  const createdContact = await prisma.contactDetails.upsert({
    where: { brandProfileId },
    update: {
      email: contactDetails.email,
      phone: contactDetails.phone,
      location: contactDetails.location,
      locationFr: contactDetails.locationFr,
    },
    create: {
      email: contactDetails.email,
      phone: contactDetails.phone,
      location: contactDetails.location,
      locationFr: contactDetails.locationFr,
      brandProfileId,
    },
  });

  // Recreate social links
  await prisma.socialLink.deleteMany({ where: { contactDetailsId: createdContact.id } });
  await prisma.socialLink.createMany({
    data: contactDetails.socialLinks.map((item, index) => ({
      platform: mapSocialPlatform(item.platform),
      label: item.label,
      url: item.url,
      displayOrder: index + 1,
      contactDetailsId: createdContact.id,
    })),
  });
  console.log("✓ Social links created");

  // Recreate freelance platforms
  await prisma.freelancePlatform.deleteMany({ where: { contactDetailsId: createdContact.id } });
  await prisma.freelancePlatform.createMany({
    data: contactDetails.freelancePlatforms.map((item, index) => ({
      name: mapFreelancePlatform(item.name),
      url: item.url,
      handle: item.handle,
      displayOrder: index + 1,
      contactDetailsId: createdContact.id,
    })),
  });
  console.log("✓ Freelance platforms created");

  // Recreate education records
  await prisma.education.deleteMany();
  await prisma.education.createMany({
    data: education.map((item, index) => ({
      title: item.title,
      titleFr: item.titleFr,
      institution: item.institution,
      institutionFr: item.institutionFr,
      period: item.period,
      location: item.location,
      locationFr: item.locationFr,
      displayOrder: index + 1,
    })),
  });
  console.log("✓ Education records created");

  // Recreate experience records
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: experience.map((item, index) => ({
      role: item.role,
      roleFr: item.roleFr,
      company: item.company,
      companyFr: item.companyFr,
      period: item.period,
      summary: item.summary,
      summaryFr: item.summaryFr,
      displayOrder: index + 1,
    })),
  });
  console.log("✓ Experience records created");

  // Recreate skills
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: skills.map((item) => ({
      name: item.name,
      nameFr: item.nameFr,
      category: mapSkillCategory(item.category),
      proficiency: item.proficiency,
      iconSlug: item.iconSlug,
      displayOrder: item.order,
    })),
  });
  console.log("✓ Skills created");

  // Upsert main work highlights
  for (const item of mainWorkHighlights) {
    await prisma.mainWorkHighlight.upsert({
      where: { externalId: item.id },
      update: {
        title: item.title,
        titleFr: item.titleFr,
        kind: mapWorkKind(item.kind),
        summary: item.summary,
        summaryFr: item.summaryFr,
        href: item.href,
        featured: item.featured,
        imageUrl: item.imageUrl,
        brandProfileId,
      },
      create: {
        externalId: item.id,
        title: item.title,
        titleFr: item.titleFr,
        kind: mapWorkKind(item.kind),
        summary: item.summary,
        summaryFr: item.summaryFr,
        href: item.href,
        featured: item.featured,
        imageUrl: item.imageUrl,
        brandProfileId,
      },
    });
  }
  console.log("✓ Main work highlights created");

  // Upsert offerings
  for (const item of offerings) {
    await prisma.offering.upsert({
      where: { externalId: item.id },
      update: {
        title: item.title,
        titleFr: item.titleFr,
        description: item.description,
        descriptionFr: item.descriptionFr,
        features: item.features,
        featuresFr: item.featuresFr,
        ctaText: item.ctaText,
        ctaTextFr: item.ctaTextFr,
        ctaUrl: item.ctaUrl,
        brandProfileId,
      },
      create: {
        externalId: item.id,
        title: item.title,
        titleFr: item.titleFr,
        description: item.description,
        descriptionFr: item.descriptionFr,
        features: item.features,
        featuresFr: item.featuresFr,
        ctaText: item.ctaText,
        ctaTextFr: item.ctaTextFr,
        ctaUrl: item.ctaUrl,
        brandProfileId,
      },
    });
  }
  console.log("✓ Offerings created");

  // Upsert target sectors
  for (const item of targetSectors) {
    await prisma.targetSector.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        titleFr: item.titleFr,
        description: item.description,
        descriptionFr: item.descriptionFr,
        iconSlug: item.iconSlug,
        challenges: item.challenges,
        challengesFr: item.challengesFr || [],
        solutions: item.solutions,
        solutionsFr: item.solutionsFr || [],
        benefits: item.benefits,
        benefitsFr: item.benefitsFr || [],
        displayOrder: item.displayOrder,
        brandProfileId,
      },
      create: {
        slug: item.slug,
        title: item.title,
        titleFr: item.titleFr,
        description: item.description,
        descriptionFr: item.descriptionFr,
        iconSlug: item.iconSlug,
        challenges: item.challenges,
        challengesFr: item.challengesFr || [],
        solutions: item.solutions,
        solutionsFr: item.solutionsFr || [],
        benefits: item.benefits,
        benefitsFr: item.benefitsFr || [],
        displayOrder: item.displayOrder,
        brandProfileId,
      },
    });
  }
  console.log("✓ Target sectors created");

  // Upsert workflow stages
  for (const item of workflowStages) {
    await prisma.workflowStage.upsert({
      where: { step: item.step },
      update: {
        title: item.title,
        titleFr: item.titleFr,
        subtitle: item.subtitle,
        subtitleFr: item.subtitleFr,
        details: item.details,
        detailsFr: item.detailsFr,
        brandProfileId,
      },
      create: {
        step: item.step,
        title: item.title,
        titleFr: item.titleFr,
        subtitle: item.subtitle,
        subtitleFr: item.subtitleFr,
        details: item.details,
        detailsFr: item.detailsFr,
        brandProfileId,
      },
    });
  }
  console.log("✓ Workflow stages created");

  // Create or upsert booking CTA
  await prisma.bookingCta.deleteMany();
  await prisma.bookingCta.create({
    data: bookingCta,
  });
  console.log("✓ Booking CTA created");

  // Always upsert admin credentials so sign-in works after any reseed.
  const passwordHash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, ADMIN_BCRYPT_ROUNDS);
  await prisma.authUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      displayName: ADMIN_DISPLAY_NAME,
      role: "admin",
      isActive: true,
      passwordHash,
    },
    create: {
      email: ADMIN_EMAIL,
      displayName: ADMIN_DISPLAY_NAME,
      role: "admin",
      isActive: true,
      passwordHash,
    },
  });
  console.log(`✓ Auth user upserted (${ADMIN_EMAIL}) with seeded password`);

  return brandProfileId;
}

/**
 * Seed portfolio content (client work, lab projects, lab articles, testimonials).
 */
async function seedPortfolioContent(options: SeedOptions) {
  console.log("📚 Seeding portfolio content...");

  // Check if content already exists
  const existingClientWorks = await prisma.clientWork.count();
  if (existingClientWorks > 0 && !options.reset) {
    console.log("✓ Portfolio content already exists, skipping.");
    return;
  }

  // Create client works
  const createdClientWorks = await Promise.all(
    clientWork.map((item) =>
      prisma.clientWork.upsert({
        where: { externalId: item.id },
        update: {
          slug: item.slug,
          title: item.title,
          titleFr: item.titleFr,
          description: item.description,
          descriptionFr: item.descriptionFr,
          imageUrl: item.imageUrl,
          projectUrl: item.projectUrl,
          clientName: item.clientName,
          clientNameFr: item.clientNameFr,
          stack: item.stack,
          content: item.content,
          contentFr: item.contentFr,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
        create: {
          externalId: item.id,
          slug: item.slug,
          title: item.title,
          titleFr: item.titleFr,
          description: item.description,
          descriptionFr: item.descriptionFr,
          imageUrl: item.imageUrl,
          projectUrl: item.projectUrl,
          clientName: item.clientName,
          clientNameFr: item.clientNameFr,
          stack: item.stack,
          content: item.content,
          contentFr: item.contentFr,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
      })
    )
  );
  console.log("✓ Client works created/updated");

  // Create lab projects
  await Promise.all(
    labProjects.map((item) =>
      prisma.labProject.upsert({
        where: { externalId: item.id },
        update: {
          title: item.title,
          titleFr: item.titleFr,
          slug: item.slug,
          summary: item.summary,
          summaryFr: item.summaryFr,
          content: item.content,
          contentFr: item.contentFr,
          stack: item.stack,
          coverImageUrl: item.coverImageUrl,
          screenshotUrls: item.screenshotUrls,
          demoUrl: item.demoUrl,
          repoUrl: item.repoUrl,
          featured: item.featured,
          views: item.views,
          likes: item.likes,
          problem: item.problem,
          problemFr: item.problemFr,
          solution: item.solution,
          solutionFr: item.solutionFr,
          tags: item.tags,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
        create: {
          externalId: item.id,
          title: item.title,
          titleFr: item.titleFr,
          slug: item.slug,
          summary: item.summary,
          summaryFr: item.summaryFr,
          content: item.content,
          contentFr: item.contentFr,
          stack: item.stack,
          coverImageUrl: item.coverImageUrl,
          screenshotUrls: item.screenshotUrls,
          demoUrl: item.demoUrl,
          repoUrl: item.repoUrl,
          featured: item.featured,
          views: item.views,
          likes: item.likes,
          problem: item.problem,
          problemFr: item.problemFr,
          solution: item.solution,
          solutionFr: item.solutionFr,
          tags: item.tags,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
      })
    )
  );
  console.log("✓ Lab projects created/updated");

  // Create lab articles
  await Promise.all(
    labArticles.map((item) =>
      prisma.labArticle.upsert({
        where: { externalId: item.id },
        update: {
          title: item.title,
          titleFr: item.titleFr,
          slug: item.slug,
          category: item.category,
          categoryFr: item.categoryFr,
          excerpt: item.excerpt,
          excerptFr: item.excerptFr,
          content: item.content,
          contentFr: item.contentFr,
          coverImageUrl: item.coverImageUrl,
          tags: item.tags,
          views: item.views,
          likes: item.likes,
          featured: Boolean(item.featured),
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
        create: {
          externalId: item.id,
          title: item.title,
          titleFr: item.titleFr,
          slug: item.slug,
          category: item.category,
          categoryFr: item.categoryFr,
          excerpt: item.excerpt,
          excerptFr: item.excerptFr,
          content: item.content,
          contentFr: item.contentFr,
          coverImageUrl: item.coverImageUrl,
          tags: item.tags,
          views: item.views,
          likes: item.likes,
          featured: Boolean(item.featured),
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
      })
    )
  );
  console.log("✓ Lab articles created/updated");

  // Create testimonials
  await Promise.all(
    testimonials.map((item, index) =>
      prisma.testimonial.upsert({
        where: { externalId: item.id },
        update: {
          clientName: item.clientName,
          clientRoleCompany: item.clientRoleCompany,
          clientRoleCompanyFr: item.clientRoleCompanyFr,
          text: item.text,
          textFr: item.textFr,
          avatarUrl: item.avatarUrl,
          rating: item.rating,
          projectReference: item.projectReference,
          projectReferenceFr: item.projectReferenceFr,
          dateLabel: item.date,
          dateLabelFr: item.dateFr,
          clientWorkId: createdClientWorks[index % createdClientWorks.length]?.id,
        },
        create: {
          externalId: item.id,
          clientName: item.clientName,
          clientRoleCompany: item.clientRoleCompany,
          clientRoleCompanyFr: item.clientRoleCompanyFr,
          text: item.text,
          textFr: item.textFr,
          avatarUrl: item.avatarUrl,
          rating: item.rating,
          projectReference: item.projectReference,
          projectReferenceFr: item.projectReferenceFr,
          dateLabel: item.date,
          dateLabelFr: item.dateFr,
          clientWorkId: createdClientWorks[index % createdClientWorks.length]?.id,
        },
      })
    )
  );
  console.log("✓ Testimonials created/updated");

  // Create academy resources
  await Promise.all(
    academyResources.map((item) =>
      prisma.academyResource.upsert({
        where: { externalId: item.id },
        update: {
          title: item.title,
          titleFr: item.titleFr,
          description: item.description,
          descriptionFr: item.descriptionFr,
          content: item.content,
          contentFr: item.contentFr,
          type: item.type as AcademyResourceType,
          slug: item.slug,
          coverImageUrl: item.coverImageUrl,
          tags: item.tags,
          views: item.views,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
        create: {
          externalId: item.id,
          title: item.title,
          titleFr: item.titleFr,
          description: item.description,
          descriptionFr: item.descriptionFr,
          content: item.content,
          contentFr: item.contentFr,
          type: item.type as AcademyResourceType,
          slug: item.slug,
          coverImageUrl: item.coverImageUrl,
          tags: item.tags,
          views: item.views,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        },
      })
    )
  );
  console.log("✓ Academy resources created/updated");

  // Create team members
  await prisma.teamMember.createMany({
    data: teamMembers.map((item) => ({
      name: item.name,
      role: item.role,
      roleFr: item.roleFr,
      speciality: item.speciality,
      specialityFr: item.specialityFr,
      imageUrl: item.imageUrl,
      linkedIn: item.linkedIn,
      whatsApp: item.whatsApp,
      email: item.email,
      website: item.website,
      displayOrder: item.displayOrder,
    })),
  });
  console.log("✓ Team members created");
}

/**
 * Seed inbox and subscriber data (messages, subscribers, campaigns).
 */
async function seedInboxData(options: SeedOptions) {
  console.log("📧 Seeding inbox and subscriber data...");

  // Check if inbox data already exists
  const existingMessages = await prisma.message.count();
  if (existingMessages > 0 && !options.reset) {
    console.log("✓ Inbox data already exists, skipping.");
    return;
  }

  // Create messages
  await Promise.all(
    messagePreviews.map((item) =>
      prisma.message.upsert({
        where: { externalId: item.id },
        update: {
          name: item.name,
          email: item.email,
          subject: item.subject,
          message: item.message,
          receivedAt: new Date(item.receivedAt),
          isRead: item.isRead,
          source: "seed",
        },
        create: {
          externalId: item.id,
          name: item.name,
          email: item.email,
          subject: item.subject,
          message: item.message,
          receivedAt: new Date(item.receivedAt),
          isRead: item.isRead,
          source: "seed",
        },
      })
    )
  );
  console.log("✓ Messages created/updated");

  // Create subscribers
  const subscribers = await Promise.all(
    subscriberPreviews.map((item) =>
      prisma.subscriber.upsert({
        where: { externalId: item.id },
        update: {
          email: item.email,
          source: item.source,
          subscribedAt: new Date(item.subscribedAt),
        },
        create: {
          externalId: item.id,
          email: item.email,
          source: item.source,
          subscribedAt: new Date(item.subscribedAt),
        },
      })
    )
  );
  console.log("✓ Subscribers created/updated");

  // Create campaign with deliveries
  const firstArticle = await prisma.labArticle.findFirst({
    orderBy: { publishedAt: "desc" },
  });

  if (firstArticle) {
    const existingCampaign = await prisma.subscriberCampaign.findFirst({
      where: { slug: firstArticle.slug },
    });

    if (!existingCampaign) {
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
      console.log("✓ Campaign and deliveries created");
    } else {
      console.log("✓ Campaign already exists, skipping.");
    }
  }
}

// Utility function for mapping skill categories
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

/**
 * Main seed orchestrator.
 * Supports:
 * - pnpm prisma:seed                    (seed all, skip if exists)
 * - pnpm prisma:seed --only core        (seed only core profile + auth)
 * - pnpm prisma:seed --reset            (full reset + seed all)
 * - pnpm prisma:seed --only core --reset (reset + seed only core)
 */
async function main() {
  const options: SeedOptions = {
    onlyCore,
    reset,
  };

  try {
    console.log(`\n🚀 Starting seed... (onlyCore: ${onlyCore}, reset: ${reset})\n`);

    // Always seed core (brand profile, skills, etc.)
    await seedCore(options);

    // Seed portfolio content unless --only core
    if (!onlyCore) {
      await seedPortfolioContent(options);
      await seedInboxData(options);
    }

    console.log("\n✅ Seed completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
