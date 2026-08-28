// app/dashboard/lessons/7/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowUp, ArrowDown, CheckCircle2, 
  Sparkles, BookOpen, Award, Target, Loader2, XCircle, RotateCcw, Trophy, ArrowRight, Printer
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";

// ============================================================================
// 1. TYPES & CONSTANTS
// ============================================================================

const PASS_THRESHOLD = 0.8;
const TIB: React.CSSProperties = { fontFamily: "Jomolhari, 'Noto Sans Tibetan', serif" };

export type SectionId = "letters" | "tone-gender" | "vowels" | "stacks" | "affixes" | "reading" | "meaning" | "spelling" | "contrast" | "listening";

export interface SectionMeta {
  id: SectionId; name: string; skill: string; review: string; reviewName: string;
}

export const SECTION_ORDER: SectionId[] = [
  "letters", "tone-gender", "vowels", "stacks", "affixes", "reading", "meaning", "spelling", "contrast", "listening"
];

export const SECTION_META: Record<SectionId, SectionMeta> = {
  letters: { id: "letters", name: "Letter recognition & sounds", skill: "Recognising the 30 root consonants and their pronunciation", review: "/dashboard/lessons/1", reviewName: "The 30 Consonants" },
  "tone-gender": { id: "tone-gender", name: "Tone & gender classes", skill: "Classifying letters by tone class and gender", review: "/dashboard/lessons/1", reviewName: "The 30 Consonants" },
  vowels: { id: "vowels", name: "Vowels & diacritics", skill: "The four vowel signs and how they change a syllable", review: "/dashboard/lessons/2", reviewName: "The Four Vowels" },
  stacks: { id: "stacks", name: "Stacks — superscripts & subscripts", skill: "Finding the root letter and reading stacked syllables", review: "/dashboard/lessons/4", reviewName: "Superscripts & Subscripts" },
  affixes: { id: "affixes", name: "Prefixes & suffixes", skill: "Prefix rules, tone change, suffixes and post-suffixes", review: "/dashboard/lessons/5", reviewName: "Prefixes & Suffixes" },
  reading: { id: "reading", name: "Reading complete words", skill: "Reading whole words aloud from the written form", review: "/dashboard/lessons/6", reviewName: "Suffixes & Post-suffixes" },
  meaning: { id: "meaning", name: "Word meaning & images", skill: "Matching words with meanings and pictures", review: "/dashboard/lessons/6", reviewName: "Vocabulary" },
  spelling: { id: "spelling", name: "Spelling & word building", skill: "Spelling words, building them from letters, spotting missing letters", review: "/dashboard/lessons/6", reviewName: "Spelling & Word Building" },
  contrast: { id: "contrast", name: "Similar words", skill: "Telling apart words that look or sound alike", review: "/dashboard/lessons/4", reviewName: "Subscripts" },
  listening: { id: "listening", name: "Listening", skill: "Hearing a word and picking its written form or meaning", review: "/dashboard/lessons/2", reviewName: "Listening practice" },
};

export const STEPS = [
  { id: "overview", eyebrow: "Section 01", title: "What this capstone covers", desc: "Ten skill sections spanning all six units of Beginner 1." },
  { id: "assessment", eyebrow: "Section 02", title: "The assessment", desc: "Ten skill sections, 60 questions, five question types (~35 min)." },
  { id: "result", eyebrow: "Section 03", title: "Your result", desc: "Overall score, performance by skill, and readiness to progress." },
];

interface BaseQ { id: string; section: SectionId; points: number; audioTarget?: string; }

export interface MCQuestion extends BaseQ {
  kind: "mc";
  promptType: "text" | "vocab" | "tibetan-focus" | "image";
  promptText: React.ReactNode;
  promptTibetan?: string;
  helper?: React.ReactNode;
  audio?: string;
  choices: { key: string; label: React.ReactNode; isTibetan?: boolean }[];
  answerKey: string;
  tileFontClass?: boolean;
}

export interface RootPickQuestion extends BaseQ {
  kind: "root";
  cluster: string;
  translit: string;
  tiles: string[];
  answer: string;
}

export interface OrderQuestion extends BaseQ {
  kind: "order";
  cluster: string;
  translit: string;
  steps: string[];
}

export interface ListenQuestion extends BaseQ {
  kind: "listen";
  promptType: "word" | "meaning";
  audioTarget: string;
  choices: { key: string; label: string; translit?: string; isTibetan?: boolean }[];
  answerKey: string;
}

export type Question = MCQuestion | RootPickQuestion | OrderQuestion | ListenQuestion;

export interface SectionScore {
  id: SectionId; correct: number; total: number; earned: number; possible: number;
}

export interface Result {
  score: number; correct: number; total: number; earned: number; possible: number;
  sections: Record<SectionId, SectionScore>;
}

// ============================================================================
// 2. MASSIVE BANK GENERATOR
// ============================================================================

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function tib(text: string, cls = "text-3xl") {
  return <span className={`font-tibetan leading-none ${cls}`} style={TIB}>{text}</span>;
}

function buildFinalBank(): Question[] {
  const qs: Question[] = [];
  let qid = 0;
  const getID = () => `cap-${qid++}`;
  const pickWrongs = <T,>(arr: T[], correct: T, count: number): T[] => shuffle(Array.from(new Set(arr)).filter((x) => x !== correct)).slice(0, count);

  // --- Core Data Pools ---
  const cons = [
    {c:'ཀ',a:'[ka]'},{c:'ཁ',a:'[kha]'},{c:'ག',a:'[ga]'},{c:'ང',a:'[nga]'},
    {c:'ཅ',a:'[ca]'},{c:'ཆ',a:'[chha]'},{c:'ཇ',a:'[ja]'},{c:'ཉ',a:'[nya]'},
    {c:'ཏ',a:'[ta]'},{c:'ཐ',a:'[tha]'},{c:'ད',a:'[da]'},{c:'ན',a:'[na]'},
    {c:'པ',a:'[pa]'},{c:'ཕ',a:'[pha]'},{c:'བ',a:'[ba]'},{c:'མ',a:'[ma]'},
    {c:'ཙ',a:'[tsa]'},{c:'ཚ',a:'[tsha]'},{c:'ཛ',a:'[dza]'},{c:'ཝ',a:'[wa]'},
    {c:'ཞ',a:'[zha]'},{c:'ཟ',a:'[za]'},{c:'འ',a:'[a]'},{c:'ཡ',a:'[ya]'},
    {c:'ར',a:'[ra]'},{c:'ལ',a:'[la]'},{c:'ཤ',a:'[sha]'},{c:'ས',a:'[sa]'},
    {c:'ཧ',a:'[ha]'},{c:'ཨ',a:'[ah]'}
  ];

  const highTones = ["ཀ","ཁ","ཅ","ཆ","ཏ","ཐ","པ","ཕ","ཙ","ཚ","ཤ","ས","ཧ","ཨ"];
  const lowTones = ["ག","ང","ཇ","ཉ","ད","ན","བ","མ","ཛ","ཝ","ཞ","ཟ","འ","ཡ","ར","ལ"];
  
  const genders = {
    "Masculine": ["ཀ","ཅ","ཏ","པ","ཙ"],
    "Neuter": ["ཁ","ཆ","ཐ","ཕ","ཚ"],
    "Feminine": ["ག","ཇ","ད","བ","ཛ"],
    "Very Feminine": ["ང","ཉ","ན","མ"],
    "Sub-Feminine": ["ཞ","ཟ","འ","ཡ","ཤ","ས"]
  };

  const vocab = [
    { tib: "དགེ་བ་", read: "[ge-wa]", en: "virtue", emoji: "🌱" },
    { tib: "གཙོ་བོ་", read: "[tso-wo]", en: "chief", emoji: "👑" },
    { tib: "རྒྱལ་ཁབ་", read: "[gyal-khap]", en: "country", emoji: "🌍" },
    { tib: "ཁང་པ་", read: "[khang-pa]", en: "house", emoji: "🏠" },
    { tib: "ནགས་ཚལ་", read: "[nak-tsel]", en: "forest", emoji: "🌲" },
    { tib: "གངས་རི་", read: "[gang-ri]", en: "snow mountain", emoji: "🏔️" },
    { tib: "བོད་", read: "[phö]", en: "Tibet", emoji: "🏔️" },
    { tib: "རྟ", read: "[ta]", en: "horse", emoji: "🐎" },
    { tib: "ཁྱི", read: "[khyi]", en: "dog", emoji: "🐕" },
    { tib: "མི", read: "[mi]", en: "person", emoji: "👥" },
    { tib: "ལག་པ་", read: "[lak-pa]", en: "hand", emoji: "✋" },
    { tib: "དཀར་པོ་", read: "[kar-po]", en: "white", emoji: "🤍" },
    { tib: "ནག་པོ་", read: "[nak-po]", en: "black", emoji: "⬛" },
    { tib: "མེ་མདའ་", read: "[me-da]", en: "gun", emoji: "🔫" },
    { tib: "ཆུ་", read: "[chu]", en: "water", emoji: "💧" },
    { tib: "ལམ་", read: "[lam]", en: "path", emoji: "🛤️" },
    { tib: "དགོན་པ་", read: "[gön-pa]", en: "monastery", emoji: "🛕" },
    { tib: "ཐུག་པ་", read: "[thuk-pa]", en: "noodle soup", emoji: "🍜" },
    { tib: "མིག་", read: "[mik]", en: "eye", emoji: "👁️" }
  ];

  // --- SECTION 1: Letters (6 Qs) ---
  const s1_pool: Question[] = [];
  for (const c of cons) {
    s1_pool.push({ kind: "mc", id: getID(), section: "letters", points: 1, promptType: "tibetan-focus", promptText: "How does this letter read?", promptTibetan: c.c, audioTarget: c.c, answerKey: c.a, choices: shuffle([c.a, ...pickWrongs(cons.map(x=>x.a), c.a, 3)]).map(x => ({ key: x, label: x })) });
    s1_pool.push({ kind: "mc", id: getID(), section: "letters", points: 1, promptType: "text", promptText: `Listen to the sound. Which letter is it?`, audio: c.c, audioTarget: c.c, answerKey: c.c, choices: shuffle([c.c, ...pickWrongs(cons.map(x=>x.c), c.c, 3)]).map(x => ({ key: x, label: x, isTibetan: true })) });
  }
  qs.push(...shuffle(s1_pool).slice(0, 6));

  // --- SECTION 2: Tone & Gender (6 Qs) ---
  const s2_pool: Question[] = [];
  for (const c of highTones) s2_pool.push({ kind: "mc", id: getID(), section: "tone-gender", points: 1, promptType: "tibetan-focus", promptText: "Which tone class does this letter belong to?", promptTibetan: c, audioTarget: c, answerKey: "High tone", choices: [{key: "High tone", label: "High tone"}, {key: "Low tone", label: "Low tone"}] });
  for (const c of lowTones) s2_pool.push({ kind: "mc", id: getID(), section: "tone-gender", points: 1, promptType: "tibetan-focus", promptText: "Which tone class does this letter belong to?", promptTibetan: c, audioTarget: c, answerKey: "Low tone", choices: [{key: "High tone", label: "High tone"}, {key: "Low tone", label: "Low tone"}] });
  for (const [gen, letters] of Object.entries(genders)) {
    for (const c of letters) {
      s2_pool.push({ kind: "mc", id: getID(), section: "tone-gender", points: 1, promptType: "tibetan-focus", promptText: "What is the gender of this letter?", promptTibetan: c, audioTarget: c, answerKey: gen, choices: shuffle([gen, ...pickWrongs(Object.keys(genders), gen, 2)]).map(x => ({ key: x, label: x })) });
    }
  }
  qs.push(...shuffle(s2_pool).slice(0, 6));

  // --- SECTION 3: Vowels & Diacritics (6 Qs) ---
  const s3_pool: Question[] = [];
  const vowels = [{m:'ཨི',n:'Gi-gu',p:'Above'},{m:'ཨུ',n:'Shab-kyu',p:'Below'},{m:'ཨེ',n:'Dreng-bu',p:'Above'},{m:'ཨོ',n:'Na-ro',p:'Above'}];
  for (const v of vowels) {
    s3_pool.push({ kind: "mc", id: getID(), section: "vowels", points: 1, promptType: "text", promptText: `Which vowel mark is ${v.n}?`, answerKey: v.m, audioTarget: v.m, choices: shuffle([{key: 'ཨི', label: 'ཨི', isTibetan: true}, {key: 'ཨུ', label: 'ཨུ', isTibetan: true}, {key: 'ཨེ', label: 'ཨེ', isTibetan: true}, {key: 'ཨོ', label: 'ཨོ', isTibetan: true}]) });
    s3_pool.push({ kind: "mc", id: getID(), section: "vowels", points: 1, promptType: "text", promptText: `Where is the mark ${v.n} written?`, answerKey: v.p, choices: [{key: "Above", label: "Above the root letter"}, {key: "Below", label: "Below the root letter"}] });
  }
  const combinations = [{t:'མི',r:'[mi]'},{t:'མུ',r:'[mu]'},{t:'མེ',r:'[me]'},{t:'མོ',r:'[mo]'},{t:'རི',r:'[ri]'},{t:'རུ',r:'[ru]'},{t:'རེ',r:'[re]'},{t:'རོ',r:'[ro]'},{t:'སི',r:'[si]'},{t:'སུ',r:'[su]'},{t:'སེ',r:'[se]'},{t:'སོ',r:'[so]'}];
  for (const c of combinations) {
    s3_pool.push({ kind: "mc", id: getID(), section: "vowels", points: 1, promptType: "text", promptText: `Which syllable reads ${c.r}?`, answerKey: c.t, audioTarget: c.t, choices: shuffle([c.t, ...pickWrongs(combinations.map(x=>x.t), c.t, 3)]).map(x => ({ key: x, label: x, isTibetan: true })) });
  }
  qs.push(...shuffle(s3_pool).slice(0, 6));

  // --- SECTION 4: Stacks (8 Qs) ---
  const s4_pool: Question[] = [];
  const roots = [
    {c:"སྐ",a:"ཀ",t:["ས","ཀ","ར","ལ"]},{c:"སྒྲ",a:"ག",t:["ས","ག","ར","ད"]},{c:"ལྕ",a:"ཅ",t:["ལ","ཅ","ས","ར"]},
    {c:"རྟ",a:"ཏ",t:["ར","ཏ","ལ","ས"]},{c:"སྣ",a:"ན",t:["ས","ན","ར","ལ"]},{c:"སྤྲ",a:"པ",t:["ས","པ","ར","ད"]},
    {c:"རྨ",a:"མ",t:["ར","མ","ལ","ས"]},{c:"སྩ",a:"ཙ",t:["ས","ཙ","ར","ལ"]}
  ];
  for (const r of roots) {
    s4_pool.push({ kind: "root", id: getID(), section: "stacks", points: 1, cluster: r.c, translit: "", answer: r.a, tiles: shuffle(r.t), audioTarget: r.c });
  }
  const stacks = [
    {c:"ཀྱ",r:"[kya]",t:"Same"},{c:"གྲ",r:"[dra]",t:"Low"},{c:"པྱ",r:"[cha]",t:"Same"},{c:"བྱ",r:"[ja]",t:"Low"},
    {c:"ཟླ",r:"[da]",t:"Low"},{c:"སྒྲ",r:"[dra]",t:"Low"},{c:"རྨྱ",r:"[nya]",t:"High"},{c:"སྔ",r:"[nga]",t:"High"},
    {c:"རྗ",r:"[ja]",t:"High"},{c:"སྦ",r:"[ba]",t:"High"}
  ];
  for (const s of stacks) {
    s4_pool.push({ kind: "mc", id: getID(), section: "stacks", points: 1, promptType: "tibetan-focus", promptText: "How does this stack read?", promptTibetan: s.c, audioTarget: s.c, answerKey: s.r, choices: shuffle([s.r, ...pickWrongs(stacks.map(x=>x.r), s.r, 3)]).map(x => ({ key: x, label: x })) });
    s4_pool.push({ kind: "mc", id: getID(), section: "stacks", points: 1, promptType: "tibetan-focus", promptText: "What happens to the tone of the root letter in this stack?", promptTibetan: s.c, audioTarget: s.c, answerKey: s.t, choices: [{key: "Same", label: "Stays the same"}, {key: "High", label: "Becomes High"}, {key: "Low", label: "Becomes Low"}] });
  }
  qs.push(...shuffle(s4_pool).slice(0, 8));

  // --- SECTION 5: Affixes (8 Qs) ---
  const s5_pool: Question[] = [];
  const prefs = [
    {w:"དགེ་",r:"[ge]",p:"da",n:"Silent"}, {w:"མགོ་",r:"[m'go]",p:"ma",n:"Nasal"}, {w:"བཞི་",r:"[zhi]",p:"ba",n:"Silent"},
    {w:"འགྲོ་",r:"[ng'dro]",p:"a",n:"Nasal"}, {w:"གཡོ་",r:"[yo]",p:"ga",n:"Silent"}, {w:"དབུ་",r:"[wu]",p:"da",n:"Silent"}
  ];
  for (const p of prefs) {
    s5_pool.push({ kind: "mc", id: getID(), section: "affixes", points: 1, promptType: "text", promptText: `Listen to the word ${p.r}. Which prefix does its spelling use?`, audio: p.w, audioTarget: p.w, answerKey: p.p, choices: shuffle([{key: "ga", label: "ག ga"}, {key: "da", label: "ད da"}, {key: "ba", label: "བ ba"}, {key: "ma", label: "མ ma"}, {key: "a", label: "འ 'a"}]).slice(0, 4) });
    s5_pool.push({ kind: "mc", id: getID(), section: "affixes", points: 1, promptType: "tibetan-focus", promptText: "Does the prefix in this word stay silent, or add a nasal hum?", promptTibetan: p.w, audioTarget: p.w, answerKey: p.n, choices: [{key: "Silent", label: "Silent — written only"}, {key: "Nasal", label: "Adds a nasal hum before the root"}] });
  }
  const sufs = [
    {w:"ལམ་",r:"[lam]",s:"ma"}, {w:"རིག་",r:"[rik']",s:"ga"}, {w:"དག་",r:"[thak']",s:"ga"}, {w:"ནད་",r:"[ne]",s:"da"},
    {w:"གངས་",r:"[gang]",s:"nga"}, {w:"ཐབས་",r:"[thap]",s:"ba"}, {w:"རབ་",r:"[rap]",s:"ba"}, {w:"མར་",r:"[mar]",s:"ra"}
  ];
  for (const s of sufs) {
    s5_pool.push({ kind: "mc", id: getID(), section: "affixes", points: 1, promptType: "text", promptText: `Listen to the word ${s.r}. Which suffix closes it?`, audio: s.w, audioTarget: s.w, answerKey: s.s, choices: shuffle([{key: "ga", label: "ག ga"}, {key: "nga", label: "ང nga"}, {key: "da", label: "ད da"}, {key: "na", label: "ན na"}, {key: "ba", label: "བ ba"}, {key: "ma", label: "མ ma"}, {key: "ra", label: "ར ra"}, {key: "sa", label: "ས sa"}]).slice(0, 4) });
  }
  qs.push(...shuffle(s5_pool).slice(0, 8));

  // --- SECTION 6: Reading (5 Qs) ---
  const s6_pool: Question[] = [];
  for (const v of vocab) {
    s6_pool.push({ kind: "mc", id: getID(), section: "reading", points: 1, promptType: "tibetan-focus", promptText: "Read this word aloud — how is it pronounced?", promptTibetan: v.tib, audioTarget: v.tib, answerKey: v.read, choices: shuffle([v.read, ...pickWrongs(vocab.map(x=>x.read), v.read, 3)]).map(x => ({ key: x, label: x })) });
    s6_pool.push({ kind: "mc", id: getID(), section: "reading", points: 1, promptType: "text", promptText: `Which word is read ${v.read}?`, answerKey: v.tib, audioTarget: v.tib, choices: shuffle([v.tib, ...pickWrongs(vocab.map(x=>x.tib), v.tib, 3)]).map(x => ({ key: x, label: x, isTibetan: true })) });
  }
  qs.push(...shuffle(s6_pool).slice(0, 5));

  // --- SECTION 7: Meaning & Images (6 Qs) ---
  const s7_pool: Question[] = [];
  for (const v of vocab) {
    s7_pool.push({ kind: "mc", id: getID(), section: "meaning", points: 1, promptType: "tibetan-focus", promptText: "What does this word mean?", promptTibetan: v.tib, audioTarget: v.tib, answerKey: v.en, choices: shuffle([v.en, ...pickWrongs(vocab.map(x=>x.en), v.en, 3)]).map(x => ({ key: x, label: x })) });
    if (v.emoji) {
      s7_pool.push({ kind: "mc", id: getID(), section: "meaning", points: 1, promptType: "image", promptText: "Which word matches this picture?", promptTibetan: v.emoji, audioTarget: v.tib, answerKey: v.tib, choices: shuffle([v.tib, ...pickWrongs(vocab.map(x=>x.tib), v.tib, 3)]).map(x => ({ key: x, label: x, isTibetan: true })) });
    }
  }
  qs.push(...shuffle(s7_pool).slice(0, 6));

  // --- SECTION 8: Spelling (6 Qs) ---
  const s8_pool: Question[] = [];
  const orders = [
    { c: "དགེ་བ་", r: "[ge-wa]", s: ["ད", "ག", "ེ", "བ", "རྐྱང་", "བ"] }, // keeping simpler
    { c: "དགེ་བ་", r: "[ge-wa]", s: ["ད", "ག", "ེ", "བ"] },
    { c: "གྲྭ", r: "[drwa]", s: ["ག", "ར", "ྭ"] },
    { c: "བསྒྲིམས་", r: "[drim]", s: ["བ", "ས", "ག", "ྲ", "ི", "མ", "ས"] },
    { c: "བརྒྱད་", r: "[gye]", s: ["བ", "ར", "ག", "ྱ", "ད"] }
  ];
  for (const o of orders) {
    s8_pool.push({ kind: "order", id: getID(), section: "spelling", points: 2, cluster: o.c, translit: o.r, steps: o.s, audioTarget: o.c });
  }
  const missings = [
    { w:"ད_ེ་བ་", r:"[ge-wa]", a:"ག", t:"དགེ་བ་" },
    { w:"མ_ུན་", r:"[dün]", a:"ད", t:"མདུན་" },
    { w:"བ_ུད་", r:"[gyü]", a:"རྒྱ", t:"བརྒྱུད་" }
  ];
  for (const m of missings) {
    s8_pool.push({ kind: "mc", id: getID(), section: "spelling", points: 2, promptType: "text", promptText: `Which letter is missing from ${m.w} ${m.r}?`, answerKey: m.a, audioTarget: m.t, choices: shuffle([m.a, ...pickWrongs(["ཀ","ག","ད","བ","མ","ང","ར","ལ"], m.a, 3)]).map(x => ({ key: x, label: x, isTibetan: true })) });
  }
  qs.push(...shuffle(s8_pool).slice(0, 6));

  // --- SECTION 9: Contrast / Minimal Pairs (4 Qs) ---
  const s9_pool: Question[] = [];
  const pairs = [
    { set: ["གངས་","གང་","ཁང་","ནགས་"], a: "གངས་", en: "snow" },
    { set: ["ཐབས་","ཐབ་","རབ་","བབ་"], a: "ཐབས་", en: "method" },
    { set: ["ཁམས་","ཁམ་","ལམ་","ནམས་"], a: "ཁམས་", en: "region (Kham)" },
    { set: ["མངགས་","མངག་","བདགས་","ནགས་"], a: "མངགས་", en: "dispatched" }
  ];
  for (const p of pairs) {
    s9_pool.push({ kind: "mc", id: getID(), section: "contrast", points: 2, promptType: "text", promptText: `These look and sound alike. Which one means '${p.en}'?`, answerKey: p.a, audioTarget: p.a, choices: shuffle(p.set).map(x => ({ key: x, label: x, isTibetan: true })) });
  }
  qs.push(...shuffle(s9_pool).slice(0, 4));

  // --- SECTION 10: Listening (5 Qs) ---
  const s10_pool: Question[] = [];
  for (const v of vocab) {
    s10_pool.push({ kind: "listen", id: getID(), section: "listening", points: 1, promptType: "word", audioTarget: v.tib, answerKey: v.tib, choices: shuffle([v.tib, ...pickWrongs(vocab.map(x=>x.tib), v.tib, 3)]).map(x => ({ key: x, label: x, translit: vocab.find(y=>y.tib===x)?.read, isTibetan: true })) });
    s10_pool.push({ kind: "listen", id: getID(), section: "listening", points: 1, promptType: "meaning", audioTarget: v.tib, answerKey: v.en, choices: shuffle([v.en, ...pickWrongs(vocab.map(x=>x.en), v.en, 3)]).map(x => ({ key: x, label: x })) });
  }
  qs.push(...shuffle(s10_pool).slice(0, 5));

  return qs;
}

function emptySectionScores(qs?: Question[]): Record<SectionId, SectionScore> {
  const out = {} as Record<SectionId, SectionScore>;
  for (const s of SECTION_ORDER) out[s] = { id: s, correct: 0, total: 0, earned: 0, possible: 0 };
  if (qs) {
    for (const q of qs) {
      out[q.section].total += 1;
      out[q.section].possible += q.points;
    }
  }
  return out;
}

// ============================================================================
// 3. MAIN PAGE COMPONENT
// ============================================================================

export default function FinalAssessmentLesson() {
  const { user } = useUser();
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(3);

  const [attempt, setAttempt] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [lastResult, setLastResult] = useState<Result | null>(null);
  const [isBypassing, setIsBypassing] = useState(false);
  const [record, setRecord] = useState({ passed: false, bestScore: 0, attempts: 0 });

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const questions = useMemo(() => (hydrated ? buildFinalBank() : []), [attempt, hydrated]);
  const total = questions.length;
  const possible = useMemo(() => questions.reduce((n, q) => n + q.points, 0), [questions]);

  const startTest = () => {
    setInProgress(true);
    setLastResult(null);
    setAttempt((a) => a + 1);
    if (expandedStep !== 1) {
      toggleStep(1);
    }
  };

  const submitResult = (score: number) => {
    setRecord(prev => ({
      passed: prev.passed || score >= PASS_THRESHOLD,
      bestScore: Math.max(prev.bestScore, score),
      attempts: prev.attempts + 1
    }));
  };

  const handleDevBypass = async () => {
    setIsBypassing(true);
    
    // Dynamically calculate a perfect score based on the actual drawn questions
    const perfectSections = emptySectionScores(questions);
    let totalPts = 0;
    
    for (const s of SECTION_ORDER) {
      perfectSections[s].correct = perfectSections[s].total;
      perfectSections[s].earned = perfectSections[s].possible;
      totalPts += perfectSections[s].possible;
    }

    const fakeResult: Result = {
      score: 1.0, 
      correct: questions.length, 
      total: questions.length, 
      earned: totalPts, 
      possible: totalPts, 
      sections: perfectSections
    };
    
    submitResult(1.0);
    setLastResult(fakeResult);
    await markComplete(1);
    setIsBypassing(false);
  };

  return (
    <>
    <div className="bg-paper min-h-screen text-ink pb-40 relative print:hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        <button 
          onClick={handleDevBypass} 
          disabled={isBypassing}
          className="w-full mb-8 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 text-center tracking-widest shadow-lg disabled:opacity-50"
        >
          {isBypassing ? "⏳ GENERATING PERFECT SCORE..." : "🛠️ DEV BYPASS: GET 100% & PRINT CERTIFICATE 🛠️"}
        </button>

        <div className="mb-8 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Lessons</Link>
          <ChevronRight size={14} />
          <span>Unit 07</span>
          <ChevronRight size={14} />
          <span className="text-ink font-bold">Capstone</span>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-[1.4fr,1fr] md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-light px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-dark border border-brand/20">
              <Award className="size-3.5" /> Beginner 1 · Capstone
            </div>
            <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl text-ink">
              Show what you&rsquo;ve learned.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-light">
              A comprehensive assessment drawing on all six units — letter recognition,
              tone and gender, vowels, stacks, prefixes and suffixes, plus reading,
              spelling, word building, similar words and listening. Score <span className="font-bold text-ink">{Math.round(PASS_THRESHOLD * 100)}%</span> or higher to unlock your Certificate of Completion.
            </p>
            {record.attempts > 0 && (
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
                Best score: <span className="text-ink">{Math.round(record.bestScore * 100)}%</span> · {record.attempts} attempt{record.attempts === 1 ? "" : "s"} {record.passed && " · Passed"}
              </p>
            )}
          </div>

          <div className="w-full md:w-72 justify-self-end">
            <div className="mb-3 flex items-center justify-between text-eyebrow">
              <span>Step progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, 3)} of 3 sections</span>
            </div>
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden">
              <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* SECTION 1 */}
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-serif text-xl mb-4 text-ink">Sections &amp; skills</h3>
                <p className="text-sm text-ink-light mb-4">Ten labelled sections, ordered from recognition to reading, spelling and application.</p>
                <ol className="space-y-4 text-sm text-ink-light">
                  {SECTION_ORDER.map((s, n) => (
                    <li key={s} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 shrink-0 font-mono text-xs font-bold text-brand-dark">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="font-bold text-ink block mb-0.5">{SECTION_META[s].name}</span>
                        <span className="block text-[13px]">{SECTION_META[s].skill}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <Card className="bg-surface-muted flex flex-col border border-border-strong p-6 shadow-sm self-start">
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-light mb-2">Format</div>
                <div className="font-serif text-lg text-ink mb-4">{total} questions · {possible} points · ~35 min</div>
                <ul className="mt-3 space-y-3 text-[13px] leading-relaxed text-ink-light list-disc pl-4">
                  <li>Question types: multiple choice, image matching, ordered word building, root-letter picking, and listening.</li>
                  <li>Recognition questions are worth 1 point; spelling, word building and similar-word questions are worth 2.</li>
                  <li>Immediate feedback. You must manually click Next Question so you can review your answers.</li>
                </ul>
                <p className="mt-6 text-[13px] leading-relaxed text-ink-light border-t border-border-strong pt-4">
                  Unlimited retakes — your best score is kept, and passing at any point unlocks the certificate for good.
                </p>
              </Card>
            </div>
          </StepContainer>

          {/* SECTION 2 */}
          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            
            {!inProgress && !lastResult && (
              <div className="border border-brand bg-brand-light/40 p-8 md:p-12 text-center flex flex-col items-center">
                <div className="inline-flex items-center justify-center size-12 bg-white text-brand mb-4 shadow-sm border border-brand/20"><Trophy className="size-6" /></div>
                <h3 className="font-serif text-3xl text-ink mb-3">{record.attempts > 0 ? "Take it again" : "Begin the assessment"}</h3>
                <p className="max-w-md text-[15px] text-ink-light mb-8 leading-relaxed">Fresh questions are drawn each attempt. Take your time — accuracy matters more than speed.</p>
                <Button onClick={startTest} className="px-8 py-3 text-base shadow-sm">{record.attempts > 0 ? "Retake assessment" : "Start assessment"} <ChevronRight className="size-5" /></Button>
              </div>
            )}

            {inProgress && (
              <Quiz
                key={attempt}
                questions={questions}
                playAudio={playAudio}
                playErrorBeep={playErrorBeep}
                playingItem={playingItem}
                onFinish={(r: Result) => {
                  submitResult(r.score);
                  setLastResult(r);
                  setInProgress(false);
                  markComplete(1);
                }}
              />
            )}

            {!inProgress && lastResult && (
              <div className="text-sm text-ink-light bg-surface-muted p-6 border border-border-strong text-center">
                See your result in Section 03 below.
              </div>
            )}
          </StepContainer>

          {/* SECTION 3 */}
          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)} isLast>
            <ResultPanel result={lastResult} record={record} onRetake={startTest} />
          </StepContainer>

        </div>
      </div>
      
      {/* FOOTER */}
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/6" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
            <ChevronLeft size={16} /> Previous
          </Link>
          
          {expandedStep !== 2 && (
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}>
              <CheckCircle2 size={18} /> Mark step complete
            </Button>
          )}

          {expandedStep === 2 && (
             <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">
               Return to Dashboard <ArrowRight size={16} />
             </Link>
          )}
        </div>
      </div>
    </div>

    {/* PRINTABLE CERTIFICATE (Hidden on screen, visible only when printing) */}
    {record.passed && (
      <div className="hidden print:flex fixed inset-0 w-[100vw] h-[100vh] bg-white flex-col items-center justify-center p-10 z-[9999] m-0">
        <div className="border-[12px] border-ink p-16 w-full max-w-5xl h-full max-h-[800px] flex flex-col items-center justify-center text-center bg-white relative outline outline-4 outline-offset-4 outline-brand">
          
          <div className="text-5xl text-brand-dark mb-6">༄༅། །</div>
          <div className="text-xs font-bold uppercase tracking-[0.4em] text-ink-muted mb-8">Learn Tibetan · Scholar's Edition</div>
          
          <h1 className="font-serif text-6xl text-ink mb-10 tracking-tight">Certificate of Completion</h1>
          
          <p className="text-xl text-ink-light mb-6 uppercase tracking-widest font-medium">This certifies that</p>
          <div className="font-serif text-6xl text-brand border-b-2 border-border-subtle pb-6 mb-10 w-4/5">
            {user?.firstName || "Student"} {user?.lastName || ""}
          </div>
          
          <p className="text-lg text-ink-light max-w-3xl leading-relaxed mb-16">
            Has successfully completed the <strong className="text-ink">Beginner 1 Foundations</strong> curriculum, demonstrating a solid grasp of the Tibetan alphabet, vowels, stacks, affixes, reading, spelling, and listening comprehension.
          </p>

          <div className="flex justify-between w-full max-w-3xl mt-4">
            <div className="flex flex-col items-center border-t-2 border-border-strong pt-4 w-56">
              <span className="font-serif text-2xl text-ink">{new Date().toLocaleDateString()}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mt-2">Date Awarded</span>
            </div>
            
            <div className="w-24 h-24 rounded-full border-4 border-brand-dark flex items-center justify-center -mt-12 bg-white text-brand-dark font-serif text-3xl opacity-80 transform rotate-12">
              ལ
            </div>

            <div className="flex flex-col items-center border-t-2 border-border-strong pt-4 w-56">
              <span className="font-serif text-2xl text-ink">{Math.round(record.bestScore * 100)}%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mt-2">Final Score</span>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

// ============================================================================
// 4. QUIZ VIEWS & COMPONENTS
// ============================================================================

function MCView({ q, picked, onPick, playAudio, playingItem }: any) {
  const getSound = (c: any) => q.audioTarget || q.audio || q.promptTibetan || (c.isTibetan ? c.key : null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-xl text-ink">
        {q.promptText}
        {q.promptType === 'image' && <span className="text-4xl ml-3 leading-none">{q.promptTibetan}</span>}
        {q.promptType === 'tibetan-focus' && <span className="font-tibetan text-4xl text-ink px-3">{q.promptTibetan}</span>}
      </div>
      
      {q.audio && (
        <div className="mt-6 mb-2">
          <Button variant="outline" onClick={() => playAudio(q.audio)} className="px-6 py-2.5 bg-brand-light/30 border-brand/30 hover:bg-brand-light hover:border-brand">
            {playingItem === q.audio ? <Loader2 className="size-5 animate-spin text-brand" /> : <Volume2 className="size-5 text-brand" />} Play sound
          </Button>
        </div>
      )}

      <div className={`mt-8 grid gap-3 ${q.tileFontClass ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        {q.choices.map((c: any) => {
          const isCorrect = picked && c.key === q.answerKey;
          const isWrong = picked === c.key && c.key !== q.answerKey;
          return (
            <button
              key={c.key}
              type="button"
              disabled={!!picked && !isCorrect}
              onClick={() => {
                if (!picked) onPick(c.key);
                else if (isCorrect) {
                  const sound = getSound(c);
                  if (sound) playAudio(sound);
                }
              }}
              className={`relative flex min-h-[4.5rem] items-center justify-center border-2 p-4 text-center text-lg font-bold transition-all ${
                isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm cursor-pointer hover:bg-emerald-100 hover:border-emerald-600"
                  : isWrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60"
                  : picked ? "border-border-strong bg-surface text-ink-muted opacity-50"
                  : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light hover:shadow-md cursor-pointer"
              }`}
            >
              {isCorrect && getSound(c) && (
                <div className="absolute top-2 right-2 text-emerald-600 opacity-70">
                  {playingItem === getSound(c) ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </div>
              )}
              {c.isTibetan ? tib(c.label) : c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RootPickView({ q, picked, onPick, playAudio, playingItem }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-xl text-ink mb-2">
        Tap the <span className="font-bold">root letter</span> of{" "}
        {tib(q.cluster, "text-4xl mx-2")}
      </div>
      <p className="mb-8 text-sm text-ink-light">The root letter carries the syllable&rsquo;s core sound and tone.</p>
      
      {q.audioTarget && (
        <div className="mt-4 mb-6">
          <Button variant="outline" onClick={() => playAudio(q.audioTarget)} className="px-6 py-2.5 bg-brand-light/30 border-brand/30 hover:bg-brand-light hover:border-brand">
            {playingItem === q.audioTarget ? <Loader2 className="size-5 animate-spin text-brand" /> : <Volume2 className="size-5 text-brand" />} Play sound
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.tiles.map((tile: string) => {
          const isCorrect = picked && tile === q.answer;
          const isWrong = picked === tile && tile !== q.answer;
          return (
            <button
              key={tile}
              type="button"
              disabled={!!picked && !isCorrect}
              onClick={() => {
                if (!picked) onPick(tile);
                else if (isCorrect && q.audioTarget) playAudio(q.audioTarget);
              }}
              className={`relative flex aspect-square items-center justify-center border-2 p-3 transition-all ${
                isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm cursor-pointer hover:bg-emerald-100 hover:border-emerald-600"
                  : isWrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60"
                  : picked ? "border-border-strong bg-surface text-ink-muted opacity-50"
                  : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light hover:shadow-md cursor-pointer"
              }`}
            >
              {isCorrect && q.audioTarget && (
                <div className="absolute top-2 right-2 text-emerald-600 opacity-70">
                  {playingItem === q.audioTarget ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </div>
              )}
              {tib(tile, "text-[4rem]")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OrderView({ q, submitted, order, setOrder, onSubmit, playAudio, playingItem }: any) {
  const isCorrect = submitted && order.join("|") === q.steps.join("|");
  const move = (from: number, to: number) => {
    if (submitted || to < 0 || to >= order.length) return;
    const next = [...order];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setOrder(next);
  };
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-xl text-ink mb-8">
        Put the spelling steps in order to build{" "}
        {tib(q.cluster, "text-4xl mx-2")}
      </div>

      {q.audioTarget && (
        <div className="mt-4 mb-6">
          <Button variant="outline" onClick={() => playAudio(q.audioTarget)} className="px-6 py-2.5 bg-brand-light/30 border-brand/30 hover:bg-brand-light hover:border-brand">
            {playingItem === q.audioTarget ? <Loader2 className="size-5 animate-spin text-brand" /> : <Volume2 className="size-5 text-brand" />} Play sound
          </Button>
        </div>
      )}

      <ol className="space-y-3">
        {order.map((s: string, i: number) => (
          <li key={`${s}-${i}`} className={`flex items-center gap-4 border-2 p-4 transition-colors ${
            submitted ? (s === q.steps[i] ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-rose-400 bg-rose-50 text-rose-900 opacity-80")
            : "border-border-strong bg-surface"
          }`}>
            <span className="grid size-8 shrink-0 place-items-center bg-surface-muted text-xs font-bold text-ink-muted rounded-none">{i + 1}</span>
            <span className="flex-1 font-tibetan text-3xl">{['ི', 'ུ', 'ེ', 'ོ', 'ྱ', 'ྲ', 'ླ', 'ྭ'].includes(s) ? "\u00A0" + s : s}</span>
            {!submitted && (
              <div className="flex gap-2">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="border border-border-strong p-2 hover:bg-surface-muted disabled:opacity-30"><ArrowUp size={16} /></button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === order.length - 1} className="border border-border-strong p-2 hover:bg-surface-muted disabled:opacity-30"><ArrowDown size={16} /></button>
              </div>
            )}
          </li>
        ))}
      </ol>
      {!submitted && (
        <Button onClick={onSubmit} className="mt-8 shadow-sm">Check order <ChevronRight className="size-5" /></Button>
      )}
      {submitted && !isCorrect && (
        <div className="mt-6 border border-border-strong bg-surface-muted p-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-light mb-3">Correct order</div>
          <div className="flex flex-wrap items-center gap-3 font-tibetan text-3xl text-ink">
            {q.steps.map((s: string, i: number) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-ink-muted opacity-50">+</span>}
                <span>{['ི', 'ུ', 'ེ', 'ོ', 'ྱ', 'ྲ', 'ླ', 'ྭ'].includes(s) ? "\u00A0" + s : s}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ListenView({ q, picked, onPick, playAudio, playingItem }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-xl text-ink mb-2">
        {q.promptType === 'word' ? "Listen and pick the matching Tibetan word." : "Listen, then choose the meaning."}
      </div>
      <p className="text-sm text-ink-light mb-8">Tap the speaker to replay the sound.</p>
      <div className="mb-8 flex justify-center bg-surface-muted border border-border-strong p-8 shadow-inner">
        <Button variant="outline" onClick={() => playAudio(q.audioTarget)} className="px-8 py-4 text-lg bg-white shadow-sm border-border-strong hover:border-brand hover:text-brand">
          {playingItem === q.audioTarget ? <Loader2 className="size-6 animate-spin text-brand" /> : <Volume2 className="size-6 text-brand" />} Play sound
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.choices.map((c: any) => {
          const isCorrect = picked && c.key === q.answerKey;
          const isWrong = picked === c.key && c.key !== q.answerKey;
          return (
            <button
              key={c.key}
              type="button"
              disabled={!!picked && !isCorrect}
              onClick={() => {
                if (!picked) onPick(c.key);
                else if (isCorrect && q.audioTarget) playAudio(q.audioTarget);
              }}
              className={`relative flex min-h-[6rem] flex-col items-center justify-center gap-2 border-2 p-3 transition-all ${
                isCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm cursor-pointer hover:bg-emerald-100 hover:border-emerald-600"
                  : isWrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60"
                  : picked ? "border-border-strong bg-surface text-ink-muted opacity-50"
                  : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light hover:shadow-md cursor-pointer"
              }`}
            >
              {isCorrect && q.audioTarget && (
                <div className="absolute top-2 right-2 text-emerald-600 opacity-70">
                  {playingItem === q.audioTarget ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                </div>
              )}
              {c.isTibetan ? tib(c.label, "text-[3rem] leading-none pb-2") : <span className="font-bold text-lg">{c.label}</span>}
              {picked && c.translit && <span className="text-eyebrow mt-1">[{c.translit}]</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- QUIZ CONTROLLER ---

function Quiz({ questions, playAudio, playErrorBeep, playingItem, onFinish }: any) {
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<string[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [sections, setSections] = useState<Record<SectionId, SectionScore>>(() => emptySectionScores(questions));

  const total = questions.length;
  const q = questions[step] as Question;

  useEffect(() => {
    if (q && q.kind === "order" && orderState.length === 0) {
      setOrderState([...q.steps].sort(() => Math.random() - 0.5));
    }
  }, [q, orderState?.length]);

  if (!q) return null;

  const handlePick = (key: string) => {
    if (picked) return;
    setPicked(key);
    const isCorrect = key === q.answerKey;
    if (isCorrect) {
      const sound = q.audioTarget || (q as any).audio;
      if (sound) playAudio(sound);
    } else {
      playErrorBeep();
    }
  };

  const handleOrderSubmit = () => {
    if (q.kind !== "order" || orderSubmitted) return;
    setOrderSubmitted(true);
    const isCorrect = orderState.join("|") === q.steps.join("|");
    if (isCorrect) {
      if (q.audioTarget || q.cluster) playAudio(q.audioTarget || q.cluster);
    } else {
      playErrorBeep();
    }
  };

  const handleNext = () => {
    let isCorrect = false;
    if (q.kind === "order") {
      isCorrect = orderState.join("|") === q.steps.join("|");
    } else {
      isCorrect = picked === q.answerKey;
    }

    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    const nextSections = {
      ...sections,
      [q.section]: {
        ...sections[q.section],
        correct: sections[q.section].correct + (isCorrect ? 1 : 0),
        earned: sections[q.section].earned + (isCorrect ? q.points : 0),
      }
    };
    
    setCorrectCount(nextCorrect);
    setSections(nextSections);

    if (step + 1 >= total) {
      const earned = SECTION_ORDER.reduce((n, s) => n + nextSections[s].earned, 0);
      const possible = SECTION_ORDER.reduce((n, s) => n + nextSections[s].possible, 0);
      onFinish({ 
        score: possible > 0 ? earned / possible : 0, 
        correct: nextCorrect, 
        total, 
        earned,
        possible,
        sections: nextSections 
      });
    } else {
      setStep((s) => s + 1);
      setPicked(null);
      setOrderState([]);
      setOrderSubmitted(false);
    }
  };

  const isAnswered = q.kind === "order" ? orderSubmitted : picked !== null;
  const isCorrect = q.kind === "order"
    ? orderSubmitted && orderState.join("|") === q.steps.join("|")
    : picked !== null && picked === q.answerKey;

  const progressVal = Math.round((step / total) * 100);

  return (
    <Card className="border border-border-strong bg-white p-6 md:p-10 shadow-sm text-left">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
          {SECTION_META[q.section].name}
        </span>
        <span className="text-[11px] font-bold text-ink-light uppercase tracking-widest">
          {q.points} point{q.points === 1 ? "" : "s"}
        </span>
      </div>
      
      <div className="mb-4 flex items-center justify-between text-eyebrow border-b border-border-subtle pb-4">
        <span>Question {step + 1} of {total}</span>
        <span className="text-brand-dark">Score {correctCount}</span>
      </div>
      
      <div className="h-1.5 w-full bg-surface-muted overflow-hidden mb-8">
        <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressVal}%` }} />
      </div>
      
      <div className="mt-6 min-h-[300px]">
        {q.kind === "mc" && <MCView q={q} picked={picked} onPick={handlePick} playAudio={playAudio} playingItem={playingItem} />}
        {q.kind === "root" && <RootPickView q={q} picked={picked} onPick={handlePick} playAudio={playAudio} playingItem={playingItem} />}
        {q.kind === "order" && <OrderView q={q} submitted={orderSubmitted} order={orderState} setOrder={setOrderState} onSubmit={handleOrderSubmit} playAudio={playAudio} playingItem={playingItem} />}
        {q.kind === "listen" && <ListenView q={q} picked={picked} onPick={handlePick} playAudio={playAudio} playingItem={playingItem} />}
      </div>

      {isAnswered && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-strong pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <><CheckCircle2 className="size-5 text-emerald-600" /><span className="text-sm font-bold text-emerald-700">Correct!</span></>
            ) : (
              <><XCircle className="size-5 text-rose-500" /><span className="text-sm font-bold text-rose-700">Not quite.</span></>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleNext} className="w-full sm:w-auto shadow-sm">
              {step + 1 >= total ? "See Results" : "Next Question"} <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// 5. RESULT PANEL
// ============================================================================

function ResultPanel({ result, record, onRetake }: { result: Result | null, record: any, onRetake: () => void }) {
  if (!result && !record.passed) {
    return <div className="py-12 text-center text-ink-light italic border border-border-strong bg-surface">Complete the assessment in Section 02 and your result will appear here.</div>;
  }

  const scorePct = Math.round((result?.score ?? record.bestScore) * 100);
  const passed = result ? result.score >= PASS_THRESHOLD : record.passed;
  
  const rows = result ? SECTION_ORDER.map((s) => result.sections[s]).filter((r) => r.total > 0) : [];
  const weakest = rows.filter((r) => r.earned / r.possible < PASS_THRESHOLD).sort((a, b) => a.earned / a.possible - b.earned / b.possible).slice(0, 3);
  const ready = passed && weakest.length === 0;

  return (
    <div className="grid gap-6 md:grid-cols-[1.3fr,1fr] items-start animate-in fade-in duration-500">
      <div>
        <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 border ${
            passed ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
          }`}>
          {passed ? <Trophy className="size-3.5" /> : <Target className="size-3.5" />}{" "}
          {passed ? "Passed" : "Not quite there"}
        </div>
        
        <h3 className="font-serif text-5xl text-ink mb-4">
          {scorePct}% <span className="text-2xl text-ink-muted">/ 100%</span>
        </h3>
        
        {result && (
          <p className="mt-1 text-sm text-ink-light font-bold">
            {result.earned} of {result.possible} points · {result.correct} of {result.total} questions correct
          </p>
        )}
        
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-light mb-8">
          {passed
            ? "You've demonstrated a solid grasp of the Tibetan reading system. You have officially completed the Foundations unit!"
            : `You need ${Math.round(PASS_THRESHOLD * 100)}% to unlock the final certificate. Review the sections below and try again — your best score is kept.`}
        </p>

        {result && (
          <div className="mt-8 border border-border-strong bg-white p-6 md:p-8 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-light mb-6">Performance by skill</div>
            <ul className="space-y-6">
              {rows.map((r) => {
                const pct = r.possible > 0 ? Math.round((r.earned / r.possible) * 100) : 0;
                const strong = pct >= Math.round(PASS_THRESHOLD * 100);
                return (
                  <li key={r.id}>
                    <div className="flex items-baseline justify-between gap-3 text-[13px] mb-2">
                      <span className="font-bold text-ink">{SECTION_META[r.id].name}</span>
                      <span className={strong ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
                        {pct}% <span className="text-ink-muted font-normal ml-1">({r.correct}/{r.total})</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-muted overflow-hidden">
                      <div className={`h-full transition-all ${strong ? "bg-emerald-500" : "bg-rose-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {result && (
          <div className={`mt-6 border p-6 shadow-sm ${ready ? "border-emerald-500/30 bg-emerald-50/50" : "border-border-strong bg-surface-muted"}`}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-light mb-3">Readiness to progress</div>
            <p className="text-[14px] font-medium text-ink-light leading-relaxed">
              {ready ? "Every skill section is at or above the pass mark — you're ready to move on from Beginner 1."
                : passed ? "You passed overall, but some skills are still below the pass mark. Review them before moving on."
                : "Not yet ready for the next level. Work through the sections below and retake the assessment."}
            </p>
          </div>
        )}

        {weakest.length > 0 && (
          <div className="mt-6 border border-border-strong bg-surface-muted p-6 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-light mb-4">Suggested review</div>
            <ul className="space-y-3 text-sm">
              {weakest.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 border-b border-border-subtle pb-3 last:border-0 last:pb-0">
                  <span className="font-bold text-ink">
                    {SECTION_META[r.id].name}{" "}
                    <span className="font-normal text-ink-light ml-2">({r.total - r.correct} missed)</span>
                  </span>
                  <Link href={SECTION_META[r.id].review} className="inline-flex items-center gap-2 border border-border-strong bg-white px-4 py-2 text-xs font-bold text-ink-light hover:bg-surface-muted hover:text-ink transition-colors shadow-sm">
                    <BookOpen className="size-3.5" /> {SECTION_META[r.id].reviewName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-8 border-t border-border-subtle mt-8">
          {passed && (
            <Button onClick={() => window.print()} className="shadow-sm px-6">
              <Printer className="size-4" /> Print Certificate
            </Button>
          )}
          <Button variant="outline" onClick={onRetake} className="bg-white shadow-sm border-border-strong px-6">
            <RotateCcw className="size-4" /> {passed ? "Retake for a better score" : "Try again"}
          </Button>
        </div>
      </div>
      
      <Card className="p-8 bg-surface-muted border-border-strong shadow-sm sticky top-6">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-light mb-6">
          <Trophy className="size-3.5 text-brand" /> Progress kept
        </div>
        <ul className="space-y-5 text-[15px] text-ink-light">
          <li className="flex justify-between border-b border-border-subtle pb-4">
            <span>Best score:</span>
            <span className="font-bold text-ink">{Math.round(record.bestScore * 100)}%</span>
          </li>
          <li className="flex justify-between border-b border-border-subtle pb-4">
            <span>Attempts:</span>
            <span className="font-bold text-ink">{record.attempts}</span>
          </li>
          <li className="flex justify-between">
            <span>Status:</span>
            <span className={`font-bold uppercase tracking-widest text-[11px] ${passed ? "text-emerald-600" : "text-ink"}`}>
              {passed ? "Passed" : "In progress"}
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}