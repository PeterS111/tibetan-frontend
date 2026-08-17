"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowRight, ArrowUp, ArrowDown,
  Info, Layers, CheckCircle2, Moon, Sun, Loader2, X
} from "lucide-react";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- Data ---
import { SUPERS, VOCAB, STEPS, TONE_META, type SuperKey, type Tone } from "@/app/data/lesson3";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

export default function SuperscriptsLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  
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
      name: "Spelling Audio",
      items: SUPERS.flatMap(s => s.combos.map(c => ({
        id: `s-${c.stack}`, tibetan: c.stack, reading: `Spell ${c.stack}`, english: `Listen to spelling`, audioTarget: `${c.stack} spelling`
      })))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

 const vocabQuestions = useMemo(() => {
    const qs = [];
    for (const v of VOCAB) {
      const isAudioType = Math.random() > 0.5;
      const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        isAudioType,
        type: isAudioType ? 'base' : 'vocab',
        answer: v.tib,
        audioString: v.tib,
        answerObj: v,
        choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji, en: x.en }))
      });
    }
    return qs.sort(() => 0.5 - Math.random());
  }, []);

  const quizQuestions = useMemo(() => {
    const allCombos = SUPERS.flatMap(s => s.combos);
    const qs = [];
    
    const shuffledVocab = [...VOCAB].sort(() => 0.5 - Math.random());
    const shuffledCombos = [...allCombos].sort(() => 0.5 - Math.random());

    // 1. Vocab Matching (3 questions)
    const vocabMatch = shuffledVocab.slice(0, 3);
    for (const v of vocabMatch) {
      const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'vocab',
        questionText: `What is the Tibetan word for "${v.en}"?`,
        answer: v.tib,
        audioString: v.tib,
        choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji, en: x.en }))
      });
    }

    // 2. Vocab Listening (2 questions)
    const vocabListen = shuffledVocab.slice(3, 5);
    for (const v of vocabListen) {
      const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        isAudioType: true,
        type: 'base',
        answer: v.tib,
        audioString: v.tib,
        choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji, en: x.en }))
      });
    }

    // 3. Stack Spelling/Reading (2 questions)
    const comboMatch = shuffledCombos.slice(0, 2);
    for (const c of comboMatch) {
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

    // 4. Stack Spelling Audio (3 questions)
    const comboListen = shuffledCombos.slice(2, 5);
    for (const c of comboListen) {
      const wrongs = allCombos.filter(x => x.stack !== c.stack).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        isAudioType: true,
        type: 'base',
        answer: c.stack,
        audioString: `${c.stack} spelling`,
        choices: [c, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.stack, value: x.stack }))
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
            await markComplete(4); 
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
            <p className="mt-2 font-tibetan text-3xl text-ink-light">མགོ་ཅན་གསུམ།</p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Only three letters — ར, ལ, ས — may sit above another consonant. When they do, they
              fall silent themselves and quietly reshape the tone of the root letter beneath.
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-3 flex items-center justify-between text-eyebrow">
              <span>Lesson progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, 5)} of 5 sections</span>
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
                    <span className="font-tibetan text-2xl text-ink">{s.headLabel}</span>
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
                  A superscript is a small consonant written <span className="font-bold text-ink">on top of</span> a root letter. Only three consonants — <span className="font-tibetan text-2xl">ར ལ ས</span> — are permitted.
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
                  <button key={s.key} onClick={() => setActiveTab(s.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all ${on ? "border-brand bg-brand text-ink shadow-sm" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid h-11 min-w-11 place-items-center px-1 font-tibetan text-2xl leading-none" style={{ color: on ? '#1c1917' : s.accent.hex }}>
                      {s.headLabel}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">{s.name}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-ink-light mix-blend-multiply" : "text-ink-light"}`}>{s.count} stacks</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <SuperPanel sup={SUPERS.find(s => s.key === activeTab)!} night={studyMode === "night"} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-10">
              <VocabFilter playAudio={playAudio} playingItem={playingItem} />
            </div>
            <QuizModule 
              title="Vocabulary Mastery" 
              intro="Check your memory of the new superscript words before moving on. This check tests all vocabulary words." 
              questions={vocabQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
            />
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
          
          {expandedStep !== 4 && (
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

/* ------------------------------------------------------------------ */
/* Subcomponents                                                      */
/* ------------------------------------------------------------------ */

function SuperPanel({ sup, night, playAudio, playingItem, playErrorBeep }: any) {
  const masteryQuestions = useMemo(() => {
    const qs: any[] = [];
    [...sup.combos].sort(() => 0.5 - Math.random()).forEach((c: any, index: number) => {
      // Alternate question types to add variety and consistency with previous lessons
      if (index % 2 === 0) {
        // Recognition: What does it read?
        const wrongs = sup.combos.filter((x: any) => x.read !== c.read).sort(() => 0.5 - Math.random()).slice(0, 3);
        qs.push({
          type: 'combo',
          questionText: "What does this stack read?",
          prominentTibetan: c.stack,
          answer: c.read,
          audioString: c.stack,
          choices: [c, ...wrongs].sort(() => 0.5 - Math.random()).map((x: any) => ({ label: `[${x.read}]`, value: x.read }))
        });
      } else {
        // Audio: Listen and select the spelling math
        const wrongs = sup.combos.filter((x: any) => x.stack !== c.stack).sort(() => 0.5 - Math.random()).slice(0, 3);
        qs.push({
          isAudioType: true,
          type: 'base',
          answer: c.stack,
          audioString: `${c.stack} spelling`,
          choices: [c, ...wrongs].sort(() => 0.5 - Math.random()).map((x: any) => ({ tib: x.stack, value: x.stack }))
        });
      }
    });
    return qs.sort(() => 0.5 - Math.random());
  }, [sup]);

  return (
    <div className={`relative overflow-hidden border transition-colors duration-500 ${night ? "border-white/10 bg-[#0f0d0a] text-stone-100" : "border-border-strong bg-surface"}`}>
      <div className="h-1 w-full" style={{ backgroundColor: sup.accent.hex }} />
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-tibetan text-[4.5rem] leading-none pt-2" style={{ backgroundColor: night ? `${sup.accent.hex}20` : `${sup.accent.hex}15`, color: sup.accent.hex }}>{sup.head}</div>
          <div>
            <div className={`text-eyebrow mb-2 ${night ? "text-stone-400" : ""}`}>Superscript</div>
            <div className="font-serif text-3xl font-bold">{sup.title}</div>
            <div className={`mt-1 font-tibetan text-2xl ${night ? "text-stone-400" : "text-ink-light"}`}>{sup.nameTib}</div>
          </div>
        </div>
        
		<div className={`text-[15px] leading-relaxed p-5 border flex flex-col gap-4 ${night ? "bg-white/5 border-white/10 text-stone-300" : "bg-surface-muted border-border-strong text-ink-light"}`}>
          <p>{sup.intro}</p>
          <div className={`flex items-center flex-wrap gap-4 pt-2 ${night ? "text-white" : "text-ink"}`}>
            <span className="font-tibetan text-3xl sm:text-4xl">{sup.head}</span>
            <span className="text-xl font-sans opacity-40">+</span>
            <span className="font-tibetan text-3xl sm:text-4xl leading-relaxed tracking-wider">{sup.rootLetters}</span>
          </div>
        </div>
		
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
            // Convert the subjoined mark back to a standalone base letter
            // by subtracting 80 (0x50) from its Tibetan Unicode value.
            const rootTib = c.stack.length > 1 ? String.fromCharCode(c.stack.charCodeAt(1) - 0x50) : "◌";
            const spellKey = `${c.stack} spelling`;
            return (
              <div key={c.stack} className={`flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 ${night ? "border-white/10 bg-white/5" : "border-border-strong bg-surface shadow-sm"}`}>
                <span className="font-tibetan text-[2.5rem] leading-normal pb-2 w-12 text-center">{c.stack}</span>
                <span className={`flex items-center gap-2 md:gap-3 ${night ? "text-stone-400" : "text-ink-light"}`}>
                  <span className="font-tibetan text-2xl sm:text-3xl">{sup.head}</span>
                  <span className="text-lg font-sans opacity-40">+</span>
                  
                  {/* Safely render the standalone letter, ignoring CSS/circles entirely */}
                  <span className="font-tibetan text-2xl sm:text-3xl">{rootTib}</span>

                  <span className="text-lg font-sans opacity-40">+</span>
                  <span className="font-tibetan text-2xl sm:text-3xl">བཏགས་</span>
                </span>
		
                <ArrowRight size={16} className={night ? "text-stone-600" : "text-border-strong"} />
                <div className="flex items-center gap-2">
                  <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: sup.accent.hex }}>{c.stack}</span>
                  <span className={`font-mono text-lg font-bold ${night ? "text-stone-100" : "text-ink"}`}>[{c.read}]</span>
                </div>
                <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 ${night ? "bg-black/30" : M.bg} ${M.text}`} style={{ color: night ? M.hex : undefined }}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                <Button variant="outline" onClick={() => playAudio(spellKey)} disabled={playingItem !== null} className={`px-3 py-1.5 ${night ? "bg-white/10 border-white/20 hover:bg-white/20 text-amber-400" : ""}`}>
                  {playingItem === spellKey ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className={night ? "text-brand" : "text-brand-dark"} />}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`p-6 md:p-8 ${night ? "bg-[#0f0d0a]" : "bg-surface-muted"}`}>
        <QuizModule 
          title={`Mastery check · ${sup.name}`}
          intro={`Test your knowledge of all ${sup.count} stacks for ${sup.nameTib}`}
          questions={masteryQuestions}
          playAudio={playAudio}
          playingItem={playingItem}
          playErrorBeep={playErrorBeep}
        />
      </div>
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