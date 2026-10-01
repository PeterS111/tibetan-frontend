// app/components/dashboard/MobileProgress.tsx
"use client";

import { useState } from "react";
import { Flame, Clock, BookOpen, Trophy, CheckCircle2, Lock, ChevronDown } from "lucide-react";
import { StatCard } from "@/app/components/ui/StatCard";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { DEV_BYPASS_LOCKS } from "@/app/config";

export function MobileProgress({ profile, modules }: { profile: any, modules: any[] }) {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const wordsKnown = profile?.words_known || 0;
  const timeSpentMins = profile?.time_spent_mins || 0;
  const streak = profile?.streak || 0;

  const hours = Math.floor(timeSpentMins / 60);
  const minutes = timeSpentMins % 60;
  const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const completedModules = modules.filter(m => m.status === "completed").length;

  return (
    <div className="px-5 pt-12 pb-28 animate-in fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-[32px] text-ink mb-2">Progress</h1>
        <p className="text-sm text-ink-light leading-relaxed">
          Monitor your journey through the Tibetan language.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-10">
        <StatCard title="Daily Streak" value={streak} icon={<Flame size={18} />} subtitle="Days in a row" />
        <StatCard title="Time Spent" value={formattedTime} icon={<Clock size={18} />} subtitle="Total study time" />
        <StatCard title="Words Known" value={wordsKnown} icon={<BookOpen size={18} />} subtitle="Vocab mastered" />
        <StatCard title="Completed" value={completedModules} icon={<Trophy size={18} />} subtitle="Units finished" />
      </div>

      <div className="mb-6">
        <h2 className="font-serif text-2xl text-ink mb-1">Syllabus Progress</h2>
        <p className="text-xs text-ink-light">Tap a unit to see your detailed mastery check scores.</p>
      </div>

      
	  <div className="space-y-4">
        {modules.map((module) => {
          const isLocked = module.status === "locked" && !DEV_BYPASS_LOCKS;
          const isCompleted = module.status === "completed";
          const percent = Math.round((module.progress / module.lesson_count) * 100);
          
          const isExpanded = expandedModule === module.module_id;

          // Defensively parse mastery_scores to handle string, object, or null data
          let scores: Record<string, any> = {};
          if (typeof module.mastery_scores === "string") {
            try {
              scores = JSON.parse(module.mastery_scores);
            } catch {
              scores = {};
            }
          } else if (module.mastery_scores && typeof module.mastery_scores === "object") {
            scores = module.mastery_scores;
          }
          const scoreEntries = Object.entries(scores);

          return (
            <div 
              key={module.id || module.module_id}
              className={`bg-white rounded-[1.5rem] shadow-sm border overflow-hidden transition-all ${
                isLocked ? "border-transparent bg-surface-muted/60 opacity-60" : "border-border-subtle"
              }`}
            >
              {/* Card Header (Clickable) */}
              <button 
                onClick={() => !isLocked && setExpandedModule(isExpanded ? null : module.module_id)}
                disabled={isLocked}
                className="w-full p-5 text-left active:bg-surface-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif border shrink-0 ${
                      isCompleted ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-surface-muted border-border-strong text-ink"
                    }`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : module.module_id}
                    </div>
                    <h3 className="font-bold text-[15px] text-ink truncate pr-2">{module.title}</h3>
                  </div>
                  {isLocked ? (
                    <Lock size={16} className="text-ink-muted shrink-0" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-ink-muted uppercase tracking-widest">{percent}%</span>
                      <ChevronDown size={18} className={`text-ink-muted transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  )}
                </div>
                
                <ProgressBar 
                  progress={module.progress} 
                  total={module.lesson_count} 
                  colorClass={isCompleted ? "bg-emerald-500" : "bg-brand"}
                />
              </button>

              {/* Expandable Details Area */}
              {isExpanded && !isLocked && (
                <div className="px-5 pb-5 pt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="border-t border-border-subtle pt-4">
                    {scoreEntries.length > 0 ? (
                      <div className="space-y-2">
                        {scoreEntries.map(([qTitle, qData]: any) => {
                          const scoreVal = typeof qData === "object" && qData !== null ? (qData.score ?? 0) : (typeof qData === "number" ? qData : 0);
                          const totalVal = typeof qData === "object" && qData !== null ? (qData.total || 10) : 10;
                          const passed = totalVal > 0 ? (scoreVal / totalVal) >= 0.8 : false;
                          return (
                            <div key={qTitle} className="flex justify-between items-center bg-surface-muted px-4 py-3 rounded-2xl border border-border-subtle">
                               <span className="text-xs font-bold text-ink truncate pr-4">{qTitle}</span>
                               <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0 ${
                                 passed ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                               }`}>
                                 {scoreVal} / {totalVal}
                               </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-ink-muted italic text-center py-4 bg-surface-muted rounded-2xl border border-border-subtle">
                        No mastery checks completed yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
	  
	  
    </div>
  );
}