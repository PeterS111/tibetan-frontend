// app/components/lesson/5/WebLesson5.tsx
"use client";

import { SpellingFormula } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowRight,
  Info, CheckCircle2, BookOpen, Loader2, AlertTriangle, Sparkles, Layers
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { 
  PREFIXES, 
  VOCAB, 
  NEVER_TAKE, 
  TONE_META, 
  generateExceptionsQuiz,
  generateVocabQuiz, 
  generateFinalQuiz, 
  type PrefixKey, 
  type Tone 
} from "@/app/data/lesson5";

import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";

const WEB_STEPS = [
  { 
    id: "syllabus", 
    eyebrow: "Introduction", 
    title: "Welcome to the five prefixes", 
    description: "A short orientation before you meet the five prefix letters." 
  },
  { 
    id: "anatomy", 
    eyebrow: "Step 02", 
    title: "Word formation — the anatomy of a syllable", 
    tibetanTitle: "ཚིག་གི་གྲུབ་སྟངས།",
    description: "How up to seven letter slots arrange around a single root letter." 
  },
  { 
    id: "intro", 
    eyebrow: "Step 03", 
    title: "What is a prefix?", 
    tibetanTitle: "སྔོན་འཇུག",
    description: "How prefix letters sit before the root and shape spelling and tone." 
  },
  { 
    id: "family", 
    eyebrow: "Step 04", 
    title: "Meet the five prefixes", 
    tibetanTitle: "སྔོན་འཇུག་ལྔ།",
    description: "Study each prefix, the roots it precedes, and its aloud-spelling walkthrough." 
  },
  { 
    id: "exceptions", 
    eyebrow: "Step 05", 
    title: "Exceptions worth memorising", 
    tibetanTitle: "དམིགས་བསལ།",
    description: "Three special prefix + root combinations with unique Lhasa readings." 
  },
  { 
    id: "vocab", 
    eyebrow: "Step 06", 
    title: "Vocabulary built from prefixes", 
    tibetanTitle: "ཚིག་གསར།",
    description: "Read and hear 20 essential words built with prefix letters." 
  },
  { 
    id: "practice", 
    eyebrow: "Step 07", 
    title: "Practice & exercises", 
    tibetanTitle: "སྦྱོང་ཚན།",
    description: "Flashcards, listening, matching, and memory review." 
  },
  { 
    id: "complete", 
    eyebrow: "Final step", 
    title: "Final Test", 
    tibetanTitle: "རྒྱུགས་སྤྲོད།",
    description: "Take the final test to unlock the next lesson." 
  }
];

export default function WebLesson5() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(WEB_STEPS.length);

  const [activeTab, setActiveTab] = useState<PrefixKey>("ga");
  const [isBypassing, setIsBypassing] = useState(false);

  const practiceGroups = useMemo(() => [
    {
      name: "Stacks",
      items: PREFIXES.flatMap(s => s.combos.map(c => ({
        id: `c-${c.word}`, tibetan: c.word, reading: c.read, english: c.gloss ?? TONE_META[c.tone].label, audioTarget: c.word
      })))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

  const exceptionsQuestions = useMemo(() => generateExceptionsQuiz(), []);
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
          <span>Unit 05</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">Prefixes</span>
        </div>

        {/* Hero Section (Harmonized with Lessons 1–4) */}
        <Card className="mb-8 p-0 overflow-hidden shadow-sm border border-border-subtle">
          <div className="w-full h-72 sm:h-96 md:h-[400px] bg-surface-muted overflow-hidden relative">
            <img 
              src="/loplao-hero-scene.jpg" 
              alt="Himalayan Monastery Scene" 
              className="w-full h-full object-cover object-center" 
            />
          </div>
          
          <div className="p-6 md:p-10 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <div className="mb-2 text-eyebrow text-brand-dark">Lesson 05 · Foundations</div>
              <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">The Five Prefixes</h1>
              <p className="mt-2 font-tibetan text-3xl text-ink-light">སྔོན་འཇུག་ལྔ།</p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
                Five consonants — <span className="font-serif text-xl">ག ད བ མ འ</span> — may sit <em>before</em> a root letter on the baseline. Silent on their own, they disambiguate homophones on the page and reshape the <span className="font-bold text-ink">tone</span> and <span className="font-bold text-ink">nasality</span> of the root that follows.
              </p> 
            </div>
            <div className="w-full md:w-80">
              <div className="mb-2 flex items-center justify-between text-eyebrow">
                <span>Lesson progress</span>
                <span className="text-brand-dark">{Math.min(unlockedStep, WEB_STEPS.length)} of {WEB_STEPS.length} sections</span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle overflow-hidden rounded-full">
                <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2 text-center">
                {PREFIXES.map((s) => (
                  <button 
                    key={s.key} 
                    type="button" 
                    onClick={() => playAudio(s.nameTib)} 
                    disabled={playingItem !== null} 
                    className="group flex flex-col items-center gap-1 border border-border-strong p-2 bg-surface rounded-xl text-center transition hover:bg-surface-muted hover:border-brand"
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-tibetan text-2xl leading-none pt-1" style={{ color: s.accent.hex }}>{s.head}</span>
                      {playingItem === s.nameTib ? (
                        <Loader2 size={10} className="animate-spin text-brand" />
                      ) : (
                        <Volume2 size={10} className="text-brand opacity-50 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">{s.latin}</span>
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
                  Now that you know how letters stack vertically with superscripts and subscripts, we move horizontally across the baseline. In this lesson you'll see the full <strong className="text-ink">seven-slot anatomy of a Tibetan syllable</strong> and master the <strong className="text-ink">five prefix letters</strong> (<span className="font-tibetan text-lg text-ink">ག ད བ མ འ</span>) that sit to the left of the root.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <Sparkles size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Distinguish between the three purely silent prefixes (ག ད བ) and the two nasalising prefixes (མ འ).
                    </p>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <Layers size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Practise the aloud-spelling walkthroughs and memorise the three classic Lhasa pronunciation exceptions.
                    </p>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <CheckCircle2 size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Complete the mastery checks inside each prefix tab before taking the 40-question Final Test.
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
                    "Word formation — the anatomy of a syllable",
                    "What is a prefix?",
                    "Meet the five prefixes",
                    "Exceptions worth memorising",
                    "Vocabulary built from prefixes",
                    "Practice & exercises",
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
          
          {/* Step 1: Word formation — the anatomy of a syllable */}
          <StepContainer index={1} step={WEB_STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">A Tibetan syllable is built from up to <span className="font-bold text-ink">seven slots</span> arranged around a single <span className="font-bold text-ink">root letter</span>. Each slot has a name, a position, and a job. The <span className="font-bold text-brand-dark">prefix</span> is the leftmost of them.</p>

            <Card className="p-0 overflow-hidden mb-6 rounded-[1.5rem]">
              <div className="border-b border-border-strong bg-gradient-to-b from-stone-50 to-white px-6 pb-10 pt-8 text-center md:pb-14 relative group">
                <div className="mb-8 text-eyebrow">A full syllable</div>
                
                <button 
                  onClick={() => playAudio("བསྒྲིམས་")} 
                  disabled={playingItem !== null} 
                  className="relative w-full max-w-[320px] mx-auto h-[160px] my-6 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <img 
                    src="/colored-syllable.png"
                    alt="bsgrims" 
                    className="w-full h-full object-contain" 
                  />
                  {playingItem === "བསྒྲིམས་" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-paper/60 backdrop-blur-[2px] rounded-3xl z-10">
                      <Loader2 size={40} className="animate-spin text-brand" />
                    </div>
                  )}
                </button>

                <div className="mt-6 text-[15px] italic text-ink-light"><span className="not-italic font-bold text-ink">bsgrims</span> — “concentrated” · read <span className="not-italic font-bold text-ink">drim</span></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-border-strong text-center items-stretch">
                {[
                  { letter: "བ", role: "Prefix", pos: "Before root", accent: "#c2410c", highlight: true, tib: "སྔོན་འཇུག" },
                  { letter: "ས", role: "Superscript", pos: "Above root", accent: "#7c3aed", tib: "མགོ་ཅན" },
                  { letter: "ག", role: "Root letter", pos: "The heart", accent: "#111827", tib: "མིང་གཞི" },
                  { imgSrc: "/slot-subscript.png", role: "Subscript", pos: "Below root", accent: "#0284c7", tib: "འདོགས་ཅན" },
                  { imgSrc: "/slot-vowel.png", role: "Vowel", pos: "Above / below", accent: "#059669", tib: "དབྱངས" },
                  { letter: "མ", role: "Suffix", pos: "After root", accent: "#b45309", tib: "རྗེས་འཇུག" },
                  { letter: "ས", role: "Post-suffix", pos: "Far right", accent: "#9333ea", tib: "ཡང་འཇུག" },
                ].map((s) => (
                  <div key={s.role} className={`relative p-5 flex flex-col items-center justify-start ${s.highlight ? "bg-brand-light" : "bg-surface"}`}>
                    {s.highlight && <span className="absolute top-2 right-2 bg-amber-200 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-brand-dark shadow-sm rounded-full">This lesson</span>}
                    
                    <div className="relative flex items-center justify-center h-16 w-full mb-3 mt-2 overflow-hidden">
                      {s.imgSrc ? (
                        <img src={s.imgSrc} alt={s.role} className="w-16 h-16 p-1 object-contain relative z-10" />
                      ) : (
                        <span className="relative z-10 leading-none flex items-center justify-center font-tibetan" style={{ color: s.accent, fontSize: "2.5rem" }}>
                          {s.letter}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: s.accent }}>{s.role}</div>
                    <div className="font-tibetan text-[15px] font-medium text-ink not-italic mb-1.5 leading-tight">{s.tib}</div>
                    <div className="mt-auto text-[10px] text-ink-light font-bold uppercase tracking-widest">{s.pos}</div>
                  </div>
                ))}
              </div>
            </Card>
          </StepContainer>

          {/* Step 2: What is a prefix? */}
          <StepContainer index={2} step={WEB_STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark rounded-full">
                  <ChevronLeft size={14} /> Before the root
                </div>
                <p className="text-sm leading-relaxed text-ink-light">A prefix is a letter written <span className="font-bold text-ink">to the left</span> of the root. Only five letters — <span className="font-serif text-lg">ག ད བ མ འ</span> — may take that seat.</p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark rounded-full">
                  <BookOpen size={14} /> Writing
                </div>
                <p className="text-sm leading-relaxed text-ink-light">Prefixes disambiguate words on the page — e.g. <span className="font-serif text-lg">བཞི་</span> vs <span className="font-serif text-lg">གཞི་</span>.</p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark rounded-full">
                  <Volume2 size={14} /> Pronunciation
                </div>
                <p className="text-sm leading-relaxed text-ink-light">Prefixes never change <span className="font-bold text-ink">masculine</span> letters. They <span className="font-bold text-sky-700">deepen</span> feminine roots and <span className="font-bold text-rose-700">nasalise</span> very-feminine roots.</p>
              </Card>
            </div>

            <div className="mt-6 border border-border-strong bg-surface overflow-hidden rounded-[1.5rem]">
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-border-strong text-center">
                {PREFIXES.map((s) => (
                  <button key={s.key} onClick={() => playAudio(s.nameTib)} disabled={playingItem !== null} className="group flex flex-col items-center gap-2 p-6 transition hover:bg-surface-muted">
                    <span className="h-1 w-10 rounded-full" style={{ backgroundColor: s.accent.hex }} />
                    <span className="mt-2 font-serif leading-none" style={{ fontSize: "3rem", color: s.accent.hex }}>{s.head}</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      {s.latin}
                      {playingItem === s.nameTib ? (
                        <Loader2 size={12} className="animate-spin text-brand" />
                      ) : (
                        <Volume2 size={12} className="text-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{s.count} · {s.family === "nasal" ? "nasalising" : "silent"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 p-6 border border-border-strong bg-surface-muted rounded-[1.5rem]">
              <div className="mb-4 flex items-center gap-2 text-eyebrow"><Info size={14} className="text-brand" /> Two rules of writing</div>
              <ol className="space-y-4 text-[15px] text-ink-light font-bold">
                <li className="flex gap-4"><span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface border border-border-strong text-[11px] text-ink-light">1</span><span>Only five letters — <span className="font-serif text-xl text-ink mx-1 px-2.5 py-0.5 bg-surface border border-border-strong rounded-lg">{NEVER_TAKE}</span> — <em>never</em> take a prefix.</span></li>
                <li className="flex gap-4"><span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface border border-border-strong text-[11px] text-ink-light">2</span><span>A root that follows a prefix must carry <em>at least</em> a vowel, superscript, subscript, or suffix.</span></li>
              </ol>
            </div>
          </StepContainer>

          {/* Step 3: Meet the five prefixes */}
          <StepContainer index={3} step={WEB_STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-border-strong pb-4 gap-4">
              <h2 className="font-serif text-2xl text-ink">{WEB_STEPS[3].title}</h2>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {PREFIXES.map((p) => {
                const on = p.key === activeTab;
                return (
                  <button key={p.key} onClick={() => setActiveTab(p.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all rounded-full ${on ? "border-brand bg-brand text-ink shadow-sm" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid size-9 place-items-center font-serif text-2xl leading-none" style={{ color: on ? '#1c1917' : p.accent.hex }}>{p.head}</span>
                    <span className="flex-1 pr-1">
                      <span className="block text-sm font-bold">Prefix {p.latin}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-ink-light mix-blend-multiply" : "text-ink-light"}`}>{p.count}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <PrefixPanel p={PREFIXES.find(p => p.key === activeTab)!} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 4: Exceptions worth memorising + Embedded Mastery Check */}
          <StepContainer index={4} step={WEB_STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface flex flex-col h-full">
                <div className="mb-6 inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start shadow-sm border border-rose-100 rounded-full">
                  <AlertTriangle size={18} /> <span className="font-tibetan text-2xl font-normal normal-case leading-none pt-1">ད + བ</span> <ArrowRight size={16} /> [WA]
                </div>
                <div className="flex flex-wrap items-center gap-2 font-tibetan text-3xl lg:text-[2rem] leading-normal text-ink mb-6">
                  <button onClick={() => playAudio('དབུ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">དབུ་</button>
                  <button onClick={() => playAudio('དབྱེ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">དབྱེ་</button>
                  <button onClick={() => playAudio('དབྲ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">དབྲ་</button>
                </div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">When ད precedes root བ, the stack reads as the <span className="font-bold text-ink">wa</span> family in a high tone: [wu], [ye], [dra].</p>
              </Card>

              <Card className="p-6 bg-surface flex flex-col h-full">
                <div className="mb-6 inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start shadow-sm border border-rose-100 rounded-full">
                  <AlertTriangle size={18} /> <span className="font-tibetan text-2xl font-normal normal-case leading-none pt-1">འ + བ</span> <ArrowRight size={16} /> [BA]
                </div>
                <div className="flex flex-wrap items-center gap-2 font-tibetan text-3xl lg:text-[2rem] leading-normal text-ink mb-6">
                  <button onClick={() => playAudio('འབུ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">འབུ་</button>
                  <button onClick={() => playAudio('འབྲི་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">འབྲི་</button>
                  <button onClick={() => playAudio('འབྲུ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">འབྲུ་</button>
                </div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">With prefix འ the root བ retains its [b-] onset in a low nasal tone: [ng’bu], [ng’dri].</p>
              </Card>

              <Card className="p-6 bg-surface flex flex-col h-full">
                <div className="mb-6 inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start shadow-sm border border-rose-100 rounded-full">
                  <AlertTriangle size={18} /> <span className="font-tibetan text-2xl font-normal normal-case leading-none pt-1">ག + ཡ</span> <ArrowRight size={16} /> [YO]
                </div>
                <div className="flex flex-wrap items-center gap-2 font-tibetan text-3xl lg:text-[2rem] leading-normal text-ink mb-6">
                  <button onClick={() => playAudio('གཡོ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">གཡོ་</button>
                  <button onClick={() => playAudio('གཡུ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">གཡུ་</button>
                  <button onClick={() => playAudio('གཡི་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] rounded-2xl">གཡི་</button>
                </div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">Prefix ག lifts the feminine ཡ to a <span className="font-bold text-ink">high</span> tone.</p>
              </Card>
            </div>

            <div className="mt-8 p-6 md:p-8 border border-border-strong rounded-[1.5rem] bg-surface-muted">
              <div className="mb-6 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-rose-700" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Mastery check · Prefix Exceptions</span>
              </div>
              <QuizModule 
                moduleId={5}
                title="Mastery Check · Exceptions"
                variant="panel"
                accentColor="#b91c1c"
                questions={exceptionsQuestions}
                playAudio={playAudio}
                playingItem={playingItem}
                playErrorBeep={playErrorBeep}
              />
            </div>
          </StepContainer>

          {/* Step 5: Vocabulary built from prefixes */}
          <StepContainer index={5} step={WEB_STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{WEB_STEPS[5].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2.5 py-1 border border-border-strong rounded-full">{VOCAB.length} words</span>
            </div>
            
            <div className="mb-10">
              <VocabGrid 
                items={VOCAB.map(v => ({
                  tib: v.tib, pron: `[${v.translit}]`, en: v.en, emoji: v.emoji, groupId: v.prefix,
                  accentHex: PREFIXES.find(s => s.key === v.prefix)?.accent.hex
                }))}
                groups={PREFIXES.map(s => ({ id: s.key, label: `${s.head} ${s.latin}`, hex: s.accent.hex }))}
                playAudio={playAudio}
                playingItem={playingItem}
              />
              <div className="mt-10 border border-border-strong bg-surface-muted p-6 flex flex-col items-center sm:items-start sm:flex-row gap-6 rounded-[1.5rem]">
                <div className="bg-surface border border-border-strong p-4 shadow-sm shrink-0 rounded-[1.25rem]"><Info size={24} className="text-brand" /></div>
                <div>
                  <div className="text-eyebrow mb-2">Reminder · Letters that never take a prefix</div>
                  <p className="font-tibetan text-3xl font-bold text-ink tracking-[0.2em] leading-normal pb-2">{NEVER_TAKE}</p>
                </div>
              </div>
            </div>

            <QuizModule
              moduleId={5}
              title="Mastery Check · Vocabulary" 
              intro="Check your memory of the new prefix words before moving on. This check tests all vocabulary words." 
              questions={vocabQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
            />
          </StepContainer>

          {/* Step 6: Practice & exercises */}
          <StepContainer index={6} step={WEB_STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
             <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
               <h2 className="font-serif text-2xl text-ink mb-3">{WEB_STEPS[6].title}</h2>
               <p className="max-w-3xl text-[15px] text-ink-light leading-relaxed">
                 Each prefix has its own <span className="font-bold text-ink">mastery check</span> inside its panel above. Below is a <span className="font-bold text-ink">cumulative review</span> mixing all five prefixes and vocabulary words.
               </p>
             </div>
             <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 7: Final Test */}
          <StepContainer index={7} step={WEB_STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => markComplete(7)} isLast>
            <QuizModule 
              moduleId={5}
              title="Final Test" 
              intro="40 questions drawn from everything you covered in this lesson. Score 80% or higher to unlock the next unit: Suffixes & Post-suffixes." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/6" 
              onPass={() => markComplete(7)} 
            />
          </StepContainer>

        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/4" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== WEB_STEPS.length - 1 && ( 
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}>
              <CheckCircle2 size={18} /> Mark step complete
            </Button>
          )}

          <Link href="/dashboard/lessons/6" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
            Next: Suffixes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PrefixPanel({ p, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className="relative overflow-hidden border transition-colors duration-500 rounded-[1.5rem] border-border-strong bg-surface">
      <div className="h-1.5 w-full" style={{ backgroundColor: p.accent.hex }} />
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-serif text-[4rem] leading-none rounded-[1.25rem]" style={{ backgroundColor: `${p.accent.hex}15`, color: p.accent.hex }}>{p.head}</div>
          <div>
            <div className="text-eyebrow mb-2">Prefix · {p.family === "nasal" ? "Nasalising" : "Silent"}</div>
            <div className="font-serif text-3xl font-bold">{p.title}</div>
            <div className="mt-1 font-tibetan text-2xl text-ink-light">{p.nameTib}</div>
          </div>
        </div>
        
        <div>
          <p className="text-[15px] leading-relaxed p-5 border rounded-2xl bg-surface-muted border-border-strong text-ink-light">
            {p.intro}<br /><br />
            <span className="text-ink font-bold">Followed by </span>
            <span className="font-serif text-xl font-bold text-ink">{p.followedBy}</span>
          </p>
          <div className="mt-4 flex items-start gap-3 border-l-4 px-4 py-3 text-sm rounded-r-2xl border-y border-r bg-surface-muted border-border-strong text-ink-light" style={{ borderLeftColor: p.accent.hex }}>
            <Info className="mt-0.5 size-4 shrink-0" style={{ color: p.accent.hex }} />
            <span className="font-medium leading-relaxed">{p.usage}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px border-b sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-border-strong bg-border-strong">
        {p.combos.map((c: any) => {
          const M = TONE_META[c.tone as Tone];
          return (
            <button key={c.word + c.read} onClick={() => playAudio(c.word)} disabled={playingItem !== null} className="group relative flex flex-col items-center justify-center gap-1.5 p-6 transition-colors bg-surface hover:bg-surface-muted">
              <span className="absolute left-0 top-0 h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: p.accent.hex }} />
              <span className="font-tibetan text-[2.5rem] leading-normal pb-2 mb-1 text-[#1c1917]">{c.word}</span>
              <span className="font-mono text-xs font-bold text-ink-light">[{c.read}]</span>
              {c.gloss && <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{c.gloss}</span>}
              <span className="mt-2 inline-flex size-5 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: M.hex }} title={M.label}><M.Icon size={12} strokeWidth={3} /></span>
              {playingItem === c.word && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
            </button>
          )
        })}
      </div>
      <div className="p-6 md:p-8 border-b border-border-strong bg-surface">
        <div className="text-eyebrow mb-6">Spelling walkthrough</div>
        
        <div className="space-y-2">
          {p.combos.map((c: any) => {
            const M = TONE_META[c.tone as Tone];
            return (
              <div key={c.word + c.read} className="flex flex-wrap items-center gap-x-4 gap-y-3 border px-5 py-4 rounded-2xl border-border-strong bg-surface shadow-sm">
                
                <span className="font-tibetan text-[2.5rem] leading-normal pb-2 w-12 text-center text-ink">{c.word}</span>
                
                <SpellingFormula parts={c.parts} />

                <ArrowRight size={16} className="text-border-strong" />
                
                <div className="flex items-center gap-2">
                  <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: p.accent.hex }}>{c.word}</span>
                  <span className="font-mono text-lg font-bold text-ink">[{c.read}]</span>
                </div>
                
                <div className="ml-auto flex items-center gap-3">
                  <span className={`hidden xl:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${M.bg} ${M.text}`}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                  <Button variant="outline" onClick={() => playAudio(c.word + " spelling")} disabled={playingItem !== null} className="px-4 py-2 rounded-full">
                    {playingItem === (c.word + " spelling") ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className="text-brand-dark" />} Spelling Audio
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-6 md:p-8 bg-surface-muted">
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: p.accent.hex }} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Mastery check · Prefix {p.latin}</span>
        </div>
        <PrefixMiniMasteryLoader p={p} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function PrefixMiniMasteryLoader({ p, playAudio, playingItem, playErrorBeep }: any) {
  const [seed] = useState(0);

  const questions = useMemo(() => {
    const shuffledCombos = [...p.combos].sort(() => 0.5 - Math.random());
    return shuffledCombos.map((answer: any) => {
      const wrongs = p.combos.filter((c: any) => c.word !== answer.word).sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [...wrongs, answer].sort(() => 0.5 - Math.random()).map((x: any) => ({
        value: x.word,
        tib: x.word
      }));
      
      return {
        answer: answer.word,
        promptText: "Which word reads",
        promptHighlight: `[${answer.read}]`,
        promptEnd: answer.gloss ? `“${answer.gloss}”` : undefined,
        audioTarget: answer.word,
        explanation: `${answer.word} reads [${answer.read}].`,
        choices
      };
    });
  }, [p.key, seed]);

  const prefixDisplayTitle = `Mastery Check · Prefix ${p.key === 'a' ? "'A" : p.latin.charAt(0).toUpperCase() + p.latin.slice(1)}`;

  return (
    <QuizModule 
      key={`prefix-quiz-${p.key}-${seed}`}
      moduleId={5}
      title={prefixDisplayTitle}
      variant="panel"
      accentColor={p.accent.hex}
      questions={questions}
      playAudio={playAudio}
      playingItem={playingItem}
      playErrorBeep={playErrorBeep}
    />
  );
}