// app/components/dashboard/WebDashboard.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Lock, CheckCircle2, Play } from "lucide-react";
import { Badge } from "@/app/components/ui/Badge";
import { DEV_BYPASS_LOCKS } from "@/app/config";

export function WebDashboard({ modules, nextModule, wordsKnown }: any) {
  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-24">
      {/* 1. Designer's Minimalist Stats */}
      <div className="border-y border-border-subtle py-8 mb-12 flex justify-center">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl md:text-5xl font-serif text-ink mb-2">{wordsKnown}</div>
          <div className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em]">Words Known</div>
        </div>
      </div>

      {/* 2. Editorial Drop-Cap Intro */}
      <div className="mb-16 max-w-3xl">
        <span className="float-left text-brand text-[5rem] md:text-[6rem] leading-[0.8] pr-4 font-serif mt-1">T</span>
        <p className="text-xl md:text-2xl text-ink leading-relaxed font-serif">
          hree courses and six levels, one scholarly path through the Tibetan language — script and sounds first, then everyday conversation, then discourse and nuance, and finally the classical register.
        </p>
      </div>

      {/* 3. Dark Blue "Resume" Banner */}
      <div className="bg-ink text-white p-8 md:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 rounded-2xl">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3 flex items-center gap-3">
            <span className="w-6 h-[1px] bg-brand"></span> Resume where you left off
          </div>
          <h3 className="text-2xl md:text-3xl font-serif mb-2">{nextModule.title}</h3>
          <p className="text-sm text-slate-300 max-w-md opacity-90">{nextModule.description}</p>
        </div>
        <Link href={`/dashboard/lessons/${nextModule.module_id || 1}`} className="w-full md:w-auto shrink-0">
          <button className="w-full bg-brand hover:bg-brand-dark text-ink font-bold text-sm px-8 py-4 rounded-full transition-colors shadow-sm flex items-center justify-center gap-2">
            Continue Learning <ArrowRight size={16} />
          </button>
        </Link>
      </div>

      {/* 4. The Clean Module List (Syllabus) */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-5xl font-serif text-brand opacity-40">I</div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-1">Course 1</div>
            <h2 className="text-3xl font-serif text-ink">Beginner Course</h2>
          </div>
        </div>

        <div className="space-y-4">
          {visibleModules.map((module) => {
            const lessonUrl = `/dashboard/lessons/${Number(module.module_id)}`;
            const isLocked = module.status === "locked" && !DEV_BYPASS_LOCKS;
            const isCompleted = module.status === "completed";

            return (
              <div key={module.id || module.module_id} className={`flex flex-col md:flex-row bg-surface border rounded-2xl p-6 gap-5 ${isCompleted ? "border-border-subtle" : isLocked ? "border-transparent bg-surface-muted/50 opacity-60" : "border-brand/40 shadow-sm"}`}>
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-serif text-xl border border-border-strong rounded-full bg-white text-ink">
                  {module.module_id}
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-serif font-bold text-ink">{module.title}</h3>
                    {isCompleted && <Badge variant="success">Completed</Badge>}
                  </div>
                  <p className="text-sm text-ink-light">{module.description}</p>
                </div>
                
                <div className="flex items-center mt-2 md:mt-0 md:pl-4">
                  {isLocked ? (
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-ink-muted">
                      <Lock size={14} /> Locked
                    </div>
                  ) : (
                    <Link href={lessonUrl} className="w-full md:w-auto">
                      <button className={`w-full flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-full transition-colors uppercase tracking-wider border ${isCompleted ? 'bg-transparent text-ink border-border-strong hover:bg-surface-muted' : 'bg-ink text-white border-ink hover:bg-ink-light shadow-sm'}`}>
                        {isCompleted ? <><CheckCircle2 size={14}/> Review</> : <><Play size={14}/> Continue</>}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}