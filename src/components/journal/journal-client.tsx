"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Flame, Zap, Brain } from "lucide-react";
import { createJournalEntry } from "@/app/actions/journal";
import { useState, useTransition } from "react";
import { format } from "date-fns";

export function JournalClient({ entries }: { entries: any[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createJournalEntry(formData);
      setOpen(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Daily Journal</h1>
          <p className="text-muted-foreground">Log your mood, energy levels, and psychological state.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Log Entry
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Today's Log</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <select id="mood" name="mood" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Low">Low</option>
                    <option value="Burnout">Burnout</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="energy">Energy Level</Label>
                  <select id="energy" name="energy" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                    <option value="Exhausted">Exhausted</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="focus">Focus Intensity (1-10)</Label>
                <Input id="focus" name="focus" type="number" min="1" max="10" placeholder="e.g. 8" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Reflections</Label>
                <Textarea id="notes" name="notes" placeholder="How was the grind today? Any blockers?" className="h-24" />
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Logging..." : "Log Entry (+10 XP)"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {entries.length === 0 && (
          <div className="p-12 border border-border/40 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground font-medium">No journal entries yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Log your first entry to start tracking your mental state.</p>
          </div>
        )}

        {entries.map((entry) => (
          <Card key={entry.id} className="border-border/40 hover:border-border transition-colors group">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {format(new Date(entry.createdAt), "EEEE, MMMM do, yyyy")}
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {format(new Date(entry.createdAt), "h:mm a")}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                  entry.mood === 'Excellent' ? 'bg-green-500/10 text-green-500' :
                  entry.mood === 'Good' ? 'bg-blue-500/10 text-blue-500' :
                  entry.mood === 'Burnout' ? 'bg-red-500/10 text-red-500' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <Flame className="w-3.5 h-3.5" /> {entry.mood}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-500/10 text-orange-500">
                  <Zap className="w-3.5 h-3.5" /> {entry.energy} Energy
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-500">
                  <Brain className="w-3.5 h-3.5" /> {entry.focus}/10 Focus
                </div>
              </div>
              {entry.notes && (
                <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border border-border/40">
                  {entry.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
