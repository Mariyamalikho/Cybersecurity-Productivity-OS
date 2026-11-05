"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateWithFallback } from "@/lib/gemini";

export async function generateQuizForTask(taskId: string, topic: string) {
  try {
    const user = await ensureUserExists();
    if (!user) throw new Error("Unauthorized");

    const task = await prisma.task.findUnique({
      where: { id: taskId, userId: user.id }
    });

    if (!task) throw new Error("Task not found");

    const prompt = `
      You are an expert cybersecurity and Python instructor.
      Generate a 10-question multiple-choice quiz based on the following daily learning topics:
      "${topic}"

      The quiz should test foundational knowledge and practical application across these topics.
      Return the response STRICTLY as a JSON array of objects. Do not include markdown code blocks (\`\`\`json) or any other text.
      Each object must have this exact structure:
      {
        "question": "The question text",
        "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        "correctAnswerIndex": 0,
        "explanation": "Brief explanation of why this is correct."
      }
    `;

    let text = await generateWithFallback(prompt);

    if (text.startsWith("```json")) text = text.replace("```json", "");
    if (text.startsWith("```")) text = text.replace("```", "");
    if (text.endsWith("```")) text = text.slice(0, -3);

    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket !== -1) {
      text = text.slice(firstBracket, lastBracket + 1);
    }

    const questions = JSON.parse(text);
    return questions;
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    throw new Error(error.message || "Failed to generate quiz");
  }
}

export async function saveQuizResult(taskId: string, score: number) {
  try {
    const user = await ensureUserExists();
    if (!user) throw new Error("Unauthorized");

    const existingResult = await prisma.quizResult.findUnique({
      where: { taskId }
    });

    if (existingResult) {
      throw new Error("Quiz already completed for today.");
    }

    await prisma.quizResult.create({
      data: {
        userId: user.id,
        taskId: taskId,
        score: score
      }
    });

    // Grant 50 XP for completing the Daily Synthesis Quiz
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 50 } }
    });

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (task?.status !== "COMPLETED") {
      await prisma.task.update({
        where: { id: taskId },
        data: {
          status: "COMPLETED",
          completedAt: new Date()
        }
      });
      await prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: 20 } }
      });
    }

    revalidatePath("/tasks");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Error saving quiz:", error);
    throw new Error(error.message || "Failed to save quiz result");
  }
}
