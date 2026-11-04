"use client";

import { useState, useTransition, useRef } from "react";
import { generateQuizForTask, saveQuizResult } from "@/app/actions/quiz";
import { Loader2, Brain, CheckCircle2, XCircle } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export function QuizClient({ taskId, taskTitle }: { taskId: string; taskTitle: string }) {
  const [isPending, startTransition] = useTransition();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState("");
  const cardTopRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    setError("");
    startTransition(async () => {
      try {
        const generated = await generateQuizForTask(taskId, taskTitle);
        setQuestions(generated);
      } catch (err: any) {
        setError(err.message || "Failed to generate quiz. Please check your API key.");
      }
    });
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === questions[currentIdx].correctAnswerIndex) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      explanationRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      cardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    startTransition(async () => {
      try {
        const finalScore = selectedOption === questions[currentIdx].correctAnswerIndex ? score + 1 : score;
        await saveQuizResult(taskId, finalScore);
      } catch (err: any) {
        setError("Could not save result.");
      }
    });
  };

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg space-y-3">
        <p>{error}</p>
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry Quiz Generation
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-card border border-border/40 p-8 rounded-xl text-center space-y-6">
        <Brain className="w-16 h-16 text-primary mx-auto opacity-50" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Generate Daily Synthesis Quiz</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Click below to generate a 10-question multiple-choice quiz testing all of today's completed topics.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : "Start Quiz"}
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-card border border-border/40 p-8 rounded-xl text-center space-y-4">
        <h2 className="text-3xl font-bold">Quiz Complete</h2>
        <p className="text-5xl font-black text-primary py-4">{score} / {questions.length}</p>
        <p className="text-muted-foreground">Your score has been saved and +50 XP has been granted.</p>
        {isPending ? (
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Saving results...
          </p>
        ) : (
          <a href="/tasks" className="inline-block mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
            Return to Tasks
          </a>
        )}
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div ref={cardTopRef} className="bg-card border border-border/40 rounded-xl p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center text-sm font-medium text-muted-foreground border-b border-border/40 pb-4">
        <span>Question {currentIdx + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <h3 className="text-lg md:text-xl font-medium leading-relaxed break-words">{q.question}</h3>

      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          let btnClass = "border-border/40 bg-card hover:bg-muted/30";

          if (isAnswered) {
            if (idx === q.correctAnswerIndex) {
              btnClass = "border-green-500 bg-green-500/10 text-green-500";
            } else if (idx === selectedOption) {
              btnClass = "border-red-500 bg-red-500/10 text-red-500";
            } else {
              btnClass = "border-border/40 opacity-50";
            }
          } else if (idx === selectedOption) {
            btnClass = "border-primary bg-primary/10";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${btnClass} flex items-start gap-3 cursor-pointer disabled:cursor-default`}
            >
              <div className={`w-5 h-5 mt-0.5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                isAnswered && idx === q.correctAnswerIndex ? "border-green-500 bg-green-500 text-white" :
                isAnswered && idx === selectedOption ? "border-red-500 bg-red-500 text-white" :
                "border-muted-foreground/30"
              }`}>
                {isAnswered && idx === q.correctAnswerIndex && <CheckCircle2 className="w-4 h-4" />}
                {isAnswered && idx === selectedOption && idx !== q.correctAnswerIndex && <XCircle className="w-4 h-4" />}
              </div>
              <span className="text-sm md:text-base leading-relaxed break-words">{opt}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          ref={explanationRef}
          className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/40 animate-in fade-in slide-in-from-bottom-2"
        >
          <p className="text-sm font-semibold mb-1">Explanation:</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>

          <button
            onClick={handleNext}
            className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors w-full sm:w-auto cursor-pointer"
          >
            {currentIdx < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}
