// app/components/lesson/3/MobileLesson3.tsx
"use client";

import { SpellingFormula, TibetanPart } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Loader2, Volume2, ArrowUp, Layers, VolumeX, Info } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { SUPERS, VOCAB, STEPS, TONE_META, generateFinalQuiz, generateSuperscriptQuiz, Super, Combo, Tone } from "@/app/data/lesson3";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson3() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete, completed } = useLessonProgress(STEPS.length);

  const totalSteps = 13; 
  const MODULE_ID = 3;

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
  
  const [selectedCombo, setSelectedCombo] = useState<(Combo & { sup: Super }) | null>(null);
  const [vocabFilter, setVocabFilter] = useState<"all" | "ra" | "la" | "sa">("all");

  // Sync mobile isolated steps back to the 6 broader Web Steps
  const webStepMap = [0, 0, 1, 2, 2, 2, 2, 2, 2, 3, 3, 4, 5]; 

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    if (currentStep === 10 && !completed.has(currentWebStep)) {
      saveWords(VOCAB.length);
    }

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
        localStorage.setItem("tibetan_last_active_lesson", "4");
      }
      router.push("/dashboard/lessons/4");
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
    playAudio(c.stack);
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
          <div className="pb-4">
            <div className="bg-surface rounded-[1.5rem] border border-border-subtle shadow-sm overflow-hidden">
              
			  
			  <div className="w-full h-40 sm:h-48 bg-surface-muted overflow-hidden relative">
                <img 
                  src="/03_superscripts.jpg" 
                  alt="The Three Superscripts Hero Scene" 
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-5 pt-5">
                <h2 className="font-serif text-[26px] leading-tight font-bold text-ink mb-1">
                  The Three Superscripts
                </h2>
                <div className="font-tibetan text-xl text-ink-light mb-4">
                  མགོ་ཅན་གསུམ།
                </div>
                <p className="text-[13.5px] leading-relaxed text-ink/80 mb-3.5">
                  Only three letters — ར, ལ, ས — may sit above another consonant. When they do, they fall silent themselves and quietly reshape the tone of the root letter beneath.
                </p>

                <hr className="border-border-subtle mb-3.5" />

                <div className="grid grid-cols-3 divide-x divide-border-subtle text-center py-0.5">
                  <div className="px-2">
                    <div className="font-tibetan text-2xl text-ink leading-none pt-1">ར</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-1">12 Stacks</div>
                  </div>
                  <div className="px-2">
                    <div className="font-tibetan text-2xl text-ink leading-none pt-1">ལ</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-1">10 Stacks</div>
                  </div>
                  <div className="px-2">
                    <div className="font-tibetan text-2xl text-ink leading-none pt-1">ས</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-1">11 Stacks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="pb-6">
            <div className="bg-surface rounded-[1.5rem] p-6 sm:p-7 shadow-sm border border-border-subtle">
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-dark mb-6">
                Syllabus Overview
              </div>

              <div className="space-y-5">
                {[
                  { mod: "MODULE 01", title: "What is a superscript?" },
                  { mod: "MODULE 02", title: "The three superscripts" },
                  { mod: "MODULE 03", title: "Stack Mastery Checks" },
                  { mod: "MODULE 04", title: "Vocabulary & Practice" },
                ].map((item, idx) => (
                  <div 
                    key={item.mod} 
                    className={`flex flex-col gap-1 ${idx !== 0 ? "pt-4 border-t border-border-subtle/70" : ""}`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                      {item.mod}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand shrink-0"></span>
                      <span className="font-serif text-[17px] font-bold text-ink leading-snug">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
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

      case 3: return renderSuperscriptGrid(0); // Ra-go
      case 4: return (
        <div className="pb-6">
          <QuizModule moduleId={3} title="Mastery Check · Ra-go" intro="Test your spelling and recognition." questions={generateSuperscriptQuiz("ra")} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} />
        </div>
      );

      case 5: return renderSuperscriptGrid(1); // La-go
      case 6: return (
        <div className="pb-6">
          <QuizModule moduleId={3} title="Mastery Check · La-go" intro="Test your spelling and recognition." questions={generateSuperscriptQuiz("la")} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} />
        </div>
      );

      case 7: return renderSuperscriptGrid(2); // Sa-go
      case 8: return (
        <div className="pb-6">
          <QuizModule moduleId={3} title="Mastery Check · Sa-go" intro="Test your spelling and recognition." questions={generateSuperscriptQuiz("sa")} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} />
        </div>
      );

      case 9: {
        const filteredVocab = vocabFilter === "all" ? VOCAB : VOCAB.filter(v => v.sup === vocabFilter);
        return (
          <div className="space-y-5 pb-6 flex flex-col">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setVocabFilter("all")}
                className={`inline-flex items-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors border rounded-full ${
                  vocabFilter === "all" ? "bg-ink text-white border-ink shadow-sm" : "bg-white text-ink-muted border-border-subtle hover:text-ink hover:bg-surface-muted active:scale-95"
                }`}
              >
                All {VOCAB.length}
              </button>
              {SUPERS.map(s => (
                <button 
                  key={s.key}
                  onClick={() => setVocabFilter(s.key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    vocabFilter === s.key ? "bg-ink text-white border-ink shadow-sm" : "bg-white text-ink-muted border-border-subtle hover:text-ink hover:bg-surface-muted active:scale-95"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.accent.hex }} />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredVocab.map((v) => {
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
      }

      case 10:
        return (
          <div className="pb-6">
            <QuizModule moduleId={3} title="Mastery Check · Vocabulary" intro="Score 80% or higher to prove you know these words." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={16} isVocabMatch hideHeader={true} isUnlockTest={false} />
          </div>
        );

      case 11:
        return (
          <div className="pb-6">
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </div>
        );

      case 12:
        return (
          <div className="pb-6">
            <QuizModule moduleId={3} title="Final Assessment" intro="Score 80% or higher to unlock the next step: Subscripts." questions={generateFinalQuiz()} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} hideHeader={true} nextLessonPath="/dashboard/lessons/4" onPass={() => markComplete(5)} />
          </div>
        );
    }
  };

  
  const stepTitles = [
    "Welcome to the Three Superscripts",
    "What you'll learn",
    "What is a superscript?", 
    "The 12 Stacks of 'Ra'", 
    "Mastery Check · Ra-go", 
    "The 10 Stacks of 'La'", 
    "Mastery Check · La-go", 
    "The 11 Stacks of 'Sa'", 
    "Mastery Check · Sa-go", 
    "Vocabulary", 
    "Vocabulary Mastery", 
    "Practice & exercises", 
    "Final Mastery Check" 
  ];

  const stepTibetanTitles: (string | undefined)[] = [
    undefined,
    undefined,
    "མགོ་ཅན།",
    "ར་མགོ་བཅུ་གཉིས།",
    "ར་མགོའི་སྦྱོང་ཚན།",
    "ལ་མགོ་བཅུ།",
    "ལ་མགོའི་སྦྱོང་ཚན།",
    "ས་མགོ་བཅུ་གཅིག།",
    "ས་མགོའི་སྦྱོང་ཚན།",
    "ཚིག་གསར།",
    "ཚིག་གསར་སྦྱོང་ཚན།",
    "སྦྱོང་ཚན།",
    "རྒྱུགས་སྤྲོད།"
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
        tibetanTitle={stepTibetanTitles[currentStep]}
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
              {/* 1. Top: Large Final Syllable + Phonetics */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="font-tibetan text-[4.5rem] leading-none pt-2 text-ink">{selectedCombo.stack}</span>
                <span className="font-mono text-2xl font-bold text-ink">[{selectedCombo.read}]</span>
              </div>

              {/* 2. Middle: Spelling Equation including = Final Syllable in matching font */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <SpellingFormula parts={`${selectedCombo.sup.head} + ${selectedCombo.root} + བཏགས་`} />
                <span className="text-lg font-sans font-bold text-border-strong opacity-70 mt-1 mx-1">=</span>
                <span className="flex items-center justify-center min-w-[28px] px-1">
                  <TibetanPart part={selectedCombo.stack} />
                </span>
              </div>

              {/* 3. Bottom: Tone Badge */}
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

            {/* Inverted Buttons: 1st Pronunciation, 2nd Spelling */}
            <div className="flex gap-3">
              <button onClick={() => playAudio(selectedCombo.stack)} className="flex-1 py-4 bg-ink text-white font-bold rounded-full active:bg-ink-light transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === selectedCombo.stack ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                <span className="text-sm">Pronunciation</span>
              </button>
              <button onClick={() => playAudio(selectedCombo.stack + " spelling")} className="flex-1 py-4 bg-brand-light text-brand-dark font-bold rounded-full border border-brand/20 active:bg-brand/30 transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === (selectedCombo.stack + " spelling") ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />} 
                <span className="text-sm">Spelling</span>
              </button>
            </div>

            <button onClick={() => setSelectedCombo(null)} className="w-full mt-4 py-4 text-center font-bold text-ink hover:bg-ink/5 rounded-full transition-colors">Close</button>
          </div>
        </>
      )}
    </>
  );
}