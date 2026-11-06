"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { logPomodoroSession } from "@/app/actions/dashboard";

export function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const ensureAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playAlarmRing = useCallback(() => {
    if (isMuted) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    // Play a two-burst resonant bell chime sequence (C5 -> E5 -> G5 -> C6)
    const notes = [
      { freq: 523.25, delay: 0.0, duration: 0.35 },
      { freq: 659.25, delay: 0.18, duration: 0.35 },
      { freq: 783.99, delay: 0.36, duration: 0.35 },
      { freq: 1046.5, delay: 0.54, duration: 0.7 },
      { freq: 523.25, delay: 1.4, duration: 0.35 },
      { freq: 659.25, delay: 1.58, duration: 0.35 },
      { freq: 783.99, delay: 1.76, duration: 0.35 },
      { freq: 1046.5, delay: 1.94, duration: 0.9 },
    ];

    const now = ctx.currentTime;
    notes.forEach(({ freq, delay, duration }) => {
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);

      overtone.type = "triangle";
      overtone.frequency.setValueAtTime(freq * 2, now + delay);

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.28, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      overtone.start(now + delay);
      osc.stop(now + delay + duration + 0.05);
      overtone.stop(now + delay + duration + 0.05);
    });
  }, [isMuted, ensureAudioContext]);

  useEffect(() => {
    if (!isActive) {
      endTimeRef.current = null;
      return;
    }

    endTimeRef.current = Date.now() + timeLeft * 1000;

    const interval = setInterval(() => {
      if (!endTimeRef.current) return;
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        setIsActive(false);
        playAlarmRing();
        startTransition(() => {
          logPomodoroSession(25);
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, playAlarmRing]);

  const toggleTimer = () => {
    ensureAudioContext();
    if (timeLeft === 0) {
      setTimeLeft(25 * 60);
    }
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    endTimeRef.current = null;
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="border-border/40 hover:border-border transition-colors h-full flex flex-col bg-card/50 relative overflow-hidden">
      {/* Background glowing circle */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 ${
          isActive ? "bg-red-500" : "bg-primary"
        }`}
      />

      <CardHeader className="pb-2 relative z-10 flex flex-row items-center justify-between">
        <div className="w-7" />
        <CardTitle className="text-lg font-semibold text-center">Focus Session</CardTitle>
        <button
          type="button"
          onClick={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            if (!nextMuted) {
              ensureAudioContext();
            }
          }}
          title={isMuted ? "Unmute timer chime" : "Mute timer chime"}
          className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="text-6xl font-heading font-bold tabular-nums tracking-tighter my-4">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
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
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
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
