import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export async function ensureUserExists() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // FAST PATH: Try to find the user in the database without calling Clerk's API
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (existingUser) {
    return existingUser;
  }

  // SLOW PATH: First time sign-in, fetch details from Clerk
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const primaryEmail = user.emailAddresses[0]?.emailAddress ?? "no-email@example.com";
  
  // Create the user in our database
  const newUser = await prisma.user.create({
    data: {
      clerkId: userId,
      email: primaryEmail,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Unknown",
      level: "Cyber Rookie",
      xp: 0,
    },
  });

  return newUser;
}
