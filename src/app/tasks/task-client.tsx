"use client";

import { Clock, Brain, ExternalLink, Lock, CheckCircle2 } from "lucide-react";
import { toggleTask } from "@/app/actions/tasks";
import { useTransition } from "react";
import { format } from "date-fns";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  category: string;
  status: string;
  dueDate: Date | null;
  url?: string | null;
  quizResult?: { score: number } | null;
};

export function TaskClient({ tasks }: { tasks: Task[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, status: string) => {
    startTransition(() => {
      toggleTask(id, status);
    });
  };

  const completedCount = tasks.filter(t => t.status === "COMPLETED").length;
  const allCompleted = tasks.length > 0 && completedCount === tasks.length;
  const completedQuizTask = tasks.find(t => t.quizResult != null);
  const firstTask = tasks[0];

  return (
    <div>
      {tasks.length > 0 && (
        <div className="p-4 border-b border-border/40 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg mt-0.5 ${allCompleted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {completedQuizTask ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : allCompleted ? (
                <Brain className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Daily Synthesis Quiz (10 Questions)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {completedQuizTask
                  ? `Completed for today — Score: ${completedQuizTask.quizResult?.score}/10 (+50 XP)`
                  : allCompleted
                  ? "All daily objectives completed. Your combined 10-question daily review quiz is unlocked."
                  : `Check off all of today's tasks (${completedCount}/${tasks.length} completed) to unlock your daily quiz (+50 XP).`}
              </p>
            </div>
          </div>

          {allCompleted && !completedQuizTask && firstTask && (
            <Link
              href={`/tasks/${firstTask.id}/quiz`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shrink-0"
            >
              <Brain className="w-3.5 h-3.5" />
              Take Daily Quiz (10 Qs)
            </Link>
          )}
        </div>
      )}

      <div className="divide-y divide-border/40">
        {tasks.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No tasks found. Add a task to get started.
          </div>
        )}

        {tasks.map((task) => (
          <div key={task.id} className={`flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group ${isPending ? "opacity-50" : ""}`}>
            <input
              type="checkbox"
              checked={task.status === "COMPLETED"}
              onChange={() => handleToggle(task.id, task.status)}
              disabled={isPending}
              className="w-5 h-5 rounded border-muted-foreground/30 text-primary focus:ring-primary/50 cursor-pointer"
            />
            <div className="flex-1">
              <p className={`font-medium ${task.status === "COMPLETED" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                {task.dueDate && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                  {task.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {task.url && (
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Resource
                </a>
              )}
              <span className={`text-xs font-semibold px-2 py-1.5 rounded-md ${
                task.status === "COMPLETED" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
