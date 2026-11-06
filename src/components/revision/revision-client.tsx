"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, BookCheck, BookOpen, Clock } from "lucide-react";
import { generateRevisionNote } from "@/app/actions/revision";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function RevisionClient({ initialNotes }: { initialNotes: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGenerate = async (type: "daily" | "weekly" | "monthly") => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);
      const res = await generateRevisionNote(type);
      if (res.success) {
        setSuccessMsg(`Generated ${res.count} notes (+${res.earnedXp} XP)`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border/40">
        <div className="flex-1 flex gap-4 w-full">
          <Button
            onClick={() => handleGenerate("daily")}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BookCheck className="w-4 h-4 mr-2" />}
            Generate Daily Review
          </Button>
          <Button
            onClick={() => handleGenerate("weekly")}
            disabled={loading}
            variant="outline"
            className="flex-1 cursor-pointer"
          >
            Generate Weekly Review
          </Button>
        </div>
        {error && <span className="text-destructive text-sm font-medium">{error}</span>}
        {successMsg && <span className="text-green-500 text-sm font-medium">{successMsg}</span>}
      </div>

      {/* Notes Display */}
      {initialNotes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No revision notes found. Generate one to start reviewing!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {initialNotes.map((note) => {
            const cues: string[] = Array.isArray(note.cues) ? note.cues : [];
            const notesContent: string[] = Array.isArray(note.notes) ? note.notes : [];
            const rowCount = Math.max(cues.length, notesContent.length);

            return (
              <div key={note.id} className="space-y-2">
                <div className="flex items-center justify-between text-muted-foreground px-1">
                  <h3 className="font-heading font-bold text-lg text-primary">{note.category}</h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(note.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Cornell Note Table Layout */}
                <Card className="border-border/40 overflow-hidden bg-card/50">
                  <CardContent className="p-0">
                    {/* Table Header */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-border/50 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <div className="px-5 py-3 md:col-span-4 md:border-r border-border/50">
                        Cues / Keywords
                      </div>
                      <div className="px-5 py-3 md:col-span-8">
                        Notes & Main Ideas
                      </div>
                    </div>

                    {/* Paired Rows */}
                    <div className="divide-y divide-border/40">
                      {Array.from({ length: rowCount }).map((_, idx) => {
                        const cue = cues[idx] || "";
                        const rawNote = notesContent[idx] || "";
                        const bullets = rawNote
                          .split(/(?:\r?\n|(?=•\s))/)
                          .map((b: string) => b.replace(/^•\s*/, "").trim())
                          .filter(Boolean);

                        return (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-12">
                            <div className="p-5 md:col-span-4 bg-muted/15 md:border-r border-border/40 font-semibold text-sm text-foreground flex items-start">
                              {cue}
                            </div>
                            <div className="p-5 md:col-span-8 space-y-1.5">
                              {bullets.map((b: string, bIdx: number) => (
                                <p key={bIdx} className="text-sm leading-relaxed text-foreground/90">
                                  <span className="text-primary font-bold">{"• "}</span>
                                  {b}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Row: Summary */}
                    <div className="p-5 border-t border-border/50 bg-muted/20">
                      <p className="text-sm leading-relaxed text-foreground/90">
                        <span className="font-bold uppercase tracking-wider text-xs text-primary">
                          {"Summary: "}
                        </span>
                        {note.summary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
