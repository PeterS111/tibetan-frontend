"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import {
  Volume2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Info,
  Layers,
  Shuffle,
  CheckCircle2,
  Sparkles,
  Moon,
  Sun,
  BookOpen,
  Play,
  Loader2,
  XCircle
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data & Types                                                        */
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
  accent: { hex: string; bg: string; text: string; border: string; hover: string };
}

const TONE_META: Record<Tone, { label: string; hex: string; Icon: typeof ArrowRight; text: string; bg: string; border: string }> = {
  same: { label: "Same tone as root", hex: "#16a34a", Icon: ArrowRight, text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  up:   { label: "Higher tone",       hex: "#b91c1c", Icon: ArrowUp,    text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  down: { label: "Lower tone",        hex: "#0284c7", Icon: ArrowDown,  text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
};

const SUPERS: Super[] = [
  {
    key: "ra",
    head: "ར",
    headLabel: "ར་མགོ",
    name: "Ra-go",
    nameTib: "ར་མགོ་བཅུ་གཉིས།",
    title: "The Twelve Superscripts \u201cRa\u201d",
    count: 12,
    intro: "The consonant ར (ra) sits above twelve root letters. When it does, it is no longer pronounced on its own — instead it re-tunes the tone of the letter beneath.",
    rootLetters: "ཀ ག ང ཇ ཉ ཏ ད ན བ མ ཙ ཛ",
    accent: { hex: "#b91c1c", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", hover: "hover:bg-rose-100" },
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
    title: "The Ten Superscripts \u201cLa\u201d",
    count: 10,
    intro: "The consonant ལ (la) serves as a superscript for ten root letters. As with Ra-go, its role is silent — it shifts the tone of the letter it caps.",
    rootLetters: "ཀ ག ང ཅ ཇ ཏ ད པ བ ཧ",
    accent: { hex: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", hover: "hover:bg-amber-100" },
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
    title: "The Eleven Superscripts \u201cSa\u201d",
    count: 11,
    intro: "The consonant ས (sa) sits above eleven root letters. Sa-go stacks are common in everyday vocabulary — nose, saddle, wheat, body — so they reward memorising early.",
    rootLetters: "ཀ ག ང ཉ ཏ ད ན པ བ མ ཙ",
    accent: { hex: "#0ea5e9", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", hover: "hover:bg-sky-100" },
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

interface Vocab {
  tib: string;
  translit: string;
  en: string;
  emoji: string;
  sup: SuperKey;
}

const VOCAB: Vocab[] = [
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
  { tib: "ལྔ", translit: "nga", en: "five", emoji: "5️⃣", sup: "la" },
  { tib: "ལྷ", translit: "lha", en: "deity", emoji: "🕉️", sup: "la" },
  { tib: "ལྷ་མོ", translit: "lha-mo", en: "goddess", emoji: "🪷", sup: "la" },
  { tib: "ལྕེ", translit: "ce", en: "tongue", emoji: "👅", sup: "la" },
  { tib: "ལྡི་ལི", translit: "di-li", en: "Delhi", emoji: "🏛️", sup: "la" },
  { tib: "ལྟ", translit: "ta", en: "look", emoji: "🔭", sup: "la" },
  { tib: "ལྗི་བ", translit: "ji-ba", en: "flea", emoji: "🪳", sup: "la" },
  { tib: "ལྕི་བ", translit: "ci-ba", en: "dung", emoji: "💩", sup: "la" },
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

const STEPS = [
  { id: "intro", eyebrow: "Step 01", title: "What is a superscript?", desc: "How superscripts stack over a root letter." },
  { id: "family", eyebrow: "Step 02", title: "Meet the three superscripts", desc: "Study each superscript with its root combinations." },
  { id: "vocab", eyebrow: "Step 03", title: "Vocabulary built from superscripts", desc: "Real words using stacked letters." },
  { id: "practice", eyebrow: "Step 04", title: "Practice & mastery check", desc: "Flashcards, quiz, and matching drills." },
  { id: "complete", eyebrow: "Finish", title: "Lesson complete", desc: "Take the final test to unlock the next unit." }
];

/* ------------------------------------------------------------------ */
/* Main Page Component                                                 */
/* ------------------------------------------------------------------ */

export default function SuperscriptsLesson() {
  const { getToken } = useAuth();
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  
  // Progression Lock State
  const [unlockedStep, setUnlockedStep] = useState<number>(DEV_BYPASS_LOCKS ? 4 : 0);
  const [expandedStep, setExpandedStep] = useState<number>(0);

  // Lesson State
  const [activeTab, setActiveTab] = useState<SuperKey>("ra");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");

  // Audio API
  const playAudio = async (text: string) => {
    if (playingItem) return;
    setPlayingItem(text);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("text", text);
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

  const handleToggleStep = (index: number) => {
    if (index <= unlockedStep) {
      setExpandedStep(expandedStep === index ? -1 : index);
    }
  };

  const markComplete = (index: number) => {
    const next = index + 1;
    if (next > unlockedStep) setUnlockedStep(next);
    setExpandedStep(next);
    // FIX: Removed window.scrollTo() so the UI naturally opens the next section 
    // without snapping the user back to the top of the page.
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
          <span>Unit 03</span>
          <ChevronRight size={14} />
          <span className="text-stone-900">Superscripts</span>
        </div>

        {/* Hero */}
        <section className="mb-12 grid gap-8 border border-black/10 bg-white p-6 md:grid-cols-[1fr,auto] md:items-end md:p-10 shadow-sm">
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
              Lesson 03 · Foundations
            </div>
            <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl text-stone-900">
              The Three Superscripts
            </h1>
            <p className="mt-2 font-serif text-2xl italic text-stone-500">
              མགོ་ཅན་གསུམ།
            </p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              Only three letters — ར, ལ, ས — may sit above another consonant. When they do, they
              fall silent themselves and quietly reshape the tone of the root letter beneath. Learn
              each superscript in turn: which consonants it stacks with, how the pronunciation
              shifts, and the everyday vocabulary each family unlocks.
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <span>Lesson progress</span>
              <span className="text-amber-500">{Math.min(unlockedStep, STEPS.length)} of {STEPS.length} sections</span>
            </div>
            <div className="h-1.5 w-full bg-stone-100 overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-500 ease-out" 
                style={{ width: `${(Math.min(unlockedStep, STEPS.length) / STEPS.length) * 100}%` }}
              />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {SUPERS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  // FIX: Pass the native Tibetan label (s.headLabel) instead of the English label (s.name)
                  onClick={() => playAudio(s.headLabel)}
                  disabled={playingItem !== null}
                  className="group flex flex-col items-center gap-1 border border-black/10 p-3 text-center transition hover:bg-stone-50 hover:border-amber-400"
                >
                  <div className="flex items-center gap-1">
                    <span className="font-serif text-2xl text-stone-900">{s.headLabel}</span>
                    {playingItem === s.headLabel ? (
                       <Loader2 size={12} className="animate-spin text-amber-500" />
                    ) : (
                       <Volume2 size={12} className="text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-stone-500">
                    {s.count} stacks
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          
          {/* Step 01 */}
          <StepContainer 
            index={0} 
            step={STEPS[0]} 
            isUnlocked={unlockedStep >= 0} 
            isExpanded={expandedStep === 0}
            onToggle={() => handleToggleStep(0)}
            onContinue={() => markComplete(0)}
          >
            <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[0].title}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <Layers size={14} /> Stacking
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  A superscript is a small consonant written <span className="font-bold text-stone-900">on top of</span> a root letter. Only three consonants — <span className="font-serif text-lg">ར ལ ས</span> — are permitted to occupy this position.
                </p>
              </div>
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <Volume2 size={14} /> Silence
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  The superscript itself is <span className="font-bold text-stone-900">not pronounced</span>. Only the root letter is spoken — but the presence of the superscript changes <em>how</em> that root is voiced.
                </p>
              </div>
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <ArrowUp size={14} /> Tone shift
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  Depending on the root's gender, the tone becomes <span className="font-bold text-emerald-700">same</span>, <span className="font-bold text-rose-700">higher</span>, or <span className="font-bold text-sky-700">lower</span> than the base letter alone.
                </p>
              </div>
            </div>

            <div className="mt-6 p-6 border border-black/10 bg-stone-50">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                <Info size={14} className="text-amber-500" /> Reading the tone arrows
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(Object.keys(TONE_META) as Tone[]).map((t) => {
                  const M = TONE_META[t];
                  const rule = t === "same" ? "Masculine letters keep the root's tone." : t === "down" ? "Feminine letters acquire a lower tone." : "Very-feminine / neuter letters acquire a higher tone.";
                  return (
                    <div key={t} className="flex items-start gap-3 border border-black/5 bg-white p-4 shadow-sm">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: M.hex }}>
                        <M.Icon size={16} strokeWidth={2.5} />
                      </span>
                      <div>
                        <div className="text-sm font-bold text-stone-900">{M.label}</div>
                        <div className="mt-1 text-xs text-stone-500">{rule}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </StepContainer>

          {/* Step 02 */}
          <StepContainer 
            index={1} 
            step={STEPS[1]} 
            isUnlocked={unlockedStep >= 1} 
            isExpanded={expandedStep === 1}
            onToggle={() => handleToggleStep(1)}
            onContinue={() => markComplete(1)}
          >
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-black/5 pb-4 gap-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[1].title}</h2>
              <button
                onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))}
                className="inline-flex items-center gap-2 border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 transition hover:bg-stone-50 hover:text-stone-900"
              >
                {studyMode === "paper" ? <Moon size={14} /> : <Sun size={14} />}
                {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {SUPERS.map((s) => {
                const on = s.key === activeTab;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveTab(s.key)}
                    className={`group flex items-center gap-3 border px-4 py-3 text-left transition-colors ${
                      on ? "border-stone-900 bg-stone-900 text-white" : "border-black/10 bg-white text-stone-900 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    <span className="grid h-11 min-w-11 place-items-center px-1 font-serif text-xl leading-none bg-white/10" style={{ color: on ? '#fff' : s.accent.hex, backgroundColor: on ? 'rgba(255,255,255,0.1)' : `${s.accent.hex}20` }}>
                      {s.headLabel}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">{s.name}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-stone-400" : "text-stone-500"}`}>
                        {s.count} stacks
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <SuperPanel 
              sup={SUPERS.find(s => s.key === activeTab)!} 
              night={studyMode === "night"} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
            />
          </StepContainer>

          {/* Step 03 */}
          <StepContainer 
            index={2} 
            step={STEPS[2]} 
            isUnlocked={unlockedStep >= 2} 
            isExpanded={expandedStep === 2}
            onToggle={() => handleToggleStep(2)}
            onContinue={() => markComplete(2)}
          >
            <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[2].title}</h2>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 border border-black/5">{VOCAB.length} words</span>
            </div>
            <VocabFilter playAudio={playAudio} playingItem={playingItem} />
          </StepContainer>

          {/* Step 04 */}
          <StepContainer 
            index={3} 
            step={STEPS[3]} 
            isUnlocked={unlockedStep >= 3} 
            isExpanded={expandedStep === 3}
            onToggle={() => handleToggleStep(3)}
            onContinue={() => markComplete(3)}
          >
            <div className="mb-6 flex flex-col border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900 mb-3">{STEPS[3].title}</h2>
              <p className="max-w-3xl text-sm text-stone-600 leading-relaxed">
                Each superscript has its own <span className="font-bold text-stone-900">mastery check</span> — a short focused quiz on just those stacks — followed by a <span className="font-bold text-stone-900">cumulative review</span> that mixes all three families together. This layered approach prevents cognitive overload and reinforces the differences between Ra-go, La-go, and Sa-go.
              </p>
            </div>
            <PracticeSuite playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 05 - Final Test */}
          <StepContainer 
            index={4} 
            step={STEPS[4]} 
            isUnlocked={unlockedStep >= 4} 
            isExpanded={expandedStep === 4}
            onToggle={() => handleToggleStep(4)}
            onContinue={() => {}}
            isLast={true}
          >
            <LessonFinalTest playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

        </div>
        
        {/* Footer Navigation */}
        <nav className="mt-16 flex flex-col justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row">
          <Link href="/dashboard/lessons/2" className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 border border-transparent hover:border-black/10 bg-white hover:bg-stone-50">
            <ChevronLeft size={16} /> Previous · The Four Vowels
          </Link>
          <Link href="/dashboard/lessons" className="inline-flex items-center justify-center sm:justify-end gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 border border-transparent hover:border-black/10 bg-white hover:bg-stone-50">
            Back to syllabus <BookOpen size={16} />
          </Link>
        </nav>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout Components                                                   */
/* ------------------------------------------------------------------ */

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
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Section 0{index + 1}</span>
          </div>
          
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

/* ------------------------------------------------------------------ */
/* Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function SuperPanel({ sup, night, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className={`relative overflow-hidden border transition-colors duration-500 ${night ? "border-white/10 bg-[#0f0d0a] text-stone-100" : "border-black/10 bg-white"}`}>
      <div className="h-1 w-full" style={{ backgroundColor: sup.accent.hex }} />

      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-black/5">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-serif text-[4rem] leading-none" style={{ backgroundColor: night ? `${sup.accent.hex}20` : `${sup.accent.hex}15`, color: sup.accent.hex }}>
            {sup.head}
          </div>
          <div>
            <div className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 ${night ? "text-stone-400" : "text-stone-500"}`}>Superscript</div>
            <div className="font-serif text-3xl font-bold">{sup.title}</div>
            <div className={`mt-1 font-serif text-xl italic ${night ? "text-stone-400" : "text-stone-500"}`}>{sup.nameTib}</div>
          </div>
        </div>
        <p className={`text-[15px] leading-relaxed p-5 border ${night ? "bg-white/5 border-white/10 text-stone-300" : "bg-stone-50 border-black/5 text-stone-600"}`}>
          {sup.intro}<br /><br />
          <span className={night ? "text-white font-bold" : "text-stone-900 font-bold"}>
            <span className="font-serif text-xl">{sup.head}</span> + {sup.rootLetters}
          </span>
        </p>
      </div>

      <div className={`grid grid-cols-3 gap-px border-b sm:grid-cols-4 md:grid-cols-6 ${night ? "border-white/10 bg-white/10" : "border-black/10 bg-black/5"}`}>
        {sup.combos.map((c: any) => {
          const M = TONE_META[c.tone as Tone];
          return (
            <button key={c.stack} onClick={() => playAudio(c.stack)} disabled={playingItem !== null} className={`group relative flex flex-col items-center justify-center gap-3 p-6 transition-colors ${night ? "bg-[#0f0d0a] hover:bg-[#1a1712]" : "bg-white hover:bg-stone-50"}`}>
              <span className="font-serif text-[3rem] leading-none" style={{ color: night ? '#fcd34d' : '#1c1917' }}>{c.stack}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-400" : "text-stone-500"}`}>{c.read}</span>
              <span className="inline-flex size-5 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: M.hex }} title={M.label}>
                <M.Icon size={12} strokeWidth={3} />
              </span>
              {playingItem === c.stack && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-amber-500" />}
            </button>
          )
        })}
      </div>

      <div className={`p-6 md:p-8 border-b ${night ? "border-white/10 bg-[#0f0d0a]" : "border-black/5 bg-white"}`}>
        <div className={`mb-6 text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-400" : "text-stone-500"}`}>Spelling walkthrough</div>
        <div className="space-y-2">
          {sup.combos.map((c: any) => {
            const M = TONE_META[c.tone as Tone];
            const rootTib = c.stack.charAt(1);
            return (
              <div key={c.stack} className={`flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 ${night ? "border-white/10 bg-white/5" : "border-black/10 bg-white shadow-sm"}`}>
                <span className="font-serif text-[2.5rem] leading-none w-12 text-center">{c.stack}</span>
                <span className={`text-xs font-bold ${night ? "text-stone-400" : "text-stone-500"}`}>
                  <span className="font-serif text-lg">{sup.head}</span> + <span className="font-serif text-lg">{rootTib || "◌"}</span> + བཏགས་
                </span>
                <ArrowRight size={16} className={night ? "text-stone-600" : "text-stone-300"} />
                <span className={`font-mono text-lg font-bold ${night ? "text-stone-100" : "text-stone-900"}`}>[{c.read}]</span>
                <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 ${night ? "bg-black/30" : M.bg} ${M.text}`} style={{ color: night ? M.hex : undefined }}>
                  <M.Icon size={14} strokeWidth={2.5} /> {M.label}
                </span>
                <button onClick={() => playAudio(c.stack)} disabled={playingItem !== null} className={`inline-grid size-10 place-items-center transition-colors border ${night ? "bg-white/10 border-white/20 hover:bg-white/20 text-amber-400" : "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700"}`}>
                  {playingItem === c.stack ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-6 md:p-8 ${night ? "bg-black/40" : "bg-stone-50"}`}>
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: sup.accent.hex }} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${night ? "text-stone-200" : "text-stone-800"}`}>Mastery check · {sup.name}</span>
        </div>
        <MiniMastery sup={sup} night={night} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function MiniMastery({ sup, night, playAudio, playingItem, playErrorBeep }: any) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const question = useMemo(() => {
    const answer = sup.combos[step % sup.combos.length];
    const wrongs = sup.combos.filter((c: any) => c.read !== answer.read).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...wrongs, answer].sort(() => 0.5 - Math.random());
    return { answer, choices };
  }, [sup, step]);

  const total = Math.min(5, sup.combos.length);
  const pick = (read: string) => {
    if (picked) return;
    setPicked(read);
    if (read === question.answer.read) { setScore(s => s + 1); playAudio(question.answer.stack); } else { playErrorBeep(); }
  };

  if (step >= total) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border border-black/10 bg-white">
        <div className={`text-[15px] font-bold ${night ? "text-stone-800" : "text-stone-800"}`}>
          Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: sup.accent.hex }}>{score}</span> / {total} on {sup.name}.
        </div>
        <button onClick={() => { setStep(0); setScore(0); setPicked(null); }} className="inline-flex items-center gap-2 border border-black/10 bg-stone-50 px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors">
          <Shuffle size={14} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className={night ? "text-stone-400" : "text-stone-500"}>Question {step + 1} of {total}</span>
        <span style={{ color: sup.accent.hex }}>Score {score}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className={`text-[15px] font-bold ${night ? "text-stone-300" : "text-stone-600"}`}>Which stack reads</span>
        <span className={`font-mono text-2xl font-bold border px-3 py-1 ${night ? "bg-white/10 border-white/20 text-white" : "bg-white border-black/10 text-stone-900"}`}>[{question.answer.read}]</span>
        <button onClick={() => playAudio(question.answer.stack)} disabled={playingItem !== null} className={`inline-grid size-10 place-items-center transition-colors border ${night ? "bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30 text-amber-400" : "bg-amber-100 border-amber-200 hover:bg-amber-200 text-amber-700"}`}>
          {playingItem === question.answer.stack ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.choices.map((c: any) => {
          const right = picked && c.read === question.answer.read;
          const wrong = picked === c.read && c.read !== question.answer.read;
          return (
            <button
              key={c.stack} disabled={!!picked} onClick={() => pick(c.read)}
              className={`flex aspect-square items-center justify-center border-2 font-serif text-[3.5rem] transition-all ${
                right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" 
                : wrong ? "border-rose-400 bg-rose-50 text-rose-700" 
                : night ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white" 
                : "border-black/10 bg-white hover:border-amber-400 hover:bg-amber-50 text-stone-900 hover:shadow-md"
              }`}
            >
              {c.stack}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border shadow-sm ${night ? "bg-white/5 border-white/10" : "bg-white border-black/10"}`}>
          <span className={`text-sm font-bold ${picked === question.answer.read ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === question.answer.read ? `Correct — ${question.answer.stack} reads [${question.answer.read}].` : `Answer: ${question.answer.stack} reads [${question.answer.read}].`}
          </span>
          <button onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 px-6 py-2.5 text-sm font-bold text-stone-900 hover:bg-amber-400 transition-colors shadow-sm">
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function VocabFilter({ playAudio, playingItem }: any) {
  const [filter, setFilter] = useState<SuperKey | "all">("all");
  const items = filter === "all" ? VOCAB : VOCAB.filter((v) => v.sup === filter);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {[{ key: "all", label: "All", count: VOCAB.length, hex: undefined }, ...SUPERS.map(s => ({ key: s.key, label: s.name, count: VOCAB.filter(v => v.sup === s.key).length, hex: s.accent.hex }))].map((c) => {
          const active = filter === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setFilter(c.key as any)}
              className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                active ? "border-stone-900 bg-stone-900 text-white shadow-sm" : "border-black/10 bg-white text-stone-500 hover:border-stone-400 hover:text-stone-900"
              }`}
            >
              {c.hex && <span className="size-2.5 rounded-full" style={{ backgroundColor: c.hex }} />}
              {c.label} · {c.count}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((v) => {
          const s = SUPERS.find((x) => x.key === v.sup)!;
          return (
            <button key={v.tib + v.translit} onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="group relative flex flex-col items-start gap-4 border border-black/10 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: s.accent.hex }} />
              <div className="flex w-full items-start justify-between">
                <span className="text-3xl">{v.emoji}</span>
                <span className="inline-grid size-8 place-items-center bg-stone-50 border border-black/5 text-amber-500 transition-colors group-hover:bg-amber-50 group-hover:border-amber-200">
                  {playingItem === v.tib ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </span>
              </div>
              <div className="w-full border-b border-black/5 pb-3">
                <div className="font-serif text-[28px] font-bold leading-tight text-stone-900 mb-1">{v.tib}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{v.translit}</div>
              </div>
              <div className="text-sm font-bold text-stone-600">{v.en}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function PracticeSuite({ playAudio, playingItem, playErrorBeep }: any) {
  const [tab, setTab] = useState("flash");
  const tabs = [
    { id: "flash", label: "Flashcards", Icon: Layers },
    { id: "quiz", label: "Cumulative quiz", Icon: Sparkles },
    { id: "match", label: "Match", Icon: Shuffle },
    { id: "srs", label: "Memory review", Icon: BookOpen },
  ];

  return (
    <div className="border border-black/10 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap border-b border-black/10 bg-stone-50">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${tab === t.id ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-white hover:text-stone-900"}`}>
            <t.Icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      <div className="p-6 md:p-10 bg-[#fdfbf7]">
        {tab === "flash" && <Flashcards speak={playAudio} playingItem={playingItem} />}
        {tab === "quiz" && <CumulativeQuiz speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
        {tab === "match" && <MatchStackToSound speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
        {tab === "srs" && <MemoryReview speak={playAudio} playingItem={playingItem} />}
      </div>
    </div>
  );
}

type FlashCard =
  | { kind: "stack"; tib: string; translit: string; en: string; sup: SuperKey; spoken: string; emoji?: string }
  | { kind: "word";  tib: string; translit: string; en: string; sup: SuperKey; spoken: string; emoji: string };

function Flashcards({ speak, playingItem }: any) {
  const [mode, setMode] = useState<"stacks" | "words">("stacks");
  const deck = useMemo<FlashCard[]>(() => {
    if (mode === "stacks") {
      return SUPERS.flatMap((s) => s.combos.map((c) => ({ kind: "stack" as const, tib: c.stack, translit: c.read, en: TONE_META[c.tone].label, sup: s.key, spoken: c.stack })));
    }
    return VOCAB.map((v) => ({ kind: "word" as const, tib: v.tib, translit: v.translit, en: v.en, sup: v.sup, spoken: v.tib, emoji: v.emoji }));
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
            <button key={k} onClick={() => { setMode(k); setIdx(0); setFlipped(false); }} className={`px-4 py-2 border transition-colors ${mode === k ? "bg-stone-900 text-white border-stone-900" : "bg-white border-black/10 text-stone-500 hover:bg-stone-50"}`}>
              {k === "stacks" ? `Stacks · ${SUPERS.reduce((a, s) => a + s.count, 0)}` : `Words · ${VOCAB.length}`}
            </button>
          ))}
        </div>
        <span>Card {(idx % deck.length) + 1} of {deck.length}</span>
      </div>

      <button onClick={() => setFlipped(!flipped)} className="w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-black/10 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center relative group overflow-hidden">
        <span className="absolute left-0 top-0 h-1.5 w-full" style={{ backgroundColor: accent }} />
        {!flipped ? (
          card.kind === "word" ? (
            <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform">
              <span className="text-5xl">{card.emoji}</span>
              <span className="font-serif text-6xl text-stone-900">{card.tib}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">{card.translit}</span>
            </div>
          ) : (
            <span className="text-6xl md:text-8xl font-serif text-stone-900 group-hover:scale-105 transition-transform">{card.tib}</span>
          )
        ) : (
          <div className="max-w-md px-6 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 leading-relaxed">{card.en.split('·')[0].trim()}</div>
            <div className="text-sm sm:text-lg text-stone-500 font-bold uppercase tracking-widest">[{card.en.split('·')[1]?.trim() || card.translit}]</div>
          </div>
        )}
        <span className="absolute bottom-4 right-6 text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:text-stone-400">Tap card to flip</span>
      </button>

      <div className="w-full max-w-2xl flex items-center justify-between mt-8">
        <button onClick={prev} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-900"><ArrowLeft size={16} /> Previous</button>
        <button onClick={() => speak(card.spoken)} disabled={playingItem !== null} className="flex items-center gap-2 px-8 py-3 bg-stone-100 border border-black/5 hover:bg-stone-200 text-stone-700 font-bold shadow-sm transition-colors">
          {playingItem === card.spoken ? <Loader2 size={18} className="animate-spin text-amber-600" /> : <Play size={18} className="fill-current text-amber-500" />} Play sound
        </button>
        <button onClick={next} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-900">Next <ArrowRight size={16} /></button>
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
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Quiz Complete!</h3>
        <p className="text-stone-600 mb-8 font-bold">You scored <span className="text-xl text-emerald-600">{score}</span> out of {total}.</p>
        <button onClick={() => { setStep(0); setScore(0); setPicked(null); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"><Shuffle size={18} /> Reshuffle</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500">
        <span>Question {step + 1} of {total}</span>
        <span className="text-amber-600">Score {score}</span>
      </div>
      
      <div className="w-full max-w-4xl flex flex-col items-center gap-6 border border-black/10 bg-white p-10 shadow-sm mb-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">What does this stack read?</span>
        <span className="font-serif leading-none text-stone-900" style={{ fontSize: "7rem" }}>{q.answer.stack}</span>
        <button onClick={() => speak(q.answer.stack)} disabled={playingItem !== null} className="inline-flex items-center gap-2 border border-black/10 bg-stone-50 px-6 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors">
          {playingItem === q.answer.stack ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className="text-amber-500" />} Play Hint
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-2 gap-4 md:grid-cols-4">
        {q.choices.map((c) => {
          const right = picked && c.read === q.answer.read;
          const wrong = picked === c.read && c.read !== q.answer.read;
          return (
            <button
              key={c.stack + c.read} disabled={!!picked}
              onClick={() => { setPicked(c.read); if (c.read === q.answer.read) { setScore((s) => s + 1); speak(q.answer.stack); } else { playErrorBeep(); } }}
              className={`border p-6 text-center transition-all ${
                right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700" : "border-black/10 bg-white hover:border-amber-400 hover:bg-amber-50 hover:shadow-md"
              }`}
            >
              <div className="font-mono text-xl font-bold mb-2">[{c.read}]</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{TONE_META[c.tone].label}</div>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="w-full max-w-4xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border border-black/10 bg-white shadow-sm">
          <span className={`text-sm font-bold ${picked === q.answer.read ? "text-emerald-700" : "text-rose-700"}`}>
            {picked === q.answer.read ? `Correct — ${q.answer.stack} reads [${q.answer.read}].` : `The answer was [${q.answer.read}].`}
          </span>
          <button onClick={() => { setPicked(null); setStep((s) => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 px-8 py-3 text-sm font-bold text-stone-900 hover:bg-amber-400 shadow-sm">
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
      <p className="text-sm font-bold text-stone-500 mb-8 self-start w-full max-w-4xl">Match each stacked consonant with the sound it reads.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {questions.map((q, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-black/10 shadow-sm gap-4 sm:gap-2">
            <div className="text-4xl font-serif text-stone-900 sm:ml-4 text-center sm:text-left">{q.target.stack}</div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto sm:mr-2">
              {q.options.map(opt => {
                const isSelected = matchAnswers[q.target.stack] === opt.read;
                const isCorrect = q.target.read === opt.read;
                const isAnswered = !!matchAnswers[q.target.stack];
                let btnClass = "border-black/10 text-stone-600 hover:bg-stone-50 cursor-pointer font-mono";
                if (isAnswered) {
                  if (isCorrect) { btnClass = isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm font-mono" : "border-emerald-400 border-dashed bg-emerald-50/50 text-emerald-600 font-mono"; } 
                  else { btnClass = isSelected ? "border-rose-500 bg-rose-50 text-rose-700 cursor-default font-mono" : "border-black/5 bg-stone-50 text-stone-300 opacity-50 cursor-default font-mono"; }
                }
                return (
                  <button key={opt.stack + opt.read} onClick={() => { if(!isAnswered){ setMatchAnswers(p => ({ ...p, [q.target.stack]: opt.read })); if(isCorrect) speak(opt.stack); else playErrorBeep(); } else if (isCorrect) { speak(opt.stack); } }} disabled={playingItem !== null || (isAnswered && !isCorrect)} className={`relative px-4 py-2 text-[13px] font-bold border transition-colors flex items-center justify-center min-w-[5rem] text-center ${btnClass}`}>
                    {playingItem === opt.stack && isCorrect ? <Loader2 size={14} className="animate-spin absolute" /> : `[${opt.read}]`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {Object.keys(matchAnswers).length === questions.length && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setMatchAnswers({}); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 shadow-sm transition-colors flex items-center gap-2">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MemoryReview({ speak, playingItem }: any) {
  const items = useMemo(() => [
    ...SUPERS.flatMap(s => s.combos.map(c => ({ id: `combo-${c.stack}`, text: c.stack, wylie: c.read, hint: TONE_META[c.tone].label, emoji: '', type: 'letter' }))),
    ...VOCAB.map(v => ({ id: `vocab-${v.tib}`, text: v.tib, wylie: v.translit, hint: v.en, emoji: v.emoji, type: 'vocab' }))
  ], []);

  const [deck, setDeck] = useState(() => [...items].sort(() => 0.5 - Math.random()));
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
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
      <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Deck Complete!</h3>
      <p className="text-stone-500 font-bold mb-8">You have successfully mastered all {items.length} cards.</p>
      <button onClick={() => { setDeck([...items].sort(() => 0.5 - Math.random())); setReviewedCount(0); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"><Repeat size={18} /> Review Again</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-black/5 pb-4">
          <span>Spaced repetition · rate your recall</span><span>{reviewedCount} reviewed</span>
        </div>
        <div className="bg-white border border-black/10 p-8 sm:p-16 flex flex-col items-center justify-center mb-6 min-h-[300px] shadow-sm relative overflow-hidden">
          {deck[0].emoji && <div className="text-6xl mb-6">{deck[0].emoji}</div>}
          <div className="text-7xl sm:text-8xl md:text-[8rem] font-serif text-stone-900 mb-8 leading-none text-center">{deck[0].text}</div>
          <button onClick={() => speak(deck[0].text)} disabled={playingItem !== null} className="flex items-center gap-2 px-6 py-2.5 bg-stone-50 border border-black/10 hover:bg-stone-100 text-stone-700 font-bold transition-colors text-sm shadow-sm">
            {playingItem === deck[0].text ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className="text-amber-500" />} Check Sound
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button onClick={() => setRating('Hard')} className={`py-4 border font-bold text-sm transition-colors ${rating === 'Hard' ? 'bg-rose-100 border-rose-400 text-rose-800' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}>Hard</button>
          <button onClick={() => setRating('Good')} className={`py-4 border font-bold text-sm transition-colors ${rating === 'Good' ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>Good</button>
          <button onClick={() => setRating('Easy')} className={`py-4 border font-bold text-sm transition-colors ${rating === 'Easy' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>Easy</button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14} /> Cards you mark Hard return soon; Easy cards drift further out.</p>
          <button onClick={nextCard} disabled={!rating} className={`flex items-center justify-center gap-2 px-8 py-3.5 font-bold shadow-sm transition-colors w-full sm:w-auto ${rating ? 'bg-amber-500 hover:bg-amber-400 text-stone-900' : 'bg-stone-100 border border-black/5 text-stone-400 cursor-not-allowed'}`}>Next Card <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}

// Helper icon for Repeat
function Repeat(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
}

/* ------------------------------------------------------------------ */
/* Final Lesson Test (QuizModule Implementation)                       */
/* ------------------------------------------------------------------ */

function LessonFinalTest({ playAudio, playingItem, playErrorBeep }: any) {
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  // Generate 10 mixed questions (Vocab and Superscripts)
  const questions = useMemo(() => {
    const allCombos = SUPERS.flatMap(s => s.combos);
    const qs = [];
    
    // Type 1: Translit -> Tibetan (Vocab) - 4 questions
    const vTargets = [...VOCAB].sort(() => 0.5 - Math.random()).slice(0, 4);
    for (const v of vTargets) {
      const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'vocab',
        questionText: `What is the Tibetan word for "${v.en}"?`,
        answer: v.tib,
        audio: v.tib,
        choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ label: `${x.emoji} ${x.tib}`, value: x.tib }))
      });
    }

    // Type 2: Tibetan -> Sound (Superscripts) - 6 questions
    const cTargets = [...allCombos].sort(() => 0.5 - Math.random()).slice(0, 6);
    for (const c of cTargets) {
      const wrongs = allCombos.filter(x => x.read !== c.read).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'combo',
        questionText: "What does this stack read?",
        prominentTibetan: c.stack,
        answer: c.read,
        audio: c.stack,
        choices: [c, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ label: `[${x.read}]`, value: x.read }))
      });
    }

    return qs.sort(() => 0.5 - Math.random());
  }, []);

  const total = questions.length;
  const currentQ = questions[step];

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-in fade-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-200"><Sparkles size={32} /></div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Ready to unlock the next lesson?</h3>
        <p className="text-stone-600 mb-8 max-w-md leading-relaxed">
          10 questions drawn from everything you covered in this lesson. Score <span className="font-bold text-stone-900">80%</span> or higher to pass. You can retake the test as many times as you like.
        </p>
        <button onClick={() => setHasStarted(true)} className="px-8 py-3.5 bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-2">
          Start the test <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  if (step >= total) {
    const passed = score >= 8;
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-in zoom-in-95">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border ${passed ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-rose-100 text-rose-600 border-rose-200'}`}>
          {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">{passed ? 'Lesson Mastered!' : 'Keep Practicing'}</h3>
        <p className="text-stone-600 mb-8 font-bold">You scored <span className={`text-xl ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>{score}</span> out of {total}. {passed ? 'You have unlocked the next unit.' : 'You need 8 correct to pass.'}</p>
        
        {passed ? (
          <Link href="/dashboard/lessons/4" className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm">
            Continue to Unit 04 <ArrowRight size={18} />
          </Link>
        ) : (
          <button onClick={() => { setStep(0); setScore(0); setPicked(null); setHasStarted(false); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm">
            <Shuffle size={18} /> Retake Test
          </button>
        )}
      </div>
    );
  }

  const pick = (val: string) => {
    if (picked) return;
    setPicked(val);
    if (val === currentQ.answer) {
      setScore(s => s + 1);
      if (currentQ.audio) playAudio(currentQ.audio);
    } else {
      playErrorBeep();
    }
  };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-3xl mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
        <span>Question {step + 1} of {total}</span>
        <span className="text-amber-600">Score {score}</span>
      </div>
      
      <div className="w-full max-w-3xl flex flex-col items-center gap-6 border border-black/10 bg-stone-50 p-10 shadow-sm mb-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{currentQ.questionText}</span>
        {currentQ.prominentTibetan && (
           <span className="font-serif leading-none text-stone-900" style={{ fontSize: "7rem" }}>{currentQ.prominentTibetan}</span>
        )}
        {currentQ.audio && !currentQ.prominentTibetan && (
          <button onClick={() => playAudio(currentQ.audio)} disabled={playingItem !== null} className="inline-flex items-center gap-2 border border-black/10 bg-white px-6 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors shadow-sm mt-4">
            {playingItem === currentQ.audio ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className="text-amber-500" />} Hear Sound
          </button>
        )}
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQ.choices.map((c: any) => {
          const right = picked && c.value === currentQ.answer;
          const wrong = picked === c.value && c.value !== currentQ.answer;
          return (
            <button
              key={c.value} disabled={!!picked}
              onClick={() => pick(c.value)}
              className={`border p-6 text-center transition-all ${
                right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700" : "border-black/10 bg-white hover:border-amber-400 hover:bg-amber-50 hover:shadow-md"
              }`}
            >
              <div className={`text-xl font-bold ${currentQ.type === 'vocab' ? 'font-serif' : 'font-mono'}`}>{c.label}</div>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="w-full max-w-3xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border border-black/10 bg-white shadow-sm">
          <span className={`text-sm font-bold ${picked === currentQ.answer ? "text-emerald-700" : "text-rose-700"}`}>
            {picked === currentQ.answer ? 'Correct!' : `Incorrect. The right answer was ${currentQ.choices.find((x:any) => x.value === currentQ.answer)?.label}.`}
          </span>
          <button onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 px-8 py-3 text-sm font-bold text-stone-900 hover:bg-amber-400 shadow-sm transition-colors">
            {step + 1 === total ? 'See Results' : 'Next Question'} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}