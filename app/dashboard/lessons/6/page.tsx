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
import { SUFFIXES, VOCAB, QUIZ, STEPS, FAMILY_META, VOWEL_SHIFTS, type SuffixKey, type Family } from "@/app/data/lesson6";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

export default function SuffixesLesson() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  
  // 🚨 FIXED: Hardcoded to 8 steps for the redesigned flow
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(8);

  const [activeTab, setActiveTab] = useState<SuffixKey>("ga");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  const [reveal, setReveal] = useState<null | "ten" | "two">(null);
  
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

  const quizQuestions = useMemo(() => {
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

  const postSuffixQuestions = useMemo(() => [
    { promptText: "Which two letters can act as post-suffixes?", answer: "da-sa", choices: [{label: "ད and ས", value: "da-sa", isTibetan: true}, {label: "ག and ང", value: "ga-nga", isTibetan: true}, {label: "བ and མ", value: "ba-ma", isTibetan: true}, {label: "ན and ལ", value: "na-la", isTibetan: true}], explanation: "Only ད (da) and ས (sa) can be used as post-suffixes." },
    { promptText: "Do post-suffixes change how a word is pronounced?", answer: "no", choices: [{label: "Yes", value: "yes"}, {label: "No", value: "no"}], explanation: "Post-suffixes are completely silent and do not alter the pronunciation." },
    { promptText: "Which post-suffix is still used in modern spelling?", answer: "sa", choices: [{label: "ད", value: "da", isTibetan: true}, {label: "ས", value: "sa", isTibetan: true}], explanation: "The post-suffix ས (sa) is still written today to distinguish homophones, while ད (da) is historical." },
  ], []);

  const vocabQuestions = useMemo(() => {
    const qs = [];
    for (const v of VOCAB) {
      const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji, en: x.en }));
      
      if (Math.random() > 0.5) {
        qs.push({
          isAudioType: true,
          type: 'base',
          questionText: "Listen and select the matching option.",
          answer: v.tib,
          audioString: v.tib,
          answerObj: v,
          choices
        });
      } else {
        qs.push({
          isAudioType: false,
          type: 'vocab',
          questionText: `Which word means "${v.en}"?`,
          answer: v.tib,
          audioString: v.tib,
          answerObj: v,
          choices
        });
      }
    }
    return qs.sort(() => 0.5 - Math.random());
  }, []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(7); // 🚨 FIXED: Hardcoded index 7 (for 8 steps)
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
          <span>Unit 06</span>
          <ChevronRight size={14} />
          <span className="text-ink">Suffixes & Post-suffixes</span>
        </div>

        <Card className="mb-12 grid gap-8 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <div className="mb-3 text-eyebrow text-brand-dark">Lesson 06 · Foundations</div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight tracking-tight">
              Suffixes & Post-suffixes
            </h1>
            <p className="mt-2 font-tibetan text-3xl not-italic text-ink-light">རྗེས་འཇུག་བཅུ་དང་ཡང་འཇུག་གཉིས།</p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Ten letters may follow the root — the <span className="font-bold text-ink">suffix</span> closes the syllable. A further <span className="font-bold text-ink">two</span> may sit beyond that suffix as a <span className="font-bold text-ink">post-suffix</span>. Together they shape the reading, the tense, and often the meaning of a word.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
              <Button variant="outline" onClick={() => setReveal((r) => (r === "ten" ? null : "ten"))} className={reveal === "ten" ? "bg-brand-light text-brand-dark border-amber-300" : ""}>10 suffixes</Button>
              <Button variant="outline" onClick={() => setReveal((r) => (r === "two" ? null : "two"))} className={reveal === "two" ? "bg-brand-light text-brand-dark border-amber-300" : ""}>2 post-suffixes</Button>
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
              <span className="text-brand-dark">{Math.min(unlockedStep, 8)} of 8 sections</span> {/* 🚨 FIXED */}
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
          
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <ArrowRight size={14} /> After the root
                </div>
                <p className="text-sm leading-relaxed text-ink-light">A suffix — <span className="font-tibetan text-xl not-italic">རྗེས་འཇུག</span> — is a letter written <span className="font-bold text-ink">immediately after</span> the root. Only ten letters may take this seat.</p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <BookOpen size={14} /> Writing
                </div>
                <p className="text-sm leading-relaxed text-ink-light">Any consonant — even itself — may be followed by a suffix (e.g. <span className="font-tibetan text-xl not-italic">དད་</span>). Suffix <span className="font-tibetan text-xl not-italic">འ</span> is special: it may only appear when the root also carries a prefix.</p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                  <Volume2 size={14} /> Pronunciation
                </div>
                <p className="text-sm leading-relaxed text-ink-light">A suffix closes the syllable. Four of them — <span className="font-tibetan text-xl not-italic font-bold">ད ན ལ ས</span> — recolour the preceding vowel into a fronted <em>[e / ü / ö]</em>.</p>
              </Card>
            </div>

            <div className="mt-6 border border-border-strong bg-surface overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 divide-x divide-y md:divide-y-0 divide-border-strong text-center">
                {SUFFIXES.map((x) => (
                  <button key={x.key} onClick={() => playAudio(x.head)} disabled={playingItem !== null} className="group flex flex-col items-center gap-2 p-4 transition hover:bg-surface-muted">
                    <span className="h-1 w-8" style={{ backgroundColor: x.accent }} />
                    <span className="mt-2 font-serif leading-none" style={{ fontSize: "2.5rem", color: x.accent }}>{x.head}</span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-ink">
                      {x.latin}
                      {playingItem === x.head ? (
                        <Loader2 size={10} className="animate-spin text-brand" />
                      ) : (
                        <Volume2 size={10} className="text-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </StepContainer>

          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-border-strong pb-4 gap-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[1].title}</h2>
              <Button variant="outline" onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))} className="text-[10px] uppercase tracking-widest px-3 py-1.5">
                {studyMode === "paper" ? <Moon size={14} /> : <Sun size={14} />} {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </Button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {SUFFIXES.map((s) => {
                const on = s.key === activeTab;
                return (
                  <button key={s.key} onClick={() => setActiveTab(s.key)} className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all ${on ? "border-brand bg-brand text-ink shadow-sm" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"}`}>
                    <span className="grid size-9 place-items-center font-serif text-2xl leading-none" style={{ color: on ? '#1c1917' : s.accent }}>{s.head}</span>
                    <span className="flex-1 pr-2">
                      <span className="block text-[13px] font-bold">Suffix {s.latin}</span>
                      <span className={`block text-[9px] font-bold uppercase tracking-widest mt-0.5 ${on ? "text-ink-light mix-blend-multiply" : "text-ink-muted"}`}>{s.reads}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <SuffixPanel s={SUFFIXES.find(x => x.key === activeTab)!} night={studyMode === "night"} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[2].title}</h2>
            </div>
            <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-light">Four suffixes — <span className="font-serif font-bold text-ink">ད ན ལ ས</span> — recolour the vowel that precedes them. Find a vowel on the left, follow the row across, and hear how each suffix reshapes it.</p>

            <div className="border border-border-strong bg-surface shadow-sm overflow-hidden">
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
                    
					
					
					{VOWEL_SHIFTS.map((r) => (
                      <tr key={r.label} className="hover:bg-surface-muted transition-colors">
                        <td className="px-5 py-5 border-r border-border-strong">
                          <div className="flex items-center gap-4">
                            <button onClick={() => playAudio(r.audioTarget)} disabled={playingItem !== null} className="group relative flex items-center justify-center hover:opacity-80 transition-opacity">
                              <span className="font-tibetan leading-none text-[2.5rem] text-brand">{r.vowel}</span>
                              {playingItem === r.audioTarget && <Loader2 size={16} className="absolute -top-1 -right-4 animate-spin text-brand" />}
                            </button>
                            <span className="text-[15px] font-bold text-ink">{r.label}</span>
                          </div>
                        </td>
					
					
                        {r.cells.map((cell, i) => (
                          <td key={i} className="border-l border-border-strong px-4 py-5 text-center">
                            <button onClick={() => playAudio(cell.word)} className="flex w-full flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity">
                              <span className="inline-block font-tibetan text-[2rem] font-bold" style={{ color: ["#7c3aed", "#0369a1", "#0891b2", "#0284c7"][i] }}>{cell.word}</span>
                              <span className="text-xs font-mono font-bold text-ink-muted">[{cell.read}]</span>
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </StepContainer>

          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-1">The two post-suffixes <span className="font-tibetan text-2xl not-italic text-ink-muted ml-2">ཡང་འཇུག་གཉིས།</span></h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">Only two letters — <span className="font-serif font-bold text-ink">ད</span> and <span className="font-serif font-bold text-ink">ས</span> — may sit <em>after</em> a suffix, becoming the very last letter of the word. They are <span className="font-bold text-ink">silent</span> — they don’t change how the word is pronounced.</p>

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
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light mb-6"><span className="font-serif text-lg">ད</span> is <span className="text-ink">no longer written</span> in modern Tibetan spelling. Grammatically, words still behave <em>as if</em> the ད were present.</p>
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
                          ["སྐྱོནད་", "སྐྱོན་", "flaw"]
                        ].map((r) => (
                          <tr key={r[0]} className="hover:bg-surface-muted transition-colors">
                            <td className="px-4 py-3">
                              <button onClick={() => playAudio(r[0])} disabled={playingItem !== null} className="group flex items-center gap-2 text-ink-muted hover:text-fuchsia-600 transition-colors">
                                <span className="font-tibetan not-italic text-[1.5rem] leading-none pt-1">{r[0]}</span>
                                {playingItem === r[0] ? <Loader2 size={12} className="animate-spin text-fuchsia-600" /> : <Volume2 size={12} className="opacity-0 group-hover:opacity-100" />}
                              </button>
                            </td>
                            <td className="px-4 py-3 border-l border-border-strong">
                              <button onClick={() => playAudio(r[1])} disabled={playingItem !== null} className="group flex items-center gap-2 text-ink hover:text-fuchsia-600 transition-colors">
                                <span className="font-tibetan not-italic text-[1.5rem] leading-none pt-1">{r[1]}</span>
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

              <Card className="p-0 flex flex-col h-full">
                <div className="flex items-center gap-4 border-b border-border-strong bg-surface-muted px-6 py-5">
                  <CheckCircle2 className="size-5 text-sky-700" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">Modern</div>
                    <div className="font-serif text-xl font-bold">Post-suffix <span className="text-3xl text-sky-600 ml-1">ས</span></div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[13px] font-bold leading-relaxed text-ink-light mb-6"><span className="font-serif text-lg">ས</span> is <span className="text-ink">still written</span> today. Its role is to differentiate near-identical words. The pronunciation is <span className="text-ink">the same</span> with or without it.</p>
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
                          ["ཐབ་", "ཐབས་", "stove → method"]
                        ].map((r) => (
                          <tr key={r[0]} className="hover:bg-surface-muted transition-colors">
                            <td className="px-4 py-3">
                              <button onClick={() => playAudio(r[0])} disabled={playingItem !== null} className="group flex items-center gap-2 text-ink-muted hover:text-sky-600 transition-colors">
                                <span className="font-tibetan not-italic text-[1.5rem] leading-none pt-1">{r[0]}</span>
                                {playingItem === r[0] ? <Loader2 size={12} className="animate-spin text-sky-600" /> : <Volume2 size={12} className="opacity-0 group-hover:opacity-100" />}
                              </button>
                            </td>
                            <td className="px-4 py-3 border-l border-border-strong">
                              <button onClick={() => playAudio(r[1])} disabled={playingItem !== null} className="group flex items-center gap-2 text-ink hover:text-sky-600 transition-colors">
                                <span className="font-tibetan not-italic text-[1.5rem] leading-none pt-1">{r[1]}</span>
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

            <div className="mt-12 border border-border-strong bg-surface-muted p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="size-5 text-sky-700" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Post-Suffix Mastery Check</span>
              </div>
              <MiniMastery questions={postSuffixQuestions} playAudio={playAudio} playErrorBeep={playErrorBeep} title="Post-Suffixes" />
            </div>
          </StepContainer>

          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
             <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[4].title}</h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">Now that words can stretch to four horizontal letters, the eye needs a strategy. With practice, finding the root becomes automatic.</p>
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

          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[5].title}</h2>
              <span className="text-xs font-bold text-ink-light bg-surface-muted px-2 py-1 border border-border-strong">{VOCAB.length} words</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-10">
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

            <QuizModule 
              title="Vocabulary Mastery Check" 
              intro="Check your memory of the new suffix words before moving on. This check tests all vocabulary words." 
              questions={vocabQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
            />
          </StepContainer>

          <StepContainer index={6} step={STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
             <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={7} step={STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => markComplete(7)} isLast>
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: Capstone." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/7" 
              onPass={() => markComplete(7)} 
            />
          </StepContainer>

        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/5" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== 7 && ( /* 🚨 FIXED */
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

function SuffixPanel({ s, night, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className={`relative overflow-hidden border transition-colors duration-500 ${night ? "border-white/10 bg-[#0f0d0a] text-stone-100" : "border-border-strong bg-surface"}`}>
      <div className="h-1 w-full" style={{ backgroundColor: s.accent }} />
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-serif text-[4rem] leading-none" style={{ backgroundColor: night ? `${s.accent}20` : `${s.accent}15`, color: s.accent }}>{s.head}</div>
          <div>
            <div className={`text-eyebrow mb-2 ${night ? "text-stone-400" : ""}`}>Suffix · {FAMILY_META[s.family as Family].label}</div>
            <div className="font-serif text-3xl font-bold">{s.latin}</div>
            <div className={`text-sm mt-2 font-bold ${night ? "text-stone-300" : "text-ink-light"}`}>Reads as <span style={{ color: s.accent }}>{s.reads}</span></div>
          </div>
        </div>
        <div>
          <p className={`text-[15px] leading-relaxed p-5 border ${night ? "bg-white/5 border-white/10 text-stone-300" : "bg-surface-muted border-border-strong text-ink-light"}`}>
            {s.hint}
          </p>
          {s.note && (
            <div className={`mt-4 flex items-start gap-3 border-l-2 px-4 py-3 text-sm font-bold ${night ? "border-white/30 text-stone-300 bg-white/5" : "border-amber-400 text-ink-light bg-brand-light/50"}`}>
              <Info className="mt-0.5 size-4 shrink-0 text-brand" /><span>{s.note}</span>
            </div>
          )}
          {s.vowelShift && (
            <div className={`mt-4 flex items-start gap-3 border-l-2 px-4 py-3 text-sm font-bold ${night ? "border-sky-400 text-stone-300 bg-sky-900/20" : "border-sky-500 text-ink-light bg-sky-50/50"}`}>
              <Sparkles className="mt-0.5 size-4 shrink-0 text-sky-500" /><span>{s.vowelShift}</span>
            </div>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-px border-b sm:grid-cols-3 ${night ? "border-white/10 bg-white/10" : "border-border-strong bg-border-strong"}`}>
        {s.examples.map((ex: any) => (
          <button key={ex.word} onClick={() => playAudio(ex.word)} disabled={playingItem !== null} className={`group relative flex flex-col items-center justify-center gap-1.5 p-6 transition-colors ${night ? "bg-[#0f0d0a] hover:bg-[#1a1712]" : "bg-surface hover:bg-surface-muted"}`}>
            <span className="absolute left-0 top-0 h-0.5 w-full" style={{ backgroundColor: s.accent }} />
            <span className="font-tibetan text-[2.5rem] leading-normal pb-2 mb-1" style={{ color: night ? '#fcd34d' : '#1c1917' }}>{ex.word}</span>
            <span className={`font-mono text-xs font-bold ${night ? "text-stone-400" : "text-ink-light"}`}>[{ex.read}]</span>
            {ex.gloss && <span className={`text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-500" : "text-ink-muted"}`}>{ex.gloss}</span>}
            {playingItem === ex.word && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
          </button>
        ))}
      </div>

      <div className={`p-6 md:p-8 border-b ${night ? "border-white/10 bg-[#0f0d0a]" : "border-border-strong bg-surface"}`}>
        <div className={`text-eyebrow mb-6 ${night ? "text-stone-400" : ""}`}>Spelling walkthrough</div>
        
		
		
		<div className="space-y-2">
          {s.examples.map((ex: any) => (
            <div key={ex.word} className={`flex flex-wrap items-center gap-x-4 gap-y-3 border px-5 py-4 ${night ? "border-white/10 bg-white/5" : "border-border-strong bg-surface shadow-sm"}`}>
              <span className="font-tibetan text-[2.5rem] leading-normal pb-2 w-20 sm:w-24 shrink-0 text-left text-ink" style={{ color: night ? '#fff' : '#1c1917' }}>{ex.word}</span>
		
              
              <span className={`flex items-center gap-2 md:gap-3 ${night ? "text-stone-400" : "text-ink-light"}`}>
                {ex.parts.split(' + ').map((part: string, idx: number) => {
                  const isCombining = ['ི', 'ུ', 'ེ', 'ོ', 'ྱ', 'ྲ', 'ླ', 'ྭ', 'ྐ', 'ྒ', 'ྤ', 'ྩ'].includes(part);
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
              
              <div className="flex items-center gap-2">
                <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: s.accent }}>{ex.word}</span>
                <span className={`font-mono text-lg font-bold ${night ? "text-stone-100" : "text-ink"}`}>[{ex.read}]</span>
              </div>
              
              <div className="ml-auto flex items-center gap-3">
                <Button variant="outline" onClick={() => playAudio(ex.word + " spelling")} disabled={playingItem !== null} className={`px-3 py-2 ${night ? "bg-white/10 border-white/20 hover:bg-white/20 text-amber-400" : ""}`}>
                  {playingItem === (ex.word + " spelling") ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={night ? "text-brand" : "text-brand-dark"} />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

  
  <div className={`p-6 md:p-8 ${night ? "bg-black/40" : "bg-surface-muted"}`}>
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: s.accent }} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${night ? "text-stone-200" : "text-ink"}`}>Mastery check · Suffix {s.latin}</span>
        </div>
        <SuffixMiniMastery key={s.key} s={s} night={night} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
  
    </div>
  );
}

function SuffixMiniMastery({ s, night, playAudio, playingItem, playErrorBeep }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [seed, setSeed] = useState(0);

  const questions = useMemo(() => {
    const shuffled = [...s.examples].sort(() => 0.5 - Math.random());
    return shuffled.map((answer: any) => {
      const allOtherExamples = SUFFIXES.flatMap(x => x.examples).filter(x => x.word !== answer.word);
      const wrongs = allOtherExamples.sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [...wrongs, answer].sort(() => 0.5 - Math.random());
      return { answer, choices };
    });
  }, [s.key, seed]);

  const total = questions.length;
  const question = questions[step] || questions[0];

  const pick = (word: string) => {
    if (picked) return;
    setPicked(word);
    if (word === question.answer.word) { 
      setScore(sc => sc + 1); 
      playAudio(question.answer.word); 
    } else { 
      playErrorBeep(); 
    }
  };

  if (step >= total) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border border-border-strong bg-surface">
        <div className={`text-[15px] font-bold ${night ? "text-stone-800" : "text-ink"}`}>Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: s.accent }}>{score}</span> / {total} on suffix {s.latin}.</div>
        <Button variant="outline" onClick={() => { setStep(0); setScore(0); setPicked(null); setSeed(sd => sd + 1); }}><Shuffle size={14} /> Try again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className={night ? "text-stone-400" : "text-ink-muted"}>Question {step + 1} of {total}</span>
        <span style={{ color: s.accent }}>Score {score}</span>
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
          <Button variant="primary" onClick={() => { setPicked(null); setStep(st => st + 1); }} className="w-full sm:w-auto">Next <ChevronRight size={16} /></Button>
        </div>
      )}
    </div>
  );
}

function MiniMastery({ questions: initialQuestions, playAudio, playErrorBeep, title = "Mastery Check" }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [seed, setSeed] = useState(0);

  const questions = useMemo(() => {
    return [...initialQuestions].sort(() => 0.5 - Math.random());
  }, [initialQuestions, seed]);

  const question = questions[step % questions.length];
  const total = questions.length;

  const pick = (val: string) => {
    if (picked) return;
    setPicked(val);
    if (val === question.answer) {
      setScore(s => s + 1);
      if (question.audioTarget) playAudio(question.audioTarget);
    } else { playErrorBeep(); }
  };

  if (step >= total) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border border-border-strong bg-surface">
        <div className="text-[15px] font-bold text-ink">Nicely done. You scored <span className="font-serif text-2xl mx-1 text-brand-dark">{score}</span> / {total}.</div>
        <Button variant="outline" onClick={() => { setStep(0); setScore(0); setPicked(null); setSeed(s => s + 1); }}><Shuffle size={14} /> Try again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-eyebrow text-ink-muted">
        <span>{title} · Question {step + 1} of {total}</span>
        <span className="text-brand-dark">Score {score}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="text-[15px] font-bold text-ink-light">{question.promptText}</span>
        {question.promptHighlight && <span className="font-tibetan text-3xl font-bold border border-border-strong bg-surface px-4 py-2 text-ink">{question.promptHighlight}</span>}
        {question.promptEnd && <span className="text-[15px] font-bold text-ink-light">{question.promptEnd}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-4">
        {question.choices.map((c: any) => {
          const right = picked && c.value === question.answer;
          const wrong = picked === c.value && c.value !== question.answer;
          return (
            <button key={c.value} disabled={!!picked} onClick={() => pick(c.value)} className={`flex items-center justify-center border-2 font-bold text-xl py-6 px-4 text-center transition-all ${right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60" : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light text-ink hover:shadow-md"} ${c.isTibetan ? 'font-tibetan text-[2rem]' : 'font-mono'}`}>
              {c.label}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-border-strong bg-surface shadow-sm">
          <span className={`text-sm font-bold ${picked === question.answer ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === question.answer ? `Correct!` : question.explanation || `Incorrect.`}
          </span>
          <Button variant="primary" onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto">Next <ChevronRight size={16} /></Button>
        </div>
      )}
    </div>
  );
}