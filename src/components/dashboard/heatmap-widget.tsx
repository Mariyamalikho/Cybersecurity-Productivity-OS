"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function HeatmapWidget({ heatmapData }: { heatmapData: { date: string, count: number }[] }) {
  // Generate last 30 days
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count <= 2) return "bg-primary/40";
    if (count <= 4) return "bg-primary/70";
    return "bg-primary";
  };

  return (
    <Card className="border-border/40 hover:border-border transition-colors h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        
        <div className="flex flex-wrap gap-1.5 mt-2">
          {days.map((date, i) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            const dataPoint = heatmapData.find(d => d.date === dateStr);
            const count = dataPoint ? dataPoint.count : 0;
            
            return (
              <Tooltip key={i}>
                <TooltipTrigger className="cursor-default">
                  <div className={`w-4 h-4 rounded-sm transition-colors hover:ring-2 ring-primary/50 ring-offset-1 ring-offset-background ${getIntensityClass(count)}`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    <span className="font-semibold">{count} activities</span> on {date.toLocaleDateString()}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground/70 font-medium">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/40" />
            <div className="w-3 h-3 rounded-sm bg-primary/70" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
