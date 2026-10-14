"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Lock } from "lucide-react";

export function AchievementsClient({ trophies }: { trophies: any[] }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Trophy Room</h1>
        <p className="text-muted-foreground">Unlock achievements by staying consistent and completing objectives.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trophies.map((trophy) => (
          <Card 
            key={trophy.id} 
            className={`border-border/40 transition-all duration-300 relative overflow-hidden ${
              trophy.unlocked 
                ? 'bg-card/50 hover:border-primary/50 shadow-[0_0_15px_-5px_var(--primary)]' 
                : 'bg-muted/10 opacity-70 grayscale'
            }`}
          >
            {/* Glowing background for unlocked trophies */}
            {trophy.unlocked && (
              <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${trophy.bg.replace('/10', '')}`} />
            )}
            
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-2xl ${trophy.unlocked ? trophy.bg : 'bg-muted'} shadow-inner`}>
                  {trophy.unlocked ? (
                    <Trophy className={`w-6 h-6 ${trophy.color}`} />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                {trophy.unlocked && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary rounded-full">
                    Unlocked
                  </span>
                )}
              </div>
              <CardTitle className="text-lg font-bold">{trophy.title}</CardTitle>
              <CardDescription>{trophy.description}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-4">
              {!trophy.unlocked && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.floor(trophy.progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/50 transition-all duration-1000 ease-out" 
                      style={{ width: `${trophy.progress}%` }} 
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
