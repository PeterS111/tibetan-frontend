"use client";

import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Check, Play, Loader2 } from "lucide-react"; 

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
         if (isMounted) setLoading(false);
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
            if (data.modules && Array.isArray(data.modules)) {
              setModules(data.modules);
            }
          }
        } catch(e) {
          console.error("Error fetching curriculum:", e);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [user, isLoaded, getToken]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-amber-500" /></div>;

// STRICT FILTER: Only show lessons 1, 2, and 3. 
  // Hides the remaining uncreated modules from the database.
  const visibleModules = modules.filter(m => Number(m.module_id) >= 1 && Number(m.module_id) <= 3);

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
          
          // Next.js will automatically route to /lessons/1 or /lessons/2 folder
          // FIX: Wrap module_id in Number() to strip any leading zeros (e.g., "01" becomes 1)
          const lessonUrl = `/dashboard/lessons/${Number(module.module_id)}`;

          // COMPLETED STATE
          if (module.status === "completed") {
            return (
              <div key={module.id} className="flex flex-col md:flex-row bg-white border border-[#e8e4d9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow gap-6">
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

          // ACTIVE & UNLOCKED STATE (All non-completed modules)
          return (
            <div key={module.id} className={`flex flex-col md:flex-row bg-white border-2 ${module.progress > 0 ? 'border-amber-400 shadow-md' : 'border-[#e8e4d9] hover:border-amber-400 shadow-sm'} rounded-2xl p-6 gap-6 relative overflow-hidden transition-colors`}>
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