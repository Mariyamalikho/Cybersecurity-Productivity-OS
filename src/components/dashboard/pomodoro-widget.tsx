"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { logPomodoroSession } from "@/app/actions/dashboard";

export function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      // Timer finished - log to database
      startTransition(() => {
        logPomodoroSession(25);
      });
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="border-border/40 hover:border-border transition-colors h-full flex flex-col bg-card/50 relative overflow-hidden">
      {/* Background glowing circle */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 ${isActive ? 'bg-red-500' : 'bg-primary'}`} />
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-lg font-semibold text-center">Focus Session</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10">
        
        <div className="text-6xl font-heading font-bold tabular-nums tracking-tighter my-4">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        
        {timeLeft === 0 && isPending && (
          <p className="text-xs text-green-500 font-medium mb-4 animate-pulse">Logging session...</p>
        )}
        {timeLeft === 0 && !isPending && (
          <p className="text-xs text-green-500 font-medium mb-4">Session Logged! (+5 XP)</p>
        )}

        <div className="flex items-center gap-4 mt-2">
          <button 
            onClick={toggleTimer}
            disabled={timeLeft === 0 && isPending}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
