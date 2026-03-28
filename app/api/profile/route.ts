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
import { ensureBrandProfile, ensureBrandProfileRelations } from "@/lib/brand-profile";

/**
 * GET /api/profile
 * Get the brand profile and related data
 */
async function handleGet(request: NextRequest) {
  const profileRecord = await ensureBrandProfile();
  await ensureBrandProfileRelations(profileRecord.id);

  const profile = await prisma.brandProfile.findUnique({
    where: { id: profileRecord.id },
    include: {
      aboutSummary: true,
      contactDetails: {
        include: {
          socialLinks: {
            orderBy: { displayOrder: "asc" },
          },
          freelancePlatforms: {
            orderBy: { displayOrder: "asc" },
          },
        },
      },
      mainWorkHighlights: {
        orderBy: { createdAt: "desc" },
      },
      offerings: {
        orderBy: { createdAt: "desc" },
      },
      workflowStages: {
        orderBy: { step: "asc" },
      },
    },
  });

  if (!profile) {
    throw new ApiError("Profile unavailable", 500);
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

  const profile = await ensureBrandProfile();
  await ensureBrandProfileRelations(profile.id);

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
    await prisma.contactDetails.update({
      where: { brandProfileId: profile.id },
      data: contactData,
    });
  }

  // Fetch updated profile
  const updated = await prisma.brandProfile.findUnique({
    where: { id: profile.id },
    include: {
      aboutSummary: true,
      contactDetails: {
        include: {
          socialLinks: {
            orderBy: { displayOrder: "asc" },
          },
          freelancePlatforms: {
            orderBy: { displayOrder: "asc" },
          },
        },
      },
      mainWorkHighlights: {
        orderBy: { createdAt: "desc" },
      },
      offerings: {
        orderBy: { createdAt: "desc" },
      },
      workflowStages: {
        orderBy: { step: "asc" },
      },
    },
  });

  if (!updated) {
    throw new ApiError("Profile unavailable", 500);
  }

  const response: ApiResponse = {
    ok: true,
    data: updated,
  };

  return NextResponse.json(response);
}

export const GET = createApiHandler(handleGet);
export const PATCH = createApiHandler(handlePatch);
