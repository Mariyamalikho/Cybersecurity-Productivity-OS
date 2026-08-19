"use server";

import { ensureUserExists } from "@/lib/auth";

export async function getUserProfile() {
  try {
    const user = await ensureUserExists();
    return user;
  } catch (error) {
    return null;
  }
}
