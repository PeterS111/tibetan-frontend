// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Lock, Loader2 } from "lucide-react";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export default function DashboardHub() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          if (!token) {
            if (isMounted) setLoading(false);
            return;
          }
          
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (isMounted) {
            if (data.profile) setProfile(data.profile);
            if (data.modules && Array.isArray(data.modules)) {
              setModules(data.modules);
            }
            setLoading(false);
          }
        } catch(e) { 
          if (isMounted) setLoading(false); 
        }
      } else if (isLoaded && !user) {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [user, isLoaded, getToken]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-brand" /></div>;

  const completedCount = modules.filter(m => m.status === "completed").length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
  const hoursSpent = profile?.time_spent_mins ? (profile.time_spent_mins / 60).toFixed(1) : "0.0";

  return (
    <div className="max-w-5xl mx-auto p-8 pb-24 space-y-12 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-ink leading-tight">
          Five tiers. One scholarly path <br />through the Tibetan language.
        </h1>
        <p className="text-lg text-ink-light font-sans max-w-2xl">
          Each tier is its own complete hub — lessons, AI dialogue, exercises, and materials — building on the foundations of the one before. Welcome back, {user?.firstName || "Student"}.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 md:w-fit">
        <Card className="p-5 text-center shadow-sm">
          <div className="text-2xl font-bold text-brand-dark mb-1">{profile?.streak || 0}</div>
          <div className="text-eyebrow">Day Streak</div>
        </Card>
        <Card className="p-5 text-center shadow-sm">
          <div className="text-2xl font-bold text-ink mb-1">{hoursSpent}h</div>
          <div className="text-eyebrow">Time Spent</div>
        </Card>
        <Card className="p-5 text-center shadow-sm">
          <div className="text-2xl font-bold text-ink mb-1">{profile?.words_known || 0}</div>
          <div className="text-eyebrow">Words Known</div>
        </Card>
      </div>

      {/* Progression Path */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-eyebrow text-brand-dark">Proficiency Tiers</h2>
          <span className="text-sm font-medium text-ink-light hover:text-ink cursor-pointer transition-colors">View full progression &rarr;</span>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          
          {/* Active Tier */}
          <Card className="p-6 border-2 border-brand flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
            <div className="flex justify-between items-start mb-4">
              <Badge variant="brand">Level I</Badge>
            </div>
            <h3 className="text-xl font-bold text-ink mb-3 font-serif">Beginner</h3>
            <p className="text-sm text-ink-light leading-relaxed mb-6">Establish the root of your practice. Script, phonology, and essential greetings.</p>
            
            <div className="mt-auto">
              <div className="flex justify-between text-xs font-bold text-ink-light mb-2">
                <span>{progressPercent}% complete</span>
                <span>{modules.length} units</span>
              </div>
              <div className="w-full bg-surface-muted h-1.5 mb-4 overflow-hidden">
                <div className="bg-brand h-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <Link 
                href="/dashboard/lessons" 
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold transition-all rounded-none bg-brand text-ink hover:bg-amber-400 border border-amber-600 shadow-sm"
              >
                Continue &rarr;
              </Link>
            </div>
          </Card>

          {/* Locked Tiers */}
          {[
            { level: "Level II", title: "Pre-Intermediate", desc: "Build conversational fluency. Past and future tenses through storytelling." },
            { level: "Level III", title: "Intermediate", desc: "Honorifics, register, and reading short prose from contemporary writers." },
            { level: "Level IV", title: "Upper-Intermediate", desc: "Classical grammar fundamentals; navigating philosophical texts." },
            { level: "Level V", title: "Advanced", desc: "Independent reading of canonical texts, poetry, and fluent discourse." }
          ].map((tier, i) => (
            <Card key={i} className="p-6 bg-surface-muted border-border-subtle flex flex-col h-full opacity-70">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="locked">{tier.level}</Badge>
              </div>
              <h3 className="text-xl font-bold text-ink-light mb-3 font-serif">{tier.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">{tier.desc}</p>
              
              <div className="mt-auto flex items-center gap-2 text-xs font-medium text-ink-muted border-t border-border-subtle pt-4">
                <Lock size={14} /> Unlocks at 80% of previous tier
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}