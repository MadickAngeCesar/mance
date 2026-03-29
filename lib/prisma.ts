import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const normalizePgSslMode = (connectionString: string) => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(connectionString);
  } catch {
    return connectionString;
  }

  const sslMode = parsedUrl.searchParams.get("sslmode");
  const useLibpqCompat = parsedUrl.searchParams.get("uselibpqcompat")?.toLowerCase() === "true";

  // Keep current pg v8 behavior explicit and silence the deprecation warning.
  if (!useLibpqCompat && (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca")) {
    parsedUrl.searchParams.set("sslmode", "verify-full");
  }

  return parsedUrl.toString();
};

const prismaClientSingleton = () => {
  const directConnectionString = process.env.DIRECT_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;

  if (!directConnectionString && !databaseUrl) {
    throw new Error("DIRECT_DATABASE_URL or DATABASE_URL environment variable must be defined.");
  }

  if (directConnectionString) {
    const adapter = new PrismaPg({ connectionString: normalizePgSslMode(directConnectionString) });
    return new PrismaClient({ adapter });
  }

  // prisma+postgres URLs are handled by Prisma without a driver adapter.
  if (databaseUrl?.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: databaseUrl });
  }

  const adapter = new PrismaPg({ connectionString: normalizePgSslMode(databaseUrl!) });
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
