"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useState, useTransition, useEffect } from "react";
import { updateProfileName } from "@/app/actions/settings";
import { Moon, Sun, Monitor, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export function SettingsClient({ initialProfile }: { initialProfile: any }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [name, setName] = useState(initialProfile.name || "");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateProfileName(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-8 pb-12">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="grid gap-8">
        
        {/* Profile Settings */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your public display name.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={initialProfile.email} disabled className="bg-muted/50" />
                <p className="text-[10px] text-muted-foreground">Email is managed via your Clerk account.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-500 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Saved
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Theme Preferences */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the interface theme.</CardDescription>
          </CardHeader>
          <CardContent>
            {mounted && (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === 'light' ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-border'
                  }`}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-border'
                  }`}
                >
                  <Moon className="w-6 h-6" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === 'system' ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-border'
                  }`}
                >
                  <Monitor className="w-6 h-6" />
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="border-border/40 bg-muted/10">
          <CardHeader>
            <CardTitle className="text-lg">Account Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Rank</p>
                <p className="font-semibold">{initialProfile.level}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total XP</p>
                <p className="font-semibold">{initialProfile.xp} XP</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Member Since</p>
                <p className="font-semibold">{format(new Date(initialProfile.joined), "MMM yyyy")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </CardTitle>
            <CardDescription className="text-red-500/80">
              Permanently delete your account and wipe all database records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              onClick={() => setDeleteModalOpen(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
            >
              Delete Account
            </button>

            {deleteModalOpen && (
              <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 max-w-md">
                <p className="text-sm font-medium text-red-500 mb-2">Are you absolutely sure?</p>
                <p className="text-xs text-red-500/80 mb-4">
                  This action cannot be undone. This will permanently delete your account, habits, tasks, journals, and all XP.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      alert("Simulated: Database records wiped. (Disabled in dev environment to prevent accidental loss)");
                      setDeleteModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-500 text-white hover:bg-red-600"
                  >
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
