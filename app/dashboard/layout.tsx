// app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useAuth, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, BookOpen, MessageSquare, 
  CheckSquare, FileText, TrendingUp, Settings, Flame, Menu, X, Calendar, LogOut 
} from "lucide-react";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          if (!token) return; 
          
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (isMounted) {
            if (data.profile) setProfile(data.profile);
            if (data.modules && Array.isArray(data.modules)) {
              setModules(data.modules);
            }
          }
        } catch(e) {}
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [user, isLoaded, getToken]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Lessons", href: "/dashboard/lessons", icon: BookOpen },
    { name: "AI Chats", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Exercises", href: "/dashboard/exercises", icon: CheckSquare },
    { name: "Tutors", href: "/dashboard/tutors", icon: Calendar },
  ];

  const moreItems = [
    { name: "Materials", href: "/dashboard/materials", icon: FileText },
    { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { name: "Profile & Settings", href: "/dashboard/profile", icon: Settings },
  ];

  const completedCount = modules.filter(m => m.status === "completed").length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
  const streak = profile?.streak || 0;

  return (
    <div className="min-h-screen flex bg-paper text-ink font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 border-r border-border-subtle bg-paper hidden md:flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div>
            <h1 className="font-bold text-ink leading-tight text-lg">Learn Tibetan UK</h1>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 overflow-y-auto custom-scrollbar">
          <div className="text-eyebrow mb-4 px-3">Beginner · Level I</div>
          <nav className="space-y-1 mb-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center gap-3 px-3 py-2.5 font-medium text-sm transition-colors ${isActive ? "bg-brand-light text-brand-dark border-l-2 border-brand" : "text-ink-light hover:bg-surface-muted border-l-2 border-transparent"}`}
                >
                  <item.icon size={18} className={isActive ? "text-brand-dark" : "text-ink-muted"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="text-eyebrow mb-4 px-3">More</div>
          <nav className="space-y-1">
            {moreItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center gap-3 px-3 py-2.5 font-medium text-sm transition-colors ${isActive ? "bg-brand-light text-brand-dark border-l-2 border-brand" : "text-ink-light hover:bg-surface-muted border-l-2 border-transparent"}`}
                >
                  <item.icon size={18} className={isActive ? "text-brand-dark" : "text-ink-muted"} />
                  {item.name}
                </Link>
              );
            })}

            {/* EXPLICIT SIGN OUT BUTTON - DESKTOP */}
            <div className="pt-2 mt-2 border-t border-border-subtle">
              <SignOutButton>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 font-medium text-sm text-ink-light hover:bg-destructive/10 hover:text-destructive transition-colors border-l-2 border-transparent group text-left">
                  <LogOut size={18} className="text-ink-muted group-hover:text-destructive transition-colors" />
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </nav>
        </div>

        <div className="p-6 border-t border-border-subtle">
          <div className="text-eyebrow mb-3">Tier Progress</div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-bold text-ink leading-none">{progressPercent}<span className="text-base">%</span></span>
            <span className="text-xs text-ink-light font-medium mb-0.5">of {modules.length || 10} units</span>
          </div>
          <div className="w-full bg-border-subtle h-1.5 overflow-hidden">
            <div className="bg-brand h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="p-4 m-4 mt-0 bg-surface border border-border-subtle flex items-center gap-3 shadow-sm">
          <UserButton />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate">{user?.firstName || "Student"}</p>
            <div className="flex items-center gap-1 text-xs text-brand-dark font-bold">
              <Flame size={12} className={streak > 0 ? "fill-brand" : "text-ink-muted"} /> {streak} Day Streak
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-paper h-full shadow-2xl flex flex-col animate-in slide-in-from-left-8 duration-300 border-r border-border-subtle">
            <div className="p-4 flex items-center justify-between border-b border-border-subtle">
              <div className="font-bold text-ink text-lg">Learn Tibetan UK</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-ink-light hover:bg-surface-muted transition-colors"><X size={20}/></button>
            </div>
            <div className="px-4 py-6 flex-1 overflow-y-auto">
              <nav className="space-y-1 mb-8">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 font-medium text-sm transition-colors ${isActive ? "bg-brand-light text-brand-dark border-l-2 border-brand" : "text-ink-light hover:bg-surface-muted border-l-2 border-transparent"}`}>
                      <item.icon size={18} className={isActive ? "text-brand-dark" : "text-ink-muted"} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="text-eyebrow mb-4 px-3">More</div>
              <nav className="space-y-1 mb-8">
                {moreItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 font-medium text-sm transition-colors ${isActive ? "bg-brand-light text-brand-dark border-l-2 border-brand" : "text-ink-light hover:bg-surface-muted border-l-2 border-transparent"}`}>
                      <item.icon size={18} className={isActive ? "text-brand-dark" : "text-ink-muted"} />
                      {item.name}
                    </Link>
                  );
                })}

                <div className="pt-2 mt-2 border-t border-border-subtle">
                  <SignOutButton>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 font-medium text-sm text-ink-light hover:bg-destructive/10 hover:text-destructive transition-colors border-l-2 border-transparent group text-left">
                      <LogOut size={18} className="text-ink-muted group-hover:text-destructive transition-colors" />
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <header className="h-16 border-b border-border-subtle bg-paper/90 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3 text-sm font-medium text-ink-light">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1.5 -ml-1.5 text-ink-light hover:bg-surface-muted transition-colors">
              <Menu size={20} />
            </button>
            <span className="text-eyebrow text-brand-dark hidden sm:inline-block">Level I</span>
            <span className="text-border-subtle hidden sm:inline-block">/</span>
            <span className="text-ink font-serif">Beginner Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-eyebrow">
              Weekly Goal <div className="w-4 h-4 bg-brand border border-border-strong shadow-sm"></div>
            </div>
            
            <div className="md:hidden flex items-center mt-1">
              <UserButton />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>

    </div>
  );
}