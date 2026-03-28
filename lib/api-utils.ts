import { NextRequest, NextResponse } from "next/server";

type ErrorWithCode = {
  code?: string;
};

export function isDatabaseUnavailableError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as ErrorWithCode;
  return candidate.code === "ECONNREFUSED" || candidate.code === "P1001";
}

/**
 * API Request logging middleware
 * Logs method, path, status, and duration
 */
export function logRequest(request: NextRequest, status: number, duration: number) {
  const method = request.method;
  const url = new URL(request.url);
  const path = url.pathname + url.search;

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path} ${status} ${duration}ms`);
}

/**
 * Wrapper for API routes with automatic logging and error handling
 */
export function createApiHandler<T = any>(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest, context?: any) => {
    const startTime = Date.now();

    try {
      const response = await handler(req, context);
      const duration = Date.now() - startTime;

      logRequest(req, response.status, duration);
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      const status = error instanceof ApiError ? error.statusCode : isDatabaseUnavailableError(error) ? 503 : 500;

      logRequest(req, status, duration);

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            ok: false,
            error: error.message,
          },
          { status: error.statusCode }
        );
      }

      if (isDatabaseUnavailableError(error)) {
        return NextResponse.json(
          {
            ok: false,
            error: "Database is temporarily unavailable.",
          },
          { status: 503 }
        );
      }

      console.error("Unhandled error:", error);
      return NextResponse.json(
        {
          ok: false,
          error: "Internal server error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Custom API error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "ApiError";
  }

  static notFound(message = "Not found") {
    return new ApiError(message, 404);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(message, 403);
  }

  static conflict(message = "Conflict") {
    return new ApiError(message, 409);
  }

  static badRequest(message = "Bad request") {
    return new ApiError(message, 400);
  }

  static unprocessable(message = "Unprocessable entity") {
    return new ApiError(message, 422);
  }
}
