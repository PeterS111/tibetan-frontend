// app/components/lesson/VocabGrid.tsx
"use client";

import { useState } from "react";
import { Volume2, Loader2, Eye, EyeOff } from "lucide-react";

export interface VocabItem {
  tib: string;
  pron: string;
  en: string;
  emoji?: string;
  accentHex?: string;
  badge?: { text: string; hex: string; bg: string; border: string };
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
  enableCoverTranslation?: boolean;
  groupBySection?: boolean;
}

export function VocabGrid({
  items,
  groups,
  playAudio,
  playingItem,
  enableCoverTranslation = false,
  groupBySection = false,
}: VocabGridProps) {
  const [filter, setFilter] = useState<string>("all");
  const [coverEn, setCoverEn] = useState<boolean>(false);

  const filteredItems = filter === "all" ? items : items.filter((v) => v.groupId === filter);

  const renderCard = (v: VocabItem) => (
    <button
      key={v.tib + v.pron}
      type="button"
      onClick={() => playAudio(v.tib)}
      className="group relative flex flex-col items-start gap-4 border border-border-strong bg-surface p-5 text-left transition-all hover:-translate-y-1 hover:shadow-md rounded-2xl overflow-hidden"
    >
      {v.accentHex && <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: v.accentHex }} />}

      <div className="flex w-full items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          {v.emoji && <span className="text-3xl opacity-90">{v.emoji}</span>}
          {v.badge && (
            <span className="border px-2 py-1 text-[9px] font-bold uppercase tracking-widest" style={{ backgroundColor: v.badge.bg, color: v.badge.hex, borderColor: v.badge.border }}>
              {v.badge.text}
            </span>
          )}
        </div>
        <span className="inline-grid size-8 shrink-0 place-items-center bg-surface-muted border border-border-strong text-ink-light rounded-full transition-colors group-hover:text-brand group-hover:bg-brand-light group-hover:border-amber-200">
          {playingItem === v.tib ? <Loader2 size={14} className="animate-spin text-brand" /> : <Volume2 size={14} />}
        </span>
      </div>

      <div className="w-full border-b border-border-strong pb-3 mt-auto">
        <div className="text-tibetan-card mb-1">{v.tib}</div>
        <div className="text-[11px] font-serif italic text-ink-muted">{v.pron}</div>
      </div>

      <div className="text-sm font-bold text-ink-light w-full">
        {coverEn ? (
          <span className="inline-block bg-surface-muted text-ink-muted text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-border-subtle select-none">
            Hidden
          </span>
        ) : (
          v.en
        )}
      </div>
    </button>
  );

  return (
    <div className="w-full">
      {((groups && groups.length > 0) || enableCoverTranslation) && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {groups && groups.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors ${
                  filter === "all" ? "border-ink bg-ink text-white shadow-sm" : "border-border-strong bg-surface text-ink-muted hover:border-ink-muted hover:text-ink"
                }`}
              >
                All · {items.length} words
              </button>
              {groups.map((g) => {
                const active = filter === g.id;
                const count = items.filter((v) => v.groupId === g.id).length;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFilter(g.id)}
                    className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors ${
                      active ? "border-ink bg-ink text-white shadow-sm" : "border-border-strong bg-surface text-ink-light hover:border-ink-muted hover:text-ink"
                    }`}
                  >
                    {g.hex && <span className="size-2.5 rounded-full" style={{ backgroundColor: g.hex }} />}
                    {g.label} · {count}
                  </button>
                );
              })}
            </div>
          ) : (
            <div />
          )}

          {enableCoverTranslation && (
            <button
              type="button"
              onClick={() => setCoverEn(!coverEn)}
              className={`inline-flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors ${
                coverEn ? "border-ink bg-ink text-white shadow-sm" : "border-border-strong bg-surface text-ink hover:bg-surface-muted"
              }`}
            >
              {coverEn ? <Eye size={14} /> : <EyeOff size={14} />}
              {coverEn ? "Show translation" : "Cover translation"}
            </button>
          )}
        </div>
      )}

      {groupBySection && groups && filter === "all" ? (
        <div className="space-y-8">
          {groups.map((g) => {
            const sectionItems = items.filter((v) => v.groupId === g.id);
            if (sectionItems.length === 0) return null;
            return (
              <div key={g.id}>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-3.5">{g.label}</div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{sectionItems.map(renderCard)}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{filteredItems.map(renderCard)}</div>
      )}
    </div>
  );
}
