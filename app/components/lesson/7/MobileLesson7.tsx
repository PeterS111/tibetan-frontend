// app/components/lesson/7/MobileLesson7.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { generateCapstoneQuiz, SKILLS } from "@/app/data/lesson7";

export function MobileLesson7() {
  const router = useRouter();
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete } = useLessonProgress(3);

  const totalSteps = 3; 
  const MODULE_ID = 7;

  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`tibetan_mobile_lesson_${MODULE_ID}_step`);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < totalSteps) return parsed;
      }
    }
    return 0;
  });

  const webStepMap = [0, 0, 1]; 

  const quizQuestions = useMemo(() => generateCapstoneQuiz(), []);

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    if (currentStep < totalSteps - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (typeof window !== "undefined") {
        localStorage.setItem(`tibetan_mobile_lesson_${MODULE_ID}_step`, next.toString());
        localStorage.setItem("tibetan_last_active_lesson", MODULE_ID.toString());
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem(`tibetan_mobile_lesson_${MODULE_ID}_step`, "0");
      }
      router.push("/dashboard/certificate");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      if (typeof window !== "undefined") {
        localStorage.setItem(`tibetan_mobile_lesson_${MODULE_ID}_step`, prev.toString());
        localStorage.setItem("tibetan_last_active_lesson", MODULE_ID.toString());
      }
    }
  };

  const handleClose = () => {
    router.push("/dashboard/lessons");
  };

  const stepTitles = [
    "Welcome to the Capstone",
    "What you'll be tested on",
    "The assessment"
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      // ---------------------------------------------------------
      // STEP 0: WELCOME HERO CARD (Single-screen, normalized)
      // ---------------------------------------------------------
      case 0:
        return (
          <div className="pb-4">
            <div className="bg-surface rounded-[1.5rem] border border-border-subtle shadow-sm overflow-hidden">
              
			  <div className="w-full h-40 sm:h-48 bg-surface-muted overflow-hidden relative">
                <img 
                  src="/07_final_assessment.jpg" 
                  alt="Capstone Assessment Hero Scene" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
			  

              <div className="p-5 pt-5">
                <h2 className="font-serif text-[26px] leading-tight font-bold text-ink mb-1">
                  Capstone Assessment
                </h2>
                <div className="font-tibetan text-xl text-ink-light mb-4">
                  མཐའ་མའི་རྒྱུགས་སྤྲོད།
                </div>
                <p className="text-[13.5px] leading-relaxed text-ink/80 mb-3.5">
                  Bring together everything from Beginner 1 — consonants, vowels, stacks, prefixes, and suffixes. Pass with 80% or higher to earn your course certificate.
                </p>

                <hr className="border-border-subtle mb-3.5" />

                <div className="grid grid-cols-3 divide-x divide-border-subtle text-center py-0.5">
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">10</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Sections</div>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">60</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Questions</div>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">80%</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">To Pass</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      // ---------------------------------------------------------
      // STEP 1: SYLLABUS & FORMAT OVERVIEW
      // ---------------------------------------------------------
      case 1:
        return (
          <div className="space-y-4 pb-6">
            <div className="bg-surface rounded-[1.5rem] p-6 sm:p-7 shadow-sm border border-border-subtle">
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-dark mb-6">
                10 Assessment Sections
              </div>

              <div className="space-y-4">
                {SKILLS.map((s, idx) => (
                  <div 
                    key={s.num} 
                    className={`flex flex-col gap-1 ${idx !== 0 ? "pt-3.5 border-t border-border-subtle/70" : ""}`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                      SECTION {s.num}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand shrink-0"></span>
                      <span className="font-serif text-[16px] font-bold text-ink leading-snug">
                        {s.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2">Assessment Rules</div>
              <p className="text-[14px] text-ink/85 leading-relaxed">
                Immediate feedback is given after each question. Unlimited retakes are available — your best score is kept, and passing unlocks your certificate permanently.
              </p>
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 2: THE ASSESSMENT
      // ---------------------------------------------------------
      case 2:
        return (
          <div className="pb-6">
             <QuizModule 
               moduleId={7}
               title="Capstone Assessment" 
               intro="Fresh questions are drawn each attempt. Take your time — accuracy matters more than speed." 
               questions={quizQuestions} 
               playAudio={playAudio} 
               playingItem={playingItem} 
               playErrorBeep={playErrorBeep} 
               isUnlockTest={true} 
               hideHeader={true}
               nextLessonPath="/dashboard/certificate" 
               onPass={() => markComplete(1)} 
               questionCount={60}
             />
          </div>
        );
    }
  };

  return (
    <MobileStepPlayer
      currentStep={currentStep} 
      totalSteps={totalSteps} 
      onClose={handleClose} 
      onContinue={handleNext}
      onPrevious={currentStep > 0 ? handlePrevious : undefined}
      unitContext={`Unit 7 · Step ${currentStep + 1} of ${totalSteps}`} 
      title={stepTitles[currentStep]}
      continueText={currentStep === totalSteps - 1 ? "Finish Assessment" : "Continue"}
      hideContinue={currentStep === totalSteps - 1} 
    >
      {renderStepContent()}
    </MobileStepPlayer>
  );
}