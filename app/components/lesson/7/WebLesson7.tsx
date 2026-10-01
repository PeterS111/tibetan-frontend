// app/components/lesson/7/WebLesson7.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { generateCapstoneQuiz, STEPS, SKILLS } from "@/app/data/lesson7";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import QuizModule from "@/app/components/QuizModule";

export function WebLesson7() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(3);
  const [isBypassing, setIsBypassing] = useState(false);

  const quizQuestions = useMemo(() => generateCapstoneQuiz(), []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(2);
            setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
          }} 
          disabled={isBypassing}
          className="w-full mb-8 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 text-center tracking-widest shadow-lg disabled:opacity-50 rounded-2xl"
        >
          {isBypassing ? "⏳ SAVING TO DATABASE... PLEASE WAIT" : "🛠️ DEV BYPASS: GET 100% & PRINT CERTIFICATE 🛠️"}
        </button>

        <div className="mb-8 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Lessons</Link>
          <ChevronRight size={14} />
          <span>Unit 07</span>
          <ChevronRight size={14} />
          <span className="text-ink">Capstone</span>
        </div>

        <Card className="mb-12">
          <div className="mb-3 inline-flex text-eyebrow text-brand-dark bg-brand-light px-3 py-1.5 rounded-full border border-brand/20">
            Beginner 1 · Capstone
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight tracking-tight mt-4 mb-6">
            Show what you've learned.
          </h1>
          <p className="max-w-3xl text-[16px] leading-relaxed text-ink-light">
            A comprehensive assessment drawing on all six units — letter recognition, tone and gender, vowels, stacks, prefixes and suffixes, plus reading, spelling, word building, similar words and listening. Score <strong>80%</strong> or higher to unlock your Certificate of Completion.
          </p>

          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between text-eyebrow">
              <span>Step progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, 3)} of 3 sections</span>
            </div>
            <div className="h-2 w-full bg-border-subtle overflow-hidden rounded-full">
              <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
              <div>
                <h3 className="font-serif text-[24px] text-ink mb-2">Sections & skills</h3>
                <p className="text-[15px] text-ink-light mb-8">Ten labelled sections, ordered from recognition to reading, spelling and application.</p>
                <div className="space-y-6">
                  {SKILLS.map(s => (
                    <div key={s.num} className="flex gap-4">
                      <span className="font-bold text-brand-dark text-sm pt-0.5">{s.num}</span>
                      <div>
                        <div className="font-bold text-[15px] text-ink">{s.title}</div>
                        <div className="text-[14px] text-ink-light mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-surface-muted rounded-[1.5rem] p-6 md:p-8 border border-border-strong shadow-sm sticky top-8">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4">Format</div>
                  <h3 className="font-serif text-[24px] text-ink mb-6">60 questions · 70 points · ~35 min</h3>
                  <ul className="space-y-4 text-[14px] text-ink-light leading-relaxed list-disc pl-4 marker:text-ink-muted">
                    <li>Question types: multiple choice, image matching, ordered word building, root-letter picking, and listening.</li>
                    <li>Recognition questions are worth 1 point; spelling, word building and similar-word questions are worth 2.</li>
                    <li>Immediate feedback. You must manually click Next Question so you can review your answers.</li>
                  </ul>
                  <hr className="my-6 border-border-subtle" />
                  <p className="text-[14px] text-ink-light leading-relaxed">
                    Unlimited retakes — your best score is kept, and passing at any point unlocks the certificate for good.
                  </p>
                </div>
              </div>
            </div>
          </StepContainer>

          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="p-0">
               <QuizModule 
                 title="Begin the assessment" 
                 intro="Fresh questions are drawn each attempt. Take your time — accuracy matters more than speed." 
                 questions={quizQuestions} 
                 playAudio={playAudio} 
                 playingItem={playingItem} 
                 playErrorBeep={playErrorBeep} 
                 isUnlockTest={true} 
                 nextLessonPath="/dashboard" 
                 onPass={() => markComplete(1)} 
               />
            </div>
          </StepContainer>

          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)} isLast>
            {statusOf(2) === "done" ? (
              <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-border-subtle rounded-[1.25rem] bg-emerald-50">
                <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-600 flex items-center justify-center mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
                <h3 className="text-3xl font-serif font-bold text-ink mb-4">Assessment Complete</h3>
                <p className="text-ink-light font-bold mb-8">You have successfully passed the Beginner 1 Capstone Assessment.</p>
                <Link href="/dashboard">
                  <Button>Return to Dashboard <ArrowRight size={16} /></Button>
                </Link>
              </div>
            ) : (
              <div className="p-12 text-center border border-border-subtle rounded-[1.25rem] bg-surface">
                <p className="text-[15px] italic text-ink-muted">Complete the assessment in Section 02 and your result will appear here.</p>
              </div>
            )}
          </StepContainer>
        </div>
      </div>
    </div>
  );
}