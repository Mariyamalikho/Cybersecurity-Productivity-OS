"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";

export function DeadlinesWidget({ deadlines }: { deadlines: any[] }) {
  const today = new Date();

  return (
    <Card className="border-border/40 hover:border-border transition-colors h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <CalendarClock className="w-32 h-32" />
      </div>
      
      <CardHeader className="pb-4 flex flex-row items-center justify-between z-10">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-orange-500" />
          Study Abroad Radar
        </CardTitle>
        <Link 
          href="/study-abroad"
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All
        </Link>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-start z-10">
        <div className="space-y-4">
          {deadlines.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground flex flex-col items-center gap-2">
              <span className="text-sm">No upcoming deadlines within radar.</span>
            </div>
          ) : (
            deadlines.map((app, i) => {
              const daysLeft = differenceInDays(new Date(app.deadline), today);
              const isUrgent = daysLeft <= 7;
              
              return (
                <div key={i} className="flex items-start gap-3 group bg-muted/30 p-3 rounded-lg border border-border/40 hover:border-orange-500/50 transition-colors">
                  <div className={`mt-0.5 flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${isUrgent ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isUrgent ? 'text-red-500' : 'text-foreground'}`}>
                      {app.university}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Due: {format(new Date(app.deadline), "MMM do, yyyy")}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${isUrgent ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-orange-500/20 text-orange-500'}`}>
                        {daysLeft === 0 ? 'TODAY!' : `${daysLeft} DAYS LEFT`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
