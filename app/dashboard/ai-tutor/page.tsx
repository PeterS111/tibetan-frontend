// app/dashboard/ai-tutor/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Mic,
  Square,
  Send,
  Play,
  Volume2,
  Loader2,
  RotateCcw,
  Settings,
  X,
  AlertCircle,
  CheckCircle2,
  Check,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  Drama,
  Speech,
  ScrollText,
  HelpCircle,
  GraduationCap,
  Mountain,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Turtle,
  FileText,
  Award,
} from "lucide-react";
import { useDevBypass } from "@/hooks/useDevBypass";
import { usePlatform } from "@/hooks/usePlatform";

// ============================================================================
// TYPES & V5 SPEC CONFIGURATION
// ============================================================================
type LevelId = "beginner1" | "beginner2" | "pre_intermediate" | "intermediate";
type ModeId = "converse" | "situations" | "pronounce" | "read" | "ask";
type DialectId = "lhasa_colloquial" | "lhasa_honorific" | "amdo" | "kham";
type SpeedId = "slow" | "normal" | "natural";
type InputKind = "tibetan" | "phonetic" | "english";

interface GlossWord {
  tibetan: string;
  phonetic: string;
  meaning: string;
}

interface SavedWordItem {
  word_key: string;
  tibetan: string;
  pronunciation: string;
  english: string;
  module_id: number;
}

interface SpeechFeedback {
  status: "good" | "needs_work";
  message: string;
}

interface LessonSuggestion {
  title: string;
  course: string;
  url: string;
}

interface ReadingWordEval {
  target: string;
  status: "correct" | "needs_work" | "missed" | string;
  expected_phonetic: string;
  heard_as: string;
  tip: string;
}

interface ReadingEvaluation {
  overall_score: number;
  grade_label: string;
  what_was_heard: string;
  summary_feedback: string;
  word_evaluations: ReadingWordEval[];
  next_focus: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "context";
  msgMode?: ModeId;
  tibetan: string;
  phonetic?: string;
  english?: string;
  words?: GlossWord[];
  feedback?: SpeechFeedback | null;
  evaluation?: ReadingEvaluation | null;
  suggestedReplies?: string[];
  lessonSuggestion?: LessonSuggestion | null;
  isVoice?: boolean;
  inputKind?: InputKind | "speech";
  needsTapToPlay?: boolean;
}

type MessagesByMode = Record<ModeId, ChatMessage[]>;

interface AudioInputDevice {
  deviceId: string;
  label: string;
}

interface StarterCard {
  tibetan: string;
  phonetic: string;
  english: string;
}

interface LevelConfig {
  id: LevelId;
  badge: string;
  label: string;
  tierIndex: 0 | 1 | 2;
  defaultGloss: boolean;
  defaultPhonetics: boolean;
  defaultSpeed: SpeedId;
  recommendedModes: ModeId[];
  courseName: string;
}

const createEmptyThreads = (): MessagesByMode => ({
  converse: [],
  situations: [],
  pronounce: [],
  read: [],
  ask: [],
});

const LEVELS: LevelConfig[] = [
  {
    id: "beginner1",
    badge: "B1",
    label: "Beginner 1",
    tierIndex: 0,
    defaultGloss: true,
    defaultPhonetics: true,
    defaultSpeed: "slow",
    recommendedModes: ["pronounce", "situations"],
    courseName: "Beginner 1 Course",
  },
  {
    id: "beginner2",
    badge: "B2",
    label: "Beginner 2",
    tierIndex: 0,
    defaultGloss: true,
    defaultPhonetics: true,
    defaultSpeed: "slow",
    recommendedModes: ["converse", "situations"],
    courseName: "Beginner 2 Course",
  },
  {
    id: "pre_intermediate",
    badge: "PI",
    label: "Pre-Intermediate",
    tierIndex: 1,
    defaultGloss: true,
    defaultPhonetics: false,
    defaultSpeed: "normal",
    recommendedModes: ["converse", "read"],
    courseName: "Pre-Intermediate Course",
  },
  {
    id: "intermediate",
    badge: "I",
    label: "Intermediate",
    tierIndex: 2,
    defaultGloss: false,
    defaultPhonetics: false,
    defaultSpeed: "natural",
    recommendedModes: ["converse", "read"],
    courseName: "Intermediate Course",
  },
];

const LEVEL_MAP: Record<LevelId, LevelConfig> = {
  beginner1: LEVELS[0],
  beginner2: LEVELS[1],
  pre_intermediate: LEVELS[2],
  intermediate: LEVELS[3],
};

interface ModeConfig {
  id: ModeId;
  label: string;
  tierDescriptions: [string, string, string];
  greetingTib: string;
  greetingPho: string;
  cardsLabel: string;
  hint: string;
}

const MODES: ModeConfig[] = [
  {
    id: "converse",
    label: "Converse",
    tierDescriptions: [
      "Slow chat with English help",
      "Mostly Tibetan chat",
      "Tibetan-only chat",
    ],
    greetingTib: "བཀྲ་ཤིས་བདེ་ལེགས།",
    greetingPho: "Tashi delek",
    cardsLabel: "Try saying",
    hint: "Tap the mic and speak · Tap underlined words for their meaning",
  },
  {
    id: "situations",
    label: "Situations",
    tierDescriptions: [
      "Short scripted scenes",
      "Open role-play scenes",
      "Idioms & honorific speech",
    ],
    greetingTib: "གནས་སྟངས།",
    greetingPho: "Pick a scene",
    cardsLabel: "Choose a scene",
    hint: "Tap the mic to respond in character · Tap underlined words for their meaning",
  },
  {
    id: "pronounce",
    label: "Pronounce",
    tierDescriptions: [
      "Sounds, then words",
      "Full phrases",
      "Tone & rhythm",
    ],
    greetingTib: "ངག་འབྱུང་།",
    greetingPho: "Say it aloud",
    cardsLabel: "Pick a drill",
    hint: "Tap Play to listen, then tap the gold Mic or Repeat after me for acoustic feedback",
  },
  {
    id: "read",
    label: "Read",
    tierDescriptions: [
      "Alphabet & syllables",
      "Dialogues & stories",
      "Prayers & classical texts",
    ],
    greetingTib: "ཀློག་པ།",
    greetingPho: "Choose a text",
    cardsLabel: "Start reading",
    hint: "Tap any underlined word for its meaning · Tap Repeat after me to verify your reading",
  },
  {
    id: "ask",
    label: "Ask",
    tierDescriptions: [
      "Answers in simple English",
      "Mixed English & Tibetan",
      "Can answer in Tibetan",
    ],
    greetingTib: "དྲི་བ།",
    greetingPho: "Ask anything",
    cardsLabel: "Popular questions",
    hint: "Ask in English or Tibetan about grammar, vocabulary, culture, or Dharma",
  },
];

const MODE_MAP: Record<ModeId, ModeConfig> = {
  converse: MODES[0],
  situations: MODES[1],
  pronounce: MODES[2],
  read: MODES[3],
  ask: MODES[4],
};

const DIALECT_OPTIONS: { id: DialectId; label: string }[] = [
  { id: "lhasa_colloquial", label: "Lhasa · Colloquial" },
  { id: "lhasa_honorific", label: "Lhasa · Honorific" },
  { id: "amdo", label: "Amdo" },
  { id: "kham", label: "Kham" },
];

const SPEED_OPTIONS: { id: SpeedId; label: string; rate: number }[] = [
  { id: "slow", label: "Slow", rate: 0.85 },
  { id: "normal", label: "Normal", rate: 1.0 },
  { id: "natural", label: "Natural", rate: 1.08 },
];

const INPUT_KIND_CYCLE: { id: InputKind; label: string; placeholder: string }[] = [
  { id: "tibetan", label: "ཀ Tibetan", placeholder: "Tap the mic, or type Tibetan here…" },
  { id: "phonetic", label: "Phonetic", placeholder: "Tap the mic, or type phonetics (e.g. Tashi delek)…" },
  { id: "english", label: "English", placeholder: "Tap the mic, or type in English…" },
];

// Natural, Tenzin-aligned Lhasa starter cards
const STARTER_CARDS: Record<ModeId, [StarterCard[], StarterCard[], StarterCard[]]> = {
  converse: [
    [
      {
        tibetan: "བཀྲ་ཤིས་བདེ་ལེགས། ང་བོད་སྐད་སྦྱོང་གི་ཡོད།",
        phonetic: "Tashi delek! Nga Bö-ke jong-gi yö.",
        english: "Hello! I am learning Tibetan.",
      },
      {
        tibetan: "ཁྱེད་རང་སྐུ་གཟུགས་བདེ་པོ་ཡིན་པས།",
        phonetic: "Khyerang ku-zuk de-po yin-pe?",
        english: "How are you?",
      },
      {
        tibetan: "དེ་རིང་གཟའ་ག་རེ་རེད།",
        phonetic: "De-ring za ga-re re?",
        english: "What day is today?",
      },
    ],
    [
      {
        tibetan: "དེ་རིང་གནམ་གཤིས་ག་འདྲས་འདུག",
        phonetic: "De-ring nam-shi ga-dre dug?",
        english: "How is the weather today?",
      },
      {
        tibetan: "ཁྱེད་རང་ཉིན་ལྟར་ཁ་ལག་ག་རེ་བཟོ་གི་ཡོད།",
        phonetic: "Khyerang nyin-tar kha-lak ga-re zo-gi yö?",
        english: "What do you usually cook?",
      },
      {
        tibetan: "གཟའ་མཇུག་ལ་ཁྱེད་རང་ག་རེ་གནང་གི་ཡོད།",
        phonetic: "Za-juk la khyerang ga-re nang-gi yö?",
        english: "What do you do on weekends?",
      },
    ],
    [
      {
        tibetan: "ཁྱེད་རང་གི་འཚོ་བའི་སྐོར་ལ་གསུང་རོགས་གནང་།",
        phonetic: "Khyerang-gi tso-we kor la sung-rok nang.",
        english: "Tell me about your life.",
      },
      {
        tibetan: "ཁྱེད་རང་གི་བསམ་ཚུལ་ག་རེ་ཡིན།",
        phonetic: "Khyerang-gi sam-tsül ga-re yin?",
        english: "Share your opinion on a topic.",
      },
      {
        tibetan: "དེང་སང་བོད་ཀྱི་རིག་གཞུང་སྐོར་ལ་གླེང་མོལ་ཞུ།",
        phonetic: "Deng-sang Bö-kyi rik-zhung kor la leng-möl zhu.",
        english: "Discuss modern Tibetan culture.",
      },
    ],
  ],
  situations: [
    [
      {
        tibetan: "ཚོང་ཁང་ནང་།",
        phonetic: "Tsong-khang nang",
        english: "At the shop: buy tea",
      },
      {
        tibetan: "ཇ་ཁང་ནང་།",
        phonetic: "Ja-khang nang",
        english: "At the teahouse: order food",
      },
      {
        tibetan: "གྲོགས་པོ་དང་ཐུག་པ།",
        phonetic: "Drok-po dang thuk-pa",
        english: "Meeting a friend",
      },
    ],
    [
      {
        tibetan: "ཁྱིམ་ལ་མགྲོན་པོ་ཕེབས་པ།",
        phonetic: "Khyim la drön-po pheb-pa",
        english: "Welcome a guest to your home",
      },
      {
        tibetan: "སྨན་ཁང་ནང་།",
        phonetic: "Men-khang nang",
        english: "At the clinic",
      },
      {
        tibetan: "ལམ་ཁ་འདྲི་བ།",
        phonetic: "Lam-kha dri-wa",
        english: "Asking directions in town",
      },
    ],
    [
      {
        tibetan: "དགོན་པར་ཕེབས་པ།",
        phonetic: "Gön-par pheb-pa",
        english: "Visiting a monastery (honorific)",
      },
      {
        tibetan: "ཚོང་ར་ནང་རིན་གོང་གཏམ་པ།",
        phonetic: "Tsong-ra nang rin-gong tam-pa",
        english: "Bargaining at the market",
      },
      {
        tibetan: "ཞུ་ཡིག་འབྲི་བ།",
        phonetic: "Zhu-yik dri-wa",
        english: "Making a formal request",
      },
    ],
  ],
  pronounce: [
    [
      {
        tibetan: "ཀ་ཁ་ག་ང་།",
        phonetic: "ka · kha · ga · nga",
        english: "First four letters",
      },
      {
        tibetan: "ཀ་བ། ཁ་བ།",
        phonetic: "ka-wa · kha-wa",
        english: "Unaspirated k vs. aspirated kh (pillar · snow)",
      },
      {
        tibetan: "གཅིག་གཉིས་གསུམ།",
        phonetic: "chik · nyi · sum",
        english: "Numbers 1 to 3",
      },
    ],
    [
      {
        tibetan: "བཀྲ་ཤིས་བདེ་ལེགས། ཁྱེད་རང་སྐུ་གཟུགས་བདེ་པོ་ཡིན་པས།",
        phonetic: "Tashi delek. Khyerang ku-zuk de-po yin-pe?",
        english: "Full greetings",
      },
      {
        tibetan: "ང་ལོ་ཉི་ཤུ་ཡིན།",
        phonetic: "Nga lo nyi-shu yin.",
        english: "Introduce yourself",
      },
      {
        tibetan: "དེ་རིང་གཟའ་ག་རེ་རེད།",
        phonetic: "De-ring za ga-re re?",
        english: "Ask the day",
      },
    ],
    [
      {
        tibetan: "ཚིག་གྲུབ་ཀྱི་སྒྲ་གདངས།",
        phonetic: "Tsik-drup kyi dra-dang",
        english: "Tone drill: minimal pairs",
      },
      {
        tibetan: "ཁྱེད་རང་གིས་བོད་སྐད་ཡག་པོ་གསུང་གི་འདུག",
        phonetic: "Khyerang-gi Bö-ke yak-po sung-gi dug.",
        english: "Read a natural sentence aloud",
      },
      {
        tibetan: "སྒྲ་གདངས་དང་ཚིག་འགྲོས།",
        phonetic: "Dra-dang dang tsik-drö",
        english: "Rhythm and cadence",
      },
    ],
  ],
  read: [
    [
      {
        tibetan: "ཀ་ཁ་ག་ང་།",
        phonetic: "ka · kha · ga · nga",
        english: "The alphabet",
      },
      {
        tibetan: "བཀྲ་ཤིས་བདེ་ལེགས།",
        phonetic: "Tashi delek",
        english: "First syllables",
      },
      {
        tibetan: "ང་བོད་སྐད་སྦྱོང་གི་ཡོད།",
        phonetic: "Nga Bö-ke jong-gi yö",
        english: "A one-line text",
      },
    ],
    [
      {
        tibetan: "གྲོགས་པོ་གཉིས་ཀྱི་གླེང་མོལ།",
        phonetic: "Drok-po nyi kyi leng-möl",
        english: "A short dialogue",
      },
      {
        tibetan: "གཏམ་རྒྱུད།",
        phonetic: "Tam-gyü",
        english: "A short story",
      },
      {
        tibetan: "ཉིན་རེའི་གསར་འགྱུར།",
        phonetic: "Nyin-re sar-gyur",
        english: "Simple news",
      },
    ],
    [
      {
        tibetan: "སྨོན་ལམ།",
        phonetic: "Mön-lam",
        english: "A prayer with tap-to-gloss",
      },
      {
        tibetan: "གསར་འགྱུར་རིང་པོ།",
        phonetic: "Sar-gyur ring-po",
        english: "A news article",
      },
      {
        tibetan: "དཔེ་ཆ།",
        phonetic: "Pe-cha",
        english: "A classical passage",
      },
    ],
  ],
  ask: [
    [
      { tibetan: "", phonetic: "", english: 'What does "tashi delek" literally mean?' },
      { tibetan: "", phonetic: "", english: "Why does Tibetan put the verb at the end?" },
      { tibetan: "", phonetic: "", english: "What is the Losar festival?" },
    ],
    [
      { tibetan: "", phonetic: "", english: "When do I use honorific words?" },
      { tibetan: "", phonetic: "", english: "Explain the difference between གི་ཡོད and གི་འདུག" },
      { tibetan: "", phonetic: "", english: "Tell me about Tibetan New Year" },
    ],
    [
      { tibetan: "", phonetic: "", english: "Explain the ergative particle གིས" },
      { tibetan: "", phonetic: "", english: "Compare Lhasa and Amdo verbs" },
      { tibetan: "", phonetic: "", english: "What is the structure of a sādhana?" },
    ],
  ],
};

const SESSION_THREADS_KEY = "loplao_ai_tutor_v5_threads";
const PREFS_KEY = "loplao_ai_tutor_v5_prefs";

function normalizeWordKey(tib: string): string {
  return (tib || "").trim().replace(/[\s་།༎༏༐༑]+$/g, "");
}

function isTibetanBoundaryChar(ch: string | undefined): boolean {
  if (!ch) return true;
  return /[\s་།༎༏༐༑༔,.!?;:()"'\[\]—–-]/.test(ch);
}

function renderModeIcon(id: ModeId) {
  switch (id) {
    case "converse":
      return <MessageCircle size={15} />;
    case "situations":
      return <Drama size={15} />;
    case "pronounce":
      return <Speech size={15} />;
    case "read":
      return <ScrollText size={15} />;
    case "ask":
      return <HelpCircle size={15} />;
  }
}

function renderInteractiveTibetan(
  text: string,
  words: GlossWord[] | undefined,
  activeWordKey: string | null,
  onSelectWord: (word: GlossWord) => void
): ReactNode {
  if (!text) return null;
  if (!words || words.length === 0) return text;

  const candidates: { token: string; word: GlossWord }[] = [];
  const seen = new Set<string>();
  for (const w of words) {
    const raw = (w.tibetan || "").trim();
    const norm = normalizeWordKey(raw);
    for (const variant of [raw, norm]) {
      if (variant && variant.length >= 1 && !seen.has(variant)) {
        seen.add(variant);
        candidates.push({ token: variant, word: w });
      }
    }
  }
  candidates.sort((a, b) => b.token.length - a.token.length);

  const nodes: ReactNode[] = [];
  let i = 0;
  let plainBuf = "";
  let keyCounter = 0;

  while (i < text.length) {
    let matched: { token: string; word: GlossWord } | null = null;
    const leftOk = i === 0 || isTibetanBoundaryChar(text[i - 1]);

    if (leftOk) {
      for (const cand of candidates) {
        if (!text.startsWith(cand.token, i)) continue;
        const endIdx = i + cand.token.length;
        const tokenEndsWithPunct = isTibetanBoundaryChar(
          cand.token[cand.token.length - 1]
        );
        const rightOk =
          endIdx === text.length ||
          tokenEndsWithPunct ||
          isTibetanBoundaryChar(text[endIdx]);
        if (rightOk) {
          matched = cand;
          break;
        }
      }
    }

    if (matched) {
      if (plainBuf) {
        nodes.push(<span key={`p_${keyCounter++}`}>{plainBuf}</span>);
        plainBuf = "";
      }
      const wKey = normalizeWordKey(matched.word.tibetan);
      const isSelected = activeWordKey === wKey;
      const pickedWord = matched.word;
      nodes.push(
        <button
          key={`w_${keyCounter++}`}
          type="button"
          onClick={() => onSelectWord(pickedWord)}
          title={`${pickedWord.phonetic ? `${pickedWord.phonetic} — ` : ""}${pickedWord.meaning}`}
          className={`inline font-tibetan border-b-2 border-dotted border-brand hover:bg-brand-light/80 rounded-xs px-0.5 transition-colors cursor-pointer ${
            isSelected ? "bg-brand-light text-ink" : ""
          }`}
        >
          {matched.token}
        </button>
      );
      i += matched.token.length;
    } else {
      plainBuf += text[i];
      i += 1;
    }
  }

  if (plainBuf) {
    nodes.push(<span key={`p_${keyCounter++}`}>{plainBuf}</span>);
  }

  return nodes;
}

// ============================================================================
// MAIN V5 AI TUTOR COMPONENT
// ============================================================================
export default function AiTutorPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { isDevUnlocked, isChecking } = useDevBypass();
  const { isNative } = usePlatform();

  // Core v5 state
  const [level, setLevel] = useState<LevelId>("beginner1");
  const [mode, setMode] = useState<ModeId>("converse");
  const [dialect, setDialect] = useState<DialectId>("lhasa_colloquial");
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");

  // Settings (level sets defaults, learner can override anytime)
  const [showGloss, setShowGloss] = useState<boolean>(true);
  const [showPhonetics, setShowPhonetics] = useState<boolean>(true);
  const [speed, setSpeed] = useState<SpeedId>("slow");
  const [autoPlayTts, setAutoPlayTts] = useState<boolean>(false);
  const [autoSendVoice, setAutoSendVoice] = useState<boolean>(true);

  // Popovers & Drawers
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState<boolean>(false);
  const [deeperExpanded, setDeeperExpanded] = useState<boolean>(false);
  const [customReadOpen, setCustomReadOpen] = useState<boolean>(false);
  const [customReadText, setCustomReadText] = useState<string>("");

  // Independent conversation threads per mode
  const [messagesByMode, setMessagesByMode] = useState<MessagesByMode>(createEmptyThreads);
  const [inputText, setInputText] = useState<string>("");
  const [inputKind, setInputKind] = useState<InputKind>("tibetan");
  const [activeGloss, setActiveGloss] = useState<{ msgId: string; word: GlossWord } | null>(null);
  const [expandedEvalMsgIds, setExpandedEvalMsgIds] = useState<Record<string, boolean>>({});

  // Saved vocabulary synced with public.user_learned_words
  const [savedWordItems, setSavedWordItems] = useState<SavedWordItem[]>([]);
  const [savedWordKeys, setSavedWordKeys] = useState<Set<string>>(new Set());
  const [savingMsgId, setSavingMsgId] = useState<string | null>(null);
  const [savingWordKey, setSavingWordKey] = useState<string | null>(null);

  // Audio & Recording state
  const [healthReady, setHealthReady] = useState<boolean | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioInputDevice[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>("");
  const [micLevel, setMicLevel] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [recordingForMsgId, setRecordingForMsgId] = useState<string | null>(null);

  const [isSending, setIsSending] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [evaluatingMsgId, setEvaluatingMsgId] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [loadingAudioKey, setLoadingAudioKey] = useState<string | null>(null);

  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  // Refs
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const threadsRef = useRef<MessagesByMode>(createEmptyThreads());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());
  const ttsReqIdRef = useRef<number>(0);
  const ttsAbortRef = useRef<AbortController | null>(null);
  const chatReqIdRef = useRef<number>(0);
  const chatAbortRef = useRef<AbortController | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelRecordRef = useRef<boolean>(false);
  const recordTargetRef = useRef<{ msgId: string; text: string; targetMode: ModeId } | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafMeterRef = useRef<number | null>(null);

  useEffect(() => {
    threadsRef.current = messagesByMode;
  }, [messagesByMode]);

  const activeMessages = messagesByMode[mode];

  const updateModeMessages = useCallback(
    (targetMode: ModeId, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      setMessagesByMode((prev) => ({
        ...prev,
        [targetMode]: updater(prev[targetMode] || []),
      }));
    },
    []
  );

  // Restore saved preferences & per-mode threads
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedThreads = sessionStorage.getItem(SESSION_THREADS_KEY);
      if (savedThreads) {
        const parsed = JSON.parse(savedThreads);
        if (parsed && typeof parsed === "object") {
          setMessagesByMode({
            converse: Array.isArray(parsed.converse) ? parsed.converse : [],
            situations: Array.isArray(parsed.situations) ? parsed.situations : [],
            pronounce: Array.isArray(parsed.pronounce) ? parsed.pronounce : [],
            read: Array.isArray(parsed.read) ? parsed.read : [],
            ask: Array.isArray(parsed.ask) ? parsed.ask : [],
          });
        }
      }
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        const p = JSON.parse(savedPrefs);
        if (p.level && LEVEL_MAP[p.level as LevelId]) setLevel(p.level);
        if (p.mode && MODE_MAP[p.mode as ModeId]) setMode(p.mode);
        if (p.dialect && DIALECT_OPTIONS.some((d) => d.id === p.dialect)) setDialect(p.dialect);
        if (p.voiceGender === "male" || p.voiceGender === "female") setVoiceGender(p.voiceGender);
        if (typeof p.showGloss === "boolean") setShowGloss(p.showGloss);
        if (typeof p.showPhonetics === "boolean") setShowPhonetics(p.showPhonetics);
        if (p.speed && SPEED_OPTIONS.some((s) => s.id === p.speed)) setSpeed(p.speed);
        if (typeof p.autoPlayTts === "boolean") setAutoPlayTts(p.autoPlayTts);
        if (typeof p.autoSendVoice === "boolean") setAutoSendVoice(p.autoSendVoice);
        if (p.inputKind && INPUT_KIND_CYCLE.some((k) => k.id === p.inputKind)) {
          setInputKind(p.inputKind);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const trimmed: MessagesByMode = {
        converse: messagesByMode.converse.slice(-30),
        situations: messagesByMode.situations.slice(-30),
        pronounce: messagesByMode.pronounce.slice(-30),
        read: messagesByMode.read.slice(-30),
        ask: messagesByMode.ask.slice(-30),
      };
      sessionStorage.setItem(SESSION_THREADS_KEY, JSON.stringify(trimmed));
    } catch {}
  }, [messagesByMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({
          level,
          mode,
          dialect,
          voiceGender,
          showGloss,
          showPhonetics,
          speed,
          autoPlayTts,
          autoSendVoice,
          inputKind,
        })
      );
    } catch {}
  }, [
    level,
    mode,
    dialect,
    voiceGender,
    showGloss,
    showPhonetics,
    speed,
    autoPlayTts,
    autoSendVoice,
    inputKind,
  ]);

  // Close settings popover on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [settingsOpen]);

  const refreshMicrophones = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices
        .filter((d) => d.kind === "audioinput")
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${idx + 1}`,
        }));
      setAudioDevices(mics);
    } catch {}
  }, []);

  const clearTtsCache = useCallback(() => {
    ttsCacheRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });
    ttsCacheRef.current.clear();
  }, []);

  const stopPlayback = useCallback(() => {
    ttsReqIdRef.current += 1;
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
      audioRef.current = null;
    }
    setLoadingAudioKey(null);
    setPlayingKey(null);
  }, []);

  const cleanupRecorder = useCallback(() => {
    if (rafMeterRef.current !== null) {
      cancelAnimationFrame(rafMeterRef.current);
      rafMeterRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    mediaRecorderRef.current = null;
    recordTargetRef.current = null;
    setIsRecording(false);
    setRecordingForMsgId(null);
    setRecordSeconds(0);
    setMicLevel(0);
  }, []);

  useEffect(() => {
    refreshMicrophones();
    return () => {
      stopPlayback();
      cleanupRecorder();
      clearTtsCache();
      if (chatAbortRef.current) chatAbortRef.current.abort();
    };
  }, [refreshMicrophones, stopPlayback, cleanupRecorder, clearTtsCache]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isSending, isTranscribing, evaluatingMsgId]);

  // Bootstrap AI health + user's saved words from Supabase
  useEffect(() => {
    if (isChecking || !isDevUnlocked || !user) return;
    let active = true;
    const bootstrap = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const [healthRes, wordsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/health`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/learned-words`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (active && healthRes.ok) {
          const hd = await healthRes.json();
          setHealthReady(Boolean(hd?.ready));
        }
        if (active && wordsRes.ok) {
          const wd = await wordsRes.json();
          if (Array.isArray(wd?.words)) {
            setSavedWordItems(wd.words);
            const keys = new Set<string>(
              wd.words.map((w: SavedWordItem) =>
                normalizeWordKey(w.word_key || w.tibetan || "")
              )
            );
            setSavedWordKeys(keys);
          }
        }
      } catch {}
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, [isChecking, isDevUnlocked, user, getToken]);

  // ============================================================================
  // LEVEL & MODE SWITCHERS
  // ============================================================================
  const handleLevelChange = (nextLevel: LevelId) => {
    const cfg = LEVEL_MAP[nextLevel];
    setLevel(nextLevel);
    setShowGloss(cfg.defaultGloss);
    setShowPhonetics(cfg.defaultPhonetics);
    setSpeed(cfg.defaultSpeed);
  };

  const handleModeChange = (nextMode: ModeId) => {
    if (isRecording) stopRecording(true);
    stopPlayback();
    setMode(nextMode);
    setActiveGloss(null);
    setErrorBanner(null);
    setCustomReadOpen(false);
    if (nextMode === "ask") {
      setInputKind("english");
    } else if (inputKind === "english") {
      setInputKind("tibetan");
    }
  };

  const handleResetActiveMode = () => {
    chatReqIdRef.current += 1;
    if (chatAbortRef.current) {
      chatAbortRef.current.abort();
      chatAbortRef.current = null;
    }
    stopPlayback();
    setIsSending(false);
    setEvaluatingMsgId(null);
    updateModeMessages(mode, () => []);
    setActiveGloss(null);
    setExpandedEvalMsgIds({});
    setErrorBanner(null);
    setInfoNotice(null);
  };

  // ============================================================================
  // AUDIO PLAYBACK (PLAY = ACTIVE SPEED, SLOW = NOTICEABLY SLOWER)
  // ============================================================================
  const speakTibetan = useCallback(
    async (
      key: string,
      tibetanText: string,
      opts?: { slow?: boolean; isAutoPlay?: boolean; msgId?: string; targetMode?: ModeId }
    ) => {
      const clean = (tibetanText || "").trim();
      if (!clean) return;

      const playTag = `${key}:${opts?.slow ? "slow" : "norm"}`;
      if (playingKey === playTag) {
        stopPlayback();
        return;
      }

      stopPlayback();
      const myReqId = ++ttsReqIdRef.current;
      const cacheKey = `${dialect}:${voiceGender}:${clean}`;
      const cachedUrl = ttsCacheRef.current.get(cacheKey);
      const activeSpeedRate =
        SPEED_OPTIONS.find((s) => s.id === speed)?.rate ?? 1.0;
      const playbackRate = opts?.slow
        ? speed === "slow"
          ? 0.68
          : 0.74
        : activeSpeedRate;

      const playBlobUrl = async (blobUrl: string) => {
        if (myReqId !== ttsReqIdRef.current) return;
        const audio = new Audio(blobUrl);
        audio.playbackRate = playbackRate;
        audioRef.current = audio;
        setLoadingAudioKey(null);
        setPlayingKey(playTag);

        audio.onended = () => {
          if (audioRef.current === audio) {
            audioRef.current = null;
            setPlayingKey(null);
          }
        };
        audio.onerror = () => {
          if (audioRef.current === audio) {
            audioRef.current = null;
            setPlayingKey(null);
          }
        };

        try {
          await audio.play();
          if (opts?.msgId && opts?.targetMode) {
            updateModeMessages(opts.targetMode, (prev) =>
              prev.map((m) =>
                m.id === opts.msgId ? { ...m, needsTapToPlay: false } : m
              )
            );
          }
        } catch (playErr: unknown) {
          if (audioRef.current === audio) audioRef.current = null;
          setPlayingKey(null);
          const errName = playErr instanceof Error ? playErr.name : "";
          if (
            errName === "NotAllowedError" &&
            opts?.isAutoPlay &&
            opts?.msgId &&
            opts?.targetMode
          ) {
            updateModeMessages(opts.targetMode, (prev) =>
              prev.map((m) =>
                m.id === opts.msgId ? { ...m, needsTapToPlay: true } : m
              )
            );
          } else if (errName !== "AbortError") {
            setInfoNotice(
              "Audio playback was blocked or unavailable — text and speech feedback still work normally."
            );
          }
        }
      };

      if (cachedUrl) {
        await playBlobUrl(cachedUrl);
        return;
      }

      setLoadingAudioKey(playTag);
      const controller = new AbortController();
      ttsAbortRef.current = controller;

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");
        if (myReqId !== ttsReqIdRef.current) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/tts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: clean,
            dialect,
            voice_gender: voiceGender,
          }),
          signal: controller.signal,
        });

        if (myReqId !== ttsReqIdRef.current) return;

        if (!res.ok) {
          let errMsg =
            "Voice playback is temporarily unavailable — chat and speech feedback still work normally.";
          try {
            const errJson = await res.json();
            if (errJson?.error) errMsg = errJson.error;
          } catch {}
          setLoadingAudioKey(null);
          setPlayingKey(null);
          setInfoNotice(errMsg);
          return;
        }

        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        if (myReqId !== ttsReqIdRef.current) {
          URL.revokeObjectURL(blobUrl);
          return;
        }

        ttsCacheRef.current.set(cacheKey, blobUrl);
        await playBlobUrl(blobUrl);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (myReqId === ttsReqIdRef.current) {
          setLoadingAudioKey(null);
          setPlayingKey(null);
          setInfoNotice(
            "Voice playback is temporarily unavailable — chat and speech feedback still work normally."
          );
        }
      }
    },
    [getToken, playingKey, dialect, voiceGender, speed, stopPlayback, updateModeMessages]
  );

  // ============================================================================
  // SAVE TO VOCABULARY (SYNCED TO public.user_learned_words)
  // ============================================================================
  const saveWordsToVocabulary = useCallback(
    async (wordsToSave: GlossWord[], sourceId: string, singleKey?: string) => {
      const valid = wordsToSave.filter((w) => normalizeWordKey(w.tibetan));
      if (valid.length === 0) return;

      if (singleKey) setSavingWordKey(singleKey);
      else setSavingMsgId(sourceId);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const entries = valid.map((w) => ({
          module_id: 99,
          tibetan: w.tibetan.trim(),
          pronunciation: (w.phonetic || "").trim(),
          english: (w.meaning || "").trim(),
        }));

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/learned-words/record`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ entries }),
          }
        );

        if (!res.ok) throw new Error("Could not save vocabulary right now.");

        setSavedWordKeys((prev) => {
          const next = new Set(prev);
          valid.forEach((w) => next.add(normalizeWordKey(w.tibetan)));
          return next;
        });

        setSavedWordItems((prev) => {
          const existing = new Set(prev.map((x) => normalizeWordKey(x.word_key || x.tibetan)));
          const added: SavedWordItem[] = [];
          for (const w of valid) {
            const k = normalizeWordKey(w.tibetan);
            if (!existing.has(k)) {
              existing.add(k);
              added.push({
                word_key: k,
                tibetan: w.tibetan.trim(),
                pronunciation: (w.phonetic || "").trim(),
                english: (w.meaning || "").trim(),
                module_id: 99,
              });
            }
          }
          return [...added, ...prev];
        });

        setInfoNotice(
          valid.length === 1
            ? `Saved "${valid[0].tibetan}" to your Loplao vocabulary.`
            : `Saved ${valid.length} words to your Loplao vocabulary.`
        );
      } catch (err: unknown) {
        setErrorBanner(
          err instanceof Error ? err.message : "Could not save vocabulary."
        );
      } finally {
        setSavingMsgId(null);
        setSavingWordKey(null);
      }
    },
    [getToken]
  );

  // ============================================================================
  // SEND CHAT TURN (V5 SPEC PAYLOAD)
  // ============================================================================
  const sendTurn = useCallback(
    async (
      textOverride?: string,
      kindOverride?: InputKind | "speech",
      options?: {
        phonetic?: string;
        english?: string;
        contextBanner?: { tibetan: string; english: string };
        customPassage?: boolean;
      }
    ) => {
      const content = (textOverride ?? inputText).trim();
      if (!content || isSending) return;

      const targetMode = mode;
      const modeHistory = threadsRef.current[targetMode] || [];

      // Local shortcut for "Say it slower"
      if (content.toLowerCase() === "say it slower") {
        const lastAssistant = [...modeHistory]
          .reverse()
          .find((m) => m.role === "assistant" && m.tibetan);
        if (lastAssistant) {
          speakTibetan(lastAssistant.id, lastAssistant.tibetan, {
            slow: true,
            msgId: lastAssistant.id,
            targetMode,
          });
          return;
        }
      }

      setErrorBanner(null);
      setActiveGloss(null);
      if (textOverride === undefined) {
        setInputText("");
      }

      // Smart input-kind detection for typed text
      let resolvedKind: InputKind | "speech" = kindOverride ?? inputKind;
      if (resolvedKind !== "speech") {
        const hasTib = /[\u0F00-\u0FFF]/.test(content);
        const hasLat = /[A-Za-z]/.test(content);
        if (hasTib && !hasLat) {
          resolvedKind = "tibetan";
        } else if (!hasTib && resolvedKind === "tibetan") {
          resolvedKind = "english";
        }
      }

      const myChatId = ++chatReqIdRef.current;
      if (chatAbortRef.current) chatAbortRef.current.abort();
      const controller = new AbortController();
      chatAbortRef.current = controller;

      const leadMsg: ChatMessage = options?.contextBanner
        ? {
            id: `c_${Date.now()}`,
            role: "context",
            msgMode: targetMode,
            tibetan: options.contextBanner.tibetan,
            english: options.contextBanner.english,
          }
        : {
            id: `u_${Date.now()}`,
            role: "user",
            msgMode: targetMode,
            tibetan: content,
            phonetic: options?.phonetic,
            english: options?.english,
            isVoice: resolvedKind === "speech",
            inputKind: resolvedKind,
          };

      const historyPayload = modeHistory
        .filter((m) => m.role !== "context")
        .map((m) => ({
          role: m.role,
          text: m.role === "assistant" ? `${m.tibetan} (${m.english || ""})` : m.tibetan,
        }));

      const lessonSuggestionsShown = Object.values(threadsRef.current)
        .flat()
        .filter((m) => m.role === "assistant" && m.lessonSuggestion).length;

      updateModeMessages(targetMode, (prev) => [...prev, leadMsg]);
      setIsSending(true);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level,
            mode: targetMode,
            dialect,
            settings: {
              gloss: showGloss,
              phonetics: showPhonetics,
              speed,
            },
            input: {
              kind: resolvedKind,
              text: content,
            },
            custom_passage: Boolean(options?.customPassage),
            history: historyPayload,
            saved_words: Array.from(savedWordKeys).slice(0, 20),
            lesson_suggestions_shown: lessonSuggestionsShown,
          }),
          signal: controller.signal,
        });

        const data = await res.json();
        if (myChatId !== chatReqIdRef.current) return;

        if (res.status === 429 || data?.code === "quota_exceeded") {
          setIsSending(false);
          setErrorBanner(
            data?.error ||
              "You have reached your daily AI Tutor usage limit. Please try again after 00:00 UTC."
          );
          return;
        }

        if (!res.ok || !data?.reply) {
          throw new Error(
            data?.error || "The AI Tutor could not respond right now. Please try again."
          );
        }

        const reply = data.reply;
        const assistantId = `a_${Date.now()}`;
        const assistantMessage: ChatMessage = {
          id: assistantId,
          role: "assistant",
          msgMode: targetMode,
          tibetan: reply.tibetan || "",
          phonetic: reply.phonetic || "",
          english: reply.english || "",
          words: Array.isArray(reply.words) ? reply.words : [],
          feedback: reply.feedback || null,
          suggestedReplies: Array.isArray(reply.suggested_replies)
            ? reply.suggested_replies
            : [],
          lessonSuggestion: reply.lesson_suggestion || null,
        };

        updateModeMessages(targetMode, (prev) => [...prev, assistantMessage]);
        setIsSending(false);

        if (autoPlayTts && assistantMessage.tibetan && targetMode !== "ask") {
          speakTibetan(assistantId, assistantMessage.tibetan, {
            slow: false,
            isAutoPlay: true,
            msgId: assistantId,
            targetMode,
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (myChatId === chatReqIdRef.current) {
          setIsSending(false);
          setErrorBanner(
            err instanceof Error ? err.message : "Could not reach the AI Tutor."
          );
        }
      }
    },
    [
      inputText,
      isSending,
      mode,
      inputKind,
      getToken,
      level,
      dialect,
      showGloss,
      showPhonetics,
      speed,
      savedWordKeys,
      autoPlayTts,
      speakTibetan,
      updateModeMessages,
    ]
  );

  // Load & gloss custom Tibetan passage inside Read mode
  const handleStartCustomRead = () => {
    const clean = customReadText.trim();
    if (!clean || isSending) return;
    setCustomReadOpen(false);
    setCustomReadText("");
    sendTurn(clean, "tibetan", {
      customPassage: true,
      contextBanner: { tibetan: "", english: "Reading · Custom Tibetan passage" },
    });
  };

  // ============================================================================
  // SPEECH RECOGNITION (STT) & RAW-AUDIO PRONUNCIATION EVALUATION
  // ============================================================================
  const transcribeAudioBlob = useCallback(
    async (blob: Blob, mimeType: string) => {
      setIsTranscribing(true);
      setErrorBanner(null);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const ext = mimeType.includes("mp4")
          ? "mp4"
          : mimeType.includes("ogg")
          ? "ogg"
          : "webm";

        const lastAssistant = [...(threadsRef.current[mode] || [])]
          .reverse()
          .find((m) => m.role === "assistant");
        const contextHint = lastAssistant
          ? `${lastAssistant.tibetan} (${lastAssistant.english || ""})`
          : "";

        const formData = new FormData();
        formData.append("audio", blob, `recording.${ext}`);
        formData.append("language", "bo");
        formData.append("dialect", dialect);
        if (contextHint) formData.append("context_hint", contextHint);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/stt`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (res.status === 429 || data?.code === "quota_exceeded") {
          setIsTranscribing(false);
          setErrorBanner(
            data?.error ||
              "You have reached your daily AI Tutor usage limit. Please try again after 00:00 UTC."
          );
          return;
        }
        if (!res.ok) {
          throw new Error(
            data?.error || "Could not recognize speech. Please try again or type below."
          );
        }

        const transcript = (data?.transcript || "").trim();
        setIsTranscribing(false);

        if (!transcript) {
          if (data?.debug?.reason === "silent_mic") {
            setSettingsOpen(true);
            setErrorBanner(
              "No voice was detected. Open Tutor settings to select your active microphone, or type below."
            );
          } else {
            setErrorBanner(
              "No speech detected. Try speaking clearly for 1–3 seconds, or type below."
            );
          }
          return;
        }

        if (autoSendVoice) {
          await sendTurn(transcript, "speech");
        } else {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      } catch (err: unknown) {
        setIsTranscribing(false);
        setErrorBanner(
          err instanceof Error
            ? err.message
            : "Could not recognize speech. You can type below instead."
        );
      }
    },
    [getToken, mode, dialect, autoSendVoice, sendTurn]
  );

  const evaluateRepeatAfterMe = useCallback(
    async (
      msgId: string,
      targetText: string,
      targetMode: ModeId,
      blob: Blob,
      mimeType: string
    ) => {
      setEvaluatingMsgId(msgId);
      setErrorBanner(null);

      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication unavailable.");

        const ext = mimeType.includes("mp4")
          ? "mp4"
          : mimeType.includes("ogg")
          ? "ogg"
          : "webm";

        const formData = new FormData();
        formData.append("audio", blob, `repeat.${ext}`);
        formData.append("target_text", targetText);
        formData.append("level", level);
        formData.append("dialect", dialect);
        formData.append("mode", targetMode);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ai/evaluate-reading`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const data = await res.json();
        if (res.status === 429 || data?.code === "quota_exceeded") {
          setEvaluatingMsgId(null);
          setErrorBanner(
            data?.error ||
              "You have reached your daily AI Tutor usage limit. Please try again after 00:00 UTC."
          );
          return;
        }
        if (!res.ok) {
          throw new Error(
            data?.error || "Could not evaluate your speech right now. Please try again."
          );
        }

        const fb: SpeechFeedback | null = data?.feedback
          ? {
              status: data.feedback.status === "needs_work" ? "needs_work" : "good",
              message: data.feedback.message || "",
            }
          : null;
        const evalObj: ReadingEvaluation | null = data?.evaluation || null;

        updateModeMessages(targetMode, (prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, feedback: fb, evaluation: evalObj } : m
          )
        );
        setEvaluatingMsgId(null);
      } catch (err: unknown) {
        setEvaluatingMsgId(null);
        setErrorBanner(
          err instanceof Error ? err.message : "Speech evaluation failed."
        );
      }
    },
    [getToken, level, dialect, updateModeMessages]
  );

  const startRecording = async (repeatTarget?: { msgId: string; text: string }) => {
    if (isRecording || isTranscribing || isSending || evaluatingMsgId) return;

    setErrorBanner(null);
    stopPlayback();

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorBanner("Microphone access is not supported on this browser. Please type below.");
      return;
    }

    // In Pronounce mode, tapping the main gold Mic evaluates raw audio against the latest target phrase!
    let resolvedTarget = repeatTarget
      ? { ...repeatTarget, targetMode: mode }
      : null;
    if (!resolvedTarget && mode === "pronounce") {
      const latestTarget = [...(threadsRef.current.pronounce || [])]
        .reverse()
        .find((m) => m.role === "assistant" && m.tibetan);
      if (latestTarget) {
        resolvedTarget = {
          msgId: latestTarget.id,
          text: latestTarget.tibetan,
          targetMode: "pronounce",
        };
      }
    }

    try {
      const audioConstraints: MediaTrackConstraints = selectedMicId
        ? {
            deviceId: { exact: selectedMicId },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        : {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });
      mediaStreamRef.current = stream;
      recordTargetRef.current = resolvedTarget;
      setRecordingForMsgId(resolvedTarget?.msgId ?? null);
      refreshMicrophones();

      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          const dataArr = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            analyser.getByteTimeDomainData(dataArr);
            let sum = 0;
            for (let i = 0; i < dataArr.length; i++) {
              const v = (dataArr[i] - 128) / 128;
              sum += v * v;
            }
            setMicLevel(Math.min(100, Math.round(Math.sqrt(sum / dataArr.length) * 420)));
            rafMeterRef.current = requestAnimationFrame(tick);
          };
          tick();
        }
      } catch {}

      const candidateTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      const supportedMime =
        typeof MediaRecorder !== "undefined"
          ? candidateTypes.find((t) => MediaRecorder.isTypeSupported(t)) || ""
          : "";

      const recorder = supportedMime
        ? new MediaRecorder(stream, { mimeType: supportedMime })
        : new MediaRecorder(stream);

      const activeMime = recorder.mimeType || supportedMime || "audio/webm";
      recordedChunksRef.current = [];
      cancelRecordRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const wasCancelled = cancelRecordRef.current;
        const chunks = recordedChunksRef.current;
        const targetSnap = recordTargetRef.current;
        cleanupRecorder();
        if (!wasCancelled && chunks.length > 0) {
          const blob = new Blob(chunks, { type: activeMime });
          if (targetSnap) {
            evaluateRepeatAfterMe(
              targetSnap.msgId,
              targetSnap.text,
              targetSnap.targetMode,
              blob,
              activeMime
            );
          } else {
            transcribeAudioBlob(blob, activeMime);
          }
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err: unknown) {
      cleanupRecorder();
      const errName = err instanceof Error ? err.name : "";
      setErrorBanner(
        errName === "NotAllowedError"
          ? "Microphone permission was denied. Enable mic access or type below."
          : "Could not start recording. Open Tutor settings to pick a valid microphone."
      );
    }
  };

  const stopRecording = (cancel = false) => {
    cancelRecordRef.current = cancel;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.requestData();
      } catch {}
      mediaRecorderRef.current.stop();
    } else {
      cleanupRecorder();
    }
  };

  // ============================================================================
  // GUARD & DERIVED VALUES
  // ============================================================================
  if (isChecking) return <div className="min-h-[60vh] bg-paper" />;
  if (!isDevUnlocked) return null;

  const currentLevel = LEVEL_MAP[level];
  const currentMode = MODE_MAP[mode];
  const isRecommendedMode = currentLevel.recommendedModes.includes(mode);
  const starterCards = STARTER_CARDS[mode][currentLevel.tierIndex];
  const activeInputKindObj =
    INPUT_KIND_CYCLE.find((k) => k.id === inputKind) || INPUT_KIND_CYCLE[0];
  const learnerFirstName = user?.firstName || "Scholar";
  const hasActiveConversation = activeMessages.length > 0;
  const showFullDeeperGrid = (!isNative && !hasActiveConversation) || deeperExpanded;

  const latestPronounceTarget =
    mode === "pronounce"
      ? [...activeMessages]
          .reverse()
          .find((m) => m.role === "assistant" && m.tibetan)
      : undefined;

  const inputPlaceholder = latestPronounceTarget
    ? "Tap the gold mic to pronounce the phrase above, or type a new phrase…"
    : activeInputKindObj.placeholder;

  const cycleInputKind = () => {
    const idx = INPUT_KIND_CYCLE.findIndex((k) => k.id === inputKind);
    setInputKind(INPUT_KIND_CYCLE[(idx + 1) % INPUT_KIND_CYCLE.length].id);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleStarterClick = (card: StarterCard) => {
    if (mode === "ask") {
      sendTurn(card.english, "english");
      return;
    }
    if (mode === "situations") {
      sendTurn(
        `Start a ${currentLevel.label} role-play scene: ${card.tibetan} (${card.english}). Open in character with the first line.`,
        "english",
        {
          contextBanner: {
            tibetan: card.tibetan,
            english: `Scene · ${card.english}`,
          },
        }
      );
      return;
    }
    if (mode === "read") {
      sendTurn(
        `Provide a ${currentLevel.label} Tibetan reading passage for: ${card.tibetan} (${card.english}). Include every word in words[] for tap-to-gloss.`,
        "english",
        {
          contextBanner: {
            tibetan: card.tibetan,
            english: `Reading · ${card.english}`,
          },
        }
      );
      return;
    }
    if (mode === "pronounce") {
      sendTurn(
        `Give me a focused ${currentLevel.label} pronunciation practice phrase for: ${card.tibetan} (${card.english}), with a short tip on what sound to watch.`,
        "english",
        {
          contextBanner: {
            tibetan: card.tibetan,
            english: `Pronunciation · ${card.english}`,
          },
        }
      );
      return;
    }
    sendTurn(card.tibetan || card.english, card.tibetan ? "tibetan" : "english", {
      phonetic: card.phonetic,
      english: card.english,
    });
  };

  return (
    <div
      className={`flex flex-col h-full bg-paper text-ink ${
        isNative ? "pt-safe" : ""
      }`}
    >
      {/* ====================================================================
          1. TOP HEADER BAR (TITLE + SAVED WORDS + LEVEL PILL + SETTINGS)
      ==================================================================== */}
      <div className="shrink-0 relative z-20 px-4 sm:px-6 pb-2.5 border-b border-border-subtle">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Title + Ready status dot */}
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="font-serif font-semibold text-xl sm:text-2xl text-ink truncate">
              AI Tutor
            </h1>
            {healthReady === true && (
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                title="AI Tutor Ready"
              />
            )}
            {healthReady === false && (
              <span
                className="w-2 h-2 rounded-full bg-amber-500 shrink-0"
                title="AI Tutor Unavailable"
              />
            )}
          </div>

          {/* Right: Saved Words + Level Pill + Reset + Settings Gear */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Saved Words Drawer Button */}
            <button
              type="button"
              onClick={() => setSavedDrawerOpen(true)}
              title="View your saved vocabulary"
              className="inline-flex items-center gap-1.5 bg-surface border border-border-subtle hover:border-brand rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-ink shadow-2xs transition-colors cursor-pointer"
            >
              <Bookmark size={13} className="text-brand-dark" />
              <span className="hidden sm:inline">Saved</span>
              <span className="bg-brand-light text-brand-dark font-bold text-[10px] rounded-full px-1.5 py-0.5 leading-none">
                {savedWordItems.length}
              </span>
            </button>

            {/* Level Selector Pill (B1 / B2 / PI / I) */}
            <div className="inline-flex items-center gap-1.5 bg-surface border border-border-subtle rounded-full pl-1 pr-2.5 py-1 shadow-2xs">
              <span className="bg-brand text-ink font-bold text-[11px] rounded-full px-2 py-0.5 leading-none">
                {currentLevel.badge}
              </span>
              <select
                value={level}
                onChange={(e) => handleLevelChange(e.target.value as LevelId)}
                aria-label="Select Tibetan proficiency level"
                className="bg-transparent text-xs sm:text-sm font-semibold text-ink focus:outline-none cursor-pointer pr-1"
              >
                {LEVELS.map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {lv.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Active Mode Button */}
            {hasActiveConversation && (
              <button
                type="button"
                onClick={handleResetActiveMode}
                title={`Reset ${currentMode.label}`}
                className="w-9 h-9 rounded-full bg-surface border border-border-subtle hover:border-ink text-ink-light hover:text-ink flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCcw size={15} />
              </button>
            )}

            {/* Tutor Settings Popover */}
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => {
                  refreshMicrophones();
                  setSettingsOpen((v) => !v);
                }}
                title="Tutor settings"
                aria-label="Tutor settings"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
                  settingsOpen
                    ? "bg-ink text-white border-ink"
                    : "bg-surface border-border-subtle text-ink hover:border-ink"
                }`}
              >
                <Settings size={16} />
              </button>

              {settingsOpen && (
                <div className="absolute right-0 top-11 w-[290px] sm:w-[310px] max-h-[70vh] overflow-y-auto custom-scrollbar bg-surface border border-border-strong rounded-2xl shadow-xl p-4 z-40 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-2">
                    Tutor settings
                  </div>

                  {/* Gloss toggle */}
                  <div className="flex items-center justify-between py-2.5 border-b border-border-subtle text-sm">
                    <span className="text-ink">Gloss (English meaning)</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showGloss}
                      onClick={() => setShowGloss((v) => !v)}
                      className={`w-10 h-[22px] rounded-full transition-colors relative cursor-pointer ${
                        showGloss ? "bg-brand" : "bg-border-subtle"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-xs transition-all ${
                          showGloss ? "left-[21px]" : "left-[3px]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Phonetics toggle */}
                  <div className="flex items-center justify-between py-2.5 border-b border-border-subtle text-sm">
                    <span className="text-ink">Phonetics</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showPhonetics}
                      onClick={() => setShowPhonetics((v) => !v)}
                      className={`w-10 h-[22px] rounded-full transition-colors relative cursor-pointer ${
                        showPhonetics ? "bg-brand" : "bg-border-subtle"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-xs transition-all ${
                          showPhonetics ? "left-[21px]" : "left-[3px]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Speaking speed */}
                  <div className="flex items-center justify-between py-2.5 border-b border-border-subtle text-sm">
                    <span className="text-ink">Speaking speed</span>
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value as SpeedId)}
                      className="bg-paper border border-border-subtle rounded-lg px-2 py-1 text-xs font-semibold text-ink focus:outline-none focus:border-brand cursor-pointer"
                    >
                      {SPEED_OPTIONS.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dialect */}
                  <div className="flex items-center justify-between py-2.5 border-b border-border-subtle text-sm">
                    <span className="text-ink">Dialect</span>
                    <select
                      value={dialect}
                      onChange={(e) => setDialect(e.target.value as DialectId)}
                      className="bg-paper border border-border-subtle rounded-lg px-2 py-1 text-xs font-semibold text-ink focus:outline-none focus:border-brand cursor-pointer"
                    >
                      {DIALECT_OPTIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Voice preference */}
                  <div className="flex items-center justify-between py-2.5 border-b border-border-subtle text-sm">
                    <span className="text-ink">Tutor voice</span>
                    <select
                      value={voiceGender}
                      onChange={(e) =>
                        setVoiceGender(e.target.value === "male" ? "male" : "female")
                      }
                      className="bg-paper border border-border-subtle rounded-lg px-2 py-1 text-xs font-semibold text-ink focus:outline-none focus:border-brand cursor-pointer"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>

                  {/* Auto-speak replies */}
                  <div className="flex items-center justify-between py-2.5 border-b border-border-subtle text-sm">
                    <span className="text-ink">Auto-speak replies</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={autoPlayTts}
                      onClick={() => setAutoPlayTts((v) => !v)}
                      className={`w-10 h-[22px] rounded-full transition-colors relative cursor-pointer ${
                        autoPlayTts ? "bg-brand" : "bg-border-subtle"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-xs transition-all ${
                          autoPlayTts ? "left-[21px]" : "left-[3px]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Auto-send voice */}
                  <div className="flex items-center justify-between py-2.5 border-b border-border-subtle text-sm">
                    <span className="text-ink">Auto-send voice</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={autoSendVoice}
                      onClick={() => setAutoSendVoice((v) => !v)}
                      className={`w-10 h-[22px] rounded-full transition-colors relative cursor-pointer ${
                        autoSendVoice ? "bg-brand" : "bg-border-subtle"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-xs transition-all ${
                          autoSendVoice ? "left-[21px]" : "left-[3px]"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Microphone Input */}
                  <div className="pt-2.5">
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Microphone
                    </label>
                    <select
                      value={selectedMicId}
                      onChange={(e) => setSelectedMicId(e.target.value)}
                      className="w-full bg-paper border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-brand cursor-pointer"
                    >
                      <option value="">System Default Mic</option>
                      {audioDevices.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5 Mode Tabs */}
        <div className="max-w-4xl mx-auto mt-2 -mb-[11px] flex items-center gap-1 overflow-x-auto custom-scrollbar">
          {MODES.map((m) => {
            const active = mode === m.id;
            const rec = currentLevel.recommendedModes.includes(m.id);
            const hasThread = messagesByMode[m.id].length > 0;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeChange(m.id)}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm whitespace-nowrap border-b-[3px] transition-colors cursor-pointer ${
                  active
                    ? "border-brand text-ink font-semibold"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {renderModeIcon(m.id)}
                <span>{m.label}</span>
                {rec && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-brand ml-0.5"
                    title="Recommended for your level"
                  />
                )}
                {!active && hasThread && (
                  <span
                    className="text-[9px] font-bold text-ink-muted bg-surface border border-border-subtle rounded-full px-1.5 leading-tight"
                    title="Active conversation"
                  >
                    {messagesByMode[m.id].filter((x) => x.role === "assistant").length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Description Strip */}
      <div className="shrink-0 px-4 sm:px-6 pt-2.5 pb-1">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
          <div>
            <strong className="text-ink">{currentMode.label}:</strong>{" "}
            {currentMode.tierDescriptions[currentLevel.tierIndex]}.{" "}
            {isRecommendedMode && (
              <span className="text-brand-dark font-bold ml-1">
                ● Recommended for you
              </span>
            )}
          </div>

          {mode === "read" && (
            <button
              type="button"
              onClick={() => setCustomReadOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-ink hover:text-brand-dark underline decoration-brand underline-offset-4 cursor-pointer"
            >
              <FileText size={12} />
              {customReadOpen ? "Close custom text" : "Paste your own Tibetan text"}
            </button>
          )}
        </div>
      </div>

      {/* Custom Reading Passage Input Drawer (Read Mode) */}
      {mode === "read" && customReadOpen && (
        <div className="shrink-0 px-4 sm:px-6 pt-2">
          <div className="max-w-4xl mx-auto bg-surface border border-border-strong rounded-2xl p-4 shadow-sm animate-in fade-in">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
              Paste any Tibetan passage — we&apos;ll add tap-to-gloss, phonetics &amp; audio
            </label>
            <textarea
              rows={2}
              value={customReadText}
              maxLength={1500}
              onChange={(e) => setCustomReadText(e.target.value)}
              placeholder="བཀྲ་ཤིས་བདེ་ལེགས། ..."
              className="w-full bg-paper/70 border border-border-subtle focus:border-brand rounded-xl p-3 font-tibetan text-2xl leading-[1.8] text-ink outline-none resize-y"
            />
            <div className="mt-2.5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCustomReadOpen(false)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartCustomRead}
                disabled={!customReadText.trim() || isSending}
                className="px-4 py-1.5 rounded-full bg-ink hover:bg-ink-light text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Load &amp; Add Tap-to-Gloss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notices & Error Banners */}
      {(infoNotice || errorBanner) && (
        <div className="shrink-0 px-4 sm:px-6 pt-2 space-y-1.5">
          {infoNotice && (
            <div className="max-w-4xl mx-auto px-4 py-2 rounded-2xl bg-brand-light border border-brand/30 text-ink text-xs font-medium flex items-center justify-between gap-2">
              <span>{infoNotice}</span>
              <button
                type="button"
                onClick={() => setInfoNotice(null)}
                className="text-ink-muted hover:text-ink shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {errorBanner && (
            <div className="max-w-4xl mx-auto px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle size={15} className="shrink-0" />
                <span className="break-words">{errorBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorBanner(null)}
                className="text-rose-600 hover:text-rose-900 shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          2. SCROLLABLE STAGE (PER-MODE STARTER CARDS OR ACTIVE CONVERSATION)
      ==================================================================== */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto">
          {activeMessages.length === 0 ? (
            <div className="py-3 sm:py-5 animate-in fade-in">
              {/* Greeting Hero */}
              <div className="mb-6">
                <div className="text-xs sm:text-sm text-ink-muted mb-1">
                  Welcome back, {learnerFirstName}
                </div>
                <div className="font-tibetan text-4xl sm:text-[44px] text-ink leading-[1.6]">
                  {currentMode.greetingTib}
                </div>
                {showPhonetics && (
                  <div className="text-base sm:text-lg text-ink-muted">
                    {currentMode.greetingPho}
                  </div>
                )}
              </div>

              {/* Starter Cards Grid */}
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-2.5">
                {currentMode.cardsLabel}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {starterCards.map((card, idx) => {
                  const cardPlayKey = `starter_${mode}_${level}_${idx}`;
                  const isCardPlaying = playingKey === `${cardPlayKey}:norm`;
                  const isCardLoading = loadingAudioKey === `${cardPlayKey}:norm`;

                  return (
                    <div
                      key={`${mode}_${level}_${idx}`}
                      onClick={() => handleStarterClick(card)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleStarterClick(card);
                        }
                      }}
                      className={`group bg-surface border border-border-subtle hover:border-brand rounded-[18px] p-4 shadow-sm hover:-translate-y-0.5 transition-all flex flex-col gap-1.5 min-h-[132px] cursor-pointer text-left ${
                        mode === "ask" ? "justify-center" : ""
                      }`}
                    >
                      {mode !== "ask" && card.tibetan && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakTibetan(cardPlayKey, card.tibetan, {
                              slow: false,
                            });
                          }}
                          title={isCardPlaying ? "Stop audio" : "Listen to phrase"}
                          className={`self-end w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            isCardPlaying
                              ? "bg-brand text-ink"
                              : "bg-brand-light text-ink hover:bg-brand"
                          }`}
                        >
                          {isCardLoading ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : isCardPlaying ? (
                            <Square size={11} fill="currentColor" />
                          ) : (
                            <Play size={12} fill="currentColor" className="ml-0.5" />
                          )}
                        </button>
                      )}

                      {card.tibetan && (
                        <div className="font-tibetan text-[21px] leading-[1.75] text-ink">
                          {card.tibetan}
                        </div>
                      )}

                      {showPhonetics && card.phonetic && (
                        <div className="text-xs sm:text-sm text-ink-light">
                          {card.phonetic}
                        </div>
                      )}

                      {(mode === "ask" || showGloss) && (
                        <div
                          className={
                            mode === "ask"
                              ? "text-[15px] font-medium text-ink leading-snug"
                              : "text-xs sm:text-[13px] text-ink-muted mt-auto pt-1"
                          }
                        >
                          {card.english}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5 pb-4">
              {activeMessages.map((msg, idx) => {
                const isLatestAssistant =
                  msg.role === "assistant" && idx === activeMessages.length - 1;

                // ---------------- CONTEXT BANNER (SCENE / READING / DRILL) ----------------
                if (msg.role === "context") {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-brand-light/70 border border-brand/30 rounded-full px-4 py-1.5 text-xs text-ink">
                        {msg.tibetan && (
                          <span className="font-tibetan text-base leading-[1.5] text-ink">
                            {msg.tibetan}
                          </span>
                        )}
                        {msg.english && (
                          <span className="font-semibold text-ink-light">
                            {msg.english}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                // ---------------- USER BUBBLE ----------------
                if (msg.role === "user") {
                  const hasTib = /[\u0F00-\u0FFF]/.test(msg.tibetan);
                  const hasLat = /[A-Za-z]/.test(msg.tibetan);
                  const pureTib = hasTib && !hasLat;
                  return (
                    <div key={msg.id} className="flex flex-col items-end gap-1">
                      <div className="max-w-[88%] sm:max-w-[75%] bg-ink text-white rounded-[20px] rounded-tr-[4px] px-4 py-3 shadow-sm">
                        <div
                          className={
                            pureTib
                              ? "font-tibetan text-[22px] sm:text-[24px] leading-[1.8] text-white"
                              : "text-sm sm:text-base text-white leading-relaxed"
                          }
                        >
                          {msg.tibetan}
                        </div>
                        {showPhonetics && msg.phonetic && (
                          <div className="text-xs sm:text-sm text-white/80 mt-0.5">
                            {msg.phonetic}
                          </div>
                        )}
                        {showGloss && msg.english && pureTib && (
                          <div className="text-xs text-white/75 mt-0.5">
                            {msg.english}
                          </div>
                        )}
                      </div>
                      {msg.isVoice && (
                        <span className="text-[10px] font-semibold text-ink-muted pr-1">
                          Spoken
                        </span>
                      )}
                    </div>
                  );
                }

                // ---------------- ASSISTANT BUBBLE ----------------
                const normKey = `${msg.id}:norm`;
                const slowKey = `${msg.id}:slow`;
                const isPlayingNorm = playingKey === normKey;
                const isPlayingSlow = playingKey === slowKey;
                const isLoadingNorm = loadingAudioKey === normKey;
                const isLoadingSlow = loadingAudioKey === slowKey;
                const isRecordingThis =
                  isRecording && recordingForMsgId === msg.id;
                const isEvaluatingThis = evaluatingMsgId === msg.id;
                const isAskReply = (msg.msgMode ?? mode) === "ask";

                const bubbleWords = msg.words || [];
                const allSaved =
                  bubbleWords.length > 0 &&
                  bubbleWords.every((w) =>
                    savedWordKeys.has(normalizeWordKey(w.tibetan))
                  );
                const selectedWordForThisMsg =
                  activeGloss && activeGloss.msgId === msg.id
                    ? activeGloss.word
                    : null;
                const selectedWordNorm = selectedWordForThisMsg
                  ? normalizeWordKey(selectedWordForThisMsg.tibetan)
                  : null;
                const isEvalExpanded = Boolean(expandedEvalMsgIds[msg.id]);

                const renderTapToGlossCard = () =>
                  selectedWordForThisMsg ? (
                    <div className="mt-2.5 mb-2 p-3 rounded-xl bg-brand-light/70 border border-brand/40 flex flex-wrap items-center justify-between gap-2.5 animate-in fade-in duration-150">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-tibetan text-xl leading-[1.6] text-ink">
                            {selectedWordForThisMsg.tibetan}
                          </span>
                          {selectedWordForThisMsg.phonetic && (
                            <span className="text-xs font-semibold text-ink-light italic">
                              {selectedWordForThisMsg.phonetic}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ink mt-0.5">
                          {selectedWordForThisMsg.meaning}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            speakTibetan(
                              `word_${msg.id}_${selectedWordNorm}`,
                              selectedWordForThisMsg.tibetan
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border-subtle hover:border-ink text-[11px] font-bold text-ink cursor-pointer"
                        >
                          <Volume2 size={12} /> Hear
                        </button>

                        {selectedWordNorm && savedWordKeys.has(selectedWordNorm) ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                            <Check size={12} /> Saved
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={savingWordKey === selectedWordNorm}
                            onClick={() =>
                              saveWordsToVocabulary(
                                [selectedWordForThisMsg],
                                msg.id,
                                selectedWordNorm || undefined
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ink text-white hover:bg-ink-light text-[11px] font-bold disabled:opacity-50 cursor-pointer"
                          >
                            {savingWordKey === selectedWordNorm ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <Bookmark size={11} />
                            )}
                            Save word
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setActiveGloss(null)}
                          aria-label="Close word gloss"
                          className="p-1 text-ink-muted hover:text-ink cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ) : null;

                const renderActionPills = (includeRepeatAfterMe: boolean) =>
                  msg.tibetan ? (
                    <div className="flex flex-wrap items-center gap-2 mt-3.5">
                      <button
                        type="button"
                        disabled={isLoadingNorm}
                        onClick={() =>
                          speakTibetan(msg.id, msg.tibetan, {
                            slow: false,
                            msgId: msg.id,
                            targetMode: msg.msgMode ?? mode,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
                          isPlayingNorm
                            ? "bg-brand text-ink border-brand"
                            : "bg-paper border-border-subtle text-ink hover:border-ink"
                        }`}
                      >
                        {isLoadingNorm ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : isPlayingNorm ? (
                          <Square size={10} fill="currentColor" />
                        ) : (
                          <Play size={11} fill="currentColor" />
                        )}
                        <span>{isPlayingNorm ? "Stop" : "Play"}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isLoadingSlow}
                        onClick={() =>
                          speakTibetan(msg.id, msg.tibetan, {
                            slow: true,
                            msgId: msg.id,
                            targetMode: msg.msgMode ?? mode,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
                          isPlayingSlow
                            ? "bg-brand text-ink border-brand"
                            : "bg-paper border-border-subtle text-ink hover:border-ink"
                        }`}
                      >
                        {isLoadingSlow ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : isPlayingSlow ? (
                          <Square size={10} fill="currentColor" />
                        ) : (
                          <Turtle size={13} />
                        )}
                        <span>{isPlayingSlow ? "Stop" : "Slow"}</span>
                      </button>

                      {includeRepeatAfterMe &&
                        (isRecordingThis ? (
                          <button
                            type="button"
                            onClick={() => stopRecording(false)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold animate-pulse cursor-pointer"
                          >
                            <Square size={10} fill="currentColor" />
                            <span>Stop &amp; Check ({formatTimer(recordSeconds)})</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              isRecording ||
                              isTranscribing ||
                              isSending ||
                              Boolean(evaluatingMsgId)
                            }
                            onClick={() =>
                              startRecording({
                                msgId: msg.id,
                                text: msg.tibetan,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDECEA] border border-[#F3C2BC] text-[#B3261E] hover:bg-[#fbdad6] text-xs font-semibold transition-colors disabled:opacity-45 cursor-pointer"
                          >
                            {isEvaluatingThis ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-[#B3261E]" />
                            )}
                            <span>
                              {isEvaluatingThis ? "Checking..." : "Repeat after me"}
                            </span>
                          </button>
                        ))}

                      {bubbleWords.length > 0 && (
                        <button
                          type="button"
                          disabled={allSaved || savingMsgId === msg.id}
                          onClick={() => saveWordsToVocabulary(bubbleWords, msg.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
                            allSaved
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default"
                              : "bg-paper border-border-subtle text-ink hover:border-ink"
                          }`}
                        >
                          {savingMsgId === msg.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : allSaved ? (
                            <BookmarkCheck size={13} />
                          ) : (
                            <Bookmark size={13} />
                          )}
                          <span>{allSaved ? "Saved" : "Save to vocabulary"}</span>
                        </button>
                      )}
                    </div>
                  ) : null;

                return (
                  <div key={msg.id} className="flex items-start gap-3">
                    {/* Navy L Avatar */}
                    <div className="w-9 h-9 rounded-full bg-ink text-paper font-serif font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      L
                    </div>

                    <div className="flex-1 min-w-0 max-w-[660px]">
                      <div className="bg-surface border border-border-subtle rounded-[20px] rounded-tl-[4px] p-4 sm:p-5 shadow-sm">
                        {isAskReply ? (
                          /* ASK MODE HIERARCHY: Clear Answer First, Boxed Tibetan Example Underneath */
                          <>
                            {msg.english && (
                              <div className="text-sm sm:text-[15px] text-ink leading-relaxed whitespace-pre-line">
                                {msg.english}
                              </div>
                            )}

                            {msg.tibetan && (
                              <div className="mt-3.5 bg-paper/80 border border-border-subtle rounded-2xl p-3.5 sm:p-4">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                                  Tibetan Example
                                </div>
                                <div className="font-tibetan text-[23px] sm:text-[25px] leading-[1.9] text-ink">
                                  {renderInteractiveTibetan(
                                    msg.tibetan,
                                    bubbleWords,
                                    selectedWordNorm,
                                    (word) =>
                                      setActiveGloss((prev) =>
                                        prev &&
                                        prev.msgId === msg.id &&
                                        normalizeWordKey(prev.word.tibetan) ===
                                          normalizeWordKey(word.tibetan)
                                          ? null
                                          : { msgId: msg.id, word }
                                      )
                                  )}
                                </div>
                                {renderTapToGlossCard()}
                                {showPhonetics && msg.phonetic && (
                                  <div className="text-xs sm:text-sm text-ink-light mt-1">
                                    {msg.phonetic}
                                  </div>
                                )}
                                {renderActionPills(false)}
                              </div>
                            )}
                          </>
                        ) : (
                          /* CONVERSE / SITUATIONS / PRONOUNCE / READ HIERARCHY */
                          <>
                            {msg.tibetan && (
                              <div className="font-tibetan text-[25px] sm:text-[27px] leading-[1.9] text-ink">
                                {renderInteractiveTibetan(
                                  msg.tibetan,
                                  bubbleWords,
                                  selectedWordNorm,
                                  (word) =>
                                    setActiveGloss((prev) =>
                                      prev &&
                                      prev.msgId === msg.id &&
                                      normalizeWordKey(prev.word.tibetan) ===
                                        normalizeWordKey(word.tibetan)
                                        ? null
                                        : { msgId: msg.id, word }
                                    )
                                )}
                              </div>
                            )}

                            {renderTapToGlossCard()}

                            {showPhonetics && msg.phonetic && (
                              <div className="text-sm sm:text-[15px] text-ink-light mt-1">
                                {msg.phonetic}
                              </div>
                            )}

                            {showGloss && msg.english && (
                              <div className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                                {msg.english}
                              </div>
                            )}

                            {renderActionPills(true)}
                          </>
                        )}

                        {msg.needsTapToPlay && (
                          <div className="mt-2 text-[11px] font-semibold text-brand-dark">
                            Tap Play to hear this reply.
                          </div>
                        )}

                        {/* Speech Feedback Box (shown ONLY after learner speaks / Repeat after me) */}
                        {msg.feedback && msg.feedback.message && (
                          <div
                            className={`mt-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border ${
                              msg.feedback.status === "good"
                                ? "bg-[#E8F5EE] border-emerald-200 text-[#1E6B43]"
                                : "bg-amber-50 border-amber-200 text-amber-900"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 leading-relaxed">
                                {msg.feedback.status === "good" ? (
                                  <CheckCircle2
                                    size={15}
                                    className="shrink-0 mt-0.5"
                                  />
                                ) : (
                                  <AlertCircle
                                    size={15}
                                    className="shrink-0 mt-0.5"
                                  />
                                )}
                                <span>{msg.feedback.message}</span>
                              </div>

                              {msg.evaluation && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedEvalMsgIds((prev) => ({
                                      ...prev,
                                      [msg.id]: !prev[msg.id],
                                    }))
                                  }
                                  className="inline-flex items-center gap-1 text-[11px] font-bold underline underline-offset-2 shrink-0 cursor-pointer"
                                >
                                  <Award size={12} />
                                  <span>{msg.evaluation.overall_score}/100</span>
                                  {isEvalExpanded ? (
                                    <ChevronUp size={12} />
                                  ) : (
                                    <ChevronDown size={12} />
                                  )}
                                </button>
                              )}
                            </div>

                            {msg.evaluation && isEvalExpanded && (
                              <div className="mt-3 pt-2.5 border-t border-current/15 space-y-2 text-xs text-ink">
                                {msg.evaluation.what_was_heard && (
                                  <div>
                                    <span className="font-bold">Heard: </span>
                                    <span>{msg.evaluation.what_was_heard}</span>
                                  </div>
                                )}
                                {msg.evaluation.word_evaluations.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {msg.evaluation.word_evaluations.map(
                                      (w, wIdx) => (
                                        <button
                                          key={wIdx}
                                          type="button"
                                          onClick={() =>
                                            speakTibetan(
                                              `eval_${msg.id}_${wIdx}`,
                                              w.target
                                            )
                                          }
                                          title={`${w.expected_phonetic} · ${w.tip}`}
                                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                                            w.status === "correct"
                                              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                              : w.status === "missed"
                                              ? "bg-rose-50 border-rose-200 text-rose-900"
                                              : "bg-amber-50 border-amber-300 text-amber-900"
                                          }`}
                                        >
                                          <span className="font-tibetan text-base leading-[1.5]">
                                            {w.target}
                                          </span>
                                          <Volume2 size={11} className="opacity-60" />
                                        </button>
                                      )
                                    )}
                                  </div>
                                )}
                                {msg.evaluation.next_focus && (
                                  <div className="text-[11px] text-ink-light pt-0.5">
                                    <strong className="text-ink">Next focus:</strong>{" "}
                                    {msg.evaluation.next_focus}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tasteful Lesson Suggestion Card (Max 2/session) */}
                        {msg.lessonSuggestion && (
                          <div className="mt-3 flex flex-wrap sm:flex-nowrap items-center gap-2.5 bg-brand-light rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] text-ink">
                            <GraduationCap
                              size={16}
                              className="text-ink shrink-0"
                            />
                            <span className="leading-snug">
                              Want to learn this properly?{" "}
                              <strong>{msg.lessonSuggestion.title}</strong> in{" "}
                              {msg.lessonSuggestion.course}.
                            </span>
                            <Link
                              href={msg.lessonSuggestion.url}
                              className="sm:ml-auto font-bold text-ink hover:text-brand-dark whitespace-nowrap inline-flex items-center gap-1"
                            >
                              Open lesson <ChevronRight size={14} />
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Follow-up Suggested Reply Chips */}
                      {isLatestAssistant &&
                        msg.suggestedReplies &&
                        msg.suggestedReplies.length > 0 &&
                        !isSending && (
                          <div className="flex flex-wrap gap-2 mt-2.5">
                            {msg.suggestedReplies.map((chip, cIdx) => (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() =>
                                  sendTurn(
                                    chip,
                                    /[\u0F00-\u0FFF]/.test(chip)
                                      ? "tibetan"
                                      : "english"
                                  )
                                }
                                className="px-3.5 py-1.5 rounded-full bg-surface border border-border-subtle hover:border-brand text-xs font-medium text-ink shadow-2xs transition-colors cursor-pointer"
                              >
                                <span
                                  className={
                                    /[\u0F00-\u0FFF]/.test(chip)
                                      ? "font-tibetan text-base leading-[1.6]"
                                      : ""
                                  }
                                >
                                  {chip}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}

              {(isTranscribing || isSending) && (
                <div className="flex items-center gap-2 text-xs font-bold text-ink-muted pl-12">
                  <Loader2 size={14} className="animate-spin text-brand-dark" />
                  <span>
                    {isTranscribing
                      ? "Listening to your speech..."
                      : "Gen-la is thinking..."}
                  </span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          3. BOTTOM INPUT BAR + AUTO-COLLAPSING "GO DEEPER WITH LOPLAO" ROW
      ==================================================================== */}
      <footer className="shrink-0 px-4 sm:px-6 pt-2 pb-2.5 bg-paper border-t border-border-subtle/70">
        <div className="max-w-4xl mx-auto">
          {isRecording ? (
            <div className="bg-surface border-2 border-brand rounded-full px-3.5 py-2 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-ink truncate">
                  {recordingForMsgId
                    ? `Checking pronunciation… ${formatTimer(recordSeconds)}`
                    : `Listening… ${formatTimer(recordSeconds)}`}
                </span>
                <div className="hidden sm:flex items-center gap-1 h-4">
                  {[10, 22, 36, 50, 66, 82].map((thresh, idx) => (
                    <span
                      key={idx}
                      className={`w-1.5 rounded-full transition-all duration-75 ${
                        micLevel >= thresh
                          ? "bg-emerald-500 h-4"
                          : "bg-border-subtle h-1.5"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => stopRecording(true)}
                  className="px-2.5 py-1.5 rounded-full text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => stopRecording(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                >
                  <Square size={11} fill="currentColor" />
                  <span>{recordingForMsgId ? "Check" : "Send"}</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendTurn();
              }}
              className="flex items-center gap-2 bg-surface border border-border-subtle focus-within:border-brand rounded-full p-1.5 shadow-sm transition-colors"
            >
              <button
                type="button"
                onClick={() => startRecording()}
                disabled={isTranscribing || isSending || Boolean(evaluatingMsgId)}
                title={
                  latestPronounceTarget
                    ? "Speak to check pronunciation against the phrase above"
                    : "Tap to speak"
                }
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand hover:bg-brand-dark text-ink flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Mic size={20} />
              </button>

              <input
                type="text"
                value={inputText}
                maxLength={1500}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={inputPlaceholder}
                className="flex-1 min-w-0 bg-transparent px-2 py-2 text-sm sm:text-[15px] text-ink placeholder:text-ink-muted focus:outline-none"
              />

              <button
                type="button"
                onClick={cycleInputKind}
                title="Switch input mode (Tibetan / Phonetic / English)"
                className="px-3 py-1.5 rounded-full bg-brand-light hover:bg-brand/30 text-ink text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {activeInputKindObj.label} ▾
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isSending || isTranscribing}
                title="Send"
                className="w-10 h-10 rounded-full bg-ink hover:bg-ink-light text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          )}

          {/* Contextual Hint Line */}
          <div className="text-center text-[11px] text-ink-muted mt-1.5">
            {currentMode.hint}
          </div>

          {/* Fixed "Go deeper with Loplao" Row (auto-collapses to compact bar once chat starts) */}
          <div className="mt-2 pt-2 border-t border-border-subtle">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted shrink-0">
                  Go deeper with Loplao
                </span>
                {!showFullDeeperGrid && (
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] truncate">
                    <Link
                      href="/dashboard/lessons"
                      className="px-2.5 py-0.5 rounded-full bg-ink text-white font-semibold hover:bg-ink-light transition-colors"
                    >
                      {currentLevel.courseName}
                    </Link>
                    <Link
                      href="/dashboard/practice"
                      className="px-2.5 py-0.5 rounded-full bg-brand-light text-ink font-semibold hover:bg-brand/40 transition-colors"
                    >
                      Vocabulary &amp; flashcards
                    </Link>
                    <Link
                      href="/oxford-visitorship"
                      className="px-2.5 py-0.5 rounded-full bg-brand-light text-ink font-semibold hover:bg-brand/40 transition-colors"
                    >
                      Culture &amp; Buddhism
                    </Link>
                  </div>
                )}
              </div>

              {(isNative || hasActiveConversation) && (
                <button
                  type="button"
                  onClick={() => setDeeperExpanded((v) => !v)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-ink-muted hover:text-ink shrink-0 cursor-pointer"
                >
                  {showFullDeeperGrid ? "Compact" : "Expand"}
                  {showFullDeeperGrid ? (
                    <ChevronDown size={13} />
                  ) : (
                    <ChevronUp size={13} />
                  )}
                </button>
              )}
            </div>

            {showFullDeeperGrid && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <Link
                  href="/dashboard/lessons"
                  className="flex items-center gap-2.5 bg-ink hover:bg-ink-light text-white rounded-xl px-3 py-2 transition-colors"
                >
                  <GraduationCap size={18} className="text-brand shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight truncate">
                      {currentLevel.courseName}
                    </div>
                    <div className="text-[11px] text-white/75 truncate hidden sm:block">
                      Structured lessons in Loplao
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="ml-auto text-white/70 shrink-0"
                  />
                </Link>

                <Link
                  href="/dashboard/practice"
                  className="flex items-center gap-2.5 bg-brand-light border border-transparent hover:border-brand text-ink rounded-xl px-3 py-2 transition-colors"
                >
                  <Bookmark size={17} className="text-brand-dark shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight truncate">
                      Vocabulary &amp; flashcards
                    </div>
                    <div className="text-[11px] text-ink-muted truncate hidden sm:block">
                      Review words you saved
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="ml-auto text-ink-muted shrink-0"
                  />
                </Link>

                <Link
                  href="/oxford-visitorship"
                  className="flex items-center gap-2.5 bg-brand-light border border-transparent hover:border-brand text-ink rounded-xl px-3 py-2 transition-colors"
                >
                  <Mountain size={17} className="text-brand-dark shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold leading-tight truncate">
                      Culture &amp; Buddhism
                    </div>
                    <div className="text-[11px] text-ink-muted truncate hidden sm:block">
                      Scholars, heritage &amp; visits
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="ml-auto text-ink-muted shrink-0"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* ====================================================================
          4. SAVED VOCABULARY SLIDE-OVER DRAWER (SYNCED WITH user_learned_words)
      ==================================================================== */}
      {savedDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSavedDrawerOpen(false)}
        >
          <aside
            className="w-full max-w-md bg-paper h-full shadow-2xl border-l border-border-subtle flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-surface border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-ink">Saved Vocabulary</h2>
                <p className="text-xs text-ink-muted">
                  {savedWordItems.length} unique Tibetan{" "}
                  {savedWordItems.length === 1 ? "word" : "words"} synced to your Loplao profile
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSavedDrawerOpen(false)}
                aria-label="Close saved vocabulary"
                className="w-8 h-8 rounded-full bg-paper border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5">
              {savedWordItems.length === 0 ? (
                <div className="py-12 text-center">
                  <Bookmark size={28} className="text-ink-muted/50 mx-auto mb-3" />
                  <p className="font-serif text-lg text-ink mb-1">
                    No saved words yet
                  </p>
                  <p className="text-xs text-ink-muted max-w-xs mx-auto leading-relaxed">
                    Tap any dotted-underlined Tibetan word or click{" "}
                    <strong>Save to vocabulary</strong> on a tutor reply to build your list.
                  </p>
                </div>
              ) : (
                savedWordItems.map((item, idx) => {
                  const key = `saved_${idx}_${item.word_key}`;
                  const isPlaying = playingKey === `${key}:norm`;
                  const isLoading = loadingAudioKey === `${key}:norm`;
                  return (
                    <div
                      key={`${item.word_key}_${idx}`}
                      className="bg-surface border border-border-subtle rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="font-tibetan text-2xl leading-[1.7] text-ink">
                          {item.tibetan}
                        </div>
                        {item.pronunciation && (
                          <div className="text-xs font-semibold text-ink-light italic">
                            {item.pronunciation}
                          </div>
                        )}
                        {item.english && (
                          <div className="text-xs text-ink-muted mt-0.5">
                            {item.english}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => speakTibetan(key, item.tibetan, { slow: false })}
                        title="Listen"
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isPlaying
                            ? "bg-brand text-ink"
                            : "bg-paper border border-border-subtle text-ink hover:border-ink"
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : isPlaying ? (
                          <Square size={11} fill="currentColor" />
                        ) : (
                          <Volume2 size={15} />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-surface border-t border-border-subtle">
              <Link
                href="/dashboard/practice"
                onClick={() => setSavedDrawerOpen(false)}
                className="w-full bg-ink hover:bg-ink-light text-white font-bold text-xs py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Flashcards &amp; Practice</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
