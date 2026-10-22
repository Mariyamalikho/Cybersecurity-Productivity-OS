"use server";

import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileName(formData: FormData) {
  const user = await ensureUserExists();
  const name = formData.get("name") as string;

  if (!name || name.trim() === "") return { error: "Name is required" };

  await prisma.user.update({
    where: { id: user.id },
    data: { name: name.trim() }
  });

  revalidatePath("/settings");
  revalidatePath("/"); // Update sidebar
  return { success: true };
}

export async function getUserSettings() {
  const user = await ensureUserExists();
  return {
    name: user.name,
    email: user.email,
    level: user.level,
    xp: user.xp,
    joined: user.createdAt
  };
}
