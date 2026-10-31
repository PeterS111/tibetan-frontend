// app/components/lesson/6/WebLesson6.tsx
"use client";

import { SpellingFormula } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowRight, Info, CheckCircle2, 
  BookOpen, Loader2, History, Sparkles, Layers
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { SUFFIXES, VOCAB, QUIZ, FAMILY_META, VOWEL_SHIFTS, generateVocabQuiz, generateFinalQuiz, POST_SUFFIX_QUESTIONS, ROOT_LETTER_QUESTIONS, type SuffixKey, type Family } from "@/app/data/lesson6";

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
    title: "Welcome to suffixes & post-suffixes", 
    description: "A short orientation before you meet the ten suffixes and two post-suffixes." 
  },
  { 
    id: "intro", 
    eyebrow: "Step 02", 
    title: "What is a suffix?", 
    tibetanTitle: "རྗེས་འཇུག",
    description: "The ten suffixes and how they close a Tibetan syllable." 
  },
  { 
    id: "suffixes", 
    eyebrow: "Step 03", 
    title: "Meet the ten suffixes", 
    tibetanTitle: "རྗེས་འཇུག་བཅུ།",
    description: "Study each suffix, its ending sound, and its aloud-spelling walkthrough." 
  },
  { 
    id: "vowel", 
    eyebrow: "Step 04", 
    title: "When the vowel meets the suffix", 
    tibetanTitle: "དབྱངས་དང་རྗེས་འཇུག",
    description: "How the four suffixes ད ན ལ ས reshape the preceding vowel." 
  },
  { 
    id: "post", 
    eyebrow: "Step 05", 
    title: "Post-suffixes", 
    tibetanTitle: "ཡང་འཇུག་གཉིས།",
    description: "The silent closers ད and ས, historical and active." 
  },
  { 
    id: "root", 
    eyebrow: "Step 06", 
    title: "How to recognise the root letter", 
    tibetanTitle: "མིང་གཞི་ངོས་འཛིན།",
    description: "Four practical rules for parsing multi-letter Tibetan syllables." 
  },
  { 
    id: "vocab", 
    eyebrow: "Step 07", 
    title: "Vocabulary built from suffixes", 
    tibetanTitle: "ཚིག་གསར།",
    description: "Words that use the suffixes and post-suffixes you just learned." 
  },
  { 
    id: "practice", 
    eyebrow: "Step 08", 
    title: "Practice & exercises", 
    tibetanTitle: "སྦྱོང་ཚན།",
    description: "Flashcards, quiz, and matching drills." 
  },
  { 
    id: "test", 
    eyebrow: "Final step", 
    title: "Final Test", 
    tibetanTitle: "རྒྱུགས་སྤྲོད།",
    description: "Take the final test to unlock the Capstone." 
  }
];

// Helper to ensure inline Tibetan characters in strings render with font-tibetan font-normal
function renderTibetanText(text: string) {
  const parts = text.split(/([\u0F00-\u0FFF]+)/g);
  return parts.map((part, idx) =>
    /[\u0F00-\u0FFF]/.test(part) ? (
      <span key={idx} className="font-tibetan font-normal text-xl text-ink leading-none">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export function WebLesson6() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { completed, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(WEB_STEPS.length);

  const [activeTab, setActiveTab] = useState<SuffixKey>("ga");
  const [isBypassing, setIsBypassing] = useState(false);

  const practiceGroups = useMemo(() => [
    {
      name: "Words",
      items: QUIZ.map(c => ({
        id: `q-${c.word}`, tibetan: c.word, reading: c.read, english: `Suffix ${SUFFIXES.find(s => s.key === c.suffix)?.head}`, audioTarget: c.word
      }))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `v-${v.tib}`, tibetan: v.tib, reading: v.read, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

  const quizQuestions = useMemo(() => generateFinalQuiz(), []);
  const postSuffixQuestions = POST_SUFFIX_QUESTIONS;
  const rootLetterQuestions = ROOT_LETTER_QUESTIONS;
  const vocabQuestions = useMemo(() => generateVocabQuiz(), []);

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
          <span>Unit 06</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">Suffixes & Post-suffixes</span>
        </div>

        {/* Hero Section (Harmonized with Lessons 1–5) */}
        <Card className="mb-8 p-0 overflow-hidden shadow-sm border border-border-subtle">
          
		  
		  <div className="w-full h-72 sm:h-96 md:h-[400px] bg-surface-muted overflow-hidden relative">
            <img 
              src="/06_suffixes_post_suffixes.jpg" 
              alt="Suffixes and Post-suffixes Hero Scene" 
              className="w-full h-full object-cover object-center" 
            />
          </div>
          
          <div className="p-6 md:p-10 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <div className="mb-2 text-eyebrow text-brand-dark">Lesson 06 · Foundations</div>
              <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">Suffixes & Post-suffixes</h1>
              <p className="mt-2 font-tibetan font-normal text-3xl text-ink-light">རྗེས་འཇུག་བཅུ་དང་ཡང་འཇུག་གཉིས།</p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
                Ten letters may follow the root — the <span className="font-bold text-ink">suffix</span> closes the syllable. A further <span className="font-bold text-ink">two</span> may sit beyond that suffix as a <span className="font-bold text-ink">post-suffix</span>. Together they shape the reading, the vowel colour, and the grammatical tense of a word.
              </p> 
            </div>
            <div className="w-full md:w-80">
              <div className="mb-2 flex items-center justify-between text-eyebrow">
                <span>Lesson progress</span>
                <span className="text-brand-dark">{Math.min(completed.size, WEB_STEPS.length)} of {WEB_STEPS.length} sections</span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle overflow-hidden rounded-full">
                <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {SUFFIXES.map((x) => (
                  <button 
                    key={x.key} 
                    onClick={() => { setActiveTab(x.key); playAudio(x.head); }} 
                    className={`border rounded-xl p-2 text-center transition-colors ${activeTab === x.key ? "border-amber-400 bg-brand-light" : "border-border-strong hover:bg-surface-muted hover:border-amber-300 bg-surface"}`}
                  >
                    <div className="font-tibetan font-normal leading-none text-xl pt-1" style={{ color: x.accent }}>{x.head}</div>
                    <div className="mt-1 text-[9px] uppercase tracking-widest text-ink-muted font-bold">{x.latin}</div>
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
                  In this final instructional unit of Beginner 1, you will complete the Tibetan syllable by learning the <strong className="text-ink">ten suffixes</strong> (<span className="font-tibetan font-normal text-xl text-ink">ག་ང་ད་ན་བ་མ་འ་ར་ལ་ས</span>) and the <strong className="text-ink">two post-suffixes</strong> (<span className="font-tibetan font-normal text-xl text-ink">ད་ས</span>). You'll also learn the four golden rules for spotting the root letter in any word at a glance.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <Sparkles size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Hear how each of the ten suffixes closes a syllable, and how <span className="font-tibetan font-normal text-lg text-ink">ད ན ལ ས</span> shift back vowels toward [e / ü / ö].
                    </p>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <Layers size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Master the 4 Root-Letter Recognition Rules so you can parse 2-, 3-, and 4-letter words effortlessly.
                    </p>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <CheckCircle2 size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Pass the Final Test to unlock Unit 07: the Beginner 1 Capstone Assessment & Certificate.
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
                    "What is a suffix?",
                    "Meet the ten suffixes",
                    "When the vowel meets the suffix",
                    "Post-suffixes (ད and ས)",
                    "How to recognise the root letter",
                    "Vocabulary & Practice",
                  ].map((title, idx) => (
                    <div key={title} className={`flex items-center gap-3.5 ${idx !== 0 ? "pt-3 border-t border-border-subtle" : ""}`}>
                      <span className="w-6 h-6 rounded-md bg-brand-light border border-brand/30 text-brand-dark text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-serif text-[15px] font-bold text-ink leading-snug">{renderTibetanText(title)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StepContainer>

          {/* Step 1: What is a suffix? */}
          <StepContainer index={1} step={WEB_STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-dark rounded-full"><ArrowRight size={14} /> After the root</div>
                <p className="text-[15px] leading-relaxed text-ink-light">A suffix — <span className="font-tibetan font-normal text-xl not-italic text-ink">རྗེས་འཇུག</span> — is a letter written <span className="font-bold text-ink">immediately after</span> the root. Only ten letters may take this seat.</p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-dark rounded-full"><BookOpen size={14} /> Writing</div>
                <p className="text-[15px] leading-relaxed text-ink-light">Any consonant — even itself — may be followed by a suffix (e.g. <span className="font-tibetan font-normal text-xl not-italic text-ink">དད་</span>). Suffix <span className="font-tibetan font-normal text-xl not-italic text-ink">འ</span> is special: it may only appear when the root also carries a prefix.</p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-dark rounded-full"><Volume2 size={14} /> Pronunciation</div>
                <p className="text-[15px] leading-relaxed text-ink-light">A suffix closes the syllable. Four of them — <span className="font-tibetan font-normal text-xl not-italic text-ink">ད ན ལ ས</span> — recolour the preceding vowel into a fronted <em>[e / ü / ö]</em>.</p>
              </Card>
            </div>
            <div className="mt-6 border border-border-strong bg-surface overflow-hidden rounded-[1.5rem]">
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 divide-x divide-y md:divide-y-0 divide-border-strong text-center">
                {SUFFIXES.map((x) => (
                  <button key={x.key} onClick={() => playAudio(x.head)} disabled={playingItem !== null} className="group flex flex-col items-center gap-2 p-4 transition hover:bg-surface-muted">
                    <span className="h-1 w-8 rounded-full" style={{ backgroundColor: x.accent }} />
                    <span className="mt-2 font-tibetan font-normal leading-none pt-1" style={{ fontSize: "2.5rem", color: x.accent }}>{x.head}</span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-ink">
                      {x.latin}
                      {playingItem === x.head ? <Loader2 size={10} className="animate-spin text-brand" /> : <Volume2 size={10} className="text-brand opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </StepContainer>

          {/* Step 2: Meet the ten suffixes */}
          <StepContainer index={2} step={WEB_STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex flex-wrap gap-2">
              {SUFFIXES.map((s) => {
                const on = s.key === activeTab;
                return (
                  <button key={s.key} onClick={() => setActiveTab(s.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all rounded-full ${on ? "border-brand bg-brand text-ink shadow-sm" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid size-9 place-items-center font-tibetan font-normal text-2xl leading-none pt-1" style={{ color: on ? '#1c1917' : s.accent }}>{s.head}</span>
                    <span className="flex-1 pr-2">
                      <span className="block text-[13px] font-bold">Suffix {s.latin}</span>
                      <span className={`block text-[9px] font-bold uppercase tracking-widest mt-0.5 ${on ? "text-ink-light mix-blend-multiply" : "text-ink-muted"}`}>{s.reads}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <SuffixPanel s={SUFFIXES.find(x => x.key === activeTab)!} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 3: When the vowel meets the suffix */}
          <StepContainer index={3} step={WEB_STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-light">Four suffixes — <span className="font-tibetan font-normal text-xl text-ink">ད ན ལ ས</span> — recolour the vowel that precedes them. Find a vowel on the left, follow the row across, and hear how each suffix reshapes it.</p>
            <div className="border border-border-strong bg-surface shadow-sm overflow-hidden rounded-[1.5rem]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="bg-surface-muted border-b border-border-strong">
                      <th className="w-40 px-5 py-4 text-left text-eyebrow">Vowel</th>
                      {[
                        { suf: "ལ", latin: "la", accent: "#7c3aed", family: "keeps [l]" },
                        { suf: "ན", latin: "na", accent: "#0369a1", family: "keeps [n]" },
                        { suf: "ད", latin: "da", accent: "#0891b2", family: "silent · fronts vowel" },
                        { suf: "ས", latin: "sa", accent: "#0284c7", family: "silent · fronts vowel" },
                      ].map((c) => (
                        <th key={c.suf} className="border-l border-border-strong px-4 py-4 text-center font-normal">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="font-tibetan font-normal leading-none text-3xl pt-1" style={{ color: c.accent }}>{c.suf}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.accent }}>{c.latin}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">{c.family}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-strong">
                    {VOWEL_SHIFTS.map((r) => {
                      const isRowVowelPlaying = playingItem === r.audioTarget;
                      return (
                        <tr key={r.label}>
                          <td className={`px-5 py-5 border-r border-border-strong transition-colors ${isRowVowelPlaying ? "bg-brand-light/70" : "hover:bg-surface-muted"}`}>
                            <button onClick={() => playAudio(r.audioTarget)} disabled={playingItem !== null} className="group relative flex w-full items-center gap-4 text-left">
                              <span className="font-tibetan font-normal leading-none text-[2.5rem] text-brand pt-1">{r.vowel}</span>
                              <span className="text-[15px] font-bold text-ink">{r.label}</span>
                              {isRowVowelPlaying && <Loader2 size={15} className="ml-auto animate-spin text-brand-dark" />}
                            </button>
                          </td>
                          {r.cells.map((cell, i) => {
                            const isCellPlaying = playingItem === cell.word;
                            return (
                              <td 
                                key={i} 
                                className={`border-l border-border-strong p-0 text-center transition-colors ${
                                  isCellPlaying ? "bg-brand-light/70" : "hover:bg-surface-muted"
                                }`}
                              >
                                <button 
                                  onClick={() => playAudio(cell.word)} 
                                  disabled={playingItem !== null}
                                  className="relative flex w-full h-full px-4 py-5 flex-col items-center justify-center gap-1 transition-transform active:scale-95"
                                >
                                  <span className="inline-block font-tibetan font-normal text-[2.25rem] leading-none pt-1" style={{ color: ["#7c3aed", "#0369a1", "#0891b2", "#0284c7"][i] }}>
                                    {cell.word}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-ink-muted">[{cell.read}]</span>
                                  {isCellPlaying && (
                                    <Loader2 size={14} className="absolute top-2.5 right-2.5 animate-spin text-brand-dark" />
                                  )}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </StepContainer>

          {/* Step 4: Post-suffixes */}
          <StepContainer index={4} step={WEB_STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">Only two letters — <span className="font-tibetan font-normal text-xl text-ink">ད</span> and <span className="font-tibetan font-normal text-xl text-ink">ས</span> — may sit <em>after</em> a suffix, becoming the very last letter of the word. They are <span className="font-bold text-ink">silent</span> — they don’t change how the word is pronounced.</p>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-0 flex flex-col h-full rounded-[1.5rem] overflow-hidden">
                <div className="flex items-center gap-4 border-b border-border-strong bg-surface-muted px-6 py-5">
                  <History className="size-5 text-fuchsia-700" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-700">Historical</div>
                    <div className="font-serif text-xl font-bold flex items-baseline gap-1.5">
                      <span>Post-suffix</span>
                      <span className="font-tibetan font-normal text-3xl text-fuchsia-600 leading-none">ད</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light mb-6"><span className="font-tibetan font-normal text-xl text-ink">ད</span> is <span className="text-ink">no longer written</span> in modern Tibetan spelling. Grammatically, words still behave <em>as if</em> the <span className="font-tibetan font-normal text-xl text-ink">ད</span> were present.</p>
                  <div className="mt-auto border border-border-strong overflow-hidden rounded-2xl">
                    <table className="w-full text-xs">
                      <thead className="bg-surface-muted border-b border-border-strong">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest">Former</th>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest border-l border-border-strong">Current</th>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest border-l border-border-strong">Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-strong">
                        {[
                          ["སྒྱུརད་", "སྒྱུར་", "to change / translate"], 
                          ["ཕྱིནད་", "ཕྱིན་", "went"], 
                          ["སྐྱོནད་", "སྐྱོན་", "flaw"]
                        ].map((r) => (
                          <tr key={r[0]} className="hover:bg-surface-muted transition-colors">
                            <td className="px-4 py-3">
                              <button onClick={() => playAudio(r[0])} disabled={playingItem !== null} className="group flex items-center gap-2 text-ink-muted hover:text-fuchsia-600 transition-colors">
                                <span className="font-tibetan font-normal not-italic text-[1.5rem] leading-none pt-1">{r[0]}</span>
                                {playingItem === r[0] ? <Loader2 size={12} className="animate-spin text-fuchsia-600" /> : <Volume2 size={12} className="opacity-0 group-hover:opacity-100" />}
                              </button>
                            </td>
                            <td className="px-4 py-3 border-l border-border-strong">
                              <button onClick={() => playAudio(r[1])} disabled={playingItem !== null} className="group flex items-center gap-2 text-ink hover:text-fuchsia-600 transition-colors">
                                <span className="font-tibetan font-normal not-italic text-[1.5rem] leading-none pt-1">{r[1]}</span>
                                {playingItem === r[1] ? <Loader2 size={12} className="animate-spin text-fuchsia-600" /> : <Volume2 size={12} className="opacity-0 group-hover:opacity-100" />}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-[13px] font-bold text-ink-light border-l border-border-strong">{r[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>

              <Card className="p-0 flex flex-col h-full rounded-[1.5rem] overflow-hidden">
                <div className="flex items-center gap-4 border-b border-border-strong bg-surface-muted px-6 py-5">
                  <CheckCircle2 className="size-5 text-sky-700" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">Still in use</div>
                    <div className="font-serif text-xl font-bold flex items-baseline gap-1.5">
                      <span>Post-suffix</span>
                      <span className="font-tibetan font-normal text-3xl text-sky-600 leading-none">ས</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light mb-6"><span className="font-tibetan font-normal text-xl text-ink">ས</span> is <span className="text-ink">still written</span> today. Its role is to differentiate near-identical words. The pronunciation is <span className="text-ink">the same</span> with or without it.</p>
                  <div className="mt-auto border border-border-strong overflow-hidden rounded-2xl">
                    <table className="w-full text-xs">
                      <thead className="bg-surface-muted border-b border-border-strong">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                              WITHOUT <span className="font-tibetan font-normal text-xl normal-case pt-1">ས</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest border-l border-border-strong">
                            <div className="flex items-center gap-1.5">
                              WITH <span className="font-tibetan font-normal text-xl normal-case pt-1">ས</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest border-l border-border-strong">Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-strong">
                        {[
                          ["མངག་", "མངགས་", "dispatches → dispatched"], 
                          ["གང་", "གངས་", "what(ever) → snow"], 
                          ["ཐབ་", "ཐབས་", "stove → method"]
                        ].map((r) => (
                          <tr key={r[0]} className="hover:bg-surface-muted transition-colors">
                            <td className="px-4 py-3">
                              <button onClick={() => playAudio(r[0])} disabled={playingItem !== null} className="group flex items-center gap-2 text-ink-muted hover:text-sky-600 transition-colors">
                                <span className="font-tibetan font-normal not-italic text-[1.5rem] leading-none pt-1">{r[0]}</span>
                                {playingItem === r[0] ? <Loader2 size={12} className="animate-spin text-sky-600" /> : <Volume2 size={12} className="opacity-0 group-hover:opacity-100" />}
                              </button>
                            </td>
                            <td className="px-4 py-3 border-l border-border-strong">
                              <button onClick={() => playAudio(r[1])} disabled={playingItem !== null} className="group flex items-center gap-2 text-ink hover:text-sky-600 transition-colors">
                                <span className="font-tibetan font-normal not-italic text-[1.5rem] leading-none pt-1">{r[1]}</span>
                                {playingItem === r[1] ? <Loader2 size={12} className="animate-spin text-sky-600" /> : <Volume2 size={12} className="opacity-0 group-hover:opacity-100" />}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-[13px] font-bold text-ink-light border-l border-border-strong">{r[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-12 border border-border-strong bg-surface-muted p-6 md:p-8 rounded-[1.5rem]">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="size-5 text-sky-700" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Post-Suffix Mastery Check</span>
              </div>
              <QuizModule 
                moduleId={6}
                title="Mastery Check · Post-Suffixes"
                variant="panel"
                accentColor="#0369a1"
                questions={postSuffixQuestions} 
                playAudio={playAudio} 
                playingItem={playingItem} 
                playErrorBeep={playErrorBeep} 
              />
            </div>
          </StepContainer>

          {/* Step 5: How to recognise the root letter */}
          <StepContainer index={5} step={WEB_STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">Now that words can stretch to four horizontal letters, the eye needs a strategy. With practice, finding the root becomes automatic.</p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { n: "1", rule: "If a letter carries a vowel, superscript, or subscript — it is the root.", words: ["དགེ་", "བཞི་", "འགྲོ་", "བསྒྲིམས་"] },
                { n: "2", rule: "Two bare letters (no vowel, super-/subscript) — the first is the root.", words: ["ཁང་", "ནད་", "ལམ་", "རབ་"] },
                { n: "3", rule: "Three bare letters — the middle is the root, unless the third is post-suffix ད / ས, in which case the first is the root.", words: ["གསལ་", "དཀར་", "ཁམས་", "གངས་"] },
                { n: "4", rule: "Four letters — the second is always the root.", words: ["མངགས་", "བདགས་", "དམངས་"] },
              ].map((r) => (
                <Card key={r.n} className="p-6 bg-surface flex flex-col h-full rounded-[1.5rem]">
                  <div className="mb-6 inline-flex items-center gap-3 bg-brand-light/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-brand-dark self-start shadow-sm border border-amber-200 rounded-full">
                    <span className="grid size-5 place-items-center rounded-full bg-brand text-white">{r.n}</span>
                    Rule {r.n}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-tibetan font-normal text-3xl lg:text-[2rem] leading-normal text-ink mb-6">
                    {r.words.map((w) => (
                      <button key={w} onClick={() => playAudio(w)} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem] shadow-sm bg-white rounded-2xl">
                        {w}
                      </button>
                    ))}
                  </div>
                  <p className="mt-auto text-[13px] font-bold leading-relaxed text-ink-light border-t border-border-strong pt-4">{renderTibetanText(r.rule)}</p>
                </Card>
              ))}
            </div>

            <div className="mt-12 border border-border-strong bg-surface-muted p-6 md:p-8 rounded-[1.5rem]">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="size-5 text-brand-dark" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Root Letter Mastery Check</span>
              </div>
              <QuizModule 
                moduleId={6}
                title="Mastery Check · Root Letters"
                variant="panel"
                accentColor="var(--color-brand-dark)"
                questions={rootLetterQuestions} 
                playAudio={playAudio} 
                playingItem={playingItem} 
                playErrorBeep={playErrorBeep} 
              />
            </div>
          </StepContainer>

          {/* Step 6: Vocabulary built from suffixes */}
          <StepContainer index={6} step={WEB_STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
            <div className="mb-10">
              <VocabGrid 
                items={VOCAB.map(v => ({
                  tib: v.tib, pron: `[${v.read}]`, en: v.en, emoji: v.emoji, groupId: v.suffix,
                  accentHex: SUFFIXES.find(s => s.key === v.suffix)?.accent
                }))}
                groups={SUFFIXES.filter(s => VOCAB.some(v => v.suffix === s.key)).map(s => ({ 
                  id: s.key, label: s.latin, hex: s.accent 
                }))}
                playAudio={playAudio}
                playingItem={playingItem}
              />
            </div>
            
            <QuizModule
              moduleId={6}
              title="Mastery Check · Vocabulary" 
              intro="Check your memory of the new suffix words before moving on. This check tests all vocabulary words." 
              questions={vocabQuestions} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} 
            />
          </StepContainer>

          {/* Step 7: Practice & exercises */}
          <StepContainer index={7} step={WEB_STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => markComplete(7)}>
             <p className="mb-6 max-w-3xl text-[15px] text-ink-light leading-relaxed">
               Each suffix has its own <span className="font-bold text-ink">mastery check</span> inside its panel above. Below is a <span className="font-bold text-ink">cumulative review</span> mixing all ten suffixes and vocabulary words.
             </p>
             <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 8: Final Test */}
          <StepContainer index={8} step={WEB_STEPS[8]} status={statusOf(8)} isExpanded={expandedStep === 8} onToggle={() => toggleStep(8)} onContinue={() => markComplete(8)} isLast>
            <QuizModule 
              moduleId={6}
              title="Final Test" 
              intro="40 questions drawn from everything you covered in this lesson. Score 80% or higher to unlock the Beginner 1 Capstone Assessment." 
              questions={quizQuestions} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} 
              isUnlockTest={true} nextLessonPath="/dashboard/lessons/7" onPass={() => markComplete(8)} 
            />
          </StepContainer>

        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/5" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          {expandedStep !== WEB_STEPS.length - 1 && (
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}>
              <CheckCircle2 size={18} /> Mark step complete
            </Button>
          )}
          <Link href="/dashboard/lessons/7" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
            Next: Capstone <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuffixPanel({ s, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className="relative overflow-hidden border transition-colors duration-500 rounded-[1.5rem] border-border-strong bg-surface">
      <div className="h-1.5 w-full" style={{ backgroundColor: s.accent }} />
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-tibetan font-normal text-[4rem] leading-none pt-1 rounded-[1.25rem]" style={{ backgroundColor: `${s.accent}15`, color: s.accent }}>{s.head}</div>
          <div>
            <div className="text-eyebrow mb-2">Suffix · {FAMILY_META[s.family as Family].label}</div>
            <div className="font-serif text-3xl font-bold">{s.latin}</div>
            <div className="text-sm mt-2 font-bold text-ink-light">Reads as <span style={{ color: s.accent }}>{s.reads}</span></div>
          </div>
        </div>
        <div>
          <p className="text-[15px] leading-relaxed p-5 border rounded-2xl bg-surface-muted border-border-strong text-ink-light">
            {renderTibetanText(s.hint)}
          </p>
          {s.note && (
            <div className="mt-4 flex items-start gap-3 border-l-4 px-4 py-3 text-sm font-bold rounded-r-xl border-y border-r border-border-strong text-ink-light bg-brand-light/50" style={{ borderLeftColor: '#f59e0b' }}>
              <Info className="mt-0.5 size-4 shrink-0 text-brand" /><span>{renderTibetanText(s.note)}</span>
            </div>
          )}
          {s.vowelShift && (
            <div className="mt-4 flex items-start gap-3 border-l-4 px-4 py-3 text-sm font-bold rounded-r-xl border-y border-r border-border-strong text-ink-light bg-sky-50/50" style={{ borderLeftColor: '#0ea5e9' }}>
              <Sparkles className="mt-0.5 size-4 shrink-0 text-sky-500" /><span>{renderTibetanText(s.vowelShift)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b sm:grid-cols-3 border-border-strong bg-border-strong">
        {s.examples.map((ex: any) => (
          <button key={ex.word} onClick={() => playAudio(ex.word)} disabled={playingItem !== null} className="group relative flex flex-col items-center justify-center gap-1.5 p-6 transition-colors bg-surface hover:bg-surface-muted">
            <span className="absolute left-0 top-0 h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: s.accent }} />
            <span className="font-tibetan font-normal text-[2.5rem] leading-normal pb-2 mb-1 text-[#1c1917]">{ex.word}</span>
            <span className="font-mono text-xs font-bold text-ink-light">[{ex.read}]</span>
            {ex.gloss && <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{ex.gloss}</span>}
            {playingItem === ex.word && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8 border-b border-border-strong bg-surface">
        <div className="text-eyebrow mb-6">Spelling walkthrough</div>
        <div className="space-y-2">
          {s.examples.map((ex: any) => (
            <div key={ex.word} className="flex flex-wrap items-center gap-x-4 gap-y-3 border px-5 py-4 rounded-2xl border-border-strong bg-surface shadow-sm">
              <span className="font-tibetan font-normal text-[2.5rem] leading-normal pb-2 w-20 sm:w-24 shrink-0 text-left text-ink text-[#1c1917]">{ex.word}</span>
              <SpellingFormula parts={ex.parts} />
              <ArrowRight size={16} className="text-border-strong" />
              <div className="flex items-center gap-2">
                <span className="font-tibetan font-normal text-3xl leading-none pt-1" style={{ color: s.accent }}>{ex.word}</span>
                <span className="font-mono text-lg font-bold text-ink">[{ex.read}]</span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <Button variant="outline" onClick={() => playAudio(ex.word + " spelling")} disabled={playingItem !== null} className="px-4 py-2 rounded-full">
                  {playingItem === (ex.word + " spelling") ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className="text-brand-dark" />} Spelling Audio
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 bg-surface-muted">
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: s.accent }} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Mastery check · Suffix {s.latin}</span>
        </div>
        <SuffixMiniMasteryLoader key={s.key} s={s} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function SuffixMiniMasteryLoader({ s, playAudio, playingItem, playErrorBeep }: any) {
  const [seed] = useState(0);

  const questions = useMemo(() => {
    const shuffled = [...s.examples].sort(() => 0.5 - Math.random());
    return shuffled.map((answer: any) => {
      const allOtherExamples = SUFFIXES.flatMap(x => x.examples).filter(x => x.word !== answer.word);
      const wrongs = allOtherExamples.sort(() => 0.5 - Math.random()).slice(0, 3);
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
  }, [s.key, seed]);

  return (
    <QuizModule 
      key={`suffix-quiz-${s.key}-${seed}`}
      moduleId={6}
      title={`Mastery Check · Suffix ${s.latin}`}
      variant="panel"
      accentColor={s.accent}
      questions={questions}
      playAudio={playAudio}
      playingItem={playingItem}
      playErrorBeep={playErrorBeep}
    />
  );
}