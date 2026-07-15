"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ChevronRight, RefreshCcw, Play, Loader2 } from "lucide-react";

// The tone classifications based strictly on the provided visual grid
type ToneClass = 'HIGH_UNASPIRATED' | 'HIGH_ASPIRATED' | 'LOW_SEMI_ASPIRATED' | 'LOW_NASAL';

const TIBETAN_ALPHABET = [
  { letter: "ཀ", phonetic: "KA", wylie: "[ka]", tone: "HIGH_UNASPIRATED" },
  { letter: "ཁ", phonetic: "KHA", wylie: "[kha]", tone: "HIGH_ASPIRATED" },
  { letter: "ག", phonetic: "GA", wylie: "[kha]", tone: "LOW_SEMI_ASPIRATED" }, // Pronounced kha in Lhasa
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

const TONE_COLORS = {
  HIGH_UNASPIRATED: "border-sky-500",      // Blue
  HIGH_ASPIRATED: "border-amber-500",      // Yellow/Orange
  LOW_SEMI_ASPIRATED: "border-purple-500", // Purple
  LOW_NASAL: "border-rose-500"             // Red
};

export default function LessonDetailPage() {
  const { getToken } = useAuth();
  const [activeFilter, setActiveFilter] = useState<ToneClass | 'ALL'>('ALL');
  const [playingLetter, setPlayingLetter] = useState<string | null>(null);

  // Play audio directly from the backend
  const playAlphabetLetter = async (letter: string) => {
    if (playingLetter) return;
    setPlayingLetter(letter);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("text", letter);
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
          audio.onended = () => setPlayingLetter(null);
          audio.play().catch(() => setPlayingLetter(null));
          return;
        }
      }
    } catch (e) { console.error("Audio playback failed", e); }
    setPlayingLetter(null);
  };

  const filteredAlphabet = activeFilter === 'ALL' 
    ? TIBETAN_ALPHABET 
    : TIBETAN_ALPHABET.filter(item => item.tone === activeFilter);

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-stone-800 font-sans pb-32">
      
      {/* BREADCRUMBS */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-8 uppercase tracking-widest">
          <Link href="/dashboard/lessons" className="hover:text-stone-800 transition-colors">My Lessons</Link>
          <ChevronRight size={14} />
          <span>Unit 01</span>
          <ChevronRight size={14} />
          <span className="text-stone-800 font-bold">The 30 Consonants</span>
        </div>

        {/* HERO SECTION */}
        <div className="space-y-4 mb-12">
          <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em]">Lesson 01 · Foundations</div>
          <h1 className="text-4xl sm:text-5xl font-serif text-stone-900 leading-tight">The 30 Tibetan Consonants</h1>
          <div className="text-xl font-medium text-stone-600 mb-4 font-serif">གསལ་བྱེད་སུམ་ཅུ།</div>
          <p className="text-[15px] text-stone-600 leading-relaxed max-w-3xl">
            The Tibetan alphabet is built on thirty root letters — the foundation of every word you will read, write, and speak. Learn each letter's shape, tone, and traditional gender classification, then practise with vocabulary formed from these consonants alone.
          </p>
        </div>

        {/* PROGRESS & STATS GRID */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">Lesson Progress</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500">6 of 8 Sections</span>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-amber-400 w-3/4 rounded-full"></div>
          </div>

          {/* Stats Boxes */}
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

        {/* SECTION 1: THE ALPHABET GRID */}
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 01</div>
              <h2 className="text-3xl font-serif text-stone-900">The alphabet, as a type specimen</h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors uppercase tracking-widest">
              <RefreshCcw size={14} /> Study Mode
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-8 text-[10px] font-bold tracking-widest uppercase">
            <button 
              onClick={() => setActiveFilter('ALL')}
              className={`px-4 py-2 rounded border transition-colors ${activeFilter === 'ALL' ? 'bg-stone-900 text-white border-stone-900' : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-400'}`}
            >
              All 30
            </button>
            <button 
              onClick={() => setActiveFilter('HIGH_UNASPIRATED')}
              className={`px-4 py-2 rounded border transition-colors ${activeFilter === 'HIGH_UNASPIRATED' ? 'bg-stone-100 text-stone-900 border-stone-300' : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-400'}`}
            >
              High · Unaspirated
            </button>
            <button 
              onClick={() => setActiveFilter('HIGH_ASPIRATED')}
              className={`px-4 py-2 rounded border transition-colors ${activeFilter === 'HIGH_ASPIRATED' ? 'bg-stone-100 text-stone-900 border-stone-300' : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-400'}`}
            >
              High · Aspirated
            </button>
            <button 
              onClick={() => setActiveFilter('LOW_SEMI_ASPIRATED')}
              className={`px-4 py-2 rounded border transition-colors ${activeFilter === 'LOW_SEMI_ASPIRATED' ? 'bg-stone-100 text-stone-900 border-stone-300' : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-400'}`}
            >
              Low · Semi-Aspirated
            </button>
            <button 
              onClick={() => setActiveFilter('LOW_NASAL')}
              className={`px-4 py-2 rounded border transition-colors ${activeFilter === 'LOW_NASAL' ? 'bg-stone-100 text-stone-900 border-stone-300' : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-400'}`}
            >
              Low · Nasal
            </button>
          </div>

          {/* Grid Layout (Exactly like screenshot) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-stone-200 bg-white">
            {filteredAlphabet.map((item, index) => (
              <button
                key={index}
                onClick={() => playAlphabetLetter(item.letter)}
                disabled={playingLetter !== null}
                className={`relative flex flex-col items-center justify-center p-8 border-b border-r border-stone-200 bg-white hover:bg-stone-50 transition-colors group h-40 ${TONE_COLORS[item.tone as ToneClass]} border-t-4`}
              >
                <div className="text-5xl font-serif text-stone-900 group-hover:scale-110 transition-transform mb-4">{item.letter}</div>
                <div className="absolute bottom-4 left-4 text-left">
                  <div className="text-[11px] font-bold tracking-widest text-stone-800 uppercase leading-none mb-1">{item.phonetic}</div>
                  <div className="text-[10px] text-stone-400 tracking-widest leading-none">{item.wylie}</div>
                </div>

                {/* Loading spinner for audio */}
                {playingLetter === item.letter && (
                  <div className="absolute top-4 right-4">
                    <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <span className="text-stone-500">Legend</span>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-500"></div> High · Unaspirated</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500"></div> High · Aspirated</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500"></div> Low · Semi-aspirated</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500"></div> Low · Nasal</div>
          </div>
          
        </div>
      </div>
    </div>
  );
}