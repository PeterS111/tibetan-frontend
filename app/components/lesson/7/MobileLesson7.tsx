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

  const [currentStep, setCurrentStep] = useState(0);
  
  // The first section splits into two steps for mobile readability
  const totalSteps = 3; 
  const webStepMap = [0, 0, 1]; 

  const quizQuestions = useMemo(() => generateCapstoneQuiz(), []);

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleClose = () => {
    router.push("/dashboard/lessons");
  };

  const stepTitles = [
    "Sections & skills",
    "Format",
    "The assessment"
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 pb-6">
            <p className="text-[15px] text-ink-light leading-relaxed mb-6">
              Ten labelled sections, ordered from recognition to reading, spelling and application.
            </p>
            <div className="flex flex-col gap-6">
              {SKILLS.map(s => (
                <div key={s.num} className="flex gap-4">
                  <span className="font-bold text-brand-dark text-[15px] pt-0.5">{s.num}</span>
                  <div>
                    <div className="font-bold text-[16px] text-ink mb-1">{s.title}</div>
                    <div className="text-[14px] text-ink-light leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="pb-6">
            <div className="bg-surface-muted rounded-[1.5rem] p-6 border border-border-strong shadow-sm pb-6">
               <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4">Format</div>
               <h3 className="font-serif text-[24px] text-ink mb-6">60 questions · 70 points · ~35 min</h3>
               <ul className="space-y-4 text-[15px] text-ink/80 leading-relaxed list-disc pl-4 marker:text-ink-muted">
                 <li>Question types: multiple choice, image matching, ordered word building, root-letter picking, and listening.</li>
                 <li>Recognition questions are worth 1 point; spelling, word building and similar-word questions are worth 2.</li>
                 <li>Immediate feedback. You must manually click Next Question so you can review your answers.</li>
               </ul>
               <hr className="my-6 border-border-subtle" />
               <p className="text-[15px] text-ink/80 leading-relaxed">
                 Unlimited retakes — your best score is kept, and passing at any point unlocks the certificate for good.
               </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="pb-6">
             <QuizModule 
               title="Begin the assessment" 
               intro="Fresh questions are drawn each attempt. Take your time — accuracy matters more than speed." 
               questions={quizQuestions} 
               playAudio={playAudio} 
               playingItem={playingItem} 
               playErrorBeep={playErrorBeep} 
               isUnlockTest={true} 
               hideHeader={true}
               nextLessonPath="/dashboard" 
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
      unitContext={`Unit 7 · Capstone`} 
      title={stepTitles[currentStep]}
      continueText={currentStep === totalSteps - 1 ? "Finish Assessment" : "Continue"}
      hideContinue={currentStep === totalSteps - 1} 
    >
      {renderStepContent()}
    </MobileStepPlayer>
  );
}