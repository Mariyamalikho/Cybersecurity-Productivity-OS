import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In — Authentication Portal",
  description: "Secure authentication portal for Cybersecurity Productivity OS.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background/50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <SignIn routing="hash" />
      </div>
    </div>
  );
}
