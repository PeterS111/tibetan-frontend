// app/dashboard/lessons/6/page.tsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowRight, Info, CheckCircle2, 
  Moon, Sun, BookOpen, Loader2, Shuffle, History, Sparkles
} from "lucide-react";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- Data ---
import { SUFFIXES, VOCAB, QUIZ, STEPS, FAMILY_META, type SuffixKey } from "@/app/data/lesson6";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

export default function SuffixesLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(STEPS.length);

  const [activeTab, setActiveTab] = useState<SuffixKey>("ga");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  const [reveal, setReveal] = useState<null | "ten" | "two">(null);

  // Map to Generic Practice Suite Format
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

  // Generate dynamic questions for the Final Step Test
  const quizQuestions = useMemo(() => {
    const qs = [];
    
    // Vocab Questions
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

    // Suffix Reading questions
    const cTargets = [...QUIZ].sort(() => 0.5 - Math.random()).slice(0, 6);
    for (const c of cTargets) {
      const wrongs = QUIZ.filter(x => x.read !== c.read).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'combo',
        questionText: "What does this word read?",
        prominentTibetan: c.word,
        answer: c.read,
        audioString: c.word,
        choices: [c, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ label: `[${x.read}]`, value: x.read }))
      });
    }

    return qs.sort(() => 0.5 - Math.random());
  }, []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Lessons</Link>
          <ChevronRight size={14} />
          <span>Unit 06</span>
          <ChevronRight size={14} />
          <span className="text-ink">Suffixes & Post-suffixes</span>
        </div>

        {/* Hero */}
        <Card className="mb-12 grid gap-8 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <div className="mb-3 text-eyebrow text-brand-dark">Lesson 06 · Foundations</div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight tracking-tight">
              Suffixes & Post-suffixes
            </h1>
            <p className="mt-2 font-serif text-2xl italic text-ink-light">རྗེས་འཇུག་བཅུ་དང་ཡང་འཇུག་གཉིས།</p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Ten letters may follow the root — the <span className="font-bold text-ink">suffix</span> closes the syllable. A further <span className="font-bold text-ink">two</span> may sit beyond that suffix as a <span className="font-bold text-ink">post-suffix</span>. Together they shape the reading, the tense, and often the meaning of a word.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
              <Button variant="outline" onClick={() => setReveal((r) => (r === "ten" ? null : "ten"))} className={reveal === "ten" ? "bg-brand-light text-brand-dark border-amber-300" : ""}>
                10 suffixes
              </Button>
              <Button variant="outline" onClick={() => setReveal((r) => (r === "two" ? null : "two"))} className={reveal === "two" ? "bg-brand-light text-brand-dark border-amber-300" : ""}>
                2 post-suffixes
              </Button>
            </div>

            {reveal === "ten" && (
              <div className="mt-4 flex flex-wrap gap-2 border border-border-strong bg-surface-muted p-4 shadow-inner">
                {SUFFIXES.map((x) => (
                  <button key={x.key} onClick={() => { setActiveTab(x.key); markComplete(0); playAudio(x.head); }} className="flex items-center gap-2 border border-border-strong bg-surface px-3 py-2 transition hover:border-brand shadow-sm text-left">
                    <span className="font-serif leading-none text-2xl" style={{ color: x.accent }}>{x.head}</span>
                    <span className="text-[10px] uppercase tracking-widest text-ink-muted font-bold">{x.latin}</span>
                  </button>
                ))}
              </div>
            )}
            {reveal === "two" && (
              <div className="mt-4 flex flex-wrap gap-4 border border-border-strong bg-surface-muted p-4 shadow-inner">
                <button onClick={() => playAudio('ད')} className="flex items-center gap-4 border border-border-strong bg-surface px-5 py-3 shadow-sm text-left hover:border-brand transition-colors">
                  <span className="font-serif leading-none text-3xl text-fuchsia-600">ད</span>
                  <div>
                    <div className="text-xs font-bold text-ink">da · historical</div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-muted font-bold">silent · classical only</div>
                  </div>
                </button>
                <button onClick={() => playAudio('ས')} className="flex items-center gap-4 border border-border-strong bg-surface px-5 py-3 shadow-sm text-left hover:border-brand transition-colors">
                  <span className="font-serif leading-none text-3xl text-sky-600">ས</span>
                  <div>
                    <div className="text-xs font-bold text-ink">sa · modern</div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-muted font-bold">silent · still written</div>
                  </div>
                </button>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-72">
            <div className="mb-3 flex items-center justify-between text-eyebrow">
              <span>Lesson progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, STEPS.length)} of {STEPS.length} sections</span>
            </div>
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden mb-6">
              <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {SUFFIXES.map((x) => (
                <button
                  key={x.key}
                  onClick={() => { setActiveTab(x.key); markComplete(0); playAudio(x.head); }}
                  className={`aspect-square border p-2 text-center transition-colors ${activeTab === x.key ? "border-amber-400 bg-brand-light" : "border-border-strong hover:bg-surface-muted hover:border-amber-300 bg-surface"}`}
                >
                  <div className="font-serif leading-none text-2xl" style={{ color: x.accent }}>{x.head}</div>
                  <div className="mt-1 text-[9px] uppercase tracking-widest text-ink-muted font-bold">{x.latin}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          
          {/* Step 01: What is a suffix? */}
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <ArrowRight size={14} /> After the root
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  A suffix — <span className="italic font-serif text-lg">རྗེས་འཇུག</span> — is a letter written <span className="font-bold text-ink">immediately after</span> the root. Only ten letters may take this seat.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <BookOpen size={14} /> Writing
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  Any consonant — even itself — may be followed by a suffix (e.g. <span className="font-serif text-lg">དད་</span>). Suffix <span className="font-serif text-lg">འ</span> is special: it may only appear when the root also carries a prefix.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <Volume2 size={14} /> Pronunciation
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  A suffix closes the syllable. Four of them — <span className="font-serif font-bold text-lg">ད ན ལ ས</span> — recolour the preceding vowel into a fronted <em>[e / ü / ö]</em>.
                </p>
              </Card>
            </div>

            <div className="mt-6 border border-border-strong bg-surface overflow-hidden">
              <div className="grid grid-cols-5 divide-x divide-y sm:divide-y-0 divide-border-strong md:grid-cols-10">
                {SUFFIXES.map((x) => (
                  <button key={x.key} onClick={() => { setActiveTab(x.key); markComplete(0); playAudio(x.head); }} className={`group flex flex-col items-center gap-1 p-4 transition-colors hover:bg-surface-muted ${activeTab === x.key ? "bg-amber-50/50" : ""}`}>
                    <span className="h-1 w-8" style={{ backgroundColor: x.accent }} />
                    <span className="mt-1 font-tibetan text-3xl" style={{ color: x.accent }}>{x.head}</span>
                    <span className="text-xs font-bold text-ink">{x.latin}</span>
                    <span className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">{x.reads}</span>
                  </button>
                ))}
              </div>
            </div>
          </StepContainer>

          {/* Step 02: Meet the ten suffixes */}
          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-border-strong pb-4 gap-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[1].title}</h2>
              <Button variant="outline" onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))} className="text-[10px] uppercase tracking-widest px-3 py-1.5">
                {studyMode === "paper" ? <Moon size={14} /> : <Sun size={14} />} {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </Button>
            </div>

            <div className={`border transition-colors duration-500 ${studyMode === "night" ? "bg-stone-900 text-white border-white/10" : "bg-surface border-border-strong"}`}>
              <div className={`grid grid-cols-5 md:grid-cols-10 divide-x border-b ${studyMode === "night" ? "divide-white/10 border-white/10" : "divide-border-strong border-border-strong"}`}>
                {SUFFIXES.map((x) => {
                  const isActive = activeTab === x.key;
                  return (
                    <button key={x.key} onClick={() => { setActiveTab(x.key); playAudio(x.head); }} className={`flex flex-col items-center gap-1 px-2 py-4 text-center transition-colors ${studyMode === "night" ? "hover:bg-white/5" : "hover:bg-surface-muted"} ${isActive ? (studyMode === "night" ? "bg-white/10" : "bg-brand-light") : ""}`}>
                      <span className="h-1 w-8" style={{ backgroundColor: x.accent }} />
                      <span className="mt-1 font-serif leading-none text-[2rem]" style={{ color: x.accent }}>{x.head}</span>
                      <span className="text-[11px] font-bold">{x.latin}</span>
                      <span className={`text-[9px] uppercase tracking-widest font-bold ${studyMode === "night" ? "text-stone-400" : "text-ink-muted"}`}>{x.reads}</span>
                    </button>
                  );
                })}
              </div>

              {(() => {
                const s = SUFFIXES.find(x => x.key === activeTab)!;
                return (
                  <div className="p-6 md:p-10">
                    <div className="flex flex-wrap items-end gap-6">
                      <div className="font-serif leading-none text-[8rem]" style={{ color: s.accent }}>{s.head}</div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: s.accent }}>{FAMILY_META[s.family].label}</div>
                        <div className="font-serif text-3xl font-bold">{s.latin}</div>
                        <div className={`text-sm mt-2 font-bold ${studyMode === "night" ? "text-stone-300" : "text-ink-light"}`}>
                          Reads as <span style={{ color: s.accent }}>{s.reads}</span>
                        </div>
                      </div>
                      <Button variant="outline" className={`ml-auto px-4 py-2 ${studyMode === "night" ? "border-white/20 hover:bg-white/10" : ""}`} onClick={() => playAudio(s.examples[0]?.word || s.head)} disabled={playingItem !== null}>
                        {playingItem === (s.examples[0]?.word || s.head) ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} />} Play
                      </Button>
                    </div>

                    <p className={`mt-6 text-[15px] leading-relaxed font-bold ${studyMode === "night" ? "text-stone-300" : "text-ink-light"}`}>
                      {s.hint}
                    </p>

                    {s.note && (
                      <div className={`mt-4 flex items-start gap-3 border-l-2 px-4 py-3 text-sm font-bold ${studyMode === "night" ? "border-white/30 text-stone-300 bg-white/5" : "border-amber-400 text-ink-light bg-brand-light/50"}`}>
                        <Info className="mt-0.5 size-4 shrink-0 text-brand" />
                        <span>{s.note}</span>
                      </div>
                    )}

                    {s.vowelShift && (
                      <div className={`mt-4 flex items-start gap-3 border-l-2 px-4 py-3 text-sm font-bold ${studyMode === "night" ? "border-sky-400 text-stone-300 bg-sky-900/20" : "border-sky-500 text-ink-light bg-sky-50/50"}`}>
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-sky-500" />
                        <span>{s.vowelShift}</span>
                      </div>
                    )}

                    <div className="mt-10">
                      <div className={`mb-4 text-eyebrow ${studyMode === "night" ? "text-stone-400" : ""}`}>Examples</div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {s.examples.map((ex) => (
                          <button key={ex.word} onClick={() => playAudio(ex.word)} disabled={playingItem !== null} className={`group flex flex-col items-start gap-1 border p-5 text-left transition-colors ${studyMode === "night" ? "border-white/10 hover:bg-white/5" : "border-border-strong hover:bg-surface-muted shadow-sm"}`}>
                            <span className="font-tibetan text-[2.5rem] leading-none text-ink" style={{ color: studyMode === "night" ? "#fff" : "inherit" }}>{ex.word}</span>
                            <span className="mt-2 text-sm font-bold" style={{ color: s.accent }}>[{ex.read}]</span>
                            {ex.gloss && <span className={`text-xs font-bold ${studyMode === "night" ? "text-stone-400" : "text-ink-light"}`}>{ex.gloss}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </StepContainer>

          {/* Step 03: Vowel Shift Table */}
          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[2].title}</h2>
            </div>
            <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-light">
              Four suffixes — <span className="font-serif font-bold text-ink">ད ན ལ ས</span> — recolour the vowel that precedes them. Find a vowel on the left, follow the row across, and hear how each suffix reshapes it.
            </p>

            <div className="border border-border-strong bg-surface shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="bg-surface-muted border-b border-border-strong">
                      <th className="w-32 px-5 py-4 text-left text-eyebrow">Vowel</th>
                      {[
                        { suf: "ལ", latin: "la", accent: "#7c3aed", family: "keeps [l]" },
                        { suf: "ན", latin: "na", accent: "#0369a1", family: "keeps [n]" },
                        { suf: "ད", latin: "da", accent: "#0891b2", family: "silent · fronts vowel" },
                        { suf: "ས", latin: "sa", accent: "#0284c7", family: "silent · fronts vowel" },
                      ].map((c) => (
                        <th key={c.suf} className="border-l border-border-strong px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="font-serif leading-none text-3xl" style={{ color: c.accent }}>{c.suf}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.accent }}>{c.latin}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">{c.family}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-strong">
                    {[
                      { vowel: "ི", label: "[i]", cells: ["[il]", "[in]", "[i]", "[i]"] },
                      { vowel: "ུ", label: "[u]", cells: ["[ül]", "[ün]", "[ü]", "[ü]"] },
                      { vowel: "ེ", label: "[e]", cells: ["[el]", "[en]", "[e]", "[e]"] },
                      { vowel: "ོ", label: "[o]", cells: ["[öl]", "[ön]", "[ö]", "[ö]"] },
                    ].map((r) => (
                      <tr key={r.label} className="hover:bg-surface-muted transition-colors">
                        <td className="px-5 py-5 border-r border-border-strong">
                          <div className="flex items-center gap-4">
                            <span className="font-serif leading-none text-[2rem] text-brand">{r.vowel}</span>
                            <span className="text-[15px] font-bold text-ink">{r.label}</span>
                          </div>
                        </td>
                        {r.cells.map((cell, i) => (
                          <td key={i} className="border-l border-border-strong px-4 py-5 text-center">
                            <span className="inline-block font-mono text-lg font-bold" style={{ color: ["#7c3aed", "#0369a1", "#0891b2", "#0284c7"][i] }}>{cell}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-strong border-t border-border-strong">
                <div className="p-6 bg-surface-muted">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-1 w-8" style={{ backgroundColor: "#7c3aed" }} />
                    <span className="text-eyebrow text-ink-light">ལ · ན — closing consonant heard</span>
                  </div>
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light">
                    The suffix keeps its own sound as a soft [l] or [n], and the vowel fronts to match.
                  </p>
                </div>
                <div className="p-6 bg-surface-muted">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-1 w-8" style={{ backgroundColor: "#0284c7" }} />
                    <span className="text-eyebrow text-ink-light">ད · ས — silent, vowel only</span>
                  </div>
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light">
                    Both letters drop out of pronunciation. Only the fronted vowel remains.
                  </p>
                </div>
              </div>
            </div>
          </StepContainer>

          {/* Step 04: Post-suffixes */}
          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-1">
                The two post-suffixes <span className="font-serif italic text-ink-muted ml-2">ཡང་འཇུག་གཉིས།</span>
              </h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">
              Only two letters — <span className="font-serif font-bold text-ink">ད</span> and <span className="font-serif font-bold text-ink">ས</span> — may sit <em>after</em> a suffix, becoming the very last letter of the word. They are <span className="font-bold text-ink">silent</span> — they don’t change how the word is pronounced.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-0 flex flex-col h-full">
                <div className="flex items-center gap-4 border-b border-border-strong bg-surface-muted px-6 py-5">
                  <History className="size-5 text-fuchsia-700" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-700">Historical</div>
                    <div className="font-serif text-xl font-bold">Post-suffix <span className="text-3xl text-fuchsia-600 ml-1">ད</span></div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light mb-6">
                    <span className="font-serif text-lg">ད</span> is <span className="text-ink">no longer written</span> in modern Tibetan spelling. Grammatically, words still behave <em>as if</em> the ད were present.
                  </p>
                  <div className="mt-auto border border-border-strong overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-surface-muted border-b border-border-strong">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest">Former</th>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest border-l border-border-strong">Modern</th>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest border-l border-border-strong">Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-strong">
                        {[
                          ["སྒྱུརད་", "སྒྱུར་", "to change / translate"],
                          ["ཕྱིནད་", "ཕྱིན་", "went"],
                          ["སྐྱོནད་", "སྐྱོན་", "flaw"],
                        ].map((r) => (
                          <tr key={r[0]} className="hover:bg-surface-muted">
                            <td className="px-4 py-3 font-serif text-[1.3rem] text-ink-muted">{r[0]}</td>
                            <td className="px-4 py-3 font-serif text-[1.3rem] text-ink border-l border-border-strong">{r[1]}</td>
                            <td className="px-4 py-3 text-[13px] font-bold text-ink-light border-l border-border-strong">{r[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>

              <Card className="p-0 flex flex-col h-full">
                <div className="flex items-center gap-4 border-b border-border-strong bg-surface-muted px-6 py-5">
                  <CheckCircle2 className="size-5 text-sky-700" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">Modern</div>
                    <div className="font-serif text-xl font-bold">Post-suffix <span className="text-3xl text-sky-600 ml-1">ས</span></div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light mb-6">
                    <span className="font-serif text-lg">ས</span> is <span className="text-ink">still written</span> today. Its role is to differentiate near-identical words. The pronunciation is <span className="text-ink">the same</span> with or without it.
                  </p>
                  <div className="mt-auto border border-border-strong overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-surface-muted border-b border-border-strong">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest">Without</th>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest border-l border-border-strong">With ས</th>
                          <th className="px-4 py-3 text-left font-bold text-ink-muted uppercase tracking-widest border-l border-border-strong">Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-strong">
                        {[
                          ["མངག་", "མངགས་", "dispatches → dispatched"],
                          ["གང་", "གངས་", "what(ever) → snow"],
                          ["ཐབ་", "ཐབས་", "stove → method"],
                        ].map((r) => (
                          <tr key={r[0]} className="hover:bg-surface-muted">
                            <td className="px-4 py-3 font-serif text-[1.3rem] text-ink-muted">{r[0]}</td>
                            <td className="px-4 py-3 font-serif text-[1.3rem] text-ink border-l border-border-strong">{r[1]}</td>
                            <td className="px-4 py-3 text-[13px] font-bold text-ink-light border-l border-border-strong">{r[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>
          </StepContainer>

          {/* Step 05: Root Letter Recognition */}
          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[4].title}</h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">
              Now that words can stretch to four horizontal letters, the eye needs a strategy. With practice, finding the root becomes automatic.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { n: "1", rule: "If a letter carries a vowel, superscript, or subscript — it is the root.", ex: "དགུ · བསྐུལ · བཟུང · བསྒྲིགས" },
                { n: "2", rule: "Two bare letters (no vowel, super-/subscript) — the first is the root.", ex: "ཁང · ནག · གར · ཞབ · ལམ" },
                { n: "3", rule: "Three bare letters — the middle is the root, unless the third is post-suffix ད / ས, in which case the first is the root.", ex: "གསལ · གཡག · དཀར · ཁམས · ནགས · ཆགས" },
                { n: "4", rule: "Four letters — the second is always the root.", ex: "བདགས · བཙུགས · དམངས" },
              ].map((r) => (
                <Card key={r.n} className="p-6 flex flex-col">
                  <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                    <span className="grid size-6 place-items-center rounded bg-brand-light text-brand-dark">{r.n}</span>
                    Rule {r.n}
                  </div>
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light flex-1">{r.rule}</p>
                  <div className="mt-6 font-serif text-[2rem] leading-none text-ink pt-4 border-t border-border-strong">{r.ex}</div>
                </Card>
              ))}
            </div>
          </StepContainer>

          {/* Step 06: Vocabulary */}
          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[5].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2 py-1 border border-border-strong">{VOCAB.length} words</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {VOCAB.map((v) => (
                <button key={v.tib} onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="group relative flex flex-col items-start gap-3 border border-border-strong bg-surface p-5 text-left transition hover:-translate-y-1 hover:shadow-md">
                  <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: SUFFIXES.find(s => s.key === v.suffix)?.accent || "#000" }} />
                  <div className="flex w-full items-start justify-between">
                    <span className="text-3xl">{v.emoji}</span>
                    {playingItem === v.tib ? <Loader2 size={14} className="animate-spin text-brand" /> : <Volume2 size={14} className="text-ink-muted group-hover:text-brand transition-colors" />}
                  </div>
                  <div className="font-tibetan text-[2rem] leading-none text-ink mt-2">{v.tib}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">[{v.read}]</div>
                  <div className="text-sm font-bold text-ink-light mt-1 border-t border-border-strong pt-3 w-full">{v.en}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 border border-border-strong bg-surface-muted p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="size-5 text-brand-dark" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Vocab Mastery Check</span>
              </div>
              <VocabMiniMastery playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
            </div>
          </StepContainer>

          {/* Step 07: Cumulative Practice */}
          <StepContainer index={6} step={STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
             <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 08: Final Test */}
          <StepContainer index={7} step={STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => {}} isLast>
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: Capstone." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/7" 
            />
          </StepContainer>

        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function VocabMiniMastery({ playAudio, playingItem, playErrorBeep }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = useMemo(() => {
    const answer = VOCAB[step % VOCAB.length];
    const others = VOCAB.filter((v: any) => v.tib !== answer.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...others, answer].sort(() => 0.5 - Math.random());
    return { answer, choices };
  }, [step]);

  const total = 6;
  const pick = (read: string) => {
    if (picked) return;
    setPicked(read);
    if (read === question.answer.read) { setScore(s => s + 1); playAudio(question.answer.tib); } else { playErrorBeep(); }
  };

  if (step >= total) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border border-border-strong bg-surface">
        <div className="text-[15px] font-bold text-ink">
          Nicely done. You scored <span className="font-serif text-2xl mx-1 text-brand-dark">{score}</span> / {total}.
        </div>
        <Button variant="outline" onClick={() => { setStep(0); setScore(0); setPicked(null); }}>
          <Shuffle size={14} /> Try again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-eyebrow text-ink-muted">
        <span>Question {step + 1} of {total}</span>
        <span className="text-brand-dark">Score {score}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="text-[15px] font-bold text-ink-light">How does</span>
        <span className="font-tibetan text-3xl font-bold border border-border-strong bg-surface px-4 py-2 text-ink">{question.answer.tib}</span>
        <span className="text-[15px] font-bold text-ink-light">read?</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.choices.map((c: any) => {
          const right = picked && c.read === question.answer.read;
          const wrong = picked === c.read && c.read !== question.answer.read;
          return (
            <button
              key={c.read} disabled={!!picked && c.read !== question.answer.read} 
              onClick={() => { if (!picked) { pick(c.read); } else if (c.read === question.answer.read) { playAudio(question.answer.tib); } }}
              className={`flex items-center justify-center border-2 font-mono font-bold text-xl py-6 transition-all ${
                right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm cursor-pointer hover:bg-emerald-100" 
                : wrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60" 
                : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light text-ink hover:shadow-md"
              }`}
            >
              {c.read}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border-strong bg-surface shadow-sm">
          <span className={`text-sm font-bold ${picked === question.answer.read ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === question.answer.read ? `Correct!` : `Answer: ${question.answer.tib} reads [${question.answer.read}].`}
          </span>
          <Button variant="primary" onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto">
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}