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
    const shuffledData = [...data].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < questionCount; i++) {
      const isAudioType = !isVocabMatch && Math.random() > 0.5;
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
      <div className={`border p-6 md:p-8 rounded-3xl ${isUnlockTest ? 'bg-surface border-border-subtle shadow-sm' : 'bg-brand-light border-brand/20'}`}>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-4">
          <Trophy className="size-3.5" /> Step Complete
        </div>
        <h3 className="text-2xl font-serif text-ink mb-2">Ready to complete this step?</h3>
        <p className="text-sm text-ink-light mb-6">
          {total} questions drawn from everything you covered in this lesson. Score <span className="font-bold">80%</span> or higher to pass. You can retake the test as many times as you like.
        </p>
        <button 
          onClick={() => setHasStarted(true)} 
          className="bg-brand text-ink font-bold px-8 py-3.5 flex items-center gap-2 hover:brightness-95 transition-all mb-8 shadow-sm rounded-full active:scale-95"
        >
          Start <ChevronRight size={16} />
        </button>
        
        <div className="border border-border-subtle p-5 bg-surface rounded-2xl">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3">
             <Lock size={14} /> Progression
          </div>
          <p className="text-sm text-ink-light mb-4">Passing this test unlocks the next step in the syllabus. Your progress is saved locally in your browser.</p>
          <ul className="space-y-2 text-sm text-ink-light">
             <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Mix of recognition and pronunciation prompts</li>
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
        <div 
          className="flex flex-wrap items-center justify-between gap-4 p-5 border bg-surface rounded-3xl"
          style={isNightMode ? { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' } : { borderColor: 'var(--color-border-strong)' }}
        >
          <div className={`text-[15px] font-bold ${isNightMode ? "text-stone-200" : "text-ink"}`}>
            Nicely done. You scored <span className="font-serif text-2xl mx-1" style={{ color: accentColor || 'var(--color-brand)' }}>{score}</span> / {total}.
          </div>
          <button 
            onClick={() => { setStep(0); setScore(0); setPicked(null); setHasAutoSaved(false); }} 
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold transition-all rounded-full shadow-sm active:scale-95 ${isNightMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-surface border border-border-subtle text-ink hover:bg-surface-muted"}`}
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
      <div className={`flex flex-col items-center justify-center text-center p-8 border rounded-3xl ${isUnlockTest ? 'bg-surface border-border-subtle shadow-sm' : 'bg-brand-light border-brand/20'}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border ${passed ? 'bg-[#E6F4EA] text-[#1E4620] border-emerald-200' : 'bg-rose-50 text-destructive border-destructive'}`}>
          {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-ink mb-4">{passed ? "Test Passed!" : "Keep Practicing"}</h3>
        <p className="text-ink-light mb-8 font-bold text-lg">You scored <span className={passed ? "text-[#1E4620]" : "text-destructive"}>{score}</span> out of {total}.</p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => { setStep(0); setScore(0); setPicked(null); setHasAutoSaved(false); if(isUnlockTest) setHasStarted(false); }} 
            className="px-8 py-3.5 bg-surface border border-border-subtle font-bold hover:bg-surface-muted transition-all text-ink flex items-center gap-2 disabled:opacity-50 rounded-full active:scale-95" 
            disabled={isSaving}
          >
            <Shuffle size={18} /> Retake
          </button>
          
          {passed && isUnlockTest && nextLessonPath && (
            <button onClick={handleUnlock} disabled={isSaving} className="px-8 py-3.5 bg-ink text-white font-bold hover:bg-ink-light transition-all flex items-center gap-2 shadow-sm disabled:opacity-75 rounded-full active:scale-95">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>Unlock Next Step <ArrowRight size={18} /></>}
            </button>
          )}
          {passed && isUnlockTest && !nextLessonPath && (
            <button onClick={handleUnlock} disabled={isSaving} className="px-8 py-3.5 bg-brand text-ink font-bold hover:brightness-95 transition-all shadow-sm flex items-center gap-2 disabled:opacity-75 rounded-full active:scale-95">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <>Lesson Complete <ArrowRight size={18} /></>}
            </button>
          )}
        </div>
        {DEV_BYPASS_LOCKS && !passed && isUnlockTest && (
          <div className="mt-6 text-[10px] font-bold text-destructive uppercase tracking-widest bg-rose-50 px-3 py-1.5 border border-destructive rounded-full">DEV_BYPASS_LOCKS is true — you may proceed manually.</div>
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

  let containerClass = `border rounded-3xl ${variant === 'panel' ? '' : 'p-6 md:p-8'} `;
  if (variant === 'default') {
    containerClass += isUnlockTest ? 'bg-surface border-border-subtle shadow-sm ' : 'bg-brand-light border-brand/20 shadow-sm ';
  }
  
  const textInkClass = isNightMode ? 'text-stone-200' : 'text-ink';
  const textMutedClass = isNightMode ? 'text-stone-400' : 'text-ink-muted';
  const textLightClass = isNightMode ? 'text-stone-300' : 'text-ink-light';
  const borderClass = isNightMode ? 'border-white/10' : 'border-border-subtle';

  return (
    <div className={containerClass}>
      {variant === 'default' && !isUnlockTest && (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-4">
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
        <span style={{ color: accentColor || 'var(--color-brand-dark)' }}>Score {score}</span>
      </div>

      {currentQ.promptText ? (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className={`text-[15px] font-bold ${textLightClass}`}>{currentQ.promptText}</span>
          {currentQ.promptHighlight && (
            currentQ.promptAudio ? (
              <button onClick={() => playAudio(currentQ.promptAudio!)} disabled={playingItem !== null} className={`group relative font-tibetan text-3xl font-bold border px-4 py-2 flex items-center gap-3 shadow-sm transition-colors rounded-xl ${isNightMode ? 'bg-white/10 border-white/20 text-white hover:border-white/40' : 'border-border-strong bg-surface text-ink hover:text-brand hover:border-brand'}`}>
                <span className="pt-1">{currentQ.promptHighlight}</span>
                {playingItem === currentQ.promptAudio ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className={`text-ink-muted group-hover:text-brand transition-colors ${isNightMode && !playingItem ? 'text-stone-400' : ''}`} />}
              </button>
            ) : (
              <span className={`font-tibetan text-3xl font-bold border px-4 py-2 rounded-xl ${isNightMode ? 'bg-white/10 border-white/20 text-white' : 'border-border-strong bg-surface text-ink'}`}>
                <span className="pt-1">{currentQ.promptHighlight}</span>
              </span>
            )
          )}
          {currentQ.promptEnd && <span className={`text-[15px] font-bold ${textLightClass}`}>{currentQ.promptEnd}</span>}
        </div>
      ) : (
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
              <span className={`text-xl ${textInkClass}`}>Which option reads <span className={`font-mono px-2 py-0.5 border rounded ${isNightMode ? 'bg-white/10 border-white/20' : 'bg-surface-muted border-border-subtle'}`}>{readingToDisplay}</span>?</span>
            )}
            
            {currentQ.prominentTibetan && (
              <div className="mt-4"><span className={`font-serif leading-[1.4] pb-4 block ${textInkClass}`} style={{ fontSize: "7rem" }}>{currentQ.prominentTibetan}</span></div>
            )}
          </div>
          
          {(!isVocab && !currentQ.questionText) && !currentQ.prominentTibetan && (
            <button onClick={() => playAudio(currentQ.audioString || currentQ.answer)} disabled={playingItem !== null} className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-bold transition-all shrink-0 rounded-full active:scale-95 ${isNightMode ? 'bg-white/10 text-white hover:bg-white/20' : currentQ.isAudioType ? 'bg-brand text-ink hover:brightness-95 shadow-sm' : 'bg-surface border border-border-subtle text-ink hover:bg-surface-muted shadow-sm'}`}>
               {playingItem === (currentQ.audioString || currentQ.answer) ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} 
               {currentQ.isAudioType ? "PLAY AUDIO" : "Play Hint"}
            </button>
          )}
          
          {currentQ.audioString && !currentQ.prominentTibetan && currentQ.questionText && (
            <button onClick={() => playAudio(currentQ.audioString!)} disabled={playingItem !== null} className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all shadow-sm mt-4 sm:mt-0 shrink-0 rounded-full active:scale-95 ${isNightMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-surface border border-border-subtle text-ink hover:bg-surface-muted'}`}>
              {playingItem === currentQ.audioString ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} className={isNightMode ? "" : "text-brand"} />} Hear Sound
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
            : "bg-surface border-border-subtle hover:border-brand hover:shadow-md text-ink";
            
          if (isRight) stateClass = "bg-[#E6F4EA] text-[#1E4620] border-emerald-500 cursor-pointer hover:brightness-95 shadow-sm";
          else if (isWrong) stateClass = "bg-rose-50 text-destructive border-destructive opacity-80";
          else if (picked) stateClass = isNightMode ? "bg-white/5 border-white/5 text-ink-light opacity-50" : "bg-surface-muted text-ink-muted opacity-60 border-border-subtle";

          return (
            <button
              key={c.value} 
              disabled={!!picked && !isRight} 
              onClick={() => {
                if (!picked) pick(c.value);
                else if (isRight) playAudio(currentQ.audioTarget || currentQ.audioString || currentQ.answer);
              }}
              className={`relative ${variant === 'panel' ? 'py-4 md:py-6' : 'py-6'} px-4 text-center transition-all flex flex-col items-center justify-center border-2 rounded-3xl ${stateClass}`}
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
        <div className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border shadow-sm rounded-2xl ${isNightMode ? 'bg-white/5 border-white/10' : 'bg-surface border-border-subtle'}`}>
          <span className={`text-sm font-bold ${picked === currentQ.answer ? "text-[#1E4620]" : "text-destructive"}`}>
            {picked === currentQ.answer ? "Correct!" : currentQ.explanation || `Incorrect.`}
          </span>
          <button onClick={() => { setPicked(null); setStep((s) => s + 1); }} className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold transition-all shadow-sm rounded-full active:scale-95 ${isNightMode ? 'bg-white text-ink hover:bg-surface-muted' : 'bg-ink text-white hover:bg-ink-light'}`}>
            {step + 1 === total ? 'See Results' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}