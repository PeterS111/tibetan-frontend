// app/data/lesson1.ts

export type Tone = "high-unasp" | "high-asp" | "low-asp" | "low-nasal";
export type Gender = "masculine" | "neuter" | "feminine" | "very-feminine" | "sub-feminine";

export interface Consonant {
  tib: string;
  translit: string;
  pron: string; 
  tone: Tone;
  gender: Gender;
  note: string;
}

export const TONE_META: Record<Tone, { label: string; short: string; swatch: string; ring: string; text: string; description: string }> = {
  "high-unasp": { label: "High tone · Non-aspirated", short: "High · Unaspirated", swatch: "bg-sky-100", ring: "ring-sky-300", text: "text-sky-800", description: "Pronounced high in the voice, with no puff of air. Say the sound cleanly, keeping the pitch bright." },
  "high-asp": { label: "High tone · Strongly aspirated", short: "High · Aspirated", swatch: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800", description: "Pronounced high in the voice with a strong puff of air, as if adding a breathy ‘h’ after the sound." },
  "low-asp": { label: "Low tone · Semi-aspirated", short: "Low · Semi-aspirated", swatch: "bg-violet-100", ring: "ring-violet-300", text: "text-violet-800", description: "Pronounced low in the voice with a light, softened aspiration. The pitch drops and the sound is gentler than its high-tone counterpart." },
  "low-nasal": { label: "Low tone · Nasal", short: "Low · Nasal", swatch: "bg-rose-100", ring: "ring-rose-300", text: "text-rose-800", description: "The four true nasals — ང ཉ ན མ. Voice resonates through the nose, low in pitch, with no puff of air." },
};

export const TONE_HEX: Record<Tone, string> = {
  "high-unasp": "#0ea5e9",
  "high-asp": "#f59e0b",
  "low-asp": "#8b5cf6",
  "low-nasal": "#f43f5e",
};

export const GENDER_META: Record<Gender, { label: string; tib: string; color: string; tint: string; text: string }> = {
  masculine:       { label: "Masculine",     tib: "ཕོ་",         color: "#dc2626", tint: "rgba(220,38,38,0.08)",  text: "#991b1b" },
  neuter:          { label: "Neuter",        tib: "མ་ནིང་",     color: "#eab308", tint: "rgba(234,179,8,0.14)",  text: "#854d0e" },
  feminine:        { label: "Feminine",      tib: "མོ་",         color: "#0d9488", tint: "rgba(13,148,136,0.08)", text: "#115e59" },
  "very-feminine": { label: "Very Feminine", tib: "ཤིན་ཏུ་མོ་", color: "#a855f7", tint: "rgba(168,85,247,0.08)", text: "#6b21a8" },
  "sub-feminine":  { label: "Sub-Feminine",  tib: "མོ་གཤམ་",   color: "#3b82f6", tint: "rgba(59,130,246,0.08)", text: "#1e40af" },
};

export const CONSONANTS: Consonant[] = [
  { tib: "ཀ", translit: "ka",  pron: "[ka]",    tone: "high-unasp", gender: "masculine",     note: "As in English ‘skate’ — high, clean, no puff of air." },
  { tib: "ཁ", translit: "kha", pron: "[kha]",   tone: "high-asp",   gender: "neuter",        note: "Like ‘k’ in ‘kite’ with a strong breathy release." },
  { tib: "ག", translit: "ga",  pron: "[kha]",   tone: "low-asp",    gender: "feminine",      note: "Written ‘ga’; a low semi-aspirated sound, close to a soft ‘kha’." },
  { tib: "ང", translit: "nga", pron: "[nga]",   tone: "low-nasal",  gender: "very-feminine", note: "Nasal ‘ng’ as in ‘sing’, held at the back of the mouth." },
  { tib: "ཅ", translit: "ca",  pron: "[ca]",    tone: "high-unasp", gender: "masculine",     note: "Like ‘ch’ in ‘chip’ but crisper — no aspiration." },
  { tib: "ཆ", translit: "cha", pron: "[chha]",  tone: "high-asp",   gender: "neuter",        note: "Aspirated ‘ch’ — as in ‘cheese’ with a strong puff of air." },
  { tib: "ཇ", translit: "ja",  pron: "[chha]",  tone: "low-asp",    gender: "feminine",      note: "Written ‘ja’; low semi-aspirated, softening toward a gentle ‘chha’." },
  { tib: "ཉ", translit: "nya", pron: "[nya]",   tone: "low-nasal",  gender: "very-feminine", note: "Palatal nasal ‘ny’, as in the Spanish ‘ñ’." },
  { tib: "ཏ", translit: "ta",  pron: "[ta]",    tone: "high-unasp", gender: "masculine",     note: "As in ‘stop’ — dental, unaspirated, high pitch." },
  { tib: "ཐ", translit: "tha", pron: "[tha]",   tone: "high-asp",   gender: "neuter",        note: "Strongly aspirated ‘t’ — a clear breath follows the sound." },
  { tib: "ད", translit: "da",  pron: "[tha]",   tone: "low-asp",    gender: "feminine",      note: "Low-tone ‘da’; a semi-aspirated sound, often heard as a soft ‘tha’." },
  { tib: "ན", translit: "na",  pron: "[na]",    tone: "low-nasal",  gender: "very-feminine", note: "Dental nasal ‘n’, as in English ‘nun’." },
  { tib: "པ", translit: "pa",  pron: "[pa]",    tone: "high-unasp", gender: "masculine",     note: "As in ‘spin’ — unaspirated ‘p’, high pitch." },
  { tib: "ཕ", translit: "pha", pron: "[pha]",   tone: "high-asp",   gender: "neuter",        note: "Aspirated ‘p’, as in ‘pin’ — never like English ‘f’." },
  { tib: "བ", translit: "ba",  pron: "[pha]",   tone: "low-asp",    gender: "feminine",      note: "Low-tone ‘ba’; semi-aspirated, softening toward a light ‘pha’." },
  { tib: "མ", translit: "ma",  pron: "[ma]",    tone: "low-nasal",  gender: "very-feminine", note: "Bilabial nasal ‘m’, as in ‘mother’." },
  { tib: "ཙ", translit: "tsa", pron: "[tsa]",   tone: "high-unasp", gender: "masculine",     note: "Like ‘ts’ in ‘cats’, spoken high and cleanly." },
  { tib: "ཚ", translit: "tsha",pron: "[ts’ha]", tone: "high-asp",   gender: "neuter",        note: "Aspirated ‘ts’ — a puff of air follows the sound." },
  { tib: "ཛ", translit: "dza", pron: "[ts’ha]", tone: "low-asp",    gender: "feminine",      note: "Low ‘dza’; a semi-aspirated sound, heard close to a gentle ‘tsha’." },
  { tib: "ཝ", translit: "wa",  pron: "[wa]",    tone: "low-asp",    gender: "feminine",      note: "As in English ‘water’ — a soft, low ‘w’." },
  { tib: "ཞ", translit: "zha", pron: "[sha]",   tone: "low-asp",    gender: "feminine",      note: "Low-tone ‘zha’, close to a soft ‘sh’ sound." },
  { tib: "ཟ", translit: "za",  pron: "[sa]",    tone: "low-asp",    gender: "feminine",      note: "Low-tone ‘za’, often realised close to a low ‘sa’." },
  { tib: "འ", translit: "'a",  pron: "[ah]",    tone: "low-asp",    gender: "feminine",      note: "A soft glottal ‘a’ — carries the vowel without a hard onset." },
  { tib: "ཡ", translit: "ya",  pron: "[ya]",    tone: "low-asp",    gender: "feminine",      note: "As in ‘yes’ — palatal glide, low pitch." },
  { tib: "ར", translit: "ra",  pron: "[ra]",    tone: "low-asp",    gender: "sub-feminine",  note: "A soft, low ‘r’ — closer to a Spanish ‘r’ than an English one." },
  { tib: "ལ", translit: "la",  pron: "[la]",    tone: "low-asp",    gender: "sub-feminine",  note: "As in ‘look’ — clear, low ‘l’." },
  { tib: "ཤ", translit: "sha", pron: "[shha]",  tone: "high-asp",   gender: "feminine",      note: "Like ‘sh’ in ‘shine’, spoken high in the voice." },
  { tib: "ས", translit: "sa",  pron: "[s’ha]",  tone: "high-asp",   gender: "feminine",      note: "High-tone ‘s’, close to English ‘sun’." },
  { tib: "ཧ", translit: "ha",  pron: "[ha]",    tone: "high-asp",   gender: "sub-feminine",  note: "Aspirated ‘h’, breathy and light." },
  { tib: "ཨ", translit: "a",   pron: "[a]",     tone: "high-unasp", gender: "sub-feminine",  note: "The neutral vowel carrier — a clean ‘a’ with no consonant." },
];

export const VOCAB = [
  { tib: "ཁ་བ་",   translit: "kha-wa",   en: "snow",       emoji: "❄️" },
  { tib: "ང་",     translit: "nga",      en: "I / me",     emoji: "🙋" },
  { tib: "ཇ་མ་",   translit: "ja-ma",    en: "cook",       emoji: "👨‍🍳" },
  { tib: "ཉ་",     translit: "nya",      en: "fish",       emoji: "🐟" },
  { tib: "ཐ་མ་",   translit: "tha-ma",   en: "cigarette",  emoji: "🚬" },
  { tib: "ཨ་མ་",   translit: "a-ma",     en: "mother",    emoji: "👩" },
  { tib: "ན་ཚ་",   translit: "na-tsha",  en: "illness",    emoji: "🏥" },
  { tib: "ཤ་",     translit: "sha",      en: "meat",       emoji: "🍖" },
  { tib: "ཕ་མ་",   translit: "pha-ma",   en: "parents",    emoji: "👨‍👩‍👧" },
  { tib: "ཨ་ར་",   translit: "a-ra",     en: "beard",      emoji: "🧔" },
  { tib: "ཤ་བ་",   translit: "sha-wa",   en: "deer",       emoji: "🦌" },
  { tib: "ཁ་",     translit: "kha",      en: "mouth",      emoji: "👄" },
  { tib: "ར་",     translit: "ra",       en: "goat",       emoji: "🐐" },
  { tib: "ཇ་",     translit: "ja",       en: "tea",        emoji: "🍵" },
  { tib: "ཟ་མ་",   translit: "za-ma",    en: "food",       emoji: "🍚" },
  { tib: "ཉ་པ་",   translit: "nya-pa",   en: "fisherman",  emoji: "🎣" },
  { tib: "ཁ་ཚ་མ་", translit: "kha-tsha-ma", en: "chilli",  emoji: "🌶️" },
  { tib: "ཀ་བ་",   translit: "ka-wa",    en: "pillar",     emoji: "🏛️" },
];

export const STEPS = [
  { id: "intro", eyebrow: "Introduction", title: "Welcome to the 30 consonants", description: "A short orientation before you meet the letters." },
  { id: "grid", eyebrow: "Step 01", title: "The alphabet, as a type specimen", description: "Tap each letter to hear its sound and see its details." },
  { id: "tone", eyebrow: "Step 02", title: "Understanding tone", description: "The four voice registers that colour every consonant." },
  { id: "roots", eyebrow: "Step 03", title: "The three root sounds", description: "Trace every consonant back to ཨ, ཧ, or འ." },
  { id: "gender", eyebrow: "Step 04", title: "Traditional gender classification", description: "The five effort-based groupings of the alphabet." },
  { id: "vocab", eyebrow: "Step 05", title: "Nouns formed from the 30 consonants", description: "Read and hear real words built from the root letters." },
  { id: "practice", eyebrow: "Step 06", title: "Practice & exercises", description: "Flashcards, listening, matching, and stroke tracing." },
  { id: "complete", eyebrow: "Final test", title: "Step complete — unlock the next step", description: "Score 80% or higher on the final test to unlock The Four Vowels." },
];