// app/components/lesson/1/WebLesson1.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronRight, ChevronLeft, Sparkles, Layers, CheckCircle2, 
  Moon, Sun, Volume2, Loader2, ArrowRight
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { usePlatform } from "@/hooks/usePlatform";

import { 
  CONSONANTS, 
  VOCAB, 
  STEPS, 
  TONE_META, 
  TONE_HEX, 
  GENDER_META, 
  generateFinalQuiz, 
  type Consonant, 
  type Tone, 
  type Gender 
} from "@/app/data/lesson1";

import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";
import { DraggablePanel } from "@/app/components/ui/DraggablePanel";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";

export function WebLesson1() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(STEPS.length);
  
  const { isNative } = usePlatform();

  const [selected, setSelected] = useState<{ c: Consonant, rect: DOMRect } | null>(null);
  const [filter, setFilter] = useState<"all" | Tone>("all");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  
  const [isBypassing, setIsBypassing] = useState(false);

  const filtered = useMemo(() => (filter === "all" ? CONSONANTS : CONSONANTS.filter((c) => c.tone === filter)), [filter]);

  const practiceGroups = useMemo(() => [
    {
      name: "Consonants",
      items: CONSONANTS.map(c => ({
        id: `c-${c.tib}`, tibetan: c.tib, reading: c.pron, english: TONE_META[c.tone].short, audioTarget: c.tib
      }))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

  const quizQuestions = useMemo(() => generateFinalQuiz(), []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* DEV BYPASS BUTTON */}
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
          <span>Unit 01</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">The 30 Consonants</span>
        </div>

        {/* Hero Section */}
        <Card className="mb-8 p-0 overflow-hidden shadow-sm border border-border-subtle">
          <div className="w-full h-56 sm:h-72 bg-surface-muted overflow-hidden relative">
            <img 
              src="/loplao-hero-scene.jpg" 
              alt="Himalayan Monastery Scene" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="p-6 md:p-10 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <div className="text-eyebrow text-brand-dark mb-2">Step 01 · Foundations</div>
              <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">
                The 30 Tibetan Consonants
              </h1>
              <p className="mt-1 font-serif text-2xl text-ink-light italic tibetan">གསལ་བྱེད་སུམ་ཅུ།</p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
                The Tibetan alphabet is built on thirty root letters — the foundation of every word you
                will read, write, and speak. Move through the lesson one step at a time; every section
                stays available for review whenever you want to jump ahead.
              </p>
            </div>
            
            <div className="w-full md:w-72">
              <div className="mb-2 flex items-center justify-between text-eyebrow">
                <span>Step progress</span>
                <span className="text-brand-dark">{Math.min(unlockedStep, STEPS.length)} of {STEPS.length} sections</span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle overflow-hidden rounded-full">
                <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 divide-x divide-border-subtle border border-border-subtle p-3 bg-surface-muted rounded-xl text-center">
                <div>
                  <div className="font-serif text-2xl text-ink">30</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Letters</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-ink">4</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Tones</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-ink">5</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Genders</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-8 md:grid-cols-[1.1fr,1fr] items-start">
              <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border-strong shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-6">
                  What you'll learn
                </div>
                <div className="space-y-4">
                  {[
                    { mod: "MODULE 01", title: "The alphabet, as a type specimen" },
                    { mod: "MODULE 02", title: "Understanding tone" },
                    { mod: "MODULE 03", title: "The three root sounds" },
                    { mod: "MODULE 04", title: "Traditional gender classification" },
                    { mod: "MODULE 05", title: "Vocabulary built from the 30 consonants" },
                    { mod: "MODULE 06", title: "Practice & exercises" },
                  ].map((item, idx) => (
                    <div key={item.mod} className={`flex flex-col gap-1 ${idx !== 0 ? "pt-3.5 border-t border-border-subtle" : ""}`}>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-muted">{item.mod}</span>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-brand shrink-0"></span>
                        <span className="font-serif text-[16px] font-bold text-ink leading-snug">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border-strong shadow-sm">
                <h3 className="font-serif text-2xl font-bold text-ink mb-6">How to use this app</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm"><Sparkles size={18} /></div>
                    <p className="text-[14px] leading-relaxed text-ink-light pt-1 font-medium">Tap any letter card to hear its sound and see its details.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm"><Layers size={18} /></div>
                    <p className="text-[14px] leading-relaxed text-ink-light pt-1 font-medium">Steps unlock as you continue, but you can peek ahead.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm"><CheckCircle2 size={18} /></div>
                    <p className="text-[14px] leading-relaxed text-ink-light pt-1 font-medium">Completed steps are marked and stay open for review.</p>
                  </div>
                </div>
              </div>
            </div>
          </StepContainer>

          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(["all", "high-unasp", "high-asp", "low-asp", "low-nasal"] as const).map((k) => (
                  <button 
                    key={k} 
                    onClick={() => setFilter(k)} 
                    className={`inline-flex items-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border rounded-full ${
                      filter === k ? "bg-ink text-white border-ink shadow-sm" : "bg-surface border-border-strong text-ink-muted hover:border-ink-muted hover:text-ink hover:bg-surface-muted"
                    }`}
                  >
                    {k !== "all" && <span className="inline-block w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: TONE_HEX[k] }} />}
                    {k === "all" ? `All ${CONSONANTS.length}` : TONE_META[k].short}
                  </button>
                ))}
              </div>
              <Button variant="outline" onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))} className="text-[10px] uppercase tracking-widest px-4 py-2">
                {studyMode === "paper" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />} {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </Button>
            </div>

            <div className={`relative overflow-hidden border p-3 sm:p-5 transition-colors duration-500 ${studyMode === "night" ? "border-white/5 bg-[#0f0d0a]" : "border-border-subtle bg-gradient-to-br from-stone-50 to-white"}`}>
              <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-[0.06] ${studyMode === "night" ? "opacity-[0.08]" : ""}`} style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "48px 48px", color: studyMode === "night" ? "#FFB600" : "#1c1917" }} />
              
              <div className="relative grid grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-3xl mx-auto">
                {filtered.map((c) => (
                  <button 
                    key={c.tib + c.translit} 
                    onClick={(e) => { 
                      if (!isNative) setSelected({ c, rect: e.currentTarget.getBoundingClientRect() }); 
                      playAudio(c.tib); 
                    }} 
                    className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-border-strong bg-white hover:border-amber-300 hover:shadow-md"}`}
                  >
                    <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: TONE_HEX[c.tone] }} />
                    <span className={`flex flex-1 items-center justify-center text-tibetan-display transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-ink"}`} style={{ fontSize: "clamp(2.25rem, 6vw, 3.25rem)" }}>
                      {c.tib}
                    </span>
                    <div className="mt-2 flex items-end justify-between">
                      <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${studyMode === "night" ? "text-white/80" : "text-ink"}`}>{c.translit}</span>
                    </div>
                    {playingItem === c.tib && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-[11px] font-bold text-ink-muted">
              <span className="uppercase tracking-widest">Legend</span>
              {(Object.keys(TONE_HEX) as Tone[]).map((t) => (
                <div key={t} className="inline-flex items-center gap-2">
                  <span className="h-2 w-4" style={{ backgroundColor: TONE_HEX[t] }} />
                  <span>{TONE_META[t].short}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
               <QuizModule 
                 moduleId={1}
                 title="Mastery Check · 30 Consonants" 
                 intro="Test your listening before you move on." 
                 data={CONSONANTS} 
                 playAudio={playAudio} 
                 playingItem={playingItem} 
                 playErrorBeep={playErrorBeep} 
                 questionCount={30} 
                 isUnlockTest={false} 
                 isLesson1={true}
               />
            </div>
          </StepContainer>

          {/* Tone - REFACTORED FOR WEB (Horizontal Splits in Unified Box) */}
          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="overflow-hidden border border-border-subtle bg-surface shadow-sm rounded-2xl flex flex-col divide-y divide-border-subtle">
              {(Object.keys(TONE_META) as Tone[]).map((t) => {
                const m = TONE_META[t];
                const hex = TONE_HEX[t];
                const count = CONSONANTS.filter((c) => c.tone === t).length;
                return (
                  <div key={t} className="p-6 md:p-8 flex flex-col md:flex-row gap-8" style={{ borderLeft: `4px solid ${hex}` }}>
                    <div className="w-full md:w-1/3 shrink-0">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${m.swatch} ${m.text}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{m.short}</span>
                      </div>
                      <div className="font-serif font-bold text-3xl text-ink mb-3">{count} letters</div>
                      <p className="text-[14px] leading-relaxed text-ink-light">{m.description}</p>
                    </div>
                    <div className="flex-1 flex flex-wrap content-start gap-2 border-t md:border-t-0 md:border-l border-border-subtle pt-6 md:pt-0 md:pl-8">
                      {CONSONANTS.filter((c) => c.tone === t).map((c) => (
                        <button key={c.tib} onClick={(e) => {
                          if (!isNative) setSelected({ c, rect: e.currentTarget.getBoundingClientRect() });
                          playAudio(c.tib);
                        }}
                        className="w-12 h-12 flex items-center justify-center rounded-full font-tibetan text-2xl hover:scale-105 transition-transform text-ink active:scale-95"
                        style={{ backgroundColor: `${hex}15`, color: hex, border: `1px solid ${hex}40` }}>
                          {c.tib}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </StepContainer>

          {/* Roots - REFACTORED FOR WEB */}
          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <p className="mb-8 max-w-3xl text-[15px] text-ink-light leading-relaxed">
              Traditional Tibetan phonology traces every consonant back to one of three <em>root sounds</em> — seed syllables that anchor a whole tone family.
            </p>
            <div className="overflow-hidden border border-border-subtle bg-surface shadow-sm rounded-2xl flex flex-col divide-y divide-border-subtle">
              {[
                { tib: "ཨ", translit: "a", label: "Neutral root · High", swatch: "bg-sky-50", text: "text-sky-800", hex: "#0ea5e9", members: "ཨ ཀ ཅ ཏ པ ཙ", description: "The neutral vowel carrier — a clean ‘a’ with no consonantal onset. Anchors the plain, unaspirated stops." },
                { tib: "ཧ", translit: "ha", label: "Aspirated root · Breath", swatch: "bg-amber-50", text: "text-amber-800", hex: "#f59e0b", members: "ཁ ཆ ཐ ཕ ཚ ཧ ཤ ས", description: "The breath root — a light, aspirated ‘h’. Anchors the aspirated stops and fricatives." },
                { tib: "འ", translit: "'a", label: "Glottal root · Voiced flow", swatch: "bg-rose-50", text: "text-rose-800", hex: "#f43f5e", members: "ག ཇ ད བ ཛ ཞ ཟ འ ཡ ར ལ ང ཉ ན མ", description: "The glottal root — a soft, voiced ‘a’ that carries the vowel without a hard onset. Anchors the low-register letters." },
              ].map((r) => (
                <div key={r.tib} className="p-6 md:p-8 flex flex-col md:flex-row gap-8" style={{ borderLeft: `4px solid ${r.hex}` }}>
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 ${r.swatch} ${r.text}`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{r.label}</span>
                    </div>
                    <button
                      onClick={() => playAudio(r.tib)}
                      disabled={playingItem !== null}
                      className="flex items-center gap-4 group transition-all text-left mb-6"
                    >
                      <span className="font-tibetan text-[4rem] leading-none text-ink group-hover:opacity-80 transition-opacity" style={{ color: r.hex }}>{r.tib}</span>
                      <div className="flex flex-col gap-1">
                        <span className="font-serif text-2xl italic text-ink-muted">{r.translit}</span>
                        <span className="inline-grid size-8 place-items-center rounded-full bg-surface-muted border border-border-strong text-ink-muted group-hover:text-brand group-hover:border-brand/30 transition-colors">
                          {playingItem === r.tib ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} />}
                        </span>
                      </div>
                    </button>
                    <p className="text-[14px] leading-relaxed text-ink-light">{r.description}</p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border-subtle pt-6 md:pt-0 md:pl-8">
                    <div className="text-eyebrow mb-4">Family</div>
                    <div className="flex flex-wrap gap-2">
                      {r.members.split(" ").map((letter) => {
                        const c = CONSONANTS.find(con => con.tib === letter);
                        return (
                          <button
                            key={letter}
                            onClick={(e) => {
                              if (!isNative && c) setSelected({ c, rect: e.currentTarget.getBoundingClientRect() });
                              playAudio(letter);
                            }}
                            className="w-12 h-12 flex items-center justify-center rounded-full font-tibetan text-2xl hover:scale-105 transition-transform active:scale-95"
                            style={{ backgroundColor: `${r.hex}15`, color: r.hex, border: `1px solid ${r.hex}40` }}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </StepContainer>

          {/* Gender - REFACTORED FOR WEB */}
          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="overflow-hidden border border-border-subtle bg-surface shadow-sm rounded-2xl flex flex-col divide-y divide-border-subtle">
              {(Object.keys(GENDER_META) as Gender[]).map((g) => {
                const letters = CONSONANTS.filter((c) => c.gender === g);
                const gm = GENDER_META[g];
                return (
                  <div
                    key={g}
                    className="flex flex-col md:flex-row gap-6 p-6 md:p-8"
                    style={{ borderLeft: `4px solid ${gm.color}` }}
                  >
                    <div className="w-full md:w-1/3 shrink-0 flex flex-row md:flex-col justify-between md:justify-start gap-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit" style={{ backgroundColor: gm.tint, color: gm.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: gm.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{gm.label}</span>
                      </div>
                      <span className="font-tibetan text-4xl" style={{ color: gm.color }}>
                        {gm.tib}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-wrap content-center gap-2 border-t md:border-t-0 md:border-l border-border-subtle pt-6 md:pt-0 md:pl-8">
                      {letters.map((c) => (
                        <button
                          key={c.tib}
                          onClick={(e) => {
                            if (!isNative) setSelected({ c, rect: e.currentTarget.getBoundingClientRect() });
                            playAudio(c.tib);
                          }}
                          className="w-12 h-12 flex items-center justify-center rounded-full font-tibetan text-2xl hover:scale-105 transition-transform active:scale-95"
                          style={{ backgroundColor: `${gm.color}15`, color: gm.color, border: `1px solid ${gm.color}40` }}
                        >
                          {c.tib}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </StepContainer>

          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <VocabGrid 
              items={VOCAB.map(v => ({ tib: v.tib, pron: v.translit, en: v.en, emoji: v.emoji }))}
              playAudio={playAudio}
              playingItem={playingItem}
            />
            <div className="mt-10">
              <QuizModule
                moduleId={1}
                title="Mastery Check · Vocabulary" 
                intro="Check your memory of the new words before moving on." 
                data={VOCAB} 
                playAudio={playAudio} 
                playingItem={playingItem} 
                playErrorBeep={playErrorBeep} 
                questionCount={18} 
                isVocabMatch={true} 
              />
            </div>
          </StepContainer>

          <StepContainer index={6} step={STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isLesson1={true} />
          </StepContainer>

          <StepContainer index={7} step={STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => markComplete(7)} isLast>
            <QuizModule 
              moduleId={1}
              title="Final Assessment" 
              intro="Score 80% or higher to unlock the next step: The Four Vowels." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              isLesson1={true}
              nextLessonPath="/dashboard/lessons/2" 
              onPass={() => markComplete(7)}
            />
          </StepContainer>
        </div>
      </div>

      {selected && <DetailPanel data={selected} onClose={() => setSelected(null)} onSpeak={playAudio} playingItem={playingItem} />}

      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Syllabus
          </Link>
          {expandedStep !== STEPS.length - 1 && (
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}>
              <CheckCircle2 size={18} /> Mark step complete
            </Button>
          )}
          <Link href="/dashboard/lessons/2" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
            Next: The Four Vowels <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface DetailPanelProps {
  data: { c: any, rect: DOMRect };
  onClose: () => void;
  onSpeak: (text: string) => void;
  playingItem: string | null;
}

function DetailPanel({ data, onClose, onSpeak, playingItem }: DetailPanelProps) {
  const { c, rect } = data;
  const tone = TONE_META[c.tone as Tone];
  const gender = GENDER_META[c.gender as Gender];

  return (
    <DraggablePanel rect={rect} title={`Consonant · ${c.translit}`} onClose={onClose}>
      <div className="flex items-center gap-5 mb-6">
        <div className="text-tibetan-display">{c.tib}</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="text-xl font-serif italic text-ink">{c.translit}</div>
            <div className="text-base font-mono font-bold text-ink-light">{c.pron}</div>
          </div>
          <Button variant="primary" onClick={() => onSpeak(c.tib)} disabled={playingItem !== null} className="w-fit px-4 py-1.5 text-xs">
            {playingItem === c.tib ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} Play
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-3 border ${tone.swatch} border-opacity-50`}>
          <div className="text-eyebrow mb-1">Tone</div>
          <div className={`font-serif text-sm font-bold ${tone.text}`}>{tone.short}</div>
        </div>
        
        <div className="p-3 border bg-surface" style={{ borderColor: gender.color + '40', backgroundColor: gender.tint }}>
          <div className="text-eyebrow mb-1">Gender</div>
          <div className="font-serif text-sm font-bold flex items-center gap-1.5" style={{ color: gender.text }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: gender.color }}></div>
            {gender.label}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-eyebrow mb-1">Pronunciation</div>
        <p className="text-sm text-ink-light leading-relaxed">{tone.description}</p>
      </div>

      <div className="border-t border-border-strong pt-4">
        <div className="text-eyebrow mb-1">Notes from the textbook</div>
        <p className="text-sm text-ink-light leading-relaxed italic">{c.note}</p>
      </div>
    </DraggablePanel>
  );
}