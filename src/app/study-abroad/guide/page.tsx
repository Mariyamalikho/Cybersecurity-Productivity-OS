import { StrategyGuide } from "@/components/study/strategy-guide";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium w-full">
          <Link href="/study-abroad" className="hover:text-foreground transition-colors flex items-center gap-1 mr-4">
            <ArrowLeft className="w-4 h-4" /> Back to Tracker
          </Link>
          <span className="text-foreground">Cyber Journey</span>
          <span>/</span>
          <Link href="/study-abroad" className="hover:text-foreground transition-colors">Study Abroad</Link>
          <span>/</span>
          <span>Master Strategy Guide</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 min-h-[0px]">
        <div className="max-w-5xl mx-auto">
          <StrategyGuide />
        </div>
      </div>
    </div>
  );
}
