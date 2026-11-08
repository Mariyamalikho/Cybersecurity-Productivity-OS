"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  KnowledgeCardData,
  KnowledgeCardRecord,
  KnowledgeCardScheduleData,
  ProgrammingExerciseData,
  ProgrammingExerciseRecord,
  MistakeEntryData,
  MistakeEntryRecord,
  DailyRetentionChecklistData,
  WeeklyAssessmentQuestion,
  WeeklyAssessmentReport,
  RecallRating,
  QuestionType,
  generateInitialRevisionSchedule,
  calculateAdaptiveNextReview,
  getPktDateKey,
  getStartOfTodayPktDate,
  mapTaskCategoryToTkrsCategory,
} from "@/lib/tkrs";

const CAT_CARD = "__TKRS_CARD__";
const CAT_PROG = "__TKRS_PROG__";
const CAT_MISTAKE = "__TKRS_MISTAKE__";
const CAT_CHECKLIST = "__TKRS_CHECKLIST__";
const CAT_ASSESSMENT = "__TKRS_ASSESSMENT__";

function revalidateTkrsPaths() {
  revalidatePath("/learning/revision");
  revalidatePath("/learning/programming");
  revalidatePath("/learning/exams");
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function ensureCardForCompletedTask(
  userId: string,
  task: { id: string; title: string; category: string; completedAt?: Date | null }
) {
  if (task.category === "Study Abroad & Fellowships") return null;

  const existingCards = await prisma.revisionNote.findMany({
    where: { userId, category: CAT_CARD },
  });

  const normalizedTitle = task.title.trim().toLowerCase();
  const alreadyExists = existingCards.some((row) => {
    const data = row.cues as unknown as KnowledgeCardData;
    return (
      data?.sourceTaskId === task.id ||
      row.summary.trim().toLowerCase() === normalizedTitle ||
      data?.topic?.trim().toLowerCase() === normalizedTitle
    );
  });

  if (alreadyExists) return null;

  const now = task.completedAt ? new Date(task.completedAt) : new Date();
  const initialSchedule = generateInitialRevisionSchedule(now);
  const tkrsCategory = mapTaskCategoryToTkrsCategory(task.category, task.title);

  const cardData: KnowledgeCardData = {
    topic: task.title,
    category: tkrsCategory,
    definition: `Core technical concept covered in ${task.title} (${task.category}).`,
    purpose: `Build operational proficiency in ${tkrsCategory} as part of ${task.category}.`,
    howItWorks: `Review your lesson notes, terminal commands, and code implementation from ${task.title} to reinforce exact mechanics.`,
    terminology: [tkrsCategory, task.category],
    practicalExample: `Applied during daily hands-on practice for: ${task.title}.`,
    codeOrCommands: "",
    relatedConcepts: [task.category],
    selfAssessmentQuestions: [],
    simpleExplanation: `Key concept learned on ${getPktDateKey(now)}: ${task.title}.`,
    difficulty: "Intermediate",
    learningDate: now.toISOString(),
    lastReviewedDate: null,
    nextReviewDate: initialSchedule.schedule[0].plannedDate, // R0: Immediately after learning
    retentionStatus: "NEW",
    sourceTaskId: task.id,
  };

  const created = await prisma.revisionNote.create({
    data: {
      userId,
      category: CAT_CARD,
      date: new Date(cardData.nextReviewDate),
      summary: cardData.topic,
      cues: cardData as any,
      notes: initialSchedule as any,
    },
  });

  return created;
}

export async function getTkrsState() {
  const user = await ensureUserExists();
  const todayStart = getStartOfTodayPktDate();
  const todayKey = getPktDateKey();
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [tkrsRows, completedTasksToday, completedTasksWeek] = await Promise.all([
    prisma.revisionNote.findMany({
      where: {
        userId: user.id,
        category: {
          in: [CAT_CARD, CAT_PROG, CAT_MISTAKE, CAT_CHECKLIST, CAT_ASSESSMENT],
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({
      where: {
        userId: user.id,
        status: "COMPLETED",
        completedAt: { gte: todayStart },
      },
    }),
    prisma.task.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        completedAt: { gte: sevenDaysAgo },
      },
      select: { completedAt: true },
    }),
  ]);

  const cards: KnowledgeCardRecord[] = [];
  const programmingExercises: ProgrammingExerciseRecord[] = [];
  const mistakes: MistakeEntryRecord[] = [];
  const assessments: WeeklyAssessmentReport[] = [];
  let todayChecklist: DailyRetentionChecklistData = {
    dateKey: todayKey,
    learnedConcepts: completedTasksToday > 0,
    createdCards: false,
    recalledWithoutNotes: false,
    completedPractical: false,
    wroteCodeWithoutCopying: false,
    reviewedPreviousMaterial: false,
    updatedMistakeLibrary: false,
  };

  for (const row of tkrsRows) {
    if (row.category === CAT_CARD) {
      const data = row.cues as unknown as KnowledgeCardData;
      const revision =
        (row.notes as unknown as KnowledgeCardScheduleData) ||
        generateInitialRevisionSchedule(new Date(row.createdAt));
      if (data && data.topic) {
        cards.push({
          id: row.id,
          data,
          revision,
          createdAt: row.createdAt.toISOString(),
        });
      }
    } else if (row.category === CAT_PROG) {
      const data = row.cues as unknown as ProgrammingExerciseData;
      if (data && data.title) {
        programmingExercises.push({
          id: row.id,
          data,
          createdAt: row.createdAt.toISOString(),
        });
      }
    } else if (row.category === CAT_MISTAKE) {
      const data = row.cues as unknown as MistakeEntryData;
      if (data && data.problemOrError) {
        mistakes.push({
          id: row.id,
          data,
          createdAt: row.createdAt.toISOString(),
        });
      }
    } else if (row.category === CAT_CHECKLIST && row.summary === todayKey) {
      const saved = row.cues as unknown as DailyRetentionChecklistData;
      if (saved) {
        todayChecklist = {
          ...todayChecklist,
          ...saved,
          dateKey: todayKey,
        };
      }
    } else if (row.category === CAT_ASSESSMENT) {
      const report = row.cues as unknown as WeeklyAssessmentReport;
      if (report) {
        assessments.push({
          ...report,
          id: row.id,
        });
      }
    }
  }

  // Classify revisions: Overdue, Due Today, Upcoming
  const overdueCards: KnowledgeCardRecord[] = [];
  const dueTodayCards: KnowledgeCardRecord[] = [];
  const upcomingCards: KnowledgeCardRecord[] = [];

  for (const card of cards) {
    const nextDate = new Date(card.data.nextReviewDate);
    if (nextDate < todayStart) {
      overdueCards.push(card);
    } else if (nextDate >= todayStart && nextDate < tomorrowStart) {
      dueTodayCards.push(card);
    } else {
      upcomingCards.push(card);
    }
  }

  // Sort upcoming by soonest nextReviewDate
  upcomingCards.sort(
    (a, b) =>
      new Date(a.data.nextReviewDate).getTime() -
      new Date(b.data.nextReviewDate).getTime()
  );

  // Calculate retention performance (% of Easy + Moderate reviews across all history)
  let totalReviews = 0;
  let successfulReviews = 0;
  let cardsCreatedToday = 0;
  let reviewsCompletedToday = 0;
  const activeReviewDays = new Set<string>();

  for (const t of completedTasksWeek) {
    if (t.completedAt) activeReviewDays.add(getPktDateKey(new Date(t.completedAt)));
  }

  for (const card of cards) {
    if (getPktDateKey(new Date(card.createdAt)) === todayKey) {
      cardsCreatedToday++;
    }
    const hist = card.revision.history || [];
    for (const h of hist) {
      totalReviews++;
      if (h.rating === "EASY" || h.rating === "MODERATE") {
        successfulReviews++;
      }
      const hDay = getPktDateKey(new Date(h.reviewedAt));
      if (hDay === todayKey) {
        reviewsCompletedToday++;
      }
      if (new Date(h.reviewedAt) >= sevenDaysAgo) {
        activeReviewDays.add(hDay);
      }
    }
  }

  const retentionPerformance =
    totalReviews > 0 ? Math.round((successfulReviews / totalReviews) * 100) : 100;

  const weeklyConsistency = Math.min(100, Math.round((activeReviewDays.size / 7) * 100));

  const topicsNeedingAttention = cards
    .filter(
      (c) =>
        c.data.retentionStatus === "NEEDS_ATTENTION" ||
        c.revision.forgotCount > 0 ||
        c.revision.difficultCount > 0
    )
    .map((c) => c.data.topic);

  // Also include un-reviewed mistakes in topics needing attention
  for (const m of mistakes) {
    if (
      m.data.revisionStatus === "NEEDS_REVIEW" &&
      !topicsNeedingAttention.includes(m.data.relatedTopic)
    ) {
      topicsNeedingAttention.push(m.data.relatedTopic);
    }
  }

  const activeProgrammingCount = programmingExercises.filter(
    (p) => p.data.completionStatus !== "COMPLETED"
  ).length;

  return {
    cards,
    overdueCards,
    dueTodayCards,
    upcomingCards,
    programmingExercises,
    mistakes,
    assessments,
    todayChecklist,
    metrics: {
      conceptsLearnedToday: completedTasksToday + cardsCreatedToday,
      revisionsDueToday: dueTodayCards.length,
      overdueRevisions: overdueCards.length,
      upcomingRevisions: upcomingCards.length,
      totalCards: cards.length,
      activeProgrammingExercises: activeProgrammingCount,
      retentionPerformance,
      weeklyConsistency,
      reviewsCompletedToday,
      topicsNeedingAttention: topicsNeedingAttention.slice(0, 6),
    },
  };
}

export async function upsertKnowledgeCard(
  input: Partial<KnowledgeCardData>,
  existingId?: string
) {
  const user = await ensureUserExists();
  const topic = input.topic?.trim();
  if (!topic) throw new Error("Topic name is required.");

  const now = new Date();
  const todayKey = getPktDateKey(now);

  if (existingId) {
    const existing = await prisma.revisionNote.findFirst({
      where: { id: existingId, userId: user.id, category: CAT_CARD },
    });
    if (!existing) throw new Error("Knowledge card not found.");

    const prevData = existing.cues as unknown as KnowledgeCardData;
    const updatedData: KnowledgeCardData = {
      ...prevData,
      ...input,
      topic,
      terminology: Array.isArray(input.terminology)
        ? input.terminology
        : prevData.terminology || [],
      relatedConcepts: Array.isArray(input.relatedConcepts)
        ? input.relatedConcepts
        : prevData.relatedConcepts || [],
      selfAssessmentQuestions: Array.isArray(input.selfAssessmentQuestions)
        ? input.selfAssessmentQuestions
        : prevData.selfAssessmentQuestions || [],
    };

    await prisma.revisionNote.update({
      where: { id: existingId },
      data: {
        summary: topic,
        date: new Date(updatedData.nextReviewDate),
        cues: updatedData as any,
      },
    });

    revalidateTkrsPaths();
    return { success: true, id: existingId };
  }

  // Prevent duplicate card creation for the same topic
  const existingForTopic = await prisma.revisionNote.findFirst({
    where: {
      userId: user.id,
      category: CAT_CARD,
      summary: { equals: topic, mode: "insensitive" },
    },
  });

  if (existingForTopic) {
    throw new Error(`A Knowledge Card for "${topic}" already exists.`);
  }

  const initialSchedule = generateInitialRevisionSchedule(now);
  const newCardData: KnowledgeCardData = {
    topic,
    category: input.category || "Cybersecurity",
    definition: input.definition?.trim() || "",
    purpose: input.purpose?.trim() || "",
    howItWorks: input.howItWorks?.trim() || "",
    terminology: Array.isArray(input.terminology) ? input.terminology : [],
    practicalExample: input.practicalExample?.trim() || "",
    codeOrCommands: input.codeOrCommands?.trim() || "",
    relatedConcepts: Array.isArray(input.relatedConcepts) ? input.relatedConcepts : [],
    selfAssessmentQuestions: Array.isArray(input.selfAssessmentQuestions)
      ? input.selfAssessmentQuestions
      : [],
    simpleExplanation: input.simpleExplanation?.trim() || "",
    difficulty: input.difficulty || "Intermediate",
    learningDate: input.learningDate || now.toISOString(),
    lastReviewedDate: null,
    nextReviewDate: initialSchedule.schedule[0].plannedDate, // R0 immediately
    retentionStatus: "NEW",
    sourceTaskId: input.sourceTaskId,
    sourceMistakeId: input.sourceMistakeId,
  };

  const created = await prisma.revisionNote.create({
    data: {
      userId: user.id,
      category: CAT_CARD,
      date: new Date(newCardData.nextReviewDate),
      summary: topic,
      cues: newCardData as any,
      notes: initialSchedule as any,
    },
  });

  // Auto-mark "createdCards" on today's checklist
  await markChecklistFieldInternal(user.id, todayKey, "createdCards", true);

  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: 15 } },
  });

  revalidateTkrsPaths();
  return { success: true, id: created.id };
}

export async function deleteKnowledgeCard(cardId: string) {
  const user = await ensureUserExists();
  await prisma.revisionNote.deleteMany({
    where: { id: cardId, userId: user.id, category: CAT_CARD },
  });
  revalidateTkrsPaths();
  return { success: true };
}

export async function syncCompletedTasksToCards() {
  const user = await ensureUserExists();
  const [completedTasks, cornellNotes] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        category: { not: "Study Abroad & Fellowships" },
      },
    }),
    prisma.revisionNote.findMany({
      where: {
        userId: user.id,
        NOT: { category: { startsWith: "__" } },
      },
    }),
  ]);

  let createdCount = 0;

  for (const t of completedTasks) {
    const res = await ensureCardForCompletedTask(user.id, t);
    if (res) createdCount++;
  }

  // Also convert Cornell Note cue rows into Knowledge Cards if not already present
  const existingCards = await prisma.revisionNote.findMany({
    where: { userId: user.id, category: CAT_CARD },
  });
  const existingTopics = new Set(
    existingCards.map((c) => c.summary.trim().toLowerCase())
  );

  for (const note of cornellNotes) {
    const cues: string[] = Array.isArray(note.cues) ? (note.cues as string[]) : [];
    const notesArr: string[] = Array.isArray(note.notes) ? (note.notes as string[]) : [];

    for (let i = 0; i < cues.length; i++) {
      const cueTopic = cues[i]?.trim();
      const cueBody = notesArr[i]?.trim() || note.summary;
      if (!cueTopic || existingTopics.has(cueTopic.toLowerCase())) continue;

      const now = new Date(note.date || note.createdAt);
      const schedule = generateInitialRevisionSchedule(now);
      const category = mapTaskCategoryToTkrsCategory(note.category, cueTopic);

      const cardData: KnowledgeCardData = {
        topic: cueTopic,
        category,
        definition: cueBody.replace(/^•\s*/gm, ""),
        purpose: note.summary,
        howItWorks: cueBody,
        terminology: [cueTopic, note.category],
        practicalExample: note.summary,
        codeOrCommands: "",
        relatedConcepts: cues.filter((c) => c !== cueTopic),
        selfAssessmentQuestions: [],
        simpleExplanation: note.summary,
        difficulty: "Intermediate",
        learningDate: now.toISOString(),
        lastReviewedDate: null,
        nextReviewDate: schedule.schedule[0].plannedDate,
        retentionStatus: "NEW",
      };

      await prisma.revisionNote.create({
        data: {
          userId: user.id,
          category: CAT_CARD,
          date: new Date(cardData.nextReviewDate),
          summary: cueTopic,
          cues: cardData as any,
          notes: schedule as any,
        },
      });
      existingTopics.add(cueTopic.toLowerCase());
      createdCount++;
    }
  }

  revalidateTkrsPaths();
  return { success: true, createdCount };
}

export async function recordActiveRecallReview(
  cardId: string,
  rating: RecallRating,
  questionType: QuestionType,
  userAnswer?: string
) {
  const user = await ensureUserExists();
  const row = await prisma.revisionNote.findFirst({
    where: { id: cardId, userId: user.id, category: CAT_CARD },
  });

  if (!row) throw new Error("Knowledge card not found.");

  const cardData = row.cues as unknown as KnowledgeCardData;
  const currentRevision =
    (row.notes as unknown as KnowledgeCardScheduleData) ||
    generateInitialRevisionSchedule(new Date(row.createdAt));

  const now = new Date();
  const { updatedRevision, nextReviewDate, retentionStatus } =
    calculateAdaptiveNextReview(
      currentRevision,
      rating,
      questionType,
      userAnswer,
      now
    );

  const updatedCardData: KnowledgeCardData = {
    ...cardData,
    lastReviewedDate: now.toISOString(),
    nextReviewDate,
    retentionStatus,
  };

  await prisma.revisionNote.update({
    where: { id: cardId },
    data: {
      date: new Date(nextReviewDate),
      cues: updatedCardData as any,
      notes: updatedRevision as any,
    },
  });

  const todayKey = getPktDateKey(now);
  await markChecklistFieldInternal(user.id, todayKey, "recalledWithoutNotes", true);
  await markChecklistFieldInternal(user.id, todayKey, "reviewedPreviousMaterial", true);

  const xpReward =
    rating === "EASY" ? 15 : rating === "MODERATE" ? 12 : rating === "DIFFICULT" ? 8 : 5;
  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: xpReward } },
  });

  revalidateTkrsPaths();
  return {
    success: true,
    nextReviewDate,
    nextStage: `R${updatedRevision.currentStage}`,
    intervalDays: updatedRevision.intervalDays,
    retentionStatus,
    xpReward,
  };
}

export async function rescheduleCardReview(
  cardId: string,
  newDateStr: string,
  markNeedsAttention: boolean = false
) {
  const user = await ensureUserExists();
  const row = await prisma.revisionNote.findFirst({
    where: { id: cardId, userId: user.id, category: CAT_CARD },
  });
  if (!row) throw new Error("Knowledge card not found.");

  const cardData = row.cues as unknown as KnowledgeCardData;
  const revision = row.notes as unknown as KnowledgeCardScheduleData;
  const targetDate = new Date(newDateStr);
  if (isNaN(targetDate.getTime())) throw new Error("Invalid date provided.");

  const targetIso = targetDate.toISOString();
  const curStage = revision.currentStage ?? 0;
  if (Array.isArray(revision.schedule) && revision.schedule[curStage]) {
    revision.schedule[curStage].plannedDate = targetIso;
    revision.schedule[curStage].status = "RESCHEDULED";
  }

  const updatedData: KnowledgeCardData = {
    ...cardData,
    nextReviewDate: targetIso,
    retentionStatus: markNeedsAttention
      ? "NEEDS_ATTENTION"
      : cardData.retentionStatus,
  };

  await prisma.revisionNote.update({
    where: { id: cardId },
    data: {
      date: targetDate,
      cues: updatedData as any,
      notes: revision as any,
    },
  });

  revalidateTkrsPaths();
  return { success: true, nextReviewDate: targetIso };
}

export async function upsertProgrammingExercise(
  input: Partial<ProgrammingExerciseData>,
  existingId?: string
) {
  const user = await ensureUserExists();
  const title = input.title?.trim();
  if (!title) throw new Error("Exercise title is required.");

  const now = new Date();
  const todayKey = getPktDateKey(now);

  const stagesCompleted = Array.isArray(input.stagesCompleted)
    ? input.stagesCompleted
    : [];
  const completionStatus: ProgrammingExerciseData["completionStatus"] =
    stagesCompleted.length >= 5
      ? "COMPLETED"
      : stagesCompleted.length > 0 || (input.userSolution && input.userSolution.trim().length > 0)
      ? "IN_PROGRESS"
      : "NOT_STARTED";

  const payload: ProgrammingExerciseData = {
    title,
    language: input.language || "Python",
    conceptOrSyntax: input.conceptOrSyntax || "",
    difficulty: input.difficulty || "Intermediate",
    codeExample: input.codeExample || "",
    expectedOutput: input.expectedOutput || "",
    userSolution: input.userSolution || "",
    testCases: Array.isArray(input.testCases) ? input.testCases : [],
    commonErrors: input.commonErrors || "",
    debuggingNotes: input.debuggingNotes || "",
    practicalExercises: input.practicalExercises || "",
    currentStage: input.currentStage || Math.min(5, stagesCompleted.length + 1),
    stageNotes: input.stageNotes || {
      understand: "",
      recall: "",
      reproduce: "",
      modify: "",
      build: "",
    },
    stagesCompleted,
    completionStatus,
    lastPracticedAt: now.toISOString(),
  };

  if (existingId) {
    await prisma.revisionNote.updateMany({
      where: { id: existingId, userId: user.id, category: CAT_PROG },
      data: {
        summary: title,
        date: now,
        cues: payload as any,
      },
    });
  } else {
    await prisma.revisionNote.create({
      data: {
        userId: user.id,
        category: CAT_PROG,
        date: now,
        summary: title,
        cues: payload as any,
        notes: [] as any,
      },
    });
  }

  if (payload.userSolution.trim().length > 0) {
    await markChecklistFieldInternal(user.id, todayKey, "wroteCodeWithoutCopying", true);
  }
  if (stagesCompleted.includes("REPRODUCE") || stagesCompleted.includes("MODIFY") || stagesCompleted.includes("BUILD")) {
    await markChecklistFieldInternal(user.id, todayKey, "completedPractical", true);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: 20 } },
  });

  revalidateTkrsPaths();
  return { success: true };
}

export async function deleteProgrammingExercise(id: string) {
  const user = await ensureUserExists();
  await prisma.revisionNote.deleteMany({
    where: { id, userId: user.id, category: CAT_PROG },
  });
  revalidateTkrsPaths();
  return { success: true };
}

export async function upsertMistakeEntry(
  input: Partial<MistakeEntryData>,
  existingId?: string
) {
  const user = await ensureUserExists();
  const problemOrError = input.problemOrError?.trim();
  if (!problemOrError) throw new Error("Problem or error description is required.");

  const now = new Date();
  const todayKey = getPktDateKey(now);

  const payload: MistakeEntryData = {
    problemOrError,
    relatedTopic: input.relatedTopic?.trim() || "General Technical",
    category: input.category || "Cybersecurity",
    errorMessage: input.errorMessage?.trim() || "",
    whyItHappened: input.whyItHappened?.trim() || "",
    correctSolution: input.correctSolution?.trim() || "",
    whatILearned: input.whatILearned?.trim() || "",
    codeOrCommandExample: input.codeOrCommandExample?.trim() || "",
    dateEncountered: input.dateEncountered || now.toISOString(),
    revisionStatus: input.revisionStatus || "NEEDS_REVIEW",
    linkedCardId: input.linkedCardId,
  };

  if (existingId) {
    await prisma.revisionNote.updateMany({
      where: { id: existingId, userId: user.id, category: CAT_MISTAKE },
      data: {
        summary: problemOrError,
        date: now,
        cues: payload as any,
      },
    });
  } else {
    await prisma.revisionNote.create({
      data: {
        userId: user.id,
        category: CAT_MISTAKE,
        date: now,
        summary: problemOrError,
        cues: payload as any,
        notes: [] as any,
      },
    });
  }

  await markChecklistFieldInternal(user.id, todayKey, "updatedMistakeLibrary", true);

  revalidateTkrsPaths();
  return { success: true };
}

export async function convertMistakeToCard(mistakeId: string) {
  const user = await ensureUserExists();
  const mistakeRow = await prisma.revisionNote.findFirst({
    where: { id: mistakeId, userId: user.id, category: CAT_MISTAKE },
  });
  if (!mistakeRow) throw new Error("Mistake entry not found.");

  const m = mistakeRow.cues as unknown as MistakeEntryData;
  const cardTopic = `${m.relatedTopic}: ${m.problemOrError}`;

  const existingCard = await prisma.revisionNote.findFirst({
    where: {
      userId: user.id,
      category: CAT_CARD,
      summary: { equals: cardTopic, mode: "insensitive" },
    },
  });

  let cardId = existingCard?.id;

  if (!existingCard) {
    const now = new Date();
    const schedule = generateInitialRevisionSchedule(now);
    const cardData: KnowledgeCardData = {
      topic: cardTopic,
      category: m.category || "Cybersecurity",
      definition: m.whatILearned || m.correctSolution,
      purpose: `Prevent recurring error: ${m.problemOrError}`,
      howItWorks: `Root Cause: ${m.whyItHappened}\nResolution: ${m.correctSolution}`,
      terminology: [m.relatedTopic, "Troubleshooting"],
      practicalExample: m.errorMessage
        ? `Encountered error: ${m.errorMessage}`
        : m.problemOrError,
      codeOrCommands: m.codeOrCommandExample || "",
      relatedConcepts: [m.relatedTopic],
      selfAssessmentQuestions: [
        {
          questionType: "DEBUGGING",
          prompt: `Troubleshooting "${m.problemOrError}"${
            m.errorMessage ? ` (Error: ${m.errorMessage})` : ""
          }: Why does this happen and what is the exact fix?`,
          expectedAnswer: `Why it happened: ${m.whyItHappened}\nFix: ${m.correctSolution}`,
        },
      ],
      simpleExplanation: m.whatILearned || m.correctSolution,
      difficulty: "Intermediate",
      learningDate: now.toISOString(),
      lastReviewedDate: null,
      nextReviewDate: schedule.schedule[0].plannedDate,
      retentionStatus: "NEEDS_ATTENTION",
      sourceMistakeId: mistakeId,
    };

    const createdCard = await prisma.revisionNote.create({
      data: {
        userId: user.id,
        category: CAT_CARD,
        date: now,
        summary: cardTopic,
        cues: cardData as any,
        notes: schedule as any,
      },
    });
    cardId = createdCard.id;
  }

  const updatedMistake: MistakeEntryData = {
    ...m,
    revisionStatus: "CONVERTED_TO_CARD",
    linkedCardId: cardId,
  };

  await prisma.revisionNote.update({
    where: { id: mistakeId },
    data: { cues: updatedMistake as any },
  });

  revalidateTkrsPaths();
  return { success: true, cardId };
}

export async function deleteMistakeEntry(id: string) {
  const user = await ensureUserExists();
  await prisma.revisionNote.deleteMany({
    where: { id, userId: user.id, category: CAT_MISTAKE },
  });
  revalidateTkrsPaths();
  return { success: true };
}

async function markChecklistFieldInternal(
  userId: string,
  dateKey: string,
  field: keyof Omit<DailyRetentionChecklistData, "dateKey">,
  value: boolean
) {
  const existing = await prisma.revisionNote.findFirst({
    where: { userId, category: CAT_CHECKLIST, summary: dateKey },
  });

  if (existing) {
    const prev = existing.cues as unknown as DailyRetentionChecklistData;
    const updated = { ...prev, [field]: value, dateKey };
    await prisma.revisionNote.update({
      where: { id: existing.id },
      data: { cues: updated as any },
    });
  } else {
    const initial: DailyRetentionChecklistData = {
      dateKey,
      learnedConcepts: false,
      createdCards: false,
      recalledWithoutNotes: false,
      completedPractical: false,
      wroteCodeWithoutCopying: false,
      reviewedPreviousMaterial: false,
      updatedMistakeLibrary: false,
      [field]: value,
    };
    await prisma.revisionNote.create({
      data: {
        userId,
        category: CAT_CHECKLIST,
        date: new Date(),
        summary: dateKey,
        cues: initial as any,
        notes: [] as any,
      },
    });
  }
}

export async function toggleRetentionChecklistItem(
  field: keyof Omit<DailyRetentionChecklistData, "dateKey">
) {
  const user = await ensureUserExists();
  const dateKey = getPktDateKey();

  const existing = await prisma.revisionNote.findFirst({
    where: { userId: user.id, category: CAT_CHECKLIST, summary: dateKey },
  });

  const currentVal = existing
    ? Boolean((existing.cues as unknown as DailyRetentionChecklistData)?.[field])
    : false;

  await markChecklistFieldInternal(user.id, dateKey, field, !currentVal);
  revalidateTkrsPaths();
  return { success: true, completed: !currentVal };
}

/**
 * Generates a Weekly Knowledge Assessment strictly from actual recorded learning material:
 * - Theoretical recall (20%)
 * - Technical questions (20%)
 * - Practical exercises (30%)
 * - Programming challenges (30%)
 * Refuses to invent topics if no recorded material exists.
 */
export async function generateWeeklyTkrsAssessment(): Promise<{
  questions: WeeklyAssessmentQuestion[];
}> {
  const state = await getTkrsState();
  const { cards, programmingExercises, mistakes } = state;

  if (cards.length === 0 && programmingExercises.length === 0 && mistakes.length === 0) {
    throw new Error(
      "No recorded Knowledge Cards, Programming Exercises, or Mistake Library entries found yet. Complete a lesson or create a Knowledge Card first so the assessment only tests material you have actually studied."
    );
  }

  const questions: WeeklyAssessmentQuestion[] = [];
  let qIdx = 1;

  // 1. Theoretical Recall (20% weight) — drawn from Knowledge Cards definitions & explanations
  const theorySource = cards.slice(0, 4);
  for (const c of theorySource) {
    questions.push({
      id: `q_theory_${qIdx++}`,
      area: "THEORETICAL",
      weightPercent: 20,
      topic: c.data.topic,
      questionType: "DEFINITION",
      prompt: `[Theoretical Recall] Define "${c.data.topic}" (${c.data.category}) and explain its primary purpose without referencing your notes.`,
      expectedAnswer: `${c.data.definition}${
        c.data.purpose ? `\nPurpose: ${c.data.purpose}` : ""
      }`,
    });
  }

  // 2. Technical Questions (20% weight) — drawn from mechanisms, terminology & mistakes
  const techCards = cards.slice(0, 3);
  for (const c of techCards) {
    questions.push({
      id: `q_tech_${qIdx++}`,
      area: "TECHNICAL",
      weightPercent: 20,
      topic: c.data.topic,
      questionType: "EXPLAIN_OWN_WORDS",
      prompt: `[Technical Mechanism] How does "${c.data.topic}" work internally? Include key terminology (${
        c.data.terminology?.join(", ") || c.data.category
      }).`,
      expectedAnswer:
        c.data.howItWorks || c.data.simpleExplanation || c.data.definition,
    });
  }
  for (const m of mistakes.slice(0, 2)) {
    questions.push({
      id: `q_tech_mistake_${qIdx++}`,
      area: "TECHNICAL",
      weightPercent: 20,
      topic: m.data.relatedTopic,
      questionType: "DEBUGGING",
      prompt: `[Technical Troubleshooting] Regarding "${m.data.problemOrError}"${
        m.data.errorMessage ? ` (${m.data.errorMessage})` : ""
      }: what caused this issue and what is the technical fix?`,
      expectedAnswer: `Cause: ${m.data.whyItHappened}\nSolution: ${m.data.correctSolution}`,
    });
  }

  // 3. Practical Exercises (30% weight) — drawn from practical examples, commands & scenarios
  const practicalCards = cards.filter(
    (c) => c.data.practicalExample || c.data.codeOrCommands
  );
  const practicalPool = practicalCards.length > 0 ? practicalCards : cards;
  for (const c of practicalPool.slice(0, 3)) {
    questions.push({
      id: `q_prac_${qIdx++}`,
      area: "PRACTICAL",
      weightPercent: 30,
      topic: c.data.topic,
      questionType: c.data.codeOrCommands ? "COMMAND_RECALL" : "PRACTICAL_SCENARIO",
      prompt: c.data.codeOrCommands
        ? `[Practical Command / Config] Write the command or configuration snippet used for "${c.data.topic}" in a real ${c.data.category} scenario.`
        : `[Practical Scenario] Describe how you would apply "${c.data.topic}" in a hands-on ${c.data.category} scenario.`,
      expectedAnswer:
        c.data.codeOrCommands ||
        c.data.practicalExample ||
        c.data.howItWorks ||
        c.data.definition,
    });
  }

  // 4. Programming Challenges (30% weight) — drawn from Programming Exercises or code cards
  if (programmingExercises.length > 0) {
    for (const p of programmingExercises.slice(0, 3)) {
      questions.push({
        id: `q_prog_${qIdx++}`,
        area: "PROGRAMMING",
        weightPercent: 30,
        topic: `${p.data.language}: ${p.data.title}`,
        questionType: "CODE_REPRODUCTION",
        prompt: `[Programming Challenge — ${p.data.language}] Reproduce or write the solution for "${p.data.title}" (${p.data.conceptOrSyntax}).${
          p.data.expectedOutput ? ` Expected output: ${p.data.expectedOutput}` : ""
        }`,
        expectedAnswer: p.data.userSolution || p.data.codeExample,
        referenceCode: p.data.codeExample,
      });
    }
  } else {
    const codeCards = cards.filter(
      (c) =>
        c.data.category === "Programming" ||
        c.data.category === "Software Development" ||
        c.data.codeOrCommands
    );
    const fallbackPool = codeCards.length > 0 ? codeCards : cards.slice(0, 2);
    for (const c of fallbackPool.slice(0, 2)) {
      questions.push({
        id: `q_prog_fallback_${qIdx++}`,
        area: "PROGRAMMING",
        weightPercent: 30,
        topic: c.data.topic,
        questionType: "CODE_REPRODUCTION",
        prompt: `[Programming / Scripting Challenge] Write a short script, command sequence, or structured pseudocode demonstrating "${c.data.topic}".`,
        expectedAnswer:
          c.data.codeOrCommands || c.data.practicalExample || c.data.definition,
      });
    }
  }

  return { questions };
}

export async function submitWeeklyTkrsAssessment(
  evaluations: {
    questionId: string;
    area: "THEORETICAL" | "TECHNICAL" | "PRACTICAL" | "PROGRAMMING";
    topic: string;
    prompt: string;
    userAnswer: string;
    expectedAnswer: string;
    isCorrect: boolean;
  }[]
) {
  const user = await ensureUserExists();
  const state = await getTkrsState();

  const areas = ["THEORETICAL", "TECHNICAL", "PRACTICAL", "PROGRAMMING"] as const;
  const weights: Record<(typeof areas)[number], number> = {
    THEORETICAL: 0.2,
    TECHNICAL: 0.2,
    PRACTICAL: 0.3,
    PROGRAMMING: 0.3,
  };

  const areaScores: Record<(typeof areas)[number], number> = {
    THEORETICAL: 100,
    TECHNICAL: 100,
    PRACTICAL: 100,
    PROGRAMMING: 100,
  };

  let weightedSum = 0;
  let activeWeightSum = 0;

  for (const area of areas) {
    const areaItems = evaluations.filter((e) => e.area === area);
    if (areaItems.length > 0) {
      const correctInArea = areaItems.filter((e) => e.isCorrect).length;
      const pct = Math.round((correctInArea / areaItems.length) * 100);
      areaScores[area] = pct;
      weightedSum += pct * weights[area];
      activeWeightSum += weights[area];
    }
  }

  const overallScore =
    activeWeightSum > 0 ? Math.round(weightedSum / activeWeightSum) : 0;

  const correctCount = evaluations.filter((e) => e.isCorrect).length;
  const incorrectCount = evaluations.length - correctCount;

  const weakTopics = Array.from(
    new Set(evaluations.filter((e) => !e.isCorrect).map((e) => e.topic))
  );
  const strongTopics = Array.from(
    new Set(
      evaluations
        .filter((e) => e.isCorrect && !weakTopics.includes(e.topic))
        .map((e) => e.topic)
    )
  );

  const frequentlyForgotten = state.cards
    .filter((c) => c.revision.forgotCount > 0)
    .sort((a, b) => b.revision.forgotCount - a.revision.forgotCount)
    .map((c) => `${c.data.topic} (${c.revision.forgotCount}x forgotten)`);

  const recommendedPriorities = [
    ...weakTopics.map((t) => `Schedule immediate R1 active recall review for "${t}"`),
    ...state.overdueCards
      .slice(0, 3)
      .map((c) => `Complete overdue R${c.revision.currentStage} revision for "${c.data.topic}"`),
  ].slice(0, 5);

  const previousReport = state.assessments[0];
  const deltaFromPrevious = previousReport
    ? overallScore - previousReport.overallScore
    : null;

  const now = new Date();
  const reportData: Omit<WeeklyAssessmentReport, "id"> = {
    completedAt: now.toISOString(),
    overallScore,
    areaScores: {
      theoretical: areaScores.THEORETICAL,
      technical: areaScores.TECHNICAL,
      practical: areaScores.PRACTICAL,
      programming: areaScores.PROGRAMMING,
    },
    correctCount,
    incorrectCount,
    totalQuestions: evaluations.length,
    weakTopics,
    strongTopics,
    frequentlyForgotten,
    recommendedPriorities,
    deltaFromPrevious,
    questionResults: evaluations.map((e) => ({
      question: e.prompt,
      topic: e.topic,
      area: e.area,
      userAnswer: e.userAnswer,
      expectedAnswer: e.expectedAnswer,
      isCorrect: e.isCorrect,
    })),
  };

  const created = await prisma.revisionNote.create({
    data: {
      userId: user.id,
      category: CAT_ASSESSMENT,
      date: now,
      summary: `Weekly TKRS Assessment: ${overallScore}%`,
      cues: reportData as any,
      notes: [] as any,
    },
  });

  // Also record in ExamResult for unified analytics backward compatibility
  await prisma.examResult.create({
    data: {
      userId: user.id,
      type: "WEEKLY_RETENTION",
      score: correctCount,
      totalQs: evaluations.length,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { xp: { increment: 100 + overallScore } },
  });

  revalidateTkrsPaths();
  return {
    success: true,
    report: { ...reportData, id: created.id },
  };
}
