"use client";

import { useState, useMemo } from "react";
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
  XCircle,
  History,
  AlertTriangle
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data & Types                                                        */
/* ------------------------------------------------------------------ */

type Family = "silent" | "nasal" | "up" | "e-shift" | "el" | "r-scot";

type SuffixKey = "ga" | "nga" | "da" | "na" | "ba" | "ma" | "a" | "ra" | "la" | "sa";

interface SuffixExample {
  word: string;
  read: string;
  gloss?: string;
}

interface Suffix {
  key: SuffixKey;
  head: string;
  latin: string;
  reads: string;
  hint: string;
  family: Family;
  accent: string;
  vowelShift?: string;
  examples: SuffixExample[];
  note?: string;
}

const FAMILY_META: Record<Family, { label: string; hex: string }> = {
  silent: { label: "Almost silent", hex: "#6b7280" },
  nasal: { label: "Nasal ending", hex: "#b91c1c" },
  up: { label: "Soft [p] / [m]", hex: "#b45309" },
  "e-shift": { label: "Shifts vowel to [e]", hex: "#0369a1" },
  el: { label: "Silent · [el]", hex: "#7c3aed" },
  "r-scot": { label: "Scottish [r]", hex: "#c026d3" },
};

const SUFFIXES: Suffix[] = [
  {
    key: "ga",
    head: "ག",
    latin: "ga",
    reads: "[k']",
    hint: "ག is almost silent — a light glottal stop, no English equivalent.",
    family: "silent",
    accent: "#b45309",
    examples: [
      { word: "དག་", read: "thak'", gloss: "pure" },
      { word: "རིག་", read: "rik'", gloss: "awareness" },
      { word: "ཐུག་", read: "thuk'", gloss: "to meet" },
    ],
    note: "The vowel is preserved; only a light closure is felt at the end.",
  },
  {
    key: "nga",
    head: "ང",
    latin: "nga",
    reads: "[ng]",
    hint: "Nasalised, as the -ng in “lung”.",
    family: "nasal",
    accent: "#b91c1c",
    examples: [
      { word: "དང་", read: "thang", gloss: "and" },
      { word: "རང་", read: "rang", gloss: "self" },
      { word: "ལུང་", read: "lung", gloss: "valley" },
    ],
  },
  {
    key: "ba",
    head: "བ",
    latin: "ba",
    reads: "[p]",
    hint: "Similar to “up” but softer, unreleased.",
    family: "up",
    accent: "#b45309",
    examples: [
      { word: "རབ་", read: "rap", gloss: "excellent" },
      { word: "ཐུབ་", read: "thup", gloss: "able" },
      { word: "ཁབ་", read: "khap", gloss: "needle" },
    ],
  },
  {
    key: "ma",
    head: "མ",
    latin: "ma",
    reads: "[m]",
    hint: "Sounds like -um in “come”.",
    family: "up",
    accent: "#b45309",
    examples: [
      { word: "ལམ་", read: "lam", gloss: "path" },
      { word: "རིམ་", read: "rim", gloss: "order, sequence" },
      { word: "ཁྱིམ་", read: "khyim", gloss: "home" },
    ],
  },
  {
    key: "ra",
    head: "ར",
    latin: "ra",
    reads: "[r]",
    hint: "Pronounced like the Scottish rolled “r”.",
    family: "r-scot",
    accent: "#c026d3",
    examples: [
      { word: "མར་", read: "mar", gloss: "butter" },
      { word: "དཀར་", read: "kar", gloss: "white" },
      { word: "སྐར་", read: "kar", gloss: "star" },
    ],
  },
  {
    key: "a",
    head: "འ",
    latin: "'a",
    reads: "—",
    hint: "Never pronounced and does not change the root’s sound.",
    family: "silent",
    accent: "#6b7280",
    examples: [
      { word: "མཐའ་", read: "m'tha", gloss: "end, edge" },
      { word: "རྒྱའ་", read: "gya", gloss: "China / vast" },
    ],
    note: "འ as a suffix is a writing-only sign. Its main use is licensing an ‘a-suffix root to also take a post-suffix ས.",
  },
  {
    key: "la",
    head: "ལ",
    latin: "la",
    reads: "[el]",
    hint: "Nearly silent — like the “l” in British “elementary”.",
    family: "el",
    accent: "#7c3aed",
    vowelShift: "Attached to a bare root: pronounced as [el]. After a vowel, the vowel colour is kept and softened — e.g. [i] + la → [il], [u] + la → [ül], [o] + la → [öl].",
    examples: [
      { word: "གསལ་", read: "sel", gloss: "clear" },
      { word: "ཡུལ་", read: "yül", gloss: "country" },
      { word: "འོལ་", read: "öl", gloss: "vague" },
    ],
  },
  {
    key: "na",
    head: "ན",
    latin: "na",
    reads: "[en]",
    hint: "Sounds like -en in “pen”.",
    family: "e-shift",
    accent: "#0369a1",
    vowelShift: "After a vowel, ན keeps that vowel and closes with [n]: [i] + na → [in], [u] + na → [ün], [o] + na → [ön].",
    examples: [
      { word: "མན་", read: "men", gloss: "inferior" },
      { word: "རྒྱུན་", read: "gyün", gloss: "continuous" },
      { word: "སྤྱོན་", read: "chön", gloss: "arrival (hon.)" },
    ],
  },
  {
    key: "da",
    head: "ད",
    latin: "da",
    reads: "[e]",
    hint: "Shifts the final sound to [e], as in “say”.",
    family: "e-shift",
    accent: "#0369a1",
    vowelShift: "ད closes without a real consonant; the syllable ends on the fronted vowel: [i] → [i], [u] → [ü], [o] → [ö].",
    examples: [
      { word: "ནད་", read: "ne", gloss: "illness" },
      { word: "རྒྱུད་", read: "gyü", gloss: "continuum" },
      { word: "སྐད་", read: "ke", gloss: "voice, language" },
    ],
  },
  {
    key: "sa",
    head: "ས",
    latin: "sa",
    reads: "[e]",
    hint: "Also shifts the final to [e]; identical sound to suffix ད.",
    family: "e-shift",
    accent: "#0369a1",
    vowelShift: "Same colouring as ད: [i] → [i], [u] → [ü], [e] → [e], [o] → [ö].",
    examples: [
      { word: "ལས་", read: "le", gloss: "karma, action" },
      { word: "རུས་", read: "rü", gloss: "bone, lineage" },
      { word: "སོས་", read: "sö", gloss: "revived" },
    ],
  },
];

interface Vocab {
  tib: string;
  translit: string;
  en: string;
  emoji: string;
  suffix: SuffixKey;
}

const VOCAB: Vocab[] = [
  { tib: "བོད་", translit: "phö", en: "Tibet", emoji: "🏔️", suffix: "da" },
  { tib: "ཁང་", translit: "khang", en: "house", emoji: "🏠", suffix: "nga" },
  { tib: "མེ་མདའ་", translit: "me-da", en: "gun", emoji: "🔫", suffix: "a" },
  { tib: "རྒྱལ་ཁབ་", translit: "gyal-khap", en: "country / world", emoji: "🌍", suffix: "ba" },
  { tib: "ལམ་", translit: "lam", en: "path", emoji: "🛤️", suffix: "ma" },
  { tib: "དཀར་པོ་", translit: "kar-po", en: "white / heart-ref.", emoji: "🤍", suffix: "ra" },
  { tib: "ལག་པ་", translit: "lak-pa", en: "hand", emoji: "✋", suffix: "ga" },
  { tib: "ནག་པོ་", translit: "nak-po", en: "black", emoji: "⬛", suffix: "ga" },
  { tib: "གངས་རི་", translit: "gang-ri", en: "snow mountain", emoji: "🏔️", suffix: "nga" },
  { tib: "ནགས་ཚལ་", translit: "nak-tsel", en: "forest", emoji: "🌲", suffix: "la" },
  { tib: "རྣམས་", translit: "nam", en: "plural marker", emoji: "🔢", suffix: "sa" },
  { tib: "ཁམས་", translit: "kham", en: "region (Kham)", emoji: "🗺️", suffix: "sa" },
];

interface QuizItem {
  word: string;
  read: string;
  suffix: SuffixKey;
  post?: "sa" | "da" | null;
}

const QUIZ: QuizItem[] = [
  { word: "ལམ་", read: "lam", suffix: "ma" },
  { word: "རང་", read: "rang", suffix: "nga" },
  { word: "ནད་", read: "ne", suffix: "da" },
  { word: "མར་", read: "mar", suffix: "ra" },
  { word: "ལས་", read: "le", suffix: "sa" },
  { word: "གསལ་", read: "sel", suffix: "la" },
  { word: "རིག་", read: "rik'", suffix: "ga" },
  { word: "མན་", read: "men", suffix: "na" },
  { word: "རབ་", read: "rap", suffix: "ba" },
  { word: "མཐའ་", read: "m'tha", suffix: "a" },
  { word: "གངས་", read: "gang", suffix: "nga", post: "sa" },
  { word: "ཁམས་", read: "kham", suffix: "ma", post: "sa" },
];

const STEPS = [
  { id: "anatomy", eyebrow: "Step 01", title: "Word formation \u2014 the anatomy of a syllable" },
  { id: "intro", eyebrow: "Step 02", title: "What is a suffix?" },
  { id: "suffixes", eyebrow: "Step 03", title: "Meet the ten suffixes" },
  { id: "vowel", eyebrow: "Step 04", title: "When the vowel meets the suffix" },
  { id: "post", eyebrow: "Step 05", title: "Post-suffixes" },
  { id: "root", eyebrow: "Step 06", title: "How to recognise the root letter" },
  { id: "vocab", eyebrow: "Step 07", title: "Vocabulary" },
  { id: "practice", eyebrow: "Step 08", title: "Practice & mastery check" },
  { id: "complete", eyebrow: "Finish", title: "Lesson complete" }
];

const TIB_FONT = { fontFamily: "Jomolhari, 'Noto Sans Tibetan', serif" };

/* ------------------------------------------------------------------ */
/* Main Page Component                                                 */
/* ------------------------------------------------------------------ */

export default function SuffixesLesson() {
  const { getToken } = useAuth();
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  
  // Progression Lock State
  const [unlockedStep, setUnlockedStep] = useState<number>(DEV_BYPASS_LOCKS ? 8 : 0);
  const [expandedStep, setExpandedStep] = useState<number>(0);

  // Lesson State
  const [activeTab, setActiveTab] = useState<SuffixKey>("ga");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  const [reveal, setReveal] = useState<null | "ten" | "two">(null);

  // Audio API
  const playAudio = async (text: string) => {
    if (playingItem) return;
    setPlayingItem(text);
    try {
      const cleanText = text.replace(/[’'`]/g, ""); // Strip out transliteration marks
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <span>Unit 06</span>
          <ChevronRight size={14} />
          <span className="text-stone-900">Suffixes & Post-suffixes</span>
        </div>

        {/* Hero */}
        <section className="mb-12 grid gap-8 border border-black/10 bg-white p-6 md:grid-cols-[1fr,auto] md:items-end md:p-10 shadow-sm">
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
              Lesson 06 · Foundations
            </div>
            <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl text-stone-900">
              Suffixes & Post-suffixes
            </h1>
            <p className="mt-2 font-serif text-2xl italic text-stone-500">
              རྗེས་འཇུག་བཅུ་དང་ཡང་འཇུག་གཉིས།
            </p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              Ten letters may follow the root — the <span className="font-bold text-stone-900">suffix</span> closes the syllable. A further <span className="font-bold text-stone-900">two</span> may sit beyond that suffix as a <span className="font-bold text-stone-900">post-suffix</span>. Together they shape the reading, the tense, and often the meaning of a word.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
              <button
                onClick={() => setReveal((r) => (r === "ten" ? null : "ten"))}
                className={`border px-3 py-1.5 transition-colors ${
                  reveal === "ten" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-black/10 text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                10 suffixes
              </button>
              <button
                onClick={() => setReveal((r) => (r === "two" ? null : "two"))}
                className={`border px-3 py-1.5 transition-colors ${
                  reveal === "two" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-black/10 text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                2 post-suffixes
              </button>
            </div>

            {reveal === "ten" && (
              <div className="mt-4 flex flex-wrap gap-2 border border-black/10 bg-stone-50 p-4 shadow-inner">
                {SUFFIXES.map((x) => (
                  <button key={x.key} onClick={() => { setActiveTab(x.key); markComplete(0); }} className="flex items-center gap-2 border border-black/10 bg-white px-3 py-2 transition hover:border-amber-400 shadow-sm">
                    <span className="font-serif leading-none text-2xl" style={{ color: x.accent }}>{x.head}</span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{x.latin}</span>
                  </button>
                ))}
              </div>
            )}
            {reveal === "two" && (
              <div className="mt-4 flex flex-wrap gap-4 border border-black/10 bg-stone-50 p-4 shadow-inner">
                <div className="flex items-center gap-4 border border-black/10 bg-white px-5 py-3 shadow-sm">
                  <span className="font-serif leading-none text-3xl" style={{ color: "#c026d3" }}>ད</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900">da · historical</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">silent · classical only</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 border border-black/10 bg-white px-5 py-3 shadow-sm">
                  <span className="font-serif leading-none text-3xl" style={{ color: "#0284c7" }}>ས</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900">sa · modern</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">silent · still written</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-72">
            <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <span>Lesson progress</span>
              <span className="text-amber-500">{Math.min(unlockedStep, STEPS.length)} of {STEPS.length} sections</span>
            </div>
            <div className="h-1.5 w-full bg-stone-100 overflow-hidden mb-6">
              <div className="h-full bg-amber-400 transition-all duration-500 ease-out" style={{ width: `${(Math.min(unlockedStep, STEPS.length) / STEPS.length) * 100}%` }} />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {SUFFIXES.map((x) => (
                <button
                  key={x.key}
                  onClick={() => { setActiveTab(x.key); markComplete(0); }}
                  className={`aspect-square border p-2 text-center transition-colors ${activeTab === x.key ? "border-amber-400 bg-amber-50" : "border-black/10 hover:bg-stone-50 hover:border-amber-300 bg-white"}`}
                >
                  <div className="font-serif leading-none text-2xl" style={{ color: x.accent }}>{x.head}</div>
                  <div className="mt-1 text-[9px] uppercase tracking-widest text-stone-500 font-bold">{x.latin}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          
          {/* Step 01: Anatomy */}
          <StepContainer index={0} step={STEPS[0]} isUnlocked={unlockedStep >= 0} isExpanded={expandedStep === 0} onToggle={() => handleToggleStep(0)} onContinue={() => markComplete(0)}>
            <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-stone-600">
              Before we meet the suffixes, it helps to see the whole picture. A Tibetan syllable is built from up to <span className="font-bold text-stone-900">seven slots</span> arranged around a single <span className="font-bold text-stone-900">root letter</span>. Each slot has a name, a position, and a job — some shape the <span className="font-bold text-stone-900">spelling</span>, others shift the <span className="font-bold text-stone-900">pronunciation</span>.
            </p>

            <div className="border border-black/10 bg-white shadow-sm overflow-hidden mb-6">
              <div className="border-b border-black/5 bg-gradient-to-b from-stone-50 to-white px-6 pb-10 pt-8 text-center md:pb-14">
                <div className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
                  A full syllable
                </div>
                <div className="font-serif tracking-tight text-stone-900 leading-none" style={{ fontSize: "clamp(72px, 14vw, 156px)" }}>
                  བསྒྲིམས་
                </div>
                <div className="mt-6 text-[15px] italic text-stone-500">
                  <span className="not-italic font-bold text-stone-900">bsgrims</span> — “concentrated, focused” · read <span className="not-italic font-bold text-stone-900">drim</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
                {[
                  { letter: "བ", role: "Prefix", tib: "སྔོན་འཇུག", pos: "Before root", accent: "#c2410c" },
                  { letter: "ས", role: "Superscript", tib: "མགོ་ཅན", pos: "Above root", accent: "#7c3aed" },
                  { letter: "ག", role: "Root letter", tib: "མིང་གཞི", pos: "The heart", accent: "#111827" },
                  { letter: "ྲ", role: "Subscript", tib: "འདོགས་ཅན", pos: "Below root", accent: "#0284c7" },
                  { letter: "ི", role: "Vowel", tib: "དབྱངས", pos: "Above / below", accent: "#059669" },
                  { letter: "མ", role: "Suffix", tib: "རྗེས་འཇུག", pos: "After root", accent: "#b45309", highlight: true },
                  { letter: "ས", role: "Post-suffix", tib: "ཡང་འཇུག", pos: "Far right", accent: "#9333ea", highlight: true },
                ].map((s) => (
                  <div key={s.role} className={`relative p-5 text-center flex flex-col items-center justify-center ${s.highlight ? "bg-amber-50" : "bg-white"}`}>
                    {s.highlight && (
                      <span className="absolute top-2 right-2 bg-amber-200 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-amber-900">
                        This lesson
                      </span>
                    )}
                    <div className="grid size-14 place-items-center font-serif text-[2.5rem] leading-none mb-3" style={{ color: s.accent }}>
                      {s.letter}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: s.accent }}>
                      {s.role}
                    </div>
                    <div className="mt-1 font-serif text-xs italic text-stone-400">
                      {s.tib}
                    </div>
                    <div className="mt-1 text-[10px] text-stone-500 font-bold uppercase tracking-widest">{s.pos}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 border-t border-black/5 bg-stone-50 px-6 py-4 text-xs text-stone-500 leading-relaxed font-bold">
                <Info size={16} className="text-amber-500 shrink-0" />
                <span>
                  Not every syllable uses all seven slots — only the <span className="font-bold text-stone-900">root letter</span> is required. The other six attach around it in fixed positions.
                </span>
              </div>
            </div>
          </StepContainer>

          {/* Step 02: Intro */}
          <StepContainer index={1} step={STEPS[1]} isUnlocked={unlockedStep >= 1} isExpanded={expandedStep === 1} onToggle={() => handleToggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <ArrowRight size={14} /> After the root
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  A suffix is a letter written <span className="font-bold text-stone-900">immediately after</span> the root. Only ten letters may take this seat.
                </p>
              </div>
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <BookOpen size={14} /> Writing
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  Any consonant — even itself — may be followed by a suffix (e.g. <span className="font-serif">དད་</span>). Suffix <span className="font-serif">འ</span> is special: it may only appear when the root also carries a prefix.
                </p>
              </div>
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <Volume2 size={14} /> Pronunciation
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  A suffix closes the syllable. Four of them — <span className="font-serif font-bold">ད ན ལ ས</span> — recolour the preceding vowel into a fronted <em>[e / ü / ö]</em>. The rest add a light final consonant.
                </p>
              </div>
            </div>

            <div className="mt-6 border border-black/10 bg-white overflow-hidden">
              <div className="grid grid-cols-5 divide-x divide-y sm:divide-y-0 divide-black/10 md:grid-cols-10">
                {SUFFIXES.map((x) => (
                  <button key={x.key} onClick={() => { setActiveTab(x.key); markComplete(1); }} className={`group flex flex-col items-center gap-1 p-4 transition-colors hover:bg-stone-50 ${activeTab === x.key ? "bg-amber-50/50" : ""}`}>
                    <span className="h-1 w-8" style={{ backgroundColor: x.accent }} />
                    <span className="mt-1 font-serif leading-none text-2xl" style={{ color: x.accent }}>{x.head}</span>
                    <span className="text-xs font-bold text-stone-900">{x.latin}</span>
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">{x.reads}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 p-6 border border-black/10 bg-stone-50">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                <Info size={14} className="text-amber-500" /> Two rules of writing
              </div>
              <ol className="space-y-4 text-[15px] text-stone-600 font-bold">
                <li className="flex gap-4">
                  <span className="grid size-6 shrink-0 place-items-center rounded bg-white border border-black/10 text-[11px] text-stone-600">1</span>
                  <span>Any root letter — including one that already carries a superscript, subscript, or vowel — may take a suffix.</span>
                </li>
                <li className="flex gap-4">
                  <span className="grid size-6 shrink-0 place-items-center rounded bg-white border border-black/10 text-[11px] text-stone-600">2</span>
                  <span>Suffix <span className="font-serif text-xl text-stone-900">འ</span> requires the root to have a <span className="text-stone-900">prefix</span> — e.g. <span className="font-serif">མཐའ་</span>, <span className="font-serif">དགའ་</span>.</span>
                </li>
              </ol>
            </div>
          </StepContainer>

          {/* Step 03: The Ten Suffixes */}
          <StepContainer index={2} step={STEPS[2]} isUnlocked={unlockedStep >= 2} isExpanded={expandedStep === 2} onToggle={() => handleToggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-black/5 pb-4 gap-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[2].title}</h2>
              <button onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))} className="inline-flex items-center gap-2 border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 transition hover:bg-stone-50 hover:text-stone-900">
                {studyMode === "paper" ? <Moon size={14} /> : <Sun size={14} />}
                {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </button>
            </div>

            <div className={`border transition-colors duration-500 ${studyMode === "night" ? "bg-stone-900 text-white border-white/10" : "bg-white border-black/10"}`}>
              <div className={`grid grid-cols-5 md:grid-cols-10 divide-x border-b ${studyMode === "night" ? "divide-white/10 border-white/10" : "divide-black/5 border-black/5"}`}>
                {SUFFIXES.map((x) => {
                  const isActive = activeTab === x.key;
                  return (
                    <button key={x.key} onClick={() => setActiveTab(x.key)} className={`flex flex-col items-center gap-1 px-2 py-4 text-center transition-colors ${studyMode === "night" ? "hover:bg-white/5" : "hover:bg-stone-50"} ${isActive ? (studyMode === "night" ? "bg-white/10" : "bg-amber-50") : ""}`}>
                      <span className="h-1 w-8" style={{ backgroundColor: x.accent }} />
                      <span className="mt-1 font-serif leading-none text-[2rem]" style={{ color: x.accent }}>{x.head}</span>
                      <span className="text-[11px] font-bold">{x.latin}</span>
                      <span className={`text-[9px] uppercase tracking-widest font-bold ${studyMode === "night" ? "text-stone-400" : "text-stone-400"}`}>{x.reads}</span>
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
                        <div className={`text-sm mt-2 font-bold ${studyMode === "night" ? "text-stone-300" : "text-stone-500"}`}>
                          Reads as <span style={{ color: s.accent }}>{s.reads}</span>
                        </div>
                      </div>
                      <button onClick={() => playAudio(s.examples[0]?.read || s.latin)} disabled={playingItem !== null} className={`ml-auto inline-flex items-center gap-2 border px-4 py-2 text-xs font-bold transition-colors ${studyMode === "night" ? "border-white/20 hover:bg-white/10" : "border-black/10 hover:bg-stone-50"}`}>
                        {playingItem === (s.examples[0]?.read || s.latin) ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} />} Play
                      </button>
                    </div>

                    <p className={`mt-6 text-[15px] leading-relaxed font-bold ${studyMode === "night" ? "text-stone-300" : "text-stone-600"}`}>
                      {s.hint}
                    </p>

                    {s.note && (
                      <div className={`mt-4 flex items-start gap-3 border-l-2 px-4 py-3 text-sm font-bold ${studyMode === "night" ? "border-white/30 text-stone-300 bg-white/5" : "border-amber-400 text-stone-600 bg-amber-50/50"}`}>
                        <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
                        <span>{s.note}</span>
                      </div>
                    )}

                    {s.vowelShift && (
                      <div className={`mt-4 flex items-start gap-3 border-l-2 px-4 py-3 text-sm font-bold ${studyMode === "night" ? "border-sky-400 text-stone-300 bg-sky-900/20" : "border-sky-500 text-stone-600 bg-sky-50/50"}`}>
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-sky-500" />
                        <span>{s.vowelShift}</span>
                      </div>
                    )}

                    <div className="mt-10">
                      <div className={`mb-4 text-[10px] font-bold uppercase tracking-widest ${studyMode === "night" ? "text-stone-400" : "text-stone-400"}`}>Examples</div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {s.examples.map((ex) => (
                          <button key={ex.word} onClick={() => playAudio(ex.read)} disabled={playingItem !== null} className={`group flex flex-col items-start gap-1 border p-5 text-left transition-colors ${studyMode === "night" ? "border-white/10 hover:bg-white/5" : "border-black/10 hover:bg-stone-50 shadow-sm"}`}>
                            <span className="font-serif text-[2.5rem] leading-none text-stone-900" style={{ color: studyMode === "night" ? "#fff" : "inherit" }}>{ex.word}</span>
                            <span className="mt-2 text-sm font-bold" style={{ color: s.accent }}>[{ex.read}]</span>
                            {ex.gloss && <span className={`text-xs font-bold ${studyMode === "night" ? "text-stone-400" : "text-stone-500"}`}>{ex.gloss}</span>}
                            <span className={`mt-3 inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest opacity-0 transition group-hover:opacity-100 ${studyMode === "night" ? "text-stone-400" : "text-stone-400"}`}>
                              {playingItem === ex.read ? <Loader2 size={12} className="animate-spin text-amber-500" /> : <Volume2 size={12} />} Play
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </StepContainer>

          {/* Step 04: Vowel Shift Table */}
          <StepContainer index={3} step={STEPS[3]} isUnlocked={unlockedStep >= 3} isExpanded={expandedStep === 3} onToggle={() => handleToggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[3].title}</h2>
            </div>
            <p className="mb-6 max-w-3xl text-[15px] leading-relaxed text-stone-600">
              Four suffixes — <span className="font-serif font-bold text-stone-900">ད ན ལ ས</span> — recolour the vowel that precedes them. Find a vowel on the left, follow the row across, and hear how each suffix reshapes it. The two families behave very differently: <span className="font-bold text-stone-900">ལ · ན</span> keep the closing consonant audible; <span className="font-bold text-stone-900">ད · ས</span> drop it and simply front the vowel.
            </p>

            <div className="border border-black/10 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-black/10">
                      <th className="w-32 px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-stone-500">Vowel</th>
                      {[
                        { suf: "ལ", latin: "la", accent: "#7c3aed", family: "keeps [l]" },
                        { suf: "ན", latin: "na", accent: "#0369a1", family: "keeps [n]" },
                        { suf: "ད", latin: "da", accent: "#0891b2", family: "silent · fronts vowel" },
                        { suf: "ས", latin: "sa", accent: "#0284c7", family: "silent · fronts vowel" },
                      ].map((c) => (
                        <th key={c.suf} className="border-l border-black/5 px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="font-serif leading-none text-3xl" style={{ color: c.accent }}>{c.suf}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.accent }}>{c.latin}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{c.family}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {[
                      { vowel: "ི", label: "[i]", cells: ["[il]", "[in]", "[i]", "[i]"] },
                      { vowel: "ུ", label: "[u]", cells: ["[ül]", "[ün]", "[ü]", "[ü]"] },
                      { vowel: "ེ", label: "[e]", cells: ["[el]", "[en]", "[e]", "[e]"] },
                      { vowel: "ོ", label: "[o]", cells: ["[öl]", "[ön]", "[ö]", "[ö]"] },
                    ].map((r) => (
                      <tr key={r.label} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-5 border-r border-black/5">
                          <div className="flex items-center gap-4">
                            <span className="font-serif leading-none text-[2rem] text-amber-500">{r.vowel}</span>
                            <span className="text-[15px] font-bold text-stone-900">{r.label}</span>
                          </div>
                        </td>
                        {r.cells.map((cell, i) => (
                          <td key={i} className="border-l border-black/5 px-4 py-5 text-center">
                            <span className="inline-block font-mono text-lg font-bold" style={{ color: ["#7c3aed", "#0369a1", "#0891b2", "#0284c7"][i] }}>{cell}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/5 border-t border-black/10">
                <div className="p-6 bg-stone-50">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-1 w-8" style={{ backgroundColor: "#7c3aed" }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">ལ · ན — closing consonant heard</span>
                  </div>
                  <p className="text-[13px] font-bold leading-relaxed text-stone-600">
                    The suffix keeps its own sound as a soft [l] or [n], and the vowel fronts to match. You will always hear something after the vowel.
                  </p>
                </div>
                <div className="p-6 bg-stone-50">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-1 w-8" style={{ backgroundColor: "#0284c7" }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">ད · ས — silent, vowel only</span>
                  </div>
                  <p className="text-[13px] font-bold leading-relaxed text-stone-600">
                    Both letters drop out of pronunciation. Only the fronted vowel remains: the two suffixes sound identical, but the spelling distinguishes the word.
                  </p>
                </div>
              </div>
            </div>
          </StepContainer>

          {/* Step 05: Post-suffixes */}
          <StepContainer index={4} step={STEPS[4]} isUnlocked={unlockedStep >= 4} isExpanded={expandedStep === 4} onToggle={() => handleToggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="mb-6 flex flex-col border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900 mb-1">
                The two post-suffixes <span className="font-serif italic text-stone-400 ml-2">ཡང་འཇུག་གཉིས།</span>
              </h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-stone-600">
              Only two letters — <span className="font-serif font-bold">ད</span> and <span className="font-serif font-bold">ས</span> — may sit <em>after</em> a suffix, becoming the very last letter of the word. They are <span className="font-bold text-stone-900">silent</span> — they don’t change how the word is pronounced. Their job is to distinguish words on the page and to satisfy grammar rules that follow them.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-black/10 bg-white shadow-sm flex flex-col">
                <div className="flex items-center gap-4 border-b border-black/5 bg-stone-50 px-6 py-5">
                  <History className="size-5 text-fuchsia-700" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-700">Historical</div>
                    <div className="font-serif text-xl font-bold">Post-suffix <span className="text-3xl text-fuchsia-600 ml-1">ད</span></div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[13px] font-bold leading-relaxed text-stone-600 mb-6">
                    <span className="font-serif text-lg">ད</span> is <span className="text-stone-900">no longer written</span> in modern Tibetan spelling. In classical texts it appeared after <span className="font-serif">ན ར ལ</span>. Grammatically, words still behave <em>as if</em> the ད were present.
                  </p>
                  <div className="mt-auto border border-black/10 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-stone-50 border-b border-black/5">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-stone-500 uppercase tracking-widest">Former</th>
                          <th className="px-4 py-3 text-left font-bold text-stone-500 uppercase tracking-widest border-l border-black/5">Modern</th>
                          <th className="px-4 py-3 text-left font-bold text-stone-500 uppercase tracking-widest border-l border-black/5">Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {[
                          ["སྒྱུརད་", "སྒྱུར་", "to change / translate"],
                          ["ཕྱིནད་", "ཕྱིན་", "went"],
                          ["སྐྱོནད་", "སྐྱོན་", "flaw"],
                          ["བསྐྱེདད་", "བསྐྱེད་", "to generate"],
                        ].map((r) => (
                          <tr key={r[0]} className="hover:bg-stone-50">
                            <td className="px-4 py-3 font-serif text-[1.3rem] text-stone-400">{r[0]}</td>
                            <td className="px-4 py-3 font-serif text-[1.3rem] text-stone-900 border-l border-black/5">{r[1]}</td>
                            <td className="px-4 py-3 text-[13px] font-bold text-stone-600 border-l border-black/5">{r[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="border border-black/10 bg-white shadow-sm flex flex-col">
                <div className="flex items-center gap-4 border-b border-black/5 bg-stone-50 px-6 py-5">
                  <CheckCircle2 className="size-5 text-sky-700" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-sky-700">Modern</div>
                    <div className="font-serif text-xl font-bold">Post-suffix <span className="text-3xl text-sky-600 ml-1">ས</span></div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[13px] font-bold leading-relaxed text-stone-600 mb-6">
                    <span className="font-serif text-lg">ས</span> is <span className="text-stone-900">still written</span> today. Its role is to differentiate near-identical words. The pronunciation is <span className="text-stone-900">the same</span> with or without it.
                  </p>
                  <div className="mt-auto border border-black/10 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-stone-50 border-b border-black/5">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-stone-500 uppercase tracking-widest">Without</th>
                          <th className="px-4 py-3 text-left font-bold text-stone-500 uppercase tracking-widest border-l border-black/5">With ས</th>
                          <th className="px-4 py-3 text-left font-bold text-stone-500 uppercase tracking-widest border-l border-black/5">Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {[
                          ["མངག་", "མངགས་", "dispatches → dispatched"],
                          ["གང་", "གངས་", "what(ever) → snow"],
                          ["ཐབ་", "ཐབས་", "stove → method"],
                          ["ཁམ་", "ཁམས་", "small piece → region"],
                        ].map((r) => (
                          <tr key={r[0]} className="hover:bg-stone-50">
                            <td className="px-4 py-3 font-serif text-[1.3rem] text-stone-500">{r[0]}</td>
                            <td className="px-4 py-3 font-serif text-[1.3rem] text-stone-900 border-l border-black/5">{r[1]}</td>
                            <td className="px-4 py-3 text-[13px] font-bold text-stone-600 border-l border-black/5">{r[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </StepContainer>

          {/* Step 06: Root Letter Recognition */}
          <StepContainer index={5} step={STEPS[5]} isUnlocked={unlockedStep >= 5} isExpanded={expandedStep === 5} onToggle={() => handleToggleStep(5)} onContinue={() => markComplete(5)}>
            <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[5].title}</h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-stone-600">
              Now that words can stretch to four horizontal letters, the eye needs a strategy. With practice, finding the root becomes automatic.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { n: "1", rule: "If a letter carries a vowel, superscript, or subscript — it is the root.", ex: "དགུ · བསྐུལ · བཟུང · བསྒྲིགས" },
                { n: "2", rule: "Two bare letters (no vowel, super-/subscript) — the first is the root.", ex: "ཁང · ནག · གར · ཞབ · ལམ" },
                { n: "3", rule: "Three bare letters — the middle is the root, unless the third is post-suffix ད / ས, in which case the first is the root.", ex: "གསལ · གཡག · དཀར · ཁམས · ནགས · ཆགས" },
                { n: "4", rule: "Four letters — the second is always the root.", ex: "བདགས · བཙུགས · དམངས" },
              ].map((r) => (
                <div key={r.n} className="border border-black/10 bg-white p-6 shadow-sm flex flex-col">
                  <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-amber-600">
                    <span className="grid size-6 place-items-center rounded bg-amber-100 text-amber-800">{r.n}</span>
                    Rule {r.n}
                  </div>
                  <p className="text-[13px] font-bold leading-relaxed text-stone-600 flex-1">{r.rule}</p>
                  <div className="mt-6 font-serif text-[2rem] leading-none text-stone-900 pt-4 border-t border-black/5">{r.ex}</div>
                </div>
              ))}
            </div>
          </StepContainer>

          {/* Step 07: Vocabulary */}
          <StepContainer index={6} step={STEPS[6]} isUnlocked={unlockedStep >= 6} isExpanded={expandedStep === 6} onToggle={() => handleToggleStep(6)} onContinue={() => markComplete(6)}>
            <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[6].title}</h2>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 border border-black/5">{VOCAB.length} words</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {VOCAB.map((v) => (
                <button key={v.tib} onClick={() => playAudio(v.read)} disabled={playingItem !== null} className="group relative flex flex-col items-start gap-3 border border-black/10 bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-md">
                  <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: SUFFIXES.find(s => s.key === v.suffix)?.accent || "#000" }} />
                  <div className="flex w-full items-start justify-between">
                    <span className="text-3xl">{v.emoji}</span>
                    {playingItem === v.read ? <Loader2 size={14} className="animate-spin text-amber-500" /> : <Volume2 size={14} className="text-stone-300 group-hover:text-amber-500 transition-colors" />}
                  </div>
                  <div className="font-serif text-[2rem] leading-none text-stone-900 mt-2">{v.tib}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">[{v.translit}]</div>
                  <div className="text-sm font-bold text-stone-600 mt-1 border-t border-black/5 pt-3 w-full">{v.en}</div>
                </button>
              ))}
            </div>
          </StepContainer>

          {/* Step 08: Practice Suite */}
          <StepContainer index={7} step={STEPS[7]} isUnlocked={unlockedStep >= 7} isExpanded={expandedStep === 7} onToggle={() => handleToggleStep(7)} onContinue={() => markComplete(7)}>
            <div className="mb-6 flex flex-col border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900 mb-3">{STEPS[7].title}</h2>
            </div>
            <PracticeSuite playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 09 - Final Test */}
          <StepContainer index={8} step={STEPS[8]} isUnlocked={unlockedStep >= 8} isExpanded={expandedStep === 8} onToggle={() => handleToggleStep(8)} onContinue={() => {}} isLast={true}>
            <LessonFinalTest playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

        </div>
        
        {/* Footer Navigation */}
        <nav className="mt-16 flex flex-col justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row">
          <Link href="/dashboard/lessons/5" className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 border border-transparent hover:border-black/10 bg-white hover:bg-stone-50">
            <ChevronLeft size={16} /> Previous · The Five Prefixes
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
/* Practice & Mastery Handlers                                         */
/* ------------------------------------------------------------------ */

function PracticeSuite({ playAudio, playingItem, playErrorBeep }: any) {
  const [tab, setTab] = useState<"flash" | "quiz" | "match">("flash");
  return (
    <div className="border border-black/10 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap border-b border-black/10 bg-stone-50">
        {[
          { k: "flash", label: "Flashcards", Icon: Layers },
          { k: "quiz", label: "Quiz", Icon: CheckCircle2 },
          { k: "match", label: "Match", Icon: Shuffle },
        ].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k as any)} className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${tab === t.k ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-white hover:text-stone-900"}`}>
            <t.Icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      <div className="p-6 md:p-10 bg-[#fdfbf7]">
        {tab === "flash" && <Flashcards speak={playAudio} playingItem={playingItem} />}
        {tab === "quiz" && <CumulativeQuiz speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
        {tab === "match" && <MatchWordToSound speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
      </div>
    </div>
  );
}

function Flashcards({ speak, playingItem }: any) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const item = QUIZ[i];

  const next = () => { setFlip(false); setI((v) => (v + 1) % QUIZ.length); };
  const prev = () => { setFlip(false); setI((v) => (v - 1 + QUIZ.length) % QUIZ.length); };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-2xl flex items-center justify-between mb-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
        <span>Card {i + 1} of {QUIZ.length}</span>
        <span>Tap card to flip</span>
      </div>

      <button onClick={() => setFlip(!flip)} className="w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-black/10 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center relative group overflow-hidden">
        {!flip ? (
          <span className="font-serif text-[5rem] sm:text-[7rem] text-stone-900 group-hover:scale-105 transition-transform leading-none">{item.word}</span>
        ) : (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <span className="text-3xl font-bold font-mono text-stone-900 mb-4">[{item.read}]</span>
            <span className="text-xs uppercase font-bold tracking-widest text-stone-500 bg-stone-50 px-3 py-1.5 border border-black/5">
              Suffix {SUFFIXES.find((s) => s.key === item.suffix)?.head}
              {item.post ? ` · Post-suffix ${item.post === "sa" ? "ས" : "ད"}` : ""}
            </span>
          </div>
        )}
      </button>

      <div className="w-full max-w-2xl flex items-center justify-between mt-8">
        <button onClick={prev} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-900"><ArrowLeft size={16} /> Prev</button>
        <button onClick={() => speak(item.read)} disabled={playingItem !== null} className="flex items-center gap-2 px-8 py-3 bg-stone-100 border border-black/5 hover:bg-stone-200 text-stone-700 font-bold shadow-sm transition-colors">
          {playingItem === item.read ? <Loader2 size={18} className="animate-spin text-amber-600" /> : <Play size={18} className="fill-current text-amber-500" />} Play
        </button>
        <button onClick={next} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-900">Next <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function CumulativeQuiz({ speak, playingItem, playErrorBeep }: any) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<SuffixKey | null>(null);
  const [score, setScore] = useState(0);
  const [seen, setSeen] = useState(0);
  const item = QUIZ[i];

  const options = useMemo(() => {
    const others = SUFFIXES.filter((s) => s.key !== item.suffix).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...others, SUFFIXES.find((s) => s.key === item.suffix)!].sort(() => Math.random() - 0.5);
  }, [i, item.suffix]);

  const done = seen >= QUIZ.length;

  const answer = (k: SuffixKey) => {
    if (picked) return;
    setPicked(k);
    setSeen((v) => v + 1);
    if (k === item.suffix) setScore((v) => v + 1);
    else playErrorBeep();
  };

  const next = () => { setPicked(null); setI((v) => (v + 1) % QUIZ.length); };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[300px] animate-in zoom-in-95">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Quiz Complete!</h3>
        <p className="text-stone-600 mb-8 font-bold">You scored <span className="text-xl text-emerald-600">{score}</span> out of {QUIZ.length}.</p>
        <button onClick={() => { setSeen(0); setScore(0); setI(0); setPicked(null); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"><Shuffle size={18} /> Try again</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500">
        <span>Question {Math.min(seen + (picked ? 0 : 1), QUIZ.length)} / {QUIZ.length}</span>
        <span className="text-amber-600">Score {score} / {seen}</span>
      </div>
      
      <div className="w-full max-w-4xl flex flex-col items-center gap-6 border border-black/10 bg-white p-10 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1.5 bg-stone-200 w-full">
          <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${(seen / QUIZ.length) * 100}%` }} />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Which suffix closes this word?</span>
        <span className="font-serif leading-none text-stone-900" style={{ fontSize: "7rem" }}>{item.word}</span>
        <button onClick={() => speak(item.read)} disabled={playingItem !== null} className="inline-flex items-center gap-2 border border-black/10 bg-stone-50 px-6 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors mt-2">
          {playingItem === item.read ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className="text-amber-500" />} [{item.read}]
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-2 gap-4 md:grid-cols-4">
        {options.map((o) => {
          const isCorrect = o.key === item.suffix;
          const isPicked = picked === o.key;
          const state = !picked ? "border-black/10 hover:bg-stone-50 hover:border-amber-400" : isCorrect ? "border-emerald-500 bg-emerald-50 shadow-sm" : isPicked ? "border-rose-400 bg-rose-50" : "border-black/10 opacity-50 grayscale";
          return (
            <button key={o.key} onClick={() => answer(o.key)} disabled={!!picked} className={`flex flex-col items-center gap-2 border p-6 transition-all bg-white ${state}`}>
              <span className="font-serif text-[3rem] leading-none" style={{ color: o.accent }}>{o.head}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{o.latin}</span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="w-full max-w-4xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border border-black/10 bg-white shadow-sm">
          <span className={`text-sm font-bold ${picked === item.suffix ? "text-emerald-700" : "text-rose-700"}`}>
            {picked === item.suffix ? `Correct!` : `Incorrect. The suffix is ${SUFFIXES.find(s => s.key === item.suffix)?.head} (${SUFFIXES.find(s => s.key === item.suffix)?.latin}).`}
          </span>
          <button onClick={next} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 px-8 py-3 text-sm font-bold text-stone-900 hover:bg-amber-400 shadow-sm">
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function MatchWordToSound({ speak, playingItem, playErrorBeep }: any) {
  const pool = useMemo(() => QUIZ.slice(0, 6), []);
  const readings = useMemo(() => pool.map((p) => p.read).sort(() => Math.random() - 0.5), [pool]);
  
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const pick = (read: string) => {
    if (!selectedWord) return;
    const targetItem = pool.find(p => p.word === selectedWord);
    if (targetItem?.read === read) {
      setPairs((p) => ({ ...p, [selectedWord]: read }));
      speak(read);
    } else {
      playErrorBeep();
    }
    setSelectedWord(null);
  };

  const solved = pool.every((p) => pairs[p.word] === p.read);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm font-bold text-stone-500 mb-8 self-start w-full max-w-4xl">Match each written word with its reading.</p>
      
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl">
        <div className="space-y-3">
          {pool.map((p) => {
            const active = selectedWord === p.word;
            const paired = pairs[p.word];
            const correct = paired === p.read;
            return (
              <button
                key={p.word} onClick={() => !paired && setSelectedWord(p.word)}
                className={`flex w-full items-center justify-between border px-5 py-4 text-left transition-colors bg-white ${
                  active ? "border-stone-900 bg-stone-900 text-white shadow-sm" : paired ? (correct ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : "border-rose-400 bg-rose-50 text-rose-700") : "border-black/10 hover:border-amber-400 hover:bg-stone-50 text-stone-900"
                }`}
              >
                <span className="font-serif text-3xl leading-none">{p.word}</span>
                {paired && <span className="text-xs font-bold font-mono">[{paired}]</span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {readings.map((r) => {
            const taken = Object.values(pairs).includes(r);
            return (
              <button
                key={r} onClick={() => pick(r)} disabled={taken || !selectedWord}
                className={`flex w-full items-center justify-between border px-5 py-4 text-left transition-colors font-mono font-bold text-lg bg-white ${
                  taken ? "border-black/5 bg-stone-50 opacity-40 text-stone-400" : selectedWord ? "border-amber-400 hover:bg-amber-50 text-amber-700 shadow-sm" : "cursor-not-allowed border-black/10 text-stone-700"
                }`}
              >
                <span>[{r}]</span>
                <ArrowLeft size={18} className={selectedWord && !taken ? "text-amber-500" : "text-transparent"} />
              </button>
            );
          })}
        </div>
      </div>

      {solved && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setPairs({}); setSelectedWord(null); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 shadow-sm transition-colors flex items-center gap-2">
            Reset Board <Shuffle size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Final Lesson Test (QuizModule Implementation)                       */
/* ------------------------------------------------------------------ */

type FlashCardLike = { word: string, read: string };

function LessonFinalTest({ playAudio, playingItem, playErrorBeep }: any) {
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  // Generate 10 mixed questions (Vocab and Suffix examples)
  const questions = useMemo(() => {
    const allExamples = SUFFIXES.flatMap(s => s.examples);
    const qs = [];
    
    // Type 1: Translit -> Tibetan (Vocab) - 4 questions
    const vTargets = [...VOCAB].sort(() => 0.5 - Math.random()).slice(0, 4);
    for (const v of vTargets) {
      const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'vocab',
        questionText: `What is the Tibetan word for "${v.en}"?`,
        answer: v.tib,
        audio: v.translit,
        choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ label: `${x.emoji} ${x.tib}`, value: x.tib }))
      });
    }

    // Type 2: Tibetan -> Sound (Suffix Examples) - 6 questions
    const cTargets = [...allExamples].sort(() => 0.5 - Math.random()).slice(0, 6);
    for (const c of cTargets) {
      const wrongs = allExamples.filter(x => x.read !== c.read).sort(() => 0.5 - Math.random()).slice(0, 3);
      qs.push({
        type: 'combo',
        questionText: "What does this word read?",
        prominentTibetan: c.word,
        answer: c.read,
        audio: c.read,
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
          <Link href="/dashboard/lessons/7" className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm">
            Continue to Unit 07 <ArrowRight size={18} />
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