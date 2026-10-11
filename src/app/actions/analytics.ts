"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";

export async function getAnalyticsData() {
  const user = await ensureUserExists();
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [taskCompletions, habitCompletions, pomodoroSessions] = await Promise.all([
    prisma.task.findMany({
      where: { userId: user.id, status: "COMPLETED", completedAt: { gte: thirtyDaysAgo } }
    }),
    prisma.habitCompletion.findMany({
      where: { habit: { userId: user.id }, completedAt: { gte: thirtyDaysAgo } }
    }),
    prisma.pomodoroSession.findMany({
      where: { userId: user.id, completedAt: { gte: thirtyDaysAgo } }
    })
  ]);

  // Aggregate by day
  const dailyData: Record<string, { tasks: number, habits: number, focusMinutes: number }> = {};
  
  const getLocalDateStr = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateStr(d);
    dailyData[dateStr] = { tasks: 0, habits: 0, focusMinutes: 0 };
  }

  const formatDate = (date: Date) => getLocalDateStr(date);

  taskCompletions.forEach(tc => {
    if (tc.completedAt) {
      const d = formatDate(tc.completedAt);
      if (dailyData[d]) dailyData[d].tasks += 1;
    }
  });

  habitCompletions.forEach(hc => {
    const d = formatDate(hc.completedAt);
    if (dailyData[d]) dailyData[d].habits += 1;
  });

  pomodoroSessions.forEach(ps => {
    const d = formatDate(ps.completedAt);
    if (dailyData[d]) dailyData[d].focusMinutes += ps.duration;
  });

  // Format array for recharts
  const chartData = Object.entries(dailyData).map(([date, data]) => ({
    date: date.substring(5), // MM-DD
    fullDate: date,
    tasks: data.tasks,
    habits: data.habits,
    focusHours: parseFloat((data.focusMinutes / 60).toFixed(1)),
    // Estimate XP earned per day based on historical actions
    // (Tasks = 20, Habits = 10, Focus = 5 per 25 min -> ~12 per hour)
    estimatedXp: (data.tasks * 20) + (data.habits * 10) + Math.round((data.focusMinutes / 60) * 12)
  }));

  return chartData;
}
