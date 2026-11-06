import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const clerkHandler = clerkMiddleware();

export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  const missingVars = [
    !process.env.CLERK_SECRET_KEY && "CLERK_SECRET_KEY",
    !process.env.DATABASE_URL && "DATABASE_URL",
  ].filter(Boolean) as string[];

  if (missingVars.length > 0) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Vercel Environment Variables Required</title>
  <style>
    body { background: #09090b; color: #fafafa; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; }
    .card { max-width: 620px; background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 28px; }
    h1 { margin-top: 0; font-size: 20px; color: #f97316; }
    p, li { color: #a1a1aa; line-height: 1.6; font-size: 14px; }
    code { background: #27272a; color: #fafafa; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Missing Vercel Environment Variables</h1>
    <p>Your Vercel deployment is live, but the following environment variables were not saved in your Vercel Project Settings:</p>
    <ul>
      ${missingVars.map((v) => `<li><code>${v}</code> is currently empty</li>`).join("")}
    </ul>
    <p><strong>How to fix:</strong></p>
    <ol>
      <li>In Vercel Dashboard, go to <strong>Settings &rarr; Environment Variables</strong>.</li>
      <li>Add <code>CLERK_SECRET_KEY</code>, <code>DATABASE_URL</code>, <code>DIRECT_URL</code>, and <code>GEMINI_API_KEY</code>.</li>
      <li><strong>Important:</strong> Scroll down and click the black <strong>Save</strong> button at the bottom of the form before leaving the page.</li>
      <li>Go to <strong>Deployments</strong> &rarr; click <strong>...</strong> on the top deployment &rarr; click <strong>Redeploy</strong>.</li>
    </ol>
  </div>
</body>
</html>`,
      {
        status: 503,
        headers: { "content-type": "text/html; charset=utf-8" },
      }
    );
  }

  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
