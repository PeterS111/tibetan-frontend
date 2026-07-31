

"use client";

import { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, ChevronLeft, Sparkles, Layers, CheckCircle2, 
  Info, Moon, Sun, Volume2, Loader2, X, ArrowRight
} from "lucide-react";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- Data ---
import { CONSONANTS, VOCAB, STEPS, TONE_META, TONE_HEX, GENDER_META, type Consonant, type Tone, type Gender } from "@/app/data/lesson1";

// --- UI & Layout Components ---
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

export default function ConsonantsLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(STEPS.length);

  const [selected, setSelected] = useState<{ c: Consonant, rect: DOMRect } | null>(null);
  const [filter, setFilter] = useState<"all" | Tone>("all");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");

  const filtered = useMemo(() => (filter === "all" ? CONSONANTS : CONSONANTS.filter((c) => c.tone === filter)), [filter]);

  // Map our data to the generic Practice Suite format
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

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Steps</Link>
          <ChevronRight className="size-3" />
          <span>Unit 01</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">The 30 Consonants</span>
        </div>

        {/* Hero Section */}
        <Card className="mb-8 grid gap-6 md:grid-cols-[1fr,auto] md:items-end p-6 md:p-10">
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
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden">
              <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="border border-border-subtle p-2 bg-surface-muted">
                <div className="font-serif text-2xl">30</div>
                <div className="text-[9px] uppercase tracking-widest text-ink-muted">Letters</div>
              </div>
              <div className="border border-border-subtle p-2 bg-surface-muted">
                <div className="font-serif text-2xl">4</div>
                <div className="text-[9px] uppercase tracking-widest text-ink-muted">Tones</div>
              </div>
              <div className="border border-border-subtle p-2 bg-surface-muted">
                <div className="font-serif text-2xl">5</div>
                <div className="text-[9px] uppercase tracking-widest text-ink-muted">Genders</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {/* Intro */}
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
              <div>
                <p className="text-[15px] leading-relaxed text-ink-light">
                  Over the next few steps you'll meet all thirty consonants — first as a full type specimen, then broken down by <span className="font-bold text-ink">tone</span>, <span className="font-bold text-ink">root sound</span>, and <span className="font-bold text-ink">traditional gender</span>.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-ink-light">
                  <li className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /> Tap any letter card to hear its sound and see its details.</li>
                  <li className="flex items-start gap-3"><Layers className="mt-0.5 size-4 shrink-0 text-brand" /> Steps unlock as you continue, but you can peek ahead.</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" /> Completed steps are marked and stay open for review.</li>
                </ul>
              </div>
              <div className="p-6 bg-surface border border-border-strong">
                <div className="text-eyebrow mb-4">What you'll learn</div>
                <ol className="space-y-3 text-sm font-bold text-ink-light">
                  {STEPS.slice(1, -1).map((s, i) => (
                    <li key={s.id} className="flex items-start gap-3">
                      <span className="grid size-6 shrink-0 place-items-center bg-surface-muted text-ink-muted text-xs border border-border-strong">{i + 1}</span>
                      <span className="mt-0.5">{s.title}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </StepContainer>

          {/* Grid Specimen */}
          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(["all", "high-unasp", "high-asp", "low-asp", "low-nasal"] as const).map((k) => (
                  <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border ${filter === k ? "bg-ink text-white border-ink" : "bg-surface border-border-strong text-ink-muted hover:bg-surface-muted"}`}>
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
              <div className="relative grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6">
                {filtered.map((c) => (
                  <button key={c.tib + c.translit} onClick={(e) => { setSelected({ c, rect: e.currentTarget.getBoundingClientRect() }); playAudio(c.tib); }} className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-border-strong bg-white hover:border-amber-300 hover:shadow-md"}`}>
                    <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: TONE_HEX[c.tone] }} />
                    <span className={`flex flex-1 items-center justify-center text-tibetan-display transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-ink"}`} style={{ fontSize: "clamp(2.25rem, 6vw, 3.25rem)" }}>{c.tib}</span>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${studyMode === "night" ? "text-white/80" : "text-ink"}`}>{c.translit}</span>
                        <span className={`text-[9px] font-bold tracking-widest ${studyMode === "night" ? "text-white/40" : "text-ink-muted"}`}>{c.pron}</span>
                      </div>
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
               <QuizModule title="Mastery check" intro="Test your listening before you move on." data={CONSONANTS} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={8} isUnlockTest={false} />
            </div>
          </StepContainer>

          {/* Tone */}
          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {(Object.keys(TONE_META) as Tone[]).map((t) => {
                const m = TONE_META[t];
                const count = CONSONANTS.filter((c) => c.tone === t).length;
                return (
                  <div key={t} className={`p-6 border bg-surface ${m.ring}`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border ${m.swatch} ${m.text}`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{m.short}</span>
                    </div>
                    <div className="mt-6 font-serif font-bold text-3xl text-ink">{count} letters</div>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink-light h-20">{m.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {CONSONANTS.filter((c) => c.tone === t).map((c) => (
                        <button key={c.tib} onClick={(e) => { setSelected({ c, rect: e.currentTarget.getBoundingClientRect() }); playAudio(c.tib); }} className="border border-border-strong bg-surface-muted px-3 py-1.5 font-serif text-xl hover:border-brand hover:bg-surface transition-colors text-ink tibetan">
                          {c.tib}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </StepContainer>

          {/* Roots */}
          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <p className="mb-8 max-w-3xl text-[15px] text-ink-light leading-relaxed">
              Traditional Tibetan phonology traces every consonant back to one of three <em>root sounds</em> — seed syllables that anchor a whole tone family.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { tib: "ཨ", translit: "a", label: "Neutral root · High", swatch: "bg-sky-100", ring: "ring-sky-300", text: "text-sky-800", members: "ཨ ཀ ཅ ཏ པ ཙ", description: "The neutral vowel carrier — a clean ‘a’ with no consonantal onset. Anchors the plain, unaspirated stops." },
                { tib: "ཧ", translit: "ha", label: "Aspirated root · Breath", swatch: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800", members: "ཁ ཆ ཐ ཕ ཚ ཧ ཤ ས", description: "The breath root — a light, aspirated ‘h’. Anchors the aspirated stops and fricatives." },
                { tib: "འ", translit: "'a", label: "Glottal root · Voiced flow", swatch: "bg-rose-100", ring: "ring-rose-300", text: "text-rose-800", members: "ག ཇ ད བ ཛ ཞ ཟ འ ཡ ར ལ ང ཉ ན མ", description: "The glottal root — a soft, voiced ‘a’ that carries the vowel without a hard onset. Anchors the low-register letters." },
              ].map((r) => (
                <div key={r.tib} className={`p-8 bg-surface border ${r.ring} flex flex-col`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 w-fit border ${r.swatch} ${r.text}`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{r.label}</span>
                  </div>
                  <button onClick={() => playAudio(r.tib)} className="mt-8 flex items-baseline gap-4 w-fit hover:opacity-70 transition-opacity">
                    <span className="font-tibetan text-[5rem] leading-none text-ink">{r.tib}</span>
                    <span className="font-serif text-3xl italic text-ink-muted">{r.translit}</span>
                  </button>
                  <p className="mt-6 text-sm leading-relaxed text-ink-light flex-1">{r.description}</p>
                  <div className="mt-6 border-t border-border-strong pt-5">
                    <div className="text-eyebrow mb-2">Family</div>
                    <div className="font-serif text-xl tracking-[0.2em] text-ink tibetan">{r.members}</div>
                  </div>
                </div>
              ))}
            </div>
          </StepContainer>

          {/* Gender */}
          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="overflow-hidden border border-border-subtle">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted text-eyebrow border-b border-border-subtle">
                  <tr>
                    <th className="px-6 py-4 text-left">Gender</th>
                    <th className="px-6 py-4 text-left">Tibetan</th>
                    <th className="px-6 py-4 text-left">Consonants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-strong bg-surface">
                  {(Object.keys(GENDER_META) as Gender[]).map((g) => {
                    const letters = CONSONANTS.filter((c) => c.gender === g);
                    const gm = GENDER_META[g];
                    return (
                      <tr key={g} style={{ backgroundColor: gm.tint }}>
                        <td className="px-6 py-5 font-bold border-l-4" style={{ borderLeftColor: gm.color }}>
                          <span className="inline-flex items-center gap-3" style={{ color: gm.text }}>
                            <span className="size-3 rounded-full" style={{ backgroundColor: gm.color }} /> {gm.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-serif text-2xl text-ink tibetan">{gm.tib}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {letters.map((c) => (
                              <button key={c.tib} onClick={(e) => { setSelected({ c, rect: e.currentTarget.getBoundingClientRect() }); playAudio(c.tib); }} className="border bg-surface px-3.5 py-1.5 font-serif text-2xl transition hover:-translate-y-0.5 shadow-sm tibetan" style={{ borderColor: gm.color + "55", color: gm.text }}>
                                {c.tib}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </StepContainer>

          {/* Vocab */}
          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {VOCAB.map((v) => (
                <div key={v.tib + v.translit} className="bg-surface border border-border-subtle flex flex-col p-5 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-md relative group">
                  <div className="text-3xl mb-4">{v.emoji}</div>
                  <div className="text-tibetan-card mb-1">{v.tib}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3">{v.translit}</div>
                  <div className="flex items-center justify-between border-t border-border-strong pt-3 mt-auto">
                    <span className="text-sm font-bold text-ink-light">{v.en}</span>
                    <button onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="grid size-8 place-items-center bg-surface-muted border border-border-strong text-ink-light transition hover:bg-stone-200">
                      {playingItem === v.tib ? <Loader2 className="size-4 animate-spin text-brand" /> : <Volume2 className="size-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </StepContainer>

          {/* Generic Practice Suite */}
          <StepContainer index={6} step={STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Final Test */}
          <StepContainer index={7} step={STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => {}} isLast>
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: The Four Vowels." 
              data={CONSONANTS} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              questionCount={10} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/2" 
            />
          </StepContainer>
        </div>
      </div>

      {/* Floating Detail Panel (Inspector) */}
      {selected && <DetailPanel data={selected} onClose={() => setSelected(null)} onSpeak={playAudio} playingItem={playingItem} />}

      {/* Sticky Footer */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Syllabus
          </Link>
          <Button className="flex-1 sm:flex-none">
            <CheckCircle2 size={18} /> Mark step complete
          </Button>
          <Link href="/dashboard/lessons/2" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
            Next: The Four Vowels <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function DetailPanel({ data, onClose, onSpeak, playingItem }: any) {
  const { c, rect } = data;
  const tone = TONE_META[c.tone as Tone];
  const gender = GENDER_META[c.gender as Gender];
  
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsoLayoutEffect(() => {
    if (!rect || !panelRef.current) return;
    const panelRect = panelRef.current.getBoundingClientRect();
    const panelWidth = panelRect.width || 384; 
    const panelHeight = panelRect.height || 400; 
    const margin = 16;
    
    let startX = rect.right + margin;
    let startY = rect.top;

    if (startX + panelWidth > window.innerWidth) startX = rect.left - panelWidth - margin;
    if (startX < margin) {
      startX = Math.max(margin, (window.innerWidth - panelWidth) / 2);
      startY = rect.top - panelHeight - margin;
      if (startY < margin) startY = rect.bottom + margin;
    }
    if (startY + panelHeight > window.innerHeight) startY = window.innerHeight - panelHeight - margin;
    if (startY < margin) startY = margin;

    setPosition({ x: startX, y: startY });
  }, [rect]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        ref={panelRef}
        className="absolute pointer-events-auto flex flex-col sm:w-[24rem] w-[calc(100%-2rem)] max-h-[70vh] bg-paper shadow-2xl border border-border-subtle rounded-none overflow-hidden"
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          opacity: position.x === -9999 ? 0 : 1,
          transition: isDragging ? 'none' : 'opacity 0.2s ease-in-out'
        }}
      >
        <div 
          className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-surface shrink-0 cursor-move select-none"
          onPointerDown={(e) => { setIsDragging(true); dragRef.current = { startX: e.clientX, startY: e.clientY, initX: position.x, initY: position.y }; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => { if (!isDragging || !dragRef.current) return; setPosition({ x: dragRef.current.initX + (e.clientX - dragRef.current.startX), y: dragRef.current.initY + (e.clientY - dragRef.current.startY) }); }}
          onPointerUp={(e) => { setIsDragging(false); e.currentTarget.releasePointerCapture(e.pointerId); }}
        >
          <span className="text-eyebrow pointer-events-none">Consonant · {c.translit}</span>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} onPointerDown={(e) => e.stopPropagation()} className="p-1.5 -mr-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
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
        </div>
      </div>
    </div>
  );
}