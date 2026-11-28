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
  User as UserIcon,
  BookOpen,
  Info,
  Landmark,
  Unlock,
  Lock,
  Loader2,
  Eye,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePlatform } from "@/hooks/usePlatform";
import { useDevBypass } from "@/hooks/useDevBypass";
import { DevAiTutorBanner } from "@/app/components/DevAiTutorBanner";
import { mergeWithFallbackModules } from "@/app/data/syllabus";
import { syncLearnedWordsIfNeeded } from "@/app/data/vocabCatalog";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();
  const {
    isDevApproved,
    isPreviewingStudent,
    isPaymentsOwner,
    setPreviewAsStudent,
  } = useDevBypass();

  const [wordsKnown, setWordsKnown] = useState(0);
  const [isTogglingPreview, setIsTogglingPreview] = useState(false);
  const [devFeedback, setDevFeedback] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

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
          if (isMounted) {
            const initialWords = Number(data?.profile?.words_known) || 0;
            setWordsKnown(initialWords);

            if (Array.isArray(data?.modules)) {
              const synced = await syncLearnedWordsIfNeeded({
                userId: user.id,
                modules: mergeWithFallbackModules(data.modules),
                learnedWordModules: data?.learned_word_modules,
                currentWordsKnown: initialWords,
                token,
              });
              if (isMounted && synced !== initialWords) {
                setWordsKnown(synced);
              }
            }
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

  const handleToggleStudentPreview = async () => {
    if (isTogglingPreview) return;
    setIsTogglingPreview(true);
    setDevFeedback(null);

    const nextPreview = !isPreviewingStudent;
    const result = await setPreviewAsStudent(nextPreview);
    setIsTogglingPreview(false);

    if (result.ok) {
      setDevFeedback({
        type: "success",
        msg: nextPreview
          ? "Student Preview active — viewing Loplao with standard course locks and student navigation."
          : "Developer Mode active — all lessons, sections, and AI Tutor are unlocked.",
      });
    } else {
      setDevFeedback({
        type: "error",
        msg: result.error || "Could not update preview mode.",
      });
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-paper" />;
  }

  const menuGroupClass =
    "bg-white rounded-[1.5rem] border border-border-subtle shadow-sm overflow-hidden mb-6";
  const menuItemClass =
    "w-full flex items-center justify-between p-4 bg-white active:bg-surface-muted transition-colors";

  const renderDeveloperModeControls = () => {
    if (!isDevApproved) return null;
    return (
      <div>
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl p-4 border ${
            isPreviewingStudent
              ? "bg-amber-50 border-amber-200"
              : "bg-emerald-50 border-emerald-200"
          }`}
        >
          <div className="min-w-0">
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                isPreviewingStudent ? "text-amber-900" : "text-emerald-800"
              }`}
            >
              {isPreviewingStudent ? (
                <Eye size={15} className="shrink-0" />
              ) : (
                <Unlock size={15} className="shrink-0" />
              )}
              <span>
                {isPreviewingStudent
                  ? "Student Preview Active — Standard course locks enabled"
                  : "Developer Access Active — All lessons & AI Tutor unlocked"}
              </span>
            </div>
            <p className="text-[11px] text-ink-light mt-1">
              {isPreviewingStudent
                ? "You are currently seeing the website exactly as a regular student sees it."
                : "Approved automatically via your pre-approved developer email."}
            </p>
          </div>

          <button
            type="button"
            disabled={isTogglingPreview}
            onClick={handleToggleStudentPreview}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50 ${
              isPreviewingStudent
                ? "bg-ink text-white hover:bg-ink-light"
                : "bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100"
            }`}
          >
            {isTogglingPreview ? (
              <Loader2 size={13} className="animate-spin" />
            ) : isPreviewingStudent ? (
              <Unlock size={13} />
            ) : (
              <Lock size={13} />
            )}
            <span>
              {isPreviewingStudent
                ? "Return to Developer Mode"
                : "Preview as Student"}
            </span>
          </button>
        </div>

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
  };

  return (
    <div
      className={`px-5 pb-24 ${
        isNative ? "pt-12" : "pt-6 max-w-2xl mx-auto"
      } animate-in fade-in`}
    >
      <h1 className="font-serif text-[32px] text-ink mb-6">
        {isNative ? "Profile" : "Settings"}
      </h1>

      {/* 1. Custom User ID Card (+ Inline Developer Mode Card for Pre-Approved Emails on Web) */}
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
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-ink text-lg truncate">
                {user?.fullName || "Tibetan Scholar"}
              </h2>
              {isDevApproved && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-light text-brand-dark border border-brand/30 text-[9px] font-bold uppercase tracking-widest">
                  <ShieldCheck size={10} /> Developer
                </span>
              )}
            </div>
            <p className="text-sm text-ink-muted truncate">
              {user?.primaryEmailAddress?.emailAddress || "No email linked"}
            </p>
          </div>
        </div>

        {!isNative && isDevApproved && (
          <div className="mt-5 pt-5 border-t border-border-subtle relative z-10">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2.5">
              <ShieldCheck size={12} className="text-brand-dark" /> Developer Access · Pre-Approved
            </div>
            {renderDeveloperModeControls()}
          </div>
        )}
      </div>

      {/* Dev-Only AI Tutor Card (only renders when isDevUnlocked === true) */}
      <DevAiTutorBanner className="mb-4" />

      {/* Owner Vault Card (strictly the 3 Owner accounts, independent of Student Preview) */}
      {isPaymentsOwner && (
        <Link
          href="/dashboard/payments"
          className="block bg-surface border border-brand/50 rounded-[1.5rem] p-4 sm:p-5 shadow-sm hover:border-ink hover:shadow-md transition-all active:scale-[0.99] group relative overflow-hidden mb-6"
        >
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-brand text-ink flex items-center justify-center shrink-0 shadow-sm">
                <Receipt size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-serif font-medium text-base text-ink truncate">
                    Owner Vault · Payments, AI Costs &amp; Dev Access
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-dark border border-brand/30 text-[9px] font-bold uppercase tracking-widest shrink-0">
                    Owner
                  </span>
                </div>
                <p className="text-xs text-ink-muted truncate">
                  Password-protected · Courses, Shop, Donations, AI Token Costs &amp; Developer Emails
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-paper border border-border-subtle flex items-center justify-center text-ink group-hover:bg-brand group-hover:border-brand transition-colors shrink-0">
              <ChevronRight size={18} />
            </div>
          </div>
        </Link>
      )}

      {/* 2. Words Known Highlight Card */}
      <div className="mb-8">
        <div className="bg-white rounded-[1.5rem] p-5 flex items-center justify-between shadow-sm border border-border-subtle">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                Words Known
              </div>
              <div className="text-xs text-ink-light mt-0.5">
                Unique Tibetan vocabulary mastered
              </div>
            </div>
          </div>
          <div className="font-serif text-3xl text-ink pr-1">{wordsKnown}</div>
        </div>
      </div>

      {/* 3. Account Actions (+ Mobile Student Preview Toggle for Pre-Approved Developers) */}
      <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 pl-2">
        Account Management
      </div>
      <div className={menuGroupClass}>
        <button
          onClick={() => openUserProfile()}
          className={`${menuItemClass} ${
            isNative && isDevApproved ? "border-b border-border-subtle" : ""
          }`}
        >
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center">
              <Settings size={16} />
            </div>
            <span className="font-medium text-[15px]">Account Settings</span>
          </div>
          <ChevronRight size={18} className="text-ink-muted" />
        </button>

        {isNative && isDevApproved && (
          <div className="p-4 bg-surface-muted/35">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2.5">
              <ShieldCheck size={12} className="text-brand-dark" /> Developer Access · Pre-Approved
            </div>
            {renderDeveloperModeControls()}
          </div>
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
        <Link href="/oxford-visitorship" className={`${menuItemClass} border-b border-border-subtle`}>
          <div className="flex items-center gap-3 text-ink">
            <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center">
              <Landmark size={16} />
            </div>
            <span className="font-medium text-[15px]">Oxford Visitorship</span>
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
