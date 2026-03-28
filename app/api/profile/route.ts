import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  BrandProfileUpdateSchema,
  AboutSummaryUpdateSchema,
  ContactDetailsUpdateSchema,
  ApiResponse,
} from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { brandProfile, aboutSummary, contactDetails } from "@/lib/placeholder-data";

function buildFallbackProfile() {
  return {
    id: "placeholder-brand-profile",
    ...brandProfile,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    aboutSummary: {
      id: "placeholder-about-summary",
      biography: aboutSummary.biography,
      cvDownloadUrl: aboutSummary.cvDownloadUrl,
      linkedinResumeSource: aboutSummary.linkedinResumeSource,
      interests: aboutSummary.interests,
      brandProfileId: "placeholder-brand-profile",
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    contactDetails: {
      id: "placeholder-contact-details",
      email: contactDetails.email,
      phone: contactDetails.phone,
      location: contactDetails.location,
      brandProfileId: "placeholder-brand-profile",
      createdAt: new Date(0),
      updatedAt: new Date(0),
      socialLinks: contactDetails.socialLinks.map((item, index) => ({
        id: `placeholder-social-${index + 1}`,
        platform: item.platform.toUpperCase(),
        label: item.label,
        url: item.url,
        displayOrder: index + 1,
        contactDetailsId: "placeholder-contact-details",
        createdAt: new Date(0),
        updatedAt: new Date(0),
      })),
      freelancePlatforms: contactDetails.freelancePlatforms.map((item, index) => ({
        id: `placeholder-freelance-${index + 1}`,
        name: item.name.toUpperCase(),
        url: item.url,
        handle: item.handle ?? null,
        displayOrder: index + 1,
        contactDetailsId: "placeholder-contact-details",
        createdAt: new Date(0),
        updatedAt: new Date(0),
      })),
    },
    mainWorkHighlights: [],
    offerings: [],
    workflowStages: [],
  };
}

/**
 * GET /api/profile
 * Get the brand profile and related data
 */
async function handleGet(request: NextRequest) {
  let profile;

  try {
    profile = await prisma.brandProfile.findFirst({
      include: {
        aboutSummary: true,
        contactDetails: {
          include: {
            socialLinks: true,
            freelancePlatforms: true,
          },
        },
        mainWorkHighlights: true,
        offerings: true,
        workflowStages: {
          orderBy: { step: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("GET /api/profile database query failed, using fallback profile.", error);
  }

  if (!profile) {
    profile = buildFallbackProfile();
  }

  const response: ApiResponse = {
    ok: true,
    data: profile,
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/profile
 * Update brand profile (admin only)
 */
async function handlePatch(request: NextRequest) {
  await requireRole(request, "admin");

  const body = await request.json();

  // Get the brand profile
  const profile = await prisma.brandProfile.findFirst();
  if (!profile) {
    throw ApiError.notFound("Brand profile not found");
  }

  // Update brand profile
  if (body.brandProfile) {
    const brandData = BrandProfileUpdateSchema.parse(body.brandProfile);
    await prisma.brandProfile.update({
      where: { id: profile.id },
      data: brandData,
    });
  }

  // Update about summary
  if (body.aboutSummary) {
    const aboutData = AboutSummaryUpdateSchema.parse(body.aboutSummary);
    await prisma.aboutSummary.update({
      where: { brandProfileId: profile.id },
      data: aboutData,
    });
  }

  // Update contact details
  if (body.contactDetails) {
    const contactData = ContactDetailsUpdateSchema.parse(body.contactDetails);
    const contact = await prisma.contactDetails.findUnique({
      where: { brandProfileId: profile.id },
    });
    if (contact) {
      await prisma.contactDetails.update({
        where: { id: contact.id },
        data: contactData,
      });
    }
  }

  // Fetch updated profile
  const updated = await prisma.brandProfile.findFirst({
    include: {
      aboutSummary: true,
      contactDetails: {
        include: {
          socialLinks: true,
          freelancePlatforms: true,
        },
      },
      mainWorkHighlights: true,
      offerings: true,
      workflowStages: {
        orderBy: { step: "asc" },
      },
    },
  });

  const response: ApiResponse = {
    ok: true,
    data: updated,
  };

  return NextResponse.json(response);
}

export const GET = createApiHandler(handleGet);
export const PATCH = createApiHandler(handlePatch);
