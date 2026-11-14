import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { getTasks } from "@/app/actions/tasks";
import { TaskClient } from "./task-client";
import { TaskDialog } from "@/app/calendar/task-dialog";
import { getPktEndOfDay, isSamePktDay } from "@/lib/timezone";

export const metadata: Metadata = {
  title: "Daily Tasks & Objectives — Action Tracker",
  description:
    "Track and execute daily cybersecurity and programming learning objectives with automated quiz verification and XP rewards.",
  alternates: { canonical: "/tasks" },
};

export default async function TasksPage() {
  const allTasks = await getTasks();
  
  const endOfToday = getPktEndOfDay();
  
  const tasks = allTasks.filter(t => {
    // Strictly show DAILY tasks due on or before today (overdue) + completed today
    if (t.scope !== "DAILY") return false;
    
    if (!t.dueDate) return true;
    
    const dueDate = new Date(t.dueDate);
    const isTodayOrPast = dueDate <= endOfToday;
    const completedToday = t.status === "COMPLETED" && t.completedAt && isSamePktDay(new Date(t.completedAt), new Date());
    
    return (isTodayOrPast && t.status === "PENDING") || completedToday || (!isTodayOrPast && t.status === "COMPLETED" && completedToday);
  });

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Cyber Journey</span>
          <span aria-hidden="true">/</span>
          <span className="text-foreground/90 font-semibold">Today's Tasks</span>
        </nav>
        <TaskDialog />
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-h-[0px]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Today's Tasks</h1>
            <p className="text-muted-foreground">Prioritize and execute your daily objectives.</p>
          </div>

          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-0">
              <TaskClient tasks={tasks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
