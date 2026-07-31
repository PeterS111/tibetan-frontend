
"use client";

import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Lock, Loader2, Flame, Clock, Sparkles, ArrowRight } from "lucide-react";

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
  // Default to 64% just to match the visual if there's no data, otherwise calculate
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 64; 
  const hoursSpent = profile?.time_spent_mins ? (profile.time_spent_mins / 60).toFixed(1) : "3.5";
  const wordsKnown = profile?.words_known || 284;
  const streak = profile?.streak || 12;

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-500 pb-24">
      
      {/* Top Section: Intro & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
        
        {/* Welcome Text */}
        <div className="flex-1 space-y-4">
          <div className="text-[11px] font-bold tracking-[0.2em] text-brand-dark mb-4 font-tibetan">
            ༄༅། །བོད་སྐད་ཀྱི་ལམ་བུ།
          </div>
          <h1 className="text-4xl md:text-[2.75rem] font-bold font-serif text-ink leading-[1.2]">
            Three courses. One scholarly path through the Tibetan language.
          </h1>
          <p className="text-[15px] text-ink-light font-sans max-w-xl leading-relaxed pt-2">
            Each course is broken into short, focused levels — script and sounds first, then everyday conversation, then reading real texts.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex gap-4 shrink-0">
          <div className="flex flex-col w-28 bg-surface border border-border-subtle p-5">
            <Flame className="text-brand mb-4" size={20} strokeWidth={2.5} />
            <div className="text-2xl font-serif text-ink mb-1">{streak}</div>
            <div className="text-[9px] font-bold text-ink-muted uppercase tracking-widest">Day Streak</div>
          </div>
          <div className="flex flex-col w-28 bg-surface border border-border-subtle p-5">
            <Clock className="text-brand mb-4" size={20} strokeWidth={2.5} />
            <div className="text-2xl font-serif text-ink mb-1">{hoursSpent}h</div>
            <div className="text-[9px] font-bold text-ink-muted uppercase tracking-widest">This Week</div>
          </div>
          <div className="flex flex-col w-28 bg-surface border border-border-subtle p-5">
            <Sparkles className="text-brand mb-4" size={20} strokeWidth={2.5} />
            <div className="text-2xl font-serif text-ink mb-1">{wordsKnown}</div>
            <div className="text-[9px] font-bold text-ink-muted uppercase tracking-widest">Words Known</div>
          </div>
        </div>
      </div>


      {/* Curriculum Section */}
      <div className="space-y-12">
        <div className="flex items-end justify-between border-b border-border-subtle pb-4">
          <div>
            <div className="text-eyebrow text-brand-dark mb-2 tracking-[0.2em]">Curriculum</div>
            <h2 className="text-3xl font-serif text-ink">Your courses</h2>
          </div>
          <Link href="/dashboard/lessons" className="text-sm font-medium text-ink-light hover:text-ink transition-colors pb-1">
            View full progression &rarr;
          </Link>
        </div>

        {/* Course 1: Beginner */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-eyebrow text-brand-dark tracking-[0.2em]">Course 1</div>
            <div className="text-xs text-ink-light font-medium">2 levels</div>
          </div>
          <h3 className="text-2xl font-serif text-ink mb-1">Beginner Course</h3>
          <p className="text-sm text-ink-light italic font-serif mb-6">Script, sounds, and daily conversation.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Level 1 - Active */}
            <Card className="border-t-4 border-t-brand p-8 flex flex-col h-full shadow-sm relative">
              <div className="flex justify-between items-center mb-6">
                <span className="text-eyebrow">Part 1</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-xl font-serif text-ink">Beginner 1</h4>
                <Badge variant="brand">In Progress</Badge>
              </div>
              <p className="text-[13px] text-ink-light leading-relaxed mb-8">
                The Tibetan script from the ground up: 30 consonants, four vowels, stacks, prefixes and suffixes.
              </p>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs font-bold text-ink-light mb-3">
                  <span>{progressPercent}% complete</span>
                  <span className="text-ink-muted font-medium">7 units · 30 hrs</span>
                </div>
                <div className="w-full bg-surface-muted h-1 mb-6 overflow-hidden">
                  <div className="bg-brand h-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <Link href="/dashboard/lessons" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors rounded-none bg-brand text-ink hover:bg-[#E5AC00]">
                  Continue <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
              </div>
            </Card>

            {/* Level 2 - Available/Ready */}
            <Card className="border-t-4 border-t-border-subtle p-8 flex flex-col h-full shadow-sm relative">
              <div className="flex justify-between items-center mb-6">
                <span className="text-eyebrow">Part 2</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-xl font-serif text-ink">Beginner 2</h4>
                <Badge variant="default">Ready to Start</Badge>
              </div>
              <p className="text-[13px] text-ink-light leading-relaxed mb-8">
                Put the script to work: greetings, self-introduction, numbers, family, shopping, and daily life.
              </p>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs font-bold text-ink-light mb-3">
                  <span>0% complete</span>
                  <span className="text-ink-muted font-medium">11 units · 25 hrs</span>
                </div>
                <div className="w-full bg-surface-muted h-1 mb-6 overflow-hidden"></div>
                <Button variant="outline" className="px-6 py-2.5 flex gap-2">
                  Start <ArrowRight size={16} strokeWidth={1.5} />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Course 2: Intermediate */}
        <div className="pt-8">
          <div className="text-eyebrow text-brand-dark tracking-[0.2em] mb-2">Course 2</div>
          <h3 className="text-2xl font-serif text-ink mb-1">Intermediate Course</h3>
          <p className="text-sm text-ink-light italic font-serif mb-6">Register, tenses, and reading longer texts.</p>
          
          <div className="grid md:grid-cols-2 gap-6 opacity-75">
            {[
              { part: "Part 1", title: "Pre-Intermediate", desc: "Build conversational fluency. Past and future tenses through traditional storytelling." },
              { part: "Part 2", title: "Intermediate", desc: "Honorifics, register, and reading short prose from contemporary Tibetan writers." },
            ].map((tier, i) => (
              <Card key={i} className="p-8 bg-paper border-border-subtle flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-eyebrow text-ink-muted">{tier.part}</span>
                </div>
                <h4 className="text-xl font-serif text-ink-light mb-4">{tier.title}</h4>
                <p className="text-[13px] text-ink-muted leading-relaxed mb-8">{tier.desc}</p>
                
                <div className="mt-auto flex items-center gap-2 text-[11px] font-medium text-ink-muted border-t border-border-subtle pt-4 uppercase tracking-wider">
                  <Lock size={12} /> Unlocks after the previous course
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Course 3: Advanced */}
        <div className="pt-8">
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-eyebrow text-brand-dark tracking-[0.2em]">Course 3</div>
            <div className="text-xs text-ink-light font-medium">2 levels</div>
          </div>
          <h3 className="text-2xl font-serif text-ink mb-1">Advanced Course</h3>
          <p className="text-sm text-ink-light italic font-serif mb-6">Classical grammar and the scholar's path.</p>
          
          <div className="grid md:grid-cols-2 gap-6 opacity-75">
            {[
              { part: "Part 1", title: "Upper-Intermediate", desc: "Classical grammar fundamentals; navigating philosophical and journalistic texts." },
              { part: "Part 2", title: "Advanced", desc: "Independent reading of canonical texts, poetry, and fluent discourse on abstract subjects." },
            ].map((tier, i) => (
              <Card key={i} className="p-8 bg-paper border-border-subtle flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-eyebrow text-ink-muted">{tier.part}</span>
                </div>
                <h4 className="text-xl font-serif text-ink-light mb-4">{tier.title}</h4>
                <p className="text-[13px] text-ink-muted leading-relaxed mb-8">{tier.desc}</p>
                
                <div className="mt-auto flex items-center gap-2 text-[11px] font-medium text-ink-muted border-t border-border-subtle pt-4 uppercase tracking-wider">
                  <Lock size={12} /> Unlocks after the previous course
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>

      {/* Continue Widget */}
      <div className="pt-16 border-t border-border-subtle">
        <div className="text-eyebrow text-brand-dark tracking-[0.2em] mb-3">Pick up where you left off</div>
        <h2 className="text-3xl font-serif text-ink mb-8">Continue your Beginner journey</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-8 shadow-sm border border-border-strong">
            <div className="mb-4">
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[#FCECD8] text-[#9A5013]">
                Unit 4 · Step 3
              </span>
            </div>
            <h3 className="text-2xl font-serif text-ink mb-3">The Four Vowels & their Diacritics</h3>
            <p className="text-sm text-ink-light mb-8 font-sans">
              Pronounce and write <span className="font-tibetan text-ink text-base mx-1">ི ུ ེ ོ</span> above and below the root consonants.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="secondary" className="px-6 py-2.5 flex gap-2 font-medium">
                Continue Learning <ArrowRight size={16} strokeWidth={1.5} />
              </Button>
              <span className="text-xs text-ink-muted font-medium">14 min remaining</span>
            </div>
          </Card>

          <Card className="p-8 shadow-sm border border-border-strong flex flex-col">
            <div className="mb-4">
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-surface-muted border border-border-subtle text-ink-light">
                Today
              </span>
            </div>
            <h3 className="text-xl font-serif text-ink mb-3">Practice with Lobsang</h3>
            <p className="text-[13px] text-ink-light mb-8 font-sans leading-relaxed flex-1">
              Your AI tutor has 3 new prompts about the vocabulary you just learned.
            </p>
            <Link href="/dashboard/chat" className="text-sm font-medium text-brand-dark hover:text-ink transition-colors flex items-center gap-1">
              Open chat <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </Card>
        </div>
      </div>
      
    </div>
  );
}