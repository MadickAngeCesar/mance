import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const prismaClientSingleton = () => {
  const directConnectionString = process.env.DIRECT_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;

  if (!directConnectionString && !databaseUrl) {
    throw new Error("DIRECT_DATABASE_URL or DATABASE_URL environment variable must be defined.");
  }

  if (directConnectionString) {
    const adapter = new PrismaPg({ connectionString: directConnectionString });
    return new PrismaClient({ adapter });
  }

  // prisma+postgres URLs are handled by Prisma without a driver adapter.
  if (databaseUrl?.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: databaseUrl });
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl! });
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
