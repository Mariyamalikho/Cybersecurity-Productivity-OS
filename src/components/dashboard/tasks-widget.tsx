"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toggleTask } from "@/app/actions/tasks";
import { useTransition } from "react";

export function TasksWidget({ tasks }: { tasks: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, status: string) => {
    startTransition(() => {
      toggleTask(id, status);
    });
  };

  return (
    <Card className="border-border/40 hover:border-border transition-colors h-full flex flex-col">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Priority Objectives</CardTitle>
        <Link 
          href="/tasks"
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {tasks.length === 0 && (
            <div className="text-center p-4 text-muted-foreground">
              No pending tasks. You're all caught up!
            </div>
          )}

          {tasks.map((task, i) => (
            <div key={i} className={`flex items-start gap-3 group ${isPending ? 'opacity-50' : ''}`}>
              <input 
                type="checkbox" 
                checked={task.status === "COMPLETED"}
                onChange={() => handleToggle(task.id, task.status)}
                disabled={isPending}
                className="mt-1 w-4 h-4 rounded border-muted-foreground/30 text-primary focus:ring-primary/50 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {task.dueDate && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {format(new Date(task.dueDate), "MMM d")}
                    </span>
                  )}
                  <span className="text-[9px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                    {task.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link 
          href="/calendar"
          className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-border/60 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
        >
          <Plus className="w-4 h-4" />
          Schedule Task
        </Link>
      </CardContent>
    </Card>
  );
}
