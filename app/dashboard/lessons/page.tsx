"use client";

import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Check, Loader2, Lock } from "lucide-react"; 
import { DEV_BYPASS_LOCKS } from "@/app/config";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

const FALLBACK_MODULES = [
  { id: 1, module_id: 1, title: "The 30 Consonants", description: "The foundation of the Tibetan alphabet, script, tones, and essential root vocabulary.", progress: 0, status: "active", lesson_count: 8 },
  { id: 2, module_id: 2, title: "The Four Vowels", description: "The four diacritic marks, their shapes, positions, pronunciation, and spelling math.", progress: 0, status: "locked", lesson_count: 7 },
  { id: 3, module_id: 3, title: "The Three Superscripts", description: "The superscripts ར, ལ, and ས, their consonant combinations, tone changes, and vocabulary.", progress: 0, status: "locked", lesson_count: 5 },
  { id: 4, module_id: 4, title: "The Four Subscripts", description: "The Subscripts (ya-ra-la-wa) and their complex sound shifts.", progress: 0, status: "locked", lesson_count: 6 },
  { id: 5, module_id: 5, title: "The Prefix Letters", description: "The five prefix letters and their complex role in Tibetan spelling and pronunciation.", progress: 0, status: "locked", lesson_count: 7 },
  { id: 6, module_id: 6, title: "The Suffix Letters", description: "The ten suffix letters and the two secondary suffixes.", progress: 0, status: "locked", lesson_count: 9 },
  { id: 7, module_id: 7, title: "Final Assessment", description: "A short mixed assessment drawing on every step so far. Score 80% or higher to pass.", progress: 0, status: "locked", lesson_count: 3 }
];

export default function MyStepsPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // 🛠️ MOVED THE TIMEOUT LOGIC TO BE FOOLPROOF
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        console.warn("Clerk load timeout on Emulator. Using fallback modules.");
        setModules(FALLBACK_MODULES);
        setLoading(false);
      }
    }, 2000);

    const fetchData = async () => {
      if (!isLoaded) return;
      
      if (isLoaded && !user) {
         if (isMounted) {
           setModules(FALLBACK_MODULES);
           setLoading(false);
         }
         clearTimeout(safetyTimer);
         return;
      }

      if (isLoaded && user) {
        try {
          // 🛠️ WRAP GET-TOKEN IN A RACE CONDITION SO IT CANNOT HANG FOREVER
          const token = await Promise.race([
            getToken(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Token timeout")), 1500))
          ]);
          
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const data = await res.json();
          
          if (isMounted) {
            if (data.modules && Array.isArray(data.modules) && data.modules.length > 0) {
              setModules(data.modules);
            } else {
              setModules(FALLBACK_MODULES);
            }
          }
        } catch(e) {
          console.error("Error fetching curriculum:", e);
          if (isMounted) setModules(FALLBACK_MODULES);
        } finally {
          if (isMounted) setLoading(false);
          // 🛠️ CLEAR TIMEOUT ONLY AFTER EVERYTHING IS DONE
          clearTimeout(safetyTimer);
        }
      }
    };
    
    fetchData();
    
    return () => { 
      isMounted = false; 
      clearTimeout(safetyTimer);
    };
  }, [user, isLoaded, getToken]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-brand" /></div>;

  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));

  return (
    <div className="max-w-4xl mx-auto p-8 pb-24 animate-in fade-in duration-500">
      <div className="mb-10 pt-4">
        <h2 className="text-[10px] font-bold uppercase text-brand-dark mb-3 tracking-[0.2em]">Syllabus</h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-ink">The Beginner curriculum</h1>
          <div className="text-sm font-medium text-ink-light mb-1 hidden md:block">
            {visibleModules.length} modules · Active Syllabus
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {visibleModules.map((module) => {
          const lessonUrl = `/dashboard/lessons/${Number(module.module_id)}`;
          const isLocked = module.status === "locked" && !DEV_BYPASS_LOCKS;

          if (module.status === "completed") {
            return (
              <Card key={module.id || module.module_id} className="flex flex-col md:flex-row p-6 gap-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-50 text-emerald-700 font-serif text-xl font-bold flex items-center justify-center border border-emerald-200">{module.module_id}</div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-1.5"><h3 className="text-xl font-bold font-serif text-ink">{module.title}</h3><Badge variant="success">Completed</Badge></div>
                  <p className="text-ink-light text-sm">{module.description}</p>
                </div>
                <div className="flex items-center mt-4 md:mt-0"><Link href={lessonUrl} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors rounded-none bg-transparent text-ink border border-border-strong hover:border-ink w-full md:w-auto"><Check size={16} /> Review</Link></div>
              </Card>
            );
          }

          if (isLocked) {
             return (
               <Card key={module.id || module.module_id} className="flex flex-col md:flex-row bg-surface-muted border-border-subtle p-6 gap-6 relative overflow-hidden opacity-70">
                 <div className="flex-shrink-0 w-14 h-14 bg-border-subtle text-ink-muted font-serif text-xl font-bold flex items-center justify-center"><Lock size={18} /></div>
                 <div className="flex-1 flex flex-col justify-center">
                   <div className="flex items-center gap-3 mb-1.5"><h3 className="text-xl font-bold font-serif text-ink-light">{module.title}</h3><Badge variant="locked">Locked</Badge></div>
                   <p className="text-ink-muted text-sm">{module.description}</p>
                 </div>
               </Card>
             )
          }

          const progressVal = Number(module.progress) || 0;
          const lessonCount = Number(module.lesson_count) || 1;
          const percentDone = Math.min(100, Math.round((progressVal / lessonCount) * 100));

          return (
            <Card key={module.id || module.module_id} className={`flex flex-col md:flex-row p-6 gap-6 relative overflow-hidden transition-colors border ${progressVal > 0 ? 'border-brand shadow-sm' : 'border-border-subtle hover:border-ink shadow-none'}`}>
              <div className={`flex-shrink-0 w-14 h-14 ${progressVal > 0 ? 'bg-brand/10 text-brand-dark' : 'bg-surface-muted text-ink'} font-serif text-xl font-bold flex items-center justify-center`}>{module.module_id}</div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-1.5"><h3 className="text-xl font-bold font-serif text-ink">{module.title}</h3>{progressVal > 0 ? <Badge variant="brand">In Progress</Badge> : <Badge variant="default">Ready to Start</Badge>}</div>
                <p className="text-ink-light text-sm">{module.description}</p>
                {progressVal > 0 && (
                  <div className="flex items-center gap-4 w-full max-w-md mt-4">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-full h-1 bg-surface-muted overflow-hidden"><div className="h-full bg-brand" style={{ width: `${percentDone}%` }}></div></div>
                      <span className="text-[10px] font-bold text-brand-dark shrink-0 tracking-wider uppercase">{percentDone}% DONE</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <Link href={lessonUrl} className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors rounded-none w-full md:w-auto ${progressVal > 0 ? 'bg-brand text-ink hover:bg-[#E5AC00]' : 'bg-transparent text-ink border border-border-strong hover:border-ink'}`}>
                  {progressVal > 0 ? 'Continue' : 'Start'}
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}