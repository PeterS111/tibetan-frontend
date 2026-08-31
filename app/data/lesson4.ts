
import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { QuizQuestion } from "@/app/components/QuizModule";

export type Tone = "same" | "up" | "down";
export type SubKey = "ya" | "ra" | "la" | "wa";

export interface Combo {
  stack: string;
  root: string;
  read: string;
  tone: Tone;
  note?: string;
}

export interface Sub {
  key: SubKey;
  head: string;
  headLarge: string;
  headLabel: string;
  mark: string;
  name: string;
  nameTib: string;
  title: string;
  count: number;
  intro: string;
  rootLetters: string;
  combos: Combo[];
  usage: string;
  accent: { hex: string; bg: string; text: string; border: string; hover: string };
}

export const TONE_META: Record<Tone, { label: string; hex: string; Icon: any; text: string; bg: string; border: string }> = {
  same: { label: "Same tone as root", hex: "#16a34a", Icon: ArrowRight, text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  up:   { label: "Higher tone",       hex: "#b91c1c", Icon: ArrowUp,    text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  down: { label: "Lower tone",        hex: "#0284c7", Icon: ArrowDown,  text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
};

export const SUBS: Sub[] = [
  {
    key: "ya",
    head: "ཡ",
    headLarge: "ཡ",
    headLabel: "ཡ་བཏགས",
    mark: "ྱ",
    name: "Ya-tak",
    nameTib: "ཡ་བཏགས་བདུན།",
    title: "The Seven Subscripts \u201cYa\u201d",
    count: 7,
    intro: "The consonant ཡ (ya) tucks beneath seven root letters. Its presence often re-shapes the sound of the root significantly — several stacks become entirely new consonants in the Lhasa accent.",
    rootLetters: "ཀ ཁ ག པ ཕ བ མ",
    usage: "Pronunciation shifts a lot with Ya-tak. In the Lhasa accent པྱ ཕྱ བྱ read as [cha] [chha] [ja], and མྱ becomes [nya] — memorise these four exceptions first.",
    accent: { hex: "#b91c1c", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", hover: "hover:bg-rose-100" },
    combos: [
      { stack: "ཀྱ", root: "ཀ", read: "kya",  tone: "same" },
      { stack: "ཁྱ", root: "ཁ", read: "khya", tone: "same" },
      { stack: "གྱ", root: "ག", read: "gya",  tone: "down" },
      { stack: "པྱ", root: "པ", read: "cha",  tone: "same", note: "Reads as [cha]" },
      { stack: "ཕྱ", root: "ཕ", read: "chha", tone: "same", note: "Reads as [chha]" },
      { stack: "བྱ", root: "བ", read: "ja",   tone: "down", note: "Reads as [ja]" },
      { stack: "མྱ", root: "མ", read: "nya",  tone: "up",   note: "Reads as [nya]" },
    ],
  },
  {
    key: "ra",
    head: "ར",
    headLarge: "ར",
    headLabel: "ར་བཏགས",
    mark: "ྲ",
    name: "Ra-tak",
    nameTib: "ར་བཏགས་བཅུ་གསུམ།",
    title: "The Thirteen Subscripts \u201cRa\u201d",
    count: 13,
    intro: "The consonant ར (ra) sits below thirteen root letters. Most stacks read as some form of [tra / thra / dra]. Some also shift tone; ཧྲ is a well-known exception that reads [shra].",
    rootLetters: "ཀ ཁ ག ཏ ཐ ད ན པ ཕ བ མ ཤ ས ཧ",
    usage: "Ka / Ta / Pa groups collapse to [tra]. Kha / Tha / Pha collapse to [thra]. Feminine roots (ga, da, ba) become voiced [dra] in a lower tone. ཧྲ is the exception — pronounced [shra].",
    accent: { hex: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", hover: "hover:bg-amber-100" },
    combos: [
      { stack: "ཀྲ", root: "ཀ", read: "tra",  tone: "same" },
      { stack: "ཁྲ", root: "ཁ", read: "thra", tone: "same" },
      { stack: "གྲ", root: "ག", read: "dra",  tone: "down" },
      { stack: "ཏྲ", root: "ཏ", read: "tra",  tone: "same" },
      { stack: "ཐྲ", root: "ཐ", read: "thra", tone: "same" },
      { stack: "དྲ", root: "ད", read: "dra",  tone: "down" },
      { stack: "པྲ", root: "པ", read: "tra",  tone: "same" },
      { stack: "ཕྲ", root: "ཕ", read: "thra", tone: "same" },
      { stack: "བྲ", root: "བ", read: "dra",  tone: "down" },
      { stack: "མྲ", root: "མ", read: "ma",   tone: "up" },
      { stack: "ཤྲ", root: "ཤ", read: "sha",  tone: "up" },
      { stack: "སྲ", root: "ས", read: "sa",   tone: "up" },
      { stack: "ཧྲ", root: "ཧ", read: "shra", tone: "up", note: "Exception — reads [shra]" },
    ],
  },
  {
    key: "la",
    head: "ལ",
    headLarge: "ལ",
    headLabel: "ལ་བཏགས",
    mark: "ླ",
    name: "La-tak",
    nameTib: "ལ་བཏགས་དྲུག།",
    title: "The Six Subscripts \u201cLa\u201d",
    count: 6,
    intro: "The consonant ལ (la) subjoins to just six root letters. Every combination is pronounced [la] in a higher tone — with one strange exception: ཟླ reads as [da] in a lower tone.",
    rootLetters: "ཀ ག བ ར ས ཟ",
    usage: "The rule is refreshingly simple: everything reads [la], high tone. Only ཟླ (za + la) breaks the pattern — it is pronounced [da] in a lower tone.",
    accent: { hex: "#7c3aed", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", hover: "hover:bg-violet-100" },
    combos: [
      { stack: "ཀླ", root: "ཀ", read: "la", tone: "up" },
      { stack: "གླ", root: "ག", read: "la", tone: "up" },
      { stack: "བླ", root: "བ", read: "la", tone: "up" },
      { stack: "རླ", root: "ར", read: "la", tone: "up" },
      { stack: "སླ", root: "ས", read: "la", tone: "up" },
      { stack: "ཟླ", root: "ཟ", read: "da", tone: "down", note: "Exception — reads [da]" },
    ],
  },
  {
    key: "wa",
    head: "ཝ",
    headLarge: "ཝ",
    headLabel: "ཝ་ཟུར",
    mark: "ྭ",
    name: "Wa-zur",
    nameTib: "ཝ་ཟུར་བཅུ་གསུམ།",
    title: "The Thirteen \u201cWa-zur\u201d",
    count: 13,
    intro: "\u201cWa-zur\u201d subjoins to thirteen root letters. Unlike the other three subscripts, it does not change either the pronunciation or the tone of the root — it exists only in the written language to distinguish words with the same sound.",
    rootLetters: "ཀ ཁ ག ཉ ད ཙ ཚ ཞ ཟ ར ལ ཤ ཧ",
    usage: "Wa-zur is silent and tone-neutral. Its whole purpose is orthographic: ར goat vs དྭ horn, ཤ hair-tip vs ཤྭ angle. Read exactly as the root letter alone.",
    accent: { hex: "#2563eb", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", hover: "hover:bg-blue-100" },
    combos: [
      { stack: "ཀྭ", root: "ཀ", read: "ka",   tone: "same" },
      { stack: "ཁྭ", root: "ཁ", read: "kha",  tone: "same" },
      { stack: "གྭ", root: "ག", read: "ga",   tone: "same" },
      { stack: "ཉྭ", root: "ཉ", read: "nya",  tone: "same" },
      { stack: "དྭ", root: "ད", read: "da",   tone: "same" },
      { stack: "ཙྭ", root: "ཙ", read: "tsa",  tone: "same" },
      { stack: "ཚྭ", root: "ཚ", read: "tsha", tone: "same" },
      { stack: "ཞྭ", root: "ཞ", read: "zha",  tone: "same" },
      { stack: "ཟྭ", root: "ཟ", read: "za",   tone: "same" },
      { stack: "རྭ", root: "ར", read: "ra",   tone: "same" },
      { stack: "ལྭ", root: "ལ", read: "la",   tone: "same" },
      { stack: "ཤྭ", root: "ཤ", read: "sha",  tone: "same" },
      { stack: "ཧྭ", root: "ཧ", read: "ha",   tone: "same" },
    ],
  },
];

export type VocabGroup = SubKey | "triple";

export interface Vocab {
  tib: string;
  translit: string;
  en: string;
  emoji: string;
  sub: VocabGroup;
}

export const VOCAB: Vocab[] = [
  { tib: "ཁྱོ་ག",  translit: "khyo-ga", en: "husband",                emoji: "🤵", sub: "ya" },
  { tib: "ཁྱི",    translit: "khyi",    en: "dog",                    emoji: "🐕", sub: "ya" },
  { tib: "བྱེ་མ",  translit: "bye-ma",  en: "sand",                   emoji: "🏖️", sub: "ya" },
  { tib: "མྱེ",    translit: "mye",     en: "fire",                   emoji: "🔥", sub: "ya" },
  { tib: "མྱི",    translit: "mi",      en: "people, person",         emoji: "👥", sub: "ya" },
  { tib: "བྱ་བ",   translit: "bya-wa",  en: "task, work",             emoji: "📋", sub: "ya" },
  { tib: "བྱི་བ",  translit: "byi-wa",  en: "rat, mouse",             emoji: "🐭", sub: "ya" },
  { tib: "ཁྱུ",    translit: "khyu",    en: "herd",                   emoji: "🐂", sub: "ya" },
  { tib: "ཁྲི",    translit: "khri",    en: "throne",                 emoji: "🪑", sub: "ra" },
  { tib: "དྲ་བ",   translit: "dra-wa",  en: "net",                    emoji: "🕸️", sub: "ra" },
  { tib: "ཁྲིའུ",  translit: "khri'u",  en: "little throne",          emoji: "👑", sub: "ra" },
  { tib: "བྲོ་བ",  translit: "dro-wa",  en: "taste, flavour",         emoji: "👅", sub: "ra" },
  { tib: "གྲི",    translit: "dri",     en: "knife",                  emoji: "🔪", sub: "ra" },
  { tib: "གྲོ",    translit: "dro",     en: "wheat",                  emoji: "🌾", sub: "ra" },
  { tib: "སྲུ་མོ", translit: "su-mo",   en: "aunts",                  emoji: "👩‍👩‍👧", sub: "ra" },
  { tib: "ཁྲོ་བ",  translit: "thro-wa", en: "anger",                  emoji: "😠", sub: "ra" },
  { tib: "གློ་བ",  translit: "lo-wa",   en: "lungs",                  emoji: "🫁", sub: "la" },
  { tib: "ཟླ་བ",   translit: "da-wa",   en: "moon; month",            emoji: "🌙", sub: "la" },
  { tib: "བླ་མ",   translit: "la-ma",   en: "lama, teacher",          emoji: "🧘", sub: "la" },
  { tib: "གླུ",    translit: "lu",      en: "song",                   emoji: "🎵", sub: "la" },
  { tib: "ཀླ་ཀློ", translit: "kla-klo", en: "barbarian",              emoji: "🧌", sub: "la" },
  { tib: "ཀླུ",    translit: "lu",      en: "nāga / serpent spirit",  emoji: "🐍", sub: "la" },
  { tib: "ཟླ་བོ", translit: "lo-bo",   en: "friend, sweetheart",     emoji: "👫", sub: "la" },
  { tib: "སླ་པོ", translit: "lo-po",   en: "easy",                   emoji: "👌", sub: "la" },
  { tib: "ཁྭ་ཏ",   translit: "khwa-ta", en: "crow, raven",            emoji: "🐦‍⬛", sub: "wa" },
  { tib: "རྩྭ",    translit: "tswa",    en: "grass",                  emoji: "🌱", sub: "wa" },
  { tib: "ཤྭ་བ",   translit: "shwa-wa", en: "deer",                   emoji: "🦌", sub: "wa" },
  { tib: "གྭ་པ",   translit: "gwa-pa",  en: "cow",                    emoji: "🐄", sub: "wa" },
  { tib: "ཞྭ་མོ",  translit: "zhwa-mo", en: "hat",                    emoji: "🎩", sub: "wa" },
  { tib: "ཚྭ",     translit: "tshwa",   en: "salt",                   emoji: "🧂", sub: "wa" },
  { tib: "གྲྭ",     translit: "drwa",    en: "hair tip",               emoji: "💇", sub: "wa" },
  { tib: "རྭ་ཅོ",  translit: "rwa-co",  en: "horns",                  emoji: "🐐", sub: "wa" },
  { tib: "སྐྱ་ཀ",  translit: "kya-ka",  en: "magpie",                 emoji: "🐦", sub: "triple" },
  { tib: "རྒྱུ་མ", translit: "gyu-ma",  en: "intestines",             emoji: "🌭", sub: "triple" },
  { tib: "སྦྲ",    translit: "dra",     en: "black yak-hair tent",    emoji: "⛺", sub: "triple" },
  { tib: "རྒྱ་མ",  translit: "gya-ma",  en: "scales, balance",        emoji: "⚖️", sub: "triple" },
  { tib: "སྐྲ",    translit: "tra",     en: "hair (of the head)",     emoji: "💇‍♀️", sub: "triple" },
  { tib: "རྒྱ་མི", translit: "gya-mi",  en: "Chinese person",         emoji: "🇨🇳", sub: "triple" },
  { tib: "སྐྱ་སྐྱ", translit: "kya-kya", en: "grey, pale",             emoji: "🌫️", sub: "triple" },
  { tib: "སྒྲ",    translit: "dra",     en: "sound",                  emoji: "🔊", sub: "triple" },
];

export interface Stack3 {
  stack: string;
  parts: string;
  read: string;
  tone: Tone;
}

export const TRIPLE_STACKS: Stack3[] = [
  { stack: "རྐྱ", parts: "ར + ཀ + ཡ", read: "kya",  tone: "same" },
  { stack: "སྐྱ", parts: "ས + ཀ + ཡ", read: "kya",  tone: "same" },
  { stack: "རྒྱ", parts: "ར + ག + ཡ", read: "gya",  tone: "down" },
  { stack: "སྒྱ", parts: "ས + ག + ཡ", read: "gya",  tone: "down" },
  { stack: "སྤྱ", parts: "ས + པ + ཡ", read: "cha",  tone: "same" },
  { stack: "སྦྱ", parts: "ས + བ + ཡ", read: "ja",   tone: "down" },
  { stack: "རྨྱ", parts: "ར + མ + ཡ", read: "nya",  tone: "up" },
  { stack: "སྨྱ", parts: "ས + མ + ཡ", read: "nya",  tone: "up" },
  { stack: "སྐྲ", parts: "ས + ཀ + ར", read: "tra",  tone: "same" },
  { stack: "སྒྲ", parts: "ས + ག + ར", read: "dra",  tone: "down" },
  { stack: "སྣྲ", parts: "ས + ན + ར", read: "na",   tone: "same" },
  { stack: "སྤྲ", parts: "ས + པ + ར", read: "tra",  tone: "same" },
  { stack: "སྦྲ", parts: "ས + བ + ར", read: "dra",  tone: "down" },
  { stack: "སྨྲ", parts: "ས + མ + ར", read: "ma",   tone: "up" },
];

export const TRIPLE_ACCENT = "#0f766e";


export const STEPS = [
  { id: "intro", eyebrow: "Step 01", title: "What is a subscript?", desc: "The four subjoined letters and how they attach." },
  { id: "family", eyebrow: "Step 02", title: "Meet the four subscripts", desc: "Study each subscript with its root combinations." },
  { id: "super-sub", eyebrow: "Step 03", title: "Roots with a superscript and subscript", desc: "Three-letter stacks combining both." },
  { id: "vocab", eyebrow: "Step 04", title: "Vocabulary built from subscripts", desc: "Real words using subjoined letters." },
  { id: "practice", eyebrow: "Step 05", title: "Practice & exercises", desc: "Flashcards, quiz, and matching drills." },
  { id: "cumulative", eyebrow: "Final step", title: "Lesson complete", desc: "Take the final test to unlock the next lesson." }
];


export function generateVocabQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  for (const v of VOCAB) {
    // 🚨 BUG FIX: Filter out homophones so there are no duplicate readings/translations
    const pool = VOCAB.filter(x => x.tib !== v.tib && x.translit !== v.translit && x.en !== v.en).sort(() => 0.5 - Math.random());
    const wrongs: Vocab[] = [];
    const seenTranslit = new Set<string>([v.translit]);
    for (const candidate of pool) {
      if (!seenTranslit.has(candidate.translit)) {
        seenTranslit.add(candidate.translit);
        wrongs.push(candidate);
        if (wrongs.length === 3) break;
      }
    }
    const choices = [v, ...wrongs].sort(() => 0.5 - Math.random()).map(x => ({ tib: x.tib, value: x.tib, emoji: x.emoji, en: x.en }));
    
    if (Math.random() > 0.5) {
      qs.push({
        isAudioType: true, type: 'base', questionText: "Listen and select the matching option.",
        answer: v.tib, audioString: v.tib, answerObj: v, choices
      });
    } else {
      qs.push({
        isAudioType: false, type: 'vocab', questionText: `Which word means "${v.en}"?`,
        answer: v.tib, audioString: v.tib, answerObj: v, choices
      });
    }
  }
  return qs.sort(() => 0.5 - Math.random());
}

export function generateFinalQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
  
  // 🚨 BUG FIX: Use a Set to ensure all generated wrong options are completely unique
  const pickWrongs = <T,>(arr: T[], correct: T, count: number) => shuffle(Array.from(new Set(arr)).filter((x) => x !== correct)).slice(0, count);

  const ALL_COMBOS = SUBS.flatMap(s => s.combos.map(c => ({ ...c, subKey: s.key, subName: s.name, mark: s.mark })));
  const EXCEPTIONS = ALL_COMBOS.filter(c => !!c.note);

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
  shuffle(ALL_COMBOS).slice(0, 4).forEach(c => {
    qs.push({
      questionText: `How does ${c.stack} read?`, prominentTibetan: c.stack, answer: c.read, audioString: c.stack,
      choices: shuffle([c.read, ...pickWrongs(ALL_COMBOS.map(x => x.read), c.read, 3)]).map(x => ({ value: x, label: `[${x}]` }))
    });
  });

  // 4. whichSubQs (take 3)
  shuffle(ALL_COMBOS).slice(0, 3).forEach(c => {
    qs.push({
      questionText: `Which subscript is tucked under ${c.stack}?`, prominentTibetan: c.stack, answer: c.subName, audioString: c.stack,
      choices: shuffle([c.subName, ...pickWrongs(SUBS.map(s => s.name), c.subName, 2)]).map(x => ({ value: x, label: x }))
    });
  });

  // 5. rootQs (take 3)
  shuffle(ALL_COMBOS).slice(0, 3).forEach(c => {
    qs.push({
      questionText: `Which root letter carries the subscript in ${c.stack}?`, prominentTibetan: c.stack, answer: c.root, audioString: c.stack,
      choices: shuffle([c.root, ...pickWrongs(ALL_COMBOS.map(x => x.root), c.root, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // 6. toneQs (take 4)
  shuffle(ALL_COMBOS).slice(0, 4).forEach(c => {
    const answerLabel = TONE_META[c.tone as Tone].label;
    const wrongs = Object.keys(TONE_META).filter(k => k !== c.tone).map(k => TONE_META[k as Tone].label);
    qs.push({
      questionText: `What tone does ${c.stack} take?`, prominentTibetan: c.stack, answer: answerLabel, audioString: c.stack,
      choices: shuffle([answerLabel, ...wrongs]).map(x => ({ value: x, label: x }))
    });
  });

  // 7. buildQs (take 3)
  shuffle(ALL_COMBOS).slice(0, 3).forEach(c => {
    qs.push({
      questionText: `${c.root} with ${c.subName} gives which stack?`, answer: c.stack,
      choices: shuffle([c.stack, ...pickWrongs(ALL_COMBOS.map(x => x.stack), c.stack, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // 8. exceptionQs (take 3)
  shuffle(EXCEPTIONS).slice(0, 3).forEach(c => {
    qs.push({
      questionText: `In the Lhasa accent, ${c.stack} is an exception. How is it pronounced?`, prominentTibetan: c.stack, answer: c.read, audioString: c.stack,
      choices: shuffle([c.read, ...pickWrongs(ALL_COMBOS.map(x => x.read), c.read, 3)]).map(x => ({ value: x, label: `[${x}]` }))
    });
  });

  // 9. tripleReadQs (take 3)
  shuffle(TRIPLE_STACKS).slice(0, 3).forEach(t => {
    qs.push({
      questionText: `How does the combined stack ${t.stack} read?`, prominentTibetan: t.stack, answer: t.read, audioString: t.stack,
      choices: shuffle([t.read, ...pickWrongs(TRIPLE_STACKS.map(x => x.read), t.read, 3)]).map(x => ({ value: x, label: `[${x}]` }))
    });
  });

  // 10. tripleParsQs (take 2)
  shuffle(TRIPLE_STACKS).slice(0, 2).forEach(t => {
    qs.push({
      questionText: `Which letters build the stack ${t.stack}?`, prominentTibetan: t.stack, answer: t.parts, audioString: t.stack,
      choices: shuffle([t.parts, ...pickWrongs(TRIPLE_STACKS.map(x => x.parts), t.parts, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 11. oddQs (take 2)
  shuffle(SUBS).slice(0, 2).forEach(sup => {
    const members = ALL_COMBOS.filter(c => c.subKey === sup.key);
    const oddOne = shuffle(ALL_COMBOS.filter(c => c.subKey !== sup.key))[0];
    qs.push({
      questionText: `Which stack does NOT use the subscript ${sup.name}?`, answer: oddOne.stack,
      choices: shuffle([...shuffle(members).slice(0, 3).map(m => m.stack), oddOne.stack]).map(x => ({ value: x, tib: x }))
    });
  });

  // 12. vocabReadQs (take 3)
  shuffle(VOCAB).slice(0, 3).forEach(v => {
    qs.push({
      questionText: `How does ${v.tib} read?`, prominentTibetan: v.tib, answer: v.translit, audioString: v.tib,
      choices: shuffle([v.translit, ...pickWrongs(VOCAB.map(x => x.translit), v.translit, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 13. vocabMeanQs (take 4)
  shuffle(VOCAB).slice(0, 4).forEach(v => {
    qs.push({
      questionText: `What does ${v.tib} mean?`, prominentTibetan: v.tib, answer: v.en, audioString: v.tib,
      choices: shuffle([v.en, ...pickWrongs(VOCAB.map(x => x.en), v.en, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 14. vocabWordQs (take 2)
  shuffle(VOCAB).slice(0, 2).forEach(v => {
    qs.push({
      questionText: `Which word means "${v.en}"?`, answer: v.tib, audioString: v.tib,
      choices: shuffle([v.tib, ...pickWrongs(VOCAB.map(x => x.tib), v.tib, 3)]).map(x => ({ value: x, tib: x })) 
    });
  });

  // 15. vocabSubQs (take 2)
  const subVocabs = VOCAB.filter(v => ["ya", "ra", "la", "wa"].includes(v.sub));
  shuffle(subVocabs).slice(0, 2).forEach(v => {
    const subName = SUBS.find(s => s.key === v.sub)?.name || v.sub;
    qs.push({
      questionText: `Which subscript appears in ${v.tib}?`, prominentTibetan: v.tib, answer: subName, audioString: v.tib,
      choices: shuffle([subName, ...pickWrongs(SUBS.map(s => s.name), subName, 2)]).map(x => ({ value: x, label: x }))
    });
  });

  // 16. ruleQs (take 3)
  const allRules = [
    { q: "Where is a subscript written?", a: "Beneath the root letter", w: ["Above the root letter", "Before the root letter", "After the syllable marker"] },
    { q: "Which four letters can be subscripts?", a: "ཡ ར ལ ཝ", w: ["ར ལ ས ཝ", "ཡ ར ལ ས", "ག ད བ མ"] },
    { q: "What does Wa-zur do to the sound of the root letter?", a: "Nothing — it is silent and only marks the spelling", w: ["It adds a [w] sound after the root", "It always raises the tone", "It replaces the root consonant"] },
    { q: "How do the La-tak stacks such as ཟླ and བླ read?", a: "As [la] — the root letter is not pronounced", w: ["As [za] and [ba] — the ལ is silent", "Both consonants are pronounced in sequence", "As [lha] with a breathy start"] },
    { q: "How many root letters take Ya-tak?", a: "7", w: ["4", "6", "12"] },
    { q: "In a three-part stack, what is the correct top-to-bottom order?", a: "Superscript, root letter, subscript", w: ["Root letter, superscript, subscript", "Subscript, root letter, superscript", "Superscript, subscript, root letter"] }
  ];
  shuffle(allRules).slice(0, 3).forEach(r => {
    qs.push({
      questionText: r.q, answer: r.a,
      choices: shuffle([{ value: r.a, label: r.a }, ...r.w.map(w => ({ value: w, label: w }))])
    });
  });

  return shuffle(qs).slice(0, 40);
}