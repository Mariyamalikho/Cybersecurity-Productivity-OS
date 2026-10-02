"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  const user = await ensureUserExists();
  return await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });
}

export async function createProject(formData: FormData) {
  const user = await ensureUserExists();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const githubUrl = formData.get("githubUrl") as string;
  const demoUrl = formData.get("demoUrl") as string;
  
  if (!title || !description) return { error: "Missing fields" };

  await prisma.project.create({
    data: {
      userId: user.id,
      title,
      description,
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      status: "PLANNING",
      tags: []
    }
  });

  revalidatePath("/projects");
  return { success: true };
}

export async function updateProjectStatus(id: string, status: string) {
  const user = await ensureUserExists();
  
  await prisma.project.update({
    where: { id, userId: user.id },
    data: { status }
  });

  if (status === "COMPLETED") {
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 50 } } // +50 XP for completing a project
    });
  }

  revalidatePath("/projects");
}
