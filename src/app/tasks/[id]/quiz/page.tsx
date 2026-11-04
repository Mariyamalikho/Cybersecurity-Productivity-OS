import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuizClient } from "./quiz-client";

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await ensureUserExists();
  if (!user) redirect("/sign-in");

  const task = await prisma.task.findUnique({
    where: { id, userId: user.id },
    include: { quizResult: true }
  });

  if (!task) return notFound();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const completedToday = await prisma.task.findMany({
    where: {
      userId: user.id,
      status: "COMPLETED",
      completedAt: { gte: startOfDay }
    },
    select: { title: true }
  });

  const topicList =
    completedToday.length > 0
      ? completedToday.map(t => t.title)
      : [task.title];

  const combinedTopics = topicList.join(" | ");

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <Link href="/tasks" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>Tasks</span>
          </Link>
          <span>/</span>
          <span className="text-foreground">Daily Synthesis Quiz</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 min-h-[0px]">
        <div className="max-w-3xl mx-auto space-y-6 pb-16">
          {task.quizResult ? (
            <div className="bg-card/50 border border-border/40 rounded-xl p-8 text-center space-y-4">
              <h1 className="text-3xl font-bold">Daily Quiz Completed</h1>
              <p className="text-muted-foreground text-lg">
                You scored {task.quizResult.score}/10 on today's synthesis quiz.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {topicList.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <Link
                href="/tasks"
                className="inline-block mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
              >
                Return to Tasks
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
                  Daily Synthesis Quiz
                </h1>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Testing all topics completed today ({topicList.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topicList.map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted/60 text-foreground border border-border/50 px-2.5 py-1 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <QuizClient taskId={task.id} taskTitle={combinedTopics} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
