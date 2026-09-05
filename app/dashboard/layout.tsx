"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useAuth, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, MessageSquare, CheckSquare, 
  FileText, TrendingUp, Settings, Menu, X, Calendar, LogOut 
} from "lucide-react";
import { useActiveTracker } from "@/hooks/useActiveTracker";
import { usePlatform } from "@/hooks/usePlatform";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 📱 NEW: Detect Native Platform
  const { isNative } = usePlatform();
  
  useActiveTracker();
  
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
          if (isMounted && data.profile) setProfile(data.profile);
        } catch(e) {}
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [user, isLoaded, getToken]);

  const libraryItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Your Path", href: "/dashboard/lessons", icon: TrendingUp },
  ];

  const moreItems = [
    { name: "AI Chats", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Exercises", href: "/dashboard/exercises", icon: CheckSquare },
    { name: "Materials", href: "/dashboard/materials", icon: FileText },
    { name: "Tutors", href: "/dashboard/tutors", icon: Calendar },
    { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { name: "Settings", href: "/dashboard/profile", icon: Settings },
  ];

  // 📱 Native Bottom Tab Navigation Items (Max 5 for mobile)
  const nativeTabs = [
    { name: "Path", href: "/dashboard/lessons", icon: TrendingUp },
    { name: "AI Chats", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Tutors", href: "/dashboard/tutors", icon: Calendar },
    { name: "Settings", href: "/dashboard/profile", icon: Settings },
  ];

  const streak = profile?.streak || 0;
  const currentPageName = [...libraryItems, ...moreItems].find(i => i.href === pathname)?.name || "Library";

  // ==========================================
  // NATIVE MOBILE LAYOUT
  // ==========================================
  if (isNative) {
    return (
      <div className="flex flex-col h-screen bg-paper text-ink font-sans">
        {/* Native Top Header (Sleeker, centered) */}
        <header className="pt-12 pb-4 px-6 border-b border-border-subtle bg-surface flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#8B4513] text-surface flex items-center justify-center font-serif text-lg shadow-inner rounded-md">ལ</div>
            <h2 className="text-xl font-serif text-ink">{currentPageName}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 border border-amber-200 rounded-md">
              <span className="text-amber-600 text-xs font-bold">🔥 {streak}</span>
            </div>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full" } }} />
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-paper pb-20 custom-scrollbar">
          {children}
        </main>

        {/* Native Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-border-subtle pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50 h-20">
          {nativeTabs.map((tab) => {
            const isActive = pathname === tab.href || (pathname.startsWith(tab.href) && tab.href !== "/dashboard");
            return (
              <Link 
                key={tab.name} 
                href={tab.href}
                className="flex flex-col items-center justify-center gap-1.5 w-16 h-12 relative"
              >
                <tab.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 1.5} 
                  className={`transition-colors ${isActive ? "text-brand-dark" : "text-ink-muted"}`} 
                />
                <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? "text-brand-dark" : "text-ink-muted"}`}>
                  {tab.name}
                </span>
                {isActive && <div className="absolute -top-3 w-8 h-1 rounded-full bg-brand"></div>}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  // ==========================================
  // DESKTOP WEB LAYOUT (Original)
  // ==========================================
  return (
    <div className="min-h-screen flex bg-paper text-ink font-sans">
      <aside className="w-64 border-r border-border-subtle bg-paper hidden md:flex flex-col shrink-0">
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-10 h-10 bg-[#8B4513] text-surface flex items-center justify-center font-serif text-xl shadow-inner">ལ</div>
          <div>
            <div className="font-serif font-medium text-lg leading-none text-ink">Learn Tibetan</div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-ink-muted mt-1.5 uppercase">Scholar's Edition</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-6">
          <div className="text-eyebrow mb-3 px-6">Library</div>
          <nav className="space-y-0.5 mb-8">
            {libraryItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
              return (
                <Link key={item.name} href={item.href} className={`flex items-center justify-between px-6 py-2.5 text-sm transition-colors ${isActive ? "bg-brand/5 text-ink font-medium" : "text-ink-light hover:bg-surface-muted font-normal"}`}>
                  <div className="flex items-center gap-3"><item.icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-brand-dark" : "text-ink-muted"} />{item.name}</div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>}
                </Link>
              );
            })}
          </nav>
          <div className="text-eyebrow mb-3 px-6">More</div>
          <nav className="space-y-0.5">
            {moreItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`flex items-center justify-between px-6 py-2.5 text-sm transition-colors ${isActive ? "bg-brand/5 text-ink font-medium" : "text-ink-light hover:bg-surface-muted font-normal"}`}>
                  <div className="flex items-center gap-3"><item.icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-brand-dark" : "text-ink-muted"} />{item.name}</div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 px-6 border-t border-border-subtle mx-4">
              <SignOutButton><button className="flex items-center gap-3 py-2 text-sm text-ink-light hover:text-ink transition-colors w-full text-left"><LogOut size={16} strokeWidth={1.5} className="text-ink-muted" />Sign Out</button></SignOutButton>
            </div>
          </nav>
        </div>
        <div className="p-6 border-t border-border-subtle bg-paper flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-brand overflow-hidden flex items-center justify-center shrink-0">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full" } }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink truncate">{user?.firstName || "Student"} {user?.lastName || ""}</p>
            <div className="text-[10px] font-bold text-ink-muted tracking-wider uppercase mt-0.5">{streak} Day Streak</div>
          </div>
        </div>
      </aside>

      {/* Web Mobile Fallback (Hidden on actual Native App) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-paper h-full shadow-2xl flex flex-col animate-in slide-in-from-left-8 duration-300">
            <div className="p-4 flex items-center justify-between border-b border-border-subtle">
              <div className="font-serif text-lg text-ink">Learn Tibetan</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-ink-light"><X size={20}/></button>
            </div>
            {/* Same navigation logic as desktop goes here for mobile web */}
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <header className="h-24 border-b border-border-subtle bg-paper flex items-center justify-between px-8 md:px-12 shrink-0">
          <div>
            <div className="text-eyebrow text-ink-muted mb-2">Welcome back, {user?.firstName?.toUpperCase() || "STUDENT"}</div>
            <h2 className="text-2xl font-serif italic text-ink">{currentPageName}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end gap-2">
              <div className="text-eyebrow flex items-center gap-2">Weekly Goal</div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1 bg-border-subtle rounded-none"><div className="h-full bg-brand w-[60%]"></div></div>
                <div className="w-6 h-6 rounded-full bg-brand shadow-sm"></div>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-ink"><Menu size={20} /></button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}