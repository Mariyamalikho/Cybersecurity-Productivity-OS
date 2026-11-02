"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateWithFallback } from "@/lib/gemini";
import fs from "fs";
import path from "path";

function getLatestTilContext(): string {
  try {
    const tilDir = path.join(process.cwd(), "TIL-Cybersecurity");
    if (!fs.existsSync(tilDir)) return "";

    const pieces: string[] = [];
    const weekDirs = fs
      .readdirSync(tilDir)
      .filter(d => d.startsWith("Week-") && fs.statSync(path.join(tilDir, d)).isDirectory())
      .sort();

    if (weekDirs.length > 0) {
      const latestWeek = path.join(tilDir, weekDirs[weekDirs.length - 1]);
      const mdFiles = fs
        .readdirSync(latestWeek)
        .filter(f => f.endsWith(".md") && !f.toLowerCase().includes("revision"))
        .sort();
      if (mdFiles.length > 0) {
        const latestMd = path.join(latestWeek, mdFiles[mdFiles.length - 1]);
        pieces.push(`Daily Log (${mdFiles[mdFiles.length - 1]}):\n${fs.readFileSync(latestMd, "utf8")}`);
      }
    }

    const scriptsDir = path.join(tilDir, "Scripts");
    if (fs.existsSync(scriptsDir)) {
      const pyFiles = fs.readdirSync(scriptsDir).sort();
      if (pyFiles.length > 0) {
        const latestScript = path.join(scriptsDir, pyFiles[pyFiles.length - 1]);
        pieces.push(`Code Written (${pyFiles[pyFiles.length - 1]}):\n${fs.readFileSync(latestScript, "utf8")}`);
      }
    }

    return pieces.join("\n\n");
  } catch {
    return "";
  }
}

export async function generateRevisionNote(type: "daily" | "weekly" | "monthly") {
  try {
    const user = await ensureUserExists();
    if (!user) throw new Error("Unauthorized");

    const daysAgo = type === "daily" ? 2 : type === "weekly" ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();

    const completedTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        completedAt: { gte: startDate, lte: endDate }
      },
      select: { title: true, category: true }
    });

    if (completedTasks.length === 0) {
      throw new Error(`No completed tasks found for ${type} revision.`);
    }

    const tilContext = getLatestTilContext();

    const tasksByCategory = completedTasks.reduce((acc, task) => {
      const cat = task.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(task.title);
      return acc;
    }, {} as Record<string, string[]>);

    const generatedNotes = [];

    for (const [category, topics] of Object.entries(tasksByCategory)) {
      const topicsList = topics.join(", ");

      const prompt = `
        You are generating a technical Cornell Notes table strictly faithful to the actual curriculum material studied.
        Category: "${category}"
        Completed Tasks: "${topicsList}"
        ${tilContext ? `\nActual Student Daily Log & Code from TIL Repository:\n${tilContext}\n` : ""}

        Return the response STRICTLY as a JSON object (no markdown fences, no backticks).

        CRITICAL CONTENT & FORMATTING RULES:
        1. Base all cues and notes STRICTLY on the actual technical syllabus of the completed tasks and the student's daily log/code above. Do NOT invent unrelated topics.
        2. HIGH-YIELD CONCISENESS ONLY: Include ONLY the most important core concepts and definitions. Omit filler, meta-commentary ("I learned..."), exam logistics/weights, mnemonics, or tangential trivia.
        3. "cues" and "notes" MUST have the EXACT same number of items (3 to 4 rows max), where cues[i] is the left-column "Cue / Keyword" header and notes[i] is the corresponding right-column "Notes & Main Ideas" for that exact row.
        4. Each item in "notes" must contain 2 to 3 ultra-short, single-line bullet points separated by "\\n", starting with "• " followed by the term/concept name, a colon, and a short core definition.
        5. "summary" must be 1 to 2 short, direct sentences synthesizing the core concepts.

        Required JSON schema:
        {
          "cues": ["Topic / Concept 1", "Topic / Concept 2", "..."],
          "notes": ["• Term A: Exact technical definition.\\n• Term B: Exact technical definition.", "..."],
          "summary": "Direct 1-2 sentence technical synthesis."
        }
      `;

      let text = await generateWithFallback(prompt);

      if (text.startsWith("```json")) text = text.replace("```json", "");
      if (text.startsWith("```")) text = text.replace("```", "");
      if (text.endsWith("```")) text = text.slice(0, -3);

      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.slice(firstBrace, lastBrace + 1);
      }

      try {
        const parsed = JSON.parse(text);

        const note = await prisma.revisionNote.create({
          data: {
            userId: user.id,
            category: category,
            date: new Date(),
            cues: parsed.cues || [],
            notes: parsed.notes || [],
            summary: parsed.summary || ""
          }
        });

        generatedNotes.push(note);
      } catch (e) {
        console.error(`Failed to parse revision for category ${category}`, text);
      }
    }

    if (generatedNotes.length === 0) {
      throw new Error("Failed to generate any valid revision notes.");
    }

    const baseXp = type === "daily" ? 15 : type === "weekly" ? 50 : 100;
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: baseXp } }
    });

    revalidatePath("/learning/revision");
    revalidatePath("/");

    return { success: true, count: generatedNotes.length, earnedXp: baseXp };
  } catch (error: any) {
    console.error("Revision Error:", error);
    throw new Error(error.message || "Failed to generate revision note");
  }
}
