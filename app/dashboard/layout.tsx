"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useAuth, SignOutButton } from "@clerk/clerk-react";

import { useEffect, useState } from "react";
import { 
  LayoutDashboard, Settings, Menu, X, LogOut, Heart, HelpCircle, MessageSquarePlus,
  Home, BookOpen, Dumbbell, BarChart2, User
} from "lucide-react";

import { usePlatform } from "@/hooks/usePlatform";
import { useTimeTracker } from "@/hooks/useTimeTracker";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Detect Native Platform
  const { isNative } = usePlatform();
  
  // Track time silently in the background
  useTimeTracker();

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
  ];

  const moreItems = [
    { name: "Settings", href: "/dashboard/profile", icon: Settings },
    { name: "Support", href: "/support", icon: HelpCircle },
    { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquarePlus },
    { name: "Donate", href: "/donate", icon: Heart },
  ];

  const streak = profile?.streak || 0;
  const currentPageName = [...libraryItems, ...moreItems].find(i => i.href === pathname)?.name || "Dashboard";

  // ==========================================
  // NATIVE MOBILE LAYOUT
  // ==========================================
  if (isNative) {
    const mobileTabs = [
      { name: "Home", href: "/dashboard", icon: Home },
      { name: "Lessons", href: "/dashboard/lessons", icon: BookOpen },
      { name: "Practice", href: "/dashboard/practice", icon: Dumbbell },
      { name: "Progress", href: "/dashboard/progress", icon: BarChart2 },
      { name: "Profile", href: "/dashboard/profile", icon: User },
    ];

    return (
      <div className="flex flex-col h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-paper text-ink font-sans">
        
        {/* Main Scrollable Content (No global top header on mobile, pages manage their own top) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-[100vw] bg-paper pb-28">
          {children}
        </main>

        {/* Native Bottom Tab Bar matching the mockups */}
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-border-subtle pb-safe pt-3 px-4 flex justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50 rounded-t-3xl">
          {mobileTabs.map((tab) => {
            // Simplified active check for now
            const isActive = pathname === tab.href || (pathname.startsWith(tab.href) && tab.href !== "/dashboard");
            return (
              <Link 
                key={tab.name} 
                href={tab.href}
                className="flex flex-col items-center justify-center gap-1.5 w-16 h-14 relative group mb-1"
              >
                {/* Background pill for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-brand/10 rounded-2xl -z-10 scale-110"></div>
                )}
                
                <tab.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-colors ${isActive ? "text-brand-dark" : "text-ink-muted"}`} 
                />
                <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? "text-brand-dark" : "text-ink-muted"}`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  // ==========================================
  // DESKTOP WEB LAYOUT
  // ==========================================
  return (
    <div className="min-h-screen flex bg-paper text-ink font-sans">
      
      <aside className="w-64 border-r border-border-subtle bg-paper hidden md:flex flex-col shrink-0">
        <Link href="/" className="flex items-center gap-3 px-6 py-8 hover:opacity-80 transition-opacity">
          <img src="/icon.png" alt="Learn Tibetan Logo" className="w-11 h-11 object-contain mix-blend-multiply opacity-90" />
          <div>
            <div className="font-serif font-medium text-lg leading-none text-ink">Learn Tibetan</div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-ink-muted mt-1.5 uppercase">Scholar's Edition</div>
          </div>
        </Link>
      
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
          
         <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-sm font-medium text-ink truncate">{user?.firstName || "Student"} {user?.lastName || ""}</p>
            <div className="text-[10px] font-bold text-ink-muted tracking-wider uppercase mt-0.5">Scholar</div>
          </div>
        </div>
        
        {/* Desktop Meta Links Footer */}
        <div className="px-6 py-4 border-t border-border-subtle bg-surface-muted flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-ink-muted uppercase tracking-wider font-bold">
          <Link href="/about" className="hover:text-ink transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
        </div>
      </aside>

      {/* Web Mobile Fallback (Hidden on actual Native App) */} 
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-paper h-full shadow-2xl flex flex-col animate-in slide-in-from-left-8 duration-300">
            <div className="p-4 flex items-center justify-between border-b border-border-subtle">
              <Link href="/" className="font-serif text-lg text-ink hover:text-brand-dark transition-colors">Learn Tibetan</Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-ink-light"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto pt-4">
               {/* Mobile Web Menu Items */}
               {[...libraryItems, ...moreItems].map((item) => (
                 <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-3 text-sm text-ink-light hover:bg-surface-muted transition-colors">
                    <item.icon size={16} className="text-ink-muted" />{item.name}
                 </Link>
               ))}
               <div className="px-6 py-3 mt-4 border-t border-border-subtle">
                  <SignOutButton><button className="flex items-center gap-3 text-sm text-ink-light"><LogOut size={16} className="text-ink-muted" /> Sign Out</button></SignOutButton>
               </div>
            </div>
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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}