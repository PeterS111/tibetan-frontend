"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { TrendingUp, Clock, Brain, Flame, BookOpen, Loader2 } from "lucide-react";

export default function ProgressPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setProfile(data.profile);
          setModules(data.modules || []);
          setLoading(false);
        } catch(e) { setLoading(false); }
      }
    };
    fetchData();
  }, [user, isLoaded, getToken]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-amber-500" /></div>;

  // Format Time Spent
  const totalMins = profile?.time_spent_mins || 0;
  const hours = Math.floor(totalMins / 60);
  const minutes = totalMins % 60;
  const streak = profile?.streak || 0;

  // Streak visualizer (Fakes a 7-day history based on the streak number for visual flair)
  const streakDays = Array.from({ length: 7 }).map((_, i) => {
    // If streak is 3, the last 3 circles will be lit up.
    return i >= 7 - streak;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 pb-24 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-3">Analytics</h2>
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 border-b border-[#e8e4d9] pb-6 flex items-center gap-4">
          <TrendingUp className="text-amber-500" size={32} /> Your Progress
        </h1>
      </div>

      {/* Top 3 KPI Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Time Tracking */}
        <div className="bg-white border border-[#e8e4d9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-stone-400 mb-4">
            <Clock size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Time Spent</span>
          </div>
          <div className="text-4xl font-bold text-stone-800 font-serif">
            {hours}<span className="text-2xl text-stone-500">h</span> {minutes}<span className="text-2xl text-stone-500">m</span>
          </div>
          <p className="text-sm text-stone-500 mt-2">Total time focused in active learning sessions.</p>
        </div>

        {/* Vocabulary */}
        <div className="bg-white border border-[#e8e4d9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-stone-400 mb-4">
            <Brain size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Vocabulary</span>
          </div>
          <div className="text-4xl font-bold text-stone-800 font-serif">
            {profile?.words_known || 0}
          </div>
          <p className="text-sm text-stone-500 mt-2">Total words mapped and mastered in memory.</p>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 border border-amber-600 rounded-2xl p-6 shadow-md text-white flex flex-col justify-between">
          <div className="flex items-center gap-2 text-amber-100 mb-4">
            <Flame size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Active Streak</span>
          </div>
          <div className="text-4xl font-bold font-serif">
            {streak} <span className="text-2xl text-amber-200">Days</span>
          </div>
          
          {/* Mini 7-Day Visualizer */}
          <div className="flex items-center justify-between mt-4 bg-black/10 p-3 rounded-xl">
            {streakDays.map((isActive, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'bg-white shadow-sm' : 'bg-amber-700/30'}`}>
                  {isActive && <Flame size={12} className="text-amber-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Breakdown */}
      <div>
        <h3 className="text-xl font-bold font-serif text-stone-900 mb-6">Curriculum Mastery</h3>
        <div className="bg-white border border-[#e8e4d9] rounded-2xl p-2 shadow-sm">
          {modules.map((mod, index) => (
            <div key={mod.id} className={`p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${index !== modules.length - 1 ? 'border-b border-stone-100' : ''}`}>
              
              <div className="w-10 h-10 shrink-0 bg-stone-50 rounded-xl flex items-center justify-center font-bold text-stone-400 font-serif border border-stone-200">
                {parseInt(mod.module_id)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-stone-800 truncate">{mod.title}</h4>
                  {mod.status === "completed" && <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold uppercase tracking-widest">Done</span>}
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-stone-400">
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {mod.lesson_count}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {mod.time_est}</span>
                </div>
              </div>

              <div className="w-full sm:w-48 shrink-0 flex items-center gap-3">
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${mod.status === "completed" ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                    style={{ width: `${mod.progress}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-bold w-9 text-right ${mod.status === "completed" ? 'text-emerald-600' : 'text-stone-400'}`}>
                  {mod.progress}%
                </span>
              </div>
              
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}