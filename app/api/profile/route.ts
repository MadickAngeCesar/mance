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

/**
 * GET /api/profile
 * Get the brand profile and related data
 */
async function handleGet(request: NextRequest) {
  const profile = await prisma.brandProfile.findFirst({
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

  if (!profile) {
    throw ApiError.notFound("Brand profile not found");
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
