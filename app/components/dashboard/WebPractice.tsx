// app/components/dashboard/WebPractice.tsx

"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import { useAudio } from "@/hooks/useAudio";
import { getPracticeData } from "@/app/data/practiceData";
import { Badge } from "@/app/components/ui/Badge";

export function WebPractice({ modules }: { modules: any[] }) {
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const { playAudio, playErrorBeep, playingItem } = useAudio();

  // FIX: Memoize the data fetch so it never resets the random games on audio play
  const data = useMemo(() => {
    return activeModuleId !== null ? getPracticeData(activeModuleId) : { isLesson1: false, groups: [] };
  }, [activeModuleId]);

  if (activeModuleId !== null) {
    const activeModule = modules.find(m => Number(m.module_id) === Number(activeModuleId));

    return (
      <div className="max-w-4xl mx-auto animate-in fade-in pb-24">
        <button 
          onClick={() => setActiveModuleId(null)} 
          className="flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Back to Practice Hub
        </button>
        
        <div className="mb-8">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-2">Practice Mode</div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">{activeModule?.title || `Unit ${activeModuleId}`}</h1>
          <p className="text-ink-light max-w-2xl text-[15px]">Review all the vocabulary and flashcards you've encountered in this unit. Your progress here is not graded.</p>
        </div>

        {data.groups.length > 0 ? (
          <PracticeSuite 
            groups={data.groups} 
            isLesson1={data.isLesson1} 
            playAudio={playAudio} 
            playingItem={playingItem} 
            playErrorBeep={playErrorBeep} 
          />
        ) : (
          <div className="text-center p-12 bg-white rounded-[1.5rem] border border-border-subtle text-ink-muted">
            Practice data not found for this unit.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-ink mb-4">Practice Hub</h1>
        <p className="text-xl text-ink-light leading-relaxed font-serif max-w-3xl">
          Lock what you've learned into long-term memory. Choose any unlocked unit below to review its vocabulary, replay audio, and practice with spaced repetition flashcards.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => {
          const isLocked = module.status === "locked" && !DEV_BYPASS_LOCKS;

          return (
            <div 
              key={module.id || module.module_id} 
              onClick={() => !isLocked && setActiveModuleId(Number(module.module_id))}
              className={`flex flex-col bg-surface border rounded-[1.5rem] p-6 gap-5 ${
                isLocked 
                  ? "border-transparent bg-surface-muted/50 opacity-60 cursor-not-allowed" 
                  : "border-border-subtle hover:border-brand/40 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-serif text-xl border border-border-strong rounded-full bg-white text-ink shadow-sm">
                  {module.module_id}
                </div>
                {isLocked ? (
                  <Badge variant="locked" className="px-3 py-1.5"><Lock size={12} className="mr-1.5"/> Locked</Badge>
                ) : (
                  <Badge variant="brand" className="px-3 py-1.5">Review</Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-serif font-bold text-ink mb-1.5">{module.title}</h3>
                <p className="text-sm text-ink-light line-clamp-2">{module.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}