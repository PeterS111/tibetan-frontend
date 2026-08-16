"use client";

import { useState, useMemo } from "react";
import { 
  Layers, Shuffle, BookOpen, CheckCircle2, ArrowRight, ArrowLeft, 
  Play, Loader2, Volume2 
} from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

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

// 🚨 FIXED: Globally strips out all square brackets from any reading string
const getReading = (item: PracticeItem, isLesson1: boolean) => {
  const preferred = isLesson1 ? (item.translit || item.pron) : (item.pron || item.translit);
  const rawReading = preferred || item.reading;
  return rawReading ? rawReading.replace(/[\[\]]/g, '') : "";
};

export default function PracticeSuite({ groups, playAudio, playingItem, playErrorBeep, isLesson1 = false }: PracticeSuiteProps) {
  const [tab, setTab] = useState<"flash" | "match" | "srs">("flash");

  const allItems = useMemo(() => groups.flatMap(g => g.items), [groups]);

  return (
    <Card className="p-0 border-border-subtle shadow-sm overflow-hidden">
      <div className="flex flex-wrap border-b border-border-subtle bg-surface-muted">
        {[
          { k: "flash", label: "Flashcards", Icon: Layers },
          { k: "match", label: "Match Game", Icon: Shuffle },
          { k: "srs", label: "Memory Review", Icon: BookOpen },
        ].map((t) => (
          <button 
            key={t.k} 
            onClick={() => setTab(t.k as any)} 
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              tab === t.k ? "bg-ink text-white" : "text-ink-muted hover:bg-white hover:text-ink"
            }`}
          >
            <t.Icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      
      <div className="p-6 md:p-10 bg-paper">
        {tab === "flash" && <Flashcards groups={groups} speak={playAudio} playingItem={playingItem} isLesson1={isLesson1} />}
        {tab === "match" && <MatchGame items={allItems} speak={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isLesson1={isLesson1} />}
        {tab === "srs" && <MemoryReview items={allItems} speak={playAudio} playingItem={playingItem} isLesson1={isLesson1} />}
      </div>
    </Card>
  );
}

// --- FLASHCARDS ---
function Flashcards({ groups, speak, playingItem, isLesson1 }: any) {
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
          {groups.map((g: any, i: number) => (
            <button 
              key={g.name} 
              onClick={() => { setActiveGroupIdx(i); setIdx(0); setFlipped(false); }} 
              className={`px-4 py-2 border transition-colors ${activeGroupIdx === i ? "bg-ink text-white border-ink" : "bg-white border-border-strong text-ink-muted hover:bg-surface-muted"}`}
            >
              {g.name} · {g.items.length}
            </button>
          ))}
        </div>
        <span>Card {(idx % items.length) + 1} of {items.length}</span>
      </div>

      <button onClick={() => setFlipped(!flipped)} className="w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-border-strong shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center relative group overflow-hidden">
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
        <button onClick={prev} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-ink-muted hover:text-ink transition-colors"><ArrowLeft size={16} /> Prev</button>
        <Button variant="outline" onClick={() => speak(card.audioTarget)} disabled={playingItem !== null}>
          {playingItem === card.audioTarget ? <Loader2 size={18} className="animate-spin text-brand" /> : <Play size={18} className="fill-current text-brand" />} Play Audio
        </Button>
        <button onClick={next} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-ink-muted hover:text-ink transition-colors">Next <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

// --- MATCH GAME ---
function MatchGame({ items, speak, playingItem, playErrorBeep, isLesson1 }: any) {
  const [seed, setSeed] = useState(0);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const pool = useMemo(() => [...items].sort(() => 0.5 - Math.random()).slice(0, 6), [seed, items]);
  const readings = useMemo(() => pool.map(p => getReading(p, isLesson1)).sort(() => 0.5 - Math.random()), [pool, isLesson1]);

  const pick = (reading: string) => {
    if (!selectedWord) return;
    const targetItem = pool.find(p => p.tibetan === selectedWord);
    if (targetItem && getReading(targetItem, isLesson1) === reading) {
      setPairs(p => ({ ...p, [selectedWord]: reading }));
      speak(targetItem.audioTarget);
    } else {
      playErrorBeep();
    }
    setSelectedWord(null);
  };

  const solved = pool.every(p => pairs[p.tibetan] === getReading(p, isLesson1));

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm font-bold text-ink-light mb-8 self-start w-full max-w-4xl">Match the Tibetan text with its reading.</p>
      
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl">
        <div className="space-y-3">
          {pool.map((p) => {
            const active = selectedWord === p.tibetan;
            const paired = pairs[p.tibetan];
            const correct = paired === getReading(p, isLesson1);
            
            // 🚨 FIXED: Active items now light up bright green instead of disappearing!
            
			return (
              <button
                key={`tib-${p.id}`} onClick={() => !paired && setSelectedWord(p.tibetan)}
                className={`flex w-full h-14 items-center justify-between border px-4 text-left transition-colors bg-white ${
                  active ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : paired ? (correct ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : "border-rose-400 bg-rose-50 text-rose-700") : "border-border-strong hover:border-brand hover:bg-surface-muted text-ink"
                }`}
              >
                <span className="font-tibetan text-3xl leading-none pt-1">{p.tibetan}</span>
                {paired && <span className="text-xs font-bold font-mono">{paired}</span>}
              </button>
            );
			
          })}
        </div>
        <div className="space-y-3">
          {readings.map((r, idx) => {
            const taken = Object.values(pairs).includes(r);
            
            // 🚨 FIXED: Matched items on the right now light up green and stay fully visible!
           
		   
		   return (
              <button
                key={`read-${r}-${idx}`} onClick={() => pick(r)} disabled={taken || !selectedWord}
                className={`flex w-full h-14 items-center justify-between border px-4 text-left transition-colors font-mono font-bold text-lg bg-white ${
                  taken ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : selectedWord ? "border-brand hover:bg-brand-light text-amber-700 shadow-sm cursor-pointer" : "cursor-not-allowed border-border-strong text-ink-light opacity-80"
                }`}
              >
                <span>{r}</span>
                <ArrowLeft size={18} className={selectedWord && !taken ? "text-brand" : "text-transparent"} />
              </button>
            );
		   
		   
          })}
        </div>
      </div>

      {solved && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <Button onClick={() => { setPairs({}); setSelectedWord(null); setSeed(s => s + 1); }}>
            Next Round <Shuffle size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}

// --- MEMORY REVIEW (SRS) ---
function MemoryReview({ items, speak, playingItem, isLesson1 }: any) {
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
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
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
        <div className="bg-white border border-border-strong p-8 sm:p-16 flex flex-col items-center justify-center mb-6 min-h-[300px] shadow-sm relative overflow-hidden">
          <div className="text-tibetan-display mb-8 text-center">{deck[0].tibetan}</div>
          <Button variant="outline" onClick={() => speak(deck[0].audioTarget)} disabled={playingItem !== null}>
            {playingItem === deck[0].audioTarget ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className="text-brand" />} Check Sound
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button onClick={() => setRating('Hard')} className={`py-4 border font-bold text-sm transition-colors ${rating === 'Hard' ? 'bg-rose-100 border-rose-400 text-rose-800' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}>Hard</button>
          <button onClick={() => setRating('Good')} className={`py-4 border font-bold text-sm transition-colors ${rating === 'Good' ? 'bg-brand-light border-amber-400 text-brand-dark' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>Good</button>
          <button onClick={() => setRating('Easy')} className={`py-4 border font-bold text-sm transition-colors ${rating === 'Easy' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>Easy</button>
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