// app/components/dashboard/MobileHome.tsx
"use client";

import Link from "next/link";
import { Play, Flame } from "lucide-react";

interface MobileHomeProps {
  nextModule: any;
  profile: any;
  wordsKnown: number;
  courseProgressPercent: number;
  activeStep: number;
  isBrandNew: boolean;
}

export function MobileHome({ 
  nextModule, 
  profile, 
  wordsKnown, 
  courseProgressPercent,
  activeStep,
  isBrandNew
}: MobileHomeProps) {
  const streak = profile?.streak || 0;
  const currentStepNumber = Math.min(activeStep + 1, nextModule.lesson_count || 1);
  const progressPercent = Math.round((activeStep / (nextModule.lesson_count || 1)) * 100);

  return (
    <div className="px-5 pt-12 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          {/* Made Tibetan font much larger (text-2xl instead of text-sm) */}
          <div className="font-tibetan text-2xl text-brand-dark mb-2 tracking-wider opacity-90">
            བཀྲ་ཤིས་བདེ་ལེགས།
          </div>
          <h1 className="font-serif text-[32px] text-ink leading-tight">
            Tashi Delek,<br />welcome {isBrandNew ? "to Loplao" : "back"}
          </h1>
        </div>
        
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 bg-brand-light text-brand-dark px-3.5 py-1.5 rounded-full font-bold text-sm shadow-sm border border-brand/20">
          <Flame size={16} fill="currentColor" /> {streak}
        </div>
      </div>

      {/* Hero Resume Card */}
      <div className="bg-brand rounded-[1.5rem] p-6 shadow-md mb-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-dark/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="text-[9px] font-bold uppercase tracking-widest text-ink/70 mb-3">
            {isBrandNew ? "Start Learning" : "Continue Learning"} · Beginner 1
          </div>
          
          <h2 className="font-serif text-2xl text-ink mb-1">
            {nextModule.title}
          </h2>
          <p className="text-sm text-ink/80 mb-5">
            Step {currentStepNumber} of {nextModule.lesson_count} — {isBrandNew ? "Begin your journey" : "Jump back in"}
          </p>

          <div className="w-full h-1.5 bg-ink/10 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-ink rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <Link href={`/dashboard/lessons/${nextModule.module_id || 1}`}>
            <button className="w-full bg-ink text-white hover:bg-ink-light font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95">
              <Play size={18} fill="currentColor" /> {isBrandNew ? "Start lesson" : "Resume lesson"}
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="font-serif text-3xl text-ink mb-1">{wordsKnown}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">Words<br/>Known</div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm border border-border-subtle">
          <div className="font-serif text-3xl text-ink mb-1">{courseProgressPercent}%</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">Beginner<br/>1</div>
        </div>
      </div>

    </div>
  );
}