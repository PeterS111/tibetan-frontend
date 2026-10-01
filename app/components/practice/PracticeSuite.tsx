// app/components/practice/PracticeSuite.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { 
  Layers, Shuffle, BookOpen, CheckCircle2, ArrowRight, ArrowLeft, 
  Play, Loader2, Volume2 
} from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { usePlatform } from "@/hooks/usePlatform";

export interface PracticeItem {
  id: string;
  tibetan: string;     
  reading: string;     
  translit?: string;   
  pron?: string;       
  english: string;     
  audioTarget: string; 
  emoji?: string;      
}

export interface PracticeGroup {
  name: string;        
  items: PracticeItem[];
}

interface PracticeSuiteProps {
  groups: PracticeGroup[];
  playAudio: (text: string) => void;
  playingItem: string | null;
  playErrorBeep: () => void;
  isLesson1?: boolean; 
}

const getReading = (item: PracticeItem, isLesson1: boolean) => {
  const preferred = isLesson1 ? (item.translit || item.pron) : (item.pron || item.translit);
  const rawReading = preferred || item.reading;
  return rawReading ? rawReading.replace(/[\[\]]/g, '') : "";
};

export default function PracticeSuite({ groups, playAudio, playingItem, playErrorBeep, isLesson1 = false }: PracticeSuiteProps) {
  const [tab, setTab] = useState<"flash" | "match" | "listen" | "srs">("flash");
  const { isNative } = usePlatform();

  const allItems = useMemo(() => {
    const flat = groups.flatMap(g => g.items);
    const unique = [];
    const seen = new Set();
    for (const item of flat) {
      if (!seen.has(item.tibetan)) {
        seen.add(item.tibetan);
        unique.push(item);
      }
    }
    return unique;
  }, [groups]);

  return (
    <Card className="p-0 border-border-subtle shadow-sm overflow-hidden">
      <div className={
        isNative 
          ? "grid grid-cols-2 gap-2 p-4 border-b border-border-subtle bg-paper"
          : "flex overflow-x-auto custom-scrollbar border-b border-border-subtle bg-surface-muted"
      }>
        {[
          { k: "flash", label: "Flashcards", Icon: Layers },
          { k: "match", label: "Match Game", Icon: Shuffle },
          { k: "listen", label: "Listen", Icon: Volume2 },
          { k: "srs", label: "Memory Review", Icon: BookOpen },
        ].map((t) => (
          <button 
            key={t.k} 
            onClick={() => setTab(t.k as "flash" | "match" | "listen" | "srs")} 
            className={`shrink-0 flex items-center justify-center gap-2 px-3 py-3 sm:px-5 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
              isNative ? "rounded-full border w-full" : ""
            } ${
              tab === t.k 
                ? (isNative ? "bg-ink text-white border-ink shadow-sm" : "bg-ink text-white") 
                : (isNative ? "bg-white text-ink-muted border-border-strong hover:bg-surface-muted" : "text-ink-muted hover:bg-white hover:text-ink")
            }`}
          >
            <t.Icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      
      <div className="p-6 md:p-10 bg-paper">
        {tab === "flash" && <Flashcards groups={groups} speak={playAudio} playingItem={playingItem} isLesson1={isLesson1} isNative={isNative} />}
        {tab === "match" && <MatchGame items={allItems} speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isLesson1={isLesson1} isNative={isNative} />}
        {tab === "listen" && <ListenSelect items={allItems} speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isNative={isNative} />}
        {tab === "srs" && <MemoryReview items={allItems} speak={playAudio} playingItem={playingItem} isLesson1={isLesson1} isNative={isNative} />}
      </div>
    </Card>
  );
}

// --- FLASHCARDS ---
interface FlashcardsProps {
  groups: PracticeGroup[];
  speak: (text: string) => void;
  playingItem: string | null;
  isLesson1: boolean;
  isNative: boolean;
}

function Flashcards({ groups, speak, playingItem, isLesson1, isNative }: FlashcardsProps) {
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const group = groups[activeGroupIdx];
  const items = group.items;
  const card = items[idx % items.length];

  const next = () => { setFlipped(false); setIdx((i: number) => (i + 1) % items.length); };
  const prev = () => { setFlipped(false); setIdx((i: number) => (i - 1 + items.length) % items.length); };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center mb-6 text-eyebrow gap-4">
        <div className="flex flex-wrap gap-2">
          {groups.map((g: PracticeGroup, i: number) => (
            <button 
              key={g.name}
              onClick={() => { setActiveGroupIdx(i); setIdx(0); setFlipped(false); }} 
              className={`px-4 py-2 border transition-colors ${isNative ? 'rounded-full' : ''} ${activeGroupIdx === i ? "bg-ink text-white border-ink shadow-sm" : "bg-white border-border-strong text-ink-muted hover:bg-surface-muted"}`}
            >
              {g.name} · {g.items.length}
            </button>
          ))}
        </div>
        <span>Card {(idx % items.length) + 1} of {items.length}</span>
      </div>

      <button onClick={() => setFlipped(!flipped)} className={`w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-border-strong shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center relative group overflow-hidden ${isNative ? 'rounded-2xl' : ''}`}>
        {!flipped ? (
          <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform">
            <span className="text-tibetan-display">{card.tibetan}</span>
          </div>
        ) : (
          <div className="max-w-md px-6 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            {card.emoji && <span className="text-5xl mb-4">{card.emoji}</span>}
            <div className="text-2xl sm:text-3xl font-bold text-ink mb-2 leading-relaxed">{card.english}</div>
            <div className="text-sm sm:text-lg text-ink-light font-bold uppercase tracking-widest">{getReading(card, isLesson1)}</div>
          </div>
        )}
        <span className="absolute bottom-4 right-6 text-[10px] font-bold text-border-strong uppercase tracking-widest group-hover:text-ink-muted transition-colors">Tap card to flip</span>
      </button>

      <div className="w-full max-w-2xl flex items-center justify-between mt-8">
        <button onClick={prev} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-ink-muted hover:text-ink transition-colors ${isNative ? 'rounded-full' : ''}`}><ArrowLeft size={16} /> Prev</button>
        <Button variant="outline" onClick={() => speak(card.audioTarget)} disabled={playingItem !== null}>
          {playingItem === card.audioTarget ? <Loader2 size={18} className="animate-spin text-brand" /> : <Play size={18} className="fill-current text-brand" />} Play Audio
        </Button>
        <button onClick={next} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-ink-muted hover:text-ink transition-colors ${isNative ? 'rounded-full' : ''}`}>Next <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

// --- MATCH GAME ---
interface MatchGameProps {
  items: PracticeItem[];
  speak: (text: string) => void;
  playingItem: string | null;
  playErrorBeep: () => void;
  isLesson1: boolean;
  isNative: boolean;
}

function MatchGame({ items, speak, playingItem, playErrorBeep, isLesson1, isNative }: MatchGameProps) {
  const [seed, setSeed] = useState(0);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  
  const feedbackRef = useRef<HTMLDivElement>(null);

  const pairCount = isNative ? 4 : 6;
  const pool = useMemo(() => [...items].sort(() => 0.5 - Math.random()).slice(0, pairCount), [seed, items, pairCount]);
  const readings = useMemo(() => pool.map(p => ({ id: p.id, text: getReading(p, isLesson1) })).sort(() => 0.5 - Math.random()), [pool, isLesson1]);

  const solved = pool.length > 0 && pool.every(p => !!pairs[p.tibetan]);

  // Scroll to feedback when solved
  useEffect(() => {
    if (solved && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [solved]);

  const pick = (reading: { id: string, text: string }) => {
    if (!selectedWord) return;
    const targetItem = pool.find(p => p.tibetan === selectedWord);
    if (targetItem && getReading(targetItem, isLesson1) === reading.text) {
      setPairs(p => ({ ...p, [selectedWord]: reading.id }));
      speak(targetItem.audioTarget);
    } else {
      playErrorBeep();
    }
    setSelectedWord(null);
  };

  return (
    <div className="flex flex-col items-start w-full animate-in fade-in pb-12">
      <p className="text-sm font-bold text-ink-light mb-6 text-left w-full">Match the Tibetan text with its reading.</p>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-8 w-full items-start">
        <div className="flex flex-col gap-3 w-full">
          {pool.map((p) => {
            const active = selectedWord === p.tibetan;
            const isPaired = !!pairs[p.tibetan];
            const readingText = getReading(p, isLesson1);
            
            return (
              <button
                key={`tib-${p.id}`} 
                onClick={() => {
                  if (!isPaired) setSelectedWord(p.tibetan);
                  else speak(p.audioTarget); 
                }}
                className={`group flex w-full min-h-[3.5rem] h-auto py-2 items-center justify-between gap-2 border px-3 sm:px-4 text-left transition-colors bg-white ${
                  isNative ? 'rounded-2xl' : ''
                } ${
                  active ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : isPaired ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm cursor-pointer hover:bg-emerald-100" : "border-border-strong hover:border-brand hover:bg-surface-muted text-ink"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-tibetan text-2xl sm:text-3xl leading-none pt-1">{p.tibetan}</span>
                  {isPaired && (
                    <span className="text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity">
                      {playingItem === p.audioTarget ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                    </span>
                  )}
                </div>
                {isPaired && <span className="text-[10px] sm:text-xs font-bold font-mono text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-sm">{readingText}</span>}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 w-full">
          {readings.map((r, idx) => {
            const taken = Object.values(pairs).includes(r.id);
            
            return (
              <button
                key={`read-${r.id}-${idx}`} 
                onClick={() => pick(r)} 
                disabled={taken || !selectedWord}
                className={`flex w-full min-h-[3.5rem] h-auto py-2 items-center justify-between gap-2 border px-3 sm:px-4 text-left transition-colors font-mono font-bold text-sm sm:text-lg bg-white ${
                  isNative ? 'rounded-2xl' : ''
                } ${
                  taken ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : selectedWord ? "border-brand hover:bg-brand-light text-amber-700 shadow-sm cursor-pointer" : "cursor-not-allowed border-border-strong text-ink-light opacity-80"
                }`}
              >
                <span className="break-words whitespace-normal leading-tight">{r.text}</span>
                <ArrowLeft size={18} className={`shrink-0 ${selectedWord && !taken ? "text-brand" : "text-transparent"}`} />
              </button>
            );
          })}
        </div>
      </div>

      {solved && (
        <div ref={feedbackRef} className={`mt-6 flex flex-row items-center justify-between gap-3 p-4 border bg-stone-50 border-stone-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 w-full ${isNative ? 'rounded-[1.25rem]' : ''}`}>
          <span className="text-sm font-bold text-emerald-600">Perfect! 🎉</span>
          <button 
            onClick={() => { setPairs({}); setSelectedWord(null); setSeed(s => s + 1); }}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold transition shadow-sm ${isNative ? 'rounded-full' : ''} bg-stone-900 text-white hover:bg-stone-800`}
          >
            Next Round <Shuffle size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// --- LISTEN & SELECT ---
interface ListenSelectProps {
  items: PracticeItem[];
  speak: (text: string) => void;
  playingItem: string | null;
  playErrorBeep: () => void;
  isNative: boolean;
}

function ListenSelect({ items, speak, playingItem, playErrorBeep, isNative }: ListenSelectProps) {
  const [seed, setSeed] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  
  const feedbackRef = useRef<HTMLDivElement>(null);

  const pool = useMemo(() => {
    return [...items].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [seed, items]);

  const target = useMemo(() => {
    return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
  }, [pool]);

  // Scroll to feedback banner
  useEffect(() => {
    if (picked && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [picked]);

  if (!target) return null;

  const pick = (val: string) => {
    if (picked) return;
    setPicked(val);
    if (val === target.tibetan) {
      speak(target.audioTarget);
    } else {
      playErrorBeep();
    }
  };

  const nextRound = () => {
    setPicked(null);
    setSeed(s => s + 1);
  };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in pb-12">
      <p className="text-sm font-bold text-ink-light mb-6 self-start w-full">Listen to the audio and select the matching Tibetan text.</p>
      
      <div className="flex flex-col items-center gap-5 w-full max-w-xl">
        <Button 
          variant="outline" 
          onClick={() => speak(target.audioTarget)}
          disabled={playingItem !== null}
          className={`w-full max-w-[220px] shadow-sm border-2 ${isNative ? 'rounded-full' : ''}`}
        >
          {playingItem === target.audioTarget ? (
            <Loader2 size={20} className="animate-spin text-brand" />
          ) : (
            <Volume2 size={20} className="text-brand-dark" />
          )}
          <span className="font-bold text-ink">Play Audio</span>
        </Button>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {pool.map((p) => {
            const isRight = picked && p.tibetan === target.tibetan;
            const isWrong = picked === p.tibetan && p.tibetan !== target.tibetan;
            
            let stateClass = "bg-white border-border-strong hover:border-brand hover:bg-surface-muted text-ink";
            
            if (isRight) stateClass = "bg-emerald-50 text-emerald-700 border-emerald-400 cursor-pointer shadow-sm";
            else if (isWrong) stateClass = "bg-rose-50 text-rose-700 border-rose-400 opacity-60";
            else if (picked) stateClass = "bg-stone-50 text-stone-300 opacity-60 border-border-subtle";

            return (
              <button
                key={`listen-${p.id}`} 
                disabled={!!picked && !isRight}
                onClick={() => {
                  if (!picked) pick(p.tibetan);
                  else if (isRight) speak(target.audioTarget);
                }}
                className={`relative flex items-center justify-center h-20 sm:h-24 border text-center transition-all shadow-sm ${isNative ? 'rounded-2xl' : ''} ${stateClass}`}
              >
                {isRight && (
                  <div className="absolute top-2 right-2 text-emerald-600 opacity-70">
                    {playingItem === target.audioTarget ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                  </div>
                )}
                <span className="font-tibetan text-4xl leading-none">{p.tibetan}</span>
              </button>
            );
          })}
        </div>

        {picked && (
          <div ref={feedbackRef} className={`w-full mt-2 flex flex-row items-center justify-between gap-3 p-4 border bg-stone-50 border-stone-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 ${isNative ? 'rounded-[1.25rem]' : ''}`}>
            <span className={`text-sm font-bold ${picked === target.tibetan ? "text-emerald-600" : "text-rose-600"}`}>
              {picked === target.tibetan ? "Correct!" : "Incorrect."}
            </span>
            <button 
              onClick={nextRound}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold transition shadow-sm shrink-0 ${isNative ? 'rounded-full' : ''} bg-stone-900 text-white hover:bg-stone-800`}
            >
              Next Round <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MEMORY REVIEW (SRS) ---
interface MemoryReviewProps {
  items: PracticeItem[];
  speak: (text: string) => void;
  playingItem: string | null;
  isLesson1: boolean;
  isNative: boolean;
}

function MemoryReview({ items, speak, playingItem, isLesson1, isNative }: MemoryReviewProps) {
  const [deck, setDeck] = useState(() => [...items].sort(() => 0.5 - Math.random()));
  const [reviewedCount, setReviewedCount] = useState(0);
  const [rating, setRating] = useState<'Hard' | 'Good' | 'Easy' | null>(null);

  const nextCard = () => {
    if (!rating || deck.length === 0) return;
    const currentCard = deck[0]; 
    let newDeck = deck.slice(1);
    if (rating === 'Hard') { newDeck.splice(Math.min(Math.floor(Math.random() * 3) + 1, newDeck.length), 0, currentCard); } 
    else if (rating === 'Good') { newDeck.push(currentCard); }
    setDeck(newDeck); setReviewedCount(p => p + 1); setRating(null);
  };

  if (deck.length === 0) return (
    <div className="flex flex-col items-center justify-center text-center h-[400px] animate-in zoom-in-95">
      <div className="w-20 h-20 bg-emerald-100 rounded-full text-emerald-600 flex items-center justify-center mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
      <h3 className="text-3xl font-serif font-bold text-ink mb-4">Deck Complete!</h3>
      <p className="text-ink-light font-bold mb-8">You have successfully mastered all {items.length} cards.</p>
      <Button variant="secondary" onClick={() => { setDeck([...items].sort(() => 0.5 - Math.random())); setReviewedCount(0); }}>
        <Shuffle size={18} /> Review Again
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 text-eyebrow border-b border-border-strong pb-4">
          <span>Spaced repetition · rate your recall</span><span>{reviewedCount} reviewed</span>
        </div>
        
        <div className={`bg-white border border-border-strong p-8 sm:p-16 flex flex-col items-center justify-center mb-6 min-h-[300px] shadow-sm relative overflow-hidden ${isNative ? 'rounded-2xl' : ''}`}>
          <div className="text-tibetan-display mb-8 text-center">{deck[0].tibetan}</div>
          <Button variant="outline" onClick={() => speak(deck[0].audioTarget)} disabled={playingItem !== null}>
            {playingItem === deck[0].audioTarget ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className="text-brand" />} Check Sound
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button onClick={() => setRating('Hard')} className={`py-4 border font-bold text-sm transition-colors ${isNative ? 'rounded-2xl' : ''} ${rating === 'Hard' ? 'bg-rose-100 border-rose-400 text-rose-800' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}>Hard</button>
          <button onClick={() => setRating('Good')} className={`py-4 border font-bold text-sm transition-colors ${isNative ? 'rounded-2xl' : ''} ${rating === 'Good' ? 'bg-brand-light border-amber-400 text-brand-dark' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>Good</button>
          <button onClick={() => setRating('Easy')} className={`py-4 border font-bold text-sm transition-colors ${isNative ? 'rounded-2xl' : ''} ${rating === 'Easy' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>Easy</button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
          <p className="text-[11px] font-bold text-ink-muted uppercase tracking-widest flex items-center gap-2"><BookOpen size={14} /> Cards you mark Hard return soon.</p>
          <Button onClick={nextCard} disabled={!rating} variant={rating ? "primary" : "outline"} className="w-full sm:w-auto">
            Next Card <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}