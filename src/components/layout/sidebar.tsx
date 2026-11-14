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
  BookCheck,
  Menu,
  X
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      getUserProfile().then(setDbUser);
    }
  }, [isSignedIn]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const NavGroup = ({
    title,
    items,
    onItemClick,
  }: {
    title?: string;
    items: typeof navItems;
    onItemClick?: () => void;
  }) => (
    <div className="mb-6">
      {title && (
        <h4 className="px-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          {title}
        </h4>
      )}
      <div className="space-y-1 px-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground/70"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );

  const SidebarBody = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <ScrollArea className="flex-1 py-6 min-h-[0px]">
        <NavGroup items={navItems} onItemClick={onItemClick} />
        <NavGroup title="Learning" items={learningItems} onItemClick={onItemClick} />
        <NavGroup title="Portfolio" items={projectsItems} onItemClick={onItemClick} />
        <NavGroup title="Overview" items={generalItems} onItemClick={onItemClick} />
      </ScrollArea>

      <div className="p-4 border-t border-border/40 mt-auto shrink-0 bg-background/50 backdrop-blur-md space-y-2">
        <Link
          href="/settings"
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings
            className={cn(
              "h-4 w-4",
              pathname === "/settings" ? "text-primary" : "text-muted-foreground/70"
            )}
          />
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
            <Link
              href="/sign-in"
              onClick={onItemClick}
              className="bg-primary text-primary-foreground text-center py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden h-14 border-b border-border/40 bg-card/70 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-40 w-full">
        <Link href="/" className="flex items-center gap-2 text-primary font-heading font-bold text-base tracking-tight">
          <ShieldCheck className="h-5 w-5" />
          <span>Cyber Journey</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open Navigation Menu"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar/95 backdrop-blur-2xl border-r border-border/50 z-50 flex flex-col shadow-2xl">
            <div className="h-14 flex items-center justify-between px-5 border-b border-border/40 shrink-0">
              <div className="flex items-center gap-2 text-primary font-heading font-bold text-base tracking-tight">
                <ShieldCheck className="h-5 w-5" />
                <span>Cyber Journey</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close Navigation Menu"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarBody onItemClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border/40 bg-sidebar/50 backdrop-blur-xl flex-col h-full shrink-0 z-30">
        <div className="h-16 flex items-center px-6 border-b border-border/40 shrink-0">
          <Link href="/" className="flex items-center gap-2 text-primary font-heading font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <ShieldCheck className="h-6 w-6" />
            <span>Cyber Journey</span>
          </Link>
        </div>
        <SidebarBody />
      </aside>
    </>
  );
}
