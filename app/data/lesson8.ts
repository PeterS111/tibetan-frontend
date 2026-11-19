// app/data/lesson8.ts

import { QuizQuestion } from "@/app/components/QuizModule";

export type VocabCategory = "classroom" | "people" | "time";

export interface Lesson8Vocab {
  tib: string;
  pron: string;
  translit: string;
  en: string;
  emoji: string;
  category: VocabCategory;
}

export interface WordPart {
  tib: string;
  pron: string;
  gloss: string;
}

export interface UsefulPhrase {
  id: string;
  tib: string;
  pron: string;
  en: string;
  contextNote?: string;
  breakdown: WordPart[];
}

export interface PronounItem {
  tib: string;
  pron: string;
  en: string;
  number: "singular" | "plural";
  honorific?: boolean;
}

export interface DemonstrativeItem {
  tib: string;
  pron: string;
  en: string;
}

export interface CopulaRow {
  subjectTib: string;
  subjectEn: string;
  affirmativeTib: string;
  affirmativePron: string;
  negativeTib: string;
  negativePron: string;
}

export interface CopulaExample {
  tib: string;
  pron: string;
  en: string;
  polarity: "affirmative" | "negative";
}

export interface DialogueLine {
  speaker: string;
  speakerInitial: string;
  side: "left" | "right";
  tib: string;
  pron: string;
  en: string;
}

export interface DialogueThread {
  id: string;
  title: string;
  subtitle: string;
  lines: DialogueLine[];
}

export interface ClassroomCommand {
  num: string;
  tib: string;
  pron: string;
  en: string;
  breakdown: WordPart[];
}

export interface CultureNote {
  id: string;
  badge: string;
  title: string;
  fallbackImage: string;
  paragraphs: string[];
}

export const VOCAB_CATEGORIES: { id: VocabCategory; label: string; hex: string }[] = [
  { id: "classroom", label: "In the Classroom", hex: "#0ea5e9" },
  { id: "people", label: "People", hex: "#f59e0b" },
  { id: "time", label: "Time Words", hex: "#8b5cf6" },
];

export const VOCAB: Lesson8Vocab[] = [
  { tib: "དེབ།", pron: "deb", translit: "deb", en: "book", emoji: "📕", category: "classroom" },
  { tib: "དགེ་རྒན།", pron: "gegen", translit: "gegen", en: "teacher", emoji: "👨‍🏫", category: "classroom" },
  { tib: "སློབ་ཕྲུག", pron: "lobthruk", translit: "lobthruk", en: "student", emoji: "🧑‍🎓", category: "classroom" },
  { tib: "ཅོག་ཙེ།", pron: "chogtse", translit: "chogtse", en: "table", emoji: "🪑", category: "classroom" },
  { tib: "རྐུབ་བཀྱག", pron: "kubkyag", translit: "kubkyag", en: "chair", emoji: "💺", category: "classroom" },
  { tib: "དཀར་པང་།", pron: "karpang", translit: "karpang", en: "whiteboard", emoji: "🏫", category: "classroom" },
  { tib: "སྨྱུ་གུ", pron: "nyugu", translit: "nyugu", en: "pen", emoji: "🖊️", category: "classroom" },
  { tib: "སྒོ།", pron: "go", translit: "go", en: "door", emoji: "🚪", category: "classroom" },
  { tib: "སྒེའུ་ཁུང་།", pron: "geu khung", translit: "geu khung", en: "window", emoji: "🪟", category: "classroom" },
  { tib: "བུ།", pron: "bu", translit: "bu", en: "boy", emoji: "👦", category: "people" },
  { tib: "བུ་མོ།", pron: "bumo", translit: "bumo", en: "girl", emoji: "👧", category: "people" },
  { tib: "ཨ་མ།", pron: "ama", translit: "ama", en: "mother", emoji: "👩", category: "people" },
  { tib: "པ་ལགས།", pron: "pa-la", translit: "pa-la", en: "father", emoji: "👨", category: "people" },
  { tib: "བོད་པ།", pron: "böpa", translit: "böpa", en: "a Tibetan", emoji: "🏔️", category: "people" },
  { tib: "མི།", pron: "mi", translit: "mi", en: "person / people", emoji: "🧍", category: "people" },
  { tib: "དེ་རིང་།", pron: "dering", translit: "dering", en: "today", emoji: "📅", category: "time" },
  { tib: "ཁ་སང་།", pron: "khasang", translit: "khasang", en: "yesterday", emoji: "⏪", category: "time" },
  { tib: "སང་ཉིན།", pron: "sangnyin", translit: "sangnyin", en: "tomorrow", emoji: "⏩", category: "time" },
];

export const USEFUL_PHRASES: UsefulPhrase[] = [
  { id: "p1", tib: "བཀྲ་ཤིས་བདེ་ལེགས།", pron: "tashi delek", en: "Hello.", breakdown: [{ tib: "བཀྲ་ཤིས་", pron: "tashi", gloss: "auspiciousness / good fortune" }, { tib: "བདེ་ལེགས་", pron: "delek", gloss: "happiness / well-being" }] },
  { id: "p2", tib: "བདེ་པོ་ཡིན་པས།", pron: "depo yin pä?", en: "How are you?", breakdown: [{ tib: "བདེ་པོ་", pron: "depo", gloss: "well / healthy" }, { tib: "ཡིན་", pron: "yin", gloss: "to be (copula)" }, { tib: "པས་", pron: "pä", gloss: "yes/no question particle" }] },
  { id: "p3", tib: "ཁམས་བཟང་།", pron: "khamzang", en: "Hello. (informal)", breakdown: [{ tib: "ཁམས་", pron: "kham", gloss: "constitution / health" }, { tib: "བཟང་", pron: "zang", gloss: "good / fine" }] },
  { id: "p4", tib: "བཞུགས་ཨ།", pron: "dhe a", en: "(Good)bye — said by the one leaving.", breakdown: [{ tib: "བཞུགས་", pron: "zhug / dhe", gloss: "stay / remain (honorific)" }, { tib: "ཨ་", pron: "a", gloss: "warm polite particle" }] },
  { id: "p5", tib: "ག་ལེར་ཕེབས།", pron: "galer pheb", en: "(Good)bye — said by the one staying.", breakdown: [{ tib: "ག་ལེར་", pron: "galer", gloss: "slowly / gently" }, { tib: "ཕེབས་", pron: "pheb", gloss: "go / walk (honorific)" }] },
  { id: "p6", tib: "སང་ཉིན་མཇལ་ཡོང་།", pron: "sangnyin jäl yong", en: "See you tomorrow.", breakdown: [{ tib: "སང་ཉིན་", pron: "sangnyin", gloss: "tomorrow" }, { tib: "མཇལ་", pron: "jäl", gloss: "meet / see (honorific)" }, { tib: "ཡོང་", pron: "yong", gloss: "will (future auxiliary)" }] },
  { id: "p7", tib: "མཇལ་ཡོང་།", pron: "jäl yong", en: "See you.", breakdown: [{ tib: "མཇལ་", pron: "jäl", gloss: "meet / see (honorific)" }, { tib: "ཡོང་", pron: "yong", gloss: "will (future auxiliary)" }] },
  { id: "p8", tib: "ཁྱེད་རང་སུ་ཡིན།", pron: "kherang su yin?", en: "Who are you?", contextNote: "Best used on the phone; face to face it can sound direct.", breakdown: [{ tib: "ཁྱེད་རང་", pron: "kherang", gloss: "you (polite)" }, { tib: "སུ་", pron: "su", gloss: "who" }, { tib: "ཡིན་", pron: "yin", gloss: "are (copula)" }] },
  { id: "p9", tib: "ཐུགས་རྗེ་ཆེ།", pron: "thuk je che", en: "Thank you.", breakdown: [{ tib: "ཐུགས་རྗེ་", pron: "thuk je", gloss: "compassion / kindness (H)" }, { tib: "ཆེ་", pron: "che", gloss: "great" }] },
  { id: "p10", tib: "གལ་ཡོད་མ་རེད། ཡར་ཕེབས་ཤོག། བཞུགས།", pron: "gäl yö ma re. yar pheb shog. zhug.", en: "Never mind. Please come in. Have a seat.", breakdown: [{ tib: "གལ་ཡོད་མ་རེད་", pron: "gäl yö ma re", gloss: "never mind" }, { tib: "ཡར་ཕེབས་ཤོག་", pron: "yar pheb shog", gloss: "please come in (H)" }, { tib: "བཞུགས་", pron: "zhug", gloss: "please sit (H)" }] },
  { id: "p11", tib: "དགོངས་དག", pron: "gong da", en: "Sorry.", breakdown: [{ tib: "དགོངས་", pron: "gong", gloss: "mind / thought (H)" }, { tib: "དག་", pron: "da", gloss: "clear / forgive" }] },
  { id: "p12", tib: "ང་རྗེས་ལུས་ཐེབས་སོང་།", pron: "nga jelü thep song", en: "I'm late.", breakdown: [{ tib: "ང་", pron: "nga", gloss: "I" }, { tib: "རྗེས་ལུས་", pron: "jelü", gloss: "behind / late" }, { tib: "ཐེབས་སོང་", pron: "thep song", gloss: "ended up / happened" }] },
  { id: "p13", tib: "འདི་ག་རེ་རེད།", pron: "di gare re?", en: "What is it?", breakdown: [{ tib: "འདི་", pron: "di", gloss: "this" }, { tib: "ག་རེ་", pron: "gare", gloss: "what" }, { tib: "རེད་", pron: "re", gloss: "is" }] },
  { id: "p14", tib: "ཁོང་སུ་རེད།", pron: "khong su re?", en: "Who is he / she?", breakdown: [{ tib: "ཁོང་", pron: "khong", gloss: "he / she (honorific)" }, { tib: "སུ་", pron: "su", gloss: "who" }, { tib: "རེད་", pron: "re", gloss: "is" }] },
];

export const PRONOUNS: PronounItem[] = [
  { tib: "ང་", pron: "nga", en: "I", number: "singular" },
  { tib: "ཁྱེད་རང་", pron: "kherang", en: "you", number: "singular" },
  { tib: "ཁོང་རང་ / མོ་རང་", pron: "khong rang / mo rang", en: "he / she", number: "singular" },
  { tib: "ཁོང་", pron: "khong", en: "he / she (H)", number: "singular", honorific: true },
  { tib: "ང་ཚོ་", pron: "nga tso", en: "we", number: "plural" },
  { tib: "ཁྱེད་རང་ཚོ་", pron: "kherang tso", en: "you (pl.)", number: "plural" },
  { tib: "ཁོང་རང་ཚོ་", pron: "khong rang tso", en: "they", number: "plural" },
  { tib: "ཁོང་ཚོ་", pron: "khong tso", en: "they (H)", number: "plural", honorific: true },
];

export const DEMONSTRATIVES: DemonstrativeItem[] = [
  { tib: "འདི་", pron: "di", en: "this" },
  { tib: "འདི་ཚོ་", pron: "di tso", en: "these" },
  { tib: "དེ་", pron: "de", en: "that" },
  { tib: "དེ་ཚོ་", pron: "de tso", en: "those" },
];

export const COPULA_ROWS: CopulaRow[] = [
  { subjectTib: "ང་", subjectEn: "I", affirmativeTib: "ཡིན།", affirmativePron: "yin", negativeTib: "མིན།", negativePron: "min" },
  { subjectTib: "ང་ཚོ་", subjectEn: "we", affirmativeTib: "ཡིན། [རེད།]", affirmativePron: "yin [re]", negativeTib: "མིན། [མ་རེད།]", negativePron: "min [ma re]" },
  { subjectTib: "ཁྱེད་རང་", subjectEn: "you", affirmativeTib: "རེད།", affirmativePron: "re", negativeTib: "མ་རེད།", negativePron: "ma re" },
  { subjectTib: "ཁོང་", subjectEn: "he / she / they", affirmativeTib: "རེད།", affirmativePron: "re", negativeTib: "མ་རེད།", negativePron: "ma re" },
];

export const COPULA_EXAMPLES: CopulaExample[] = [
  { tib: "ང་བོད་པ་ཡིན།", pron: "nga böpa yin", en: "I am Tibetan.", polarity: "affirmative" },
  { tib: "ང་བོད་པ་མིན།", pron: "nga böpa min", en: "I am not Tibetan.", polarity: "negative" },
  { tib: "ཁོང་དགེ་རྒན་རེད།", pron: "khong gegen re", en: "He is a teacher.", polarity: "affirmative" },
  { tib: "འདི་དེབ་མ་རེད།", pron: "di deb ma re", en: "This is not a book.", polarity: "negative" },
];

export const DIALOGUES: DialogueThread[] = [
  {
    id: "d1", title: "Who is he?", subtitle: "The teacher introduces a new student.",
    lines: [
      { speaker: "Teacher", speakerInitial: "T", side: "left", tib: "བཀྲ་ཤིས་བདེ་ལེགས།", pron: "tashi delek", en: "Hello." },
      { speaker: "Student", speakerInitial: "S", side: "right", tib: "བཀྲ་ཤིས་བདེ་ལེགས།", pron: "tashi delek", en: "Hello." },
      { speaker: "Teacher", speakerInitial: "T", side: "left", tib: "ཁོང་སུ་རེད།", pron: "khong su re?", en: "Who is he?" },
      { speaker: "Student", speakerInitial: "S", side: "right", tib: "འདི་བསྟན་འཛིན་རེད།", pron: "di tendzin re", en: "This is Tenzin." },
    ],
  },
  {
    id: "d2", title: "Arriving late", subtitle: "A student comes in after the lesson has started.",
    lines: [
      { speaker: "Student", speakerInitial: "S", side: "left", tib: "བཀྲ་ཤིས་བདེ་ལེགས། དགེ་རྒན་ལགས། དགོངས་དག ང་རྗེས་ལུས་ཐེབས་སོང་།", pron: "tashi delek, gegen la. gong da, nga jelü thep song.", en: "Hello, teacher. Sorry, I'm late." },
      { speaker: "Teacher", speakerInitial: "T", side: "right", tib: "གལ་ཡོད་མ་རེད། ཡར་ཕེབས་ཤོག། བཞུགས།", pron: "gäl yö ma re. yar pheb shog. zhug.", en: "Never mind. Please come in. Have a seat." },
    ],
  },
  {
    id: "d3", title: "How are you?", subtitle: "Two classmates meet.",
    lines: [
      { speaker: "Lhamo", speakerInitial: "L", side: "left", tib: "ཁམས་བཟང་།", pron: "khamzang", en: "Hello. (informal)" },
      { speaker: "Tashi", speakerInitial: "T", side: "right", tib: "ཁམས་བཟང་།", pron: "khamzang", en: "Hello. (informal)" },
      { speaker: "Lhamo", speakerInitial: "L", side: "left", tib: "བདེ་པོ་ཡིན་པས།", pron: "depo yin pä?", en: "How are you?" },
      { speaker: "Tashi", speakerInitial: "T", side: "right", tib: "ལགས་ཡིན། ཐུགས་རྗེ་ཆེ།", pron: "la yin, thuk je che.", en: "I am well, thank you." },
    ],
  },
  {
    id: "d4", title: "Saying goodbye", subtitle: "End of the lesson.",
    lines: [
      { speaker: "Tsering", speakerInitial: "T", side: "left", tib: "བཞུགས་ཨ།", pron: "dhe a", en: "(Good)bye — stay well." },
      { speaker: "Dolma", speakerInitial: "D", side: "right", tib: "ག་ལེར་ཕེབས། སང་ཉིན་མཇལ་ཡོང་།", pron: "galer pheb. sangnyin jäl yong.", en: "Go slowly (goodbye). See you tomorrow." },
      { speaker: "Tsering", speakerInitial: "T", side: "left", tib: "ལགས་སོ། མཇལ་ཡོང་།", pron: "la so. jäl yong.", en: "Okay (polite). See you." },
    ],
  },
];

export const CLASSROOM_COMMANDS: ClassroomCommand[] = [
  { num: "01", tib: "དེབ་ཁ་ཕྱེས།", pron: "deb kha che", en: "Open your book.", breakdown: [{ tib: "དེབ་", pron: "deb", gloss: "book" }, { tib: "ཁ་", pron: "kha", gloss: "cover" }, { tib: "ཕྱེས་", pron: "che", gloss: "open!" }] },
  { num: "02", tib: "དེབ་ཁ་རྒྱོབས།", pron: "deb kha gyob", en: "Close your book.", breakdown: [{ tib: "དེབ་", pron: "deb", gloss: "book" }, { tib: "ཁ་", pron: "kha", gloss: "cover" }, { tib: "རྒྱོབས་", pron: "gyob", gloss: "close!" }] },
  { num: "03", tib: "ཉོན་ཨ།", pron: "nyön a", en: "Listen.", breakdown: [{ tib: "ཉོན་", pron: "nyön", gloss: "listen!" }, { tib: "ཨ་", pron: "a", gloss: "polite particle" }] },
  { num: "04", tib: "བྲིས།", pron: "dri", en: "Write.", breakdown: [{ tib: "བྲིས་", pron: "dri", gloss: "write! (imperative)" }] },
  { num: "05", tib: "ཀློགས།", pron: "lok", en: "Read (aloud).", breakdown: [{ tib: "ཀློགས་", pron: "lok", gloss: "read! (imperative)" }] },
  { num: "06", tib: "བཞུགས།", pron: "zhug", en: "Sit down.", breakdown: [{ tib: "བཞུགས་", pron: "zhug", gloss: "please sit (honorific)" }] },
  { num: "07", tib: "ཡར་ལོངས།", pron: "yar long", en: "Stand up.", breakdown: [{ tib: "ཡར་", pron: "yar", gloss: "upward" }, { tib: "ལོངས་", pron: "long", gloss: "stand / rise!" }] },
];

export const CULTURE_NOTES: CultureNote[] = [
  {
    id: "tashi-delek",
    badge: "CULTURE 01",
    title: "བཀྲ་ཤིས་བདེ་ལེགས། (Tashi Delek)",
    fallbackImage: "/loplao-hero-scene.jpg",
    paragraphs: [
      "Tashi Delek is the everyday Tibetan greeting you will hear when people meet — similar to 'Hello' or 'Hi' in English.",
      "The phrase is made of two words: བཀྲ་ཤིས་ (Tashi) means 'auspiciousness' or 'good fortune,' and བདེ་ལེགས་ (Delek) means 'happiness,' 'well-being,' and 'all good things.'",
      "So when you say Tashi Delek, you are wishing the other person health, happiness, prosperity, and a long and fulfilling life.",
      "It is especially common during Losar (Tibetan New Year) and other festivals. Use it only for happy, celebratory, or positive occasions; avoid it at funerals, mourning, or times of sadness, because it expresses wishes for good fortune.",
    ],
  },
  {
    id: "tibetan-names",
    badge: "CULTURE 02",
    title: "Tibetan names and their meanings",
    fallbackImage: "/06_suffixes_post_suffixes.jpg",
    paragraphs: [
      "Tibetan names are often chosen for their meaning. Here are a few common ones you will hear in class and in songs:",
      "Tsering (ཚེ་རིང་།) means 'long life.' Lhamo (ལྷ་མོ།) means 'goddess.' Dolma (སྒྲོལ་མ།) is another name for the goddess Tara. Tashi (བཀྲ་ཤིས།) means 'auspiciousness' or 'good fortune.' Tenzin (བསྟན་འཛིན།) means 'holder of the teachings.' Dekyi (བདེ་སྐྱིད།) means 'happiness' or 'joy.'",
      "You may notice that many people in the Tibetan world share the same name — that is because the meaning is important, and these names carry blessings for the person who receives them.",
    ],
  },
];

export const CAN_DO_CHECKLIST: string[] = [
  "I can greet someone and reply to a greeting.",
  "I can name at least ten classroom objects and people.",
  "I know when to use ཡིན་ and when to use རེད་.",
  "I can negate a sentence with མིན་ / མ་རེད་.",
  "I can choose between informal and polite pronouns.",
  "I can follow class instructions in Tibetan.",
];

export const SPEAKING_PROMPTS: string[] = [
  "Point at five things around you and say འདི་ ___ རེད།",
  "Introduce a classmate: ཁོང་ ___ རེད།",
  "Role-play arriving late: apologise, and let the teacher answer.",
];

export const WEB_STEPS = [
  { id: "welcome", eyebrow: "Introduction", title: "Welcome to the Class", tibetanTitle: "འཛིན་གྲྭར་ཕེབས་པར་དགའ་བསུ་ཞུ།", description: "An overview of your first conversational Tibetan unit." },
  { id: "vocab", eyebrow: "Step 02", title: "Vocabulary · Eighteen words for your first lesson", tibetanTitle: "ཚིག་གསར།", description: "Classroom objects, people, and three everyday time words." },
  { id: "phrases", eyebrow: "Step 03", title: "Useful phrases · Every single lesson", tibetanTitle: "བརྗོད་པ།", description: "Greetings, thanks, apologies, goodbyes, and the polite particle ལགས་." },
  { id: "grammar", eyebrow: "Step 04", title: "Grammar · Pronouns and the verb 'to be'", tibetanTitle: "བརྡ་སྤྲོད།", description: "Informal vs honorific pronouns, demonstratives, plus ཡིན་ / རེད་ and their negatives." },
  { id: "conversation", eyebrow: "Step 05", title: "Conversation · First day in the classroom", tibetanTitle: "ཁ་བརྡ།", description: "Four short classroom exchanges that pull the whole unit together." },
  { id: "reference", eyebrow: "Step 06", title: "Reference · Classroom instructions & Culture Corner", tibetanTitle: "དཔྱད་གཞི།", description: "Seven quick commands from your teacher, Tashi Delek, and Tibetan names." },
  { id: "practice", eyebrow: "Step 07", title: "Practice · Exercises & Drills", tibetanTitle: "སྦྱོང་ཚན།", description: "Copula drills, pronoun choice, flashcards, matching, and memory review." },
  { id: "review", eyebrow: "Step 08", title: "Review · Consolidate before the test", tibetanTitle: "བསྐྱར་ཞིབ།", description: "Can-do self-check and three out-loud speaking prompts." },
  { id: "test", eyebrow: "Final step", title: "Final Test", tibetanTitle: "མཐའ་མའི་རྒྱུགས་ཞིབ།", description: "40 questions across vocabulary, phrases, grammar, conversation, and classroom commands." },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
const pickWrongs = <T,>(arr: T[], excludeFn: (item: T) => boolean, count: number): T[] =>
  shuffle(arr.filter((x) => !excludeFn(x))).slice(0, count);

export function generateVocabQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = VOCAB.map((v, idx) => {
    const mode = idx % 3;
    if (mode === 0) {
      const wrongs = pickWrongs(VOCAB, (x) => x.pron === v.pron, 3);
      return { questionText: `How is ${v.tib} read aloud?`, prominentTibetan: v.tib, answer: v.pron, audioString: v.tib, choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.pron, label: c.pron })) };
    } else if (mode === 1) {
      const wrongs = pickWrongs(VOCAB, (x) => x.tib === v.tib, 3);
      return { type: "vocab", questionText: `Which Tibetan word means "${v.en}"?`, answer: v.tib, audioString: v.tib, choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.tib, tib: c.tib, pron: c.pron, en: c.en })) };
    } else {
      const wrongs = pickWrongs(VOCAB, (x) => x.en === v.en, 3);
      return { questionText: `What does ${v.tib} mean?`, prominentTibetan: v.tib, answer: v.en, audioString: v.tib, choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.en, label: c.en })) };
    }
  });
  return shuffle(qs);
}

export function generatePhrasesQuiz(): QuizQuestion[] {
  return shuffle(USEFUL_PHRASES).slice(0, 12).map((p, idx) => {
    if (idx % 2 === 0) {
      const wrongs = pickWrongs(USEFUL_PHRASES, (x) => x.en === p.en, 3);
      return { questionText: `What does ${p.tib} mean?`, prominentTibetan: p.tib, answer: p.en, audioString: p.tib, choices: shuffle([p, ...wrongs]).map((c) => ({ value: c.en, label: c.en })) };
    } else {
      const wrongs = pickWrongs(USEFUL_PHRASES, (x) => x.tib === p.tib, 3);
      return { questionText: `How do you say "${p.en}"?`, answer: p.tib, audioString: p.tib, choices: shuffle([p, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) };
    }
  });
}

export function generatePronounsQuiz(): QuizQuestion[] {
  const allItems = [...PRONOUNS.map((p) => ({ tib: p.tib, pron: p.pron, en: p.en })), ...DEMONSTRATIVES.map((d) => ({ tib: d.tib, pron: d.pron, en: d.en }))];
  return shuffle(allItems).slice(0, 10).map((item, idx) => {
    if (idx % 2 === 0) {
      const wrongs = pickWrongs(allItems, (x) => x.tib === item.tib, 3);
      return { questionText: `Which one means "${item.en}"?`, answer: item.tib, noAudio: true, choices: shuffle([item, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) };
    } else {
      const wrongs = pickWrongs(allItems, (x) => x.en === item.en, 3);
      return { questionText: `What does ${item.tib} mean?`, prominentTibetan: item.tib, answer: item.en, noAudio: true, choices: shuffle([item, ...wrongs]).map((c) => ({ value: c.en, label: c.en })) };
    }
  });
}

export function generateCopulaQuiz(): QuizQuestion[] {
  const copulaChoices = () => shuffle([
    { value: "ཡིན།", label: "ཡིན།", isTibetan: true },
    { value: "རེད།", label: "རེད།", isTibetan: true },
    { value: "མིན།", label: "མིན།", isTibetan: true },
    { value: "མ་རེད།", label: "མ་རེད།", isTibetan: true },
  ]);
  const bank: QuizQuestion[] = [
    { questionText: "Which affirmative form goes with ང་ (I)?", answer: "ཡིན།", noAudio: true, choices: copulaChoices() },
    { questionText: "Which negative form goes with ཁྱེད་རང་ (you)?", answer: "མ་རེད།", noAudio: true, choices: copulaChoices() },
    { questionText: "Which negative form goes with ང་ (I)?", answer: "མིན།", noAudio: true, choices: copulaChoices() },
    { questionText: "Which affirmative form goes with ཁོང་ (he / she)?", answer: "རེད།", noAudio: true, choices: copulaChoices() },
    { promptText: "Complete: I am Tibetan.", promptHighlight: "ང་བོད་པ་ ___", answer: "ཡིན།", noAudio: true, choices: copulaChoices() },
    { promptText: "Complete: He is a teacher.", promptHighlight: "ཁོང་དགེ་རྒན་ ___", answer: "རེད།", noAudio: true, choices: copulaChoices() },
    { promptText: "Complete: This is not a book.", promptHighlight: "འདི་དེབ་ ___", answer: "མ་རེད།", noAudio: true, choices: copulaChoices() },
    { promptText: "Complete: I am not a teacher.", promptHighlight: "ང་དགེ་རྒན་ ___", answer: "མིན།", noAudio: true, choices: copulaChoices() },
    { questionText: "What does ང་བོད་པ་མིན། mean?", prominentTibetan: "ང་བོད་པ་མིན།", answer: "I am not Tibetan.", noAudio: true, choices: shuffle(["I am not Tibetan.", "I am Tibetan.", "He is not Tibetan.", "You are Tibetan."]).map((s) => ({ value: s, label: s })) },
    { questionText: "What does འདི་དེབ་མ་རེད། mean?", prominentTibetan: "འདི་དེབ་མ་རེད།", answer: "This is not a book.", noAudio: true, choices: shuffle(["This is not a book.", "This is a book.", "That is not a pen.", "I am not a student."]).map((s) => ({ value: s, label: s })) },
    { questionText: "Where does the copula (ཡིན་ / རེད་) sit in a Tibetan sentence?", answer: "At the very end of the sentence", noAudio: true, choices: shuffle(["At the very end of the sentence", "Right after the subject", "At the start of the sentence", "Before the noun"]).map((s) => ({ value: s, label: s })) },
    { questionText: "How do you say 'You are a student.'?", answer: "ཁྱེད་རང་སློབ་ཕྲུག་རེད།", noAudio: true, choices: shuffle(["ཁྱེད་རང་སློབ་ཕྲུག་རེད།", "ཁྱེད་རང་སློབ་ཕྲུག་ཡིན།", "ང་སློབ་ཕྲུག་རེད།", "ཁྱེད་རང་སློབ་ཕྲུག་མིན།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
  ];
  return shuffle(bank);
}

export function generateCommandsQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = CLASSROOM_COMMANDS.map((cmd) => {
    const wrongs = pickWrongs(CLASSROOM_COMMANDS, (x) => x.en === cmd.en, 3);
    return { questionText: `What does ${cmd.tib} mean?`, prominentTibetan: cmd.tib, answer: cmd.en, audioString: cmd.tib, choices: shuffle([cmd, ...wrongs]).map((c) => ({ value: c.en, label: c.en })) };
  });
  shuffle(CLASSROOM_COMMANDS).slice(0, 3).forEach((cmd) => {
    const wrongs = pickWrongs(CLASSROOM_COMMANDS, (x) => x.tib === cmd.tib, 3);
    qs.push({ questionText: `How does your teacher say "${cmd.en}"?`, answer: cmd.tib, audioString: cmd.tib, choices: shuffle([cmd, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) });
  });
  return shuffle(qs).slice(0, 10);
}

export function generatePracticeDrills(): Record<"copula" | "pronouns" | "conversation", QuizQuestion[]> {
  const yinRe = [{ value: "ཡིན།", label: "ཡིན།", isTibetan: true }, { value: "རེད།", label: "རེད།", isTibetan: true }];
  return {
    copula: [
      { promptText: "I am Tibetan.", promptHighlight: "ང་བོད་པ་ ___", answer: "ཡིན།", noAudio: true, choices: yinRe },
      { promptText: "She is a student.", promptHighlight: "ཁོང་སློབ་ཕྲུག་ ___", answer: "རེད།", noAudio: true, choices: yinRe },
      { promptText: "This is a whiteboard.", promptHighlight: "འདི་དཀར་པང་ ___", answer: "རེད།", noAudio: true, choices: yinRe },
      { questionText: "Negate correctly: 'I am not a teacher.'", answer: "ང་དགེ་རྒན་མིན།", noAudio: true, choices: shuffle(["ང་དགེ་རྒན་མིན།", "ང་དགེ་རྒན་མ་རེད།", "ང་དགེ་རྒན་ཡིན།", "ཁོང་དགེ་རྒན་མིན།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { questionText: "Use the phrase for arriving late: 'I am late.'", answer: "ང་རྗེས་ལུས་ཐེབས་སོང་།", noAudio: true, choices: shuffle(["ང་རྗེས་ལུས་ཐེབས་སོང་།", "ང་རྗེས་ལུས་མིན།", "ང་སློབ་ཕྲུག་ཡིན།", "ང་རྗེས་ལུས་མ་རེད།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    ],
    pronouns: [
      { questionText: "Which pronoun should you use to refer respectfully to your teacher?", answer: "ཁོང་", noAudio: true, choices: shuffle(["ཁོང་", "ང་", "འདི་", "དེ་ཚོ་"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { questionText: "When speaking politely about yourself ('I'), which pronoun do you use?", answer: "ང་", noAudio: true, choices: shuffle(["ང་", "ཁོང་", "ཁྱེད་རང་", "ང་ཚོ་"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { questionText: "How do you address someone politely as 'you' (singular)?", answer: "ཁྱེད་རང་", noAudio: true, choices: shuffle(["ཁྱེད་རང་", "ཁོང་ཚོ་", "ང་ཚོ་", "མོ་རང་"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { questionText: "Which particle is added after a name or title (e.g. དགེ་རྒན་ལགས།) to show politeness?", answer: "ལགས་", noAudio: true, choices: shuffle(["ལགས་", "ཚོ་", "མིན་", "པས་"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    ],
    conversation: [
      { promptText: "A classmate asks you:", promptHighlight: "བདེ་པོ་ཡིན་པས།", promptEnd: "Choose the natural polite reply:", answer: "ལགས་ཡིན། ཐུགས་རྗེ་ཆེ།", noAudio: true, choices: shuffle(["ལགས་ཡིན། ཐུགས་རྗེ་ཆེ།", "དེབ་ཁ་ཕྱེས།", "འདི་ག་རེ་རེད།", "ང་རྗེས་ལུས་ཐེབས་སོང་།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "You are leaving the classroom while your teacher stays. What do you say?", answer: "བཞུགས་ཨ།", noAudio: true, choices: shuffle(["བཞུགས་ཨ།", "ག་ལེར་ཕེབས།", "དགོངས་དག", "ཁོང་སུ་རེད།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "Someone says བཞུགས་ཨ། as they leave. As the person staying, how do you reply?", answer: "ག་ལེར་ཕེབས།", noAudio: true, choices: shuffle(["ག་ལེར་ཕེབས།", "བཞུགས་ཨ།", "ང་བོད་པ་མིན།", "ཡར་ལོངས།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
      { promptText: "A student says: དགོངས་དག ང་རྗེས་ལུས་ཐེབས་སོང་། How does the teacher warmly reply?", answer: "གལ་ཡོད་མ་རེད། ཡར་ཕེབས་ཤོག། བཞུགས།", noAudio: true, choices: shuffle(["གལ་ཡོད་མ་རེད། ཡར་ཕེབས་ཤོག། བཞུགས།", "དེབ་ཁ་རྒྱོབས།", "ཁྱེད་རང་སུ་ཡིན།", "འདི་དེབ་མ་རེད།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    ],
  };
}

export function generateFinalQuiz(): QuizQuestion[] {
  const qs: QuizQuestion[] = [];

  shuffle(VOCAB).slice(0, 6).forEach((v) => {
    const wrongs = pickWrongs(VOCAB, (x) => x.tib === v.tib, 3);
    qs.push({ questionText: `Which one means "${v.en}"?`, answer: v.tib, audioString: v.tib, choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.tib, tib: c.tib, pron: c.pron, en: c.en })) });
  });

  shuffle(VOCAB).slice(0, 5).forEach((v) => {
    const wrongs = pickWrongs(VOCAB, (x) => x.en === v.en, 3);
    qs.push({ questionText: `What does ${v.tib} mean?`, prominentTibetan: v.tib, answer: v.en, audioString: v.tib, choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.en, label: c.en })) });
  });

  shuffle(VOCAB).slice(0, 5).forEach((v) => {
    const wrongs = pickWrongs(VOCAB, (x) => x.pron === v.pron, 3);
    qs.push({ questionText: `How is ${v.tib} read aloud?`, prominentTibetan: v.tib, answer: v.pron, audioString: v.tib, choices: shuffle([v, ...wrongs]).map((c) => ({ value: c.pron, label: c.pron })) });
  });

  shuffle(USEFUL_PHRASES).slice(0, 8).forEach((p, idx) => {
    if (idx % 2 === 0) {
      const wrongs = pickWrongs(USEFUL_PHRASES, (x) => x.en === p.en, 3);
      qs.push({ questionText: `What does ${p.tib} mean?`, prominentTibetan: p.tib, answer: p.en, audioString: p.tib, choices: shuffle([p, ...wrongs]).map((c) => ({ value: c.en, label: c.en })) });
    } else {
      const wrongs = pickWrongs(USEFUL_PHRASES, (x) => x.tib === p.tib, 3);
      qs.push({ questionText: `Which phrase means "${p.en}"?`, answer: p.tib, audioString: p.tib, choices: shuffle([p, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) });
    }
  });

  const allPronouns = [...PRONOUNS.map((p) => ({ tib: p.tib, pron: p.pron, en: p.en })), ...DEMONSTRATIVES.map((d) => ({ tib: d.tib, pron: d.pron, en: d.en }))];
  shuffle(allPronouns).slice(0, 5).forEach((item, idx) => {
    if (idx % 2 === 0) {
      const wrongs = pickWrongs(allPronouns, (x) => x.tib === item.tib, 3);
      qs.push({ questionText: `Which pronoun or demonstrative means "${item.en}"?`, answer: item.tib, noAudio: true, choices: shuffle([item, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) });
    } else {
      const wrongs = pickWrongs(allPronouns, (x) => x.en === item.en, 3);
      qs.push({ questionText: `What does ${item.tib} mean?`, prominentTibetan: item.tib, answer: item.en, noAudio: true, choices: shuffle([item, ...wrongs]).map((c) => ({ value: c.en, label: c.en })) });
    }
  });

  shuffle(generateCopulaQuiz()).slice(0, 5).forEach((q) => qs.push(q));

  shuffle(CLASSROOM_COMMANDS).slice(0, 4).forEach((cmd, idx) => {
    if (idx % 2 === 0) {
      const wrongs = pickWrongs(CLASSROOM_COMMANDS, (x) => x.en === cmd.en, 3);
      qs.push({ questionText: `What does the classroom command ${cmd.tib} mean?`, prominentTibetan: cmd.tib, answer: cmd.en, audioString: cmd.tib, choices: shuffle([cmd, ...wrongs]).map((c) => ({ value: c.en, label: c.en })) });
    } else {
      const wrongs = pickWrongs(CLASSROOM_COMMANDS, (x) => x.tib === cmd.tib, 3);
      qs.push({ questionText: `Which command means "${cmd.en}"?`, answer: cmd.tib, audioString: cmd.tib, choices: shuffle([cmd, ...wrongs]).map((c) => ({ value: c.tib, label: c.tib, isTibetan: true })) });
    }
  });

  const cultureAndDialogueQs: QuizQuestion[] = [
    { questionText: "What do the two parts of བཀྲ་ཤིས་བདེ་ལེགས། (Tashi Delek) express?", answer: "Auspiciousness / good fortune and happiness / well-being", noAudio: true, choices: shuffle(["Auspiciousness / good fortune and happiness / well-being", "Good morning and good night", "Please sit down and open your book", "Excuse me and see you tomorrow"]).map((s) => ({ value: s, label: s })) },
    { questionText: "In Tibetan names, what does བསྟན་འཛིན། (Tenzin) mean?", answer: "Holder of the teachings", noAudio: true, choices: shuffle(["Holder of the teachings", "Long life", "Goddess", "Whiteboard"]).map((s) => ({ value: s, label: s })) },
    { questionText: "When leaving a room while your teacher stays, which goodbye do you say?", answer: "བཞུགས་ཨ།", noAudio: true, choices: shuffle(["བཞུགས་ཨ།", "ག་ལེར་ཕེབས།", "དེབ་ཁ་ཕྱེས།", "འདི་ག་རེ་རེད།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
    { questionText: "How do you politely answer when someone asks བདེ་པོ་ཡིན་པས། ('How are you?')?", answer: "ལགས་ཡིན། ཐུགས་རྗེ་ཆེ།", noAudio: true, choices: shuffle(["ལགས་ཡིན། ཐུགས་རྗེ་ཆེ།", "དེབ་ཁ་རྒྱོབས།", "ང་བོད་པ་མིན།", "ཁོང་སུ་རེད།"]).map((s) => ({ value: s, label: s, isTibetan: true })) },
  ];

  shuffle(cultureAndDialogueQs).slice(0, 2).forEach((q) => qs.push(q));
  return shuffle(qs).slice(0, 40);
}
