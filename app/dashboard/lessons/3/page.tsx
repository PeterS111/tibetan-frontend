"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowRight, ArrowUp, ArrowDown,
  Info, Layers, CheckCircle2, Moon, Sun, BookOpen, Loader2, Shuffle, X
} from "lucide-react";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- Data ---
import { SUPERS, VOCAB, STEPS, TONE_META, type SuperKey, type Tone } from "@/app/data/lesson3";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

export default function SuperscriptsLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  
  // 🚨 FIXED: Hardcoded 5 steps
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(5);

  const [activeTab, setActiveTab] = useState<SuperKey>("ra");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  
  const [isBypassing, setIsBypassing] = useState(false);

  const practiceGroups = useMemo(() => [
    {
      name: "Stacks",
      items: SUPERS.flatMap(s => s.combos.map(c => ({
        id: `c-${c.stack}`, tibetan: c.stack, reading: c.read, english: TONE_META[c.tone].label, audioTarget: c.stack
      })))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

  const quizQuestions = useMemo(() => {
    const allCombos = SUPERS.flatMap(s => s.combos);
    const qs = [];
    
    const vTargets = [...VOCAB].sort(() => 0.5 - Math.random()).slice(0, 4);
    for (const v of vTargets) {
      const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'vocab',
        questionText: `What is the Tibetan word for "${v.en}"?`,
        answer: v.tib,
        audioString: v.tib,
        choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji, en: x.en }))
      });
    }

    const cTargets = [...allCombos].sort(() => 0.5 - Math.random()).slice(0, 6);
    for (const c of cTargets) {
      const wrongs = allCombos.filter(x => x.read !== c.read).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'combo',
        questionText: "What does this stack read?",
        prominentTibetan: c.stack,
        answer: c.read,
        audioString: c.stack,
        choices: [c, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ label: `[${x.read}]`, value: x.read }))
      });
    }

    return qs.sort(() => 0.5 - Math.random());
  }, []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(4); // 🚨 FIXED: Hardcoded index 4
            setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
          }} 
          disabled={isBypassing}
          className="w-full mb-8 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 text-center tracking-widest shadow-lg disabled:opacity-50"
        >
          {isBypassing ? "⏳ SAVING TO DATABASE... PLEASE WAIT" : "🛠️ DEV BYPASS: INSTANTLY PASS LESSON & SAVE 🛠️"}
        </button>

        <div className="mb-8 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Lessons</Link>
          <ChevronRight size={14} />
          <span>Unit 03</span>
          <ChevronRight size={14} />
          <span className="text-ink">Superscripts</span>
        </div>

        <Card className="mb-12 grid gap-8 md:grid-cols-[1fr,auto] md:items-end p-6 md:p-10">
          <div>
            <div className="mb-3 text-eyebrow text-brand-dark">Lesson 03 · Foundations</div>
            <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl text-ink">
              The Three Superscripts
            </h1>
            <p className="mt-2 font-serif text-2xl italic text-ink-light">མགོ་ཅན་གསུམ།</p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Only three letters — ར, ལ, ས — may sit above another consonant. When they do, they
              fall silent themselves and quietly reshape the tone of the root letter beneath.
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-3 flex items-center justify-between text-eyebrow">
              <span>Lesson progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, 5)} of 5 sections</span> {/* 🚨 FIXED */}
            </div>
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden">
              <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {SUPERS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => playAudio(s.headLabel)}
                  disabled={playingItem !== null}
                  className="group flex flex-col items-center gap-1 border border-border-strong p-3 text-center transition hover:bg-surface-muted hover:border-brand"
                >
                  <div className="flex items-center gap-1">
                    <span className="font-serif text-2xl text-ink">{s.headLabel}</span>
                    {playingItem === s.headLabel ? (
                       <Loader2 size={12} className="animate-spin text-brand" />
                    ) : (
                       <Volume2 size={12} className="text-brand opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted">{s.count} stacks</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <Layers size={14} /> Stacking
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  A superscript is a small consonant written <span className="font-bold text-ink">on top of</span> a root letter. Only three consonants — <span className="font-serif text-lg">ར ལ ས</span> — are permitted.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <Volume2 size={14} /> Silence
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  The superscript itself is <span className="font-bold text-ink">not pronounced</span>. Only the root letter is spoken.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <ArrowUp size={14} /> Tone shift
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  Depending on the root's gender, the tone becomes <span className="font-bold text-emerald-700">same</span>, <span className="font-bold text-rose-700">higher</span>, or <span className="font-bold text-sky-700">lower</span>.
                </p>
              </Card>
            </div>

            <div className="mt-6 p-6 border border-border-strong bg-surface-muted">
              <div className="mb-4 flex items-center gap-2 text-eyebrow">
                <Info size={14} className="text-brand" /> Reading the tone arrows
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(Object.keys(TONE_META) as Tone[]).map((t) => {
                  const M = TONE_META[t];
                  const rule = t === "same" ? "Masculine letters keep the root's tone." : t === "down" ? "Feminine letters acquire a lower tone." : "Very-feminine / neuter letters acquire a higher tone.";
                  return (
                    <div key={t} className="flex items-start gap-3 border border-border-strong bg-surface p-4 shadow-sm">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: M.hex }}>
                        <M.Icon size={16} strokeWidth={2.5} />
                      </span>
                      <div>
                        <div className="text-sm font-bold text-ink">{M.label}</div>
                        <div className="mt-1 text-xs text-ink-muted">{rule}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </StepContainer>

          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-border-strong pb-4 gap-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[1].title}</h2>
              <Button variant="outline" onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))} className="text-[10px] uppercase tracking-widest px-3 py-1.5">
                {studyMode === "paper" ? <Moon size={14} /> : <Sun size={14} />} {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </Button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {SUPERS.map((s) => {
                const on = s.key === activeTab;
                return (
                  <button key={s.key} onClick={() => setActiveTab(s.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-colors ${on ? "border-ink bg-ink text-white" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid h-11 min-w-11 place-items-center px-1 font-serif text-xl leading-none bg-white/10" style={{ color: on ? '#fff' : s.accent.hex, backgroundColor: on ? 'rgba(255,255,255,0.1)' : `${s.accent.hex}20` }}>
                      {s.headLabel}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">{s.name}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-ink-muted" : "text-ink-light"}`}>{s.count} stacks</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <SuperPanel sup={SUPERS.find(s => s.key === activeTab)!} night={studyMode === "night"} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <VocabFilter playAudio={playAudio} playingItem={playingItem} />
          </StepContainer>

          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
             <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)} isLast>
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: The Four Subscripts." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/4" 
              onPass={() => markComplete(4)} 
            />
          </StepContainer>

        </div>
      </div>

      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/2" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== 4 && ( /* 🚨 FIXED */
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}>
              <CheckCircle2 size={18} /> Mark step complete
            </Button>
          )}

          <Link href="/dashboard/lessons/4" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
            Next: Subscripts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuperPanel({ sup, night, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className={`relative overflow-hidden border transition-colors duration-500 ${night ? "border-white/10 bg-[#0f0d0a] text-stone-100" : "border-border-strong bg-surface"}`}>
      <div className="h-1 w-full" style={{ backgroundColor: sup.accent.hex }} />
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-serif text-[4rem] leading-none" style={{ backgroundColor: night ? `${sup.accent.hex}20` : `${sup.accent.hex}15`, color: sup.accent.hex }}>{sup.head}</div>
          <div>
            <div className={`text-eyebrow mb-2 ${night ? "text-stone-400" : ""}`}>Superscript</div>
            <div className="font-serif text-3xl font-bold">{sup.title}</div>
            <div className={`mt-1 font-serif text-xl italic ${night ? "text-stone-400" : "text-ink-light"}`}>{sup.nameTib}</div>
          </div>
        </div>
        <p className={`text-[15px] leading-relaxed p-5 border ${night ? "bg-white/5 border-white/10 text-stone-300" : "bg-surface-muted border-border-strong text-ink-light"}`}>
          {sup.intro}<br /><br />
          <span className={night ? "text-white font-bold" : "text-ink font-bold"}>
            <span className="font-serif text-xl">{sup.head}</span> + {sup.rootLetters}
          </span>
        </p>
      </div>
      <div className={`grid grid-cols-3 gap-px border-b sm:grid-cols-4 md:grid-cols-6 ${night ? "border-white/10 bg-white/10" : "border-border-strong bg-border-strong"}`}>
        {sup.combos.map((c: any) => {
          const M = TONE_META[c.tone as Tone];
          return (
            <button key={c.stack} onClick={() => playAudio(c.stack)} disabled={playingItem !== null} className={`group relative flex flex-col items-center justify-center gap-3 p-6 transition-colors ${night ? "bg-[#0f0d0a] hover:bg-[#1a1712]" : "bg-surface hover:bg-surface-muted"}`}>
              <span className="font-tibetan text-[3rem] leading-normal pb-2" style={{ color: night ? '#fcd34d' : '#1c1917' }}>{c.stack}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-400" : "text-ink-light"}`}>{c.read}</span>
              <span className="inline-flex size-5 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: M.hex }} title={M.label}><M.Icon size={12} strokeWidth={3} /></span>
              {playingItem === c.stack && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
            </button>
          )
        })}
      </div>
      <div className={`p-6 md:p-8 border-b ${night ? "border-white/10 bg-[#0f0d0a]" : "border-border-strong bg-surface"}`}>
        <div className={`mb-6 text-eyebrow ${night ? "text-stone-400" : ""}`}>Spelling walkthrough</div>
        <div className="space-y-2">
          {sup.combos.map((c: any) => {
            const M = TONE_META[c.tone as Tone];
            const rootTib = c.stack.charAt(1);
            return (
              <div key={c.stack} className={`flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 ${night ? "border-white/10 bg-white/5" : "border-border-strong bg-surface shadow-sm"}`}>
                <span className="font-tibetan text-[2.5rem] leading-normal pb-2 w-12 text-center">{c.stack}</span>
                <span className={`text-xs font-bold ${night ? "text-stone-400" : "text-ink-light"}`}><span className="font-serif text-lg">{sup.head}</span> + <span className="font-serif text-lg">{rootTib || "◌"}</span> + བཏགས་</span>
                <ArrowRight size={16} className={night ? "text-stone-600" : "text-border-strong"} />
                <span className={`font-mono text-lg font-bold ${night ? "text-stone-100" : "text-ink"}`}>[{c.read}]</span>
                <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 ${night ? "bg-black/30" : M.bg} ${M.text}`} style={{ color: night ? M.hex : undefined }}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                <Button variant="outline" onClick={() => playAudio(c.stack)} disabled={playingItem !== null} className={`px-3 py-1.5 ${night ? "bg-white/10 border-white/20 hover:bg-white/20 text-amber-400" : ""}`}>
                  {playingItem === c.stack ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className={night ? "text-brand" : "text-brand-dark"} />}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`p-6 md:p-8 ${night ? "bg-black/40" : "bg-surface-muted"}`}>
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: sup.accent.hex }} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${night ? "text-stone-200" : "text-ink"}`}>Mastery check · {sup.name}</span>
        </div>
        <MiniMastery sup={sup} night={night} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function MiniMastery({ sup, night, playAudio, playingItem, playErrorBeep }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = useMemo(() => {
    const answer = sup.combos[step % sup.combos.length];
    const wrongs = sup.combos.filter((c: any) => c.read !== answer.read).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...wrongs, answer].sort(() => 0.5 - Math.random());
    return { answer, choices };
  }, [sup, step]);

  const total = Math.min(5, sup.combos.length);
  const pick = (read: string) => {
    if (picked) return;
    setPicked(read);
    if (read === question.answer.read) { setScore(s => s + 1); playAudio(question.answer.stack); } else { playErrorBeep(); }
  };

  if (step >= total) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border border-border-strong bg-surface">
        <div className={`text-[15px] font-bold ${night ? "text-stone-800" : "text-ink"}`}>Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: sup.accent.hex }}>{score}</span> / {total} on {sup.name}.</div>
        <Button variant="outline" onClick={() => { setStep(0); setScore(0); setPicked(null); }}><Shuffle size={14} /> Try again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className={night ? "text-stone-400" : "text-ink-light"}>Question {step + 1} of {total}</span>
        <span style={{ color: sup.accent.hex }}>Score {score}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className={`text-[15px] font-bold ${night ? "text-stone-300" : "text-ink-light"}`}>Which stack reads</span>
        <span className={`font-mono text-2xl font-bold border px-3 py-1 ${night ? "bg-white/10 border-white/20 text-white" : "bg-surface border-border-strong text-ink"}`}>[{question.answer.read}]</span>
        <Button variant="outline" onClick={() => playAudio(question.answer.stack)} disabled={playingItem !== null} className={`px-3 py-2 ${night ? "bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30 text-amber-400" : ""}`}>
          {playingItem === question.answer.stack ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={night ? "" : "text-brand"} />}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.choices.map((c: any) => {
          const right = picked && c.read === question.answer.read;
          const wrong = picked === c.read && c.read !== question.answer.read;
          return (
            <button key={c.stack} disabled={!!picked} onClick={() => pick(c.read)} className={`flex aspect-square items-center justify-center border-2 font-tibetan text-[3.5rem] leading-normal pb-2 transition-all ${right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700" : night ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white" : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light text-ink hover:shadow-md"}`}>
              {c.stack}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border shadow-sm ${night ? "bg-white/5 border-white/10" : "bg-surface border-border-strong"}`}>
          <span className={`text-sm font-bold ${picked === question.answer.read ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === question.answer.read ? `Correct — ${question.answer.stack} reads [${question.answer.read}].` : `Answer: ${question.answer.stack} reads [${question.answer.read}].`}
          </span>
          <Button variant="primary" onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto">Next <ChevronRight size={16} /></Button>
        </div>
      )}
    </div>
  );
}

function VocabFilter({ playAudio, playingItem }: any) {
  const [filter, setFilter] = useState<SuperKey | "all">("all");
  const items = filter === "all" ? VOCAB : VOCAB.filter((v) => v.sup === filter);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {[{ key: "all", label: "All", count: VOCAB.length, hex: undefined }, ...SUPERS.map(s => ({ key: s.key, label: s.name, count: VOCAB.filter(v => v.sup === s.key).length, hex: s.accent.hex }))].map((c) => {
          const active = filter === c.key;
          return (
            <button key={c.key} onClick={() => setFilter(c.key as any)} className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${active ? "border-ink bg-ink text-white shadow-sm" : "border-border-strong bg-surface text-ink-light hover:border-ink-muted hover:text-ink"}`}>
              {c.hex && <span className="size-2.5 rounded-full" style={{ backgroundColor: c.hex }} />}
              {c.label} · {c.count}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((v) => {
          const s = SUPERS.find((x) => x.key === v.sup)!;
          return (
            <button key={v.tib + v.translit} onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="group relative flex flex-col items-start gap-4 border border-border-strong bg-surface p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: s.accent.hex }} />
              <div className="flex w-full items-start justify-between">
                <span className="text-3xl">{v.emoji}</span>
                <span className="inline-grid size-8 place-items-center bg-surface-muted border border-border-strong text-brand transition-colors group-hover:bg-brand-light group-hover:border-amber-200">
                  {playingItem === v.tib ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </span>
              </div>
              <div className="w-full border-b border-border-strong pb-3">
                <div className="text-tibetan-card mb-1">{v.tib}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{v.translit}</div>
              </div>
              <div className="text-sm font-bold text-ink-light">{v.en}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}