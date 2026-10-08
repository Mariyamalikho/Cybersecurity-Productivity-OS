"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getJournalEntries() {
  const user = await ensureUserExists();
  return await prisma.moodLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });
}

export async function createJournalEntry(formData: FormData) {
  const user = await ensureUserExists();
  const mood = formData.get("mood") as string;
  const energy = formData.get("energy") as string;
  const focus = parseInt(formData.get("focus") as string, 10);
  const notes = formData.get("notes") as string;

  if (!mood || !energy || isNaN(focus)) return { error: "Missing fields" };

  await prisma.moodLog.create({
    data: {
      userId: user.id,
      mood,
      energy,
      focus,
      notes: notes || null
    }
  });

  // Reward 10 XP for journaling
  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: 10 } }
  });

  revalidatePath("/journal");
  return { success: true };
}
