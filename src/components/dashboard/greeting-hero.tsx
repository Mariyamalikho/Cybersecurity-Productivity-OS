import { getLevelTitle, calculateLevel } from "@/lib/xp";

export function GreetingHero({ user }: { user: any }) {
  const level = calculateLevel(user.xp);
  const title = getLevelTitle(level);
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 p-8 shadow-sm">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground mb-2">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg">
          You are currently a <span className="font-semibold text-primary">{title} (Lvl {level})</span>. 
          Ready to conquer today's objectives?
        </p>
      </div>
    </div>
  );
}
