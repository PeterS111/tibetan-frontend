// app/data/lesson2.ts

export type VowelKey = "i" | "u" | "e" | "o";
export type Position = "above" | "below";

export interface Vowel {
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

export const POSITION_META: Record<Position, { label: string; swatch: string; ring: string; text: string; hex: string }> = {
  above: { label: "Written above the letter", swatch: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800", hex: "#f59e0b" },
  below: { label: "Written below the letter", swatch: "bg-sky-100", ring: "ring-sky-300", text: "text-sky-800", hex: "#0ea5e9" },
};

export const VOWELS: Vowel[] = [
  { key: "i", tib: "ཨི", mark: "ི", translit: "I", markTib: "གི་གུ", markTranslit: "gi-gu", markGloss: "[khi khu]", position: "above", english: "As in “peer”, “real”, “ear”.", examples: ["མི", "རི", "ཤི"], note: "A small hook drawn above the root letter. Front, close vowel — spread the lips slightly as in English ‘ee’." },
  { key: "u", tib: "ཨུ", mark: "ུ", translit: "U", markTib: "ཞབས་ཀྱུ", markTranslit: "shab-kyu", markGloss: "[shab kyu / tyu]", position: "below", english: "As in “bush”, “push”, “put”.", examples: ["སུ", "ཆུ", "ཕུ"], note: "A small curl drawn beneath the root letter. Back, close-rounded vowel — round the lips as in English ‘oo’ in ‘put’." },
  { key: "e", tib: "ཨེ", mark: "ེ", translit: "E", markTib: "འགྲེང་བུ", markTranslit: "'dreng-bu", markGloss: "[ng’dreng po]", position: "above", english: "As in “pay”, “say”, “may”.", examples: ["མེ", "སེ", "ཏེ"], note: "A short slanted stroke drawn above the root letter. Front, mid vowel — brighter and higher than English ‘e’ in ‘bed’." },
  { key: "o", tib: "ཨོ", mark: "ོ", translit: "O", markTib: "ན་རོ", markTranslit: "na-ro", markGloss: "[na ro]", position: "above", english: "As in “more”, “door”, “orange”.", examples: ["མོ", "ཇོ", "ཤོ"], note: "A small circle drawn above the root letter. Back, mid-rounded vowel — round the lips as in English ‘oh’." },
];

export const VOCAB = [
  { tib: "མི",     translit: "mi",       en: "people",         emoji: "🧑‍🤝‍🧑", vowel: "i" },
  { tib: "སུ",     translit: "su",       en: "who",            emoji: "❓",       vowel: "u" },
  { tib: "སོ",     translit: "so",       en: "teeth",          emoji: "😁",       vowel: "o" },
  { tib: "ཆུ",     translit: "chu",      en: "water",          emoji: "💧",       vowel: "u" },
  { tib: "མེ",     translit: "me",       en: "fire",           emoji: "🔥",       vowel: "e" },
  { tib: "ཕོ",     translit: "pho",      en: "male",           emoji: "🧑",       vowel: "o" },
  { tib: "ཉི་ཤུ",  translit: "nyi-shu",  en: "twenty",         emoji: "🔢",       vowel: "u" },
  { tib: "རི་མོ",  translit: "ri-mo",    en: "drawing",        emoji: "🎨",       vowel: "i" },
  { tib: "འོ་མ",   translit: "o-ma",     en: "milk",           emoji: "🥛",       vowel: "o" },
  { tib: "ཤུ་གུ",  translit: "shu-gu",   en: "paper",          emoji: "📄",       vowel: "u" },
  { tib: "ཀུ་ཤུ",  translit: "ku-shu",   en: "apple",          emoji: "🍎",       vowel: "u" },
  { tib: "ཉི་མ",   translit: "nyi-ma",   en: "sun",            emoji: "☀️",       vowel: "i" },
  { tib: "མོ",     translit: "mo",       en: "she / female",   emoji: "👩",       vowel: "o" },
  { tib: "ཞོ",     translit: "zho",      en: "yoghurt",        emoji: "🥣",       vowel: "o" },
  { tib: "ཙི་ཙི",  translit: "tsi-tsi",  en: "mouse",          emoji: "🐭",       vowel: "i" },
  { tib: "ཇོ་ཇོ",  translit: "jo-jo",    en: "elder brother",  emoji: "👦",       vowel: "o" },
];

export const STEPS = [
  { id: "grid", eyebrow: "Step 01", title: "The four vowels, as a type specimen", description: "Tap each mark to hear and inspect it." },
  { id: "pronunciation", eyebrow: "Step 02", title: "Pronouncing the four vowels", description: "Map each vowel to a familiar English sound." },
  { id: "marks", eyebrow: "Step 03", title: "The four diacritic marks", description: "Names, positions, and how each mark is written." },
  { id: "spelling", eyebrow: "Step 04", title: "Spelling — root letter + vowel mark", description: "Combine any consonant with the four vowel marks." },
  { id: "vocab", eyebrow: "Step 05", title: "Nouns formed with the four vowels", description: "Read and hear real words using vowels only." },
  { id: "practice", eyebrow: "Step 06", title: "Practice & exercises", description: "Flashcards, listening, matching, and tracing." },
  { id: "complete", eyebrow: "Final test", title: "Step test — unlock the next step", description: "Score 80% or higher to unlock Superscripts." },
];