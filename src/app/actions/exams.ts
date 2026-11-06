"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveExamResult(type: string, score: number, totalQs: number) {
  try {
    const user = await ensureUserExists();
    if (!user) throw new Error("Unauthorized");

    // Save result
    await prisma.examResult.create({
      data: {
        userId: user.id,
        type: type.toUpperCase(), // "WEEKLY" or "MONTHLY"
        score: score,
        totalQs: totalQs
      }
    });

    // Reward massive XP for Mastery Exams
    // Weekly (50 Qs) -> Base 200 XP + Bonus for high score
    // Monthly (100 Qs) -> Base 500 XP + Bonus for high score
    const baseXp = type === "weekly" ? 200 : 500;
    const scorePercent = score / totalQs;
    const bonusXp = Math.round(baseXp * scorePercent); // Up to double XP for 100%

    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: baseXp + bonusXp } }
    });

    revalidatePath("/learning/exams");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    
    return { success: true, earnedXp: baseXp + bonusXp };
  } catch (error: any) {
    console.error("Error saving exam:", error);
    throw new Error(error.message || "Failed to save exam result");
  }
}

import { generateWithFallback } from "@/lib/gemini";

export async function generateExam(type: "weekly" | "monthly") {
  try {
    const user = await ensureUserExists();
    if (!user) throw new Error("Unauthorized");

    const daysAgo = type === "weekly" ? 7 : 30;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysAgo);

    const completedTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        completedAt: { gte: targetDate }
      },
      select: { title: true }
    });

    if (completedTasks.length === 0) {
      throw new Error("Not enough completed tasks to generate an exam.");
    }

    const topics = completedTasks.map(t => t.title).join(", ");
    const totalQuestions = type === "weekly" ? 50 : 100;
    const chunkSize = 25;
    const numChunks = Math.ceil(totalQuestions / chunkSize);
    
    let allQuestions: any[] = [];

    for (let i = 0; i < numChunks; i++) {
      let chunkSuccess = false;
      let attempts = 0;
      
      while (!chunkSuccess && attempts < 3) {
        attempts++;
        try {
          const prompt = `
            You are an expert cybersecurity and Python instructor.
            Generate exactly ${chunkSize} highly challenging multiple-choice questions based on the following topics:
            "${topics}"

            This is chunk ${i + 1} of ${numChunks}. Ensure these questions are unique and do not repeat.
            Return the response STRICTLY as a JSON array of objects. Do not include markdown blocks (\`\`\`json).
            Structure for each object:
            {
              "question": "The question text",
              "options": ["A) Option", "B) Option", "C) Option", "D) Option"],
              "correctAnswerIndex": 0,
              "explanation": "Brief explanation"
            }
          `;

          let text = await generateWithFallback(prompt);
          
          if (text.startsWith("```json")) text = text.replace("```json", "");
          if (text.startsWith("```")) text = text.replace("```", "");
          if (text.endsWith("```")) text = text.slice(0, -3);
          
          // Additional cleanup in case of extra whitespace or trailing text
          const firstBracket = text.indexOf('[');
          const lastBracket = text.lastIndexOf(']');
          if (firstBracket !== -1 && lastBracket !== -1) {
            text = text.slice(firstBracket, lastBracket + 1);
          }

          const chunk = JSON.parse(text);
          if (Array.isArray(chunk)) {
            allQuestions = [...allQuestions, ...chunk];
            chunkSuccess = true;
          } else {
            throw new Error("Parsed JSON is not an array");
          }
        } catch (e) {
          console.error(`Failed to parse chunk ${i} on attempt ${attempts}`, e);
          if (attempts >= 3) {
            console.error(`Chunk ${i} failed completely after 3 attempts.`);
          }
        }
      }
    }

    return { questions: allQuestions };
  } catch (error: any) {
    console.error("Mastery Exam Error:", error);
    throw new Error(error.message || "Failed to generate exam");
  }
}

