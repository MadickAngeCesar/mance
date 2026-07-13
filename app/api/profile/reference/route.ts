import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { ensureBrandProfile, ensureBrandProfileRelations } from "@/lib/brand-profile";
import { FreelancePlatformName, SkillCategory, SocialPlatform } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const ReferencePatchSchema = z.object({
  education: z
    .array(
      z.object({
        title: z.string().min(1),
        titleFr: z.string().optional().nullable(),
        institution: z.string().min(1),
        institutionFr: z.string().optional().nullable(),
        period: z.string().min(1),
        location: z.string().optional().nullable(),
        locationFr: z.string().optional().nullable(),
      })
    )
    .optional(),
  experience: z
    .array(
      z.object({
        role: z.string().min(1),
        roleFr: z.string().optional().nullable(),
        company: z.string().min(1),
        companyFr: z.string().optional().nullable(),
        period: z.string().min(1),
        summary: z.string().min(1),
        summaryFr: z.string().optional().nullable(),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string().min(1),
        nameFr: z.string().optional().nullable(),
        category: z.nativeEnum(SkillCategory),
        proficiency: z.number().int().min(1).max(5),
        iconSlug: z.string().optional(),
      })
    )
    .optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.nativeEnum(SocialPlatform),
        label: z.string().min(1),
        url: z.string().url(),
      })
    )
    .optional(),
  freelancePlatforms: z
    .array(
      z.object({
        name: z.nativeEnum(FreelancePlatformName),
        url: z.string().url(),
        handle: z.string().optional(),
      })
    )
    .optional(),
});

async function handleGet(request: NextRequest) {
  await requireRole(request, "admin");

  const profile = await ensureBrandProfile();
  await ensureBrandProfileRelations(profile.id);

  const contactDetails = await prisma.contactDetails.findUnique({
    where: { brandProfileId: profile.id },
    select: {
      id: true,
      socialLinks: {
        orderBy: { displayOrder: "asc" },
      },
      freelancePlatforms: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  const [education, experience, skills] = await Promise.all([
    prisma.education.findMany({
      orderBy: { displayOrder: "asc" },
    }),
    prisma.experience.findMany({
      orderBy: { displayOrder: "asc" },
    }),
    prisma.skill.findMany({
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    data: {
      education,
      experience,
      skills,
      socialLinks: contactDetails?.socialLinks ?? [],
      freelancePlatforms: contactDetails?.freelancePlatforms ?? [],
    },
  });
}

async function handlePatch(request: NextRequest) {
  await requireRole(request, "admin");

  const payload = ReferencePatchSchema.parse(await request.json());
  const profile = await ensureBrandProfile();
  await ensureBrandProfileRelations(profile.id);

  const contactDetails = await prisma.contactDetails.findUnique({
    where: { brandProfileId: profile.id },
    select: { id: true },
  });

  if (!contactDetails) {
    throw new Error("Contact details unavailable");
  }

  await prisma.$transaction(async (tx) => {
    if (payload.education) {
      await tx.education.deleteMany();
      if (payload.education.length > 0) {
        await tx.education.createMany({
          data: payload.education.map((entry, index) => ({
            title: entry.title,
            titleFr: entry.titleFr ?? null,
            institution: entry.institution,
            institutionFr: entry.institutionFr ?? null,
            period: entry.period,
            location: entry.location ?? null,
            locationFr: entry.locationFr ?? null,
            displayOrder: index,
          })),
        });
      }
    }

    if (payload.experience) {
      await tx.experience.deleteMany();
      if (payload.experience.length > 0) {
        await tx.experience.createMany({
          data: payload.experience.map((entry, index) => ({
            role: entry.role,
            roleFr: entry.roleFr ?? null,
            company: entry.company,
            companyFr: entry.companyFr ?? null,
            period: entry.period,
            summary: entry.summary,
            summaryFr: entry.summaryFr ?? null,
            displayOrder: index,
          })),
        });
      }
    }

    if (payload.skills) {
      await tx.skill.deleteMany();
      if (payload.skills.length > 0) {
        await tx.skill.createMany({
          data: payload.skills.map((entry, index) => ({
            name: entry.name,
            nameFr: entry.nameFr ?? null,
            category: entry.category,
            proficiency: entry.proficiency,
            iconSlug: entry.iconSlug ?? entry.name.toLowerCase().replace(/\s+/g, "-"),
            displayOrder: index,
          })),
        });
      }
    }

    if (payload.socialLinks) {
      await tx.socialLink.deleteMany({ where: { contactDetailsId: contactDetails.id } });
      if (payload.socialLinks.length > 0) {
        await tx.socialLink.createMany({
          data: payload.socialLinks.map((entry, index) => ({
            platform: entry.platform,
            label: entry.label,
            url: entry.url,
            displayOrder: index,
            contactDetailsId: contactDetails.id,
          })),
        });
      }
    }

    if (payload.freelancePlatforms) {
      await tx.freelancePlatform.deleteMany({ where: { contactDetailsId: contactDetails.id } });
      if (payload.freelancePlatforms.length > 0) {
        await tx.freelancePlatform.createMany({
          data: payload.freelancePlatforms.map((entry, index) => ({
            name: entry.name,
            url: entry.url,
            handle: entry.handle ?? "",
            displayOrder: index,
            contactDetailsId: contactDetails.id,
          })),
        });
      }
    }
  });

  return handleGet(request);
}

export const GET = createApiHandler(handleGet);
export const PATCH = createApiHandler(handlePatch);
