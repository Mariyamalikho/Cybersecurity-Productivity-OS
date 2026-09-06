"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, endOfWeek, subWeeks, addWeeks, subMonths, addMonths, isSameMonth, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TaskDialog } from "./task-dialog";

type Task = {
  id: string;
  title: string;
  category: string;
  scope?: string;
  status: string;
  dueDate: Date | null;
};

export function CalendarClient({ tasks }: { tasks: Task[] }) {
  const [view, setView] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Week View logic
  const startDateWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDateWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Month View logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDateMonth = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDateMonth = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Generate days for Month view
  const monthDays = [];
  let day = startDateMonth;
  while (day <= endDateMonth) {
    monthDays.push(day);
    day = addDays(day, 1);
  }

  const next = () => {
    if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const prev = () => {
    if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Cyber Journey</span>
          <span>/</span>
          <span>Calendar</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 mr-4 border-r border-border/40 pr-6">
            <button 
              onClick={() => setView("month")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === "month" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView("week")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === "week" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}
            >
              Week
            </button>
          </div>
          <TaskDialog />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 min-h-[0px]">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">
                {view === "week" ? format(startDateWeek, "MMMM yyyy") : format(currentDate, "MMMM yyyy")}
              </h1>
              <p className="text-muted-foreground">Allocate time for deep work, classes, and research.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={prev} className="p-2 rounded-full hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors">
                Today
              </button>
              <button onClick={next} className="p-2 rounded-full hover:bg-muted transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <Card className="border-border/40 overflow-hidden flex flex-col">
            {/* Week View */}
            {view === "week" && (
              <>
                {/* WEEKLY GOALS BANNER */}
                <div className="p-4 bg-primary/5 border-b border-border/40 flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    🎯 Weekly Objectives
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tasks.filter(t => t.scope === "WEEKLY" && t.dueDate && new Date(t.dueDate) >= startDateWeek && new Date(t.dueDate) <= endDateWeek).length > 0 ? 
                      tasks.filter(t => t.scope === "WEEKLY" && t.dueDate && new Date(t.dueDate) >= startDateWeek && new Date(t.dueDate) <= endDateWeek).map(task => (
                        <div key={task.id} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md font-semibold border border-primary/20">
                          {task.title}
                        </div>
                      )) : 
                      <p className="text-xs text-muted-foreground">No weekly objectives set.</p>
                    }
                  </div>
                </div>

                <div className="grid grid-cols-7 border-b border-border/40 bg-muted/20">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const gridDay = addDays(startDateWeek, i);
                    return (
                      <div key={i} className={`p-4 text-center border-r last:border-r-0 border-border/40 ${isToday(gridDay) ? 'bg-primary/10' : ''}`}>
                        <p className={`text-sm font-medium ${isToday(gridDay) ? 'text-primary' : 'text-foreground'}`}>{format(gridDay, "EEE")}</p>
                        <p className={`text-xs mt-1 ${isToday(gridDay) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{format(gridDay, "MMM d")}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="grid grid-cols-7 h-[600px] divide-x divide-border/40 relative bg-card">
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const currentDay = addDays(startDateWeek, dayIdx);
                    const dayTasks = tasks.filter(t => t.scope === "DAILY" && t.dueDate && new Date(t.dueDate).toDateString() === currentDay.toDateString());
                    
                    return (
                      <div key={dayIdx} className={`relative h-full flex flex-col gap-2 p-2 overflow-y-auto ${isToday(currentDay) ? 'bg-primary/5' : ''}`}>
                        {dayTasks.map((task) => (
                          <div key={task.id} className={`p-2 border rounded-md text-xs font-semibold shadow-sm ${task.status === "COMPLETED" ? 'bg-muted/50 border-border text-muted-foreground line-through' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                            {task.title}
                            <span className="block text-[10px] opacity-70 font-normal mt-1 uppercase tracking-wider">{task.category}</span>
                          </div>
                        ))}
                        
                        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                          {Array.from({ length: 12 }).map((_, hourIdx) => (
                            <div key={hourIdx} className="h-[50px] border-b border-border w-full" />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* Month View */}
            {view === "month" && (
              <>
                {/* MONTHLY GOALS BANNER */}
                <div className="p-4 bg-primary/5 border-b border-border/40 flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    🏆 Monthly Objectives
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tasks.filter(t => t.scope === "MONTHLY" && t.dueDate && isSameMonth(new Date(t.dueDate), currentDate)).length > 0 ? 
                      tasks.filter(t => t.scope === "MONTHLY" && t.dueDate && isSameMonth(new Date(t.dueDate), currentDate)).map(task => (
                        <div key={task.id} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md font-semibold border border-primary/20">
                          {task.title}
                        </div>
                      )) : 
                      <p className="text-xs text-muted-foreground">No monthly objectives set.</p>
                    }
                  </div>
                </div>

                <div className="grid grid-cols-7 border-b border-border/40 bg-muted/20">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                    <div key={i} className="p-3 text-center border-r last:border-r-0 border-border/40">
                      <p className="text-sm font-medium text-foreground">{d}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 divide-x divide-y divide-border/40 bg-card flex-1">
                  {monthDays.map((day, dayIdx) => {
                    const dayTasks = tasks.filter(t => t.scope === "DAILY" && t.dueDate && new Date(t.dueDate).toDateString() === day.toDateString());
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    
                    return (
                      <div key={dayIdx} className={`min-h-[120px] p-2 ${!isCurrentMonth ? 'bg-muted/30 opacity-50' : ''} ${isToday(day) ? 'bg-primary/5 ring-1 ring-inset ring-primary' : ''}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-sm font-medium ${isToday(day) ? 'text-primary bg-primary/20 w-6 h-6 rounded-full flex items-center justify-center' : 'text-muted-foreground'}`}>
                            {format(day, "d")}
                          </span>
                          {dayTasks.length > 0 && (
                            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{dayTasks.length}</span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                          {dayTasks.map((task) => (
                            <div key={task.id} className={`text-[10px] p-1 rounded font-medium truncate ${task.status === "COMPLETED" ? 'bg-muted text-muted-foreground line-through' : 'bg-primary/10 text-primary'}`}>
                              {task.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
