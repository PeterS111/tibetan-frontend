// app/data/lesson7.ts
import { QuizQuestion } from "@/app/components/QuizModule";

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => 0.5 - Math.random());
}

// 1. CONSONANTS (Mapped to existing Ka.wav, Kha.wav, etc.)
const CONSONANTS = [
  { tib: "ཀ", translit: "ka", tone: "High tone" }, { tib: "ཁ", translit: "kha", tone: "High tone" },
  { tib: "ག", translit: "ga", tone: "Low tone" }, { tib: "ང", translit: "nga", tone: "Low tone" },
  { tib: "ཅ", translit: "cha", tone: "High tone" }, { tib: "ཆ", translit: "chha", tone: "High tone" },
  { tib: "ཇ", translit: "ja", tone: "Low tone" }, { tib: "ཉ", translit: "nya", tone: "Low tone" },
  { tib: "ཏ", translit: "ta", tone: "High tone" }, { tib: "ཐ", translit: "tha", tone: "High tone" },
  { tib: "ད", translit: "da", tone: "Low tone" }, { tib: "ན", translit: "na", tone: "Low tone" },
  { tib: "པ", translit: "pa", tone: "High tone" }, { tib: "ཕ", translit: "pha", tone: "High tone" },
  { tib: "བ", translit: "ba", tone: "Low tone" }, { tib: "མ", translit: "ma", tone: "Low tone" },
  { tib: "ཙ", translit: "tsa", tone: "High tone" }, { tib: "ཚ", translit: "tsha", tone: "High tone" },
  { tib: "ཛ", translit: "dza", tone: "Low tone" }, { tib: "ཝ", translit: "wa", tone: "Low tone" },
  { tib: "ཞ", translit: "zha", tone: "Low tone" }, { tib: "ཟ", translit: "za", tone: "Low tone" },
  { tib: "འ", translit: "a", tone: "Low tone" }, { tib: "ཡ", translit: "ya", tone: "Low tone" },
  { tib: "ར", translit: "ra", tone: "Low tone" }, { tib: "ལ", translit: "la", tone: "Low tone" },
  { tib: "ཤ", translit: "sha", tone: "High tone" }, { tib: "ས", translit: "sa", tone: "High tone" },
  { tib: "ཧ", translit: "ha", tone: "High tone" }, { tib: "ཨ", translit: "ah", tone: "High tone" },
];

// 2. VOWELS (Strictly mapped to AUDIO_MAP items)
const VOWELS = [
  { tib: "མི", read: "i" }, { tib: "སུ", read: "u" }, { tib: "མེ", read: "e" }, { tib: "སོ", read: "o" },
  { tib: "ཆུ", read: "u" }, { tib: "རི", read: "i" }, { tib: "ཤི", read: "i" }, { tib: "ཕུ", read: "u" }
];

// 3. ROOT WORDS (Strictly mapped to AUDIO_MAP items)
const ROOT_WORDS = [
  { word: "གངས་", root: "ག" }, { word: "ཁམས་", root: "ཁ" }, { word: "དཀར་", root: "ཀ" },
  { word: "བོད་", root: "བ" }, { word: "རིག་", root: "ར" }, { word: "ཐུབ་", root: "ཐ" },
  { word: "ཁྱིམ་", root: "ཁ" }, { word: "མཁའ་", root: "ཁ" }, { word: "བཞི་", root: "ཞ" },
  { word: "དགེ་", root: "ག" }
];

// 4. TONE RULES (Strictly mapped to AUDIO_MAP items)
const TONE_RULES = [
  { word: "དགེ་", tone: "Low tone" }, { word: "དབུ་", tone: "High tone" },
  { word: "མགོ་", tone: "Low tone" }, { word: "གཙོ་", tone: "High tone" },
  { word: "གཡོ་", tone: "High tone" }, { word: "འགྲོ་", tone: "Low tone" },
  { word: "འབུ་", tone: "Low tone" }, { word: "བཞི་", tone: "Low tone" }
];

// 5. READING WORDS (Strictly mapped to AUDIO_MAP items)
const READING_WORDS = [
  { word: "ལམ་", read: "lam" }, { word: "ནད་", read: "ne" }, { word: "མར་", read: "mar" },
  { word: "ལས་", read: "le" }, { word: "གསལ་", read: "sel" }, { word: "རིག་", read: "rik" },
  { word: "མན་", read: "men" }, { word: "རབ་", read: "rap" }
];

// 6. VOCABULARY (Strictly mapped to AUDIO_MAP items)
const VOCAB_WORDS = [
  { tib: "དགེ་བ་", en: "virtue" }, { tib: "གཙོ་བོ་", en: "chief" },
  { tib: "ཁང་པ་", en: "house" }, { tib: "མེ་མདའ་", en: "gun" },
  { tib: "ལག་པ་", en: "hand" }, { tib: "དཀར་པོ་", en: "white" },
  { tib: "ནག་པོ་", en: "black" }, { tib: "གངས་རི་", en: "snow mountain" }
];

// 7. SPELLING SEQUENCES (Strictly mapped to "X spelling.wav" in AUDIO_MAP)
const SPELLING_WORDS = [
  { word: "སྐྱ", parts: "ས + ཀ + བཏགས + སྐ + ཡ + བཏགས + སྐྱ" },
  { word: "རྒྱ", parts: "ར + ག + བཏགས + རྒ + ཡ + བཏགས + རྒྱ" },
  { word: "དགེ་", parts: "ད + ག + དག + ེ + དགེ" },
  { word: "བཀྲ་", parts: "བ + ཀ + ར + བཏགས + བཀྲ" },
  { word: "སྒྲ", parts: "ས + ག + བཏགས + སྒ + ར + བཏགས + སྒྲ" },
  { word: "མཁའ་", parts: "མ + ཁ + མཁ + འ + མཁའ" }
];

export const SKILLS = [
  { num: "01", title: "Letter recognition & sounds", desc: "Recognising the 30 root consonants and their pronunciation" },
  { num: "02", title: "Tone & gender classes", desc: "Classifying letters by tone class and gender" },
  { num: "03", title: "Vowels & diacritics", desc: "The four vowel signs and how they change a syllable" },
  { num: "04", title: "Stacks — superscripts & subscripts", desc: "Finding the root letter and reading stacked syllables" },
  { num: "05", title: "Prefixes & suffixes", desc: "Prefix rules, tone change, suffixes and post-suffixes" },
  { num: "06", title: "Reading complete words", desc: "Reading whole words aloud from the written form" },
  { num: "07", title: "Word meaning & images", desc: "Matching words with meanings and pictures" },
  { num: "08", title: "Spelling & word building", desc: "Spelling words, building them from letters, spotting missing letters" },
  { num: "09", title: "Similar words", desc: "Telling apart words that look or sound alike" },
  { num: "10", title: "Listening", desc: "Hearing a word and picking its written form or meaning" }
];

export const STEPS = [
  { id: "overview", eyebrow: "Section 01", title: "What this capstone covers" },
  { id: "assessment", eyebrow: "Section 02", title: "The assessment" },
  { id: "result", eyebrow: "Section 03", title: "Your result" },
];

export function generateCapstoneQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  const pickWrongs = <T,>(arr: T[], correct: T, count: number) => shuffle(Array.from(new Set(arr)).filter((x) => x !== correct)).slice(0, count);

  // 1. Letter recognition (6 Qs) - "read" triggers spoiler hide
  shuffle(CONSONANTS).slice(0, 6).forEach(c => {
    qs.push({
      questionText: "How does this letter read?",
      prominentTibetan: c.tib,
      answer: c.translit,
      audioString: c.tib, // Audio plays safely AFTER selection
      choices: shuffle([c.translit, ...pickWrongs(CONSONANTS.map(x => x.translit), c.translit, 3)]).map(x => ({ value: x, label: `[${x}]` }))
    });
  });

  // 2. Tone & Gender (6 Qs) - "read" triggers spoiler hide
  shuffle(CONSONANTS).slice(0, 6).forEach(c => {
    qs.push({
      questionText: "Read the letter and identify its tone class:",
      prominentTibetan: c.tib,
      answer: c.tone,
      audioString: c.tib,
      choices: shuffle([{ value: "High tone", label: "High tone" }, { value: "Low tone", label: "Low tone" }])
    });
  });

  // 3. Vowels (6 Qs) - "read" triggers spoiler hide
  shuffle(VOWELS).slice(0, 6).forEach(v => {
    qs.push({
      questionText: "Read the syllable and identify its vowel sound:",
      prominentTibetan: v.tib,
      answer: `[${v.read}]`,
      audioString: v.tib,
      choices: shuffle([`[${v.read}]`, ...pickWrongs(["[i]", "[u]", "[e]", "[o]"], `[${v.read}]`, 3)]).map(x => ({ value: x, label: x }))
    });
  });

  // 4. Stacks / Root letter (6 Qs) - No spoiler hide needed (hearing the word doesn't reveal the root)
  shuffle(ROOT_WORDS).slice(0, 6).forEach(r => {
    qs.push({
      questionText: "Identify the root letter in this word:",
      prominentTibetan: r.word,
      answer: r.root,
      audioString: r.word,
      choices: shuffle([r.root, ...pickWrongs(CONSONANTS.map(x => x.tib), r.root, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // 5. Prefix/Suffix rules (6 Qs) - "read" triggers spoiler hide
  shuffle(TONE_RULES).slice(0, 6).forEach(t => {
    qs.push({
      questionText: "Read the combination and identify its tone:",
      prominentTibetan: t.word,
      answer: t.tone,
      audioString: t.word,
      choices: shuffle([{ value: "High tone", label: "High tone" }, { value: "Low tone", label: "Low tone" }])
    });
  });

  // 6. Reading complete words (6 Qs) - "read" triggers spoiler hide
  shuffle(READING_WORDS).slice(0, 6).forEach(w => {
    qs.push({
      questionText: "How does this word read?",
      prominentTibetan: w.word,
      answer: w.read,
      audioString: w.word,
      choices: shuffle([w.read, ...pickWrongs(READING_WORDS.map(x => x.read), w.read, 3)]).map(x => ({ value: x, label: `[${x}]` }))
    });
  });

  // 7. Word meaning (6 Qs) - Automatically hides prominent Tibetan
  shuffle(VOCAB_WORDS).slice(0, 6).forEach(v => {
    qs.push({
      type: "vocab",
      questionText: `Which word means "${v.en}"?`,
      answer: v.tib,
      audioString: v.tib,
      choices: shuffle([v.tib, ...pickWrongs(VOCAB_WORDS.map(x => x.tib), v.tib, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // 8. Spelling & word building (6 Qs) - Uses spelling audio
  shuffle(SPELLING_WORDS).slice(0, 6).forEach(s => {
    const w1 = s.parts.split(" + ").reverse().join(" + ");
    const w2 = s.parts.replace("བཏགས", "ས").replace("ཡ", "ར"); 
    qs.push({
      isAudioType: true,
      questionText: "Listen to the spelling sequence and build it.",
      answer: s.parts,
      audioString: s.word + " spelling",
      audioTarget: s.word,
      choices: shuffle([s.parts, w1, w2]).map(x => ({ value: x, label: x }))
    });
  });

  // 9. Similar words (6 Qs) - "read" triggers spoiler hide
  shuffle(READING_WORDS).slice(0, 6).forEach(w => {
    qs.push({
      questionText: `Read carefully: Which word correctly reads as [${w.read}]?`,
      answer: w.word,
      audioString: w.word,
      choices: shuffle([w.word, ...pickWrongs(ROOT_WORDS.map(x => x.word), w.word, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // 10. Listening (6 Qs) - Audio is prominent
  shuffle(VOCAB_WORDS).slice(0, 6).forEach(v => {
    qs.push({
      isAudioType: true,
      questionText: "Listen and select the matching word.",
      answer: v.tib,
      audioString: v.tib,
      choices: shuffle([v.tib, ...pickWrongs(VOCAB_WORDS.map(x => x.tib), v.tib, 3)]).map(x => ({ value: x, tib: x }))
    });
  });

  // Returns exactly 60 Questions
  return qs;
}