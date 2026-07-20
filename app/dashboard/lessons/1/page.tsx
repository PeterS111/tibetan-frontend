"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import { 
  ChevronRight, ChevronLeft, Check, Sparkles, Repeat, Ear, Shuffle, 
  Layers, CheckCircle2, BookOpen, Info, PenLine, Moon, Sun, Play, 
  Volume2, Loader2, X, ArrowRight, XCircle, Trophy, Lock
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data & Types                                                        */
/* ------------------------------------------------------------------ */

type Tone = "high-unasp" | "high-asp" | "low-asp" | "low-nasal";
type Gender = "masculine" | "neuter" | "feminine" | "very-feminine" | "sub-feminine";

interface Consonant {
  tib: string;
  translit: string;
  pron: string; 
  tone: Tone;
  gender: Gender;
  note: string;
}

const TONE_META: Record<Tone, { label: string; short: string; swatch: string; ring: string; text: string; description: string }> = {
  "high-unasp": { label: "High tone · Non-aspirated", short: "High · Unaspirated", swatch: "bg-sky-100", ring: "ring-sky-300", text: "text-sky-800", description: "Pronounced high in the voice, with no puff of air. Say the sound cleanly, keeping the pitch bright." },
  "high-asp": { label: "High tone · Strongly aspirated", short: "High · Aspirated", swatch: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800", description: "Pronounced high in the voice with a strong puff of air, as if adding a breathy ‘h’ after the sound." },
  "low-asp": { label: "Low tone · Semi-aspirated", short: "Low · Semi-aspirated", swatch: "bg-violet-100", ring: "ring-violet-300", text: "text-violet-800", description: "Pronounced low in the voice with a light, softened aspiration. The pitch drops and the sound is gentler than its high-tone counterpart." },
  "low-nasal": { label: "Low tone · Nasal", short: "Low · Nasal", swatch: "bg-rose-100", ring: "ring-rose-300", text: "text-rose-800", description: "The four true nasals — ང ཉ ན མ. Voice resonates through the nose, low in pitch, with no puff of air." },
};

const TONE_HEX: Record<Tone, string> = {
  "high-unasp": "#0ea5e9",
  "high-asp": "#f59e0b",
  "low-asp": "#8b5cf6",
  "low-nasal": "#f43f5e",
};

const GENDER_META: Record<Gender, { label: string; tib: string; color: string; tint: string; text: string }> = {
  masculine:       { label: "Masculine",     tib: "ཕོ་",         color: "#dc2626", tint: "rgba(220,38,38,0.08)",  text: "#991b1b" },
  neuter:          { label: "Neuter",        tib: "མ་ནིང་",     color: "#eab308", tint: "rgba(234,179,8,0.14)",  text: "#854d0e" },
  feminine:        { label: "Feminine",      tib: "མོ་",         color: "#0d9488", tint: "rgba(13,148,136,0.08)", text: "#115e59" },
  "very-feminine": { label: "Very Feminine", tib: "ཤིན་ཏུ་མོ་", color: "#a855f7", tint: "rgba(168,85,247,0.08)", text: "#6b21a8" },
  "sub-feminine":  { label: "Sub-Feminine",  tib: "མོ་གཤམ་",   color: "#3b82f6", tint: "rgba(59,130,246,0.08)", text: "#1e40af" },
};

const CONSONANTS: Consonant[] = [
  { tib: "ཀ", translit: "ka",  pron: "[ka]",    tone: "high-unasp", gender: "masculine",     note: "As in English ‘skate’ — high, clean, no puff of air." },
  { tib: "ཁ", translit: "kha", pron: "[kha]",   tone: "high-asp",   gender: "neuter",        note: "Like ‘k’ in ‘kite’ with a strong breathy release." },
  { tib: "ག", translit: "ga",  pron: "[kha]",   tone: "low-asp",    gender: "feminine",      note: "Written ‘ga’; a low semi-aspirated sound, close to a soft ‘kha’." },
  { tib: "ང", translit: "nga", pron: "[nga]",   tone: "low-nasal",  gender: "very-feminine", note: "Nasal ‘ng’ as in ‘sing’, held at the back of the mouth." },
  { tib: "ཅ", translit: "ca",  pron: "[ca]",    tone: "high-unasp", gender: "masculine",     note: "Like ‘ch’ in ‘chip’ but crisper — no aspiration." },
  { tib: "ཆ", translit: "cha", pron: "[chha]",  tone: "high-asp",   gender: "neuter",        note: "Aspirated ‘ch’ — as in ‘cheese’ with a strong puff of air." },
  { tib: "ཇ", translit: "ja",  pron: "[chha]",  tone: "low-asp",    gender: "feminine",      note: "Written ‘ja’; low semi-aspirated, softening toward a gentle ‘chha’." },
  { tib: "ཉ", translit: "nya", pron: "[nya]",   tone: "low-nasal",  gender: "very-feminine", note: "Palatal nasal ‘ny’, as in the Spanish ‘ñ’." },
  { tib: "ཏ", translit: "ta",  pron: "[ta]",    tone: "high-unasp", gender: "masculine",     note: "As in ‘stop’ — dental, unaspirated, high pitch." },
  { tib: "ཐ", translit: "tha", pron: "[tha]",   tone: "high-asp",   gender: "neuter",        note: "Strongly aspirated ‘t’ — a clear breath follows the sound." },
  { tib: "ད", translit: "da",  pron: "[tha]",   tone: "low-asp",    gender: "feminine",      note: "Low-tone ‘da’; a semi-aspirated sound, often heard as a soft ‘tha’." },
  { tib: "ན", translit: "na",  pron: "[na]",    tone: "low-nasal",  gender: "very-feminine", note: "Dental nasal ‘n’, as in English ‘nun’." },
  { tib: "པ", translit: "pa",  pron: "[pa]",    tone: "high-unasp", gender: "masculine",     note: "As in ‘spin’ — unaspirated ‘p’, high pitch." },
  { tib: "ཕ", translit: "pha", pron: "[pha]",   tone: "high-asp",   gender: "neuter",        note: "Aspirated ‘p’, as in ‘pin’ — never like English ‘f’." },
  { tib: "བ", translit: "ba",  pron: "[pha]",   tone: "low-asp",    gender: "feminine",      note: "Low-tone ‘ba’; semi-aspirated, softening toward a light ‘pha’." },
  { tib: "མ", translit: "ma",  pron: "[ma]",    tone: "low-nasal",  gender: "very-feminine", note: "Bilabial nasal ‘m’, as in ‘mother’." },
  { tib: "ཙ", translit: "tsa", pron: "[tsa]",   tone: "high-unasp", gender: "masculine",     note: "Like ‘ts’ in ‘cats’, spoken high and cleanly." },
  { tib: "ཚ", translit: "tsha",pron: "[ts’ha]", tone: "high-asp",   gender: "neuter",        note: "Aspirated ‘ts’ — a puff of air follows the sound." },
  { tib: "ཛ", translit: "dza", pron: "[ts’ha]", tone: "low-asp",    gender: "feminine",      note: "Low ‘dza’; a semi-aspirated sound, heard close to a gentle ‘tsha’." },
  { tib: "ཝ", translit: "wa",  pron: "[wa]",    tone: "low-asp",    gender: "feminine",      note: "As in English ‘water’ — a soft, low ‘w’." },
  { tib: "ཞ", translit: "zha", pron: "[sha]",   tone: "low-asp",    gender: "feminine",      note: "Low-tone ‘zha’, close to a soft ‘sh’ sound." },
  { tib: "ཟ", translit: "za",  pron: "[sa]",    tone: "low-asp",    gender: "feminine",      note: "Low-tone ‘za’, often realised close to a low ‘sa’." },
  { tib: "འ", translit: "'a",  pron: "[ah]",    tone: "low-asp",    gender: "feminine",      note: "A soft glottal ‘a’ — carries the vowel without a hard onset." },
  { tib: "ཡ", translit: "ya",  pron: "[ya]",    tone: "low-asp",    gender: "feminine",      note: "As in ‘yes’ — palatal glide, low pitch." },
  { tib: "ར", translit: "ra",  pron: "[ra]",    tone: "low-asp",    gender: "sub-feminine",  note: "A soft, low ‘r’ — closer to a Spanish ‘r’ than an English one." },
  { tib: "ལ", translit: "la",  pron: "[la]",    tone: "low-asp",    gender: "sub-feminine",  note: "As in ‘look’ — clear, low ‘l’." },
  { tib: "ཤ", translit: "sha", pron: "[shha]",  tone: "high-asp",   gender: "feminine",      note: "Like ‘sh’ in ‘shine’, spoken high in the voice." },
  { tib: "ས", translit: "sa",  pron: "[s’ha]",  tone: "high-asp",   gender: "feminine",      note: "High-tone ‘s’, close to English ‘sun’." },
  { tib: "ཧ", translit: "ha",  pron: "[ha]",    tone: "high-asp",   gender: "sub-feminine",  note: "Aspirated ‘h’, breathy and light." },
  { tib: "ཨ", translit: "a",   pron: "[a]",     tone: "high-unasp", gender: "sub-feminine",  note: "The neutral vowel carrier — a clean ‘a’ with no consonant." },
];

const VOCAB = [
  { tib: "ཁ་བ",   translit: "kha-wa",   en: "snow",       emoji: "❄️" },
  { tib: "ང",     translit: "nga",      en: "I / me",     emoji: "🙋" },
  { tib: "ཇ་མ",   translit: "ja-ma",    en: "cook",       emoji: "👨‍🍳" },
  { tib: "ཉ",     translit: "nya",      en: "fish",       emoji: "🐟" },
  { tib: "ཐ་མ",   translit: "tha-ma",   en: "cigarette",  emoji: "🚬" },
  { tib: "ཨ་མ",   translit: "a-ma",     en: "mother",    emoji: "👩" },
  { tib: "ན་ཚ",   translit: "na-tsha",  en: "illness",    emoji: "🏥" },
  { tib: "ཤ",     translit: "sha",      en: "meat",       emoji: "🍖" },
  { tib: "ཕ་མ",   translit: "pha-ma",   en: "parents",    emoji: "👨‍👩‍👧" },
  { tib: "ཨ་ར",   translit: "a-ra",     en: "beard",      emoji: "🧔" },
  { tib: "ཤ་བ",   translit: "sha-wa",   en: "deer",       emoji: "🦌" },
  { tib: "ཁ",     translit: "kha",      en: "mouth",      emoji: "👄" },
  { tib: "ར",     translit: "ra",       en: "goat",       emoji: "🐐" },
  { tib: "ཇ",     translit: "ja",       en: "tea",        emoji: "🍵" },
  { tib: "ཟ་མ",   translit: "za-ma",    en: "food",       emoji: "🍚" },
  { tib: "ཉ་པ",   translit: "nya-pa",   en: "fisherman",  emoji: "🎣" },
  { tib: "ཁ་ཚ་མ", translit: "kha-tsha-ma", en: "chilli",  emoji: "🌶️" },
  { tib: "ཀ་བ",   translit: "ka-wa",    en: "pillar",     emoji: "🏛️" },
];

const STEPS = [
  { id: "intro", eyebrow: "Introduction", title: "Welcome to the 30 consonants", description: "A short orientation before you meet the letters." },
  { id: "grid", eyebrow: "Step 01", title: "The alphabet, as a type specimen", description: "Tap each letter to hear its sound and see its details." },
  { id: "tone", eyebrow: "Step 02", title: "Understanding tone", description: "The four voice registers that colour every consonant." },
  { id: "roots", eyebrow: "Step 03", title: "The three root sounds", description: "Trace every consonant back to ཨ, ཧ, or འ." },
  { id: "gender", eyebrow: "Step 04", title: "Traditional gender classification", description: "The five effort-based groupings of the alphabet." },
  { id: "vocab", eyebrow: "Step 05", title: "Nouns formed from the 30 consonants", description: "Read and hear real words built from the root letters." },
  { id: "practice", eyebrow: "Step 06", title: "Practice & exercises", description: "Flashcards, listening, matching, and stroke tracing." },
  { id: "complete", eyebrow: "Final test", title: "Lesson test — unlock the next lesson", description: "Score 80% or higher on the final test to unlock The Four Vowels." },
];

/* ------------------------------------------------------------------ */
/* Main Lesson Component                                               */
/* ------------------------------------------------------------------ */

export default function ConsonantsLesson() {
  const { getToken } = useAuth();
  
  const [selected, setSelected] = useState<Consonant | null>(null);
  const [filter, setFilter] = useState<"all" | Tone>("all");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  const [playingItem, setPlayingItem] = useState<string | null>(null);

  // Progressive disclosure state
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [manualExpanded, setManualExpanded] = useState<Set<number>>(new Set());

  const total = STEPS.length;
  const progress = Math.round((completed.size / total) * 100);

  const statusOf = (i: number): "done" | "current" | "upcoming" =>
    completed.has(i) ? "done" : i === currentStep ? "current" : "upcoming";
    
  // Check if a section is strictly opened by the user
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

  const filtered = useMemo(() => (filter === "all" ? CONSONANTS : CONSONANTS.filter((c) => c.tone === filter)), [filter]);

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
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-widest">
          <Link href="/dashboard/lessons" className="hover:text-stone-800 transition-colors">
            My Lessons
          </Link>
          <ChevronRight className="size-3" />
          <span>Unit 01</span>
          <ChevronRight className="size-3" />
          <span className="text-stone-800 font-bold">The 30 Consonants</span>
        </div>

        {/* Hero */}
        <section className="mb-8 grid gap-6 border border-[#e8e4d9] bg-white p-6 md:grid-cols-[1fr,auto] md:items-end md:p-10">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
              Lesson 01 · Foundations
            </div>
            <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl text-stone-900">
              The 30 Tibetan Consonants
            </h1>
            <p className="mt-1 font-serif text-2xl italic text-stone-500">གསལ་བྱེད་སུམ་ཅུ།</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              The Tibetan alphabet is built on thirty root letters — the foundation of every word you
              will read, write, and speak. Move through the lesson one step at a time; every section
              stays available for review whenever you want to jump ahead.
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <span>Lesson progress</span>
              <span className="text-amber-500">
                {completed.size} of {total} sections
              </span>
            </div>
            <div className="h-1.5 w-full bg-stone-200 overflow-hidden">
              <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="border border-[#e8e4d9] p-2 bg-stone-50">
                <div className="font-serif text-2xl text-stone-800">30</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-500">Letters</div>
              </div>
              <div className="border border-[#e8e4d9] p-2 bg-stone-50">
                <div className="font-serif text-2xl text-stone-800">4</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-500">Tones</div>
              </div>
              <div className="border border-[#e8e4d9] p-2 bg-stone-50">
                <div className="font-serif text-2xl text-stone-800">5</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-500">Genders</div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {/* Step 0: Introduction */}
          <StepCard index={0} total={total} step={STEPS[0]} status={statusOf(0)} isExpanded={isExpanded(0)} onToggle={() => toggleStep(0)} onPrev={() => goPrev(0)} onContinue={() => goContinue(0)} isFirst isLast={false} currentStep={currentStep}>
            <div className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
              <div>
                <p className="text-[15px] leading-relaxed text-stone-600">
                  Over the next few steps you'll meet all thirty consonants — first as a full type
                  specimen, then broken down by <span className="text-stone-900 font-bold">tone</span>,{" "}
                  <span className="text-stone-900 font-bold">root sound</span>, and{" "}
                  <span className="text-stone-900 font-bold">traditional gender</span>. Along the way you'll hear each
                  letter, read real vocabulary built from them, and finish with a short practice suite.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-stone-600">
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    Tap any letter card to hear its sound and read the pronunciation notes.
                  </li>
                  <li className="flex items-start gap-3">
                    <Layers className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    Steps unlock as you continue, but you can peek at any section from its header.
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    Completed steps are marked and stay open for review.
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white border border-[#e8e4d9]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">
                  What you'll learn
                </div>
                <ol className="space-y-3 text-sm font-medium text-stone-700">
                  {STEPS.slice(1, -1).map((s, i) => (
                    <li key={s.id} className="flex items-start gap-3">
                      <span className="grid size-6 shrink-0 place-items-center bg-stone-100 text-stone-500 font-bold text-xs border border-stone-200">
                        {i + 1}
                      </span>
                      <span className="mt-0.5">{s.title}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </StepCard>

          {/* Step 1: Type-specimen grid */}
          <StepCard index={1} total={total} step={STEPS[1]} status={statusOf(1)} isExpanded={isExpanded(1)} onToggle={() => toggleStep(1)} onPrev={() => goPrev(1)} onContinue={() => goContinue(1)} isFirst={false} isLast={false} currentStep={currentStep}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(["all", "high-unasp", "high-asp", "low-asp", "low-nasal"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border ${
                      filter === k ? "bg-stone-900 text-white border-stone-900" : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {k === "all" ? `All ${CONSONANTS.length}` : TONE_META[k].short}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))}
                className="inline-flex items-center gap-2 border border-stone-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 transition hover:bg-stone-50"
              >
                {studyMode === "paper" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </button>
            </div>

            <div className={`relative overflow-hidden border p-3 sm:p-5 transition-colors duration-500 ${studyMode === "night" ? "border-white/5 bg-[#0f0d0a]" : "border-[#e8e4d9] bg-gradient-to-br from-stone-50 to-white"}`}>
              <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-[0.06] ${studyMode === "night" ? "opacity-[0.08]" : ""}`} style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "48px 48px", color: studyMode === "night" ? "#FFB600" : "#1c1917" }} />

              <div className="relative grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6">
                {filtered.map((c, i) => (
                  <button
                    key={c.tib + c.translit}
                    onClick={() => { setSelected(c); playAudio(c.tib); }}
                    className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-stone-200 bg-white hover:border-amber-300 hover:shadow-md"}`}
                  >
                    <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: TONE_HEX[c.tone] }} />
                    <span className={`flex flex-1 items-center justify-center font-serif leading-none transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-stone-900"}`} style={{ fontSize: "clamp(2.25rem, 6vw, 3.25rem)" }}>
                      {c.tib}
                    </span>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${studyMode === "night" ? "text-white/80" : "text-stone-800"}`}>{c.translit}</span>
                        <span className={`text-[9px] font-medium tracking-widest ${studyMode === "night" ? "text-white/40" : "text-stone-400"}`}>{c.pron}</span>
                      </div>
                    </div>
                    {playingItem === c.tib && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-[11px] font-bold text-stone-500">
              <span className="uppercase tracking-widest">Legend</span>
              {(Object.keys(TONE_HEX) as Tone[]).map((t) => (
                <div key={t} className="inline-flex items-center gap-2">
                  <span className="h-2 w-4" style={{ backgroundColor: TONE_HEX[t] }} />
                  <span>{TONE_META[t].short}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
               <QuizModule title="Mastery check · the 30 letters" intro="Before you move on, make sure each letter's sound is sticking. Take this short check as many times as you like." data={CONSONANTS} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={8} isUnlockTest={false} />
            </div>
          </StepCard>

          {/* Step 2: Tone */}
          <StepCard index={2} total={total} step={STEPS[2]} status={statusOf(2)} isExpanded={isExpanded(2)} onToggle={() => toggleStep(2)} onPrev={() => goPrev(2)} onContinue={() => goContinue(2)} isFirst={false} isLast={false} currentStep={currentStep}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {(Object.keys(TONE_META) as Tone[]).map((t) => {
                const m = TONE_META[t];
                const count = CONSONANTS.filter((c) => c.tone === t).length;
                return (
                  <div key={t} className={`p-6 border bg-white ${m.ring}`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border ${m.swatch} ${m.text}`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{m.short}</span>
                    </div>
                    <div className="mt-6 font-serif font-bold text-3xl text-stone-900">{count} letters</div>
                    <p className="mt-3 text-[13px] leading-relaxed text-stone-600 h-20">{m.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {CONSONANTS.filter((c) => c.tone === t).map((c) => (
                        <button key={c.tib} onClick={() => { setSelected(c); playAudio(c.tib); }} className="border border-stone-200 bg-stone-50 px-3 py-1.5 font-serif text-xl hover:border-amber-300 hover:bg-white transition-colors text-stone-800">
                          {c.tib}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-4 p-5 bg-[#fcfaf5] border border-stone-200">
              <Info className="mt-0.5 size-5 shrink-0 text-amber-500" />
              <div className="text-sm font-medium leading-relaxed text-stone-600">
                The lines drawn above and below the transliteration in traditional Tibetan textbooks
                indicate <span className="font-bold text-stone-900">high tone</span> and{" "}
                <span className="font-bold text-stone-900">low tone</span> respectively. Pay close attention
                to your teacher's pronunciation, and repeat each consonant the same way it is spoken.
              </div>
            </div>
          </StepCard>

          {/* Step 3: Three root sounds */}
          <StepCard index={3} total={total} step={STEPS[3]} status={statusOf(3)} isExpanded={isExpanded(3)} onToggle={() => toggleStep(3)} onPrev={() => goPrev(3)} onContinue={() => goContinue(3)} isFirst={false} isLast={false} currentStep={currentStep}>
            <p className="mb-8 max-w-3xl text-[15px] text-stone-600 leading-relaxed">
              Traditional Tibetan phonology traces every consonant back to one of three <em>root sounds</em> —
              seed syllables that anchor a whole tone family. Learn these three, and the rest of the
              alphabet becomes a family tree rather than a list.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { tib: "ཨ", translit: "a", label: "Neutral root · High register", swatch: "bg-sky-100", ring: "ring-sky-300", text: "text-sky-800", members: "ཨ ཀ ཅ ཏ པ ཙ", description: "The neutral vowel carrier — a clean ‘a’ with no consonantal onset. As a root sound, ཨ anchors the plain, unaspirated stops (ཀ ཅ ཏ པ ཙ) together with itself, giving them their basic, unbreathed voice." },
                { tib: "ཧ", translit: "ha", label: "Aspirated root · Breath", swatch: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800", members: "ཁ ཆ ཐ ཕ ཚ ཧ ཤ ས", description: "The breath root — a light, aspirated ‘h’. It anchors the aspirated stops and fricatives (ཁ ཆ ཐ ཕ ཚ ཤ ས) along with ཧ itself, where the sound is shaped by the flow of air." },
                { tib: "འ", translit: "'a", label: "Glottal root · Voiced flow", swatch: "bg-rose-100", ring: "ring-rose-300", text: "text-rose-800", members: "ག ཇ ད བ ཛ ཞ ཟ འ ཡ ར ལ ང ཉ ན མ", description: "The glottal root — a soft, voiced ‘a’ that carries the vowel without a hard onset. It anchors the low-register letters: the semi-aspirated voiced stops (ག ཇ ད བ ཛ), the glides and liquids (ཞ ཟ ཡ ར ལ འ), and the nasals (ང ཉ ན མ)." },
              ].map((r) => (
                <div key={r.tib} className={`p-8 bg-white border ${r.ring} flex flex-col`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 w-fit border ${r.swatch} ${r.text}`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{r.label}</span>
                  </div>
                  <button onClick={() => playAudio(r.tib)} className="mt-8 flex items-baseline gap-4 w-fit hover:opacity-70 transition-opacity">
                    <span className="font-serif text-7xl leading-none text-stone-900">{r.tib}</span>
                    <span className="font-serif text-3xl italic text-stone-400">{r.translit}</span>
                  </button>
                  <p className="mt-6 text-sm leading-relaxed text-stone-600 flex-1">{r.description}</p>
                  <div className="mt-6 border-t border-stone-100 pt-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Family</div>
                    <div className="font-serif text-xl tracking-[0.2em] text-stone-800">{r.members}</div>
                  </div>
                </div>
              ))}
            </div>
          </StepCard>

          {/* Step 4: Gender */}
          <StepCard index={4} total={total} step={STEPS[4]} status={statusOf(4)} isExpanded={isExpanded(4)} onToggle={() => toggleStep(4)} onPrev={() => goPrev(4)} onContinue={() => goContinue(4)} isFirst={false} isLast={false} currentStep={currentStep}>
            <p className="mb-6 max-w-3xl text-[15px] text-stone-600 leading-relaxed">
              The thirty consonants are traditionally divided into five gender groups depending on how
              much effort is required for their pronunciation.
            </p>

            <div className="overflow-hidden border border-[#e8e4d9]">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-500 border-b border-[#e8e4d9]">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Gender</th>
                    <th className="px-6 py-4 text-left font-bold">Tibetan</th>
                    <th className="px-6 py-4 text-left font-bold">Consonants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {(Object.keys(GENDER_META) as Gender[]).map((g) => {
                    const letters = CONSONANTS.filter((c) => c.gender === g);
                    const gm = GENDER_META[g];
                    return (
                      <tr key={g} style={{ backgroundColor: gm.tint }}>
                        <td className="px-6 py-5 font-bold" style={{ borderLeft: `4px solid ${gm.color}` }}>
                          <span className="inline-flex items-center gap-3" style={{ color: gm.text }}>
                            <span className="size-3 rounded-full" style={{ backgroundColor: gm.color }} />
                            {gm.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-serif text-2xl text-stone-800">{gm.tib}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {letters.map((c) => (
                              <button key={c.tib} onClick={() => { setSelected(c); playAudio(c.tib); }} className="border bg-white px-3.5 py-1.5 font-serif text-2xl transition hover:-translate-y-0.5 shadow-sm" style={{ borderColor: gm.color + "55", color: gm.text }} title={c.translit}>
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
          </StepCard>

          {/* Step 5: Vocabulary */}
          <StepCard index={5} total={total} step={STEPS[5]} status={statusOf(5)} isExpanded={isExpanded(5)} onToggle={() => toggleStep(5)} onPrev={() => goPrev(5)} onContinue={() => goContinue(5)} isFirst={false} isLast={false} currentStep={currentStep}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <p className="text-[15px] text-stone-600">Real words formed entirely from the root letters.</p>
              <div className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold uppercase tracking-widest shrink-0">
                Vocabulary · མིང་ཚིག
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {VOCAB.map((v) => (
                <div key={v.tib + v.translit} className="bg-white border border-[#e8e4d9] flex flex-col p-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md relative group">
                  <div className="text-3xl mb-4">{v.emoji}</div>
                  <div className="font-serif font-bold text-3xl leading-tight text-stone-900 mb-1">{v.tib}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">{v.translit}</div>
                  <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-auto">
                    <span className="text-sm font-bold text-stone-700">{v.en}</span>
                    <button onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="grid size-8 place-items-center bg-stone-100 border border-stone-200 text-stone-600 transition hover:bg-stone-200">
                      {playingItem === v.tib ? <Loader2 className="size-4 animate-spin text-amber-500" /> : <Volume2 className="size-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </StepCard>

          {/* Step 6: Practice */}
          <StepCard index={6} total={total} step={STEPS[6]} status={statusOf(6)} isExpanded={isExpanded(6)} onToggle={() => toggleStep(6)} onPrev={() => goPrev(6)} onContinue={() => goContinue(6)} isFirst={false} isLast={false} currentStep={currentStep}>
            <PracticeArea speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepCard>

          {/* Step 7: Complete (Final Test) */}
          <StepCard index={7} total={total} step={STEPS[7]} status={statusOf(7)} isExpanded={isExpanded(7)} onToggle={() => toggleStep(7)} onPrev={() => goPrev(7)} onContinue={() => goContinue(7)} isFirst={false} isLast currentStep={currentStep}>
            <QuizModule title="Final Lesson Test" intro="Score 80% or higher to unlock the next lesson: The Four Vowels." data={CONSONANTS} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={10} isUnlockTest={true} />
          </StepCard>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && <DetailPanel c={selected} onClose={() => setSelected(null)} onSpeak={playAudio} playingItem={playingItem} />}

      {/* Sticky Footer */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-[#fdfbf7] border-t border-stone-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} /> Syllabus
          </Link>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold transition-colors border border-amber-600">
            <CheckCircle2 size={18} /> Mark lesson complete
          </button>
          <Link href="/dashboard/lessons/2" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-800 hover:text-amber-600 transition-colors">
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

function StepCard({ index, total, step, status, isExpanded, onToggle, onPrev, onContinue, isFirst, isLast, currentStep, children }: any) {
  const badge = status === "done" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : status === "current" ? "bg-[#fffdf5] text-amber-700 border-amber-300" : "bg-stone-50 text-stone-400 border-stone-200";
  
  // Disable opening upcoming sections if DEV_BYPASS_LOCKS is false
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
            <button type="button" onClick={onContinue} className="inline-flex items-center justify-center gap-2 bg-amber-500 px-8 py-3 text-sm font-bold text-stone-900 transition hover:bg-amber-400 border border-amber-600">
              {status === "done" ? isLast ? "Finish" : "Next section" : isLast ? "Complete lesson" : "Mark complete & continue"}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function PracticeArea({ speak, playingItem, playErrorBeep }: any) {
  const [tab, setTab] = useState<"flashcards" | "trace" | "listen" | "match" | "review">("flashcards");
  const tabs = [
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "trace", label: "Trace", icon: PenLine },
    { id: "listen", label: "Listen & Select", icon: Ear },
    { id: "match", label: "Match", icon: Shuffle },
    { id: "review", label: "Memory Review", icon: Repeat },
  ];

  return (
    <div className="border border-stone-200 bg-[#fcfaf5]">
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
        {tab === "flashcards" && <Flashcards speak={speak} playingItem={playingItem} />}
        {tab === "trace" && <div className="flex flex-col items-center justify-center h-full pt-12"><PenLine size={48} className="text-stone-300 mb-4"/><p className="text-stone-500 font-bold text-lg">Trace exercises are currently under development.</p></div>}
        {tab === "listen" && <ListenSelect speak={speak} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
        {tab === "match" && <MatchExercise speak={speak} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
        {tab === "review" && <MemoryReview speak={speak} playingItem={playingItem} />}
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
    // Generate questions dynamically
    const isAudioType = Math.random() > 0.5; // 50% chance of "Listen and select" vs "Which letter reads..."
    const answer = data[Math.floor(Math.random() * data.length)];
    const wrongs = data.filter((x: any) => x.tib !== answer.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [answer, ...wrongs].sort(() => 0.5 - Math.random());
    return { isAudioType, answer, choices };
  }, [step, data]);

  if (!hasStarted) {
    return (
      <div className="border border-stone-200 bg-white p-6 md:p-8">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Trophy className="size-3.5" /> Final Test
        </div>
        <h3 className="text-2xl font-serif text-stone-900 mb-2">Ready to unlock the next lesson?</h3>
        <p className="text-sm text-stone-600 mb-6">
          {questionCount} questions drawn from everything you covered in this lesson. Score <span className="font-bold">80%</span> or higher to pass. You can retake the test as many times as you like — your best score is saved.
        </p>
        <button 
          onClick={() => setHasStarted(true)} 
          className="bg-amber-500 text-stone-900 font-bold px-6 py-2.5 flex items-center gap-2 hover:bg-amber-400 transition-colors mb-8 border border-amber-600"
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
      <div className={`flex flex-col items-center justify-center text-center p-8 border ${isUnlockTest ? 'bg-white border-stone-200' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
        <div className={`w-20 h-20 flex items-center justify-center mb-6 border ${passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
          {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">{passed ? "Test Passed!" : "Keep Practicing"}</h3>
        <p className="text-stone-600 mb-8 font-bold text-lg">You scored <span className={passed ? "text-emerald-600" : "text-rose-600"}>{score}</span> out of {questionCount}.</p>
        
        <div className="flex gap-4">
          <button onClick={() => { setStep(0); setScore(0); setPicked(null); }} className="px-6 py-3 bg-white border border-stone-200 font-bold hover:bg-stone-50 transition-colors text-stone-700 flex items-center gap-2">
            <Shuffle size={18} /> Retake Test
          </button>
          {passed && isUnlockTest && (
            <button className="px-8 py-3 bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors flex items-center gap-2 border border-amber-600">
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
            question.isAudioType ? (
              <span className="text-xl text-stone-800">Listen and select the matching consonant.</span>
            ) : (
              <span className="text-xl text-stone-800">Which letter reads <span className="font-mono bg-stone-100 px-2 py-0.5 border border-stone-200">[{question.answer.pron}]</span>?</span>
            )
          )}
        </div>
        
        {/* Play Hint Button for Phonetic matching OR Audio matching */}
        {(!isVocabMatch) && (
          <button onClick={() => playAudio(question.answer.tib)} disabled={playingItem !== null} className={`inline-flex items-center justify-center gap-2 border px-5 py-2 font-bold transition-colors shrink-0 ${question.isAudioType ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}>
             {playingItem === question.answer.tib ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} 
             {question.isAudioType ? "PLAY AUDIO" : "Play Hint"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {question.choices.map((c: any) => {
          const isRight = picked && c.tib === question.answer.tib;
          const isWrong = picked === c.tib && c.tib !== question.answer.tib;
          
          let stateClass = "bg-white border-stone-200 hover:border-amber-400 text-stone-900";
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
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border bg-stone-50 border-stone-200">
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

function Flashcards({ speak, playingItem }: any) {
  const [mode, setMode] = useState<"consonants" | "nouns">("consonants");
  const deck = useMemo(() => mode === "consonants" ? CONSONANTS : VOCAB, [mode]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = deck[idx % deck.length] as any;
  const front = mode === "consonants" ? card.tib : card.tib;
  const translit = card.translit;

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % deck.length); };
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + deck.length) % deck.length); };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center mb-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest gap-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setMode("consonants"); setIdx(0); setFlipped(false); }} className={`px-4 py-2 transition-all border ${mode === "consonants" ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"}`}>Consonants · 30</button>
          <button onClick={() => { setMode("nouns"); setIdx(0); setFlipped(false); }} className={`px-4 py-2 transition-all border ${mode === "nouns" ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"}`}>Nouns · {VOCAB.length}</button>
        </div>
        <span>Card {(idx % deck.length) + 1} of {deck.length}</span>
      </div>

      <div onClick={() => setFlipped(!flipped)} className="w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-stone-200 transition-all cursor-pointer flex flex-col items-center justify-center relative group overflow-hidden">
        {!flipped ? (
          <div className="flex flex-col items-center gap-4">
            {mode === "nouns" && <span className="text-6xl">{card.emoji}</span>}
            <div className="text-[6rem] md:text-[8rem] font-serif text-stone-900 group-hover:scale-105 transition-transform leading-none">{front}</div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 p-6">
            <div className="text-4xl font-serif italic text-stone-600 mb-4">{translit}</div>
            {mode === "consonants" ? (
              <>
                <div className="font-mono text-2xl text-stone-800 font-bold mb-2">{card.pron}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-stone-400">{TONE_META[card.tone as Tone].short}</div>
              </>
            ) : (
              <div className="text-2xl font-bold text-stone-900">{card.en}</div>
            )}
          </div>
        )}
        <div className="absolute bottom-4 right-6 text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:text-stone-400">Tap card to flip</div>
      </div>

      <div className="w-full max-w-2xl flex items-center justify-between mt-8">
        <button onClick={prev} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800"><ChevronLeft size={16} /> Previous</button>
        <button onClick={() => speak(mode === 'consonants' ? card.tib : card.tib)} disabled={playingItem !== null} className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold border border-amber-600">
          {playingItem ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />} Play sound
        </button>
        <button onClick={next} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800">Next <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function ListenSelect({ speak, playingItem, playErrorBeep }: any) {
  const [seed, setSeed] = useState(0);
  const { answer, choices } = useMemo(() => {
    const shuffled = [...CONSONANTS].sort(() => Math.random() - 0.5);
    const answer = shuffled[0];
    const distractors = shuffled.slice(1, 4);
    const choices = [answer, ...distractors].sort(() => Math.random() - 0.5);
    return { answer, choices };
  }, [seed]);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm font-medium text-stone-500 mb-8 self-start w-full max-w-4xl">Listen to the sound and choose the correct consonant.</p>
      <button onClick={() => speak(answer.tib)} disabled={playingItem !== null} className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 font-bold flex items-center gap-3 mb-12 transition-colors">
        {playingItem === answer.tib ? <Loader2 size={20} className="animate-spin text-amber-500" /> : <Volume2 size={20} className="text-amber-500"/>} PLAY SOUND
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {choices.map((c) => {
          const isSelected = picked === c.translit;
          const isCorrect = answer.translit === c.translit;
          return (
            <button key={c.tib + c.translit} onClick={() => { if (!picked) { setPicked(c.translit); if (isCorrect) speak(c.tib); else playErrorBeep(); } }} disabled={picked !== null} className={`relative py-8 px-4 flex flex-col items-center justify-center border transition-all ${isSelected && isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700" : isSelected && !isCorrect ? "border-rose-500 bg-rose-50 text-rose-700" : picked && isCorrect ? "border-emerald-300 border-dashed bg-emerald-50/50 text-emerald-600" : picked ? "border-stone-100 opacity-50 bg-stone-50 cursor-default" : "border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-300"}`}>
              <span className="font-serif text-[4rem] md:text-[5rem] leading-none">{c.tib}</span>
              {picked && <span className="absolute bottom-4 text-[10px] font-bold uppercase tracking-widest">{c.translit}</span>}
              {isSelected && isCorrect && <CheckCircle2 size={20} className="absolute top-3 right-3 text-emerald-500 animate-in zoom-in" />}
              {isSelected && !isCorrect && <XCircle size={20} className="absolute top-3 right-3 text-rose-500 animate-in zoom-in" />}
            </button>
          )
        })}
      </div>
      {picked && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setPicked(null); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 border border-amber-600 transition-colors flex items-center gap-2">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MatchExercise({ speak, playingItem, playErrorBeep }: any) {
  const [seed, setSeed] = useState(0);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  
  const questions = useMemo(() => {
    const targets = [...CONSONANTS].sort(() => Math.random() - 0.5).slice(0, 6);
    return targets.map(target => {
      const distractors = CONSONANTS.filter(i => i.tib !== target.tib).sort(() => Math.random() - 0.5).slice(0, 2);
      return { target, options: [target, ...distractors].sort(() => Math.random() - 0.5) };
    });
  }, [seed]);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm font-medium text-stone-500 mb-8 self-start w-full max-w-4xl">Match each Tibetan consonant with its pronunciation.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {questions.map((q, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-stone-200 gap-4 sm:gap-2">
            <div className="text-4xl font-serif text-stone-900 sm:ml-4 text-center sm:text-left">{q.target.tib}</div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto sm:mr-2">
              {q.options.map(opt => {
                const isSelected = matchAnswers[q.target.tib] === opt.translit;
                const isCorrect = q.target.translit === opt.translit;
                const isAnswered = !!matchAnswers[q.target.tib];
                let btnClass = "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 cursor-pointer font-mono";
                if (isAnswered) {
                  if (isCorrect) { btnClass = isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-mono" : "border-emerald-400 border-dashed bg-emerald-50/50 text-emerald-600 font-mono"; } 
                  else { btnClass = isSelected ? "border-rose-500 bg-rose-50 text-rose-700 cursor-default font-mono" : "border-stone-100 bg-stone-50 text-stone-300 opacity-50 cursor-default font-mono"; }
                }
                return (
                  <button key={opt.tib + opt.translit} onClick={() => { if(!isAnswered){ setMatchAnswers(p => ({ ...p, [q.target.tib]: opt.translit })); if(isCorrect) speak(opt.tib); else playErrorBeep(); } else if (isCorrect) { speak(opt.tib); } }} disabled={playingItem !== null || (isAnswered && !isCorrect)} className={`relative px-4 py-2 text-[13px] font-bold border transition-all flex items-center justify-center min-w-[5rem] text-center ${btnClass}`}>
                    {playingItem === opt.tib && isCorrect ? <Loader2 size={14} className="animate-spin absolute" /> : opt.translit}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {Object.keys(matchAnswers).length === questions.length && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setMatchAnswers({}); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 border border-amber-600 transition-colors flex items-center gap-2">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MemoryReview({ speak, playingItem }: any) {
  const [deck, setDeck] = useState(() => [...CONSONANTS].sort(() => Math.random() - 0.5));
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
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-200"><CheckCircle2 size={40} /></div>
      <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Deck Complete!</h3>
      <p className="text-stone-500 font-medium mb-8">You have successfully mastered all cards.</p>
      <button onClick={() => { setDeck([...CONSONANTS].sort(() => Math.random() - 0.5)); setReviewedCount(0); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2"><Repeat size={18} /> Review Again</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-stone-200 pb-4">
          <span>Spaced repetition · rate your recall</span><span>{reviewedCount} reviewed</span>
        </div>
        <div className="bg-white border border-stone-200 p-8 sm:p-16 flex flex-col items-center justify-center mb-6 min-h-[300px] relative overflow-hidden">
          <div className="text-[7rem] md:text-[9rem] font-serif text-stone-900 mb-8 leading-none text-center">{deck[0].tib}</div>
          <button onClick={() => speak(deck[0].tib)} disabled={playingItem !== null} className="flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors text-sm border border-stone-200">
            {playingItem === deck[0].tib ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} Check Sound
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button onClick={() => setRating('Hard')} className={`py-4 border font-bold text-sm transition-all ${rating === 'Hard' ? 'bg-rose-100 border-rose-400 text-rose-800' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}>Hard</button>
          <button onClick={() => setRating('Good')} className={`py-4 border font-bold text-sm transition-all ${rating === 'Good' ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>Good</button>
          <button onClick={() => setRating('Easy')} className={`py-4 border font-bold text-sm transition-all ${rating === 'Easy' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>Easy</button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14} /> Cards you mark Hard return soon.</p>
          <button onClick={nextCard} disabled={!rating} className={`flex items-center justify-center gap-2 px-8 py-3.5 font-bold border border-amber-600 transition-colors w-full sm:w-auto ${rating ? 'bg-amber-500 hover:bg-amber-400 text-stone-900' : 'bg-stone-200 text-stone-400 border-transparent cursor-not-allowed'}`}>Next Card <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ c, onClose, onSpeak, playingItem }: any) {
  const tone = TONE_META[c.tone as Tone];
  const gender = GENDER_META[c.gender as Gender];
  
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#fdfbf7] h-full shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300 border-l border-[#e8e4d9]">
        <div className="px-6 py-4 border-b border-[#e8e4d9] flex items-center justify-between bg-white">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Consonant · {c.translit}</span>
          <button onClick={onClose} className="p-2 -mr-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="text-[8rem] font-serif text-stone-900 leading-none mb-6">{c.tib}</div>
            <div className="flex items-center gap-3">
              <div className="text-xl font-serif italic text-stone-800">{c.translit}</div>
              <div className="text-xl font-mono font-medium text-stone-400">{c.pron}</div>
              <button onClick={() => onSpeak(c.tib)} disabled={playingItem !== null} className="w-8 h-8 bg-amber-500 hover:bg-amber-400 text-stone-900 flex items-center justify-center transition-colors">
                {playingItem === c.tib ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className={`p-4 border ${tone.swatch} border-opacity-50`}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Tone</div>
              <div className={`font-serif text-lg ${tone.text}`}>{tone.short}</div>
            </div>
            
            <div className="p-4 border bg-white" style={{ borderColor: gender.color + '40', backgroundColor: gender.tint }}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Gender</div>
              <div className="font-serif text-lg flex items-center gap-2" style={{ color: gender.text }}>
                <div className="w-2 h-2" style={{ backgroundColor: gender.color }}></div>
                {gender.label}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Pronunciation</div>
            <p className="text-sm text-stone-700 leading-relaxed">{tone.description}</p>
          </div>

          <div className="mb-8 border-t border-stone-200 pt-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Notes from the textbook</div>
            <p className="text-sm text-stone-600 leading-relaxed italic bg-white p-4 border border-stone-200">{c.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}