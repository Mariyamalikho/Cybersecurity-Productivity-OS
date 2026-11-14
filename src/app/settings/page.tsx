import type { Metadata } from "next";
import { SettingsClient } from "@/components/settings/settings-client";
import { getUserSettings } from "@/app/actions/settings";

export const metadata: Metadata = {
  title: "Account & System Configuration — Settings",
  description:
    "Manage system preferences, display themes, profile credentials, and integration settings.",
  alternates: { canonical: "/settings" },
};

export default async function SettingsPage() {
  const userProfile = await getUserSettings();

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Cyber Journey</span>
          <span aria-hidden="true">/</span>
          <span className="text-foreground/90 font-semibold">Settings</span>
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-h-[0px]">
        <SettingsClient initialProfile={userProfile} />
      </div>
    </div>
  );
}
