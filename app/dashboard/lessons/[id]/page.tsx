"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { 
  ChevronRight, RefreshCcw, Play, Loader2, Info, 
  Layers, PenTool, Headphones, Shuffle, ArrowLeft, ArrowRight, CheckCircle2, X, PlusSquare, Volume2, XCircle, BookOpen
} from "lucide-react";

type ToneClass = 'HIGH_UNASPIRATED' | 'HIGH_ASPIRATED' | 'LOW_SEMI_ASPIRATED' | 'LOW_NASAL';

const TIBETAN_ALPHABET = [
  { letter: "ཀ", phonetic: "KA", wylie: "[ka]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "A crisp, high 'k' sound with no breath." },
  { letter: "ཁ", phonetic: "KHA", wylie: "[kha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "Like 'k' in 'kite', but with a strong puff of air." },
  { letter: "ག", phonetic: "GA", wylie: "[kha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'ga'; pronounced as a low, soft 'kha'." },
  { letter: "ང", phonetic: "NGA", wylie: "[nga]", tone: "LOW_NASAL", gender: "Very Feminine", note: "Like 'ng' in 'sing', but at the start of the syllable." },
  { letter: "ཅ", phonetic: "CA", wylie: "[ca]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "Like 'ch' in 'cheese', but sharp and unbreathed." },
  { letter: "ཆ", phonetic: "CHA", wylie: "[chha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "Like 'ch' with a strong puff of air." },
  { letter: "ཇ", phonetic: "JA", wylie: "[chha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'ja'; pronounced as a low, soft 'chha'." },
  { letter: "ཉ", phonetic: "NYA", wylie: "[nya]", tone: "LOW_NASAL", gender: "Very Feminine", note: "Like 'ny' in 'canyon', spoken low in the voice." },
  { letter: "ཏ", phonetic: "TA", wylie: "[ta]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "A sharp 't' with the tongue touching the teeth." },
  { letter: "ཐ", phonetic: "THA", wylie: "[tha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "A high 't' with a strong puff of air." },
  { letter: "ད", phonetic: "DA", wylie: "[tha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'da'; pronounced as a low, soft 'tha'." },
  { letter: "ན", phonetic: "NA", wylie: "[na]", tone: "LOW_NASAL", gender: "Very Feminine", note: "A standard 'n' sound, spoken low in the voice." },
  { letter: "པ", phonetic: "PA", wylie: "[pa]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "A crisp, high 'p' with no breath." },
  { letter: "ཕ", phonetic: "PHA", wylie: "[pha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "A high 'p' with a strong puff of air." },
  { letter: "བ", phonetic: "BA", wylie: "[pha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'ba'; pronounced as a low, soft 'pha'." },
  { letter: "མ", phonetic: "MA", wylie: "[ma]", tone: "LOW_NASAL", gender: "Very Feminine", note: "A standard 'm' sound, spoken low in the voice." },
  { letter: "ཙ", phonetic: "TSA", wylie: "[tsa]", tone: "HIGH_UNASPIRATED", gender: "Masculine", note: "Like 'ts' in 'cats', sharp and unbreathed." },
  { letter: "ཚ", phonetic: "TSHA", wylie: "[ts'ha]", tone: "HIGH_ASPIRATED", gender: "Neuter", note: "High 'ts' with a strong puff of air." },
  { letter: "ཛ", phonetic: "DZA", wylie: "[ts'ha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'dza'; pronounced as a low, soft 'ts'ha'." },
  { letter: "ཝ", phonetic: "WA", wylie: "[wa]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Like 'w' in 'water', spoken low." },
  { letter: "ཞ", phonetic: "ZHA", wylie: "[sha]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'zha'; pronounced as a low, soft 'sha'." },
  { letter: "ཟ", phonetic: "ZA", wylie: "[sa]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Written 'za'; pronounced as a low, soft 'sa'." },
  { letter: "འ", phonetic: "'A", wylie: "[ah]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "The soft, low-toned glottal root." },
  { letter: "ཡ", phonetic: "YA", wylie: "[ya]", tone: "LOW_SEMI_ASPIRATED", gender: "Feminine", note: "Like 'y' in 'yellow', spoken low." },
  { letter: "ར", phonetic: "RA", wylie: "[ra]", tone: "LOW_SEMI_ASPIRATED", gender: "Sub-Feminine", note: "A lightly rolled or tapped 'r'." },
  { letter: "ལ", phonetic: "LA", wylie: "[la]", tone: "LOW_SEMI_ASPIRATED", gender: "Sub-Feminine", note: "A standard 'l' sound." },
  { letter: "ཤ", phonetic: "SHA", wylie: "[shha]", tone: "LOW_SEMI_ASPIRATED", gender: "Sub-Feminine", note: "Like 'sh' in 'shine', spoken high in the voice." },
  { letter: "ས", phonetic: "SA", wylie: "[s'ha]", tone: "LOW_SEMI_ASPIRATED", gender: "Sub-Feminine", note: "A standard 's' sound, spoken high in the voice." },
  { letter: "ཧ", phonetic: "HA", wylie: "[ha]", tone: "LOW_SEMI_ASPIRATED", gender: "Root", note: "The high-toned aspirated breath root." },
  { letter: "ཨ", phonetic: "A", wylie: "[a]", tone: "HIGH_UNASPIRATED", gender: "Root", note: "The high-toned neutral vowel carrier." }
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

const TONE_INFO: Record<string, { label: string, desc: string, bg: string, text: string }> = {
  HIGH_UNASPIRATED: { label: "High · Unaspirated", desc: "Pronounced high in the voice, with no puff of air. Say the sound cleanly, keeping the pitch bright.", bg: "bg-sky-50 border-sky-100", text: "text-sky-700" },
  HIGH_ASPIRATED: { label: "High · Aspirated", desc: "Pronounced high in the voice with a strong puff of air, as if adding a breathy 'h' after the sound.", bg: "bg-amber-50 border-amber-100", text: "text-amber-700" },
  LOW_SEMI_ASPIRATED: { label: "Low · Semi-aspirated", desc: "Pronounced low in the voice with a light, softened aspiration. The pitch drops and the sound is gentler than its high-tone counterpart.", bg: "bg-purple-50 border-purple-100", text: "text-purple-700" },
  LOW_NASAL: { label: "Low · Nasal", desc: "Voice resonates through the nose, low in pitch, with no puff of air.", bg: "bg-rose-50 border-rose-100", text: "text-rose-700" }
};

const GENDER_INFO: Record<string, { bg: string, text: string, dot: string }> = {
  'Masculine': { bg: 'bg-red-50 border-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  'Neuter': { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Feminine': { bg: 'bg-teal-50 border-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' },
  'Very Feminine': { bg: 'bg-purple-50 border-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Sub-Feminine': { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Root': { bg: 'bg-stone-50 border-stone-200', text: 'text-stone-600', dot: 'bg-stone-400' },
};

type MatchQuestion = {
  target: typeof TIBETAN_ALPHABET[0];
  options: typeof TIBETAN_ALPHABET[0][];
};

export default function LessonDetailPage() {
  const { getToken } = useAuth();
  
  // Section 1 State
  const [activeFilter, setActiveFilter] = useState<ToneClass | 'ALL'>('ALL');
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  
  // Drawer State
  const [selectedLetter, setSelectedLetter] = useState<typeof TIBETAN_ALPHABET[0] | null>(null);

  // Practice Section State
  const [activePracticeTab, setActivePracticeTab] = useState('Memory Review'); 
  
  // Flashcards State
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Listen & Select State
  const [lsOptions, setLsOptions] = useState<typeof TIBETAN_ALPHABET>([]);
  const [lsCorrectLetter, setLsCorrectLetter] = useState<typeof TIBETAN_ALPHABET[0] | null>(null);
  const [lsSelectedLetter, setLsSelectedLetter] = useState<string | null>(null);

  // Match State
  const [matchQuestions, setMatchQuestions] = useState<MatchQuestion[]>([]);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});

  // Memory Review State
  const [reviewDeck, setReviewDeck] = useState<typeof TIBETAN_ALPHABET>([]);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [reviewRating, setReviewRating] = useState<'Hard' | 'Good' | 'Easy' | null>(null);

  // Initialize Memory Review deck when the tab is clicked
  useEffect(() => {
    if (activePracticeTab === 'Memory Review' && reviewDeck.length === 0 && reviewedCount === 0) {
      setReviewDeck([...TIBETAN_ALPHABET].sort(() => 0.5 - Math.random()));
    }
  }, [activePracticeTab, reviewDeck.length, reviewedCount]);

  const handleReviewNext = () => {
    if (!reviewRating || reviewDeck.length === 0) return;

    const currentCard = reviewDeck[0];
    let newDeck = reviewDeck.slice(1);

    if (reviewRating === 'Hard') {
      // Re-insert near the front so they see it again very soon (within the next 2-3 cards)
      const insertPos = Math.min(Math.floor(Math.random() * 3) + 1, newDeck.length);
      newDeck.splice(insertPos, 0, currentCard);
    } else if (reviewRating === 'Good') {
      // Re-insert at the very end of the deck
      newDeck.push(currentCard);
    }
    // If 'Easy', it is completely removed from the newDeck.

    setReviewDeck(newDeck);
    setReviewedCount(prev => prev + 1);
    setReviewRating(null); // Reset rating for the next card
  };

  const resetReview = () => {
    setReviewDeck([...TIBETAN_ALPHABET].sort(() => 0.5 - Math.random()));
    setReviewedCount(0);
    setReviewRating(null);
  };

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
    } catch (e) {
      console.error("Audio beep failed", e);
    }
  };

  const handleNextCard = () => {
    setIsCardFlipped(false);
    setFlashcardIdx((prev) => (prev + 1) % TIBETAN_ALPHABET.length);
  };

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    setFlashcardIdx((prev) => (prev - 1 + TIBETAN_ALPHABET.length) % TIBETAN_ALPHABET.length);
  };

  const currentFlashcard = TIBETAN_ALPHABET[flashcardIdx];

  const generateListenSelectRound = () => {
    const shuffled = [...TIBETAN_ALPHABET].sort(() => 0.5 - Math.random());
    const selected4 = shuffled.slice(0, 4);
    setLsOptions(selected4);
    setLsCorrectLetter(selected4[Math.floor(Math.random() * 4)]);
    setLsSelectedLetter(null);
  };

  useEffect(() => {
    if (activePracticeTab === 'Listen & Select' && lsOptions.length === 0) generateListenSelectRound();
  }, [activePracticeTab]);

  const generateMatchRound = () => {
    const shuffled = [...TIBETAN_ALPHABET].sort(() => 0.5 - Math.random());
    const targets = shuffled.slice(0, 6); 
    
    const newQuestions = targets.map(target => {
      const distractors = TIBETAN_ALPHABET.filter(item => item.letter !== target.letter)
                                          .sort(() => 0.5 - Math.random())
                                          .slice(0, 2);
      const options = [target, ...distractors].sort(() => 0.5 - Math.random());
      return { target, options };
    });
    
    setMatchQuestions(newQuestions);
    setMatchAnswers({});
  };

  useEffect(() => {
    if (activePracticeTab === 'Match' && matchQuestions.length === 0) generateMatchRound();
  }, [activePracticeTab]);

  const handleMatchSelect = (targetLetter: string, selectedOptionLetter: string) => {
    const isCorrect = targetLetter === selectedOptionLetter;
    
    if (matchAnswers[targetLetter]) {
      if (isCorrect) playAudio(selectedOptionLetter);
      return; 
    }
    
    if (isCorrect) {
      playAudio(selectedOptionLetter);
    } else {
      playErrorBeep();
    }
    
    setMatchAnswers(prev => ({ ...prev, [targetLetter]: selectedOptionLetter }));
  };

  const filteredAlphabet = activeFilter === 'ALL' 
    ? TIBETAN_ALPHABET 
    : TIBETAN_ALPHABET.filter(item => item.tone === activeFilter);

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-stone-800 font-sans pb-40 relative overflow-x-hidden">
      
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
                onClick={() => { playAudio(item.letter); setSelectedLetter(item); }}
                className={`relative flex flex-col items-center justify-center p-8 border-b border-r border-stone-200 transition-colors group h-40 border-t-4 ${TONE_COLORS[item.tone as ToneClass]} ${playingItem === item.letter || selectedLetter?.letter === item.letter ? 'bg-stone-100' : 'bg-white hover:bg-stone-50'}`}
              >
                <div className="text-5xl font-serif text-stone-900 group-hover:scale-110 transition-transform mb-4">{item.letter}</div>
                <div className="absolute bottom-4 left-4 text-left">
                  <div className="text-[11px] font-bold tracking-widest text-stone-800 uppercase leading-none mb-1">{item.phonetic}</div>
                  <div className="text-[10px] text-stone-400 tracking-widest leading-none">{item.wylie}</div>
                </div>
                {playingItem === item.letter && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-stone-400" /></div>}
              </button>
            ))}
          </div>

          {/* LEGEND */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
            <span className="text-stone-400">Legend</span>
            <div className="flex items-center gap-2"><div className="w-4 h-1.5 bg-[#0ea5e9]"></div> High · Unaspirated</div>
            <div className="flex items-center gap-2"><div className="w-4 h-1.5 bg-[#f59e0b]"></div> High · Aspirated</div>
            <div className="flex items-center gap-2"><div className="w-4 h-1.5 bg-[#a855f7]"></div> Low · Semi-aspirated</div>
            <div className="flex items-center gap-2"><div className="w-4 h-1.5 bg-[#f43f5e]"></div> Low · Nasal</div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 02: UNDERSTANDING TONE */}
        {/* ========================================================= */}
        <div className="mb-20">
          <div className="mb-8">
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 02</div>
            <h2 className="text-3xl font-serif text-stone-900">Understanding tone</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            {/* Card 1: High Unaspirated */}
            <div className="bg-white border border-sky-300 p-6 flex flex-col rounded-lg">
              <div className="text-[10px] font-bold text-sky-800 bg-sky-100 w-fit px-2 py-1 rounded uppercase tracking-widest mb-4">High · Unaspirated</div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">6 letters</h3>
              <p className="text-sm text-stone-600 mb-6 flex-1">Pronounced high in the voice, with no puff of air. Say the sound cleanly, keeping the pitch bright.</p>
              <div className="flex flex-wrap gap-2 text-xl font-serif text-stone-800">
                {['ཀ', 'ཅ', 'ཏ', 'པ', 'ཙ', 'ཨ'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`w-9 h-9 flex items-center justify-center border rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-sky-100 border-sky-400 text-sky-800' : 'border-stone-200 hover:bg-stone-50 hover:border-stone-300'}`}>{char}</button>
                ))}
              </div>
            </div>

            {/* Card 2: High Aspirated */}
            <div className="bg-white border border-amber-300 p-6 flex flex-col rounded-lg">
              <div className="text-[10px] font-bold text-amber-800 bg-amber-100 w-fit px-2 py-1 rounded uppercase tracking-widest mb-4">High · Aspirated</div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">8 letters</h3>
              <p className="text-sm text-stone-600 mb-6 flex-1">Pronounced high in the voice with a strong puff of air, as if adding a breathy 'h' after the sound.</p>
              <div className="flex flex-wrap gap-2 text-xl font-serif text-stone-800">
                {['ཁ', 'ཆ', 'ཐ', 'ཕ', 'ཚ', 'ཤ', 'ས', 'ཧ'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`w-9 h-9 flex items-center justify-center border rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-amber-100 border-amber-400 text-amber-800' : 'border-stone-200 hover:bg-stone-50 hover:border-stone-300'}`}>{char}</button>
                ))}
              </div>
            </div>

            {/* Card 3: Low Semi-aspirated */}
            <div className="bg-white border border-purple-300 p-6 flex flex-col rounded-lg">
              <div className="text-[10px] font-bold text-purple-800 bg-purple-100 w-fit px-2 py-1 rounded uppercase tracking-widest mb-4">Low · Semi-aspirated</div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">12 letters</h3>
              <p className="text-sm text-stone-600 mb-6 flex-1">Pronounced low in the voice with a light, softened aspiration. The pitch drops and the sound is gentler than its high-tone counterpart.</p>
              <div className="flex flex-wrap gap-2 text-xl font-serif text-stone-800">
                {['ག', 'ཇ', 'ད', 'བ', 'ཛ', 'ཝ', 'ཞ', 'ཟ', 'འ', 'ཡ', 'ར', 'ལ'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`w-9 h-9 flex items-center justify-center border rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-purple-100 border-purple-400 text-purple-800' : 'border-stone-200 hover:bg-stone-50 hover:border-stone-300'}`}>{char}</button>
                ))}
              </div>
            </div>

            {/* Card 4: Low Nasal */}
            <div className="bg-white border border-rose-300 p-6 flex flex-col rounded-lg">
              <div className="text-[10px] font-bold text-rose-800 bg-rose-100 w-fit px-2 py-1 rounded uppercase tracking-widest mb-4">Low · Nasal</div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">4 letters</h3>
              <p className="text-sm text-stone-600 mb-6 flex-1">The four true nasals — ང ཉ ན མ. Voice resonates through the nose, low in pitch, with no puff of air.</p>
              <div className="flex flex-wrap gap-2 text-xl font-serif text-stone-800">
                {['ང', 'ཉ', 'ན', 'མ'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`w-9 h-9 flex items-center justify-center border rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-rose-100 border-rose-400 text-rose-800' : 'border-stone-200 hover:bg-stone-50 hover:border-stone-300'}`}>{char}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-4 rounded-lg flex items-start gap-3">
             <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
             <p className="text-sm text-stone-600">
               The lines drawn above and below the transliteration in traditional Tibetan textbooks indicate <strong>high tone</strong> and <strong>low tone</strong> respectively. Pay close attention to your teacher's pronunciation, and repeat each consonant the same way it is spoken.
             </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 02B: ROOT SOUNDS */}
        {/* ========================================================= */}
        <div className="mb-20">
          <div className="mb-8">
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 02B</div>
            <h2 className="text-3xl font-serif text-stone-900 mb-4">The three root sounds</h2>
            <p className="text-sm text-stone-600 mb-8 max-w-4xl leading-relaxed">
              Traditional Tibetan phonology traces every consonant back to one of three root sounds — seed syllables that anchor a whole tone family. Learn these three, and the rest of the alphabet becomes a family tree rather than a list.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Neutral Root */}
            <div className="bg-white border border-sky-300 p-8 flex flex-col rounded-lg">
              <div className="text-[10px] font-bold text-sky-800 bg-sky-100 w-fit px-2 py-1 rounded uppercase tracking-widest mb-6">Neutral Root · High Register</div>
              <button onClick={() => { playAudio('ཨ'); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === 'ཨ') || null); }} className={`flex items-end gap-2 mb-6 w-fit transition-opacity hover:opacity-70 ${playingItem === 'ཨ' || selectedLetter?.letter === 'ཨ' ? 'opacity-50' : ''}`}>
                <span className="text-6xl font-serif text-stone-900 leading-none">ཨ</span><span className="text-lg font-serif italic text-stone-500 mb-1">a</span>
              </button>
              <p className="text-sm text-stone-600 mb-8 leading-relaxed flex-1">
                The neutral vowel carrier — a clean 'a' with no consonantal onset. As a root sound, ཨ anchors the plain, unaspirated stops (ཀ ཅ ཏ པ ཙ) together with itself, giving them their basic, unbreathed voice.
              </p>
              <div className="border-t border-stone-100 pt-4">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Family</div>
                <div className="font-serif text-lg tracking-[0.2em] text-stone-800">ཨ ཀ ཅ ཏ པ ཙ</div>
              </div>
            </div>
            
            {/* Card 2: Aspirated Root */}
            <div className="bg-white border border-amber-300 p-8 flex flex-col rounded-lg">
              <div className="text-[10px] font-bold text-amber-800 bg-amber-100 w-fit px-2 py-1 rounded uppercase tracking-widest mb-6">Aspirated Root · Breath</div>
              <button onClick={() => { playAudio('ཧ'); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === 'ཧ') || null); }} className={`flex items-end gap-2 mb-6 w-fit transition-opacity hover:opacity-70 ${playingItem === 'ཧ' || selectedLetter?.letter === 'ཧ' ? 'opacity-50' : ''}`}>
                <span className="text-6xl font-serif text-stone-900 leading-none">ཧ</span><span className="text-lg font-serif italic text-stone-500 mb-1">ha</span>
              </button>
              <p className="text-sm text-stone-600 mb-8 leading-relaxed flex-1">
                The breath root — a light, aspirated 'h'. It anchors the aspirated stops and fricatives (ཁ ཆ ཐ ཕ ཚ ཤ ས) along with ཧ itself, where the sound is shaped by the flow of air.
              </p>
              <div className="border-t border-stone-100 pt-4">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Family</div>
                <div className="font-serif text-lg tracking-[0.2em] text-stone-800">ཧ ཁ ཆ ཐ ཕ ཚ ཤ ས</div>
              </div>
            </div>

            {/* Card 3: Glottal Root */}
            <div className="bg-white border border-rose-300 p-8 flex flex-col rounded-lg">
              <div className="text-[10px] font-bold text-rose-800 bg-rose-100 w-fit px-2 py-1 rounded uppercase tracking-widest mb-6">Glottal Root · Voiced Flow</div>
              <button onClick={() => { playAudio('འ'); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === 'འ') || null); }} className={`flex items-end gap-2 mb-6 w-fit transition-opacity hover:opacity-70 ${playingItem === 'འ' || selectedLetter?.letter === 'འ' ? 'opacity-50' : ''}`}>
                <span className="text-6xl font-serif text-stone-900 leading-none">འ</span><span className="text-lg font-serif italic text-stone-500 mb-1">'a</span>
              </button>
              <p className="text-sm text-stone-600 mb-8 leading-relaxed flex-1">
                The glottal root — a soft, voiced 'a' that carries the vowel without a hard onset. It anchors the low-register letters: the semi-aspirated voiced stops (ག ཇ ད བ ཛ), the glides and liquids (ཝ ཞ ཟ ཡ ར ལ), and the nasals (ང ཉ ན མ).
              </p>
              <div className="border-t border-stone-100 pt-4">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Family</div>
                <div className="font-serif text-lg tracking-[0.2em] text-stone-800">འ ག ཇ ད བ ཛ ཝ ཞ ཟ ཡ ར ལ ང ཉ ན མ</div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 03: GENDER CLASSIFICATION */}
        {/* ========================================================= */}
        <div className="mb-20">
          <div className="mb-8">
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 03</div>
            <h2 className="text-3xl font-serif text-stone-900 mb-4">Traditional gender classification</h2>
            <p className="text-sm text-stone-600 mb-8 max-w-4xl leading-relaxed">
              The thirty consonants are traditionally divided into five gender groups depending on how much effort is required for their pronunciation.
            </p>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-12 bg-stone-50 border-b border-stone-200 p-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest hidden sm:grid">
              <div className="col-span-3">Gender</div>
              <div className="col-span-3">Tibetan</div>
              <div className="col-span-6">Consonants</div>
            </div>

            {/* Row 1: Masculine */}
            <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-stone-200 bg-[#fff5f5] p-4 sm:items-center gap-4 sm:gap-0">
              <div className="col-span-3 flex items-center gap-2 font-bold text-stone-800"><div className="w-2 h-2 rounded-full bg-red-500"></div> Masculine</div>
              <div className="col-span-3 font-serif text-lg text-stone-800">ཕོ་</div>
              <div className="col-span-6 flex flex-wrap gap-2 text-lg font-serif text-red-700">
                {['ཀ', 'ཅ', 'ཏ', 'པ', 'ཙ'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`bg-white border px-3 py-1 rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-red-100 border-red-400' : 'border-red-200 hover:border-red-300 hover:bg-red-50'}`}>{char}</button>
                ))}
              </div>
            </div>

            {/* Row 2: Neuter */}
            <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-stone-200 bg-[#fffbeb] p-4 sm:items-center gap-4 sm:gap-0">
              <div className="col-span-3 flex items-center gap-2 font-bold text-stone-800"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Neuter</div>
              <div className="col-span-3 font-serif text-lg text-stone-800">མ་ནིང་</div>
              <div className="col-span-6 flex flex-wrap gap-2 text-lg font-serif text-amber-700">
                {['ཁ', 'ཆ', 'ཐ', 'ཕ', 'ཚ'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`bg-white border px-3 py-1 rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-amber-100 border-amber-400' : 'border-amber-200 hover:border-amber-300 hover:bg-amber-50'}`}>{char}</button>
                ))}
              </div>
            </div>
            
            {/* Row 3: Feminine */}
            <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-stone-200 bg-[#f0fdfa] p-4 sm:items-center gap-4 sm:gap-0">
              <div className="col-span-3 flex items-center gap-2 font-bold text-stone-800"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Feminine</div>
              <div className="col-span-3 font-serif text-lg text-stone-800">མོ་</div>
              <div className="col-span-6 flex flex-wrap gap-2 text-lg font-serif text-teal-700">
                {['ག', 'ཇ', 'ད', 'བ', 'ཛ', 'ཝ', 'ཞ', 'ཟ', 'འ', 'ཡ'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`bg-white border px-3 py-1 rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-teal-100 border-teal-400' : 'border-teal-200 hover:border-teal-300 hover:bg-teal-50'}`}>{char}</button>
                ))}
              </div>
            </div>
            
            {/* Row 4: Very Feminine */}
            <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-stone-200 bg-[#faf5ff] p-4 sm:items-center gap-4 sm:gap-0">
              <div className="col-span-3 flex items-center gap-2 font-bold text-stone-800"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Very Feminine</div>
              <div className="col-span-3 font-serif text-lg text-stone-800">ཤིན་ཏུ་མོ་</div>
              <div className="col-span-6 flex flex-wrap gap-2 text-lg font-serif text-purple-700">
                {['ང', 'ཉ', 'ན', 'མ'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`bg-white border px-3 py-1 rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-purple-100 border-purple-400' : 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'}`}>{char}</button>
                ))}
              </div>
            </div>
            
            {/* Row 5: Sub-Feminine */}
            <div className="grid grid-cols-1 sm:grid-cols-12 bg-[#eff6ff] p-4 sm:items-center gap-4 sm:gap-0">
              <div className="col-span-3 flex items-center gap-2 font-bold text-stone-800"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Sub-Feminine</div>
              <div className="col-span-3 font-serif text-lg text-stone-800">མོ་གཤམ་</div>
              <div className="col-span-6 flex flex-wrap gap-2 text-lg font-serif text-blue-700">
                {['ར', 'ལ', 'ཤ', 'ས'].map(char => (
                  <button key={char} onClick={() => { playAudio(char); setSelectedLetter(TIBETAN_ALPHABET.find(a => a.letter === char) || null); }} disabled={playingItem !== null} className={`bg-white border px-3 py-1 rounded transition-colors ${playingItem === char || selectedLetter?.letter === char ? 'bg-blue-100 border-blue-400' : 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'}`}>{char}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 04: VOCABULARY */}
        {/* ========================================================= */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 04</div>
              <h2 className="text-3xl font-serif text-stone-900">Nouns formed from the 30 consonants</h2>
            </div>
            <div className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-widest">
              Vocabulary · མིང་ཚིག་
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {VOCABULARY.map((word, i) => (
              <div key={i} className={`bg-white border p-5 rounded-xl shadow-sm transition-colors flex flex-col justify-between h-40 relative group ${playingItem === word.tib ? 'border-amber-400 bg-amber-50/30' : 'border-stone-200 hover:border-amber-300'}`}>
                <div className="text-2xl mb-2">{word.emoji}</div>
                <div>
                  <div className="text-2xl font-serif text-stone-900 mb-1 leading-none">{word.tib}</div>
                  <div className="text-[10px] font-medium text-stone-400 italic mb-1">{word.wylie}</div>
                  <div className="text-sm font-bold text-stone-700">{word.eng}</div>
                </div>
                <button 
                  onClick={() => playAudio(word.tib)}
                  disabled={playingItem !== null}
                  className={`absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center border rounded-lg transition-colors ${playingItem === word.tib ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-600'}`}
                >
                  {playingItem === word.tib ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="fill-current" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 05: PRACTICE & EXERCISES */}
        {/* ========================================================= */}
        <div className="mb-20">
          <div className="mb-8">
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 05</div>
            <h2 className="text-3xl font-serif text-stone-900">Practice & exercises</h2>
          </div>

          <div className="bg-[#fcfaf5] border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            
            {/* TABS */}
            <div className="flex flex-wrap items-center justify-between border-b border-stone-200 bg-white">
              <div className="flex overflow-x-auto custom-scrollbar w-full">
                {[
                  { name: 'Flashcards', icon: Layers },
                  { name: 'Trace', icon: PenTool },
                  { name: 'Listen & Select', icon: Headphones },
                  { name: 'Match', icon: Shuffle },
                  { name: 'Memory Review', icon: RefreshCcw }
                ].map((tab) => (
                  <button 
                    key={tab.name}
                    onClick={() => setActivePracticeTab(tab.name)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activePracticeTab === tab.name ? 'border-amber-500 text-stone-900 bg-stone-50/50' : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}
                  >
                    <tab.icon size={16} /> {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT: FLASHCARDS */}
            {activePracticeTab === 'Flashcards' && (
              <div className="p-6 md:p-12 flex flex-col items-center w-full animate-in fade-in">
                <div className="w-full max-w-2xl flex justify-between items-center mb-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                    <span className="bg-stone-900 text-white px-2 py-1 rounded">CONSONANTS · 30</span>
                    <span className="text-stone-400">NOUNS · 18</span>
                  </div>
                  <span>Card {flashcardIdx + 1} of 30</span>
                </div>

                <div 
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center relative group"
                >
                  {!isCardFlipped ? (
                    <div className="text-7xl md:text-9xl font-serif text-stone-900 group-hover:scale-105 transition-transform">
                      {currentFlashcard.letter}
                    </div>
                  ) : (
                    <div className="text-center animate-in fade-in zoom-in-95 duration-200">
                      <div className="text-4xl md:text-5xl font-bold text-stone-900 mb-2">{currentFlashcard.phonetic}</div>
                      <div className="text-lg md:text-xl text-stone-400 tracking-widest">{currentFlashcard.wylie}</div>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-6 text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:text-stone-400 transition-colors">
                    Tap card to flip
                  </div>
                </div>

                <div className="w-full max-w-2xl flex items-center justify-between mt-8">
                  <button onClick={handlePrevCard} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors">
                    <ArrowLeft size={16} /> Previous
                  </button>
                  <button 
                    onClick={() => playAudio(currentFlashcard.letter)}
                    disabled={playingItem !== null}
                    className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl shadow-sm transition-colors"
                  >
                    {playingItem === currentFlashcard.letter ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />}
                    Play sound
                  </button>
                  <button onClick={handleNextCard} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors">
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: LISTEN & SELECT */}
            {activePracticeTab === 'Listen & Select' && (
              <div className="p-6 md:p-12 flex flex-col items-center w-full animate-in fade-in">
                <p className="text-sm text-stone-500 mb-8 self-start w-full max-w-4xl">Listen to the sound and choose the correct consonant.</p>

                <button
                  onClick={() => lsCorrectLetter && playAudio(lsCorrectLetter.letter)}
                  disabled={playingItem !== null}
                  className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 mb-12 shadow-md transition-colors"
                >
                  {playingItem === lsCorrectLetter?.letter ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                  PLAY SOUND
                </button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
                  {lsOptions.map((opt) => {
                    const isSelected = lsSelectedLetter === opt.letter;
                    const isCorrect = lsCorrectLetter?.letter === opt.letter;
                    const showCorrect = isSelected && isCorrect;
                    const showWrong = isSelected && !isCorrect;

                    let borderClass = "border-stone-200 hover:border-amber-300";
                    let bgClass = "bg-white hover:bg-stone-50 cursor-pointer";
                    let textClass = "text-stone-900";

                    if (showCorrect) {
                      borderClass = "border-emerald-500 ring-2 ring-emerald-500/20";
                      bgClass = "bg-emerald-50";
                      textClass = "text-emerald-700";
                    } else if (showWrong) {
                      borderClass = "border-rose-500";
                      bgClass = "bg-rose-50";
                      textClass = "text-rose-700";
                    } else if (lsSelectedLetter && isCorrect) {
                      borderClass = "border-emerald-300 border-dashed";
                      bgClass = "bg-emerald-50/50";
                      textClass = "text-emerald-600";
                    } else if (lsSelectedLetter) {
                      borderClass = "border-stone-100 opacity-50";
                      bgClass = "bg-stone-50 cursor-default";
                    }

                    return (
                      <button
                        key={opt.letter}
                        onClick={() => {
                          if (!lsSelectedLetter) {
                            setLsSelectedLetter(opt.letter);
                            if (opt.letter === lsCorrectLetter?.letter) {
                               playAudio(opt.letter); 
                            } else {
                               playErrorBeep();
                            }
                          }
                        }}
                        disabled={lsSelectedLetter !== null}
                        className={`relative aspect-square flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${borderClass} ${bgClass}`}
                      >
                         <span className={`text-6xl sm:text-7xl font-serif transition-colors ${textClass}`}>{opt.letter}</span>
                         {showCorrect && <div className="absolute top-4 right-4 text-emerald-500 animate-in zoom-in"><CheckCircle2 size={24}/></div>}
                         {showWrong && <div className="absolute top-4 right-4 text-rose-500 animate-in zoom-in"><XCircle size={24}/></div>}
                      </button>
                    )
                  })}
                </div>

                {lsSelectedLetter && (
                  <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
                    <button onClick={generateListenSelectRound} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-2">
                      Next Round <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MATCH */}
            {activePracticeTab === 'Match' && (
              <div className="p-6 md:p-12 flex flex-col items-center w-full animate-in fade-in">
                <p className="text-sm text-stone-500 mb-8 self-start w-full max-w-4xl">Match each Tibetan consonant with its pronunciation.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                  {matchQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* Left: Tibetan Letter */}
                      <div className="text-4xl font-serif text-stone-900 ml-4">{q.target.letter}</div>
                      
                      {/* Right: Phonetic Options */}
                      <div className="flex items-center gap-2 mr-2">
                        {q.options.map(opt => {
                          const isSelected = matchAnswers[q.target.letter] === opt.letter;
                          const isCorrect = q.target.letter === opt.letter;
                          const isAnswered = !!matchAnswers[q.target.letter];
                          
                          let btnClass = "border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer";
                          
                          if (isAnswered) {
                            if (isCorrect) {
                              if (isSelected) {
                                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100 hover:border-emerald-500 shadow-sm";
                              } else {
                                btnClass = "border-emerald-400 border-dashed bg-emerald-50/50 text-emerald-600 cursor-pointer hover:bg-emerald-100 hover:border-solid hover:border-emerald-500";
                              }
                            } else if (isSelected) {
                              btnClass = "border-rose-500 bg-rose-50 text-rose-700 cursor-default";
                            } else {
                              btnClass = "border-stone-100 bg-stone-50 text-stone-300 opacity-50 cursor-default";
                            }
                          }

                          const isCurrentlyPlaying = playingItem === opt.letter && isCorrect;

                          return (
                            <button 
                              key={opt.letter}
                              onClick={() => handleMatchSelect(q.target.letter, opt.letter)}
                              disabled={playingItem !== null || (isAnswered && !isCorrect)}
                              className={`relative px-4 py-2 text-[11px] font-bold lowercase tracking-widest border rounded transition-all flex items-center justify-center min-w-[3rem] ${btnClass}`}
                            >
                              {isCurrentlyPlaying ? <Loader2 size={12} className="animate-spin absolute" /> : opt.phonetic}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </div>

                {/* Show "Next Round" if all questions are answered */}
                {Object.keys(matchAnswers).length === matchQuestions.length && matchQuestions.length > 0 && (
                  <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
                    <button 
                      onClick={generateMatchRound} 
                      className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                    >
                      Next Round <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MEMORY REVIEW */}
            {activePracticeTab === 'Memory Review' && (
              <div className="p-6 md:p-12 flex flex-col items-center w-full animate-in fade-in">
                {reviewDeck.length > 0 ? (
                  <div className="w-full max-w-4xl">
                    
                    <div className="flex justify-between items-center mb-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-stone-200 pb-4">
                      <span>Spaced repetition · rate your recall</span>
                      <span>{reviewedCount} reviewed</span>
                    </div>

                    {/* Main Flashcard area - ONLY letter */}
                    <div className="bg-white border border-stone-200 rounded-xl p-16 flex flex-col items-center justify-center mb-6 min-h-[300px] shadow-sm">
                      <div className="text-[10rem] font-serif text-stone-900 mb-8 leading-none">
                        {reviewDeck[0].letter}
                      </div>
                      
                      {/* Separate button just to hear the sound */}
                      <button 
                        onClick={() => playAudio(reviewDeck[0].letter)}
                        disabled={playingItem !== null}
                        className="flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg transition-colors text-sm"
                      >
                        {playingItem === reviewDeck[0].letter ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                        Check Sound
                      </button>
                    </div>

                    {/* Rating Buttons */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <button 
                        onClick={() => setReviewRating('Hard')}
                        className={`py-4 rounded-xl border font-bold text-sm transition-all ${reviewRating === 'Hard' ? 'bg-rose-100 border-rose-400 text-rose-800 ring-2 ring-rose-400/20' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}
                      >
                        Hard
                      </button>
                      <button 
                        onClick={() => setReviewRating('Good')}
                        className={`py-4 rounded-xl border font-bold text-sm transition-all ${reviewRating === 'Good' ? 'bg-amber-100 border-amber-400 text-amber-800 ring-2 ring-amber-400/20' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}
                      >
                        Good
                      </button>
                      <button 
                        onClick={() => setReviewRating('Easy')}
                        className={`py-4 rounded-xl border font-bold text-sm transition-all ${reviewRating === 'Easy' ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-400/20' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}
                      >
                        Easy
                      </button>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
                      <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen size={14} /> Cards you mark Hard return soon; Easy cards drift further out.
                      </p>
                      
                      <button 
                        onClick={handleReviewNext}
                        disabled={!reviewRating}
                        className={`flex items-center gap-2 px-8 py-3.5 font-bold rounded-xl shadow-sm transition-colors ${reviewRating ? 'bg-amber-500 hover:bg-amber-400 text-stone-900' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
                      >
                        Next Card <ArrowRight size={18} />
                      </button>
                    </div>

                  </div>
                ) : (
                  // Empty Deck State
                  <div className="flex flex-col items-center justify-center text-center h-[400px] animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Deck Complete!</h3>
                    <p className="text-stone-500 mb-8 max-w-md">You have successfully mastered all 30 consonants in this session.</p>
                    <button 
                      onClick={resetReview}
                      className="px-8 py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <RefreshCcw size={18} /> Review Again
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* OTHER TABS (Placeholders) */}
            {activePracticeTab === 'Trace' && (
              <div className="p-12 text-center text-stone-400 font-medium">
                {activePracticeTab} exercises are currently under development.
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SLIDE-OVER DRAWER */}
      {/* ========================================================= */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedLetter(null)}
          ></div>
          
          <div className="relative w-full max-w-md bg-[#fdfbf7] h-full shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300 border-l border-[#e8e4d9]">
            <div className="px-6 py-4 border-b border-[#e8e4d9] flex items-center justify-between bg-white">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                Consonant · {selectedLetter.phonetic}
              </span>
              <button onClick={() => setSelectedLetter(null)} className="p-2 -mr-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex flex-col items-center justify-center mb-10">
                <div className="text-[8rem] font-serif text-stone-900 leading-none mb-6">
                  {selectedLetter.letter}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xl font-serif italic text-stone-800">{selectedLetter.phonetic.toLowerCase()}</div>
                  <div className="text-xl font-medium text-stone-400">{selectedLetter.wylie}</div>
                  <button 
                    onClick={() => playAudio(selectedLetter.letter)}
                    disabled={playingItem !== null}
                    className="w-8 h-8 bg-amber-500 hover:bg-amber-400 text-white rounded-lg flex items-center justify-center shadow-sm transition-colors"
                  >
                    {playingItem === selectedLetter.letter ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} className="fill-current" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`p-4 rounded-xl border ${TONE_INFO[selectedLetter.tone].bg}`}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Tone</div>
                  <div className={`font-serif text-lg ${TONE_INFO[selectedLetter.tone].text}`}>
                    {TONE_INFO[selectedLetter.tone].label}
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl border ${GENDER_INFO[selectedLetter.gender].bg}`}>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Gender</div>
                  <div className={`font-serif text-lg flex items-center gap-2 ${GENDER_INFO[selectedLetter.gender].text}`}>
                    <div className={`w-2 h-2 rounded-full ${GENDER_INFO[selectedLetter.gender].dot}`}></div>
                    {selectedLetter.gender}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Pronunciation</div>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {TONE_INFO[selectedLetter.tone].desc}
                </p>
              </div>

              <div className="mb-8 border-t border-stone-200 pt-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Notes from the textbook</div>
                <p className="text-sm text-stone-600 leading-relaxed italic bg-white p-4 rounded-xl border border-stone-200">
                  {selectedLetter.note}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-stone-200 bg-white grid grid-cols-2 gap-3">
              <button 
                onClick={() => playAudio(selectedLetter.letter)}
                className="flex items-center justify-center gap-2 py-3 border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-sm rounded-xl transition-colors"
              >
                <RefreshCcw size={16} /> Play again
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
                <PlusSquare size={16} /> Add to review
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STICKY FOOTER */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-[#fdfbf7] border-t border-stone-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors">
            <ArrowLeft size={16} /> All lessons
          </Link>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl shadow-sm transition-colors">
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