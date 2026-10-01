// app/components/dashboard/MobilePractice.tsx

"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, Lock, Play } from "lucide-react";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import { useAudio } from "@/hooks/useAudio";
import { getPracticeData } from "@/app/data/practiceData";

export function MobilePractice({ modules }: { modules: any[] }) {
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const { playAudio, playErrorBeep, playingItem } = useAudio();

  // FIX: Memoize the data fetch so it never resets the random games on audio play
  const data = useMemo(() => {
    return activeModuleId !== null ? getPracticeData(activeModuleId) : { isLesson1: false, groups: [] };
  }, [activeModuleId]);

  if (activeModuleId !== null) {
    const activeModule = modules.find(m => Number(m.module_id) === Number(activeModuleId));

    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-paper h-[100dvh] w-full overflow-hidden text-ink">
        <div className="flex items-center justify-between px-5 py-4 pt-safe shrink-0 bg-white border-b border-border-subtle shadow-sm z-10">
          <button 
            onClick={() => setActiveModuleId(null)} 
            className="p-1 -ml-1 text-ink-muted active:scale-95 transition-transform"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="font-bold text-[17px] text-ink truncate max-w-[200px] text-center">
            {activeModule?.title || `Unit ${activeModuleId}`}
          </div>
          <div className="w-[32px]"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-paper">
          <div className="p-5 pb-0">
             <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-2">Practice Mode</div>
             <p className="text-ink/80 text-[14px] leading-relaxed mb-6">Review all the vocabulary and flashcards you've encountered in this unit. Your progress here is not graded.</p>
          </div>
          <div className="px-0 sm:px-5 pb-10">
            {data.groups.length > 0 ? (
              <PracticeSuite 
                groups={data.groups} 
                isLesson1={data.isLesson1} 
                playAudio={playAudio} 
                playingItem={playingItem} 
                playErrorBeep={playErrorBeep} 
              />
            ) : (
              <div className="text-center p-10 bg-white rounded-2xl border border-border-subtle text-ink-muted">
                Practice data not found for this unit.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-32 animate-in fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-[32px] text-ink mb-2">Practice Hub</h1>
        <p className="text-sm text-ink-light leading-relaxed">
          Lock what you've learned into long-term memory. Choose any unlocked unit below to review.
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => {
          const isLocked = module.status === "locked" && !DEV_BYPASS_LOCKS;

          return (
            <button 
              key={module.id || module.module_id} 
              onClick={() => !isLocked && setActiveModuleId(Number(module.module_id))}
              disabled={isLocked}
              className={`w-full text-left bg-white rounded-[1.25rem] p-5 shadow-sm border flex flex-col gap-4 ${
                isLocked 
                  ? "border-transparent bg-surface-muted/60 opacity-60" 
                  : "border-border-subtle active:scale-95 transition-transform"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-12 h-12 rounded-full border border-border-strong flex items-center justify-center font-serif text-xl bg-surface-muted text-ink shrink-0">
                  {module.module_id}
                </div>
                {isLocked ? (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-muted bg-surface-muted px-3 py-1.5 rounded-full border border-border-subtle">
                    <Lock size={12} /> Locked
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-dark bg-brand-light px-3 py-1.5 rounded-full border border-brand/20">
                    <Play size={10} className="fill-current" /> Review
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-serif text-[18px] font-bold text-ink mb-1">{module.title}</h3>
                <p className="text-[13px] text-ink-light line-clamp-2">{module.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}