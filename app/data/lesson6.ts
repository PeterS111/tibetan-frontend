import { QuizQuestion } from "@/app/components/QuizModule";

export type Family = "silent" | "nasal" | "up" | "e-shift" | "el" | "r-scot";

export type SuffixKey = "ga" | "nga" | "da" | "na" | "ba" | "ma" | "a" | "ra" | "la" | "sa";

export interface SuffixExample {
  word: string;
  parts: string;
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
      { word: "དག་", parts: "ད + ག", read: "thak'", gloss: "pure" },
      { word: "རིག་", parts: "ར + ི + ག", read: "rik'", gloss: "awareness" },
      { word: "ཐུག་", parts: "ཐ + ུ + ག", read: "thuk'", gloss: "to meet" },
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
      { word: "དང་", parts: "ད + ང", read: "thang", gloss: "and" },
      { word: "རང་", parts: "ར + ང", read: "rang", gloss: "self" },
      { word: "ལུང་", parts: "ལ + ུ + ང", read: "lung", gloss: "valley" },
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
      { word: "རབ་", parts: "ར + བ", read: "rap", gloss: "excellent" },
      { word: "ཐུབ་", parts: "ཐ + ུ + བ", read: "thup", gloss: "able" },
      { word: "ཁབ་", parts: "ཁ + བ", read: "khap", gloss: "needle" },
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
      { word: "ལམ་", parts: "ལ + མ", read: "lam", gloss: "path" },
      { word: "རིམ་", parts: "ར + ི + མ", read: "rim", gloss: "order, sequence" },
      { word: "ཁྱིམ་", parts: "ཁ + ྱ + ི + མ", read: "khyim", gloss: "home" },
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
      { word: "མར་", parts: "མ + ར", read: "mar", gloss: "butter" },
      { word: "དཀར་", parts: "ད + ཀ + ར", read: "kar", gloss: "white" },
      { word: "སྐར་", parts: "ས + ྐ + ར", read: "kar", gloss: "star" },
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
      { word: "མཐའ་", parts: "མ + ཐ + འ", read: "m'tha", gloss: "end, edge" },
      { word: "མཁའ་", parts: "མ + ཁ + འ", read: "m'kha", gloss: "sky, space" },
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
      { word: "གསལ་", parts: "ག + ས + ལ", read: "sel", gloss: "clear" },
      { word: "ཡུལ་", parts: "ཡ + ུ + ལ", read: "yül", gloss: "country" },
      { word: "འོལ་", parts: "འ + ོ + ལ", read: "öl", gloss: "vague" },
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
      { word: "མན་", parts: "མ + ན", read: "men", gloss: "inferior" },
      { word: "རྒྱུན་", parts: "ར + ྒ + ྱ + ུ + ན", read: "gyün", gloss: "continuous" },
      { word: "སྤྱོན་", parts: "ས + ྤ + ྱ + ོ + ན", read: "chön", gloss: "arrival (hon.)" },
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
      { word: "ནད་", parts: "ན + ད", read: "ne", gloss: "illness" },
      { word: "རྒྱུད་", parts: "ར + ྒ + ྱ + ུ + ད", read: "gyü", gloss: "continuum" },
      { word: "སྐད་", parts: "ས + ྐ + ད", read: "ke", gloss: "voice, language" },
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
      { word: "ལས་", parts: "ལ + ས", read: "le", gloss: "karma, action" },
      { word: "རུས་", parts: "ར + ུ + ས", read: "rü", gloss: "bone, lineage" },
      { word: "སོས་", parts: "ས + ོ + ས", read: "sö", gloss: "revived" },
    ],
  },
];

export const VOWEL_SHIFTS = [
  { vowel: "ཨི", label: "[i]", audioTarget: "I", cells: [
    { word: "ཨིལ་", read: "il" },
    { word: "ཨིན་", read: "in" },
    { word: "ཨིད་", read: "i" },
    { word: "ཨིས་", read: "i" }
  ]},
  { vowel: "ཨུ", label: "[u]", audioTarget: "U", cells: [
    { word: "ཨུལ་", read: "ül" },
    { word: "ཨུན་", read: "ün" },
    { word: "ཨུད་", read: "ü" },
    { word: "ཨུས་", read: "ü" }
  ]},
  { vowel: "ཨེ", label: "[e]", audioTarget: "E", cells: [
    { word: "ཨེལ་", read: "el" },
    { word: "ཨེན་", read: "en" },
    { word: "ཨེད་", read: "e" },
    { word: "ཨེས་", read: "e" }
  ]},
  { vowel: "ཨོ", label: "[o]", audioTarget: "O", cells: [
    { word: "ཨོལ་", read: "öl" },
    { word: "ཨོན་", read: "ön" },
    { word: "ཨོད་", read: "ö" },
    { word: "ཨོས་", read: "ö" }
  ]},
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
  { tib: "ཁང་པ་", read: "khang-pa", en: "house", emoji: "🏠", suffix: "nga" },
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

// Redesigned to 8 steps since Spelling is now integrated into the Suffix panel
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

export const POST_SUFFIX_QUESTIONS: QuizQuestion[] = [
  { promptText: "Which two letters can act as post-suffixes?", answer: "da-sa", choices: [{label: "ད and ས", value: "da-sa", isTibetan: true}, {label: "ག and ང", value: "ga-nga", isTibetan: true}, {label: "བ and མ", value: "ba-ma", isTibetan: true}, {label: "ན and ལ", value: "na-la", isTibetan: true}], explanation: "Only ད (da) and ས (sa) can be used as post-suffixes." },
  { promptText: "Do post-suffixes change how a word is pronounced?", answer: "no", choices: [{label: "Yes", value: "yes"}, {label: "No", value: "no"}], explanation: "Post-suffixes are completely silent and do not alter the pronunciation." },
  { promptText: "Which post-suffix is still used in modern spelling?", answer: "sa", choices: [{label: "ད", value: "da", isTibetan: true}, {label: "ས", value: "sa", isTibetan: true}], explanation: "The post-suffix ས (sa) is still written today to distinguish homophones, while ད (da) is historical." },
];

export const ROOT_LETTER_QUESTIONS: QuizQuestion[] = [
  { promptText: "Identify the root letter in", promptHighlight: "དགེ་", promptAudio: "དགེ་", answer: "ག", audioTarget: "ག", choices: [{label: "ད", value: "ད", isTibetan: true}, {label: "ག", value: "ག", isTibetan: true}], explanation: "Rule 1: It carries a vowel, so ག is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "བཞི་", promptAudio: "བཞི་", answer: "ཞ", audioTarget: "ཞ", choices: [{label: "བ", value: "བ", isTibetan: true}, {label: "ཞ", value: "ཞ", isTibetan: true}], explanation: "Rule 1: It carries a vowel, so ཞ is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "འགྲོ་", promptAudio: "འགྲོ་", answer: "ག", audioTarget: "ག", choices: [{label: "འ", value: "འ", isTibetan: true}, {label: "ག", value: "ག", isTibetan: true}, {label: "ར", value: "ར", isTibetan: true}], explanation: "Rule 1: It carries the subscript and vowel, so ག is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "བསྒྲིམས་", promptAudio: "བསྒྲིམས་", answer: "ག", audioTarget: "ག", choices: [{label: "བ", value: "བ", isTibetan: true}, {label: "ས", value: "ས", isTibetan: true}, {label: "ག", value: "ག", isTibetan: true}], explanation: "Rule 1: ག carries the vowel and subscript, making it the root." },
  { promptText: "Identify the root letter in", promptHighlight: "ཁང་", promptAudio: "ཁང་", answer: "ཁ", audioTarget: "ཁ", choices: [{label: "ཁ", value: "ཁ", isTibetan: true}, {label: "ང", value: "ང", isTibetan: true}], explanation: "Rule 2: Two bare letters. The first (ཁ) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "ནད་", promptAudio: "ནད་", answer: "ན", audioTarget: "ན", choices: [{label: "ན", value: "ན", isTibetan: true}, {label: "ད", value: "ད", isTibetan: true}], explanation: "Rule 2: Two bare letters. The first (ན) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "ལམ་", promptAudio: "ལམ་", answer: "ལ", audioTarget: "ལ", choices: [{label: "ལ", value: "ལ", isTibetan: true}, {label: "མ", value: "མ", isTibetan: true}], explanation: "Rule 2: Two bare letters. The first (ལ) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "རབ་", promptAudio: "རབ་", answer: "ར", audioTarget: "ར", choices: [{label: "ར", value: "ར", isTibetan: true}, {label: "བ", value: "བ", isTibetan: true}], explanation: "Rule 2: Two bare letters. The first (ར) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "གསལ་", promptAudio: "གསལ་", answer: "ས", audioTarget: "ས", choices: [{label: "ག", value: "ག", isTibetan: true}, {label: "ས", value: "ས", isTibetan: true}, {label: "ལ", value: "ལ", isTibetan: true}], explanation: "Rule 3: Three bare letters (not ending in ད/ས). The middle (ས) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "དཀར་", promptAudio: "དཀར་", answer: "ཀ", audioTarget: "ཀ", choices: [{label: "ད", value: "ད", isTibetan: true}, {label: "ཀ", value: "ཀ", isTibetan: true}, {label: "ར", value: "ར", isTibetan: true}], explanation: "Rule 3: Three bare letters (not ending in ད/ས). The middle (ཀ) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "ཁམས་", promptAudio: "ཁམས་", answer: "ཁ", audioTarget: "ཁ", choices: [{label: "ཁ", value: "ཁ", isTibetan: true}, {label: "མ", value: "མ", isTibetan: true}, {label: "ས", value: "ས", isTibetan: true}], explanation: "Rule 3: Three bare letters ending in ས. The first (ཁ) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "གངས་", promptAudio: "གངས་", answer: "ག", audioTarget: "ག", choices: [{label: "ག", value: "ག", isTibetan: true}, {label: "ང", value: "ང", isTibetan: true}, {label: "ས", value: "ས", isTibetan: true}], explanation: "Rule 3: Three bare letters ending in ས. The first (ག) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "མངགས་", promptAudio: "མངགས་", answer: "ང", audioTarget: "ང", choices: [{label: "མ", value: "མ", isTibetan: true}, {label: "ང", value: "ང", isTibetan: true}, {label: "ག", value: "ག", isTibetan: true}, {label: "ས", value: "ས", isTibetan: true}], explanation: "Rule 4: Four letters. The second (ང) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "བདགས་", promptAudio: "བདགས་", answer: "ད", audioTarget: "ད", choices: [{label: "བ", value: "བ", isTibetan: true}, {label: "ད", value: "ད", isTibetan: true}, {label: "ག", value: "ག", isTibetan: true}, {label: "ས", value: "ས", isTibetan: true}], explanation: "Rule 4: Four letters. The second (ད) is the root." },
  { promptText: "Identify the root letter in", promptHighlight: "དམངས་", promptAudio: "དམངས་", answer: "མ", audioTarget: "མ", choices: [{label: "ད", value: "ད", isTibetan: true}, {label: "མ", value: "མ", isTibetan: true}, {label: "ང", value: "ང", isTibetan: true}, {label: "ས", value: "ས", isTibetan: true}], explanation: "Rule 4: Four letters. The second (མ) is the root." },
];

export function generateVocabQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  for (const v of VOCAB) {
    const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji, en: x.en }));
    
    if (Math.random() > 0.5) {
      qs.push({
        isAudioType: true,
        type: 'base',
        questionText: "Listen and select the matching option.",
        answer: v.tib,
        audioString: v.tib,
        answerObj: v,
        choices
      });
    } else {
      qs.push({
        isAudioType: false,
        type: 'vocab',
        questionText: `Which word means "${v.en}"?`,
        answer: v.tib,
        audioString: v.tib,
        answerObj: v,
        choices
      });
    }
  }
  return qs.sort(() => 0.5 - Math.random());
}

export function generateFinalQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
  const pickWrongs = <T,>(arr: T[], correct: T, count: number, filterFn = (x: T) => x !== correct) => shuffle(arr.filter(filterFn)).slice(0, count);

  const ALL_SUF_EXAMPLES = SUFFIXES.flatMap(s => s.examples.map(e => ({ ...e, sufKey: s.key, head: s.head, latin: s.latin, family: s.family, reads: s.reads })));
  const GLOSSED_EXAMPLES = ALL_SUF_EXAMPLES.filter(e => !!e.gloss);

  // 1. listenWordQs (take 3)
  shuffle(VOCAB).slice(0, 3).forEach(v => {
    qs.push({
      isAudioType: true, questionText: "Listen and select the matching Tibetan word.", answer: v.tib, audioString: v.tib,
      choices: shuffle([v.tib, ...pickWrongs(VOCAB.map(x => x.tib), v.tib, 3)]).map(x => ({ value: x, tib: x })) 
    });
  });

  // 2. listenMeanQs (take 2)
  shuffle(VOCAB).slice(0, 2).forEach(v => {
    qs.push({
      isAudioType: true, questionText: "Listen, then select the meaning of the word you hear.", answer: v.en, audioString: v.tib,
      choices: shuffle([v.en, ...pickWrongs(VOCAB.map(x => x.en), v.en, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 3. readQs (take 4)
  shuffle(ALL_SUF_EXAMPLES).slice(0, 4).forEach(e => {
    qs.push({
      questionText: `How is ${e.word} pronounced?`, prominentTibetan: e.word, answer: e.read, audioString: e.word,
      choices: shuffle([e.read, ...pickWrongs(ALL_SUF_EXAMPLES.map(x => x.read), e.read, 3)]).map(x => ({ value: x, label: `[${x}]` }))
    });
  });

  // 4. whichSuffixQs (take 3)
  shuffle(ALL_SUF_EXAMPLES).slice(0, 3).forEach(e => {
    qs.push({
      questionText: `Which suffix closes the syllable ${e.word}?`, prominentTibetan: e.word, answer: e.latin, audioString: e.word,
      choices: shuffle([e.latin, ...pickWrongs(SUFFIXES.map(s => s.latin), e.latin, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 5. familyQs (take 3)
  shuffle(ALL_SUF_EXAMPLES).slice(0, 3).forEach(e => {
    const answerLabel = FAMILY_META[e.family as Family].label;
    const wrongs = Object.keys(FAMILY_META).filter(k => k !== e.family).map(k => FAMILY_META[k as Family].label);
    qs.push({
      questionText: `What does the suffix do at the end of ${e.word}?`, prominentTibetan: e.word, answer: answerLabel, audioString: e.word,
      choices: shuffle([answerLabel, ...pickWrongs(wrongs, answerLabel, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 6. soundOfSuffixQs (take 3)
  shuffle(SUFFIXES).slice(0, 3).forEach(s => {
    qs.push({
      questionText: `How does the suffix ${s.head} sound at the end of a syllable?`, prominentTibetan: s.head, answer: s.reads, audioString: s.head,
      choices: shuffle([s.reads, ...pickWrongs(SUFFIXES.map(x => x.reads), s.reads, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 7. suffixFamilyQs (take 3)
  shuffle(SUFFIXES).slice(0, 3).forEach(s => {
    const answerLabel = FAMILY_META[s.family as Family].label;
    const wrongs = Object.keys(FAMILY_META).filter(k => k !== s.family).map(k => FAMILY_META[k as Family].label);
    qs.push({
      questionText: `Which group does the suffix ${s.head} belong to?`, prominentTibetan: s.head, answer: answerLabel, audioString: s.head,
      choices: shuffle([answerLabel, ...pickWrongs(wrongs, answerLabel, 3)]).map(x => ({ value: x, label: x }))
    });
  });


// 8. glossQs (take 3)
  shuffle(GLOSSED_EXAMPLES).slice(0, 3).forEach(e => {
    const gloss = e.gloss || "";
    qs.push({
      questionText: `What does ${e.word} mean?`, prominentTibetan: e.word, answer: gloss, audioString: e.word,
      choices: shuffle([gloss, ...pickWrongs(GLOSSED_EXAMPLES.map(x => x.gloss || ""), gloss, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 9. glossWordQs (take 2)
  shuffle(GLOSSED_EXAMPLES).slice(0, 2).forEach(e => {
    const gloss = e.gloss || "";
    qs.push({
      questionText: `Which syllable means "${gloss}"?`, answer: e.word, audioString: e.word,
      choices: shuffle([e.word, ...pickWrongs(GLOSSED_EXAMPLES.map(x => x.word), e.word, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // 10. oddQs (take 2)
  shuffle(SUFFIXES.filter(s => s.examples.length >= 3)).slice(0, 2).forEach(suf => {
    const members = ALL_SUF_EXAMPLES.filter(e => e.sufKey === suf.key);
    const oddOne = shuffle(ALL_SUF_EXAMPLES.filter(e => e.sufKey !== suf.key))[0];
    qs.push({
      questionText: `Which word does NOT use the suffix ${suf.head}?`, answer: oddOne.word,
      choices: shuffle([...shuffle(members).slice(0, 3).map(m => m.word), oddOne.word]).map(x => ({ value: x, tib: x }))
    });
  });

  // 11. vocabReadQs (take 3)
  shuffle(VOCAB).slice(0, 3).forEach(v => {
    qs.push({
      questionText: `How does ${v.tib} read?`, prominentTibetan: v.tib, answer: v.read, audioString: v.tib,
      choices: shuffle([v.read, ...pickWrongs(VOCAB.map(x => x.read), v.read, 3)]).map(x => ({ value: x, label: `[${x}]` }))
    });
  });

  // 12. vocabMeanQs (take 4)
  shuffle(VOCAB).slice(0, 4).forEach(v => {
    qs.push({
      questionText: `What does ${v.tib} mean?`, prominentTibetan: v.tib, answer: v.en, audioString: v.tib,
      choices: shuffle([v.en, ...pickWrongs(VOCAB.map(x => x.en), v.en, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 13. vocabWordQs (take 2)
  shuffle(VOCAB).slice(0, 2).forEach(v => {
    qs.push({
      questionText: `Which word means "${v.en}"?`, answer: v.tib, audioString: v.tib,
      choices: shuffle([v.tib, ...pickWrongs(VOCAB.map(x => x.tib), v.tib, 3)]).map(x => ({ value: x, tib: x })) 
    });
  });

  // 14. vocabSuffixQs (take 2)
  shuffle(VOCAB).slice(0, 2).forEach(v => {
    const suffixName = SUFFIXES.find(s => s.key === v.suffix)?.latin || v.suffix;
    qs.push({
      questionText: `Which suffix ends ${v.tib}?`, prominentTibetan: v.tib, answer: suffixName, audioString: v.tib,
      choices: shuffle([suffixName, ...pickWrongs(SUFFIXES.map(s => s.latin), suffixName, 3)]).map(x => {
         const s = SUFFIXES.find(suf => suf.latin === x);
         return { value: x, label: s ? `${s.head} ${s.latin}` : x };
      })
    });
  });

  // 15. ruleQs (take 4)
  const allRules = [
    { q: "How many letters can serve as suffixes?", a: "10", w: ["5", "8", "12"] },
    { q: "Where does a suffix sit in the syllable?", a: "After the root letter, closing the syllable", w: ["Before the root letter", "Beneath the root letter", "Above the root letter"] },
    { q: "Which two suffixes colour the vowel toward [e]?", a: "ད  ས", w: ["ག  ང", "ན  མ", "ར  ལ"] },
    { q: "With the suffix ས, the vowel [u] is pronounced how?", a: "[ü]", w: ["[u] unchanged", "[o]", "[i]"] },
    { q: "Which suffixes give a nasal ending?", a: "ང  ན  མ", w: ["ག  ད  ས", "ར  ལ  འ", "བ  མ  ས"] },
    { q: "How is the suffix ག heard in speech?", a: "As a light glottal closure — almost silent", w: ["As a clear hard [g]", "As a nasal [ng]", "It lengthens the vowel"] },
    { q: "How does the suffix ལ behave?", a: "It is largely silent, colouring the syllable toward [el]", w: ["It is pronounced as a strong [l]", "It nasalises the vowel", "It makes the syllable high tone"] }
  ];
  shuffle(allRules).slice(0, 4).forEach(r => {
    qs.push({
      questionText: r.q, answer: r.a,
      choices: shuffle([{ value: r.a, label: r.a }, ...r.w.map(w => ({ value: w, label: w }))])
    });
  });

  return shuffle(qs).slice(0, 40);
}