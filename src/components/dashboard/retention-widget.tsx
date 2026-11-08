"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BrainCircuit,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  Code2,
  Activity,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { DailyRetentionChecklistData } from "@/lib/tkrs";
import { toggleRetentionChecklistItem } from "@/app/actions/tkrs";

interface RetentionWidgetProps {
  tkrsState: {
    todayChecklist: DailyRetentionChecklistData;
    metrics: {
      conceptsLearnedToday: number;
      revisionsDueToday: number;
      overdueRevisions: number;
      upcomingRevisions: number;
      totalCards: number;
      activeProgrammingExercises: number;
      retentionPerformance: number;
      weeklyConsistency: number;
      reviewsCompletedToday: number;
      topicsNeedingAttention: string[];
    };
  };
}

const CHECKLIST_ITEMS: {
  key: keyof Omit<DailyRetentionChecklistData, "dateKey">;
  label: string;
}[] = [
  { key: "learnedConcepts", label: "Learned today's concepts." },
  { key: "createdCards", label: "Created knowledge cards." },
  { key: "recalledWithoutNotes", label: "Recalled concepts without notes." },
  { key: "completedPractical", label: "Completed practical exercises." },
  { key: "wroteCodeWithoutCopying", label: "Wrote code without copying." },
  { key: "reviewedPreviousMaterial", label: "Reviewed previously learned material." },
  { key: "updatedMistakeLibrary", label: "Updated the mistake library." },
];

export function RetentionWidget({ tkrsState }: RetentionWidgetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [checklist, setChecklist] = useState<DailyRetentionChecklistData>(
    tkrsState.todayChecklist
  );
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const { metrics } = tkrsState;

  const completedCount = CHECKLIST_ITEMS.filter((item) => checklist[item.key]).length;
  const checklistProgress = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  const handleToggleChecklist = (
    key: keyof Omit<DailyRetentionChecklistData, "dateKey">
  ) => {
    const nextValue = !checklist[key];
    setChecklist((prev) => ({ ...prev, [key]: nextValue }));
    setPendingKey(key);

    startTransition(async () => {
      try {
        await toggleRetentionChecklistItem(key);
        router.refresh();
      } catch {
        setChecklist((prev) => ({ ...prev, [key]: !nextValue }));
      } finally {
        setPendingKey(null);
      }
    });
  };

  return (
    <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-heading">
                Daily Knowledge Retention Overview (TKRS)
              </CardTitle>
              {metrics.overdueRevisions > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {metrics.overdueRevisions} Overdue
                </Badge>
              )}
              {metrics.revisionsDueToday > 0 && (
                <Badge variant="secondary" className="bg-amber-500/15 text-amber-400 border-amber-500/30">
                  {metrics.revisionsDueToday} Due Today
                </Badge>
              )}
            </div>
            <CardDescription>
              R0–R7 Spaced Repetition, Active Recall, Programming Retention, and Daily Retention Checklist
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/learning/revision">
              <Button size="sm" variant="default" className="gap-1.5">
                Open Retention System
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 cols: Retention Metrics & Topics Requiring Attention */}
          <div className="lg:col-span-8 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-border/50 bg-background/40">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Learned Today</span>
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-2xl font-heading font-bold">
                  {metrics.conceptsLearnedToday}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Concepts recorded
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-background/40">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Due Today</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl font-heading font-bold text-amber-400">
                  {metrics.revisionsDueToday}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {metrics.reviewsCompletedToday} reviewed today
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-background/40">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Overdue</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="text-2xl font-heading font-bold text-red-400">
                  {metrics.overdueRevisions}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Requires immediate recall
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-background/40">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Upcoming</span>
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-heading font-bold">
                  {metrics.upcomingRevisions}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Scheduled R1–R7
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-background/40">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Total Cards</span>
                  <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-2xl font-heading font-bold">
                  {metrics.totalCards}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Knowledge repository
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-background/40">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Active Coding</span>
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-2xl font-heading font-bold">
                  {metrics.activeProgrammingExercises}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  5-stage exercises
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-background/40">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Retention Rate</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-heading font-bold text-emerald-400">
                  {metrics.retentionPerformance}%
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Recall performance
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-background/40">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Weekly Consistency</span>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-2xl font-heading font-bold">
                  {metrics.weeklyConsistency}%
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  7-day active streak
                </div>
              </div>
            </div>

            {/* Topics Requiring Additional Attention */}
            <div className="p-4 rounded-xl border border-border/50 bg-background/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Topics Requiring Additional Attention
                </span>
                <Link
                  href="/learning/revision"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Review in Active Recall Studio
                </Link>
              </div>

              {metrics.topicsNeedingAttention.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No weak or forgotten concepts flagged. Complete active recall sessions or log debugging mistakes to surface priority topics here.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {metrics.topicsNeedingAttention.map((topic, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right 4 cols: Independent Daily Retention Checklist */}
          <div className="lg:col-span-4 p-4 rounded-xl border border-border/50 bg-background/40 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Daily Retention Checklist</h4>
                  <p className="text-xs text-muted-foreground">
                    Track daily retention habits independently
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {completedCount}/{CHECKLIST_ITEMS.length}
                </Badge>
              </div>

              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>

              <div className="space-y-1.5 pt-1">
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = Boolean(checklist[item.key]);
                  const isItemPending = isPending && pendingKey === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      disabled={isItemPending}
                      onClick={() => handleToggleChecklist(item.key)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors border ${
                        isChecked
                          ? "bg-primary/10 border-primary/30 text-foreground"
                          : "bg-background/40 border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={isChecked ? "line-through opacity-85" : ""}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
