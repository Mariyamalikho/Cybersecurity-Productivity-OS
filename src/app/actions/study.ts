"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getStudyAbroadApps() {
  const user = await ensureUserExists();
  return await prisma.studyAbroadApp.findMany({
    where: { userId: user.id },
    orderBy: [
      { deadline: "asc" },
      { createdAt: "desc" }
    ]
  });
}

export async function createStudyAbroadApp(formData: FormData) {
  const user = await ensureUserExists();
  const university = formData.get("university") as string;
  const country = formData.get("country") as string;
  const deadlineStr = formData.get("deadline") as string;
  const notes = formData.get("notes") as string;

  if (!university || !country) return { error: "University and Country are required" };

  await prisma.studyAbroadApp.create({
    data: {
      userId: user.id,
      university,
      country,
      status: "RESEARCHING",
      deadline: deadlineStr ? new Date(deadlineStr) : null,
      notes: notes || null
    }
  });

  revalidatePath("/study-abroad");
  return { success: true };
}

export async function updateStudyAbroadStatus(id: string, status: string) {
  const user = await ensureUserExists();
  
  await prisma.studyAbroadApp.update({
    where: { id, userId: user.id },
    data: { status }
  });

  if (status === "ACCEPTED") {
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 50 } } // +50 XP for getting accepted
    });
  }

  revalidatePath("/study-abroad");
}
