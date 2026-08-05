"use client";

import { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowUp, ArrowDown, 
  Info, Moon, Sun, Volume2, Loader2, X, CheckCircle2
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { VOWELS, VOCAB, STEPS, POSITION_META, type Vowel, type Position } from "@/app/data/lesson2";

import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

export default function VowelsLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(STEPS.length);

  const [selected, setSelected] = useState<{ v: Vowel, rect: DOMRect } | null>(null);
  const [filter, setFilter] = useState<"all" | Position>("all");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");

  const filtered = useMemo(() => (filter === "all" ? VOWELS : VOWELS.filter((v) => v.position === filter)), [filter]);

  const practiceGroups = useMemo(() => [
    {
      name: "Vowels",
      items: VOWELS.map(v => ({
        id: `v-${v.key}`, tibetan: v.tib, reading: v.markGloss, english: POSITION_META[v.position].label, audioTarget: v.translit
      }))
    },
    {
      name: "Vocabulary",
      // CACHE BUSTER UPDATE HERE: Use v.audio if it exists
      items: VOCAB.map(v => ({
        id: `voc-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.audio || v.tib, emoji: v.emoji
      }))
    }
  ], []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Steps</Link>
          <ChevronRight className="size-3" />
          <span>Unit 02</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">The Four Vowels</span>
        </div>

        {/* Hero Section */}
        <Card className="mb-8 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <div className="text-eyebrow text-brand-dark mb-2">Step 02 · Foundations</div>
            <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">The Four Vowels</h1>
            <p className="mt-1 font-serif text-2xl text-ink-light italic tibetan">དབྱངས་བཞི།</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Every Tibetan syllable is voiced through a vowel. Just four diacritic marks — three
              above the letter and one below — turn the thirty consonants into the full range of
              spoken sound. 
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-2 flex items-center justify-between text-eyebrow">
              <span>Step progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, STEPS.length)} of {STEPS.length} sections</span>
            </div>
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden">
              <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(["all", "above", "below"] as const).map((k) => (
                  <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border ${filter === k ? "bg-ink text-white border-ink" : "bg-surface border-border-strong text-ink-muted hover:bg-surface-muted"}`}>
                    {k === "all" ? `All ${VOWELS.length}` : POSITION_META[k].label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`relative overflow-hidden border p-3 sm:p-5 transition-colors duration-500 ${studyMode === "night" ? "border-white/5 bg-[#0f0d0a]" : "border-border-subtle bg-gradient-to-br from-stone-50 to-white"}`}>
              <div className="relative mb-2 grid grid-cols-2 gap-2 sm:mb-3 sm:gap-3 md:grid-cols-4">
                {filtered.map((v) => (
                  <button key={`mark-${v.key}`} onClick={() => playAudio(v.markTranslit)} className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-border-strong bg-white hover:border-amber-300 hover:shadow-md"}`}>
                    <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                    <span className={`flex flex-1 items-center justify-center text-tibetan-display transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-ink"}`} style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>
                      {"\u25CC" + v.mark}
                    </span>
                    {playingItem === v.markTranslit && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
                  </button>
                ))}
              </div>

              <div className="relative grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
                {filtered.map((v) => (
                  <button key={v.key} onClick={(e) => { setSelected({ v, rect: e.currentTarget.getBoundingClientRect() }); playAudio(v.tib); }} className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-border-strong bg-white hover:border-amber-300 hover:shadow-md"}`}>
                    <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                    <span className={`flex flex-1 items-center justify-center text-tibetan-display transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-ink"}`} style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>{v.tib}</span>
                  </button>
                ))}
              </div>
            </div>
          </StepContainer>

          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="overflow-hidden border border-border-subtle shadow-sm mb-8">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border-strong bg-surface">
                  {VOWELS.map((v) => (
                    <tr key={v.key} className="transition hover:bg-surface-muted">
                      <td className="px-6 py-5 font-serif text-2xl text-ink">{v.translit}</td>
                      <td className="px-6 py-5 text-right">
                        <Button variant="outline" className="px-3 py-2" onClick={() => playAudio(v.translit)} disabled={playingItem !== null}>
                          {playingItem === v.translit ? <Loader2 className="size-4 animate-spin text-brand" /> : <Volume2 className="size-4 text-brand-dark" />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StepContainer>

          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {VOWELS.map((v) => {
                const pm = POSITION_META[v.position];
                return (
                  <div key={v.key} className={`p-6 border bg-surface ${pm.ring} shadow-sm flex flex-col`}>
                    <div className="mt-6 flex items-baseline gap-4">
                      <span className="font-tibetan text-[5rem] leading-none text-ink">{v.tib}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </StepContainer>

          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="overflow-hidden border border-border-subtle bg-surface shadow-sm mb-10">
              <div className="grid grid-cols-1 divide-y divide-border-strong md:grid-cols-2 md:divide-x md:divide-y-0">
                {VOWELS.map((v) => (
                  <div key={v.key} className="p-6 md:p-8">
                    {v.spellings && v.spellings.length > 0 && (
                      <div className="mt-8 border-t border-border-strong pt-5">
                        <div className="grid gap-3">
                          {v.spellings.map((s) => (
                            <button 
                              key={s.word} 
                              onClick={() => playAudio(s.audio || s.word)} 
                              className="text-left border border-border-strong bg-surface hover:bg-brand-light/20 p-4 hover:border-brand hover:shadow-sm transition-all group flex flex-col gap-1"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-tibetan text-4xl text-ink">{s.word}</span>
                              </div>
                              <div className="text-xl font-tibetan text-ink-light">{s.spell}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <QuizModule title="Mastery check" intro="Quick check-in before you move on." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={6} isVocabMatch />
          </StepContainer>

          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {VOCAB.map((v) => {
                const pm = POSITION_META[VOWELS.find((x) => x.key === v.vowel)!.position];
                return (
                  <div key={v.tib + v.translit} className="bg-surface border border-border-subtle flex flex-col p-5 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-md relative group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl opacity-90">{v.emoji}</div>
                    </div>
                    <div className="text-tibetan-card mb-1">{v.tib}</div>
                    <div className="text-eyebrow mb-3">{v.translit}</div>
                    <div className="flex items-center justify-between border-t border-border-strong pt-3 mt-auto">
                      <span className="text-sm font-bold text-ink">{v.en}</span>
                      {/* CACHE BUSTER UPDATE HERE */}
                      <button onClick={() => playAudio(v.audio || v.tib)} disabled={playingItem !== null} className="grid size-8 place-items-center bg-surface-muted border border-border-strong text-ink-light transition hover:bg-stone-200">
                        {playingItem === (v.audio || v.tib) ? <Loader2 className="size-4 animate-spin text-brand" /> : <Volume2 className="size-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </StepContainer>

          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={6} step={STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => {}} isLast>
            <QuizModule title="Final Step Test" data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={10} isUnlockTest={true} isVocabMatch={true} nextLessonPath="/dashboard/lessons/3" />
          </StepContainer>
        </div>
      </div>
    </div>
  );
}