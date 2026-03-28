import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma";

const ADMIN_EMAIL = "admin@mance.dev";
const ADMIN_DISPLAY_NAME = "MAC TECH Admin";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "MacTech@2026";
const ADMIN_ROLE = process.env.SEED_ADMIN_ROLE ?? "admin";
const BCRYPT_ROUNDS = 10;

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);

  const user = await prisma.authUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      displayName: ADMIN_DISPLAY_NAME,
      role: ADMIN_ROLE,
      isActive: true,
      passwordHash,
    },
    create: {
      email: ADMIN_EMAIL,
      displayName: ADMIN_DISPLAY_NAME,
      role: ADMIN_ROLE,
      isActive: true,
      passwordHash,
    },
  });

  console.log("Admin credentials seeded successfully.");
  console.log(`Email: ${user.email}`);
  console.log("Password: [from SEED_ADMIN_PASSWORD or default MacTech@2026]");
}

main()
  .catch((error) => {
    console.error("Failed to seed admin credentials:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
