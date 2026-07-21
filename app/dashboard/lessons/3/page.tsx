"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import {
  Volume2, X, ChevronRight, ChevronLeft, Check, Sparkles, Repeat, Shuffle, Layers,
  CheckCircle2, BookOpen, Info, ArrowUp, ArrowDown, Loader2, ArrowLeft, ArrowRight, XCircle, Play, Trophy, Lock, Moon, Sun
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data Types & Constants                                              */
/* ------------------------------------------------------------------ */

type Tone = "same" | "up" | "down";
type SuperKey = "ra" | "la" | "sa";

interface Combo {
  stack: string;      
  read: string;       
  tone: Tone;
}

interface Super {
  key: SuperKey;
  head: string;              
  headLabel: string;
  name: string;              
  nameTib: string;
  title: string;             
  count: number;
  intro: string;             
  rootLetters: string;       
  combos: Combo[];
  accent: { hex: string; ring: string; swatch: string; text: string; band: string };
}

const TONE_META: Record<Tone, { label: string; hex: string; Icon: typeof ArrowRight; text: string; bg: string; border: string }> = {
  same: { label: "Same tone as root", hex: "#10b981", Icon: ArrowRight, text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  up:   { label: "Higher tone",       hex: "#f43f5e", Icon: ArrowUp,    text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  down: { label: "Lower tone",        hex: "#0ea5e9", Icon: ArrowDown,  text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
};

const SUPERS: Super[] = [
  {
    key: "ra",
    head: "ར",
    headLabel: "ར་མགོ",
    name: "Ra-go",
    nameTib: "ར་མགོ་བཅུ་གཉིས།",
    title: 'The Twelve Superscripts "Ra"',
    count: 12,
    intro: "The consonant ར (ra) sits above twelve root letters. When it does, it is no longer pronounced on its own — instead it re-tunes the tone of the letter beneath.",
    rootLetters: "ཀ ག ང ཇ ཉ ཏ ད ན བ མ ཙ ཛ",
    accent: { hex: "#f43f5e", ring: "ring-rose-300", swatch: "bg-rose-100", text: "text-rose-800", band: "bg-rose-500" },
    combos: [
      { stack: "རྐ", read: "ka",  tone: "same" }, { stack: "རྒ", read: "ga",  tone: "down" },
      { stack: "རྔ", read: "nga", tone: "up"   }, { stack: "རྗ", read: "ja",  tone: "down" },
      { stack: "རྙ", read: "nya", tone: "up"   }, { stack: "རྟ", read: "ta",  tone: "same" },
      { stack: "རྡ", read: "da",  tone: "down" }, { stack: "རྣ", read: "na",  tone: "up"   },
      { stack: "རྦ", read: "ba",  tone: "down" }, { stack: "རྨ", read: "ma",  tone: "up"   },
      { stack: "རྩ", read: "tsa", tone: "same" }, { stack: "རྫ", read: "dza", tone: "down" },
    ],
  },
  {
    key: "la",
    head: "ལ",
    headLabel: "ལ་མགོ",
    name: "La-go",
    nameTib: "ལ་མགོ་བཅུ།",
    title: 'The Ten Superscripts "La"',
    count: 10,
    intro: "The consonant ལ (la) serves as a superscript for ten root letters. As with Ra-go, its role is silent — it shifts the tone of the letter it caps.",
    rootLetters: "ཀ ག ང ཅ ཇ ཏ ད པ བ ཧ",
    accent: { hex: "#f59e0b", ring: "ring-amber-300", swatch: "bg-amber-100", text: "text-amber-800", band: "bg-amber-500" },
    combos: [
      { stack: "ལྐ", read: "ka",  tone: "same" }, { stack: "ལྒ", read: "ga",  tone: "down" },
      { stack: "ལྔ", read: "nga", tone: "up"   }, { stack: "ལྕ", read: "ca",  tone: "same" },
      { stack: "ལྗ", read: "ja",  tone: "down" }, { stack: "ལྟ", read: "ta",  tone: "same" },
      { stack: "ལྡ", read: "da",  tone: "down" }, { stack: "ལྤ", read: "pa",  tone: "up"   },
      { stack: "ལྦ", read: "ba",  tone: "down" }, { stack: "ལྷ", read: "lha", tone: "up"   },
    ],
  },
  {
    key: "sa",
    head: "ས",
    headLabel: "ས་མགོ",
    name: "Sa-go",
    nameTib: "ས་མགོ་བཅུ་གཅིག།",
    title: 'The Eleven Superscripts "Sa"',
    count: 11,
    intro: "The consonant ས (sa) sits above eleven root letters. Sa-go stacks are common in everyday vocabulary — nose, saddle, wheat, body — so they reward memorising early.",
    rootLetters: "ཀ ག ང ཉ ཏ ད ན པ བ མ ཙ",
    accent: { hex: "#0ea5e9", ring: "ring-sky-300", swatch: "bg-sky-100", text: "text-sky-800", band: "bg-sky-500" },
    combos: [
      { stack: "སྐ", read: "ka",  tone: "same" }, { stack: "སྒ", read: "ga",  tone: "down" },
      { stack: "སྔ", read: "nga", tone: "up"   }, { stack: "སྙ", read: "nya", tone: "up"   },
      { stack: "སྟ", read: "ta",  tone: "same" }, { stack: "སྡ", read: "da",  tone: "down" },
      { stack: "སྣ", read: "na",  tone: "up"   }, { stack: "སྤ", read: "pa",  tone: "same" },
      { stack: "སྦ", read: "ba",  tone: "down" }, { stack: "སྨ", read: "ma",  tone: "up"   },
      { stack: "སྩ", read: "tsa", tone: "same" },
    ],
  },
];

interface Vocab { tib: string; translit: string; en: string; emoji: string; sup: SuperKey; }

const VOCAB: Vocab[] = [
  // Ra-go
  { tib: "རྟ", translit: "ta", en: "horse", emoji: "🐎", sup: "ra" },
  { tib: "རྔ", translit: "nga", en: "drum", emoji: "🥁", sup: "ra" },
  { tib: "རྗེ་བོ", translit: "je-wo", en: "king", emoji: "🤴", sup: "ra" },
  { tib: "རྡོ", translit: "do", en: "stone", emoji: "🪨", sup: "ra" },
  { tib: "རྡོ་རྗེ", translit: "dor-je", en: "vajra", emoji: "🔱", sup: "ra" },
  { tib: "རྨ", translit: "ma", en: "wound", emoji: "🩹", sup: "ra" },
  { tib: "རྐུ་མ", translit: "ku-ma", en: "thief", emoji: "🦹", sup: "ra" },
  { tib: "རྩ", translit: "tsa", en: "grass", emoji: "🌱", sup: "ra" },
  { tib: "རྣ", translit: "na", en: "ear", emoji: "👂", sup: "ra" },
  { tib: "རྫ་ཆུ", translit: "dza-chu", en: "Mountain river", emoji: "🏞️", sup: "ra" },
  { tib: "རྩ་བ", translit: "tsa-wa", en: "root", emoji: "🌿", sup: "ra" },
  // La-go
  { tib: "ལྔ", translit: "nga", en: "five", emoji: "5️⃣", sup: "la" },
  { tib: "ལྷ", translit: "lha", en: "deity", emoji: "🕉️", sup: "la" },
  { tib: "ལྷ་མོ", translit: "lha-mo", en: "goddess", emoji: "🪷", sup: "la" },
  { tib: "ལྕེ", translit: "ce", en: "tongue", emoji: "👅", sup: "la" },
  { tib: "ལྡི་ལི", translit: "di-li", en: "Delhi", emoji: "🏛️", sup: "la" },
  { tib: "ལྟ", translit: "ta", en: "look", emoji: "🔭", sup: "la" },
  { tib: "ལྗི་བ", translit: "ji-ba", en: "flea", emoji: "🪳", sup: "la" },
  { tib: "ལྕི་བ", translit: "ci-ba", en: "dung", emoji: "💩", sup: "la" },
  // Sa-go
  { tib: "སྒ", translit: "ga", en: "saddle", emoji: "🐴", sup: "sa" },
  { tib: "སྙེ་མ", translit: "nye-ma", en: "Ear of the grain", emoji: "🌾", sup: "sa" },
  { tib: "སྣ", translit: "na", en: "nose", emoji: "👃", sup: "sa" },
  { tib: "སྐྲ", translit: "tra", en: "hair", emoji: "💇", sup: "sa" },
  { tib: "སྟ་རེ", translit: "ta-re", en: "axe", emoji: "🪓", sup: "sa" },
  { tib: "སྐུ", translit: "ku", en: "body", emoji: "🧍", sup: "sa" },
  { tib: "སྤུ", translit: "pu", en: "hair", emoji: "🧑‍🦱", sup: "sa" },
  { tib: "སྔ་མོ", translit: "nga-mo", en: "early", emoji: "🌅", sup: "sa" },
  { tib: "སྐེ", translit: "ke", en: "neck", emoji: "🦒", sup: "sa" },
];

const COMBINED_PRACTICE_ITEMS = [
  ...SUPERS.flatMap(s => s.combos.map(c => ({ id: `combo-${c.stack}`, text: c.stack, wylie: c.read, hint: TONE_META[c.tone].label, emoji: '', type: 'letter' }))),
  ...VOCAB.map(v => ({ id: `vocab-${v.tib}`, text: v.tib, wylie: v.translit, hint: v.en, emoji: v.emoji, type: 'vocab' }))
];

const STEPS = [
  { id: "intro", eyebrow: "Step 01", title: "What is a superscript?", description: "How superscripts stack over a root letter." },
  { id: "family", eyebrow: "Step 02", title: "Meet the three superscripts", description: "Study each superscript with its root combinations." },
  { id: "vocab", eyebrow: "Step 03", title: "Vocabulary built from superscripts", description: "Real words using stacked letters." },
  { id: "practice", eyebrow: "Step 04", title: "Practice & mastery check", description: "Flashcards, quiz, and matching drills." },
  { id: "complete", eyebrow: "Final test", title: "Lesson test — unlock the next lesson", description: "Score 80% or higher to unlock Subscripts." },
];

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function SuperscriptsLesson() {
  const { getToken } = useAuth();
  
  const [activeTab, setActiveTab] = useState<SuperKey>("ra");
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  const [vocabFilter, setVocabFilter] = useState<SuperKey | "all">("all");
  const [activePracticeTab, setActivePracticeTab] = useState("Flashcards");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");

  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [manualExpanded, setManualExpanded] = useState<Set<number>>(new Set());

  const total = STEPS.length;
  const progress = Math.round((completed.size / total) * 100);

  const statusOf = (i: number): "done" | "current" | "upcoming" =>
    completed.has(i) ? "done" : i === currentStep ? "current" : "upcoming";
    
  const isExpanded = (i: number) => manualExpanded.has(i);

  const scrollToStep = (i: number) => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      document.getElementById(`step-${STEPS[i].id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const toggleStep = (i: number) => {
    if (DEV_BYPASS_LOCKS || i <= currentStep || completed.has(i)) {
      setManualExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(i)) next.delete(i); 
        else next.add(i);
        return next;
      });
    }
  };

  const goPrev = (i: number) => {
    const target = Math.max(0, i - 1);
    setCurrentStep(target);
    scrollToStep(target);
  };

  const goContinue = (i: number) => {
    setCompleted((prev) => new Set(prev).add(i));
    const target = Math.min(total - 1, i + 1);
    setCurrentStep(target);
    
    setManualExpanded((prev) => {
      const next = new Set(prev);
      next.delete(i);
      next.add(target);
      return next;
    });
    
    scrollToStep(target);
  };

  const sup = SUPERS.find((s) => s.key === activeTab)!;
  const filteredVocab = vocabFilter === "all" ? VOCAB : VOCAB.filter((v) => v.sup === vocabFilter);

  const playAudio = async (text: string) => {
    if (playingItem) return;
    setPlayingItem(text);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("text", text);
      formData.append("language", "en"); 
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tts`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
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

  const playErrorBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) { console.error("Audio beep failed", e); }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-stone-800 font-sans pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-widest">
          <Link href="/dashboard/lessons" className="hover:text-stone-800 transition-colors">My Lessons</Link>
          <ChevronRight className="size-3" />
          <span>Unit 03</span>
          <ChevronRight className="size-3" />
          <span className="text-stone-800 font-bold">Superscripts</span>
        </div>

        {/* Hero */}
        <section className="mb-8 grid gap-6 border border-[#e8e4d9] bg-white p-6 md:grid-cols-[1fr,auto] md:items-end md:p-10 shadow-sm">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">Lesson 03 · Foundations</div>
            <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl text-stone-900">The Three Superscripts</h1>
            <p className="mt-1 font-serif text-2xl italic text-stone-500">མགོ་ཅན་གསུམ།</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              Only three letters — ར, ལ, ས — may sit above another consonant. When they do, they
              fall silent themselves and quietly reshape the tone of the root letter beneath. Learn
              each superscript in turn: which consonants it stacks with, how the pronunciation
              shifts, and the everyday vocabulary each family unlocks.
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <span>Lesson progress</span>
              <span className="text-amber-500">{completed.size} of {total} sections</span>
            </div>
            <div className="h-1.5 w-full bg-stone-200 overflow-hidden">
              <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {SUPERS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => playAudio(s.nameTib)}
                  className="group flex flex-col items-center gap-1 border border-stone-200 bg-stone-50 p-2 text-center transition hover:bg-white hover:border-amber-300"
                  aria-label={`Play ${s.name}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-serif text-2xl text-stone-800">{s.headLabel}</span>
                    <Volume2 className="size-3 text-amber-500" />
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-stone-500">{s.count} stacks</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {/* Step 0: What is a superscript */}
          <StepCard index={0} total={total} step={STEPS[0]} status={statusOf(0)} isExpanded={isExpanded(0)} onToggle={() => toggleStep(0)} onPrev={() => goPrev(0)} onContinue={() => goContinue(0)} isFirst isLast={false} currentStep={currentStep}>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="bg-white border border-stone-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <Layers size={14} /> Stacking
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  A superscript is a small consonant written <span className="font-bold text-stone-900">on top of</span> a root letter. Only three consonants — <span className="font-serif text-lg">ར ལ ས</span> — are permitted to occupy this position.
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <Volume2 size={14} /> Silence
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  The superscript itself is <span className="font-bold text-stone-900">not pronounced</span>. Only the root letter is spoken — but the presence of the superscript changes <em>how</em> that root is voiced.
                </p>
              </div>
              <div className="bg-white border border-stone-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <ArrowUp size={14} /> Tone shift
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  Depending on the root's gender, the tone becomes <span className="font-bold text-emerald-600">same</span>, <span className="font-bold text-rose-600">higher</span>, or <span className="font-bold text-sky-600">lower</span> than the base letter alone.
                </p>
              </div>
            </div>

            <div className="bg-[#fcfaf5] border border-stone-200 p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                <Info size={16} className="text-amber-500" /> Reading the tone arrows
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(Object.keys(TONE_META) as Tone[]).map((t) => {
                  const M = TONE_META[t];
                  const rule = t === "same" ? "Masculine letters keep the root's tone." : t === "down" ? "Feminine letters acquire a lower tone." : "Very-feminine / neuter letters acquire a higher tone.";
                  return (
                    <div key={t} className="flex items-start gap-4 border border-stone-200 bg-white p-4 shadow-sm">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full text-white mt-1" style={{ backgroundColor: M.hex }}>
                        <M.Icon size={16} strokeWidth={3} />
                      </span>
                      <div>
                        <div className="text-sm font-bold text-stone-800">{M.label}</div>
                        <div className="mt-1 text-xs text-stone-500 leading-relaxed">{rule}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </StepCard>

          {/* Step 1: Meet the superscripts */}
          <StepCard index={1} total={total} step={STEPS[1]} status={statusOf(1)} isExpanded={isExpanded(1)} onToggle={() => toggleStep(1)} onPrev={() => goPrev(1)} onContinue={() => goContinue(1)} isFirst={false} isLast={false} currentStep={currentStep}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {SUPERS.map((s) => {
                  const on = s.key === activeTab;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setActiveTab(s.key)}
                      className={`group flex items-center gap-4 px-5 py-3 text-left transition-all border ${
                        on ? "bg-stone-900 text-white border-stone-900 shadow-md" : "border-[#e8e4d9] bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50 shadow-sm"
                      }`}
                    >
                      <span className="grid size-10 place-items-center font-serif text-2xl" style={{ color: on ? '#fff' : s.accent.hex, backgroundColor: on ? 'rgba(255,255,255,0.15)' : s.accent.swatch }}>
                        {s.headLabel || s.head}
                      </span>
                      <span>
                        <span className="block text-[15px] font-bold">{s.name}</span>
                        <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-stone-400" : "text-stone-400"}`}>
                          {s.count} stacks
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))}
                className="inline-flex items-center gap-2 border border-stone-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 transition hover:bg-stone-50"
              >
                {studyMode === "paper" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </button>
            </div>

            {/* Active Panel */}
            <div className={`border transition-colors duration-500 shadow-sm relative ${studyMode === "night" ? "border-white/5 bg-[#0f0d0a] text-stone-100" : "border-stone-200 bg-white"}`}>
              <div className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: sup.accent.hex }}></div>
              
              {/* Header */}
              <div className={`p-8 md:p-10 grid gap-8 md:grid-cols-[auto,1fr] items-center border-b ${studyMode === "night" ? "border-white/5" : "border-stone-100"}`}>
                <div className="flex items-center gap-6">
                  <div className="grid size-28 place-items-center font-serif text-[4rem]" style={{ backgroundColor: studyMode === "night" ? `${sup.accent.hex}20` : `${sup.accent.hex}12`, color: sup.accent.hex }}>
                    {sup.head}
                  </div>
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 ${studyMode === "night" ? "text-stone-400" : "text-stone-400"}`}>Superscript</div>
                    <div className={`font-serif text-3xl font-bold ${studyMode === "night" ? "text-stone-100" : "text-stone-900"}`}>{sup.title}</div>
                    <div className={`mt-1 font-serif text-xl italic ${studyMode === "night" ? "text-stone-500" : "text-stone-500"}`}>{sup.nameTib}</div>
                  </div>
                </div>
                <p className={`text-[15px] leading-relaxed p-5 border ${studyMode === "night" ? "bg-stone-900/50 border-white/5 text-stone-300" : "bg-stone-50 border-stone-100 text-stone-600"}`}>
                  {sup.intro}<br/><br/>
                  <span className={`font-bold ${studyMode === "night" ? "text-stone-200" : "text-stone-800"}`}><span className="font-serif text-xl">{sup.head}</span> + {sup.rootLetters}</span>
                </p>
              </div>

              {/* Grid */}
              <div className={`grid grid-cols-3 gap-px sm:grid-cols-4 md:grid-cols-6 border-b ${studyMode === "night" ? "bg-white/5 border-white/5" : "bg-stone-100 border-stone-100"}`}>
                {sup.combos.map((c) => {
                  const M = TONE_META[c.tone];
                  return (
                    <button key={c.stack} onClick={() => playAudio(c.read)} disabled={playingItem !== null} className={`group relative flex flex-col items-center justify-center gap-3 p-6 transition-colors ${studyMode === "night" ? "bg-[#0f0d0a] hover:bg-[#1a1712]" : "bg-white hover:bg-stone-50"}`}>
                      <span className={`font-serif text-[3rem] leading-none ${studyMode === "night" ? "text-[#FFB600]" : "text-stone-900"}`}>{c.stack}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${studyMode === "night" ? "text-stone-400" : "text-stone-400"}`}>{c.read}</span>
                      <span className="inline-flex size-5 items-center justify-center rounded-full text-white" style={{ backgroundColor: M.hex }} title={M.label}>
                        <M.Icon size={12} strokeWidth={3} />
                      </span>
                      {playingItem === c.read && <Loader2 size={16} className={`absolute top-3 right-3 animate-spin ${studyMode === "night" ? "text-stone-500" : "text-stone-400"}`} />}
                    </button>
                  )
                })}
              </div>

              {/* Walkthrough */}
              <div className={`p-8 md:p-10 ${studyMode === "night" ? "bg-[#110f0c]" : "bg-[#fdfbf7]"}`}>
                <div className={`mb-6 text-[10px] font-bold uppercase tracking-widest ${studyMode === "night" ? "text-stone-500" : "text-stone-400"}`}>Spelling walkthrough</div>
                <div className="space-y-3">
                  {sup.combos.map((c) => {
                    const M = TONE_META[c.tone];
                    const rootTib = c.stack.charAt(1);
                    return (
                      <div key={c.stack} className={`flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 shadow-sm ${studyMode === "night" ? "bg-white/[0.02] border-white/5" : "bg-white border-stone-200"}`}>
                        <span className={`font-serif text-[2.5rem] leading-none w-12 text-center ${studyMode === "night" ? "text-stone-100" : "text-stone-900"}`}>{c.stack}</span>
                        <span className={`text-xs font-bold ${studyMode === "night" ? "text-stone-400" : "text-stone-400"}`}>
                          <span className={`font-serif text-lg ${studyMode === "night" ? "text-stone-200" : "text-stone-800"}`}>{sup.head}</span> + <span className={`font-serif text-lg ${studyMode === "night" ? "text-stone-200" : "text-stone-800"}`}>{rootTib || "◌"}</span> + བཏགས་
                        </span>
                        <ArrowRight size={16} className={studyMode === "night" ? "text-stone-600" : "text-stone-300"} />
                        <span className={`font-mono text-lg font-bold ${studyMode === "night" ? "text-stone-100" : "text-stone-800"}`}>[{c.read}]</span>
                        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: M.hex }}>
                          <M.Icon size={14} strokeWidth={2.5} /> {M.label}
                        </span>
                        <button onClick={() => playAudio(c.read)} disabled={playingItem !== null} className={`inline-grid size-10 place-items-center transition ${studyMode === "night" ? "bg-amber-900/20 text-amber-500 hover:bg-amber-500 hover:text-stone-900" : "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"}`}>
                          {playingItem === c.read ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mini Mastery Check */}
              <div className={`border-t p-8 md:p-10 ${studyMode === "night" ? "border-white/5 bg-stone-900/30" : "border-stone-200 bg-stone-50"}`}>
                <div className="mb-6 flex items-center gap-2">
                  <CheckCircle2 size={18} style={{ color: sup.accent.hex }} />
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${studyMode === "night" ? "text-stone-200" : "text-stone-800"}`}>Mastery check · {sup.name}</span>
                </div>
                <MiniMastery sup={sup} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} night={studyMode === "night"} />
              </div>
            </div>
          </StepCard>

          {/* Step 2: Vocabulary */}
          <StepCard index={2} total={total} step={STEPS[2]} status={statusOf(2)} isExpanded={isExpanded(2)} onToggle={() => toggleStep(2)} onPrev={() => goPrev(2)} onContinue={() => goContinue(2)} isFirst={false} isLast={false} currentStep={currentStep}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <p className="text-[15px] text-stone-600">Real words using stacked letters.</p>
              <div className="px-3 py-1.5 bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-bold uppercase tracking-widest shrink-0">
                {VOCAB.length} words
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {[
                { key: "all", label: "All", count: VOCAB.length, hex: undefined },
                ...SUPERS.map(s => ({ key: s.key, label: s.name, count: VOCAB.filter(v => v.sup === s.key).length, hex: s.accent.hex }))
              ].map(c => {
                const active = vocabFilter === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setVocabFilter(c.key as any)}
                    className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                      active ? "border-stone-900 bg-stone-900 text-white shadow-sm" : "border-stone-200 bg-white text-stone-500 hover:border-stone-400 hover:text-stone-800"
                    }`}
                  >
                    {c.hex && <span className="size-2.5" style={{ backgroundColor: c.hex }} />}
                    {c.label} · {c.count}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredVocab.map((v) => {
                const s = SUPERS.find((x) => x.key === v.sup)!;
                return (
                  <button key={v.tib + v.translit} onClick={() => playAudio(v.translit)} disabled={playingItem !== null} className="group relative flex flex-col items-start gap-4 border border-stone-200 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: s.accent.hex }} />
                    <div className="flex w-full items-start justify-between">
                      <span className="text-3xl">{v.emoji}</span>
                      <span className="inline-grid size-8 place-items-center bg-amber-50 text-amber-600 transition group-hover:bg-amber-100 group-hover:text-amber-700 border border-amber-200">
                        {playingItem === v.translit ? <Loader2 size={14} className="animate-spin text-amber-500" /> : <Volume2 size={14} />}
                      </span>
                    </div>
                    <div>
                      <div className="font-serif text-[28px] font-bold leading-tight text-stone-900 mb-1">{v.tib}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{v.translit}</div>
                    </div>
                    <div className="text-sm font-medium text-stone-700 border-t border-stone-100 pt-3 w-full">{v.en}</div>
                  </button>
                );
              })}
            </div>
          </StepCard>

          {/* Step 3: Practice */}
          <StepCard index={3} total={total} step={STEPS[3]} status={statusOf(3)} isExpanded={isExpanded(3)} onToggle={() => toggleStep(3)} onPrev={() => goPrev(3)} onContinue={() => goContinue(3)} isFirst={false} isLast={false} currentStep={currentStep}>
            <p className="mb-6 max-w-3xl text-sm text-stone-600">
              Each superscript has its own <span className="font-bold text-stone-900">mastery check</span> — a short focused quiz on just those stacks — followed by a <span className="font-bold text-stone-900">cumulative review</span> that mixes all three families together. This layered approach prevents cognitive overload and reinforces the differences between Ra-go, La-go, and Sa-go.
            </p>
            <PracticeSuite speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepCard>

          {/* Step 4: Complete (Final Test) */}
          <StepCard index={4} total={total} step={STEPS[4]} status={statusOf(4)} isExpanded={isExpanded(4)} onToggle={() => toggleStep(4)} onPrev={() => goPrev(4)} onContinue={() => goContinue(4)} isFirst={false} isLast currentStep={currentStep}>
            <QuizModule title="Final Lesson Test" intro="Score 80% or higher to unlock the next lesson: The Four Subscripts." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={10} isUnlockTest={true} isVocabMatch={true} />
          </StepCard>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-[#fdfbf7] border-t border-stone-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/2" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} /> Previous: The Four Vowels
          </Link>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold shadow-sm transition-colors border border-amber-600">
            <CheckCircle2 size={18} /> Mark lesson complete
          </button>
          <Link href="/dashboard/lessons/4" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-800 hover:text-amber-600 transition-colors">
            Next: The Four Subscripts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function StepCard({ index, total, step, status, isExpanded, onToggle, onPrev, onContinue, isFirst, isLast, currentStep, children }: any) {
  const badge = status === "done" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : status === "current" ? "bg-[#fffdf5] text-amber-700 border-amber-300" : "bg-stone-50 text-stone-400 border-stone-200";
  
  const isDisabled = !DEV_BYPASS_LOCKS && index > currentStep && status !== "done";

  return (
    <section id={`step-${step.id}`} className={`scroll-mt-24 border bg-white transition-all duration-300 ${status === "current" ? "border-amber-400 shadow-sm" : "border-[#e8e4d9] hover:border-stone-300"}`}>
      <button type="button" onClick={onToggle} disabled={isDisabled} className={`flex w-full items-center gap-4 p-5 text-left transition md:p-6 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-stone-50/60'}`}>
        <div className={`grid size-11 shrink-0 place-items-center font-serif text-lg border ${badge}`}>
          {status === "done" ? <Check className="size-5" /> : String(index + 1).padStart(2, "0")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600">{step.eyebrow}</span>
            {status === "done" && <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 border border-emerald-200">Completed</span>}
            {status === "current" && <span className="text-[9px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 px-2 py-0.5 border border-amber-200">In progress</span>}
            {status === "upcoming" && <span className="text-[9px] font-bold uppercase tracking-widest bg-stone-100 text-stone-500 px-2 py-0.5 border border-stone-200">Up next</span>}
          </div>
          <h2 className="truncate font-serif font-bold text-2xl text-stone-900">{step.title}</h2>
          <p className="mt-1 truncate text-sm text-stone-500">{step.description}</p>
        </div>
        <ChevronRight className={`size-6 shrink-0 text-stone-400 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
      </button>

      {isExpanded && (
        <div className="border-t border-[#e8e4d9] p-5 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          {children}

          <div className="mt-10 flex flex-col-reverse gap-4 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={onPrev} disabled={isFirst} className="inline-flex items-center justify-center gap-2 border border-stone-200 px-6 py-3 text-sm font-bold text-stone-600 transition hover:bg-stone-50 disabled:opacity-40">
              <ChevronLeft className="size-4" /> Previous
            </button>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Step {index + 1} of {total}
            </div>
            <button type="button" onClick={onContinue} className="inline-flex items-center justify-center gap-2 bg-amber-500 px-8 py-3 text-sm font-bold text-stone-900 transition hover:bg-amber-400 border border-amber-600 shadow-sm">
              {status === "done" ? isLast ? "Finish" : "Next section" : isLast ? "Complete lesson" : "Mark complete & continue"}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function MiniMastery({ sup, playAudio, playingItem, playErrorBeep, night }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = useMemo(() => {
    const answer = sup.combos[step % sup.combos.length];
    const wrongs = sup.combos.filter((c: any) => c.read !== answer.read).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...wrongs, answer].sort(() => 0.5 - Math.random());
    return { answer, choices };
  }, [sup, step]);

  const pick = (read: string) => {
    if (picked) return;
    setPicked(read);
    if (read === question.answer.read) { setScore(s => s + 1); playAudio(read); } else { playErrorBeep(); }
  };
  
  const total = Math.min(5, sup.combos.length);
  if (step >= total) {
    return (
      <div className={`flex flex-wrap items-center justify-between gap-4 p-6 border ${night ? "bg-stone-900/50 border-white/10" : "bg-white border-stone-200 shadow-sm"}`}>
        <div className={`text-sm font-bold ${night ? "text-stone-200" : "text-stone-800"}`}>
          Nicely done. You scored <span className="font-serif text-2xl ml-1" style={{ color: sup.accent.hex }}>{score}</span> / {total} on {sup.name}.
        </div>
        <button onClick={() => { setStep(0); setScore(0); setPicked(null); }} className={`inline-flex items-center gap-2 border px-4 py-2 text-sm font-bold transition-colors ${night ? "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10" : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"}`}>
          <Shuffle size={14} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={`mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-400" : "text-stone-500"}`}>
        <span>Question {step + 1} of {total}</span>
        <span style={{ color: sup.accent.hex }}>Score {score}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className={`text-[15px] font-bold ${night ? "text-stone-300" : "text-stone-600"}`}>Which stack reads</span>
        <span className={`font-mono text-2xl font-bold border px-3 py-1 ${night ? "bg-stone-900/50 border-white/10 text-stone-100" : "bg-stone-100 border-stone-200 text-stone-900"}`}>[{question.answer.read}]</span>
        <button onClick={() => playAudio(question.answer.read)} disabled={playingItem !== null} className={`inline-grid size-10 place-items-center transition ${night ? "bg-amber-900/20 text-amber-500 hover:bg-amber-500 hover:text-stone-900" : "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"}`}>
          {playingItem === question.answer.read ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {question.choices.map((c: any) => {
          const right = picked && c.read === question.answer.read;
          const wrong = picked === c.read && c.read !== question.answer.read;
          let stateClass = night ? "border-white/10 bg-white/5 text-[#FFB600] hover:bg-white/10" : "border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50 text-stone-900 hover:shadow-md";
          if (right) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-700";
          if (wrong) stateClass = "border-rose-400 bg-rose-50 text-rose-700";
          return (
            <button
              key={c.stack} disabled={!!picked} onClick={() => pick(c.read)}
              className={`flex aspect-square items-center justify-center border-2 font-serif text-[3.5rem] transition-all ${stateClass}`}
            >
              {c.stack}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border ${night ? "bg-stone-900/50 border-white/10" : "bg-white shadow-sm border-stone-200"}`}>
          <span className={`text-sm font-bold ${picked === question.answer.read ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === question.answer.read ? `Correct — ${question.answer.stack} reads [${question.answer.read}].` : `Answer: ${question.answer.stack} reads [${question.answer.read}].`}
          </span>
          <button onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 px-6 py-2.5 text-sm font-bold text-stone-900 hover:bg-amber-400">
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function PracticeSuite({ speak, playingItem, playErrorBeep }: any) {
  const [tab, setTab] = useState<"flash" | "quiz" | "match" | "srs">("flash");
  const tabs = [
    { id: "flash", label: "Flashcards", icon: Layers },
    { id: "quiz", label: "Cumulative quiz", icon: Sparkles },
    { id: "match", label: "Match", icon: Shuffle },
    { id: "srs", label: "Memory Review", icon: BookOpen },
  ];

  return (
    <div className="border border-stone-200 bg-[#fcfaf5] shadow-sm">
      <div className="flex flex-wrap border-b border-stone-200 bg-white">
        <div className="flex overflow-x-auto custom-scrollbar w-full">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`inline-flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? "border-amber-500 bg-stone-50/50 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"}`}>
              <t.icon className="size-4" strokeWidth={2} /> {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 md:p-10 min-h-[400px]">
        {tab === "flash" && <Flashcards speak={speak} playingItem={playingItem} />}
        {tab === "quiz" && <CumulativeQuiz speak={speak} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
        {tab === "match" && <MatchStackToSound speak={speak} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
        {tab === "srs" && <MemoryReview speak={speak} playingItem={playingItem} />}
      </div>
    </div>
  );
}

function Flashcards({ speak, playingItem }: any) {
  const [mode, setMode] = useState<"stacks" | "words">("stacks");
  const deck = useMemo(() => {
    if (mode === "stacks") {
      return SUPERS.flatMap((s) => s.combos.map((c) => ({ tib: c.stack, en: `[${c.read}]  ·  ${TONE_META[c.tone].label}`, sup: s.key, spoken: c.read, emoji: '' })));
    }
    return VOCAB.map((v) => ({ tib: v.tib, en: `${v.en}  ·  ${v.translit}`, sup: v.sup, spoken: v.translit, emoji: v.emoji }));
  }, [mode]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck[idx % deck.length];
  const accent = SUPERS.find((s) => s.key === card.sup)!.accent.hex;

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % deck.length); };
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + deck.length) % deck.length); };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center mb-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest gap-4">
        <div className="flex flex-wrap gap-2">
          {(["stacks", "words"] as const).map((k) => (
            <button key={k} onClick={() => { setMode(k); setIdx(0); setFlipped(false); }} className={`px-4 py-2 transition-all border ${mode === k ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"}`}>
              {k === "stacks" ? `Stacks · ${SUPERS.reduce((a, s) => a + s.count, 0)}` : `Words · ${VOCAB.length}`}
            </button>
          ))}
        </div>
        <span>Card {(idx % deck.length) + 1} of {deck.length}</span>
      </div>

      <div onClick={() => setFlipped(!flipped)} className="w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center relative group overflow-hidden">
        <span className="absolute left-0 top-0 h-1.5 w-full" style={{ backgroundColor: accent }} />
        {!flipped ? (
          <div className="text-6xl md:text-8xl font-serif text-stone-900 group-hover:scale-105 transition-transform">{card.tib}</div>
        ) : (
          <div className="text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 p-6">
            {card.emoji && <div className="text-4xl mb-4">{card.emoji}</div>}
            <div className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 leading-relaxed">{card.en.split('·')[0].trim()}</div>
            <div className="text-sm sm:text-lg text-stone-500 font-bold uppercase tracking-widest">{card.en.split('·')[1]?.trim()}</div>
          </div>
        )}
        <div className="absolute bottom-4 right-6 text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:text-stone-400">Tap card to flip</div>
      </div>

      <div className="w-full max-w-2xl flex items-center justify-between mt-8">
        <button onClick={prev} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800"><ArrowLeft size={16} /> Previous</button>
        <button onClick={() => speak(card.spoken)} disabled={playingItem !== null} className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold shadow-sm border border-amber-600">
          {playingItem === card.spoken ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />} Play sound
        </button>
        <button onClick={next} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800">Next <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function CumulativeQuiz({ speak, playingItem, playErrorBeep }: any) {
  const all = useMemo(() => SUPERS.flatMap((s) => s.combos.map((c) => ({ ...c, sup: s.key, head: s.head }))), []);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const q = useMemo(() => {
    const answer = all[Math.floor(Math.random() * all.length)];
    const others = all.filter((x) => x.stack !== answer.stack);
    const choices = [answer, ...others.sort(() => 0.5 - Math.random()).slice(0, 3)].sort(() => 0.5 - Math.random());
    return { answer, choices };
  }, [step, all]);

  const total = 8;
  if (step >= total) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[300px] animate-in zoom-in-95">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-200"><CheckCircle2 size={40} /></div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Quiz Complete!</h3>
        <p className="text-stone-600 mb-8 font-bold">You scored <span className="text-xl text-emerald-600">{score}</span> out of {total}.</p>
        <button onClick={() => { setStep(0); setScore(0); setPicked(null); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"><Shuffle size={18} /> Reshuffle</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
        <span>Question {step + 1} of {total}</span>
        <span className="text-amber-600">Score {score}</span>
      </div>
      
      <div className="w-full max-w-4xl flex flex-col items-center gap-6 border border-stone-200 bg-white p-10 shadow-sm mb-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">What does this stack read?</span>
        <span className="font-serif leading-none text-stone-900" style={{ fontSize: "7rem" }}>{q.answer.stack}</span>
        <button onClick={() => speak(q.answer.read)} disabled={playingItem !== null} className="inline-flex items-center gap-2 border border-stone-200 bg-stone-50 px-6 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors">
          {playingItem === q.answer.read ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className="text-amber-500" />} Play Hint
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-2 gap-4 md:grid-cols-4">
        {q.choices.map((c) => {
          const right = picked && c.read === q.answer.read;
          const wrong = picked === c.read && c.read !== q.answer.read;
          return (
            <button
              key={c.stack + c.read} disabled={!!picked}
              onClick={() => { setPicked(c.read); if (c.read === q.answer.read) { setScore((s) => s + 1); speak(q.answer.read); } else { playErrorBeep(); } }}
              className={`border-2 p-6 text-center transition-all ${
                right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700" : "border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50 hover:shadow-md"
              }`}
            >
              <div className="font-mono text-xl font-bold mb-2">[{c.read}]</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{TONE_META[c.tone].label}</div>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="w-full max-w-4xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border border-stone-200 bg-white shadow-sm">
          <span className={`text-sm font-bold ${picked === q.answer.read ? "text-emerald-700" : "text-rose-700"}`}>
            {picked === q.answer.read ? `Correct — ${q.answer.stack} reads [${q.answer.read}].` : `The answer was [${q.answer.read}].`}
          </span>
          <button onClick={() => { setPicked(null); setStep((s) => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 px-8 py-3 text-sm font-bold text-white hover:bg-stone-800">
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function MatchStackToSound({ speak, playingItem, playErrorBeep }: any) {
  const [seed, setSeed] = useState(0);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  
  const questions = useMemo(() => {
    const pool = SUPERS.flatMap((s) => s.combos.map((c) => ({ ...c, sup: s.key })));
    const targets = pool.sort(() => 0.5 - Math.random()).slice(0, 6);
    return targets.map(target => {
      const distractors = pool.filter(i => i.read !== target.read).sort(() => 0.5 - Math.random()).slice(0, 2);
      return { target, options: [target, ...distractors].sort(() => 0.5 - Math.random()) };
    });
  }, [seed]);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm font-medium text-stone-500 mb-8 self-start w-full max-w-4xl">Match each stacked consonant with the sound it reads.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {questions.map((q, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-stone-200 shadow-sm gap-4 sm:gap-2">
            <div className="text-4xl font-serif text-stone-900 sm:ml-4 text-center sm:text-left">{q.target.stack}</div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto sm:mr-2">
              {q.options.map(opt => {
                const isSelected = matchAnswers[q.target.stack] === opt.read;
                const isCorrect = q.target.read === opt.read;
                const isAnswered = !!matchAnswers[q.target.stack];
                let btnClass = "border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer font-mono";
                if (isAnswered) {
                  if (isCorrect) { btnClass = isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm font-mono" : "border-emerald-400 border-dashed bg-emerald-50/50 text-emerald-600 font-mono"; } 
                  else { btnClass = isSelected ? "border-rose-500 bg-rose-50 text-rose-700 cursor-default font-mono" : "border-stone-100 bg-stone-50 text-stone-300 opacity-50 cursor-default font-mono"; }
                }
                return (
                  <button key={opt.stack + opt.read} onClick={() => { if(!isAnswered){ setMatchAnswers(p => ({ ...p, [q.target.stack]: opt.read })); if(isCorrect) speak(opt.read); else playErrorBeep(); } else if (isCorrect) { speak(opt.read); } }} disabled={playingItem !== null || (isAnswered && !isCorrect)} className={`relative px-4 py-2 text-[13px] font-bold border transition-all flex items-center justify-center min-w-[5rem] text-center ${btnClass}`}>
                    {playingItem === opt.read && isCorrect ? <Loader2 size={14} className="animate-spin absolute" /> : `[${opt.read}]`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {Object.keys(matchAnswers).length === questions.length && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setMatchAnswers({}); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 shadow-sm transition-colors flex items-center gap-2 border border-amber-600">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MemoryReview({ speak, playingItem }: any) {
  const [deck, setDeck] = useState(() => [...COMBINED_PRACTICE_ITEMS].sort(() => 0.5 - Math.random()));
  const [reviewedCount, setReviewedCount] = useState(0);
  const [rating, setRating] = useState<'Hard' | 'Good' | 'Easy' | null>(null);

  const nextCard = () => {
    if (!rating || deck.length === 0) return;
    const currentCard = deck[0]; let newDeck = deck.slice(1);
    if (rating === 'Hard') { newDeck.splice(Math.min(Math.floor(Math.random() * 3) + 1, newDeck.length), 0, currentCard); } 
    else if (rating === 'Good') { newDeck.push(currentCard); }
    setDeck(newDeck); setReviewedCount(p => p + 1); setRating(null);
  };

  if (deck.length === 0) return (
    <div className="flex flex-col items-center justify-center text-center h-[400px] animate-in zoom-in-95">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-200"><CheckCircle2 size={40} /></div>
      <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Deck Complete!</h3>
      <p className="text-stone-500 font-medium mb-8">You have successfully mastered all {COMBINED_PRACTICE_ITEMS.length} cards.</p>
      <button onClick={() => { setDeck([...COMBINED_PRACTICE_ITEMS].sort(() => 0.5 - Math.random())); setReviewedCount(0); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"><Repeat size={18} /> Review Again</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-stone-200 pb-4">
          <span>Spaced repetition · rate your recall</span><span>{reviewedCount} reviewed</span>
        </div>
        <div className="bg-white border border-stone-200 p-8 sm:p-16 flex flex-col items-center justify-center mb-6 min-h-[300px] shadow-sm relative overflow-hidden">
          {deck[0].emoji && <div className="text-6xl mb-6">{deck[0].emoji}</div>}
          <div className="text-7xl sm:text-8xl md:text-[8rem] font-serif text-stone-900 mb-8 leading-none text-center">{deck[0].text}</div>
          <button onClick={() => speak(deck[0].wylie)} disabled={playingItem !== null} className="flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors text-sm border border-stone-200">
            {playingItem === deck[0].wylie ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} Check Sound
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button onClick={() => setRating('Hard')} className={`py-4 border-2 font-bold text-sm transition-all ${rating === 'Hard' ? 'bg-rose-100 border-rose-400 text-rose-800' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}>Hard</button>
          <button onClick={() => setRating('Good')} className={`py-4 border-2 font-bold text-sm transition-all ${rating === 'Good' ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>Good</button>
          <button onClick={() => setRating('Easy')} className={`py-4 border-2 font-bold text-sm transition-all ${rating === 'Easy' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>Easy</button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14} /> Cards you mark Hard return soon; Easy cards drift further out.</p>
          <button onClick={nextCard} disabled={!rating} className={`flex items-center justify-center gap-2 px-8 py-3.5 font-bold shadow-sm transition-colors w-full sm:w-auto ${rating ? 'bg-amber-500 hover:bg-amber-400 text-stone-900 border border-amber-600' : 'bg-stone-200 text-stone-400 cursor-not-allowed border-transparent'}`}>Next Card <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Universal Quiz Module (Used for Mastery & Final Test)               */
/* ------------------------------------------------------------------ */
function QuizModule({ title, intro, data, playAudio, playingItem, playErrorBeep, questionCount, isUnlockTest, isVocabMatch }: any) {
  const [hasStarted, setHasStarted] = useState(!isUnlockTest);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  
  const question = useMemo(() => {
    const answer = data[Math.floor(Math.random() * data.length)];
    const wrongs = data.filter((x: any) => x.tib !== answer.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [answer, ...wrongs].sort(() => 0.5 - Math.random());
    return { answer, choices };
  }, [step, data]);

  if (!hasStarted) {
    return (
      <div className="border border-stone-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Trophy className="size-3.5" /> Final Test
        </div>
        <h3 className="text-2xl font-serif text-stone-900 mb-2">Ready to unlock the next lesson?</h3>
        <p className="text-sm text-stone-600 mb-6">
          {questionCount} questions drawn from everything you covered in this lesson. Score <span className="font-bold">80%</span> or higher to pass. You can retake the test as many times as you like — your best score is saved.
        </p>
        <button 
          onClick={() => setHasStarted(true)} 
          className="bg-amber-500 text-stone-900 font-bold px-6 py-2.5 flex items-center gap-2 hover:bg-amber-400 transition-colors mb-8 border border-amber-600 shadow-sm"
        >
          Start the test <ChevronRight size={16} />
        </button>
        
        <div className="border border-stone-200 p-5 bg-[#fafaf9]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
             <Lock size={14} /> Progression
          </div>
          <p className="text-sm text-stone-600 mb-4">Passing this test unlocks the next lesson in the syllabus. Your progress is saved locally in your browser.</p>
          <ul className="space-y-2 text-sm text-stone-600">
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Mix of recognition and pronunciation prompts</li>
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Immediate feedback after each question</li>
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited retakes — best score is kept</li>
          </ul>
        </div>
      </div>
    );
  }

  if (step >= questionCount) {
    const passed = (score / questionCount) >= 0.8 || DEV_BYPASS_LOCKS;
    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 border ${isUnlockTest ? 'bg-white border-stone-200' : 'bg-[#fffdf5] border-[#fde68a]'} shadow-sm`}>
        <div className={`w-20 h-20 flex items-center justify-center mb-6 shadow-sm border ${passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
          {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">{passed ? "Test Passed!" : "Keep Practicing"}</h3>
        <p className="text-stone-600 mb-8 font-bold text-lg">You scored <span className={passed ? "text-emerald-600" : "text-rose-600"}>{score}</span> out of {questionCount}.</p>
        
        <div className="flex gap-4">
          <button onClick={() => { setStep(0); setScore(0); setPicked(null); }} className="px-6 py-3 bg-white border border-stone-200 font-bold hover:bg-stone-50 transition-colors text-stone-700 flex items-center gap-2">
            <Shuffle size={18} /> Retake Test
          </button>
          {passed && isUnlockTest && (
            <button className="px-8 py-3 bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-2 border border-amber-600">
              Unlock Next Lesson <ArrowRight size={18} />
            </button>
          )}
        </div>
        {DEV_BYPASS_LOCKS && !passed && isUnlockTest && (
          <div className="mt-6 text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1.5 border border-rose-200">DEV_BYPASS_LOCKS is true — you may proceed manually.</div>
        )}
      </div>
    );
  }

  return (
    <div className={`border p-6 md:p-8 ${isUnlockTest ? 'bg-white border-stone-200' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
      {!isUnlockTest && (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Sparkles size={14} /> Checkpoint
        </div>
      )}
      <h3 className="text-xl font-serif text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 mb-6">{intro}</p>

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-3 mb-6">
        <span>Question {step + 1} of {questionCount}</span>
        <span className="text-amber-500">Score {score}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Prompt</div>
          {isVocabMatch ? (
             <span className="text-xl text-stone-800">Which word means <span className="font-bold">"{question.answer.en}"</span>?</span>
          ) : (
             <span className="text-xl text-stone-800">Which letter reads <span className="font-mono bg-stone-100 px-2 py-0.5 border border-stone-200">[{question.answer.pron || question.answer.translit}]</span>?</span>
          )}
        </div>
        <button onClick={() => playAudio(question.answer.tib)} disabled={playingItem !== null} className="inline-flex items-center justify-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-5 py-2 font-bold hover:bg-amber-100 transition-colors shrink-0">
           {playingItem === question.answer.tib ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} Play Hint
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {question.choices.map((c: any) => {
          const isRight = picked && c.tib === question.answer.tib;
          const isWrong = picked === c.tib && c.tib !== question.answer.tib;
          
          let stateClass = "bg-white border-stone-200 hover:border-amber-400 text-stone-900 hover:shadow-sm";
          if (isRight) stateClass = "bg-emerald-50 text-emerald-700 border-emerald-400";
          else if (isWrong) stateClass = "bg-rose-50 text-rose-700 border-rose-400";
          else if (picked) stateClass = "bg-stone-50 text-stone-300 opacity-60 border-stone-200";

          return (
            <button
              key={c.tib + c.translit} disabled={!!picked}
              onClick={() => { setPicked(c.tib); if (c.tib === question.answer.tib) { setScore(s => s + 1); playAudio(question.answer.tib); } else { playErrorBeep(); } }}
              className={`py-6 px-4 text-center transition-all flex flex-col items-center justify-center border ${stateClass}`}
            >
              <span className="font-serif text-[3rem] leading-none">{c.tib}</span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border bg-stone-50 border-stone-200 shadow-sm">
          <span className={`text-sm font-bold ${picked === question.answer.tib ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === question.answer.tib ? "Correct!" : `The correct answer was ${question.answer.tib} (${question.answer.translit}).`}
          </span>
          <button onClick={() => { setPicked(null); setStep((s) => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-stone-800 transition">
            Next <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}