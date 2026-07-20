"use client";

import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Check, Play, Loader2, Lock } from "lucide-react"; 
import { DEV_BYPASS_LOCKS } from "@/app/config";

const FALLBACK_MODULES = [
  { id: 1, module_id: 1, title: "The 30 Consonants", description: "The foundation of the Tibetan alphabet, script, tones, and essential root vocabulary.", progress: 0, status: "active" },
  { id: 2, module_id: 2, title: "The Four Vowels", description: "The four diacritic marks, their shapes, positions, pronunciation, and spelling math.", progress: 0, status: "locked" },
  { id: 3, module_id: 3, title: "The Three Superscripts", description: "The superscripts ར, ལ, and ས, their consonant combinations, tone changes, and vocabulary.", progress: 0, status: "locked" },
  { id: 4, module_id: 4, title: "The Four Subscripts", description: "The subjoined marks Ya-tak, Ra-tak, La-tak, and Wa-zur and their complex sound shifts.", progress: 0, status: "locked" },
  { id: 5, module_id: 5, title: "The Prefix Letters", description: "The five prefix letters and their complex role in Tibetan spelling and pronunciation.", progress: 0, status: "locked" },
  { id: 6, module_id: 6, title: "The Suffix Letters", description: "The ten suffix letters and the two secondary suffixes.", progress: 0, status: "locked" }
];

export default function MyLessonsPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isLoaded) return;
      
      if (isLoaded && !user) {
         if (isMounted) {
           setModules(FALLBACK_MODULES);
           setLoading(false);
         }
         return;
      }

      if (isLoaded && user) {
        try {
          const token = await getToken();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const data = await res.json();
          
          if (isMounted) {
            // Safely handle empty arrays from the database
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
        }
      }
    };
    
    fetchData();
    return () => { isMounted = false; };
  }, [user, isLoaded, getToken]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-amber-500" /></div>;

  // Sort modules safely
  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));

  return (
    <div className="max-w-4xl mx-auto p-8 pb-24 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-3">Syllabus</h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e8e4d9] pb-6">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-stone-900">
            The Beginner curriculum
          </h1>
          <div className="text-sm font-medium text-stone-500 mb-1">
            {visibleModules.length} modules · Active Syllabus
          </div>
        </div>
      </div>

      {/* Curriculum List */}
      <div className="space-y-4">
        {visibleModules.map((module) => {
          
          const lessonUrl = `/dashboard/lessons/${Number(module.module_id)}`;
          const isLocked = module.status === "locked" && !DEV_BYPASS_LOCKS;

          // COMPLETED STATE
          if (module.status === "completed") {
            return (
              <div key={module.id || module.module_id} className="flex flex-col md:flex-row bg-white border border-[#e8e4d9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-50 text-emerald-600 font-serif text-2xl font-bold flex items-center justify-center rounded-xl">
                  {module.module_id}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-stone-800">{module.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">Completed</span>
                  </div>
                  <p className="text-stone-500 text-sm mb-3">{module.description}</p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <Link href={lessonUrl} className="px-5 py-2 border border-stone-200 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-50 transition flex items-center gap-2">
                    <Check size={16} /> Review
                  </Link>
                </div>
              </div>
            );
          }

          // LOCKED STATE
          if (isLocked) {
             return (
               <div key={module.id || module.module_id} className="flex flex-col md:flex-row bg-[#f8f6f0] border border-[#e8e4d9] rounded-2xl p-6 gap-6 relative overflow-hidden opacity-70">
                 <div className="flex-shrink-0 w-16 h-16 bg-stone-200 text-stone-400 font-serif text-2xl font-bold flex items-center justify-center rounded-xl">
                   <Lock size={20} />
                 </div>
                 <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                     <h3 className="text-xl font-bold text-stone-700">{module.title}</h3>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-stone-200 px-2 py-0.5 rounded">Locked</span>
                   </div>
                   <p className="text-stone-500 text-sm mb-4">{module.description}</p>
                 </div>
               </div>
             )
          }

          // ACTIVE & UNLOCKED STATE
          return (
            <div key={module.id || module.module_id} className={`flex flex-col md:flex-row bg-white border-2 ${module.progress > 0 ? 'border-amber-400 shadow-md' : 'border-[#e8e4d9] hover:border-amber-400 shadow-sm'} rounded-2xl p-6 gap-6 relative overflow-hidden transition-colors`}>
              {module.progress > 0 && <div className="absolute left-0 top-0 w-1 h-full bg-amber-400"></div>}
              <div className={`flex-shrink-0 w-16 h-16 ${module.progress > 0 ? 'bg-amber-50 text-amber-600' : 'bg-stone-50 text-stone-500'} font-serif text-2xl font-bold flex items-center justify-center rounded-xl`}>
                {module.module_id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-stone-900">{module.title}</h3>
                  {module.progress > 0 ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">In Progress</span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-stone-100 px-2 py-0.5 rounded">Ready to Start</span>
                  )}
                </div>
                <p className="text-stone-600 text-sm mb-4">{module.description}</p>
                
                <div className="flex items-center gap-4 w-full max-w-md">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${module.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-amber-600 shrink-0">{module.progress}% DONE</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <Link href={lessonUrl} className="px-6 py-2.5 bg-amber-500 text-stone-900 font-bold text-sm rounded-xl hover:bg-amber-400 transition flex items-center gap-2 shadow-sm">
                  <Play size={16} className="fill-stone-900" /> {module.progress > 0 ? 'Continue' : 'Start Module'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}