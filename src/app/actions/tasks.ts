"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ensureCardForCompletedTask } from "@/app/actions/tkrs";

export async function getTasks() {
  const user = await ensureUserExists();
  
  return await prisma.task.findMany({
    where: { userId: user.id },
    include: { quizResult: true },
    orderBy: [
      { dueDate: 'asc' },
      { createdAt: 'desc' }
    ]
  });
}

export async function createTask(formData: FormData) {
  const user = await ensureUserExists();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const dueDateStr = formData.get("dueDate") as string;

  if (!title) return { error: "Missing title" };

  await prisma.task.create({
    data: {
      title,
      category: category || "General",
      userId: user.id,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
    }
  });

  revalidatePath("/tasks");
  revalidatePath("/calendar");
  revalidatePath("/");
  return { success: true };
}

export async function toggleTask(taskId: string, currentStatus: string) {
  const user = await ensureUserExists();
  
  const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
  const completedAt = newStatus === "COMPLETED" ? new Date() : null;

  const updatedTask = await prisma.task.update({
    where: { id: taskId, userId: user.id },
    data: { status: newStatus, completedAt }
  });

  if (newStatus === "COMPLETED") {
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: 20 } }
    });

    // Automatically generate R0-R7 revision schedule & Knowledge Card when a concept is marked as learned
    try {
      await ensureCardForCompletedTask(user.id, updatedTask);
    } catch (e) {
      console.error("TKRS auto-card creation warning:", e);
    }
  } else if (currentStatus === "COMPLETED" && newStatus === "PENDING") {
    // If they un-check a task, remove the XP they gained
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { decrement: 20 } }
    });
  }

  revalidatePath("/tasks");
  revalidatePath("/learning/revision");
  revalidatePath("/calendar");
  revalidatePath("/");
}
