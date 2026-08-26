// app/components/QuizModule.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, Volume2, ChevronRight, Trophy, Sparkles, 
  Lock, CheckCircle2, XCircle, Shuffle, ArrowRight 
} from "lucide-react";
import { DEV_BYPASS_LOCKS } from "@/app/config";

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
  [key: string]: unknown;
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
  answerObj?: QuizDataRow;
  choices: QuizChoice[];
}

interface QuizModuleProps {
  title: string;
  intro?: string;
  data?: QuizDataRow[];
  questions?: QuizQuestion[];
  playAudio: (text: string) => void;
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
}

export default function QuizModule({ 
  title, 
  intro, 
  data, 
  questions: providedQuestions,
  playAudio, 
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
  isNightMode = false
}: QuizModuleProps) {

  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(!isUnlockTest);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  
  const questions = useMemo(() => {
    if (providedQuestions) return providedQuestions;
    if (!data) return [];
    
    const qs: QuizQuestion[] = [];
    // Shuffle the deck so we draw unique questions without replacement
    const shuffledData = [...data].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < questionCount; i++) {
      const isAudioType = !isVocabMatch && Math.random() > 0.5;
      // Draw the next unique item (loops back around safely if count > data length)
      const answer = shuffledData[i % shuffledData.length];
      const wrongs = data.filter((x: QuizDataRow) => x.tib !== answer.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
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
  }, [data, providedQuestions, questionCount, isVocabMatch]);

  const total = providedQuestions ? providedQuestions.length : questionCount;
  const currentQ = questions[step];

  // Checks if we have already saved to prevent infinite re-renders
  useEffect(() => {
    if (step >= total && !hasAutoSaved) {
      const passed = (score / total) >= 0.8 || DEV_BYPASS_LOCKS;
      if (passed && onPass) {
        onPass();
        setHasAutoSaved(true);
      }
    }
  }, [step, total, score, onPass, hasAutoSaved]);

  if (!hasStarted) {
    return (
      <div className={`border p-6 md:p-8 ${isUnlockTest ? 'bg-white border-stone-200 shadow-sm' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Trophy className="size-3.5" /> Step Complete
        </div>
        <h3 className="text-2xl font-serif text-stone-900 mb-2">Ready to complete this step?</h3>
        <p className="text-sm text-stone-600 mb-6">
          {total} questions drawn from everything you covered in this lesson. Score <span className="font-bold">80%</span> or higher to pass. You can retake the test as many times as you like.
        </p>
        <button 
          onClick={() => setHasStarted(true)} 
          className="bg-amber-500 text-stone-900 font-bold px-6 py-2.5 flex items-center gap-2 hover:bg-amber-400 transition-colors mb-8 border border-amber-600 shadow-sm"
        >
          Start <ChevronRight size={16} />
        </button>
        
        <div className="border border-stone-200 p-5 bg-[#fafaf9]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
             <Lock size={14} /> Progression
          </div>
          <p className="text-sm text-stone-600 mb-4">Passing this test unlocks the next step in the syllabus. Your progress is saved locally in your browser.</p>
          <ul className="space-y-2 text-sm text-stone-600">
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Mix of recognition and pronunciation prompts</li>
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Immediate feedback after each question</li>
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited retakes — best score is kept</li>
          </ul>
        </div>
      </div>
    );
  }

  if (step >= total) {
    // Render compact panel finish screen if using the panel variant
    if (variant === 'panel') {
      return (
        <div 
          className="flex flex-wrap items-center justify-between gap-4 p-5 border bg-surface"
          style={isNightMode ? { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' } : { borderColor: 'var(--color-border-strong)' }}
        >
          <div className={`text-[15px] font-bold ${isNightMode ? "text-stone-200" : "text-ink"}`}>
            Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: accentColor || 'var(--color-brand)' }}>{score}</span> / {total}.
          </div>
          <button 
            onClick={() => { setStep(0); setScore(0); setPicked(null); setHasAutoSaved(false); }} 
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium border transition-colors ${isNightMode ? "bg-white/10 text-white border-white/20 hover:bg-white/20" : "bg-transparent text-ink border-border-strong hover:bg-surface-muted"}`}
          >
            <Shuffle size={14} /> Try again
          </button>
        </div>
      );
    }

    const passed = (score / total) >= 0.8 || DEV_BYPASS_LOCKS;
    
    const handleUnlock = async () => {
      setIsSaving(true);
      if (nextLessonPath) {
        router.push(nextLessonPath);
      } else {
        setIsSaving(false);
      }
    };

    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 border ${isUnlockTest ? 'bg-white border-stone-200 shadow-sm' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border ${passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
          {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">{passed ? "Test Passed!" : "Keep Practicing"}</h3>
        <p className="text-stone-600 mb-8 font-bold text-lg">You scored <span className={passed ? "text-emerald-600" : "text-rose-600"}>{score}</span> out of {total}.</p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => { setStep(0); setScore(0); setPicked(null); setHasAutoSaved(false); if(isUnlockTest) setHasStarted(false); }} 
            className="px-6 py-3 bg-white border border-stone-200 font-bold hover:bg-stone-50 transition-colors text-stone-700 flex items-center gap-2 disabled:opacity-50" 
            disabled={isSaving}
          >
            <Shuffle size={18} /> Retake
          </button>
          
          {passed && isUnlockTest && nextLessonPath && (
            <button onClick={handleUnlock} disabled={isSaving} className="px-8 py-3 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-75">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>Unlock Next Step <ArrowRight size={18} /></>}
            </button>
          )}
          {passed && isUnlockTest && !nextLessonPath && (
            <button onClick={handleUnlock} disabled={isSaving} className="px-8 py-3 bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-2 border border-amber-600 disabled:opacity-75">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>Lesson Complete <ArrowRight size={18} /></>}
            </button>
          )}
        </div>
        {DEV_BYPASS_LOCKS && !passed && isUnlockTest && (
          <div className="mt-6 text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1.5 border border-rose-200">DEV_BYPASS_LOCKS is true — you may proceed manually.</div>
        )}
      </div>
    );
  }

  const pick = (val: string) => {
    if (picked) return;
    setPicked(val);
    if (val === currentQ.answer) {
      setScore(s => s + 1);
      if (currentQ.audioString || currentQ.answer) playAudio(currentQ.audioString || currentQ.answer);
    } else {
      playErrorBeep();
    }
  };

  const isVocab = isVocabMatch || 
                  currentQ.type === 'vocab' || 
                  (currentQ.questionText && (
                    currentQ.questionText.includes("Tibetan word for") || 
                    currentQ.questionText.includes("Which word means") || 
                    currentQ.questionText.includes("matching Tibetan word")
                  ));
 
  const readingToDisplay = isLesson1 ? (currentQ.answerObj?.translit || currentQ.answerObj?.pron) : (currentQ.answerObj?.pron || currentQ.answerObj?.translit);

  let containerClass = `border ${variant === 'panel' ? '' : 'p-6 md:p-8'} `;
  if (variant === 'default') {
    containerClass += isUnlockTest ? 'bg-white border-stone-200 shadow-sm ' : 'bg-[#fffdf5] border-[#fde68a] ';
  }
  
  const textInkClass = isNightMode ? 'text-stone-200' : 'text-stone-900';
  const textMutedClass = isNightMode ? 'text-stone-400' : 'text-stone-500';
  const textLightClass = isNightMode ? 'text-stone-300' : 'text-stone-600';
  const borderClass = isNightMode ? 'border-white/10' : 'border-stone-200';

  return (
    <div className={containerClass}>
      {variant === 'default' && !isUnlockTest && (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Sparkles size={14} /> Checkpoint
        </div>
      )}
      
      {variant === 'default' && (
        <>
          <h3 className={`text-xl font-serif mb-2 ${textInkClass}`}>{title}</h3>
          {intro && <p className={`text-sm mb-6 ${textLightClass}`}>{intro}</p>}
        </>
      )}

      <div className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-b pb-3 mb-6 ${textMutedClass} ${borderClass}`}>
        <span>{variant === 'panel' && title ? `${title} · ` : ''}Question {step + 1} of {total}</span>
        <span style={{ color: accentColor || '#f59e0b' }}>Score {score}</span>
      </div>

      {currentQ.promptText ? (
        // NEW MINI-MASTERY PROMPT STYLE
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className={`text-[15px] font-bold ${textLightClass}`}>{currentQ.promptText}</span>
          {currentQ.promptHighlight && (
            currentQ.promptAudio ? (
              <button onClick={() => playAudio(currentQ.promptAudio!)} disabled={playingItem !== null} className={`group relative font-tibetan text-3xl font-bold border px-4 py-2 flex items-center gap-3 shadow-sm transition-colors ${isNightMode ? 'bg-white/10 border-white/20 text-white hover:border-white/40' : 'border-border-strong bg-surface text-ink hover:text-brand hover:border-brand'}`}>
                <span className="pt-1">{currentQ.promptHighlight}</span>
                {playingItem === currentQ.promptAudio ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className={`text-ink-muted group-hover:text-brand transition-colors ${isNightMode && !playingItem ? 'text-stone-400' : ''}`} />}
              </button>
            ) : (
              <span className={`font-tibetan text-3xl font-bold border px-4 py-2 ${isNightMode ? 'bg-white/10 border-white/20 text-white' : 'border-border-strong bg-surface text-ink'}`}>
                <span className="pt-1">{currentQ.promptHighlight}</span>
              </span>
            )
          )}
          {currentQ.promptEnd && <span className={`text-[15px] font-bold ${textLightClass}`}>{currentQ.promptEnd}</span>}
        </div>
      ) : (
        // STANDARD PROMPT STYLE
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${textMutedClass}`}>Prompt</div>
            {currentQ.questionText ? (
              <span className={`text-xl ${textInkClass}`}>{currentQ.questionText}</span>
            ) : isVocab ? (
              <span className={`text-xl ${textInkClass}`}>Which word means <span className="font-bold">"{currentQ.answerObj?.en}"</span>?</span>
            ) : currentQ.isAudioType ? (
              <span className={`text-xl ${textInkClass}`}>Listen and select the matching option.</span>
            ) : (
              <span className={`text-xl ${textInkClass}`}>Which option reads <span className={`font-mono px-2 py-0.5 border ${isNightMode ? 'bg-white/10 border-white/20' : 'bg-stone-100 border-stone-200'}`}>{readingToDisplay}</span>?</span>
            )}
            
            {currentQ.prominentTibetan && (
              <div className="mt-4"><span className={`font-serif leading-[1.4] pb-4 block ${textInkClass}`} style={{ fontSize: "7rem" }}>{currentQ.prominentTibetan}</span></div>
            )}
          </div>
          
          {(!isVocab && !currentQ.questionText) && !currentQ.prominentTibetan && (
            <button onClick={() => playAudio(currentQ.audioString || currentQ.answer)} disabled={playingItem !== null} className={`inline-flex items-center justify-center gap-2 border px-5 py-2 font-bold transition-colors shrink-0 ${isNightMode ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : currentQ.isAudioType ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}>
               {playingItem === (currentQ.audioString || currentQ.answer) ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} 
               {currentQ.isAudioType ? "PLAY AUDIO" : "Play Hint"}
            </button>
          )}
          
          {currentQ.audioString && !currentQ.prominentTibetan && currentQ.questionText && (
            <button onClick={() => playAudio(currentQ.audioString!)} disabled={playingItem !== null} className={`inline-flex items-center gap-2 border px-6 py-2.5 text-sm font-bold transition-colors shadow-sm mt-4 sm:mt-0 shrink-0 ${isNightMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'border-black/10 bg-white text-stone-700 hover:bg-stone-100'}`}>
              {playingItem === currentQ.audioString ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className={isNightMode ? "" : "text-amber-500"} />} Hear Sound
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {currentQ.choices.map((c: QuizChoice) => {
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
              key={c.value} 
              disabled={!!picked && !isRight} 
              onClick={() => {
                if (!picked) pick(c.value);
                else if (isRight) playAudio(currentQ.audioTarget || currentQ.audioString || currentQ.answer);
              }}
              className={`relative ${variant === 'panel' ? 'py-4 md:py-6' : 'py-6'} px-4 text-center transition-all flex flex-col items-center justify-center border-2 ${stateClass}`}
            >
              {isRight && (
                <div className="absolute top-2 right-2 text-emerald-600 opacity-70">
                  {playingItem === (currentQ.audioTarget || currentQ.audioString || currentQ.answer) ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                </div>
              )}
              {c.label ? (
                <div className={`text-lg md:text-xl font-bold ${c.isTibetan ? 'font-tibetan text-[2rem] pt-2' : currentQ.type === 'combo' ? 'font-mono tracking-widest' : 'font-sans'}`}>{c.label}</div>
              ) : (
                <>
                  {c.emoji && !isVocab && <span className="text-3xl mb-2">{c.emoji}</span>}
                  <span className="font-tibetan text-[3rem] sm:text-[3.5rem] leading-normal pb-2">{c.tib || c.value}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border shadow-sm ${isNightMode ? 'bg-white/5 border-white/10' : 'bg-stone-50 border-stone-200'}`}>
          <span className={`text-sm font-bold ${picked === currentQ.answer ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === currentQ.answer ? "Correct!" : currentQ.explanation || `Incorrect.`}
          </span>
          <button onClick={() => { setPicked(null); setStep((s) => s + 1); }} className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold transition shadow-sm ${isNightMode ? 'bg-white text-stone-900 hover:bg-stone-200' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
            {step + 1 === total ? 'See Results' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}