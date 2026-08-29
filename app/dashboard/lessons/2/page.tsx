"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowUp, ArrowDown, 
  Info, Moon, Sun, Volume2, Loader2, CheckCircle2
} from "lucide-react";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- Data ---
import { VOWELS, VOCAB, STEPS, POSITION_META, generateSpellingQuiz, generateFinalQuiz, type Vowel, type Position } from "@/app/data/lesson2";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";
import { DraggablePanel } from "@/app/components/ui/DraggablePanel";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";

export default function VowelsLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(STEPS.length);

  const [selected, setSelected] = useState<{ v: Vowel, rect: DOMRect } | null>(null);
  const [filter, setFilter] = useState<"all" | Position>("all");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  
  const [isBypassing, setIsBypassing] = useState(false);

  const filtered = useMemo(() => (filter === "all" ? VOWELS : VOWELS.filter((v) => v.position === filter)), [filter]);

  // Map to Generic Practice Suite Format
  const practiceGroups = useMemo(() => [
    {
      name: "Vowels",
      items: VOWELS.map(v => ({
        id: `v-${v.key}`, tibetan: v.tib, reading: `[${v.translit.toLowerCase()}]`, english: POSITION_META[v.position].label, audioTarget: v.translit
      }))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `voc-${v.tib}`, tibetan: v.tib, reading: `[${v.translit}]`, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

  const spellingQuestions = useMemo(() => generateSpellingQuiz(), []);
  const finalQuizQuestions = useMemo(() => generateFinalQuiz(), []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(STEPS.length - 1);
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
          }} 
          disabled={isBypassing}
          className="w-full mb-8 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 text-center tracking-widest shadow-lg disabled:opacity-50"
        >
          {isBypassing ? "⏳ SAVING TO DATABASE... PLEASE WAIT" : "🛠️ DEV BYPASS: INSTANTLY PASS LESSON & SAVE 🛠️"}
        </button>

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
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="border border-border-subtle p-2 bg-surface-muted">
                <div className="font-serif text-2xl">4</div>
                <div className="text-[9px] uppercase tracking-widest text-ink-muted">Vowels</div>
              </div>
              <div className="border border-border-subtle p-2 bg-surface-muted">
                <div className="font-serif text-2xl">3</div>
                <div className="text-[9px] uppercase tracking-widest text-ink-muted">Above</div>
              </div>
              <div className="border border-border-subtle p-2 bg-surface-muted">
                <div className="font-serif text-2xl">1</div>
                <div className="text-[9px] uppercase tracking-widest text-ink-muted">Below</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          
          {/* Step 0: Grid */}
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(["all", "above", "below"] as const).map((k) => (
                  <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border ${filter === k ? "bg-ink text-white border-ink" : "bg-surface border-border-strong text-ink-muted hover:bg-surface-muted"}`}>
                    {k === "all" ? `All ${VOWELS.length}` : POSITION_META[k].label}
                  </button>
                ))}
              </div>
              <Button variant="outline" onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))} className="text-[10px] uppercase tracking-widest px-4 py-2">
                {studyMode === "paper" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />} {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </Button>
            </div>

            <div className={`relative overflow-hidden border p-3 sm:p-5 transition-colors duration-500 ${studyMode === "night" ? "border-white/5 bg-[#0f0d0a]" : "border-border-subtle bg-gradient-to-br from-stone-50 to-white"}`}>
              <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-[0.06] ${studyMode === "night" ? "opacity-[0.08]" : ""}`} style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "48px 48px", color: studyMode === "night" ? "#FFB600" : "#1c1917" }} />

              <div className="relative mb-2 grid grid-cols-2 gap-2 sm:mb-3 sm:gap-3 md:grid-cols-4">
                {filtered.map((v) => {
                  return (
                    <button key={`mark-${v.key}`} onClick={() => playAudio(v.markTranslit)} className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-border-strong bg-white hover:border-amber-300 hover:shadow-md"}`}>
                      <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                      
                      
					 {/* Vowel Mark rendered over a valid base letter (ཨ) to suppress Firefox circles, then masked out using CSS clip-path */}
                      <span className={`flex flex-1 items-center justify-center text-tibetan-display transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-ink"}`} style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>
                        <span 
                          className="inline-block leading-none" 
                          style={{ 
                            clipPath: v.position === "above" ? "inset(0 0 60% 0)" : "inset(60% 0 0 0)",
                            transform: v.position === "above" ? "translateY(30%)" : "translateY(-30%)"
                          }}
                        >
                          ཨ{v.mark}
                        </span>
                      </span>
					  
                      
                      {playingItem === v.markTranslit && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
                    </button>
                  );
                })}
              </div>

              <div className="relative grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
                {filtered.map((v) => (
                  <button key={v.key} onClick={(e) => { setSelected({ v, rect: e.currentTarget.getBoundingClientRect() }); playAudio(v.tib); }} className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-border-strong bg-white hover:border-amber-300 hover:shadow-md"}`}>
                    <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                    <span className={`flex flex-1 items-center justify-center text-tibetan-display transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-ink"}`} style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>{v.tib}</span>
                    <div className="mt-3 flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                      <span className={`text-lg font-mono font-bold tracking-wider ${studyMode === "night" ? "text-white/90" : "text-ink"}`}>[{v.translit.toLowerCase()}]</span>
                      <span className={`text-sm font-bold tracking-wide ${studyMode === "night" ? "text-white/60" : "text-ink-light"}`}>{v.markTranslit}</span>
                    </div>
                  </div>
                    {playingItem === v.tib && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap items-center gap-6 text-eyebrow">
              <span>Legend</span>
              {(Object.keys(POSITION_META) as Position[]).map((p) => (
                <div key={p} className="inline-flex items-center gap-2">
                  <span className="h-2 w-4" style={{ backgroundColor: POSITION_META[p].hex }} />
                  <span>{POSITION_META[p].label}</span>
                </div>
              ))}
            </div>
          </StepContainer>

          {/* Step 1: Marks */}
          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {VOWELS.map((v) => {
                const pm = POSITION_META[v.position];
                return (
                  <div key={v.key} className={`p-6 border bg-surface ${pm.ring} shadow-sm flex flex-col`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 w-fit ${pm.swatch} ${pm.text}`}>
                      {v.position === "above" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                      <span className="text-eyebrow">{pm.label}</span>
                    </div>
                    
                    {/* Big Vowel Button */}
                    <button 
                      onClick={() => playAudio(v.tib)} 
                      disabled={playingItem !== null}
                      className="mt-8 flex items-center gap-4 w-fit group transition-all text-left"
                    >
                      <span className="font-tibetan text-[5rem] leading-none text-ink group-hover:text-brand transition-colors">{v.tib}</span>
                      <span className="font-mono font-bold text-2xl text-ink-muted group-hover:text-ink transition-colors">[{v.translit.toLowerCase()}]</span>
                      <span className="ml-1 inline-grid size-8 place-items-center rounded-full bg-surface-muted border border-border-strong text-ink-muted group-hover:text-brand group-hover:border-brand/30 transition-colors">
                        {playingItem === v.tib ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} />}
                      </span>
                    </button>

                    <div className="mt-6 border-t border-border-strong pt-4 flex-1">
                      <div className="text-eyebrow mb-3">Mark name</div>
                      
                      {/* Mark Name Button */}
                      <button 
                        onClick={() => playAudio(v.markTranslit)}
                        disabled={playingItem !== null}
                        className="group flex flex-col text-left transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-tibetan text-3xl text-ink group-hover:text-brand">{v.markTib}</span>
                          <span className="inline-grid size-6 place-items-center rounded-full bg-surface-muted border border-border-strong text-ink-muted group-hover:text-brand group-hover:border-brand/30 transition-colors">
                            {playingItem === v.markTranslit ? <Loader2 size={12} className="animate-spin text-brand" /> : <Volume2 size={12} />}
                          </span>
                        </div>
                        <div className="text-sm italic text-ink-light mt-1.5 font-medium">{v.markTranslit}</div>
                      </button>
                    </div>
                    <p className="mt-4 text-[13px] leading-relaxed text-ink-light bg-surface-muted p-3 border border-border-strong">{v.note}</p>
                  </div>
                );
              })}
            </div>
          </StepContainer>

          {/* Step 2: Pronunciation */}
          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="overflow-hidden border border-border-subtle shadow-sm mb-8">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted text-eyebrow border-b border-border-subtle">
                  <tr>
                    <th className="px-6 py-4 text-left">Vowel</th>
                    <th className="px-6 py-4 text-left">Sound</th>
                    <th className="px-6 py-4 text-left">As in English</th>
                    <th className="px-6 py-4 text-right">Listen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-strong bg-surface">
                  {VOWELS.map((v) => (
                    <tr key={v.key} className="transition hover:bg-surface-muted">
                      <td className="px-6 py-5">
                        <button onClick={(e) => setSelected({ v, rect: e.currentTarget.getBoundingClientRect() })} className="inline-flex items-center gap-3">
                          <span className="font-tibetan text-3xl text-ink">{v.tib}</span>
                          <span className="text-eyebrow">{v.markTranslit}</span>
                        </button>
                      </td>
                      <td className="px-6 py-5 font-mono font-bold text-lg text-ink">[{v.translit.toLowerCase()}]</td>
                      <td className="px-6 py-5 text-ink-light font-bold">{v.english}</td>
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
            <div className="flex gap-4 p-5 bg-surface border border-border-strong shadow-sm">
              <Info className="mt-0.5 size-5 shrink-0 text-brand" />
              <div className="text-sm font-bold leading-relaxed text-ink-light">
                The absence of a vowel mark on a Tibetan letter is treated as an inherent <span className="font-mono font-bold text-ink">[a]</span> — for example ཀ is read <em>[ka]</em>, not <em>k</em>. The four diacritics replace that inherent [a].
              </div>
            </div>
          </StepContainer>

          {/* Step 3: Spelling */}
          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            {/* Switched to single-column stacking layout to match lessons 3/4/5 */}
            <div className="overflow-hidden border border-border-subtle bg-surface shadow-sm mb-10">
              <div className="flex flex-col divide-y divide-border-strong">
                {VOWELS.map((v) => (
                  <div key={v.key} className="p-6 md:p-8">
                    <div className="flex items-center gap-2 text-eyebrow mb-6">
                      <span className="h-2 w-4" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                      Spelling {v.translit}
                    </div>
                    
                    {/* Main 'A' Spelling Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border px-5 py-4 border-border-strong bg-surface shadow-sm">
                      <span className="font-tibetan text-[2.5rem] leading-none pt-1 w-12 text-center text-ink">{v.tib}</span>

                      <span className="flex items-center gap-2 md:gap-3 text-ink-light">
                         <span className="font-tibetan text-2xl sm:text-3xl">ཨ</span>
                         <span className="text-lg font-sans opacity-40">+</span>
                         <span className="font-tibetan text-2xl sm:text-3xl">{v.markTib}</span>
                      </span>

                      <ArrowRight size={16} className="text-border-strong" />

                      <div className="flex items-center gap-2">
                         <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: POSITION_META[v.position].hex }}>{v.tib}</span>
                         <span className="font-mono text-lg font-bold text-ink">[{v.translit.toLowerCase()}]</span>
                      </div>

                      <div className="ml-auto">
                         <Button variant="outline" onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="px-3 py-2">
                           {playingItem === v.tib ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className="text-brand-dark" />}
                         </Button>
                      </div>
                    </div>
                    
                    {/* Try it with other consonants */}
                    {v.spellings && v.spellings.length > 0 && (
                      <div className="mt-8 border-t border-border-strong pt-5">
                        <div className="text-eyebrow mb-4 text-ink-muted">Try it with other consonants</div>
                        <div className="space-y-2">
                          {v.spellings.map((s) => (
                            <div key={s.word} className="flex flex-wrap items-center gap-x-6 gap-y-3 border border-border-strong bg-surface px-5 py-4 shadow-sm hover:border-brand transition-colors group">
                              {/* 1. Target Word */}
                              <span className="font-tibetan text-[2.5rem] leading-none pt-1 w-12 text-center text-ink">{s.word}</span>

                              {/* 2. Math */}
                              <span className="flex items-center gap-2 md:gap-3 text-ink-light">
                                <span className="font-tibetan text-2xl sm:text-3xl">{s.spell.charAt(0)}</span>
                                <span className="text-lg font-sans opacity-40">+</span>
                                <span className="font-tibetan text-2xl sm:text-3xl">{v.markTib}</span>
                              </span>

                              <ArrowRight size={16} className="text-border-strong mx-1" />

                              {/* 3. Phonetic + Target Word */}
                              <div className="flex items-center gap-2">
                                <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: POSITION_META[v.position].hex }}>{s.word}</span>
                                <span className="font-mono text-lg font-bold text-ink group-hover:text-brand-dark transition-colors">[{s.roman.split(' ').pop()}]</span>
                              </div>

                              {/* 4. Play Button */}
                              <div className="ml-auto">
                                <Button variant="outline" onClick={() => playAudio(s.audio || s.word)} disabled={playingItem !== null} className="px-3 py-2">
                                  {playingItem === (s.audio || s.word) ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className="text-brand-dark" />}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <QuizModule 
              title="Spelling Mastery" 
              intro="Check your spelling and pronunciation before moving to vocabulary." 
              questions={spellingQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
            />
          </StepContainer>

          {/* Step 4: Vocabulary */}
          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="mb-10">
              <VocabGrid 
                items={VOCAB.map(v => {
                  const pm = POSITION_META[VOWELS.find((x) => x.key === v.vowel)!.position];
                  return {
                    tib: v.tib, pron: `[${v.translit}]`, en: v.en, emoji: v.emoji,
                    badge: { text: v.vowel, hex: pm.hex, bg: pm.hex + "15", border: pm.hex + "40" }
                  };
                })}
                playAudio={playAudio}
                playingItem={playingItem}
              />
            </div>
            
            <QuizModule
              title="Vocabulary Mastery" 
              intro="Check your memory of the new words before moving on." 
              data={VOCAB} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              questionCount={16} 
              isVocabMatch 
            />
          </StepContainer>

          {/* Step 5: Practice */}
          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 6: Final Test */}
          <StepContainer index={6} step={STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)} isLast>
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: The Three Superscripts." 
              questions={finalQuizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/3" 
              onPass={() => markComplete(6)}
            />
          </StepContainer>
        </div>
      </div>

      {selected && <DetailPanel data={selected} onClose={() => setSelected(null)} onSpeak={playAudio} playingItem={playingItem} />}
      
      {/* Sticky Footer */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/1" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== STEPS.length - 1 && (
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}>
              <CheckCircle2 size={18} /> Mark step complete
            </Button>
          )}

          <Link href="/dashboard/lessons/3" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
            Next: Superscripts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponents                                                       */
/* ------------------------------------------------------------------ */

interface DetailPanelProps {
  data: { v: any, rect: DOMRect };
  onClose: () => void;
  onSpeak: (text: string) => void;
  playingItem: string | null;
}

function DetailPanel({ data, onClose, onSpeak, playingItem }: DetailPanelProps) {
  const { v, rect } = data;
  const pm = POSITION_META[v.position as Position];

  return (
    <DraggablePanel rect={rect} title={`Vowel · ${v.translit}`} onClose={onClose}>
      <div className="flex items-center gap-5 mb-6">
        <div className="text-tibetan-display">{v.tib}</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="text-xl font-mono font-bold text-ink">[{v.translit.toLowerCase()}]</div>
          </div>
          <Button variant="primary" onClick={() => onSpeak(v.translit)} disabled={playingItem !== null} className="w-fit px-4 py-1.5 text-xs">
            {playingItem === v.translit ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} Play
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-3 border ${pm.swatch} border-opacity-50`}>
          <div className="text-eyebrow mb-1">Position</div>
          <div className={`font-serif text-sm font-bold ${pm.text}`}>{pm.label}</div>
        </div>
        
        <div className="p-3 border bg-surface border-border-strong">
          <div className="text-eyebrow mb-1">Mark Name</div>
          <div className="font-serif text-base text-ink tibetan">{v.markTib}</div>
          <div className="text-[10px] italic text-ink-light mt-1">{v.markTranslit}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-eyebrow mb-1">Pronunciation</div>
        <p className="text-sm text-ink-light font-bold leading-relaxed">{v.english}</p>
      </div>

      <div className="border-t border-border-strong pt-4">
        <div className="text-eyebrow mb-1">Notes from the textbook</div>
        <p className="text-sm text-ink-light leading-relaxed italic">{v.note}</p>
      </div>
    </DraggablePanel>
  );
}