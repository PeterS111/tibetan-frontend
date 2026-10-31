// app/components/lesson/3/WebLesson3.tsx
"use client";

import { SpellingFormula } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/clerk-react";
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowUp, 
  Info, Volume2, Loader2, CheckCircle2, Layers, VolumeX, Sparkles 
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";

import { 
  SUPERS, 
  VOCAB, 
  TONE_META, 
  generateSuperscriptQuiz, 
  generateFinalQuiz, 
  type Super, 
  type SuperKey, 
  type Tone 
} from "@/app/data/lesson3";

import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";

const WEB_STEPS = [
  { 
    id: "syllabus", 
    eyebrow: "Introduction", 
    title: "Welcome to the three superscripts", 
    description: "A short orientation before you meet the superscripts." 
  },
  { 
    id: "intro", 
    eyebrow: "Step 02", 
    title: "What is a superscript?", 
    tibetanTitle: "མགོ་ཅན།",
    description: "How superscripts stack over a root letter." 
  },
  { 
    id: "family", 
    eyebrow: "Step 03", 
    title: "Meet the three superscripts", 
    tibetanTitle: "མགོ་ཅན་གསུམ།",
    description: "Study each superscript with its root combinations." 
  },
  { 
    id: "vocab", 
    eyebrow: "Step 04", 
    title: "Vocabulary built from superscripts", 
    tibetanTitle: "ཚིག་གསར།",
    description: "Real words using stacked letters." 
  },
  { 
    id: "practice", 
    eyebrow: "Step 05", 
    title: "Practice & mastery check", 
    tibetanTitle: "སྦྱོང་ཚན།",
    description: "Flashcards, quiz, and matching drills." 
  },
  { 
    id: "complete", 
    eyebrow: "Final step", 
    title: "Final Test", 
    tibetanTitle: "རྒྱུགས་སྤྲོད།",
    description: "Take the final test to unlock the next lesson." 
  }
];

function renderTibetanText(text: string) {
  const parts = text.split(/([\u0F00-\u0FFF]+)/g);
  return parts.map((part, idx) =>
    /[\u0F00-\u0FFF]/.test(part) ? (
      <span key={idx} className="font-tibetan font-normal text-xl text-ink leading-none">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export function WebLesson3() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { expandedStep, completed, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(WEB_STEPS.length);

  const [activeTab, setActiveTab] = useState<SuperKey>("ra");
  const [isBypassing, setIsBypassing] = useState(false);

  const saveWords = async (wordCount: number, stepIndex: number) => {
    if (!completed.has(stepIndex) && user) {
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
    markComplete(stepIndex);
  };

  const practiceGroups = useMemo(() => [
    { name: "Stacks", items: SUPERS.flatMap(s => s.combos.map(c => ({ id: `c-${c.stack}`, tibetan: c.stack, reading: `[${c.read}]`, english: s.name, audioTarget: c.stack }))) },
    { name: "Vocabulary", items: VOCAB.map(v => ({ id: `voc-${v.tib}`, tibetan: v.tib, reading: `[${v.translit}]`, english: v.en, audioTarget: v.tib, emoji: v.emoji })) }
  ], []);

  const finalQuizQuestions = useMemo(() => generateFinalQuiz(), []);

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        <button 
          onClick={async () => {
            setIsBypassing(true);
            await markComplete(WEB_STEPS.length - 1);
            setTimeout(() => window.location.href = "/dashboard", 1000);
          }} 
          disabled={isBypassing}
          className="w-full mb-8 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 text-center tracking-widest shadow-lg disabled:opacity-50 rounded-2xl"
        >
          {isBypassing ? "⏳ SAVING TO DATABASE... PLEASE WAIT" : "🛠️ DEV BYPASS: INSTANTLY PASS LESSON & SAVE 🛠️"}
        </button>

        <div className="mb-6 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard/lessons" className="hover:text-ink transition-colors">My Steps</Link>
          <ChevronRight className="size-3" />
          <span>Unit 03</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">Superscripts</span>
        </div>

        <Card className="mb-8 p-0 overflow-hidden shadow-sm border border-border-subtle">
          
		  
		  <div className="w-full h-72 sm:h-96 md:h-[400px] bg-surface-muted overflow-hidden relative">
            <img 
              src="/03_superscripts.jpg" 
              alt="The Three Superscripts Hero Scene" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="p-6 md:p-10 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <div className="text-eyebrow text-brand-dark mb-2">Lesson 03 · Foundations</div>
              <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">The Three Superscripts</h1>
              <p className="mt-2 font-tibetan font-normal text-3xl text-ink-light">མགོ་ཅན་གསུམ།</p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
                Only three letters — <span className="font-tibetan font-normal text-xl text-ink">ར</span>, <span className="font-tibetan font-normal text-xl text-ink">ལ</span>, <span className="font-tibetan font-normal text-xl text-ink">ས</span> — may sit above another consonant. When they do, they fall silent themselves and quietly reshape the tone of the root letter beneath. Learn each superscript in turn: which consonants it stacks with, how the pronunciation shifts, and the everyday vocabulary each family unlocks.
              </p>
            </div>
            <div className="w-full md:w-72">
              <div className="mb-2 flex items-center justify-between text-eyebrow">
                <span>Step progress</span>
                <span className="text-brand-dark">{Math.min(completed.size, WEB_STEPS.length)} of {WEB_STEPS.length} sections</span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle overflow-hidden rounded-full">
                <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {SUPERS.map(s => (
                   <button
                     key={s.key}
                     type="button"
                     onClick={() => playAudio(s.headLabel)}
                     disabled={playingItem !== null}
                     className="group flex flex-col items-center gap-1 border border-border-strong p-2.5 bg-surface hover:bg-surface-muted hover:border-brand transition rounded-xl"
                   >
                     <div className="flex items-center gap-1.5">
                       <span className="font-tibetan font-normal text-xl text-ink leading-none pt-1">{s.headLabel}</span>
                       {playingItem === s.headLabel ? (
                         <Loader2 size={11} className="animate-spin text-brand" />
                       ) : (
                         <Volume2 size={11} className="text-brand opacity-60 group-hover:opacity-100 transition-opacity" />
                       )}
                     </div>
                     <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">{s.count} STACKS</div>
                   </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          
          {/* Step 0: Orientation / What You Will Learn */}
          <StepContainer index={0} step={WEB_STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-8 md:grid-cols-[1.15fr,1fr] items-start">
              <div className="space-y-6">
                <p className="text-[15px] leading-relaxed text-ink-light">
                  In this lesson you will learn how <strong className="text-ink">vertical consonant stacks</strong> work from the top down. You'll meet the three superscripts — <strong className="text-ink">Ra-go</strong>, <strong className="text-ink">La-go</strong>, and <strong className="text-ink">Sa-go</strong> — hear how they re-tune the root letter beneath them, practise their traditional aloud-spelling formulas, and read 28 everyday words built from them.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <Sparkles size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Tap any stack card in the grid to hear its spoken pronunciation, or use the Spelling Audio buttons to hear the traditional aloud-spelling.
                    </p>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <Layers size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Switch between Ra-go, La-go, and Sa-go tabs to study each family and complete its focused mastery check.
                    </p>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5">
                      <CheckCircle2 size={15} />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">
                      Follow the color-coded tone arrows (same, higher, or lower) to see how each root's gender shapes the stack's pitch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border-strong shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-5">
                  What you will learn
                </div>
                <div className="space-y-3">
                  {[
                    "What is a superscript?",
                    "Meet the three superscripts",
                    "Vocabulary built from superscripts",
                    "Practice & mastery check",
                    "Final Test",
                  ].map((title, idx) => (
                    <div key={title} className={`flex items-center gap-3.5 ${idx !== 0 ? "pt-3 border-t border-border-subtle" : ""}`}>
                      <span className="w-6 h-6 rounded-md bg-brand-light border border-brand/30 text-brand-dark text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-serif text-[15px] font-bold text-ink leading-snug">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StepContainer>

          {/* Step 1: What is a superscript? */}
          <StepContainer index={1} step={WEB_STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-brand-light px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark rounded-full">
                  <Layers size={14} /> Stacking
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  A superscript is a small consonant written <span className="font-bold text-ink">on top of</span> a root letter. Only three consonants — <span className="font-tibetan font-normal text-xl text-ink">ར ལ ས</span> — are permitted to occupy this position.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 rounded-full">
                  <VolumeX size={14} /> Silence
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  The superscript itself is <span className="font-bold text-ink">not pronounced</span>. Only the root letter is spoken — but the presence of the superscript changes <em>how</em> that root is voiced.
                </p>
              </Card>
              <Card className="p-6 bg-surface">
                <div className="mb-3 inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 rounded-full">
                  <ArrowUp size={14} /> Tone shift
                </div>
                <p className="text-sm leading-relaxed text-ink-light">
                  Depending on the root’s gender, the tone becomes <span className="font-bold text-emerald-700">same</span>, <span className="font-bold text-rose-700">higher</span>, or <span className="font-bold text-sky-700">lower</span> than the base letter alone.
                </p>
              </Card>
            </div>

            <div className="mt-6 p-6 border border-border-strong bg-surface-muted rounded-[1.5rem]">
              <div className="mb-4 flex items-center gap-2 text-eyebrow">
                <Info size={14} className="text-brand" /> Reading the tone arrows
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(Object.keys(TONE_META) as Tone[]).map(t => {
                  const M = TONE_META[t];
                  const rule = t === "same" 
                    ? "Masculine letters keep the root's tone." 
                    : t === "up" 
                    ? "Very-feminine / neuter letters acquire a higher tone." 
                    : "Feminine letters acquire a lower tone.";
                  return (
                    <div key={t} className="flex items-start gap-3 border border-border-strong bg-surface p-4 shadow-sm rounded-2xl">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: M.hex }}>
                        <M.Icon size={16} strokeWidth={2.5} />
                      </span>
                      <div>
                        <div className="text-sm font-bold text-ink">{M.label}</div>
                        <div className="mt-1 text-xs text-ink-muted">{rule}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </StepContainer>

          {/* Step 2: Meet the three superscripts */}
          <StepContainer index={2} step={WEB_STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="mb-6 flex gap-4 p-5 bg-surface-muted border border-border-strong rounded-2xl">
              <Info className="mt-0.5 size-5 shrink-0 text-brand-dark" />
              <p className="text-[15px] leading-relaxed text-ink-light">
                Once the 12 Ra-go (<span className="font-tibetan font-normal text-xl text-ink">ར་མགོ</span>) combinations are mastered, you'll already know about 95% of La-go (<span className="font-tibetan font-normal text-xl text-ink">ལ་མགོ</span>) and Sa-go (<span className="font-tibetan font-normal text-xl text-ink">ས་མགོ</span>), as they share the same sounds. Only a few combinations, such as (<span className="font-tibetan font-normal text-xl text-ink">ལྷ</span>), are unique.
              </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {SUPERS.map((s) => {
                const on = s.key === activeTab;
                return (
                  <button 
                    key={s.key} 
                    onClick={() => setActiveTab(s.key)} 
                    className={`group flex items-center gap-3 border px-4 py-3 text-left transition-all rounded-full ${
                      on ? "border-ink bg-ink text-white shadow-sm" : "border-border-strong bg-surface text-ink hover:border-brand hover:bg-brand-light"
                    }`}
                  >
                    <span 
                      className="grid px-2.5 h-9 place-items-center font-tibetan font-normal text-lg leading-none rounded-lg pt-1" 
                      style={{ backgroundColor: on ? 'rgba(255,255,255,0.12)' : `${s.accent.hex}15`, color: on ? s.accent.hex : s.accent.hex }}
                    >
                      {s.headLabel}
                    </span>
                    <span className="flex-1 pr-1">
                      <span className="block text-sm font-bold">{s.name}</span>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-white/70" : "text-ink-light"}`}>{s.count} stacks</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <SuperPanel sup={SUPERS.find(s => s.key === activeTab)!} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 3: Vocabulary built from superscripts */}
          <StepContainer index={3} step={WEB_STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <VocabGrid 
              items={VOCAB.map(v => {
                const sup = SUPERS.find(s => s.key === v.sup)!;
                return {
                  tib: v.tib, pron: `[${v.translit}]`, en: v.en, emoji: v.emoji,
                  groupId: sup.key,
                  accentHex: sup.accent.hex,
                  badge: { text: sup.name, hex: sup.accent.hex, bg: sup.accent.hex + "15", border: sup.accent.hex + "40" }
                };
              })}
              groups={SUPERS.map(s => ({ id: s.key, label: s.name, hex: s.accent.hex }))}
              playAudio={playAudio} playingItem={playingItem}
            />
		  
            <div className="mt-10">
              <QuizModule 
                moduleId={3} 
                title="Mastery Check · Vocabulary" 
                intro="Check your memory of the new superscript words before moving on." 
                data={VOCAB} 
                playAudio={playAudio} 
                playingItem={playingItem} 
                playErrorBeep={playErrorBeep} 
                questionCount={16} 
                isVocabMatch={true} 
                onPass={() => saveWords(VOCAB.length, 3)} 
              />
            </div>
          </StepContainer>

          {/* Step 4: Practice & mastery check */}
          <StepContainer index={4} step={WEB_STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <p className="mb-6 max-w-3xl text-[15px] text-ink-light leading-relaxed">
              Each superscript has its own <span className="font-bold text-ink">mastery check</span> inside its panel above, followed by this <span className="font-bold text-ink">cumulative review</span> that mixes all three families together.
            </p>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* Step 5: Final Test */}
          <StepContainer index={5} step={WEB_STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)} isLast>
            <QuizModule 
              moduleId={3} 
              title="Final Test" 
              intro="40 questions drawn from everything you covered in this lesson. Score 80% or higher to pass. You can retake the test as many times as you like — your best score is saved." 
              questions={finalQuizQuestions} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              nextLessonPath="/dashboard/lessons/4" 
              onPass={() => markComplete(5)} 
            />
          </StepContainer>

        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/2" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors"><ChevronLeft size={16} /> Previous</Link>
          {expandedStep !== WEB_STEPS.length - 1 && <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}><CheckCircle2 size={18} /> Mark step complete</Button>}
          <Link href="/dashboard/lessons/4" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">Next: Subscripts <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}

function SuperPanel({ sup, playAudio, playingItem, playErrorBeep }: { sup: Super; playAudio: (t: string) => void; playingItem: string | null; playErrorBeep: () => void }) {
  return (
    <div className="relative overflow-hidden border transition-colors duration-500 rounded-[1.5rem] border-border-strong bg-surface">
      <div className="h-1.5 w-full" style={{ backgroundColor: sup.accent.hex }} />
      
      {/* Top Header & Intro Block */}
      <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr] md:p-8 border-b border-border-strong">
        <div className="flex items-center gap-6">
          <div className="grid size-24 sm:size-28 place-items-center font-tibetan font-normal text-[4rem] leading-none rounded-[1.25rem]" style={{ backgroundColor: `${sup.accent.hex}15`, color: sup.accent.hex }}>
            {sup.head}
          </div>
          <div>
            <div className="text-eyebrow mb-2">Superscript</div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-ink">{sup.title}</div>
            <div className="mt-1 font-tibetan font-normal text-2xl text-ink-light">{sup.nameTib}</div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-[15px] leading-relaxed p-5 border flex flex-col gap-3 rounded-2xl bg-surface-muted border-border-strong text-ink-light">
            <p>{renderTibetanText(sup.intro)}</p>
            <div className="flex items-center flex-wrap gap-3 pt-2 text-ink">
              <span className="font-tibetan font-normal text-3xl sm:text-4xl" style={{ color: sup.accent.hex }}>{sup.head}</span>
              <span className="text-xl font-sans opacity-40">+</span>
              <span className="font-tibetan font-normal text-2xl sm:text-3xl leading-relaxed tracking-wider">{sup.rootLetters}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stack Grid */}
      <div className="grid grid-cols-3 gap-px border-b sm:grid-cols-4 md:grid-cols-6 border-border-strong bg-border-strong">
        {sup.combos.map((c) => {
          const M = TONE_META[c.tone as Tone];
          return (
            <button 
              key={c.stack} 
              onClick={() => playAudio(c.stack)} 
              disabled={playingItem !== null} 
              className="group relative flex flex-col items-center justify-center gap-2.5 p-6 transition-colors bg-surface hover:bg-surface-muted"
            >
              <span className="absolute left-0 top-0 h-1 w-full opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundColor: sup.accent.hex }} />
              <span className="font-tibetan font-normal text-[3rem] leading-none text-[#1c1917] pt-1">{c.stack}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{c.read}</span>
              <span className="inline-flex size-5 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: M.hex }} title={M.label}>
                <M.Icon size={12} strokeWidth={3} />
              </span>
              {playingItem === c.stack && <Loader2 size={16} className="absolute top-3 right-3 animate-spin text-brand" />}
            </button>
          );
        })}
      </div>

      {/* Line-by-Line Spelling Walkthrough (Matches Lesson 4 SubPanel!) */}
      <div className="p-6 md:p-8 border-b border-border-strong bg-surface">
        <div className="text-eyebrow mb-6">Spelling walkthrough</div>
        <div className="space-y-2">
          {sup.combos.map((c) => {
            const M = TONE_META[c.tone as Tone];
            return (
              <div key={c.stack} className="flex flex-wrap items-center gap-x-6 gap-y-3 border px-5 py-4 rounded-2xl border-border-strong bg-surface shadow-sm">
                <span className="font-tibetan font-normal text-[2.5rem] leading-none w-12 text-center pt-1">{c.stack}</span>
                <SpellingFormula parts={`${sup.head} + ${c.root} + བཏགས་`} />
                <span className="text-xl font-bold opacity-70 text-border-strong">=</span>
                <div className="flex items-center gap-2">
                  <span className="font-tibetan font-normal text-3xl leading-none pt-1" style={{ color: sup.accent.hex }}>{c.stack}</span>
                  <span className="font-mono text-lg font-bold text-ink">[{c.read}]</span>
                </div>
                <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${M.bg} ${M.text}`}>
                  <M.Icon size={14} strokeWidth={2.5} /> {M.label}
                </span>
                <Button variant="outline" onClick={() => playAudio(c.stack + " spelling")} disabled={playingItem !== null} className="px-4 py-2 rounded-full">
                  {playingItem === (c.stack + " spelling") ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className="text-brand-dark" />} Spelling Audio
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Mastery Check */}
      <div className="p-6 md:p-8 bg-surface-muted">
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: sup.accent.hex }} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Mastery check · {sup.name}</span>
        </div>
        <SuperMiniMasteryLoader sup={sup} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
      </div>
    </div>
  );
}

function SuperMiniMasteryLoader({ sup, playAudio, playingItem, playErrorBeep }: { sup: Super; playAudio: (t: string) => void; playingItem: string | null; playErrorBeep: () => void }) {
  const [seed] = useState(0);
  const questions = useMemo(() => generateSuperscriptQuiz(sup.key), [sup.key, seed]);
  return (
    <QuizModule 
      key={`sup-quiz-${sup.key}-${seed}`} 
      moduleId={3}
      title={`Mastery Check · ${sup.name}`} 
      variant="panel" 
      accentColor={sup.accent.hex} 
      questions={questions} 
      playAudio={playAudio} 
      playingItem={playingItem} 
      playErrorBeep={playErrorBeep} 
    />
  );
}