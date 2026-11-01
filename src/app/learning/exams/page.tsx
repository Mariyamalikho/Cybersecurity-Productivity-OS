import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { ExamsClient } from "@/components/exams/exams-client";

export const maxDuration = 60; // Allow server actions called from this page to run for up to 60s

export default async function ExamsPage() {
  const user = await ensureUserExists();

  const pastResults = await prisma.examResult.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: "desc" },
    take: 10
  });

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Learning</span>
          <span>/</span>
          <span>Mastery Exams</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 min-h-[0px]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Mastery Exams</h1>
            <p className="text-muted-foreground">
              Test your long-term retention. These AI-generated exams dynamically pull from all the tasks you have completed over the past week or month.
            </p>
          </div>

          <ExamsClient pastResults={pastResults} />
        </div>
      </div>
    </div>
  );
}
