"use client";

import Link from "next/link";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2, ArrowRight, Lock, CheckCircle2, Play } from "lucide-react";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import { Badge } from "../components/ui/Badge";

const FALLBACK_MODULES = [
  { id: 1, module_id: 1, title: "The 30 Consonants", description: "The foundation of the Tibetan alphabet, script, tones, and essential root vocabulary.", progress: 0, status: "active", lesson_count: 8 },
  { id: 2, module_id: 2, title: "The Four Vowels", description: "The four diacritic marks, their shapes, positions, pronunciation, and spelling math.", progress: 0, status: "locked", lesson_count: 7 },
  { id: 3, module_id: 3, title: "The Three Superscripts", description: "The superscripts ར, ལ, and ས, their consonant combinations, tone changes, and vocabulary.", progress: 0, status: "locked", lesson_count: 5 },
  { id: 4, module_id: 4, title: "The Four Subscripts", description: "The Subscripts (ya-ra-la-wa) and their complex sound shifts.", progress: 0, status: "locked", lesson_count: 6 },
  { id: 5, module_id: 5, title: "The Prefix Letters", description: "The five prefix letters and their complex role in Tibetan spelling and pronunciation.", progress: 0, status: "locked", lesson_count: 7 },
  { id: 6, module_id: 6, title: "The Suffix Letters", description: "The ten suffix letters and the two secondary suffixes.", progress: 0, status: "locked", lesson_count: 9 },
  { id: 7, module_id: 7, title: "Final Assessment", description: "A short mixed assessment drawing on every step so far. Score 80% or higher to pass.", progress: 0, status: "locked", lesson_count: 3 }
];

export default function UnifiedDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setModules(FALLBACK_MODULES);
        setLoading(false);
      }
    }, 2000);

    const fetchData = async () => {
      if (!isLoaded) return;
      if (isLoaded && !user) {
         if (isMounted) { setModules(FALLBACK_MODULES); setLoading(false); }
         clearTimeout(safetyTimer); return;
      }
      if (isLoaded && user) {
        try {
          const token = await Promise.race([
            getToken(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Token timeout")), 1500))
          ]);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (isMounted) {
            if (data.profile) setProfile(data.profile);
            if (data.modules && Array.isArray(data.modules) && data.modules.length > 0) {
              setModules(data.modules);
            } else {
              setModules(FALLBACK_MODULES);
            }
          }
        } catch(e) {
          if (isMounted) setModules(FALLBACK_MODULES);
        } finally {
          if (isMounted) setLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; clearTimeout(safetyTimer); };
  }, [user, isLoaded, getToken]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-brand" /></div>;

  const parseNum = (val: any, fallback: number) => {
    if (val === undefined || val === null) return fallback;
    const parsed = parseInt(String(val).replace(/\D/g, ''), 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));
  const nextModule = visibleModules.find(m => parseNum(m.progress, 0) < parseNum(m.lesson_count, 1)) || visibleModules[0] || FALLBACK_MODULES[0];
  
  const hoursSpent = profile?.time_spent_mins ? (profile.time_spent_mins / 60).toFixed(1) : "0.0";
  const wordsKnown = profile?.words_known || 0;
  const streak = profile?.streak || 0;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-24">
      
      {/* 1. Designer's Minimalist Stats Grid */}
      <div className="grid grid-cols-3 divide-x divide-border-subtle border-y border-border-subtle py-8 mb-12">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl md:text-5xl font-serif text-ink mb-2">{streak}</div>
          <div className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em]">Day Streak</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl md:text-5xl font-serif text-ink mb-2">{hoursSpent}<span className="text-2xl text-ink-light ml-1">h</span></div>
          <div className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em]">Time Spent</div>
        </div>
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
      <div className="bg-[#1a2332] text-white p-8 md:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 rounded-none">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3 flex items-center gap-3">
            <span className="w-6 h-[1px] bg-brand"></span> Resume where you left off
          </div>
          <h3 className="text-2xl md:text-3xl font-serif mb-2">{nextModule.title}</h3>
          <p className="text-sm text-slate-300 max-w-md opacity-90">{nextModule.description}</p>
        </div>
        <Link href={`/dashboard/lessons/${nextModule.module_id || 1}`} className="w-full md:w-auto shrink-0">
          <button className="w-full bg-brand hover:bg-[#E5AC00] text-ink font-bold text-sm px-8 py-4 transition-colors shadow-sm flex items-center justify-center gap-2">
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
        
        <p className="text-sm text-ink-light italic font-serif mb-8 border-l-2 border-brand pl-4">
          Part 1: The Tibetan script from the ground up: 30 consonants, four vowels, stacks, prefixes and suffixes.
        </p>

        <div className="space-y-3">
          {visibleModules.map((module) => {
            const lessonUrl = `/dashboard/lessons/${Number(module.module_id)}`;
            const isLocked = module.status === "locked" && !DEV_BYPASS_LOCKS;
            const isCompleted = module.status === "completed";
            const progressVal = parseNum(module.progress, 0);

            let rowClass = "flex flex-col md:flex-row bg-surface border transition-all p-5 gap-5 ";
            if (isCompleted) rowClass += "border-border-subtle hover:border-ink/30";
            else if (isLocked) rowClass += "border-transparent bg-surface-muted/50 opacity-60";
            else rowClass += "border-brand/40 shadow-sm relative";

            return (
              <div key={module.id || module.module_id} className={rowClass}>
                {!isCompleted && !isLocked && <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>}
                
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-serif text-xl border border-border-strong bg-white text-ink">
                  {module.module_id}
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-serif font-bold text-ink">{module.title}</h3>
                    {isCompleted && <Badge variant="success" className="text-[9px]">Completed</Badge>}
                    {!isCompleted && !isLocked && progressVal > 0 && <Badge variant="brand" className="text-[9px]">In Progress</Badge>}
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
                      <button className={`w-full flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold transition-colors uppercase tracking-wider border ${isCompleted ? 'bg-transparent text-ink border-border-strong hover:bg-surface-muted' : 'bg-ink text-white border-ink hover:bg-ink-light shadow-sm'}`}>
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

      {/* 5. Future Tiers (Greyed out previews) */}
      <div className="border-t border-border-subtle pt-12 space-y-6 opacity-60 pointer-events-none">
         <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl font-serif text-ink-muted opacity-40">II</div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-1">Course 2</div>
            <h2 className="text-2xl font-serif text-ink-muted">Intermediate Course</h2>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row bg-surface-muted border border-transparent p-6 gap-5">
           <div className="flex-1">
             <div className="flex items-center gap-3 mb-1">
               <h3 className="text-lg font-serif font-bold text-ink-muted">Pre-Intermediate</h3>
               <Badge variant="locked" className="text-[9px]">Locked</Badge>
             </div>
             <p className="text-sm text-ink-muted">Build conversational fluency. Past and future tenses through traditional storytelling.</p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row bg-surface-muted border border-transparent p-6 gap-5">
           <div className="flex-1">
             <div className="flex items-center gap-3 mb-1">
               <h3 className="text-lg font-serif font-bold text-ink-muted">Intermediate</h3>
               <Badge variant="locked" className="text-[9px]">Locked</Badge>
             </div>
             <p className="text-sm text-ink-muted">Honorifics, register, and reading short prose from contemporary Tibetan writers.</p>
           </div>
        </div>
      </div>

    </div>
  );
}