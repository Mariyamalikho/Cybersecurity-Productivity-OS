"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Always align daily boundaries to Pakistan Standard Time (UTC+5) on both local and Vercel UTC servers
function getStartOfTodayPKT(): Date {
  const now = new Date();
  const pktOffsetMs = 5 * 60 * 60 * 1000;
  const pktNow = new Date(now.getTime() + pktOffsetMs);
  pktNow.setUTCHours(0, 0, 0, 0);
  return new Date(pktNow.getTime() - pktOffsetMs);
}

export async function getHabits() {
  const user = await ensureUserExists();
  const startOfToday = getStartOfTodayPKT();

  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: {
      completions: {
        where: {
          completedAt: {
            gte: startOfToday,
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return habits.map((habit) => ({
    ...habit,
    completedToday: habit.completions.length > 0,
  }));
}

export async function createHabit(formData: FormData) {
  const user = await ensureUserExists();
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;

  if (!name || !category) return { error: "Missing fields" };

  await prisma.habit.create({
    data: {
      name,
      category,
      priority: priority || "Medium",
      userId: user.id,
    },
  });

  revalidatePath("/habits");
  return { success: true };
}

export async function toggleHabit(habitId: string) {
  const user = await ensureUserExists();
  const startOfToday = getStartOfTodayPKT();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId, userId: user.id },
    include: {
      completions: {
        where: { completedAt: { gte: startOfToday } },
      },
    },
  });

  if (!habit) throw new Error("Habit not found");

  const isCompletedToday = habit.completions.length > 0;

  if (isCompletedToday) {
    // Delete all completions recorded today so no duplicates remain
    await prisma.habitCompletion.deleteMany({
      where: {
        habitId,
        completedAt: { gte: startOfToday },
      },
    });

    await prisma.habit.update({
      where: { id: habitId },
      data: { currentStreak: Math.max(0, habit.currentStreak - 1) },
    });
  } else {
    await prisma.habitCompletion.create({
      data: { habitId },
    });

    const newStreak = habit.currentStreak + 1;
    await prisma.habit.update({
      where: { id: habitId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(habit.longestStreak, newStreak),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 10 } },
    });
  }

  revalidatePath("/habits");
  revalidatePath("/");
  revalidatePath("/analytics");
}
