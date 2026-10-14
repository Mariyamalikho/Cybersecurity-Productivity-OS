"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { calculateLevel } from "@/lib/xp";

export async function getAchievements() {
  const user = await ensureUserExists();
  
  const [totalTasks, habits, pomodoroSessions] = await Promise.all([
    prisma.task.count({ where: { userId: user.id, status: "COMPLETED" } }),
    prisma.habit.findMany({ where: { userId: user.id } }),
    prisma.pomodoroSession.findMany({ where: { userId: user.id } })
  ]);
  
  const highestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const totalFocusMinutes = pomodoroSessions.reduce((acc, ps) => acc + ps.duration, 0);
  const totalFocusHours = totalFocusMinutes / 60;
  
  const currentLevel = calculateLevel(user.xp);
  
  // Define Trophies based on stats
  const trophies = [
    {
      id: "first_blood",
      title: "First Blood",
      description: "Complete your first task.",
      unlocked: totalTasks >= 1,
      progress: Math.min(100, (totalTasks / 1) * 100),
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      id: "task_master",
      title: "Task Master",
      description: "Complete 50 tasks.",
      unlocked: totalTasks >= 50,
      progress: Math.min(100, (totalTasks / 50) * 100),
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      id: "consistency_king",
      title: "Consistency King",
      description: "Reach a 7-day streak on any habit.",
      unlocked: highestStreak >= 7,
      progress: Math.min(100, (highestStreak / 7) * 100),
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      id: "deep_work_master",
      title: "Deep Work Master",
      description: "Log 25 hours of Pomodoro focus time.",
      unlocked: totalFocusHours >= 25,
      progress: Math.min(100, (totalFocusHours / 25) * 100),
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      id: "cyber_prodigy",
      title: "Cyber Prodigy",
      description: "Reach Level 10.",
      unlocked: currentLevel >= 10,
      progress: Math.min(100, (currentLevel / 10) * 100),
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    {
      id: "grandmaster",
      title: "Cyber Grandmaster",
      description: "Reach Level 50.",
      unlocked: currentLevel >= 50,
      progress: Math.min(100, (currentLevel / 50) * 100),
      color: "text-red-500",
      bg: "bg-red-500/10"
    }
  ];

  return trophies;
}
