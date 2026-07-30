// app/dashboard/lessons/7/page.tsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2, ChevronRight, ChevronLeft, ArrowUp, ArrowDown, CheckCircle2, 
  Sparkles, BookOpen, Award, Target, Loader2, XCircle, RotateCcw, Trophy
} from "lucide-react";

// --- Custom Hooks ---
import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// --- Data ---
import { STEPS, CONCEPT_LABEL, buildBank, type Question, type Concept } from "@/app/data/lesson7";

// --- UI Components ---
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";

const PASS_THRESHOLD = 0.8;

export default function FinalAssessmentLesson() {
  const { playAudio, playingItem } = useAudio();
  const { unlockedStep, expandedStep, progressPercent, toggleStep, markComplete } = useLessonProgress(STEPS.length);

  const [attempt, setAttempt] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [lastResult, setLastResult] = useState<{ score: number; wrongByConcept: Record<Concept, number> } | null>(null);
  
  // Simulated DB record for this standalone page
  const [record, setRecord] = useState({ passed: false, bestScore: 0, attempts: 0 });

  const questions = useMemo(() => buildBank(), [attempt]);
  const total = questions.length;

  const startTest = () => {
    setInProgress(true);
    setLastResult(null);
    setAttempt((a) => a + 1);
    toggleStep(1); // Force expand the test section
  };

  const submitResult = (score: number) => {
    setRecord(prev => ({
      passed: prev.passed || score >= PASS_THRESHOLD,
      bestScore: Math.max(prev.bestScore, score),
      attempts: prev.attempts + 1
    }));
  };

  return (
    <div className="bg-paper min-h-screen text-ink pb-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Lessons</Link>
          <ChevronRight size={14} />
          <span>Unit 07</span>
          <ChevronRight size={14} />
          <span className="text-ink font-bold">Capstone</span>
        </div>

        {/* Hero */}
        <div className="mb-12 grid gap-6 md:grid-cols-[1.4fr,1fr] md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-light px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-dark">
              <Award className="size-3.5" /> Beginner 1 · Capstone
            </div>
            <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl text-ink">
              Show what you&rsquo;ve learned.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-light">
              A short mixed assessment drawing on every step so far — recognition,
              root-finding, tone, ordered spelling, and vocabulary. Score{" "}
              <span className="font-bold text-ink">{Math.round(PASS_THRESHOLD * 100)}%</span>{" "}
              or higher to unlock your Certificate of Completion.
            </p>
            {record.attempts > 0 && (
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
                Best score: <span className="text-ink">{Math.round(record.bestScore * 100)}%</span> · {record.attempts} attempt{record.attempts === 1 ? "" : "s"} {record.passed && " · Passed"}
              </p>
            )}
          </div>

          <div className="w-full md:w-72 justify-self-end">
            <div className="mb-3 flex items-center justify-between text-eyebrow">
              <span>Section progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, STEPS.length)} of {STEPS.length} sections</span>
            </div>
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden">
              <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Step 01: Overview */}
          <StepContainer index={0} step={STEPS[0]} status={unlockedStep >= 0 ? "done" : "upcoming"} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-1">What this capstone covers</h2>
              <p className="text-sm text-ink-muted">Everything from Steps 1–6, mixed together.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-serif text-xl mb-4">What&rsquo;s in the mix</h3>
                <ul className="space-y-3 text-sm text-ink-light">
                  <li className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /> Recognising consonants and vowel diacritics</li>
                  <li className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /> Finding the <span className="font-bold text-ink">root letter</span> in simple words</li>
                  <li className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /> Deciding tone from a prefix + root combination</li>
                  <li className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /> Ordering the spelling steps that build a syllable</li>
                  <li className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /> Matching Tibetan words to their meaning</li>
                  <li className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /> <span className="font-bold text-ink">Listening</span> — hearing a word and picking its form</li>
                </ul>
              </div>
              <Card className="bg-surface-muted flex flex-col justify-center border border-border-strong">
                <div className="text-eyebrow mb-2">Format</div>
                <div className="font-serif text-2xl text-ink mb-4">{total} questions · ~20 min</div>
                <p className="text-[15px] leading-relaxed text-ink-light">
                  Take your time on each question. You can review your answer before advancing manually. Unlimited retakes — your best score is kept.
                </p>
              </Card>
            </div>
          </StepContainer>

          {/* Step 02: Assessment */}
          <StepContainer index={1} step={STEPS[1]} status={unlockedStep >= 1 ? "done" : "upcoming"} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-1">The assessment</h2>
              <p className="text-sm text-ink-muted">About {total} questions across six question types (~20 min).</p>
            </div>
            
            {!inProgress && !lastResult && (
              <div className="border border-brand bg-brand-light/50 p-6 md:p-10 text-center flex flex-col items-center">
                <div className="inline-flex items-center justify-center size-12 bg-white text-brand mb-4 shadow-sm border border-brand-light">
                  <Trophy className="size-6" />
                </div>
                <h3 className="font-serif text-3xl text-ink mb-3">
                  {record.attempts > 0 ? "Take it again" : "Begin the assessment"}
                </h3>
                <p className="max-w-md text-[15px] text-ink-light mb-8">
                  Fresh questions are drawn each attempt. Take your time — accuracy matters more than speed.
                </p>
                <Button onClick={startTest}>
                  {record.attempts > 0 ? "Retake assessment" : "Start assessment"} <ChevronRight className="size-5" />
                </Button>
              </div>
            )}

            {inProgress && (
              <Quiz
                key={attempt}
                questions={questions}
                playAudio={playAudio}
                playingItem={playingItem}
                onFinish={(r: { score: number; wrongByConcept: Record<Concept, number> }) => {
                  submitResult(r.score);
                  setLastResult(r);
                  setInProgress(false);
                  markComplete(1);
                }}
              />
            )}

            {!inProgress && lastResult && (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-border-strong bg-surface">
                <CheckCircle2 className="size-16 text-emerald-500 mb-4" />
                <h3 className="font-serif text-3xl mb-2">Assessment Complete</h3>
                <p className="text-ink-light">See your full results in Section 03 below.</p>
              </div>
            )}
          </StepContainer>

          {/* Step 03: Result */}
          <StepContainer index={2} step={STEPS[2]} status={unlockedStep >= 2 ? "done" : "upcoming"} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => {}} isLast>
            <div className="mb-6 flex flex-col border-b border-border-strong pb-4">
              <h2 className="font-serif text-2xl text-ink mb-1">Your result</h2>
              <p className="text-sm text-ink-muted">Pass {Math.round(PASS_THRESHOLD * 100)}% to unlock your certificate.</p>
            </div>
            
            <ResultPanel result={lastResult} record={record} onRetake={startTest} />
          </StepContainer>

        </div>
        
        {/* Footer Navigation */}
        <nav className="mt-16 flex flex-col justify-between gap-4 border-t border-border-strong pt-8 sm:flex-row">
          <Link href="/dashboard/lessons/6" className="inline-flex items-center justify-center sm:justify-start gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors px-4 py-2 bg-surface hover:bg-surface-muted">
            <ChevronLeft size={16} /> Previous
          </Link>
          <Link href="/dashboard/lessons" className="inline-flex items-center justify-center sm:justify-end gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors px-4 py-2 bg-surface hover:bg-surface-muted">
            Back to syllabus <BookOpen size={16} />
          </Link>
        </nav>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Quiz Runner & Views                                                  */
/* -------------------------------------------------------------------- */

function getMCRenderProps(q: any) {
  if (q.promptType === "how-read") return <span>How does <span className="font-tibetan text-3xl text-ink px-2">{q.promptTarget}</span> read?</span>;
  if (q.promptType === "which-vowel") return <span>Which vowel gives <span className="font-tibetan text-3xl text-ink px-2">{q.promptTarget}</span>?</span>;
  if (q.promptType === "tone") return <span>In <span className="font-tibetan text-3xl text-ink px-2">{q.promptTarget}</span> the root <span className="font-tibetan text-2xl px-1">{q.promptSub}</span> is read in which tone?</span>;
  if (q.promptType === "vocab") return <span>Which word means <span className="font-bold text-ink">"{q.promptTarget}"</span>?</span>;
  return null;
}

function Quiz({ questions, playAudio, playingItem, onFinish }: any) {
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<string[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [wrong, setWrong] = useState<Record<Concept, number>>({
    consonants: 0, vowels: 0, superscripts: 0, subscripts: 0, prefixes: 0, suffixes: 0,
  });

  const total = questions.length;
  const q = questions[step];

  if (q.kind === "order" && orderState.length === 0) setOrderState([...q.steps].sort(() => Math.random() - 0.5));

  const checkAnswer = (isCorrect: boolean) => {
    setCorrectCount(c => c + (isCorrect ? 1 : 0));
    if (!isCorrect) setWrong(w => ({ ...w, [q.concept]: w[q.concept] + 1 }));
  };

  const goNext = () => {
    if (step + 1 >= total) onFinish({ score: correctCount / total, wrongByConcept: wrong });
    else { setStep(s => s + 1); setPicked(null); setOrderState([]); setOrderSubmitted(false); }
  };

  const handlePick = (key: string) => {
    if (picked) return;
    setPicked(key);
    const answerKey = q.kind === "mc" ? q.answerKey : q.kind === "root" ? q.answer : q.kind === "listen" ? q.answerTib : "";
    checkAnswer(key === answerKey);
  };

  const handleOrderSubmit = () => {
    if (q.kind !== "order" || orderSubmitted) return;
    setOrderSubmitted(true);
    checkAnswer(orderState.join("|") === q.steps.join("|"));
  };

  const isAnswered = q.kind === "order" ? orderSubmitted : picked !== null;
  const isCorrect = q.kind === "order" ? (orderSubmitted && orderState.join("|") === q.steps.join("|")) : (picked !== null && picked === (q.kind === "mc" ? q.answerKey : q.kind === "root" ? q.answer : q.answerTib));

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between text-eyebrow">
        <span>Question {step + 1} of {total}</span>
        <span className="text-brand-dark">Score {correctCount}</span>
      </div>
      
      <div className="h-1.5 w-full bg-border-subtle overflow-hidden mb-8">
        <div className="h-full bg-brand transition-all duration-500 ease-out" style={{ width: `${Math.round((step / total) * 100)}%` }} />
      </div>

      <div className="mt-6">
        {q.kind === "mc" && (
          <>
            <div className="text-xl text-ink mb-8">{getMCRenderProps(q)}</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {q.choices.map((c: any) => {
                const right = picked && c.key === q.answerKey;
                const wrong = picked === c.key && c.key !== q.answerKey;
                return (
                  <button key={c.key} type="button" disabled={!!picked} onClick={() => handlePick(c.key)} className={`flex min-h-[5rem] items-center justify-center border-2 p-3 text-center text-lg font-bold transition-all ${right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60" : picked ? "border-border-strong bg-surface text-ink-muted opacity-50" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light hover:shadow-md"}`}>
                    {q.promptType === 'vocab' ? <span className="font-tibetan text-3xl">{c.label}</span> : c.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {q.kind === "root" && (
          <>
            <div className="text-xl text-ink mb-2">Tap the <span className="font-bold">root letter</span> of <span className="font-tibetan text-4xl mx-2 text-ink">{q.cluster}</span> <span className="text-ink-muted text-lg font-mono">[{q.translit}]</span></div>
            <p className="mb-8 text-sm text-ink-light">The root letter carries the syllable&rsquo;s core sound and tone.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {q.tiles.map((tile: string) => {
                const right = picked && tile === q.answer;
                const wrong = picked === tile && tile !== q.answer;
                return (
                  <button key={tile} type="button" disabled={!!picked} onClick={() => handlePick(tile)} className={`flex aspect-square items-center justify-center border-2 p-3 font-tibetan text-[3.5rem] transition-all ${right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60" : picked ? "border-border-strong bg-surface text-ink-muted opacity-50" : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light"}`}>
                    {tile}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {q.kind === "order" && (
          <>
            <div className="text-xl text-ink mb-8">Put the spelling steps in order to build <span className="font-tibetan text-4xl mx-2">{q.cluster}</span> <span className="text-ink-muted text-lg font-mono">[{q.translit}]</span></div>
            <ol className="space-y-3">
              {orderState.map((s: string, i: number) => (
                <li key={`${s}-${i}`} className={`flex items-center gap-4 border-2 p-4 transition-colors ${orderSubmitted ? (s === q.steps[i] ? "border-emerald-500 bg-emerald-50 text-emerald-900" : "border-rose-400 bg-rose-50 text-rose-900 opacity-80") : "border-border-strong bg-surface"}`}>
                  <span className="grid size-8 shrink-0 place-items-center bg-surface-muted text-xs font-bold text-ink-muted rounded-none">{i + 1}</span>
                  <span className="flex-1 font-tibetan text-3xl">{s}</span>
                  {!orderSubmitted && (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { if(i===0)return; const n = [...orderState]; const [it] = n.splice(i,1); n.splice(i-1,0,it); setOrderState(n); }} disabled={i === 0} className="border border-border-strong p-2 hover:bg-surface-muted disabled:opacity-30"><ArrowUp size={16}/></button>
                      <button type="button" onClick={() => { if(i===orderState.length-1)return; const n = [...orderState]; const [it] = n.splice(i,1); n.splice(i+1,0,it); setOrderState(n); }} disabled={i === orderState.length - 1} className="border border-border-strong p-2 hover:bg-surface-muted disabled:opacity-30"><ArrowDown size={16}/></button>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            {!orderSubmitted && <Button onClick={handleOrderSubmit} className="mt-8">Check order <ChevronRight className="size-5" /></Button>}
            {orderSubmitted && !isCorrect && (
              <div className="mt-6 border border-border-strong bg-surface-muted p-6">
                <div className="text-eyebrow mb-3">Correct order</div>
                <div className="flex flex-wrap items-center gap-3 font-tibetan text-3xl text-ink">
                  {q.steps.map((s: string, i: number) => <span key={i} className="flex items-center gap-3">{i > 0 && <span className="text-ink-muted">+</span>}<span>{s}</span></span>)}
                </div>
              </div>
            )}
          </>
        )}

        {q.kind === "listen" && (
          <>
            <div className="text-xl text-ink mb-2">Listen and pick the matching Tibetan word.</div>
            <p className="text-sm text-ink-light mb-8">Tap the speaker to replay the sound.</p>
            <div className="mb-8 flex justify-center bg-surface-muted border border-border-strong p-8">
              <Button variant="outline" onClick={() => playAudio(q.answerTib)} className="px-8 py-4 text-lg">
                {playingItem === q.answerTib ? <Loader2 className="size-6 animate-spin text-brand" /> : <Volume2 className="size-6 text-brand" />} Play sound
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {q.choices.map((c: any) => {
                const right = picked && c.tib === q.answerTib;
                const wrong = picked === c.tib && c.tib !== q.answerTib;
                return (
                  <button key={c.tib} type="button" disabled={!!picked} onClick={() => handlePick(c.tib)} className={`flex min-h-[6rem] flex-col items-center justify-center gap-2 border-2 p-3 transition-all ${right ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : wrong ? "border-rose-400 bg-rose-50 text-rose-700 opacity-60" : picked ? "border-border-strong bg-surface text-ink-muted opacity-50" : "border-border-strong bg-surface hover:border-brand hover:bg-brand-light"}`}>
                    <span className="font-tibetan text-[2.5rem] leading-none">{c.tib}</span>
                    {picked && <span className="text-eyebrow">[{c.translit}]</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {isAnswered && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-strong pt-6">
          <div className="flex items-center gap-2">
            {isCorrect ? <><CheckCircle2 className="size-5 text-emerald-600" /><span className="text-sm font-bold text-emerald-700">Correct!</span></> : <><XCircle className="size-5 text-rose-500" /><span className="text-sm font-bold text-rose-700">Incorrect.</span></>}
          </div>
          <Button onClick={goNext}>{step + 1 >= total ? "See Results" : "Next Question"} <ChevronRight className="size-4" /></Button>
        </div>
      )}
    </Card>
  );
}

function ResultPanel({ result, record, onRetake }: any) {
  if (!result && !record.passed) {
    return <div className="py-8 text-center text-ink-light italic">Complete the assessment in Section 02 and your result will appear here.</div>;
  }

  const scorePct = Math.round(((result?.score ?? record.bestScore)) * 100);
  const passed = result ? result.score >= PASS_THRESHOLD : record.passed;
  const weakest = result ? (Object.entries(result.wrongByConcept) as [Concept, number][]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 2) : [];

  return (
    <div className="grid gap-8 md:grid-cols-[1.5fr,1fr] items-start">
      <Card className="p-8">
        <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 ${passed ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-rose-50 border border-rose-200 text-rose-700"}`}>
          {passed ? <Trophy className="size-3.5" /> : <Target className="size-3.5" />} {passed ? "Passed" : "Not quite there"}
        </div>
        <h3 className="font-serif text-5xl text-ink mb-4">{scorePct}% <span className="text-2xl text-ink-muted">/ 100%</span></h3>
        <p className="text-[15px] leading-relaxed text-ink-light mb-8">
          {passed ? "You've demonstrated a solid grasp of the Tibetan reading system. You have officially completed the Foundations unit!" : `You need ${Math.round(PASS_THRESHOLD * 100)}% to unlock the final lesson. Review the sections below and try again — your best score is kept.`}
        </p>

        {!passed && weakest.length > 0 && (
          <div className="border border-border-strong bg-surface-muted p-6 mb-8">
            <div className="text-eyebrow mb-4">Suggested review</div>
            <ul className="space-y-3 text-sm">
              {weakest.map(([c, n]) => (
                <li key={c} className="flex items-center justify-between gap-3">
                  <span className="font-bold text-ink">{CONCEPT_LABEL[c].name} <span className="font-normal text-ink-light ml-2">({n} missed)</span></span>
                  <Link href={CONCEPT_LABEL[c].to} className="inline-flex items-center gap-2 border border-border-strong bg-surface px-3 py-1.5 text-xs font-bold text-ink-light hover:bg-surface-muted hover:text-ink transition-colors">
                    <BookOpen className="size-3.5" /> Review
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-6 border-t border-border-strong">
          <Button variant="outline" onClick={onRetake}>
            <RotateCcw className="size-4" /> {passed ? "Retake for a better score" : "Try again"}
          </Button>
        </div>
      </Card>

      <Card className="p-8 bg-surface-muted border-border-strong">
        <div className="inline-flex items-center gap-2 text-eyebrow mb-6">
          <Trophy className="size-3.5" /> Progress kept
        </div>
        <ul className="space-y-4 text-[15px] text-ink-light">
          <li className="flex justify-between border-b border-border-strong pb-4">
            <span>Best score:</span><span className="font-bold text-ink">{Math.round(record.bestScore * 100)}%</span>
          </li>
          <li className="flex justify-between border-b border-border-strong pb-4">
            <span>Attempts:</span><span className="font-bold text-ink">{record.attempts}</span>
          </li>
          <li className="flex justify-between">
            <span>Status:</span><span className={`font-bold ${passed ? "text-emerald-600" : "text-ink"}`}>{passed ? "Passed" : "In progress"}</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}