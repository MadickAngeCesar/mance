import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const prismaClientSingleton = () => {
  console.log("DEBUG: prismaClientSingleton started");
  const directConnectionString = process.env.DIRECT_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;

  console.log("DEBUG: directConnectionString =", directConnectionString);
  console.log("DEBUG: databaseUrl =", databaseUrl);

  if (!directConnectionString && !databaseUrl) {
    throw new Error("DIRECT_DATABASE_URL or DATABASE_URL environment variable must be defined.");
  }

  if (directConnectionString) {
    console.log("DEBUG: Using directConnectionString adapter");
    process.env.DATABASE_URL = directConnectionString;
    const adapter = new PrismaPg({
      connectionString: directConnectionString,
      max: 1,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    return new PrismaClient({ adapter });
  }

  // prisma+postgres URLs are handled by Prisma without a driver adapter.
  if (databaseUrl?.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: databaseUrl });
  }

  const pool = new Pool({
    connectionString: databaseUrl!,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

