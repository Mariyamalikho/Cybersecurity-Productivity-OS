import type { Metadata } from "next";
import { JournalClient } from "@/components/journal/journal-client";
import { getJournalEntries } from "@/app/actions/journal";

export const metadata: Metadata = {
  title: "Engineering Journal & Deep Work Reflection",
  description:
    "Daily technical notes, debugging breakthroughs, mindset logs, and deliberate practice reflections.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Cyber Journey</span>
          <span aria-hidden="true">/</span>
          <span className="text-foreground/90 font-semibold">Journal</span>
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-h-[0px]">
        <JournalClient entries={entries} />
      </div>
    </div>
  );
}
