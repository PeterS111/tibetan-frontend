// app/components/dashboard/MobileLessons.tsx
"use client";

import Link from "next/link";
import { Check, Play, Lock, Star } from "lucide-react";
import { DEV_BYPASS_LOCKS } from "@/app/config";

export function MobileLessons({ modules }: any) {
  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));
  
  const completedCount = visibleModules.filter(m => m.status === "completed").length;
  const totalCount = visibleModules.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100) || 5; // Floor at 5% for visual

  return (
    <div className="px-5 pt-12 pb-24 animate-in fade-in">
      
      {/* Header & Progress */}
      <div className="mb-8">
        <h1 className="font-serif text-[32px] text-ink mb-2">Lessons</h1>
        <div className="text-sm text-ink-light mb-4">
          Beginner 1 · The Script — {completedCount} of {totalCount} complete
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-ink/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-brand-dark">{progressPercent}%</span>
        </div>
      </div>

      {/* Course Switcher Pills */}
      <div className="flex items-center gap-2 mb-8">
        {/* Using the dark red destructive color from globals.css for the active pill */}
        <button className="bg-[#8C2A21] text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-sm">
          Beginner 1
        </button>
        <button className="bg-surface-muted text-ink-muted px-5 py-2.5 rounded-full text-[13px] font-bold border border-border-subtle opacity-70 cursor-not-allowed">
          Beginner 2 · soon
        </button>
      </div>

      {/* Module List */}
      <div className="space-y-4">
        {visibleModules.map((module) => {
          const lessonUrl = `/dashboard/lessons/${Number(module.module_id)}`;
          const isLocked = module.status === "locked" && !DEV_BYPASS_LOCKS;
          const isCompleted = module.status === "completed";
          const isCurrent = module.status !== "completed" && !isLocked;

          return (
            <Link 
              key={module.id || module.module_id} 
              href={isLocked ? "#" : lessonUrl}
              className={`block bg-white rounded-[1.25rem] p-4 shadow-sm border ${isCurrent ? 'border-brand/40 shadow-md transform scale-[1.02] transition-transform' : 'border-border-subtle'} ${isLocked ? 'opacity-60 cursor-not-allowed' : 'active:scale-95 transition-transform'}`}
            >
              <div className="flex items-center gap-4">
                
                {/* Status Icon */}
                <div className="shrink-0">
                  {isCompleted && (
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check size={20} strokeWidth={3} />
                    </div>
                  )}
                  {isCurrent && (
                    <div className="w-14 h-14 rounded-full bg-brand text-ink flex items-center justify-center shadow-sm">
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="w-12 h-12 rounded-full bg-surface-muted border border-border-strong text-ink-muted flex items-center justify-center">
                      <Lock size={18} />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="font-serif text-[17px] font-bold text-ink truncate mb-0.5">
                    {module.title}
                  </h3>
                  
                  {/* Current Lesson Progress Bar */}
                  {isCurrent && (
                    <div className="w-24 h-1 bg-ink/10 rounded-full mt-3">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${Math.max((module.progress / module.lesson_count) * 100, 5)}%` }}></div>
                    </div>
                  )}
                </div>

                {/* Stars (Only for completed or current) */}
                {!isLocked && (
                  <div className="flex gap-0.5 shrink-0">
                    <Star size={14} fill={isCompleted ? "#FFB600" : "#F2EDE1"} className={isCompleted ? "text-brand" : "text-border-strong"} />
                    <Star size={14} fill={isCompleted ? "#FFB600" : "#F2EDE1"} className={isCompleted ? "text-brand" : "text-border-strong"} />
                    <Star size={14} fill={isCompleted ? "#FFB600" : "#F2EDE1"} className={isCompleted ? "text-brand" : "text-border-strong"} />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}