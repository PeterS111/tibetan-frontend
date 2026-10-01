// app/components/dashboard/MobileHome.tsx
"use client";

import Link from "next/link";
import { Play, Flame, CheckCircle2 } from "lucide-react";

export function MobileHome({ nextModule, profile }: any) {
  const streak = profile?.streak || 0;
  
  return (
    <div className="px-5 pt-12 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="font-tibetan text-sm text-brand-dark mb-1 tracking-wider opacity-80">
            བཀྲ་ཤིས་བདེ་ལེགས།
          </div>
          <h1 className="font-serif text-[32px] text-ink leading-tight">
            Tashi Delek,<br />welcome back
          </h1>
        </div>
        
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 bg-brand-light text-brand-dark px-3 py-1.5 rounded-full font-bold text-sm shadow-sm border border-brand/20">
          <Flame size={16} fill="currentColor" /> {streak}
        </div>
      </div>

      {/* Hero Resume Card (Gold) */}
      <div className="bg-brand rounded-[1.5rem] p-6 shadow-md mb-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-dark/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="text-[9px] font-bold uppercase tracking-widest text-ink/70 mb-3">
            Continue Learning · Beginner 1
          </div>
          
          <h2 className="font-serif text-2xl text-ink mb-1">
            {nextModule.title || "Unit 4 · Subscripts"}
          </h2>
          <p className="text-sm text-ink/80 mb-5">
            Step {nextModule.progress + 1} of {nextModule.lesson_count} — Jump back in
          </p>

          {/* Mini Progress Bar inside card */}
          <div className="w-full h-1.5 bg-ink/10 rounded-full mb-6">
            <div 
              className="h-full bg-ink rounded-full" 
              style={{ width: `${Math.max((nextModule.progress / nextModule.lesson_count) * 100, 5)}%` }}
            ></div>
          </div>

          <Link href={`/dashboard/lessons/${nextModule.module_id || 1}`}>
            <button className="w-full bg-ink text-white hover:bg-ink-light font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95">
              <Play size={18} fill="currentColor" /> Resume lesson
            </button>
          </Link>
        </div>
      </div>

      {/* 3 Stats Boxes */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="font-serif text-2xl text-ink mb-1">{streak}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">Day<br/>Streak</div>
        </div>
        <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="font-serif text-2xl text-ink mb-1">30</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">Letters</div>
        </div>
        <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="font-serif text-2xl text-ink mb-1">43%</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">Beginner<br/>1</div>
        </div>
      </div>

      {/* Today's Plan Header */}
      <div className="flex items-end justify-between mb-4 px-1">
        <h3 className="font-serif text-2xl text-ink">Today's plan</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">3 Tasks</span>
      </div>

      {/* Placeholder Task Card */}
      <div className="bg-white rounded-[1.25rem] p-5 shadow-sm border border-border-subtle flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center border border-border-strong shrink-0">
          <CheckCircle2 className="text-ink-muted" size={24} />
        </div>
        <div>
          <div className="font-bold text-ink text-[15px]">Listen & select</div>
          <div className="text-sm text-ink-muted">Daily review</div>
        </div>
      </div>

    </div>
  );
}