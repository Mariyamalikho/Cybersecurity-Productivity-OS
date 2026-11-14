import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { getHabits } from "@/app/actions/habits";
import { HabitClient } from "./habit-client";
import { HabitDialog } from "./habit-dialog";

export const metadata: Metadata = {
  title: "Habit Tracker & Consistency Discipline",
  description:
    "Track daily engineering habits, focus routines, exercise, reading, and streaks with automated XP rewards and analytics.",
  alternates: { canonical: "/habits" },
};

export default async function HabitsPage() {
  const habits = await getHabits();

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Cyber Journey</span>
          <span aria-hidden="true">/</span>
          <span className="text-foreground/90 font-semibold">Habits</span>
        </nav>
        <HabitDialog />
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-h-[0px]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Habit Tracker</h1>
            <p className="text-muted-foreground">Build consistency through daily repetition.</p>
          </div>
          
          <HabitClient habits={habits} />
        </div>
      </div>
    </div>
  );
}
