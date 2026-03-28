import { NextRequest, NextResponse } from "next/server";
import {
  AuthRefreshSchema,
  AuthTokenSchema,
  ApiResponse,
} from "@/lib/validators";
import { ApiError, createApiHandler } from "@/lib/api-utils";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
async function handleRefresh(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = AuthRefreshSchema.safeParse(body);
  const refreshToken =
    (parsed.success ? parsed.data.refreshToken : undefined) ??
    request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token is required");
  }

  try {
    const payload = await verifyToken(refreshToken);

    // Generate new access token
    const accessToken = await generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    // Optionally generate new refresh token
    const newRefreshToken = await generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    const tokenResponse = AuthTokenSchema.parse({
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 86400,
      tokenType: "Bearer",
    });

    await prisma.authEvent.create({
      data: {
        userId: payload.userId,
        eventType: "TOKEN_REFRESH",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    const response: ApiResponse = {
      ok: true,
      data: tokenResponse,
    };

    const result = NextResponse.json(response);

    result.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    result.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return result;
  } catch (error) {
    await prisma.authEvent.create({
      data: {
        eventType: "TOKEN_REFRESH_FAILURE",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.unauthorized("Invalid refresh token");
  }
}

export const POST = createApiHandler(handleRefresh);
