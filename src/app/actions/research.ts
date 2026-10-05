"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getResearchPapers() {
  const user = await ensureUserExists();
  return await prisma.researchPaper.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });
}

export async function createResearchPaper(formData: FormData) {
  const user = await ensureUserExists();
  const title = formData.get("title") as string;
  const abstract = formData.get("abstract") as string;
  const url = formData.get("url") as string;
  const status = formData.get("status") as string || "READING";

  if (!title) return { error: "Title is required" };

  await prisma.researchPaper.create({
    data: {
      userId: user.id,
      title,
      abstract: abstract || null,
      url: url || null,
      status,
      tags: []
    }
  });

  revalidatePath("/research");
  return { success: true };
}

export async function updateResearchStatus(id: string, status: string) {
  const user = await ensureUserExists();
  
  await prisma.researchPaper.update({
    where: { id, userId: user.id },
    data: { status }
  });

  if (status === "PUBLISHED") {
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 30 } } // +30 XP for publishing
    });
  }

  revalidatePath("/research");
}
