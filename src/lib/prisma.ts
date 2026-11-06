import { PrismaClient } from "@prisma/client";

const cleanUrl = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(cleanUrl ? { datasources: { db: { url: cleanUrl } } } : {}),
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
