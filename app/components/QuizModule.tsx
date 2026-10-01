// app/components/QuizModule.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/clerk-react";
import { 
  Loader2, Volume2, ChevronRight, Trophy, Sparkles, 
  Lock, CheckCircle2, XCircle, Shuffle, ArrowRight 
} from "lucide-react";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import { usePlatform } from "@/hooks/usePlatform";

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
  variant?: "default" | "panel";
  accentColor?: string;
  isNightMode?: boolean;
  hideHeader?: boolean;
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
  variant = "default",
  accentColor,
  isNightMode = false,
  hideHeader = false
}: QuizModuleProps) {



  const router = useRouter();
  const pathname = usePathname();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();
  
  const [hasStarted, setHasStarted] = useState(!isUnlockTest);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  
  // NEW: Track if we've fired the database save for this attempt
  const [hasSavedScore, setHasSavedScore] = useState(false);

  const feedbackRef = useRef<HTMLDivElement>(null);
  const topOfQuizRef = useRef<HTMLDivElement>(null);
  const prevStep = useRef(step);
  const prevStarted = useRef(hasStarted);

  // Auto-scroll logic
  useEffect(() => {
    if (picked && feedbackRef.current) {
      setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  }, [picked]);

  useEffect(() => {
    const justStarted = hasStarted && !prevStarted.current;
    const stepChanged = step > prevStep.current;
    if ((justStarted || stepChanged) && !picked && topOfQuizRef.current) {
      setTimeout(() => topOfQuizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
    prevStep.current = step;
    prevStarted.current = hasStarted;
  }, [step, hasStarted, picked]);

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
        choices: choices.map((c: QuizDataRow) => ({ value: c.tib, tib: c.tib, translit: c.translit, pron: c.pron, en: c.en, emoji: c.emoji, label: c.label }))
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
  // Save the score silently to the database when finished
  // ========================================================
  useEffect(() => {
    if (step > 0 && step >= total && !hasSavedScore) {
      setHasSavedScore(true);

      const saveScoreToDb = async () => {
        try {
          // Prefer propModuleId; fallback to extracting from the URL
          const match = pathname?.match(/lessons\/(\d+)/);
          const effectiveModuleId = propModuleId !== undefined ? propModuleId : (match ? parseInt(match[1], 10) : 1);
          const effectiveTitle = (quizTitle || title || "").trim();

          const token = await getToken();
          if (!token || !effectiveTitle) {
            console.warn("QuizModule: Skipped saving score - missing auth token or valid title.");
            return;
          }
          
          const formData = new FormData();
          formData.append('module_id', effectiveModuleId.toString());
          formData.append('quiz_title', effectiveTitle);
          formData.append('score', score.toString());
          formData.append('total', total.toString());
          
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/save-quiz-score`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error("QuizModule: Server failed to save score:", res.status, errText);
          }
        } catch (e) {
          console.error("QuizModule: Failed to save score to database", e);
        }
      };
      
      saveScoreToDb();
    }
  }, [step, total, score, hasSavedScore, title, quizTitle, propModuleId, pathname, getToken]);
  

  // Handle the pass/unlock mechanic (unchanged)
  useEffect(() => {
    if (step > 0 && step >= total && !hasAutoSaved) {
      const passed = (score / total) >= 0.8 || DEV_BYPASS_LOCKS;
      if (passed && onPass) {
        onPass();
        setHasAutoSaved(true);
      }
    }
  }, [step, total, score, onPass, hasAutoSaved]);

  const resetQuiz = () => {
    if (stopAudio) stopAudio();
    setStep(0); 
    setScore(0); 
    setPicked(null); 
    setHasAutoSaved(false); 
    setHasSavedScore(false); // NEW: Allow saving again if they retake
    setQuizSeed(s => s + 1); 
  };

  if (!hasStarted) {
    return (
      <div className={`border p-6 md:p-8 ${isNative ? 'rounded-[1.25rem]' : ''} ${isUnlockTest ? 'bg-white border-stone-200 shadow-sm' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Trophy className="size-3.5" /> Step Complete
        </div>
        <h3 className="text-2xl font-serif text-stone-900 mb-2">Ready to complete this step?</h3>
        <p className="text-sm text-stone-600 mb-6">
          {total} questions drawn from everything you covered in this lesson.
        </p>
        <button onClick={() => setHasStarted(true)} className={`bg-amber-500 text-stone-900 font-bold px-6 py-2.5 flex items-center gap-2 hover:bg-amber-400 transition-colors mb-8 border border-amber-600 shadow-sm ${isNative ? 'rounded-full' : ''}`}>
          Start <ChevronRight size={16} />
        </button>
        <div className={`border border-stone-200 p-5 bg-[#fafaf9] ${isNative ? 'rounded-[1.25rem]' : ''}`}>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
             <Lock size={14} /> Progression
          </div>
          <p className="text-sm text-stone-600 mb-4">Passing this test unlocks the next step in the syllabus. Your progress is saved securely to your account.</p>
          <ul className="space-y-2 text-sm text-stone-600">
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
        <div className={`flex flex-wrap items-center justify-between gap-4 p-5 border bg-surface ${isNative ? 'rounded-[1.25rem]' : ''}`} style={isNightMode ? { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' } : { borderColor: 'var(--color-border-strong)' }}>
          <div className={`text-[15px] font-bold ${isNightMode ? "text-stone-200" : "text-ink"}`}>
            Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: accentColor || 'var(--color-brand)' }}>{score}</span> / {total}.
          </div>
          <button onClick={resetQuiz} className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium border transition-colors ${isNative ? 'rounded-full' : ''} ${isNightMode ? "bg-white/10 text-white border-white/20 hover:bg-white/20" : "bg-transparent text-ink border-border-strong hover:bg-surface-muted"}`}>
            <Shuffle size={14} /> Try again
          </button>
        </div>
      );
    }

    const passed = (score / total) >= 0.8 || DEV_BYPASS_LOCKS;
    
    const handleUnlock = async () => {
      setIsSaving(true);
      if (nextLessonPath) router.push(nextLessonPath);
      else setIsSaving(false);
    };

    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 border ${isNative ? 'rounded-[1.25rem] mb-4' : ''} ${isUnlockTest ? 'bg-white border-stone-200 shadow-sm' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border ${passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
          {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">{passed ? "Test Passed!" : "Keep Practicing"}</h3>
        <p className="text-stone-600 mb-8 font-bold text-lg">You scored <span className={passed ? "text-emerald-600" : "text-rose-600"}>{score}</span> out of {total}.</p>
        
        <div className="flex gap-4">
          <button onClick={() => { resetQuiz(); if(isUnlockTest) setHasStarted(false); }} className={`px-6 py-3 bg-white border border-stone-200 font-bold hover:bg-stone-50 transition-colors text-stone-700 flex items-center gap-2 disabled:opacity-50 ${isNative ? 'rounded-full' : ''}`} disabled={isSaving}>
            <Shuffle size={18} /> Retake
          </button>
          
          {passed && isUnlockTest && nextLessonPath && (
            <button onClick={handleUnlock} disabled={isSaving} className={`px-8 py-3 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-75 ${isNative ? 'rounded-full' : ''}`}>
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>Unlock Next Step <ArrowRight size={18} /></>}
            </button>
          )}
          {passed && isUnlockTest && !nextLessonPath && (
            <button onClick={handleUnlock} disabled={isSaving} className={`px-8 py-3 bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-2 border border-amber-600 disabled:opacity-75 ${isNative ? 'rounded-full' : ''}`}>
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>Lesson Complete <ArrowRight size={18} /></>}
            </button>
          )}
        </div>
        {DEV_BYPASS_LOCKS && !passed && isUnlockTest && (
          <div className={`mt-6 text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1.5 border border-rose-200 ${isNative ? 'rounded-full' : ''}`}>DEV_BYPASS_LOCKS is true — you may proceed manually.</div>
        )}
      </div>
    );
  }

  const pick = (val: string) => {
    if (picked) return;
    setPicked(val);
    if (val === currentQ.answer) {
      setScore(s => s + 1);
      if (!currentQ.noAudio) playAudio(currentQ.audioTarget || currentQ.audioString || currentQ.answer);
    } else {
      playErrorBeep();
    }
  };

  const isVocab = isVocabMatch || currentQ.type === 'vocab' || (currentQ.questionText && (currentQ.questionText.includes("Tibetan word for") || currentQ.questionText.includes("Which word means") || currentQ.questionText.includes("matching Tibetan word")));
  const readingToDisplay = isLesson1 ? (currentQ.answerObj?.translit || currentQ.answerObj?.pron) : (currentQ.answerObj?.pron || currentQ.answerObj?.translit);
  const isReadingTest = currentQ?.questionText && (currentQ.questionText.toLowerCase().includes("read") || currentQ.questionText.toLowerCase().includes("pronounce"));
  const canPlayProminentAudio = !isReadingTest || picked !== null;

  let containerClass = `border pb-12 w-full ${variant === 'panel' ? '' : 'p-6 md:p-8'} `;
  if (variant === 'default') {
    containerClass += isUnlockTest ? 'bg-white border-stone-200 shadow-sm ' : 'bg-[#fffdf5] border-[#fde68a] ';
    if (isNative) containerClass += 'rounded-[1.25rem] overflow-hidden ';
  }
  
  const textInkClass = isNightMode ? 'text-stone-200' : 'text-stone-900';
  const textMutedClass = isNightMode ? 'text-stone-400' : 'text-stone-500';
  const textLightClass = isNightMode ? 'text-stone-300' : 'text-stone-600';
  const borderClass = isNightMode ? 'border-white/10' : 'border-stone-200';

  if (!currentQ) return null;

  return (
    <div className={containerClass}>
      {variant === 'default' && !hideHeader && !isUnlockTest && (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Sparkles size={14} /> Checkpoint
        </div>
      )}
      
      {variant === 'default' && !hideHeader && (
        <>
          <h3 className={`text-xl font-serif mb-2 ${textInkClass}`}>{title}</h3>
          {intro && <p className={`text-sm mb-6 ${textLightClass}`}>{intro}</p>}
        </>
      )}

      <div ref={topOfQuizRef} className={`scroll-mt-24 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-b pb-3 mb-6 ${textMutedClass} ${borderClass}`}>
        <span>{variant === 'panel' && title ? `${title} · ` : ''}Question {step + 1} of {total}</span>
        <span style={{ color: accentColor || '#f59e0b' }}>Score {score}</span>
      </div>

      {currentQ.promptText ? (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className={`text-[15px] font-bold ${textLightClass}`}>{currentQ.promptText}</span>
          {currentQ.promptHighlight && (
            currentQ.promptAudio ? (
              <button onClick={() => playAudio(currentQ.promptAudio!)} disabled={playingItem !== null} className={`group relative font-tibetan text-3xl font-bold border px-4 py-2 flex items-center gap-3 shadow-sm transition-colors ${isNative ? 'rounded-full' : ''} ${isNightMode ? 'bg-white/10 border-white/20 text-white hover:border-white/40' : 'border-border-strong bg-surface text-ink hover:text-brand hover:border-brand'}`}>
                <span className="pt-1">{currentQ.promptHighlight}</span>
                {playingItem === currentQ.promptAudio ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className={`text-ink-muted group-hover:text-brand transition-colors ${isNightMode && !playingItem ? 'text-stone-400' : ''}`} />}
              </button>
            ) : (
              <span className={`font-tibetan text-3xl font-bold border px-4 py-2 ${isNative ? 'rounded-xl' : ''} ${isNightMode ? 'bg-white/10 border-white/20 text-white' : 'border-border-strong bg-surface text-ink'}`}>
                <span className="pt-1">{currentQ.promptHighlight}</span>
              </span>
            )
          )}
          {currentQ.promptEnd && <span className={`text-[15px] font-bold ${textLightClass}`}>{currentQ.promptEnd}</span>}
        </div>
      ) : (
        <div className="flex flex-col gap-6 mb-8 w-full">
          <div>
            {currentQ.questionText ? (
              <span className={`text-xl ${textInkClass}`}>{currentQ.questionText}</span>
            ) : isVocab ? (
              <span className={`text-xl ${textInkClass}`}>Which word means <span className="font-bold">"{currentQ.answerObj?.en}"</span>?</span>
            ) : currentQ.isAudioType ? (
              <span className={`text-xl ${textInkClass}`}>Listen and select the matching option.</span>
            ) : (
              <span className={`text-xl ${textInkClass}`}>Which option reads <span className={`font-mono px-2 py-0.5 border ${isNative ? 'rounded-md' : ''} ${isNightMode ? 'bg-white/10 border-white/20' : 'bg-stone-100 border-stone-200'}`}>{readingToDisplay}</span>?</span>
            )}
          </div>
          
          {currentQ.prominentTibetan && (
            <button 
              onClick={() => canPlayProminentAudio && playAudio(currentQ.audioString || currentQ.answer)}
              disabled={playingItem !== null || !canPlayProminentAudio}
              className={`w-full flex flex-col items-center justify-center py-8 border shadow-sm transition-all ${canPlayProminentAudio ? 'active:scale-95 group hover:border-brand hover:bg-surface cursor-pointer' : 'cursor-default'} ${isNative ? 'rounded-2xl' : ''} ${isNightMode ? 'bg-white/5 border-white/10' : 'bg-surface-muted border-border-strong'}`}
            >
              <span className={`font-tibetan text-6xl md:text-7xl leading-none pt-2 ${canPlayProminentAudio ? 'mb-5 group-hover:text-brand' : 'mb-0'} ${textInkClass} transition-colors`}>{currentQ.prominentTibetan}</span>
              {canPlayProminentAudio && !currentQ.noAudio && (
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${isNightMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-border-strong text-ink-muted group-hover:text-brand group-hover:border-brand/30'}`}>
                  {playingItem === (currentQ.audioString || currentQ.answer) ? <Loader2 size={14} className="animate-spin text-brand" /> : <Volume2 size={14} className="text-ink-muted group-hover:text-brand transition-colors" />} 
                  Tap to hear
                </div>
              )}
            </button>
          )}
          
          {!currentQ.prominentTibetan && currentQ.audioString && !currentQ.noAudio && (
            <div className="flex items-center gap-3">
              <button 
                 onClick={() => playAudio(currentQ.audioString!)} 
                 disabled={playingItem !== null} 
                 className={`inline-flex items-center justify-center w-full sm:w-auto gap-2 border-2 px-6 py-3 text-[15px] font-bold transition-colors shadow-sm shrink-0 ${isNative ? 'rounded-full' : ''} ${isNightMode ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : 'bg-surface-muted border-border-strong text-ink hover:border-brand hover:bg-white'}`}
              >
                {playingItem === currentQ.audioString ? <Loader2 size={18} className="animate-spin text-brand" /> : <Volume2 size={18} className="text-brand-dark" />} 
                {currentQ.isAudioType ? "Play Audio" : "Hear Sound"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {currentQ.choices.map((c: QuizChoice, idx: number) => {
          const isRight = picked && c.value === currentQ.answer;
          const isWrong = picked === c.value && c.value !== currentQ.answer;
          
          let stateClass = isNightMode 
            ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-white" 
            : "bg-white border-stone-200 hover:border-brand hover:bg-brand-light text-stone-900 hover:shadow-sm";
            
          if (isRight) stateClass = "bg-emerald-50 text-emerald-700 border-emerald-500 cursor-pointer hover:bg-emerald-100 shadow-sm";
          else if (isWrong) stateClass = "bg-rose-50 text-rose-700 border-rose-400 opacity-80";
          else if (picked) stateClass = isNightMode ? "bg-white/5 border-white/5 text-stone-500 opacity-50" : "bg-stone-50 text-stone-300 opacity-60 border-stone-200";

          return (
            <button
              key={`choice-${step}-${idx}`} 
              disabled={!!picked && !isRight} 
              onClick={() => {
                if (!picked) pick(c.value);
                else if (isRight && !currentQ.noAudio) playAudio(currentQ.audioTarget || currentQ.audioString || currentQ.answer);
              }}
              className={`relative py-3 sm:py-6 px-2 sm:px-4 text-center transition-all flex flex-col items-center justify-center border-2 min-h-[5rem] w-full ${isNative ? 'rounded-2xl' : ''} ${stateClass}`}
            >
              {isRight && !currentQ.noAudio && (
                <div className="absolute top-2 right-2 text-emerald-600 opacity-70">
                  {playingItem === (currentQ.audioTarget || currentQ.audioString || currentQ.answer) ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                </div>
              )}
              {c.label ? (
                <div className={`text-lg md:text-xl font-bold ${c.isTibetan ? 'font-tibetan text-[2rem] pt-2' : currentQ.type === 'combo' ? 'font-mono tracking-widest' : 'font-sans'}`}>{c.label}</div>
              ) : (
                <>
                  {c.emoji && !isVocab && <span className="text-3xl mb-2">{c.emoji}</span>}
                  <span className="font-tibetan text-[3rem] sm:text-[3.5rem] leading-none pt-1 pb-1">{c.tib || c.value}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {picked && (
        <div ref={feedbackRef} className={`mt-6 flex flex-row items-center justify-between gap-3 p-4 border shadow-sm w-full ${isNative ? 'rounded-[1.25rem]' : ''} ${isNightMode ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
          <span className={`text-sm font-bold ${picked === currentQ.answer ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === currentQ.answer ? "Correct!" : currentQ.explanation || `Incorrect.`}
          </span>
          <button 
            onClick={() => { 
              if (stopAudio) stopAudio();
              setPicked(null); 
              setStep((s) => s + 1); 
            }} 
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold transition shadow-sm shrink-0 ${isNative ? 'rounded-full' : ''} ${isNightMode ? 'bg-white text-stone-900 hover:bg-stone-200' : 'bg-stone-900 text-white hover:bg-stone-800'}`}
          >
            {step + 1 === total ? 'See Results' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}