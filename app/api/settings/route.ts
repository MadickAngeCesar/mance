import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  SettingsUpdateSchema,
  ApiResponse,
  AuthUserResponseSchema,
} from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import { requireAuth, hashPassword, verifyPassword } from "@/lib/auth";

/**
 * GET /api/settings
 * Get current user's settings
 */
async function handleGet(request: NextRequest) {
  const user = await requireAuth(request);

  const authUser = await prisma.authUser.findUnique({
    where: { id: user.userId },
  });

  if (!authUser) {
    throw ApiError.notFound("User not found");
  }

  const userResponse = AuthUserResponseSchema.parse({
    id: authUser.id,
    email: authUser.email,
    displayName: authUser.displayName,
    role: authUser.role,
    isActive: authUser.isActive,
    createdAt: authUser.createdAt,
  });

  const response: ApiResponse = {
    ok: true,
    data: userResponse,
  };

  return NextResponse.json(response);
}

/**
 * PATCH /api/settings
 * Update user settings (password, email, display name)
 */
async function handlePatch(request: NextRequest) {
  const user = await requireAuth(request);
  const body = await request.json();
  const data = SettingsUpdateSchema.parse(body);

  const authUser = await prisma.authUser.findUnique({
    where: { id: user.userId },
  });

  if (!authUser) {
    throw ApiError.notFound("User not found");
  }

  // If changing password, verify current password
  if (data.newPassword) {
    if (!data.currentPassword) {
      throw ApiError.badRequest("Current password is required to change password");
    }

    const passwordMatch = await verifyPassword(
      data.currentPassword,
      authUser.passwordHash || ""
    );

    if (!passwordMatch) {
      throw ApiError.badRequest("Current password is incorrect");
    }
  }

  // Prepare update data
  const updateData: any = {};

  if (data.displayName !== undefined) {
    updateData.displayName = data.displayName;
  }

  if (data.email !== undefined) {
    // Check if email is already in use
    const existingUser = await prisma.authUser.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== user.userId) {
      throw ApiError.conflict("Email already in use");
    }

    updateData.email = data.email;
  }

  if (data.newPassword) {
    updateData.passwordHash = await hashPassword(data.newPassword);
  }

  const updated = await prisma.authUser.update({
    where: { id: user.userId },
    data: updateData,
  });

  const userResponse = AuthUserResponseSchema.parse({
    id: updated.id,
    email: updated.email,
    displayName: updated.displayName,
    role: updated.role,
    isActive: updated.isActive,
    createdAt: updated.createdAt,
  });

  const response: ApiResponse = {
    ok: true,
    data: userResponse,
  };

  return NextResponse.json(response);
}

export const GET = createApiHandler(handleGet);
export const PATCH = createApiHandler(handlePatch);
