import { Card, CardContent } from "@/components/ui/card";
import { Zap, Target, Clock, Trophy } from "lucide-react";
import { calculateLevel, getXpForNextLevel } from "@/lib/xp";

export function StatsGrid({ user, stats }: { user: any, stats: any }) {
  const currentLevel = calculateLevel(user.xp);
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const progressPercent = Math.min(100, Math.round((user.xp / nextLevelXp) * 100));

  const items = [
    {
      title: "Current XP",
      value: `${user.xp}`,
      icon: Trophy,
      trend: `${progressPercent}% to next level`,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      progress: progressPercent
    },
    {
      title: "Tasks Completed",
      value: stats.completedTasksToday.toString(),
      icon: Target,
      trend: "Today",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Journey Progress",
      value: `Day ${stats.journeyDay}`,
      icon: Zap,
      trend: `${stats.activeHabitsCount} Active Habits`,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      progress: Math.min(100, Math.round((stats.journeyDay / 150) * 100))
    },
    {
      title: "Focus Time",
      value: `${stats.focusHours}h`,
      icon: Clock,
      trend: "This week",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <Card key={i} className="border-border/40 hover:border-border transition-colors group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${item.bg}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-3xl font-heading font-bold">{item.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-muted-foreground/70 font-medium">{item.trend}</span>
            </div>

            {item.progress !== undefined && (
              <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-1000 ease-out" 
                  style={{ width: `${item.progress}%` }} 
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
