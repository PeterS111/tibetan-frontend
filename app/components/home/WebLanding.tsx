// app/components/home/WebLanding.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Loader2,
  Plus,
  Minus,
  Sparkles,
  X,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

import { useAudio } from "@/hooks/useAudio";
import { AUDIO_MAP } from "@/app/data/audioMap";
import {
  CONSONANTS,
  TONE_META,
  TONE_HEX,
  GENDER_META,
  type Consonant,
  type Tone,
  type Gender,
} from "@/app/data/lesson1";
import { DraggablePanel } from "@/app/components/ui/DraggablePanel";
import { Button } from "@/app/components/ui/Button";

// ============================================================================
// 1. HERO FLOATING PHRASES (ALL 10 PHRASES IN CONSTELLATION)
// ============================================================================
interface HeroPhrase {
  id: string;
  tib: string;
  en: string;
  posClass: string;
  floatClass: string;
  /**
   * When Loplao's recordings are ready, drop the .wav file path here
   * (e.g. "/sounds/phrases/zhog_pa_de_lek.wav") and it will play automatically!
   */
  audioUrl?: string | null;
}

const HERO_PHRASES: HeroPhrase[] = [
  {
    id: "p1",
    tib: "བཀྲ་ཤིས་བདེ་ལེགས།",
    en: "Tashi delek",
    posClass: "top-[2%] left-[2%] sm:left-[0%]",
    floatClass: "landing-float-1",
    audioUrl: "/sounds/Tashi Delek.wav",
  },
  {
    id: "p2",
    tib: "ཁྱེད་རང་སྐུ་གཟུགས་བདེ་པོ་ཡིན་པས།",
    en: "How are you?",
    posClass: "-top-[6%] right-[0%] sm:-right-[4%]",
    floatClass: "landing-float-2",
    audioUrl: "/sounds/How are you.wav",
  },
  {
    id: "p3",
    tib: "ཞོགས་པ་བདེ་ལེགས།",
    en: "Good morning",
    posClass: "top-[19%] -left-[4%] sm:-left-[10%]",
    floatClass: "landing-float-3",
    audioUrl: "/sounds/Good morning.wav",
  },
  {
    id: "p4",
    tib: "ཁྱེད་རང་གི་མིང་ག་རེ་རེད།",
    en: "What is your name?",
    posClass: "top-[16%] -right-[4%] sm:-right-[10%]",
    floatClass: "landing-float-4",
    audioUrl: "/sounds/What is your name.wav",
  },
  {
    id: "p5",
    tib: "ཁམས་བཟང་།",
    en: "Hello · Good day",
    posClass: "top-[39%] -left-[6%] sm:-left-[13%]",
    floatClass: "landing-float-5",
    audioUrl: "/sounds/Hello.wav",
  },
  {
    id: "p6",
    tib: "ཁྱེད་རང་ག་ནས་ཡིན།",
    en: "Where are you from?",
    posClass: "top-[37%] -right-[5%] sm:-right-[12%]",
    floatClass: "landing-float-1",
    audioUrl: "/sounds/Where you from.wav",
  },
  {
    id: "p7",
    tib: "ག་ལེར་ཕེབས།",
    en: "Goodbye",
    posClass: "bottom-[28%] -left-[4%] sm:-left-[10%]",
    floatClass: "landing-float-2",
    audioUrl: "/sounds/Goodbye.wav",
  },
  {
    id: "p8",
    tib: "ཐུགས་རྗེ་ཆེ།",
    en: "Thank you",
    posClass: "bottom-[26%] -right-[4%] sm:-right-[9%]",
    floatClass: "landing-float-3",
    audioUrl: "/sounds/Thank you.wav",
  },
  {
    id: "p9",
    tib: "གཟིམ་འཇགས་གནང་གོ།",
    en: "Good night",
    posClass: "bottom-[7%] left-[0%] sm:-left-[4%]",
    floatClass: "landing-float-4",
    audioUrl: "/sounds/Good night.wav",
  },
  {
    id: "p10",
    tib: "རྗེས་མ་མཇལ་ཡོང་།",
    en: "See you later",
    posClass: "-bottom-[5%] left-[26%] sm:left-[28%]",
    floatClass: "landing-float-5",
    audioUrl: "/sounds/See you later.wav",
  },
];

// ============================================================================
// 2. PROFICIENCY LEVELS DATA (CAROUSEL + CLICKABLE DETAIL MODAL)
// ============================================================================
interface LevelDetail {
  id: number;
  roman: string;
  levelLabel: string;
  title: string;
  subtitle: string;
  oneLine: string;
  shortDesc: string;
  fullBoxDesc: string;
  symbol: string;
  status: "open" | "soon";
  statusBadge: string;
  hasAudio: boolean;
  sampleItems: { tib: string; translit: string; en: string; audioUrl?: string }[];
}

const PROFICIENCY_LEVELS: LevelDetail[] = [
  {
    id: 1,
    roman: "I",
    levelLabel: "LEVEL I",
    title: "Beginner 1",
    subtitle: "Foundations of the script",
    oneLine: "Learn to read Tibetan, one step at a time.",
    shortDesc:
      "Learn Tibetan script from the beginning — all 30 consonants, four vowels, and the rules for combining letters, prefixes and suffixes. Audio and a mastery check at every step.",
    fullBoxDesc:
      "Seven steps, from your first letter to reading whole words. Learn the 30 consonants and four vowels, followed by superscripts, subscripts, prefixes and suffixes, and how they affect spelling, pronunciation and meaning. Each step includes audio and a mastery check. The course ends with a final assessment.",
    symbol: "/symbol_lotus.png",
    status: "open",
    statusBadge: "Free & Open Now",
    hasAudio: true,
    sampleItems: [
      { tib: "ཀ", translit: "ka", en: "High unaspirated" },
      { tib: "ཁ", translit: "kha", en: "High aspirated" },
      { tib: "ག", translit: "ga", en: "Low aspirated" },
      { tib: "ང", translit: "nga", en: "Low nasal" },
      { tib: "བོད་", translit: "bö", en: "Tibet" },
      { tib: "མི་", translit: "mi", en: "Person" },
    ],
  },
  {
    id: 2,
    roman: "II",
    levelLabel: "LEVEL II",
    title: "Beginner 2",
    subtitle: "Everyday conversation",
    oneLine: "Learn Tibetan for everyday situations.",
    shortDesc:
      "Learn everyday Tibetan through greetings, introductions, numbers and time, family, shopping, weekends, home and the seasons. Eleven units, each based on everyday situations.",
    fullBoxDesc:
      "Eleven units covering the basics of everyday conversation. Start in the classroom, then learn to greet people, introduce yourself, say where you're from, tell the time and count, talk about family, bargain for tsampa, and describe your weekend, home and the four seasons. Each unit ends with a 40-question test.",
    symbol: "/symbol_conch.png",
    status: "soon",
    statusBadge: "Coming Soon",
    hasAudio: true,
    sampleItems: [
      {
        tib: "བཀྲ་ཤིས་བདེ་ལེགས།",
        translit: "tashi delek",
        en: "Hello / Greetings",
        audioUrl: "/sounds/Tashi Delek.wav",
      },
      {
        tib: "ཐུགས་རྗེ་ཆེ།",
        translit: "thukje che",
        en: "Thank you",
        audioUrl: "/sounds/Thank you.wav",
      },
      {
        tib: "ག་ལེར་ཕེབས།",
        translit: "galer phep",
        en: "Goodbye",
        audioUrl: "/sounds/Goodbye.wav",
      },
    ],
  },
  {
    id: 3,
    roman: "III",
    levelLabel: "LEVEL III",
    title: "Pre-Intermediate",
    subtitle: "Conversational fluency & tenses",
    oneLine: "Express past, present and future with confidence.",
    shortDesc:
      "Build conversational fluency and master Tibetan tense structures, evidential verbs, and practical dialogues for travel, dining and daily life.",
    fullBoxDesc:
      "Move beyond simple phrases into natural, connected conversation. Learn how Tibetan expresses past, present and future actions, how speakers distinguish between personal experience and general knowledge, and how to navigate travel, markets, and social life across twelve structured units.",
    symbol: "/symbol_treasure_vase.png",
    status: "soon",
    statusBadge: "Coming Soon",
    hasAudio: false,
    sampleItems: [
      { tib: "ང་བོད་སྐད་སྦྱོང་གི་ཡོད།", translit: "nga böke jong gi yö", en: "I study Tibetan" },
      { tib: "ཇ་བསྲུབས་མ།", translit: "ja supma", en: "Butter tea" },
      { tib: "རྗེས་མ་མཇལ་ཡོང་།", translit: "jema jal yong", en: "See you later" },
    ],
  },
  {
    id: 4,
    roman: "IV",
    levelLabel: "LEVEL IV",
    title: "Intermediate",
    subtitle: "Honorifics, register & short prose",
    oneLine: "Speak politely and read authentic short texts.",
    shortDesc:
      "Master polite honorific speech (Zhe-sa) for speaking with elders and teachers, and begin reading folk stories, proverbs and short modern prose.",
    fullBoxDesc:
      "Deepen your command of polite and honorific Tibetan (Zhe-sa) used when speaking with elders, teachers, and monastics, while bridging the gap between spoken colloquial Tibetan and written prose through traditional folk tales, proverbs, and guided reading passages.",
    symbol: "/symbol_dharma_wheel.png",
    status: "soon",
    statusBadge: "Coming Soon",
    hasAudio: false,
    sampleItems: [
      { tib: "བཞུགས་གདན་འཇགས།", translit: "zhukden jak", en: "Please be seated (Hon.)" },
      { tib: "གསོལ་ཇ་མཆོད།", translit: "sölja chö", en: "Please drink tea (Hon.)" },
      { tib: "གཏམ་དཔེ།", translit: "tampe", en: "Proverb / Saying" },
    ],
  },
  {
    id: 5,
    roman: "V",
    levelLabel: "LEVEL V",
    title: "Upper-Intermediate",
    subtitle: "Philosophical & journalistic texts",
    oneLine: "Engage with Tibetan media, essays and philosophy.",
    shortDesc:
      "Navigate authentic Tibetan journalism, biographical writing, and foundational Buddhist philosophical terminology with clear grammatical guidance.",
    fullBoxDesc:
      "Step into authentic Tibetan intellectual and cultural discourse. Learn how literary particles and classical expressions appear in modern journalism, histories, biographies (Namthar), and philosophical discussions, building the vocabulary needed for deeper study.",
    symbol: "/symbol_endless_knot.png",
    status: "soon",
    statusBadge: "Coming Soon",
    hasAudio: false,
    sampleItems: [
      { tib: "རྟེན་འབྲེལ།", translit: "tendrel", en: "Interdependence" },
      { tib: "སྙིང་རྗེ།", translit: "nyingje", en: "Compassion" },
      { tib: "རྣམ་ཐར།", translit: "namthar", en: "Spiritual biography" },
    ],
  },
  {
    id: 6,
    roman: "VI",
    levelLabel: "LEVEL VI",
    title: "Advanced",
    subtitle: "Canonical texts, literature & poetry",
    oneLine: "Read classical and modern Tibetan independently.",
    shortDesc:
      "Achieve independent reading fluency across classical canonical texts, traditional poetry, historical chronicles and formal discourse.",
    fullBoxDesc:
      "The culmination of the six-level path. Develop independent scholarly literacy across both classical and modern registers, reading canonical pecha texts, poetic compositions (Nyen-ngak), and historical chronicles with full grammatical and cultural command.",
    symbol: "/symbol_victory_banner.png",
    status: "soon",
    statusBadge: "Coming Soon",
    hasAudio: false,
    sampleItems: [
      { tib: "ཤེས་རབ།", translit: "sherab", en: "Wisdom" },
      { tib: "ཐབས་ཤེས་ཟུང་འབྲེལ།", translit: "thabshe zungdrel", en: "Method & wisdom" },
      { tib: "སྙན་ངག", translit: "nyen-ngak", en: "Traditional poetry" },
    ],
  },
];

// ============================================================================
// 3. HOW YOUR LEARNING IS STRUCTURED (4-ITEM CAROUSEL)
// ============================================================================
const LEARNING_SYSTEMS = [
  {
    title: "Guided Syllabus",
    desc: "Access structured lessons, grammar notes, and interactive exercises directly in your dashboard. Zero guesswork required.",
    symbol: "/symbol_dharma_wheel.png",
  },
  {
    title: "Spaced Repetition",
    desc: "Lock vocabulary into your long-term memory. Our built-in review system brings words back right before you forget them.",
    symbol: "/symbol_endless_knot.png",
  },
  {
    title: "Track Progress",
    desc: "Watch your vocabulary grow. Maintain your learning streak and master Tibetan grammar step-by-step.",
    symbol: "/symbol_victory_banner.png",
  },
  {
    title: "Rooted in Authentic Scholarship",
    desc: "Our curriculum and grammar progression draw on respected Tibetan language textbooks, integrating diverse teaching traditions into one clear path.",
    symbol: "/symbol_pecha.png",
  },
];

// ============================================================================
// 4. CULTURE CARDS & FAQ DATA
// ============================================================================
const CULTURE_CARDS = [
  {
    symbol: "/symbol_parasol.png",
    title: "The scarf and the greeting",
    desc: "When real respect is owed, Tibetans offer a khata — a long white or pale blue silk scarf — with both hands, palms up. It welcomes a guest and honours someone important.",
  },
  {
    symbol: "/symbol_conch.png",
    title: "The tongue-out greeting",
    desc: "In some parts of Tibet, especially among older generations, people greet you by briefly sticking out the tongue. It is friendly, not rude — a centuries-old way of showing you mean no harm.",
  },
  {
    symbol: "/symbol_lotus.png",
    title: 'Why “cousin” has no Tibetan word',
    desc: "Tibetan has no single everyday word for cousin. Cousins are usually called brothers and sisters, the term chosen by age and gender.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I need an account to start?",
    a: "Yes. You create a free account with an email address, and both published levels open in full straight after — no card and no fee.",
  },
  {
    q: "Do I need to read Tibetan already?",
    a: "No. Level 1 begins with the script itself — the 30 consonants and four vowels — and each step ends with a mastery check before you move on.",
  },
  {
    q: "Which levels are open?",
    a: "Two of six. Beginner 1 covers the script and its sounds; Beginner 2 covers greetings, numbers and days, introductions and daily routine. Pre-Intermediate to Advanced are still being written.",
  },
  {
    q: "Is there audio?",
    a: "Yes. Every word, dialogue and drill in the published lessons can be played aloud, and any consonant can be heard by tapping it.",
  },
  {
    q: "What do I need to learn on?",
    a: "A phone, tablet or laptop with a browser — the lessons reflow to fit the screen. The App Store and Google Play listings are still to come.",
  },
  {
    q: "How do I get in touch?",
    a: "Email us at: loplaoacademy@gmail.com",
  },
];

const EIGHT_AUSPICIOUS_SYMBOLS = [
  { src: "/symbol_parasol.png", alt: "Precious Parasol" },
  { src: "/symbol_golden_fish.png", alt: "Golden Fishes" },
  { src: "/symbol_treasure_vase.png", alt: "Treasure Vase" },
  { src: "/symbol_lotus.png", alt: "Lotus Flower" },
  { src: "/symbol_conch.png", alt: "White Conch" },
  { src: "/symbol_endless_knot.png", alt: "Endless Knot" },
  { src: "/symbol_victory_banner.png", alt: "Victory Banner" },
  { src: "/symbol_dharma_wheel.png", alt: "Dharma Wheel" },
];

// ============================================================================
// MAIN WEB LANDING COMPONENT
// ============================================================================
export function WebLanding() {
  const { playAudio, stopAudio, playingItem } = useAudio();

  // --- All 10 Hero Phrases Animated Constellation State ---
  // Most of the 10 phrases are visible at once; 2 softly fade out and back in
  // on a staggered breathing cycle so the whole constellation feels alive.
  const [fadedIndices, setFadedIndices] = useState<number[]>([3, 8]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activePhraseId, setActivePhraseId] = useState<string | null>(null);
  const phraseAudioRef = useRef<HTMLAudioElement | null>(null);
  const phraseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hoveredIdx !== null || activePhraseId !== null) return;

      setFadedIndices((prev) => {
        const nextFirst = (prev[0] + 3) % HERO_PHRASES.length;
        const nextSecond = (prev[1] + 3) % HERO_PHRASES.length;
        return [nextFirst, nextSecond === nextFirst ? (nextSecond + 1) % HERO_PHRASES.length : nextSecond];
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [hoveredIdx, activePhraseId]);

  // Placeholder / Real Audio Handler for Hero Phrases
  const handleHeroPhraseClick = useCallback((phrase: HeroPhrase) => {
    if (phraseTimerRef.current) clearTimeout(phraseTimerRef.current);
    if (phraseAudioRef.current) {
      phraseAudioRef.current.pause();
      phraseAudioRef.current = null;
    }

    setActivePhraseId(phrase.id);

    // 1. If a real .wav URL is configured on the phrase, play it
    if (phrase.audioUrl) {
      const audio = new Audio(phrase.audioUrl);
      phraseAudioRef.current = audio;
      audio.onended = () => setActivePhraseId(null);
      audio.onerror = () => setActivePhraseId(null);
      audio.play().catch(() => setActivePhraseId(null));
      return;
    }

    // 2. Placeholder gentle singing-bowl chime until recordings are added
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const playNote = (freq: number, startOffset: number, duration: number, gainPeak: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + startOffset);
        gain.gain.setValueAtTime(0.001, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(gainPeak, now + startOffset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration);
      };

      playNote(349.23, 0, 0.9, 0.12);
      playNote(523.25, 0.14, 1.1, 0.1);
    } catch {
      // Ignore if browser blocks Web Audio
    }

    phraseTimerRef.current = setTimeout(() => {
      setActivePhraseId(null);
    }, 1300);
  }, []);

  // Web-Only Consonant & Word Audio Player (Works on PC & Mobile Phone Web Browsers without touching useAudio.ts)
  const [playingConsonant, setPlayingConsonant] = useState<string | null>(null);
  const consonantAudioRef = useRef<HTMLAudioElement | null>(null);

  const playLandingSound = useCallback(
    (tibText: string) => {
      // Stop any playing phrase audio first
      if (phraseAudioRef.current) {
        phraseAudioRef.current.pause();
        phraseAudioRef.current = null;
      }
      if (consonantAudioRef.current) {
        consonantAudioRef.current.pause();
        consonantAudioRef.current = null;
      }

      const cleanText = tibText.replace(/[’'`]/g, "").trim();
      let fileName = AUDIO_MAP[cleanText];
      if (!fileName && AUDIO_MAP[cleanText + "་"]) {
        fileName = AUDIO_MAP[cleanText + "་"];
      }
      if (!fileName && cleanText.endsWith("་")) {
        fileName = AUDIO_MAP[cleanText.slice(0, -1)];
      }

      if (fileName) {
        setPlayingConsonant(tibText);
        const audio = new Audio(encodeURI(`/sounds/${fileName}`));
        consonantAudioRef.current = audio;
        audio.onended = () => setPlayingConsonant(null);
        audio.onerror = () => setPlayingConsonant(null);
        audio.play().catch(() => {
          setPlayingConsonant(null);
          playAudio(tibText);
        });
      } else {
        playAudio(tibText);
      }
    },
    [playAudio]
  );

  // --- Proficiency Level Carousel & Detail Modal State ---
  const [levelPage, setLevelPage] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<LevelDetail | null>(null);

  // --- How It Works (4 Systems) Carousel State ---
  const [systemPage, setSystemPage] = useState<number>(0);

  // --- FAQ Accordion State ---
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // --- Bottom Phone Preview Consonant Selection & Detail Pop-up State ---
  const [activePhoneConsonant, setActivePhoneConsonant] = useState<Consonant>(CONSONANTS[0]);
  const [selectedConsonantPopup, setSelectedConsonantPopup] = useState<{
    c: Consonant;
    rect: DOMRect;
  } | null>(null);

  const phoneConsonants = CONSONANTS.slice(0, 12);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
      {/* Clockwise Orbit + Counter-Rotation Keyframes so cards stay horizontal */}
      <style>{`
        @keyframes orbitClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counterOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .orbit-wheel {
          animation: orbitClockwise 75s linear infinite;
        }
        .orbit-item-upright {
          animation: counterOrbit 75s linear infinite;
        }
        .orbit-paused .orbit-wheel,
        .orbit-paused .orbit-item-upright {
          animation-play-state: paused;
        }
      `}</style>

      {/* ====================================================================
          1. TOP NAVIGATION BAR (DARK NAVY bg-ink)
      ==================================================================== */}
      <nav className="sticky top-0 w-full z-40 bg-ink/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo (White) + Tibetan on Top, Loplao Underneath */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <img
              src="/icon_t.png"
              onError={(e) => {
                e.currentTarget.src = "/icon.png";
              }}
              alt="Loplao Logo"
              className="w-10 h-10 object-contain brightness-0 invert opacity-95 group-hover:opacity-100 transition-opacity"
            />
            <div className="flex flex-col justify-center">
              <span className="font-tibetan text-base leading-tight text-brand tracking-wide">
                བོད་སྐད།
              </span>
              <span className="font-serif font-medium text-lg leading-none text-white">
                Loplao
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/75">
            <a href="#levels" className="hover:text-white transition-colors">
              Curriculum
            </a>
            <a href="#methodology" className="hover:text-white transition-colors">
              Methodology
            </a>
            <a href="#culture" className="hover:text-white transition-colors">
              Culture
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>

          {/* Clerk Authentication Buttons */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-xs sm:text-sm font-medium text-white border border-white/30 hover:border-white hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm cursor-pointer">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <button className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-dark text-ink rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                  Dashboard <ArrowRight size={15} strokeWidth={2.5} />
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ====================================================================
          2. HERO SECTION (ORIGINAL EDITORIAL SERIF + ALL 10 FLOATING PHRASES)
      ==================================================================== */}
      <header className="relative bg-ink text-white pt-14 pb-28 md:py-24 overflow-hidden">
        {/* Subtle Dharma Wheel Watermark */}
        <img
          src="/symbol_dharma_wheel.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-16 -right-24 w-[420px] h-[420px] object-contain opacity-[0.04] brightness-0 invert"
        />

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10">
          {/* Left Column: Editorial Headline (Matching Original Website Font) & CTA */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2.5 mb-6">
              <img
                src="/symbol_victory_banner.png"
                alt=""
                className="w-5 h-5 object-contain"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                Promoting Tibetan Language &amp; Culture Worldwide
              </span>
            </div>

            {/* Exact font-serif weight and style from original WebLanding.tsx */}
            <h1 className="font-serif font-normal text-5xl sm:text-6xl md:text-[64px] leading-[1.1] text-white mb-6">
              Learn Tibetan.
              <br />
              <span className="text-brand italic">Feel closer to its culture.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed mb-8">
              Discover the beauty of the Tibetan language through engaging lessons and
              thoughtfully crafted learning resources. Whether you&apos;re reconnecting with
              your roots or discovering Tibetan for the first time, there&apos;s a place for
              you at Loplao.
            </p>

            {/* Tibetan Welcome Motto */}
            <div className="border-l-2 border-brand/70 pl-4 py-1 mb-10">
              <p className="font-tibetan text-2xl sm:text-[26px] text-white/95 leading-normal">
                བོད་སྐད་སྦྱོང་དུ་ཕེབས་པར་དགའ་བསུ་ཞུ།
              </p>
              <p className="font-serif italic text-sm text-white/65 mt-1">
                Welcome to learning Tibetan.
              </p>
            </div>

            {/* Primary CTA + Loved by our students */}
            <div className="flex flex-wrap items-center gap-5">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="bg-brand hover:bg-brand-dark text-ink font-bold px-8 py-4 text-sm rounded-full transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                    Learn for free <ArrowRight size={16} />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="bg-brand hover:bg-brand-dark text-ink font-bold px-8 py-4 text-sm rounded-full transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                    Continue to Dashboard <ArrowRight size={16} />
                  </button>
                </Link>
              </SignedIn>

              <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                <span>Loved by our students</span>
                <span className="text-brand tracking-widest text-sm" aria-label="5 stars">
                  ★★★★★
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Circular Mountain Vignette + ALL 10 Animated & Clickable Phrases */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-10">
            <div className="relative w-[300px] h-[300px] sm:w-[390px] sm:h-[390px] md:w-[430px] md:h-[430px]">
              {/* Soft outer orbit ring */}
              <div className="absolute -inset-6 rounded-full border border-white/10 pointer-events-none" />

              {/* Circular Mountain Image */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/15 shadow-2xl relative bg-ink-light">
                <img
                  src="/02_four_vowels.jpg"
                  onError={(e) => {
                    e.currentTarget.src = "/loplao-hero-scene.jpg";
                  }}
                  alt="Himalayan Mountain Lake"
                  className="w-full h-full object-cover object-center scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
              </div>

              {/* Gold Lotus Emblem Badge (Bottom-Right of Circle) */}
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand shadow-xl border-2 border-white flex items-center justify-center z-30 pointer-events-none">
                <img
                  src="/symbol_lotus.png"
                  alt="Lotus Symbol"
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
                />
              </div>

              {/* All 10 Floating Tibetan Phrase Bubbles Revolving Clockwise */}
              <div
                className={`absolute inset-0 z-20 pointer-events-none ${
                  hoveredIdx !== null || activePhraseId !== null ? "orbit-paused" : ""
                }`}
              >
                <div className="orbit-wheel w-full h-full relative">
                  {HERO_PHRASES.map((phrase, idx) => {
                    // Place all 10 phrases evenly around a circle (every 36 degrees)
                    const angleDeg = idx * (360 / HERO_PHRASES.length) - 90;
                    const angleRad = (angleDeg * Math.PI) / 180;
                    // Radius = 54% from center so they sit right around the circular border
                    const leftPct = 50 + 54 * Math.cos(angleRad);
                    const topPct = 50 + 54 * Math.sin(angleRad);

                    const isFaded =
                      fadedIndices.includes(idx) &&
                      hoveredIdx !== idx &&
                      activePhraseId !== phrase.id;
                    const isPlaying = activePhraseId === phrase.id;

                    return (
                      <div
                        key={phrase.id}
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      >
                        {/* Counter-rotating wrapper keeps the card 100% horizontal while orbiting */}
                        <div className="orbit-item-upright">
                          <button
                            type="button"
                            onClick={() => handleHeroPhraseClick(phrase)}
                            title="Click to hear phrase"
                            className={`group text-left bg-surface/95 hover:bg-surface text-ink px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-xl border transition-all duration-1000 cursor-pointer flex items-center gap-2.5 w-max max-w-[210px] sm:max-w-[240px] ${
                              isFaded
                                ? "opacity-20 scale-95 blur-[0.5px]"
                                : "opacity-100 scale-100 blur-0"
                            } ${
                              isPlaying
                                ? "border-brand ring-4 ring-brand/30 scale-105 z-30"
                                : "border-border-subtle hover:border-brand hover:scale-105 hover:z-30"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-tibetan text-base sm:text-lg text-ink leading-snug">
                                {phrase.tib}
                              </div>
                              <div className="text-[10px] sm:text-[11px] font-medium text-ink-muted leading-tight">
                                {phrase.en}
                              </div>
                            </div>
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                isPlaying
                                  ? "bg-brand text-ink"
                                  : "bg-brand-light text-brand-dark group-hover:bg-brand group-hover:text-ink"
                              }`}
                            >
                              <Volume2
                                size={12}
                                className={isPlaying ? "animate-pulse" : ""}
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Subtle Interactive Hint Underneath the Orbit */}
            <div className="mt-12 inline-flex items-center gap-2 text-xs text-white/60">
              <Volume2 size={14} className="text-brand" />
              <span>Click any floating Tibetan phrase to preview</span>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          3. "MY PROFICIENCY LEVEL" CAROUSEL + DETAIL MODAL (bg-surface)
      ==================================================================== */}
      <section id="levels" className="py-24 bg-surface border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-3">
            My Proficiency Level
          </h2>
          <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto mb-14">
            A clear, step-by-step journey from your first letter to fluent discourse.
          </p>

          {/* Carousel Container */}
          <div className="relative flex items-center justify-center">
            {/* Left Arrow */}
            <button
              type="button"
              onClick={() => setLevelPage((p) => (p === 0 ? 1 : 0))}
              aria-label="Previous proficiency levels"
              className="hidden sm:flex w-10 h-10 rounded-full border border-border-subtle bg-surface hover:border-ink text-ink-muted hover:text-ink items-center justify-center shadow-sm transition-all shrink-0 mr-4 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            {/* 3 Visible Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {PROFICIENCY_LEVELS.slice(levelPage * 3, levelPage * 3 + 3).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className="group bg-surface hover:bg-paper/60 border border-border-subtle/70 hover:border-brand rounded-3xl p-7 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                >
                  {/* Circular Medallion with Auspicious Symbol */}
                  <div className="w-28 h-28 rounded-full bg-paper border border-border-subtle group-hover:border-brand flex items-center justify-center mb-5 shadow-sm transition-colors">
                    <img
                      src={lvl.symbol}
                      alt={lvl.title}
                      className="w-16 h-16 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-1">
                    {lvl.levelLabel}
                  </div>
                  <h3 className="font-serif font-normal text-2xl text-ink mb-1 group-hover:text-brand-dark transition-colors">
                    {lvl.title}
                  </h3>
                  <div className="text-xs font-serif italic text-brand-dark mb-3">
                    {lvl.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-ink-light leading-relaxed max-w-[260px] mb-5">
                    {lvl.oneLine}
                  </p>

                  {lvl.status === "open" ? (
                    <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-dark bg-brand-light px-3.5 py-1 rounded-full border border-brand/30">
                      <Sparkles size={12} /> Free · Click for details
                    </span>
                  ) : (
                    <span className="mt-auto text-[11px] font-medium text-ink-muted">
                      Coming soon · Click for details
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={() => setLevelPage((p) => (p === 0 ? 1 : 0))}
              aria-label="Next proficiency levels"
              className="hidden sm:flex w-10 h-10 rounded-full border border-border-subtle bg-surface hover:border-ink text-ink-muted hover:text-ink items-center justify-center shadow-sm transition-all shrink-0 ml-4 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setLevelPage(0)}
              aria-label="Page 1"
              className={`h-2 rounded-full transition-all cursor-pointer ${
                levelPage === 0 ? "w-6 bg-brand" : "w-2 bg-border-strong"
              }`}
            />
            <button
              type="button"
              onClick={() => setLevelPage(1)}
              aria-label="Page 2"
              className={`h-2 rounded-full transition-all cursor-pointer ${
                levelPage === 1 ? "w-6 bg-brand" : "w-2 bg-border-strong"
              }`}
            />
          </div>

          <p className="mt-6 text-xs text-ink-muted">
            Click any level above to read its full course overview.
          </p>
        </div>
      </section>

      {/* ====================================================================
          4. FEATURE SHOWCASE 1: "READ TIBETAN WITH CONFIDENCE" (bg-ink)
      ==================================================================== */}
      <section className="py-24 bg-ink text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 3 Fanned App Screen Mockups */}
          <div className="lg:col-span-6 flex items-center justify-center relative py-6">
            <div className="relative flex items-center justify-center w-full max-w-[460px] h-[340px] sm:h-[400px]">
              {/* Left Tilted Phone */}
              <div className="w-[155px] sm:w-[185px] rounded-[24px] border-4 border-ink bg-white shadow-2xl overflow-hidden -rotate-12 -translate-x-16 sm:-translate-x-24 translate-y-4 transition-transform duration-500 hover:-translate-y-1">
                <img
                  src="/app_screen_vowels.jpg"
                  alt="The Four Vowels Screen"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Right Tilted Phone */}
              <div className="w-[155px] sm:w-[185px] rounded-[24px] border-4 border-ink bg-white shadow-2xl overflow-hidden rotate-12 translate-x-16 sm:translate-x-24 translate-y-4 transition-transform duration-500 hover:-translate-y-1">
                <img
                  src="/app_screen_beginner1.jpg"
                  alt="Beginner 1 Syllabus Screen"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Center Prominent Phone */}
              <div className="absolute z-10 w-[180px] sm:w-[215px] rounded-[28px] border-[5px] border-ink bg-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] overflow-hidden transition-transform duration-500 hover:scale-[1.03]">
                <img
                  src="/app_screen_consonants.jpg"
                  alt="The 30 Consonants Lesson Screen"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Editorial Copy */}
          <div className="lg:col-span-6 text-left max-w-xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
              Script Made Simple
            </div>
            <h2 className="font-serif font-normal text-4xl sm:text-5xl text-white leading-tight mb-5">
              Read Tibetan <br className="hidden sm:inline" />
              with confidence
            </h2>
            <p className="text-base sm:text-[17px] text-white/80 leading-relaxed">
              Tap any letter to hear it, learn the tone groups, and lock in each step
              with a mastery check before moving on to vowels, prefixes and suffixes.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. FEATURE SHOWCASE 2: "LEARN FOR REAL LIFE" (bg-surface)
      ==================================================================== */}
      <section className="py-24 bg-surface text-ink overflow-hidden border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Editorial Copy */}
          <div className="lg:col-span-6 text-left max-w-xl order-2 lg:order-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-3">
              Speak From Day One
            </div>
            <h2 className="font-serif font-normal text-4xl sm:text-5xl text-ink leading-tight mb-5">
              Learn for real life
            </h2>
            <p className="text-base sm:text-[17px] text-ink-light leading-relaxed">
              Every unit is built around real conversations — greetings, introductions,
              telling the time — voiced by native speakers so you hear Tibetan as it is
              spoken.
            </p>
          </div>

          {/* Right: 3 Fanned App Screen Mockups */}
          <div className="lg:col-span-6 flex items-center justify-center relative py-6 order-1 lg:order-2">
            <div className="relative flex items-center justify-center w-full max-w-[460px] h-[340px] sm:h-[400px]">
              {/* Left Tilted Phone */}
              <div className="w-[155px] sm:w-[185px] rounded-[24px] border-4 border-ink bg-white shadow-xl overflow-hidden -rotate-12 -translate-x-16 sm:-translate-x-24 translate-y-4 transition-transform duration-500 hover:-translate-y-1">
                <img
                  src="/app_screen_greetings.jpg"
                  alt="Everyday Greetings Screen"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Right Tilted Phone */}
              <div className="w-[155px] sm:w-[185px] rounded-[24px] border-4 border-ink bg-white shadow-xl overflow-hidden rotate-12 translate-x-16 sm:translate-x-24 translate-y-4 transition-transform duration-500 hover:-translate-y-1">
                <img
                  src="/app_screen_numbers.jpg"
                  alt="Numbers, Age and Time Screen"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Center Prominent Phone */}
              <div className="absolute z-10 w-[180px] sm:w-[215px] rounded-[28px] border-[5px] border-ink bg-white shadow-2xl overflow-hidden transition-transform duration-500 hover:scale-[1.03]">
                <img
                  src="/app_screen_beginner2.jpg"
                  alt="Everyday Tibetan Beginner 2 Screen"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. "HOW YOUR LEARNING IS STRUCTURED" CAROUSEL (bg-ink)
      ==================================================================== */}
      <section id="methodology" className="py-24 bg-ink text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
            How The App Works
          </div>
          <h2 className="font-serif font-normal text-3xl sm:text-4xl text-white mb-3">
            How your learning is structured
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto mb-14">
            Four quiet systems run behind every lesson — so you always know what to open
            next.
          </p>

          <div className="relative flex items-center justify-center">
            {/* Left Arrow */}
            <button
              type="button"
              onClick={() => setSystemPage((p) => (p === 0 ? 1 : 0))}
              aria-label="Previous system features"
              className="hidden sm:flex w-10 h-10 rounded-full border border-white/20 hover:border-white/60 text-white/70 hover:text-white items-center justify-center transition-all shrink-0 mr-6 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            {/* 2 Visible System Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-3xl">
              {LEARNING_SYSTEMS.slice(systemPage * 2, systemPage * 2 + 2).map((sys) => (
                <div
                  key={sys.title}
                  className="flex flex-col items-center text-center px-4"
                >
                  <div className="w-20 h-20 rounded-full bg-paper flex items-center justify-center mb-6 shadow-lg">
                    <img
                      src={sys.symbol}
                      alt={sys.title}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-serif font-normal text-2xl text-white mb-3">
                    {sys.title}
                  </h3>
                  <p className="text-sm text-white/75 leading-relaxed max-w-sm">
                    {sys.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={() => setSystemPage((p) => (p === 0 ? 1 : 0))}
              aria-label="Next system features"
              className="hidden sm:flex w-10 h-10 rounded-full border border-white/20 hover:border-white/60 text-white/70 hover:text-white items-center justify-center transition-all shrink-0 ml-6 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSystemPage(0)}
              aria-label="System page 1"
              className={`h-2 rounded-full transition-all cursor-pointer ${
                systemPage === 0 ? "w-6 bg-brand" : "w-2 bg-white/30"
              }`}
            />
            <button
              type="button"
              onClick={() => setSystemPage(1)}
              aria-label="System page 2"
              className={`h-2 rounded-full transition-all cursor-pointer ${
                systemPage === 1 ? "w-6 bg-brand" : "w-2 bg-white/30"
              }`}
            />
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. "LANGUAGE CARRIES A CULTURE" (bg-surface + bg-paper CARDS)
      ==================================================================== */}
      <section id="culture" className="py-24 bg-surface border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-xl mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2">
              Culture In Every Lesson
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink mb-3">
              Language carries a culture
            </h2>
            <p className="text-sm sm:text-base text-ink-light leading-relaxed">
              Culture notes sit inside the lessons themselves, not beside them — so a
              greeting arrives with the scarf that goes with it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CULTURE_CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-paper border border-border-subtle rounded-2xl p-7 flex flex-col items-start text-left shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-surface border border-border-subtle flex items-center justify-center mb-5 shadow-xs">
                  <img
                    src={card.symbol}
                    alt={card.title}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <h3 className="font-serif font-normal text-xl text-ink mb-2.5">
                  {card.title}
                </h3>
                <p className="text-sm text-ink-light leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. "QUESTIONS AND ANSWERS" FAQ ACCORDION (bg-surface)
      ==================================================================== */}
      <section id="faq" className="py-24 bg-surface">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif font-normal text-3xl sm:text-4xl text-ink text-center mb-12">
            Questions and answers
          </h2>

          <div className="divide-y divide-border-subtle border-y border-border-subtle">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={item.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                  >
                    <span className="font-serif font-normal text-lg sm:text-xl text-ink group-hover:text-brand-dark transition-colors">
                      {item.q}
                    </span>
                    <span className="text-brand-dark shrink-0">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm text-ink-light leading-relaxed pr-6">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          9. "TAKE TIBETAN WITH YOU" + INTERACTIVE CONSONANT PHONE PREVIEW
      ==================================================================== */}
      <section className="py-20 bg-ink text-white border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy + App Store / Google Play with Diagonal "COMING SOON!" Stamp */}
          <div className="md:col-span-7 text-left">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
              Learn Anywhere
            </div>
            <h2 className="font-serif font-normal text-4xl sm:text-5xl text-white mb-4">
              Take Tibetan with you
            </h2>
            <p className="text-base sm:text-[17px] text-white/80 max-w-lg leading-relaxed mb-9">
              Your progress syncs seamlessly between web and phone, so you can learn
              wherever you are. Try clicking any consonant on the phone preview to hear
              its sound and inspect its tone and gender.
            </p>

            {/* Crisp White Store Frame (Matching Mockup) + Diagonal "COMING SOON!" Stamp */}
            <div className="relative inline-block">
              <div className="bg-surface rounded-2xl p-3 sm:p-3.5 shadow-2xl flex flex-row items-center gap-3 border border-white/20 select-none">
                {/* Apple App Store Badge */}
                <div className="bg-black text-white rounded-xl px-4 py-2.5 flex items-center gap-3 min-w-[155px] opacity-85">
                  <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.96 6.33c.67-.81 1.12-1.94 1-3.08-.96.04-2.13.64-2.82 1.45-.61.7-.11 1.85-.99 2.97 1.08.08 2.15-.53 2.81-1.34" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider opacity-75 leading-none mb-0.5">
                      Download on the
                    </div>
                    <div className="text-sm font-bold leading-tight">App Store</div>
                  </div>
                </div>

                {/* Google Play Badge */}
                <div className="bg-black text-white rounded-xl px-4 py-2.5 flex items-center gap-3 min-w-[155px] opacity-85">
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider opacity-75 leading-none mb-0.5">
                      Get it on
                    </div>
                    <div className="text-sm font-bold leading-tight">Google Play</div>
                  </div>
                </div>
              </div>

              {/* Diagonal Gold "COMING SOON!" Stamp Across Both Buttons */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="-rotate-6 bg-brand text-ink font-extrabold text-xs sm:text-sm uppercase tracking-[0.22em] px-6 py-2 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.45)] border-2 border-ink flex items-center gap-2">
                  <span>Coming Soon!!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Phone Frame with Live Consonants & Pop-up */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-[270px] sm:w-[290px] rounded-[34px] border-[6px] border-[#081b31] bg-paper text-ink p-4 shadow-2xl">
              {/* Top Phone Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                  Unit 1 · Step 2
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-dark animate-pulse">
                  <Sparkles size={11} /> Click any letter
                </span>
              </div>

              {/* Featured Active Consonant Card */}
              <div className="bg-surface rounded-2xl border border-border-subtle p-4 text-center shadow-xs mb-3">
                <div className="font-tibetan text-5xl text-ink leading-normal mb-1">
                  {activePhoneConsonant.tib}
                </div>
                <div className="text-xs font-bold text-ink-light mb-3">
                  {activePhoneConsonant.translit} ·{" "}
                  <span className="text-ink-muted font-normal">
                    {TONE_META[activePhoneConsonant.tone].short}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    playLandingSound(activePhoneConsonant.tib);
                    setSelectedConsonantPopup({
                      c: activePhoneConsonant,
                      rect: e.currentTarget.getBoundingClientRect(),
                    });
                  }}
                  className="w-full bg-brand hover:bg-brand-dark text-ink font-bold text-xs py-2.5 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {playingConsonant === activePhoneConsonant.tib ||
                  playingItem === activePhoneConsonant.tib ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Volume2 size={14} />
                  )}
                  Hear sound &amp; notes
                </button>
              </div>

              {/* Mini Grid of 12 Clickable Consonants */}
              <div className="grid grid-cols-4 gap-1.5">
                {phoneConsonants.map((c) => {
                  const isSelected = activePhoneConsonant.tib === c.tib;
                  return (
                    <button
                      key={c.tib}
                      type="button"
                      onClick={(e) => {
                        setActivePhoneConsonant(c);
                        playLandingSound(c.tib);
                        setSelectedConsonantPopup({
                          c,
                          rect: e.currentTarget.getBoundingClientRect(),
                        });
                      }}
                      className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-light border-brand shadow-xs scale-[1.03]"
                          : "bg-surface border-border-subtle hover:border-brand/60"
                      }`}
                    >
                      <span
                        className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
                        style={{ backgroundColor: TONE_HEX[c.tone] }}
                      />
                      <span className="font-tibetan text-xl text-ink leading-none mt-1">
                        {c.tib}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-ink-muted mt-0.5">
                        {c.translit}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          10. FOOTER (DARKER NAVY + 8 AUSPICIOUS SYMBOLS + WISDOM BLESSING)
      ==================================================================== */}
      <footer className="bg-[#091e36] text-white/70 py-14 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          {/* Row of 8 Auspicious Symbols */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mb-6">
            {EIGHT_AUSPICIOUS_SYMBOLS.map((sym) => (
              <img
                key={sym.alt}
                src={sym.src}
                alt={sym.alt}
                title={sym.alt}
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain opacity-90 hover:opacity-100 hover:scale-110 transition-all"
              />
            ))}
          </div>

          {/* Tibetan Wisdom Blessing */}
          <div className="font-tibetan text-2xl sm:text-3xl text-white mb-1.5">
            ཤེས་རབ་ལྷ་མོས་དངོས་གྲུབ་སྩོལ།
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-white/60 mb-8">
            &ldquo;May the goddess of wisdom bestow accomplishment.&rdquo;
          </p>

          {/* Navigation & Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/70 mb-6">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Support
            </Link>
            <Link
              href="/donate"
              className="text-brand hover:text-brand-light font-bold transition-colors"
            >
              Donate
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>

          <div className="text-[11px] text-white/45">
            © {new Date().getFullYear()} Loplao · Learn Tibetan UK
          </div>
        </div>
      </footer>

      {/* ====================================================================
          MODAL 1: PROFICIENCY LEVEL POP-UP WINDOW (EXACT COPY + AUDIO ONLY ON LEVEL 1)
      ==================================================================== */}
      {selectedLevel && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            stopAudio();
            setSelectedLevel(null);
          }}
        >
          <div
            className="bg-paper border border-border-strong rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                stopAudio();
                setSelectedLevel(null);
              }}
              aria-label="Close modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header: Medallion + Title + Subtitle */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-surface border border-border-subtle flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={selectedLevel.symbol}
                  alt={selectedLevel.title}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                    {selectedLevel.levelLabel}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      selectedLevel.status === "open"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-brand-light text-brand-dark border border-brand/30"
                    }`}
                  >
                    {selectedLevel.statusBadge}
                  </span>
                </div>
                <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink">
                  {selectedLevel.title} ·{" "}
                  <span className="italic text-brand-dark">{selectedLevel.subtitle}</span>
                </h3>
              </div>
            </div>

            {/* One-line summary */}
            <p className="font-serif italic text-base text-ink mb-4">
              {selectedLevel.oneLine}
            </p>

            {/* Short summary */}
            <p className="text-sm text-ink-light leading-relaxed mb-5">
              {selectedLevel.shortDesc}
            </p>

            {/* Full (for the box) */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-5 mb-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-2 flex items-center gap-2">
                <BookOpen size={14} /> Course Overview
              </div>
              <p className="text-sm text-ink leading-relaxed">
                {selectedLevel.fullBoxDesc}
              </p>
            </div>

            {/* Sample Tibetan Examples: Clickable Audio ONLY for Beginner 1 */}
            <div className="mb-7">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-3">
                {selectedLevel.hasAudio
                  ? "Tap any example to hear its sound"
                  : "Examples from this level"}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {selectedLevel.sampleItems.map((sample) =>
                  selectedLevel.hasAudio ? (
                    <button
                      key={sample.tib}
                      type="button"
                      onClick={() => {
                        if (sample.audioUrl) {
                          handleHeroPhraseClick({
                            id: sample.tib,
                            tib: sample.tib,
                            en: sample.en,
                            posClass: "",
                            floatClass: "",
                            audioUrl: sample.audioUrl,
                          });
                        } else {
                          playLandingSound(sample.tib);
                        }
                      }}
                      className="bg-surface hover:bg-brand-light/40 border border-border-subtle hover:border-brand rounded-xl p-3 text-left transition-all flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-tibetan text-2xl text-ink leading-normal">
                          {sample.tib}
                        </span>
                        <Volume2
                          size={14}
                          className="text-ink-muted group-hover:text-brand-dark shrink-0 mt-1"
                        />
                      </div>
                      <div className="mt-1">
                        <div className="text-xs font-bold text-ink">
                          {sample.translit}
                        </div>
                        <div className="text-[11px] text-ink-muted truncate">
                          {sample.en}
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div
                      key={sample.tib}
                      className="bg-surface border border-border-subtle rounded-xl p-3 text-left flex flex-col justify-between"
                    >
                      <span className="font-tibetan text-xl text-ink leading-normal">
                        {sample.tib}
                      </span>
                      <div className="mt-1.5">
                        <div className="text-xs font-bold text-ink">
                          {sample.translit}
                        </div>
                        <div className="text-[11px] text-ink-muted truncate">
                          {sample.en}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Bottom Modal Action */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border-subtle">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setSelectedLevel(null)}
                    className="w-full sm:w-auto bg-ink hover:bg-ink-light text-white font-bold px-7 py-3.5 text-sm rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Start Beginner 1 Free <ArrowRight size={16} />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  onClick={() => setSelectedLevel(null)}
                  className="w-full sm:w-auto"
                >
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-ink hover:bg-ink-light text-white font-bold px-7 py-3.5 text-sm rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Go to Dashboard <ArrowRight size={16} />
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: DRAGGABLE CONSONANT DETAIL PANEL (FROM PHONE PREVIEW)
      ==================================================================== */}
      {selectedConsonantPopup && (
        <LandingConsonantDetailPanel
          data={selectedConsonantPopup}
          onClose={() => {
            if (consonantAudioRef.current) {
              consonantAudioRef.current.pause();
              consonantAudioRef.current = null;
            }
            setPlayingConsonant(null);
            stopAudio();
            setSelectedConsonantPopup(null);
          }}
          onSpeak={playLandingSound}
          playingItem={playingConsonant || playingItem}
        />
      )}
    </div>
  );
}

// ============================================================================
// CONSONANT DETAIL POP-UP PANEL (REUSES LESSON 1 DESIGN & DRAGGABLE PANEL)
// ============================================================================
function LandingConsonantDetailPanel({
  data,
  onClose,
  onSpeak,
  playingItem,
}: {
  data: { c: Consonant; rect: DOMRect };
  onClose: () => void;
  onSpeak: (text: string) => void;
  playingItem: string | null;
}) {
  const { c, rect } = data;
  const tone = TONE_META[c.tone as Tone];
  const gender = GENDER_META[c.gender as Gender];

  return (
    <DraggablePanel rect={rect} title={`Consonant · ${c.translit}`} onClose={onClose}>
      <div className="flex items-center gap-5 mb-6">
        <div className="text-tibetan-display">{c.tib}</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="text-xl font-serif italic text-ink">{c.translit}</div>
            <div className="text-base font-mono font-bold text-ink-light">
              {c.pron}
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => onSpeak(c.tib)}
            className="w-fit px-4 py-1.5 text-xs"
          >
            {playingItem === c.tib ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Volume2 size={14} />
            )}{" "}
            Play
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`p-3 border ${tone.swatch} border-opacity-50`}>
          <div className="text-eyebrow mb-1">Tone</div>
          <div className={`font-serif text-sm font-bold ${tone.text}`}>
            {tone.short}
          </div>
        </div>

        <div
          className="p-3 border bg-surface"
          style={{ borderColor: gender.color + "40", backgroundColor: gender.tint }}
        >
          <div className="text-eyebrow mb-1">Gender</div>
          <div
            className="font-serif text-sm font-bold flex items-center gap-1.5"
            style={{ color: gender.text }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: gender.color }}
            />
            {gender.label}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-eyebrow mb-1">Pronunciation</div>
        <p className="text-sm text-ink-light leading-relaxed">{tone.description}</p>
      </div>

      <div className="border-t border-border-strong pt-4">
        <div className="text-eyebrow mb-1">Notes from the textbook</div>
        <p className="text-sm text-ink-light leading-relaxed italic">{c.note}</p>
      </div>
    </DraggablePanel>
  );
}