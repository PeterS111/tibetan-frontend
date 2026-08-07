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
import { SUFFIXES, VOCAB, QUIZ, STEPS, FAMILY_META, SPELLINGS, VOWEL_SHIFTS, type SuffixKey } from "@/app/data/lesson6";

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
  
  // 🚨 ADDED: State to manage the Dev Bypass button loading screen
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

  // Mastery Checks Setup
  const suffixQuestions = useMemo(() => [
    { promptText: "Which suffix is almost silent (a glottal stop)?", answer: "ག", choices: [{label: "ག", value: "ག", isTibetan: true}, {label: "མ", value: "མ", isTibetan: true}, {label: "ར", value: "ར", isTibetan: true}, {label: "ལ", value: "ལ", isTibetan: true}], explanation: "The suffix ག (ga) is pronounced as a light glottal stop." },
    { promptText: "Which suffix has a nasal sound like the 'ng' in lung?", answer: "ང", choices: [{label: "ན", value: "ན", isTibetan: true}, {label: "མ", value: "མ", isTibetan: true}, {label: "ང", value: "ང", isTibetan: true}, {label: "བ", value: "བ", isTibetan: true}], explanation: "The suffix ང (nga) gives a nasal 'ng' sound." },
    { promptText: "How does", promptHighlight: "རབ་", promptEnd: "read?", answer: "rap", audioTarget: "རབ་", choices: [{label: "rap", value: "rap"}, {label: "ram", value: "ram"}, {label: "rak", value: "rak"}, {label: "rang", value: "rang"}], explanation: "རབ་ uses the བ (ba) suffix, which closes the syllable with a soft 'p' sound." },
    { promptText: "Which suffix is pronounced like a Scottish rolled 'r'?", answer: "ར", choices: [{label: "ལ", value: "ལ", isTibetan: true}, {label: "ར", value: "ར", isTibetan: true}, {label: "ས", value: "ས", isTibetan: true}, {label: "ད", value: "ད", isTibetan: true}], explanation: "The suffix ར (ra) is pronounced as a rolled 'r'." },
  ], []);

  const postSuffixQuestions = useMemo(() => [
    { promptText: "Which two letters can act as post-suffixes?", answer: "da-sa", choices: [{label: "ད and ས", value: "da-sa", isTibetan: true}, {label: "ག and ང", value: "ga-nga", isTibetan: true}, {label: "བ and མ", value: "ba-ma", isTibetan: true}, {label: "ན and ལ", value: "na-la", isTibetan: true}], explanation: "Only ད (da) and ས (sa) can be used as post-suffixes." },
    { promptText: "Do post-suffixes change how a word is pronounced?", answer: "no", choices: [{label: "Yes", value: "yes"}, {label: "No", value: "no"}], explanation: "Post-suffixes are completely silent and do not alter the pronunciation." },
    { promptText: "Which post-suffix is still used in modern spelling?", answer: "sa", choices: [{label: "ད", value: "da", isTibetan: true}, {label: "ས", value: "sa", isTibetan: true}], explanation: "The post-suffix ས (sa) is still written today to distinguish homophones, while ད (da) is historical." },
  ], []);

  const vocabQuestions = useMemo(() => {
    const targets = [...VOCAB].sort(() => 0.5 - Math.random()).slice(0, 5);
    return targets.map(v => {
      const others = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [v, ...others].sort(() => 0.5 - Math.random()).map(c => ({
        label: c.read, value: c.read
      }));
      return {
        promptText: "How does", promptHighlight: v.tib, promptEnd: "read?",
        answer: v.read, audioTarget: v.tib, choices, explanation: `${v.tib} reads [${v.read}].`
      };
    });
  }, []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* 🚨 TEMPORARY DEV BUTTON - DELETE AFTER TESTING 🚨 */}
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(STEPS.length - 1);
            // Wait a second to guarantee the network request finishes, then auto-redirect
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
            {/* Same implementation as before */}
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
              {/* Table rendering implementation remains identical */}
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
            
            {/* TASK 3: Added Suffix Mastery Check block */}
            <div className="mt-12 border border-border-strong bg-surface-muted p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="size-5 text-brand-dark" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Suffix Mastery Check</span>
              </div>
              <MiniMastery questions={suffixQuestions} playAudio={playAudio} playErrorBeep={playErrorBeep} title="Suffixes" />
            </div>
          </StepContainer>

          {/* TASK 3: New Step 03 - Spelling Walkthrough */}
          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-1">{STEPS[2].title}</h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-ink-light">
              To spell a word with a suffix, read the root letter, then the suffix, then read them together as the final word. Click each to hear it spelt out.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {SPELLINGS.map((s, idx) => (
                <button key={idx} onClick={() => playAudio(s.word)} className="text-left border border-border-strong bg-surface p-6 hover:border-brand hover:shadow-sm transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <span className="font-tibetan text-4xl text-ink group-hover:text-brand transition-colors">{s.word}</span>
                     <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">{s.en}</span>
                   </div>
                   <div className="text-xl font-tibetan text-ink-light mb-1">{s.spell}</div>
                   <div className="text-sm font-mono text-brand-dark">{s.roman}</div>
                </button>
              ))}
            </div>
          </StepContainer>

          {/* Step 04: Vowel Shift Table */}
          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[3].title}</h2>
            </div>
            <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-ink-light">
              Four suffixes — <span className="font-serif font-bold text-ink">ད ན ལ ས</span> — recolour the vowel that precedes them. Find a vowel on the left, follow the row across, and hear how each suffix reshapes it.
            </p>

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
                  
                  {/* TASK 3: Updated to map over proper VOWEL_SHIFTS object with real words */}
                  <tbody className="divide-y divide-border-strong">
                    {VOWEL_SHIFTS.map((r) => (
                      <tr key={r.label} className="hover:bg-surface-muted transition-colors">
                        <td className="px-5 py-5 border-r border-border-strong">
                          <div className="flex items-center gap-4">
                            <span className="font-serif leading-none text-[2.5rem] text-brand">{r.vowel}</span>
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

          {/* Step 05: Post-suffixes */}
          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-1">
                The two post-suffixes <span className="font-serif italic text-ink-muted ml-2">ཡང་འཇུག་གཉིས།</span>
              </h2>
            </div>
            {/* Same history UI... */}
            
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

            {/* TASK 3: Added Post-Suffix Mastery Check block */}
            <div className="mt-12 border border-border-strong bg-surface-muted p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="size-5 text-sky-700" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Post-Suffix Mastery Check</span>
              </div>
              <MiniMastery questions={postSuffixQuestions} playAudio={playAudio} playErrorBeep={playErrorBeep} title="Post-Suffixes" />
            </div>
          </StepContainer>

          {/* Step 06: Root Letter Recognition */}
          <StepContainer index={5} step={STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
             {/* Same logic, index incremented */}
             <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[5].title}</h2>
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

          {/* Step 07: Vocabulary */}
          <StepContainer index={6} step={STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
            <div className="mb-6 flex items-center justify-between border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink">{STEPS[6].title}</h2>
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
              <MiniMastery questions={vocabQuestions} playAudio={playAudio} playErrorBeep={playErrorBeep} title="Vocabulary" />
            </div>
          </StepContainer>

          {/* Step 08: Cumulative Practice */}
          <StepContainer index={7} step={STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => markComplete(7)}>
             <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* 🚨 FIXED: Step 09: Final Test */}
          <StepContainer index={8} step={STEPS[8]} status={statusOf(8)} isExpanded={expandedStep === 8} onToggle={() => toggleStep(8)} onContinue={() => {}} isLast>
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: Capstone." 
              questions={quizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/7" 
              onPass={() => markComplete(8)}
            />
          </StepContainer>

        </div>
      </div>
      
      {/* 🚨 ADDED: Sticky Footer */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/5" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== STEPS.length - 1 && (
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

/* ------------------------------------------------------------------ */
/* Generic Mini Mastery Component for Tasks 3                          */
/* ------------------------------------------------------------------ */
function MiniMastery({ questions, playAudio, playErrorBeep, title = "Mastery Check" }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = questions[step % questions.length];
  const total = questions.length;

  const pick = (val: string) => {
    if (picked) return;
    setPicked(val);
    if (val === question.answer) {
      setScore(s => s + 1);
      if (question.audioTarget) playAudio(question.audioTarget);
    } else {
      playErrorBeep();
    }
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
        <span>{title} · Question {step + 1} of {total}</span>
        <span className="text-brand-dark">Score {score}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="text-[15px] font-bold text-ink-light">{question.promptText}</span>
        {question.promptHighlight && (
          <span className="font-tibetan text-3xl font-bold border border-border-strong bg-surface px-4 py-2 text-ink">{question.promptHighlight}</span>
        )}
        {question.promptEnd && (
          <span className="text-[15px] font-bold text-ink-light">{question.promptEnd}</span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-4">
        {question.choices.map((c: any) => {
          const right = picked && c.value === question.answer;
          const wrong = picked === c.value && c.value !== question.answer;
          return (
            <button
              key={c.value} disabled={!!picked} 
              onClick={() => pick(c.value)}
              className={`flex items-center justify-center border-2 font-bold text-xl py-6 px-4 text-center transition-all ${
                right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" 
                : wrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60" 
                : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light text-ink hover:shadow-md"
              } ${c.isTibetan ? 'font-tibetan text-[2rem]' : 'font-mono'}`}
            >
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
          <Button variant="primary" onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto">
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}