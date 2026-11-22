// app/components/lesson/8/WebLesson8.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Headphones,
  Info,
  Lightbulb,
  Loader2,
  MessageCircle,
  Mic,
  Sparkles,
  Volume2,
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { BEGINNER_2_UPCOMING } from "@/app/data/syllabus";
import {
  VOCAB,
  VOCAB_CATEGORIES,
  USEFUL_PHRASES,
  PRONOUNS,
  DEMONSTRATIVES,
  COPULA_ROWS,
  COPULA_EXAMPLES,
  DIALOGUES,
  CLASSROOM_COMMANDS,
  CULTURE_NOTES,
  CAN_DO_CHECKLIST,
  SPEAKING_PROMPTS,
  WEB_STEPS,
  generateVocabQuiz,
  generatePhrasesQuiz,
  generatePronounsQuiz,
  generateCopulaQuiz,
  generateCommandsQuiz,
  generatePracticeDrills,
  generateFinalQuiz,
} from "@/app/data/lesson8";

import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

function renderTibetanInline(text: string, sizeClass = "text-[1.35em]") {
  const parts = text.split(/([\u0F00-\u0FFF]+)/g);
  return parts.map((part, idx) =>
    /[\u0F00-\u0FFF]/.test(part) ? (
      <span key={idx} className={`font-tibetan font-normal ${sizeClass} text-ink leading-normal mx-0.5 align-baseline`}>
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

type PracticeTabKey = "grammar" | "pronouns" | "conversation" | "recall" | "listening";

export function WebLesson8() {
  const { playAudio, stopAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, completed, progressPercent, markComplete } = useLessonProgress(WEB_STEPS.length);

  const [activeSection, setActiveSection] = useState<number>(0);
  const hasSyncedInitial = useRef(false);
  const centerTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasSyncedInitial.current && unlockedStep > 0) {
      hasSyncedInitial.current = true;
      setActiveSection(Math.min(unlockedStep, WEB_STEPS.length - 1));
    }
  }, [unlockedStep]);

  // Section-local interactive states
  const [coverVocabEn, setCoverVocabEn] = useState(false);
  const [coverPhrasesEn, setCoverPhrasesEn] = useState(false);
  const [expandedPhraseId, setExpandedPhraseId] = useState<string | null>(null);
  const [showAllDialogues, setShowAllDialogues] = useState(false);
  const [bubbleReveal, setBubbleReveal] = useState<Record<string, number>>({});
  const [dialogueViewMode, setDialogueViewMode] = useState<Record<string, "thread" | "focus">>({});
  const [dialogueFocusIdx, setDialogueFocusIdx] = useState<Record<string, number>>({});
  const [expandedCmds, setExpandedCmds] = useState<Record<string, boolean>>({});
  const [activePracticeTab, setActivePracticeTab] = useState<PracticeTabKey>("grammar");
  const [drillResults, setDrillResults] = useState<Record<string, { score: number; total: number }>>({});
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Memoized quizzes & practice bundles
  const vocabQuiz = useMemo(() => generateVocabQuiz(), []);
  const phrasesQuiz = useMemo(() => generatePhrasesQuiz(), []);
  const pronounsQuiz = useMemo(() => generatePronounsQuiz(), []);
  const copulaQuiz = useMemo(() => generateCopulaQuiz(), []);
  const commandsQuiz = useMemo(() => generateCommandsQuiz(), []);
  const practiceDrills = useMemo(() => generatePracticeDrills(), []);
  const finalQuiz = useMemo(() => generateFinalQuiz(), []);

  const practiceGroups = useMemo(
    () => [
      {
        name: "Vocabulary",
        items: VOCAB.map((v) => ({
          id: `b2-l1-v-${v.tib}`,
          tibetan: v.tib,
          reading: v.pron,
          english: v.en,
          audioTarget: v.tib,
          emoji: v.emoji,
        })),
      },
      {
        name: "Useful Phrases",
        items: USEFUL_PHRASES.map((p) => ({
          id: `b2-l1-p-${p.id}`,
          tibetan: p.tib,
          reading: p.pron,
          english: p.en,
          audioTarget: p.tib,
        })),
      },
      {
        name: "Class Commands",
        items: CLASSROOM_COMMANDS.map((c) => ({
          id: `b2-l1-c-${c.num}`,
          tibetan: c.tib,
          reading: c.pron,
          english: c.en,
          audioTarget: c.tib,
        })),
      },
    ],
    []
  );

  const upcomingLessonsStrip = useMemo(
    () => BEGINNER_2_UPCOMING.filter((u) => !u.isCapstone),
    []
  );

  const section = WEB_STEPS[activeSection] || WEB_STEPS[0];
  const completedCount = Math.min(completed.size, WEB_STEPS.length);

  // Practice Hub metrics (6 total drills: copulaPositive, copulaNegative, pronouns, conversation, listening, free recall)
  const recordDrillResult = (key: string, score: number, total: number) => {
    setDrillResults((prev) => ({ ...prev, [key]: { score, total } }));
  };
  const completedDrillsCount = Object.keys(drillResults).length;
  const totalAnswered = Object.values(drillResults).reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = Object.values(drillResults).reduce((sum, r) => sum + r.score, 0);
  const overallAccuracy = totalAnswered > 0 ? `${Math.round((totalCorrect / totalAnswered) * 100)}%` : "—";

  // Contextual Right Rail "New words" list (shows phrases on Useful Phrases section, vocab otherwise)
  const rightRailItems = useMemo(() => {
    if (activeSection === 1) {
      return USEFUL_PHRASES.slice(0, 5).map((p) => ({
        tib: p.tib,
        pron: p.pron,
        en: p.en,
      }));
    }
    return VOCAB.slice(0, 5).map((v) => ({
      tib: v.tib,
      pron: v.pron,
      en: v.en,
    }));
  }, [activeSection]);

  const goToSection = (idx: number) => {
    stopAudio();
    const clamped = Math.max(0, Math.min(idx, WEB_STEPS.length - 1));
    setActiveSection(clamped);
    setTimeout(() => {
      centerTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleContinueSection = () => {
    markComplete(activeSection);
    if (activeSection < WEB_STEPS.length - 1) {
      goToSection(activeSection + 1);
    }
  };

  const cycleBubbleReveal = (key: string) => {
    setBubbleReveal((prev) => ({ ...prev, [key]: ((prev[key] || 0) + 1) % 3 }));
  };

  const toggleFocusLineReveal = (key: string) => {
    setBubbleReveal((prev) => ({ ...prev, [key]: (prev[key] || 0) >= 2 ? 0 : 2 }));
  };

  const toggleAllDialogues = () => {
    const nextShow = !showAllDialogues;
    setShowAllDialogues(nextShow);
    setBubbleReveal((prev) => {
      const next = { ...prev };
      DIALOGUES.forEach((thread) => {
        thread.lines.forEach((_, i) => {
          next[`${thread.id}-${i}`] = nextShow ? 2 : 0;
        });
      });
      return next;
    });
  };

  const toggleThreadReveal = (threadId: string, lineCount: number) => {
    setBubbleReveal((prev) => {
      const allFull = Array.from({ length: lineCount }, (_, i) => (prev[`${threadId}-${i}`] || 0) >= 2).every(Boolean);
      const next = { ...prev };
      for (let i = 0; i < lineCount; i++) {
        next[`${threadId}-${i}`] = allFull ? 0 : 2;
      }
      return next;
    });
  };

  const toggleCmd = (num: string) => {
    setExpandedCmds((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-16 text-ink">
      {/* ===================================================================== */}
      {/* TOP BAR: Back to Lessons + Active Lesson Strip                        */}
      {/* ===================================================================== */}
      <div className="mb-5 space-y-3">
        <div>
          <Link
            href="/dashboard?hub=beginner2"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={13} /> Back to Lessons
          </Link>
        </div>

        <div className="bg-surface border border-border-subtle rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mr-1.5">
            Active Lesson:
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50/80 text-emerald-800 border border-emerald-500/70">
            <BookOpen size={12} className="text-emerald-700" />
            Welcome to the Class
          </span>

          {upcomingLessonsStrip.map((u) => (
            <span
              key={u.unitNumber}
              title="Coming soon"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-paper/70 text-ink-muted border border-border-subtle/80 select-none"
            >
              <BookOpen size={11} className="opacity-60" />
              {u.title}
            </span>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* THREE-COLUMN BEGINNER 2 WORKSPACE                                     */}
      {/* Left Narrow | Very Wide Central | Right Narrow                        */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[215px_minmax(0,1fr)_235px] xl:grid-cols-[235px_minmax(0,1fr)_255px] gap-5 items-start">
        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 1: NARROW LEFT SECTION NAVIGATOR                             */}
        {/* ------------------------------------------------------------------- */}
        <aside className="lg:sticky lg:top-4 bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-xs">
          {/* Unit Thumbnail */}
          <div className="relative h-24 w-full overflow-hidden bg-ink">
            <img
              src="/loplao-hero-scene.jpg"
              alt="Welcome to the Class"
              className="w-full h-full object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-3.5 flex flex-col justify-end">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">
                Unit 01
              </span>
              <div className="text-sm font-bold text-white leading-tight">
                Welcome to the Class
              </div>
            </div>
          </div>

          {/* Tibetan Unit Title & Section Count */}
          <div className="px-4 pt-3.5 pb-3 border-b border-border-subtle/80">
            <div className="font-tibetan text-lg text-ink leading-normal pb-1">
              འཛིན་གྲྭར་ཕེབས་པར་དགའ་བསུ་ཞུ།
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted">
              <span>Beginner 2</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={10} /> {WEB_STEPS.length} sections
              </span>
            </div>
          </div>

          {/* 8 Section Links */}
          <nav className="p-2 space-y-1">
            {WEB_STEPS.map((s, idx) => {
              const isActive = idx === activeSection;
              const isDone = completed.has(idx);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSection(idx)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#E9F3FA] text-ink"
                      : "hover:bg-surface-muted/60 text-ink-light"
                  }`}
                >
                  <span
                    className={`size-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                      isActive
                        ? "bg-[#0B77C5] text-white"
                        : isDone
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-surface-muted text-ink-muted"
                    }`}
                  >
                    {isDone && !isActive ? <Check size={12} strokeWidth={3} /> : idx + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className={`text-xs leading-tight truncate ${isActive ? "font-bold text-ink" : "font-medium text-ink"}`}>
                      {s.navTitle}
                    </div>
                    <div className="font-tibetan text-[13px] text-ink-muted leading-normal truncate">
                      {s.tibetanTitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 2: VERY WIDE CENTRAL WORKSPACE                               */}
        {/* ------------------------------------------------------------------- */}
        <section ref={centerTopRef} className="min-w-0 space-y-4 scroll-mt-4">
          <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-xs">
            {/* Dark Atmospheric Hero Banner */}
            <div className="relative overflow-hidden bg-ink text-white">
              <img
                src={section.bannerImage}
                alt={section.title}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B223C]/95 via-[#0E2C4D]/85 to-[#0E2C4D]/65" />

              <div className="relative z-10 px-6 py-7 md:px-8 md:py-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/90 mb-2">
                  {section.heroEyebrow}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-normal text-white leading-tight mb-2">
                  {section.title}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed mb-5">
                  {renderTibetanInline(section.description, "text-[1.25em] text-white")}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={12} className="text-white/60" /> Beginner 2
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} className="text-white/60" /> Section {activeSection + 1}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${Math.round(((activeSection + 1) / WEB_STEPS.length) * 100)}%` }}
                      />
                    </div>
                    <span>{activeSection + 1} / {WEB_STEPS.length} sections</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Section Body */}
            <div className="p-5 sm:p-7 md:p-8">
              {/* ============================================================= */}
              {/* SECTION 0: VOCABULARY                                         */}
              {/* ============================================================= */}
              {activeSection === 0 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <p className="text-sm text-ink-light leading-relaxed">
                      Tap any card to hear the reading. Cover the English column and test yourself before moving on.
                    </p>
                    <button
                      type="button"
                      onClick={() => setCoverVocabEn((v) => !v)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                        coverVocabEn
                          ? "bg-ink text-white border-ink"
                          : "bg-surface text-ink border-border-strong hover:bg-surface-muted"
                      }`}
                    >
                      {coverVocabEn ? <Eye size={13} /> : <EyeOff size={13} />}
                      {coverVocabEn ? "Show translation" : "Cover translation"}
                    </button>
                  </div>

                  {/* Categorised 5-column compact grid */}
                  <div className="space-y-7">
                    {VOCAB_CATEGORIES.map((cat) => {
                      const items = VOCAB.filter((v) => v.category === cat.id);
                      return (
                        <div key={cat.id}>
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-dark mb-3">
                            {cat.label}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                            {items.map((v) => {
                              const isPlaying = playingItem === v.tib;
                              return (
                                <button
                                  key={v.tib}
                                  type="button"
                                  onClick={() => playAudio(v.tib)}
                                  className="group bg-surface border border-border-subtle hover:border-brand rounded-xl p-3.5 text-left flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer min-h-[146px]"
                                >
                                  <div>
                                    <div className="text-2xl mb-2">{v.emoji}</div>
                                    <div className="font-tibetan text-2xl text-ink leading-normal pb-0.5">
                                      {v.tib}
                                    </div>
                                    <div className="text-[11px] font-serif italic text-ink-muted">
                                      {v.pron}
                                    </div>
                                  </div>

                                  <div className="mt-3 pt-2.5 border-t border-border-subtle/70 flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-ink truncate">
                                      {coverVocabEn ? (
                                        <span className="inline-block bg-surface-muted text-ink-muted text-[9px] uppercase tracking-wider px-2 py-0.5 rounded select-none">
                                          Hidden
                                        </span>
                                      ) : (
                                        v.en
                                      )}
                                    </span>
                                    <span className="size-6 rounded-md bg-brand-light/70 text-brand-dark flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-ink transition-colors">
                                      {isPlaying ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkpoint: Vocabulary check */}
                  <QuizModule
                    moduleId={8}
                    variant="editorial"
                    editorialSurface="cream"
                    eyebrow="Checkpoint"
                    title="Vocabulary check"
                    quizTitle="Mastery Check · Vocabulary"
                    subtitle="Reading, meaning, romanisation and listening — mixed."
                    questions={vocabQuiz}
                    playAudio={playAudio}
                    stopAudio={stopAudio}
                    playingItem={playingItem}
                    playErrorBeep={playErrorBeep}
                  />
                </div>
              )}

              {/* ============================================================= */}
              {/* SECTION 1: USEFUL PHRASES                                     */}
              {/* ============================================================= */}
              {activeSection === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <p className="text-sm text-ink-light leading-relaxed">
                      Tibetan has two different goodbyes: the person leaving says{" "}
                      <span className="font-tibetan text-xl text-ink">བཞུགས་ཨ།</span>, the person staying says{" "}
                      <span className="font-tibetan text-xl text-ink">ག་ལེར་ཕེབས།</span> (literally &lsquo;go slowly&rsquo;).
                    </p>
                    <button
                      type="button"
                      onClick={() => setCoverPhrasesEn((v) => !v)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                        coverPhrasesEn
                          ? "bg-ink text-white border-ink"
                          : "bg-surface text-ink border-border-strong hover:bg-surface-muted"
                      }`}
                    >
                      {coverPhrasesEn ? <Eye size={13} /> : <EyeOff size={13} />}
                      {coverPhrasesEn ? "Show translation" : "Cover translation"}
                    </button>
                  </div>

                  {/* Clean Table-style Phrase List */}
                  <div>
                    <div className="border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle/80 bg-surface">
                      {USEFUL_PHRASES.map((p) => {
                        const isOpen = expandedPhraseId === p.id;
                        return (
                          <div key={p.id} className="transition-colors hover:bg-paper/40">
                            <div className="px-4 py-3.5 grid grid-cols-1 md:grid-cols-[1.35fr_0.95fr_1.3fr_auto] items-center gap-2.5 md:gap-4">
                              <button
                                type="button"
                                onClick={() => setExpandedPhraseId(isOpen ? null : p.id)}
                                className="text-left font-tibetan text-[21px] text-ink leading-normal hover:text-brand-dark transition-colors cursor-pointer"
                              >
                                {p.tib}
                              </button>
                              <span className="text-xs font-serif italic text-ink-muted">
                                {p.pron}
                              </span>
                              <div className="text-xs sm:text-[13px] font-medium text-ink">
                                {coverPhrasesEn ? (
                                  <span className="inline-block bg-surface-muted text-ink-muted text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded select-none">
                                    Hidden
                                  </span>
                                ) : (
                                  p.en
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 justify-end">
                                <button
                                  type="button"
                                  onClick={() => playAudio(p.tib)}
                                  aria-label={`Play ${p.pron}`}
                                  className="size-7 rounded-md border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark hover:border-brand transition-colors cursor-pointer"
                                >
                                  {playingItem === p.tib ? <Loader2 size={13} className="animate-spin text-brand" /> : <Volume2 size={13} />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setExpandedPhraseId(isOpen ? null : p.id)}
                                  aria-label="Toggle breakdown"
                                  className="size-7 rounded-md border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-ink transition-colors cursor-pointer"
                                >
                                  <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                </button>
                              </div>
                            </div>

                            {isOpen && (
                              <div className="px-4 pb-4 pt-2 bg-paper/60 border-t border-border-subtle/70 animate-in fade-in duration-150">
                                <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2">
                                  Word-by-word breakdown
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {p.breakdown.map((part, i) => (
                                    <div key={i} className="bg-surface border border-border-subtle rounded-lg px-3 py-1.5 flex items-baseline gap-1.5">
                                      <span className="font-tibetan text-lg text-ink leading-normal">{part.tib}</span>
                                      <span className="font-serif italic text-[11px] text-ink-muted">({part.pron})</span>
                                      <span className="text-xs font-medium text-ink-light">— {part.gloss}</span>
                                    </div>
                                  ))}
                                </div>
                                {p.contextNote && (
                                  <p className="mt-2.5 text-xs font-medium text-brand-dark">{p.contextNote}</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                      Tap a phrase for its word-by-word breakdown
                    </div>
                  </div>

                  {/* Mint/Emerald Word Note: ལགས། */}
                  <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/45 p-5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800 mb-2.5">
                      <Info size={14} /> Word: <span className="font-tibetan text-lg normal-case leading-none ml-0.5">ལགས།</span>
                    </div>
                    <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed text-ink-light">
                      <p>
                        <span className="font-tibetan text-lg text-ink">ལགས་</span> (<em>la</em>) is the politeness particle you will hear constantly. It has two everyday uses:
                      </p>
                      <p>
                        <strong className="text-ink">1 —</strong> After a name, profession or title to show respect:{" "}
                        <span className="font-tibetan text-lg text-ink">དགེ་རྒན་ལགས།</span> (teacher),{" "}
                        <span className="font-tibetan text-lg text-ink">བཀྲ་ཤིས་ལགས།</span>
                      </p>
                      <p>
                        <strong className="text-ink">2 —</strong> In polite answers, together with the copula:{" "}
                        <span className="font-tibetan text-lg text-ink">ལགས་ཡིན།</span> (I am),{" "}
                        <span className="font-tibetan text-lg text-ink">ལགས་ཡོད།</span> (I do / I have),{" "}
                        <span className="font-tibetan text-lg text-ink">ལགས་རེད།</span> (it is).
                      </p>
                      <p className="pt-1 text-xs text-ink-muted">
                        Note: Tibetans rarely ask <span className="font-tibetan text-base text-ink">ཁྱེད་རང་སུ་ཡིན།</span> (&lsquo;Who are you?&rsquo;) face to face — it sounds harsh. On the phone it is fine, or simply say <span className="font-tibetan text-base text-ink">སུ་ཡིན་པས།</span>
                      </p>
                    </div>
                  </div>

                  {/* Checkpoint: Phrases check */}
                  <QuizModule
                    moduleId={8}
                    variant="editorial"
                    editorialSurface="cream"
                    eyebrow="Checkpoint"
                    title="Phrases check"
                    quizTitle="Mastery Check · Useful Phrases"
                    subtitle="Match each phrase to its use, produce it in Tibetan, and recognise it by ear."
                    questions={phrasesQuiz}
                    playAudio={playAudio}
                    stopAudio={stopAudio}
                    playingItem={playingItem}
                    playErrorBeep={playErrorBeep}
                  />
                </div>
              )}

              {/* ============================================================= */}
              {/* SECTION 2: GRAMMAR                                            */}
              {/* ============================================================= */}
              {activeSection === 2 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Card 1: Personal pronouns */}
                  <div className="border border-border-subtle rounded-2xl overflow-hidden bg-surface">
                    <div className="px-6 py-4 bg-paper/60 border-b border-border-subtle">
                      <h3 className="font-serif text-lg font-normal text-ink">Personal pronouns</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <p className="text-sm text-ink-light leading-relaxed">
                        Use this set for everyone you address or refer to, except yourself — for &lsquo;I&rsquo; and &lsquo;we,&rsquo; always use{" "}
                        <span className="font-tibetan text-xl text-ink">ང་</span> / <span className="font-tibetan text-xl text-ink">ང་ཚོ་</span>.
                      </p>

                      {(["singular", "plural"] as const).map((grp) => (
                        <div key={grp}>
                          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2.5">
                            {grp}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {PRONOUNS.filter((p) => p.number === grp).map((p) => (
                              <button
                                key={p.tib}
                                type="button"
                                onClick={() => playAudio(p.tib)}
                                className="relative bg-[#FFFDF7] hover:bg-brand-light/40 border border-amber-200/70 hover:border-brand rounded-xl px-3 py-4 flex flex-col items-center text-center transition-all cursor-pointer"
                              >
                                {p.honorific && (
                                  <span className="absolute -top-2 right-2 text-[8px] font-bold uppercase tracking-widest bg-brand text-ink px-2 py-0.5 rounded-full">
                                    Honorific
                                  </span>
                                )}
                                <span className="font-tibetan text-2xl text-ink leading-normal pb-0.5 mt-1">
                                  {p.tib}
                                </span>
                                <span className="font-serif italic text-[11px] text-ink-muted">
                                  {p.pron}
                                </span>
                                <span className="text-xs font-bold text-ink mt-0.5 mb-2">
                                  {p.en}
                                </span>
                                <Volume2 size={12} className="text-ink-muted" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2.5">
                          Demonstratives
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {DEMONSTRATIVES.map((d) => (
                            <button
                              key={d.tib}
                              type="button"
                              onClick={() => playAudio(d.tib)}
                              className="flex items-center justify-between border border-border-subtle bg-paper/40 hover:border-brand px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                            >
                              <div className="flex items-baseline gap-2.5">
                                <span className="font-tibetan text-xl text-ink leading-normal">{d.tib}</span>
                                <span className="font-serif italic text-xs text-ink-muted">{d.pron}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-ink">{d.en}</span>
                                <Volume2 size={13} className="text-ink-muted" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs text-ink-light pt-1">
                        <div className="flex items-start gap-2">
                          <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            When you talk about yourself, <span className="font-tibetan text-base text-ink">ང་</span> and{" "}
                            <span className="font-tibetan text-base text-ink">ང་ཚོ་</span> are normal even in polite speech.
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            Honorific <span className="font-tibetan text-base text-ink">ཁོང་</span> /{" "}
                            <span className="font-tibetan text-base text-ink">ཁོང་ཚོ་</span> is used for teachers, elders, monastics, and guests.
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#FFFDF5] border border-amber-200/80 rounded-xl px-4 py-3 text-xs text-ink flex items-center gap-2.5">
                        <Lightbulb size={15} className="text-brand-dark shrink-0" />
                        <span>
                          Rule of thumb for a beginner: <span className="font-tibetan text-base">ང་</span> for me,{" "}
                          <span className="font-tibetan text-base">ཁྱེད་རང་</span> for you,{" "}
                          <span className="font-tibetan text-base">ཁོང་</span> for anyone you respect.
                        </span>
                      </div>

                      <QuizModule
                        moduleId={8}
                        variant="editorial"
                        editorialSurface="cream"
                        eyebrow="Checkpoint"
                        title="Personal pronouns — mastery check"
                        quizTitle="Mastery Check · Personal Pronouns"
                        subtitle="Recognition, meaning, romanisation, listening and form choice — mixed."
                        questions={pronounsQuiz}
                        playAudio={playAudio}
                        stopAudio={stopAudio}
                        playingItem={playingItem}
                        playErrorBeep={playErrorBeep}
                      />
                    </div>
                  </div>

                  {/* Card 2: TO BE — ཡིན་ / རེད་ */}
                  <div className="border border-border-subtle rounded-2xl overflow-hidden bg-surface">
                    <div className="px-6 py-4 bg-paper/60 border-b border-border-subtle flex items-baseline gap-2">
                      <h3 className="font-serif text-lg font-normal text-ink uppercase tracking-wide">
                        To be —
                      </h3>
                      <span className="font-tibetan text-2xl text-ink leading-normal">ཡིན་ / རེད་</span>
                    </div>
                    <div className="p-6 space-y-6">
                      <p className="text-sm text-ink-light leading-relaxed">
                        One rule decides the copula, then you only swap it to make the sentence negative.
                      </p>

                      <div className="bg-[#FFFDF5] border border-amber-200/80 rounded-xl px-4 py-3.5">
                        <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-dark mb-1">
                          The Rule
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-ink">
                          First person (<span className="font-tibetan text-lg">ང་</span> / <span className="font-tibetan text-lg">ང་ཚོ་</span>):{" "}
                          <span className="font-tibetan text-lg text-brand-dark">ཡིན།</span> / <span className="font-tibetan text-lg text-brand-dark">མིན།</span> · Everyone else:{" "}
                          <span className="font-tibetan text-lg">རེད།</span> / <span className="font-tibetan text-lg">མ་རེད།</span>
                        </div>
                      </div>

                      {/* Side-by-side Affirmative & Negative */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-amber-200/80 bg-[#FFFDF7] rounded-xl overflow-hidden">
                          <div className="px-4 py-2.5 bg-brand-light/50 border-b border-amber-200/70 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark">
                            <span className="size-4 rounded-full bg-brand text-ink flex items-center justify-center text-xs leading-none">+</span>
                            Affirmative
                          </div>
                          <div className="divide-y divide-amber-200/50">
                            {COPULA_ROWS.map((r) => (
                              <div key={`aff-${r.subjectTib}`} className="px-4 py-3 flex items-center justify-between gap-2">
                                <div>
                                  <div className="font-tibetan text-xl text-ink leading-normal">{r.subjectTib}</div>
                                  <div className="text-[11px] text-ink-muted">{r.subjectEn}</div>
                                </div>
                                <span className="text-ink-muted text-xs">→</span>
                                <button
                                  type="button"
                                  onClick={() => playAudio(r.affirmativeTib)}
                                  className="flex items-center gap-2 text-right group cursor-pointer"
                                >
                                  <div>
                                    <div className="font-tibetan text-xl text-brand-dark leading-normal group-hover:underline">
                                      {r.affirmativeTib}
                                    </div>
                                    <div className="text-[11px] font-serif italic text-ink-muted">{r.affirmativePron}</div>
                                  </div>
                                  <Volume2 size={13} className="text-ink-muted shrink-0" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border border-rose-200/80 bg-[#FFF9F8] rounded-xl overflow-hidden">
                          <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-200/70 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-800">
                            <span className="size-4 rounded-full bg-rose-700 text-white flex items-center justify-center text-xs leading-none">−</span>
                            Negative
                          </div>
                          <div className="divide-y divide-rose-200/50">
                            {COPULA_ROWS.map((r) => (
                              <div key={`neg-${r.subjectTib}`} className="px-4 py-3 flex items-center justify-between gap-2">
                                <div>
                                  <div className="font-tibetan text-xl text-ink leading-normal">{r.subjectTib}</div>
                                  <div className="text-[11px] text-ink-muted">{r.subjectEn}</div>
                                </div>
                                <span className="text-ink-muted text-xs">→</span>
                                <button
                                  type="button"
                                  onClick={() => playAudio(r.negativeTib)}
                                  className="flex items-center gap-2 text-right group cursor-pointer"
                                >
                                  <div>
                                    <div className="font-tibetan text-xl text-rose-800 leading-normal group-hover:underline">
                                      {r.negativeTib}
                                    </div>
                                    <div className="text-[11px] font-serif italic text-ink-muted">{r.negativePron}</div>
                                  </div>
                                  <Volume2 size={13} className="text-ink-muted shrink-0" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 4 Example Sentences */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {COPULA_EXAMPLES.map((ex) => (
                          <button
                            key={ex.tib}
                            type="button"
                            onClick={() => playAudio(ex.tib)}
                            className="border border-border-subtle bg-paper/45 hover:border-brand px-4 py-3 rounded-xl text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                          >
                            <div>
                              <div className="font-tibetan text-xl text-ink leading-normal">{ex.tib}</div>
                              <div className="text-xs text-ink-muted">{ex.en}</div>
                            </div>
                            <Volume2 size={14} className="text-ink-muted shrink-0" />
                          </button>
                        ))}
                      </div>

                      <div className="bg-[#FFFDF5] border border-amber-200/80 rounded-xl px-4 py-3 text-xs text-ink flex items-center gap-2.5">
                        <Lightbulb size={15} className="text-brand-dark shrink-0" />
                        <span>
                          The copula always comes last. Subject → complement →{" "}
                          <span className="font-tibetan text-base">ཡིན་</span> / <span className="font-tibetan text-base">རེད་</span>.
                        </span>
                      </div>

                      <QuizModule
                        moduleId={8}
                        variant="editorial"
                        editorialSurface="cream"
                        eyebrow="Checkpoint"
                        title="TO BE — ཡིན་ / རེད་ — mastery check"
                        quizTitle="Mastery Check · Verb To Be"
                        subtitle="Recognition, meaning, romanisation, listening and form choice — mixed."
                        questions={copulaQuiz}
                        playAudio={playAudio}
                        stopAudio={stopAudio}
                        playingItem={playingItem}
                        playErrorBeep={playErrorBeep}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* SECTION 3: CONVERSATION                                       */}
              {/* ============================================================= */}
              {activeSection === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-ink-light leading-relaxed max-w-2xl">
                      You&apos;ve learned every word and grammar pattern in this dialogue — see how much you can read before checking the translations. Tap a bubble once for the romanisation, again for the English. Notice how every sentence ends in{" "}
                      <span className="font-tibetan text-lg text-ink">ཡིན་</span> or{" "}
                      <span className="font-tibetan text-lg text-ink">རེད་</span>.
                    </p>
                    <button
                      type="button"
                      onClick={toggleAllDialogues}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                        showAllDialogues
                          ? "bg-ink text-white border-ink"
                          : "bg-surface text-ink border-border-strong hover:bg-surface-muted"
                      }`}
                    >
                      {showAllDialogues ? <EyeOff size={13} /> : <Eye size={13} />}
                      {showAllDialogues ? "Hide translations" : "Show translations"}
                    </button>
                  </div>

                  <div className="space-y-5">
                    {DIALOGUES.map((thread) => {
                      const mode = dialogueViewMode[thread.id] || "thread";
                      const focusIdx = dialogueFocusIdx[thread.id] || 0;
                      const revealedCount = thread.lines.filter((_, idx) => (bubbleReveal[`${thread.id}-${idx}`] || 0) > 0).length;
                      const allFullyRevealed = thread.lines.every((_, idx) => (bubbleReveal[`${thread.id}-${idx}`] || 0) >= 2);

                      return (
                        <div key={thread.id} className="bg-paper/45 border border-border-subtle rounded-2xl p-5">
                          <div className="flex items-start justify-between gap-3 mb-5">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-brand-dark shrink-0">
                                <MessageCircle size={15} />
                              </div>
                              <div>
                                <h4 className="font-serif text-base font-normal text-ink">{thread.title}</h4>
                                <p className="text-[11px] text-ink-muted">{thread.subtitle}</p>
                              </div>
                            </div>

                            <div className="inline-flex rounded-full border border-border-subtle bg-surface-muted/70 p-0.5 text-[10px] font-bold">
                              <button
                                type="button"
                                onClick={() => setDialogueViewMode((p) => ({ ...p, [thread.id]: "thread" }))}
                                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                                  mode === "thread" ? "bg-surface text-ink shadow-2xs" : "text-ink-muted hover:text-ink"
                                }`}
                              >
                                Thread
                              </button>
                              <button
                                type="button"
                                onClick={() => setDialogueViewMode((p) => ({ ...p, [thread.id]: "focus" }))}
                                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                                  mode === "focus" ? "bg-surface text-ink shadow-2xs" : "text-ink-muted hover:text-ink"
                                }`}
                              >
                                Focus
                              </button>
                            </div>
                          </div>

                          {mode === "thread" ? (
                            <>
                              <div className="space-y-4">
                                {thread.lines.map((line, idx) => {
                                  const key = `${thread.id}-${idx}`;
                                  const level = bubbleReveal[key] || 0;
                                  const isRight = line.side === "right";
                                  const tapCue =
                                    level === 0
                                      ? "Tap to reveal"
                                      : level === 1
                                      ? "Tap again for English"
                                      : "Tap to reset";

                                  return (
                                    <div key={key} className={`flex items-start gap-2.5 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
                                      <div
                                        className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-4 ${
                                          isRight
                                            ? "bg-brand-light text-brand-dark border border-amber-300/70"
                                            : "bg-surface text-ink-light border border-border-subtle"
                                        }`}
                                      >
                                        {line.speakerInitial}
                                      </div>

                                      <div className={`max-w-[82%] flex flex-col ${isRight ? "items-end" : "items-start"}`}>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted mb-1 px-1">
                                          {line.speaker}
                                        </span>

                                        <div className="flex items-center gap-2">
                                          {isRight && (
                                            <button
                                              type="button"
                                              onClick={() => playAudio(line.tib)}
                                              aria-label="Play line"
                                              className="size-7 rounded-lg border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark shrink-0 cursor-pointer"
                                            >
                                              {playingItem === line.tib ? <Loader2 size={12} className="animate-spin text-brand" /> : <Volume2 size={12} />}
                                            </button>
                                          )}

                                          <button
                                            type="button"
                                            onClick={() => cycleBubbleReveal(key)}
                                            className={`text-left rounded-xl px-4 py-3 border transition-all cursor-pointer select-none ${
                                              isRight
                                                ? "bg-[#FFF8DE] border-amber-200/90 hover:border-brand"
                                                : "bg-[#FAF6EC] border-border-subtle hover:border-border-strong"
                                            }`}
                                          >
                                            <div className="font-tibetan text-xl text-ink leading-normal">{line.tib}</div>
                                            {level >= 1 && (
                                              <div className="text-xs font-serif italic text-ink-muted mt-1.5 animate-in fade-in duration-150">
                                                {line.pron}
                                              </div>
                                            )}
                                            {level >= 2 && (
                                              <div className="text-xs font-medium text-ink mt-1 animate-in fade-in duration-150">
                                                {line.en}
                                              </div>
                                            )}
                                            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-muted/90 mt-2">
                                              {tapCue}
                                            </div>
                                          </button>

                                          {!isRight && (
                                            <button
                                              type="button"
                                              onClick={() => playAudio(line.tib)}
                                              aria-label="Play line"
                                              className="size-7 rounded-lg border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark shrink-0 cursor-pointer"
                                            >
                                              {playingItem === line.tib ? <Loader2 size={12} className="animate-spin text-brand" /> : <Volume2 size={12} />}
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="mt-5 pt-3.5 border-t border-border-subtle/70 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] text-ink-muted">
                                  <div className="flex items-center gap-1">
                                    {thread.lines.map((_, i) => {
                                      const isRev = (bubbleReveal[`${thread.id}-${i}`] || 0) > 0;
                                      return (
                                        <span
                                          key={i}
                                          className={`size-1.5 rounded-full ${isRev ? "bg-brand" : "bg-border-strong/50"}`}
                                        />
                                      );
                                    })}
                                  </div>
                                  <span>{revealedCount} / {thread.lines.length} lines revealed</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleThreadReveal(thread.id, thread.lines.length)}
                                  className="text-[10px] font-bold uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full border border-border-subtle bg-surface text-ink-light hover:text-ink hover:border-border-strong transition-colors cursor-pointer"
                                >
                                  {allFullyRevealed ? "Reset all" : "Reveal all"}
                                </button>
                              </div>
                            </>
                          ) : (
                            (() => {
                              const line = thread.lines[focusIdx] || thread.lines[0];
                              const key = `${thread.id}-${focusIdx}`;
                              const isShown = (bubbleReveal[key] || 0) >= 2;
                              const isRight = line.side === "right";

                              return (
                                <div className="bg-surface border border-border-subtle rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs">
                                  {/* Line counter + Circular Stepper Arrows */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                                      Line {focusIdx + 1} of {thread.lines.length}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        aria-label="Previous line"
                                        disabled={focusIdx === 0}
                                        onClick={() => setDialogueFocusIdx((p) => ({ ...p, [thread.id]: Math.max(0, focusIdx - 1) }))}
                                        className="size-8 rounded-full border border-border-subtle bg-surface flex items-center justify-center text-ink hover:border-border-strong disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                      >
                                        <ChevronLeft size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        aria-label="Next line"
                                        disabled={focusIdx === thread.lines.length - 1}
                                        onClick={() => setDialogueFocusIdx((p) => ({ ...p, [thread.id]: Math.min(thread.lines.length - 1, focusIdx + 1) }))}
                                        className="size-8 rounded-full border border-border-subtle bg-surface flex items-center justify-center text-ink hover:border-border-strong disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                      >
                                        <ChevronRight size={14} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Speaker Avatar + Label */}
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                        isRight
                                          ? "bg-brand-light text-brand-dark border border-amber-300/70"
                                          : "bg-surface-muted text-ink-light border border-border-subtle"
                                      }`}
                                    >
                                      {line.speakerInitial}
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                                      {line.speaker}
                                    </span>
                                  </div>

                                  {/* Speech Bubble */}
                                  <button
                                    type="button"
                                    onClick={() => toggleFocusLineReveal(key)}
                                    className={`w-full text-left px-5 py-5 rounded-2xl border transition-all cursor-pointer select-none ${
                                      isRight
                                        ? "bg-[#FFF8DE] border-amber-200/90 hover:border-brand rounded-tr-sm"
                                        : "bg-[#FAF6EC] border-border-subtle hover:border-border-strong rounded-tl-sm"
                                    }`}
                                  >
                                    <div className="font-tibetan text-2xl sm:text-[26px] text-ink leading-normal">
                                      {line.tib}
                                    </div>
                                    {isShown && (
                                      <div className="mt-3 space-y-1 animate-in fade-in duration-150">
                                        <div className="text-sm font-serif italic text-ink-muted">{line.pron}</div>
                                        <div className="text-sm font-medium text-ink">{line.en}</div>
                                      </div>
                                    )}
                                  </button>

                                  {/* Bottom Action Bar: Show/Hide Romanisation & English + Audio */}
                                  <div className="flex items-center justify-between gap-3 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => toggleFocusLineReveal(key)}
                                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-dark hover:text-ink transition-colors cursor-pointer"
                                    >
                                      {isShown ? <EyeOff size={14} /> : <Eye size={14} />}
                                      <span>{isShown ? "Hide romanisation & English" : "Show romanisation & English"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => playAudio(line.tib)}
                                      aria-label="Play line audio"
                                      className="size-8 rounded-lg border border-border-subtle bg-surface flex items-center justify-center text-ink-light hover:text-brand-dark hover:border-brand transition-colors cursor-pointer"
                                    >
                                      {playingItem === line.tib ? <Loader2 size={14} className="animate-spin text-brand" /> : <Volume2 size={14} />}
                                    </button>
                                  </div>
                                </div>
                              );
                            })()
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* SECTION 4: REFERENCE & CULTURE CORNER                         */}
              {/* ============================================================= */}
              {activeSection === 4 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-l-2 border-brand pl-4 text-sm text-ink-light leading-relaxed">
                    These are the instructions your teacher will use every day. Tap a card for its word-by-word breakdown. The Culture Corner explains why one greeting carries so much meaning, and how Tibetan names are chosen.
                  </div>

                  {/* Classroom Commands */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="size-8 rounded-lg bg-brand-light/70 border border-amber-200 flex items-center justify-center text-brand-dark">
                        <BookOpen size={15} />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-normal text-ink leading-tight">Classroom Commands</h3>
                        <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                          7 Phrases · Tap for breakdown
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                      {CLASSROOM_COMMANDS.map((cmd) => {
                        const isOpen = !!expandedCmds[cmd.num];
                        return (
                          <div key={cmd.num} className="flex items-start gap-2.5">
                            <span className="text-[11px] font-serif font-bold text-brand-dark/80 pt-3.5 w-5 shrink-0 select-none">
                              {cmd.num}
                            </span>

                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleCmd(cmd.num)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggleCmd(cmd.num);
                                }
                              }}
                              aria-expanded={isOpen}
                              className={`flex-1 min-w-0 bg-surface border border-border-subtle border-l-2 border-l-amber-300/90 hover:border-border-strong rounded-xl p-4 transition-all cursor-pointer shadow-2xs ${
                                isOpen ? "ring-1 ring-amber-200/70 shadow-sm" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2.5">
                                <span className="font-tibetan text-2xl text-ink leading-normal min-w-0 break-words">
                                  {cmd.tib}
                                </span>
                                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                  <button
                                    type="button"
                                    aria-label={`Play ${cmd.pron}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playAudio(cmd.tib);
                                    }}
                                    className="size-7 rounded-md border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark hover:border-brand cursor-pointer"
                                  >
                                    {playingItem === cmd.tib ? <Loader2 size={12} className="animate-spin text-brand" /> : <Volume2 size={12} />}
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={isOpen ? "Collapse breakdown" : "Unfold breakdown"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCmd(cmd.num);
                                    }}
                                    className="size-7 rounded-md border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-ink hover:border-border-strong cursor-pointer"
                                  >
                                    <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="inline-block bg-brand-light/75 text-brand-dark font-serif italic text-xs px-2 py-0.5 rounded">
                                  {cmd.pron}
                                </span>
                                <div className="text-xs sm:text-[13px] font-medium text-ink">
                                  {cmd.en}
                                </div>
                              </div>

                              {isOpen && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-4 pt-3.5 border-t border-border-subtle/80 animate-in fade-in slide-in-from-top-1 duration-150"
                                >
                                  <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2.5">
                                    Breakdown
                                  </div>
                                  <div className="space-y-2">
                                    {cmd.breakdown.map((b, i) => (
                                      <div
                                        key={i}
                                        className="bg-paper/65 border border-border-subtle/90 rounded-lg px-3 py-2.5 space-y-0.5"
                                      >
                                        <div className="font-tibetan text-xl text-ink leading-normal">
                                          {b.tib}
                                        </div>
                                        <div className="font-serif italic text-xs text-ink-muted">
                                          {b.pron}
                                        </div>
                                        <div className="text-xs font-medium text-ink leading-snug pt-0.5">
                                          {b.gloss}
                                        </div>
                                        {b.pos && (
                                          <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-brand-dark pt-1">
                                            {b.pos}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Checkpoint: Classroom commands check */}
                  <QuizModule
                    moduleId={8}
                    variant="editorial"
                    editorialSurface="cream"
                    eyebrow="Checkpoint"
                    title="Classroom commands check"
                    quizTitle="Mastery Check · Classroom Commands"
                    subtitle="Do you recognise the instructions your teacher uses? Reading, meaning, romanisation and listening — mixed."
                    questions={commandsQuiz}
                    playAudio={playAudio}
                    stopAudio={stopAudio}
                    playingItem={playingItem}
                    playErrorBeep={playErrorBeep}
                  />

                  {/* Culture Corner */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                        <Sparkles size={15} />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-normal text-ink leading-tight">Culture Corner</h3>
                        <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                          2 Notes · Read aloud
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      {CULTURE_NOTES.map((note) => (
                        <div key={note.id} className="border border-border-subtle rounded-xl overflow-hidden bg-surface flex flex-col">
                          <div className="relative h-40 w-full overflow-hidden bg-ink">
                            <img src={note.fallbackImage} alt={note.title} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent p-4 flex flex-col justify-end">
                              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand mb-0.5">
                                {note.badge}
                              </span>
                              <h4 className="font-serif text-lg font-normal text-white leading-snug">
                                {renderTibetanInline(note.title, "text-[1.2em] text-white")}
                              </h4>
                            </div>
                          </div>
                          <div className="p-5 space-y-3 text-xs sm:text-[13px] leading-relaxed text-ink-light flex-1">
                            {note.paragraphs.map((para, i) => (
                              <p key={i}>{renderTibetanInline(para, "text-[1.25em]")}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* SECTION 5: PRACTICE HUB                                       */}
              {/* ============================================================= */}
              {activeSection === 5 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Practice Hub Summary Banner */}
                  <div className="bg-[#FFFDF6] border border-amber-200/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark mb-1">
                        <Sparkles size={12} /> Practice Hub
                      </div>
                      <h3 className="font-serif text-xl font-normal text-ink mb-1">
                        {completedDrillsCount} of 6 drills complete
                      </h3>
                      <p className="text-xs text-ink-light max-w-lg leading-relaxed">
                        Work down the stages. Each drill is scored the moment you finish it — retry any of them as often as you like before the unit test.
                      </p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-amber-200/60">
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted">Accuracy</div>
                        <div className="font-serif text-2xl text-ink">{overallAccuracy}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted">Answered</div>
                        <div className="font-serif text-2xl text-ink">
                          {totalCorrect}/{totalAnswered || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5 Underline Practice Tabs */}
                  <div className="border-b border-border-subtle flex items-center gap-1 overflow-x-auto custom-scrollbar">
                    {[
                      { key: "grammar", num: "1", label: "Grammar drills" },
                      { key: "pronouns", num: "2", label: "Pronouns & register" },
                      { key: "conversation", num: "3", label: "Conversation response" },
                      { key: "recall", num: "4", label: "Free recall" },
                      { key: "listening", num: "5", label: "Listening lab", icon: Headphones },
                    ].map((t) => {
                      const active = activePracticeTab === t.key;
                      const IconComp = t.icon;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setActivePracticeTab(t.key as PracticeTabKey)}
                          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                            active
                              ? "border-ink text-ink font-bold"
                              : "border-transparent text-ink-muted hover:text-ink"
                          }`}
                        >
                          {IconComp && <IconComp size={12} />}
                          <span className="text-[10px] font-bold opacity-70">{t.num}</span>
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab 1: Grammar drills (Copula positive + Copula negative) */}
                  {activePracticeTab === "grammar" && (
                    <div className="space-y-5">
                      <p className="text-xs text-ink-muted">
                        Lock in the copula system before you build sentences.
                      </p>

                      <QuizModule
                        moduleId={8}
                        variant="editorial"
                        editorialSurface="white"
                        title="Copula: positive"
                        quizTitle="Practice Drill · Copula Positive"
                        subtitle="Choose ཡིན་ or རེད་ by person."
                        statusBadge={
                          drillResults.copulaPositive
                            ? `${drillResults.copulaPositive.score}/${drillResults.copulaPositive.total}`
                            : "Not started"
                        }
                        questions={practiceDrills.copulaPositive}
                        playAudio={playAudio}
                        stopAudio={stopAudio}
                        playingItem={playingItem}
                        playErrorBeep={playErrorBeep}
                        onComplete={(sc, tot) => recordDrillResult("copulaPositive", sc, tot)}
                      />

                      <QuizModule
                        moduleId={8}
                        variant="editorial"
                        editorialSurface="white"
                        title="Copula: negative"
                        quizTitle="Practice Drill · Copula Negative"
                        subtitle="Negate a sentence correctly."
                        statusBadge={
                          drillResults.copulaNegative
                            ? `${drillResults.copulaNegative.score}/${drillResults.copulaNegative.total}`
                            : "Not started"
                        }
                        questions={practiceDrills.copulaNegative}
                        playAudio={playAudio}
                        stopAudio={stopAudio}
                        playingItem={playingItem}
                        playErrorBeep={playErrorBeep}
                        onComplete={(sc, tot) => recordDrillResult("copulaNegative", sc, tot)}
                      />
                    </div>
                  )}

                  {/* Tab 2: Pronouns & register */}
                  {activePracticeTab === "pronouns" && (
                    <QuizModule
                      moduleId={8}
                      variant="editorial"
                      editorialSurface="white"
                      title="Pronouns & polite register"
                      quizTitle="Practice Drill · Pronouns & Register"
                      subtitle="Choose the natural pronoun and polite particle for each situation."
                      statusBadge={
                        drillResults.pronouns
                          ? `${drillResults.pronouns.score}/${drillResults.pronouns.total}`
                          : "Not started"
                      }
                      questions={practiceDrills.pronouns}
                      playAudio={playAudio}
                      stopAudio={stopAudio}
                      playingItem={playingItem}
                      playErrorBeep={playErrorBeep}
                      onComplete={(sc, tot) => recordDrillResult("pronouns", sc, tot)}
                    />
                  )}

                  {/* Tab 3: Conversation response */}
                  {activePracticeTab === "conversation" && (
                    <QuizModule
                      moduleId={8}
                      variant="editorial"
                      editorialSurface="white"
                      title="Conversation response"
                      quizTitle="Practice Drill · Conversation Response"
                      subtitle="Pick the most natural classroom reply."
                      statusBadge={
                        drillResults.conversation
                          ? `${drillResults.conversation.score}/${drillResults.conversation.total}`
                          : "Not started"
                      }
                      questions={practiceDrills.conversation}
                      playAudio={playAudio}
                      stopAudio={stopAudio}
                      playingItem={playingItem}
                      playErrorBeep={playErrorBeep}
                      onComplete={(sc, tot) => recordDrillResult("conversation", sc, tot)}
                    />
                  )}

                  {/* Tab 4: Free recall (Flashcards, Match Game, SRS) */}
                  {activePracticeTab === "recall" && (
                    <PracticeSuite
                      groups={practiceGroups}
                      playAudio={playAudio}
                      playingItem={playingItem}
                      playErrorBeep={playErrorBeep}
                    />
                  )}

                  {/* Tab 5: Listening lab */}
                  {activePracticeTab === "listening" && (
                    <QuizModule
                      moduleId={8}
                      variant="editorial"
                      editorialSurface="white"
                      title="Listening lab"
                      quizTitle="Practice Drill · Listening Lab"
                      subtitle="Hear or read the prompt and match the Tibetan script."
                      statusBadge={
                        drillResults.listening
                          ? `${drillResults.listening.score}/${drillResults.listening.total}`
                          : "Not started"
                      }
                      questions={practiceDrills.listening}
                      playAudio={playAudio}
                      stopAudio={stopAudio}
                      playingItem={playingItem}
                      playErrorBeep={playErrorBeep}
                      onComplete={(sc, tot) => recordDrillResult("listening", sc, tot)}
                    />
                  )}
                </div>
              )}

              {/* ============================================================= */}
              {/* SECTION 6: REVIEW                                             */}
              {/* ============================================================= */}
              {activeSection === 6 && (
                <div className="grid md:grid-cols-2 gap-5 animate-in fade-in duration-300">
                  <div className="bg-surface border border-border-subtle rounded-xl p-5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-4">
                      Can-do checklist
                    </div>
                    <div className="space-y-2.5">
                      {CAN_DO_CHECKLIST.map((item, idx) => {
                        const checked = !!checkedItems[idx];
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCheckedItems((p) => ({ ...p, [idx]: !p[idx] }))}
                            className="w-full flex items-start gap-3 text-left py-1.5 px-2 rounded-lg hover:bg-paper/60 transition-colors cursor-pointer"
                          >
                            <span
                              className={`mt-0.5 size-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                                checked
                                  ? "bg-emerald-600 text-white"
                                  : "text-emerald-600 border border-emerald-300 bg-emerald-50/50"
                              }`}
                            >
                              <Check size={11} strokeWidth={3} />
                            </span>
                            <span className={`text-xs sm:text-[13px] leading-relaxed ${checked ? "text-ink font-medium" : "text-ink-light"}`}>
                              {renderTibetanInline(item, "text-[1.3em]")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#FFF9F2] border border-amber-200/80 rounded-xl p-5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800 mb-4">
                      <Mic size={13} /> Say it out loud
                    </div>
                    <div className="space-y-3.5">
                      {SPEAKING_PROMPTS.map((prompt, idx) => (
                        <div
                          key={idx}
                          className="border-l-2 border-amber-400/90 pl-3.5 py-0.5 text-xs sm:text-[13px] leading-relaxed text-ink"
                        >
                          {renderTibetanInline(prompt, "text-[1.3em]")}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* SECTION 7: FINAL TEST                                         */}
              {/* ============================================================= */}
              {activeSection === 7 && (
                <div className="animate-in fade-in duration-300">
                  <QuizModule
                    moduleId={8}
                    variant="editorial"
                    editorialSurface="white"
                    title="Final Test"
                    intro="40 questions drawn from everything you covered in this lesson. Score 80% or higher to pass. You can retake the test as many times as you like — your best score is saved."
                    questions={finalQuiz}
                    playAudio={playAudio}
                    stopAudio={stopAudio}
                    playingItem={playingItem}
                    playErrorBeep={playErrorBeep}
                    isUnlockTest={true}
                    nextLessonPath="/dashboard?hub=beginner2"
                    onPass={() => markComplete(7)}
                    hideHeader={true}
                  />
                </div>
              )}
            </div>

            {/* Central Card Footer: Previous | 8 Dots | Continue */}
            <div className="px-6 py-4 border-t border-border-subtle bg-surface flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={activeSection === 0}
                onClick={() => goToSection(activeSection - 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border-subtle bg-surface text-xs font-bold text-ink-light hover:text-ink hover:border-border-strong disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                {WEB_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Jump to ${s.navTitle}`}
                    onClick={() => goToSection(idx)}
                    className={`size-2 rounded-full transition-all cursor-pointer ${
                      idx === activeSection
                        ? "bg-brand scale-125"
                        : completed.has(idx)
                        ? "bg-emerald-500"
                        : "bg-border-strong/50 hover:bg-border-strong"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleContinueSection}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              >
                {activeSection === WEB_STEPS.length - 1 ? "Complete step" : "Continue"}
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Tibetan Proverb Banner Below Central Card */}
          <div className="bg-[#FAF5E8] border border-amber-200/70 rounded-xl px-5 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
            <span className="text-brand-dark text-xs select-none">✿</span>
            <span className="font-tibetan text-lg text-ink leading-normal">{section.proverbTib}</span>
            <span className="text-border-strong select-none">|</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
              {section.proverbEn}
            </span>
            <span className="text-brand-dark text-xs select-none">✿</span>
          </div>
        </section>

        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 3: NARROW RIGHT CONTEXT RAIL                                 */}
        {/* ------------------------------------------------------------------- */}
        <aside className="lg:sticky lg:top-4 space-y-4">
          {/* Card 1: New words */}
          <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-ink">
                <Sparkles size={13} className="text-emerald-700" />
                <span>New words</span>
              </div>
              <button
                type="button"
                onClick={() => goToSection(0)}
                className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-border-subtle/70">
              {rightRailItems.map((item) => (
                <button
                  key={item.tib}
                  type="button"
                  onClick={() => playAudio(item.tib)}
                  className="w-full py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-2 text-left group cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="font-tibetan text-lg text-ink leading-normal group-hover:text-brand-dark transition-colors truncate">
                      {item.tib}
                    </div>
                    <div className="text-[11px] font-serif italic text-ink-muted leading-tight">
                      {item.pron}
                    </div>
                    <div className="text-[11px] text-ink-light leading-snug line-clamp-2">
                      {item.en}
                    </div>
                  </div>
                  <span className="text-ink-muted group-hover:text-brand-dark shrink-0">
                    {playingItem === item.tib ? <Loader2 size={13} className="animate-spin text-brand" /> : <Volume2 size={13} />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Grammar tip */}
          <div className="bg-[#FFFDF4] border border-amber-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark mb-1.5">
              <Lightbulb size={12} /> Grammar Tip
            </div>
            <div className="font-serif text-base text-ink mb-1.5">Personal pronouns</div>
            <p className="text-xs text-ink-light leading-relaxed mb-3">
              Rule of thumb for a beginner: <span className="font-tibetan text-base text-ink">ང་</span> for me,{" "}
              <span className="font-tibetan text-base text-ink">ཁྱེད་རང་</span> for you,{" "}
              <span className="font-tibetan text-base text-ink">ཁོང་</span> for anyone you respect.
            </p>
            <button
              type="button"
              onClick={() => goToSection(2)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-dark hover:underline cursor-pointer"
            >
              Practice grammar <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 3: Progress */}
          <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-ink">
                <BookOpen size={13} className="text-emerald-700" />
                <span>Progress</span>
              </div>
              <span className="text-xs font-bold text-emerald-700">{progressPercent}%</span>
            </div>

            <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${Math.max(progressPercent, 0)}%` }}
              />
            </div>

            <div className="text-[11px] text-ink-muted">
              {completedCount} of {WEB_STEPS.length} sections completed
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
