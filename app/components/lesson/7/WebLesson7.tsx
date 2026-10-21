// app/components/lesson/7/WebLesson7.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { generateCapstoneQuiz, SKILLS } from "@/app/data/lesson7";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import QuizModule from "@/app/components/QuizModule";

const WEB_STEPS = [
  { 
    id: "overview", 
    eyebrow: "Section 01", 
    title: "What this capstone covers", 
    tibetanTitle: "སྤྱི་བཤད།",
    description: "Review the ten skill areas and format before starting the assessment." 
  },
  { 
    id: "assessment", 
    eyebrow: "Section 02", 
    title: "Capstone Assessment", 
    tibetanTitle: "རྒྱུགས་སྤྲོད།",
    description: "60 questions across all six units. Score 80% or higher to earn your Beginner 1 certificate." 
  },
  { 
    id: "result", 
    eyebrow: "Section 03", 
    title: "Your result & certificate", 
    tibetanTitle: "གྲུབ་འབྲས།",
    description: "View and print your official Beginner 1 certificate upon passing." 
  },
];

export function WebLesson7() {
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(WEB_STEPS.length);
  const [isBypassing, setIsBypassing] = useState(false);

  const quizQuestions = useMemo(() => generateCapstoneQuiz(), []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(WEB_STEPS.length - 1);
            setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
          }} 
          disabled={isBypassing}
          className="w-full mb-8 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 text-center tracking-widest shadow-lg disabled:opacity-50 rounded-2xl"
        >
          {isBypassing ? "⏳ SAVING TO DATABASE... PLEASE WAIT" : "🛠️ DEV BYPASS: GET 100% & PRINT CERTIFICATE 🛠️"}
        </button>

        <div className="mb-6 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Steps</Link>
          <ChevronRight className="size-3" />
          <span>Unit 07</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">Capstone</span>
        </div>

        {/* Hero Section (Harmonized with Lessons 1–6) */}
        <Card className="mb-8 p-0 overflow-hidden shadow-sm border border-border-subtle">
          <div className="w-full h-72 sm:h-96 md:h-[400px] bg-surface-muted overflow-hidden relative">
            <img 
              src="/loplao-hero-scene.jpg" 
              alt="Himalayan Monastery Scene" 
              className="w-full h-full object-cover object-center" 
            />
          </div>
          
          <div className="p-6 md:p-10 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <div className="mb-2 text-eyebrow text-brand-dark">Beginner 1 · Capstone</div>
              <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">Show what you've learned.</h1>
              <p className="mt-2 font-tibetan text-3xl text-ink-light">མཐའ་མའི་རྒྱུགས་སྤྲོད།</p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
                A comprehensive assessment drawing on all six foundational units — consonants, vowels, superscripts, subscripts, prefixes, and suffixes. Score <strong>80%</strong> or higher to officially complete Beginner 1 and unlock your certificate.
              </p>
            </div>
            <div className="w-full md:w-72">
              <div className="mb-2 flex items-center justify-between text-eyebrow">
                <span>Step progress</span>
                <span className="text-brand-dark">{Math.min(unlockedStep, WEB_STEPS.length)} of {WEB_STEPS.length} sections</span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle overflow-hidden rounded-full">
                <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 divide-x divide-border-subtle border border-border-subtle p-3 bg-surface-muted rounded-xl text-center">
                <div>
                  <div className="font-serif text-2xl text-ink">35m</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Time</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-ink">10</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Skills</div>
                </div>
                <div>
                  <div className="font-serif text-2xl text-ink">60</div>
                  <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Questions</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <StepContainer index={0} step={WEB_STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
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

          <StepContainer index={1} step={WEB_STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="p-0">
               <QuizModule 
                 moduleId={7}
                 title="Capstone Assessment" 
                 intro="60 questions drawn across all six units. Take your time — accuracy matters more than speed." 
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

          <StepContainer index={2} step={WEB_STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)} isLast>
            {statusOf(2) === "done" ? (
              <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-border-subtle rounded-[1.25rem] bg-emerald-50">
                <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-600 flex items-center justify-center mb-6 shadow-sm"><CheckCircle2 size={40} /></div>
                <h3 className="text-3xl font-serif font-bold text-ink mb-4">Assessment Complete</h3>
                <p className="text-ink-light font-bold mb-8">You have successfully passed the Beginner 1 Capstone Assessment.</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/dashboard">
                    <Button variant="outline" className="bg-white border-border-strong">Return to Dashboard</Button>
                  </Link>
                  <Link href="/dashboard/certificate">
                    <Button className="bg-emerald-600 text-white hover:bg-emerald-700">View Certificate <ArrowRight size={16} /></Button>
                  </Link>
                </div>
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