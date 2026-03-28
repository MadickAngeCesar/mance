import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { ApiError } from "./api-utils";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

const JWT_ALGORITHM = "HS256";
const JWT_EXPIRATION = "24h";
const JWT_REFRESH_EXPIRATION = "7d";
const BCRYPT_ROUNDS = 10;

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

function isJwtPayload(payload: unknown): payload is JwtPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  return (
    typeof candidate.userId === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.role === "string"
  );
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token
 */
export async function generateAccessToken(payload: Omit<JwtPayload, "iat" | "exp">) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setExpirationTime(JWT_EXPIRATION)
      .sign(JWT_SECRET);

    return token;
  } catch (error) {
    console.error("Failed to generate access token:", error);
    throw new ApiError("Failed to generate token", 500);
  }
}

/**
 * Generate JWT refresh token
 */
export async function generateRefreshToken(payload: Omit<JwtPayload, "iat" | "exp">) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setExpirationTime(JWT_REFRESH_EXPIRATION)
      .sign(JWT_SECRET);

    return token;
  } catch (error) {
    console.error("Failed to generate refresh token:", error);
    throw new ApiError("Failed to generate token", 500);
  }
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!isJwtPayload(payload)) {
      throw new ApiError("Invalid token payload", 401);
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Invalid or expired token", 401);
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  }

  return parts[1];
}

/**
 * Middleware to check if request is authenticated
 * Verifies JWT token and adds user to request context
 */
export async function requireAuth(request: NextRequest) {
  const token = extractTokenFromRequest(request);

  if (!token) {
    throw ApiError.unauthorized("Missing authentication token");
  }

  try {
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.unauthorized("Invalid or expired token");
  }
}

/**
 * Middleware to require specific role
 */
export async function requireRole(request: NextRequest, requiredRole: string) {
  const user = await requireAuth(request);

  if (user.role !== requiredRole && user.role !== "admin") {
    throw ApiError.forbidden(`This action requires ${requiredRole} role`);
  }

  return user;
}

/**
 * Parse request body with error handling
 */
export async function parseRequestBody(request: NextRequest) {
  try {
    const body = await request.json();
    return body;
  } catch (error) {
    throw ApiError.badRequest("Invalid JSON in request body");
  }
}

/**
 * Type-safe authenticated API handler
 */
export function createAuthenticatedApiHandler<T = any>(
  handler: (req: NextRequest, user: JwtPayload, context?: any) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      const user = await requireAuth(req);
      return await handler(req, user, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            ok: false,
            error: error.message,
          },
          { status: error.statusCode }
        );
      }
      console.error("Auth error:", error);
      return NextResponse.json(
        {
          ok: false,
          error: "Authentication failed",
        },
        { status: 401 }
      );
    }
  };
}