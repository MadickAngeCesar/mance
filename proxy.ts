import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_COOKIE = "access_token";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function getToken(request: NextRequest) {
  return getBearerToken(request) ?? request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as TokenPayload;
}

function isDashboardPath(pathname: string) {
  return pathname.startsWith("/dashboard");
}

function isPublicApiPath(pathname: string, method: string) {
  if (pathname === "/api/messages" && method === "POST") return true;
  if (pathname === "/api/subscribers" && method === "POST") return true;
  if ((pathname === "/api/blogs" || pathname.startsWith("/api/blogs/")) && method === "GET") return true;
  if ((pathname === "/api/projects" || pathname.startsWith("/api/projects/")) && method === "GET") return true;
  if ((pathname === "/api/services" || pathname.startsWith("/api/services/")) && method === "GET") return true;
  if (pathname === "/api/profile" && method === "GET") return true;
  if (pathname === "/api/auth/sign-in") return true;
  if (pathname === "/api/auth/refresh") return true;
  return false;
}

function requiresAdmin(pathname: string) {
  if (pathname.startsWith("/api/messages")) return true;
  if (pathname.startsWith("/api/subscribers")) return true;
  if (pathname.startsWith("/api/overview")) return true;
  if (pathname.startsWith("/api/testimonials")) return true;

  return false;
}

function requiresAdminWrite(pathname: string, method: string) {
  const writeMethods = ["POST", "PATCH", "DELETE", "PUT"];
  if (!writeMethods.includes(method)) {
    return false;
  }

  if (pathname.startsWith("/api/blogs")) return true;
  if (pathname.startsWith("/api/projects")) return true;
  if (pathname.startsWith("/api/services")) return true;
  if (pathname === "/api/profile") return true;

  return false;
}

function requiresAuthenticated(pathname: string) {
  if (pathname.startsWith("/api/settings")) return true;
  if (pathname === "/api/auth/logout") return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  const isDashboard = isDashboardPath(pathname);
  const isApi = pathname.startsWith("/api/");

  if (!isDashboard && !isApi) {
    return NextResponse.next();
  }

  if (isApi && isPublicApiPath(pathname, method)) {
    return NextResponse.next();
  }

  const token = getToken(request);
  if (!token) {
    if (isDashboard) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAccessToken(token);

    const adminRequired = requiresAdmin(pathname) || requiresAdminWrite(pathname, method);
    const authRequired = requiresAuthenticated(pathname) || isDashboard;

    if (adminRequired && payload.role !== "admin") {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    if (authRequired) {
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch {
    if (isDashboard) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};