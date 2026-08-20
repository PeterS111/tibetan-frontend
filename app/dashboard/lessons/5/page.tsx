"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowRight,
  Info, CheckCircle2, Moon, Sun, BookOpen, Loader2, Shuffle, AlertTriangle
} from "lucide-react";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- Data ---
import { PREFIXES, VOCAB, NEVER_TAKE, STEPS, TONE_META, type PrefixKey, type Tone } from "@/app/data/lesson5";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

export default function PrefixesLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  
  // 🚨 FIXED: Hardcoded 7 steps
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(7);

  const [activeTab, setActiveTab] = useState<PrefixKey>("ga");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  
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

  const quizQuestions = useMemo(() => {
    const allCombos = PREFIXES.flatMap(s => s.combos);
    const qs = [];
    
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

    const cTargets = [...allCombos].sort(() => 0.5 - Math.random()).slice(0, 6);
    for (const c of cTargets) {
      const wrongs = allCombos.filter(x => x.read !== c.read).sort(() => 0.5 - Math.random()).slice(0, 3);
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
        
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(6); // 🚨 FIXED: Hardcoded index 6
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
          <span>Unit 05</span>
          <ChevronRight size={14} />
          <span className="text-ink">Prefixes</span>
        </div>

        <Card className="mb-12 grid gap-8 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <div className="mb-3 text-eyebrow text-brand-dark">Lesson 05 · Foundations</div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight tracking-tight">
              The Five Prefixes
            </h1>
            <p className="mt-2 font-serif text-2xl italic text-ink-light">སྔོན་འཇུག་ལྔ།</p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Five consonants — <span className="font-serif text-xl">ག ད བ མ འ</span> — may sit <em>before</em> a root letter. They shape both <span className="font-bold text-ink">spelling</span> and <span className="font-bold text-ink">pronunciation</span> (deepening feminine roots, adding a nasal onset with མ and འ).
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-3 flex items-center justify-between text-eyebrow">
              <span>Lesson progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, 7)} of 7 sections</span> {/* 🚨 FIXED */}
            </div>
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden">
              <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-6 grid grid-cols-5 gap-2 text-center">
              {PREFIXES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => playAudio(s.nameTib)}
                  disabled={playingItem !== null}
                  className="group flex flex-col items-center gap-1 border border-border-strong p-2 text-center transition hover:bg-surface-muted hover:border-brand"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-serif text-2xl" style={{ color: s.accent.hex }}>{s.head}</span>
                    <span className="text-[9px] uppercase tracking-widest text-ink-muted">{s.latin}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-1">How a Tibetan word is built <span className="font-tibetan not-italic text-ink-light ml-2">ཚིག་གི་གྲུབ་སྟངས།</span></h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">A Tibetan syllable is built from up to <span className="font-bold text-ink">seven slots</span> arranged around a single <span className="font-bold text-ink">root letter</span>. Each slot has a name, a position, and a job. The <span className="font-bold text-brand-dark">prefix</span> is the leftmost of them.</p>

            <Card className="p-0 overflow-hidden mb-6">
              <div className="border-b border-border-strong bg-gradient-to-b from-stone-50 to-white px-6 pb-10 pt-8 text-center md:pb-14 relative group">
                <div className="mb-8 text-eyebrow">A full syllable</div>
                <button onClick={() => playAudio("བསྒྲིམས་")} disabled={playingItem !== null} className="text-tibetan-display transition-colors hover:text-brand-dark" style={{ fontSize: "clamp(72px, 14vw, 156px)" }}>བསྒྲིམས་</button>
                {playingItem === "བསྒྲིམས་" && <Loader2 size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-brand" />}
                <div className="mt-6 text-[15px] italic text-ink-light"><span className="not-italic font-bold text-ink">bsgrims</span> — “concentrated” · read <span className="not-italic font-bold text-ink">drim</span></div>
              </div>

            
			<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-border-strong text-center items-stretch">
                {[
                  { letter: "བ", role: "Prefix", pos: "Before root", accent: "#c2410c", highlight: true, tib: "སྔོན་འཇུག" },
                  { letter: "ས", role: "Superscript", pos: "Above root", accent: "#7c3aed", tib: "མགོ་ཅན" },
                  { letter: "ག", role: "Root letter", pos: "The heart", accent: "#111827", tib: "མིང་གཞི" },
                  { letter: "ྲ", role: "Subscript", pos: "Below root", accent: "#0284c7", combining: true, svgTrans: "translate(-2px, 0px)", yOffset: "translateY(0px)", tib: "འདོགས་ཅན" },
                  
				  
				  { letter: "ི", role: "Vowel", pos: "Above / below", accent: "#059669", combining: true, svgTrans: "translate(-4px, 18px)", yOffset: "translateY(-24px)", tib: "དབྱངས" },
				  
                  { letter: "མ", role: "Suffix", pos: "After root", accent: "#b45309", tib: "རྗེས་འཇུག" },
                  { letter: "ས", role: "Post-suffix", pos: "Far right", accent: "#9333ea", tib: "ཡང་འཇུག" },
                ].map((s) => (
                  <div key={s.role} className={`relative p-5 flex flex-col items-center justify-start ${s.highlight ? "bg-brand-light" : "bg-surface"}`}>
                    {s.highlight && <span className="absolute top-2 right-2 bg-amber-200 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-brand-dark shadow-sm">This lesson</span>}
                    
                    <div className="relative flex items-center justify-center h-16 w-full mb-3 mt-2" style={s.yOffset ? { transform: s.yOffset } : undefined}>
                      {s.combining && (
                        <svg className="absolute text-border-strong" width="42" height="42" viewBox="0 0 100 100" style={{ transform: s.svgTrans }}>
                          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="14,10" />
                        </svg>
                      )}
                      <span className="relative z-10 leading-none flex items-center justify-center font-tibetan" style={{ color: s.accent, fontSize: s.combining ? "4rem" : "2.5rem" }}>
                        {s.combining ? "\u00A0" + s.letter : s.letter}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: s.accent }}>{s.role}</div>
                    <div className="font-tibetan text-[15px] font-medium text-ink not-italic mb-1.5 leading-tight">{s.tib}</div>
                    <div className="mt-auto text-[10px] text-ink-light font-bold uppercase tracking-widest">{s.pos}</div>
                  </div>
                ))}
              </div>
			
			
			
            </Card>
          </StepContainer>

          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <ChevronLeft size={14} /> Before the root
                </div>
                <p className="text-sm leading-relaxed text-ink-light">A prefix is a letter written <span className="font-bold text-ink">to the left</span> of the root. Only five letters — <span className="font-serif text-lg">ག ད བ མ འ</span> — may take that seat.</p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <BookOpen size={14} /> Writing
                </div>
                <p className="text-sm leading-relaxed text-ink-light">Prefixes disambiguate words on the page — e.g. <span className="font-serif text-lg">བཞི་</span> vs <span className="font-serif text-lg">གཞི་</span>.</p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <Volume2 size={14} /> Pronunciation
                </div>
                <p className="text-sm leading-relaxed text-ink-light">Prefixes never change <span className="font-bold text-ink">masculine</span> letters. They <span className="font-bold text-sky-700">deepen</span> feminine roots and <span className="font-bold text-rose-700">nasalise</span> very-feminine roots.</p>
              </Card>
            </div>

            <div className="mt-6 border border-border-strong bg-surface overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-border-strong text-center">
                {PREFIXES.map((s) => (
                  <button key={s.key} onClick={() => playAudio(s.nameTib)} disabled={playingItem !== null} className="group flex flex-col items-center gap-2 p-6 transition hover:bg-surface-muted">
                    <span className="h-1 w-10" style={{ backgroundColor: s.accent.hex }} />
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

            <div className="mt-6 p-6 border border-border-strong bg-surface">
              <div className="mb-4 flex items-center gap-2 text-eyebrow"><Info size={14} className="text-brand" /> Two rules of writing</div>
              <ol className="space-y-4 text-[15px] text-ink-light font-bold">
                <li className="flex gap-4"><span className="grid size-6 shrink-0 place-items-center rounded bg-surface-muted border border-border-strong text-[11px] text-ink-light">1</span><span>Only five letters — <span className="font-serif text-xl text-ink mx-1 px-2 py-0.5 bg-surface-muted border border-border-strong">{NEVER_TAKE}</span> — <em>never</em> take a prefix.</span></li>
                <li className="flex gap-4"><span className="grid size-6 shrink-0 place-items-center rounded bg-surface-muted border border-border-strong text-[11px] text-ink-light">2</span><span>A root that follows a prefix must carry <em>at least</em> a vowel, superscript, subscript, or suffix.</span></li>
              </ol>
            </div>
          </StepContainer>

          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-border-strong pb-4 gap-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[2].title}</h2>
              <Button variant="outline" onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))} className="text-[10px] uppercase tracking-widest px-3 py-1.5">
                {studyMode === "paper" ? <Moon size={14} /> : <Sun size={14} />} {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </Button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {PREFIXES.map((p) => {
                const on = p.key === activeTab;
                return (
                  <button key={p.key} onClick={() => setActiveTab(p.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-colors ${on ? "border-ink bg-ink text-white" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid size-9 place-items-center font-serif text-xl bg-white/10" style={{ color: on ? '#fff' : p.accent.hex, backgroundColor: on ? 'rgba(255,255,255,0.1)' : `${p.accent.hex}20` }}>{p.head}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">Prefix {p.latin}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-ink-muted" : "text-ink-light"}`}>{p.count}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <PrefixPanel p={PREFIXES.find(p => p.key === activeTab)!} night={studyMode === "night"} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface flex flex-col h-full">
                <div className="mb-4 inline-flex items-center gap-2 bg-rose-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-700 self-start">
                  <AlertTriangle size={14} /> ད + བ → [wa]
                </div>
                <div className="font-tibetan text-[2.5rem] leading-normal pb-2 text-ink mb-4">དབུ་ · དབྱེ་ · དབྲ་</div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">When ད precedes root བ, the stack reads as the <span className="font-bold text-ink">wa</span> family in a high tone: [wu], [ye], [ra].</p>
              </Card>

              <Card className="p-6 bg-surface flex flex-col h-full">
                <div className="mb-4 inline-flex items-center gap-2 bg-rose-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-700 self-start">
                  <AlertTriangle size={14} /> འ + བ → [ba]
                </div>
                <div className="font-tibetan text-[2.5rem] leading-normal pb-2 text-ink mb-4">འབུ་ · འབྲི་ · འབྲུ་</div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">With prefix འ the root བ retains its [b-] onset in a low nasal tone: [ng’bu], [ng’dri].</p>
              </Card>

              <Card className="p-6 bg-surface flex flex-col h-full">
                <div className="mb-4 inline-flex items-center gap-2 bg-rose-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-700 self-start">
                  <AlertTriangle size={14} /> ག + ཡ → [yo]
                </div>
                <div className="font-tibetan text-[2.5rem] leading-normal pb-2 text-ink mb-4">གཡོ་ · གཡུ་ · གཡི་</div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">Prefix ག lifts the feminine ཡ to a <span className="font-bold text-ink">high</span> tone.</p>
              </Card>
            </div>
          </StepContainer>

          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[4].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2 py-1 border border-border-strong">{VOCAB.length} words</span>
            </div>
            <VocabFilter playAudio={playAudio} playingItem={playingItem} />
          </StepContainer>

          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
             <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={6} step={STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)} isLast>
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: Suffixes & Post-suffixes." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/6" 
              onPass={() => markComplete(6)} 
            />
          </StepContainer>

        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/4" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== 6 && ( /* 🚨 FIXED */
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

function PrefixPanel({ p, night, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className={`relative overflow-hidden border transition-colors duration-500 ${night ? "border-white/10 bg-[#0f0d0a] text-stone-100" : "border-border-strong bg-surface"}`}>
      <div className="h-1 w-full" style={{ backgroundColor: p.accent.hex }} />
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-serif text-[4rem] leading-none" style={{ backgroundColor: night ? `${p.accent.hex}20` : `${p.accent.hex}15`, color: p.accent.hex }}>{p.head}</div>
          <div>
            <div className={`text-eyebrow mb-2 ${night ? "text-stone-400" : ""}`}>Prefix · {p.family === "nasal" ? "Nasalising" : "Silent"}</div>
            <div className="font-serif text-3xl font-bold">{p.title}</div>
            <div className={`mt-1 font-serif text-xl italic ${night ? "text-stone-400" : "text-ink-light"}`}>{p.nameTib}</div>
          </div>
        </div>
        <div>
          <p className={`text-[15px] leading-relaxed p-5 border ${night ? "bg-white/5 border-white/10 text-stone-300" : "bg-surface-muted border-border-strong text-ink-light"}`}>
            {p.intro}<br /><br />
            <span className={night ? "text-white font-bold" : "text-ink font-bold"}>Followed by </span>
            <span className={`font-serif text-xl font-bold ${night ? "text-white" : "text-ink"}`}>{p.followedBy}</span>
          </p>
          <div className={`mt-4 flex items-start gap-3 border-l-2 px-4 py-3 text-sm ${night ? "bg-white/5 text-stone-300" : "bg-brand-light text-ink"}`} style={{ borderColor: p.accent.hex }}>
            <Info className="mt-0.5 size-4 shrink-0" style={{ color: p.accent.hex }} />
            <span className="font-bold leading-relaxed">{p.usage}</span>
          </div>
        </div>
      </div>
      <div className={`grid grid-cols-2 gap-px border-b sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${night ? "border-white/10 bg-white/10" : "border-border-strong bg-border-strong"}`}>
        {p.combos.map((c: any) => {
          const M = TONE_META[c.tone as Tone];
          return (
            <button key={c.word + c.read} onClick={() => playAudio(c.word)} disabled={playingItem !== null} className={`group relative flex flex-col items-center justify-center gap-1.5 p-6 transition-colors ${night ? "bg-[#0f0d0a] hover:bg-[#1a1712]" : "bg-surface hover:bg-surface-muted"}`}>
              <span className="absolute left-0 top-0 h-0.5 w-full" style={{ backgroundColor: p.accent.hex }} />
              <span className="font-tibetan text-[2.5rem] leading-normal pb-2 mb-1" style={{ color: night ? '#fcd34d' : '#1c1917' }}>{c.word}</span>
              <span className={`font-mono text-xs font-bold ${night ? "text-stone-400" : "text-ink-light"}`}>[{c.read}]</span>
              {c.gloss && <span className={`text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-500" : "text-ink-muted"}`}>{c.gloss}</span>}
              <span className="mt-2 inline-flex size-5 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: M.hex }} title={M.label}><M.Icon size={12} strokeWidth={3} /></span>
              {playingItem === c.word && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
            </button>
          )
        })}
      </div>
      <div className={`p-6 md:p-8 border-b ${night ? "border-white/10 bg-[#0f0d0a]" : "border-border-strong bg-surface"}`}>
        <div className={`text-eyebrow mb-6 ${night ? "text-stone-400" : ""}`}>Spelling walkthrough</div>
        <div className="space-y-2">
          {p.combos.slice(0, 6).map((c: any) => {
            const M = TONE_META[c.tone as Tone];
            return (
              <div key={c.word + c.read} className={`flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 ${night ? "border-white/10 bg-white/5" : "border-border-strong bg-surface shadow-sm"}`}>
                <span className="font-tibetan text-[2.5rem] leading-normal pb-2 w-16 text-center text-ink">{c.word}</span>
                <span className={`text-xs font-bold font-serif ${night ? "text-stone-400" : "text-ink-light"}`}>{c.parts}</span>
                <ArrowRight size={16} className={night ? "text-stone-600" : "text-border-strong"} />
                <span className={`font-mono text-lg font-bold ${night ? "text-stone-100" : "text-ink"}`}>[{c.read}]</span>
                {c.gloss && <span className={`text-[13px] font-bold italic ${night ? "text-stone-400" : "text-ink-light"}`}>{c.gloss}</span>}
                <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 ${night ? "bg-black/30" : M.bg} ${M.text}`} style={{ color: night ? M.hex : undefined }}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                <Button variant="outline" onClick={() => playAudio(c.word)} disabled={playingItem !== null} className={`px-3 py-1.5 ${night ? "bg-white/10 border-white/20 hover:bg-white/20 text-amber-400" : ""}`}>
                  {playingItem === c.word ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={night ? "text-brand" : "text-brand-dark"} />}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`p-6 md:p-8 ${night ? "bg-black/40" : "bg-surface-muted"}`}>
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: p.accent.hex }} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${night ? "text-stone-200" : "text-ink"}`}>Mastery check · Prefix {p.latin}</span>
        </div>
        <MiniMastery p={p} night={night} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function MiniMastery({ p, night, playAudio, playingItem, playErrorBeep }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = useMemo(() => {
    const answer = p.combos[step % p.combos.length];
    const others = p.combos.filter((c: any) => c.word !== answer.word).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...others, answer].sort(() => 0.5 - Math.random());
    return { answer, choices };
  }, [p, step]);

  const total = Math.min(5, p.combos.length);
  const pick = (word: string) => {
    if (picked) return;
    setPicked(word);
    if (word === question.answer.word) { setScore(s => s + 1); playAudio(question.answer.word); } else { playErrorBeep(); }
  };

  if (step >= total) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border border-border-strong bg-surface">
        <div className={`text-[15px] font-bold ${night ? "text-stone-800" : "text-ink"}`}>Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: p.accent.hex }}>{score}</span> / {total} on prefix {p.latin}.</div>
        <Button variant="outline" onClick={() => { setStep(0); setScore(0); setPicked(null); }}><Shuffle size={14} /> Try again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className={night ? "text-stone-400" : "text-ink-muted"}>Question {step + 1} of {total}</span>
        <span style={{ color: p.accent.hex }}>Score {score}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className={`text-[15px] font-bold ${night ? "text-stone-300" : "text-ink-light"}`}>Which word reads</span>
        <span className={`font-mono text-2xl font-bold border px-3 py-1 ${night ? "bg-white/10 border-white/20 text-white" : "bg-surface border-border-strong text-ink"}`}>[{question.answer.read}]</span>
        {question.answer.gloss && <span className={`italic font-bold ${night ? "text-stone-400" : "text-ink-light"}`}>“{question.answer.gloss}”</span>}
        <Button variant="outline" onClick={() => playAudio(question.answer.word)} disabled={playingItem !== null} className={`px-3 py-2 ${night ? "bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30 text-amber-400" : ""}`}>
          {playingItem === question.answer.word ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={night ? "" : "text-brand"} />}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.choices.map((c: any) => {
          const right = picked && c.word === question.answer.word;
          const wrong = picked === c.word && c.word !== question.answer.word;
          return (
            <button key={c.word} disabled={!!picked} onClick={() => pick(c.word)} className={`flex aspect-[3/2] items-center justify-center border-2 font-tibetan text-3xl leading-normal pb-2 transition-all ${right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700" : night ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white" : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light text-ink hover:shadow-md"}`}>
              {c.word}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border shadow-sm ${night ? "bg-white/5 border-white/10" : "bg-surface border-border-strong"}`}>
          <span className={`text-sm font-bold ${picked === question.answer.word ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === question.answer.word ? `Correct — ${question.answer.word} reads [${question.answer.read}].` : `Answer: ${question.answer.word} reads [${question.answer.read}].`}
          </span>
          <Button variant="primary" onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto">Next <ChevronRight size={16} /></Button>
        </div>
      )}
    </div>
  );
}

function accentFor(k: PrefixKey): string {
  return PREFIXES.find((p) => p.key === k)!.accent.hex;
}

function VocabFilter({ playAudio, playingItem }: any) {
  const [filter, setFilter] = useState<PrefixKey | "all">("all");
  const items = filter === "all" ? VOCAB : VOCAB.filter((v) => v.prefix === filter);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {[{ key: "all", label: `All · ${VOCAB.length} words`, hex: undefined }, ...PREFIXES.map(s => ({ key: s.key, label: `${s.head} ${s.latin} · ${VOCAB.filter(v => v.prefix === s.key).length}`, hex: s.accent.hex }))].map((c) => {
          const active = filter === c.key;
          return (
            <button key={c.key} onClick={() => setFilter(c.key as any)} className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${active ? "border-ink bg-ink text-white shadow-sm" : "border-border-strong bg-surface text-ink-light hover:border-ink-muted hover:text-ink"}`}>
              {c.hex && <span className="size-2.5 rounded-full" style={{ backgroundColor: c.hex }} />}
              {c.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((v) => {
          const hex = accentFor(v.prefix);
          return (
            <button key={v.tib + v.translit} onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="group relative flex flex-col items-start gap-4 border border-border-strong bg-surface p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: hex }} />
              <div className="flex w-full items-start justify-between">
                <span className="text-3xl">{v.emoji}</span>
                <span className="inline-grid size-8 place-items-center bg-surface-muted border border-border-strong text-brand transition-colors group-hover:bg-brand-light group-hover:border-amber-200">
                  {playingItem === v.tib ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </span>
              </div>
              <div className="w-full border-b border-border-strong pb-3">
                <div className="text-tibetan-card mb-1">{v.tib}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">[{v.translit}]</div>
              </div>
              <div className="text-sm font-bold text-ink-light">{v.en}</div>
            </button>
          );
        })}
      </div>
      <div className="mt-10 border border-border-strong bg-surface-muted p-6 flex flex-col items-center sm:items-start sm:flex-row gap-6">
        <div className="bg-surface border border-border-strong p-3 shadow-sm shrink-0"><Info size={24} className="text-brand" /></div>
        <div>
          <div className="text-eyebrow mb-2">Reminder · Letters that never take a prefix</div>
          <p className="font-tibetan text-3xl font-bold text-ink tracking-[0.2em] leading-normal pb-2">{NEVER_TAKE}</p>
        </div>
      </div>
    </>
  );
}