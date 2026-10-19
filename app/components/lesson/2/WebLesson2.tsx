// app/components/lesson/2/WebLesson2.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/clerk-react";
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowUp, ArrowDown, 
  Info, Volume2, Loader2, CheckCircle2
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { usePlatform } from "@/hooks/usePlatform";

import { 
  VOWELS, 
  VOCAB, 
  POSITION_META, 
  generateSpellingQuiz, 
  generateFinalQuiz, 
  type Vowel, 
  type VowelKey,
  type Position 
} from "@/app/data/lesson2";

import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";
import { DraggablePanel } from "@/app/components/ui/DraggablePanel";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";
import { InstructionModal } from "@/app/components/ui/InstructionModal";
import { MARK_CONFIG, SpellingFormula } from "@/app/components/ui/SpellingFormula";

const VOWEL_STYLE_META: Record<VowelKey, { label: string; swatch: string; text: string; hex: string }> = {
  i: { label: "GI-GU · ABOVE ROOT", swatch: "bg-sky-50", text: "text-sky-800", hex: "#0ea5e9" },
  u: { label: "SHAB-KYU · BELOW ROOT", swatch: "bg-amber-50", text: "text-amber-800", hex: "#f59e0b" },
  e: { label: "DRENG-BU · ABOVE ROOT", swatch: "bg-violet-50", text: "text-violet-800", hex: "#8b5cf6" },
  o: { label: "NA-RO · ABOVE ROOT", swatch: "bg-rose-50", text: "text-rose-800", hex: "#f43f5e" },
};

// Combined Marks & Sounds Mastery and Spelling Mastery into a single step after Spelling
const WEB_STEPS = [
  { id: "marks", eyebrow: "Step 01", title: "The diacritic marks", description: "Names, positions, and how each mark is written." },
  { id: "pronunciation", eyebrow: "Step 02", title: "Pronouncing the vowels", description: "Map each vowel to a familiar English sound." },
  { id: "spelling", eyebrow: "Step 03", title: "Spelling rules", description: "Combine any consonant with the four vowel marks." },
  { id: "spelling_quiz", eyebrow: "Step 04", title: "Marks & Spelling Mastery", description: "Test your recognition of the vowel marks, sounds, and spelling." },
  { id: "vocab", eyebrow: "Step 05", title: "Vocabulary", description: "Read and hear real words using vowels only." },
  { id: "vocab_quiz", eyebrow: "Step 06", title: "Vocabulary Mastery", description: "Score 80% or higher to add words to your profile." },
  { id: "practice", eyebrow: "Step 07", title: "Practice & exercises", description: "Flashcards, listening, matching, and tracing." },
  { id: "complete", eyebrow: "Final step", title: "Lesson complete", description: "Take the final test to unlock the next lesson." },
];

export function WebLesson2() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, completed, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(WEB_STEPS.length);
  const { isNative } = usePlatform();

  const [selected, setSelected] = useState<{ v: Vowel, rect: DOMRect } | null>(null);
  const [isBypassing, setIsBypassing] = useState(false);

  // Auto-Trigger Modal State
  const [showInstructions, setShowInstructions] = useState(false);
  const [hasSeenInstructions, setHasSeenInstructions] = useState(false);

  useEffect(() => {
    if (expandedStep === 0 && !hasSeenInstructions) {
      setShowInstructions(true);
      setHasSeenInstructions(true);
    }
  }, [expandedStep, hasSeenInstructions]);

  const saveWords = async (wordCount: number, stepIndex: number) => {
    if (!completed.has(stepIndex) && user) {
      try {
        const token = await getToken();
        if (token) {
          const formData = new FormData();
          formData.append("user_id", user.id);
          formData.append("new_words", wordCount.toString());

          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update-words`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        }
      } catch (e) {
        console.error("Failed to save words", e);
      }
    }
    markComplete(stepIndex);
  };

  const practiceGroups = useMemo(() => [
    {
      name: "Vowels",
      items: VOWELS.map(v => ({
        id: `v-${v.key}`, 
        tibetan: v.tib, 
        reading: `[${v.translit.toLowerCase()}]`, 
        english: POSITION_META[v.position].label, 
        audioTarget: v.translit
      }))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `voc-${v.tib}`, 
        tibetan: v.tib, 
        reading: `[${v.translit}]`, 
        english: v.en, 
        audioTarget: v.tib, 
        emoji: v.emoji
      }))
    }
  ], []);

  const spellingQuestions = useMemo(() => generateSpellingQuiz(), []);
  const finalQuizQuestions = useMemo(() => generateFinalQuiz(), []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* DEV BYPASS BUTTON */}
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(WEB_STEPS.length - 1);
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
              <div className="text-eyebrow text-brand-dark mb-2">Lesson 02 · Foundations</div>
              <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">The Four Vowels</h1>
              <p className="mt-2 font-serif text-3xl text-ink-light italic tibetan">དབྱངས་བཞི།</p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
                Every Tibetan syllable is voiced through a vowel. Just four diacritic marks — three
                above the letter and one below — turn the thirty consonants into the full range of
                spoken sound. 
              </p>
            </div>
            
            <div className="w-full md:w-72">
              <div className="mb-2 flex items-center justify-between text-eyebrow">
                <span>Lesson progress</span>
                <span className="text-brand-dark">{Math.min(unlockedStep, WEB_STEPS.length)} of {WEB_STEPS.length} sections</span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle overflow-hidden rounded-full">
                <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 divide-x divide-border-subtle border border-border-subtle p-3 bg-surface-muted rounded-xl text-center">
                <div>
                  <div className="font-serif text-2xl text-ink">4</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Vowels</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-ink">3</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Above</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-ink">1</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Below</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          
          {/* Step 0: Marks (Plays individual mark name audio: Gigu, Zhabkyu, etc.) */}
          <StepContainer index={0} step={WEB_STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {VOWELS.map((v) => {
                const pm = POSITION_META[v.position];
                const pngConfig = MARK_CONFIG[v.mark.trim()];
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => playAudio(v.markTranslit)}
                    disabled={playingItem !== null}
                    className={`p-6 border bg-surface ${pm.ring} shadow-sm flex flex-col text-left transition-all hover:-translate-y-1 hover:shadow-md rounded-2xl`}
                  >
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${pm.swatch} ${pm.text}`}>
                      {v.position === "above" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                      <span className="text-eyebrow">{pm.label}</span>
                    </div>
                    
                    <div className="mt-8 mb-6 h-20 flex items-center justify-start">
                      {pngConfig ? (
                         <img src={pngConfig.src} alt={v.markTib} className="h-full w-auto object-contain opacity-90" />
                       ) : (
                         <span className="font-tibetan text-6xl text-ink">{v.mark}</span>
                       )}
                    </div>

                    <div className="border-t border-border-strong pt-4 flex-1 w-full">
                      <div className="text-eyebrow mb-3">Mark name</div>
                      <div className="flex items-center gap-2">
                        <span className="font-tibetan text-3xl text-ink">{v.markTib}</span>
                        <span className="inline-grid size-6 place-items-center rounded-full bg-surface-muted border border-border-strong text-ink-muted">
                          {playingItem === v.markTranslit ? <Loader2 size={12} className="animate-spin text-brand" /> : <Volume2 size={12} />}
                        </span>
                      </div>
                      <div className="text-sm italic text-ink-light mt-1.5 font-medium">{v.markTranslit}</div>
                    </div>
                    <p className="mt-4 text-[13px] leading-relaxed text-ink-light bg-surface-muted p-3 border border-border-strong rounded-xl w-full">{v.note}</p>
                  </button>
                );
              })}
            </div>
          </StepContainer>

          {/* Step 1: Pronouncing the Vowels (Redesigned to Match Lesson 1 Root Cards!) */}
          <StepContainer index={1} step={WEB_STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="flex gap-4 p-5 bg-surface border border-border-strong shadow-sm mb-6 rounded-2xl">
              <Info className="mt-0.5 size-5 shrink-0 text-brand" />
              <div className="text-sm font-bold leading-relaxed text-ink-light">
                The absence of a vowel mark on a Tibetan letter is treated as an inherent <span className="font-mono font-bold text-ink">[a]</span> — for example ཀ is read <em>[ka]</em>, not <em>k</em>. The four diacritics replace that inherent [a].
              </div>
            </div>

            <div className="overflow-hidden border border-border-subtle bg-surface shadow-sm rounded-2xl flex flex-col divide-y divide-border-subtle">
              {VOWELS.map((v) => {
                const styleMeta = VOWEL_STYLE_META[v.key];
                return (
                  <div key={v.key} className="p-6 md:p-8 flex flex-col md:flex-row gap-8" style={{ borderLeft: `4px solid ${styleMeta.hex}` }}>
                    <div className="w-full md:w-1/3 shrink-0">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 ${styleMeta.swatch} ${styleMeta.text}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{styleMeta.label}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          if (!isNative) setSelected({ v, rect: e.currentTarget.getBoundingClientRect() });
                          playAudio(v.translit);
                        }}
                        disabled={playingItem !== null}
                        className="flex items-center gap-4 group transition-all text-left mb-6"
                      >
                        <span className="font-tibetan text-[4rem] leading-none text-ink group-hover:opacity-80 transition-opacity pt-1" style={{ color: styleMeta.hex }}>{v.tib}</span>
                        <div className="flex flex-col gap-1">
                          <span className="font-serif text-2xl italic text-ink-muted">{v.key}</span>
                          <span className="inline-grid size-8 place-items-center rounded-full bg-surface-muted border border-border-strong text-ink-muted group-hover:text-brand group-hover:border-brand/30 transition-colors">
                            {playingItem === v.translit ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} />}
                          </span>
                        </div>
                      </button>
                      <p className="text-[14px] leading-relaxed text-ink-light">
                        <strong className="text-ink">{v.english}</strong> {v.note}
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border-subtle pt-6 md:pt-0 md:pl-8">
                      <div className="text-eyebrow mb-4">Examples</div>
                      <div className="flex flex-wrap gap-2">
                        {v.examples.map((ex) => (
                          <button
                            key={ex}
                            onClick={() => playAudio(ex)}
                            className="w-12 h-12 flex items-center justify-center rounded-full font-tibetan text-2xl pt-1 hover:scale-105 transition-transform active:scale-95"
                            style={{ backgroundColor: `${styleMeta.hex}15`, color: styleMeta.hex, border: `1px solid ${styleMeta.hex}40` }}
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </StepContainer>

          {/* Step 2: Spelling */}
          <StepContainer index={2} step={WEB_STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="space-y-8 mb-10">
              {VOWELS.map((v) => (
                <div key={v.key} className="bg-surface-muted rounded-[1.5rem] p-6 border border-border-subtle shadow-sm">
                  
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <span className="h-2 w-4 rounded-full" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted">Spelling {v.translit}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3 bg-white border border-border-subtle shadow-sm rounded-[1.25rem] px-6 py-5 mb-6">
                    <span className="font-tibetan text-[3rem] leading-none pt-1 w-12 text-center text-ink">{v.tib}</span>

                    <SpellingFormula parts={`ཨ + ${v.markTib}`} />

                    <ArrowRight size={16} className="text-border-strong mx-2" />

                    <div className="flex items-center gap-3">
                       <span className="font-tibetan text-[3rem] leading-none pt-1" style={{ color: POSITION_META[v.position].hex }}>{v.tib}</span>
                       <span className="font-mono text-xl font-bold text-ink">[{v.translit.toLowerCase()}]</span>
                    </div>

                    <div className="ml-auto">
                       <Button variant="outline" onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="px-4 py-2.5 rounded-full">
                         {playingItem === v.tib ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className="text-brand-dark" />}
                       </Button>
                    </div>
                  </div>
                  
                  {v.spellings && v.spellings.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border-strong/50">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4 px-1">Try it with other consonants</div>
                      <div className="space-y-3">
                        {v.spellings.map((s) => (
                          <div key={s.word} className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-white border border-border-subtle shadow-sm rounded-[1.25rem] px-6 py-4 hover:border-brand/40 transition-colors group">
                            <span className="font-tibetan text-[2.5rem] leading-none pt-1 w-10 text-center text-ink">{s.word}</span>

                            <SpellingFormula parts={`${s.spell.charAt(0)} + ${v.markTib}`} />

                            <ArrowRight size={16} className="text-border-strong mx-1 opacity-50" />

                            <div className="flex items-center gap-2">
                              <span className="font-tibetan text-[2.5rem] leading-none pt-1" style={{ color: POSITION_META[v.position].hex }}>{s.word}</span>
                              <span className="font-mono text-lg font-bold text-ink group-hover:text-brand-dark transition-colors">[{s.roman.split(' ').pop()}]</span>
                            </div>

                            <div className="ml-auto">
                              <button 
                                onClick={() => playAudio(s.audio || s.word)} 
                                disabled={playingItem !== null} 
                                className="w-10 h-10 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center text-brand-dark hover:bg-brand/40 transition-colors"
                              >
                                {playingItem === (s.audio || s.word) ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </StepContainer>

          {/* Step 3: Combined Marks, Sounds & Spelling Quiz */}
          <StepContainer index={3} step={WEB_STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <QuizModule 
              moduleId={2}
              title="Mastery Check · Marks, Sounds & Spelling" 
              intro="Check your recognition of the four diacritic marks, vowel sounds, and syllable spelling." 
              questions={spellingQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={false}
            />
          </StepContainer>

          {/* Step 4: Vocabulary */}
          <StepContainer index={4} step={WEB_STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
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
          </StepContainer>

          {/* Step 5: Vocabulary Quiz */}
          <StepContainer index={5} step={WEB_STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <QuizModule
              moduleId={2}
              title="Mastery Check · Vocabulary" 
              intro="Score 80% or higher to prove you know these words and add them to your profile." 
              data={VOCAB} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              questionCount={16} 
              isVocabMatch
              isUnlockTest={true} 
              onPass={() => saveWords(VOCAB.length, 5)} 
            />
          </StepContainer>

          {/* Step 6: Practice */}
          <StepContainer index={6} step={WEB_STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 7: Final Assessment */}
          <StepContainer index={7} step={WEB_STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => markComplete(7)} isLast>
            <QuizModule 
              moduleId={2}
              title="Final Assessment" 
              intro="Score 80% or higher to unlock the next step: The Three Superscripts." 
              questions={finalQuizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/3" 
              onPass={() => markComplete(7)} 
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
          
          {expandedStep !== WEB_STEPS.length - 1 && (
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}>
              <CheckCircle2 size={18} /> Mark step complete
            </Button>
          )}

          <Link href="/dashboard/lessons/3" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
            Next: Superscripts <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <InstructionModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
}

interface DetailPanelProps {
  data: { v: any, rect: DOMRect };
  onClose: () => void;
  onSpeak: (text: string) => void;
  playingItem: string | null;
}

function DetailPanel({ data, onClose, onSpeak, playingItem }: DetailPanelProps) {
  const { v, rect } = data;
  const pm = POSITION_META[v.position as Position];
  const pngConfig = MARK_CONFIG[v.mark.trim()];

  return (
    <DraggablePanel rect={rect} title={`Vowel · ${v.translit}`} onClose={onClose}>
      <div className="flex items-center gap-5 mb-6">
        <div className="text-tibetan-display">{v.tib}</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="text-xl font-mono font-bold text-ink">[{v.translit.toLowerCase()}]</div>
            <div className="text-sm font-bold uppercase tracking-widest text-ink-muted">· {v.markTranslit}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onSpeak(v.markTranslit)} disabled={playingItem !== null} className="w-fit px-3.5 py-1.5 text-xs">
              {playingItem === v.markTranslit ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} Mark
            </Button>
            <Button variant="primary" onClick={() => onSpeak(v.translit)} disabled={playingItem !== null} className="w-fit px-3.5 py-1.5 text-xs">
              {playingItem === v.translit ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} Sound
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-3 border ${pm.swatch} border-opacity-50`}>
          <div className="text-eyebrow mb-1">Position</div>
          <div className={`font-serif text-sm font-bold ${pm.text}`}>{pm.label}</div>
        </div>
        
        <div className="p-3 border bg-surface border-border-strong flex flex-col justify-center items-center relative">
          <div className="text-eyebrow mb-2 self-start w-full absolute top-2 left-3">Mark</div>
          {pngConfig ? (
             <img src={pngConfig.src} alt={v.markTib} className="h-10 w-auto object-contain opacity-80 mt-4" />
          ) : (
             <div className="font-serif text-3xl text-ink tibetan mt-4">{v.markTib}</div>
          )}
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