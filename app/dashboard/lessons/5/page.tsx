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
  Anchor,
  Play,
  Loader2,
  XCircle,
  AlertTriangle
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data & Types                                                        */
/* ------------------------------------------------------------------ */

type Tone = "same" | "up" | "down";
type PrefixKey = "ga" | "da" | "ba" | "ma" | "a";

interface Combo {
  word: string;
  parts: string;
  read: string;
  gloss?: string;
  tone: Tone;
  note?: string;
}

interface Prefix {
  key: PrefixKey;
  head: string;
  latin: string;
  nameTib: string;
  title: string;
  count: string;
  intro: string;
  followedBy: string;
  usage: string;
  combos: Combo[];
  accent: { hex: string };
  family: "silent" | "nasal";
}

const TONE_META: Record<Tone, { label: string; hex: string; Icon: typeof ArrowRight; text: string; bg: string; border: string }> = {
  same: { label: "Tone unchanged", hex: "#16a34a", Icon: ArrowRight, text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  up:   { label: "Higher / nasal", hex: "#b91c1c", Icon: ArrowUp,    text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  down: { label: "Deeper tone",    hex: "#0284c7", Icon: ArrowDown,  text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
};

const PREFIXES: Prefix[] = [
  {
    key: "ga",
    head: "ག",
    latin: "ga",
    nameTib: "ག་སྔོན་འཇུག",
    title: "The Prefix ག",
    count: "10 roots",
    intro: "Prefix ག sits before ten root letters, mostly of the ca, ta, tsa and sha families. It never changes masculine sounds; with feminine roots it deepens the tone; with the letter ཡ it produces a high [yo].",
    followedBy: "ཅ ཉ ཏ ད ན ཙ ཞ ཟ ཡ ཤ ས",
    usage: "Silent in speech. Written-only role for most masculine roots — same sound, same tone. Deepens ད, ཞ, ཟ; raises ཡ to a high tone.",
    accent: { hex: "#b45309" },
    family: "silent",
    combos: [
      { word: "གཙོ་", parts: "ག + ཙ + ོ", read: "tso", gloss: "chief, main", tone: "same" },
      { word: "གཡོ་", parts: "ག + ཡ + ོ", read: "yo", gloss: "sway, motion", tone: "up", note: "ག + ཡ → high [yo]" },
      { word: "གཡུ་", parts: "ག + ཡ + ུ", read: "yu", gloss: "turquoise", tone: "up", note: "ག + ཡ → high tone" },
      { word: "གཞི་", parts: "ག + ཞ + ི", read: "zhi", gloss: "basis, ground", tone: "down" },
      { word: "གཞུ་", parts: "ག + ཞ + ུ", read: "zhu", gloss: "bow", tone: "down" },
      { word: "གཟུ་", parts: "ག + ཟ + ུ", read: "zu", gloss: "upright, impartial", tone: "down" },
      { word: "གསོ་", parts: "ག + ས + ོ", read: "so", gloss: "to heal, nurture", tone: "same" },
    ],
  },
  {
    key: "da",
    head: "ད",
    latin: "da",
    nameTib: "ད་སྔོན་འཇུག",
    title: "The Prefix ད",
    count: "5 roots",
    intro: "Prefix ད precedes ཀ ག ང པ བ མ — five letters after excluding ba's own group. With the very-feminine ང it produces a nasal high tone. With root བ, the whole syllable becomes [wa] in a high tone.",
    followedBy: "ཀ ག ང པ བ མ",
    usage: "Deepens ག; raises ང to a nasal high tone. The stack ད + བ is the classical way to write the [wa] syllable — always high tone.",
    accent: { hex: "#7c3aed" },
    family: "silent",
    combos: [
      { word: "དགེ་", parts: "ད + ག + ེ", read: "ge", gloss: "virtue", tone: "down" },
      { word: "དབུ་", parts: "ད + བ + ུ", read: "wu", gloss: "head (H)", tone: "up", note: "ད + བ → [wa] family" },
      { word: "དབྱེ་", parts: "ད + བ + ྱ + ེ", read: "ye", gloss: "to divide", tone: "up" },
      { word: "དབྲ་", parts: "ད + བ + ྲ", read: "dra", gloss: "Tibetan lineage", tone: "up" },
      { word: "དཔེ་", parts: "ད + པ + ེ", read: "pe", gloss: "example, model", tone: "same" },
    ],
  },
  {
    key: "ba",
    head: "བ",
    latin: "ba",
    nameTib: "བ་སྔོན་འཇུག",
    title: "The Prefix བ",
    count: "14 roots",
    intro: "Prefix བ can precede fourteen root letters spanning several families. It is silent in speech, but on the page distinguishes verbs of different tense.",
    followedBy: "ཀ ག ཅ ཇ ཏ ད ན ཙ ཛ ཞ ཟ ཉ ཤ ས",
    usage: "No pronunciation change for masculine roots. Feminine ག ཇ ད ཞ ཟ deepen; the shift is often subtle in Lhasa speech but decisive in spelling.",
    accent: { hex: "#0f766e" },
    family: "silent",
    combos: [
      { word: "བཀྲ་", parts: "བ + ཀ + ྲ", read: "tra", gloss: "auspicious", tone: "same" },
      { word: "བགོ་", parts: "བ + ག + ོ", read: "go", gloss: "to wear", tone: "down" },
      { word: "བཅུ་", parts: "བ + ཅ + ུ", read: "chu", gloss: "ten", tone: "same" },
      { word: "བདེ་", parts: "བ + ད + ེ", read: "de", gloss: "at ease", tone: "down" },
      { word: "བཞི་", parts: "བ + ཞ + ི", read: "zhi", gloss: "four", tone: "down" },
      { word: "བཟོ་", parts: "བ + ཟ + ོ", read: "zo", gloss: "to make, craft", tone: "down" },
    ],
  },
  {
    key: "ma",
    head: "མ",
    latin: "ma",
    nameTib: "མ་སྔོན་འཇུག",
    title: "The Prefix མ",
    count: "6 roots",
    intro: "Prefix མ turns the root letter into a nasalized sound. It attaches to six letters — mostly of the ka, ca, ta, tsa families — creating recognisable [m’-] onsets in speech.",
    followedBy: "ཁ ག ང ཆ ཇ ཉ ཐ ད ན ཚ ཛ",
    usage: "Nasalises the root. Feminine roots take a lower nasal tone (ma + go → [m'go]); very-feminine roots take a higher nasal tone (ma + no → [m'no]).",
    accent: { hex: "#b91c1c" },
    family: "nasal",
    combos: [
      { word: "མཁོ་", parts: "མ + ཁ + ོ", read: "m'kho", gloss: "needed", tone: "up", note: "nasalized" },
      { word: "མགོ་", parts: "མ + ག + ོ", read: "m'go", gloss: "head", tone: "down", note: "nasalized" },
      { word: "མཐོ་", parts: "མ + ཐ + ོ", read: "m'tho", gloss: "high, tall", tone: "up" },
      { word: "མནོ་", parts: "མ + ན + ོ", read: "m'no", gloss: "to think", tone: "up" },
      { word: "མཚོ་", parts: "མ + ཚ + ོ", read: "m'tsho", gloss: "lake", tone: "up" },
    ],
  },
  {
    key: "a",
    head: "འ",
    latin: "'a",
    nameTib: "འ་སྔོན་འཇུག",
    title: "The Prefix འ",
    count: "10 roots",
    intro: "Prefix འ (‘a-chung) attaches to ten root letters. Like མ, it produces a nasal onset — commonly transcribed as [ng’-]. Very common in verbs and future forms.",
    followedBy: "ཁ ག ཆ ཇ ཐ ད ཕ བ ཚ ཛ",
    usage: "Nasalises the root. Feminine roots deepen (’a + gu → [ng’gu]); very-feminine roots rise ([ng’no]). Root ba is a special case: ’a + ba stays [ba] in a low nasal tone.",
    accent: { hex: "#0284c7" },
    family: "nasal",
    combos: [
      { word: "འཁུ་", parts: "འ + ཁ + ུ", read: "ng'khu", gloss: "to churn", tone: "up" },
      { word: "འགྲོ་", parts: "འ + ག + ྲ + ོ", read: "ng'dro", gloss: "to go", tone: "down" },
      { word: "འཆི་", parts: "འ + ཆ + ི", read: "ng'chi", gloss: "to die", tone: "up" },
      { word: "འཇུ་", parts: "འ + ཇ + ུ", read: "ng'ju", gloss: "to hold", tone: "down" },
      { word: "འདི་", parts: "འ + ད + ི", read: "di", gloss: "this", tone: "down", note: "sometimes reads plain [di]" },
      { word: "འདྲི་", parts: "འ + ད + ྲ + ི", read: "ng'dri", gloss: "to ask", tone: "down" },
      { word: "འབུ་", parts: "འ + བ + ུ", read: "ng'bu", gloss: "insect", tone: "down", note: "འ + བ stays [ba] family" },
      { word: "འབྲི་", parts: "འ + བ + ྲ + ི", read: "ng'dri", gloss: "to write", tone: "down" },
    ],
  },
];

interface Vocab {
  tib: string;
  translit: string;
  en: string;
  emoji: string;
  prefix: PrefixKey;
}

const VOCAB: Vocab[] = [
  { tib: "དགེ་", translit: "ge", en: "virtue", emoji: "🌱", prefix: "ga" },
  { tib: "གཙོ་", translit: "tso", en: "chief, main", emoji: "👑", prefix: "ga" },
  { tib: "གཡུ་", translit: "yu", en: "turquoise", emoji: "🔷", prefix: "ga" },
  { tib: "གཞི་", translit: "zhi", en: "basis, ground", emoji: "🧱", prefix: "ga" },
  { tib: "དབུ་", translit: "wu", en: "head (H)", emoji: "🧠", prefix: "da" },
  { tib: "དཔེ་", translit: "pe", en: "example", emoji: "📖", prefix: "da" },
  { tib: "དབྲ་", translit: "dra", en: "lineage", emoji: "🌳", prefix: "da" },
  { tib: "བཞི་", translit: "zhi", en: "four", emoji: "4️⃣", prefix: "ba" },
  { tib: "བཅུ་", translit: "chu", en: "ten", emoji: "🔟", prefix: "ba" },
  { tib: "བདེ་", translit: "de", en: "at ease", emoji: "🧘", prefix: "ba" },
  { tib: "བཟོ་", translit: "zo", en: "to make, craft", emoji: "🔨", prefix: "ba" },
  { tib: "མགོ་", translit: "m'go", en: "head", emoji: "🗿", prefix: "ma" },
  { tib: "མཐོ་", translit: "m'tho", en: "high, tall", emoji: "📈", prefix: "ma" },
  { tib: "མཚོ་", translit: "m'tsho", en: "lake", emoji: "🏞️", prefix: "ma" },
  { tib: "མཁོ་", translit: "m'kho", en: "needed", emoji: "📌", prefix: "ma" },
  { tib: "མནོ་", translit: "m'no", en: "to think", emoji: "🤔", prefix: "ma" },
  { tib: "འགྲོ་", translit: "ng'dro", en: "to go", emoji: "🚶", prefix: "a" },
  { tib: "འདི་", translit: "di", en: "this", emoji: "👉", prefix: "a" },
  { tib: "འབྲི་", translit: "ng'dri", en: "to write", emoji: "✍️", prefix: "a" },
  { tib: "འཆི་", translit: "ng'chi", en: "to die", emoji: "🕊️", prefix: "a" },
];

const NEVER_TAKE = "ཝ འ ལ ཧ ཨ";

const STEPS = [
  { id: "anatomy", eyebrow: "Step 01", title: "Word formation \u2014 the anatomy of a syllable" },
  { id: "intro", eyebrow: "Step 02", title: "What is a prefix?" },
  { id: "family", eyebrow: "Step 03", title: "Meet the five prefixes" },
  { id: "exceptions", eyebrow: "Step 04", title: "Exceptions worth memorising" },
  { id: "vocab", eyebrow: "Step 05", title: "Vocabulary built from prefixes" },
  { id: "practice", eyebrow: "Step 06", title: "Practice & mastery check" },
  { id: "complete", eyebrow: "Finish", title: "Lesson complete" }
];

/* ------------------------------------------------------------------ */
/* Main Page Component                                                 */
/* ------------------------------------------------------------------ */

export default function PrefixesLesson() {
  const { getToken } = useAuth();
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  
  // Progression Lock State
  const [unlockedStep, setUnlockedStep] = useState<number>(DEV_BYPASS_LOCKS ? 6 : 0);
  const [expandedStep, setExpandedStep] = useState<number>(0);

  // Lesson State
  const [activeTab, setActiveTab] = useState<PrefixKey>("ga");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");

  // Audio API
  const playAudio = async (text: string) => {
    if (playingItem) return;
    setPlayingItem(text);
    try {
      const cleanText = text.replace(/'/g, ""); // Strip out the apostrophes used for transliteration display
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
          <span>Unit 05</span>
          <ChevronRight size={14} />
          <span className="text-stone-900">Prefixes</span>
        </div>

        {/* Hero */}
        <section className="mb-12 grid gap-8 border border-black/10 bg-white p-6 md:grid-cols-[1fr,auto] md:items-end md:p-10 shadow-sm">
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
              Lesson 05 · Foundations
            </div>
            <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl text-stone-900">
              The Five Prefixes
            </h1>
            <p className="mt-2 font-serif text-2xl italic text-stone-500">
              སྔོན་འཇུག་ལྔ།
            </p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-stone-600">
              Five consonants — <span className="font-serif text-xl">ག ད བ མ འ</span> — may sit <em>before</em> a root letter. They shape both <span className="font-bold text-stone-900">spelling</span> (distinguishing verbs and near-homophones on the page) and <span className="font-bold text-stone-900">pronunciation</span> (deepening feminine roots, adding a nasal onset with མ and འ).
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
            <div className="mt-6 grid grid-cols-5 gap-2 text-center">
              {PREFIXES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => playAudio(s.nameTib)}
                  disabled={playingItem !== null}
                  className="group flex flex-col items-center gap-1 border border-black/10 p-2 text-center transition hover:bg-stone-50 hover:border-amber-400"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-serif text-2xl" style={{ color: s.accent.hex }}>{s.head}</span>
                    <span className="text-[9px] uppercase tracking-widest text-stone-500">{s.latin}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          
          {/* Step 01: Anatomy */}
          <StepContainer 
            index={0} 
            step={STEPS[0]} 
            isUnlocked={unlockedStep >= 0} 
            isExpanded={expandedStep === 0}
            onToggle={() => handleToggleStep(0)}
            onContinue={() => markComplete(0)}
          >
            <div className="mb-6 flex flex-col border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900 mb-1">
                How a Tibetan word is built <span className="font-serif italic text-stone-400 ml-2">ཚིག་གི་གྲུབ་སྟངས།</span>
              </h2>
            </div>
            <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-stone-600">
              Before we meet the five prefixes, it helps to see the whole picture. A Tibetan syllable is built from up to <span className="font-bold text-stone-900">seven slots</span> arranged around a single <span className="font-bold text-stone-900">root letter</span>. Each slot has a name, a position, and a job — some shape the <span className="font-bold text-stone-900">spelling</span>, others shift the <span className="font-bold text-stone-900">pronunciation</span>. The <span className="font-bold text-amber-600">prefix</span> is the leftmost of them.
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
                  { letter: "བ", role: "Prefix", tib: "སྔོན་འཇུག", pos: "Before root", accent: "#c2410c", highlight: true },
                  { letter: "ས", role: "Superscript", tib: "མགོ་ཅན", pos: "Above root", accent: "#7c3aed" },
                  { letter: "ག", role: "Root letter", tib: "མིང་གཞི", pos: "The heart", accent: "#111827" },
                  { letter: "ྲ", role: "Subscript", tib: "འདོགས་ཅན", pos: "Below root", accent: "#0284c7" },
                  { letter: "ི", role: "Vowel", tib: "དབྱངས", pos: "Above / below", accent: "#059669" },
                  { letter: "མ", role: "Suffix", tib: "རྗེས་འཇུག", pos: "After root", accent: "#b45309" },
                  { letter: "ས", role: "Post-suffix", tib: "ཡང་འཇུག", pos: "Far right", accent: "#9333ea" },
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
                  Not every syllable uses all seven slots — only the <span className="font-bold text-stone-900">root letter</span> is required. The other six attach around it in fixed positions, following strict rules you’ll learn one slot at a time.
                </span>
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
            <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[1].title}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <ChevronLeft size={14} /> Before the root
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  A prefix is a letter written <span className="font-bold text-stone-900">to the left</span> of the root. Only five letters — <span className="font-serif text-lg">ག ད བ མ འ</span> — may take that seat, and only <span className="font-bold text-stone-900">one</span> prefix per syllable.
                </p>
              </div>
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <BookOpen size={14} /> Writing
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  Prefixes disambiguate words on the page — e.g. <span className="font-serif text-lg">བཞི་</span> “four” vs <span className="font-serif text-lg">གཞི་</span> “basis”. The root that follows a prefix must carry at least a vowel, superscript, or subscript.
                </p>
              </div>
              <div className="p-6 border border-black/10 bg-white">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  <Volume2 size={14} /> Pronunciation
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  Prefixes never change <span className="font-bold text-stone-900">masculine</span> letters. They <span className="font-bold text-sky-700">deepen</span> feminine roots and <span className="font-bold text-rose-700">nasalise</span> very-feminine roots — and only <span className="font-serif text-lg">མ</span> and <span className="font-serif text-lg">འ</span> add a nasal onset.
                </p>
              </div>
            </div>

            <div className="mt-6 border border-black/10 bg-white overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-black/10 text-center">
                {PREFIXES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => {
                      setActiveTab(s.key);
                      markComplete(1);
                    }}
                    className="group flex flex-col items-center gap-2 p-6 transition hover:bg-stone-50"
                  >
                    <span className="h-1 w-10" style={{ backgroundColor: s.accent.hex }} />
                    <span className="mt-2 font-serif leading-none" style={{ fontSize: "3rem", color: s.accent.hex }}>
                      {s.head}
                    </span>
                    <span className="text-sm font-bold text-stone-900">{s.latin}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      {s.count} · {s.family === "nasal" ? "nasalising" : "silent"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 p-6 border border-black/10 bg-white">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                <Info size={14} className="text-amber-500" /> Two rules of writing
              </div>
              <ol className="space-y-4 text-[15px] text-stone-600 font-bold">
                <li className="flex gap-4">
                  <span className="grid size-6 shrink-0 place-items-center rounded bg-stone-100 border border-black/10 text-[11px] text-stone-600">1</span>
                  <span>
                    Only five letters — <span className="font-serif text-xl text-stone-900 mx-1 px-2 py-0.5 bg-stone-100 border border-black/5">{NEVER_TAKE}</span> — <em>never</em> take a prefix.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="grid size-6 shrink-0 place-items-center rounded bg-stone-100 border border-black/10 text-[11px] text-stone-600">2</span>
                  <span>
                    A root that follows a prefix must carry <em>at least</em> a vowel, superscript, or subscript — a prefix cannot sit before a bare consonant.
                  </span>
                </li>
              </ol>
            </div>

            <div className="mt-6 p-6 border border-black/10 bg-stone-50">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                <Info size={14} className="text-amber-500" /> Reading the tone arrows
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(Object.keys(TONE_META) as Tone[]).map((t) => {
                  const M = TONE_META[t];
                  const rule = t === "same" ? "Masculine roots. Prefix is silent." : t === "down" ? "Feminine roots drop in tone." : "Very-feminine roots rise and nasalise.";
                  return (
                    <div key={t} className="flex items-start gap-3 border border-black/5 bg-white p-4 shadow-sm">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: M.hex }}>
                        <M.Icon size={16} strokeWidth={2.5} />
                      </span>
                      <div>
                        <div className="text-sm font-bold text-stone-900">{M.label}</div>
                        <div className="mt-1 text-xs text-stone-500 font-bold">{rule}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-black/5 pb-4 gap-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[2].title}</h2>
              <button
                onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))}
                className="inline-flex items-center gap-2 border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 transition hover:bg-stone-50 hover:text-stone-900"
              >
                {studyMode === "paper" ? <Moon size={14} /> : <Sun size={14} />}
                {studyMode === "paper" ? "Study mode" : "Paper mode"}
              </button>
            </div>

            <p className="mb-6 text-[13px] font-bold uppercase tracking-widest text-stone-500 leading-relaxed">
              Learn the three silent prefixes first — they only shift tone. Then move to the two nasalising prefixes, which add a distinctive [m’-] / [ng’-] onset.
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              {PREFIXES.map((p) => {
                const on = p.key === activeTab;
                return (
                  <button
                    key={p.key}
                    onClick={() => setActiveTab(p.key)}
                    className={`group flex items-center gap-3 border px-4 py-3 text-left transition-colors ${
                      on ? "border-stone-900 bg-stone-900 text-white" : "border-black/10 bg-white text-stone-900 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    <span className="grid size-9 place-items-center font-serif text-xl bg-white/10" style={{ color: on ? '#fff' : p.accent.hex, backgroundColor: on ? 'rgba(255,255,255,0.1)' : `${p.accent.hex}20` }}>
                      {p.head}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold">Prefix {p.latin}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-stone-400" : "text-stone-500"}`}>
                        {p.count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <PrefixPanel 
              p={PREFIXES.find(p => p.key === activeTab)!} 
              night={studyMode === "night"} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
            />
          </StepContainer>

          {/* Step 04 - Exceptions */}
          <StepContainer 
            index={3} 
            step={STEPS[3]} 
            isUnlocked={unlockedStep >= 3} 
            isExpanded={expandedStep === 3}
            onToggle={() => handleToggleStep(3)}
            onContinue={() => markComplete(3)}
          >
            <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[3].title}</h2>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 border border-black/5">3 patterns</span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-6 border border-black/10 bg-white shadow-sm flex flex-col h-full">
                <div className="mb-4 inline-flex items-center gap-2 bg-rose-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-700 self-start">
                  <AlertTriangle size={14} /> ད + བ → [wa]
                </div>
                <div className="font-serif text-[2.5rem] leading-none text-stone-900 mb-4">
                  དབུ་ · དབྱེ་ · དབྲ་
                </div>
                <p className="mt-auto text-sm text-stone-600 leading-relaxed">
                  When ད precedes root བ, the stack reads as the <span className="font-bold text-stone-900">wa</span> family in a high tone: [wu], [ye], [ra].
                </p>
              </div>

              <div className="p-6 border border-black/10 bg-white shadow-sm flex flex-col h-full">
                <div className="mb-4 inline-flex items-center gap-2 bg-rose-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-700 self-start">
                  <AlertTriangle size={14} /> འ + བ → [ba]
                </div>
                <div className="font-serif text-[2.5rem] leading-none text-stone-900 mb-4">
                  འབུ་ · འབྲི་ · འབྲུ་
                </div>
                <p className="mt-auto text-sm text-stone-600 leading-relaxed">
                  With prefix འ the root བ retains its [b-] onset in a low nasal tone: [ng’bu], [ng’dri], [ng’dru].
                </p>
              </div>

              <div className="p-6 border border-black/10 bg-white shadow-sm flex flex-col h-full">
                <div className="mb-4 inline-flex items-center gap-2 bg-rose-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-700 self-start">
                  <AlertTriangle size={14} /> ག + ཡ → [yo]
                </div>
                <div className="font-serif text-[2.5rem] leading-none text-stone-900 mb-4">
                  གཡོ་ · གཡུ་ · གཡི་
                </div>
                <p className="mt-auto text-sm text-stone-600 leading-relaxed">
                  Prefix ག lifts the feminine ཡ to a <span className="font-bold text-stone-900">high</span> tone — the only prefix / root combination that behaves this way.
                </p>
              </div>
            </div>
          </StepContainer>

          {/* Step 05 */}
          <StepContainer 
            index={4} 
            step={STEPS[4]} 
            isUnlocked={unlockedStep >= 4} 
            isExpanded={expandedStep === 4}
            onToggle={() => handleToggleStep(4)}
            onContinue={() => markComplete(4)}
          >
            <div className="mb-6 flex items-center justify-between border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900">{STEPS[4].title}</h2>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 border border-black/5">{VOCAB.length} words</span>
            </div>
            <VocabFilter playAudio={playAudio} playingItem={playingItem} />
          </StepContainer>

          {/* Step 06 */}
          <StepContainer 
            index={5} 
            step={STEPS[5]} 
            isUnlocked={unlockedStep >= 5} 
            isExpanded={expandedStep === 5}
            onToggle={() => handleToggleStep(5)}
            onContinue={() => markComplete(5)}
          >
            <div className="mb-6 flex flex-col border-b border-black/5 pb-4">
              <h2 className="font-serif text-2xl text-stone-900 mb-3">{STEPS[5].title}</h2>
              <p className="max-w-3xl text-[15px] text-stone-600 leading-relaxed">
                Each prefix has its own <span className="font-bold text-stone-900">mastery check</span> within its panel above. Below is a <span className="font-bold text-stone-900">cumulative review</span> that mixes stacks from all five families — the fastest way to lock in the exceptions.
              </p>
            </div>
            <PracticeSuite playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 07 - Final Test */}
          <StepContainer 
            index={6} 
            step={STEPS[6]} 
            isUnlocked={unlockedStep >= 6} 
            isExpanded={expandedStep === 6}
            onToggle={() => handleToggleStep(6)}
            onContinue={() => {}}
            isLast={true}
          >
            <LessonFinalTest playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

        </div>
        
        {/* Footer Navigation */}
        <nav className="mt-16 flex flex-col justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row">
          <Link href="/dashboard/lessons/4" className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 border border-transparent hover:border-black/10 bg-white hover:bg-stone-50">
            <ChevronLeft size={16} /> Previous · The Four Subscripts
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

function PrefixPanel({ p, night, playAudio, playingItem, playErrorBeep }: any) {
  return (
    <div className={`relative overflow-hidden border transition-colors duration-500 ${night ? "border-white/10 bg-[#0f0d0a] text-stone-100" : "border-black/10 bg-white"}`}>
      <div className="h-1 w-full" style={{ backgroundColor: p.accent.hex }} />

      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-black/5">
        <div className="flex items-center gap-6">
          <div className="grid size-28 place-items-center font-serif text-[4rem] leading-none" style={{ backgroundColor: night ? `${p.accent.hex}20` : `${p.accent.hex}15`, color: p.accent.hex }}>
            {p.head}
          </div>
          <div>
            <div className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 ${night ? "text-stone-400" : "text-stone-500"}`}>
              Prefix · {p.family === "nasal" ? "Nasalising" : "Silent"}
            </div>
            <div className="font-serif text-3xl font-bold">{p.title}</div>
            <div className={`mt-1 font-serif text-xl italic ${night ? "text-stone-400" : "text-stone-500"}`}>{p.nameTib}</div>
          </div>
        </div>
        <div>
          <p className={`text-[15px] leading-relaxed p-5 border ${night ? "bg-white/5 border-white/10 text-stone-300" : "bg-stone-50 border-black/5 text-stone-600"}`}>
            {p.intro}<br /><br />
            <span className={night ? "text-white font-bold" : "text-stone-900 font-bold"}>Followed by </span>
            <span className={`font-serif text-xl font-bold ${night ? "text-white" : "text-stone-900"}`}>{p.followedBy}</span>
          </p>
          <div className={`mt-4 flex items-start gap-3 border-l-2 px-4 py-3 text-sm ${night ? "bg-white/5 text-stone-300" : "bg-amber-50 text-stone-900"}`} style={{ borderColor: p.accent.hex }}>
            <Info className="mt-0.5 size-4 shrink-0" style={{ color: p.accent.hex }} />
            <span className="font-bold leading-relaxed">{p.usage}</span>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-px border-b sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${night ? "border-white/10 bg-white/10" : "border-black/10 bg-black/5"}`}>
        {p.combos.map((c: any) => {
          const M = TONE_META[c.tone as Tone];
          return (
            <button key={c.word + c.read} onClick={() => playAudio(c.read)} disabled={playingItem !== null} className={`group relative flex flex-col items-center justify-center gap-1.5 p-6 transition-colors ${night ? "bg-[#0f0d0a] hover:bg-[#1a1712]" : "bg-white hover:bg-stone-50"}`}>
              <span className="absolute left-0 top-0 h-0.5 w-full" style={{ backgroundColor: p.accent.hex }} />
              <span className="font-serif text-[2.5rem] leading-none mb-1" style={{ color: night ? '#fcd34d' : '#1c1917' }}>{c.word}</span>
              <span className={`font-mono text-xs font-bold ${night ? "text-stone-400" : "text-stone-500"}`}>[{c.read}]</span>
              {c.gloss && (
                <span className={`text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-500" : "text-stone-400"}`}>
                  {c.gloss}
                </span>
              )}
              <span className="mt-2 inline-flex size-5 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: M.hex }} title={M.label}>
                <M.Icon size={12} strokeWidth={3} />
              </span>
              {c.note && (
                <span className={`mt-1 text-[9px] font-bold uppercase tracking-widest ${night ? "text-amber-400" : "text-amber-600"}`}>note</span>
              )}
              {playingItem === c.read && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-amber-500" />}
            </button>
          )
        })}
      </div>

      <div className={`p-6 md:p-8 border-b ${night ? "border-white/10 bg-[#0f0d0a]" : "border-black/5 bg-white"}`}>
        <div className={`mb-6 text-[10px] font-bold uppercase tracking-widest ${night ? "text-stone-400" : "text-stone-500"}`}>Spelling walkthrough</div>
        <div className="space-y-2">
          {p.combos.slice(0, 6).map((c: any) => {
            const M = TONE_META[c.tone as Tone];
            return (
              <div key={c.word + c.read} className={`flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 ${night ? "border-white/10 bg-white/5" : "border-black/10 bg-white shadow-sm"}`}>
                <span className="font-serif text-[2.5rem] leading-none w-16 text-center text-stone-900">{c.word}</span>
                <span className={`text-xs font-bold font-serif ${night ? "text-stone-400" : "text-stone-500"}`}>
                  {c.parts}
                </span>
                <ArrowRight size={16} className={night ? "text-stone-600" : "text-stone-300"} />
                <span className={`font-mono text-lg font-bold ${night ? "text-stone-100" : "text-stone-900"}`}>[{c.read}]</span>
                {c.gloss && (
                  <span className={`text-[13px] font-bold italic ${night ? "text-stone-400" : "text-stone-500"}`}>
                    {c.gloss}
                  </span>
                )}
                <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 ${night ? "bg-black/30" : M.bg} ${M.text}`} style={{ color: night ? M.hex : undefined }}>
                  <M.Icon size={14} strokeWidth={2.5} /> {M.label}
                </span>
                <button onClick={() => playAudio(c.read)} disabled={playingItem !== null} className={`inline-grid size-10 place-items-center transition-colors border ${night ? "bg-white/10 border-white/20 hover:bg-white/20 text-amber-400" : "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700"}`}>
                  {playingItem === c.read ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-6 md:p-8 ${night ? "bg-black/40" : "bg-stone-50"}`}>
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: p.accent.hex }} />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${night ? "text-stone-200" : "text-stone-800"}`}>Mastery check · Prefix {p.latin}</span>
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
    if (word === question.answer.word) { setScore(s => s + 1); playAudio(question.answer.read); } else { playErrorBeep(); }
  };

  if (step >= total) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border border-black/10 bg-white">
        <div className={`text-[15px] font-bold ${night ? "text-stone-800" : "text-stone-800"}`}>
          Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: p.accent.hex }}>{score}</span> / {total} on prefix {p.latin}.
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
        <span style={{ color: p.accent.hex }}>Score {score}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className={`text-[15px] font-bold ${night ? "text-stone-300" : "text-stone-600"}`}>Which word reads</span>
        <span className={`font-mono text-2xl font-bold border px-3 py-1 ${night ? "bg-white/10 border-white/20 text-white" : "bg-white border-black/10 text-stone-900"}`}>[{question.answer.read}]</span>
        {question.answer.gloss && (
          <span className={`italic font-bold ${night ? "text-stone-400" : "text-stone-500"}`}>
            “{question.answer.gloss}”
          </span>
        )}
        <button onClick={() => playAudio(question.answer.read)} disabled={playingItem !== null} className={`inline-grid size-10 place-items-center transition-colors border ${night ? "bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30 text-amber-400" : "bg-amber-100 border-amber-200 hover:bg-amber-200 text-amber-700"}`}>
          {playingItem === question.answer.read ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.choices.map((c: any) => {
          const right = picked && c.word === question.answer.word;
          const wrong = picked === c.word && c.word !== question.answer.word;
          return (
            <button
              key={c.word} disabled={!!picked} onClick={() => pick(c.word)}
              className={`flex aspect-[3/2] items-center justify-center border-2 font-serif text-3xl transition-all ${
                right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" 
                : wrong ? "border-rose-400 bg-rose-50 text-rose-700" 
                : night ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white" 
                : "border-black/10 bg-white hover:border-amber-400 hover:bg-amber-50 text-stone-900 hover:shadow-md"
              }`}
            >
              {c.word}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border shadow-sm ${night ? "bg-white/5 border-white/10" : "bg-white border-black/10"}`}>
          <span className={`text-sm font-bold ${picked === question.answer.word ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === question.answer.word ? `Correct — ${question.answer.word} reads [${question.answer.read}].` : `Answer: ${question.answer.word} reads [${question.answer.read}].`}
          </span>
          <button onClick={() => { setPicked(null); setStep(s => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 px-6 py-2.5 text-sm font-bold text-stone-900 hover:bg-amber-400 transition-colors shadow-sm">
            Next <ChevronRight size={16} />
          </button>
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
            <button
              key={c.key}
              onClick={() => setFilter(c.key as any)}
              className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                active ? "border-stone-900 bg-stone-900 text-white shadow-sm" : "border-black/10 bg-white text-stone-500 hover:border-stone-400 hover:text-stone-900"
              }`}
            >
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
            <button key={v.tib + v.translit} onClick={() => playAudio(v.translit)} disabled={playingItem !== null} className="group relative flex flex-col items-start gap-4 border border-black/10 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: hex }} />
              <div className="flex w-full items-start justify-between">
                <span className="text-3xl">{v.emoji}</span>
                <span className="inline-grid size-8 place-items-center bg-stone-50 border border-black/5 text-amber-500 transition-colors group-hover:bg-amber-50 group-hover:border-amber-200">
                  {playingItem === v.translit ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </span>
              </div>
              <div className="w-full border-b border-black/5 pb-3">
                <div className="font-serif text-[28px] font-bold leading-tight text-stone-900 mb-1">{v.tib}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">[{v.translit}]</div>
              </div>
              <div className="text-sm font-bold text-stone-600">{v.en}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 border border-black/5 bg-stone-50 p-6 flex flex-col items-center sm:items-start sm:flex-row gap-6">
        <div className="bg-white border border-black/10 p-3 shadow-sm shrink-0">
          <Info size={24} className="text-amber-500" />
        </div>
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Reminder · Letters that never take a prefix
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 tracking-[0.2em] leading-relaxed">
            {NEVER_TAKE}
          </p>
        </div>
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
        {tab === "match" && <MatchWordToSound speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />}
        {tab === "srs" && <MemoryReview speak={playAudio} playingItem={playingItem} />}
      </div>
    </div>
  );
}

type FlashCard =
  | { kind: "word"; tib: string; translit: string; en: string; prefix: PrefixKey; spoken: string; emoji: string }
  | { kind: "stack"; tib: string; translit: string; en: string; prefix: PrefixKey; spoken: string; emoji?: string };

function Flashcards({ speak, playingItem }: any) {
  const [mode, setMode] = useState<"stacks" | "words">("stacks");
  const deck = useMemo<FlashCard[]>(() => {
    if (mode === "stacks") {
      return PREFIXES.flatMap((s) => s.combos.map((c) => ({ kind: "stack" as const, tib: c.word, translit: c.read, en: c.gloss ?? TONE_META[c.tone].label, prefix: s.key, spoken: c.read })));
    }
    return VOCAB.map((v) => ({ kind: "word" as const, tib: v.tib, translit: v.translit, en: v.en, prefix: v.prefix, spoken: v.translit, emoji: v.emoji }));
  }, [mode]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck[idx % deck.length];
  const accent = accentFor(card.prefix);

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % deck.length); };
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + deck.length) % deck.length); };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center mb-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest gap-4">
        <div className="flex flex-wrap gap-2">
          {(["stacks", "words"] as const).map((k) => (
            <button key={k} onClick={() => { setMode(k); setIdx(0); setFlipped(false); }} className={`px-4 py-2 border transition-colors ${mode === k ? "bg-stone-900 text-white border-stone-900" : "bg-white border-black/10 text-stone-500 hover:bg-stone-50"}`}>
              {k === "stacks" ? `Stacks · ${PREFIXES.reduce((a, s) => a + s.combos.length, 0)}` : `Vocab · ${VOCAB.length}`}
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
            </div>
          ) : (
            <span className="text-6xl md:text-8xl font-serif text-stone-900 group-hover:scale-105 transition-transform">{card.tib}</span>
          )
        ) : (
          <div className="max-w-md px-6 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 leading-relaxed">{card.en}</div>
            <div className="text-sm sm:text-lg text-stone-500 font-bold uppercase tracking-widest">[{card.translit}]</div>
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
  const all = useMemo(() => PREFIXES.flatMap((s) => s.combos.map((c) => ({ ...c, prefix: s.key }))), []);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const q = useMemo(() => {
    const answer = all[Math.floor(Math.random() * all.length)];
    const others = all.filter((x) => x.word !== answer.word);
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
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">What does this word read?</span>
        <span className="font-serif leading-none text-stone-900" style={{ fontSize: "7rem" }}>{q.answer.word}</span>
        <button onClick={() => speak(q.answer.read)} disabled={playingItem !== null} className="inline-flex items-center gap-2 border border-black/10 bg-stone-50 px-6 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors">
          {playingItem === q.answer.read ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className="text-amber-500" />} Play Hint
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-2 gap-4 md:grid-cols-4">
        {q.choices.map((c) => {
          const right = picked && c.read === q.answer.read;
          const wrong = picked === c.read && c.read !== q.answer.read;
          return (
            <button
              key={c.word + c.read} disabled={!!picked}
              onClick={() => { setPicked(c.read); if (c.read === q.answer.read) { setScore((s) => s + 1); speak(q.answer.read); } else { playErrorBeep(); } }}
              className={`border p-6 text-center transition-all ${
                right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700" : "border-black/10 bg-white hover:border-amber-400 hover:bg-amber-50 hover:shadow-md"
              }`}
            >
              <div className="font-mono text-xl font-bold mb-2">[{c.read}]</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{TONE_META[c.tone as Tone].label}</div>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="w-full max-w-4xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border border-black/10 bg-white shadow-sm">
          <span className={`text-sm font-bold ${picked === q.answer.read ? "text-emerald-700" : "text-rose-700"}`}>
            {picked === q.answer.read ? `Correct — ${q.answer.word} reads [${q.answer.read}].` : `The answer was [${q.answer.read}].`}
          </span>
          <button onClick={() => { setPicked(null); setStep((s) => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 px-8 py-3 text-sm font-bold text-stone-900 hover:bg-amber-400 shadow-sm">
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function MatchWordToSound({ speak, playingItem, playErrorBeep }: any) {
  const [seed, setSeed] = useState(0);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  
  const questions = useMemo(() => {
    const pool = PREFIXES.flatMap((s) => s.combos.map((c) => ({ ...c, prefix: s.key })));
    const targets = pool.sort(() => 0.5 - Math.random()).slice(0, 6);
    return targets.map(target => {
      const distractors = pool.filter(i => i.read !== target.read).sort(() => 0.5 - Math.random()).slice(0, 2);
      return { target, options: [target, ...distractors].sort(() => 0.5 - Math.random()) };
    });
  }, [seed]);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm font-bold text-stone-500 mb-8 self-start w-full max-w-4xl">Match each prefixed word with the sound it reads.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {questions.map((q, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-black/10 shadow-sm gap-4 sm:gap-2">
            <div className="text-4xl font-serif text-stone-900 sm:ml-4 text-center sm:text-left">{q.target.word}</div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto sm:mr-2">
              {q.options.map(opt => {
                const isSelected = matchAnswers[q.target.word] === opt.read;
                const isCorrect = q.target.read === opt.read;
                const isAnswered = !!matchAnswers[q.target.word];
                let btnClass = "border-black/10 text-stone-600 hover:bg-stone-50 cursor-pointer font-mono";
                if (isAnswered) {
                  if (isCorrect) { btnClass = isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm font-mono" : "border-emerald-400 border-dashed bg-emerald-50/50 text-emerald-600 font-mono"; } 
                  else { btnClass = isSelected ? "border-rose-500 bg-rose-50 text-rose-700 cursor-default font-mono" : "border-black/5 bg-stone-50 text-stone-300 opacity-50 cursor-default font-mono"; }
                }
                return (
                  <button key={opt.word + opt.read} onClick={() => { if(!isAnswered){ setMatchAnswers(p => ({ ...p, [q.target.word]: opt.read })); if(isCorrect) speak(opt.read); else playErrorBeep(); } else if (isCorrect) { speak(opt.read); } }} disabled={playingItem !== null || (isAnswered && !isCorrect)} className={`relative px-4 py-2 text-[13px] font-bold border transition-colors flex items-center justify-center min-w-[5rem] text-center ${btnClass}`}>
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
          <button onClick={() => { setMatchAnswers({}); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 shadow-sm transition-colors flex items-center gap-2">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MemoryReview({ speak, playingItem }: any) {
  const items = useMemo(() => PREFIXES.flatMap((s) => s.combos.map((c) => ({ ...c, prefix: s.key }))), []);

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
          <div className="text-7xl sm:text-8xl md:text-[8rem] font-serif text-stone-900 mb-6 leading-none text-center">{deck[0].word}</div>
          <div className="text-sm italic text-stone-500 font-bold mb-8">
            [{deck[0].read}] · {TONE_META[deck[0].tone as Tone].label} {deck[0].gloss && `· ${deck[0].gloss}`}
          </div>
          <button onClick={() => speak(deck[0].read)} disabled={playingItem !== null} className="flex items-center gap-2 px-6 py-2.5 bg-stone-50 border border-black/10 hover:bg-stone-100 text-stone-700 font-bold transition-colors text-sm shadow-sm">
            {playingItem === deck[0].read ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className="text-amber-500" />} Check Sound
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

  // Generate 10 mixed questions (Vocab and Prefixes)
  const questions = useMemo(() => {
    const allCombos = PREFIXES.flatMap(s => s.combos);
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

    // Type 2: Tibetan -> Sound (Prefixes) - 6 questions
    const cTargets = [...allCombos].sort(() => 0.5 - Math.random()).slice(0, 6);
    for (const c of cTargets) {
      const wrongs = allCombos.filter(x => x.read !== c.read).sort(() => 0.5 - Math.random()).slice(0, 3);
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
          <Link href="/dashboard/lessons/6" className="px-8 py-3.5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm">
            Continue to Unit 06 <ArrowRight size={18} />
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