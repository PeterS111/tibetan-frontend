"use client";

import { useState, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import {
  Volume2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Shuffle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Target,
  Loader2,
  XCircle,
  RotateCcw,
  Trophy // Added missing Trophy import
} from "lucide-react";

/* -------------------------------------------------------------------- */
/* Constants & Types                                                    */
/* -------------------------------------------------------------------- */

const PASS_THRESHOLD = 0.8;
const TIB: React.CSSProperties = { fontFamily: "Jomolhari, 'Noto Sans Tibetan', serif" };

type Concept = "consonants" | "vowels" | "superscripts" | "subscripts" | "prefixes" | "suffixes";

interface MCQuestion {
  kind: "mc";
  id: string;
  concept: Concept;
  prompt: ReactNode;
  helper?: ReactNode;
  choices: { key: string; label: ReactNode }[];
  answerKey: string;
}

interface RootPickQuestion {
  kind: "root";
  id: string;
  concept: Concept;
  cluster: string;
  translit: string;
  tiles: string[];
  answer: string;
}

interface OrderQuestion {
  kind: "order";
  id: string;
  concept: Concept;
  cluster: string;
  translit: string;
  steps: string[];
}

interface ListenQuestion {
  kind: "listen";
  id: string;
  concept: Concept;
  spoken: string;
  choices: { tib: string; translit: string }[];
  answerTib: string;
}

type Question = MCQuestion | RootPickQuestion | OrderQuestion | ListenQuestion;

function shuffle<T>(arr: T[]): T[] {
  return [...arr]
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

/* -------------------------------------------------------------------- */
/* Question Bank Data                                                   */
/* -------------------------------------------------------------------- */

const CONSONANTS = [
  { tib: "ཀ", translit: "ka" }, { tib: "ཁ", translit: "kha" }, { tib: "ག", translit: "ga" }, { tib: "ང", translit: "nga" },
  { tib: "ཅ", translit: "cha" }, { tib: "ཆ", translit: "chha" }, { tib: "ཇ", translit: "ja" }, { tib: "ཉ", translit: "nya" },
  { tib: "ཏ", translit: "ta" }, { tib: "ཐ", translit: "tha" }, { tib: "ད", translit: "da" }, { tib: "ན", translit: "na" },
  { tib: "པ", translit: "pa" }, { tib: "ཕ", translit: "pha" }, { tib: "བ", translit: "ba" }, { tib: "མ", translit: "ma" },
  { tib: "ཙ", translit: "tsa" }, { tib: "ཞ", translit: "zha" }, { tib: "ཟ", translit: "za" }, { tib: "འ", translit: "a" },
  { tib: "ཡ", translit: "ya" }, { tib: "ར", translit: "ra" }, { tib: "ལ", translit: "la" }, { tib: "ཤ", translit: "sha" },
  { tib: "ས", translit: "sa" }, { tib: "ཧ", translit: "ha" }, { tib: "ཨ", translit: "ah" },
];

const VOWELS = [
  { tib: "ཀི", base: "ཀ", translit: "ki", name: "gi-gu" },
  { tib: "ཀུ", base: "ཀ", translit: "ku", name: "zhabs-kyu" },
  { tib: "ཀེ", base: "ཀ", translit: "ke", name: "'greng-bu" },
  { tib: "ཀོ", base: "ཀ", translit: "ko", name: "na-ro" },
  { tib: "མི", base: "མ", translit: "mi", name: "gi-gu" },
  { tib: "ལུ", base: "ལ", translit: "lu", name: "zhabs-kyu" },
];

const STACKS = [
  { cluster: "ལག", translit: "lak", parts: ["ལ", "ག"], root: "ལ" },
  { cluster: "ནག", translit: "nak", parts: ["ན", "ག"], root: "ན" },
  { cluster: "ཁང་", translit: "khang", parts: ["ཁ", "ང"], root: "ཁ" },
  { cluster: "གངས་", translit: "gang", parts: ["ག", "ང", "ས"], root: "ག" },
  { cluster: "ཁམས་", translit: "kham", parts: ["ཁ", "མ", "ས"], root: "ཁ" },
  { cluster: "ནགས་", translit: "nak", parts: ["ན", "ག", "ས"], root: "ན" },
  { cluster: "དཀར་", translit: "kar", parts: ["ད", "ཀ", "ར"], root: "ཀ" },
  { cluster: "དགའ་", translit: "ga", parts: ["ད", "ག", "འ"], root: "ག" },
  { cluster: "མདངས་", translit: "dang", parts: ["མ", "ད", "ང", "ས"], root: "ད" },
];

const PREFIX_TONE: { prefix: string; root: string; cluster: string; translit: string; tone: "high" | "low" }[] = [
  { prefix: "ད", root: "ཀ", cluster: "དཀ", translit: "ka", tone: "high" },
  { prefix: "ད", root: "ག", cluster: "དག", translit: "ga", tone: "high" },
  { prefix: "བ", root: "ཀ", cluster: "བཀ", translit: "ka", tone: "high" },
  { prefix: "མ", root: "ག", cluster: "མག", translit: "ga", tone: "low" },
  { prefix: "འ", root: "ག", cluster: "འག", translit: "ga", tone: "low" },
  { prefix: "ག", root: "ཙ", cluster: "གཙ", translit: "tsa", tone: "high" },
];

const VOCAB = [
  { tib: "རྟ", translit: "ta", en: "horse" },
  { tib: "སྒྲ", translit: "dra", en: "sound" },
  { tib: "དགེ", translit: "ge", en: "virtuous" },
  { tib: "སྐྱ་སྐྱ", translit: "kya-kya", en: "pale / grey" },
  { tib: "ལག", translit: "lak", en: "hand" },
  { tib: "ནག", translit: "nak", en: "black" },
  { tib: "གངས", translit: "gang", en: "snow" },
  { tib: "ནགས", translit: "nak", en: "forest" },
  { tib: "ཁམས", translit: "kham", en: "region (Kham)" },
  { tib: "ཁང", translit: "khang", en: "house" },
  { tib: "མི", translit: "mi", en: "person" },
  { tib: "བོད", translit: "bö", en: "Tibet" },
  { tib: "ཟླ", translit: "da", en: "moon" },
  { tib: "རྒྱལ", translit: "gyal", en: "king / victory" },
];

const LISTEN_GROUPS: { concept: Concept; items: { tib: string; translit: string }[] }[] = [
  { concept: "consonants", items: [{ tib: "ཀ", translit: "ka" }, { tib: "ཁ", translit: "kha" }, { tib: "ག", translit: "ga" }, { tib: "ང", translit: "nga" }] },
  { concept: "consonants", items: [{ tib: "ཏ", translit: "ta" }, { tib: "ཐ", translit: "tha" }, { tib: "ད", translit: "da" }, { tib: "ན", translit: "na" }] },
  { concept: "subscripts", items: [{ tib: "རྟ", translit: "ta" }, { tib: "སྒྲ", translit: "dra" }, { tib: "སྐྱ", translit: "kya" }, { tib: "རྒྱ", translit: "gya" }] },
  { concept: "vowels", items: [{ tib: "ཀི", translit: "ki" }, { tib: "ཀུ", translit: "ku" }, { tib: "ཀེ", translit: "ke" }, { tib: "ཀོ", translit: "ko" }] },
  { concept: "suffixes", items: [{ tib: "ལག", translit: "lak" }, { tib: "ནག", translit: "nak" }, { tib: "གངས", translit: "gang" }, { tib: "ཁམས", translit: "kham" }] },
  { concept: "prefixes", items: [{ tib: "དགེ", translit: "ge" }, { tib: "དཀར", translit: "kar" }, { tib: "དགའ", translit: "ga" }, { tib: "མདངས", translit: "dang" }] },
];

function buildBank(): Question[] {
  const qs: Question[] = [];

  for (const c of shuffle(CONSONANTS).slice(0, 5)) {
    const wrong = shuffle(CONSONANTS.filter((x) => x.translit !== c.translit)).slice(0, 3);
    qs.push({
      kind: "mc", id: `cons-${c.tib}`, concept: "consonants",
      prompt: <span>How does <span className="font-serif text-3xl" style={TIB}>{c.tib}</span> read?</span>,
      choices: shuffle([c, ...wrong]).map((x) => ({ key: x.translit, label: x.translit })), answerKey: c.translit,
    });
  }

  for (const v of shuffle(VOWELS).slice(0, 3)) {
    const wrong = shuffle(VOWELS.filter((x) => x.translit !== v.translit)).slice(0, 3);
    qs.push({
      kind: "mc", id: `vow-${v.tib}`, concept: "vowels",
      prompt: <span>Which vowel gives <span className="font-serif text-3xl" style={TIB}>{v.tib}</span>?</span>,
      choices: shuffle([v, ...wrong]).map((x) => ({ key: x.translit, label: `[${x.translit}]` })), answerKey: v.translit,
    });
  }

  for (const s of shuffle(STACKS).slice(0, 5)) {
    const others = CONSONANTS.filter((c) => !s.parts.includes(c.tib));
    const distractors = shuffle(others).slice(0, 4 - s.parts.length);
    const tiles = shuffle([...s.parts, ...distractors.map((d) => d.tib)]);
    qs.push({
      kind: "root", id: `root-${s.cluster}`,
      concept: ["ད", "བ", "མ", "འ", "ག"].includes(s.parts[0]) && s.parts.length >= 3 ? "prefixes" : "suffixes",
      cluster: s.cluster, translit: s.translit, tiles, answer: s.root,
    });
  }

  for (const p of shuffle(PREFIX_TONE).slice(0, 4)) {
    qs.push({
      kind: "mc", id: `tone-${p.cluster}`, concept: "prefixes",
      prompt: <span>In <span className="font-serif text-3xl" style={TIB}>{p.cluster}</span> the root <span className="font-serif text-2xl" style={TIB}>{p.root}</span> is read as <span className="font-medium">[{p.translit}]</span> in which tone?</span>,
      choices: shuffle([{ key: "high", label: "High tone" }, { key: "low", label: "Low tone" }]), answerKey: p.tone,
    });
  }

  const orderPool = [
    { cluster: "སྐྱ", translit: "kya", steps: ["ས", "ཀ", "བཏགས", "སྐ", "ཡ", "བཏགས", "སྐྱ"] },
    { cluster: "རྒྱ", translit: "gya", steps: ["ར", "ག", "བཏགས", "རྒ", "ཡ", "བཏགས", "རྒྱ"] },
    { cluster: "དགེ", translit: "ge", steps: ["ད", "ག", "དག", "ེ", "དགེ"] },
    { cluster: "བཀྲ", translit: "tra", steps: ["བ", "ཀ", "ར", "བཏགས", "བཀྲ"] },
  ];
  for (const o of shuffle(orderPool).slice(0, 3)) {
    qs.push({
      kind: "order", id: `order-${o.cluster}`, concept: "subscripts",
      cluster: o.cluster, translit: o.translit, steps: o.steps,
    });
  }

  for (const w of shuffle(VOCAB).slice(0, 6)) {
    const wrong = shuffle(VOCAB.filter((x) => x.tib !== w.tib)).slice(0, 3);
    qs.push({
      kind: "mc", id: `vocab-${w.tib}`, concept: "suffixes",
      prompt: <span>Which word means <span className="font-medium">&ldquo;{w.en}&rdquo;</span>?</span>,
      choices: shuffle([w, ...wrong]).map((x) => ({ key: x.tib, label: <span className="font-serif text-2xl" style={TIB}>{x.tib}</span> })), answerKey: w.tib,
    });
  }

  for (const g of shuffle(LISTEN_GROUPS).slice(0, 5)) {
    const target = g.items[Math.floor(Math.random() * g.items.length)];
    qs.push({
      kind: "listen", id: `listen-${target.tib}`, concept: g.concept,
      spoken: target.translit, choices: shuffle(g.items), answerTib: target.tib,
    });
  }

  return shuffle(qs);
}

const STEPS = [
  { id: "overview", eyebrow: "Section 01", title: "What this capstone covers" },
  { id: "assessment", eyebrow: "Section 02", title: "The assessment" },
  { id: "result", eyebrow: "Section 03", title: "Your result" },
];

const CONCEPT_LABEL: Record<Concept, { name: string; to: string }> = {
  consonants: { name: "The 30 Consonants", to: "/dashboard/lessons/1" },
  vowels: { name: "The Four Vowels", to: "/dashboard/lessons/2" },
  superscripts: { name: "Superscripts", to: "/dashboard/lessons/3" },
  subscripts: { name: "Subscripts", to: "/dashboard/lessons/4" },
  prefixes: { name: "The Five Prefixes", to: "/dashboard/lessons/5" },
  suffixes: { name: "Suffixes & Post-suffixes", to: "/dashboard/lessons/6" }, 
};

/* -------------------------------------------------------------------- */
/* Main Page Component                                                 */
/* -------------------------------------------------------------------- */

export default function FinalAssessmentLesson() {
  const { getToken } = useAuth();
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  
  // Progression Lock State
  const [unlockedStep, setUnlockedStep] = useState<number>(DEV_BYPASS_LOCKS ? 3 : 0);
  const [expandedStep, setExpandedStep] = useState<number>(0);

  // Quiz State
  const [attempt, setAttempt] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [lastResult, setLastResult] = useState<{ score: number; wrongByConcept: Record<Concept, number> } | null>(null);
  
  // Simulated DB record for this standalone page
  const [record, setRecord] = useState({ passed: false, bestScore: 0, attempts: 0 });

  const questions = useMemo(() => buildBank(), [attempt]);
  const total = questions.length;

  const startTest = () => {
    setInProgress(true);
    setLastResult(null);
    setAttempt((a) => a + 1);
    setExpandedStep(1);
    if (unlockedStep < 1) setUnlockedStep(1);
  };

  const submitResult = (score: number) => {
    setRecord(prev => ({
      passed: prev.passed || score >= PASS_THRESHOLD,
      bestScore: Math.max(prev.bestScore, score),
      attempts: prev.attempts + 1
    }));
  };

  const handleToggleStep = (index: number) => {
    if (index <= unlockedStep) {
      setExpandedStep(expandedStep === index ? -1 : index);
    }
  };

  const markComplete = (index: number) => {
    const next = index + 1;
    if (next > unlockedStep) setUnlockedStep(next);
    setExpandedStep(next);
  };

  // Audio API
  const playAudio = async (text: string) => {
    if (playingItem) return;
    setPlayingItem(text);
    try {
      const cleanText = text.replace(/'/g, "");
      const token = await getToken();
      const formData = new FormData();
      formData.append("text", cleanText);
      formData.append("language", "en"); 
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tts`, { 
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` }, 
        body: formData 
      });
      const data = await res.json();
      if (data.audio_sequence && data.audio_sequence.length > 0) {
        const part = data.audio_sequence[0];
        if (part.audio_base64) {
          const audio = new Audio(`data:audio/wav;base64,${part.audio_base64}`);
          audio.onended = () => setPlayingItem(null);
          audio.play().catch(() => setPlayingItem(null));
          return;
        }
      }
    } catch (e) { console.error("Audio playback failed", e); }
    setPlayingItem(null);
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-stone-900 font-sans pb-40 selection:bg-amber-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500">
          <Link href="/dashboard/lessons" className="hover:text-stone-900 transition-colors">
            My Lessons
          </Link>
          <ChevronRight size={14} />
          <span>Unit 07</span>
          <ChevronRight size={14} />
          <span className="text-stone-900">Capstone</span>
        </div>

        {/* Hero */}
        <div className="mb-12 grid gap-6 md:grid-cols-[1.4fr,1fr] md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700">
              <Award className="size-3.5" /> Beginner 1 · Capstone
            </div>
            <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl text-stone-900">
              Show what you&rsquo;ve learned.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-stone-600">
              A short mixed assessment drawing on every step so far — recognition,
              root-finding, tone, ordered spelling, and vocabulary. Score{" "}
              <span className="font-bold text-stone-900">
                {Math.round(PASS_THRESHOLD * 100)}%
              </span>{" "}
              or higher to unlock your Certificate of Completion.
            </p>
            {record.attempts > 0 && (
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                Best score:{" "}
                <span className="text-stone-900">
                  {Math.round(record.bestScore * 100)}%
                </span>{" "}
                · {record.attempts} attempt{record.attempts === 1 ? "" : "s"}
                {record.passed && " · Passed"}
              </p>
            )}
          </div>

          <div className="w-full md:w-72 justify-self-end">
            <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <span>Section progress</span>
              <span className="text-amber-500">{Math.min(unlockedStep, STEPS.length)} of {STEPS.length} sections</span>
            </div>
            <div className="h-1.5 w-full bg-stone-200 overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-500 ease-out" 
                style={{ width: `${(Math.min(unlockedStep, STEPS.length) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Step 01: Overview */}
          <StepContainer 
            index={0} step={STEPS[0]} 
            isUnlocked={unlockedStep >= 0} isExpanded={expandedStep === 0}
            onToggle={() => handleToggleStep(0)} onContinue={() => markComplete(0)}
          >
            <div className="mb-6 flex flex-col border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900 mb-1">What this capstone covers</h2>
              <p className="text-sm text-stone-500">Everything from Steps 1–6, mixed together.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-serif text-xl mb-4">What&rsquo;s in the mix</h3>
                <ul className="space-y-3 text-sm text-stone-600">
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    Recognising consonants and vowel diacritics
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    Finding the <span className="font-bold text-stone-900">root letter</span> in simple horizontal words
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    Deciding tone from a prefix + root combination
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    Ordering the spelling steps that build a syllable
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    Matching Tibetan words to their meaning
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span>
                      <span className="font-bold text-stone-900">Listening</span> — hearing a word and picking its written form from similar-sounding options
                    </span>
                  </li>
                </ul>
              </div>
              <div className="border border-black/10 bg-stone-50 p-6 md:p-8 flex flex-col justify-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Format
                </div>
                <div className="font-serif text-2xl text-stone-900 mb-4">{total} questions · ~20 min</div>
                <p className="text-[15px] leading-relaxed text-stone-600">
                  Auto-advancing after each question. Immediate feedback. Unlimited retakes — your best score is kept, and passing at any point unlocks the certificate for good.
                </p>
              </div>
            </div>
          </StepContainer>

          {/* Step 02: The Assessment */}
          <StepContainer 
            index={1} step={STEPS[1]} 
            isUnlocked={unlockedStep >= 1} isExpanded={expandedStep === 1}
            onToggle={() => handleToggleStep(1)} onContinue={() => markComplete(1)}
          >
            <div className="mb-6 flex flex-col border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900 mb-1">The assessment</h2>
              <p className="text-sm text-stone-500">About {total} questions across six question types (~20 min).</p>
            </div>
            
            {!inProgress && !lastResult && (
              <div className="border border-amber-200 bg-amber-50/50 p-6 md:p-10 text-center flex flex-col items-center">
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-amber-100 text-amber-600 mb-4 shadow-sm border border-amber-200">
                  <Trophy className="size-6" />
                </div>
                <h3 className="font-serif text-3xl text-stone-900 mb-3">
                  {record.attempts > 0 ? "Take it again" : "Begin the assessment"}
                </h3>
                <p className="max-w-md text-[15px] text-stone-600 mb-8">
                  Fresh questions are drawn each attempt. Take your time — accuracy matters more than speed.
                </p>
                <button
                  type="button"
                  onClick={startTest}
                  className="inline-flex items-center gap-2 bg-amber-500 px-8 py-3.5 text-sm font-bold text-stone-900 hover:bg-amber-400 shadow-sm transition-colors"
                >
                  {record.attempts > 0 ? "Retake assessment" : "Start assessment"} <ChevronRight className="size-5" />
                </button>
              </div>
            )}

            {inProgress && (
              <Quiz
                key={attempt}
                questions={questions}
                playAudio={playAudio}
                playingItem={playingItem}
                onFinish={(r) => {
                  submitResult(r.score);
                  setLastResult(r);
                  setInProgress(false);
                  markComplete(1);
                }}
              />
            )}

            {!inProgress && lastResult && (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-black/10 bg-white">
                <CheckCircle2 className="size-16 text-emerald-500 mb-4" />
                <h3 className="font-serif text-3xl mb-2">Assessment Complete</h3>
                <p className="text-stone-600">See your full results in Section 03 below.</p>
              </div>
            )}
          </StepContainer>

          {/* Step 03: Result */}
          <StepContainer 
            index={2} step={STEPS[2]} 
            isUnlocked={unlockedStep >= 2} isExpanded={expandedStep === 2}
            onToggle={() => handleToggleStep(2)} onContinue={() => {}} isLast={true}
          >
            <div className="mb-6 flex flex-col border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900 mb-1">Your result</h2>
              <p className="text-sm text-stone-500">Pass {Math.round(PASS_THRESHOLD * 100)}% to unlock your certificate.</p>
            </div>
            
            <ResultPanel
              result={lastResult}
              record={record}
              onRetake={startTest}
            />
          </StepContainer>

        </div>
        
        {/* Footer Navigation */}
        <nav className="mt-16 flex flex-col justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row">
          <Link href="/dashboard/lessons/6" className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 border border-transparent hover:border-black/10 bg-white hover:bg-stone-50">
            <ChevronLeft size={16} /> Previous · Suffixes & Post-suffixes
          </Link>
          <Link href="/dashboard/lessons" className="inline-flex items-center justify-center sm:justify-end gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 border border-transparent hover:border-black/10 bg-white hover:bg-stone-50">
            Back to syllabus <BookOpen size={16} />
          </Link>
        </nav>

      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Layout Components                                                    */
/* -------------------------------------------------------------------- */

function StepContainer({ index, step, isUnlocked, isExpanded, onToggle, children, onContinue, isLast }: any) {
  return (
    <div className={`border border-black/10 bg-white transition-all duration-300 ${!isUnlocked ? 'opacity-60 grayscale bg-stone-50' : 'shadow-sm'}`}>
      <button 
        onClick={onToggle} 
        disabled={!isUnlocked} 
        className="w-full flex items-center p-4 md:p-6 text-left hover:bg-stone-50 transition-colors"
      >
        <div className={`w-12 h-12 flex items-center justify-center border font-serif text-xl mr-5 ${isUnlocked ? (isExpanded ? 'bg-amber-500 border-amber-600 text-stone-900' : 'bg-stone-100 border-black/10 text-stone-600') : 'bg-transparent border-black/10 text-stone-400'}`}>
          {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">{step.eyebrow}</span>
            {isUnlocked && (
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${isExpanded ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-600'}`}>
                {isExpanded ? 'In Progress' : (isLast ? 'Ready' : 'Completed')}
              </span>
            )}
          </div>
          <div className={`text-xl font-serif ${isUnlocked ? 'text-stone-900' : 'text-stone-500'}`}>{step.title}</div>
        </div>
        <ChevronRight className={`text-stone-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-4 md:p-8 border-t border-black/10 bg-white animate-in slide-in-from-top-2 fade-in duration-200">
          {children}

          {!isLast && (
            <div className="mt-10 flex justify-end border-t border-black/5 pt-6">
              <button 
                onClick={onContinue} 
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3 text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                Mark complete & continue <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Quiz Runner & Views                                                  */
/* -------------------------------------------------------------------- */

interface Result {
  score: number;
  wrongByConcept: Record<Concept, number>;
}

function Quiz({ questions, playAudio, playingItem, onFinish }: { questions: Question[]; playAudio: any; playingItem: any; onFinish: (r: Result) => void }) {
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<string[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [wrong, setWrong] = useState<Record<Concept, number>>({
    consonants: 0, vowels: 0, superscripts: 0, subscripts: 0, prefixes: 0, suffixes: 0,
  });

  const total = questions.length;
  const q = questions[step];

  const initOrder = () => {
    if (q.kind === "order" && orderState.length === 0) setOrderState(shuffle(q.steps));
  };
  if (q.kind === "order" && orderState.length === 0) initOrder();

  const advance = (isCorrect: boolean) => {
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextWrong = { ...wrong };
    if (!isCorrect) nextWrong[q.concept] += 1;
    setCorrectCount(nextCorrect);
    setWrong(nextWrong);
    window.setTimeout(() => {
      if (step + 1 >= total) {
        onFinish({ score: nextCorrect / total, wrongByConcept: nextWrong });
      } else {
        setStep(step + 1);
        setPicked(null);
        setOrderState([]);
        setOrderSubmitted(false);
      }
    }, 1200);
  };

  const handlePick = (key: string) => {
    if (picked) return;
    setPicked(key);
    const answerKey = q.kind === "mc" ? q.answerKey : q.kind === "root" ? q.answer : q.kind === "listen" ? q.answerTib : "";
    advance(key === answerKey);
  };

  const handleOrderSubmit = () => {
    if (q.kind !== "order" || orderSubmitted) return;
    setOrderSubmitted(true);
    const isCorrect = orderState.join("|") === q.steps.join("|");
    advance(isCorrect);
  };

  const progress = Math.round((step / total) * 100);
  const pickedIsCorrect = picked != null && ((q.kind === "mc" && picked === q.answerKey) || (q.kind === "root" && picked === q.answer) || (q.kind === "listen" && picked === q.answerTib));

  return (
    <div className="border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
        <span>Question {step + 1} of {total}</span>
        <span className="text-amber-600">Score {correctCount}</span>
      </div>
      
      <div className="h-1.5 w-full bg-stone-100 overflow-hidden mb-8">
        <div className="h-full bg-amber-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6">
        {q.kind === "mc" && <MCView q={q} picked={picked} onPick={handlePick} />}
        {q.kind === "root" && <RootPickView q={q} picked={picked} onPick={handlePick} />}
        {q.kind === "listen" && <ListenView q={q} picked={picked} onPick={handlePick} playAudio={playAudio} playingItem={playingItem} />}
        {q.kind === "order" && <OrderView q={q} submitted={orderSubmitted} order={orderState} setOrder={setOrderState} onSubmit={handleOrderSubmit} />}
      </div>

      {q.kind !== "order" && picked && (
        <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-4">
          <div className="flex items-center gap-2">
            {pickedIsCorrect ? (
              <>
                <CheckCircle2 className="size-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="size-5 text-rose-500" />
                <span className="text-sm font-bold text-rose-700">Not quite — moving on.</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MCView({ q, picked, onPick }: any) {
  return (
    <>
      <div className="text-xl text-stone-900 mb-8">{q.prompt}</div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.choices.map((c: any) => {
          const isCorrect = picked && c.key === q.answerKey;
          const isWrong = picked === c.key && c.key !== q.answerKey;
          return (
            <button
              key={c.key} type="button" disabled={!!picked} onClick={() => onPick(c.key)}
              className={`flex min-h-[5rem] items-center justify-center border-2 p-3 text-center text-lg font-bold transition-all ${
                isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : isWrong ? "border-rose-400 bg-rose-50 text-rose-700" : "border-black/10 bg-white text-stone-800 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function RootPickView({ q, picked, onPick }: any) {
  return (
    <>
      <div className="text-xl text-stone-900 mb-2">
        Tap the <span className="font-bold">root letter</span> of{" "}
        <span className="font-serif text-4xl mx-2" style={TIB}>{q.cluster}</span>{" "}
        <span className="text-stone-400 text-lg font-mono">[{q.translit}]</span>
      </div>
      <p className="mb-8 text-sm text-stone-500">The root letter carries the syllable&rsquo;s core sound and tone.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.tiles.map((tile: string) => {
          const isCorrect = picked && tile === q.answer;
          const isWrong = picked === tile && tile !== q.answer;
          return (
            <button
              key={tile} type="button" disabled={!!picked} onClick={() => onPick(tile)}
              className={`flex aspect-square items-center justify-center border-2 p-3 font-serif text-[3.5rem] transition-all ${
                isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : isWrong ? "border-rose-400 bg-rose-50 text-rose-700" : "border-black/10 bg-white hover:border-amber-400 hover:bg-amber-50 hover:shadow-md"
              }`} style={TIB}
            >
              {tile}
            </button>
          );
        })}
      </div>
    </>
  );
}

function OrderView({ q, submitted, order, setOrder, onSubmit }: any) {
  const correct = submitted && order.join("|") === q.steps.join("|");
  const move = (from: number, to: number) => {
    if (submitted || to < 0 || to >= order.length) return;
    const next = [...order];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setOrder(next);
  };
  return (
    <>
      <div className="text-xl text-stone-900 mb-8">
        Put the spelling steps in order to build{" "}
        <span className="font-serif text-4xl mx-2" style={TIB}>{q.cluster}</span>{" "}
        <span className="text-stone-400 text-lg font-mono">[{q.translit}]</span>
      </div>
      <ol className="space-y-3">
        {order.map((s: string, i: number) => (
          <li key={`${s}-${i}`} className={`flex items-center gap-4 border-2 p-4 transition-colors ${
            submitted ? (s === q.steps[i] ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-rose-400 bg-rose-50 text-rose-900") : "border-black/10 bg-white"
          }`}>
            <span className="grid size-8 shrink-0 place-items-center bg-stone-100 text-xs font-bold text-stone-400 rounded-full">{i + 1}</span>
            <span className="flex-1 font-serif text-3xl" style={TIB}>{s}</span>
            {!submitted && (
              <div className="flex gap-2">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="border border-black/10 p-2 hover:bg-stone-50 disabled:opacity-30 disabled:hover:bg-transparent"><ArrowUp size={16}/></button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === order.length - 1} className="border border-black/10 p-2 hover:bg-stone-50 disabled:opacity-30 disabled:hover:bg-transparent"><ArrowDown size={16}/></button>
              </div>
            )}
          </li>
        ))}
      </ol>
      {!submitted && (
        <button type="button" onClick={onSubmit} className="mt-8 inline-flex items-center gap-2 bg-amber-500 px-8 py-3.5 text-sm font-bold text-stone-900 hover:bg-amber-400 shadow-sm w-full sm:w-auto justify-center transition-colors">
          Check order <ChevronRight className="size-5" />
        </button>
      )}
      {submitted && !correct && (
        <div className="mt-6 border border-black/10 bg-stone-50 p-6 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Correct order</div>
          <div className="flex flex-wrap items-center gap-3 font-serif text-3xl text-stone-800" style={TIB}>
            {q.steps.map((s: string, i: number) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-stone-300">+</span>}
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {submitted && correct && (
        <div className="mt-6 text-emerald-600 font-bold flex items-center gap-2">
          <CheckCircle2 size={20} /> Perfect arrangement!
        </div>
      )}
    </>
  );
}

function ListenView({ q, picked, onPick, playAudio, playingItem }: any) {
  return (
    <>
      <div className="text-xl text-stone-900 mb-2">Listen and pick the matching Tibetan word.</div>
      <p className="text-sm text-stone-500 mb-8">Tap the speaker to replay the sound.</p>
      
      <div className="mb-8 flex justify-center bg-stone-50 border border-black/5 p-8">
        <button
          type="button"
          onClick={() => playAudio(q.answerTib)}
          className="inline-flex items-center justify-center gap-3 border border-amber-200 bg-amber-50 px-8 py-4 text-lg font-bold text-amber-700 transition hover:bg-amber-100 hover:border-amber-300 shadow-sm"
        >
          {playingItem === q.answerTib ? <Loader2 className="size-6 animate-spin" /> : <Volume2 className="size-6" />} Play sound
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.choices.map((c: any) => {
          const isCorrect = picked && c.tib === q.answerTib;
          const isWrong = picked === c.tib && c.tib !== q.answerTib;
          return (
            <button
              key={c.tib} type="button" disabled={!!picked} onClick={() => onPick(c.tib)}
              className={`flex min-h-[6rem] flex-col items-center justify-center gap-2 border-2 p-3 transition-all ${
                isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : isWrong ? "border-rose-400 bg-rose-50 text-rose-700" : "border-black/10 bg-white hover:border-amber-400 hover:bg-amber-50 hover:shadow-md"
              }`}
            >
              <span className="font-serif text-[2.5rem] leading-none" style={TIB}>{c.tib}</span>
              {picked && <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">[{c.translit}]</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------- */
/* Results Panel Component                                              */
/* -------------------------------------------------------------------- */

function ResultPanel({ result, record, onRetake }: any) {
  if (!result && !record.passed) {
    return (
      <div className="py-8 text-center text-stone-500 italic">
        Complete the assessment in Section 02 and your result will appear here.
      </div>
    );
  }

  const scorePct = Math.round(((result?.score ?? record.bestScore)) * 100);
  const passed = result ? result.score >= PASS_THRESHOLD : record.passed;

  const weakest = result
    ? (Object.entries(result.wrongByConcept) as [Concept, number][])
        .filter(([, n]) => n > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
    : [];

  return (
    <div className="grid gap-8 md:grid-cols-[1.5fr,1fr] items-start">
      <div className="p-8 border border-black/10 bg-white shadow-sm">
        <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 ${passed ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-rose-50 border border-rose-200 text-rose-700"}`}>
          {passed ? <Trophy className="size-3.5" /> : <Target className="size-3.5" />}
          {passed ? "Passed" : "Not quite there"}
        </div>
        
        <h3 className="font-serif text-5xl text-stone-900 mb-4">
          {scorePct}% <span className="text-2xl text-stone-300">/ 100%</span>
        </h3>
        
        <p className="text-[15px] leading-relaxed text-stone-600 mb-8">
          {passed
            ? "You've demonstrated a solid grasp of the Tibetan reading system. You have officially completed the Foundations unit!"
            : `You need ${Math.round(PASS_THRESHOLD * 100)}% to unlock the final lesson. Review the sections below and try again — your best score is kept.`}
        </p>

        {!passed && weakest.length > 0 && (
          <div className="border border-black/10 bg-stone-50 p-6 mb-8">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Suggested review</div>
            <ul className="space-y-3 text-sm">
              {weakest.map(([c, n]) => (
                <li key={c} className="flex items-center justify-between gap-3">
                  <span className="font-bold text-stone-700">{CONCEPT_LABEL[c].name} <span className="font-normal text-stone-400 ml-2">({n} missed)</span></span>
                  <Link href={CONCEPT_LABEL[c].to} className="inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors">
                    <BookOpen className="size-3.5" /> Review
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-6 border-t border-black/5">
          <button type="button" onClick={onRetake} className="inline-flex items-center gap-2 border border-black/10 bg-stone-50 px-6 py-3 text-sm font-bold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors">
            <RotateCcw className="size-4" /> {passed ? "Retake for a better score" : "Try again"}
          </button>
        </div>
      </div>

      <div className="border border-black/10 bg-stone-50 p-8">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">
          <Trophy className="size-3.5" /> Progress kept
        </div>
        <ul className="space-y-4 text-[15px] text-stone-500">
          <li className="flex justify-between border-b border-black/5 pb-4">
            <span>Best score:</span>
            <span className="font-bold text-stone-900">{Math.round(record.bestScore * 100)}%</span>
          </li>
          <li className="flex justify-between border-b border-black/5 pb-4">
            <span>Attempts:</span>
            <span className="font-bold text-stone-900">{record.attempts}</span>
          </li>
          <li className="flex justify-between">
            <span>Status:</span>
            <span className={`font-bold ${passed ? "text-emerald-600" : "text-stone-900"}`}>{passed ? "Passed" : "In progress"}</span>
          </li>
        </ul>
        {passed && (
          <p className="mt-8 text-xs text-stone-400 font-bold leading-relaxed">
            Retakes don&rsquo;t invalidate your previous passing score — only your best score is recorded.
          </p>
        )}
      </div>
    </div>
  );
}