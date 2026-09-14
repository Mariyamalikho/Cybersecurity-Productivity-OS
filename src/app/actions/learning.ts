"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getLearningResources(type: string) {
  const user = await ensureUserExists();
  return await prisma.learningResource.findMany({
    where: { userId: user.id, type },
    orderBy: { createdAt: "desc" }
  });
}

export async function createLearningResource(formData: FormData, type: string) {
  const user = await ensureUserExists();
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;

  if (!title) return { error: "Missing title" };

  await prisma.learningResource.create({
    data: {
      title,
      type,
      url: url || null,
      userId: user.id,
    }
  });

  revalidatePath(`/learning/${type.toLowerCase()}`);
  return { success: true };
}

export async function updateResourceProgress(id: string, progress: number, type: string) {
  const user = await ensureUserExists();
  
  const status = progress === 100 ? "COMPLETED" : progress > 0 ? "IN_PROGRESS" : "NOT_STARTED";
  
  await prisma.learningResource.update({
    where: { id, userId: user.id },
    data: { progress, status }
  });

  if (progress === 100) {
    // XP reward for completing a course/module
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 100 } }
    });
  }

  revalidatePath(`/learning/${type.toLowerCase()}`);
}
