import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AuthSignInSchema,
  AuthTokenSchema,
  AuthUserResponseSchema,
  ApiResponse,
} from "@/lib/validators";
import { ApiError, createApiHandler, isDatabaseUnavailableError } from "@/lib/api-utils";
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth";

type AuthEventPayload = {
  userId?: string;
  eventType: string;
  ipAddress?: string;
  userAgent?: string;
};

function getRequestMetadata(request: NextRequest) {
  return {
    ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    userAgent: request.headers.get("user-agent") || undefined,
  };
}

async function logAuthEventSafe(event: AuthEventPayload) {
  try {
    await prisma.authEvent.create({ data: event });
  } catch (error) {
    // Auth must not fail just because audit logging failed.
    console.error("Auth event logging failed:", error);
  }
}

/**
 * POST /api/auth/sign-in
 * Authenticate user and return JWT tokens
 */
async function handleSignIn(request: NextRequest) {
  const body = await request.json();
  const { email, password, rememberMe } = AuthSignInSchema.parse(body);

  const metadata = getRequestMetadata(request);

  // Find user by email
  let user;
  try {
    user = await prisma.authUser.findUnique({
      where: { email },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      throw new ApiError("Authentication service is temporarily unavailable", 503);
    }
    throw error;
  }

  if (!user || !user.passwordHash) {
    await logAuthEventSafe({
      eventType: "SIGN_IN_FAILURE",
      ...metadata,
    });
    // Don't reveal if user exists
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Account is inactive");
  }

  // Verify password
  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    await logAuthEventSafe({
      userId: user.id,
      eventType: "SIGN_IN_FAILURE",
      ...metadata,
    });
    throw ApiError.unauthorized("Invalid email or password");
  }

  // Generate tokens
  const accessToken = await generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = rememberMe
    ? await generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })
    : undefined;

  // Log auth event
  await logAuthEventSafe({
    userId: user.id,
    eventType: "SIGN_IN_SUCCESS",
    ...metadata,
  });

  const tokenResponse = AuthTokenSchema.parse({
    accessToken,
    refreshToken,
    expiresIn: 86400, // 24 hours in seconds
    tokenType: "Bearer",
  });

  const userResponse = AuthUserResponseSchema.parse({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });

  const response: ApiResponse = {
    ok: true,
    data: {
      token: tokenResponse,
      user: userResponse,
    },
  };

  const result = NextResponse.json(response, { status: 200 });

  result.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  if (refreshToken) {
    result.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } else {
    result.cookies.delete(REFRESH_TOKEN_COOKIE);
  }

  return result;
}

export const POST = createApiHandler(handleSignIn);
