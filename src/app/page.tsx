import type { Metadata } from "next";
import { GreetingHero } from "@/components/dashboard/greeting-hero";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TasksWidget } from "@/components/dashboard/tasks-widget";
import { PomodoroWidget } from "@/components/dashboard/pomodoro-widget";
import { HeatmapWidget } from "@/components/dashboard/heatmap-widget";
import { DeadlinesWidget } from "@/components/dashboard/deadlines-widget";
import { RetentionWidget } from "@/components/dashboard/retention-widget";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import { getTkrsState } from "@/app/actions/tkrs";

export const metadata: Metadata = {
  title: "Dashboard — Mission Control & Retention Overview",
  description:
    "Live operations dashboard monitoring cybersecurity curriculum progress, R0–R7 spaced repetition queues, daily priority objectives, habit streaks, and focus metrics.",
  alternates: { canonical: "/" },
};

export default async function DashboardPage() {
  const [data, tkrsState] = await Promise.all([
    getDashboardMetrics(),
    getTkrsState(),
  ]);

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Cyber Journey</span>
          <span aria-hidden="true">/</span>
          <span className="text-foreground/90 font-semibold">Dashboard</span>
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-h-[0px]">
        <div className="max-w-6xl mx-auto space-y-6">
          <GreetingHero user={data.user} />
          
          <StatsGrid user={data.user} stats={data.stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-4">
            <div className="xl:col-span-1 h-[400px]">
              <PomodoroWidget />
            </div>
            
            <div className="xl:col-span-1 h-[400px]">
              <TasksWidget tasks={data.pendingTasks} />
            </div>

            <div className="xl:col-span-1 h-[400px]">
              <DeadlinesWidget deadlines={data.upcomingDeadlines} />
            </div>
            
            <div className="xl:col-span-1 h-[400px]">
              <HeatmapWidget heatmapData={data.heatmapData} />
            </div>
          </div>

          <div className="pt-2">
            <RetentionWidget tkrsState={tkrsState} />
          </div>
        </div>
      </div>
    </div>
  );
}
