// app/components/lesson/4/WebLesson4.tsx
"use client";

import { SpellingFormula, TibetanPart } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowRight, ArrowUp,
  Info, CheckCircle2, Anchor, Loader2, Sparkles, Layers
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { SUBS, VOCAB, TRIPLE_STACKS, TRIPLE_ACCENT, TONE_META, generateVocabQuiz, generateFinalQuiz, generateSubscriptQuiz, generateTripleQuiz, SubKey, Tone } from "@/app/data/lesson4";

import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";

const SUB_IMAGE_MAP: Record<SubKey, string> = {
  ya: "/image_yatak.png",
  ra: "/image_ratak.png",
  la: "/image latak.png",
  wa: "/image_wazur.png",
};

const WEB_STEPS = [
  { 
    id: "syllabus", 
    eyebrow: "Introduction", 
    title: "Welcome to the four subscripts", 
    description: "A short orientation before you meet the four subjoined letters." 
  },
  { 
    id: "intro", 
    eyebrow: "Step 02", 
    title: "What is a subscript?", 
    tibetanTitle: "འདོགས་ཅན།",
    description: "The four subjoined letters and how they attach." 
  },
  { 
    id: "family", 
    eyebrow: "Step 03", 
    title: "Meet the four subscripts", 
    tibetanTitle: "འདོགས་ཅན་བཞི།",
    description: "Study each subscript with its root combinations." 
  },
  { 
    id: "super-sub", 
    eyebrow: "Step 04", 
    title: "Roots with a superscript and subscript", 
    tibetanTitle: "བརྩེགས་མའི་ཡི་གེ།",
    description: "Three-letter stacks combining both." 
  },
  { 
    id: "vocab", 
    eyebrow: "Step 05", 
    title: "Vocabulary built from subscripts", 
    tibetanTitle: "ཚིག་གསར།",
    description: "Real words using subjoined letters." 
  },
  { 
    id: "practice", 
    eyebrow: "Step 06", 
    title: "Practice & exercises", 
    tibetanTitle: "སྦྱོང་ཚན།",
    description: "Flashcards, quiz, and matching drills." 
  },
  { 
    id: "cumulative", 
    eyebrow: "Final step", 
    title: "Final Test", 
    tibetanTitle: "རྒྱུགས་སྤྲོད།",
    description: "Take the final test to unlock the next lesson." 
  }
];

export function WebLesson4() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { completed, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(WEB_STEPS.length);

  const [activeTab, setActiveTab] = useState<SubKey>("ya");
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

  const vocabQuestions = useMemo(() => generateVocabQuiz(), []);
  const quizQuestions = useMemo(() => generateFinalQuiz(), []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(WEB_STEPS.length - 1);
            setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
          }} 
          disabled={isBypassing}
          className="w-full mb-8 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 text-center tracking-widest shadow-lg disabled:opacity-50 rounded-2xl"
        >
          {isBypassing ? "⏳ SAVING TO DATABASE... PLEASE WAIT" : "🛠️ DEV BYPASS: INSTANTLY PASS LESSON & SAVE 🛠️"}
        </button>

        <div className="mb-6 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Steps</Link>
          <ChevronRight className="size-3" />
          <span>Unit 04</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">Subscripts</span>
        </div>

        <Card className="mb-8 p-0 overflow-hidden shadow-sm border border-border-subtle">
          
		  
		  <div className="w-full h-72 sm:h-96 md:h-[400px] bg-surface-muted overflow-hidden relative">
            <img 
              src="/04_subscripts.jpg" 
              alt="The Four Subscripts Hero Scene" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="p-6 md:p-10 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <div className="mb-2 text-eyebrow text-brand-dark">Lesson 04 · Foundations</div>
              <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">
                The Four Subscripts
              </h1>
              <p className="mt-2 font-tibetan text-3xl text-ink-light">འདོགས་ཅན་བཞི།</p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
                Four consonants — <span className="font-tibetan text-2xl text-ink">ཡ ར ལ ཝ</span> — may tuck beneath a root letter
                as a small subjoined mark. Each subscript governs a different family of stacks and its
                own set of rules: some transform the pronunciation entirely, some only shift the tone,
                and one — <em>Wa-zur</em> — is completely silent, existing solely to distinguish
                words on the page.
              </p>
            </div>
            <div className="w-full md:w-[27rem]">
              <div className="mb-2 flex items-center justify-between text-eyebrow">
                <span>Lesson progress</span>
                <span className="text-brand-dark">{Math.min(completed.size, WEB_STEPS.length)} of {WEB_STEPS.length} sections</span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle overflow-hidden rounded-full">
                <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {SUBS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => playAudio(s.headLabel)}
                    disabled={playingItem !== null}
                    className="group flex flex-col items-center justify-center gap-1 border border-border-strong px-3 py-2.5 bg-surface text-center transition hover:bg-surface-muted hover:border-brand rounded-xl"
                  >
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      <span className="font-tibetan text-lg text-ink leading-none pt-1 whitespace-nowrap">{s.headLabel}</span>
                      {playingItem === s.headLabel ? (
                         <Loader2 size={11} className="animate-spin text-brand shrink-0" />
                      ) : (
                         <Volume2 size={11} className="text-brand opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                      )}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold whitespace-nowrap">{s.count} STACKS</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">

          {/* Step 0: Orientation / What You Will Learn */}
          <StepContainer index={0} step={WEB_STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-8 md:grid-cols-[1.15fr,1fr] items-start">
              <div className="space-y-6">
                <p className="text-[15px] leading-relaxed text-ink-light">
                  In this lesson you will master the <strong className="text-ink">four subjoined consonants</strong> that attach beneath a root letter: <strong className="text-ink">Ya-tak</strong>, <strong className="text-ink">Ra-tak</strong>, <strong className="text-ink">La-tak</strong>, and <strong className="text-ink">Wa-zur</strong>. You'll also learn how superscripts and subscripts combine on a single root to form three-letter stacks.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <Sparkles size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Tap any stack in the grid to hear its spoken pronunciation, or click Spelling Audio to hear the full traditional formula.
                    </p>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <Layers size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Explore each subscript family in its own tab, then study the 14 triple stacks that combine both a superscript and a subscript.
                    </p>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <CheckCircle2 size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Pay special attention to the Lhasa pronunciation shifts in Ya-tak, Ra-tak, and La-tak.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border-strong shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-5">
                  What you will learn
                </div>
                <div className="space-y-3">
                  {[
                    "What is a subscript?",
                    "Meet the four subscripts",
                    "Roots with a superscript and subscript",
                    "Vocabulary built from subscripts",
                    "Practice & exercises",
                    "Final Test",
                  ].map((title, idx) => (
                    <div key={title} className={`flex items-center gap-3.5 ${idx !== 0 ? "pt-3 border-t border-border-subtle" : ""}`}>
                      <span className="w-6 h-6 rounded-md bg-brand-light border border-brand/30 text-brand-dark text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-serif text-[15px] font-bold text-ink leading-snug">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StepContainer>
          
          {/* Step 1: What is a subscript? */}
          <StepContainer index={1} step={WEB_STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark rounded-full">
                  <Anchor size={14} /> Subjoining
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  A subscript is a small consonant written <span className="font-bold text-ink">beneath</span> a root letter. Only four consonants — <span className="font-tibetan text-xl text-ink">ཡ ར ལ ཝ</span> — take this position.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-rose-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-700 rounded-full">
                  <Volume2 size={14} /> Sound change
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  With Ya-tak and Ra-tak, the whole syllable can be pronounced <span className="font-bold text-ink">differently</span> from either letter alone — e.g. <span className="font-tibetan text-xl text-ink">པྱ</span> reads <span className="font-mono font-bold">[cha]</span>.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-sky-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-700 rounded-full">
                  <ArrowUp size={14} /> Tone shift
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  The tone becomes <span className="font-bold text-emerald-700">same</span>, <span className="font-bold text-rose-700">higher</span>, or <span className="font-bold text-sky-700">lower</span> — except with <em>Wa-zur</em>, which leaves both sound and tone unchanged.
                </p>
              </Card>
            </div>

            <div className="mt-6 border border-border-strong bg-surface overflow-hidden rounded-[1.5rem]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-border-strong text-center">
                {SUBS.map((s) => (
                  <button key={s.key} onClick={() => playAudio(s.headLabel)} disabled={playingItem !== null} className="group relative flex flex-col items-center p-6 transition bg-surface hover:bg-surface-muted">
                    <span className="absolute inset-x-6 top-0 h-1" style={{ backgroundColor: s.accent.hex }} />
                    <div className="my-4 h-24 w-full flex items-center justify-center">
                      <img 
                        src={SUB_IMAGE_MAP[s.key]} 
                        alt={s.name} 
                        className="h-full w-auto mx-auto object-contain opacity-90" 
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full mt-2">
                      <span className="text-sm font-bold text-ink">{s.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{s.count} STACKS</span>
                      <span className="font-tibetan text-2xl text-ink-light mt-1">
                        {s.key === 'wa' ? 'ཝ་ཟུར་' : s.headLarge + '་བཏགས་'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>   

            <div className="mt-6 p-6 border border-border-strong bg-surface-muted rounded-[1.5rem]">
              <div className="mb-4 flex items-center gap-2 text-eyebrow">
                <Info size={14} className="text-brand" /> Reading the tone arrows
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(Object.keys(TONE_META) as Tone[]).map((t) => {
                  const M = TONE_META[t];
                  const rule = t === "same" ? "No change — read as the root, same tone." : t === "down" ? "Feminine roots acquire a lower tone." : "Very-feminine / neuter roots acquire a higher tone.";
                  return (
                    <div key={t} className="flex items-start gap-3 border border-border-strong bg-surface p-4 shadow-sm rounded-2xl">
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

          {/* Step 2: Meet the four subscripts */}
          <StepContainer index={2} step={WEB_STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-border-strong pb-4 gap-4">
              <h2 className="font-serif text-2xl text-ink">{WEB_STEPS[2].title}</h2>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {SUBS.map((s) => {
                const on = s.key === activeTab;
                return (
                  <button key={s.key} onClick={() => setActiveTab(s.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all rounded-full ${on ? "border-brand bg-brand text-ink shadow-sm" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid size-9 place-items-center font-tibetan text-2xl leading-none" style={{ color: on ? '#1c1917' : s.accent.hex }}>{s.headLarge}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">{s.name}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-ink-light mix-blend-multiply" : "text-ink-light"}`}>{s.count} stacks</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <SubPanel sub={SUBS.find(s => s.key === activeTab)!} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 3: Roots with a superscript and subscript */}
          <StepContainer index={3} step={WEB_STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{WEB_STEPS[3].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2 py-1 border border-border-strong rounded-full">{TRIPLE_STACKS.length} triple stacks</span>
            </div>
            
            <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-light">
              Once superscripts and subscripts are both familiar, they combine on a single root letter. The pronunciation follows the same tone rules — the superscript re-tunes, the subscript re-shapes.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
             {TRIPLE_STACKS.map((t) => {
                const M = TONE_META[t.tone];
                return (
                  <button key={t.stack + t.parts} onClick={() => playAudio(t.stack)} disabled={playingItem !== null} className="group flex flex-col items-center gap-3 border border-border-strong bg-surface p-5 transition hover:-translate-y-1 hover:shadow-md relative rounded-2xl overflow-hidden">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: TRIPLE_ACCENT }} />
                    <span className="font-tibetan text-[3rem] leading-normal pb-2 mt-2 text-ink">{t.stack}</span>
                    <span className="text-xl font-tibetan tracking-widest text-ink-light">{t.parts}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-ink">[{t.read}]</span>
                      <span className="inline-grid size-5 place-items-center rounded-full text-white" style={{ backgroundColor: M.hex }} title={M.label}><M.Icon size={12} strokeWidth={3} /></span>
                    </div>
                    {playingItem === t.stack && <Loader2 size={16} className="absolute top-2 right-2 animate-spin text-brand" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border border-border-strong bg-surface p-6 md:p-8 rounded-[1.5rem]">
              <div className="text-eyebrow mb-6">Spelling walkthrough</div>
              <div className="space-y-2">
                {TRIPLE_STACKS.map((t) => {
                  const M = TONE_META[t.tone];
                  const [superL, rootL, subL] = t.parts.split(' + ');
                  
                  const intMap: Record<string, { tib: string, read: string }> = {
                    "ར_ཀ": { tib: "རྐ", read: "ka" }, "ས_ཀ": { tib: "སྐ", read: "ka" },
                    "ར_ག": { tib: "རྒ", read: "ga" }, "ས_ག": { tib: "སྒ", read: "ga" },
                    "ས_པ": { tib: "སྤ", read: "pa" }, "ས_བ": { tib: "སྦ", read: "ba" },
                    "ར_མ": { tib: "རྨ", read: "ma" }, "ས_མ": { tib: "སྨ", read: "ma" },
                    "ས_ན": { tib: "སྣ", read: "na" }
                  };
                  const intermediate = intMap[`${superL}_${rootL}`] || { tib: "◌", read: "?" };

                  return (
                    <div key={"spell-" + t.stack + t.parts} className="flex flex-wrap items-center gap-x-4 gap-y-3 border border-border-strong bg-surface px-5 py-4 shadow-sm rounded-2xl">
                      <span className="font-tibetan text-[2.5rem] leading-normal pb-2 w-12 text-center text-ink">{t.stack}</span>
                      
                      <SpellingFormula parts={`${superL} + ${rootL} + བཏགས་`} />
                      <span className="text-lg font-bold text-border-strong opacity-70">=</span>
                      <div className="flex items-center gap-1.5">
                        <TibetanPart part={intermediate.tib} />
                        <span className="font-mono text-sm sm:text-base font-bold text-ink-muted">[{intermediate.read}]</span>
                      </div>
                      <span className="text-lg font-sans opacity-40 text-ink-light mx-1">+</span>
                      <SpellingFormula parts={`${subL} + བཏགས་`} />
                      
                      <span className="text-lg font-bold text-border-strong opacity-70">=</span>
                      <div className="flex items-center gap-2">
                        <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: TRIPLE_ACCENT }}>{t.stack}</span>
                        <span className="font-mono text-lg font-bold text-ink">[{t.read}]</span>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <span className={`hidden xl:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${M.bg} ${M.text}`}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                        <Button variant="outline" onClick={() => playAudio(t.stack + " spelling")} disabled={playingItem !== null} className="px-4 py-2 rounded-full">
                          {playingItem === (t.stack + " spelling") ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} Spelling Audio
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 p-6 md:p-8 border border-border-strong rounded-[1.5rem] bg-surface-muted">
              <div className="mb-6 flex items-center gap-2">
                <CheckCircle2 size={18} style={{ color: TRIPLE_ACCENT }} />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Mastery check · Triple Stacks</span>
              </div>
              <TripleMiniMasteryLoader playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
            </div>
          </StepContainer>
          
          {/* Step 4: Vocabulary built from subscripts */}
          <StepContainer index={4} step={WEB_STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{WEB_STEPS[4].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2 py-1 border border-border-strong rounded-full">{VOCAB.length} words</span>
            </div>
            
            <div className="mb-10">
              <VocabGrid 
                items={VOCAB.map(v => ({
                  tib: v.tib, pron: `[${v.translit}]`, en: v.en, emoji: v.emoji, groupId: v.sub,
                  accentHex: v.sub === "triple" ? TRIPLE_ACCENT : SUBS.find(s => s.key === v.sub)?.accent.hex
                }))}
                groups={[
                  ...SUBS.map(s => ({ id: s.key, label: s.name, hex: s.accent.hex })),
                  { id: "triple", label: "Triple stacks", hex: TRIPLE_ACCENT }
                ]}
                playAudio={playAudio}
                playingItem={playingItem}
              />
            </div>

            <QuizModule		  
              moduleId={4}
              title="Mastery Check · Vocabulary" 
              intro="Check your memory of the new subscript words before moving on. This check tests all vocabulary words." 
              questions={vocabQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
            />
          </StepContainer>

          {/* Step 5: Practice & exercises */}
          <StepContainer index={5} step={WEB_STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-3">{WEB_STEPS[5].title}</h2>
              <p className="max-w-3xl text-[15px] text-ink-light leading-relaxed">
                Each subscript has its own <span className="font-bold text-ink">mastery check</span> within its panel above. Below is a <span className="font-bold text-ink">cumulative review</span> that mixes stacks from all four families.
              </p>
            </div>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 6: Final Test */}
          <StepContainer index={6} step={WEB_STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)} isLast>
            <QuizModule 
              moduleId={4}
              title="Final Test" 
              intro="40 questions drawn from everything you covered in this lesson. Score 80% or higher to unlock the next unit: The Five Prefixes." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/5" 
              onPass={() => markComplete(6)}
            />
          </StepContainer>

        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/3" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== WEB_STEPS.length - 1 && ( 
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

function SubPanel({ sub, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className="relative overflow-hidden border transition-colors duration-500 rounded-[1.5rem] border-border-strong bg-surface">
      <div className="h-1.5 w-full" style={{ backgroundColor: sub.accent.hex }} />
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-tibetan text-[4rem] leading-none rounded-[1.25rem]" style={{ backgroundColor: `${sub.accent.hex}15`, color: sub.accent.hex }}>{sub.headLarge}</div>
          <div>
            <div className="text-eyebrow mb-2">Subscript</div>
            <div className="font-serif text-3xl font-bold">{sub.title}</div>
            <div className="mt-1 font-tibetan text-2xl text-ink-light">{sub.nameTib}</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-[15px] leading-relaxed p-5 border flex flex-col gap-4 rounded-2xl bg-surface-muted border-border-strong text-ink-light">
            <p>{sub.intro}</p>
            <div className="flex items-center flex-wrap gap-4 pt-2 text-ink">
              <span className="font-tibetan text-3xl sm:text-4xl leading-relaxed tracking-wider">{sub.rootLetters}</span>
              <span className="text-xl font-sans opacity-40">+</span>
              <span className="font-tibetan text-3xl sm:text-4xl">{sub.headLarge}</span>
            </div>
          </div>
          <div className={`flex items-start gap-3 border-l-4 px-4 py-3 text-sm rounded-r-xl border-y border-r ${sub.accent.bg} ${sub.accent.text} border-border-strong`} style={{ borderLeftColor: sub.accent.hex }}>
            <Info className="mt-0.5 size-4 shrink-0" style={{ color: sub.accent.hex }} />
            <span className="font-medium leading-relaxed">{sub.usage}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px border-b sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 border-border-strong bg-border-strong">
        {sub.combos.map((c: any) => {
          const M = TONE_META[c.tone as Tone];
          return (
            <button key={c.stack} onClick={() => playAudio(c.stack)} disabled={playingItem !== null} className="group relative flex flex-col items-center justify-center gap-3 p-6 transition-colors bg-surface hover:bg-surface-muted">
              <span className="absolute left-0 top-0 h-1 w-full opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundColor: sub.accent.hex }} />
              <span className="font-tibetan text-[3rem] leading-none text-[#1c1917]">{c.stack}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{c.read}</span>
              <span className="inline-flex size-5 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: M.hex }} title={M.label}><M.Icon size={12} strokeWidth={3} /></span>
              {playingItem === c.stack && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
            </button>
          )
        })}
      </div>
      <div className="p-6 md:p-8 border-b border-border-strong bg-surface">
        <div className="text-eyebrow mb-6">Spelling walkthrough</div>
        <div className="space-y-2">
          {sub.combos.map((c: any) => {
            const M = TONE_META[c.tone as Tone];
            return (
              <div key={c.stack} className="flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 rounded-2xl border-border-strong bg-surface shadow-sm">
                <span className="font-tibetan text-[2.5rem] leading-none w-12 text-center">{c.stack}</span>
                <SpellingFormula parts={`${c.root} + ${sub.headLarge} + བཏགས་`} />
                <span className="text-xl font-bold opacity-70 text-border-strong">=</span>
                <div className="flex items-center gap-2">
                  <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: sub.accent.hex }}>{c.stack}</span>
                  <span className="font-mono text-lg font-bold text-ink">[{c.read}]</span>
                </div>
                <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${M.bg} ${M.text}`}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                <Button variant="outline" onClick={() => playAudio(c.stack + " spelling")} disabled={playingItem !== null} className="px-4 py-2 rounded-full">
                  {playingItem === (c.stack + " spelling") ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className="text-brand-dark" />} Spelling Audio
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-6 md:p-8 bg-surface-muted">
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: sub.accent.hex }} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Mastery check · {sub.name}</span>
        </div>
        <SubMiniMasteryLoader sub={sub} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function SubMiniMasteryLoader({ sub, playAudio, playingItem, playErrorBeep }: any) {
  const [seed] = useState(0);
  const questions = useMemo(() => generateSubscriptQuiz(sub.key), [sub.key, seed]);
  return (
    <QuizModule 
      key={`sub-quiz-${sub.key}-${seed}`} 
      moduleId={4}
      title={`Mastery Check · ${sub.name}`} 
      variant="panel" 
      accentColor={sub.accent.hex} 
      questions={questions} 
      playAudio={playAudio} 
      playingItem={playingItem} 
      playErrorBeep={playErrorBeep} 
    />
  );
}

interface TripleMiniMasteryProps {
  playAudio: (text: string) => void;
  playingItem: string | null;
  playErrorBeep: () => void;
}

function TripleMiniMasteryLoader({ playAudio, playingItem, playErrorBeep }: TripleMiniMasteryProps) {
  const [seed] = useState(0);
  const questions = useMemo(() => generateTripleQuiz(), [seed]);
  return (
    <QuizModule 
      key={`triple-quiz-${seed}`} 
      moduleId={4}
      title="Mastery Check · Triple Stacks" 
      variant="panel" 
      accentColor={TRIPLE_ACCENT} 
      questions={questions} 
      playAudio={playAudio} 
      playingItem={playingItem} 
      playErrorBeep={playErrorBeep} 
    />
  );
}