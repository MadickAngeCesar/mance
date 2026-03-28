import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const prismaClientSingleton = () => {
  const directConnectionString = process.env.DIRECT_DATABASE_URL;
  const fallbackConnectionString = process.env.DATABASE_URL;
  const connectionString = directConnectionString ?? fallbackConnectionString;

  if (!connectionString) {
    throw new Error("DIRECT_DATABASE_URL or DATABASE_URL environment variable must be defined.");
  }

  if (!directConnectionString && fallbackConnectionString?.startsWith("prisma+postgres://")) {
    const configError = new Error(
      "DIRECT_DATABASE_URL is required at runtime when DATABASE_URL uses prisma+postgres://"
    ) as Error & { code?: string };
    configError.code = "DB_CONFIG_MISMATCH";
    throw configError;
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
