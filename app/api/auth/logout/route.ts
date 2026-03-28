import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/validators";
import { createApiHandler } from "@/lib/api-utils";
import { requireAuth, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";

/**
 * POST /api/auth/logout
 * Log out user (mainly client-side token cleanup, but log event)
 */
async function handleLogout(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Log auth event
    await prisma.authEvent.create({
      data: {
        userId: user.userId,
        eventType: "SIGN_OUT",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    const response: ApiResponse = {
      ok: true,
      data: { message: "Logged out successfully" },
    };

    const result = NextResponse.json(response);
    result.cookies.delete(ACCESS_TOKEN_COOKIE);
    result.cookies.delete(REFRESH_TOKEN_COOKIE);
    return result;
  } catch {
    // Even if auth fails, return success (client-side cleanup happened)
    const response: ApiResponse = {
      ok: true,
      data: { message: "Logged out successfully" },
    };

    const result = NextResponse.json(response);
    result.cookies.delete(ACCESS_TOKEN_COOKIE);
    result.cookies.delete(REFRESH_TOKEN_COOKIE);
    return result;
  }
}

export const POST = createApiHandler(handleLogout);
