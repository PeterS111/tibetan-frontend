// app/data/lesson3.ts
import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { QuizQuestion } from "@/app/components/QuizModule";

export type Tone = "same" | "up" | "down";
export type SuperKey = "ra" | "la" | "sa";

export interface Combo {
  stack: string;
  root: string;
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
    intro: "The consonant ར (ra) sits above twelve root letters. When it does, it is no longer pronounced on its own \u2014 instead it re-tunes the tone of the letter beneath.",
    rootLetters: "ཀ ག ང ཇ ཉ ཏ ད ན བ མ ཙ ཛ",
    accent: { hex: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", hover: "hover:bg-amber-100" },
    combos: [
      { stack: "རྐ", root: "ཀ", read: "ka",  tone: "same" }, { stack: "རྒ", root: "ག", read: "ga",  tone: "down" },
      { stack: "རྔ", root: "ང", read: "nga", tone: "up"   }, { stack: "རྗ", root: "ཇ", read: "ja",  tone: "down" },
      { stack: "རྙ", root: "ཉ", read: "nya", tone: "up"   }, { stack: "རྟ", root: "ཏ", read: "ta",  tone: "same" },
      { stack: "རྡ", root: "ད", read: "da",  tone: "down" }, { stack: "རྣ", root: "ན", read: "na",  tone: "up"   },
      { stack: "རྦ", root: "བ", read: "ba",  tone: "down" }, { stack: "རྨ", root: "མ", read: "ma",  tone: "up"   },
      { stack: "རྩ", root: "ཙ", read: "tsa", tone: "same" }, { stack: "རྫ", root: "ཛ", read: "dza", tone: "down" },
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
    intro: "The consonant ལ (la) serves as a superscript for ten root letters. As with Ra-go, its role is silent \u2014 it shifts the tone of the letter it caps.",
    rootLetters: "ཀ ག ང ཅ ཇ ཏ ད པ བ ཧ",
    accent: { hex: "#f97316", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", hover: "hover:bg-orange-100" },
    combos: [
      { stack: "ལྐ", root: "ཀ", read: "ka",  tone: "same" }, { stack: "ལྒ", root: "ག", read: "ga",  tone: "down" },
      { stack: "ལྔ", root: "ང", read: "nga", tone: "up"   }, { stack: "ལྕ", root: "ཅ", read: "ca",  tone: "same" },
      { stack: "ལྗ", root: "ཇ", read: "ja",  tone: "down" }, { stack: "ལྟ", root: "ཏ", read: "ta",  tone: "same" },
      { stack: "ལྡ", root: "ད", read: "da",  tone: "down" }, { stack: "ལྤ", root: "པ", read: "pa",  tone: "up"   },
      { stack: "ལྦ", root: "བ", read: "ba",  tone: "down" }, { stack: "ལྷ", root: "ཧ", read: "lha", tone: "up"   },
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
    intro: "The consonant ས (sa) sits above eleven root letters. Sa-go stacks are common in everyday vocabulary \u2014 nose, saddle, wheat, body \u2014 so they reward memorising early.",
    rootLetters: "ཀ ག ང ཉ ཏ ད ན པ བ མ ཙ",
    accent: { hex: "#0ea5e9", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", hover: "hover:bg-sky-100" },
    combos: [
      { stack: "སྐ", root: "ཀ", read: "ka",  tone: "same" }, { stack: "སྒ", root: "ག", read: "ga",  tone: "down" },
      { stack: "སྔ", root: "ང", read: "nga", tone: "up"   }, { stack: "སྙ", root: "ཉ", read: "nya", tone: "up"   },
      { stack: "སྟ", root: "ཏ", read: "ta",  tone: "same" }, { stack: "སྡ", root: "ད", read: "da",  tone: "down" },
      { stack: "སྣ", root: "ན", read: "na",  tone: "up"   }, { stack: "སྤ", root: "པ", read: "pa",  tone: "same" },
      { stack: "སྦ", root: "བ", read: "ba",  tone: "down" }, { stack: "སྨ", root: "མ", read: "ma",  tone: "up"   },
      { stack: "སྩ", root: "ཙ", read: "tsa", tone: "same" },
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
  { tib: "རྫ་ཆུ", translit: "dza-chu", en: "mountain river", emoji: "🏞️", sup: "ra" },
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
  { tib: "སྙེ་མ", translit: "nye-ma", en: "ear of grain", emoji: "🌾", sup: "sa" },
  { tib: "སྣ", translit: "na", en: "nose", emoji: "👃", sup: "sa" },
  { tib: "སྐྲ", translit: "tra", en: "hair", emoji: "💇", sup: "sa" },
  { tib: "སྟ་རེ", translit: "ta-re", en: "axe", emoji: "🪓", sup: "sa" },
  { tib: "སྐུ", translit: "ku", en: "body", emoji: "🧍", sup: "sa" },
  { tib: "སྤུ", translit: "pu", en: "body hair", emoji: "🧑‍🦱", sup: "sa" },
  { tib: "སྔ་མོ", translit: "nga-mo", en: "early", emoji: "🌅", sup: "sa" },
  { tib: "སྐེ", translit: "ke", en: "neck", emoji: "🦒", sup: "sa" },
];

export const STEPS = [
  { id: "intro", eyebrow: "Step 01", title: "What is a superscript?", desc: "How superscripts stack over a root letter." },
  { id: "family", eyebrow: "Step 02", title: "Meet the three superscripts", desc: "Study each superscript with its root combinations." },
  { id: "vocab", eyebrow: "Step 03", title: "Vocabulary built from superscripts", desc: "Real words using stacked letters." },
  { id: "practice", eyebrow: "Step 04", title: "Practice & exercises", desc: "Flashcards, quiz, and matching drills." },
  { id: "complete", eyebrow: "Final step", title: "Lesson complete", desc: "Take the final test to unlock the next lesson." }
];

export function generateSuperscriptQuiz(supKey: SuperKey): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
  
  const superObj = SUPERS.find(s => s.key === supKey)!;
  const combos = superObj.combos;

  combos.forEach(c => {
    const wrongsListen = shuffle(combos.filter(x => x.stack !== c.stack)).slice(0, 3);
    qs.push({
      isAudioType: true,
      type: 'base',
      questionText: "Listen and select the matching stack.",
      answer: c.stack,
      audioString: `${c.stack} spelling`, // API pulls e.g. "Step 2 Rago_ ka spelling.wav"
      audioTarget: c.stack,               // Result confirmation uses short sound
      choices: shuffle([c, ...wrongsListen]).map(x => ({ tib: x.stack, value: x.stack }))
    });

    const wrongsRead = shuffle(combos.filter(x => x.read !== c.read)).slice(0, 3);
    qs.push({
      type: 'base',
      questionText: `What does this stack read?`,
      prominentTibetan: c.stack,
      answer: c.read,
      audioString: c.stack,
      choices: shuffle([c, ...wrongsRead]).map(x => ({ value: x.read, label: `[${x.read}]` }))
    });
  });

  return shuffle(qs).slice(0, 12); 
}

export function generateVocabQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  for (const v of VOCAB) {
    const isAudioType = Math.random() > 0.5;
    const wrongs = VOCAB.filter(x => x.tib !== v.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
    qs.push({
      isAudioType,
      type: isAudioType ? 'base' : 'vocab',
      answer: v.tib,
      audioString: v.tib,
      answerObj: v,
      choices: [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji, en: x.en }))
    });
  }
  return qs.sort(() => 0.5 - Math.random());
}

export function generateFinalQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
  const pickWrongs = <T,>(arr: T[], correct: T, count: number, filterFn = (x: T) => x !== correct) => shuffle(arr.filter(filterFn)).slice(0, count);

  const ALL_COMBOS = SUPERS.flatMap(s => s.combos.map(c => ({ ...c, supKey: s.key, head: s.head, headLabel: s.headLabel, name: s.name })));

  // Listen -> Word
  shuffle(VOCAB).slice(0, 3).forEach(v => {
    qs.push({
      isAudioType: true, questionText: "Listen and select the matching Tibetan word.", answer: v.tib, audioString: v.tib, audioTarget: v.tib,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.tib, tib: x.tib })) 
    });
  });

  // Listen -> Meaning
  shuffle(VOCAB).slice(0, 2).forEach(v => {
    qs.push({
      isAudioType: true, questionText: "Listen, then select the meaning of the word you hear.", answer: v.en, audioString: v.tib, audioTarget: v.en,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.en, label: x.en }))
    });
  });

  // Read -> Roman
  shuffle(ALL_COMBOS).slice(0, 4).forEach(c => {
    qs.push({
      questionText: `How does ${c.stack} read?`, prominentTibetan: c.stack, answer: c.read, audioString: c.stack, audioTarget: c.read,
      choices: shuffle([c, ...pickWrongs(ALL_COMBOS, c, 3, x => x.read !== c.read)]).map(x => ({ value: x.read, label: `[${x.read}]` }))
    });
  });

  // Identify Head Letter
  shuffle(ALL_COMBOS).slice(0, 3).forEach(c => {
    qs.push({
      questionText: `Which superscript heads the stack ${c.stack}?`, prominentTibetan: c.stack, answer: c.name, audioString: c.stack, audioTarget: c.name,
      choices: shuffle([c.name, ...pickWrongs(SUPERS.map(s => s.name), c.name, 2)]).map(x => ({ value: x, label: x }))
    });
  });

  // Identify Tone Change
  shuffle(ALL_COMBOS).slice(0, 5).forEach(c => {
    const answerLabel = TONE_META[c.tone as Tone].label;
    const wrongs = Object.keys(TONE_META).filter(k => k !== c.tone).map(k => TONE_META[k as Tone].label);
    qs.push({
      questionText: `What happens to the tone of the root letter in ${c.stack}?`, prominentTibetan: c.stack, answer: answerLabel, audioString: c.stack, audioTarget: answerLabel,
      choices: shuffle([answerLabel, ...wrongs]).map(x => ({ value: x, label: x }))
    });
  });

  // Identify Root Letter
  shuffle(ALL_COMBOS).slice(0, 4).forEach(c => {
    qs.push({
      questionText: `Which root letter sits beneath the superscript in ${c.stack}?`, prominentTibetan: c.stack, answer: c.root, audioString: c.stack, audioTarget: c.root,
      choices: shuffle([c.root, ...pickWrongs(ALL_COMBOS.map(x => x.root), c.root, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // Identify Outlier
  shuffle(SUPERS).slice(0, 2).forEach(sup => {
    const members = ALL_COMBOS.filter(c => c.supKey === sup.key);
    const oddOne = shuffle(ALL_COMBOS.filter(c => c.supKey !== sup.key))[0];
    qs.push({
      questionText: `Which stack does NOT use the superscript ${sup.name}?`, answer: oddOne.stack, audioTarget: oddOne.stack,
      choices: shuffle([...shuffle(members).slice(0, 3), oddOne]).map(x => ({ value: x.stack, tib: x.stack }))
    });
  });

  // Vocab -> Meaning
  shuffle(VOCAB).slice(0, 4).forEach(v => {
    qs.push({
      questionText: `What does ${v.tib} mean?`, prominentTibetan: v.tib, answer: v.en, audioString: v.tib, audioTarget: v.en,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.en, label: x.en }))
    });
  });

  // Meaning -> Vocab
  shuffle(VOCAB).slice(0, 2).forEach(v => {
    qs.push({
      questionText: `Which word means "${v.en}"?`, answer: v.tib, audioString: v.tib, audioTarget: v.tib,
      choices: shuffle([v, ...pickWrongs(VOCAB, v, 3)]).map(x => ({ value: x.tib, tib: x.tib })) 
    });
  });

  // Rules - ADDED noAudio: true and specific audioTarget
  const allRules = [
    { q: "How is a superscript letter pronounced?", a: "It is silent — it only re-tunes the tone", w: ["It replaces the root letter’s sound", "It doubles the length of the vowel", "It is pronounced before the root letter"], noAudio: true },
    { q: "Which three letters can act as superscripts?", a: "ར ལ ས", w: ["ག ད བ", "ཡ ར ལ", "མ འ ས"], noAudio: true },
    { q: "How many root letters take the superscript ར (Ra-go)?", a: "12", w: ["10", "11", "13"], noAudio: true },
    { q: "How many root letters take the superscript ལ (La-go)?", a: "10", w: ["6", "11", "12"], noAudio: true },
    { q: "How many root letters take the superscript ས (Sa-go)?", a: "11", w: ["9", "10", "13"], noAudio: true },
    { q: "How is ལྷ pronounced?", a: "[lha] — a high-tone breathy ‘l’", w: ["[la] — low tone", "[ha] — the ལ is dropped", "[hla] — the ཧ comes first"], audioTarget: "ལྷ" },
    { q: "Where is the superscript written?", a: "Above the root letter", w: ["Below the root letter", "Before it on the line", "After it on the line"], noAudio: true }
  ];
  shuffle(allRules).slice(0, 3).forEach(r => {
    qs.push({
      questionText: r.q, answer: r.a, noAudio: r.noAudio, audioTarget: r.audioTarget,
      choices: shuffle([{ value: r.a, label: r.a }, ...r.w.map(w => ({ value: w, label: w }))])
    });
  });

  return shuffle(qs).slice(0, 40);
}