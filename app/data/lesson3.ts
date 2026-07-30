// app/data/lesson3.ts
import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

export type Tone = "same" | "up" | "down";
export type SuperKey = "ra" | "la" | "sa";

export interface Combo {
  stack: string;
  read: string;
  tone: Tone;
}

export interface Super {
  key: SuperKey;
  head: string;
  headLabel: string;
  name: string;
  nameTib: string;
  title: string;
  count: number;
  intro: string;
  rootLetters: string;
  combos: Combo[];
  accent: { hex: string; bg: string; text: string; border: string; hover: string };
}

export const TONE_META: Record<Tone, { label: string; hex: string; Icon: any; text: string; bg: string; border: string }> = {
  same: { label: "Same tone as root", hex: "#16a34a", Icon: ArrowRight, text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  up:   { label: "Higher tone",       hex: "#b91c1c", Icon: ArrowUp,    text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  down: { label: "Lower tone",        hex: "#0284c7", Icon: ArrowDown,  text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
};

export const SUPERS: Super[] = [
  {
    key: "ra",
    head: "ར",
    headLabel: "ར་མགོ",
    name: "Ra-go",
    nameTib: "ར་མགོ་བཅུ་གཉིས།",
    title: "The Twelve Superscripts \u201cRa\u201d",
    count: 12,
    intro: "The consonant ར (ra) sits above twelve root letters. When it does, it is no longer pronounced on its own — instead it re-tunes the tone of the letter beneath.",
    rootLetters: "ཀ ག ང ཇ ཉ ཏ ད ན བ མ ཙ ཛ",
    accent: { hex: "#b91c1c", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", hover: "hover:bg-rose-100" },
    combos: [
      { stack: "རྐ", read: "ka",  tone: "same" }, { stack: "རྒ", read: "ga",  tone: "down" },
      { stack: "རྔ", read: "nga", tone: "up"   }, { stack: "རྗ", read: "ja",  tone: "down" },
      { stack: "རྙ", read: "nya", tone: "up"   }, { stack: "རྟ", read: "ta",  tone: "same" },
      { stack: "རྡ", read: "da",  tone: "down" }, { stack: "རྣ", read: "na",  tone: "up"   },
      { stack: "རྦ", read: "ba",  tone: "down" }, { stack: "རྨ", read: "ma",  tone: "up"   },
      { stack: "རྩ", read: "tsa", tone: "same" }, { stack: "རྫ", read: "dza", tone: "down" },
    ],
  },
  {
    key: "la",
    head: "ལ",
    headLabel: "ལ་མགོ",
    name: "La-go",
    nameTib: "ལ་མགོ་བཅུ།",
    title: "The Ten Superscripts \u201cLa\u201d",
    count: 10,
    intro: "The consonant ལ (la) serves as a superscript for ten root letters. As with Ra-go, its role is silent — it shifts the tone of the letter it caps.",
    rootLetters: "ཀ ག ང ཅ ཇ ཏ ད པ བ ཧ",
    accent: { hex: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", hover: "hover:bg-amber-100" },
    combos: [
      { stack: "ལྐ", read: "ka",  tone: "same" }, { stack: "ལྒ", read: "ga",  tone: "down" },
      { stack: "ལྔ", read: "nga", tone: "up"   }, { stack: "ལྕ", read: "ca",  tone: "same" },
      { stack: "ལྗ", read: "ja",  tone: "down" }, { stack: "ལྟ", read: "ta",  tone: "same" },
      { stack: "ལྡ", read: "da",  tone: "down" }, { stack: "ལྤ", read: "pa",  tone: "up"   },
      { stack: "ལྦ", read: "ba",  tone: "down" }, { stack: "ལྷ", read: "lha", tone: "up"   },
    ],
  },
  {
    key: "sa",
    head: "ས",
    headLabel: "ས་མགོ",
    name: "Sa-go",
    nameTib: "ས་མགོ་བཅུ་གཅིག།",
    title: "The Eleven Superscripts \u201cSa\u201d",
    count: 11,
    intro: "The consonant ས (sa) sits above eleven root letters. Sa-go stacks are common in everyday vocabulary — nose, saddle, wheat, body — so they reward memorising early.",
    rootLetters: "ཀ ག ང ཉ ཏ ད ན པ བ མ ཙ",
    accent: { hex: "#0ea5e9", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", hover: "hover:bg-sky-100" },
    combos: [
      { stack: "སྐ", read: "ka",  tone: "same" }, { stack: "སྒ", read: "ga",  tone: "down" },
      { stack: "སྔ", read: "nga", tone: "up"   }, { stack: "སྙ", read: "nya", tone: "up"   },
      { stack: "སྟ", read: "ta",  tone: "same" }, { stack: "སྡ", read: "da",  tone: "down" },
      { stack: "སྣ", read: "na",  tone: "up"   }, { stack: "སྤ", read: "pa",  tone: "same" },
      { stack: "སྦ", read: "ba",  tone: "down" }, { stack: "སྨ", read: "ma",  tone: "up"   },
      { stack: "སྩ", read: "tsa", tone: "same" },
    ],
  },
];

export interface Vocab {
  tib: string;
  translit: string;
  en: string;
  emoji: string;
  sup: SuperKey;
}

export const VOCAB: Vocab[] = [
  { tib: "རྟ", translit: "ta", en: "horse", emoji: "🐎", sup: "ra" },
  { tib: "རྔ", translit: "nga", en: "drum", emoji: "🥁", sup: "ra" },
  { tib: "རྗེ་བོ", translit: "je-wo", en: "king", emoji: "🤴", sup: "ra" },
  { tib: "རྡོ", translit: "do", en: "stone", emoji: "🪨", sup: "ra" },
  { tib: "རྡོ་རྗེ", translit: "dor-je", en: "vajra", emoji: "🔱", sup: "ra" },
  { tib: "རྨ", translit: "ma", en: "wound", emoji: "🩹", sup: "ra" },
  { tib: "རྐུ་མ", translit: "ku-ma", en: "thief", emoji: "🦹", sup: "ra" },
  { tib: "རྩ", translit: "tsa", en: "grass", emoji: "🌱", sup: "ra" },
  { tib: "རྣ", translit: "na", en: "ear", emoji: "👂", sup: "ra" },
  { tib: "རྫ་ཆུ", translit: "dza-chu", en: "Mountain river", emoji: "🏞️", sup: "ra" },
  { tib: "རྩ་བ", translit: "tsa-wa", en: "root", emoji: "🌿", sup: "ra" },
  { tib: "ལྔ", translit: "nga", en: "five", emoji: "5️⃣", sup: "la" },
  { tib: "ལྷ", translit: "lha", en: "deity", emoji: "🕉️", sup: "la" },
  { tib: "ལྷ་མོ", translit: "lha-mo", en: "goddess", emoji: "🪷", sup: "la" },
  { tib: "ལྕེ", translit: "ce", en: "tongue", emoji: "👅", sup: "la" },
  { tib: "ལྡི་ལི", translit: "di-li", en: "Delhi", emoji: "🏛️", sup: "la" },
  { tib: "ལྟ", translit: "ta", en: "look", emoji: "🔭", sup: "la" },
  { tib: "ལྗི་བ", translit: "ji-ba", en: "flea", emoji: "🪳", sup: "la" },
  { tib: "ལྕི་བ", translit: "ci-ba", en: "dung", emoji: "💩", sup: "la" },
  { tib: "སྒ", translit: "ga", en: "saddle", emoji: "🐴", sup: "sa" },
  { tib: "སྙེ་མ", translit: "nye-ma", en: "Ear of the grain", emoji: "🌾", sup: "sa" },
  { tib: "སྣ", translit: "na", en: "nose", emoji: "👃", sup: "sa" },
  { tib: "སྐྲ", translit: "tra", en: "hair", emoji: "💇", sup: "sa" },
  { tib: "སྟ་རེ", translit: "ta-re", en: "axe", emoji: "🪓", sup: "sa" },
  { tib: "སྐུ", translit: "ku", en: "body", emoji: "🧍", sup: "sa" },
  { tib: "སྤུ", translit: "pu", en: "hair", emoji: "🧑‍🦱", sup: "sa" },
  { tib: "སྔ་མོ", translit: "nga-mo", en: "early", emoji: "🌅", sup: "sa" },
  { tib: "སྐེ", translit: "ke", en: "neck", emoji: "🦒", sup: "sa" },
];

export const STEPS = [
  { id: "intro", eyebrow: "Step 01", title: "What is a superscript?", desc: "How superscripts stack over a root letter." },
  { id: "family", eyebrow: "Step 02", title: "Meet the three superscripts", desc: "Study each superscript with its root combinations." },
  { id: "vocab", eyebrow: "Step 03", title: "Vocabulary built from superscripts", desc: "Real words using stacked letters." },
  { id: "practice", eyebrow: "Step 04", title: "Practice & mastery check", desc: "Flashcards, quiz, and matching drills." },
  { id: "complete", eyebrow: "Finish", title: "Lesson complete", desc: "Take the final test to unlock the next unit." }
];