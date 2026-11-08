"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrainCircuit,
  BookOpen,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  ArrowRight,
  Layers,
  Award,
  FileText,
} from "lucide-react";
import {
  KnowledgeCardRecord,
  ProgrammingExerciseRecord,
  MistakeEntryRecord,
  WeeklyAssessmentQuestion,
  WeeklyAssessmentReport,
  DailyRetentionChecklistData,
  RecallRating,
  QuestionType,
  DifficultyLevel,
  ProgrammingStageName,
  DEFAULT_REVISION_INTERVALS,
  buildActiveRecallQuestionsForCard,
} from "@/lib/tkrs";
import {
  upsertKnowledgeCard,
  deleteKnowledgeCard,
  syncCompletedTasksToCards,
  recordActiveRecallReview,
  rescheduleCardReview,
  upsertProgrammingExercise,
  deleteProgrammingExercise,
  upsertMistakeEntry,
  convertMistakeToCard,
  deleteMistakeEntry,
  generateWeeklyTkrsAssessment,
  submitWeeklyTkrsAssessment,
} from "@/app/actions/tkrs";
import { RevisionClient } from "@/components/revision/revision-client";

const TKRS_CATEGORIES = [
  "Computer Fundamentals",
  "IT Support",
  "Networking",
  "Cybersecurity",
  "Programming",
  "Software Development",
  "Linux & CLI",
  "Technical Concepts & Practical Skills",
];

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  DEFINITION: "1. Definition Recall",
  EXPLAIN_OWN_WORDS: "2. Explain in Own Words",
  MULTIPLE_CHOICE: "3. Multiple-Choice",
  FILL_BLANK: "4. Fill-in-the-Blank",
  COMMAND_RECALL: "5. Command Recall",
  CODE_REPRODUCTION: "6. Code Reproduction",
  DEBUGGING: "7. Debugging Analysis",
  PRACTICAL_SCENARIO: "8. Practical Scenario",
};

const PROG_STAGES: { key: ProgrammingStageName; step: number; label: string; desc: string }[] = [
  { key: "UNDERSTAND", step: 1, label: "1. Understand", desc: "Explain syntax, concept, or programming principle." },
  { key: "RECALL", step: 2, label: "2. Recall", desc: "Reproduce syntax from memory without looking at notes." },
  { key: "REPRODUCE", step: 3, label: "3. Reproduce", desc: "Recreate a previously studied program independently." },
  { key: "MODIFY", step: 4, label: "4. Modify", desc: "Change the original problem's requirements and solve it." },
  { key: "BUILD", step: 5, label: "5. Build", desc: "Apply the concept in a small independent project." },
];

interface TkrsWorkspaceProps {
  tkrsState: {
    cards: KnowledgeCardRecord[];
    overdueCards: KnowledgeCardRecord[];
    dueTodayCards: KnowledgeCardRecord[];
    upcomingCards: KnowledgeCardRecord[];
    programmingExercises: ProgrammingExerciseRecord[];
    mistakes: MistakeEntryRecord[];
    assessments: WeeklyAssessmentReport[];
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
  initialCornellNotes: any[];
}

export function TkrsWorkspace({ tkrsState, initialCornellNotes }: TkrsWorkspaceProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("queue");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Recall Studio state
  const [activeRecallCard, setActiveRecallCard] = useState<KnowledgeCardRecord | null>(
    tkrsState.overdueCards[0] || tkrsState.dueTodayCards[0] || tkrsState.cards[0] || null
  );
  const [questionIdx, setQuestionIdx] = useState(0);
  const [userRecallAnswer, setUserRecallAnswer] = useState("");
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [rescheduleDates, setRescheduleDates] = useState<Record<string, string>>({});

  // Knowledge Card filters & form state
  const [cardSearch, setCardSearch] = useState("");
  const [cardCategoryFilter, setCardCategoryFilter] = useState("ALL");
  const [cardStatusFilter, setCardStatusFilter] = useState("ALL");
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | undefined>(undefined);
  const [cardForm, setCardForm] = useState({
    topic: "",
    category: "Cybersecurity",
    difficulty: "Intermediate" as DifficultyLevel,
    definition: "",
    purpose: "",
    howItWorks: "",
    terminology: "",
    practicalExample: "",
    codeOrCommands: "",
    relatedConcepts: "",
    simpleExplanation: "",
    customQuestionPrompt: "",
    customQuestionAnswer: "",
  });

  // Programming Retention form state
  const [showProgForm, setShowProgForm] = useState(false);
  const [editingProgId, setEditingProgId] = useState<string | undefined>(undefined);
  const [progForm, setProgForm] = useState({
    title: "",
    language: "Python",
    conceptOrSyntax: "",
    difficulty: "Intermediate" as DifficultyLevel,
    codeExample: "",
    expectedOutput: "",
    userSolution: "",
    testCases: "",
    commonErrors: "",
    debuggingNotes: "",
    practicalExercises: "",
    understandNote: "",
    recallNote: "",
    reproduceNote: "",
    modifyNote: "",
    buildNote: "",
    stagesCompleted: [] as ProgrammingStageName[],
  });

  // Mistake Library form state
  const [showMistakeForm, setShowMistakeForm] = useState(false);
  const [editingMistakeId, setEditingMistakeId] = useState<string | undefined>(undefined);
  const [mistakeForm, setMistakeForm] = useState({
    problemOrError: "",
    relatedTopic: "",
    category: "Cybersecurity",
    errorMessage: "",
    whyItHappened: "",
    correctSolution: "",
    whatILearned: "",
    codeOrCommandExample: "",
    revisionStatus: "NEEDS_REVIEW" as "NEEDS_REVIEW" | "REVIEWED" | "CONVERTED_TO_CARD",
  });

  // Weekly Knowledge Assessment state
  const [assessmentQuestions, setAssessmentQuestions] = useState<WeeklyAssessmentQuestion[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});
  const [assessmentSelfGrades, setAssessmentSelfGrades] = useState<Record<string, boolean>>({});
  const [assessmentRevealed, setAssessmentRevealed] = useState(false);

  const notify = (msg: string, isErr = false) => {
    if (isErr) {
      setErrorMsg(msg);
      setFeedbackMsg(null);
    } else {
      setFeedbackMsg(msg);
      setErrorMsg(null);
    }
  };

  const startCardRecall = (card: KnowledgeCardRecord) => {
    setActiveRecallCard(card);
    setQuestionIdx(0);
    setUserRecallAnswer("");
    setIsAnswerRevealed(false);
    setActiveTab("queue");
  };

  const handleSyncFromTasks = () => {
    startTransition(async () => {
      try {
        const res = await syncCompletedTasksToCards();
        notify(`Synced ${res.createdCount} new Knowledge Card(s) with R0-R7 revision schedules.`);
        router.refresh();
      } catch (e: any) {
        notify(e.message || "Failed to sync cards", true);
      }
    });
  };

  const handleRateRecall = (rating: RecallRating, qType: QuestionType) => {
    if (!activeRecallCard) return;
    startTransition(async () => {
      try {
        const res = await recordActiveRecallReview(
          activeRecallCard.id,
          rating,
          qType,
          userRecallAnswer
        );
        notify(
          `Recorded ${rating} recall (+${res.xpReward} XP). Next review (${res.nextStage}) scheduled in ${res.intervalDays} day(s).`
        );
        setUserRecallAnswer("");
        setIsAnswerRevealed(false);
        router.refresh();
      } catch (e: any) {
        notify(e.message || "Failed to save recall evaluation", true);
      }
    });
  };

  const handleReschedule = (cardId: string, early = false) => {
    const dateStr = early
      ? new Date().toISOString()
      : rescheduleDates[cardId] || new Date().toISOString();
    startTransition(async () => {
      try {
        await rescheduleCardReview(cardId, dateStr, early);
        notify(early ? "Moved concept to immediate early review." : "Revision rescheduled.");
        router.refresh();
      } catch (e: any) {
        notify(e.message || "Failed to reschedule", true);
      }
    });
  };

  const openEditCard = (card: KnowledgeCardRecord) => {
    setEditingCardId(card.id);
    setCardForm({
      topic: card.data.topic,
      category: card.data.category,
      difficulty: card.data.difficulty,
      definition: card.data.definition,
      purpose: card.data.purpose,
      howItWorks: card.data.howItWorks,
      terminology: (card.data.terminology || []).join(", "),
      practicalExample: card.data.practicalExample,
      codeOrCommands: card.data.codeOrCommands,
      relatedConcepts: (card.data.relatedConcepts || []).join(", "),
      simpleExplanation: card.data.simpleExplanation,
      customQuestionPrompt: card.data.selfAssessmentQuestions?.[0]?.prompt || "",
      customQuestionAnswer: card.data.selfAssessmentQuestions?.[0]?.expectedAnswer || "",
    });
    setShowCardForm(true);
  };

  const handleSaveCard = () => {
    startTransition(async () => {
      try {
        const customQuestions =
          cardForm.customQuestionPrompt.trim() && cardForm.customQuestionAnswer.trim()
            ? [
                {
                  questionType: "DEFINITION" as QuestionType,
                  prompt: cardForm.customQuestionPrompt.trim(),
                  expectedAnswer: cardForm.customQuestionAnswer.trim(),
                },
              ]
            : [];

        await upsertKnowledgeCard(
          {
            topic: cardForm.topic,
            category: cardForm.category,
            difficulty: cardForm.difficulty,
            definition: cardForm.definition,
            purpose: cardForm.purpose,
            howItWorks: cardForm.howItWorks,
            terminology: cardForm.terminology
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            practicalExample: cardForm.practicalExample,
            codeOrCommands: cardForm.codeOrCommands,
            relatedConcepts: cardForm.relatedConcepts
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            simpleExplanation: cardForm.simpleExplanation,
            selfAssessmentQuestions: customQuestions,
          },
          editingCardId
        );

        notify(editingCardId ? "Knowledge Card updated." : "Knowledge Card created with R0-R7 schedule (+15 XP).");
        setShowCardForm(false);
        setEditingCardId(undefined);
        router.refresh();
      } catch (e: any) {
        notify(e.message || "Failed to save Knowledge Card", true);
      }
    });
  };

  const openEditProg = (item: ProgrammingExerciseRecord) => {
    setEditingProgId(item.id);
    setProgForm({
      title: item.data.title,
      language: item.data.language,
      conceptOrSyntax: item.data.conceptOrSyntax,
      difficulty: item.data.difficulty,
      codeExample: item.data.codeExample,
      expectedOutput: item.data.expectedOutput,
      userSolution: item.data.userSolution,
      testCases: (item.data.testCases || []).join("\n"),
      commonErrors: item.data.commonErrors,
      debuggingNotes: item.data.debuggingNotes,
      practicalExercises: item.data.practicalExercises,
      understandNote: item.data.stageNotes?.understand || "",
      recallNote: item.data.stageNotes?.recall || "",
      reproduceNote: item.data.stageNotes?.reproduce || "",
      modifyNote: item.data.stageNotes?.modify || "",
      buildNote: item.data.stageNotes?.build || "",
      stagesCompleted: item.data.stagesCompleted || [],
    });
    setShowProgForm(true);
  };

  const handleSaveProg = () => {
    startTransition(async () => {
      try {
        await upsertProgrammingExercise(
          {
            title: progForm.title,
            language: progForm.language,
            conceptOrSyntax: progForm.conceptOrSyntax,
            difficulty: progForm.difficulty,
            codeExample: progForm.codeExample,
            expectedOutput: progForm.expectedOutput,
            userSolution: progForm.userSolution,
            testCases: progForm.testCases
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            commonErrors: progForm.commonErrors,
            debuggingNotes: progForm.debuggingNotes,
            practicalExercises: progForm.practicalExercises,
            stageNotes: {
              understand: progForm.understandNote,
              recall: progForm.recallNote,
              reproduce: progForm.reproduceNote,
              modify: progForm.modifyNote,
              build: progForm.buildNote,
            },
            stagesCompleted: progForm.stagesCompleted,
          },
          editingProgId
        );
        notify("Programming retention exercise saved (+20 XP).");
        setShowProgForm(false);
        setEditingProgId(undefined);
        router.refresh();
      } catch (e: any) {
        notify(e.message || "Failed to save programming exercise", true);
      }
    });
  };

  const handleSaveMistake = () => {
    startTransition(async () => {
      try {
        await upsertMistakeEntry(mistakeForm, editingMistakeId);
        notify("Mistake & Problem entry saved.");
        setShowMistakeForm(false);
        setEditingMistakeId(undefined);
        router.refresh();
      } catch (e: any) {
        notify(e.message || "Failed to save mistake entry", true);
      }
    });
  };

  const handleConvertMistake = (mistakeId: string) => {
    startTransition(async () => {
      try {
        await convertMistakeToCard(mistakeId);
        notify("Converted mistake into a Knowledge Card and scheduled R0-R7 revisions.");
        router.refresh();
      } catch (e: any) {
        notify(e.message || "Failed to convert mistake", true);
      }
    });
  };

  const handleStartWeeklyAssessment = () => {
    startTransition(async () => {
      try {
        const res = await generateWeeklyTkrsAssessment();
        setAssessmentQuestions(res.questions);
        setAssessmentAnswers({});
        setAssessmentSelfGrades({});
        setAssessmentRevealed(false);
        notify(`Generated ${res.questions.length} assessment questions from your recorded material.`);
      } catch (e: any) {
        notify(e.message || "Unable to generate assessment", true);
      }
    });
  };

  const handleSubmitWeeklyAssessment = () => {
    startTransition(async () => {
      try {
        const payload = assessmentQuestions.map((q) => ({
          questionId: q.id,
          area: q.area,
          topic: q.topic,
          prompt: q.prompt,
          userAnswer: assessmentAnswers[q.id] || "",
          expectedAnswer: q.expectedAnswer,
          isCorrect: Boolean(assessmentSelfGrades[q.id]),
        }));
        const res = await submitWeeklyTkrsAssessment(payload);
        setAssessmentQuestions([]);
        notify(`Weekly Knowledge Assessment saved. Overall weighted score: ${res.report.overallScore}%.`);
        router.refresh();
      } catch (e: any) {
        notify(e.message || "Failed to submit assessment", true);
      }
    });
  };

  const filteredCards = tkrsState.cards.filter((c) => {
    const matchesSearch =
      !cardSearch.trim() ||
      c.data.topic.toLowerCase().includes(cardSearch.toLowerCase()) ||
      c.data.definition.toLowerCase().includes(cardSearch.toLowerCase()) ||
      c.data.category.toLowerCase().includes(cardSearch.toLowerCase());
    const matchesCat =
      cardCategoryFilter === "ALL" || c.data.category === cardCategoryFilter;
    const matchesStatus =
      cardStatusFilter === "ALL" || c.data.retentionStatus === cardStatusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const activeCardQuestions = activeRecallCard
    ? buildActiveRecallQuestionsForCard(activeRecallCard.data)
    : [];
  const currentQuestion =
    activeCardQuestions[questionIdx % Math.max(1, activeCardQuestions.length)];

  return (
    <div className="space-y-6">
      {/* Top Retention KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        <MetricTile label="Learned Today" value={tkrsState.metrics.conceptsLearnedToday} />
        <MetricTile
          label="Due Today"
          value={tkrsState.metrics.revisionsDueToday}
          highlight={tkrsState.metrics.revisionsDueToday > 0 ? "text-blue-400" : undefined}
        />
        <MetricTile
          label="Overdue"
          value={tkrsState.metrics.overdueRevisions}
          highlight={tkrsState.metrics.overdueRevisions > 0 ? "text-orange-500" : undefined}
        />
        <MetricTile label="Upcoming" value={tkrsState.metrics.upcomingRevisions} />
        <MetricTile label="Knowledge Cards" value={tkrsState.metrics.totalCards} />
        <MetricTile label="Code Labs" value={tkrsState.metrics.activeProgrammingExercises} />
        <MetricTile
          label="Retention Rate"
          value={`${tkrsState.metrics.retentionPerformance}%`}
          highlight="text-green-500"
        />
        <MetricTile label="7d Consistency" value={`${tkrsState.metrics.weeklyConsistency}%`} />
      </div>

      {/* Feedback Banner */}
      {(feedbackMsg || errorMsg) && (
        <div
          className={`p-3 rounded-xl border text-sm flex items-center justify-between ${
            errorMsg
              ? "bg-destructive/10 border-destructive/40 text-destructive"
              : "bg-primary/10 border-primary/30 text-foreground"
          }`}
        >
          <span>{errorMsg || feedbackMsg}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFeedbackMsg(null);
              setErrorMsg(null);
            }}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Main TKRS Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap w-full h-auto p-1.5 bg-card/60 backdrop-blur-md gap-1.5 border border-border/50 rounded-xl">
          <TabsTrigger value="queue" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <BrainCircuit className="w-4 h-4 shrink-0 text-primary" />
            <span>Spaced Repetition</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <Layers className="w-4 h-4 shrink-0 text-blue-400" />
            <span>Knowledge Cards</span>
            <span className="px-1.5 py-0.5 rounded-full bg-muted/80 text-[11px] font-mono text-muted-foreground">
              {tkrsState.cards.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="programming" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <Code2 className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>Programming Lab</span>
          </TabsTrigger>
          <TabsTrigger value="mistakes" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Mistake Library</span>
            <span className="px-1.5 py-0.5 rounded-full bg-muted/80 text-[11px] font-mono text-muted-foreground">
              {tkrsState.mistakes.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="assessment" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <Award className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Weekly Assessment</span>
          </TabsTrigger>
          <TabsTrigger value="cornell" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 shrink-0 text-purple-400" />
            <span>Cornell Notes</span>
            <span className="px-1.5 py-0.5 rounded-full bg-muted/80 text-[11px] font-mono text-muted-foreground">
              {initialCornellNotes.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SPACED REPETITION ENGINE (R0-R7) & ACTIVE RECALL STUDIO */}
        <TabsContent value="queue" className="mt-6 space-y-6">
          {/* R0-R7 Default Schedule Reference Bar */}
          <Card className="border-border/40 bg-card/30">
            <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Spaced Repetition Schedule Matrix (R0 to R7)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Adaptive intervals adjust dynamically based on Easy, Moderate, Difficult, or Forgot recall performance.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_REVISION_INTERVALS.map((iv) => (
                  <div
                    key={iv.stage}
                    className="px-2.5 py-1 rounded-md bg-muted/50 border border-border/40 text-xs font-mono"
                    title={iv.label}
                  >
                    <span className="font-bold text-primary">{iv.stage}:</span>{" "}
                    <span className="text-muted-foreground">
                      {iv.days === 0 ? "0d (Immediate)" : `+${iv.days}d`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column: Revision Queues (Overdue, Due Today, Upcoming) */}
            <div className="xl:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg">Revision Queue</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSyncFromTasks}
                  disabled={isPending}
                  className="gap-1.5 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Sync Completed Tasks
                </Button>
              </div>

              {/* Overdue */}
              {tkrsState.overdueCards.length > 0 && (
                <Card className="border-orange-500/40 bg-orange-500/5">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-semibold text-orange-400 flex items-center justify-between">
                      <span>Overdue Revisions</span>
                      <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                        {tkrsState.overdueCards.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 space-y-2">
                    {tkrsState.overdueCards.map((c) => (
                      <QueueCardRow
                        key={c.id}
                        card={c}
                        isSelected={activeRecallCard?.id === c.id}
                        onSelect={() => startCardRecall(c)}
                        rescheduleVal={rescheduleDates[c.id] || ""}
                        onRescheduleChange={(v) =>
                          setRescheduleDates((prev) => ({ ...prev, [c.id]: v }))
                        }
                        onReschedule={() => handleReschedule(c.id, false)}
                        onEarlyReview={() => handleReschedule(c.id, true)}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Due Today */}
              <Card className="border-border/40 bg-card/30">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>Due Today</span>
                    <Badge variant="secondary">{tkrsState.dueTodayCards.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2">
                  {tkrsState.dueTodayCards.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">
                      No revisions remaining for today. You can trigger an early review on any upcoming concept below.
                    </p>
                  ) : (
                    tkrsState.dueTodayCards.map((c) => (
                      <QueueCardRow
                        key={c.id}
                        card={c}
                        isSelected={activeRecallCard?.id === c.id}
                        onSelect={() => startCardRecall(c)}
                        rescheduleVal={rescheduleDates[c.id] || ""}
                        onRescheduleChange={(v) =>
                          setRescheduleDates((prev) => ({ ...prev, [c.id]: v }))
                        }
                        onReschedule={() => handleReschedule(c.id, false)}
                        onEarlyReview={() => handleReschedule(c.id, true)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Upcoming */}
              <Card className="border-border/40 bg-card/30">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>Upcoming Scheduled Revisions</span>
                    <Badge variant="outline">{tkrsState.upcomingCards.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-2 max-h-[320px] overflow-y-auto">
                  {tkrsState.upcomingCards.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">
                      No upcoming revisions scheduled yet. Create a Knowledge Card or complete a daily task to initialize R0-R7.
                    </p>
                  ) : (
                    tkrsState.upcomingCards.map((c) => (
                      <QueueCardRow
                        key={c.id}
                        card={c}
                        isSelected={activeRecallCard?.id === c.id}
                        onSelect={() => startCardRecall(c)}
                        rescheduleVal={rescheduleDates[c.id] || ""}
                        onRescheduleChange={(v) =>
                          setRescheduleDates((prev) => ({ ...prev, [c.id]: v }))
                        }
                        onReschedule={() => handleReschedule(c.id, false)}
                        onEarlyReview={() => handleReschedule(c.id, true)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Active Recall Testing Studio */}
            <div className="xl:col-span-7 space-y-4">
              <Card className="border-border/40 bg-card/40">
                <CardHeader className="border-b border-border/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg font-heading">Active Recall Testing Studio</CardTitle>
                      <CardDescription>
                        Retrieve the concept from memory before revealing the reference answer.
                      </CardDescription>
                    </div>
                    {activeRecallCard && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          Stage R{activeRecallCard.revision.currentStage}
                        </Badge>
                        <Badge variant="secondary">{activeRecallCard.data.category}</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {!activeRecallCard ? (
                    <div className="text-center py-12 space-y-3">
                      <BrainCircuit className="w-10 h-10 mx-auto text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        Select any concept from the Revision Queue or create a Knowledge Card to begin Active Recall testing.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveTab("cards");
                          setShowCardForm(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1.5" /> Create Knowledge Card
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Question Type Selector */}
                      <div className="flex flex-wrap gap-1.5">
                        {activeCardQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setQuestionIdx(idx);
                              setIsAnswerRevealed(false);
                            }}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                              questionIdx === idx
                                ? "bg-primary/15 border-primary text-primary"
                                : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {QUESTION_TYPE_LABELS[q.questionType]}
                          </button>
                        ))}
                      </div>

                      {/* Question Prompt */}
                      {currentQuestion && (
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2">
                          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {QUESTION_TYPE_LABELS[currentQuestion.questionType]}
                          </div>
                          <p className="text-base font-medium text-foreground leading-relaxed">
                            {currentQuestion.prompt}
                          </p>
                          {currentQuestion.hint && !isAnswerRevealed && (
                            <p className="text-xs text-muted-foreground italic">
                              Cue: {currentQuestion.hint}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Multiple Choice Options if applicable */}
                      {currentQuestion?.questionType === "MULTIPLE_CHOICE" &&
                        currentQuestion.options && (
                          <div className="space-y-2">
                            {currentQuestion.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => setUserRecallAnswer(opt)}
                                className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                                  userRecallAnswer === opt
                                    ? "border-primary bg-primary/10 text-foreground"
                                    : "border-border/40 bg-background/40 text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                      {/* User Memory Retrieval Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Your Recall Response (Write from memory before revealing)
                        </label>
                        <Textarea
                          value={userRecallAnswer}
                          onChange={(e) => setUserRecallAnswer(e.target.value)}
                          placeholder="Type definition, explanation, command, or code from memory..."
                          rows={4}
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>

                      {/* Reveal Toggle */}
                      {!isAnswerRevealed ? (
                        <Button
                          onClick={() => setIsAnswerRevealed(true)}
                          className="w-full gap-2"
                          variant="secondary"
                        >
                          <Eye className="w-4 h-4" /> Reveal Reference Answer & Evaluate Recall
                        </Button>
                      ) : (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-green-400">
                                Reference Answer & Technical Details
                              </span>
                              <button
                                type="button"
                                onClick={() => setIsAnswerRevealed(false)}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                              >
                                <EyeOff className="w-3.5 h-3.5" /> Hide
                              </button>
                            </div>
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                              {currentQuestion?.expectedAnswer}
                            </p>
                            {activeRecallCard.data.codeOrCommands && (
                              <pre className="p-3 rounded-lg bg-background/80 border border-border/40 font-mono text-xs overflow-x-auto text-muted-foreground">
                                {activeRecallCard.data.codeOrCommands}
                              </pre>
                            )}
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Rate Your Recall Performance (Determines Next Adaptive Review Date)
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <Button
                                onClick={() =>
                                  handleRateRecall("EASY", currentQuestion?.questionType || "DEFINITION")
                                }
                                disabled={isPending}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                              >
                                Easy (+Interval)
                              </Button>
                              <Button
                                onClick={() =>
                                  handleRateRecall("MODERATE", currentQuestion?.questionType || "DEFINITION")
                                }
                                disabled={isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                              >
                                Moderate (Planned)
                              </Button>
                              <Button
                                onClick={() =>
                                  handleRateRecall("DIFFICULT", currentQuestion?.questionType || "DEFINITION")
                                }
                                disabled={isPending}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                              >
                                Difficult (Earlier)
                              </Button>
                              <Button
                                onClick={() =>
                                  handleRateRecall("FORGOT", currentQuestion?.questionType || "DEFINITION")
                                }
                                disabled={isPending}
                                variant="destructive"
                                className="text-xs"
                              >
                                Forgot (Reset Stage)
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* R0-R7 Stage Progress & History for Selected Card */}
                      <div className="pt-4 border-t border-border/40 space-y-3">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Card R0–R7 Progression & History
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                          {(activeRecallCard.revision.schedule || []).map((st) => (
                            <div
                              key={st.stage}
                              className={`p-2 rounded-lg border text-center text-xs ${
                                st.status === "COMPLETED"
                                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                                  : st.stageIndex === activeRecallCard.revision.currentStage
                                  ? "border-primary bg-primary/15 text-primary font-bold"
                                  : "border-border/40 bg-background/30 text-muted-foreground"
                              }`}
                            >
                              <div>{st.stage}</div>
                              <div className="text-[10px] opacity-80">
                                {new Date(st.plannedDate).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {activeRecallCard.revision.history?.length > 0 && (
                          <div className="space-y-1 max-h-32 overflow-y-auto pt-1">
                            {activeRecallCard.revision.history.slice(0, 5).map((h) => (
                              <div
                                key={h.id}
                                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-muted/20 text-muted-foreground"
                              >
                                <span>
                                  <strong>{h.stage}</strong> • {QUESTION_TYPE_LABELS[h.questionType] || h.questionType}
                                </span>
                                <span className="font-mono">
                                  {h.rating} &rarr; +{h.intervalDays}d (
                                  {new Date(h.reviewedAt).toLocaleDateString()})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: KNOWLEDGE CARDS LIBRARY */}
        <TabsContent value="cards" className="mt-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-card/40 p-4 rounded-xl border border-border/40">
            <div className="flex flex-1 flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                  placeholder="Search topic, definition, category..."
                  className="pl-9 text-sm"
                />
              </div>
              <select
                value={cardCategoryFilter}
                onChange={(e) => setCardCategoryFilter(e.target.value)}
                className="h-9 rounded-md border border-border bg-background px-3 text-xs"
              >
                <option value="ALL">All Categories</option>
                {TKRS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={cardStatusFilter}
                onChange={(e) => setCardStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-border bg-background px-3 text-xs"
              >
                <option value="ALL">All Retention States</option>
                <option value="NEW">New</option>
                <option value="REVIEWING">Reviewing</option>
                <option value="REINFORCING">Reinforcing</option>
                <option value="NEEDS_ATTENTION">Needs Attention</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSyncFromTasks} disabled={isPending}>
                <RefreshCw className="w-4 h-4 mr-1.5" /> Auto-Import Learned Topics
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setEditingCardId(undefined);
                  setCardForm({
                    topic: "",
                    category: "Cybersecurity",
                    difficulty: "Intermediate",
                    definition: "",
                    purpose: "",
                    howItWorks: "",
                    terminology: "",
                    practicalExample: "",
                    codeOrCommands: "",
                    relatedConcepts: "",
                    simpleExplanation: "",
                    customQuestionPrompt: "",
                    customQuestionAnswer: "",
                  });
                  setShowCardForm(!showCardForm);
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" /> New Knowledge Card
              </Button>
            </div>
          </div>

          {showCardForm && (
            <Card className="border-primary/40 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingCardId ? "Edit Technical Knowledge Card" : "Create Technical Knowledge Card"}
                </CardTitle>
                <CardDescription>
                  Automatically initializes R0–R7 spaced repetition dates and 8-mode active recall prompts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Topic Name *</label>
                    <Input
                      value={cardForm.topic}
                      onChange={(e) => setCardForm({ ...cardForm, topic: e.target.value })}
                      placeholder="e.g., OSI Layer 2 Data Link / ARP Spoofing"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Category</label>
                    <select
                      value={cardForm.category}
                      onChange={(e) => setCardForm({ ...cardForm, category: e.target.value })}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                    >
                      {TKRS_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Difficulty Level</label>
                    <select
                      value={cardForm.difficulty}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, difficulty: e.target.value as DifficultyLevel })
                      }
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Core Definition *</label>
                    <Textarea
                      value={cardForm.definition}
                      onChange={(e) => setCardForm({ ...cardForm, definition: e.target.value })}
                      placeholder="Concise technical definition..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Purpose / Why It Matters</label>
                    <Textarea
                      value={cardForm.purpose}
                      onChange={(e) => setCardForm({ ...cardForm, purpose: e.target.value })}
                      placeholder="What problem does this solve in systems/security?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">How It Works (Mechanism)</label>
                    <Textarea
                      value={cardForm.howItWorks}
                      onChange={(e) => setCardForm({ ...cardForm, howItWorks: e.target.value })}
                      placeholder="Step-by-step internal flow or protocol mechanics..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Simple Explanation (Feynman Style)</label>
                    <Textarea
                      value={cardForm.simpleExplanation}
                      onChange={(e) => setCardForm({ ...cardForm, simpleExplanation: e.target.value })}
                      placeholder="Plain-language explanation in your own words..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Practical Example / Scenario</label>
                    <Textarea
                      value={cardForm.practicalExample}
                      onChange={(e) => setCardForm({ ...cardForm, practicalExample: e.target.value })}
                      placeholder="Real-world networking, Linux, or Python use case..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Commands or Code Snippets</label>
                    <Textarea
                      value={cardForm.codeOrCommands}
                      onChange={(e) => setCardForm({ ...cardForm, codeOrCommands: e.target.value })}
                      placeholder="e.g., tcpdump -i eth0 port 443 or Python snippet..."
                      className="font-mono text-xs"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Important Terminology (comma-separated)</label>
                    <Input
                      value={cardForm.terminology}
                      onChange={(e) => setCardForm({ ...cardForm, terminology: e.target.value })}
                      placeholder="PDU, Frame, MAC Address, Switch..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Related Concepts (comma-separated)</label>
                    <Input
                      value={cardForm.relatedConcepts}
                      onChange={(e) => setCardForm({ ...cardForm, relatedConcepts: e.target.value })}
                      placeholder="VLAN, STP, ARP..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Custom Self-Assessment Question (Optional)</label>
                    <Input
                      value={cardForm.customQuestionPrompt}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, customQuestionPrompt: e.target.value })
                      }
                      placeholder="Question to test yourself during Active Recall..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Custom Question Expected Answer</label>
                    <Input
                      value={cardForm.customQuestionAnswer}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, customQuestionAnswer: e.target.value })
                      }
                      placeholder="Expected answer..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setShowCardForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCard} disabled={isPending}>
                    Save Knowledge Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredCards.length === 0 ? (
            <Card className="border-border/40 bg-card/20">
              <CardContent className="py-16 text-center space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No Knowledge Cards match your filter yet. Create one manually or click Auto-Import Learned Topics.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map((card) => (
                <Card key={card.id} className="border-border/40 bg-card/30 flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <Badge variant="secondary" className="text-[11px]">
                            {card.data.category}
                          </Badge>
                          <Badge variant="outline" className="text-[11px] font-mono">
                            R{card.revision.currentStage}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              card.data.retentionStatus === "NEEDS_ATTENTION"
                                ? "border-orange-500/50 text-orange-400 text-[11px]"
                                : card.data.retentionStatus === "REINFORCING"
                                ? "border-green-500/50 text-green-400 text-[11px]"
                                : "text-[11px]"
                            }
                          >
                            {card.data.retentionStatus}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            {card.data.difficulty}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-heading">{card.data.topic}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => openEditCard(card)}
                          title="Edit Card"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() =>
                            startTransition(async () => {
                              await deleteKnowledgeCard(card.id);
                              router.refresh();
                            })
                          }
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 text-xs">
                    <p className="text-foreground/90 leading-relaxed">{card.data.definition}</p>
                    {card.data.howItWorks && (
                      <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 text-muted-foreground">
                        <strong className="text-foreground">How it works: </strong>
                        {card.data.howItWorks}
                      </div>
                    )}
                    {card.data.codeOrCommands && (
                      <pre className="p-2.5 rounded-lg bg-background/80 border border-border/40 font-mono text-[11px] overflow-x-auto text-muted-foreground">
                        {card.data.codeOrCommands}
                      </pre>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-muted-foreground">
                      <span>
                        Next Review:{" "}
                        <strong className="text-foreground">
                          {new Date(card.data.nextReviewDate).toLocaleDateString()}
                        </strong>
                      </span>
                      <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => startCardRecall(card)}>
                        Test Active Recall <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: PROGRAMMING RETENTION (5-STAGE WORKFLOW) */}
        <TabsContent value="programming" className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 p-4 rounded-xl border border-border/40">
            <div>
              <h3 className="font-heading font-bold text-lg">
                5-Stage Programming Retention Workflow
              </h3>
              <p className="text-xs text-muted-foreground">
                1. Understand &rarr; 2. Recall &rarr; 3. Reproduce &rarr; 4. Modify &rarr; 5. Build
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingProgId(undefined);
                setProgForm({
                  title: "",
                  language: "Python",
                  conceptOrSyntax: "",
                  difficulty: "Intermediate",
                  codeExample: "",
                  expectedOutput: "",
                  userSolution: "",
                  testCases: "",
                  commonErrors: "",
                  debuggingNotes: "",
                  practicalExercises: "",
                  understandNote: "",
                  recallNote: "",
                  reproduceNote: "",
                  modifyNote: "",
                  buildNote: "",
                  stagesCompleted: [],
                });
                setShowProgForm(!showProgForm);
              }}
            >
              <Plus className="w-4 h-4 mr-1.5" /> New Programming Exercise
            </Button>
          </div>

          {showProgForm && (
            <Card className="border-primary/40 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingProgId ? "Update Programming Retention Lab" : "Log Programming Retention Lab"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold">Exercise / Concept Title *</label>
                    <Input
                      value={progForm.title}
                      onChange={(e) => setProgForm({ ...progForm, title: e.target.value })}
                      placeholder="e.g., Socket Port Scanner / Dictionary Log Parser"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Language</label>
                    <Input
                      value={progForm.language}
                      onChange={(e) => setProgForm({ ...progForm, language: e.target.value })}
                      placeholder="Python, Bash, C, SQL..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Difficulty</label>
                    <select
                      value={progForm.difficulty}
                      onChange={(e) =>
                        setProgForm({ ...progForm, difficulty: e.target.value as DifficultyLevel })
                      }
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* 5-Stage Checkboxes */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Completed Retention Stages (Click to toggle)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {PROG_STAGES.map((st) => {
                      const done = progForm.stagesCompleted.includes(st.key);
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => {
                            const next = done
                              ? progForm.stagesCompleted.filter((k) => k !== st.key)
                              : [...progForm.stagesCompleted, st.key];
                            setProgForm({ ...progForm, stagesCompleted: next });
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            done
                              ? "border-green-500/50 bg-green-500/10 text-foreground"
                              : "border-border/40 bg-background/40 text-muted-foreground"
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>{st.label}</span>
                            {done && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                          </div>
                          <p className="text-[11px] mt-1 opacity-80">{st.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Concept & Syntax Summary (Stage 1: Understand)</label>
                    <Textarea
                      value={progForm.conceptOrSyntax}
                      onChange={(e) => setProgForm({ ...progForm, conceptOrSyntax: e.target.value })}
                      placeholder="Explain the syntax rules, parameters, and return behavior..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Practical Variations / Modify Prompt (Stage 4 & 5)</label>
                    <Textarea
                      value={progForm.practicalExercises}
                      onChange={(e) => setProgForm({ ...progForm, practicalExercises: e.target.value })}
                      placeholder="How did you modify requirements or apply this in a mini-project?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Reference Code Example</label>
                    <Textarea
                      value={progForm.codeExample}
                      onChange={(e) => setProgForm({ ...progForm, codeExample: e.target.value })}
                      className="font-mono text-xs"
                      rows={4}
                      placeholder="Reference code snippet..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Your Reproduced / Modified Solution (Stage 2–5)</label>
                    <Textarea
                      value={progForm.userSolution}
                      onChange={(e) => setProgForm({ ...progForm, userSolution: e.target.value })}
                      className="font-mono text-xs"
                      rows={4}
                      placeholder="Write your independent code implementation from memory..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Expected Output & Test Cases (one per line)</label>
                    <Textarea
                      value={progForm.expectedOutput}
                      onChange={(e) => setProgForm({ ...progForm, expectedOutput: e.target.value })}
                      className="font-mono text-xs"
                      rows={2}
                      placeholder="Expected output and edge-case inputs..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Common Errors & Debugging Notes</label>
                    <Textarea
                      value={progForm.debuggingNotes}
                      onChange={(e) => setProgForm({ ...progForm, debuggingNotes: e.target.value })}
                      rows={2}
                      placeholder="Off-by-one issues, type mismatches, exception handling..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowProgForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProg} disabled={isPending}>
                    Save Programming Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {tkrsState.programmingExercises.length === 0 ? (
            <Card className="border-border/40 bg-card/20">
              <CardContent className="py-16 text-center space-y-3">
                <Code2 className="w-10 h-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No programming retention exercises logged yet. Click New Programming Exercise to track your 5-stage mastery.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tkrsState.programmingExercises.map((ex) => (
                <Card key={ex.id} className="border-border/40 bg-card/30">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{ex.data.language}</Badge>
                        <CardTitle className="text-lg font-heading">{ex.data.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {ex.data.completionStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditProg(ex)}>
                          <Edit3 className="w-3.5 h-3.5 mr-1" /> Update Stages
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() =>
                            startTransition(async () => {
                              await deleteProgrammingExercise(ex.id);
                              router.refresh();
                            })
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {PROG_STAGES.map((st) => {
                        const done = ex.data.stagesCompleted?.includes(st.key);
                        return (
                          <div
                            key={st.key}
                            className={`p-2 rounded-lg border text-center font-medium ${
                              done
                                ? "border-green-500/40 bg-green-500/10 text-green-400"
                                : "border-border/40 bg-muted/20 text-muted-foreground"
                            }`}
                          >
                            {st.label}
                          </div>
                        );
                      })}
                    </div>
                    {ex.data.conceptOrSyntax && (
                      <p className="text-muted-foreground">{ex.data.conceptOrSyntax}</p>
                    )}
                    {ex.data.userSolution && (
                      <pre className="p-3 rounded-lg bg-background/80 border border-border/40 font-mono text-xs overflow-x-auto">
                        {ex.data.userSolution}
                      </pre>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 4: MISTAKE & PROBLEM LIBRARY */}
        <TabsContent value="mistakes" className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 p-4 rounded-xl border border-border/40">
            <div>
              <h3 className="font-heading font-bold text-lg">Mistake & Problem Library</h3>
              <p className="text-xs text-muted-foreground">
                Log technical errors, root causes, and fixes, then convert them into Knowledge Cards with 1 click.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingMistakeId(undefined);
                setMistakeForm({
                  problemOrError: "",
                  relatedTopic: "",
                  category: "Cybersecurity",
                  errorMessage: "",
                  whyItHappened: "",
                  correctSolution: "",
                  whatILearned: "",
                  codeOrCommandExample: "",
                  revisionStatus: "NEEDS_REVIEW",
                });
                setShowMistakeForm(!showMistakeForm);
              }}
            >
              <Plus className="w-4 h-4 mr-1.5" /> Log Technical Mistake
            </Button>
          </div>

          {showMistakeForm && (
            <Card className="border-primary/40 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Record Technical Mistake or Learning Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Problem or Error *</label>
                    <Input
                      value={mistakeForm.problemOrError}
                      onChange={(e) =>
                        setMistakeForm({ ...mistakeForm, problemOrError: e.target.value })
                      }
                      placeholder="e.g., TypeError when concatenating str and int in Python"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Related Topic *</label>
                    <Input
                      value={mistakeForm.relatedTopic}
                      onChange={(e) =>
                        setMistakeForm({ ...mistakeForm, relatedTopic: e.target.value })
                      }
                      placeholder="e.g., Python Data Types & Casting"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Category</label>
                    <select
                      value={mistakeForm.category}
                      onChange={(e) => setMistakeForm({ ...mistakeForm, category: e.target.value })}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                    >
                      {TKRS_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Exact Error Message (if applicable)</label>
                    <Input
                      value={mistakeForm.errorMessage}
                      onChange={(e) =>
                        setMistakeForm({ ...mistakeForm, errorMessage: e.target.value })
                      }
                      className="font-mono text-xs"
                      placeholder="TypeError: can only concatenate str (not 'int') to str"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Why It Happened (Root Cause)</label>
                    <Input
                      value={mistakeForm.whyItHappened}
                      onChange={(e) =>
                        setMistakeForm({ ...mistakeForm, whyItHappened: e.target.value })
                      }
                      placeholder="input() returns a string by default unless cast with int()..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Correct Solution</label>
                    <Textarea
                      value={mistakeForm.correctSolution}
                      onChange={(e) =>
                        setMistakeForm({ ...mistakeForm, correctSolution: e.target.value })
                      }
                      rows={2}
                      placeholder="Wrap numeric values with str() or use f-strings..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">What I Learned (Key Takeaway)</label>
                    <Textarea
                      value={mistakeForm.whatILearned}
                      onChange={(e) =>
                        setMistakeForm({ ...mistakeForm, whatILearned: e.target.value })
                      }
                      rows={2}
                      placeholder="Python is strongly typed and does not implicitly convert numbers to strings..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold">Corrected Code or Command Example</label>
                    <Textarea
                      value={mistakeForm.codeOrCommandExample}
                      onChange={(e) =>
                        setMistakeForm({ ...mistakeForm, codeOrCommandExample: e.target.value })
                      }
                      className="font-mono text-xs"
                      rows={2}
                      placeholder="port = int(input('Enter port: '))"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowMistakeForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveMistake} disabled={isPending}>
                    Save Mistake Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {tkrsState.mistakes.length === 0 ? (
            <Card className="border-border/40 bg-card/20">
              <CardContent className="py-16 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No technical mistakes recorded yet. Logging bugs and misconceptions turns them into long-term retention cards.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tkrsState.mistakes.map((m) => (
                <Card key={m.id} className="border-border/40 bg-card/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{m.data.relatedTopic}</Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            {m.data.revisionStatus}
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-heading">
                          {m.data.problemOrError}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() =>
                          startTransition(async () => {
                            await deleteMistakeEntry(m.id);
                            router.refresh();
                          })
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs">
                    {m.data.errorMessage && (
                      <div className="p-2 rounded bg-destructive/10 border border-destructive/30 font-mono text-destructive">
                        {m.data.errorMessage}
                      </div>
                    )}
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Why it happened: </strong>
                      {m.data.whyItHappened}
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Correct Solution: </strong>
                      {m.data.correctSolution}
                    </p>
                    {m.data.whatILearned && (
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Takeaway: </strong>
                        {m.data.whatILearned}
                      </p>
                    )}
                    {m.data.codeOrCommandExample && (
                      <pre className="p-2 rounded bg-background/80 border border-border/40 font-mono text-[11px] overflow-x-auto">
                        {m.data.codeOrCommandExample}
                      </pre>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <span className="text-muted-foreground">
                        {new Date(m.data.dateEncountered).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        disabled={isPending || m.data.revisionStatus === "CONVERTED_TO_CARD"}
                        onClick={() => handleConvertMistake(m.id)}
                      >
                        {m.data.revisionStatus === "CONVERTED_TO_CARD"
                          ? "Converted to Card"
                          : "Convert to Knowledge Card"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 5: WEEKLY KNOWLEDGE ASSESSMENT */}
        <TabsContent value="assessment" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/30">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-heading">
                  Weekly Knowledge Retention Assessment
                </CardTitle>
                <CardDescription>
                  Weighted evaluation: Theoretical Recall (20%) • Technical Questions (20%) • Practical Exercises (30%) • Programming Challenges (30%)
                </CardDescription>
              </div>
              <Button onClick={handleStartWeeklyAssessment} disabled={isPending}>
                <BrainCircuit className="w-4 h-4 mr-2" /> Start Weekly Assessment
              </Button>
            </CardHeader>

            {assessmentQuestions.length > 0 && (
              <CardContent className="space-y-6 border-t border-border/40 pt-6">
                {assessmentQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        Q{idx + 1} • {q.area} ({q.weightPercent}% Weight)
                      </Badge>
                      <span className="text-xs text-muted-foreground">{q.topic}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{q.prompt}</p>
                    <Textarea
                      value={assessmentAnswers[q.id] || ""}
                      onChange={(e) =>
                        setAssessmentAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder="Write your answer or code from memory..."
                      rows={3}
                      className="font-mono text-xs bg-background/60"
                    />
                    {assessmentRevealed && (
                      <div className="p-3 rounded-lg bg-background/80 border border-border/50 space-y-2 text-xs">
                        <div className="font-semibold text-primary">Expected Reference Answer:</div>
                        <div className="whitespace-pre-wrap text-muted-foreground">
                          {q.expectedAnswer}
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <span className="font-semibold">Did your response accurately cover this?</span>
                          <Button
                            size="sm"
                            variant={assessmentSelfGrades[q.id] === true ? "default" : "outline"}
                            className="h-7 text-xs"
                            onClick={() =>
                              setAssessmentSelfGrades((prev) => ({ ...prev, [q.id]: true }))
                            }
                          >
                            Correct
                          </Button>
                          <Button
                            size="sm"
                            variant={assessmentSelfGrades[q.id] === false ? "destructive" : "outline"}
                            className="h-7 text-xs"
                            onClick={() =>
                              setAssessmentSelfGrades((prev) => ({ ...prev, [q.id]: false }))
                            }
                          >
                            Needs Review
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end gap-3">
                  {!assessmentRevealed ? (
                    <Button onClick={() => setAssessmentRevealed(true)} variant="secondary">
                      Reveal Reference Solutions & Grade
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitWeeklyAssessment} disabled={isPending}>
                      Submit & Generate Performance Report
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Past Weekly Assessment Reports */}
          {tkrsState.assessments.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg">Assessment Performance Reports</h3>
              {tkrsState.assessments.map((rep) => (
                <Card key={rep.id} className="border-border/40 bg-card/30">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="text-lg font-heading">
                        Weighted Retention Score: {rep.overallScore}%
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {rep.deltaFromPrevious !== null && (
                          <Badge variant="outline">
                            {rep.deltaFromPrevious >= 0
                              ? `+${rep.deltaFromPrevious}% vs previous`
                              : `${rep.deltaFromPrevious}% vs previous`}
                          </Badge>
                        )}
                        <span>{new Date(rep.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <div className="text-muted-foreground">Theoretical (20%)</div>
                        <div className="text-lg font-bold mt-0.5">{rep.areaScores.theoretical}%</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <div className="text-muted-foreground">Technical (20%)</div>
                        <div className="text-lg font-bold mt-0.5">{rep.areaScores.technical}%</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <div className="text-muted-foreground">Practical (30%)</div>
                        <div className="text-lg font-bold mt-0.5">{rep.areaScores.practical}%</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <div className="text-muted-foreground">Programming (30%)</div>
                        <div className="text-lg font-bold mt-0.5">{rep.areaScores.programming}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <strong className="text-foreground block mb-1">Strong Topics:</strong>
                        <p className="text-muted-foreground">
                          {rep.strongTopics.length > 0 ? rep.strongTopics.join(", ") : "None recorded"}
                        </p>
                      </div>
                      <div>
                        <strong className="text-orange-400 block mb-1">Weak Topics & Forgotten:</strong>
                        <p className="text-muted-foreground">
                          {[...rep.weakTopics, ...rep.frequentlyForgotten].join(", ") || "None"}
                        </p>
                      </div>
                      <div>
                        <strong className="text-primary block mb-1">Recommended Priorities:</strong>
                        <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                          {rep.recommendedPriorities.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 6: CORNELL NOTES (PRESERVED EXISTING FEATURE) */}
        <TabsContent value="cornell" className="mt-6">
          <RevisionClient initialNotes={initialCornellNotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: string;
}) {
  return (
    <Card className="border-border/40 bg-card/30">
      <CardContent className="p-3.5">
        <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider truncate">
          {label}
        </div>
        <div className={`text-2xl font-heading font-bold mt-1 ${highlight || "text-foreground"}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function QueueCardRow({
  card,
  isSelected,
  onSelect,
  rescheduleVal,
  onRescheduleChange,
  onReschedule,
  onEarlyReview,
}: {
  card: KnowledgeCardRecord;
  isSelected: boolean;
  onSelect: () => void;
  rescheduleVal: string;
  onRescheduleChange: (val: string) => void;
  onReschedule: () => void;
  onEarlyReview: () => void;
}) {
  const [showResched, setShowResched] = useState(false);

  return (
    <div
      className={`p-3 rounded-xl border transition-all space-y-2 ${
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border/40 bg-background/40 hover:border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onSelect} className="text-left flex-1">
          <div className="text-sm font-semibold text-foreground">{card.data.topic}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
            <span className="font-mono text-primary font-bold">
              R{card.revision.currentStage}
            </span>
            <span>•</span>
            <span>{card.data.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(card.data.nextReviewDate).toLocaleDateString()}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <Button size="sm" variant="secondary" className="h-7 text-xs px-2.5" onClick={onSelect}>
            Recall
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs px-2"
            onClick={() => setShowResched(!showResched)}
            title="Reschedule or review early"
          >
            <Calendar className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {showResched && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs">
          <input
            type="date"
            value={rescheduleVal}
            onChange={(e) => onRescheduleChange(e.target.value)}
            className="h-7 rounded border border-border bg-background px-2 text-xs"
          />
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onReschedule}>
            Set Date
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs text-orange-400" onClick={onEarlyReview}>
            Review Early (Today)
          </Button>
        </div>
      )}
    </div>
  );
}
