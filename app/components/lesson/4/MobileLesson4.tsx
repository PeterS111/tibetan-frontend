// app/components/lesson/4/MobileLesson4.tsx
"use client";

import { SpellingFormula, TibetanPart } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Loader2, Volume2, ArrowUp, Info, Anchor } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { SUBS, TRIPLE_STACKS, TRIPLE_ACCENT, VOCAB, TONE_META, generateFinalQuiz, generateSubscriptQuiz, generateTripleQuiz, Combo, Sub, Stack3, Tone, VocabGroup } from "@/app/data/lesson4";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson4() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete, completed } = useLessonProgress(6);

  const totalSteps = 17; 
  const MODULE_ID = 4;

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
  
  const [selectedCombo, setSelectedCombo] = useState<(Combo & { sub: Sub }) | null>(null);
  const [selectedTriple, setSelectedTriple] = useState<Stack3 | null>(null);
  const [vocabFilter, setVocabFilter] = useState<"all" | VocabGroup>("all");

  // Sync mobile isolated steps back to the 6 broader Web Steps
  const webStepMap = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5]; 

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    // Save new vocabulary words to the user's global progress ONLY on Step 14 (Vocab Mastery)
    if (currentStep === 14 && !completed.has(currentWebStep)) {
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
        localStorage.setItem("tibetan_last_active_lesson", "5");
      }
      router.push("/dashboard/lessons/5");
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
    playAudio(c.stack);
  };

  const openTripleInspector = (t: Stack3) => {
    setSelectedTriple(t);
    playAudio(t.stack);
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
      // ---------------------------------------------------------
      // STEP 0: WELCOME HERO CARD
      // ---------------------------------------------------------
      case 0:
        return (
          <div className="pb-4">
            <div className="bg-surface rounded-[1.5rem] border border-border-subtle shadow-sm overflow-hidden">
              
			  
			  <div className="w-full h-40 sm:h-48 bg-surface-muted overflow-hidden relative">
                <img 
                  src="/04_subscripts.jpg" 
                  alt="The Four Subscripts Hero Scene" 
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-5 pt-5">
                <h2 className="font-serif text-[26px] leading-tight font-bold text-ink mb-1">
                  The Four Subscripts
                </h2>
                <div className="font-tibetan text-xl text-ink-light mb-4">
                  འདོགས་ཅན་བཞི།
                </div>
                <p className="text-[13.5px] leading-relaxed text-ink/80 mb-3.5">
                  Four consonants — ཡ, ར, ལ, ཝ — can be written beneath a root letter in reduced form. Together with superscripts, they complete the vertical stacking system of Tibetan script.
                </p>

                <hr className="border-border-subtle mb-3.5" />

                <div className="grid grid-cols-3 divide-x divide-border-subtle text-center py-0.5">
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">4</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Subscripts</div>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">39</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Stacks</div>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">14</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Triple Stacks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 1: WHAT YOU'LL LEARN
      // ---------------------------------------------------------
      case 1:
        return (
          <div className="pb-6">
            <div className="bg-surface rounded-[1.5rem] p-6 sm:p-7 shadow-sm border border-border-subtle">
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-dark mb-6">
                Syllabus Overview
              </div>

              <div className="space-y-5">
                {[
                  { mod: "MODULE 01", title: "What is a subscript?" },
                  { mod: "MODULE 02", title: "The four subscripts (Ya, Ra, La, Wa)" },
                  { mod: "MODULE 03", title: "Three-letter triple stacks" },
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

      // ---------------------------------------------------------
      // STEP 2: WHAT IS A SUBSCRIPT?
      // ---------------------------------------------------------
      case 2:
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

      case 3: return renderSubscriptGrid(0); // Ya-tak
      case 4: return <div className="pb-6"><QuizModule moduleId={4} title="Mastery Check · Ya-tak" questions={yaQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 5: return renderSubscriptGrid(1); // Ra-tak
      case 6: return <div className="pb-6"><QuizModule moduleId={4} title="Mastery Check · Ra-tak" questions={raQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 7: return renderSubscriptGrid(2); // La-tak
      case 8: return <div className="pb-6"><QuizModule moduleId={4} title="Mastery Check · La-tak" questions={laQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 9: return renderSubscriptGrid(3); // Wa-zur
      case 10: return <div className="pb-6"><QuizModule moduleId={4} title="Mastery Check · Wa-zur" questions={waQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 11: // Triple Stacks
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

      case 12: return <div className="pb-6"><QuizModule moduleId={4} title="Mastery Check · Triple Stacks" questions={tripleQuizQuestions} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 13: { // Vocab (With Subscript & Triple Stack Filter Pills)
        const filteredVocab = vocabFilter === "all" ? VOCAB : VOCAB.filter(v => v.sub === vocabFilter);
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
              {SUBS.map((s) => (
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
              <button 
                onClick={() => setVocabFilter("triple")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  vocabFilter === "triple" ? "bg-ink text-white border-ink shadow-sm" : "bg-white text-ink-muted border-border-subtle hover:text-ink hover:bg-surface-muted active:scale-95"
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TRIPLE_ACCENT }} />
                <span>Triple Stacks</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredVocab.map((v) => {
                const accentHex = v.sub === "triple" ? TRIPLE_ACCENT : SUBS.find(s => s.key === v.sub)?.accent.hex;
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
      }

      case 14: return <div className="pb-6"><QuizModule moduleId={4} title="Mastery Check · Vocabulary" intro="Score 80% or higher to prove you know these words." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={16} isVocabMatch hideHeader={true} isUnlockTest={false} /></div>;

      case 15: return <div className="pb-6"><PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} /></div>;

      case 16: return <div className="pb-6"><QuizModule moduleId={4} title="Final Assessment" intro="Score 80% or higher to unlock the next step: Prefixes." questions={generateFinalQuiz()} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} hideHeader={true} nextLessonPath="/dashboard/lessons/5" onPass={() => markComplete(5)} /></div>;
    }
  };

  const stepTitles = [
    "Welcome to the Four Subscripts",
    "What you'll learn",
    "What is a subscript?", 
    "The Seven Subscripts 'Ya'", 
    "Mastery Check · Ya-tak", 
    "The Thirteen Subscripts 'Ra'", 
    "Mastery Check · Ra-tak", 
    "The Six Subscripts 'La'", 
    "Mastery Check · La-tak", 
    "The Thirteen 'Wa-zur'", 
    "Mastery Check · Wa-zur", 
    "Triple Stacks", 
    "Mastery Check · Triple Stacks", 
    "Vocabulary", 
    "Vocabulary Mastery", 
    "Practice & exercises", 
    "Final Mastery Check" 
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
              {/* 1. Top: Large Final Syllable + Phonetics */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="font-tibetan text-[4.5rem] leading-none pt-2 text-ink" style={{ color: selectedCombo.sub.accent.hex }}>{selectedCombo.stack}</span>
                <span className="font-mono text-2xl font-bold text-ink">[{selectedCombo.read}]</span>
              </div>

              {/* 2. Middle: Spelling Equation including = Final Syllable in matching font */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <SpellingFormula parts={`${selectedCombo.root} + ${selectedCombo.sub.headLarge} + བཏགས་`} />
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

      {/* BOTTOM SHEET INSPECTOR FOR TRIPLE STACKS */}
      {selectedTriple && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity" onClick={() => setSelectedTriple(null)}></div>
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
            
            <div className="flex flex-col mb-6 bg-white p-6 rounded-[1.5rem] border border-border-subtle shadow-sm">
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
                      {/* 1. Top: Large Final Syllable + Phonetics */}
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="font-tibetan text-[4.5rem] leading-none pt-2 text-teal-700">{selectedTriple.stack}</span>
                        <span className="font-mono text-2xl font-bold text-ink">[{selectedTriple.read}]</span>
                      </div>

                      {/* 2. Middle: Two-step Spelling Equation including = Final Syllable in matching font */}
                      <div className="flex flex-col items-center justify-center mb-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <SpellingFormula parts={`${superL} + ${rootL} + བཏགས་`} />
                          <span className="text-lg font-sans font-bold text-border-strong opacity-70 mt-1 mx-1">=</span>
                          <span className="flex items-center justify-center min-w-[28px] px-1">
                            <TibetanPart part={intermediate.tib} />
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <span className="flex items-center justify-center min-w-[28px] px-1 opacity-75">
                            <TibetanPart part={intermediate.tib} />
                          </span>
                          <span className="text-lg font-sans opacity-40 text-ink-light mt-1">+</span>
                          <SpellingFormula parts={`${subL} + བཏགས་`} />
                          <span className="text-lg font-sans font-bold text-border-strong opacity-70 mt-1 mx-1">=</span>
                          <span className="flex items-center justify-center min-w-[28px] px-1">
                            <TibetanPart part={selectedTriple.stack} />
                          </span>
                        </div> 
                      </div>
                      
                      {/* 3. Bottom: Tone Badge */}
                      <div className={`mx-auto w-fit px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${TM.bg} ${TM.text} border ${TM.border}`}>
                        <Icon size={14} strokeWidth={3} /> {TM.label}
                      </div>
                    </>
                  );
              })()}
            </div>

            {/* Inverted Buttons: 1st Pronunciation, 2nd Spelling */}
            <div className="flex gap-3">
              <button onClick={() => playAudio(selectedTriple.stack)} className="flex-1 py-4 bg-ink text-white font-bold rounded-full active:bg-ink-light transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === selectedTriple.stack ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                <span className="text-sm">Pronunciation</span>
              </button>
              <button onClick={() => playAudio(selectedTriple.stack + " spelling")} className="flex-1 py-4 bg-brand-light text-brand-dark font-bold rounded-full border border-brand/20 active:bg-brand/30 transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === (selectedTriple.stack + " spelling") ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />} 
                <span className="text-sm">Spelling</span>
              </button>
            </div>

            <button onClick={() => setSelectedTriple(null)} className="w-full mt-4 py-4 text-center font-bold text-ink hover:bg-ink/5 rounded-full transition-colors">Close</button>
          </div>
        </>
      )}
    </>
  );
}