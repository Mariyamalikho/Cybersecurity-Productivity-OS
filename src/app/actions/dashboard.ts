"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getPktStartOfDay, getPktDateKey } from "@/lib/timezone";

export async function getDashboardMetrics() {
  const user = await ensureUserExists();
  
  const startOfToday = getPktStartOfDay();
  const sevenDaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);

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
      where: {
        userId: user.id,
        status: "PENDING",
        scope: "DAILY"
      },
      orderBy: [
        { dueDate: "asc" },
        { createdAt: "asc" }
      ],
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
  
  // PKT date extraction
  habitCompletions.forEach(hc => {
    const d = getPktDateKey(hc.completedAt);
    activityMap[d] = (activityMap[d] || 0) + 1;
  });
  
  taskCompletions.forEach(tc => {
    if (tc.completedAt) {
      const d = getPktDateKey(tc.completedAt);
      activityMap[d] = (activityMap[d] || 0) + 1;
    }
  });

  const heatmapData = Object.entries(activityMap).map(([date, count]) => ({
    date,
    count
  }));

  const startDate = firstDailyTask?.dueDate ? new Date(firstDailyTask.dueDate) : new Date(user.createdAt);
  const startOfJourney = getPktStartOfDay(startDate);
  const startOfCurrentDay = getPktStartOfDay(new Date());
  const diffTime = startOfCurrentDay.getTime() - startOfJourney.getTime();
  const journeyDay = diffTime >= 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0;
  
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
