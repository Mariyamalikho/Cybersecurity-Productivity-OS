"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getDashboardMetrics() {
  const user = await ensureUserExists();
  
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Execute independent database queries in parallel for maximum performance
  const [
    completedTasksToday,
    pomodoroSessions,
    habits,
    pendingTasks,
    habitCompletions,
    taskCompletions,
    upcomingDeadlines,
    firstDailyTask
  ] = await Promise.all([
    prisma.task.count({
      where: {
        userId: user.id,
        status: "COMPLETED",
        completedAt: { gte: startOfToday }
      }
    }),
    prisma.pomodoroSession.findMany({
      where: {
        userId: user.id,
        completedAt: { gte: sevenDaysAgo }
      }
    }),
    prisma.habit.findMany({
      where: { userId: user.id }
    }),
    prisma.task.findMany({
      where: { userId: user.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.habitCompletion.findMany({
      where: { habit: { userId: user.id }, completedAt: { gte: thirtyDaysAgo } }
    }),
    prisma.task.findMany({
      where: { userId: user.id, status: "COMPLETED", completedAt: { gte: thirtyDaysAgo } }
    }),
    prisma.studyAbroadApp.findMany({
      where: {
        userId: user.id,
        status: { in: ["RESEARCHING", "APPLIED"] },
        deadline: { gte: startOfToday }
      },
      orderBy: { deadline: "asc" },
      take: 3
    }),
    prisma.task.findFirst({
      where: { userId: user.id, scope: "DAILY", dueDate: { not: null } },
      orderBy: { dueDate: "asc" },
      select: { dueDate: true }
    })
  ]);

  const focusMinutes = pomodoroSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const focusHours = (focusMinutes / 60).toFixed(1);
  const totalStreaks = habits.reduce((acc, curr) => acc + curr.currentStreak, 0);

  const activityMap: Record<string, number> = {};
  
  // Server-side local date extraction (using local timezone of server)
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  habitCompletions.forEach(hc => {
    const d = formatDate(hc.completedAt);
    activityMap[d] = (activityMap[d] || 0) + 1;
  });
  
  taskCompletions.forEach(tc => {
    if (tc.completedAt) {
      const d = formatDate(tc.completedAt);
      activityMap[d] = (activityMap[d] || 0) + 1;
    }
  });

  const heatmapData = Object.entries(activityMap).map(([date, count]) => ({
    date,
    count
  }));

  const startDate = firstDailyTask?.dueDate ? new Date(firstDailyTask.dueDate) : new Date(user.createdAt);
  startDate.setUTCHours(0, 0, 0, 0);
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const journeyDay = diffTime > 0 ? Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) : 0;
  
  const activeHabitsCount = habits.filter(h => h.status === "ACTIVE").length;

  return {
    user,
    stats: {
      completedTasksToday,
      focusHours,
      totalStreaks,
      journeyDay,
      activeHabitsCount
    },
    pendingTasks,
    upcomingDeadlines,
    heatmapData
  };
}

export async function logPomodoroSession(durationMinutes: number) {
  const user = await ensureUserExists();
  
  await prisma.pomodoroSession.create({
    data: {
      userId: user.id,
      duration: durationMinutes,
    }
  });

  // Reward 5 XP for a 25 min session
  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: 5 } }
  });

  revalidatePath("/");
  revalidatePath("/analytics");
}
