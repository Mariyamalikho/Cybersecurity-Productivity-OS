"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Flame, Plus, Check } from "lucide-react";
import { toggleHabit } from "@/app/actions/habits";
import { useTransition } from "react";

type Habit = {
  id: string;
  name: string;
  category: string;
  currentStreak: number;
  completedToday: boolean;
};

export function HabitClient({ habits }: { habits: Habit[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string) => {
    startTransition(() => {
      toggleHabit(id);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {habits.map(habit => (
        <Card key={habit.id} className="border-border/40 hover:border-border transition-colors group overflow-hidden relative">
          <div className={`absolute top-0 left-0 w-1 h-full ${habit.completedToday ? 'bg-green-500' : 'bg-muted-foreground/20'}`} />
          <CardHeader className="pb-3 pt-5 pl-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">
                  {habit.category}
                </span>
                <CardTitle className="text-lg font-semibold">{habit.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-6 pb-5">
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md text-xs font-semibold">
                <Flame className="w-3.5 h-3.5" />
                {habit.currentStreak} Day Streak
              </div>
              
              <button 
                onClick={() => handleToggle(habit.id)}
                disabled={isPending}
                className={`p-2 rounded-full transition-all ${habit.completedToday ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary'} ${isPending ? 'opacity-50' : ''}`}
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      {habits.length === 0 && (
        <div className="col-span-full p-12 border border-border/40 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground font-medium">No habits tracked yet.</p>
          <p className="text-sm text-muted-foreground/70 mt-2">Click "New Habit" to get started.</p>
        </div>
      )}
    </div>
  );
}
