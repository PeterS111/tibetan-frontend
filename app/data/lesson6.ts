// app/data/lesson6.ts

export type Family = "silent" | "nasal" | "up" | "e-shift" | "el" | "r-scot";

export type SuffixKey = "ga" | "nga" | "da" | "na" | "ba" | "ma" | "a" | "ra" | "la" | "sa";

export interface SuffixExample {
  word: string;
  read: string;
  gloss?: string;
}

export interface Suffix {
  key: SuffixKey;
  head: string;
  latin: string;
  reads: string;
  hint: string;
  family: Family;
  accent: string;
  vowelShift?: string;
  examples: SuffixExample[];
  note?: string;
}

export const FAMILY_META: Record<Family, { label: string; hex: string }> = {
  silent: { label: "Almost silent", hex: "#6b7280" },
  nasal: { label: "Nasal ending", hex: "#b91c1c" },
  up: { label: "Soft [p] / [m]", hex: "#b45309" },
  "e-shift": { label: "Shifts vowel to [e]", hex: "#0369a1" },
  el: { label: "Silent · [el]", hex: "#7c3aed" },
  "r-scot": { label: "Scottish [r]", hex: "#c026d3" },
};

export const SUFFIXES: Suffix[] = [
  {
    key: "ga",
    head: "ག",
    latin: "ga",
    reads: "[k']",
    hint: "ག is almost silent — a light glottal stop, no English equivalent.",
    family: "silent",
    accent: "#b45309",
    examples: [
      { word: "དག་", read: "thak'", gloss: "pure" },
      { word: "རིག་", read: "rik'", gloss: "awareness" },
      { word: "ཐུག་", read: "thuk'", gloss: "to meet" },
    ],
    note: "The vowel is preserved; only a light closure is felt at the end.",
  },
  {
    key: "nga",
    head: "ང",
    latin: "nga",
    reads: "[ng]",
    hint: "Nasalised, as the -ng in “lung”.",
    family: "nasal",
    accent: "#b91c1c",
    examples: [
      { word: "དང་", read: "thang", gloss: "and" },
      { word: "རང་", read: "rang", gloss: "self" },
      { word: "ལུང་", read: "lung", gloss: "valley" },
    ],
  },
  {
    key: "ba",
    head: "བ",
    latin: "ba",
    reads: "[p]",
    hint: "Similar to “up” but softer, unreleased.",
    family: "up",
    accent: "#b45309",
    examples: [
      { word: "རབ་", read: "rap", gloss: "excellent" },
      { word: "ཐུབ་", read: "thup", gloss: "able" },
      { word: "ཁབ་", read: "khap", gloss: "needle" },
    ],
  },
  {
    key: "ma",
    head: "མ",
    latin: "ma",
    reads: "[m]",
    hint: "Sounds like -um in “come”.",
    family: "up",
    accent: "#b45309",
    examples: [
      { word: "ལམ་", read: "lam", gloss: "path" },
      { word: "རིམ་", read: "rim", gloss: "order, sequence" },
      { word: "ཁྱིམ་", read: "khyim", gloss: "home" },
    ],
  },
  {
    key: "ra",
    head: "ར",
    latin: "ra",
    reads: "[r]",
    hint: "Pronounced like the Scottish rolled “r”.",
    family: "r-scot",
    accent: "#c026d3",
    examples: [
      { word: "མར་", read: "mar", gloss: "butter" },
      { word: "དཀར་", read: "kar", gloss: "white" },
      { word: "སྐར་", read: "kar", gloss: "star" },
    ],
  },
  {
    key: "a",
    head: "འ",
    latin: "'a",
    reads: "—",
    hint: "Never pronounced and does not change the root’s sound.",
    family: "silent",
    accent: "#6b7280",
    examples: [
      { word: "མཐའ་", read: "m'tha", gloss: "end, edge" },
      { word: "རྒྱའ་", read: "gya", gloss: "China / vast" },
    ],
    note: "འ as a suffix is a writing-only sign. Its main use is licensing an ‘a-suffix root to also take a post-suffix ས.",
  },
  {
    key: "la",
    head: "ལ",
    latin: "la",
    reads: "[el]",
    hint: "Nearly silent — like the “l” in British “elementary”.",
    family: "el",
    accent: "#7c3aed",
    vowelShift: "Attached to a bare root: pronounced as [el]. After a vowel, the vowel colour is kept and softened — e.g. [i] + la → [il], [u] + la → [ül], [o] + la → [öl].",
    examples: [
      { word: "གསལ་", read: "sel", gloss: "clear" },
      { word: "ཡུལ་", read: "yül", gloss: "country" },
      { word: "འོལ་", read: "öl", gloss: "vague" },
    ],
  },
  {
    key: "na",
    head: "ན",
    latin: "na",
    reads: "[en]",
    hint: "Sounds like -en in “pen”.",
    family: "e-shift",
    accent: "#0369a1",
    vowelShift: "After a vowel, ན keeps that vowel and closes with [n]: [i] + na → [in], [u] + na → [ün], [o] + na → [ön].",
    examples: [
      { word: "མན་", read: "men", gloss: "inferior" },
      { word: "རྒྱུན་", read: "gyün", gloss: "continuous" },
      { word: "སྤྱོན་", read: "chön", gloss: "arrival (hon.)" },
    ],
  },
  {
    key: "da",
    head: "ད",
    latin: "da",
    reads: "[e]",
    hint: "Shifts the final sound to [e], as in “say”.",
    family: "e-shift",
    accent: "#0369a1",
    vowelShift: "ད closes without a real consonant; the syllable ends on the fronted vowel: [i] → [i], [u] → [ü], [o] → [ö].",
    examples: [
      { word: "ནད་", read: "ne", gloss: "illness" },
      { word: "རྒྱུད་", read: "gyü", gloss: "continuum" },
      { word: "སྐད་", read: "ke", gloss: "voice, language" },
    ],
  },
  {
    key: "sa",
    head: "ས",
    latin: "sa",
    reads: "[e]",
    hint: "Also shifts the final to [e]; identical sound to suffix ད.",
    family: "e-shift",
    accent: "#0369a1",
    vowelShift: "Same colouring as ད: [i] → [i], [u] → [ü], [e] → [e], [o] → [ö].",
    examples: [
      { word: "ལས་", read: "le", gloss: "karma, action" },
      { word: "རུས་", read: "rü", gloss: "bone, lineage" },
      { word: "སོས་", read: "sö", gloss: "revived" },
    ],
  },
];

export interface Vocab {
  tib: string;
  read: string;
  en: string;
  emoji: string;
  suffix: SuffixKey;
}

export const VOCAB: Vocab[] = [
  { tib: "བོད་", read: "phö", en: "Tibet", emoji: "🏔️", suffix: "da" },
  { tib: "ཁང་", read: "khang", en: "house", emoji: "🏠", suffix: "nga" },
  { tib: "མེ་མདའ་", read: "me-da", en: "gun", emoji: "🔫", suffix: "a" },
  { tib: "རྒྱལ་ཁབ་", read: "gyal-khap", en: "country / world", emoji: "🌍", suffix: "ba" },
  { tib: "ལམ་", read: "lam", en: "path", emoji: "🛤️", suffix: "ma" },
  { tib: "དཀར་པོ་", read: "kar-po", en: "white / heart-ref.", emoji: "🤍", suffix: "ra" },
  { tib: "ལག་པ་", read: "lak-pa", en: "hand", emoji: "✋", suffix: "ga" },
  { tib: "ནག་པོ་", read: "nak-po", en: "black", emoji: "⬛", suffix: "ga" },
  { tib: "གངས་རི་", read: "gang-ri", en: "snow mountain", emoji: "🏔️", suffix: "nga" },
  { tib: "ནགས་ཚལ་", read: "nak-tsel", en: "forest", emoji: "🌲", suffix: "la" },
  { tib: "རྣམས་", read: "nam", en: "plural marker", emoji: "🔢", suffix: "sa" },
  { tib: "ཁམས་", read: "kham", en: "region (Kham)", emoji: "🗺️", suffix: "sa" },
];

export interface QuizItem {
  word: string;
  read: string;
  suffix: SuffixKey;
  post?: "sa" | "da" | null;
}

export const QUIZ: QuizItem[] = [
  { word: "ལམ་", read: "lam", suffix: "ma" },
  { word: "རང་", read: "rang", suffix: "nga" },
  { word: "ནད་", read: "ne", suffix: "da" },
  { word: "མར་", read: "mar", suffix: "ra" },
  { word: "ལས་", read: "le", suffix: "sa" },
  { word: "གསལ་", read: "sel", suffix: "la" },
  { word: "རིག་", read: "rik'", suffix: "ga" },
  { word: "མན་", read: "men", suffix: "na" },
  { word: "རབ་", read: "rap", suffix: "ba" },
  { word: "མཐའ་", read: "m'tha", suffix: "a" },
  { word: "གངས་", read: "gang", suffix: "nga", post: "sa" },
  { word: "ཁམས་", read: "kham", suffix: "ma", post: "sa" },
];

export const STEPS = [
  { id: "intro", eyebrow: "Step 01", title: "What is a suffix?", description: "The ten suffixes and the two post-suffixes." },
  { id: "suffixes", eyebrow: "Step 02", title: "Meet the ten suffixes", description: "Study each suffix and its spelling." },
  { id: "vowel", eyebrow: "Step 03", title: "When the vowel meets the suffix", description: "How suffixes reshape the preceding vowel." },
  { id: "post", eyebrow: "Step 04", title: "Post-suffixes", description: "The silent closers \u0f51 and \u0f66, historical vs modern." },
  { id: "root", eyebrow: "Step 05", title: "How to recognise the root letter", description: "Rules for parsing complex syllables." },
  { id: "vocab", eyebrow: "Step 06", title: "Vocabulary", description: "Words that use the suffixes you just learned." },
  { id: "practice", eyebrow: "Step 07", title: "Cumulative practice", description: "Flashcards, quiz, and matching drills." },
  { id: "test", eyebrow: "Step 08", title: "Step complete", description: "Pass to unlock the next lesson." }
];