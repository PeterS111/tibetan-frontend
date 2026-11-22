// app/dashboard/profile/page.tsx
"use client";

import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import Link from "next/link";
import {
  Settings,
  HelpCircle,
  Heart,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  ChevronDown,
  User as UserIcon,
  Flame,
  BookOpen,
  Info,
  KeyRound,
  Unlock,
  Lock,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePlatform } from "@/hooks/usePlatform";
import { useDevBypass } from "@/hooks/useDevBypass";
import { DevAiTutorBanner } from "@/app/components/DevAiTutorBanner";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();
  const { isDevUnlocked, unlockDevBypass, lockDevBypass } = useDevBypass();

  const [profileData, setProfileData] = useState({ streak: 0, wordsKnown: 0 });
  const [devCode, setDevCode] = useState("");
  const [showDevCode, setShowDevCode] = useState(false);
  const [isSubmittingDev, setIsSubmittingDev] = useState(false);
  const [devFeedback, setDevFeedback] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);
  const [mobileDevExpanded, setMobileDevExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          if (!token) return;
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          if (isMounted && data.profile) {
            setProfileData({
              streak: data.profile.streak || 0,
              wordsKnown: data.profile.words_known || 0,
            });
          }
        } catch {
          console.error("Failed to fetch profile stats");
        }
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [user, isLoaded, getToken]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devCode.trim() || isSubmittingDev) return;

    setIsSubmittingDev(true);
    setDevFeedback(null);
    const result = await unlockDevBypass(devCode.trim());
    setIsSubmittingDev(false);

    if (result.ok) {
      setDevCode("");
      setDevFeedback({
        type: "success",
        msg: "Developer access confirmed. All lessons, sections, and AI Tutor are now unlocked.",
      });
    } else {
      setDevFeedback({
        type: "error",
        msg: result.error || "Incorrect developer password.",
      });
    }
  };

  const handleLockClick = async () => {
    setDevFeedback(null);
    await lockDevBypass();
    setDevFeedback({
      type: "success",
      msg: "Developer bypass disabled. Standard course locks are now active.",
    });
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-paper" />;
  }

  const menuGroupClass =
    "bg-white rounded-[1.5rem] border border-border-subtle shadow-sm overflow-hidden mb-6";
  const menuItemClass =
    "w-full flex items-center justify-between p-4 bg-white active:bg-surface-muted transition-colors";

  const renderDevBypassControls = () => (
    <div>
      {isDevUnlocked ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
            <Unlock size={16} className="shrink-0" />
            <span>Developer Bypass Active — All lessons &amp; AI Tutor unlocked</span>
          </div>
          <button
            type="button"
            onClick={handleLockClick}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors shrink-0"
          >
            <Lock size={13} /> Lock Website
          </button>
        </div>
      ) : (
        <form onSubmit={handleUnlockSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type={showDevCode ? "text" : "password"}
              value={devCode}
              onChange={(e) => setDevCode(e.target.value)}
              placeholder="Enter developer password"
              autoComplete="off"
              className="w-full px-4 py-2.5 pr-10 text-sm bg-paper/70 border border-border-strong rounded-full text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={() => setShowDevCode(!showDevCode)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              aria-label="Toggle password visibility"
            >
              {showDevCode ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmittingDev || !devCode.trim()}
            className="px-6 py-2.5 rounded-full bg-ink text-white hover:bg-ink-light disabled:opacity-50 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            {isSubmittingDev ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
            Confirm
          </button>
        </form>
      )}

      {devFeedback && (
        <p
          className={`mt-2.5 text-xs font-bold ${
            devFeedback.type === "error" ? "text-rose-600" : "text-emerald-700"
          }`}
        >
          {devFeedback.msg}
        </p>
      )}
    </div>
  );

  return (
    <div
      className={`px-5 pb-24 ${
        isNative ? "pt-12" : "pt-6 max-w-2xl mx-auto"
      } animate-in fade-in`}
    >
      <h1 className="font-serif text-[32px] text-ink mb-6">
        {isNative ? "Profile" : "Settings"}
      </h1>

      {/* 1. Custom User ID Card (+ Inline Developer Bypass underneath Name & Email on Web) */}
      <div className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-sm border border-border-subtle mb-6 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand/10 rounded-full blur-xl" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="shrink-0">
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

          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-ink text-lg truncate">
              {user?.fullName || "Tibetan Scholar"}
            </h2>
            <p className="text-sm text-ink-muted truncate">
              {user?.primaryEmailAddress?.emailAddress || "No email linked"}
            </p>
          </div>
        </div>

        {!isNative && (
          <div className="mt-5 pt-5 border-t border-border-subtle relative z-10">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2.5">
              <KeyRound size={12} className="text-brand-dark" /> Developer Bypass
            </div>
            {renderDevBypassControls()}
          </div>
        )}
      </div>

      {/* Dev-Only AI Tutor Card (only renders when isDevUnlocked === true) */}
      <DevAiTutorBanner className="mb-6" />

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white rounded-[1.25rem] p-4 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="flex items-center gap-2 text-brand-dark mb-1">
            <Flame size={18} fill="currentColor" />
            <span className="font-serif text-2xl text-ink">{profileData.streak}</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
            Day Streak
          </div>
        </div>

        <div className="bg-white rounded-[1.25rem] p-4 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="flex items-center gap-2 text-sky-600 mb-1">
            <BookOpen size={18} />
            <span className="font-serif text-2xl text-ink">{profileData.wordsKnown}</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
            Words Known
          </div>
        </div>
      </div>

      {/* 3. Account Actions (+ Mobile Developer Bypass Button under Profile) */}
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 pl-2">
        Account Management
      </div>
      <div className={menuGroupClass}>
        <button
          onClick={() => openUserProfile()}
          className={`${menuItemClass} ${isNative ? "border-b border-border-subtle" : ""}`}
        >
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center">
              <Settings size={16} />
            </div>
            <span className="font-medium text-[15px]">Account Settings</span>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </button>

        {isNative && (
          <>
            <button
              type="button"
              onClick={() => setMobileDevExpanded(!mobileDevExpanded)}
              className={menuItemClass}
            >
              <div className="flex items-center gap-3 text-ink">
                <div className="w-8 h-8 rounded-full bg-surface-muted text-ink flex items-center justify-center">
                  <KeyRound size={16} />
                </div>
                <div className="text-left">
                  <span className="font-medium text-[15px] block">Developer Bypass</span>
                  {isDevUnlocked && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                      Unlocked
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`text-ink-muted transition-transform ${
                  mobileDevExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileDevExpanded && (
              <div className="px-4 pb-5 pt-2 bg-surface-muted/40 border-t border-border-subtle">
                {renderDevBypassControls()}
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. Support & About */}
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 pl-2">
        About &amp; Help
      </div>
      <div className={menuGroupClass}>
        <Link href="/about" className={`${menuItemClass} border-b border-border-subtle`}>
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center">
              <Info size={16} />
            </div>
            <span className="font-medium text-[15px]">About the Project</span>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </Link>
        <Link href="/support" className={`${menuItemClass} border-b border-border-subtle`}>
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-surface-muted text-ink-muted flex items-center justify-center">
              <HelpCircle size={16} />
            </div>
            <span className="font-medium text-[15px]">Help &amp; Support</span>
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
        onClick={() => {
          if (typeof window !== "undefined") localStorage.clear();
          signOut({ redirectUrl: "/" });
        }}
        className="w-full mt-4 bg-white border border-border-subtle rounded-full py-4 flex items-center justify-center gap-2 text-rose-600 font-bold active:bg-rose-50 transition-colors shadow-sm"
      >
        <LogOut size={18} /> Sign Out
      </button>

      <div className="mt-8 text-center text-xs text-ink-muted/50 font-mono">
        v1.0.0 · Scholar&apos;s Edition
      </div>
    </div>
  );
}
