import { QuizQuestion } from "@/app/components/QuizModule";

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
  spellings?: { word: string; spell: string; roman: string; audio?: string }[];
  note: string;
}

export const POSITION_META: Record<Position, { label: string; swatch: string; ring: string; text: string; hex: string }> = {
  above: { label: "Written above the letter", swatch: "bg-amber-100", ring: "ring-amber-300", text: "text-amber-800", hex: "#f59e0b" },
  below: { label: "Written below the letter", swatch: "bg-sky-100", ring: "ring-sky-300", text: "text-sky-800", hex: "#0ea5e9" },
};

export const VOWELS: Vowel[] = [
  { 
    key: "i", tib: "ཨི", mark: "\u0F72", translit: "I", markTib: "གི་གུ", markTranslit: "gi-gu", markGloss: "khi khu", position: "above", english: "As in “peer”, “real”, “ear”.", examples: ["མི", "རི", "ཤི"], 
    spellings: [
      { word: "མི", spell: "མ་གི་གུ་མི", roman: "ma gi-gu mi", audio: "མི spelling" },
      { word: "རི", spell: "ར་གི་གུ་རི", roman: "ra gi-gu ri", audio: "རི spelling" },
      { word: "ཤི", spell: "ཤ་གི་གུ་ཤི", roman: "sha gi-gu shi", audio: "ཤི spelling" }
    ],
    note: "A small hook drawn above the root letter. Front, close vowel — spread the lips slightly as in English ‘ee’." 
  },
  { 
    key: "u", tib: "ཨུ", mark: "\u0F74", translit: "U", markTib: "ཞབས་ཀྱུ", markTranslit: "shab-kyu", markGloss: "shab kyu / tyu", position: "below", english: "As in “bush”, “push”, “put”.", examples: ["སུ", "ཆུ", "ཕུ"], 
    spellings: [
      { word: "སུ", spell: "ས་ཞབས་ཀྱུ་སུ", roman: "sa shab-kyu su", audio: "སུ spelling" },
      { word: "ཆུ", spell: "ཆ་ཞབས་ཀྱུ་ཆུ", roman: "cha shab-kyu chu", audio: "ཆུ spelling" },
      { word: "ཕུ", spell: "ཕ་ཞབས་ཀྱུ་ཕུ", roman: "pha shab-kyu phu", audio: "ཕུ spelling" }
    ],
    note: "A small curl drawn beneath the root letter. Back, close-rounded vowel — round the lips as in English ‘oo’ in ‘put’." 
  },
  { 
    key: "e", tib: "ཨེ", mark: "\u0F7A", translit: "E", markTib: "འགྲེང་བུ", markTranslit: "dreng-bu", markGloss: "ng’dreng po", position: "above", english: "As in “pay”, “say”, “may”.", examples: ["མེ", "སེ", "ཏེ"], 
    spellings: [
      { word: "མེ", spell: "མ་འགྲེང་བུ་མེ", roman: "ma dreng-bu me", audio: "མེ spelling" },
      { word: "སེ", spell: "ས་འགྲེང་བུ་སེ", roman: "sa dreng-bu se", audio: "སེ spelling" },
      { word: "ཏེ", spell: "ཏ་འགྲེང་བུ་ཏེ", roman: "ta dreng-bu te", audio: "ཏེ spelling" }
    ],
    note: "A short slanted stroke drawn above the root letter. Front, mid vowel — brighter and higher than English ‘e’ in ‘bed’." 
  },
  { 
    key: "o", tib: "ཨོ", mark: "\u0F7C", translit: "O", markTib: "ན་རོ", markTranslit: "na-ro", markGloss: "na ro", position: "above", english: "As in “more”, “door”, “orange”.", examples: ["མོ", "ཇོ", "ཤོ"], 
    spellings: [
      { word: "མོ", spell: "མ་ན་རོ་མོ", roman: "ma na-ro mo", audio: "མོ spelling" },
      { word: "ཇོ", spell: "ཇ་ན་རོ་ཇོ", roman: "ja na-ro jo", audio: "ཇོ spelling" },
      { word: "ཤོ", spell: "ཤ་ན་རོ་ཤོ", roman: "sha na-ro sho", audio: "ཤོ spelling" }
    ],
    note: "A small circle drawn above the root letter. Back, mid-rounded vowel — round the lips as in English ‘oh’." 
  },
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
  { id: "marks", eyebrow: "Step 02", title: "The four diacritic marks", description: "Names, positions, and how each mark is written." },
  { id: "pronunciation", eyebrow: "Step 03", title: "Pronouncing the four vowels", description: "Map each vowel to a familiar English sound." },
  { id: "spelling", eyebrow: "Step 04", title: "Spelling — root letter + vowel mark", description: "Combine any consonant with the four vowel marks." },
  { id: "vocab", eyebrow: "Step 05", title: "Vocabulary built from the four vowels", description: "Read and hear real words using vowels only." },
  { id: "practice", eyebrow: "Step 06", title: "Practice & exercises", description: "Flashcards, listening, matching, and tracing." },
  { id: "complete", eyebrow: "Final step", title: "Lesson complete", description: "Take the final test to unlock the next lesson." },
];

export function generateSpellingQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  
  // 1. Mark Recognition (4 questions - tests all 4 vowels)
  const vTargets = [...VOWELS].sort(() => 0.5 - Math.random());
  for (const v of vTargets) {
    const wrongs = VOWELS.filter(x => x.key !== v.key).sort(() => 0.5 - Math.random()).slice(0, 3);
    qs.push({
      type: 'base',
      questionText: `Which vowel mark is called ${v.markTib} (${v.markTranslit})?`,
      answer: v.tib,
      audioString: v.markTranslit,
      choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib }))
    });
  }

  // 2. Spelling Math (12 questions - tests every single spelling audio) - Audio Only
  const allSpellings = VOWELS.flatMap(v => v.spellings || []);
  const spellTargets = [...allSpellings].sort(() => 0.5 - Math.random());
  for (const s of spellTargets) {
    const wrongs = allSpellings.filter(x => x.word !== s.word).sort(() => 0.5 - Math.random()).slice(0, 3);
    qs.push({
      isAudioType: true,
      type: 'base',
      answer: s.word,
      audioString: s.audio || s.word,
      choices: [s, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.word, value: x.word }))
    });
  }

  return qs.sort(() => 0.5 - Math.random());
}

export function generateFinalQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
  const pickWrongs = <T,>(arr: T[], correct: T, count: number, filterFn = (x: T) => x !== correct) => shuffle(arr.filter(filterFn)).slice(0, count);

  // 1. listenWordQs (take 3)
  shuffle(VOCAB).slice(0, 3).forEach(v => {
    qs.push({
      isAudioType: true, questionText: "Listen and select the matching Tibetan word.", answer: v.tib, audioString: v.tib,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.tib, tib: x.tib }))
    });
  });

  // 2. listenMeanQs (take 2)
  shuffle(VOCAB).slice(0, 2).forEach(v => {
    qs.push({
      isAudioType: true, questionText: "Listen, then select the meaning of the word you hear.", answer: v.en, audioString: v.tib,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.en, label: x.en }))
    });
  });

  // 3. markQs (take 3)
  shuffle(VOWELS).slice(0, 3).forEach(v => {
    qs.push({
      questionText: `Which vowel is ${v.markTib} (${v.markTranslit})?`, answer: v.tib, audioString: v.translit,
      choices: shuffle([v, ...pickWrongs(VOWELS, v, 3)]).map(x => ({ value: x.tib, tib: x.tib }))
    });
  });

  // 4. nameQs (take 3)
  shuffle(VOWELS).slice(0, 3).forEach(v => {
    qs.push({
      questionText: `What is the name of the vowel mark in ${v.tib}?`, prominentTibetan: v.tib, answer: v.markTranslit, audioString: v.translit,
      choices: shuffle([v, ...pickWrongs(VOWELS, v, 3)]).map(x => ({ value: x.markTranslit, label: `${x.markTib} (${x.markTranslit})` }))
    });
  });

  // 5. positionQs (take 3)
  shuffle(VOWELS).slice(0, 3).forEach(v => {
    const answerLabel = POSITION_META[v.position as Position].label;
    const wrongs = Object.keys(POSITION_META).filter(k => k !== v.position).map(k => POSITION_META[k as Position].label);
    qs.push({
      questionText: `Where is the mark ${v.mark} of ${v.markTranslit} written?`, prominentTibetan: v.mark, answer: answerLabel, audioString: v.translit,
      choices: shuffle([answerLabel, ...wrongs]).map(x => ({ value: x, label: x }))
    });
  });

  // 6. soundQs (take 3)
  shuffle(VOWELS).slice(0, 3).forEach(v => {
    qs.push({
      questionText: `Which vowel sounds ${v.english.replace(/^As in /i, "as in ")}`, answer: v.tib, audioString: v.translit,
      choices: shuffle([v, ...pickWrongs(VOWELS, v, 3)]).map(x => ({ value: x.tib, tib: x.tib }))
    });
  });

  // 7. combineQs (take 5)
  const BASE_LETTERS = ["ཀ", "མ", "ས", "ལ", "ཆ", "པ", "ར", "ཏ"];
  const combinations = BASE_LETTERS.flatMap(base => VOWELS.map(v => ({ base, v })));
  shuffle(combinations).slice(0, 5).forEach(({ base, v }) => {
    const answerTib = base + v.mark;
    qs.push({
      questionText: `${base} + ${v.markTranslit} ${v.mark} = ?`, prominentTibetan: `${base} + ${v.mark}`, answer: answerTib, audioString: v.translit,
      choices: shuffle([v, ...pickWrongs(VOWELS, v, 3)]).map(x => ({ value: base + x.mark, tib: base + x.mark }))
    });
  });

  // 8. vocabReadQs (take 4)
  shuffle(VOCAB).slice(0, 4).forEach(v => {
    qs.push({
      questionText: `How does ${v.tib} read?`, prominentTibetan: v.tib, answer: v.translit, audioString: v.tib,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.translit, label: x.translit }))
    });
  });

  // 9. vocabMeanQs (take 4)
  shuffle(VOCAB).slice(0, 4).forEach(v => {
    qs.push({
      questionText: `What does ${v.tib} mean?`, prominentTibetan: v.tib, answer: v.en, audioString: v.tib,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.en, label: x.en }))
    });
  });

  // 10. vocabWordQs (take 3)
  shuffle(VOCAB).slice(0, 3).forEach(v => {
    qs.push({
      questionText: `Which word means "${v.en}"?`, answer: v.tib, audioString: v.tib,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.tib, tib: x.tib }))
    });
  });

  // 11. whichVowelQs (take 4)
  const nonParticleVocab = VOCAB.filter(w => !w.tib.includes("་"));
  shuffle(nonParticleVocab).slice(0, 4).forEach(w => {
    const v = VOWELS.find(x => x.key === w.vowel)!;
    qs.push({
      questionText: `Which vowel is written in ${w.tib}?`, prominentTibetan: w.tib, answer: v.markTranslit, audioString: w.tib,
      choices: shuffle([v, ...pickWrongs(VOWELS, v, 3)]).map(x => ({ value: x.markTranslit, label: `${x.mark} ${x.markTranslit}` }))
    });
  });

  // 12. ruleQs (take 3)
  const allRules = [
    { q: "A root letter written with no vowel mark carries which inherent vowel?", a: "[a]", w: ["[i]", "[u]", "no vowel at all"] },
    { q: "Which of the four vowel marks is written below the root letter?", a: "zhabs-kyu ུ", w: ["gi-gu ི", "'dreng-bu ེ", "na-ro ོ"] },
    { q: "How many vowel marks does written Tibetan use?", a: "Four", w: ["Three", "Five", "Seven"] },
    { q: "Which letter is used as the neutral carrier when a vowel stands on its own?", a: "ཨ", w: ["འ", "ཡ", "ཧ"] },
    { q: "When you spell aloud, which comes first?", a: "The root letter, then the vowel", w: ["The vowel, then the root letter", "Whichever is written higher", "The order changes"] }
  ];
  shuffle(allRules).slice(0, 3).forEach(r => {
    qs.push({
      questionText: r.q, answer: r.a,
      choices: shuffle([{ value: r.a, label: r.a }, ...r.w.map(w => ({ value: w, label: w }))])
    });
  });

  return shuffle(qs).slice(0, 40);
}