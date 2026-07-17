"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  Volume2, X, ChevronRight, ChevronLeft, Check, Sparkles, Repeat, Ear, Shuffle, Layers,
  CheckCircle2, BookOpen, Info, PenLine, Eraser, Moon, Sun, Play, Pause, RotateCcw,
  ArrowUp, ArrowDown, Loader2, ArrowLeft, ArrowRight, XCircle
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data & Configuration                                               */
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

// Clean SVGs for Lesson 2 Vocabulary
const VocabIcons = {
  People: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-indigo-500"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Who: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-rose-500"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>,
  Teeth: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-stone-700"><path d="M12 4c-3 0-5 3-5 6v4c0 3 2 6 5 6s5-3 5-6v-4c0-3-2-6-5-6z"/><path d="M7 14h10M7 10h10M12 4v16"/></svg>,
  Water: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-blue-500"><path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z"/></svg>,
  Fire: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>,
  Male: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-sky-600"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 00-16 0"/></svg>,
  Twenty: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-emerald-600"><path d="M8 10h3v10M8 14h3M15 10c-1.5 0-3 1-3 3v4c0 2 1.5 3 3 3s3-1 3-3v-4c0-2-1.5-3-3-3z"/></svg>,
  Drawing: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-fuchsia-500"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.124-.224-.254-.377-.59-.377-.96 0-.825.675-1.5 1.5-1.5H16c3.315 0 6-2.685 6-6 0-4.97-4.925-9-11-9z"/></svg>,
  Milk: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-sky-300"><path d="M8 2h8M10 2v4M14 2v4M6 8h12l-1 14H7L6 8zM6 12h12"/></svg>,
  Paper: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-stone-400"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  Apple: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-red-500"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.914 4.914 0 0017 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 00-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06zM10 2c1 .5 2 2 2 5"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-amber-400"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Female: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-rose-400"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 00-16 0"/><path d="M16 11s-1.5-2-4-2-4 2-4 2"/></svg>,
  Yoghurt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-amber-100"><path d="M12 22a8 8 0 008-8H4a8 8 0 008 8z"/><path d="M4 14a8 8 0 0116 0"/><path d="M8 12s1.5-2 4-2 4 2 4 2"/></svg>,
  Mouse: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-stone-500"><path d="M5 3a4 4 0 00-4 4c0 1.5 1 3 2 3v3c0 3.5 3.5 6 7 6s7-2.5 7-6v-3c1 0 2-1.5 2-3a4 4 0 00-4-4c-1.5 0-3 1-3 3 0-1.5-1.5-3-3-3S6 4.5 6 6c0-1.5-1-3-1-3zM12 16v1M9 13h.01M15 13h.01"/></svg>,
  Brother: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-amber-600"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 00-16 0"/><path d="M9 8h.01M15 8h.01M12 11h.01"/></svg>,
};

const VOCAB = [
  { tib: "མི", translit: "mi", en: "people", Icon: VocabIcons.People, vowel: "i" },
  { tib: "སུ", translit: "su", en: "who", Icon: VocabIcons.Who, vowel: "u" },
  { tib: "སོ", translit: "so", en: "teeth", Icon: VocabIcons.Teeth, vowel: "o" },
  { tib: "ཆུ", translit: "chu", en: "water", Icon: VocabIcons.Water, vowel: "u" },
  { tib: "མེ", translit: "me", en: "fire", Icon: VocabIcons.Fire, vowel: "e" },
  { tib: "ཕོ", translit: "pho", en: "male", Icon: VocabIcons.Male, vowel: "o" },
  { tib: "ཉི་ཤུ", translit: "nyi-shu", en: "twenty", Icon: VocabIcons.Twenty, vowel: "u" },
  { tib: "རི་མོ", translit: "ri-mo", en: "drawing", Icon: VocabIcons.Drawing, vowel: "i" },
  { tib: "འོ་མ", translit: "o-ma", en: "milk", Icon: VocabIcons.Milk, vowel: "o" },
  { tib: "ཤུ་གུ", translit: "shu-gu", en: "paper", Icon: VocabIcons.Paper, vowel: "u" },
  { tib: "ཀུ་ཤུ", translit: "ku-shu", en: "apple", Icon: VocabIcons.Apple, vowel: "u" },
  { tib: "ཉི་མ", translit: "nyi-ma", en: "sun", Icon: VocabIcons.Sun, vowel: "i" },
  { tib: "མོ", translit: "mo", en: "she / female", Icon: VocabIcons.Female, vowel: "o" },
  { tib: "ཞོ", translit: "zho", en: "yoghurt", Icon: VocabIcons.Yoghurt, vowel: "o" },
  { tib: "ཙི་ཙི", translit: "tsi-tsi", en: "mouse", Icon: VocabIcons.Mouse, vowel: "i" },
  { tib: "ཇོ་ཇོ", translit: "jo-jo", en: "elder brother", Icon: VocabIcons.Brother, vowel: "o" },
];

const COMBINED_PRACTICE_ITEMS = [
  ...VOWELS.map(v => ({ id: `vowel-${v.key}`, text: v.tib, wylie: v.translit, hint: v.markTranslit, Icon: null, type: 'letter' })),
  ...VOCAB.map(v => ({ id: `vocab-${v.tib}`, text: v.tib, wylie: v.translit, hint: v.en, Icon: v.Icon, type: 'vocab' }))
];

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function VowelsLesson() {
  const { getToken } = useAuth();
  
  const [selected, setSelected] = useState<Vowel | null>(null);
  const [filter, setFilter] = useState<"all" | Position>("all");
  const [studyMode, setStudyMode] = useState<"paper" | "night">("paper");
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  const [activePracticeTab, setActivePracticeTab] = useState("Flashcards");

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

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-stone-800 font-sans pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-8 uppercase tracking-widest">
          <Link href="/dashboard/lessons" className="hover:text-stone-800 transition-colors">My Lessons</Link>
          <ChevronRight size={14} />
          <span>Unit 02</span>
          <ChevronRight size={14} />
          <span className="text-stone-800 font-bold">The Four Vowels</span>
        </div>

        {/* Hero */}
        <section className="mb-14 grid gap-6 border border-black/[0.06] bg-white p-6 md:grid-cols-[1fr,auto] md:items-end md:p-10 shadow-sm">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">Lesson 02 · Foundations</div>
            <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl text-stone-900">The Four Tibetan Vowels</h1>
            <p className="mt-1 font-serif text-2xl italic text-stone-500">དབྱངས་བཞི།</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
              Every Tibetan syllable is voiced through a vowel. Just four diacritic marks — three above the letter and one below — turn the thirty consonants into the full range of spoken sound. Learn each mark's shape, position, and pronunciation, then practise spelling and reading with vocabulary built from these vowels alone.
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500">
              <span>Lesson progress</span>
              <span className="text-amber-500">4 of 6 sections</span>
            </div>
            <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-2/3 rounded-full"></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="border border-black/5 p-2 bg-stone-50"><div className="font-serif text-lg text-stone-800">4</div><div className="text-[9px] uppercase tracking-widest text-stone-500">Vowels</div></div>
              <div className="border border-black/5 p-2"><div className="font-serif text-lg text-stone-800">3</div><div className="text-[9px] uppercase tracking-widest text-stone-500">Above</div></div>
              <div className="border border-black/5 p-2"><div className="font-serif text-lg text-stone-800">1</div><div className="text-[9px] uppercase tracking-widest text-stone-500">Below</div></div>
            </div>
          </div>
        </section>

        {/* 1. Type Specimen */}
        <section className="mb-20">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 01</div>
              <h2 className="text-3xl font-serif text-stone-900">The four vowels, as a type specimen</h2>
            </div>
            <button onClick={() => setStudyMode((m) => (m === "paper" ? "night" : "paper"))} className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors uppercase tracking-widest">
              {studyMode === "paper" ? <Moon size={14} /> : <Sun size={14} />}
              {studyMode === "paper" ? "Study mode" : "Paper mode"}
            </button>
          </div>

          <div className="mb-5 flex flex-wrap gap-2 text-[10px] font-bold tracking-widest uppercase">
            {(["all", "above", "below"] as const).map((k) => (
              <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 rounded transition-colors ${filter === k ? "bg-stone-900 text-white" : "border border-stone-200 text-stone-500 hover:border-stone-400"}`}>
                {k === "all" ? `All ${VOWELS.length}` : POSITION_META[k].label}
              </button>
            ))}
          </div>

          <div className={`relative overflow-hidden border p-3 sm:p-5 transition-colors duration-500 ${studyMode === "night" ? "border-white/5 bg-[#0f0d0a]" : "border-black/[0.06] bg-gradient-to-br from-stone-50 to-white"}`}>
            <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-[0.06] ${studyMode === "night" ? "opacity-[0.08]" : ""}`} style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "48px 48px", color: studyMode === "night" ? "#FFB600" : "#1c1917" }} />

            <div className="relative mb-2 grid grid-cols-2 gap-2 sm:mb-3 sm:gap-3 md:grid-cols-4">
              {VOWELS.map((v, i) => {
                const pm = POSITION_META[v.position];
                return (
                  <button key={`mark-${v.key}`} onClick={() => playAudio(v.markTranslit)} className={`group relative flex aspect-square flex-col overflow-hidden border p-4 text-left transition-all hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-black/[0.06] bg-white hover:shadow-md"}`}>
                    <span className="absolute inset-x-0 top-0 h-[3px] transition-all group-hover:h-[5px]" style={{ backgroundColor: pm.hex }} />
                    <span className={`flex flex-1 items-center justify-center font-serif text-6xl leading-none transition-transform group-hover:scale-110 ${studyMode === "night" ? "text-amber-500" : "text-stone-900"}`}>{"\u25CC" + v.mark}</span>
                    <div className="absolute top-4 right-4">{playingItem === v.markTranslit ? <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> : null}</div>
                  </button>
                )
              })}
            </div>

            <div className="relative grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
              {filtered.map((v, i) => {
                const pm = POSITION_META[v.position];
                return (
                  <button key={v.key} onClick={() => { setSelected(v); playAudio(v.tib); }} className={`group relative flex aspect-square flex-col overflow-hidden border p-4 text-left transition-all hover:-translate-y-1 ${studyMode === "night" ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-black/[0.06] bg-white hover:shadow-md"}`}>
                    <span className="absolute inset-x-0 top-0 h-[3px] transition-all group-hover:h-[5px]" style={{ backgroundColor: pm.hex }} />
                    <span className={`flex flex-1 items-center justify-center font-serif text-6xl leading-none transition-transform group-hover:scale-110 ${studyMode === "night" ? "text-amber-500" : "text-stone-900"}`}>{v.tib}</span>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${studyMode === "night" ? "text-white/80" : "text-stone-800"}`}>{v.translit}</span>
                        <span className={`text-[9px] tracking-widest ${studyMode === "night" ? "text-white/40" : "text-stone-500"}`}>{v.markTranslit}</span>
                      </div>
                    </div>
                    {playingItem === v.tib && <div className="absolute top-4 right-4"><Loader2 className="w-4 h-4 animate-spin text-amber-500" /></div>}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* 2. Pronunciation */}
        <section className="mb-20">
          <div className="mb-8">
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 02</div>
            <h2 className="text-3xl font-serif text-stone-900">Pronouncing the four vowels</h2>
            <p className="mt-4 max-w-3xl text-sm text-stone-600 leading-relaxed">
              Pronouncing the Tibetan vowels isn't difficult. Look at the equivalent pronunciation in English — each vowel maps cleanly to sounds you already say every day.
            </p>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm mb-6">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Vowel</th>
                  <th className="px-6 py-4 text-left font-bold">Sound</th>
                  <th className="px-6 py-4 text-left font-bold hidden sm:table-cell">As in English</th>
                  <th className="px-6 py-4 text-right font-bold">Listen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {VOWELS.map((v) => (
                  <tr key={v.key} className="transition hover:bg-stone-50">
                    <td className="px-6 py-5">
                      <button onClick={() => setSelected(v)} className="inline-flex items-center gap-4">
                        <span className="font-serif text-4xl text-stone-900 leading-none">{v.tib}</span>
                        <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">{v.markTranslit}</span>
                      </button>
                    </td>
                    <td className="px-6 py-5 font-serif text-2xl text-stone-800">{v.translit}</td>
                    <td className="px-6 py-5 text-stone-600 hidden sm:table-cell">{v.english}</td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => playAudio(v.translit)} disabled={playingItem !== null} className="w-10 h-10 inline-flex items-center justify-center bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors">
                        {playingItem === v.translit ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-xl flex items-start gap-3 shadow-sm">
             <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
             <p className="text-sm text-stone-600 leading-relaxed">
               The absence of a vowel mark on a Tibetan letter is treated as an inherent <span className="font-bold text-stone-900">‘a’</span> — for example ཀ is read <em>ka</em>, not <em>k</em>. The four diacritics ི ུ ེ ོ replace that inherent ‘a’ with the vowels I, U, E, O respectively.
             </p>
          </div>
        </section>

        {/* 3. Diacritic Marks */}
        <section className="mb-20">
          <div className="mb-8">
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 03</div>
            <h2 className="text-3xl font-serif text-stone-900">The four diacritic marks</h2>
            <p className="mt-4 max-w-3xl text-sm text-stone-600 leading-relaxed">
              Each vowel has its own traditional Tibetan name. Three sit above the root letter; only <span className="font-bold text-stone-900">shabkyu</span> is written beneath it.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VOWELS.map((v) => {
              const pm = POSITION_META[v.position];
              return (
                <div key={v.key} className={`bg-white border rounded-xl p-6 shadow-sm ring-1 ${pm.ring}`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest ${pm.swatch} ${pm.text}`}>
                    {v.position === "above" ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {pm.label}
                  </div>
                  <div className="mt-8 flex items-baseline gap-4">
                    <span className="font-serif text-7xl text-stone-900 leading-none">{v.tib}</span>
                    <span className="font-serif text-3xl italic text-stone-400">{v.translit}</span>
                  </div>
                  <div className="mt-8 border-t border-stone-100 pt-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Mark name</div>
                    <div className="font-serif text-2xl text-stone-800 mb-1">{v.markTib}</div>
                    <div className="text-xs font-medium text-stone-500">{v.markTranslit} · {v.markGloss}</div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">{v.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Spelling */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 04</div>
              <h2 className="text-3xl font-serif text-stone-900">Spelling — root letter + vowel mark</h2>
              <p className="mt-4 max-w-3xl text-sm text-stone-600 leading-relaxed">
                Spelling plays a key role in your reading skills. Practise saying the math: <em>root letter</em> + <em>vowel mark name</em> = <em>final sound</em>.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-widest">
              སྦྱོར་ཀློག
            </div>
          </div>

          <div className="border border-stone-200 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
              {VOWELS.map((v) => (
                <div key={v.key} className="p-8">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-6">
                    <span className="h-2 w-4 rounded-sm" style={{ backgroundColor: POSITION_META[v.position].hex }} /> Spelling {v.translit}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-4">
                    <span className="font-serif text-5xl text-stone-900 leading-none">ཨ</span>
                    <span className="text-2xl text-stone-400">+</span>
                    <span className="font-serif text-5xl text-stone-900 leading-none">{v.markTib}</span>
                    <span className="text-2xl text-stone-400">⇒</span>
                    <span className="font-serif text-5xl text-amber-600 leading-none">{v.tib}</span>
                    <span className="text-2xl text-stone-400">⇒</span>
                    <span className="font-serif text-4xl italic text-stone-800">{v.translit}</span>
                    <button onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="w-10 h-10 inline-flex items-center justify-center bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors ml-2">
                      {playingItem === v.tib ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} />}
                    </button>
                  </div>

                  <div className="text-sm font-medium text-stone-500 mb-8 bg-stone-50 p-3 rounded-lg border border-stone-100">
                    [a + {v.markTranslit}] ⇒ {v.markGloss} ⇒ {v.translit}
                  </div>

                  <div className="border-t border-stone-100 pt-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Try it with other consonants</div>
                    <div className="flex flex-wrap gap-3">
                      {v.examples.map((ex) => (
                        <button key={ex} onClick={() => playAudio(ex)} disabled={playingItem !== null} className="inline-flex items-center gap-2 border border-stone-200 rounded-lg bg-white px-4 py-2 transition hover:border-amber-300 hover:bg-amber-50 shadow-sm">
                          <span className="font-serif text-2xl text-stone-800">{ex}</span>
                          {playingItem === ex ? <Loader2 size={14} className="animate-spin text-amber-500" /> : <Volume2 size={14} className="text-amber-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Vocabulary */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 05</div>
              <h2 className="text-3xl font-serif text-stone-900">Nouns formed with the four vowels</h2>
            </div>
            <div className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-widest">
              Vocabulary · མིང་ཚིག
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {VOCAB.map((v) => {
              const pm = POSITION_META[VOWELS.find((x) => x.key === v.vowel)!.position];
              return (
                <div key={v.tib} className="bg-white border border-stone-200 p-5 rounded-xl shadow-sm transition-all hover:border-amber-300 flex flex-col group relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 opacity-90"><v.Icon /></div>
                    <span className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: pm.hex + "22", color: pm.hex }}>
                      {v.vowel}
                    </span>
                  </div>
                  <div className="font-serif text-3xl text-stone-900 mb-1">{v.tib}</div>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">{v.translit}</div>
                  <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                    <span className="text-sm font-bold text-stone-700">{v.en}</span>
                    <button onClick={() => playAudio(v.tib)} disabled={playingItem !== null} className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors">
                      {playingItem === v.tib ? <Loader2 size={14} className="animate-spin text-amber-500" /> : <Volume2 size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Practice Area */}
        <section className="mb-20">
          <div className="mb-8">
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">Section 06</div>
            <h2 className="text-3xl font-serif text-stone-900">Practice & exercises</h2>
          </div>

          <div className="bg-[#fcfaf5] border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex flex-wrap items-center justify-between border-b border-stone-200 bg-white">
              <div className="flex overflow-x-auto custom-scrollbar w-full">
                {[
                  { name: 'Flashcards', icon: Layers },
                  { name: 'Trace', icon: PenLine },
                  { name: 'Listen & Select', icon: Ear },
                  { name: 'Match', icon: Shuffle },
                  { name: 'Memory Review', icon: Repeat }
                ].map((tab) => (
                  <button key={tab.name} onClick={() => setActivePracticeTab(tab.name as any)} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activePracticeTab === tab.name ? 'border-amber-500 text-stone-900 bg-stone-50/50' : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}>
                    <tab.icon size={16} /> {tab.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-12">
              {activePracticeTab === 'Flashcards' && <Flashcards speak={playAudio} playingItem={playingItem} />}
              {activePracticeTab === 'Trace' && <VowelTrace speak={playAudio} playingItem={playingItem} />}
              {activePracticeTab === 'Listen & Select' && <ListenSelect speak={playAudio} playingItem={playingItem} />}
              {activePracticeTab === 'Match' && <MatchExercise speak={playAudio} playingItem={playingItem} />}
              {activePracticeTab === 'Memory Review' && <MemoryReview speak={playAudio} playingItem={playingItem} />}
            </div>
          </div>
        </section>

      </div>

      {/* Slide-over Drawer for Detail Panel */}
      {selected && <DetailPanel v={selected} onClose={() => setSelected(null)} onSpeak={playAudio} playingItem={playingItem} />}

      {/* Sticky Footer */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-[#fdfbf7] border-t border-stone-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/1" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} /> Previous: 30 Consonants
          </Link>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl shadow-sm transition-colors">
            <CheckCircle2 size={18} /> Mark lesson complete
          </button>
          <Link href="/dashboard/lessons" className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-800 hover:text-amber-600 transition-colors">
            Next: Subjoined Letters <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail Panel Component                                              */
/* ------------------------------------------------------------------ */
function DetailPanel({ v, onClose, onSpeak, playingItem }: { v: Vowel; onClose: () => void; onSpeak: (t: string) => void; playingItem: string | null; }) {
  const pm = POSITION_META[v.position];
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#fdfbf7] h-full shadow-2xl flex flex-col animate-in slide-in-from-right-8 border-l border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Vowel · {v.translit}</span>
          <button onClick={onClose} className="p-2 -mr-2 text-stone-400 hover:bg-stone-100 rounded-lg"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex items-center justify-center py-6 font-serif text-[140px] text-stone-900 leading-none">{v.tib}</div>
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="font-serif text-3xl italic">{v.translit}</span>
            <span className="text-stone-300">·</span>
            <span className="font-mono text-xl text-stone-500">{v.markGloss}</span>
            <button onClick={() => onSpeak(v.translit)} disabled={playingItem !== null} className="w-10 h-10 bg-amber-500 text-stone-900 rounded-lg flex items-center justify-center shadow-sm">
              {playingItem === v.translit ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded-xl border ${pm.swatch} border-amber-200`}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Position</div>
              <div className={`font-serif text-lg ${pm.text}`}>{pm.label}</div>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Mark Name</div>
              <div className="font-serif text-xl text-stone-800">{v.markTib}</div>
              <div className="text-xs italic text-stone-500">{v.markTranslit}</div>
            </div>
          </div>
          <div className="mb-6"><div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Pronunciation</div><p className="text-sm font-medium text-stone-700">{v.english}</p></div>
          <div className="mb-6 border-t border-stone-200 pt-6"><div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Textbook Notes</div><p className="text-sm text-stone-600 bg-white p-4 border border-stone-200 rounded-lg italic">{v.note}</p></div>
          <div className="mb-6 border-t border-stone-200 pt-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Try with other letters</div>
            <div className="flex gap-2">
              {v.examples.map(ex => (
                <button key={ex} onClick={() => onSpeak(ex)} className="border border-stone-200 bg-white px-3 py-1.5 rounded-lg flex gap-2 items-center hover:bg-amber-50 hover:border-amber-300">
                  <span className="font-serif text-2xl">{ex}</span> <Volume2 className="size-4 text-amber-500"/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Flashcards Component                                                */
/* ------------------------------------------------------------------ */
function Flashcards({ speak, playingItem }: { speak: (t: string) => void, playingItem: string | null }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = COMBINED_PRACTICE_ITEMS[idx];

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % COMBINED_PRACTICE_ITEMS.length); };
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + COMBINED_PRACTICE_ITEMS.length) % COMBINED_PRACTICE_ITEMS.length); };

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-2xl flex justify-between items-center mb-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
        <span className="bg-stone-900 text-white px-2 py-1 rounded">ALL CARDS</span>
        <span>Card {idx + 1} of {COMBINED_PRACTICE_ITEMS.length}</span>
      </div>
      <div onClick={() => setFlipped(!flipped)} className="w-full max-w-2xl aspect-[3/2] sm:aspect-[2/1] bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center relative group">
        {!flipped ? (
          <div className="text-6xl md:text-8xl font-serif text-stone-900 group-hover:scale-105 transition-transform">{card.text}</div>
        ) : (
          <div className="text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            {card.Icon && <div className="w-16 h-16 mb-4 opacity-90 text-stone-700"><card.Icon /></div>}
            <div className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">{card.hint}</div>
            <div className="text-lg md:text-xl text-stone-400 tracking-widest">{card.wylie}</div>
          </div>
        )}
        <div className="absolute bottom-4 right-6 text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:text-stone-400">Tap card to flip</div>
      </div>
      <div className="w-full max-w-2xl flex items-center justify-between mt-8">
        <button onClick={prev} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800"><ArrowLeft size={16} /> Previous</button>
        <button onClick={() => speak(card.text)} disabled={playingItem !== null} className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl shadow-sm">
          {playingItem === card.text ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />} Play sound
        </button>
        <button onClick={next} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800">Next <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trace Component                                                     */
/* ------------------------------------------------------------------ */
type StrokeStep = { dir: "→" | "↓" | "↘" | "↙" | "↺" | "↻" | "⤵" | "⤴"; hint: string };
const STROKE_ORDER: Record<VowelKey, StrokeStep[]> = {
  i: [{ dir: "→", hint: "Start above the letter and draw a short horizontal head." }, { dir: "↘", hint: "Curl the tail down and to the right to finish the gi-gu hook." }],
  u: [{ dir: "↙", hint: "Start beneath the letter — dip down and to the left." }, { dir: "↻", hint: "Curl the tail back around, closing the shabkyu loop." }],
  e: [{ dir: "↘", hint: "One short diagonal stroke slanting down to the right, above the letter." }],
  o: [{ dir: "↻", hint: "Draw a small circle above the letter — clockwise from the top." }],
};

function VowelTrace({ speak, playingItem }: { speak: (t: string) => void, playingItem: string | null }) {
  const [idx, setIdx] = useState(0);
  const [strokes, setStrokes] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [drawing, setDrawing] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  const v = VOWELS[idx % VOWELS.length];
  const strokeSteps = STROKE_ORDER[v.key];
  const strokeCount = strokeSteps.length;

  useEffect(() => { setStrokes([]); setCurrent(""); setStep(0); setPlaying(false); }, [idx]);
  useEffect(() => {
    if (!playing) return;
    if (step >= strokeCount) { setPlaying(false); return; }
    const t = window.setTimeout(() => setStep((s) => s + 1), 900);
    return () => window.clearTimeout(t);
  }, [playing, step, strokeCount]);

  const point = (e: React.PointerEvent) => {
    const svg = svgRef.current; if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 400;
    return { x, y };
  };

  const start = (e: React.PointerEvent) => { (e.target as Element).setPointerCapture?.(e.pointerId); const p = point(e); if (!p) return; setDrawing(true); setCurrent(`M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`); };
  const move = (e: React.PointerEvent) => { if (!drawing) return; const p = point(e); if (!p) return; setCurrent((s) => `${s} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`); };
  const end = () => { if (!drawing) return; setDrawing(false); if (current) setStrokes((s) => [...s, current]); setCurrent(""); };
  const clearInk = () => { setStrokes([]); setCurrent(""); };
  const restart = () => { setStep(0); setPlaying(false); setStrokes([]); setCurrent(""); };

  const revealPct = Math.min(1, step / strokeCount);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="font-serif text-6xl leading-none text-stone-900">{v.tib}</span>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Trace the vowel</div>
            <div className="mt-1 font-serif text-xl font-bold">{v.translit} <span className="text-stone-400 font-medium italic">· {v.markTranslit}</span></div>
            <div className="mt-0.5 text-[11px] uppercase tracking-widest text-stone-400">{strokeCount} stroke{strokeCount === 1 ? "" : "s"} · {POSITION_META[v.position].label}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={playing ? () => setPlaying(false) : () => { if(step>=strokeCount)setStep(0); setPlaying(true); }} className="inline-flex items-center gap-2 bg-stone-900 rounded-lg px-4 py-2 text-xs font-bold text-white hover:bg-stone-800">
            {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pause" : step >= strokeCount ? "Replay" : "Play"}
          </button>
          <button onClick={restart} className="inline-flex items-center gap-2 border border-stone-200 rounded-lg bg-white px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50"><RotateCcw size={14} /> Restart</button>
          <button onClick={clearInk} className="inline-flex items-center gap-2 border border-stone-200 rounded-lg bg-white px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50"><Eraser size={14} /> Clear</button>
          <button onClick={() => speak(v.translit)} disabled={playingItem !== null} className="inline-flex items-center gap-2 bg-amber-500 rounded-lg px-4 py-2 text-xs font-bold text-stone-900 hover:bg-amber-400">
            {playingItem === v.translit ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />} Play sound
          </button>
        </div>
      </div>

      <ol className="mb-4 divide-y divide-stone-100 border border-stone-200 bg-white rounded-xl overflow-hidden shadow-sm">
        {strokeSteps.map((s, i) => {
          const done = i < step; const active = i === step - 1 || (step === 0 && i === 0 && !playing);
          return (
            <li key={i} className={`flex items-center gap-4 px-4 py-3 text-sm font-medium ${done ? "text-stone-900" : "text-stone-400"} ${active ? "bg-amber-50" : ""}`}>
              <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-stone-900 text-white" : "border-2 border-stone-200 text-stone-400"}`}>{i + 1}</span>
              <span className="w-6 shrink-0 text-center font-bold text-amber-500 text-lg">{s.dir}</span>
              <span className="leading-snug">{s.hint}</span>
            </li>
          );
        })}
      </ol>

      <div className="relative overflow-hidden border border-stone-200 rounded-xl bg-[#fdfaf3] shadow-inner">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(to right, #1c1917 1px, transparent 1px), linear-gradient(to bottom, #1c1917 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-800 shadow-sm backdrop-blur border border-stone-200">
          Stroke {Math.min(step, strokeCount)} / {strokeCount}
          {strokeSteps[step - 1] && <span className="ml-1 rounded bg-amber-500 px-2 py-0.5 text-white">{strokeSteps[step - 1].dir}</span>}
        </div>
        <svg ref={svgRef} viewBox="0 0 400 400" className="relative block h-72 w-full touch-none md:h-96" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} onPointerCancel={end}>
          <defs><clipPath id={`vowel-canvas-clip-${idx}`}><rect x="0" y="0" width="400" height={revealPct * 400} style={{ transition: "height 700ms ease-in-out" }} /></clipPath></defs>
          <text x="200" y="230" textAnchor="middle" dominantBaseline="central" fontSize="280" style={{ fontFamily: "Jomolhari, 'Noto Sans Tibetan', serif" }} fill="#1c1917" fillOpacity="0.09">{v.tib}</text>
          <text x="200" y="230" textAnchor="middle" dominantBaseline="central" fontSize="280" style={{ fontFamily: "Jomolhari, 'Noto Sans Tibetan', serif" }} fill="#1c1917" fillOpacity="0.55" clipPath={`url(#vowel-canvas-clip-${idx})`}>{v.tib}</text>
          {strokes.map((d, i) => <path key={i} d={d} fill="none" stroke="#1c1917" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />)}
          {current && <path d={current} fill="none" stroke="#FFB600" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => setIdx((i) => (i - 1 + VOWELS.length) % VOWELS.length)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800"><ChevronLeft size={16} /> Previous</button>
        <button onClick={() => setIdx((i) => (i + 1) % VOWELS.length)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-800">Next <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Listen & Select, Match, Memory Review Components                   */
/* ------------------------------------------------------------------ */

function ListenSelect({ speak, playingItem }: { speak: (t: string) => void, playingItem: string | null }) {
  const [seed, setSeed] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const { answer, choices } = useMemo(() => {
    const answer = [...COMBINED_PRACTICE_ITEMS].sort(() => Math.random() - 0.5)[0];
    const distractors = COMBINED_PRACTICE_ITEMS.filter(i => i.id !== answer.id).sort(() => Math.random() - 0.5).slice(0, 3);
    return { answer, choices: [answer, ...distractors].sort(() => Math.random() - 0.5) };
  }, [seed]);

  const correct = picked === answer.text;

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm text-stone-500 mb-8 self-start w-full max-w-4xl">Listen to the sound and choose the correct option.</p>
      <button onClick={() => speak(answer.text)} disabled={playingItem !== null} className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 mb-12 shadow-md transition-colors">
        {playingItem === answer.text ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />} PLAY SOUND
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {choices.map((opt) => {
          const isSelected = picked === opt.text;
          const isCorrect = answer.text === opt.text;
          let borderClass = "border-stone-200 hover:border-amber-300";
          let bgClass = "bg-white hover:bg-stone-50 cursor-pointer";
          let textClass = "text-stone-900";

          if (isSelected && isCorrect) { borderClass = "border-emerald-500 ring-2 ring-emerald-500/20"; bgClass = "bg-emerald-50"; textClass = "text-emerald-700"; } 
          else if (isSelected && !isCorrect) { borderClass = "border-rose-500"; bgClass = "bg-rose-50"; textClass = "text-rose-700"; } 
          else if (picked && isCorrect) { borderClass = "border-emerald-300 border-dashed"; bgClass = "bg-emerald-50/50"; textClass = "text-emerald-600"; } 
          else if (picked) { borderClass = "border-stone-100 opacity-50"; bgClass = "bg-stone-50 cursor-default"; }

          return (
            <button key={opt.id} onClick={() => { if (!picked) { setPicked(opt.text); speak(opt.text); } }} disabled={picked !== null} className={`relative aspect-square flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl border-2 transition-all ${borderClass} ${bgClass}`}>
              <span className={`text-4xl sm:text-5xl lg:text-6xl font-serif text-center transition-colors ${textClass}`}>{opt.text}</span>
              {isSelected && isCorrect && <div className="absolute top-3 right-3 text-emerald-500 animate-in zoom-in"><CheckCircle2 size={20}/></div>}
              {isSelected && !isCorrect && <div className="absolute top-3 right-3 text-rose-500 animate-in zoom-in"><XCircle size={20}/></div>}
            </button>
          )
        })}
      </div>
      {picked && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setPicked(null); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-2">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MatchExercise({ speak, playingItem }: { speak: (t: string) => void, playingItem: string | null }) {
  const [seed, setSeed] = useState(0);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const questions = useMemo(() => {
    const targets = [...COMBINED_PRACTICE_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
    return targets.map(target => {
      const distractors = COMBINED_PRACTICE_ITEMS.filter(i => i.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 2);
      return { target, options: [target, ...distractors].sort(() => Math.random() - 0.5) };
    });
  }, [seed]);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <p className="text-sm text-stone-500 mb-8 self-start w-full max-w-4xl">Match the Tibetan with its English or Phonetic meaning.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {questions.map((q, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-stone-200 rounded-lg shadow-sm gap-4 sm:gap-2">
            <div className="text-3xl font-serif text-stone-900 sm:ml-4 text-center sm:text-left">{q.target.text}</div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto sm:mr-2">
              {q.options.map(opt => {
                const isSelected = matchAnswers[q.target.text] === opt.text;
                const isCorrect = q.target.text === opt.text;
                const isAnswered = !!matchAnswers[q.target.text];
                let btnClass = "border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer";
                if (isAnswered) {
                  if (isCorrect) { btnClass = isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : "border-emerald-400 border-dashed bg-emerald-50/50 text-emerald-600"; } 
                  else { btnClass = isSelected ? "border-rose-500 bg-rose-50 text-rose-700 cursor-default" : "border-stone-100 bg-stone-50 text-stone-300 opacity-50 cursor-default"; }
                }
                return (
                  <button key={opt.id} onClick={() => { if(!isAnswered){ setMatchAnswers(p => ({ ...p, [q.target.text]: opt.text })); if(isCorrect) speak(opt.text); } }} disabled={playingItem !== null || (isAnswered && !isCorrect)} className={`relative px-4 py-2 text-[11px] font-bold lowercase tracking-widest border rounded transition-all flex items-center justify-center min-w-[4rem] text-center ${btnClass}`}>
                    {playingItem === opt.text && isCorrect ? <Loader2 size={12} className="animate-spin absolute" /> : opt.hint}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {Object.keys(matchAnswers).length === questions.length && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => { setMatchAnswers({}); setSeed(s => s + 1); }} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-2">Next Round <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}

function MemoryReview({ speak, playingItem }: { speak: (t: string) => void, playingItem: string | null }) {
  const [deck, setDeck] = useState(() => [...COMBINED_PRACTICE_ITEMS].sort(() => 0.5 - Math.random()));
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
      <p className="text-stone-500 mb-8">You have successfully mastered all {COMBINED_PRACTICE_ITEMS.length} cards.</p>
      <button onClick={() => { setDeck([...COMBINED_PRACTICE_ITEMS].sort(() => 0.5 - Math.random())); setReviewedCount(0); }} className="px-8 py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm"><RefreshCcw size={18} /> Review Again</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b border-stone-200 pb-4">
          <span>Spaced repetition · rate your recall</span><span>{reviewedCount} reviewed</span>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-8 sm:p-16 flex flex-col items-center justify-center mb-6 min-h-[300px] shadow-sm">
          <div className="text-6xl sm:text-7xl md:text-[8rem] font-serif text-stone-900 mb-8 leading-none text-center">{deck[0].text}</div>
          <button onClick={() => speak(deck[0].text)} disabled={playingItem !== null} className="flex items-center gap-2 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg transition-colors text-sm">
            {playingItem === deck[0].text ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} Check Sound
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button onClick={() => setRating('Hard')} className={`py-4 rounded-xl border font-bold text-sm transition-all ${rating === 'Hard' ? 'bg-rose-100 border-rose-400 text-rose-800 ring-2 ring-rose-400/20' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'}`}>Hard</button>
          <button onClick={() => setRating('Good')} className={`py-4 rounded-xl border font-bold text-sm transition-all ${rating === 'Good' ? 'bg-amber-100 border-amber-400 text-amber-800 ring-2 ring-amber-400/20' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>Good</button>
          <button onClick={() => setRating('Easy')} className={`py-4 rounded-xl border font-bold text-sm transition-all ${rating === 'Easy' ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-400/20' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>Easy</button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14} /> Cards you mark Hard return soon; Easy cards drift further out.</p>
          <button onClick={nextCard} disabled={!rating} className={`flex items-center gap-2 px-8 py-3.5 font-bold rounded-xl shadow-sm transition-colors ${rating ? 'bg-amber-500 hover:bg-amber-400 text-stone-900' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}>Next Card <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}