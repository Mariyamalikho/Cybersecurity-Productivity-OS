"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/actions/user";
import { calculateLevel, getLevelTitle } from "@/lib/xp";
import { 
  LayoutDashboard, 
  CalendarDays, 
  CheckSquare, 
  Target, 
  BookOpen, 
  Code2, 
  ShieldCheck, 
  FolderGit2, 
  GraduationCap, 
  PenTool, 
  BarChart3, 
  Trophy, 
  Settings,
  Map,
  BookText,
  BrainCircuit,
  BookCheck
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Today's Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Habits", href: "/habits", icon: Target },
];

const learningItems = [
  { name: "Courses", href: "/learning/courses", icon: BookOpen },
  { name: "Programming", href: "/learning/programming", icon: Code2 },
  { name: "Cybersecurity", href: "/learning/cybersecurity", icon: ShieldCheck },
  { name: "Daily Revisions", href: "/learning/revision", icon: BookCheck },
  { name: "Mastery Exams", href: "/learning/exams", icon: BrainCircuit },
];

const projectsItems = [
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Research", href: "/research", icon: PenTool },
  { name: "Study Abroad", href: "/study-abroad", icon: GraduationCap },
];

const generalItems = [
  { name: "Journal", href: "/journal", icon: BookText },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Achievements", href: "/achievements", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    if (isSignedIn) {
      getUserProfile().then(setDbUser);
    }
  }, [isSignedIn]);

  const NavGroup = ({ title, items }: { title?: string, items: typeof navItems }) => (
    <div className="mb-6">
      {title && <h4 className="px-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{title}</h4>}
      <div className="space-y-1 px-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground/70")} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 border-r border-border/40 bg-sidebar/50 backdrop-blur-xl flex flex-col h-full shrink-0 z-50">
      <div className="h-16 flex items-center px-6 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2 text-primary font-heading font-bold text-lg tracking-tight">
          <ShieldCheck className="h-6 w-6" />
          <span>Cyber Journey</span>
        </div>
      </div>

      <ScrollArea className="flex-1 py-6 min-h-[0px]">
        <NavGroup items={navItems} />
        <NavGroup title="Learning" items={learningItems} />
        <NavGroup title="Portfolio" items={projectsItems} />
        <NavGroup title="Overview" items={generalItems} />
      </ScrollArea>

      <div className="p-4 border-t border-border/40 mt-auto shrink-0 bg-background/50 backdrop-blur-md space-y-2">
        <Link 
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className={cn("h-4 w-4", pathname === "/settings" ? "text-primary" : "text-muted-foreground/70")} />
          Settings
        </Link>
        
        {isLoaded && isSignedIn && (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <UserButton appearance={{ elements: { avatarBox: "h-10 w-10 border border-primary/20" } }} />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold leading-none truncate w-32 text-foreground">
                {dbUser ? dbUser.name : "Loading..."}
              </span>
              <span className="text-xs text-primary mt-1.5 font-semibold truncate w-32">
                {dbUser ? getLevelTitle(calculateLevel(dbUser.xp)) : ""} 
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Lvl {dbUser ? calculateLevel(dbUser.xp) : "?"} • {dbUser?.xp || 0} XP
              </span>
            </div>
          </div>
        )}
        {isLoaded && !isSignedIn && (
          <div className="flex flex-col gap-2 w-full p-2">
            <Link href="/sign-in" className="bg-primary text-primary-foreground text-center py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
