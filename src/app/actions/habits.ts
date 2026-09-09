"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getHabits() {
  const user = await ensureUserExists();
  
  // Get start and end of today in local time ideally, but UTC for now
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: {
      completions: {
        where: {
          completedAt: {
            gte: startOfToday,
          }
        }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  return habits.map(habit => ({
    ...habit,
    completedToday: habit.completions.length > 0
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
    }
  });

  revalidatePath("/habits");
  return { success: true };
}

export async function toggleHabit(habitId: string) {
  const user = await ensureUserExists();
  
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const habit = await prisma.habit.findUnique({
    where: { id: habitId, userId: user.id },
    include: {
      completions: {
        where: { completedAt: { gte: startOfToday } }
      }
    }
  });

  if (!habit) throw new Error("Habit not found");

  const isCompletedToday = habit.completions.length > 0;

  if (isCompletedToday) {
    // Un-complete
    const completionId = habit.completions[0].id;
    await prisma.habitCompletion.delete({ where: { id: completionId } });
    
    await prisma.habit.update({
      where: { id: habitId },
      data: { currentStreak: Math.max(0, habit.currentStreak - 1) }
    });
  } else {
    // Complete
    await prisma.habitCompletion.create({
      data: { habitId }
    });
    
    const newStreak = habit.currentStreak + 1;
    await prisma.habit.update({
      where: { id: habitId },
      data: { 
        currentStreak: newStreak,
        longestStreak: Math.max(habit.longestStreak, newStreak)
      }
    });
    
    // Also give XP to user
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 10 } }
    });
  }

  revalidatePath("/habits");
  revalidatePath("/");
  revalidatePath("/analytics");
}
