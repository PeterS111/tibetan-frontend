"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Check, Lock, Clock, BookOpen, Play, Loader2 } from "lucide-react";

export default function MyLessonsPage() {
  const { user, isLoaded } = useUser();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch(`https://tibetan-backend.onrender.com/api/progress?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setModules(data.modules || []);
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, [user, isLoaded]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-amber-500" /></div>;

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
            {modules.length} modules · Complete Syllabus
          </div>
        </div>
      </div>

      {/* Curriculum List */}
      <div className="space-y-4">
        {modules.map((module) => {
          
          // Construct the auto-launch URL for the AI chat
          const topicString = `Module ${parseInt(module.module_id)}: ${module.title}`;
          const chatUrl = `/dashboard/chat?mode=study&topic=${encodeURIComponent(topicString)}`;

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
                  <Link href={chatUrl} className="px-5 py-2 border border-stone-200 text-stone-600 font-bold text-sm rounded-xl hover:bg-stone-50 transition flex items-center gap-2">
                    <Check size={16} /> Review
                  </Link>
                </div>
              </div>
            );
          }

          // ACTIVE STATE
          if (module.status === "active") {
            return (
              <div key={module.id} className="flex flex-col md:flex-row bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-md gap-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1 h-full bg-amber-400"></div>
                <div className="flex-shrink-0 w-16 h-16 bg-amber-50 text-amber-600 font-serif text-2xl font-bold flex items-center justify-center rounded-xl">
                  {module.module_id}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-stone-900">{module.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">In Progress</span>
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
                  <Link href={chatUrl} className="px-6 py-2.5 bg-amber-500 text-stone-900 font-bold text-sm rounded-xl hover:bg-amber-400 transition flex items-center gap-2 shadow-sm">
                    <Play size={16} className="fill-stone-900" /> Continue
                  </Link>
                </div>
              </div>
            );
          }

          // LOCKED STATE
          return (
            <div key={module.id} className="flex flex-col md:flex-row bg-[#fdfbf7] border border-[#e8e4d9] rounded-2xl p-6 opacity-60 gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-stone-100 text-stone-400 font-serif text-2xl font-bold flex items-center justify-center rounded-xl">
                <Lock size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-stone-500 mb-1">{module.title}</h3>
                <p className="text-stone-400 text-sm mb-3">{module.description}</p>
              </div>
              <div className="flex items-center justify-end mt-4 md:mt-0 min-w-[120px]">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Unlocks Next</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}