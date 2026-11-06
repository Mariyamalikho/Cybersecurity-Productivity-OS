import { PrismaClient } from "@prisma/client";

function buildServerlessDbUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  let url = rawUrl.trim().replace(/^["']|["']$/g, "");
  // Switch Supabase session pooler (:5432) to transaction pooler (:6543) to prevent MaxClientsInSessionMode errors on Vercel
  if (url.includes("pooler.supabase.com:5432")) {
    url = url.replace(":5432/", ":6543/");
  }
  if (url.includes(":6543/") && !url.includes("pgbouncer=true")) {
    const sep = url.includes("?") ? "&" : "?";
    url = `${url}${sep}pgbouncer=true&connection_limit=3&pool_timeout=30`;
  }
  return url;
}

const cleanUrl = buildServerlessDbUrl(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(cleanUrl ? { datasources: { db: { url: cleanUrl } } } : {}),
    log: ["error"],
  });

globalForPrisma.prisma = prisma;
