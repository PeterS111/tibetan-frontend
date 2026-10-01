// app/components/lesson/4/MobileLesson4.tsx
"use client";


import { SpellingFormula, TibetanPart } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Loader2, Volume2, ArrowRight, ArrowUp, ArrowDown, Layers, VolumeX, Info, CheckCircle2, Anchor } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { SUBS, TRIPLE_STACKS, VOCAB, STEPS, TONE_META, generateVocabQuiz, generateFinalQuiz, generateSubscriptQuiz, generateTripleQuiz, Combo, Sub, Stack3, Tone } from "@/app/data/lesson4";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson4() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete, completed } = useLessonProgress(6);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 15; 
  
  const [selectedCombo, setSelectedCombo] = useState<(Combo & { sub: Sub }) | null>(null);
  const [selectedTriple, setSelectedTriple] = useState<Stack3 | null>(null);

  // Sync mobile isolated steps back to the 6 broader Web Steps
  const webStepMap = [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5]; 

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    // Save new vocabulary words to the user's global progress ONLY on Step 12
    if (currentStep === 12 && !completed.has(currentWebStep)) {
      saveWords(VOCAB.length);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push("/dashboard/lessons/5");
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
      items: SUBS.flatMap(s => s.combos.map(c => ({
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

  const openComboInspector = (c: Combo, sub: Sub) => {
    setSelectedCombo({ ...c, sub });
    playAudio(c.stack + " spelling");
  };

  const openTripleInspector = (t: Stack3) => {
    setSelectedTriple(t);
    playAudio(t.stack + " spelling");
  };

  // Consume the clean generators from our data file
  const yaQuiz = useMemo(() => generateSubscriptQuiz("ya"), []);
  const raQuiz = useMemo(() => generateSubscriptQuiz("ra"), []);
  const laQuiz = useMemo(() => generateSubscriptQuiz("la"), []);
  const waQuiz = useMemo(() => generateSubscriptQuiz("wa"), []);
  const tripleQuizQuestions = useMemo(() => generateTripleQuiz(), []);

  const renderSubscriptGrid = (subIndex: number) => {
    const sub = SUBS[subIndex];
    return (
      <div className="pb-6">
        <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle mb-6 shadow-sm">
          <div className="font-tibetan text-6xl text-ink mb-3 leading-none pt-2" style={{ color: sub.accent.hex }}>{sub.headLarge}</div>
          <p className="text-[15px] leading-relaxed text-ink/90">
            {sub.intro}
          </p>
        </div>
        
        <div className="flex items-start gap-3 border-l-4 px-4 py-3 text-sm bg-white rounded-r-[1.25rem] border-y border-r border-border-subtle shadow-sm mb-6" style={{ borderLeftColor: sub.accent.hex }}>
           <Info className="mt-0.5 size-5 shrink-0" style={{ color: sub.accent.hex }} />
           <span className="font-medium leading-relaxed text-ink/80">{sub.usage}</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {sub.combos.map((c) => {
            const TM = TONE_META[c.tone];
            const Icon = TM.Icon;
            return (
              <button 
                key={c.stack} 
                onClick={() => openComboInspector(c, sub)} 
                className="bg-white rounded-[1.25rem] py-6 flex flex-col items-center justify-center text-center active:scale-95 transition-transform shadow-sm border border-border-subtle relative overflow-hidden"
              >
                <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: sub.accent.hex }} />
                <span className="font-tibetan text-[44px] text-ink leading-none mb-4">{c.stack}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink-light mb-3">[{c.read}]</span>
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
                <Anchor size={14} /> Subjoining
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                A subscript is a small consonant written <strong>beneath</strong> a root letter. Only four consonants — <span className="font-tibetan text-xl">ཡ ར ལ ཝ</span> — take this position.
              </p>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-rose-50 text-rose-700">
                <Volume2 size={14} /> Sound change
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                With Ya-tak and Ra-tak, the whole syllable can be pronounced <strong>differently</strong> from either letter alone — e.g. <span className="font-tibetan text-xl">པྱ</span> reads <strong>[cha]</strong>.
              </p>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-sky-50 text-sky-700">
                <ArrowUp size={14} /> Tone shift
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                The tone becomes <strong>same</strong>, <strong>higher</strong>, or <strong>lower</strong> — except with <em>Wa-zur</em>, which leaves both sound and tone unchanged.
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

      case 1: return renderSubscriptGrid(0); // Ya-tak
      case 2: return <div className="pb-6"><QuizModule title="Mastery Check · Ya-tak" questions={yaQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 3: return renderSubscriptGrid(1); // Ra-tak
      case 4: return <div className="pb-6"><QuizModule title="Mastery Check · Ra-tak" questions={raQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 5: return renderSubscriptGrid(2); // La-tak
      case 6: return <div className="pb-6"><QuizModule title="Mastery Check · La-tak" questions={laQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 7: return renderSubscriptGrid(3); // Wa-zur
      case 8: return <div className="pb-6"><QuizModule title="Mastery Check · Wa-zur" questions={waQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 9: // Triple Stacks
        return (
          <div className="pb-6">
            <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle mb-6">
              <div className="font-tibetan text-5xl text-brand-dark mb-3 leading-none pt-2">སྒྱ</div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                Once superscripts and subscripts are both familiar, they combine on a single root letter. The pronunciation follows the same tone rules — the superscript re-tunes, the subscript re-shapes.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {TRIPLE_STACKS.map((t) => {
                const M = TONE_META[t.tone];
                return (
                  <button key={t.stack + t.parts} onClick={() => openTripleInspector(t)} className="bg-white rounded-[1.25rem] p-5 flex flex-col items-center justify-center text-center active:scale-95 transition-transform shadow-sm border border-border-subtle relative overflow-hidden">
                    <span className="absolute inset-x-0 top-0 h-1 bg-teal-600" />
                    <span className="font-tibetan text-[3.5rem] leading-none mb-3 pt-2 text-ink">{t.stack}</span>
                    <span className="text-[12px] font-tibetan tracking-widest text-ink-muted mb-2">{t.parts.replace(/\s\+\s/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-mono font-bold text-ink">[{t.read}]</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${M.bg} ${M.text}`}>
                        <M.Icon size={10} strokeWidth={3} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 10: return <div className="pb-6"><QuizModule title="Mastery Check · Triple Stacks" questions={tripleQuizQuestions} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 11: // Vocab
        return (
          <div className="pb-6">
            <div className="grid grid-cols-2 gap-3">
              {VOCAB.map((v) => {
                const accentHex = v.sub === "triple" ? "#0f766e" : SUBS.find(s => s.key === v.sub)?.accent.hex;
                return (
                  <button key={v.tib} onClick={() => playAudio(v.tib)} className="bg-white border border-border-subtle rounded-[1.5rem] p-5 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform relative overflow-hidden">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accentHex }} />
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

      case 12: return <div className="pb-6"><QuizModule title="Vocabulary Mastery" intro="Score 80% or higher to prove you know these words." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={16} isVocabMatch hideHeader={true} isUnlockTest={false} /></div>;

      case 13: return <div className="pb-6"><PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} /></div>;

      case 14: return <div className="pb-6"><QuizModule title="Final Step Test" intro="Score 80% or higher to unlock the next step: Prefixes." questions={generateFinalQuiz()} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} hideHeader={true} nextLessonPath="/dashboard/lessons/5" onPass={() => markComplete(5)} /></div>;
    }
  };

  const stepTitles = [
    "What is a subscript?", "The Seven Subscripts 'Ya'", "Mastery Check · Ya-tak", 
    "The Thirteen Subscripts 'Ra'", "Mastery Check · Ra-tak", "The Six Subscripts 'La'", 
    "Mastery Check · La-tak", "The Thirteen 'Wa-zur'", "Mastery Check · Wa-zur", 
    "Triple Stacks", "Mastery Check · Triple Stacks", "Vocabulary", "Vocabulary Mastery", 
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
        unitContext={`Unit 4 · Step ${currentStep + 1} of ${totalSteps}`} 
        title={stepTitles[currentStep]}
        continueText={currentStep === totalSteps - 1 ? "Finish Unit" : "Continue"}
        hideContinue={currentStep === totalSteps - 1} 
      >
        {renderStepContent()}
      </MobileStepPlayer>

      {/* BOTTOM SHEET INSPECTOR FOR SUBSCRIPTS */}
      {selectedCombo && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity" onClick={() => setSelectedCombo(null)}></div>
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
            
            <div className="flex flex-col mb-6 bg-white p-6 rounded-[1.5rem] border border-border-subtle shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-6 text-center">Spelling Walkthrough</div>
              
              <div className="flex items-center justify-center mb-6">
  <SpellingFormula parts={`${selectedCombo.root} + ${selectedCombo.sub.headLarge} + བཏགས་`} />
</div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <ArrowRight className="text-border-strong opacity-50" size={20} />
                <span className="font-tibetan text-[4.5rem] leading-none pt-2 text-ink" style={{ color: selectedCombo.sub.accent.hex }}>{selectedCombo.stack}</span>
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

      {/* BOTTOM SHEET INSPECTOR FOR TRIPLE STACKS */}
      {selectedTriple && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity" onClick={() => setSelectedTriple(null)}></div>
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
            
            <div className="flex flex-col mb-6 bg-white p-6 rounded-[1.5rem] border border-border-subtle shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4 text-center">Spelling Walkthrough</div>
              
              {(() => {
                  const [superL, rootL, subL] = selectedTriple.parts.split(' + ');
                  const intMap: Record<string, { tib: string, read: string }> = {
                    "ར_ཀ": { tib: "རྐ", read: "ka" }, "ས_ཀ": { tib: "སྐ", read: "ka" },
                    "ར_ག": { tib: "རྒ", read: "ga" }, "ས_ག": { tib: "སྒ", read: "ga" },
                    "ས_པ": { tib: "སྤ", read: "pa" }, "ས_བ": { tib: "སྦ", read: "ba" },
                    "ར_མ": { tib: "རྨ", read: "ma" }, "ས_མ": { tib: "སྨ", read: "ma" },
                    "ས_ན": { tib: "སྣ", read: "na" }
                  };
                  const intermediate = intMap[`${superL}_${rootL}`] || { tib: "◌", read: "?" };
                  const TM = TONE_META[selectedTriple.tone];
                  const Icon = TM.Icon;

                  return (
                    <>
                      
					  
					 <div className="flex items-center justify-center gap-2 mb-4">
  <SpellingFormula parts={`${superL} + ${rootL} + བཏགས་`} />
  <ArrowRight size={14} className="mx-1 text-border-strong" />
  <TibetanPart part={intermediate.tib} />
</div>

<div className="flex items-center justify-center gap-2 mb-6 border-b border-border-subtle pb-6">
  <div className="opacity-60"><TibetanPart part={intermediate.tib} /></div>
  <span className="text-xs opacity-50 mx-1">+</span>
  <SpellingFormula parts={`${subL} + བཏགས་`} />
</div> 
					  

                      {/* Result */}
                      <div className="flex items-center justify-center gap-4 mb-8">
                        <ArrowRight className="text-border-strong opacity-50" size={20} />
                        <span className="font-tibetan text-[4.5rem] leading-none pt-2 text-teal-700">{selectedTriple.stack}</span>
                        <span className="font-mono text-2xl font-bold text-ink">[{selectedTriple.read}]</span>
                      </div>
                      
                      <div className={`mx-auto w-fit px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${TM.bg} ${TM.text} border ${TM.border}`}>
                        <Icon size={14} strokeWidth={3} /> {TM.label}
                      </div>
                    </>
                  );
              })()}
            </div>

            <div className="flex gap-3">
              <button onClick={() => playAudio(selectedTriple.stack + " spelling")} className="flex-1 py-4 bg-teal-50 text-teal-700 font-bold rounded-full border border-teal-200 active:bg-teal-100 transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === (selectedTriple.stack + " spelling") ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />} 
                <span className="text-sm">Spelling</span>
              </button>
              <button onClick={() => playAudio(selectedTriple.stack)} className="flex-1 py-4 bg-ink text-white font-bold rounded-full active:bg-ink-light transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === selectedTriple.stack ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                <span className="text-sm">Pronunciation</span>
              </button>
            </div>

            <button onClick={() => setSelectedTriple(null)} className="w-full mt-4 py-4 text-center font-bold text-ink hover:bg-ink/5 rounded-full transition-colors">Close</button>
          </div>
        </>
      )}
    </>
  );
}