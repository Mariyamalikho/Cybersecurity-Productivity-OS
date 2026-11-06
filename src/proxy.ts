import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const cleanEnv = (val?: string) => val?.trim().replace(/^["']|["']$/g, "");

const clerkHandler = clerkMiddleware(() => NextResponse.next(), () => ({
  publishableKey: cleanEnv(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  secretKey: cleanEnv(process.env.CLERK_SECRET_KEY),
  signInUrl: cleanEnv(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL) || "/sign-in",
  signUpUrl: cleanEnv(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL) || "/sign-up",
}));

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  try {
    const response = await clerkHandler(request, event);
    return response ?? NextResponse.next();
  } catch (error) {
    console.error("Proxy invocation error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
