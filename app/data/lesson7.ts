// app/data/lesson7.ts

export type Concept = "consonants" | "vowels" | "superscripts" | "subscripts" | "prefixes" | "suffixes";

export interface MCQuestion {
  kind: "mc";
  id: string;
  concept: Concept;
  promptType: "how-read" | "which-vowel" | "tone" | "vocab";
  promptTarget: string; // The Tibetan text or English word
  promptSub?: string;   // Optional secondary target (like a root letter)
  choices: { key: string; label: string }[];
  answerKey: string;
}

export interface RootPickQuestion {
  kind: "root";
  id: string;
  concept: Concept;
  cluster: string;
  translit: string;
  tiles: string[];
  answer: string;
}

export interface OrderQuestion {
  kind: "order";
  id: string;
  concept: Concept;
  cluster: string;
  translit: string;
  steps: string[];
}

export interface ListenQuestion {
  kind: "listen";
  id: string;
  concept: Concept;
  spoken: string;
  choices: { tib: string; translit: string }[];
  answerTib: string;
}

export type Question = MCQuestion | RootPickQuestion | OrderQuestion | ListenQuestion;

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].map((v) => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map((x) => x.v);
}

const CONSONANTS = [
  { tib: "ཀ", translit: "ka" }, { tib: "ཁ", translit: "kha" }, { tib: "ག", translit: "ga" }, { tib: "ང", translit: "nga" },
  { tib: "ཅ", translit: "cha" }, { tib: "ཆ", translit: "chha" }, { tib: "ཇ", translit: "ja" }, { tib: "ཉ", translit: "nya" },
  { tib: "ཏ", translit: "ta" }, { tib: "ཐ", translit: "tha" }, { tib: "ད", translit: "da" }, { tib: "ན", translit: "na" },
  { tib: "པ", translit: "pa" }, { tib: "ཕ", translit: "pha" }, { tib: "བ", translit: "ba" }, { tib: "མ", translit: "ma" },
  { tib: "ཙ", translit: "tsa" }, { tib: "ཞ", translit: "zha" }, { tib: "ཟ", translit: "za" }, { tib: "འ", translit: "a" },
  { tib: "ཡ", translit: "ya" }, { tib: "ར", translit: "ra" }, { tib: "ལ", translit: "la" }, { tib: "ཤ", translit: "sha" },
  { tib: "ས", translit: "sa" }, { tib: "ཧ", translit: "ha" }, { tib: "ཨ", translit: "ah" },
];

const VOWELS = [
  { tib: "ཀི", base: "ཀ", translit: "ki" }, { tib: "ཀུ", base: "ཀ", translit: "ku" },
  { tib: "ཀེ", base: "ཀ", translit: "ke" }, { tib: "ཀོ", base: "ཀ", translit: "ko" },
  { tib: "མི", base: "མ", translit: "mi" }, { tib: "ལུ", base: "ལ", translit: "lu" },
];

const STACKS = [
  { cluster: "ལག", translit: "lak", parts: ["ལ", "ག"], root: "ལ" },
  { cluster: "ནག", translit: "nak", parts: ["ན", "ག"], root: "ན" },
  { cluster: "ཁང་", translit: "khang", parts: ["ཁ", "ང"], root: "ཁ" },
  { cluster: "གངས་", translit: "gang", parts: ["ག", "ང", "ས"], root: "ག" },
  { cluster: "ཁམས་", translit: "kham", parts: ["ཁ", "མ", "ས"], root: "ཁ" },
  { cluster: "ནགས་", translit: "nak", parts: ["ན", "ག", "ས"], root: "ན" },
  { cluster: "དཀར་", translit: "kar", parts: ["ད", "ཀ", "ར"], root: "ཀ" },
  { cluster: "དགའ་", translit: "ga", parts: ["ད", "ག", "འ"], root: "ག" },
  { cluster: "མདངས་", translit: "dang", parts: ["མ", "ད", "ང", "ས"], root: "ད" },
];

const PREFIX_TONE: { prefix: string; root: string; cluster: string; translit: string; tone: "high" | "low" }[] = [
  { prefix: "ད", root: "ཀ", cluster: "དཀ", translit: "ka", tone: "high" },
  { prefix: "ད", root: "ག", cluster: "དག", translit: "ga", tone: "high" },
  { prefix: "བ", root: "ཀ", cluster: "བཀ", translit: "ka", tone: "high" },
  { prefix: "མ", root: "ག", cluster: "མག", translit: "ga", tone: "low" },
  { prefix: "འ", root: "ག", cluster: "འག", translit: "ga", tone: "low" },
  { prefix: "ག", root: "ཙ", cluster: "གཙ", translit: "tsa", tone: "high" },
];

const VOCAB = [
  { tib: "རྟ", translit: "ta", en: "horse" }, { tib: "སྒྲ", translit: "dra", en: "sound" },
  { tib: "དགེ", translit: "ge", en: "virtuous" }, { tib: "སྐྱ་སྐྱ", translit: "kya-kya", en: "pale / grey" },
  { tib: "ལག", translit: "lak", en: "hand" }, { tib: "ནག", translit: "nak", en: "black" },
  { tib: "གངས", translit: "gang", en: "snow" }, { tib: "ནགས", translit: "nak", en: "forest" },
  { tib: "ཁམས", translit: "kham", en: "region (Kham)" }, { tib: "ཁང", translit: "khang", en: "house" },
  { tib: "མི", translit: "mi", en: "person" }, { tib: "བོད", translit: "bö", en: "Tibet" },
  { tib: "ཟླ", translit: "da", en: "moon" }, { tib: "རྒྱལ", translit: "gyal", en: "king / victory" },
];

const LISTEN_GROUPS: { concept: Concept; items: { tib: string; translit: string }[] }[] = [
  { concept: "consonants", items: [{ tib: "ཀ", translit: "ka" }, { tib: "ཁ", translit: "kha" }, { tib: "ག", translit: "ga" }, { tib: "ང", translit: "nga" }] },
  { concept: "consonants", items: [{ tib: "ཏ", translit: "ta" }, { tib: "ཐ", translit: "tha" }, { tib: "ད", translit: "da" }, { tib: "ན", translit: "na" }] },
  { concept: "subscripts", items: [{ tib: "རྟ", translit: "ta" }, { tib: "སྒྲ", translit: "dra" }, { tib: "སྐྱ", translit: "kya" }, { tib: "རྒྱ", translit: "gya" }] },
  { concept: "vowels", items: [{ tib: "ཀི", translit: "ki" }, { tib: "ཀུ", translit: "ku" }, { tib: "ཀེ", translit: "ke" }, { tib: "ཀོ", translit: "ko" }] },
  { concept: "suffixes", items: [{ tib: "ལག", translit: "lak" }, { tib: "ནག", translit: "nak" }, { tib: "གངས", translit: "gang" }, { tib: "ཁམས", translit: "kham" }] },
  { concept: "prefixes", items: [{ tib: "དགེ", translit: "ge" }, { tib: "དཀར", translit: "kar" }, { tib: "དགའ", translit: "ga" }, { tib: "མདངས", translit: "dang" }] },
];

export function buildBank(): Question[] {
  const qs: Question[] = [];

  for (const c of shuffle(CONSONANTS).slice(0, 5)) {
    const wrong = shuffle(CONSONANTS.filter((x) => x.translit !== c.translit)).slice(0, 3);
    qs.push({
      kind: "mc", id: `cons-${c.tib}`, concept: "consonants",
      promptType: "how-read", promptTarget: c.tib,
      choices: shuffle([c, ...wrong]).map((x) => ({ key: x.translit, label: x.translit })), answerKey: c.translit,
    });
  }

  for (const v of shuffle(VOWELS).slice(0, 3)) {
    const wrong = shuffle(VOWELS.filter((x) => x.translit !== v.translit)).slice(0, 3);
    qs.push({
      kind: "mc", id: `vow-${v.tib}`, concept: "vowels",
      promptType: "which-vowel", promptTarget: v.tib,
      choices: shuffle([v, ...wrong]).map((x) => ({ key: x.translit, label: `[${x.translit}]` })), answerKey: v.translit,
    });
  }

  for (const s of shuffle(STACKS).slice(0, 5)) {
    const others = CONSONANTS.filter((c) => !s.parts.includes(c.tib));
    const distractors = shuffle(others).slice(0, 4 - s.parts.length);
    const tiles = shuffle([...s.parts, ...distractors.map((d) => d.tib)]);
    qs.push({
      kind: "root", id: `root-${s.cluster}`,
      concept: ["ད", "བ", "མ", "འ", "ག"].includes(s.parts[0]) && s.parts.length >= 3 ? "prefixes" : "suffixes",
      cluster: s.cluster, translit: s.translit, tiles, answer: s.root,
    });
  }

  for (const p of shuffle(PREFIX_TONE).slice(0, 4)) {
    qs.push({
      kind: "mc", id: `tone-${p.cluster}`, concept: "prefixes",
      promptType: "tone", promptTarget: p.cluster, promptSub: p.root,
      choices: shuffle([{ key: "high", label: "High tone" }, { key: "low", label: "Low tone" }]), answerKey: p.tone,
    });
  }

  const orderPool = [
    { cluster: "སྐྱ", translit: "kya", steps: ["ས", "ཀ", "བཏགས", "སྐ", "ཡ", "བཏགས", "སྐྱ"] },
    { cluster: "རྒྱ", translit: "gya", steps: ["ར", "ག", "བཏགས", "རྒ", "ཡ", "བཏགས", "རྒྱ"] },
    { cluster: "དགེ", translit: "ge", steps: ["ད", "ག", "དག", "ེ", "དགེ"] },
    { cluster: "བཀྲ", translit: "tra", steps: ["བ", "ཀ", "ར", "བཏགས", "བཀྲ"] },
  ];
  for (const o of shuffle(orderPool).slice(0, 3)) {
    qs.push({
      kind: "order", id: `order-${o.cluster}`, concept: "subscripts",
      cluster: o.cluster, translit: o.translit, steps: o.steps,
    });
  }

  for (const w of shuffle(VOCAB).slice(0, 6)) {
    const wrong = shuffle(VOCAB.filter((x) => x.tib !== w.tib)).slice(0, 3);
    qs.push({
      kind: "mc", id: `vocab-${w.tib}`, concept: "suffixes",
      promptType: "vocab", promptTarget: w.en,
      choices: shuffle([w, ...wrong]).map((x) => ({ key: x.tib, label: x.tib })), answerKey: w.tib,
    });
  }

  for (const g of shuffle(LISTEN_GROUPS).slice(0, 5)) {
    const target = g.items[Math.floor(Math.random() * g.items.length)];
    qs.push({
      kind: "listen", id: `listen-${target.tib}`, concept: g.concept,
      spoken: target.translit, choices: shuffle(g.items), answerTib: target.tib,
    });
  }

  return shuffle(qs);
}

export const STEPS = [
  { id: "overview", eyebrow: "Section 01", title: "What this capstone covers" },
  { id: "assessment", eyebrow: "Section 02", title: "The assessment" },
  { id: "result", eyebrow: "Section 03", title: "Your result" },
];

export const CONCEPT_LABEL: Record<Concept, { name: string; to: string }> = {
  consonants: { name: "The 30 Consonants", to: "/dashboard/lessons/1" },
  vowels: { name: "The Four Vowels", to: "/dashboard/lessons/2" },
  superscripts: { name: "Superscripts", to: "/dashboard/lessons/3" },
  subscripts: { name: "Subscripts", to: "/dashboard/lessons/4" },
  prefixes: { name: "The Five Prefixes", to: "/dashboard/lessons/5" },
  suffixes: { name: "Suffixes & Post-suffixes", to: "/dashboard/lessons/6" }, 
};