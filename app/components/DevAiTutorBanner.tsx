// app/components/DevAiTutorBanner.tsx
"use client";

import Link from "next/link";
import { Sparkles, Mic, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useDevBypass } from "@/hooks/useDevBypass";

export function DevAiTutorBanner({ className }: { className?: string }) {
  const { isDevUnlocked, isChecking } = useDevBypass();

  if (isChecking || !isDevUnlocked) return null;

  return (
    <Link
      href="/dashboard/ai-tutor"
      className={twMerge(
        "block bg-surface border border-brand/50 rounded-[1.5rem] p-4 sm:p-5 shadow-sm hover:border-ink hover:shadow-md transition-all active:scale-[0.99] group relative overflow-hidden",
        className
      )}
    >
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-brand/15 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-ink text-brand flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-serif font-medium text-base text-ink truncate">
                Open AI Tutor (Dev)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-dark border border-brand/30 text-[9px] font-bold uppercase tracking-widest shrink-0">
                Dev Only
              </span>
            </div>
            <p className="text-xs text-ink-muted flex items-center gap-1.5 truncate">
              <Mic size={12} className="text-brand-dark shrink-0" />
              Voice + Text Tibetan practice &amp; reading feedback with Gen-la
            </p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-paper border border-border-subtle flex items-center justify-center text-ink group-hover:bg-brand group-hover:border-brand transition-colors shrink-0">
          <ChevronRight size={18} />
        </div>
      </div>
    </Link>
  );
}
