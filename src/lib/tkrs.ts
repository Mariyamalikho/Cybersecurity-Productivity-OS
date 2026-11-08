export type RecallRating = "EASY" | "MODERATE" | "DIFFICULT" | "FORGOT";

export type RetentionStatus =
  | "NEW"
  | "LEARNING"
  | "REVIEWING"
  | "REINFORCING"
  | "NEEDS_ATTENTION";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export type TkrsCategory =
  | "Computer Fundamentals"
  | "IT Support"
  | "Networking"
  | "Cybersecurity"
  | "Programming"
  | "Software Development"
  | "Linux & CLI"
  | "Technical Concepts & Practical Skills";

export type QuestionType =
  | "DEFINITION"
  | "EXPLAIN_OWN_WORDS"
  | "MULTIPLE_CHOICE"
  | "FILL_BLANK"
  | "COMMAND_RECALL"
  | "CODE_REPRODUCTION"
  | "DEBUGGING"
  | "PRACTICAL_SCENARIO";

export interface SelfAssessmentItem {
  questionType: QuestionType;
  prompt: string;
  options?: string[];
  expectedAnswer: string;
  hint?: string;
}

export interface RevisionStageEntry {
  stage: "R0" | "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7";
  stageIndex: number;
  defaultDays: number;
  plannedDate: string;
  completedAt: string | null;
  status: "PENDING" | "COMPLETED" | "RESCHEDULED";
}

export interface RevisionHistoryEntry {
  id: string;
  stage: string;
  reviewedAt: string;
  rating: RecallRating;
  questionType: QuestionType;
  userAnswer?: string;
  nextReviewDate: string;
  intervalDays: number;
}

export interface KnowledgeCardData {
  topic: string;
  category: TkrsCategory | string;
  definition: string;
  purpose: string;
  howItWorks: string;
  terminology: string[];
  practicalExample: string;
  codeOrCommands: string;
  relatedConcepts: string[];
  selfAssessmentQuestions: SelfAssessmentItem[];
  simpleExplanation: string;
  difficulty: DifficultyLevel;
  learningDate: string;
  lastReviewedDate: string | null;
  nextReviewDate: string;
  retentionStatus: RetentionStatus;
  sourceTaskId?: string;
  sourceMistakeId?: string;
}

export interface KnowledgeCardScheduleData {
  currentStage: number; // 0..7 corresponding to R0..R7
  intervalDays: number;
  forgotCount: number;
  difficultCount: number;
  easyCount: number;
  moderateCount: number;
  schedule: RevisionStageEntry[];
  history: RevisionHistoryEntry[];
}

export interface KnowledgeCardRecord {
  id: string;
  data: KnowledgeCardData;
  revision: KnowledgeCardScheduleData;
  createdAt: string;
}

export type ProgrammingStageName =
  | "UNDERSTAND"
  | "RECALL"
  | "REPRODUCE"
  | "MODIFY"
  | "BUILD";

export interface ProgrammingExerciseData {
  title: string;
  language: string;
  conceptOrSyntax: string;
  difficulty: DifficultyLevel;
  codeExample: string;
  expectedOutput: string;
  userSolution: string;
  testCases: string[];
  commonErrors: string;
  debuggingNotes: string;
  practicalExercises: string;
  currentStage: number; // 1..5
  stageNotes: {
    understand: string;
    recall: string;
    reproduce: string;
    modify: string;
    build: string;
  };
  stagesCompleted: ProgrammingStageName[];
  completionStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  lastPracticedAt: string;
}

export interface ProgrammingExerciseRecord {
  id: string;
  data: ProgrammingExerciseData;
  createdAt: string;
}

export interface MistakeEntryData {
  problemOrError: string;
  relatedTopic: string;
  category: string;
  errorMessage: string;
  whyItHappened: string;
  correctSolution: string;
  whatILearned: string;
  codeOrCommandExample: string;
  dateEncountered: string;
  revisionStatus: "NEEDS_REVIEW" | "REVIEWED" | "CONVERTED_TO_CARD";
  linkedCardId?: string;
}

export interface MistakeEntryRecord {
  id: string;
  data: MistakeEntryData;
  createdAt: string;
}

export interface DailyRetentionChecklistData {
  dateKey: string; // YYYY-MM-DD in PKT
  learnedConcepts: boolean;
  createdCards: boolean;
  recalledWithoutNotes: boolean;
  completedPractical: boolean;
  wroteCodeWithoutCopying: boolean;
  reviewedPreviousMaterial: boolean;
  updatedMistakeLibrary: boolean;
}

export interface WeeklyAssessmentQuestion {
  id: string;
  area: "THEORETICAL" | "TECHNICAL" | "PRACTICAL" | "PROGRAMMING";
  weightPercent: number;
  topic: string;
  questionType: QuestionType;
  prompt: string;
  options?: string[];
  expectedAnswer: string;
  referenceCode?: string;
}

export interface WeeklyAssessmentReport {
  id: string;
  completedAt: string;
  overallScore: number; // 0..100 weighted percentage
  areaScores: {
    theoretical: number; // out of 100 (weight 20%)
    technical: number; // out of 100 (weight 20%)
    practical: number; // out of 100 (weight 30%)
    programming: number; // out of 100 (weight 30%)
  };
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  weakTopics: string[];
  strongTopics: string[];
  frequentlyForgotten: string[];
  recommendedPriorities: string[];
  deltaFromPrevious: number | null;
  questionResults: {
    question: string;
    topic: string;
    area: string;
    userAnswer: string;
    expectedAnswer: string;
    isCorrect: boolean;
  }[];
}

export const DEFAULT_REVISION_INTERVALS: {
  stage: RevisionStageEntry["stage"];
  stageIndex: number;
  days: number;
  label: string;
}[] = [
  { stage: "R0", stageIndex: 0, days: 0, label: "Immediately after learning" },
  { stage: "R1", stageIndex: 1, days: 1, label: "After 1 day" },
  { stage: "R2", stageIndex: 2, days: 3, label: "After 3 days" },
  { stage: "R3", stageIndex: 3, days: 7, label: "After 7 days" },
  { stage: "R4", stageIndex: 4, days: 14, label: "After 14 days" },
  { stage: "R5", stageIndex: 5, days: 30, label: "After 30 days" },
  { stage: "R6", stageIndex: 6, days: 60, label: "After 60 days" },
  { stage: "R7", stageIndex: 7, days: 90, label: "After 90 days" },
];

export function getPktDateKey(date: Date = new Date()): string {
  const pktOffsetMs = 5 * 60 * 60 * 1000;
  const pktDate = new Date(date.getTime() + pktOffsetMs);
  return pktDate.toISOString().slice(0, 10);
}

export function getStartOfTodayPktDate(): Date {
  const now = new Date();
  const pktOffsetMs = 5 * 60 * 60 * 1000;
  const pktNow = new Date(now.getTime() + pktOffsetMs);
  pktNow.setUTCHours(0, 0, 0, 0);
  return new Date(pktNow.getTime() - pktOffsetMs);
}

export function addDaysToDate(baseDate: Date, days: number): Date {
  const result = new Date(baseDate.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function generateInitialRevisionSchedule(
  learningDate: Date = new Date()
): KnowledgeCardScheduleData {
  const schedule: RevisionStageEntry[] = DEFAULT_REVISION_INTERVALS.map((item) => {
    const planned = addDaysToDate(learningDate, item.days);
    return {
      stage: item.stage,
      stageIndex: item.stageIndex,
      defaultDays: item.days,
      plannedDate: planned.toISOString(),
      completedAt: null,
      status: "PENDING",
    };
  });

  return {
    currentStage: 0,
    intervalDays: 0,
    forgotCount: 0,
    difficultCount: 0,
    easyCount: 0,
    moderateCount: 0,
    schedule,
    history: [],
  };
}

/**
 * Adaptive Spaced Repetition Calculator
 * - EASY: Advances stage and increases the next review interval (~1.35x).
 * - MODERATE: Advances stage and maintains the planned default interval.
 * - DIFFICULT: Keeps current stage and schedules an earlier review (half interval, min 1 day).
 * - FORGOT: Returns concept to an earlier revision stage (back 2 stages, min R1) and reviews in 1 day.
 * Never permanently classifies a concept as mastered merely because R0-R7 completed.
 */
export function calculateAdaptiveNextReview(
  currentRevision: KnowledgeCardScheduleData,
  rating: RecallRating,
  questionType: QuestionType,
  userAnswer?: string,
  now: Date = new Date()
): {
  updatedRevision: KnowledgeCardScheduleData;
  nextReviewDate: string;
  retentionStatus: RetentionStatus;
} {
  const curStage = currentRevision.currentStage ?? 0;
  const schedule = Array.isArray(currentRevision.schedule)
    ? [...currentRevision.schedule.map((s) => ({ ...s }))]
    : generateInitialRevisionSchedule(now).schedule;

  // Mark current stage as completed if rating is EASY or MODERATE
  if (rating === "EASY" || rating === "MODERATE") {
    if (schedule[curStage]) {
      schedule[curStage].completedAt = now.toISOString();
      schedule[curStage].status = "COMPLETED";
    }
  }

  let nextStage = curStage;
  let nextIntervalDays = 1;
  let retentionStatus: RetentionStatus = "REVIEWING";

  let forgotCount = currentRevision.forgotCount || 0;
  let difficultCount = currentRevision.difficultCount || 0;
  let easyCount = currentRevision.easyCount || 0;
  let moderateCount = currentRevision.moderateCount || 0;

  if (rating === "EASY") {
    easyCount++;
    nextStage = Math.min(7, curStage + 1);
    const baseDays = DEFAULT_REVISION_INTERVALS[nextStage]?.days || 90;
    const prevInterval = Math.max(baseDays, currentRevision.intervalDays || baseDays);
    nextIntervalDays = Math.max(1, Math.ceil(prevInterval * 1.35));
    // Never permanently classify as mastered; after R7 keep rolling reinforcement intervals
    retentionStatus = curStage >= 4 ? "REINFORCING" : "REVIEWING";
  } else if (rating === "MODERATE") {
    moderateCount++;
    nextStage = Math.min(7, curStage + 1);
    const baseDays = DEFAULT_REVISION_INTERVALS[nextStage]?.days || 90;
    nextIntervalDays = Math.max(1, baseDays);
    retentionStatus = curStage >= 5 ? "REINFORCING" : "REVIEWING";
  } else if (rating === "DIFFICULT") {
    difficultCount++;
    nextStage = curStage;
    const baseDays = DEFAULT_REVISION_INTERVALS[curStage]?.days || 3;
    nextIntervalDays = Math.max(1, Math.floor(baseDays * 0.5));
    retentionStatus = "NEEDS_ATTENTION";
  } else {
    // FORGOT: Return concept to an earlier revision stage
    forgotCount++;
    nextStage = Math.max(1, curStage - 2);
    // Re-open stages from nextStage onwards so they are re-verified
    for (let i = nextStage; i < schedule.length; i++) {
      schedule[i].status = "PENDING";
      schedule[i].completedAt = null;
    }
    nextIntervalDays = 1;
    retentionStatus = "NEEDS_ATTENTION";
  }

  const nextReview = addDaysToDate(now, nextIntervalDays);
  const nextReviewIso = nextReview.toISOString();

  // Sync remaining pending schedule dates forward from nextReview
  if (schedule[nextStage]) {
    schedule[nextStage].plannedDate = nextReviewIso;
    if (schedule[nextStage].status === "COMPLETED" && nextStage === 7) {
      // Even after R7 is completed, schedule rolling reinforcement review
      schedule[nextStage].plannedDate = nextReviewIso;
    }
  }
  for (let i = nextStage + 1; i < schedule.length; i++) {
    const deltaDays =
      DEFAULT_REVISION_INTERVALS[i].days - DEFAULT_REVISION_INTERVALS[nextStage].days;
    schedule[i].plannedDate = addDaysToDate(
      nextReview,
      Math.max(1, deltaDays)
    ).toISOString();
  }

  const historyEntry: RevisionHistoryEntry = {
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    stage: `R${curStage}`,
    reviewedAt: now.toISOString(),
    rating,
    questionType,
    userAnswer,
    nextReviewDate: nextReviewIso,
    intervalDays: nextIntervalDays,
  };

  const updatedRevision: KnowledgeCardScheduleData = {
    currentStage: nextStage,
    intervalDays: nextIntervalDays,
    forgotCount,
    difficultCount,
    easyCount,
    moderateCount,
    schedule,
    history: [historyEntry, ...(currentRevision.history || [])].slice(0, 50),
  };

  return {
    updatedRevision,
    nextReviewDate: nextReviewIso,
    retentionStatus,
  };
}

/**
 * Generates all 8 Active Recall question formats dynamically from a Knowledge Card
 */
export function buildActiveRecallQuestionsForCard(
  card: KnowledgeCardData
): SelfAssessmentItem[] {
  const custom = Array.isArray(card.selfAssessmentQuestions)
    ? card.selfAssessmentQuestions.filter((q) => q && q.prompt && q.expectedAnswer)
    : [];

  const generated: SelfAssessmentItem[] = [
    {
      questionType: "DEFINITION",
      prompt: `Define "${card.topic}" and state its core technical purpose.`,
      expectedAnswer: `${card.definition}${card.purpose ? ` Purpose: ${card.purpose}` : ""}`,
      hint: card.terminology?.length
        ? `Key terms to include: ${card.terminology.slice(0, 3).join(", ")}`
        : undefined,
    },
    {
      questionType: "EXPLAIN_OWN_WORDS",
      prompt: `Explain in your own words how "${card.topic}" works under the hood (as if teaching a junior engineer).`,
      expectedAnswer:
        card.howItWorks || card.simpleExplanation || card.definition,
      hint: card.simpleExplanation
        ? `Think about the core mechanism in simple terms.`
        : undefined,
    },
    {
      questionType: "FILL_BLANK",
      prompt: `Complete the technical statement for [${card.category}]: "______ is the concept/mechanism defined as: ${card.definition}"`,
      expectedAnswer: card.topic,
      hint: `Starts with "${card.topic.slice(0, 2)}..."`,
    },
    {
      questionType: "PRACTICAL_SCENARIO",
      prompt: `Practical Scenario: When working in ${card.category}, describe a real-world situation or example where you would apply "${card.topic}".`,
      expectedAnswer:
        card.practicalExample || card.purpose || card.howItWorks || card.definition,
    },
  ];

  const snippetOrMechanism =
    card.codeOrCommands && card.codeOrCommands.trim().length > 0
      ? card.codeOrCommands
      : card.practicalExample || card.howItWorks || card.definition;

  generated.push(
    {
      questionType: "COMMAND_RECALL",
      prompt: `Command / Syntax Recall: Write the exact command, syntax, or technical expression associated with "${card.topic}" without looking at notes.`,
      expectedAnswer: snippetOrMechanism,
    },
    {
      questionType: "CODE_REPRODUCTION",
      prompt: `Code / Procedure Reproduction: Reproduce the working implementation, script structure, or operational sequence for "${card.topic}".`,
      expectedAnswer: snippetOrMechanism,
    },
    {
      questionType: "DEBUGGING",
      prompt: `Debugging Check: If an implementation or configuration of "${card.topic}" fails or produces unexpected behavior, what syntax, parameters, or mechanism details must be verified?`,
      expectedAnswer: `Verify against:\n${snippetOrMechanism}\n\nMechanism check: ${card.howItWorks || card.definition}`,
    }
  );

  // Multiple choice question using related concepts / terminology
  const distractorPool = [
    "Static packet filtering without state inspection or session tracking",
    "Compile-time lexical binding that bypasses runtime execution context",
    "Asymmetric key exchange over an unauthenticated broadcast domain",
  ];
  generated.push({
    questionType: "MULTIPLE_CHOICE",
    prompt: `Which of the following best describes "${card.topic}"?`,
    options: [
      card.definition,
      ...distractorPool,
    ],
    expectedAnswer: card.definition,
  });

  return [...custom, ...generated];
}

export function mapTaskCategoryToTkrsCategory(rawCategory: string, title: string): TkrsCategory {
  const combined = `${rawCategory} ${title}`.toLowerCase();
  if (combined.includes("python") || combined.includes("code") || combined.includes("c++") || combined.includes("programming")) {
    return "Programming";
  }
  if (combined.includes("linux") || combined.includes("bash") || combined.includes("cli") || combined.includes("bandit")) {
    return "Linux & CLI";
  }
  if (combined.includes("network") || combined.includes("osi") || combined.includes("tcp") || combined.includes("wireshark")) {
    return "Networking";
  }
  if (combined.includes("security") || combined.includes("cyber") || combined.includes("dfir") || combined.includes("forensic") || combined.includes("hack")) {
    return "Cybersecurity";
  }
  if (combined.includes("git") || combined.includes("software") || combined.includes("dev")) {
    return "Software Development";
  }
  if (combined.includes("it automation") || combined.includes("operating system") || combined.includes("support")) {
    return "IT Support";
  }
  return "Technical Concepts & Practical Skills";
}
