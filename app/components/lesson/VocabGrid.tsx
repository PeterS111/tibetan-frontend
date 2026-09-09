// app/components/lesson/VocabGrid.tsx
"use client";

import { useState } from "react";
import { Volume2, Loader2 } from "lucide-react";

export interface VocabItem {
  tib: string;
  pron: string;
  en: string;
  emoji?: string;
  accentHex?: string;
  badge?: { text: string; hex: string; bg: string; border: string; };
  groupId?: string;
}

export interface VocabFilterGroup {
  id: string;
  label: string;
  hex?: string;
}

interface VocabGridProps {
  items: VocabItem[];
  groups?: VocabFilterGroup[];
  playAudio: (text: string) => void;
  playingItem: string | null;
}

export function VocabGrid({ items, groups, playAudio, playingItem }: VocabGridProps) {
  const [filter, setFilter] = useState<string>("all");
  
  const filteredItems = filter === "all" ? items : items.filter((v) => v.groupId === filter);

  return (
    <div className="w-full">
      {groups && groups.length > 0 && (
        
		
		
		<div className="mb-6 flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter("all")} 
            className={`inline-flex items-center gap-2 border px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-full ${filter === "all" ? "border-ink bg-ink text-white shadow-sm" : "border-border-subtle bg-surface text-ink-muted hover:border-ink-muted hover:text-ink"}`}
          >
            All · {items.length} words
          </button>
          {groups.map((g) => {
            const active = filter === g.id;
            const count = items.filter(v => v.groupId === g.id).length;
            return (
              <button 
                key={g.id} 
                onClick={() => setFilter(g.id)} 
                className={`inline-flex items-center gap-2 border px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-full ${active ? "border-ink bg-ink text-white shadow-sm" : "border-border-subtle bg-surface text-ink-light hover:border-ink-muted hover:text-ink"}`}
              >
                {g.hex && <span className="size-2.5 rounded-full" style={{ backgroundColor: g.hex }} />}
                {g.label} · {count}
              </button>
            );
          })}
        </div>
		
      )}
      
      
	  
	  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredItems.map((v) => (
          <button 
            key={v.tib + v.pron} 
            onClick={() => playAudio(v.tib)} 
            disabled={playingItem !== null} 
            className="group relative flex flex-col items-start gap-4 border border-border-subtle bg-surface p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md hover:border-brand/40 rounded-3xl overflow-hidden"
          >
            {v.accentHex && <span className="absolute inset-x-0 top-0 h-1 transition-all group-hover:h-1.5" style={{ backgroundColor: v.accentHex }} />}
            
            <div className="flex w-full items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                {v.emoji && <span className="text-3xl opacity-90">{v.emoji}</span>}
                {v.badge && (
                  <span className="border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full" style={{ backgroundColor: v.badge.bg, color: v.badge.hex, borderColor: v.badge.border }}>
                    {v.badge.text}
                  </span>
                )}
              </div>
              <span className="inline-grid size-8 shrink-0 place-items-center rounded-full bg-surface-muted border border-border-subtle text-ink-light transition-colors group-hover:text-brand group-hover:bg-brand/10 group-hover:border-brand/30">
                {playingItem === v.tib ? <Loader2 size={14} className="animate-spin text-brand" /> : <Volume2 size={14} />}
              </span>
            </div>
            
            <div className="w-full border-b border-border-subtle pb-3 mt-auto">
              <div className="text-tibetan-card mb-1">{v.tib}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{v.pron}</div>
            </div>
            
            <div className="text-sm font-bold text-ink-light w-full">{v.en}</div>
          </button>
        ))}
      </div>
	  
    </div>
  );
}