// app/components/QuizModule.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/clerk-react";
import { 
  Loader2, Volume2, ChevronRight, Trophy, Sparkles,
  Lock, CheckCircle2, XCircle, Check, X, Shuffle, ArrowRight 
} from "lucide-react";
import { useDevBypass } from "@/hooks/useDevBypass";
import { usePlatform } from "@/hooks/usePlatform";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { Button } from "@/app/components/ui/Button";
import { Haptics, NotificationType } from "@capacitor/haptics"; 

export interface QuizChoice {
  value: string;
  tib?: string;
  translit?: string;
  pron?: string;
  en?: string;
  emoji?: string;
  label?: string;
  isTibetan?: boolean;
}

export interface QuizDataRow {
  tib: string;
  translit?: string;
  pron?: string;
  en?: string;
  emoji?: string;
  label?: string;
  audio?: string;
}

export interface QuizQuestion {
  isAudioType?: boolean;
  type?: string;
  questionText?: string;
  promptText?: string;
  promptHighlight?: string;
  promptAudio?: string;
  promptEnd?: string;
  explanation?: string;
  prominentTibetan?: string;
  answer: string;
  audioString?: string;
  audioTarget?: string;
  noAudio?: boolean;
  answerObj?: QuizDataRow;
  choices: QuizChoice[];
}

interface QuizModuleProps {
  title: string;
  quizTitle?: string;
  moduleId?: number;
  intro?: string;
  data?: QuizDataRow[];
  questions?: QuizQuestion[];
  playAudio: (text: string) => void;
  stopAudio?: () => void;
  playingItem: string | null;
  playErrorBeep: () => void;
  questionCount?: number;
  isUnlockTest?: boolean;
  isVocabMatch?: boolean;
  nextLessonPath?: string;
  isLesson1?: boolean;
  onPass?: () => void;
  onComplete?: (score: number, total: number) => void;
  variant?: "default" | "panel" | "editorial";
  editorialSurface?: "cream" | "white";
  eyebrow?: string;
  subtitle?: string;
  statusBadge?: string;
  accentColor?: string;
  hideHeader?: boolean;
}

function renderInlineTibetan(text: string) {
  const parts = text.split(/([\u0F00-\u0FFF]+)/g);
  return parts.map((part, idx) =>
    /[\u0F00-\u0FFF]/.test(part) ? (
      <span key={idx} className="font-tibetan text-[1.45em] font-normal text-ink leading-normal mx-0.5 align-baseline">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export default function QuizModule({ 
  title, 
  quizTitle,
  moduleId: propModuleId,
  intro, 
  data, 
  questions: providedQuestions,
  playAudio, 
  stopAudio,
  playingItem, 
  playErrorBeep, 
  questionCount = 10, 
  isUnlockTest, 
  isVocabMatch,
  nextLessonPath,
  isLesson1,
  onPass,
  onComplete,
  variant = "default",
  editorialSurface = "cream",
  eyebrow,
  subtitle,
  statusBadge,
  accentColor,
  hideHeader = false
}: QuizModuleProps) {

  const router = useRouter();
  const pathname = usePathname();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();
  const { isDevUnlocked } = useDevBypass();
  
  const [hasStarted, setHasStarted] = useState(!isUnlockTest);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  const [hasSavedScore, setHasSavedScore] = useState(false);

  const feedbackRef = useRef<HTMLDivElement>(null);
  const topOfQuizRef = useRef<HTMLDivElement>(null);
  const prevStep = useRef(step);
  const prevStarted = useRef(hasStarted);

  // Auto-scroll logic (skip for editorial inline panels to keep 3-column desktop reading steady)
  useEffect(() => {
    if (variant === "editorial") return;
    if (picked && feedbackRef.current) {
      setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  }, [picked, variant]);

  useEffect(() => {
    if (variant === "editorial") return;
    const justStarted = hasStarted && !prevStarted.current;
    const stepChanged = step > prevStep.current;
    if ((justStarted || stepChanged) && !picked && topOfQuizRef.current) {
      setTimeout(() => topOfQuizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
    prevStep.current = step;
    prevStarted.current = hasStarted;
  }, [step, hasStarted, picked, variant]);

  useEffect(() => {
    return () => { if (stopAudio) stopAudio(); };
  }, [stopAudio]);
  
  const generateQuestions = (srcData?: QuizDataRow[], srcQuestions?: QuizQuestion[]) => {
    if (srcQuestions && srcQuestions.length > 0) {
      return srcQuestions.map(q => {
        const seen = new Set<string>();
        const uniqueChoices = q.choices.filter(c => {
          const val = c.value?.trim() || "";
          if (seen.has(val)) return false;
          seen.add(val);
          return true;
        });
        return { ...q, choices: uniqueChoices };
      }).sort(() => 0.5 - Math.random());
    }
    
    if (!srcData || srcData.length === 0) return [];
    
    const qs: QuizQuestion[] = [];
    const shuffledData = [...srcData].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < questionCount; i++) {
      const isAudioType = !isVocabMatch && Math.random() > 0.5;
      const answer = shuffledData[i % shuffledData.length];
      const wrongs = srcData.filter((x: QuizDataRow) => x.tib !== answer.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [answer, ...wrongs].sort(() => 0.5 - Math.random());
      
      qs.push({
        isAudioType,
        answer: answer.tib,
        audioString: answer.audio || answer.tib,
        answerObj: answer,
        choices: choices.map((c: QuizDataRow) => ({ 
          value: c.tib, 
          tib: c.tib, 
          translit: c.translit, 
          pron: c.pron, 
          en: c.en, 
          emoji: c.emoji, 
          label: c.label 
        }))
      });
    }
    return qs;
  };

  const [quizSeed, setQuizSeed] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => generateQuestions(data, providedQuestions));

  const latestProps = useRef({ data, providedQuestions });
  useEffect(() => { latestProps.current = { data, providedQuestions }; });

  useEffect(() => {
    if (quizSeed > 0) setQuestions(generateQuestions(latestProps.current.data, latestProps.current.providedQuestions));
  }, [quizSeed]);

  const total = questions.length;
  const currentQ = questions[step] || questions[0];

  // ========================================================
  // Save score locally (instant, highest score kept) & server
  // ========================================================
  useEffect(() => {
    if (step > 0 && step >= total && !hasSavedScore) {
      setHasSavedScore(true);

      if (onComplete) {
        onComplete(score, total);
      }

      const match = pathname?.match(/lessons\/(\d+)/);
      const effectiveModuleId = propModuleId !== undefined ? propModuleId : (match ? parseInt(match[1], 10) : 1);
      const effectiveTitle = (quizTitle || title || "").trim();

      if (typeof window !== "undefined" && effectiveTitle) {
        try {
          const localKey = `tibetan_mastery_scores_mod_${effectiveModuleId}`;
          const existing = JSON.parse(localStorage.getItem(localKey) || "{}");
          const prev = existing[effectiveTitle];
          const prevScore = typeof prev === "object" && prev !== null ? (prev.score ?? -1) : (Number(prev) || -1);

          if (score > prevScore) {
            existing[effectiveTitle] = {
              score, total, percentage: total > 0 ? Math.round((score / total) * 100) : 0,
              updated_at: new Date().toISOString()
            };
            localStorage.setItem(localKey, JSON.stringify(existing));
          }

          if (effectiveTitle.toLowerCase().includes("vocabulary")) {
            const vocabScoreKey = `tibetan_vocab_score_mod_${effectiveModuleId}`;
            const previousBest = parseInt(localStorage.getItem(vocabScoreKey) || "0", 10);
            if (score > previousBest) {
              localStorage.setItem(vocabScoreKey, score.toString());
            }
          }
        } catch (err) { console.warn("Failed to save score locally:", err); }
      }

      const saveScoreToDb = async () => {
        try {
          const token = await getToken();
          if (!token || !effectiveTitle) return;
          
          const formData = new FormData();
          formData.append('module_id', effectiveModuleId.toString());
          formData.append('quiz_title', effectiveTitle);
          formData.append('score', score.toString());
          formData.append('total', total.toString());
          
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/save-quiz-score`, {
            method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
          });
        } catch (e) { console.warn("QuizModule: Server sync deferred", e); }
      };
      saveScoreToDb();
    }
  }, [step, total, score, hasSavedScore, title, quizTitle, propModuleId, pathname, getToken, onComplete]);

  useEffect(() => {
    if (step > 0 && step >= total && !hasAutoSaved) {
      const passed = (score / total) >= 0.8 || isDevUnlocked;
      if (passed && onPass) { onPass(); setHasAutoSaved(true); }
    }
  }, [step, total, score, onPass, hasAutoSaved, isDevUnlocked]);

  const resetQuiz = () => {
    if (stopAudio) stopAudio();
    setStep(0); setScore(0); setPicked(null); 
    setHasAutoSaved(false); setHasSavedScore(false); setQuizSeed(s => s + 1); 
  };

  const pick = (val: string) => {
    if (picked || !currentQ) return;
    setPicked(val);
    if (val === currentQ.answer) {
      setScore(s => s + 1);
      if (isNative) try { Haptics.notification({ type: NotificationType.Success }); } catch (e) {}
      if (!currentQ.noAudio) playAudio(currentQ.audioTarget || currentQ.audioString || currentQ.answer);
    } else {
      playErrorBeep();
    }
  };

  // ============================================================================
  // EDITORIAL VARIANT (Beginner 2 Desktop Web — Lovable Checkpoint / Drill / Test)
  // ============================================================================
  if (variant === "editorial") {
    const surfaceCls =
      editorialSurface === "cream"
        ? "bg-[#FFFDF6] border border-amber-200/80 rounded-xl p-5 md:p-6"
        : "bg-surface border border-border-subtle rounded-xl p-5 md:p-6";

    if (!hasStarted) {
      return (
        <div className="space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark bg-brand-light border border-amber-200/80 px-2.5 py-1 rounded-md mb-4">
              <Trophy className="size-3" /> Final Test
            </span>
            <h3 className="text-2xl font-serif font-normal text-ink mb-2">Ready to unlock the next step?</h3>
            <p className="text-sm text-ink-light leading-relaxed mb-6 max-w-2xl">
              {intro || `${total} questions drawn from everything you covered in this lesson. Score 80% or higher to pass. You can retake the test as many times as you like — your best score is saved.`}
            </p>
            <button
              type="button"
              onClick={() => setHasStarted(true)}
              className="bg-brand hover:bg-brand-dark text-ink font-bold text-sm px-6 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              Start the test <ChevronRight size={15} />
            </button>
          </div>

          <div className="border border-border-subtle bg-paper/40 rounded-xl p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2.5">
              <Lock size={13} /> Progression
            </div>
            <p className="text-sm text-ink-light mb-4">
              Passing this test unlocks the next step in the syllabus. Your progress is saved securely to your account.
            </p>
            <ul className="space-y-2 text-xs text-ink-light">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Mix of recognition and pronunciation prompts</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Immediate feedback after each question</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> Unlimited retakes — best score is kept</li>
            </ul>
          </div>
        </div>
      );
    }

    if (step >= total) {
      const passed = (score / total) >= 0.8 || isDevUnlocked;
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;

      const handleUnlock = () => {
        setIsSaving(true);
        if (nextLessonPath) router.push(nextLessonPath);
        else setIsSaving(false);
      };

      return (
        <div className={surfaceCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`size-11 rounded-full flex items-center justify-center shrink-0 border ${passed ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                {passed ? <CheckCircle2 size={22} /> : <Sparkles size={20} />}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-0.5">
                  {isUnlockTest ? (passed ? "Final Test Passed" : "Keep Practising") : "Complete"}
                </div>
                <div className="font-serif text-xl text-ink">
                  You scored <span className={passed ? "text-emerald-700 font-bold" : "text-brand-dark font-bold"}>{score} / {total}</span> ({pct}%)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => { resetQuiz(); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-border-strong bg-surface text-ink hover:bg-surface-muted rounded-lg transition-colors cursor-pointer"
              >
                <Shuffle size={13} /> Retry
              </button>
              {isUnlockTest && passed && nextLessonPath && (
                <button
                  type="button"
                  onClick={handleUnlock}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <>Return to Beginner 2 Hub <ArrowRight size={14} /></>}
                </button>
              )}
            </div>
          </div>
          {isDevUnlocked && (score / total) < 0.8 && isUnlockTest && (
            <div className="mt-3 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
              Developer Bypass active — step unlocked
            </div>
          )}
        </div>
      );
    }

    if (!currentQ) return null;

    const progressWidth = total > 0 ? Math.max(Math.round(((step + (picked ? 1 : 0)) / total) * 100), 3) : 0;
    const colClass =
      currentQ.choices.length === 2
        ? "grid-cols-2"
        : currentQ.choices.length === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-2 lg:grid-cols-4";

    const isReadingTest =
      currentQ.questionText &&
      (currentQ.questionText.toLowerCase().includes("read") || currentQ.questionText.toLowerCase().includes("pronounce"));
    const showAudioButton = Boolean(currentQ.audioString && !currentQ.noAudio && (!isReadingTest || picked !== null));

    return (
      <div className={surfaceCls}>
        {(eyebrow || title || subtitle) && !hideHeader && (
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {eyebrow && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark mb-1">
                  <Sparkles className="size-3" /> {eyebrow}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2.5">
                {title && <h4 className="font-serif text-lg md:text-xl font-normal text-ink">{renderInlineTibetan(title)}</h4>}
                {statusBadge && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-surface-muted text-ink-muted border border-border-subtle">
                    {statusBadge}
                  </span>
                )}
              </div>
              {subtitle && <p className="text-xs text-ink-muted mt-0.5">{renderInlineTibetan(subtitle)}</p>}
            </div>
            {!eyebrow && (
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted shrink-0">
                {total} questions
              </span>
            )}
          </div>
        )}

        {/* Question Counter + Score + Thin Bar */}
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-ink-muted mb-1.5">
          <span>Question {step + 1} of {total}</span>
          <span className="text-brand-dark">Score {score}</span>
        </div>
        <div className="h-1 w-full bg-border-subtle/70 rounded-full overflow-hidden mb-5">
          <div className="h-full bg-brand transition-all duration-300" style={{ width: `${progressWidth}%` }} />
        </div>

        {/* Prompt */}
        <div className="mb-4">
          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-1.5">Prompt</div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[15px] md:text-base font-medium text-ink leading-relaxed">
              {currentQ.promptText ? (
                <div className="space-y-1">
                  <div>{renderInlineTibetan(currentQ.promptText)}</div>
                  {currentQ.promptHighlight && (
                    <div className="font-tibetan text-2xl text-ink leading-normal pt-0.5">
                      {currentQ.promptHighlight}
                    </div>
                  )}
                  {currentQ.promptEnd && (
                    <div className="text-xs text-ink-muted">{renderInlineTibetan(currentQ.promptEnd)}</div>
                  )}
                </div>
              ) : currentQ.questionText ? (
                <span>{renderInlineTibetan(currentQ.questionText)}</span>
              ) : (
                <span>Select the matching option.</span>
              )}
            </div>

            {showAudioButton && (
              <button
                type="button"
                onClick={() => playAudio(currentQ.audioString!)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-strong bg-surface hover:border-brand text-xs font-bold text-ink-light hover:text-brand-dark transition-colors shrink-0 cursor-pointer"
              >
                {playingItem === currentQ.audioString ? (
                  <Loader2 size={13} className="animate-spin text-brand" />
                ) : (
                  <Volume2 size={13} className="text-brand-dark" />
                )}
                Listen
              </button>
            )}
          </div>
        </div>

        {/* Crisp Rectangular Choice Buttons */}
        <div className={`grid ${colClass} gap-2.5`}>
          {currentQ.choices.map((c: QuizChoice, idx: number) => {
            const isRight = picked !== null && c.value === currentQ.answer;
            const isWrongPicked = picked === c.value && c.value !== currentQ.answer;
            const displayText = c.label || c.tib || c.value;
            const isTib = Boolean(c.isTibetan || /[\u0F00-\u0FFF]/.test(displayText));

            let btnClass =
              "bg-surface border-border-subtle hover:border-brand hover:bg-brand-light/20 text-ink cursor-pointer";
            if (picked !== null) {
              if (isRight) {
                btnClass = "bg-emerald-50 border-emerald-500 text-emerald-800";
              } else if (isWrongPicked) {
                btnClass = "bg-rose-50 border-rose-400 text-rose-800";
              } else {
                btnClass = "bg-surface-muted/40 border-border-subtle text-ink-muted opacity-60";
              }
            }

            return (
              <button
                key={`ed-choice-${step}-${idx}`}
                type="button"
                disabled={picked !== null}
                onClick={() => pick(c.value)}
                className={`relative px-3.5 py-3 min-h-[3.25rem] rounded-lg border text-center flex items-center justify-center transition-all ${btnClass}`}
              >
                {picked !== null && isRight && (
                  <Check size={14} strokeWidth={3} className="absolute top-2 right-2 text-emerald-600" />
                )}
                {picked !== null && isWrongPicked && (
                  <X size={14} strokeWidth={3} className="absolute top-2 right-2 text-rose-500" />
                )}
                <span
                  className={
                    isTib
                      ? "font-tibetan text-xl leading-normal py-0.5"
                      : "text-xs sm:text-[13px] font-medium leading-snug"
                  }
                >
                  {displayText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inline Feedback + Next Button */}
        {picked !== null && (
          <div className="mt-4 pt-3.5 border-t border-border-subtle/70 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className={`text-xs font-bold ${picked === currentQ.answer ? "text-emerald-700" : "text-rose-700"}`}>
              {picked === currentQ.answer ? (
                "Correct!"
              ) : (
                <span>
                  Not quite — answer: <span className="underline">{renderInlineTibetan(currentQ.answer)}</span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (stopAudio) stopAudio();
                setPicked(null);
                setStep((s) => s + 1);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-ink hover:bg-ink-light text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {step + 1 === total ? "See results" : "Next question"} <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // DEFAULT & PANEL VARIANTS (Beginner 1 Lessons 1-7 & Mobile — Unchanged)
  // ============================================================================
  if (!hasStarted) {
    return (
      <div className={`border p-6 md:p-8 rounded-[1.25rem] ${isUnlockTest ? 'bg-white border-border-subtle shadow-sm' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Trophy className="size-3.5" /> Step Complete
        </div>
        <h3 className="text-2xl font-serif text-ink mb-2">Ready to complete this step?</h3>
        <p className="text-sm text-ink-light mb-6">
          {intro || `${total} questions drawn from everything you covered in this lesson.`}
        </p>
        <button onClick={() => setHasStarted(true)} className="bg-amber-500 text-stone-900 font-bold px-6 py-2.5 flex items-center gap-2 hover:bg-amber-400 transition-colors mb-8 border border-amber-600 shadow-sm rounded-full">
          Start <ChevronRight size={16} />
        </button>
        <div className="border border-border-subtle p-5 bg-surface-muted rounded-[1.25rem]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3">
             <Lock size={14} /> Progression
          </div>
          <p className="text-sm text-ink-light mb-4">Passing this test unlocks the next step in the syllabus. Your progress is saved securely to your account.</p>
          <ul className="space-y-2 text-sm text-ink-light">
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Immediate feedback after each question</li>
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited retakes — best score is kept</li>
          </ul>
        </div>
      </div>
    );
  }

  if (step >= total) {
    if (variant === 'panel') {
      return (
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border bg-surface rounded-[1.25rem]" style={{ borderColor: 'var(--color-border-strong)' }}>
          <div className="text-[15px] font-bold text-ink">
            Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: accentColor || 'var(--color-brand)' }}>{score}</span> / {total}.
          </div>
          <button onClick={resetQuiz} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium border transition-colors bg-transparent text-ink border-border-strong hover:bg-surface-muted rounded-full">
            <Shuffle size={14} /> Try again
          </button>
        </div>
      );
    }

    const passed = (score / total) >= 0.8 || isDevUnlocked;
    const handleUnlock = async () => {
      setIsSaving(true);
      if (nextLessonPath) router.push(nextLessonPath);
      else setIsSaving(false);
    };

    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 border rounded-[1.25rem] ${isNative ? 'mb-4' : ''} ${isUnlockTest ? 'bg-white border-border-subtle shadow-sm' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border ${passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
          {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-ink mb-4">{passed ? "Test Passed!" : "Keep Practicing"}</h3>
        <p className="text-ink-light mb-8 font-bold text-lg">You scored <span className={passed ? "text-emerald-600" : "text-rose-600"}>{score}</span> out of {total}.</p>
        
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-sm">
          <button onClick={() => { resetQuiz(); if(isUnlockTest) setHasStarted(false); }} className="w-full py-4 bg-white border border-border-strong font-bold hover:bg-surface-muted transition-colors text-ink flex items-center justify-center gap-2 disabled:opacity-50 rounded-full" disabled={isSaving}>
            <Shuffle size={18} /> Retake
          </button>
          
          {passed && isUnlockTest && nextLessonPath && (
            <button onClick={handleUnlock} disabled={isSaving} className="w-full py-4 bg-ink text-white font-bold hover:bg-ink-light transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-75 rounded-full">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>Unlock Next Step <ArrowRight size={18} /></>}
            </button>
          )}
          {passed && isUnlockTest && !nextLessonPath && (
            <button onClick={handleUnlock} disabled={isSaving} className="w-full py-4 bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors shadow-sm flex items-center justify-center gap-2 border border-amber-600 disabled:opacity-75 rounded-full">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>Lesson Complete <ArrowRight size={18} /></>}
            </button>
          )}
        </div>
        {isDevUnlocked && (score / total) < 0.8 && isUnlockTest && (
          <div className="mt-6 text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 border border-emerald-200 rounded-full">Developer Bypass active — unlocked</div>
        )}
      </div>
    );
  }

  const isVocab = isVocabMatch || currentQ.type === 'vocab' || (currentQ.questionText && (currentQ.questionText.includes("Tibetan word for") || currentQ.questionText.includes("Which word means") || currentQ.questionText.includes("matching Tibetan word")));
  const readingToDisplay = isLesson1 ? (currentQ.answerObj?.translit || currentQ.answerObj?.pron) : (currentQ.answerObj?.pron || currentQ.answerObj?.translit);
  const isReadingTest = currentQ?.questionText && (currentQ.questionText.toLowerCase().includes("read") || currentQ.questionText.toLowerCase().includes("pronounce"));
  const canPlayProminentAudio = !isReadingTest || picked !== null;

  let containerClass = `w-full ${variant === 'panel' ? '' : 'pb-6 pt-2'} `;
  if (variant === 'default') {
    containerClass += isUnlockTest ? 'bg-paper ' : 'bg-paper ';
  }
  
  if (!currentQ) return null;

  return (
    <div className={containerClass}>
      {!hideHeader && (
        <div ref={topOfQuizRef} className={`scroll-mt-24 mb-6 px-1`}>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-ink-muted pb-2">
            <span>{variant === 'panel' && title ? `${title} · ` : ''}Question {step + 1} of {total}</span>
            <span className="text-brand-dark">Score {score}</span>
          </div>
          <ProgressBar progress={step + 1} total={total} className="h-1.5" />
        </div>
      )}

      <div className="w-full mb-6">
        {currentQ.promptText ? (
          <div className="bg-ink text-white rounded-[1.25rem] px-6 py-6 text-center shadow-sm flex flex-col items-center justify-center gap-3">
            <span className="text-lg md:text-xl font-medium">{currentQ.promptText}</span>
            {currentQ.promptHighlight && (
              currentQ.promptAudio ? (
                <button onClick={() => playAudio(currentQ.promptAudio!)} className="group relative font-tibetan text-3xl font-bold border px-5 py-2.5 flex items-center justify-center gap-3 shadow-sm transition-colors rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 mt-2">
                  <span className="pt-1">{currentQ.promptHighlight}</span>
                  {playingItem === currentQ.promptAudio ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className="text-white/60 group-hover:text-white transition-colors" />}
                </button>
              ) : (
                <span className="font-tibetan text-3xl font-bold border px-5 py-2.5 rounded-xl bg-white/10 border-white/20 text-white mt-2 inline-block">
                  <span className="pt-1">{currentQ.promptHighlight}</span>
                </span>
              )
            )}
            {currentQ.promptEnd && <span className="text-lg md:text-xl font-medium">{currentQ.promptEnd}</span>}
          </div>
        ) : (
          <div className="bg-ink text-white rounded-[1.25rem] px-5 sm:px-6 py-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[6rem]">
            {currentQ.questionText ? (
              <span className="text-lg md:text-[22px] leading-snug font-medium">{currentQ.questionText}</span>
            ) : isVocab ? (
              <span className="text-lg md:text-[22px] leading-snug font-medium">Which word means <span className="font-bold text-brand">"{currentQ.answerObj?.en}"</span>?</span>
            ) : currentQ.isAudioType ? (
              <span className="text-lg md:text-[22px] leading-snug font-medium">Listen and select the matching option.</span>
            ) : (
              <span className="text-lg md:text-[22px] leading-snug font-medium flex flex-wrap items-center justify-center gap-2">
                Which option reads <span className="font-mono text-brand font-bold bg-white/10 border border-white/20 px-2 py-0.5 rounded-md leading-none">{readingToDisplay}</span>?
              </span>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex justify-center mb-6">
        {currentQ.prominentTibetan && (
          <button 
            onClick={() => canPlayProminentAudio && playAudio(currentQ.audioString || currentQ.answer)}
            disabled={!canPlayProminentAudio}
            className={`w-full max-w-sm flex flex-col items-center justify-center py-6 border shadow-sm transition-all ${canPlayProminentAudio ? 'active:scale-95 group hover:border-brand bg-white cursor-pointer' : 'bg-surface-muted cursor-default'} ${isNative ? 'rounded-[1.25rem]' : 'rounded-2xl'} border-border-subtle`}
          >
            <span className={`font-tibetan text-6xl md:text-7xl leading-none pt-2 text-ink ${canPlayProminentAudio ? 'mb-4 group-hover:text-brand transition-colors' : 'mb-0 opacity-90'}`}>
              {currentQ.prominentTibetan}
            </span>
            {canPlayProminentAudio && !currentQ.noAudio && (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border bg-surface-muted border-border-strong text-ink-muted group-hover:text-brand group-hover:border-brand/30 transition-colors">
                {playingItem === (currentQ.audioString || currentQ.answer) ? <Loader2 size={14} className="animate-spin text-brand" /> : <Volume2 size={14} className="text-ink-muted group-hover:text-brand transition-colors" />} 
                Tap to hear
              </div>
            )}
          </button>
        )}

        {!currentQ.prominentTibetan && currentQ.audioString && !currentQ.noAudio && (
          <Button 
            variant="outline"
            onClick={() => playAudio(currentQ.audioString!)} 
            className="w-full max-w-[240px] border-2 shadow-sm rounded-full py-3.5"
          >
            {playingItem === currentQ.audioString ? <Loader2 size={18} className="animate-spin text-brand" /> : <Volume2 size={18} className="text-brand-dark" />} 
            {currentQ.isAudioType ? "Play Audio" : "Hear Sound"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-8">
        {currentQ.choices.map((c: QuizChoice, idx: number) => {
          const isRight = picked && c.value === currentQ.answer;
          const isWrongPicked = picked === c.value && c.value !== currentQ.answer;
          
          let stateClass = "bg-white border-border-subtle hover:border-brand hover:shadow-md text-ink shadow-sm";
            
          if (picked) {
            if (isRight) {
              stateClass = "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm z-10 scale-[1.02] transition-transform";
            } else if (isWrongPicked) {
              stateClass = "bg-rose-50 text-rose-700 border-rose-400 shadow-sm";
            } else {
              stateClass = "bg-surface-muted text-ink-muted opacity-50 border-border-subtle";
            }
          }

          return (
            <button
              key={`choice-${step}-${idx}`} 
              disabled={!!picked} 
              onClick={() => {
                if (!picked) pick(c.value);
              }}
              className={`relative py-4 sm:py-6 px-2 sm:px-4 text-center transition-all flex flex-col items-center justify-center border-2 min-h-[5.5rem] w-full ${isNative ? 'rounded-2xl' : 'rounded-[1.25rem]'} ${stateClass}`}
            >
              {picked && isRight && (
                <div className="absolute top-2.5 right-2.5 text-emerald-500">
                  <Check size={18} strokeWidth={3} />
                </div>
              )}
              {picked && isWrongPicked && (
                <div className="absolute top-2.5 right-2.5 text-rose-500">
                  <X size={18} strokeWidth={3} />
                </div>
              )}

              {c.label ? (
                <div className={`text-lg md:text-xl font-bold px-2 ${c.isTibetan ? 'font-tibetan text-[2rem] pt-2 leading-none' : currentQ.type === 'combo' ? 'font-mono tracking-widest' : 'font-sans leading-snug'}`}>{c.label}</div>
              ) : (
                <>
                  {c.emoji && !isVocab && <span className="text-3xl mb-2">{c.emoji}</span>}
                  <span className="font-tibetan text-[2.5rem] sm:text-[3rem] leading-none pt-1">{c.tib || c.value}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {picked && (
        <div ref={feedbackRef} className="flex flex-col gap-4 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`p-4 text-center text-[15px] font-medium rounded-2xl border ${picked === currentQ.answer ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
            {picked === currentQ.answer ? (
              "Correct!"
            ) : (
              <span>
                Not quite — the answer was{' '}
                <span className="font-bold ml-1 inline-flex items-baseline gap-1.5">
                  {(() => {
                    const correctC = currentQ.choices.find(ch => ch.value === currentQ.answer);
                    if (!correctC) return currentQ.answer;
                    
                    const formatBracketed = (str: string) => {
                      const clean = str.trim();
                      if (clean.startsWith('[') && clean.endsWith(']')) return clean;
                      return `[${clean}]`;
                    };

                    if (correctC.label) {
                      return correctC.label;
                    }

                    return (
                      <>
                        {correctC.tib && <span className="font-tibetan text-[20px] translate-y-0.5">{correctC.tib}</span>}
                        {correctC.pron && <span className="font-mono">{formatBracketed(correctC.pron)}</span>}
                        {(!correctC.pron && correctC.translit) && <span className="font-mono">{formatBracketed(correctC.translit)}</span>}
                        {correctC.en && <span>"{correctC.en}"</span>}
                      </>
                    );
                  })()}
                </span>
              </span>
            )}
          </div>
          
          <button 
            onClick={() => { 
              if (stopAudio) stopAudio();
              setPicked(null); 
              setStep((s) => s + 1); 
            }} 
            className="self-center inline-flex items-center justify-center gap-2 px-8 py-3 mt-1 text-[14px] font-bold transition shadow-sm shrink-0 bg-ink text-white hover:bg-ink-light rounded-full active:scale-95"
          >
            {step + 1 === total ? 'See Results' : 'Next Question'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
