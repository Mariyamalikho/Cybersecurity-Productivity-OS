import type { Metadata } from "next";
import { StrategyGuide } from "@/components/study/strategy-guide";
import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Master's & Fellowships Strategy Guide",
  description:
    "Comprehensive application strategy guide for international graduate programs, TA/RA funding outreach, fee waivers, and academic positioning.",
  alternates: { canonical: "/study-abroad/guide" },
};

export default async function GuidePage() {
  const user = await ensureUserExists();

  const configRecord = await prisma.revisionNote.findFirst({
    where: {
      userId: user.id,
      category: "__STRATEGY_GUIDE_CONFIG__",
    },
  });

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground font-medium w-full">
          <Link href="/study-abroad" className="hover:text-foreground transition-colors flex items-center gap-1 mr-2 sm:mr-4">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Tracker</span>
          </Link>
          <span className="text-foreground">Cyber Journey</span>
          <span aria-hidden="true">/</span>
          <Link href="/study-abroad" className="hover:text-foreground transition-colors">Study Abroad</Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground/90 font-semibold">Strategy Guide</span>
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-h-[0px]">
        <div className="max-w-5xl mx-auto">
          <StrategyGuide data={configRecord?.cues as any} />
        </div>
      </div>
    </div>
  );
}
