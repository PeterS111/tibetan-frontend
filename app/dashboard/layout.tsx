"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, BookOpen, MessageSquare, 
  CheckSquare, FileText, TrendingUp, Settings, Flame, Menu, X, Calendar 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setProfile(data.profile);
          setModules(data.modules || []);
        } catch(e) {}
      }
    };
    fetchData();
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
    <div className="min-h-screen flex bg-[#fdfbf7] text-stone-800 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 border-r border-[#e8e4d9] bg-[#fdfbf7] hidden md:flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div>
            <h1 className="font-bold text-stone-800 leading-tight text-lg">Learn Tibetan UK</h1>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 overflow-y-auto custom-scrollbar">
          <div className="text-[11px] font-bold text-stone-400 tracking-[0.15em] mb-4 px-3 uppercase">Beginner · Level I</div>
          <nav className="space-y-1 mb-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive ? "bg-amber-50 text-amber-800 relative" : "text-stone-600 hover:bg-stone-100"}`}>
                  <item.icon size={18} className={isActive ? "text-amber-600" : "text-stone-400"} />
                  {item.name}
                  {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
                </Link>
              );
            })}
          </nav>

          <div className="text-[11px] font-bold text-stone-400 tracking-[0.15em] mb-4 px-3 uppercase">More</div>
          <nav className="space-y-1">
            {moreItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive ? "bg-amber-50 text-amber-800 relative" : "text-stone-600 hover:bg-stone-100"}`}>
                  <item.icon size={18} className={isActive ? "text-amber-600" : "text-stone-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-[#e8e4d9]">
          <div className="text-[11px] font-bold text-stone-400 tracking-[0.15em] mb-3 uppercase">Tier Progress</div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-bold text-stone-800 leading-none">{progressPercent}<span className="text-base">%</span></span>
            <span className="text-xs text-stone-500 font-medium mb-0.5">of {modules.length || 10} units</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="p-4 m-4 mt-0 bg-white border border-[#e8e4d9] rounded-2xl flex items-center gap-3 shadow-sm">
          <UserButton />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-stone-800 truncate">{user?.firstName || "Student"}</p>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
              <Flame size={12} className={streak > 0 ? "fill-amber-500" : "text-stone-300"} /> {streak} Day Streak
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-[#fdfbf7] h-full shadow-2xl flex flex-col animate-in slide-in-from-left-8 duration-300 border-r border-[#e8e4d9]">
            <div className="p-4 flex items-center justify-between border-b border-[#e8e4d9]">
              <div className="font-bold text-stone-800 text-lg">Learn Tibetan UK</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-500 hover:bg-stone-200 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            <div className="px-4 py-6 flex-1 overflow-y-auto">
              <nav className="space-y-1 mb-8">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive ? "bg-amber-50 text-amber-800" : "text-stone-600 hover:bg-stone-100"}`}>
                      <item.icon size={18} className={isActive ? "text-amber-600" : "text-stone-400"} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="text-[11px] font-bold text-stone-400 tracking-[0.15em] mb-4 px-3 uppercase">More</div>
              <nav className="space-y-1 mb-8">
                {moreItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${isActive ? "bg-amber-50 text-amber-800" : "text-stone-600 hover:bg-stone-100"}`}>
                      <item.icon size={18} className={isActive ? "text-amber-600" : "text-stone-400"} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <header className="h-16 border-b border-[#e8e4d9] bg-[#fdfbf7]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3 text-sm font-medium text-stone-500">
            {/* Mobile Hamburger Button */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1.5 -ml-1.5 text-stone-600 hover:bg-stone-200 rounded-md transition-colors">
              <Menu size={20} />
            </button>
            <span className="uppercase tracking-widest text-[11px] font-bold text-amber-600 hidden sm:inline-block">Level I</span>
            <span className="text-stone-300 hidden sm:inline-block">/</span>
            <span className="text-stone-800 font-serif">Beginner Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-widest">
              Weekly Goal <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm"></div>
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