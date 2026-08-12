
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowRight, ArrowUp, ArrowDown,
  Info, Layers, CheckCircle2, Moon, Sun, BookOpen, Anchor, Loader2, Shuffle
} from "lucide-react";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- Data ---
import { SUBS, VOCAB, TRIPLE_STACKS, TRIPLE_ACCENT, STEPS, TONE_META, type SubKey, type Tone, type VocabGroup } from "@/app/data/lesson4";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

export default function SubscriptsLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(6);

  const [activeTab, setActiveTab] = useState<SubKey>("ya");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  
  const [isBypassing, setIsBypassing] = useState(false);

  const practiceGroups = useMemo(() => [
    {
      name: "Stacks",
      items: SUBS.flatMap(s => s.combos.map(c => ({
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
    const regularCombos = SUBS.flatMap(s => s.combos);
    const qs = [];
    
    const vTargets = [...VOCAB].sort(() => 0.5 - Math.random()).slice(0, 4);
    for (const v of vTargets) {
      const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'vocab',
        questionText: `What is the Tibetan word for "${v.en}"?`,
        answer: v.tib,
        audioString: v.tib,
        choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji }))
      });
    }

    const cTargets = [...regularCombos].sort(() => 0.5 - Math.random()).slice(0, 4);
    for (const c of cTargets) {
      const wrongs = regularCombos.filter(x => x.read !== c.read).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'combo',
        questionText: "What does this stack read?",
        prominentTibetan: c.stack,
        answer: c.read,
        audioString: c.stack,
        choices: [c, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ label: `[${x.read}]`, value: x.read }))
      });
    }

    const tTargets = [...TRIPLE_STACKS].sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const t of tTargets) {
      const wrongs = TRIPLE_STACKS.filter(x => x.read !== t.read).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'combo',
        questionText: "What does this triple stack read?",
        prominentTibetan: t.stack,
        answer: t.read,
        audioString: t.stack,
        choices: [t, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ label: `[${x.read}]`, value: x.read }))
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
            await markComplete(5);
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
          <span>Unit 04</span>
          <ChevronRight size={14} />
          <span className="text-ink">Subscripts</span>
        </div>

        <Card className="mb-12 grid gap-8 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <div className="mb-3 text-eyebrow text-brand-dark">Lesson 04 · Foundations</div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight tracking-tight">
              The Four Subscripts
            </h1>
            <p className="mt-2 font-tibetan text-3xl text-ink-light">འདོགས་ཅན་བཞི།</p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Four consonants — <span className="font-serif text-xl">ཡ ར ལ ཝ</span> — may tuck beneath a root letter
              as a small subjoined mark. Each subscript governs a different family of stacks and its
              own set of rules: some transform the pronunciation entirely, some only shift the tone,
              and one — <em>Wa-zur</em> — is completely silent, existing solely to distinguish
              words on the page.
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-3 flex items-center justify-between text-eyebrow">
              <span>Lesson progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, 6)} of 6 sections</span>
            </div>
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden">
              <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-6 grid grid-cols-4 gap-2 text-center">
              {SUBS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => playAudio(s.headLabel)}
                  disabled={playingItem !== null}
                  className="group flex flex-col items-center gap-1 border border-border-strong p-2 text-center transition hover:bg-surface-muted hover:border-brand"
                >
                  <div className="flex items-center gap-1">
                    <span className="font-serif text-2xl text-ink">{s.headLarge}</span>
                    {playingItem === s.headLabel ? (
                       <Loader2 size={10} className="animate-spin text-brand" />
                    ) : (
                       <Volume2 size={10} className="text-brand opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted">{s.count}</div>
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
                  <Anchor size={14} /> Subjoining
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  A subscript is a small consonant written <span className="font-bold text-ink">beneath</span> a root letter. Only four consonants — <span className="font-serif text-lg">ཡ ར ལ ཝ</span> — take this position.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <Volume2 size={14} /> Sound change
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  With Ya-tak and Ra-tak, the whole syllable can be pronounced <span className="font-bold text-ink">differently</span> from either letter alone — e.g. <span className="font-serif text-lg">པྱ</span> reads <span className="font-mono font-bold">[cha]</span>.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <ArrowUp size={14} /> Tone shift
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  The tone becomes <span className="font-bold text-emerald-700">same</span>, <span className="font-bold text-rose-700">higher</span>, or <span className="font-bold text-sky-700">lower</span> — except with <em>Wa-zur</em>, which leaves both sound and tone unchanged.
                </p>
              </Card>
            </div>

           <div className="mt-6 border border-border-strong bg-surface overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border-strong text-center">
                {SUBS.map((s) => (
                  <button key={s.key} onClick={() => playAudio(s.headLabel)} disabled={playingItem !== null} className="group flex flex-col items-center gap-2 p-6 transition hover:bg-surface-muted">
                    <span className="h-1 w-10" style={{ backgroundColor: s.accent.hex }} />
                    <span className="mt-2 font-serif leading-none text-ink" style={{ fontSize: "3rem" }}>◌{s.mark}</span>
                    <span className="text-sm font-bold text-ink">{s.name}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-ink-light items-center inline-flex">{s.count} stacks · <span className="font-serif text-lg ml-1.5">{s.headLarge}་བཏགས་</span></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 p-6 border border-border-strong bg-surface-muted">
              <div className="mb-4 flex items-center gap-2 text-eyebrow">
                <Info size={14} className="text-brand" /> Reading the tone arrows
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(Object.keys(TONE_META) as Tone[]).map((t) => {
                  const M = TONE_META[t];
                  const rule = t === "same" ? "No change — read as the root, same tone." : t === "down" ? "Feminine roots acquire a lower tone." : "Very-feminine / neuter roots acquire a higher tone.";
                  return (
                    <div key={t} className="flex items-start gap-3 border border-border-strong bg-surface p-4 shadow-sm">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: M.hex }}><M.Icon size={16} strokeWidth={2.5} /></span>
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
              {SUBS.map((s) => {
                const on = s.key === activeTab;
                return (
                  <button key={s.key} onClick={() => setActiveTab(s.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all ${on ? "border-brand bg-brand text-ink shadow-sm" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid size-9 place-items-center font-tibetan text-2xl leading-none" style={{ color: on ? '#1c1917' : s.accent.hex }}>{s.headLarge}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">{s.name}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-ink-light mix-blend-multiply" : "text-ink-light"}`}>{s.count} stacks</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <SubPanel sub={SUBS.find(s => s.key === activeTab)!} night={studyMode === "night"} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[2].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2 py-1 border border-border-strong">{TRIPLE_STACKS.length} triple stacks</span>
            </div>
            
            <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-light">
              Once superscripts and subscripts are both familiar, they combine on a single root letter. The pronunciation follows the same tone rules — the superscript re-tunes, the subscript re-shapes.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {TRIPLE_STACKS.map((t) => {
                const M = TONE_META[t.tone];
                return (
                  <button key={t.stack + t.parts} onClick={() => playAudio(t.stack)} disabled={playingItem !== null} className="group flex flex-col items-center gap-3 border border-border-strong bg-surface p-5 transition hover:-translate-y-1 hover:shadow-md relative">
                    <span className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: TRIPLE_ACCENT }} />
                    <span className="font-tibetan leading-none mt-2 text-ink" style={{ fontSize: "2.5rem" }}>{t.stack}</span>
                    <span className="text-[10px] uppercase tracking-widest text-ink-muted font-serif font-bold">{t.parts}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-ink">[{t.read}]</span>
                      <span className="inline-grid size-5 place-items-center rounded-full text-white" style={{ backgroundColor: M.hex }} title={M.label}><M.Icon size={12} strokeWidth={3} /></span>
                    </div>
                    {playingItem === t.stack && <Loader2 size={16} className="absolute top-2 right-2 animate-spin text-brand" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border border-border-strong bg-surface p-6 md:p-8">
              <div className="text-eyebrow mb-6">Spelling walkthrough</div>
              <div className="space-y-2">
                {TRIPLE_STACKS.map((t) => {
                  const M = TONE_META[t.tone];
                  return (
                    <div key={"spell-" + t.stack + t.parts} className="flex flex-wrap items-center gap-x-6 gap-y-3 border border-border-strong bg-surface px-5 py-4 shadow-sm">
                      <span className="font-tibetan text-[2.5rem] leading-none w-12 text-center text-ink">{t.stack}</span>
                      <span className="text-xs font-bold font-serif text-ink-light">{t.parts}</span>
                      <ArrowRight size={16} className="text-border-strong" />
                      <span className="font-mono text-lg font-bold text-ink">[{t.read}]</span>
                      <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 ${M.bg} ${M.text}`}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                      <Button variant="outline" onClick={() => playAudio(t.stack)} disabled={playingItem !== null} className="px-3 py-2">
                        {playingItem === t.stack ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </StepContainer>

          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[3].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2 py-1 border border-border-strong">{VOCAB.length} words</span>
            </div>
            <VocabFilter playAudio={playAudio} playingItem={playingItem} />
          </StepContainer>

          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-3">{STEPS[4].title}</h2>
              <p className="max-w-3xl text-[15px] text-ink-light leading-relaxed">
                Each subscript has its own <span className="font-bold text-ink">mastery check</span> within its panel above. Below is a <span className="font-bold text-ink">cumulative review</span> that mixes stacks from all four families.
              </p>
            </div>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)} isLast>
            <QuizModule 
              title="Cumulative Exercise" 
              intro="Test your recognition of all subscript variations combined. Score 80% or higher to unlock the next unit." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/5" 
              onPass={() => markComplete(5)}
            />
          </StepContainer>

        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/3" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== 5 && ( 
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}>
              <CheckCircle2 size={18} /> Mark step complete
            </Button>
          )}

          <Link href="/dashboard/lessons/5" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
            Next: Prefixes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SubPanel({ sub, night, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className={`relative overflow-hidden border transition-colors duration-500 ${night ? "border-white/10 bg-[#0f0d0a] text-stone-100" : "border-border-strong bg-surface"}`}>
      <div className="h-1 w-full" style={{ backgroundColor: sub.accent.hex }} />
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-tibetan text-[4rem] leading-none" style={{ backgroundColor: night ? `${sub.accent.hex}20` : `${sub.accent.hex}15`, color: sub.accent.hex }}>{sub.headLarge}</div>
          <div>
            <div className={`text-eyebrow mb-2 ${night ? "text-stone-400" : ""}`}>Subscript</div>
            <div className="font-serif text-3xl font-bold">{sub.title}</div>
            <div className={`mt-1 font-tibetan text-2xl ${night ? "text-stone-400" : "text-ink-light"}`}>{sub.nameTib}</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className={`text-[15px] leading-relaxed p-5 border flex flex-col gap-4 ${night ? "bg-white/5 border-white/10 text-stone-300" : "bg-surface-muted border-border-strong text-ink-light"}`}>
            <p>{sub.intro}</p>
            <div className={`flex items-center flex-wrap gap-4 pt-2 ${night ? "text-white" : "text-ink"}`}>
              <span className="font-tibetan text-3xl sm:text-4xl leading-relaxed tracking-wider">{sub.rootLetters}</span>
              <span className="text-xl font-sans opacity-40">+</span>
              <span className="font-tibetan text-3xl sm:text-4xl">{sub.headLarge}</span>
            </div>
          </div>
          <div className={`flex items-start gap-3 border-l-2 px-4 py-3 text-sm ${night ? "bg-white/5 text-stone-300" : sub.accent.bg + " " + sub.accent.text}`} style={{ borderColor: sub.accent.hex }}>
            <Info className="mt-0.5 size-4 shrink-0" style={{ color: sub.accent.hex }} />
            <span className="font-medium leading-relaxed">{sub.usage}</span>
          </div>
        </div>
      </div>
      <div className={`grid grid-cols-3 gap-px border-b sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 ${night ? "border-white/10 bg-white/10" : "border-border-strong bg-border-strong"}`}>
        {sub.combos.map((c: any) => {
          const M = TONE_META[c.tone as Tone];
          return (
            <button key={c.stack} onClick={() => playAudio(c.stack)} disabled={playingItem !== null} className={`group relative flex flex-col items-center justify-center gap-3 p-6 transition-colors ${night ? "bg-[#0f0d0a] hover:bg-[#1a1712]" : "bg-surface hover:bg-surface-muted"}`}>
              <span className="absolute left-0 top-0 h-0.5 w-full" style={{ backgroundColor: sub.accent.hex }} />
              <span className="font-tibetan text-[3rem] leading-none" style={{ color: night ? '#fcd34d' : '#1c1917' }}>{c.stack}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-400" : "text-ink-muted"}`}>{c.read}</span>
              <span className="inline-flex size-5 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: M.hex }} title={M.label}><M.Icon size={12} strokeWidth={3} /></span>
              {playingItem === c.stack && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
            </button>
          )
        })}
      </div>
      <div className={`p-6 md:p-8 border-b ${night ? "border-white/10 bg-[#0f0d0a]" : "border-border-strong bg-surface"}`}>
        <div className={`text-eyebrow mb-6 ${night ? "text-stone-400" : ""}`}>Spelling walkthrough</div>
        <div className="space-y-2">
          {sub.combos.map((c: any) => {
            const M = TONE_META[c.tone as Tone];
            return (
              <div key={c.stack} className={`flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 ${night ? "border-white/10 bg-white/5" : "border-border-strong bg-surface shadow-sm"}`}>
                <span className="font-tibetan text-[2.5rem] leading-none w-12 text-center">{c.stack}</span>
                <span className={`flex items-center gap-2 md:gap-3 ${night ? "text-stone-400" : "text-ink-light"}`}>
                  <span className="font-tibetan text-2xl sm:text-3xl">{c.root}</span>
                  <span className="text-lg font-sans opacity-40">+</span>
                  <span className="font-tibetan text-2xl sm:text-3xl">{sub.headLarge}</span>
                  <span className="text-lg font-sans opacity-40">+</span>
                  <span className="font-tibetan text-2xl sm:text-3xl">བཏགས་</span>
                </span>
                <ArrowRight size={16} className={night ? "text-stone-600" : "text-border-strong"} />
                <span className={`font-mono text-lg font-bold ${night ? "text-stone-100" : "text-ink"}`}>[{c.read}]</span>
                <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 ${night ? "bg-black/30" : M.bg} ${M.text}`} style={{ color: night ? M.hex : undefined }}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                <Button variant="outline" onClick={() => playAudio(c.stack)} disabled={playingItem !== null} className={`px-3 py-1.5 ${night ? "bg-white/10 border-white/20 hover:bg-white/20 text-amber-400" : ""}`}>
                  {playingItem === c.stack ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={night ? "text-brand" : "text-brand-dark"} />}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`p-6 md:p-8 ${night ? "bg-black/40" : "bg-surface-muted"}`}>
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: sub.accent.hex }} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${night ? "text-stone-200" : "text-ink"}`}>Mastery check · {sub.name}</span>
        </div>
        <MiniMastery key={sub.key} sub={sub} night={night} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function MiniMastery({ sub, night, playAudio, playingItem, playErrorBeep }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = useMemo(() => {
    const answer = sub.combos[step % sub.combos.length];
    const wrongs = sub.combos.filter((c: any) => c.stack !== answer.stack).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...wrongs, answer].sort(() => 0.5 - Math.random());
    return { answer, choices };
  }, [sub, step]);

  const total = Math.min(5, sub.combos.length);
  const pick = (stack: string) => {
    if (picked) return;
    setPicked(stack);
    if (stack === question.answer.stack) { setScore(s => s + 1); playAudio(question.answer.stack); } else { playErrorBeep(); }
  };

  if (step >= total) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border border-border-strong bg-surface">
        <div className={`text-[15px] font-bold ${night ? "text-stone-800" : "text-ink"}`}>Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: sub.accent.hex }}>{score}</span> / {total} on {sub.name}.</div>
        <Button variant="outline" onClick={() => { setStep(0); setScore(0); setPicked(null); }}><Shuffle size={14} /> Try again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className={night ? "text-stone-400" : "text-ink-muted"}>Question {step + 1} of {total}</span>
        <span style={{ color: sub.accent.hex }}>Score {score}</span>
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
          const right = picked && c.stack === question.answer.stack;
          const wrong = picked === c.stack && c.stack !== question.answer.stack;
          return (
            <button key={c.stack} disabled={!!picked} onClick={() => pick(c.stack)} className={`flex aspect-square items-center justify-center border-2 font-tibetan text-[3.5rem] leading-normal pb-2 transition-all ${right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700" : night ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white" : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light text-ink hover:shadow-md"}`}>
              {c.stack}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border shadow-sm ${night ? "bg-white/5 border-white/10" : "bg-surface border-border-strong"}`}>
          <div className={`text-sm font-bold flex items-center flex-wrap gap-2 ${picked === question.answer.stack ? "text-emerald-600" : "text-rose-600"}`}>
            <span>{picked === question.answer.stack ? "Correct —" : "Answer:"}</span>
            <span className="font-tibetan text-3xl leading-none pt-1">{question.answer.stack}</span>
            <span>reads [{question.answer.read}].</span>
          </div>
          <Button variant="primary" onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto">Next <ChevronRight size={16} /></Button>
        </div>
      )}
    </div>
  );
}

function accentFor(g: VocabGroup): string {
  if (g === "triple") return TRIPLE_ACCENT;
  return SUBS.find((s) => s.key === g)!.accent.hex;
}

function VocabFilter({ playAudio, playingItem }: any) {
  const [filter, setFilter] = useState<VocabGroup | "all">("all");
  const items = filter === "all" ? VOCAB : VOCAB.filter((v) => v.sub === filter);

  const chips: { key: VocabGroup | "all"; label: string; hex?: string }[] = [
    { key: "all", label: `All · ${VOCAB.length} words` },
    ...SUBS.map((s) => ({ key: s.key as VocabGroup, label: `${s.name} · ${VOCAB.filter((v) => v.sub === s.key).length}`, hex: s.accent.hex })),
    { key: "triple" as VocabGroup, label: `Triple stacks · ${VOCAB.filter((v) => v.sub === "triple").length}`, hex: TRIPLE_ACCENT },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = filter === c.key;
          return (
            <button key={c.key} onClick={() => setFilter(c.key as any)} className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${active ? "border-ink bg-ink text-white shadow-sm" : "border-border-strong bg-surface text-ink-muted hover:border-ink-muted hover:text-ink"}`}>
              {c.hex && <span className="size-2.5 rounded-full" style={{ backgroundColor: c.hex }} />}
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((v) => {
          const hex = accentFor(v.sub);
          return (
            <button key={v.tib + v.translit} onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="group relative flex flex-col items-start gap-4 border border-border-strong bg-surface p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: hex }} />
              <div className="flex w-full items-start justify-between">
                <span className="text-3xl">{v.emoji}</span>
                <span className="inline-grid size-8 place-items-center bg-surface-muted border border-border-strong text-brand transition-colors group-hover:bg-brand-light group-hover:border-amber-200">
                  {playingItem === v.tib ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </span>
              </div>
              <div className="w-full border-b border-border-strong pb-3">
                <div className="text-tibetan-card mb-1">{v.tib}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">[{v.translit}]</div>
              </div>
              <div className="text-sm font-bold text-ink-light">{v.en}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}