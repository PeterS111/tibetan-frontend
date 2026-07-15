"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { 
  ChevronRight, RefreshCcw, Play, Loader2, Info, 
  Layers, PenTool, Headphones, Shuffle, ToggleLeft, ArrowLeft, ArrowRight, CheckCircle2 
} from "lucide-react";

type ToneClass = 'HIGH_UNASPIRATED' | 'HIGH_ASPIRATED' | 'LOW_SEMI_ASPIRATED' | 'LOW_NASAL';

const TIBETAN_ALPHABET = [
  { letter: "ཀ", phonetic: "KA", wylie: "[ka]", tone: "HIGH_UNASPIRATED" },
  { letter: "ཁ", phonetic: "KHA", wylie: "[kha]", tone: "HIGH_ASPIRATED" },
  { letter: "ག", phonetic: "GA", wylie: "[kha]", tone: "LOW_SEMI_ASPIRATED" }, 
  { letter: "ང", phonetic: "NGA", wylie: "[nga]", tone: "LOW_NASAL" },
  { letter: "ཅ", phonetic: "CA", wylie: "[ca]", tone: "HIGH_UNASPIRATED" },
  { letter: "ཆ", phonetic: "CHA", wylie: "[chha]", tone: "HIGH_ASPIRATED" },
  { letter: "ཇ", phonetic: "JA", wylie: "[chha]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ཉ", phonetic: "NYA", wylie: "[nya]", tone: "LOW_NASAL" },
  { letter: "ཏ", phonetic: "TA", wylie: "[ta]", tone: "HIGH_UNASPIRATED" },
  { letter: "ཐ", phonetic: "THA", wylie: "[tha]", tone: "HIGH_ASPIRATED" },
  { letter: "ད", phonetic: "DA", wylie: "[tha]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ན", phonetic: "NA", wylie: "[na]", tone: "LOW_NASAL" },
  { letter: "པ", phonetic: "PA", wylie: "[pa]", tone: "HIGH_UNASPIRATED" },
  { letter: "ཕ", phonetic: "PHA", wylie: "[pha]", tone: "HIGH_ASPIRATED" },
  { letter: "བ", phonetic: "BA", wylie: "[pha]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "མ", phonetic: "MA", wylie: "[ma]", tone: "LOW_NASAL" },
  { letter: "ཙ", phonetic: "TSA", wylie: "[tsa]", tone: "HIGH_UNASPIRATED" },
  { letter: "ཚ", phonetic: "TSHA", wylie: "[ts'ha]", tone: "HIGH_ASPIRATED" },
  { letter: "ཛ", phonetic: "DZA", wylie: "[ts'ha]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ཝ", phonetic: "WA", wylie: "[wa]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ཞ", phonetic: "ZHA", wylie: "[sha]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ཟ", phonetic: "ZA", wylie: "[sa]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "འ", phonetic: "'A", wylie: "[ah]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ཡ", phonetic: "YA", wylie: "[ya]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ར", phonetic: "RA", wylie: "[ra]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ལ", phonetic: "LA", wylie: "[la]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ཤ", phonetic: "SHA", wylie: "[shha]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ས", phonetic: "SA", wylie: "[s'ha]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ཧ", phonetic: "HA", wylie: "[ha]", tone: "LOW_SEMI_ASPIRATED" },
  { letter: "ཨ", phonetic: "A", wylie: "[a]", tone: "HIGH_UNASPIRATED" }
];

const VOCABULARY = [
  { tib: "ཁ་བ་", wylie: "kha-wa", eng: "snow", emoji: "❄️" },
  { tib: "ང་", wylie: "nga", eng: "I / me", emoji: "🙋" },
  { tib: "ཇ་མ་", wylie: "ja-ma", eng: "cook", emoji: "👨‍🍳" },
  { tib: "ཉ་", wylie: "nya", eng: "fish", emoji: "🐟" },
  { tib: "ཐ་མ་", wylie: "tha-ma", eng: "cigarette", emoji: "🚬" },
  { tib: "ཨ་མ་", wylie: "a-ma", eng: "mother", emoji: "👩" },
  { tib: "ན་ཚ་", wylie: "na-tsha", eng: "illness", emoji: "🏥" },
  { tib: "ཤ་", wylie: "sha", eng: "meat", emoji: "🍖" },
  { tib: "ཕ་མ་", wylie: "pha-ma", eng: "parents", emoji: "👨‍👩‍👧" },
  { tib: "ཨ་ར་", wylie: "a-ra", eng: "beard", emoji: "🧔" },
  { tib: "ཤ་བ་", wylie: "sha-wa", eng: "deer", emoji: "🦌" },
  { tib: "ཁ་", wylie: "kha", eng: "mouth", emoji: "👄" },
  { tib: "ར་", wylie: "ra", eng: "goat", emoji: "🐐" },
  { tib: "ཇ་", wylie: "ja", eng: "tea", emoji: "🍵" },
  { tib: "ཟ་མ་", wylie: "za-ma", eng: "food", emoji: "🍲" },
  { tib: "ཉ་པ་", wylie: "nya-pa", eng: "fisherman", emoji: "🎣" },
  { tib: "ཁ་ཚ་མ་", wylie: "kha-tsha-ma", eng: "chilli", emoji: "🌶️" },
  { tib: "ཀ་བ་", wylie: "ka-wa", eng: "pillar", emoji: "🏛️" },
];

const TONE_COLORS = {
  HIGH_UNASPIRATED: "border-t-[#0ea5e9]",
  HIGH_ASPIRATED: "border-t-[#f59e0b]",
  LOW_SEMI_ASPIRATED: "border-t-[#a855f7]",
  LOW_NASAL: "border-t-[#f43f5e]"
};

export default function LessonDetailPage() {
  const { getToken } = useAuth();
  
  // Section 1 State
  const [activeFilter, setActiveFilter] = useState<ToneClass | 'ALL'>('ALL');
  const [playingItem, setPlayingItem] = useState<string | null>(null);

  // Section 5 (Flashcards) State
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [activePracticeTab, setActivePracticeTab] = useState('Flashcards');

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

  const filteredAlphabet = activeFilter === 'ALL' 
    ? TIBETAN_ALPHABET 
    : TIBETAN_ALPHABET.filter(item => item.tone === activeFilter);

  // Flashcard controls
  const handleNextCard = () => {
    setIsCardFlipped(false);
    setFlashcardIdx((prev) => (prev + 1) % TIBETAN_ALPHABET.length);
  };

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    setFlashcardIdx((prev) => (prev - 1 + TIBETAN_ALPHABET.length) % TIBETAN_ALPHABET.length);
  };

  const currentFlashcard = TIBETAN_ALPHABET[flashcardIdx];

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-stone-800 font-sans pb-40 relative">
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* BREADCRUMBS & HERO */}
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-8 uppercase tracking-widest">
          <Link href="/dashboard/lessons" className="hover:text-stone-800 transition-colors">My Lessons</Link>
          <ChevronRight size={14} />
          <span>Unit 01</span>
          <ChevronRight size={14} />
          <span className="text-stone-800 font-bold">The 30 Consonants</span>
        </div>

        <div className="space-y-4 mb-12">
          <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em]">Lesson 01 · Foundations</div>
          <h1 className="text-4xl sm:text-5xl font-serif text-stone-900 leading-tight">The 30 Tibetan Consonants</h1>
          <div className="text-xl font-medium text-stone-600 mb-4 font-serif">གསལ་བྱེད་སུམ་ཅུ།</div>
          <p className="text-[15px] text-stone-600 leading-relaxed max-w-3xl">
            The Tibetan alphabet is built on thirty root letters — the foundation of every word you will read, write, and speak. Learn each letter's shape, tone, and traditional gender classification, then practise with vocabulary formed from these consonants alone.
          </p>
        </div>

        {/* PROGRESS GRID */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">Lesson Progress</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500">6 of 8 Sections</span>
          </div>
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-amber-400 w-3/4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 border border-stone-200 rounded-lg bg-[#fdfbf7]">
            <div className="p-6 flex flex-col items-center justify-center border-r border-stone-200">
              <span className="text-3xl font-serif text-stone-800 mb-1">30</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Letters</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center border-r border-stone-200">
              <span className="text-3xl font-serif text-stone-800 mb-1">4</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Tones</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
              <span className="text-3xl font-serif text-stone-800 mb-1">5</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Genders</span>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-stone-200 mb-16"></div>

        {/* ========================================================= */}
        {/* SECTION 01: THE ALPHABET GRID */}
        {/* ========================================================= */}
        <div className="mb-20">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 01</div>
              <h2 className="text-3xl font-serif text-stone-900">The alphabet, as a type specimen</h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors uppercase tracking-widest">
              <RefreshCcw size={14} /> Study Mode
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8 text-[10px] font-bold tracking-widest uppercase">
            <button onClick={() => setActiveFilter('ALL')} className={`px-4 py-2 rounded transition-colors ${activeFilter === 'ALL' ? 'bg-stone-900 text-white' : 'bg-transparent text-stone-500 border border-stone-200 hover:border-stone-400'}`}>All 30</button>
            <button onClick={() => setActiveFilter('HIGH_UNASPIRATED')} className={`px-4 py-2 rounded transition-colors ${activeFilter === 'HIGH_UNASPIRATED' ? 'bg-stone-100 text-stone-900 border border-stone-300' : 'bg-transparent text-stone-500 border border-stone-200 hover:border-stone-400'}`}>High · Unaspirated</button>
            <button onClick={() => setActiveFilter('HIGH_ASPIRATED')} className={`px-4 py-2 rounded transition-colors ${activeFilter === 'HIGH_ASPIRATED' ? 'bg-stone-100 text-stone-900 border border-stone-300' : 'bg-transparent text-stone-500 border border-stone-200 hover:border-stone-400'}`}>High · Aspirated</button>
            <button onClick={() => setActiveFilter('LOW_SEMI_ASPIRATED')} className={`px-4 py-2 rounded transition-colors ${activeFilter === 'LOW_SEMI_ASPIRATED' ? 'bg-stone-100 text-stone-900 border border-stone-300' : 'bg-transparent text-stone-500 border border-stone-200 hover:border-stone-400'}`}>Low · Semi-Aspirated</button>
            <button onClick={() => setActiveFilter('LOW_NASAL')} className={`px-4 py-2 rounded transition-colors ${activeFilter === 'LOW_NASAL' ? 'bg-stone-100 text-stone-900 border border-stone-300' : 'bg-transparent text-stone-500 border border-stone-200 hover:border-stone-400'}`}>Low · Nasal</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-stone-200 bg-white">
            {filteredAlphabet.map((item, index) => (
              <button
                key={index}
                onClick={() => playAudio(item.letter)}
                disabled={playingItem !== null}
                className={`relative flex flex-col items-center justify