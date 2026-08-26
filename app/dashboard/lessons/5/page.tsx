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
import { PREFIXES, VOCAB, NEVER_TAKE, STEPS, TONE_META, generateVocabQuiz, generateFinalQuiz, type PrefixKey, type Tone } from "@/app/data/lesson5";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";

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


const vocabQuestions = useMemo(() => generateVocabQuiz(), []);
  const quizQuestions = useMemo(() => generateFinalQuiz(), []);


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
            <p className="mt-2 font-tibetan text-3xl text-ink-light">སྔོན་འཇུག་ལྔ།</p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Five consonants — <span className="font-serif text-xl">ག ད བ མ འ</span> — may sit <em>before</em> a root letter. They shape both <span className="font-bold text-ink">spelling</span> and <span className="font-bold text-ink">pronunciation</span> (deepening feminine roots, adding a nasal onset with <span className="font-serif text-xl">མ</span> and <span className="font-serif text-xl">འ</span>).
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
                  <button key={p.key} onClick={() => setActiveTab(p.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all ${on ? "border-brand bg-brand text-ink shadow-sm" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid size-9 place-items-center font-serif text-2xl leading-none" style={{ color: on ? '#1c1917' : p.accent.hex }}>{p.head}</span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">Prefix {p.latin}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-ink-light mix-blend-multiply" : "text-ink-light"}`}>{p.count}</span>
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
                <div className="mb-6 inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start shadow-sm border border-rose-100">
                  <AlertTriangle size={18} /> <span className="font-tibetan text-2xl font-normal normal-case leading-none pt-1">ད + བ</span> <ArrowRight size={16} /> [WA]
                </div>
                <div className="flex flex-wrap items-center gap-2 font-tibetan text-3xl lg:text-[2rem] leading-normal text-ink mb-6">
                  <button onClick={() => playAudio('དབུ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">དབུ་</button>
                  <button onClick={() => playAudio('དབྱེ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">དབྱེ་</button>
                  <button onClick={() => playAudio('དབྲ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">དབྲ་</button>
                </div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">When ད precedes root བ, the stack reads as the <span className="font-bold text-ink">wa</span> family in a high tone: [wu], [ye], [ra].</p>
              </Card>

              <Card className="p-6 bg-surface flex flex-col h-full">
                <div className="mb-6 inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start shadow-sm border border-rose-100">
                  <AlertTriangle size={18} /> <span className="font-tibetan text-2xl font-normal normal-case leading-none pt-1">འ + བ</span> <ArrowRight size={16} /> [BA]
                </div>
                <div className="flex flex-wrap items-center gap-2 font-tibetan text-3xl lg:text-[2rem] leading-normal text-ink mb-6">
                  <button onClick={() => playAudio('འབུ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">འབུ་</button>
                  <button onClick={() => playAudio('འབྲི་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">འབྲི་</button>
                  <button onClick={() => playAudio('འབྲུ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">འབྲུ་</button>
                </div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">With prefix འ the root བ retains its [b-] onset in a low nasal tone: [ng’bu], [ng’dri].</p>
              </Card>

              <Card className="p-6 bg-surface flex flex-col h-full">
                <div className="mb-6 inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start shadow-sm border border-rose-100">
                  <AlertTriangle size={18} /> <span className="font-tibetan text-2xl font-normal normal-case leading-none pt-1">ག + ཡ</span> <ArrowRight size={16} /> [YO]
                </div>
                <div className="flex flex-wrap items-center gap-2 font-tibetan text-3xl lg:text-[2rem] leading-normal text-ink mb-6">
                  <button onClick={() => playAudio('གཡོ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">གཡོ་</button>
                  <button onClick={() => playAudio('གཡུ་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">གཡུ་</button>
                  <button onClick={() => playAudio('གཡི་')} disabled={playingItem !== null} className="border border-border-strong px-3 pt-4 pb-5 hover:border-brand hover:text-brand hover:bg-brand-light/50 transition-all flex items-center justify-center min-w-[3.5rem]">གཡི་</button>
                </div>
                <p className="mt-auto text-sm text-ink-light leading-relaxed">Prefix ག lifts the feminine ཡ to a <span className="font-bold text-ink">high</span> tone.</p>
              </Card>
            </div>
	
			
			
          </StepContainer>

 
  <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[4].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2 py-1 border border-border-strong">{VOCAB.length} words</span>
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
              <div className="mt-10 border border-border-strong bg-surface-muted p-6 flex flex-col items-center sm:items-start sm:flex-row gap-6">
                <div className="bg-surface border border-border-strong p-3 shadow-sm shrink-0"><Info size={24} className="text-brand" /></div>
                <div>
                  <div className="text-eyebrow mb-2">Reminder · Letters that never take a prefix</div>
                  <p className="font-tibetan text-3xl font-bold text-ink tracking-[0.2em] leading-normal pb-2">{NEVER_TAKE}</p>
                </div>
              </div>
            </div>

            <QuizModule
              title="Vocabulary Mastery" 
              intro="Check your memory of the new prefix words before moving on. This check tests all vocabulary words." 
              questions={vocabQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
            />
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
            <div className={`mt-1 font-tibetan text-2xl ${night ? "text-stone-400" : "text-ink-light"}`}>{p.nameTib}</div>
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
              <div key={c.word + c.read} className={`flex flex-wrap items-center gap-x-4 gap-y-3 border px-5 py-4 ${night ? "border-white/10 bg-white/5" : "border-border-strong bg-surface shadow-sm"}`}>
                
                {/* 1. Target word */}
                <span className="font-tibetan text-[2.5rem] leading-normal pb-2 w-12 text-center text-ink">{c.word}</span>
                


{/* 2. Spelling Math */}
                <span className={`flex items-center gap-2 md:gap-3 ${night ? "text-stone-400" : "text-ink-light"}`}>
                  {c.parts.split(' + ').map((part: string, idx: number) => {
                    const isCombining = ['ི', 'ུ', 'ེ', 'ོ', 'ྱ', 'ྲ', 'ླ', 'ྭ'].includes(part);
                    return (
                      <div key={idx} className="flex items-center gap-2 md:gap-3">
                        {idx > 0 && <span className="text-lg font-sans opacity-40">+</span>}
                        <span className="relative flex items-center justify-center min-w-[20px]">
                          <span className={`relative z-10 leading-none ${isCombining ? 'font-tibetan text-3xl' : 'font-tibetan text-2xl sm:text-3xl pt-1'}`}>
                            {isCombining ? "\u00A0" + part : part}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </span>


                
                <ArrowRight size={16} className={night ? "text-stone-600" : "text-border-strong"} />
                
                {/* 3. Final Result & Tone */}
                <div className="flex items-center gap-2">
                  <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: p.accent.hex }}>{c.word}</span>
                  <span className={`font-mono text-lg font-bold ${night ? "text-stone-100" : "text-ink"}`}>[{c.read}]</span>
                </div>
                
                {/* 4. Controls */}
                <div className="ml-auto flex items-center gap-3">
                  <span className={`hidden xl:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 ${night ? "bg-black/30" : M.bg} ${M.text}`} style={{ color: night ? M.hex : undefined }}><M.Icon size={14} strokeWidth={2.5} /> {M.label}</span>
                  <Button variant="outline" onClick={() => playAudio(c.word + " spelling")} disabled={playingItem !== null} className={`px-3 py-2 ${night ? "bg-white/10 border-white/20 hover:bg-white/20 text-amber-400" : ""}`}>
                    {playingItem === (c.word + " spelling") ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={night ? "text-brand" : "text-brand-dark"} />}
                  </Button>
                </div>
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
        <PrefixMiniMasteryLoader p={p} night={night} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function PrefixMiniMasteryLoader({ p, night, playAudio, playingItem, playErrorBeep }: any) {
  const [seed, setSeed] = useState(0);

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

  return (
    <QuizModule 
      key={`prefix-quiz-${seed}`}
      title=""
      variant="panel"
      isNightMode={night}
      accentColor={p.accent.hex}
      questions={questions}
      playAudio={playAudio}
      playingItem={playingItem}
      playErrorBeep={playErrorBeep}
    />
  );
}

