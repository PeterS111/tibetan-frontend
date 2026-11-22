// app/components/lesson/9/WebLesson9.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
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
  TEENS_CARDS,
  TENS_PARTICLES,
  WEEKDAYS_CYCLE,
  CLOCK_EXAMPLES,
  DIALOGUES,
  CULTURE_NOTES,
  TIBETAN_DIGITS,
  ROUND_NUMBERS,
  TIME_DAY_REF,
  CAN_DO_CHECKLIST,
  SPEAKING_PROMPTS,
  WEB_STEPS,
  generateVocabQuiz,
  generatePhrasesQuiz,
  generateNumbersQuiz,
  generateDaysQuiz,
  generateTimeQuiz,
  generatePracticeDrills,
  generateFinalQuiz,
} from "@/app/data/lesson9";

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

type PracticeTabKey = "grammar" | "conversation" | "recall" | "listening";

export function WebLesson9() {
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

  const [coverVocabEn, setCoverVocabEn] = useState(false);
  const [coverPhrasesEn, setCoverPhrasesEn] = useState(false);
  const [expandedPhrases, setExpandedPhrases] = useState<Record<string, boolean>>({});
  const [showAllDialogues, setShowAllDialogues] = useState(false);
  const [bubbleReveal, setBubbleReveal] = useState<Record<string, number>>({});
  const [dialogueViewMode, setDialogueViewMode] = useState<Record<string, "thread" | "focus">>({});
  const [dialogueFocusIdx, setDialogueFocusIdx] = useState<Record<string, number>>({});
  const [activePracticeTab, setActivePracticeTab] = useState<PracticeTabKey>("grammar");
  const [drillResults, setDrillResults] = useState<Record<string, { score: number; total: number }>>({});
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const vocabQuiz = useMemo(() => generateVocabQuiz(), []);
  const phrasesQuiz = useMemo(() => generatePhrasesQuiz(), []);
  const numbersQuiz = useMemo(() => generateNumbersQuiz(), []);
  const daysQuiz = useMemo(() => generateDaysQuiz(), []);
  const timeQuiz = useMemo(() => generateTimeQuiz(), []);
  const practiceDrills = useMemo(() => generatePracticeDrills(), []);
  const finalQuiz = useMemo(() => generateFinalQuiz(), []);

  const practiceGroups = useMemo(
    () => [
      {
        name: "Vocabulary",
        items: VOCAB.map((v) => ({
          id: `b2-l2-v-${v.tib}`,
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
          id: `b2-l2-p-${p.id}`,
          tibetan: p.tib,
          reading: p.pron,
          english: p.en,
          audioTarget: p.tib,
        })),
      },
      {
        name: "Round Numbers",
        items: ROUND_NUMBERS.map((r) => ({
          id: `b2-l2-r-${r.arabic}`,
          tibetan: r.tib,
          reading: r.pron,
          english: r.arabic,
          audioTarget: r.tib,
        })),
      },
    ],
    []
  );

  const upcomingLessonsStrip = useMemo(() => BEGINNER_2_UPCOMING.filter((u) => !u.isCapstone), []);
  const section = WEB_STEPS[activeSection] || WEB_STEPS[0];
  const completedCount = Math.min(completed.size, WEB_STEPS.length);

  const recordDrillResult = (key: string, score: number, total: number) => {
    setDrillResults((prev) => ({ ...prev, [key]: { score, total } }));
  };
  const completedDrillsCount = Object.keys(drillResults).length;
  const totalAnswered = Object.values(drillResults).reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = Object.values(drillResults).reduce((sum, r) => sum + r.score, 0);
  const overallAccuracy = totalAnswered > 0 ? `${Math.round((totalCorrect / totalAnswered) * 100)}%` : "—";

  const rightRailItems = useMemo(() => {
    if (activeSection === 1) {
      return USEFUL_PHRASES.slice(0, 5).map((p) => ({ tib: p.tib, pron: p.pron, en: p.en }));
    }
    return VOCAB.slice(0, 5).map((v) => ({ tib: v.tib, pron: v.pron, en: v.en }));
  }, [activeSection]);

  const goToSection = (idx: number) => {
    stopAudio();
    const clamped = Math.max(0, Math.min(idx, WEB_STEPS.length - 1));
    setActiveSection(clamped);
    setTimeout(() => centerTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleContinueSection = () => {
    markComplete(activeSection);
    if (activeSection < WEB_STEPS.length - 1) goToSection(activeSection + 1);
  };

  const togglePhrase = (id: string) => setExpandedPhrases((p) => ({ ...p, [id]: !p[id] }));
  const cycleBubbleReveal = (key: string) => setBubbleReveal((p) => ({ ...p, [key]: ((p[key] || 0) + 1) % 3 }));
  const toggleFocusLineReveal = (key: string) => setBubbleReveal((p) => ({ ...p, [key]: (p[key] || 0) >= 2 ? 0 : 2 }));

  const toggleAllDialogues = () => {
    const nextShow = !showAllDialogues;
    setShowAllDialogues(nextShow);
    setBubbleReveal((prev) => {
      const next = { ...prev };
      DIALOGUES.forEach((t) => t.lines.forEach((_, i) => { next[`${t.id}-${i}`] = nextShow ? 2 : 0; }));
      return next;
    });
  };

  const toggleThreadReveal = (threadId: string, lineCount: number) => {
    setBubbleReveal((prev) => {
      const allFull = Array.from({ length: lineCount }, (_, i) => (prev[`${threadId}-${i}`] || 0) >= 2).every(Boolean);
      const next = { ...prev };
      for (let i = 0; i < lineCount; i++) next[`${threadId}-${i}`] = allFull ? 0 : 2;
      return next;
    });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-16 text-ink">
      {/* TOP BAR */}
      <div className="mb-5 space-y-3">
        <div>
          <Link href="/dashboard?hub=beginner2" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft size={13} /> Back to Lessons
          </Link>
        </div>

        <div className="bg-surface border border-border-subtle rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mr-1.5">Active Lesson:</span>

          <Link href="/dashboard/lessons/8" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50/50 text-emerald-800 border border-emerald-200 hover:border-emerald-400 transition-colors">
            <Check size={11} strokeWidth={3} className="text-emerald-700" />
            Welcome to the Class
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E9F3FA] text-ink border border-[#0B77C5]/70">
            <BookOpen size={12} className="text-[#0B77C5]" />
            Numbers, Time &amp; Days
          </span>

          {upcomingLessonsStrip.map((u) => (
            <span key={u.unitNumber} title="Coming soon" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-paper/70 text-ink-muted border border-border-subtle/80 select-none">
              <BookOpen size={11} className="opacity-60" /> {u.title}
            </span>
          ))}
        </div>
      </div>

      {/* THREE-COLUMN BEGINNER 2 WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-[215px_minmax(0,1fr)_235px] xl:grid-cols-[235px_minmax(0,1fr)_255px] gap-5 items-start">
        {/* LEFT COLUMN */}
        <aside className="lg:sticky lg:top-4 bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-xs">
          <div className="relative h-24 w-full overflow-hidden bg-ink">
            <img src="/06_suffixes_post_suffixes.jpg" alt="Numbers, Time & Days" className="w-full h-full object-cover object-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-3.5 flex flex-col justify-end">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">Unit 02</span>
              <div className="text-sm font-bold text-white leading-tight">Numbers, Time &amp; Days</div>
            </div>
          </div>

          <div className="px-4 pt-3.5 pb-3 border-b border-border-subtle/80">
            <div className="font-tibetan text-lg text-ink leading-normal pb-1">ཨང་གྲངས། ཆུ་ཚོད། གཟའ་འཁོར།</div>
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted">
              <span>Beginner 2</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Clock size={10} /> {WEB_STEPS.length} sections</span>
            </div>
          </div>

          <nav className="p-2 space-y-1">
            {WEB_STEPS.map((s, idx) => {
              const isActive = idx === activeSection;
              const isDone = completed.has(idx);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSection(idx)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${isActive ? "bg-[#E9F3FA] text-ink" : "hover:bg-surface-muted/60 text-ink-light"}`}
                >
                  <span className={`size-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${isActive ? "bg-[#0B77C5] text-white" : isDone ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-surface-muted text-ink-muted"}`}>
                    {isDone && !isActive ? <Check size={12} strokeWidth={3} /> : idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs leading-tight truncate ${isActive ? "font-bold text-ink" : "font-medium text-ink"}`}>{s.navTitle}</div>
                    <div className="font-tibetan text-[13px] text-ink-muted leading-normal truncate">{s.tibetanTitle}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* CENTRAL WIDE COLUMN */}
        <section ref={centerTopRef} className="min-w-0 space-y-4 scroll-mt-4">
          <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-xs">
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-ink text-white">
              <img src={section.bannerImage} alt={section.title} className="absolute inset-0 w-full h-full object-cover object-center opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B223C]/95 via-[#0E2C4D]/85 to-[#0E2C4D]/65" />
              <div className="relative z-10 px-6 py-7 md:px-8 md:py-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/90 mb-2">{section.heroEyebrow}</div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-normal text-white leading-tight mb-2">{section.title}</h1>
                <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed mb-5">{renderTibetanInline(section.description, "text-[1.25em] text-white")}</p>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">
                  <span className="inline-flex items-center gap-1.5"><BookOpen size={12} className="text-white/60" /> Beginner 2</span>
                  <span className="inline-flex items-center gap-1.5"><Clock size={12} className="text-white/60" /> Section {activeSection + 1}</span>
                  <div className="flex items-center gap-2.5">
                    <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${Math.round(((activeSection + 1) / WEB_STEPS.length) * 100)}%` }} />
                    </div>
                    <span>{activeSection + 1} / {WEB_STEPS.length} sections</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Body */}
            <div className="p-5 sm:p-7 md:p-8">
              {/* SECTION 0: VOCABULARY */}
              {activeSection === 0 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <p className="text-sm text-ink-light leading-relaxed">Tap any card to hear the reading. Learn 0–10 first — almost every other number in Tibetan is built from them.</p>
                    <button type="button" onClick={() => setCoverVocabEn((v) => !v)} className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${coverVocabEn ? "bg-ink text-white border-ink" : "bg-surface text-ink border-border-strong hover:bg-surface-muted"}`}>
                      {coverVocabEn ? <Eye size={13} /> : <EyeOff size={13} />} {coverVocabEn ? "Show translation" : "Cover translation"}
                    </button>
                  </div>

                  <div className="space-y-7">
                    {VOCAB_CATEGORIES.map((cat) => {
                      const items = VOCAB.filter((v) => v.category === cat.id);
                      return (
                        <div key={cat.id}>
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-dark mb-3">{cat.label}</div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                            {items.map((v) => (
                              <button key={v.tib} type="button" onClick={() => playAudio(v.tib)} className="group bg-surface border border-border-subtle hover:border-brand rounded-xl p-3.5 text-left flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer min-h-[144px]">
                                <div>
                                  <div className="text-2xl mb-2">{v.emoji}</div>
                                  <div className="font-tibetan text-2xl text-ink leading-normal pb-0.5">{v.tib}</div>
                                  <div className="text-[11px] font-serif italic text-ink-muted">{v.pron}</div>
                                </div>
                                <div className="mt-3 pt-2.5 border-t border-border-subtle/70 flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-ink leading-tight">
                                    {coverVocabEn ? <span className="inline-block bg-surface-muted text-ink-muted text-[9px] uppercase tracking-wider px-2 py-0.5 rounded select-none">Hidden</span> : v.en}
                                  </span>
                                  <span className="size-6 rounded-md bg-brand-light/70 text-brand-dark flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-ink transition-colors">
                                    {playingItem === v.tib ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <QuizModule moduleId={9} variant="editorial" editorialSurface="cream" eyebrow="Checkpoint" title="Vocabulary check" quizTitle="Mastery Check · Vocabulary" subtitle="Reading, meaning, romanisation and listening — mixed." questions={vocabQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
                </div>
              )}

              {/* SECTION 1: USEFUL PHRASES */}
              {activeSection === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <p className="text-sm text-ink-light leading-relaxed">
                      Notice that all three questions end in <span className="font-tibetan text-xl text-ink">རེད།</span>: Tibetan asks &lsquo;what is...&rsquo; with a question word plus the same copula you already know.
                    </p>
                    <button type="button" onClick={() => setCoverPhrasesEn((v) => !v)} className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${coverPhrasesEn ? "bg-ink text-white border-ink" : "bg-surface text-ink border-border-strong hover:bg-surface-muted"}`}>
                      {coverPhrasesEn ? <Eye size={13} /> : <EyeOff size={13} />} {coverPhrasesEn ? "Show translation" : "Cover translation"}
                    </button>
                  </div>

                  <div>
                    <div className="border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle/80 bg-surface">
                      {USEFUL_PHRASES.map((p) => {
                        const isOpen = !!expandedPhrases[p.id];
                        return (
                          <div key={p.id} className="transition-colors hover:bg-paper/40">
                            <div className="px-4 py-3.5 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1.2fr_auto] items-center gap-2.5 md:gap-4">
                              <button type="button" onClick={() => togglePhrase(p.id)} className="text-left font-tibetan text-[21px] text-ink leading-normal hover:text-brand-dark transition-colors cursor-pointer">{p.tib}</button>
                              <span className="text-xs font-serif italic text-ink-muted">{p.pron}</span>
                              <div className="text-xs sm:text-[13px] font-medium text-ink">
                                {coverPhrasesEn ? <span className="inline-block bg-surface-muted text-ink-muted text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded select-none">Hidden</span> : p.en}
                              </div>
                              <div className="flex items-center gap-1.5 justify-end">
                                <button type="button" onClick={() => playAudio(p.tib)} className="size-7 rounded-md border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark hover:border-brand cursor-pointer">
                                  {playingItem === p.tib ? <Loader2 size={13} className="animate-spin text-brand" /> : <Volume2 size={13} />}
                                </button>
                                <button type="button" onClick={() => togglePhrase(p.id)} className="size-7 rounded-md border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer">
                                  <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                </button>
                              </div>
                            </div>
                            {isOpen && (
                              <div className="px-4 pb-4 pt-2.5 bg-paper/60 border-t border-border-subtle/70 animate-in fade-in duration-150">
                                <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2">Breakdown</div>
                                <div className="flex flex-wrap gap-2">
                                  {p.breakdown.map((b, i) => (
                                    <div key={i} className="bg-surface border border-border-subtle rounded-lg px-3 py-2 space-y-0.5 min-w-[115px]">
                                      <div className="font-tibetan text-lg text-ink leading-normal">{b.tib}</div>
                                      <div className="font-serif italic text-[11px] text-ink-muted">{b.pron}</div>
                                      <div className="text-xs font-medium text-ink">{b.gloss}</div>
                                      {b.pos && <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-dark pt-0.5">{b.pos}</div>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted">Tap a phrase for its word-by-word breakdown</div>
                  </div>

                  {/* Word Note: ག་ཚོད་ vs ག་རེ་ */}
                  <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/45 p-5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800 mb-2.5">
                      <Info size={14} /> Word: <span className="font-tibetan text-lg normal-case leading-none">ག་ཚོད་</span> vs <span className="font-tibetan text-lg normal-case leading-none">ག་རེ་</span>
                    </div>
                    <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed text-ink-light">
                      <p><span className="font-tibetan text-lg text-ink">ག་ཚོད་</span> (<em>ga-tsö</em>) asks &lsquo;how much / how many&rsquo; — use it for prices, quantities, clock time.</p>
                      <p><span className="font-tibetan text-lg text-ink">ག་རེ་</span> (<em>gare</em>) asks &lsquo;what&rsquo; for things and names — use it for phone numbers, the day of the week, or for <span className="font-tibetan text-lg text-ink">འདི་ག་རེ་རེད།</span> (&lsquo;What is this?&rsquo;).</p>
                      <p className="text-ink">Both keep the same word order as a statement; only the question word changes place with the answer.</p>
                    </div>
                  </div>

                  <QuizModule moduleId={9} variant="editorial" editorialSurface="cream" eyebrow="Checkpoint" title="Phrases check" quizTitle="Mastery Check · Useful Phrases" subtitle="Match each phrase to its use, produce it in Tibetan, and recognise it by ear." questions={phrasesQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
                </div>
              )}

              {/* SECTION 2: GRAMMAR */}
              {activeSection === 2 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* PART A: NUMBER PATTERNS */}
                  <div className="space-y-6">
                    <div className="grid lg:grid-cols-[0.85fr_1.4fr] gap-6 items-start">
                      <div className="space-y-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">Part A · Number Patterns</div>
                        <h3 className="font-serif text-2xl font-normal text-ink leading-snug">Constructing numbers 11–19</h3>
                        <p className="text-sm text-ink-light leading-relaxed">
                          Tibetan numbers from 11 to 19 combine <span className="font-tibetan text-xl text-ink">བཅུ་</span> (ten) with the single digit. The &lsquo;ten&rsquo; part sometimes shifts its vowel in speech.
                        </p>
                        <div className="space-y-2.5 text-xs text-ink-light pt-1">
                          <div className="flex items-start gap-2"><Check size={14} className="text-emerald-600 shrink-0 mt-0.5" /><span>Above 20, every set of ten has its own linking particle — learn the particle, not each number.</span></div>
                          <div className="flex items-start gap-2"><Check size={14} className="text-emerald-600 shrink-0 mt-0.5" /><span>100 is <span className="font-tibetan text-base text-ink">བརྒྱ་</span> (gya) and 1000 is <span className="font-tibetan text-base text-ink">སྟོང་གཅིག</span> (tong-chik).</span></div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2.5">Ten plus a digit</div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {TEENS_CARDS.map((c) => (
                              <button
                                key={c.num}
                                type="button"
                                onClick={() => playAudio(c.tib)}
                                className={`bg-surface border rounded-xl p-3 text-left transition-all hover:shadow-xs cursor-pointer ${c.vowelShift ? "border-rose-200 border-l-2 border-l-rose-500" : "border-border-subtle border-l-2 border-l-amber-400"}`}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <span className="font-tibetan text-xl text-ink leading-normal">{c.tib}</span>
                                  <span className="text-[11px] font-bold text-brand-dark">{c.num}</span>
                                </div>
                                <div className="text-[11px] font-serif italic text-brand-dark mb-1.5">{c.pron}</div>
                                <div className="text-[11px] text-ink-muted">{renderTibetanInline(c.formula, "text-[1.25em]")}</div>
                                {c.vowelShift && <div className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-rose-600">Vowel Shift</div>}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#FAF6EC]/70 border border-amber-200/70 rounded-xl p-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2.5">Tens and linking particles</div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {TENS_PARTICLES.map((t) => (
                              <button key={t.num} type="button" onClick={() => playAudio(t.tenTib)} className="bg-surface border border-border-subtle hover:border-brand rounded-lg p-2.5 text-left transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-ink">{t.num}</span>
                                  <span className="font-tibetan text-base text-brand-dark">{t.particle}</span>
                                </div>
                                <div className="font-tibetan text-base text-ink leading-normal">{t.tenTib}</div>
                                <div className="font-tibetan text-xs text-ink-muted leading-normal mt-0.5">{t.exampleTib}</div>
                                <div className="text-[10px] text-ink-muted">{t.exampleNum}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#FFFDF5] border border-amber-200/80 rounded-xl px-4 py-3 text-xs text-ink flex items-center gap-2.5">
                          <Lightbulb size={15} className="text-brand-dark shrink-0" />
                          <span>Say the ten, add the particle, then the digit: <span className="font-tibetan text-base">ལྔ་བཅུ་ + ང་ + བདུན་</span> = 57.</span>
                        </div>

                        <QuizModule moduleId={9} variant="editorial" editorialSurface="cream" eyebrow="Checkpoint" title="Constructing numbers 11–19 — mastery check" quizTitle="Mastery Check · Numbers 11-99" subtitle="Recognition, meaning, romanisation, listening and form choice — mixed." questions={numbersQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
                      </div>
                    </div>
                  </div>

                  {/* PART B: DAYS OF THE WEEK */}
                  <div className="bg-[#FAF6EC]/70 border border-amber-200/70 rounded-2xl p-6 space-y-5">
                    <div className="text-center max-w-2xl mx-auto">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted mb-1">Part B · The Seven-Day Cycle</div>
                      <h3 className="font-serif text-2xl font-normal text-ink mb-2">Days of the week</h3>
                      <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                        Days are built uniformly with the prefix <span className="font-tibetan text-lg text-ink">གཟའ་</span> (za), meaning &lsquo;planet&rsquo; or &lsquo;celestial body&rsquo;, followed by the planet&apos;s name.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                      {WEEKDAYS_CYCLE.map((d) => (
                        <button key={d.num} type="button" onClick={() => playAudio(d.tib)} className="bg-surface border border-border-subtle hover:border-brand rounded-xl p-3 flex flex-col items-center text-center transition-all hover:shadow-xs cursor-pointer">
                          <span className={`size-8 rounded-full flex items-center justify-center text-[11px] font-bold mb-2 ${d.tone === "emerald" ? "bg-[#1F5328] text-white" : "bg-brand text-ink"}`}>{d.num}</span>
                          <span className="font-tibetan text-lg text-ink leading-normal">{d.tib}</span>
                          <span className="text-[11px] font-serif italic text-ink-muted mt-0.5">{d.pron}</span>
                          <span className="text-[10px] text-ink-light mt-1 leading-tight">{d.en} · {d.planet}</span>
                        </button>
                      ))}
                    </div>

                    <div className="bg-surface border border-border-subtle rounded-xl px-4 py-2.5 text-center text-xs text-ink-light">
                      To say what day it is: <span className="font-tibetan text-base text-ink">དེ་རིང་ + གཟའ་</span>[day] + <span className="font-tibetan text-base text-ink">རེད།</span> — <span className="font-tibetan text-base text-ink">དེ་རིང་གཟའ་ལྷག་པ་རེད།</span> (Today is Wednesday).
                    </div>

                    <QuizModule moduleId={9} variant="editorial" editorialSurface="cream" eyebrow="Checkpoint" title="Days of the week — mastery check" quizTitle="Mastery Check · Days of the Week" subtitle="Recognition, meaning, romanisation, listening and form choice — mixed." questions={daysQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
                  </div>

                  {/* PART C: CLOCK TIME */}
                  <div className="space-y-5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">Part C · Clock Time</div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="bg-surface border border-border-subtle rounded-xl p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="size-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center shrink-0 mt-0.5"><Clock size={15} /></div>
                          <div>
                            <h3 className="font-serif text-xl font-normal text-ink">Telling the time</h3>
                            <p className="text-xs text-ink-light mt-0.5">Clock time uses one fixed formula that always ends with the linking verb <span className="font-tibetan text-base text-ink">རེད།</span></p>
                          </div>
                        </div>

                        <div className="divide-y divide-border-subtle/70">
                          {CLOCK_EXAMPLES.map((ex) => (
                            <button key={ex.label} type="button" onClick={() => playAudio(ex.tib)} className="w-full py-2.5 flex items-center justify-between text-left group cursor-pointer">
                              <div>
                                <div className="text-[11px] font-bold text-ink">{ex.label}</div>
                                <div className="font-tibetan text-xl text-ink leading-normal group-hover:text-brand-dark">{ex.tib}</div>
                                <div className="text-[11px] font-serif italic text-ink-muted">{ex.pron}</div>
                              </div>
                              <Volume2 size={14} className="text-ink-muted group-hover:text-brand-dark shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#1F5328] text-white rounded-xl p-6 flex flex-col justify-between space-y-5">
                        <div className="space-y-4">
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">The Formula</div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                            <span className="font-tibetan text-lg bg-white/10 border border-white/20 px-2.5 py-1 rounded">ཆུ་ཚོད་</span>
                            <span>+</span>
                            <span className="bg-white/10 border border-white/20 px-2.5 py-1 rounded">[number]</span>
                            <span>+</span>
                            <span className="font-tibetan text-lg bg-white/10 border border-white/20 px-2.5 py-1 rounded">པ / བ</span>
                            <span>+</span>
                            <span className="font-tibetan text-lg bg-white/10 border border-white/20 px-2.5 py-1 rounded">རེད།</span>
                          </div>

                          <div className="space-y-2.5 text-xs text-white/90 pt-1">
                            <div className="flex items-start gap-2"><Check size={14} className="text-brand shrink-0 mt-0.5" /><span><span className="font-tibetan text-base">ཆུ་ཚོད་ + གསུམ་ + པ་ + རེད། = ཆུ་ཚོད་གསུམ་པ་རེད།</span> (It is 3 o&apos;clock.)</span></div>
                            <div className="flex items-start gap-2"><Check size={14} className="text-brand shrink-0 mt-0.5" /><span>To say &lsquo;at&rsquo; a time, add <span className="font-tibetan text-base">ར་</span> to the ordinal: <span className="font-tibetan text-base">ཆུ་ཚོད་བཅུ་པར་</span> = at 10 o&apos;clock.</span></div>
                            <div className="flex items-start gap-2"><Check size={14} className="text-brand shrink-0 mt-0.5" /><span>Minutes use <span className="font-tibetan text-base">སྐར་མ་</span>: <span className="font-tibetan text-base">ཆུ་ཚོད་བཞི་པ་དང་སྐར་མ་བཅུ།</span> (4:10).</span></div>
                          </div>
                        </div>

                        <p className="text-xs italic text-white/80 border-t border-white/15 pt-3">
                          The number in a clock time is an ordinal — literally &lsquo;it is the fifth hour&rsquo;.
                        </p>
                      </div>
                    </div>

                    <QuizModule moduleId={9} variant="editorial" editorialSurface="cream" eyebrow="Checkpoint" title="Telling the time — mastery check" quizTitle="Mastery Check · Telling the Time" subtitle="Recognition, meaning, romanisation, listening and form choice — mixed." questions={timeQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
                  </div>
                </div>
              )}

              {/* SECTION 3: CONVERSATION (Thread 3-step tap + Focus View) */}
              {activeSection === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-ink-light leading-relaxed max-w-2xl">
                      Read the Tibetan first. Tap a bubble once for the romanisation, again for the English. Prefer one line at a time? Switch a dialogue to Focus to walk through it with a single Show/Hide tap. Listen for <span className="font-tibetan text-lg text-ink">ག་ཚོད་</span> and <span className="font-tibetan text-lg text-ink">ག་རེ་</span> — the two question words of this unit.
                    </p>
                    <button type="button" onClick={toggleAllDialogues} className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-colors shrink-0 cursor-pointer ${showAllDialogues ? "bg-ink text-white border-ink" : "bg-surface text-ink border-border-strong hover:bg-surface-muted"}`}>
                      {showAllDialogues ? <EyeOff size={13} /> : <Eye size={13} />} {showAllDialogues ? "Hide translations" : "Show translations"}
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
                              <div className="size-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-brand-dark shrink-0"><MessageCircle size={15} /></div>
                              <div>
                                <h4 className="font-serif text-base font-normal text-ink">{thread.title}</h4>
                                <p className="text-[11px] text-ink-muted">{thread.subtitle}</p>
                              </div>
                            </div>

                            <div className="inline-flex rounded-full border border-border-subtle bg-surface-muted/70 p-0.5 text-[10px] font-bold">
                              <button type="button" onClick={() => setDialogueViewMode((p) => ({ ...p, [thread.id]: "thread" }))} className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${mode === "thread" ? "bg-surface text-ink shadow-2xs" : "text-ink-muted hover:text-ink"}`}>Thread</button>
                              <button type="button" onClick={() => setDialogueViewMode((p) => ({ ...p, [thread.id]: "focus" }))} className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${mode === "focus" ? "bg-surface text-ink shadow-2xs" : "text-ink-muted hover:text-ink"}`}>Focus</button>
                            </div>
                          </div>

                          {mode === "thread" ? (
                            <>
                              <div className="space-y-4">
                                {thread.lines.map((line, idx) => {
                                  const key = `${thread.id}-${idx}`;
                                  const level = bubbleReveal[key] || 0;
                                  const isRight = line.side === "right";
                                  const tapCue = level === 0 ? "Tap to reveal" : level === 1 ? "Tap again for English" : "Tap to reset";
                                  return (
                                    <div key={key} className={`flex items-start gap-2.5 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
                                      <div className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-4 ${isRight ? "bg-brand-light text-brand-dark border border-amber-300/70" : "bg-surface text-ink-light border border-border-subtle"}`}>{line.speakerInitial}</div>
                                      <div className={`max-w-[82%] flex flex-col ${isRight ? "items-end" : "items-start"}`}>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted mb-1 px-1 inline-flex items-baseline gap-1.5">
                                          <span>{line.speaker}</span>
                                          <span className="font-tibetan text-xs font-normal text-ink-muted">{line.speakerTib}</span>
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {isRight && (
                                            <button type="button" onClick={() => playAudio(line.tib)} className="size-7 rounded-lg border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark shrink-0 cursor-pointer">
                                              {playingItem === line.tib ? <Loader2 size={12} className="animate-spin text-brand" /> : <Volume2 size={12} />}
                                            </button>
                                          )}
                                          <button type="button" onClick={() => cycleBubbleReveal(key)} className={`text-left rounded-xl px-4 py-3 border transition-all cursor-pointer select-none ${isRight ? "bg-[#FFF8DE] border-amber-200/90 hover:border-brand" : "bg-[#FAF6EC] border-border-subtle hover:border-border-strong"}`}>
                                            <div className="font-tibetan text-xl text-ink leading-normal">{line.tib}</div>
                                            {level >= 1 && <div className="text-xs font-serif italic text-ink-muted mt-1.5">{line.pron}</div>}
                                            {level >= 2 && <div className="text-xs font-medium text-ink mt-1">{line.en}</div>}
                                            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-muted/90 mt-2">{tapCue}</div>
                                          </button>
                                          {!isRight && (
                                            <button type="button" onClick={() => playAudio(line.tib)} className="size-7 rounded-lg border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark shrink-0 cursor-pointer">
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
                                    {thread.lines.map((_, i) => <span key={i} className={`size-1.5 rounded-full ${(bubbleReveal[`${thread.id}-${i}`] || 0) > 0 ? "bg-brand" : "bg-border-strong/50"}`} />)}
                                  </div>
                                  <span>{revealedCount} / {thread.lines.length} lines revealed</span>
                                </div>
                                <button type="button" onClick={() => toggleThreadReveal(thread.id, thread.lines.length)} className="text-[10px] font-bold uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full border border-border-subtle bg-surface text-ink-light hover:text-ink transition-colors cursor-pointer">
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
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">Line {focusIdx + 1} of {thread.lines.length}</span>
                                    <div className="flex items-center gap-2">
                                      <button type="button" disabled={focusIdx === 0} onClick={() => setDialogueFocusIdx((p) => ({ ...p, [thread.id]: Math.max(0, focusIdx - 1) }))} className="size-8 rounded-full border border-border-subtle bg-surface flex items-center justify-center text-ink disabled:opacity-35 cursor-pointer"><ChevronLeft size={14} /></button>
                                      <button type="button" disabled={focusIdx === thread.lines.length - 1} onClick={() => setDialogueFocusIdx((p) => ({ ...p, [thread.id]: Math.min(thread.lines.length - 1, focusIdx + 1) }))} className="size-8 rounded-full border border-border-subtle bg-surface flex items-center justify-center text-ink disabled:opacity-35 cursor-pointer"><ChevronRight size={14} /></button>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isRight ? "bg-brand-light text-brand-dark border border-amber-300/70" : "bg-surface-muted text-ink-light border border-border-subtle"}`}>{line.speakerInitial}</div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted inline-flex items-baseline gap-2">
                                      <span>{line.speaker}</span>
                                      <span className="font-tibetan text-sm font-normal">{line.speakerTib}</span>
                                    </span>
                                  </div>
                                  <button type="button" onClick={() => toggleFocusLineReveal(key)} className={`w-full text-left px-5 py-5 rounded-2xl border transition-all cursor-pointer select-none ${isRight ? "bg-[#FFF8DE] border-amber-200/90 hover:border-brand rounded-tr-sm" : "bg-[#FAF6EC] border-border-subtle hover:border-border-strong rounded-tl-sm"}`}>
                                    <div className="font-tibetan text-2xl sm:text-[26px] text-ink leading-normal">{line.tib}</div>
                                    {isShown && (
                                      <div className="mt-3 space-y-1">
                                        <div className="text-sm font-serif italic text-ink-muted">{line.pron}</div>
                                        <div className="text-sm font-medium text-ink">{line.en}</div>
                                      </div>
                                    )}
                                  </button>
                                  <div className="flex items-center justify-between gap-3 pt-1">
                                    <button type="button" onClick={() => toggleFocusLineReveal(key)} className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-dark hover:text-ink cursor-pointer">
                                      {isShown ? <EyeOff size={14} /> : <Eye size={14} />}
                                      <span>{isShown ? "Hide romanisation & English" : "Show romanisation & English"}</span>
                                    </button>
                                    <button type="button" onClick={() => playAudio(line.tib)} className="size-8 rounded-lg border border-border-subtle bg-surface flex items-center justify-center text-ink-light hover:text-brand-dark hover:border-brand cursor-pointer">
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

              {/* SECTION 4: REFERENCE & CULTURE CORNER */}
              {activeSection === 4 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-l-2 border-brand pl-4 text-sm text-ink-light leading-relaxed">
                    Tibetan has its own set of digits, used on phone screens, prayer books and price tags. The Culture Corner shows how Tibetan children learn to count.
                  </div>

                  {/* Culture Corner */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700"><Sparkles size={15} /></div>
                      <div>
                        <h3 className="font-serif text-lg font-normal text-ink leading-tight">Culture Corner</h3>
                        <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted">2 Notes · Read aloud</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      {CULTURE_NOTES.map((note) => (
                        <div key={note.id} className="border border-border-subtle rounded-xl overflow-hidden bg-surface flex flex-col">
                          <div className="relative h-40 w-full overflow-hidden bg-ink">
                            <img src={note.fallbackImage} alt={note.title} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent p-4 flex flex-col justify-end">
                              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand mb-0.5">{note.badge}</span>
                              <h4 className="font-serif text-lg font-normal text-white leading-snug">{renderTibetanInline(note.title, "text-[1.2em] text-white")}</h4>
                            </div>
                          </div>
                          <div className="p-5 space-y-3 text-xs sm:text-[13px] leading-relaxed text-ink-light flex-1">
                            {note.paragraphs.map((para, i) => <p key={i}>{renderTibetanInline(para, "text-[1.25em]")}</p>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Reference Table */}
                  <div className="bg-[#FFFDF5] border border-amber-200/80 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-serif font-bold text-ink">
                      <BookOpen size={15} className="text-brand-dark" /> Quick Reference
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-dark mb-2.5">Tibetan Digits</div>
                          <div className="divide-y divide-amber-200/50">
                            {TIBETAN_DIGITS.map((d) => (
                              <button key={d.arabic} type="button" onClick={() => playAudio(d.word)} className="w-full py-2 grid grid-cols-[44px_48px_1fr_auto] items-center text-left hover:bg-brand-light/30 px-1.5 rounded transition-colors cursor-pointer">
                                <span className="text-xs font-bold text-ink-light">{d.arabic}</span>
                                <span className="font-tibetan text-lg text-ink">{d.digit}</span>
                                <span className="font-tibetan text-lg text-ink leading-normal">{d.word}</span>
                                <Volume2 size={12} className="text-ink-muted" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-dark mb-2.5">Time and Day Words</div>
                          <div className="divide-y divide-amber-200/50">
                            {TIME_DAY_REF.map((r) => (
                              <button key={r.en} type="button" onClick={() => playAudio(r.tib)} className="w-full py-2 grid grid-cols-[1fr_1fr_auto] items-center text-left hover:bg-brand-light/30 px-1.5 rounded transition-colors cursor-pointer">
                                <span className="text-xs text-ink-light">{r.en}</span>
                                <span className="font-tibetan text-lg text-ink leading-normal">{r.tib}</span>
                                <span className="text-xs font-serif italic text-ink-muted">{r.pron}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-dark mb-2.5">Round Numbers</div>
                        <div className="divide-y divide-amber-200/50">
                          {ROUND_NUMBERS.map((r) => (
                            <button key={r.arabic} type="button" onClick={() => playAudio(r.tib)} className="w-full py-2.5 grid grid-cols-[80px_1fr_auto] items-center text-left hover:bg-brand-light/30 px-1.5 rounded transition-colors cursor-pointer">
                              <span className="text-xs font-bold text-ink-light">{r.arabic}</span>
                              <span className="font-tibetan text-lg text-ink leading-normal">{r.tib}</span>
                              <span className="text-xs font-serif italic text-ink-muted">{r.pron}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: PRACTICE HUB */}
              {activeSection === 5 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-[#FFFDF6] border border-amber-200/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark mb-1"><Sparkles size={12} /> Practice Hub</div>
                      <h3 className="font-serif text-xl font-normal text-ink mb-1">{completedDrillsCount} of 7 drills complete</h3>
                      <p className="text-xs text-ink-light max-w-lg leading-relaxed">Work down the stages. Each drill is scored the moment you finish it — retry any of them as often as you like before the unit test.</p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-amber-200/60">
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted">Accuracy</div>
                        <div className="font-serif text-2xl text-ink">{overallAccuracy}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-ink-muted">Answered</div>
                        <div className="font-serif text-2xl text-ink">{totalCorrect}/{totalAnswered || "—"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-border-subtle flex items-center gap-1 overflow-x-auto custom-scrollbar">
                    {[
                      { key: "grammar", num: "1", label: "Grammar drills" },
                      { key: "conversation", num: "2", label: "Conversation response" },
                      { key: "recall", num: "3", label: "Free recall" },
                      { key: "listening", num: "4", label: "Listening lab", icon: Headphones },
                    ].map((t) => {
                      const active = activePracticeTab === t.key;
                      const IconComp = t.icon;
                      return (
                        <button key={t.key} type="button" onClick={() => setActivePracticeTab(t.key as PracticeTabKey)} className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${active ? "border-ink text-ink font-bold" : "border-transparent text-ink-muted hover:text-ink"}`}>
                          {IconComp && <IconComp size={12} />}
                          <span className="text-[10px] font-bold opacity-70">{t.num}</span>
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {activePracticeTab === "grammar" && (
                    <div className="space-y-5">
                      <QuizModule moduleId={9} variant="editorial" editorialSurface="white" title="Number recognition" quizTitle="Practice · Number Recognition" subtitle="Read Tibetan numbers instantly." statusBadge={drillResults.numRec ? `${drillResults.numRec.score}/${drillResults.numRec.total}` : "Not started"} questions={practiceDrills.numberRecognition} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} onComplete={(sc, tot) => recordDrillResult("numRec", sc, tot)} />
                      <QuizModule moduleId={9} variant="editorial" editorialSurface="white" title="Number building" quizTitle="Practice · Number Building" subtitle="Add the correct linking particle above twenty." statusBadge={drillResults.numBuild ? `${drillResults.numBuild.score}/${drillResults.numBuild.total}` : "Not started"} questions={practiceDrills.numberBuilding} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} onComplete={(sc, tot) => recordDrillResult("numBuild", sc, tot)} />
                      <QuizModule moduleId={9} variant="editorial" editorialSurface="white" title="Days of the week" quizTitle="Practice · Days of the Week" subtitle="Recognise the seven weekdays." statusBadge={drillResults.days ? `${drillResults.days.score}/${drillResults.days.total}` : "Not started"} questions={practiceDrills.daysOfWeek} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} onComplete={(sc, tot) => recordDrillResult("days", sc, tot)} />
                      <QuizModule moduleId={9} variant="editorial" editorialSurface="white" title="Clock time" quizTitle="Practice · Clock Time" subtitle="Use the ཆུ་ཚོད་ + number + པ + རེད། formula." statusBadge={drillResults.time ? `${drillResults.time.score}/${drillResults.time.total}` : "Not started"} questions={practiceDrills.clockTime} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} onComplete={(sc, tot) => recordDrillResult("time", sc, tot)} />
                    </div>
                  )}

                  {activePracticeTab === "conversation" && (
                    <QuizModule moduleId={9} variant="editorial" editorialSurface="white" title="Conversation response" quizTitle="Practice · Conversation Response" subtitle="Pick the natural reply for schedules, times, and phone numbers." statusBadge={drillResults.conv ? `${drillResults.conv.score}/${drillResults.conv.total}` : "Not started"} questions={practiceDrills.conversation} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} onComplete={(sc, tot) => recordDrillResult("conv", sc, tot)} />
                  )}

                  {activePracticeTab === "recall" && (
                    <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
                  )}

                  {activePracticeTab === "listening" && (
                    <QuizModule moduleId={9} variant="editorial" editorialSurface="white" title="Listening lab" quizTitle="Practice · Listening Lab" subtitle="Hear or read the prompt and match the Tibetan script." statusBadge={drillResults.listen ? `${drillResults.listen.score}/${drillResults.listen.total}` : "Not started"} questions={practiceDrills.listening} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} onComplete={(sc, tot) => recordDrillResult("listen", sc, tot)} />
                  )}
                </div>
              )}

              {/* SECTION 6: REVIEW */}
              {activeSection === 6 && (
                <div className="grid md:grid-cols-2 gap-5 animate-in fade-in duration-300">
                  <div className="bg-surface border border-border-subtle rounded-xl p-5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-4">Can-do checklist</div>
                    <div className="space-y-2.5">
                      {CAN_DO_CHECKLIST.map((item, idx) => {
                        const checked = !!checkedItems[idx];
                        return (
                          <button key={idx} type="button" onClick={() => setCheckedItems((p) => ({ ...p, [idx]: !p[idx] }))} className="w-full flex items-start gap-3 text-left py-1.5 px-2 rounded-lg hover:bg-paper/60 transition-colors cursor-pointer">
                            <span className={`mt-0.5 size-4 rounded flex items-center justify-center shrink-0 ${checked ? "bg-emerald-600 text-white" : "text-emerald-600 border border-emerald-300 bg-emerald-50/50"}`}><Check size={11} strokeWidth={3} /></span>
                            <span className={`text-xs sm:text-[13px] leading-relaxed ${checked ? "text-ink font-medium" : "text-ink-light"}`}>{renderTibetanInline(item, "text-[1.3em]")}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-[#FFF9F2] border border-amber-200/80 rounded-xl p-5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800 mb-4"><Mic size={13} /> Say it out loud</div>
                    <div className="space-y-3.5">
                      {SPEAKING_PROMPTS.map((prompt, idx) => (
                        <div key={idx} className="border-l-2 border-amber-400/90 pl-3.5 py-0.5 text-xs sm:text-[13px] leading-relaxed text-ink">{renderTibetanInline(prompt, "text-[1.3em]")}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 7: FINAL TEST */}
              {activeSection === 7 && (
                <div className="animate-in fade-in duration-300">
                  <QuizModule moduleId={9} variant="editorial" editorialSurface="white" title="Final Test" intro="40 questions drawn from everything you covered in this lesson. Score 80% or higher to pass. You can retake the test as many times as you like — your best score is saved." questions={finalQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} nextLessonPath="/dashboard?hub=beginner2" onPass={() => markComplete(7)} hideHeader={true} />
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-6 py-4 border-t border-border-subtle bg-surface flex items-center justify-between gap-4">
              <button type="button" disabled={activeSection === 0} onClick={() => goToSection(activeSection - 1)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border-subtle bg-surface text-xs font-bold text-ink-light hover:text-ink disabled:opacity-40 cursor-pointer">
                <ChevronLeft size={14} /> Previous
              </button>
              <div className="hidden sm:flex items-center gap-1.5">
                {WEB_STEPS.map((s, idx) => (
                  <button key={s.id} type="button" aria-label={`Jump to ${s.navTitle}`} onClick={() => goToSection(idx)} className={`size-2 rounded-full transition-all cursor-pointer ${idx === activeSection ? "bg-brand scale-125" : completed.has(idx) ? "bg-emerald-500" : "bg-border-strong/50"}`} />
                ))}
              </div>
              <button type="button" onClick={handleContinueSection} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer">
                {activeSection === WEB_STEPS.length - 1 ? "Complete step" : "Continue"} <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Proverb Strip */}
          <div className="bg-[#FAF5E8] border border-amber-200/70 rounded-xl px-5 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
            <span className="text-brand-dark text-xs select-none">✿</span>
            <span className="font-tibetan text-lg text-ink leading-normal">{section.proverbTib}</span>
            <span className="text-border-strong select-none">|</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{section.proverbEn}</span>
            <span className="text-brand-dark text-xs select-none">✿</span>
          </div>
        </section>

        {/* RIGHT CONTEXT RAIL */}
        <aside className="lg:sticky lg:top-4 space-y-4">
          <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-ink"><Sparkles size={13} className="text-emerald-700" /><span>New words</span></div>
              <button type="button" onClick={() => goToSection(0)} className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer">View all</button>
            </div>
            <div className="divide-y divide-border-subtle/70">
              {rightRailItems.map((item) => (
                <button key={item.tib} type="button" onClick={() => playAudio(item.tib)} className="w-full py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-2 text-left group cursor-pointer">
                  <div className="min-w-0">
                    <div className="font-tibetan text-lg text-ink leading-normal group-hover:text-brand-dark truncate">{item.tib}</div>
                    <div className="text-[11px] font-serif italic text-ink-muted leading-tight">{item.pron}</div>
                    <div className="text-[11px] text-ink-light leading-snug line-clamp-2">{item.en}</div>
                  </div>
                  <span className="text-ink-muted group-hover:text-brand-dark shrink-0">
                    {playingItem === item.tib ? <Loader2 size={13} className="animate-spin text-brand" /> : <Volume2 size={13} />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#FFFDF4] border border-amber-200/80 rounded-2xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark"><Lightbulb size={12} /> Grammar Tip</div>
            <div className="font-serif text-base text-ink">Constructing numbers 11–19</div>
            <p className="text-xs text-ink-light leading-relaxed">
              Say the ten, add the particle, then the digit: <span className="font-tibetan text-base text-ink">ལྔ་བཅུ་ + ང་ + བདུན་</span> = 57.
            </p>
            <div className="space-y-1.5 pt-1">
              {[{ tib: "བཅུ་གཅིག", label: "11" }, { tib: "བཅུ་གཉིས།", label: "12" }].map((ex) => (
                <button key={ex.tib} type="button" onClick={() => playAudio(ex.tib)} className="w-full bg-surface border border-amber-200/70 hover:border-brand rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer">
                  <span className="font-tibetan text-lg text-ink leading-normal">{ex.tib}</span>
                  <span className="text-[11px] font-bold text-brand-dark">{ex.label}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => goToSection(2)} className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-dark hover:underline pt-1 cursor-pointer">
              Practice grammar <ChevronRight size={12} />
            </button>
          </div>

          <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-ink"><BookOpen size={13} className="text-emerald-700" /><span>Progress</span></div>
              <span className="text-xs font-bold text-emerald-700">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${Math.max(progressPercent, 0)}%` }} />
            </div>
            <div className="text-[11px] text-ink-muted">{completedCount} of {WEB_STEPS.length} sections completed</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
