"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Lock, Loader2 } from "lucide-react";

export default function DashboardHub() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch(`https://tibetan-backend.onrender.com/api/progress?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setProfile(data.profile);
          setModules(data.modules || []);
          setLoading(false);
        }).catch(() => setLoading(false));
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-amber-500" /></div>;

  const activeModule = modules.find(m => m.status === "active") || modules[0];
  const completedCount = modules.filter(m => m.status === "completed").length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
  const hoursSpent = profile?.time_spent_mins ? (profile.time_spent_mins / 60).toFixed(1) : "0.0";

  return (
    <div className="max-w-5xl mx-auto p-8 pb-24 space-y-12 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-stone-900 leading-tight">
          Five tiers. One scholarly path <br />through the Tibetan language.
        </h1>
        <p className="text-lg text-stone-600 font-sans max-w-2xl">
          Each tier is its own complete hub — lessons, AI dialogue, exercises, and materials — building on the foundations of the one before. Welcome back, {user?.firstName || "Student"}.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 md:w-fit">
        <div className="p-5 bg-white border border-[#e8e4d9] rounded-2xl shadow-sm text-center">
          <div className="text-2xl font-bold text-amber-600 mb-1">{profile?.streak || 0}</div>
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Day Streak</div>
        </div>
        <div className="p-5 bg-white border border-[#e8e4d9] rounded-2xl shadow-sm text-center">
          <div className="text-2xl font-bold text-stone-800 mb-1">{hoursSpent}h</div>
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Time Spent</div>
        </div>
        <div className="p-5 bg-white border border-[#e8e4d9] rounded-2xl shadow-sm text-center">
          <div className="text-2xl font-bold text-stone-800 mb-1">{profile?.words_known || 0}</div>
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Words Known</div>
        </div>
      </div>

      {/* Progression Path */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em]">Proficiency Tiers</h2>
          <span className="text-sm font-medium text-stone-500 hover:text-stone-800 cursor-pointer transition-colors">View full progression &rarr;</span>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          
          {/* Active Tier */}
          <div className="p-6 bg-white border-2 border-amber-400 rounded-2xl shadow-sm flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Level I</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-3 font-serif">Beginner</h3>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">Establish the root of your practice. Script, phonology, and essential greetings.</p>
            
            <div className="mt-auto">
              <div className="flex justify-between text-xs font-bold text-stone-500 mb-2">
                <span>{progressPercent}% complete</span>
                <span>{modules.length} units</span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full mb-4">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <Link href="/dashboard/lessons" className="w-full block text-center py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm rounded-xl transition-colors">
                Continue &rarr;
              </Link>
            </div>
          </div>

          {/* Locked Tiers */}
          {[
            { level: "Level II", title: "Pre-Intermediate", desc: "Build conversational fluency. Past and future tenses through storytelling." },
            { level: "Level III", title: "Intermediate", desc: "Honorifics, register, and reading short prose from contemporary writers." },
            { level: "Level IV", title: "Upper-Intermediate", desc: "Classical grammar fundamentals; navigating philosophical texts." },
            { level: "Level V", title: "Advanced", desc: "Independent reading of canonical texts, poetry, and fluent discourse." }
          ].map((tier, i) => (
            <div key={i} className="p-6 bg-[#f8f6f0] border border-[#e8e4d9] rounded-2xl flex flex-col h-full opacity-70">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{tier.level}</span>
              </div>
              <h3 className="text-xl font-bold text-stone-700 mb-3 font-serif">{tier.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6">{tier.desc}</p>
              
              <div className="mt-auto flex items-center gap-2 text-xs font-medium text-stone-400 border-t border-[#e8e4d9] pt-4">
                <Lock size={14} /> Unlocks at 80% of previous tier
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}