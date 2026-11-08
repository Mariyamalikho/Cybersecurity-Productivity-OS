import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { getTkrsState } from "@/app/actions/tkrs";
import { TkrsWorkspace } from "@/components/revision/tkrs-workspace";

export const maxDuration = 60; // Allow AI generation to run up to 60s

export default async function RevisionPage() {
  const user = await ensureUserExists();

  const [notes, tkrsState] = await Promise.all([
    prisma.revisionNote.findMany({
      where: {
        userId: user.id,
        NOT: { category: { startsWith: "__" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    getTkrsState(),
  ]);

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Learning</span>
          <span>/</span>
          <span>Revisions &amp; Technical Knowledge Retention System (TKRS)</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 min-h-[0px]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              Technical Knowledge Retention &amp; Cornell Revisions
            </h1>
            <p className="text-muted-foreground">
              Combat the forgetting curve with adaptive R0–R7 spaced repetition, active recall testing, technical knowledge cards, 5-stage programming retention, mistake tracking, and Cornell notes.
            </p>
          </div>

          <TkrsWorkspace tkrsState={tkrsState} initialCornellNotes={notes} />
        </div>
      </div>
    </div>
  );
}
