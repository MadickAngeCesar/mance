import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const prismaClientSingleton = () => {
  const connectionString = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DIRECT_DATABASE_URL or DATABASE_URL environment variable must be defined.");
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
