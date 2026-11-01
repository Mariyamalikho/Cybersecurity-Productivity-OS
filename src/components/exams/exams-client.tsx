"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit, CalendarDays, CheckCircle2, Trophy, Clock } from "lucide-react";
import { saveExamResult, generateExam } from "@/app/actions/exams";

type Question = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export function ExamsClient({ pastResults }: { pastResults: any[] }) {
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examState, setExamState] = useState<"idle" | "testing" | "results">("idle");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [examType, setExamType] = useState<string>("weekly");

  const [savingResult, setSavingResult] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const startExam = async (type: "weekly" | "monthly") => {
    try {
      setLoading(true);
      setLoadingType(type);
      setError(null);
      setExamType(type);

      const data = await generateExam(type);

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions generated.");
      }

      setQuestions(data.questions);
      setExamState("testing");
      setCurrentQIndex(0);
      setScore(0);
      setSelectedAnswer(null);

    } catch (err: any) {
      setError(err.message || "Failed to generate exam.");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === questions[currentQIndex].correctAnswerIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(q => q + 1);
      setSelectedAnswer(null);
    } else {
      finishExam(score + (isCorrect ? 1 : 0), questions.length);
    }
  };

  const finishExam = async (finalScore: number, totalQs: number) => {
    setExamState("results");
    setSavingResult(true);
    try {
      const res = await saveExamResult(examType, finalScore, totalQs);
      if (res.success) {
        setEarnedXp(res.earnedXp);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingResult(false);
    }
  };

  if (examState === "testing") {
    const q = questions[currentQIndex];
    return (
      <Card className="border-border/40 max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center mb-4 text-sm font-medium text-muted-foreground">
            <span>{examType.toUpperCase()} EXAM</span>
            <span>Question {currentQIndex + 1} of {questions.length}</span>
          </div>
          <CardTitle className="text-xl leading-relaxed">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <Button
                key={i}
                variant={selectedAnswer === i ? "default" : "outline"}
                className={`w-full justify-start h-auto py-4 px-6 text-left whitespace-normal ${
                  selectedAnswer === i ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedAnswer(i)}
              >
                {opt}
              </Button>
            ))}
          </div>

          <div className="pt-6 flex justify-end">
            <Button 
              onClick={handleAnswerSubmit} 
              disabled={selectedAnswer === null}
              className="px-8"
            >
              {currentQIndex === questions.length - 1 ? "Finish Exam" : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (examState === "results") {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <Card className="border-border/40 text-center py-12">
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-heading font-bold">Exam Complete!</h2>
            <p className="text-muted-foreground text-lg">You scored {score} out of {questions.length} ({percent}%)</p>
          </div>

          {savingResult ? (
            <div className="flex items-center gap-2 text-muted-foreground mt-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving results...
            </div>
          ) : (
            <div className="bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold text-lg animate-in fade-in slide-in-from-bottom-2 mt-4">
              +{earnedXp} XP Earned
            </div>
          )}

          <Button 
            className="mt-8" 
            variant="outline" 
            onClick={() => setExamState("idle")}
          >
            Return to Exams
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40 hover:border-border transition-colors">
          <CardHeader>
            <BrainCircuit className="w-10 h-10 text-blue-500 mb-4" />
            <CardTitle>Weekly Mastery Exam</CardTitle>
            <CardDescription>A rigorous 50-question exam dynamically generated from everything you have studied over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => startExam("weekly")}
              disabled={loading}
            >
              {loading && loadingType === "weekly" ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating (~15s)...</>
              ) : "Start Weekly Exam (50 Qs)"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:border-border transition-colors">
          <CardHeader>
            <CalendarDays className="w-10 h-10 text-purple-500 mb-4" />
            <CardTitle>Monthly Mastery Exam</CardTitle>
            <CardDescription>The ultimate test. A brutal 100-question exam covering the entire last 30 days of your curriculum.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="default"
              onClick={() => startExam("monthly")}
              disabled={loading}
            >
              {loading && loadingType === "monthly" ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating (~30s)...</>
              ) : "Start Monthly Exam (100 Qs)"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Past Results</h3>
        {pastResults.length === 0 ? (
          <p className="text-muted-foreground text-sm">No exams completed yet. Take your first one above!</p>
        ) : (
          <div className="space-y-3">
            {pastResults.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${r.type === 'WEEKLY' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{r.type} Exam</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(r.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{r.score}</span>
                  <span className="text-muted-foreground text-sm"> / {r.totalQs}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
