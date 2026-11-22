// app/data/lesson9.ts

import { QuizQuestion } from "@/app/components/QuizModule";
import type { Beginner2SectionMeta, WordPart, CultureNote } from "@/app/data/lesson8";

export type Vocab9Category = "numbers_0_10" | "bigger_numbers" | "days" | "time";

export interface Lesson9Vocab {
  tib: string;
  pron: string;
  translit: string;
  en: string;
  emoji: string;
  category: Vocab9Category;
}

export interface Lesson9Phrase {
  id: string;
  tib: string;
  pron: string;
  en: string;
  breakdown: WordPart[];
}

export interface TeenCard {
  num: string;
  tib: string;
  pron: string;
  formula: string;
  vowelShift?: boolean;
}

export interface TenParticleCard {
  num: string;
  particle: string;
  tenTib: string;
  exampleTib: string;
  exampleNum: string;
}

export interface WeekdayCard {
  num: string;
  tib: string;
  pron: string;
  en: string;
  planet: string;
  tone: "amber" | "emerald";
}

export interface ClockExample {
  label: string;
  tib: string;
  pron: string;
}

export interface Lesson9DialogueLine {
  speaker: string;
  speakerTib: string;
  speakerInitial: string;
  side: "left" | "right";
  tib: string;
  pron: string;
  en: string;
}

export interface Lesson9DialogueThread {
  id: string;
  title: string;
  subtitle: string;
  lines: Lesson9DialogueLine[];
}

export const VOCAB_CATEGORIES: { id: Vocab9Category; label: string; hex: string }[] = [
  { id: "numbers_0_10", label: "Numbers 0–10", hex: "#D49700" },
  { id: "bigger_numbers", label: "Bigger Numbers", hex: "#0ea5e9" },
  { id: "days", label: "Days of the Week", hex: "#10b981" },
  { id: "time", label: "Time Words", hex: "#8b5cf6" },
];

export const VOCAB: Lesson9Vocab[] = [
  // Numbers 0-10
  { tib: "ཀླད་ཀོར།", pron: "ley-kor", translit: "ley-kor", en: "zero", emoji: "0️⃣", category: "numbers_0_10" },
  { tib: "གཅིག", pron: "chik", translit: "chik", en: "one", emoji: "1️⃣", category: "numbers_0_10" },
  { tib: "གཉིས།", pron: "nyi", translit: "nyi", en: "two", emoji: "2️⃣", category: "numbers_0_10" },
  { tib: "གསུམ།", pron: "sum", translit: "sum", en: "three", emoji: "3️⃣", category: "numbers_0_10" },
  { tib: "བཞི།", pron: "shi", translit: "shi", en: "four", emoji: "4️⃣", category: "numbers_0_10" },
  { tib: "ལྔ།", pron: "nga", translit: "nga", en: "five", emoji: "5️⃣", category: "numbers_0_10" },
  { tib: "དྲུག", pron: "druk", translit: "druk", en: "six", emoji: "6️⃣", category: "numbers_0_10" },
  { tib: "བདུན།", pron: "dün", translit: "dün", en: "seven", emoji: "7️⃣", category: "numbers_0_10" },
  { tib: "བརྒྱད།", pron: "gye", translit: "gye", en: "eight", emoji: "8️⃣", category: "numbers_0_10" },
  { tib: "དགུ", pron: "gu", translit: "gu", en: "nine", emoji: "9️⃣", category: "numbers_0_10" },
  { tib: "བཅུ།", pron: "chu", translit: "chu", en: "ten", emoji: "🔟", category: "numbers_0_10" },
  // Bigger numbers
  { tib: "བཅུ་གཅིག", pron: "chu-chik", translit: "chu-chik", en: "eleven", emoji: "1️⃣1️⃣", category: "bigger_numbers" },
  { tib: "བཅུ་གཉིས།", pron: "chu-nyi", translit: "chu-nyi", en: "twelve", emoji: "1️⃣2️⃣", category: "bigger_numbers" },
  { tib: "ཉི་ཤུ།", pron: "nyi-shu", translit: "nyi-shu", en: "twenty", emoji: "2️⃣0️⃣", category: "bigger_numbers" },
  { tib: "སུམ་ཅུ།", pron: "sum-chu", translit: "sum-chu", en: "thirty", emoji: "3️⃣0️⃣", category: "bigger_numbers" },
  { tib: "བརྒྱ།", pron: "gya", translit: "gya", en: "one hundred", emoji: "💯", category: "bigger_numbers" },
  { tib: "སྟོང་གཅིག", pron: "tong-chik", translit: "tong-chik", en: "one thousand", emoji: "🔢", category: "bigger_numbers" },
  // Days of the week
  { tib: "གཟའ་ཟླ་བ།", pron: "za dawa", translit: "za dawa", en: "Monday", emoji: "🌙", category: "days" },
  { tib: "གཟའ་མིག་དམར།", pron: "za mikmar", translit: "za mikmar", en: "Tuesday", emoji: "🔴", category: "days" },
  { tib: "གཟའ་ལྷག་པ།", pron: "za lhakpa", translit: "za lhakpa", en: "Wednesday", emoji: "💧", category: "days" },
  { tib: "གཟའ་ཕུར་བུ།", pron: "za phurbu", translit: "za phurbu", en: "Thursday", emoji: "⚡", category: "days" },
  { tib: "གཟའ་པ་སངས།", pron: "za pasang", translit: "za pasang", en: "Friday", emoji: "✨", category: "days" },
  { tib: "གཟའ་སྤེན་པ།", pron: "za penpa", translit: "za penpa", en: "Saturday", emoji: "🪐", category: "days" },
  { tib: "གཟའ་ཉི་མ།", pron: "za nyima", translit: "za nyima", en: "Sunday", emoji: "☀️", category: "days" },
  // Time words
  { tib: "ཆུ་ཚོད།", pron: "chu-tsö", translit: "chu-tsö", en: "hour / o'clock / time", emoji: "🕐", category: "time" },
  { tib: "སྐར་མ།", pron: "kar-ma", translit: "kar-ma", en: "minute", emoji: "⏱️", category: "time" },
  { tib: "དེ་རིང་།", pron: "te-ring", translit: "te-ring", en: "today", emoji: "📅", category: "time" },
  { tib: "སང་ཉིན།", pron: "sang-nyin", translit: "sang-nyin", en: "tomorrow", emoji: "⏩", category: "time" },
  { tib: "ཁ་པར།", pron: "khapar", translit: "khapar", en: "telephone", emoji: "📞", category: "time" },
  { tib: "ཨང་གྲངས།", pron: "an-drang", translit: "an-drang", en: "number", emoji: "🔤", category: "time" },
];

export const USEFUL_PHRASES: Lesson9Phrase[] = [
  {
    id: "u2-p1",
    tib: "ཁྱེད་རང་གི་ཁ་པར་ཨང་གྲངས་ག་རེ་རེད།",
    pron: "khyerang gi khapar an-drang gare re?",
    en: "What is your phone number?",
    breakdown: [
      { tib: "ཁྱེད་རང་གི་", pron: "khyerang gi", gloss: "your (polite possessive)", pos: "PRONOUN" },
      { tib: "ཁ་པར་", pron: "khapar", gloss: "telephone", pos: "NOUN" },
      { tib: "ཨང་གྲངས་", pron: "an-drang", gloss: "number", pos: "NOUN" },
      { tib: "ག་རེ་", pron: "gare", gloss: "what", pos: "QUESTION" },
      { tib: "རེད།", pron: "re", gloss: "is (copula)", pos: "VERB" },
    ],
  },
  {
    id: "u2-p2",
    tib: "ཆུ་ཚོད་ག་ཚོད་རེད།",
    pron: "chu-tsö ga-tsö re?",
    en: "What time is it?",
    breakdown: [
      { tib: "ཆུ་ཚོད་", pron: "chu-tsö", gloss: "hour / time", pos: "NOUN" },
      { tib: "ག་ཚོད་", pron: "ga-tsö", gloss: "how much / how many", pos: "QUESTION" },
      { tib: "རེད།", pron: "re", gloss: "is (copula)", pos: "VERB" },
    ],
  },
  {
    id: "u2-p3",
    tib: "དེ་རིང་གཟའ་ག་རེ་རེད།",
    pron: "te-ring za gare re?",
    en: "What day is it today?",
    breakdown: [
      { tib: "དེ་རིང་", pron: "te-ring", gloss: "today", pos: "ADVERB" },
      { tib: "གཟའ་", pron: "za", gloss: "day of the week / planet", pos: "NOUN" },
      { tib: "ག་རེ་", pron: "gare", gloss: "what", pos: "QUESTION" },
      { tib: "རེད།", pron: "re", gloss: "is (copula)", pos: "VERB" },
    ],
  },
  {
    id: "u2-p4",
    tib: "ཆུ་ཚོད་ལྔ་པ་རེད།",
    pron: "chu-tsö nga-pa re",
    en: "It is 5 o'clock.",
    breakdown: [
      { tib: "ཆུ་ཚོད་", pron: "chu-tsö", gloss: "hour / o'clock", pos: "NOUN" },
      { tib: "ལྔ་པ་", pron: "nga-pa", gloss: "fifth (5 + ordinal)", pos: "NUMBER" },
      { tib: "རེད།", pron: "re", gloss: "is (copula)", pos: "VERB" },
    ],
  },
  {
    id: "u2-p5",
    tib: "སང་ཉིན་གཟའ་ཕུར་བུ་རེད།",
    pron: "sang-nyin za phurbu re",
    en: "Tomorrow is Thursday.",
    breakdown: [
      { tib: "སང་ཉིན་", pron: "sang-nyin", gloss: "tomorrow", pos: "ADVERB" },
      { tib: "གཟའ་ཕུར་བུ་", pron: "za phurbu", gloss: "Thursday (Jupiter day)", pos: "NOUN" },
      { tib: "རེད།", pron: "re", gloss: "is (copula)", pos: "VERB" },
    ],
  },
  {
    id: "u2-p6",
    tib: "སང་ཉིན་ཆུ་ཚོད་བཅུ་པར་ཐུག་ག",
    pron: "sang-nyin chu-tsö chu-par thug ga",
    en: "Let's meet tomorrow at 10 o'clock.",
    breakdown: [
      { tib: "སང་ཉིན་", pron: "sang-nyin", gloss: "tomorrow", pos: "ADVERB" },
      { tib: "ཆུ་ཚོད་བཅུ་པར་", pron: "chu-tsö chu-par", gloss: "at 10 o'clock", pos: "TIME" },
      { tib: "ཐུག་ག", pron: "thug ga", gloss: "let's meet", pos: "VERB" },
    ],
  },
  {
    id: "u2-p7",
    tib: "འགྲིག་གི་རེད།",
    pron: "drig gi re",
    en: "Alright. / That works.",
    breakdown: [
      { tib: "འགྲིག་", pron: "drig", gloss: "to be fine / fit / work", pos: "VERB" },
      { tib: "གི་རེད།", pron: "gi re", gloss: "general future / habitual", pos: "AUXILIARY" },
    ],
  },
  {
    id: "u2-p8",
    tib: "ཐུགས་རྗེ་ཆེ།",
    pron: "thuk je che",
    en: "Thank you.",
    breakdown: [
      { tib: "ཐུགས་རྗེ་", pron: "thuk je", gloss: "compassion / kindness (H)", pos: "NOUN" },
      { tib: "ཆེ།", pron: "che", gloss: "great", pos: "ADJECTIVE" },
    ],
  },
];

export const TEENS_CARDS: TeenCard[] = [
  { num: "11", tib: "བཅུ་གཅིག", pron: "chu-chik", formula: "བཅུ་ + གཅིག" },
  { num: "12", tib: "བཅུ་གཉིས།", pron: "chu-nyi", formula: "བཅུ་ + གཉིས" },
  { num: "13", tib: "བཅུ་གསུམ།", pron: "chu-sum", formula: "བཅུ་ + གསུམ" },
  { num: "15", tib: "བཅོ་ལྔ།", pron: "cho-nga", formula: "བཅུ་ → བཅོ་ + ལྔ", vowelShift: true },
  { num: "18", tib: "བཅོ་བརྒྱད།", pron: "cho-gye", formula: "བཅུ་ → བཅོ་ + བརྒྱད", vowelShift: true },
  { num: "20", tib: "ཉི་ཤུ།", pron: "nyi-shu", formula: "a separate word" },
];

export const TENS_PARTICLES: TenParticleCard[] = [
  { num: "20", particle: "རྩ", tenTib: "ཉི་ཤུ།", exampleTib: "ཉི་ཤུ་རྩ་གཅིག", exampleNum: "(21)" },
  { num: "30", particle: "སོ", tenTib: "སུམ་ཅུ།", exampleTib: "སུམ་ཅུ་སོ་གཉིས།", exampleNum: "(32)" },
  { num: "40", particle: "ཞེ", tenTib: "བཞི་བཅུ།", exampleTib: "བཞི་བཅུ་ཞེ་གསུམ།", exampleNum: "(43)" },
  { num: "50", particle: "ང", tenTib: "ལྔ་བཅུ།", exampleTib: "ལྔ་བཅུ་ང་བཞི།", exampleNum: "(54)" },
  { num: "60", particle: "རེ", tenTib: "དྲུག་ཅུ།", exampleTib: "དྲུག་ཅུ་རེ་ལྔ།", exampleNum: "(65)" },
  { num: "70", particle: "དོན", tenTib: "བདུན་ཅུ།", exampleTib: "བདུན་ཅུ་དོན་དྲུག", exampleNum: "(76)" },
  { num: "80", particle: "གྱ", tenTib: "བརྒྱད་ཅུ།", exampleTib: "བརྒྱད་ཅུ་གྱ་བདུན།", exampleNum: "(87)" },
  { num: "90", particle: "གོ", tenTib: "དགུ་བཅུ།", exampleTib: "དགུ་བཅུ་གོ་བརྒྱད།", exampleNum: "(98)" },
];

export const WEEKDAYS_CYCLE: WeekdayCard[] = [
  { num: "01", tib: "གཟའ་ཟླ་བ།", pron: "za dawa", en: "Monday", planet: "moon", tone: "amber" },
  { num: "02", tib: "གཟའ་མིག་དམར།", pron: "za mikmar", en: "Tuesday", planet: "Mars", tone: "emerald" },
  { num: "03", tib: "གཟའ་ལྷག་པ།", pron: "za lhakpa", en: "Wednesday", planet: "Mercury", tone: "amber" },
  { num: "04", tib: "གཟའ་ཕུར་བུ།", pron: "za phurbu", en: "Thursday", planet: "Jupiter", tone: "emerald" },
  { num: "05", tib: "གཟའ་པ་སངས།", pron: "za pasang", en: "Friday", planet: "Venus", tone: "amber" },
  { num: "06", tib: "གཟའ་སྤེན་པ།", pron: "za penpa", en: "Saturday", planet: "Saturn", tone: "emerald" },
  { num: "07", tib: "གཟའ་ཉི་མ།", pron: "za nyima", en: "Sunday", planet: "sun", tone: "amber" },
];

export const CLOCK_EXAMPLES: ClockExample[] = [
  { label: "1 o'clock", tib: "ཆུ་ཚོད་དང་པོ་རེད།", pron: "chu-tsö dangpo re" },
  { label: "3 o'clock", tib: "ཆུ་ཚོད་གསུམ་པ་རེད།", pron: "chu-tsö sum-pa re" },
  { label: "5 o'clock", tib: "ཆུ་ཚོད་ལྔ་པ་རེད།", pron: "chu-tsö nga-pa re" },
  { label: "10 o'clock", tib: "ཆུ་ཚོད་བཅུ་པ་རེད།", pron: "chu-tsö chu-pa re" },
];

export const DIALOGUES: Lesson9DialogueThread[] = [
  {
    id: "u2-d1",
    title: "Exchanging contact information",
    subtitle: "Two classmates swap numbers after class.",
    lines: [
      { speaker: "Jampa", speakerTib: "བྱམས་པ།", speakerInitial: "J", side: "left", tib: "ཁྱེད་རང་གི་ཁ་པར་ཨང་གྲངས་ག་རེ་རེད།", pron: "khyerang gi khapar an-drang gare re?", en: "What is your phone number?" },
      { speaker: "Dolma", speakerTib: "སྒྲོལ་མ།", speakerInitial: "D", side: "right", tib: "ངའི་ཁ་པར་ཨང་གྲངས་ ༩༤ ༡༢ ༣༦ ༧༣ ༥༠ རེད།", pron: "ngä khapar an-drang gu-shi, chik-nyi, sum-druk, dün-sum, nga-ley-kor re.", en: "My phone number is 94 12 36 73 50." },
      { speaker: "Jampa", speakerTib: "བྱམས་པ།", speakerInitial: "J", side: "left", tib: "ཐུགས་རྗེ་ཆེ།", pron: "thuk je che.", en: "Thank you." },
    ],
  },
  {
    id: "u2-d2",
    title: "Confirming the schedule",
    subtitle: "Checking the day and the time.",
    lines: [
      { speaker: "Jamyang", speakerTib: "འཇམ་དབྱངས།", speakerInitial: "J", side: "left", tib: "དེ་རིང་གཟའ་ག་རེ་རེད།", pron: "te-ring za gare re?", en: "What day is it today?" },
      { speaker: "Jangchup", speakerTib: "བྱང་ཆུབ།", speakerInitial: "J", side: "right", tib: "དེ་རིང་གཟའ་ལྷག་པ་རེད།", pron: "te-ring za lhakpa re.", en: "Today is Wednesday." },
      { speaker: "Jamyang", speakerTib: "འཇམ་དབྱངས།", speakerInitial: "J", side: "left", tib: "ཆུ་ཚོད་ག་ཚོད་རེད།", pron: "chu-tsö ga-tsö re?", en: "What time is it?" },
      { speaker: "Jangchup", speakerTib: "བྱང་ཆུབ།", speakerInitial: "J", side: "right", tib: "ཆུ་ཚོད་ལྔ་པ་རེད།", pron: "chu-tsö nga-pa re.", en: "It is 5 o'clock." },
      { speaker: "Jamyang", speakerTib: "འཇམ་དབྱངས།", speakerInitial: "J", side: "left", tib: "ལགས་སོ། སང་ཉིན་མཇལ་ཡོང་།", pron: "la so. sang-nyin jäl yong.", en: "Okay (polite). See you tomorrow." },
    ],
  },
  {
    id: "u2-d3",
    title: "Planning a meeting",
    subtitle: "Lhamo and Tashi arrange to meet.",
    lines: [
      { speaker: "Lhamo", speakerTib: "ལྷ་མོ།", speakerInitial: "L", side: "left", tib: "བཀྲ་ཤིས་བདེ་ལེགས། སང་ཉིན་གཟའ་ག་རེ་རེད།", pron: "tashi delek. sang-nyin za gare re?", en: "Hello. What day is tomorrow?" },
      { speaker: "Tashi", speakerTib: "བཀྲ་ཤིས།", speakerInitial: "T", side: "right", tib: "སང་ཉིན་གཟའ་ཕུར་བུ་རེད།", pron: "sang-nyin za phurbu re.", en: "Tomorrow is Thursday." },
      { speaker: "Lhamo", speakerTib: "ལྷ་མོ།", speakerInitial: "L", side: "left", tib: "སང་ཉིན་ཆུ་ཚོད་བཅུ་པར་ཐུག་ག", pron: "sang-nyin chu-tsö chu-par thug ga.", en: "Let's meet tomorrow at 10 o'clock." },
      { speaker: "Tashi", speakerTib: "བཀྲ་ཤིས།", speakerInitial: "T", side: "right", tib: "འགྲིག་གི་རེད། ཁྱེད་རང་གི་ཁ་པར་ཨང་གྲངས་ག་རེ་རེད།", pron: "drig gi re. khyerang gi khapar an-drang gare re?", en: "Alright. What is your phone number?" },
      { speaker: "Lhamo", speakerTib: "ལྷ་མོ།", speakerInitial: "L", side: "left", tib: "ངའི་ཁ་པར་ཨང་གྲངས་ ༩༤ ༡༦ ༠༩ ༧༣ ༡༥ རེད།", pron: "ngä khapar an-drang gu-shi, chik-druk, ley-kor-gu, dün-sum, chik-nga re.", en: "My phone number is 94 16 09 73 15." },
      { speaker: "Tashi", speakerTib: "བཀྲ་ཤིས།", speakerInitial: "T", side: "right", tib: "ཐུགས་རྗེ་ཆེ། སང་ཉིན་ཆུ་ཚོད་བཅུ་པར་མཇལ་ཡོང་།", pron: "thuk je che. sang-nyin chu-tsö chu-par jäl yong.", en: "Thank you. See you tomorrow at 10 o'clock." },
    ],
  },
];

export const CULTURE_NOTES: CultureNote[] = [
  {
    id: "golden-earring",
    badge: "CULTURE 01",
    title: "The Golden Earring Game (གསེར་གྱི་ཨ་ལོང་།)",
    fallbackImage: "/loplao-hero-scene.jpg",
    paragraphs: [
      "Children in Tibet practise counting rhythmically through games. In one of them, friends link arms and recite a chant that translates as 'Both of us (friends) get a golden earring.'",
      "ང་ཚོ་གྲོགས་པོ་གཅིག་གཅིག (nga-tso drok-po chik chik) — 'We two friends, one each.'",
      "གསེར་གྱི་ཨ་ལོང་གཅིག་གཅིག (ser kyi a-long chik chik) — 'A golden earring, one each.'",
      "How to play: repeat the two lines, then replace གཅིག་གཅིག (one one) with གཉིས་གཉིས (two two), then གསུམ་གསུམ (three three), counting up and going faster each round until someone stumbles.",
    ],
  },
  {
    id: "planet-days",
    badge: "CULTURE 02",
    title: "Why days are named after planets",
    fallbackImage: "/06_suffixes_post_suffixes.jpg",
    paragraphs: [
      "The Tibetan week follows the same astronomical logic as the Indian and classical European weeks: each day belongs to a celestial body.",
      "གཟའ་ (za) literally means 'planet'. So Monday is 'moon day', Tuesday is 'Mars day', and Sunday is 'sun day' — exactly the pattern behind Monday and Sunday in English.",
      "Days also matter in the Tibetan calendar: auspicious days are chosen for travel, ceremonies, and starting new work, which is why people often ask དེ་རིང་གཟའ་ག་རེ་རེད།",
    ],
  },
];

export const TIBETAN_DIGITS = [
  { arabic: "0", digit: "༠", word: "ཀླད་ཀོར།", pron: "ley-kor" },
  { arabic: "1", digit: "༡", word: "གཅིག", pron: "chik" },
  { arabic: "2", digit: "༢", word: "གཉིས།", pron: "nyi" },
  { arabic: "3", digit: "༣", word: "གསུམ།", pron: "sum" },
  { arabic: "4", digit: "༤", word: "བཞི།", pron: "shi" },
  { arabic: "5", digit: "༥", word: "ལྔ།", pron: "nga" },
  { arabic: "6", digit: "༦", word: "དྲུག", pron: "druk" },
  { arabic: "7", digit: "༧", word: "བདུན།", pron: "dün" },
  { arabic: "8", digit: "༨", word: "བརྒྱད།", pron: "gye" },
  { arabic: "9", digit: "༩", word: "དགུ", pron: "gu" },
  { arabic: "10", digit: "༡༠", word: "བཅུ།", pron: "chu" },
];

export const ROUND_NUMBERS = [
  { arabic: "100", tib: "བརྒྱ།", pron: "gya" },
  { arabic: "200", tib: "ཉིས་བརྒྱ།", pron: "nyi-gya" },
  { arabic: "1,000", tib: "སྟོང་གཅིག", pron: "tong-chik" },
  { arabic: "10,000", tib: "ཁྲི་གཅིག", pron: "thri-chik" },
  { arabic: "100,000", tib: "འབུམ་གཅིག", pron: "bum-chik" },
  { arabic: "1,000,000", tib: "ས་ཡ་གཅིག", pron: "saya-chik" },
];

export const TIME_DAY_REF = [
  { en: "hour / o'clock", tib: "ཆུ་ཚོད།", pron: "chu-tsö" },
  { en: "minute", tib: "སྐར་མ།", pron: "kar-ma" },
  { en: "today", tib: "དེ་རིང་།", pron: "te-ring" },
  { en: "tomorrow", tib: "སང་ཉིན།", pron: "sang-nyin" },
  { en: "weekday", tib: "གཟའ།", pron: "za" },
  { en: "telephone", tib: "ཁ་པར།", pron: "khapar" },
];

export const CAN_DO_CHECKLIST: string[] = [
  "I can count from 0 to 20 without hesitating.",
  "I can build any number up to 100 using the correct linking particle.",
  "I can name all seven days with the གཟའ་ prefix.",
  "I can ask and answer ཆུ་ཚོད་ག་ཚོད་རེད།",
  "I can give my phone number digit by digit in Tibetan.",
  "I can read the Tibetan numerals ༠–༩.",
];

export const SPEAKING_PROMPTS: string[] = [
  "Say your own phone number aloud in Tibetan, digit by digit.",
  "Look at a clock every hour today and say ཆུ་ཚོད་ ___ པ་རེད།",
  "Name the seven days in order, then backwards.",
  "Play the Golden Earring chant, counting up from གཅིག་གཅིག་ to ལྔ་ལྔ།",
];

export const WEB_STEPS: Beginner2SectionMeta[] = [
  {
    id: "vocab",
    navTitle: "Vocabulary",
    tibetanTitle: "ཚིག་གསར།",
    eyebrow: "Section 1",
    heroEyebrow: "VOCABULARY · BEGINNER 2",
    title: "Numbers, days and time words",
    description: "Two number modules, the seven weekdays, and everyday time words.",
    proverbTib: "བསོད་ནམས་བརྒྱ་བས་ཚད་ལས་འདས།",
    proverbEn: "A HUNDRED MERITS EXCEED ALL MEASURE.",
    bannerImage: "/loplao-hero-scene.jpg",
  },
  {
    id: "phrases",
    navTitle: "Useful phrases",
    tibetanTitle: "བརྗོད་པ།",
    eyebrow: "Section 2",
    heroEyebrow: "USEFUL PHRASES · BEGINNER 2",
    title: "Asking for the time, the day and a number",
    description: "Three question phrases and the answers that go with them.",
    proverbTib: "ཆུ་མིག་རྐྱལ་པས་མི་ཆོད།",
    proverbEn: "A LEATHER BAG WON'T DAM A SPRING.",
    bannerImage: "/loplao-hero-scene.jpg",
  },
  {
    id: "grammar",
    navTitle: "Grammar",
    tibetanTitle: "བརྡ་སྤྲོད།",
    eyebrow: "Section 3",
    heroEyebrow: "GRAMMAR · BEGINNER 2",
    title: "Building numbers, days and clock time",
    description: "Three regular patterns that generate hundreds of sentences.",
    proverbTib: "རི་མཐོན་པོའི་རྩེ་ལ་མཐོང་ཆེན་པོ།",
    proverbEn: "FROM A HIGH PEAK, A WIDE VIEW.",
    bannerImage: "/06_suffixes_post_suffixes.jpg",
  },
  {
    id: "conversation",
    navTitle: "Conversation",
    tibetanTitle: "ཁ་བརྡ།",
    eyebrow: "Section 4",
    heroEyebrow: "CONVERSATION · BEGINNER 2",
    title: "Numbers in real exchanges",
    description: "Three dialogues: phone numbers, the schedule, and making a plan.",
    proverbTib: "ལག་པས་མ་ཟིན་པར་ཁ་མ་བླེབ།",
    proverbEn: "DON'T RUSH THE MOUTH BEFORE THE HAND GRASPS.",
    bannerImage: "/loplao-hero-scene.jpg",
  },
  {
    id: "reference",
    navTitle: "Reference",
    tibetanTitle: "དཔྱད་གཞི།",
    eyebrow: "Section 5",
    heroEyebrow: "REFERENCE · BEGINNER 2",
    title: "Tibetan digits & Culture Corner",
    description: "The written numerals, a quick number table, and a children's counting game.",
    proverbTib: "སྨན་པ་རང་གི་ནད་མི་གསོས།",
    proverbEn: "A DOCTOR CAN'T CURE HIS OWN ILLNESS.",
    bannerImage: "/06_suffixes_post_suffixes.jpg",
  },
  {
    id: "practice",
    navTitle: "Practice",
    tibetanTitle: "སྦྱོང་ཚན།",
    eyebrow: "Section 6",
    heroEyebrow: "PRACTICE · BEGINNER 2",
    title: "Exercises",
    description: "Number building, weekdays, telling the time, and dialogue recall.",
    proverbTib: "ལམ་རིང་པོའི་གོམ་པས་བརྩི་དགོས།",
    proverbEn: "A LONG ROAD IS COUNTED IN STEPS.",
    bannerImage: "/loplao-hero-scene.jpg",
  },
  {
    id: "review",
    navTitle: "Review",
    tibetanTitle: "བསྐྱར་ཞིབ།",
    eyebrow: "Section 7",
    heroEyebrow: "REVIEW · BEGINNER 2",
    title: "Consolidate before the test",
    description: "A checklist and speaking prompts.",
    proverbTib: "ཁ་བ་ཆེན་པོའི་མེ་ཕུང་ཆུང་ངུ།",
    proverbEn: "A SMALL FIRE WARMS IN GREAT SNOW.",
    bannerImage: "/06_suffixes_post_suffixes.jpg",
  },
  {
    id: "test",
    navTitle: "Final test",
    tibetanTitle: "མཐའ་མའི་རྒྱུགས་ཞིབ།",
    eyebrow: "Section 8",
    heroEyebrow: "ASSESSMENT · BEGINNER 2",
    title: "Final test",
    description: "40 questions: vocabulary, romanisation, listening, conversation, grammar and reference.",
    proverbTib: "ཤེས་རྒྱུ་མེད་ན་སྐྱེས་བུ་མ་རེད།",
    proverbEn: "WITHOUT KNOWLEDGE, ONE IS NO PERSON.",
    bannerImage: "/loplao-hero-scene.jpg",
  },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
const pickWrongs = <T,>(arr: T[], excludeFn: (item: T) => boolean, count: number): T[] =>
  shuffle(arr.filter((x) => !excludeFn(x))).slice(0, count);

export function generateVocabQuiz(): QuizQuestion[] {
  return shuffle(VOCAB)
    .slice(0, 12)
    .map((v, idx) => {
      const mode = idx % 3;
      if (mode === 0) {
        const wrongs = pickWrongs(VOCAB, (x) => x.pron === v.pron, 3);
        return {
          questionText: `How is ${v.tib} read aloud?`,
          prominentTibetan: v.tib,
          answer: v.pron,
          audioString: v.tib,
          choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.pron, label: c.pron })),
        };
      } else if (mode === 1) {
        const wrongs = pickWrongs(VOCAB, (x) => x.tib === v.tib, 3);
        return {
          type: "vocab",
          questionText: `Which Tibetan word means "${v.en}"?`,
          answer: v.tib,
          audioString: v.tib,
          choices: shuffle([v, ...wrongs]).map((c) => ({
            value: c.tib,
            tib: c.tib,
            pron: c.pron,
            en: c.en,
            isTibetan: true,
          })),
        };
      } else {
        const wrongs = pickWrongs(VOCAB, (x) => x.en === v.en, 3);
        return {
          questionText: `What does ${v.tib} mean?`,
          prominentTibetan: v.tib,
          answer: v.en,
          audioString: v.tib,
          choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.en, label: c.en })),
        };
      }
    });
}

export function generatePhrasesQuiz(): QuizQuestion[] {
  const bank: QuizQuestion[] = [];
  USEFUL_PHRASES.forEach((p) => {
    const wrongsEn = pickWrongs(USEFUL_PHRASES, (x) => x.en === p.en, 3);
    bank.push({
      questionText: `What does ${p.tib} mean?`,
      prominentTibetan: p.tib,
      answer: p.en,
      audioString: p.tib,
      choices: shuffle([p, ...wrongsEn]).map((c) => ({ value: c.en, label: c.en })),
    });
    const wrongsTib = pickWrongs(USEFUL_PHRASES, (x) => x.tib === p.tib, 3);
    bank.push({
      questionText: `Which one means "${p.en}"?`,
      answer: p.tib,
      audioString: p.tib,
      choices: shuffle([p, ...wrongsTib]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })),
    });
  });
  return shuffle(bank).slice(0, 12);
}

export function generateNumbersQuiz(): QuizQuestion[] {
  const bank: QuizQuestion[] = [
    { questionText: "How is ཉི་ཤུ། read aloud?", prominentTibetan: "ཉི་ཤུ།", answer: "nyi-shu", audioString: "ཉི་ཤུ།", choices: shuffle(["chu-chik", "chu-sum", "nyi-shu", "chu-nyi"]).map((s) => ({ value: s, label: s })) },
    { questionText: "How is བཅོ་ལྔ། (15) read aloud?", prominentTibetan: "བཅོ་ལྔ།", answer: "cho-nga", audioString: "བཅོ་ལྔ།", choices: shuffle(["cho-nga", "chu-nga", "cho-gye", "sum-chu"]).map((s) => ({ value: s, label: s })) },
    { questionText: "How is བཅོ་བརྒྱད། (18) read aloud?", prominentTibetan: "བཅོ་བརྒྱད།", answer: "cho-gye", audioString: "བཅོ་བརྒྱད།", choices: shuffle(["cho-gye", "chu-gye", "cho-nga", "nyi-shu"]).map((s) => ({ value: s, label: s })) },
    { questionText: "Which linking particle is used for the twenties (21–29)?", answer: "རྩ", noAudio: true, choices: shuffle(["རྩ", "སོ", "ཞེ", "ང"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "Which linking particle is used for the thirties (31–39)?", answer: "སོ", noAudio: true, choices: shuffle(["སོ", "རྩ", "རེ", "གོ"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "Which linking particle is used for the fifties (51–59)?", answer: "ང", noAudio: true, choices: shuffle(["ང", "ཞེ", "དོན", "གྱ"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "Which Tibetan number is 32?", answer: "སུམ་ཅུ་སོ་གཉིས།", noAudio: true, choices: shuffle(["སུམ་ཅུ་སོ་གཉིས།", "སུམ་ཅུ་རྩ་གཉིས།", "བཅུ་གཉིས།", "གསུམ་གཉིས།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "Which Tibetan number is 57?", answer: "ལྔ་བཅུ་ང་བདུན།", noAudio: true, choices: shuffle(["ལྔ་བཅུ་ང་བདུན།", "ལྔ་བཅུ་ཞེ་བདུན།", "བདུན་ཅུ་དོན་ལྔ།", "ལྔ་བཅུ་རེ་བདུན།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "What number is བཞི་བཅུ་ཞེ་གསུམ།?", prominentTibetan: "བཞི་བཅུ་ཞེ་གསུམ།", answer: "43", noAudio: true, choices: shuffle(["43", "34", "53", "63"]).map((s) => ({ value: s, label: s })) },
    { questionText: "What number is དགུ་བཅུ་གོ་བརྒྱད།?", prominentTibetan: "དགུ་བཅུ་གོ་བརྒྱད།", answer: "98", noAudio: true, choices: shuffle(["98", "89", "78", "96"]).map((s) => ({ value: s, label: s })) },
  ];
  return shuffle(bank);
}

export function generateDaysQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = WEEKDAYS_CYCLE.map((d) => {
    const wrongs = pickWrongs(WEEKDAYS_CYCLE, (x) => x.tib === d.tib, 3);
    return {
      questionText: `Which one means "${d.en}"?`,
      answer: d.tib,
      audioString: d.tib,
      choices: shuffle([d, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })),
    };
  });
  shuffle(WEEKDAYS_CYCLE)
    .slice(0, 3)
    .forEach((d) => {
      const wrongs = pickWrongs(WEEKDAYS_CYCLE, (x) => x.en === d.en, 3);
      qs.push({
        questionText: `What day is ${d.tib}?`,
        prominentTibetan: d.tib,
        answer: d.en,
        audioString: d.tib,
        choices: shuffle([d, ...wrongs]).map((c) => ({ value: c.en, label: c.en })),
      });
    });
  return shuffle(qs).slice(0, 10);
}

export function generateTimeQuiz(): QuizQuestion[] {
  const bank: QuizQuestion[] = [
    { questionText: "How do you say 'It is 1 o'clock.'?", answer: "ཆུ་ཚོད་དང་པོ་རེད།", audioString: "ཆུ་ཚོད་དང་པོ་རེད།", choices: shuffle(CLOCK_EXAMPLES).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) },
    { questionText: "How do you say 'It is 3 o'clock.'?", answer: "ཆུ་ཚོད་གསུམ་པ་རེད།", audioString: "ཆུ་ཚོད་གསུམ་པ་རེད།", choices: shuffle(CLOCK_EXAMPLES).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) },
    { questionText: "How do you say 'It is 5 o'clock.'?", answer: "ཆུ་ཚོད་ལྔ་པ་རེད།", audioString: "ཆུ་ཚོད་ལྔ་པ་རེད།", choices: shuffle(CLOCK_EXAMPLES).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) },
    { questionText: "How do you say 'It is 10 o'clock.'?", answer: "ཆུ་ཚོད་བཅུ་པ་རེད།", audioString: "ཆུ་ཚོད་བཅུ་པ་རེད།", choices: shuffle(CLOCK_EXAMPLES).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) },
    { questionText: "What does ཆུ་ཚོད་ག་ཚོད་རེད། mean?", prominentTibetan: "ཆུ་ཚོད་ག་ཚོད་རེད།", answer: "What time is it?", audioString: "ཆུ་ཚོད་ག་ཚོད་རེད།", choices: shuffle(["What time is it?", "What day is it today?", "What is your phone number?", "It is 5 o'clock."]).map((s) => ({ value: s, label: s })) },
    { questionText: "Which question word is used for clock time ('how much / how many')?", answer: "ག་ཚོད་", noAudio: true, choices: shuffle(["ག་ཚོད་", "ག་རེ་", "སུ་", "གཟའ་"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "Which word means 'minute'?", answer: "སྐར་མ།", audioString: "སྐར་མ།", choices: shuffle(["སྐར་མ།", "ཆུ་ཚོད།", "གཟའ།", "ཨང་གྲངས།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "How do you say 'at 10 o'clock'?", answer: "ཆུ་ཚོད་བཅུ་པར་", noAudio: true, choices: shuffle(["ཆུ་ཚོད་བཅུ་པར་", "ཆུ་ཚོད་བཅུ་པ་རེད།", "ཆུ་ཚོད་དང་པོ་རེད།", "སྐར་མ་བཅུ།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "What does ཆུ་ཚོད་བཞི་པ་དང་སྐར་མ་བཅུ། mean?", prominentTibetan: "ཆུ་ཚོད་བཞི་པ་དང་སྐར་མ་བཅུ།", answer: "4:10", noAudio: true, choices: shuffle(["4:10", "10:04", "5:10", "4:20"]).map((s) => ({ value: s, label: s })) },
    { questionText: "What does ཆུ་ཚོད་ལྔ་པ་རེད། mean?", prominentTibetan: "ཆུ་ཚོད་ལྔ་པ་རེད།", answer: "It is 5 o'clock.", audioString: "ཆུ་ཚོད་ལྔ་པ་རེད།", choices: shuffle(["It is 5 o'clock.", "It is 10 o'clock.", "It is 3 o'clock.", "It is 1 o'clock."]).map((s) => ({ value: s, label: s })) },
  ];
  return shuffle(bank);
}

export interface Unit2PracticeDrills {
  numberRecognition: QuizQuestion[];
  numberBuilding: QuizQuestion[];
  daysOfWeek: QuizQuestion[];
  clockTime: QuizQuestion[];
  conversation: QuizQuestion[];
  listening: QuizQuestion[];
}

export function generatePracticeDrills(): Unit2PracticeDrills {
  const listeningPool = shuffle(VOCAB.slice(0, 24))
    .slice(0, 6)
    .map((v) => {
      const wrongs = pickWrongs(VOCAB, (x) => x.tib === v.tib, 3);
      return {
        isAudioType: true,
        questionText: `Listen and select the Tibetan word for "${v.pron}"`,
        answer: v.tib,
        audioString: v.tib,
        choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })),
      };
    });

  return {
    numberRecognition: shuffle([
      { promptText: "སྟོང་གཅིག", answer: "1000", audioString: "སྟོང་གཅིག", choices: ["10", "100", "1000", "10,000"].map((s) => ({ value: s, label: s })) },
      { promptText: "བརྒྱ།", answer: "100", audioString: "བརྒྱ།", choices: ["10", "100", "1000", "200"].map((s) => ({ value: s, label: s })) },
      { promptText: "ཉི་ཤུ།", answer: "20", audioString: "ཉི་ཤུ།", choices: ["12", "20", "30", "2"].map((s) => ({ value: s, label: s })) },
      { promptText: "བདུན།", answer: "7", audioString: "བདུན།", choices: ["6", "7", "8", "9"].map((s) => ({ value: s, label: s })) },
      { promptText: "ཀླད་ཀོར།", answer: "0", audioString: "ཀླད་ཀོར།", choices: ["0", "1", "10", "100"].map((s) => ({ value: s, label: s })) },
      { promptText: "བརྒྱད།", answer: "8", audioString: "བརྒྱད།", choices: ["5", "7", "8", "9"].map((s) => ({ value: s, label: s })) },
    ]),
    numberBuilding: shuffle([
      { promptText: "32", promptEnd: "The thirties take སོ.", answer: "སུམ་ཅུ་སོ་གཉིས།", noAudio: true, choices: shuffle(["སུམ་ཅུ་སོ་གཉིས།", "སུམ་ཅུ་རྩ་གཉིས།", "བཅུ་གཉིས།", "གསུམ་གཉིས།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "21", promptEnd: "The twenties take རྩ.", answer: "ཉི་ཤུ་རྩ་གཅིག", noAudio: true, choices: shuffle(["ཉི་ཤུ་རྩ་གཅིག", "ཉི་ཤུ་སོ་གཅིག", "བཅུ་གཅིག", "ཉི་ཤུ་ང་གཅིག"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "54", promptEnd: "The fifties take ང.", answer: "ལྔ་བཅུ་ང་བཞི།", noAudio: true, choices: shuffle(["ལྔ་བཅུ་ང་བཞི།", "ལྔ་བཅུ་ཞེ་བཞི།", "བཞི་བཅུ་ང་ལྔ།", "ལྔ་བཅུ་རེ་བཞི།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "65", promptEnd: "The sixties take རེ.", answer: "དྲུག་ཅུ་རེ་ལྔ།", noAudio: true, choices: shuffle(["དྲུག་ཅུ་རེ་ལྔ།", "དྲུག་ཅུ་དོན་ལྔ།", "དྲུག་ཅུ་ང་ལྔ།", "ལྔ་བཅུ་རེ་དྲུག"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "87", promptEnd: "The eighties take གྱ.", answer: "བརྒྱད་ཅུ་གྱ་བདུན།", noAudio: true, choices: shuffle(["བརྒྱད་ཅུ་གྱ་བདུན།", "བརྒྱད་ཅུ་གོ་བདུན།", "བདུན་ཅུ་དོན་བརྒྱད།", "བརྒྱད་ཅུ་དོན་བདུན།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    ]),
    daysOfWeek: shuffle(WEEKDAYS_CYCLE)
      .slice(0, 5)
      .map((d) => {
        const wrongs = pickWrongs(WEEKDAYS_CYCLE, (x) => x.tib === d.tib, 3);
        return {
          promptText: d.en,
          answer: d.tib,
          audioString: d.tib,
          choices: shuffle([d, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })),
        };
      }),
    clockTime: shuffle([
      { promptText: "The word for 'minute'", answer: "སྐར་མ།", audioString: "སྐར་མ།", choices: shuffle(["ཨང་གྲངས།", "ཆུ་ཚོད།", "སྐར་མ།", "གཟའ།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "It is 5 o'clock.", answer: "ཆུ་ཚོད་ལྔ་པ་རེད།", audioString: "ཆུ་ཚོད་ལྔ་པ་རེད།", choices: shuffle(CLOCK_EXAMPLES).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) },
      { promptText: "It is 1 o'clock.", answer: "ཆུ་ཚོད་དང་པོ་རེད།", audioString: "ཆུ་ཚོད་དང་པོ་རེད།", choices: shuffle(CLOCK_EXAMPLES).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) },
      { promptText: "It is 3 o'clock.", answer: "ཆུ་ཚོད་གསུམ་པ་རེད།", audioString: "ཆུ་ཚོད་གསུམ་པ་རེད།", choices: shuffle(CLOCK_EXAMPLES).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) },
      { promptText: "What time is it?", answer: "ཆུ་ཚོད་ག་ཚོད་རེད།", audioString: "ཆུ་ཚོད་ག་ཚོད་རེད།", choices: shuffle(["ཆུ་ཚོད་ག་ཚོད་རེད།", "དེ་རིང་གཟའ་ག་རེ་རེད།", "ཁྱེད་རང་གི་ཁ་པར་ཨང་གྲངས་ག་རེ་རེད།", "འགྲིག་གི་རེད།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    ]),
    conversation: shuffle([
      { promptText: "Someone asks:", promptHighlight: "དེ་རིང་གཟའ་ག་རེ་རེད།", promptEnd: "Choose the natural reply:", answer: "དེ་རིང་གཟའ་ལྷག་པ་རེད།", noAudio: true, choices: shuffle(["དེ་རིང་གཟའ་ལྷག་པ་རེད།", "ཆུ་ཚོད་ལྔ་པ་རེད།", "ཐུགས་རྗེ་ཆེ།", "འགྲིག་གི་རེད།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "Someone asks:", promptHighlight: "ཆུ་ཚོད་ག་ཚོད་རེད།", promptEnd: "Choose the natural reply:", answer: "ཆུ་ཚོད་ལྔ་པ་རེད།", noAudio: true, choices: shuffle(["ཆུ་ཚོད་ལྔ་པ་རེད།", "སང་ཉིན་གཟའ་ཕུར་བུ་རེད།", "ཁྱེད་རང་གི་ཁ་པར་ཨང་གྲངས་ག་རེ་རེད།", "ལགས་སོ།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "Lhamo suggests:", promptHighlight: "སང་ཉིན་ཆུ་ཚོད་བཅུ་པར་ཐུག་ག", promptEnd: "How does Tashi agree?", answer: "འགྲིག་གི་རེད།", noAudio: true, choices: shuffle(["འགྲིག་གི་རེད།", "དེ་རིང་གཟའ་ག་རེ་རེད།", "ཆུ་ཚོད་ག་ཚོད་རེད།", "ཀླད་ཀོར།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "You want to ask a classmate for their phone number:", answer: "ཁྱེད་རང་གི་ཁ་པར་ཨང་གྲངས་ག་རེ་རེད།", noAudio: true, choices: shuffle(["ཁྱེད་རང་གི་ཁ་པར་ཨང་གྲངས་ག་རེ་རེད།", "ཆུ་ཚོད་ག་ཚོད་རེད།", "དེ་རིང་གཟའ་ག་རེ་རེད།", "སང་ཉིན་ཆུ་ཚོད་བཅུ་པར་ཐུག་ག"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "How do you say 'Tomorrow is Thursday.'?", answer: "སང་ཉིན་གཟའ་ཕུར་བུ་རེད།", noAudio: true, choices: shuffle(["སང་ཉིན་གཟའ་ཕུར་བུ་རེད།", "དེ་རིང་གཟའ་ལྷག་པ་རེད།", "ཆུ་ཚོད་བཅུ་པ་རེད།", "སང་ཉིན་མཇལ་ཡོང་།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    ]),
    listening: listeningPool,
  };
}

export function generateFinalQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];
  qs.push(...shuffle(generateVocabQuiz()).slice(0, 12));
  qs.push(...shuffle(generatePhrasesQuiz()).slice(0, 8));
  qs.push(...shuffle(generateNumbersQuiz()).slice(0, 7));
  qs.push(...shuffle(generateDaysQuiz()).slice(0, 5));
  qs.push(...shuffle(generateTimeQuiz()).slice(0, 5));

  const digitAndCultureQs: QuizQuestion[] = [
    { questionText: "Which Arabic numeral corresponds to the Tibetan digit ༧?", answer: "7", noAudio: true, choices: shuffle(["7", "5", "8", "9"]).map((s) => ({ value: s, label: s })) },
    { questionText: "Which Arabic numeral corresponds to the Tibetan digit ༤?", answer: "4", noAudio: true, choices: shuffle(["4", "2", "6", "9"]).map((s) => ({ value: s, label: s })) },
    { questionText: "What does གཟའ་ (za) literally mean in Tibetan weekday names?", answer: "Planet / celestial body", noAudio: true, choices: shuffle(["Planet / celestial body", "Hour / o'clock", "Earring", "Number"]).map((s) => ({ value: s, label: s })) },
    { questionText: "What number is ཁྲི་གཅིག (thri-chik)?", prominentTibetan: "ཁྲི་གཅིག", answer: "10,000", noAudio: true, choices: shuffle(["10,000", "1,000", "100,000", "1,000,000"]).map((s) => ({ value: s, label: s })) },
  ];
  qs.push(...shuffle(digitAndCultureQs).slice(0, 3));
  return shuffle(qs).slice(0, 40);
}
