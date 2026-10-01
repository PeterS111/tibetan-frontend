// app/data/lesson5.ts
import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { QuizQuestion } from "@/app/components/QuizModule";

export type Tone = "same" | "up" | "down";
export type PrefixKey = "ga" | "da" | "ba" | "ma" | "a";

export interface Combo {
  word: string;
  parts: string;
  read: string;
  gloss?: string;
  tone: Tone;
  note?: string;
}

export interface Prefix {
  key: PrefixKey;
  head: string;
  latin: string;
  nameTib: string;
  title: string;
  count: string;
  intro: string;
  followedBy: string;
  usage: string;
  combos: Combo[];
  accent: { hex: string };
  family: "silent" | "nasal";
}

export const TONE_META: Record<Tone, { label: string; hex: string; Icon: any; text: string; bg: string; border: string }> = {
  same: { label: "Tone unchanged", hex: "#16a34a", Icon: ArrowRight, text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  up:   { label: "Higher / nasal", hex: "#b91c1c", Icon: ArrowUp,    text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  down: { label: "Deeper tone",    hex: "#0284c7", Icon: ArrowDown,  text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
};

export const PREFIXES: Prefix[] = [
  {
    key: "ga", head: "ག", latin: "ga", nameTib: "ག་སྔོན་འཇུག", title: "The Prefix ག", count: "10 roots",
    intro: "Prefix ག sits before ten root letters, mostly of the ca, ta, tsa and sha families. It never changes masculine sounds; with feminine roots it deepens the tone; with the letter ཡ it produces a high [yo].",
    followedBy: "ཅ ཉ ཏ ད ན ཙ ཞ ཟ ཡ ཤ ས", usage: "Silent in speech. Written-only role for most masculine roots — same sound, same tone. Deepens ད, ཞ, ཟ; raises ཡ to a high tone.", accent: { hex: "#b45309" }, family: "silent",
    combos: [
      { word: "གཙོ་", parts: "ག + ཙ + ོ", read: "tso", gloss: "chief, main", tone: "same" },
      { word: "གཡོ་", parts: "ག + ཡ + ོ", read: "yo", gloss: "sway, motion", tone: "up", note: "ག + ཡ → high [yo]" },
      { word: "གཡུ་", parts: "ག + ཡ + ུ", read: "yu", gloss: "turquoise", tone: "up", note: "ག + ཡ → high tone" },
      { word: "གཞི་", parts: "ག + ཞ + ི", read: "zhi", gloss: "basis, ground", tone: "down" },
      { word: "གཞུ་", parts: "ག + ཞ + ུ", read: "zhu", gloss: "bow", tone: "down" },
      { word: "གཟུ་", parts: "ག + ཟ + ུ", read: "zu", gloss: "upright, impartial", tone: "down" },
      { word: "གསོ་", parts: "ག + ས + ོ", read: "so", gloss: "to heal, nurture", tone: "same" },
    ],
  },
  {
    key: "da", head: "ད", latin: "da", nameTib: "ད་སྔོན་འཇུག", title: "The Prefix ད", count: "5 roots",
    intro: "Prefix ད precedes ཀ ག ང པ བ མ — five letters after excluding ba's own group. With the very-feminine ང it produces a nasal high tone. With root བ, the whole syllable becomes [wa] in a high tone.",
    followedBy: "ཀ ག ང པ བ མ", usage: "Deepens ག; raises ང to a nasal high tone. The stack ད + བ is the classical way to write the [wa] syllable — always high tone.", accent: { hex: "#7c3aed" }, family: "silent",
    combos: [
      { word: "དགེ་", parts: "ད + ག + ེ", read: "ge", gloss: "virtue", tone: "down" },
      { word: "དབུ་", parts: "ད + བ + ུ", read: "wu", gloss: "head (H)", tone: "up", note: "ད + བ → [wa] family" },
      { word: "དབྱེ་", parts: "ད + བ + ྱ + ེ", read: "ye", gloss: "to divide", tone: "up" },
      { word: "དབྲ་", parts: "ད + བ + ྲ", read: "dra", gloss: "Tibetan lineage", tone: "up" },
      { word: "དཔེ་", parts: "ད + པ + ེ", read: "pe", gloss: "example, model", tone: "same" },
    ],
  },
  {
    key: "ba", head: "བ", latin: "ba", nameTib: "བ་སྔོན་འཇུག", title: "The Prefix བ", count: "14 roots",
    intro: "Prefix བ can precede fourteen root letters spanning several families. It is silent in speech, but on the page distinguishes verbs of different tense.",
    followedBy: "ཀ ག ཅ ཇ ཏ ད ན ཙ ཛ ཞ ཟ ཉ ཤ ས", usage: "No pronunciation change for masculine roots. Feminine ག ཇ ད ཞ ཟ deepen; the shift is often subtle in Lhasa speech but decisive in spelling.", accent: { hex: "#0f766e" }, family: "silent",
    combos: [
      { word: "བཀྲ་", parts: "བ + ཀ + ྲ", read: "tra", gloss: "auspicious", tone: "same" },
      { word: "བགོ་", parts: "བ + ག + ོ", read: "go", gloss: "to wear", tone: "down" },
      { word: "བཅུ་", parts: "བ + ཅ + ུ", read: "chu", gloss: "ten", tone: "same" },
      { word: "བདེ་", parts: "བ + ད + ེ", read: "de", gloss: "at ease", tone: "down" },
      { word: "བཞི་", parts: "བ + ཞ + ི", read: "zhi", gloss: "four", tone: "down" },
      { word: "བཟོ་", parts: "བ + ཟ + ོ", read: "zo", gloss: "to make, craft", tone: "down" },
    ],
  },
  {
    key: "ma", head: "མ", latin: "ma", nameTib: "མ་སྔོན་འཇུག", title: "The Prefix མ", count: "6 roots",
    intro: "Prefix མ turns the root letter into a nasalized sound. It attaches to six letters — mostly of the ka, ca, ta, tsa families — creating recognisable [m’-] onsets in speech.",
    followedBy: "ཁ ག ང ཆ ཇ ཉ ཐ ད ན ཚ ཛ", usage: "Nasalises the root. Feminine roots take a lower nasal tone (ma + go → [m'go]); very-feminine roots take a higher nasal tone (ma + no → [m'no]).", accent: { hex: "#b91c1c" }, family: "nasal",
    combos: [
      { word: "མཁོ་", parts: "མ + ཁ + ོ", read: "m'kho", gloss: "needed", tone: "up", note: "nasalized" },
      { word: "མགོ་", parts: "མ + ག + ོ", read: "m'go", gloss: "head", tone: "down", note: "nasalized" },
      { word: "མཐོ་", parts: "མ + ཐ + ོ", read: "m'tho", gloss: "high, tall", tone: "up" },
      { word: "མནོ་", parts: "མ + ན + ོ", read: "m'no", gloss: "to think", tone: "up" },
      { word: "མཚོ་", parts: "མ + ཚ + ོ", read: "m'tsho", gloss: "lake", tone: "up" },
    ],
  },
  {
    key: "a", head: "འ", latin: "'a", nameTib: "འ་སྔོན་འཇུག", title: "The Prefix འ", count: "10 roots",
    intro: "Prefix འ (‘a-chung) attaches to ten root letters. Like མ, it produces a nasal onset — commonly transcribed as [ng’-]. Very common in verbs and future forms.",
    followedBy: "ཁ ག ཆ ཇ ཐ ད ཕ བ ཚ ཛ", usage: "Nasalises the root. Feminine roots deepen (’a + gu → [ng’gu]); very-feminine roots rise ([ng’no]). Root ba is a special case: ’a + ba stays [ba] in a low nasal tone.", accent: { hex: "#0284c7" }, family: "nasal",
    combos: [
      { word: "འཁུ་", parts: "འ + ཁ + ུ", read: "ng'khu", gloss: "to churn", tone: "up" },
      { word: "འགྲོ་", parts: "འ + ག + ྲ + ོ", read: "ng'dro", gloss: "to go", tone: "down" },
      { word: "འཆི་", parts: "འ + ཆ + ི", read: "ng'chi", gloss: "to die", tone: "up" },
      { word: "འཇུ་", parts: "འ + ཇ + ུ", read: "ng'ju", gloss: "to hold", tone: "down" },
      { word: "འདི་", parts: "འ + ད + ི", read: "di", gloss: "this", tone: "down", note: "sometimes reads plain [di]" },
      { word: "འདྲི་", parts: "འ + ད + ྲ + ི", read: "ng'dri", gloss: "to ask", tone: "down" },
      { word: "འབུ་", parts: "འ + བ + ུ", read: "ng'bu", gloss: "insect", tone: "down", note: "འ + བ stays [ba] family" },
      { word: "འབྲི་", parts: "འ + བ + ྲ + ི", read: "ng'dri", gloss: "to write", tone: "down" },
    ],
  },
];

export interface Vocab { tib: string; translit: string; en: string; emoji: string; prefix: PrefixKey; }

export const VOCAB: Vocab[] = [
  { tib: "དགེ་བ་", translit: "ge-wa", en: "virtue", emoji: "🌱", prefix: "da" },
  { tib: "གཙོ་བོ་", translit: "tso-wo", en: "chief, main", emoji: "👑", prefix: "ga" },
  { tib: "གཡུ་", translit: "yu", en: "turquoise", emoji: "🔷", prefix: "ga" },
  { tib: "གཞི་", translit: "zhi", en: "basis, ground", emoji: "🧱", prefix: "ga" },
  { tib: "དབུ་", translit: "wu", en: "head (H)", emoji: "🧠", prefix: "da" },
  { tib: "དཔེ་ཆ་", translit: "pe-cha", en: "book", emoji: "📖", prefix: "da" },
  { tib: "དབྲ་", translit: "dra", en: "ancient Tibetan lineage", emoji: "🌳", prefix: "da" },
  { tib: "བཞི་", translit: "zhi", en: "four", emoji: "4️⃣", prefix: "ba" },
  { tib: "བཅུ་", translit: "chu", en: "ten", emoji: "🔟", prefix: "ba" },
  { tib: "བདེ་བ་", translit: "de-wa", en: "happiness", emoji: "🧘", prefix: "ba" },
  { tib: "བཟོ་", translit: "zo", en: "to make, craft", emoji: "🔨", prefix: "ba" },
  { tib: "མགོ་", translit: "m'go", en: "head", emoji: "🗿", prefix: "ma" },
  { tib: "མཐོ་པོ་", translit: "m'tho-po", en: "high, tall", emoji: "📈", prefix: "ma" },
  { tib: "མཚོ་", translit: "m'tsho", en: "lake", emoji: "🏞️", prefix: "ma" },
  { tib: "མཁོ་", translit: "m'kho", en: "needed", emoji: "📌", prefix: "ma" },
  { tib: "མནོ་", translit: "m'no", en: "to think", emoji: "🤔", prefix: "ma" },
  { tib: "འགྲོ་", translit: "ng'dro", en: "to go", emoji: "🚶", prefix: "a" },
  { tib: "འདི་", translit: "di", en: "this", emoji: "👉", prefix: "a" },
  { tib: "འབྲི་", translit: "ng'dri", en: "to write", emoji: "✍️", prefix: "a" },
  { tib: "འཆི་", translit: "ng'chi", en: "to die", emoji: "🕊️", prefix: "a" },
];

export const NEVER_TAKE = "ཝ འ ལ ཧ ཨ";

export const STEPS = [
  { id: "anatomy", eyebrow: "Step 01", title: "Word formation \u2014 the anatomy of a syllable" },
  { id: "intro", eyebrow: "Step 02", title: "What is a prefix?" },
  { id: "family", eyebrow: "Step 03", title: "Meet the five prefixes" },
  { id: "exceptions", eyebrow: "Step 04", title: "Exceptions worth memorising" },
  { id: "vocab", eyebrow: "Step 05", title: "Vocabulary built from prefixes" },
  { id: "practice", eyebrow: "Step 06", title: "Practice & exercises" },
  { id: "complete", eyebrow: "Final step", title: "Lesson complete", description: "Take the final test to unlock the next lesson." }
];

export function generatePrefixQuiz(prefixKey: PrefixKey): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
  const prefix = PREFIXES.find(p => p.key === prefixKey)!;

  prefix.combos.forEach(c => {
    // 1. Audio Spelling
    const spellWrongs = shuffle(prefix.combos.filter(x => x.word !== c.word)).slice(0, 3);
    qs.push({
      isAudioType: true,
      questionText: "Listen to the spelling and select the matching stack.",
      answer: c.word,
      audioString: `${c.word} spelling`,
      audioTarget: c.word,
      choices: shuffle([c, ...spellWrongs]).map(x => ({ tib: x.word, value: x.word }))
    });

    // 2. Reading
    const romanWrongs = shuffle(Array.from(new Set(prefix.combos.map(x => x.read))).filter(r => r !== c.read)).slice(0, 3);
    qs.push({
      questionText: `How does ${c.word} read?`,
      prominentTibetan: c.word,
      answer: c.read,
      audioString: c.word,
      choices: shuffle([c.read, ...romanWrongs]).map(x => ({ value: x, label: `[${x}]` }))
    });

    // 3. Meaning (if gloss exists)
    if (c.gloss) {
      const glossWrongs = shuffle(Array.from(new Set(prefix.combos.filter(x => x.gloss).map(x => x.gloss!))).filter(g => g !== c.gloss)).slice(0, 3);
      if (glossWrongs.length > 0) {
        qs.push({
          questionText: `What does ${c.word} mean?`,
          prominentTibetan: c.word,
          answer: c.gloss,
          choices: shuffle([c.gloss, ...glossWrongs]).map(x => ({ value: x, label: x }))
        });
      }
    }
  });

  return shuffle(qs).slice(0, 10);
}

export function generateExceptionsQuiz(): QuizQuestion[] {
  const exceptions = [
    { word: "དབུ་", read: "wu", note: "ད + བ reads as [wa]" },
    { word: "དབྱེ་", read: "ye", note: "ད + བ + ཡ reads as [ya]" },
    { word: "དབྲ་", read: "dra", note: "ད + བ + ར reads as [dra]" },
    { word: "འབུ་", read: "ng'bu", note: "འ + བ reads as low nasal [ba]" },
    { word: "འབྲི་", read: "ng'dri", note: "འ + བ + ར reads as [dra]" },
    { word: "གཡོ་", read: "yo", note: "ག + ཡ reads as high [ya]" }
  ];
  
  const qs: QuizQuestion[] = [];
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());

  exceptions.forEach(e => {
    const romanWrongs = shuffle(Array.from(new Set(exceptions.map(x => x.read))).filter(r => r !== e.read)).slice(0, 3);
    qs.push({
      questionText: `How does the exception ${e.word} read?`,
      prominentTibetan: e.word,
      answer: e.read,
      audioString: e.word,
      choices: shuffle([e.read, ...romanWrongs]).map(x => ({ value: x, label: `[${x}]` }))
    });
  });

  return shuffle(qs);
}

export function generateVocabQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  for (const v of VOCAB) {
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
  const pickWrongs = <T,>(arr: T[], correct: T, count: number) => shuffle(Array.from(new Set(arr)).filter((x) => x !== correct)).slice(0, count);

  const ALL_COMBOS = PREFIXES.flatMap(p => p.combos.map(c => ({ ...c, prefKey: p.key, head: p.head, latin: p.latin, family: p.family })));
  
  // Audio Spelling for Random Stacks
  shuffle(ALL_COMBOS).slice(0, 5).forEach(c => {
    qs.push({
      isAudioType: true, questionText: "Listen to the spelling and select the matching stack.", answer: c.word, audioString: `${c.word} spelling`, audioTarget: c.word,
      choices: shuffle([c.word, ...pickWrongs(ALL_COMBOS.map(x => x.word), c.word, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // Vocab Listen -> Meaning
  shuffle(VOCAB).slice(0, 3).forEach(v => {
    qs.push({
      isAudioType: true, questionText: "Listen, then select the meaning of the word you hear.", answer: v.en, audioString: v.tib, audioTarget: v.en,
      choices: shuffle([v.en, ...pickWrongs(VOCAB.map(x => x.en), v.en, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // Identify Prefix Logic
  shuffle(ALL_COMBOS).slice(0, 3).forEach(c => {
    qs.push({
      questionText: `Which prefix opens the syllable ${c.word}?`, prominentTibetan: c.word, answer: c.latin, audioString: c.word,
      choices: shuffle([c.latin, ...pickWrongs(PREFIXES.map(p => p.latin), c.latin, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // Root isolation
  shuffle(ALL_COMBOS).slice(0, 3).forEach(c => {
    const root = c.parts.split(' + ')[1] ?? c.parts;
    qs.push({
      questionText: `Which letter is the root of ${c.word}?`, prominentTibetan: c.word, answer: root, audioString: c.word,
      choices: shuffle([root, ...pickWrongs(ALL_COMBOS.map(x => x.parts.split(' + ')[1] ?? x.parts), root, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // Abstract Rules (No Audio)
  const allRules = [
    { q: "Which five letters can be prefixes?", a: "ག ད བ མ འ", w: ["ར ལ ས མ འ", "ག ད བ ས ང", "ཡ ར ལ ཝ འ"] },
    { q: "Where does a prefix sit?", a: "Before the root letter, on the same line", w: ["Above the root letter", "Below the root letter", "After the vowel mark"] },
    { q: "How are the prefixes ག ད བ pronounced?", a: "They are silent — they affect only spelling and tone", w: ["They are always pronounced as a separate syllable", "They add a nasal hum", "They double the root consonant"] },
    { q: "Which two prefixes can add a nasal sound before the root?", a: "མ  འ", w: ["ག  ད", "བ  མ", "ད  འ"] },
    { q: "Which letters never take a prefix?", a: "ཝ འ ལ ཧ ཨ", w: ["ཀ ག ང ཅ ཇ", "ཟ ཞ ཤ ས ཧ", "པ ཕ བ མ ཙ"] },
    { q: "བཞི་ and གཞི་ sound alike. What tells them apart?", a: "Only the written prefix — the meaning differs", w: ["The tone of the root letter", "The vowel mark", "Nothing — they are the same word"] },
    { q: "What happens when the prefix ག precedes the root ཡ?", a: "It reads as a high-tone [yo]/[yu]", w: ["It reads as [gya]", "The ཡ becomes silent", "It reads as a low-tone [yo]"] }
  ];
  shuffle(allRules).slice(0, 4).forEach(r => {
    qs.push({
      questionText: r.q, answer: r.a, noAudio: true,
      choices: shuffle([{ value: r.a, label: r.a }, ...r.w.map(w => ({ value: w, label: w }))])
    });
  });

  return shuffle(qs).slice(0, 40);
}