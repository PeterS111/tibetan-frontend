// app/components/lesson/3/MobileLesson3.tsx
"use client";

import { SpellingFormula } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Loader2, Volume2, ArrowRight, ArrowUp, ArrowDown, Layers, VolumeX, Info, CheckCircle2 } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { SUPERS, VOCAB, STEPS, TONE_META, generateVocabQuiz, generateFinalQuiz, generateSuperscriptQuiz, Super, Combo, Tone } from "@/app/data/lesson3";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson3() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete, completed } = useLessonProgress(STEPS.length);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 11; 
  
  const [selectedCombo, setSelectedCombo] = useState<(Combo & { sup: Super }) | null>(null);

  // Sync mobile isolated steps back to the 5 broader Web Steps
  const webStepMap = [0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4]; 

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    if (currentStep === 8 && !completed.has(currentWebStep)) {
      saveWords(VOCAB.length);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push("/dashboard/lessons/4");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleClose = () => {
    router.push("/dashboard/lessons");
  };

  const saveWords = async (wordCount: number) => {
    if (user) {
      try {
        const token = await getToken();
        if (token) {
          const formData = new FormData();
          formData.append("user_id", user.id);
          formData.append("new_words", wordCount.toString());
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update-words`, {
            method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData
          });
        }
      } catch (e) { console.error("Failed to save words", e); }
    }
  };

  const practiceGroups = useMemo(() => [
    {
      name: "Stacks",
      items: SUPERS.flatMap(s => s.combos.map(c => ({
        id: `c-${c.stack}`, tibetan: c.stack, reading: `[${c.read}]`, english: s.name, audioTarget: c.stack
      })))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `voc-${v.tib}`, tibetan: v.tib, reading: `[${v.translit}]`, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

  const openInspector = (c: Combo, sup: Super) => {
    setSelectedCombo({ ...c, sup });
    playAudio(c.stack + " spelling");
  };

  const renderSuperscriptGrid = (supIndex: number) => {
    const sup = SUPERS[supIndex];
    return (
      <div className="pb-6">
        <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle mb-6">
          <div className="font-tibetan text-5xl text-ink mb-2">{sup.headLabel}</div>
          <p className="text-[15px] leading-relaxed text-ink/90">
            {sup.intro}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {sup.combos.map((c) => {
            const TM = TONE_META[c.tone];
            const Icon = TM.Icon;
            return (
              <button 
                key={c.stack} 
                onClick={() => openInspector(c, sup)} 
                className="bg-white rounded-[1.25rem] py-6 flex flex-col items-center justify-center text-center active:scale-95 transition-transform shadow-sm border border-border-subtle"
              >
                <span className="font-tibetan text-[44px] text-ink leading-none mb-4">{c.stack}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-light mb-3">{c.read}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${TM.bg} ${TM.text}`}>
                  <Icon size={14} strokeWidth={3} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 pb-6">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-brand-light text-brand-dark">
                <Layers size={14} /> Stacking
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                A superscript is a small consonant written <strong>on top of</strong> a root letter. Only three consonants — <span className="font-tibetan text-xl">ར ལ ས</span> — are permitted.
              </p>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-amber-50 text-amber-700">
                <VolumeX size={14} /> Silence
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                The superscript itself is <strong>not pronounced</strong>. Only the root letter is spoken.
              </p>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-emerald-50 text-emerald-700">
                <ArrowUp size={14} /> Tone Shift
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                Depending on the root's gender, the tone becomes <strong>same</strong>, <strong>higher</strong>, or <strong>lower</strong>.
              </p>
            </div>

            <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle mt-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4">
                <Info size={14} /> Reading the tone arrows
              </div>
              <div className="space-y-3">
                {(Object.keys(TONE_META) as Tone[]).map(t => {
                  const meta = TONE_META[t];
                  const Icon = meta.Icon;
                  return (
                    <div key={t} className="bg-white rounded-[1.25rem] p-4 flex items-center gap-4 shadow-sm border border-border-subtle">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.bg} ${meta.text}`}>
                        <Icon size={16} strokeWidth={3} />
                      </div>
                      <div className="font-bold text-sm text-ink">{meta.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        );

      case 1: return renderSuperscriptGrid(0); // Ra-go
      case 2: return (
        <div className="pb-6">
          <QuizModule title="Mastery Check · Ra-go" intro="Test your spelling and recognition." questions={generateSuperscriptQuiz("ra")} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} />
        </div>
      );

      case 3: return renderSuperscriptGrid(1); // La-go
      case 4: return (
        <div className="pb-6">
          <QuizModule title="Mastery Check · La-go" intro="Test your spelling and recognition." questions={generateSuperscriptQuiz("la")} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} />
        </div>
      );

      case 5: return renderSuperscriptGrid(2); // Sa-go
      case 6: return (
        <div className="pb-6">
          <QuizModule title="Mastery Check · Sa-go" intro="Test your spelling and recognition." questions={generateSuperscriptQuiz("sa")} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} />
        </div>
      );

      case 7:
        return (
          <div className="pb-6">
            <div className="grid grid-cols-2 gap-3">
              {VOCAB.map((v) => {
                const sup = SUPERS.find(s => s.key === v.sup)!;
                return (
                  <button key={v.tib} onClick={() => playAudio(v.tib)} className="bg-white border border-border-subtle rounded-[1.5rem] p-5 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform relative overflow-hidden">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: sup.accent.hex }} />
                    <span className="text-[40px] mb-3">{v.emoji}</span>
                    <span className="font-tibetan text-4xl text-ink leading-none mb-2">{v.tib}</span>
                    <span className="font-mono text-[11px] tracking-widest text-ink-muted font-bold uppercase mb-1">[{v.translit}]</span>
                    <span className="text-[14px] font-bold text-ink">{v.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="pb-6">
            <QuizModule title="Vocabulary Mastery" intro="Score 80% or higher to prove you know these words." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={16} isVocabMatch hideHeader={true} isUnlockTest={false} />
          </div>
        );

      case 9:
        return (
          <div className="pb-6">
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </div>
        );

      case 10:
        return (
          <div className="pb-6">
            <QuizModule title="Final Step Test" intro="Score 80% or higher to unlock the next step: Subscripts." questions={generateFinalQuiz()} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} hideHeader={true} nextLessonPath="/dashboard/lessons/4" onPass={() => markComplete(4)} />
          </div>
        );
    }
  };

  const stepTitles = [
    "What is a superscript?", "The 12 Stacks of 'Ra'", "Mastery Check · Ra-go", 
    "The 10 Stacks of 'La'", "Mastery Check · La-go", "The 11 Stacks of 'Sa'", 
    "Mastery Check · Sa-go", "Vocabulary", "Vocabulary Mastery", 
    "Practice & exercises", "Lesson complete" 
  ];

  return (
    <>
      <MobileStepPlayer
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        onClose={handleClose} 
        onContinue={handleNext}
        onPrevious={currentStep > 0 ? handlePrevious : undefined}
        unitContext={`Unit 3 · Step ${currentStep + 1} of ${totalSteps}`} 
        title={stepTitles[currentStep]}
        continueText={currentStep === totalSteps - 1 ? "Finish Unit" : "Continue"}
        hideContinue={currentStep === totalSteps - 1} 
      >
        {renderStepContent()}
      </MobileStepPlayer>

      {/* BOTTOM SHEET INSPECTOR */}
      {selectedCombo && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity" onClick={() => setSelectedCombo(null)}></div>
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
            
            <div className="flex flex-col mb-6 bg-white p-6 rounded-[1.5rem] border border-border-subtle shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-6 text-center">Spelling Walkthrough</div>
              
              
			  {/* NEW */}
<div className="flex items-center justify-center mb-6">
 <SpellingFormula parts={`${selectedCombo.sup.head} + ${selectedCombo.root} + བཏགས་`} />
</div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <ArrowRight className="text-border-strong opacity-50" size={20} />
                <span className="font-tibetan text-[4.5rem] leading-none pt-2 text-ink">{selectedCombo.stack}</span>
                <span className="font-mono text-2xl font-bold text-ink">[{selectedCombo.read}]</span>
              </div>

              {(() => {
                const TM = TONE_META[selectedCombo.tone];
                const Icon = TM.Icon;
                return (
                  <div className={`mx-auto w-fit px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${TM.bg} ${TM.text} border ${TM.border}`}>
                    <Icon size={14} strokeWidth={3} /> {TM.label}
                  </div>
                )
              })()}
            </div>

            <div className="flex gap-3">
              <button onClick={() => playAudio(selectedCombo.stack + " spelling")} className="flex-1 py-4 bg-brand-light text-brand-dark font-bold rounded-full border border-brand/20 active:bg-brand/30 transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === (selectedCombo.stack + " spelling") ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />} 
                <span className="text-sm">Spelling</span>
              </button>
              <button onClick={() => playAudio(selectedCombo.stack)} className="flex-1 py-4 bg-ink text-white font-bold rounded-full active:bg-ink-light transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === selectedCombo.stack ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                <span className="text-sm">Pronunciation</span>
              </button>
            </div>

            <button onClick={() => setSelectedCombo(null)} className="w-full mt-4 py-4 text-center font-bold text-ink hover:bg-ink/5 rounded-full transition-colors">Close</button>
          </div>
        </>
      )}
    </>
  );
}