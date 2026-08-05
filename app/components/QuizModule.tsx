"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Loader2, Volume2, ChevronRight, Trophy, Sparkles, 
  Lock, CheckCircle2, XCircle, Shuffle, ArrowRight 
} from "lucide-react";
import { DEV_BYPASS_LOCKS } from "@/app/config";

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
  isLesson1 
}: any) {
  const [hasStarted, setHasStarted] = useState(!isUnlockTest);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  
  const questions = useMemo(() => {
    if (providedQuestions) return providedQuestions;
    if (!data) return [];
    
    const qs = [];
    for (let i = 0; i < questionCount; i++) {
      const isAudioType = !isVocabMatch && Math.random() > 0.5;
      const answer = data[Math.floor(Math.random() * data.length)];
      const wrongs = data.filter((x: any) => x.tib !== answer.tib).sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [answer, ...wrongs].sort(() => 0.5 - Math.random());
      
      qs.push({
        isAudioType,
        answer: answer.tib,
        // CACHE BUSTER: Checks if it has an audio override property
        audioString: answer.audio || answer.tib,
        answerObj: answer,
        choices: choices.map(c => ({
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
    const passed = (score / total) >= 0.8 || DEV_BYPASS_LOCKS;
    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 border ${isUnlockTest ? 'bg-white border-stone-200 shadow-sm' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm border ${passed ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
          {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        </div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">{passed ? "Test Passed!" : "Keep Practicing"}</h3>
        <p className="text-stone-600 mb-8 font-bold text-lg">You scored <span className={passed ? "text-emerald-600" : "text-rose-600"}>{score}</span> out of {total}.</p>
        
        <div className="flex gap-4">
          <button onClick={() => { setStep(0); setScore(0); setPicked(null); if(isUnlockTest) setHasStarted(false); }} className="px-6 py-3 bg-white border border-stone-200 font-bold hover:bg-stone-50 transition-colors text-stone-700 flex items-center gap-2">
            <Shuffle size={18} /> Retake
          </button>
          {passed && isUnlockTest && nextLessonPath && (
            <Link href={nextLessonPath} className="px-8 py-3 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-sm">
              Unlock Next Step <ArrowRight size={18} />
            </Link>
          )}
          {passed && isUnlockTest && !nextLessonPath && (
            <button className="px-8 py-3 bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-2 border border-amber-600">
              Unlock Next Step <ArrowRight size={18} />
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

  const isVocab = isVocabMatch || currentQ.type === 'vocab' || (currentQ.questionText && currentQ.questionText.includes("Tibetan word for"));
  const readingToDisplay = isLesson1 ? (currentQ.answerObj?.translit || currentQ.answerObj?.pron) : (currentQ.answerObj?.pron || currentQ.answerObj?.translit);

  return (
    <div className={`border p-6 md:p-8 ${isUnlockTest ? 'bg-white border-stone-200 shadow-sm' : 'bg-[#fffdf5] border-[#fde68a]'}`}>
      {!isUnlockTest && (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">
          <Sparkles size={14} /> Checkpoint
        </div>
      )}
      <h3 className="text-xl font-serif text-stone-900 mb-2">{title}</h3>
      {intro && <p className="text-sm text-stone-600 mb-6">{intro}</p>}

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-3 mb-6">
        <span>Question {step + 1} of {total}</span>
        <span className="text-amber-500">Score {score}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Prompt</div>
          {currentQ.questionText ? (
            <span className="text-xl text-stone-800">{currentQ.questionText}</span>
          ) : isVocab ? (
            <span className="text-xl text-stone-800">Which word means <span className="font-bold">"{currentQ.answerObj?.en}"</span>?</span>
          ) : currentQ.isAudioType ? (
            <span className="text-xl text-stone-800">Listen and select the matching option.</span>
          ) : (
            <span className="text-xl text-stone-800">Which option reads <span className="font-mono bg-stone-100 px-2 py-0.5 border border-stone-200">{readingToDisplay}</span>?</span>
          )}
          
          {currentQ.prominentTibetan && (
            <div className="mt-4"><span className="font-serif leading-[1.4] pb-4 block text-stone-900" style={{ fontSize: "7rem" }}>{currentQ.prominentTibetan}</span></div>
          )}
        </div>
        
        {(!isVocab && !currentQ.questionText) && !currentQ.prominentTibetan && (
          <button onClick={() => playAudio(currentQ.audioString || currentQ.answer)} disabled={playingItem !== null} className={`inline-flex items-center justify-center gap-2 border px-5 py-2 font-bold transition-colors shrink-0 ${currentQ.isAudioType ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}>
             {playingItem === (currentQ.audioString || currentQ.answer) ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />} 
             {currentQ.isAudioType ? "PLAY AUDIO" : "Play Hint"}
          </button>
        )}
        
        {currentQ.audioString && !currentQ.prominentTibetan && currentQ.questionText && (
          <button onClick={() => playAudio(currentQ.audioString)} disabled={playingItem !== null} className="inline-flex items-center gap-2 border border-black/10 bg-white px-6 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-100 transition-colors shadow-sm mt-4 sm:mt-0 shrink-0">
            {playingItem === currentQ.audioString ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Volume2 size={16} className="text-amber-500" />} Hear Sound
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {currentQ.choices.map((c: any) => {
          const isRight = picked && c.value === currentQ.answer;
          const isWrong = picked === c.value && c.value !== currentQ.answer;
          let stateClass = "bg-white border-stone-200 hover:border-amber-400 text-stone-900 hover:shadow-sm";
          if (isRight) stateClass = "bg-emerald-50 text-emerald-700 border-emerald-400";
          else if (isWrong) stateClass = "bg-rose-50 text-rose-700 border-rose-400 opacity-60";
          else if (picked) stateClass = "bg-stone-50 text-stone-300 opacity-60 border-stone-200";

          return (
            <button
              key={c.value} disabled={!!picked} onClick={() => pick(c.value)}
              className={`py-6 px-4 text-center transition-all flex flex-col items-center justify-center border ${stateClass}`}
            >
              {c.label ? (
                <div className={`text-xl font-bold ${currentQ.type === 'vocab' ? 'font-serif' : 'font-mono'}`}>{c.label}</div>
              ) : (
                <>
                  {c.emoji && !isVocab && <span className="text-3xl mb-2">{c.emoji}</span>}
                  <span className="font-serif text-[3rem] leading-normal pb-2 tibetan">{c.tib || c.value}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border bg-stone-50 border-stone-200 shadow-sm">
          <span className={`text-sm font-bold ${picked === currentQ.answer ? "text-emerald-600" : "text-rose-600"}`}>
            {picked === currentQ.answer ? "Correct!" : `Incorrect.`}
          </span>
          <button onClick={() => { setPicked(null); setStep((s) => s + 1); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-stone-800 transition shadow-sm">
            {step + 1 === total ? 'See Results' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}