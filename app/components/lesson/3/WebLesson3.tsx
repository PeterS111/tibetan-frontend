// app/components/lesson/3/WebLesson3.tsx
"use client";

import { SpellingFormula } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/clerk-react";
import { ChevronRight, ChevronLeft, ArrowRight, ArrowUp, ArrowDown, Info, Volume2, Loader2, CheckCircle2 } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { usePlatform } from "@/hooks/usePlatform";

import { SUPERS, VOCAB, STEPS, TONE_META, generateFinalQuiz, Super, Combo, Tone } from "@/app/data/lesson3";

import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";
import { DraggablePanel } from "@/app/components/ui/DraggablePanel";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";

export function WebLesson3() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { unlockedStep, expandedStep, completed, progressPercent, toggleStep, markComplete, statusOf } = useLessonProgress(STEPS.length);
  const { isNative } = usePlatform();

  const [selected, setSelected] = useState<{ c: Combo, sup: Super, rect: DOMRect } | null>(null);
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
            await markComplete(STEPS.length - 1);
            setTimeout(() => window.location.href = "/dashboard", 1000);
          }} 
          disabled={isBypassing}
          className="w-full mb-8 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 text-center tracking-widest shadow-lg disabled:opacity-50"
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

        <Card className="mb-8 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <div className="text-eyebrow text-brand-dark mb-2">Lesson 03 · Foundations</div>
            <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">The Three Superscripts</h1>
            <p className="mt-1 font-serif text-2xl text-ink-light italic tibetan">མགོ་ཅན་གསུམ།</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
              Only three letters — ར, ལ, ས — may sit above another consonant. When they do, they fall silent themselves and quietly reshape the tone of the root letter beneath.
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="mb-2 flex items-center justify-between text-eyebrow">
              <span>Lesson progress</span>
              <span className="text-brand-dark">{Math.min(unlockedStep, STEPS.length)} of {STEPS.length} sections</span>
            </div>
            <div className="h-1.5 w-full bg-border-subtle overflow-hidden">
              <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-4 flex gap-2 text-center justify-between">
              {SUPERS.map(s => (
                 <div key={s.key} className="flex-1 border border-border-subtle p-2 bg-surface-muted">
                   <div className="font-tibetan text-2xl">{s.headLabel}</div>
                   <div className="text-[9px] uppercase tracking-widest text-ink-muted">{s.count} STACKS</div>
                 </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          
          <StepContainer index={0} step={STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-border-subtle">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-brand-light text-brand-dark">Stacking</div>
                <p className="text-[15px] leading-relaxed text-ink/90">A superscript is a small consonant written <strong>on top of</strong> a root letter. Only three consonants — <span className="font-tibetan text-xl">ར ལ ས</span> — are permitted.</p>
              </div>
              <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-border-subtle">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-amber-50 text-amber-700">Silence</div>
                <p className="text-[15px] leading-relaxed text-ink/90">The superscript itself is <strong>not pronounced</strong>. Only the root letter is spoken.</p>
              </div>
              <div className="bg-white rounded-[1.25rem] p-6 shadow-sm border border-border-subtle">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-emerald-50 text-emerald-700">Tone Shift</div>
                <p className="text-[15px] leading-relaxed text-ink/90">Depending on the root's gender, the tone becomes <strong>same</strong>, <strong>higher</strong>, or <strong>lower</strong>.</p>
              </div>
            </div>
            <div className="bg-surface-muted rounded-[1.5rem] p-6 border border-border-subtle mt-6 max-w-3xl">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4"><Info size={14} /> Reading the tone arrows</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {(Object.keys(TONE_META) as Tone[]).map(t => {
                  const meta = TONE_META[t];
                  const Icon = meta.Icon;
                  return (
                    <div key={t} className="bg-white rounded-[1.25rem] p-4 flex flex-col items-start gap-3 shadow-sm border border-border-subtle">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.bg} ${meta.text}`}><Icon size={16} strokeWidth={3} /></div>
                      <div className="font-bold text-sm text-ink">{meta.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </StepContainer>

          <StepContainer index={1} step={STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <div className="space-y-12">
              {SUPERS.map(sup => (
                <div key={sup.key} className="p-6 md:p-8 border border-border-subtle bg-surface shadow-sm relative overflow-hidden rounded-[1.5rem]">
                   <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: sup.accent.hex }} />
                   <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                       <h3 className="font-serif text-3xl font-bold text-ink mb-2">{sup.title}</h3>
                       <p className="text-ink-light text-[15px] max-w-xl">{sup.intro}</p>
                     </div>
                     <div className="shrink-0 bg-surface-muted px-6 py-4 rounded-[1.25rem] border border-border-subtle text-center">
                        <div className="font-tibetan text-4xl mb-1">{sup.headLabel}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{sup.count} Stacks</div>
                     </div>
                   </div>
                   <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                     {sup.combos.map(c => {
                       const TM = TONE_META[c.tone];
                       const Icon = TM.Icon;
                       return (
                         <button key={c.stack} onClick={(e) => { if (!isNative) setSelected({ c, sup, rect: e.currentTarget.getBoundingClientRect() }); playAudio(c.stack + " spelling"); }} className="group bg-white rounded-[1.25rem] py-5 flex flex-col items-center justify-center text-center active:scale-95 transition-all duration-300 shadow-sm border border-border-subtle hover:border-brand hover:shadow-md relative">
                           <span className="font-tibetan text-[40px] text-ink leading-none mb-3 group-hover:scale-110 transition-transform">{c.stack}</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-ink-light mb-2">[{c.read}]</span>
                           <div className={`w-5 h-5 rounded-full flex items-center justify-center ${TM.bg} ${TM.text}`}><Icon size={12} strokeWidth={3} /></div>
                         </button>
                       )
                     })}
                   </div>
                </div>
              ))}
            </div>
          </StepContainer>

          <StepContainer index={2} step={STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <VocabGrid 
              items={VOCAB.map(v => {
                const sup = SUPERS.find(s => s.key === v.sup)!;
                return {
                  tib: v.tib, pron: `[${v.translit}]`, en: v.en, emoji: v.emoji,
                  badge: { text: sup.headLabel, hex: sup.accent.hex, bg: sup.accent.bg, border: sup.accent.border }
                };
              })}
              playAudio={playAudio} playingItem={playingItem}
            />
            <div className="mt-10">
              <QuizModule title="Vocabulary Mastery" intro="Score 80% or higher to prove you know these words." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={16} isVocabMatch isUnlockTest={true} onPass={() => saveWords(VOCAB.length, 2)} />
            </div>
          </StepContainer>

          <StepContainer index={3} step={STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          <StepContainer index={4} step={STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)} isLast>
            <QuizModule title="Final Step Test" intro="Score 80% or higher to unlock the next step: Subscripts." questions={finalQuizQuestions} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} nextLessonPath="/dashboard/lessons/4" onPass={() => markComplete(4)} />
          </StepContainer>

        </div>
      </div>

      {selected && <DetailPanel data={selected} onClose={() => setSelected(null)} onSpeak={playAudio} playingItem={playingItem} />}
      
      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard/lessons/2" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors"><ChevronLeft size={16} /> Previous</Link>
          {expandedStep !== STEPS.length - 1 && <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}><CheckCircle2 size={18} /> Mark step complete</Button>}
          <Link href="/dashboard/lessons/4" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">Next: Subscripts <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ data, onClose, onSpeak, playingItem }: { data: { c: Combo, sup: Super, rect: DOMRect }, onClose: () => void, onSpeak: (t: string) => void, playingItem: string | null }) {
  const { c, sup, rect } = data;
  const TM = TONE_META[c.tone];

  return (
    <DraggablePanel rect={rect} title={`Spelling · ${c.read}`} onClose={onClose}>
      <div className="flex flex-col items-center mb-8">
        
        {/* NEW: Centralized Spelling Formula */}
        <div className="flex items-center justify-center mb-6">
          <SpellingFormula parts={`${sup.head} + ${c.root} + བཏགས་`} />
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <ArrowRight className="text-border-strong opacity-50" size={20} />
          <span className="font-tibetan text-[4.5rem] leading-none text-ink pt-2">{c.stack}</span>
          <span className="font-mono text-2xl font-bold text-ink">[{c.read}]</span>
        </div>
        <div className={`w-fit px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${TM.bg} ${TM.text} border ${TM.border}`}>
          <TM.Icon size={14} strokeWidth={3} /> {TM.label}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={() => onSpeak(c.stack + " spelling")} className="w-full py-3 bg-surface-muted text-ink font-bold rounded-lg border border-border-strong active:bg-surface transition-colors flex items-center justify-center gap-2">
          {playingItem === (c.stack + " spelling") ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />} Spelling Audio
        </button>
        <button onClick={() => onSpeak(c.stack)} className="w-full py-3 bg-ink text-white font-bold rounded-lg active:bg-ink-light transition-colors flex items-center justify-center gap-2">
          {playingItem === c.stack ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />} Word Audio
        </button>
      </div>
    </DraggablePanel>
  );
}