// app/dashboard/profile/page.tsx
"use client";

import { useUser, useClerk } from "@clerk/clerk-react";
import Link from "next/link";
import { 
  Settings, HelpCircle, Heart, Shield, FileText, 
  LogOut, ChevronRight, User as UserIcon, Flame, BookOpen 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { usePlatform } from "@/hooks/usePlatform";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();

  const [profileData, setProfileData] = useState({ streak: 0, wordsKnown: 0 });

  // Fetch user's app stats (streak, words known)
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          if (!token) return;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (isMounted && data.profile) {
            setProfileData({
              streak: data.profile.streak || 0,
              wordsKnown: data.profile.words_known || 0
            });
          }
        } catch (e) {
          console.error("Failed to fetch profile stats");
        }
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, [user, isLoaded, getToken]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-paper" />;
  }

  // Common wrapper class for menu groups
  const menuGroupClass = "bg-white rounded-[1.5rem] border border-border-subtle shadow-sm overflow-hidden mb-6";
  // Common class for individual menu items
  const menuItemClass = "w-full flex items-center justify-between p-4 bg-white active:bg-surface-muted transition-colors";

  return (
    <div className={`px-5 pb-24 ${isNative ? 'pt-12' : 'pt-6'} animate-in fade-in`}>
      
      <h1 className="font-serif text-[32px] text-ink mb-6">Profile</h1>

      {/* 1. Custom User ID Card */}
      <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-border-subtle flex items-center gap-4 mb-6 relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand/10 rounded-full blur-xl"></div>
        
        <div className="shrink-0 relative z-10">
          {user?.hasImage ? (
            <img 
              src={user.imageUrl} 
              alt={user.fullName || "User"} 
              className="w-16 h-16 rounded-full border-2 border-surface shadow-sm object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-surface-muted border border-border-strong flex items-center justify-center text-ink-muted">
              <UserIcon size={24} />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 relative z-10">
          <h2 className="font-bold text-ink text-lg truncate">
            {user?.fullName || "Tibetan Scholar"}
          </h2>
          <p className="text-sm text-ink-muted truncate">
            {user?.primaryEmailAddress?.emailAddress || "No email linked"}
          </p>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white rounded-[1.25rem] p-4 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="flex items-center gap-2 text-brand-dark mb-1">
            <Flame size={18} fill="currentColor" />
            <span className="font-serif text-2xl text-ink">{profileData.streak}</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Day Streak</div>
        </div>
        
        <div className="bg-white rounded-[1.25rem] p-4 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="flex items-center gap-2 text-sky-600 mb-1">
            <BookOpen size={18} />
            <span className="font-serif text-2xl text-ink">{profileData.wordsKnown}</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Words Known</div>
        </div>
      </div>

      {/* 3. Account Actions */}
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 pl-2">
        Account Management
      </div>
      <div className={menuGroupClass}>
        <button 
          onClick={() => openUserProfile()} 
          className={menuItemClass}
        >
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center">
              <Settings size={16} />
            </div>
            <span className="font-medium text-[15px]">Account Settings</span>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </button>
      </div>

      {/* 4. Support & About */}
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 pl-2">
        About & Help
      </div>
      <div className={menuGroupClass}>
        <Link href="/support" className={`${menuItemClass} border-b border-border-subtle`}>
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-surface-muted text-ink-muted flex items-center justify-center">
              <HelpCircle size={16} />
            </div>
            <span className="font-medium text-[15px]">Help & Support</span>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>
        <Link href="/donate" className={menuItemClass}>
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart size={16} />
            </div>
            <span className="font-medium text-[15px]">Donate to Project</span>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>
      </div>

      {/* 5. Legal */}
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 pl-2">
        Legal
      </div>
      <div className={menuGroupClass}>
        <Link href="/privacy" className={`${menuItemClass} border-b border-border-subtle`}>
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-surface-muted text-ink-muted flex items-center justify-center">
              <Shield size={16} />
            </div>
            <span className="font-medium text-[15px]">Privacy Policy</span>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>
        <Link href="/terms" className={menuItemClass}>
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-surface-muted text-ink-muted flex items-center justify-center">
              <FileText size={16} />
            </div>
            <span className="font-medium text-[15px]">Terms of Service</span>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>
      </div>

      {/* 6. Sign Out Button */}
      <button 
        onClick={() => signOut()} 
        className="w-full mt-4 bg-white border border-border-subtle rounded-full py-4 flex items-center justify-center gap-2 text-rose-600 font-bold active:bg-rose-50 transition-colors shadow-sm"
      >
        <LogOut size={18} /> Sign Out
      </button>

      {/* Version Tag */}
      <div className="mt-8 text-center text-xs text-ink-muted/50 font-mono">
        v1.0.0 · Scholar's Edition
      </div>

    </div>
  );
}