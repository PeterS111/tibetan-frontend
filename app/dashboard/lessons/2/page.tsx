"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import { 
  ChevronRight, ChevronLeft, Check, Sparkles, Repeat, Ear, Shuffle, 
  Layers, CheckCircle2, BookOpen, Info, PenLine, Moon, Sun, Play, 
  Volume2, Loader2, X, ArrowRight, XCircle, ArrowUp, ArrowDown, Trophy, Lock
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data & Types                                                        */
/* ------------------------------------------------------------------ */

type VowelKey = "i" | "u" | "e" | "o";
type Position = "above" | "below";

interface Vowel {
  key: VowelKey;
  tib: string;
  mark: string;
  translit: string;
  markTib: string;
  markTranslit: string;
  markGloss: string;
  position: Position;
  english: string;
  examples: string[];
  note: string;
}

const POSITION_META: Record<Position, { label: string; swatch: string; ring: string; text: string; hex: string }> = {
  above: { label: "Written above the letter", swatch: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800", hex: "#f59e0b" },
  below: { label: "Written below the letter", swatch: "bg-sky-100", ring: "ring-sky-300", text: "text-sky-800", hex: "#0ea5e9" },
};

const VOWELS: Vowel[] = [
  { key: "i", tib: "ཨི", mark: "ི", translit: "I", markTib: "གི་གུ", markTranslit: "gi-gu", markGloss: "[khi khu]", position: "above", english: "As in “peer”, “real”, “ear”.", examples: ["མི", "རི", "ཤི"], note: "A small hook drawn above the root letter. Front, close vowel — spread the lips slightly as in English ‘ee’." },
  { key: "u", tib: "ཨུ", mark: "ུ", translit: "U", markTib: "ཞབས་ཀྱུ", markTranslit: "shab-kyu", markGloss: "[shab kyu / tyu]", position: "below", english: "As in “bush”, “push”, “put”.", examples: ["སུ", "ཆུ", "ཕུ"], note: "A small curl drawn beneath the root letter. Back, close-rounded vowel — round the lips as in English ‘oo’ in ‘put’." },
  { key: "e", tib: "ཨེ", mark: "ེ", translit: "E", markTib: "འགྲེང་བུ", markTranslit: "'dreng-bu", markGloss: "[ng’dreng po]", position: "above", english: "As in “pay”, “say”, “may”.", examples: ["མེ", "སེ", "ཏེ"], note: "A short slanted stroke drawn above the root letter. Front, mid vowel — brighter and higher than English ‘e’ in ‘bed’." },
  { key: "o", tib: "ཨོ", mark: "ོ", translit: "O", markTib: "ན་རོ", markTranslit: "na-ro", markGloss: "[na ro]", position: "above", english: "As in “more”, “door”, “orange”.", examples: ["མོ", "ཇོ", "ཤོ"], note: "A small circle drawn above the root letter. Back, mid-rounded vowel — round the lips as in English ‘oh’." },
];

const VOCAB = [
  { tib: "མི",     translit: "mi",       en: "people",         emoji: "🧑‍🤝‍🧑", vowel: "i" },
  { tib: "སུ",     translit: "su",       en: "who",            emoji: "❓",       vowel: "u" },
  { tib: "སོ",     translit: "so",       en: "teeth",          emoji: "😁",       vowel: "o" },
  { tib: "ཆུ",     translit: "chu",      en: "water",          emoji: "💧",       vowel: "u" },
  { tib: "མེ",     translit: "me",       en: "fire",           emoji: "🔥",       vowel: "e" },
  { tib: "ཕོ",     translit: "pho",      en: "male",           emoji: "🧑",       vowel: "o" },
  { tib: "ཉི་ཤུ",  translit: "nyi-shu",  en: "twenty",         emoji: "🔢",       vowel: "u" },
  { tib: "རི་མོ",  translit: "ri-mo",    en: "drawing",        emoji: "🎨",       vowel: "i" },
  { tib: "འོ་མ",   translit: "o-ma",     en: "milk",           emoji: "🥛",       vowel: "o" },
  { tib: "ཤུ་གུ",  translit: "shu-gu",   en: "paper",          emoji: "📄",       vowel: "u" },
  { tib: "ཀུ་ཤུ",  translit: "ku-shu",   en: "apple",          emoji: "🍎",       vowel: "u" },
  { tib: "ཉི་མ",   translit: "nyi-ma",   en: "sun",            emoji: "☀️",       vowel: "i" },
  { tib: "མོ",     translit: "mo",       en: "she / female",   emoji: "👩",       vowel: "o" },
  { tib: "ཞོ",     translit: "zho",      en: "yoghurt",        emoji: "🥣",       vowel: "o" },
  { tib: "ཙི་ཙི",  translit: "tsi-tsi",  en: "mouse",          emoji: "🐭",       vowel: "i" },
  { tib: "ཇོ་ཇོ",  translit: "jo-jo",    en: "elder brother",  emoji: "👦",       vowel: "o" },
];

const STEPS = [
  { id: "grid", eyebrow: "Step 01", title: "The four vowels, as a type specimen", description: "Tap each mark to hear and inspect it." },
  { id: "pronunciation", eyebrow: "Step 02", title: "Pronouncing the four vowels", description: "Map each vowel to a familiar English sound." },
  { id: "marks", eyebrow: "Step 03", title: "The four diacritic marks", description: "Names, positions, and how each mark is written." },
  { id: "spelling", eyebrow: "Step 04", title: "Spelling — root letter + vowel mark", description: "Combine any consonant with the four vowel marks." },
  { id: "vocab", eyebrow: "Step 05", title: "Nouns formed with the four vowels", description: "Read and hear real words using vowels only." },
  { id: "practice", eyebrow: "Step 06", title: "Practice & exercises", description: "Flashcards, listening, matching, and tracing." },
  { id: "complete", eyebrow: "Final test", title: "Lesson test — unlock the next lesson", description: "Score 80% or higher to unlock Superscripts." },
];

/* ------------------------------------------------------------------ */
/* Main Lesson Component                                               */
/* ------------------------------------------------------------------ */

export default function VowelsLesson() {
  const { getToken } = useAuth();
  
  const [selected, setSelected] = useState<Vowel | null>(null);
  const [filter, setFilter] = useState<"all" | Position>("all");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  const [playingItem, setPlayingItem] = useState<string | null>(null);

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

  const filtered = useMemo(() => (filter === "all" ? VOWELS : VOWELS.filter((v) => v.position === filter)), [filter]);

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
          <span>Unit 02</span>
          <ChevronRight className="size-3" />
          <span className="text-stone-800 font-bold">The Four Vowels</span>
        </div>

        {/* Hero */}
        <section className="mb-8 grid gap-6 border border-[#e8e4d9] bg-white shadow-sm p-6 md:grid-cols-[1fr,auto] md:items-end md:p-10">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
              Lesson 02 · Foundations
            </div>
            <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl text-stone-900">
              The Four Vowels
            </h1>
            <p className="mt-1 font-serif text-2xl italic text-stone-500">དབྱངས་བཞི།</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              Every Tibetan syllable is voiced through a vowel. Just four diacritic marks — three
              above the letter and one below — turn the thirty consonants into the full range of
              spoken sound. Learn each mark's shape, position, and pronunciation, then practise
              spelling and reading with vocabulary built from these vowels alone.
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
                <div className="font-serif text-2xl text-stone-800">4</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-500">Vowels</div>
              </div>
              <div className="border border-[#e8e4d9] p-2 bg-stone-50">
                <div className="font-serif text-2xl text-stone-800">3</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-500">Above</div>
              </div>
              <div className="border border-[#e8e4d9] p-2 bg-stone-50">
                <div className="font-serif text-2xl text-stone-800">1</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-500">Below</div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {/* Step 0: Grid */}
          <StepCard index={0} total={total} step={STEPS[0]} status={statusOf(0)} isExpanded={isExpanded(0)} onToggle={() => toggleStep(0)} onPrev={() => goPrev(0)} onContinue={() => goContinue(0)} isFirst isLast={false} currentStep={currentStep}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(["all", "above", "below"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border ${
                      filter === k ? "bg-stone-900 text-white border-stone-900" : "bg-white border-stone-200 text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {k === "all" ? `All ${VOWELS.length}` : POSITION_META[k].label}
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

              {/* Top Row: Standalone Marks */}
              <div className="relative mb-2 grid grid-cols-2 gap-2 sm:mb-3 sm:gap-3 md:grid-cols-4">
                {filtered.map((v, i) => (
                  <button
                    key={`mark-${v.key}`}
                    onClick={() => playAudio(v.markTranslit)}
                    className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-stone-200 bg-white hover:border-amber-300 hover:shadow-md"}`}
                  >
                    <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                    <span className={`flex flex-1 items-center justify-center font-serif leading-none transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-stone-900"}`} style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>
                      {"\u25CC" + v.mark}
                    </span>
                    {playingItem === v.markTranslit && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-amber-500" />}
                  </button>
                ))}
              </div>

              {/* Bottom Row: Carrier + Mark */}
              <div className="relative grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
                {filtered.map((v, i) => (
                  <button
                    key={v.key}
                    onClick={() => { setSelected(v); playAudio(v.tib); }}
                    className={`group relative flex aspect-square flex-col overflow-hidden border p-3 text-left transition-all duration-300 hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-stone-200 bg-white hover:border-amber-300 hover:shadow-md"}`}
                  >
                    <span className="absolute inset-x-0 top-0 h-[4px] transition-all duration-300 group-hover:h-[6px]" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                    <span className={`flex flex-1 items-center justify-center font-serif leading-none transition-transform duration-500 group-hover:scale-[1.1] ${studyMode === "night" ? "text-amber-500" : "text-stone-900"}`} style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)" }}>
                      {v.tib}
                    </span>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${studyMode === "night" ? "text-white/80" : "text-stone-800"}`}>{v.translit}</span>
                        <span className={`text-[9px] font-medium tracking-widest ${studyMode === "night" ? "text-white/40" : "text-stone-400"}`}>{v.markTranslit}</span>
                      </div>
                    </div>
                    {playingItem === v.tib && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-[11px] font-bold text-stone-500">
              <span className="uppercase tracking-widest">Legend</span>
              {(Object.keys(POSITION_META) as Position[]).map((p) => (
                <div key={p} className="inline-flex items-center gap-2">
                  <span className="h-2 w-4" style={{ backgroundColor: POSITION_META[p].hex }} />
                  <span>{POSITION_META[p].label}</span>
                </div>
              ))}
            </div>
          </StepCard>

          {/* Step 1: Pronunciation */}
          <StepCard index={1} total={total} step={STEPS[1]} status={statusOf(1)} isExpanded={isExpanded(1)} onToggle={() => toggleStep(1)} onPrev={() => goPrev(1)} onContinue={() => goContinue(1)} isFirst={false} isLast={false} currentStep={currentStep}>
            <p className="mb-6 max-w-3xl text-sm text-stone-600">
              Pronouncing the Tibetan vowels isn't difficult. Look at the equivalent pronunciation in
              English — each vowel maps cleanly to sounds you already say every day.
            </p>

            <div className="overflow-hidden border border-[#e8e4d9] shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-500 border-b border-[#e8e4d9]">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Vowel</th>
                    <th className="px-6 py-4 text-left font-bold">Sound</th>
                    <th className="px-6 py-4 text-left font-bold">As in English</th>
                    <th className="px-6 py-4 text-right font-bold">Listen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {VOWELS.map((v) => (
                    <tr key={v.key} className="transition hover:bg-stone-50">
                      <td className="px-6 py-5">
                        <button onClick={() => setSelected(v)} className="inline-flex items-center gap-3">
                          <span className="font-serif text-3xl leading-none text-stone-900">{v.tib}</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{v.markTranslit}</span>
                        </button>
                      </td>
                      <td className="px-6 py-5 font-serif text-2xl text-stone-800">{v.translit}</td>
                      <td className="px-6 py-5 text-stone-600 font-medium">{v.english}</td>
                      <td className="px-6 py-5 text-right">
                        <button onClick={() => playAudio(v.translit)} disabled={playingItem !== null} className="inline-grid size-9 place-items-center bg-amber-50 text-amber-600 transition hover:bg-amber-100 border border-amber-200">
                          {playingItem === v.translit ? <Loader2 className="size-4 animate-spin" /> : <Volume2 className="size-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex gap-4 p-5 bg-[#fcfaf5] border border-stone-200 shadow-sm">
              <Info className="mt-0.5 size-5 shrink-0 text-amber-500" />
              <div className="text-sm font-medium leading-relaxed text-stone-600">
                The absence of a vowel mark on a Tibetan letter is treated as an inherent{" "}
                <span className="font-bold text-stone-900">‘a’</span> — for example ཀ is read <em>ka</em>,
                not <em>k</em>. The four diacritics ི ུ ེ ོ replace that inherent ‘a’ with the vowels
                I, U, E, O respectively.
              </div>
            </div>
          </StepCard>

          {/* Step 2: Marks */}
          <StepCard index={2} total={total} step={STEPS[2]} status={statusOf(2)} isExpanded={isExpanded(2)} onToggle={() => toggleStep(2)} onPrev={() => goPrev(2)} onContinue={() => goContinue(2)} isFirst={false} isLast={false} currentStep={currentStep}>
            <p className="mb-6 max-w-3xl text-sm text-stone-600">
              Each vowel has its own traditional Tibetan name. Three sit above the root letter; only{" "}
              <span className="font-bold text-stone-900">shabkyu</span> is written beneath it.
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {VOWELS.map((v) => {
                const pm = POSITION_META[v.position];
                return (
                  <div key={v.key} className={`p-6 border bg-white ${pm.ring} shadow-sm flex flex-col`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 w-fit ${pm.swatch} ${pm.text}`}>
                      {v.position === "above" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest">{pm.label}</span>
                    </div>
                    <div className="mt-6 flex items-baseline gap-4">
                      <span className="font-serif text-7xl leading-none text-stone-900">{v.tib}</span>
                      <span className="font-serif text-3xl italic text-stone-400">{v.translit}</span>
                    </div>
                    <div className="mt-6 border-t border-stone-100 pt-4 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Mark name</div>
                      <div className="font-serif text-2xl text-stone-800">{v.markTib}</div>
                      <div className="text-xs italic text-stone-500 mt-1">{v.markTranslit} · {v.markGloss}</div>
                    </div>
                    <p className="mt-4 text-[13px] leading-relaxed text-stone-600 bg-stone-50 p-3 border border-stone-100">{v.note}</p>
                  </div>
                );
              })}
            </div>
          </StepCard>

          {/* Step 3: Spelling & Checkpoint */}
          <StepCard index={3} total={total} step={STEPS[3]} status={statusOf(3)} isExpanded={isExpanded(3)} onToggle={() => toggleStep(3)} onPrev={() => goPrev(3)} onContinue={() => goContinue(3)} isFirst={false} isLast={false} currentStep={currentStep}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <p className="text-[15px] text-stone-600">
                Spelling may not seem very important to you but it actually plays a key role in your
                reading skills. Remember, the more you practise spelling words, the more fluent you
                will be in reading in no time.
              </p>
              <div className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold uppercase tracking-widest shrink-0">
                སྦྱོར་ཀློག
              </div>
            </div>

            <div className="overflow-hidden border border-[#e8e4d9] bg-white shadow-sm mb-10">
              <div className="grid grid-cols-1 divide-y divide-stone-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                {VOWELS.map((v) => (
                  <div key={v.key} className="p-6 md:p-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-6">
                      <span className="h-2 w-4" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                      Spelling {v.translit}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                      <span className="font-serif text-5xl leading-none text-stone-900">ཨ</span>
                      <span className="text-2xl text-stone-400">+</span>
                      <span className="font-serif text-5xl leading-none text-stone-900">{v.markTib}</span>
                      <span className="text-2xl text-stone-400">⇒</span>
                      <span className="font-serif text-5xl leading-none text-amber-600">{v.tib}</span>
                      <span className="text-2xl text-stone-400">⇒</span>
                      <span className="font-serif text-4xl italic text-stone-800">{v.translit}</span>
                      <button onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="ml-2 inline-grid size-10 place-items-center bg-stone-100 border border-stone-200 text-stone-600 transition hover:bg-stone-200">
                        {playingItem === v.tib ? <Loader2 className="size-4 animate-spin text-amber-500" /> : <Volume2 className="size-4" />}
                      </button>
                    </div>

                    <div className="mt-6 text-sm italic font-medium text-stone-500 bg-stone-50 p-3 border border-stone-100">
                      [a + {v.markTranslit}] ⇒ {v.markGloss} ⇒ {v.translit}
                    </div>

                    <div className="mt-6 border-t border-stone-100 pt-5">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                        Try it with other consonants
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {v.examples.map((ex) => (
                          <button key={ex} onClick={() => playAudio(ex)} disabled={playingItem !== null} className="inline-flex items-center gap-2 border border-stone-200 bg-white px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-sm hover:border-amber-300">
                            <span className="font-serif text-2xl text-stone-800">{ex}</span>
                            {playingItem === ex ? <Loader2 className="size-4 animate-spin text-amber-500" /> : <Volume2 className="size-4 text-amber-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <QuizModule title="Mastery check · the four vowels" intro="Quick check-in before you move on. Retake it as many times as you like." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={6} isUnlockTest={false} isVocabMatch={true} />
          </StepCard>

          {/* Step 4: Vocabulary */}
          <StepCard index={4} total={total} step={STEPS[4]} status={statusOf(4)} isExpanded={isExpanded(4)} onToggle={() => toggleStep(4)} onPrev={() => goPrev(4)} onContinue={() => goContinue(4)} isFirst={false} isLast={false} currentStep={currentStep}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <p className="text-[15px] text-stone-600">Read and hear real words using vowels only.</p>
              <div className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold uppercase tracking-widest shrink-0">
                Vocabulary · མིང་ཚིག
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {VOCAB.map((v) => {
                const pm = POSITION_META[VOWELS.find((x) => x.key === v.vowel)!.position];
                return (
                  <div key={v.tib + v.translit} className="bg-white border border-[#e8e4d9] flex flex-col p-5 transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md relative group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl opacity-90">{v.emoji}</div>
                      <span className="border px-2 py-1 text-[9px] font-bold uppercase tracking-widest" style={{ backgroundColor: pm.hex + "15", color: pm.hex, borderColor: pm.hex + "40" }}>
                        {v.vowel}
                      </span>
                    </div>
                    <div className="font-serif font-bold text-3xl leading-tight text-stone-900 mb-1">{v.tib}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">{v.translit}</div>
                    <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-auto">
                      <span className="text-sm font-bold text-stone-700">{v.en}</span>
                      <button onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="grid size-8 place-items-center bg-stone-100 border border-stone-200 text-stone-600 transition hover:bg-stone-200">
                        {playingItem === v.tib ? <Loader2 className="size-4 animate-spin text-amber-500" /> : <Volume2 className="size-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </StepCard>

          {/* Step 5: Practice */}
          <StepCard index={5} total={total} step={STEPS[5]} status={statusOf(5)} isExpanded={isExpanded(5)} onToggle={() => toggleStep(5)} onPrev={() => goPrev(5)} onContinue={() => goContinue(5)} isFirst={false} isLast={false} currentStep={currentStep}>
            <PracticeArea speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepCard>

          {/* Step 6: Complete (Final Test) */}
          <StepCard index={6} total={total} step={STEPS[6]} status={statusOf(6)} isExpanded={isExpanded(6)} onToggle={() => toggleStep(6)} onPrev={() => goPrev(6)} onContinue={() => goContinue(6)} isFirst={false} isLast currentStep={currentStep}>
            <QuizModule title="Final Lesson Test" intro="Score 80% or higher to unlock the next lesson: The Three Superscripts." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={10} isUnlockTest={true} isVocabMatch={true} />
          </StepCard>
        </div>
      </div>

      {/* Non-Blocking Inspector Window */}
      {selected && <DetailPanel v={selected} onClose={() => setSelected(null)} onSpeak={playAudio} playingItem={playingItem} />}

      {/* Sticky Footer */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-[#fdfbf7] border-t border-stone-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/1" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} /> Previous: The 30 Consonants
          </Link>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold shadow-sm transition-colors border border-amber-600">
            <CheckCircle2 size={18} /> Mark lesson complete
          </button>
          <Link href="/dashboard/lessons/3" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-800 hover:text-amber-600 transition-colors">
            Next: The Three Superscripts <ArrowRight size={16} />
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
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">{step.eyebrow}</span>
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

function Flashcards({ speak, playingItem }: any) {
  const [mode, setMode] = useState<"vowels" | "nouns">("vowels");
  const deck = useMemo(() => mode === "vowels" ? VOWELS : VOCAB, [mode]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = deck[idx % deck.length] as any;
  const front = mode === "vowels" ? card.tib : card.tib;
  const translit = mode === "vowels" ? card.translit : card.translit;

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % deck.length); };
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + deck.length) % deck.length); };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center mb-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest gap-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setMode("vowels"); setIdx(0); setFlipped(false); }} className={`px-4 py-2 transition-all border ${mode === "vowels" ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"}`}>Vowels · 4</button>
          <button onClick={() => { setMode("nouns"); setIdx(0); setFlipped(false); }} className={`px-4 py-2 transition-all border ${mode === "nouns" ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"}`}>Nouns · {VOCAB.length}</button>
        </div>
        <span>Card {(idx % deck.length) + 1} of {deck.length}</span>
      </div>

      <div onClick={() => setFlipped(!flipped)} className="w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center relative group overflow-hidden">
        {!flipped ? (
          <div className="flex flex-col items-center gap-4">
            {mode === "nouns" && <span className="text-6xl">{card.emoji}</span>}
            <div className="text-[6rem] md:text-[8rem] font-serif text-stone-900 group-hover:scale-105 transition-transform leading-none">{front}</div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 p-6">
            <div className="text-4xl font-serif italic text-stone-600 mb-4">{translit}</div>
            {mode === "vowels" ? (
              <>
                <div className="font-mono text-2xl text-stone-800 font-bold mb-2">{card.markGloss}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-stone-400">{POSITION_META[card.position as Position].label}</div>
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
        <button onClick={() => speak(translit)} disabled={playingItem !== null} className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold shadow-sm border border-amber-600">
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
    const shuffled = [...VOWELS].sort(() => Math.random() - 0.5);
    const answer = shuffled[0];
    const distractors = shuffled.slice(1, 4);
    const choices = [answer, ...distractors].sort(() => Math.random() - 0.5);
    return { answer, choices };
  }, [seed]);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm font-medium text-stone-500 mb-8 self-start w-full max-w-4xl">Listen to the sound and choose the correct vowel mark.</p>
      <button onClick={() => speak(answer.translit)} disabled={playingItem !== null} className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 font-bold flex items-center gap-3 mb-12 shadow-md transition-colors">
        {playingItem === answer.translit ? <Loader2 size={20} className="animate-spin text-amber-500" /> : <Volume2 size={20} className="text-amber-500"/>} PLAY SOUND
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {choices.map((c) => {
          const isSelected = picked === c.translit;
          const isCorrect = answer.translit === c.translit;
          return (
            <button key={c.tib + c.translit} onClick={() => { if (!picked) { setPicked(c.translit); if (isCorrect) speak(c.tib); else playErrorBeep(); } }} disabled={picked !== null} className={`relative py-8 px-4 flex flex-col items-center justify-center border transition-all ${isSelected && isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700" : isSelected && !isCorrect ? "border-rose-500 bg-rose-50 text-rose-700" : picked && isCorrect ? "border-emerald-300 border-dashed bg-emerald-50/50 text-emerald-600" : picked ? "border-stone-100 opacity-50 bg-stone-50 cursor-default" : "border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-300"}`}>
              <span className="font-serif text-[4rem] md:text-[5rem] leading-none">{"\u25CC" + c.mark}</span>
              {picked && <span className="absolute bottom-4 text-[10px] font-bold uppercase tracking-widest">{c.translit}</span>}
              {isSelected && isCorrect && <CheckCircle2 size={20} className="absolute top-3 right-3 text-emerald-500 animate-in zoom-in" />}
              {isSelected && !isCorrect && <XCircle size={20} className="absolute top-3 right-3 text-rose-500 animate-in zoom-in" />}
            </button>
          )
        })}
      </div>
      {picked && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setPicked(null); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 shadow-sm transition-colors border border-amber-600 flex items-center gap-2">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MatchExercise({ speak, playingItem, playErrorBeep }: any) {
  const [seed, setSeed] = useState(0);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  
  const questions = useMemo(() => {
    const targets = [...VOWELS].sort(() => Math.random() - 0.5);
    return targets.map(target => {
      const distractors = VOWELS.filter(i => i.tib !== target.tib).sort(() => Math.random() - 0.5).slice(0, 2);
      return { target, options: [target, ...distractors].sort(() => Math.random() - 0.5) };
    });
  }, [seed]);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm font-medium text-stone-500 mb-8 self-start w-full max-w-4xl">Match each vowel mark with its traditional Tibetan name.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {questions.map((q, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-stone-200 shadow-sm gap-4 sm:gap-2">
            <div className="text-4xl font-serif text-stone-900 sm:ml-4 text-center sm:text-left">{"\u25CC" + q.target.mark}</div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto sm:mr-2">
              {q.options.map(opt => {
                const isSelected = matchAnswers[q.target.tib] === opt.markTranslit;
                const isCorrect = q.target.markTranslit === opt.markTranslit;
                const isAnswered = !!matchAnswers[q.target.tib];
                let btnClass = "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 cursor-pointer font-mono";
                if (isAnswered) {
                  if (isCorrect) { btnClass = isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm font-mono" : "border-emerald-400 border-dashed bg-emerald-50/50 text-emerald-600 font-mono"; } 
                  else { btnClass = isSelected ? "border-rose-500 bg-rose-50 text-rose-700 cursor-default font-mono" : "border-stone-100 bg-stone-50 text-stone-300 opacity-50 cursor-default font-mono"; }
                }
                return (
                  <button key={opt.tib + opt.markTranslit} onClick={() => { if(!isAnswered){ setMatchAnswers(p => ({ ...p, [q.target.tib]: opt.markTranslit })); if(isCorrect) speak(opt.translit); else playErrorBeep(); } else if (isCorrect) { speak(opt.translit); } }} disabled={playingItem !== null || (isAnswered && !isCorrect)} className={`relative px-4 py-2 text-[13px] font-bold border transition-all flex items-center justify-center min-w-[5rem] text-center ${btnClass}`}>
                    {playingItem === opt.translit && isCorrect ? <Loader2 size={14} className="animate-spin absolute" /> : opt.markTranslit}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {Object.keys(matchAnswers).length === questions.length && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setMatchAnswers({}); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 shadow-sm transition-colors border border-amber-600 flex items-center gap-2">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MemoryReview({ speak, playingItem }: any) {
  const [deck, setDeck] = useState(() => [...VOCAB].sort(() => Math.random() - 0.5));
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
      <p className="text-stone-500 font-medium mb-8">You have successfully mastered all cards.</p>
      <button onClick={() => { setDeck([...VOCAB].sort(() => Math.random() - 0.5)); setReviewedCount(0); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"><Repeat size={18} /> Review Again</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-stone-200 pb-4">
          <span>Spaced repetition · rate your recall</span><span>{reviewedCount} reviewed</span>
        </div>
        <div className="bg-white border border-stone-200 p-8 sm:p-16 flex flex-col items-center justify-center mb-6 min-h-[300px] shadow-sm relative overflow-hidden">
          <div className="text-6xl mb-6">{deck[0].emoji}</div>
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
          <button onClick={nextCard} disabled={!rating} className={`flex items-center justify-center gap-2 px-8 py-3.5 font-bold shadow-sm transition-colors border border-amber-600 w-full sm:w-auto ${rating ? 'bg-amber-500 hover:bg-amber-400 text-stone-900' : 'bg-stone-200 text-stone-400 cursor-not-allowed border-transparent'}`}>Next Card <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ v, onClose, onSpeak, playingItem }: any) {
  const pm = POSITION_META[v.position as Position];
  
  // --- DRAG LOGIC ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, initX: position.x, initY: position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragRef.current) return;
    setPosition({
      x: dragRef.current.initX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.initY + (e.clientY - dragRef.current.startY)
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  // ------------------
  
  return (
    <div className="fixed bottom-[80px] sm:bottom-24 left-2 right-2 sm:left-auto sm:right-6 z-50 pointer-events-none flex flex-col justify-end sm:w-[24rem]">
      <div 
        className="bg-[#fdfbf7] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#e8e4d9] rounded-xl sm:rounded-2xl pointer-events-auto flex flex-col animate-in slide-in-from-bottom-8 sm:slide-in-from-right-8 duration-300 max-h-[50vh] sm:max-h-[70vh] overflow-hidden"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      >
        {/* DRAGGABLE HEADER */}
        <div 
          className="px-4 py-3 border-b border-[#e8e4d9] flex items-center justify-between bg-white shrink-0 cursor-move select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest pointer-events-none">Vowel · {v.translit}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            onPointerDown={(e) => e.stopPropagation()} 
            className="p-1.5 -mr-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          <div className="flex items-center gap-5 mb-6">
            <div className="text-[5rem] sm:text-[6rem] font-serif text-stone-900 leading-none">{v.tib}</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="text-xl font-serif italic text-stone-800">{v.translit}</div>
                <div className="text-base font-mono font-medium text-stone-400">{v.markGloss}</div>
              </div>
              <button onClick={() => onSpeak(v.translit)} disabled={playingItem !== null} className="w-fit px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 flex items-center gap-2 text-xs font-bold transition-colors shadow-sm border border-amber-600">
                {playingItem === v.translit ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} Play
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className={`p-3 border ${pm.swatch} border-opacity-50`}>
              <div className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Position</div>
              <div className={`font-serif text-sm ${pm.text}`}>{pm.label}</div>
            </div>
            
            <div className="p-3 border bg-white border-stone-200">
              <div className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Mark Name</div>
              <div className="font-serif text-base text-stone-800">{v.markTib}</div>
              <div className="text-[10px] italic text-stone-500">{v.markTranslit}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Pronunciation</div>
            <p className="text-sm text-stone-700 leading-relaxed">{v.english}</p>
          </div>

          <div className="border-t border-stone-200 pt-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Notes from the textbook</div>
            <p className="text-sm text-stone-600 leading-relaxed italic">{v.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}