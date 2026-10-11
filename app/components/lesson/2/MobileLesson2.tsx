// app/components/lesson/2/MobileLesson2.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { 
  Loader2, Volume2, Sparkles, CheckCircle2, 
  ArrowRight, ArrowUp, ArrowDown, Info 
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { 
  VOWELS, 
  VOCAB, 
  POSITION_META, 
  generateSpellingQuiz, 
  generateFinalQuiz, 
  Vowel, 
  Position 
} from "@/app/data/lesson2";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import { InstructionModal } from "@/app/components/ui/InstructionModal";
import { MARK_CONFIG, SpellingFormula } from "@/app/components/ui/SpellingFormula";

export function MobileLesson2() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  
  // Total steps updated for new structure
  const totalSteps = 11; 
  const { markComplete, completed } = useLessonProgress(totalSteps);
  const MODULE_ID = 2;

  // Initialize from saved step so "Resume lesson" opens at the exact point
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
  
  const [selectedVowel, setSelectedVowel] = useState<Vowel | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [hasSeenInstructions, setHasSeenInstructions] = useState(false);

  // Auto-trigger modal on the Diacritics step
  useEffect(() => {
    if (currentStep === 2 && !hasSeenInstructions) {
      setShowInstructions(true);
      setHasSeenInstructions(true);
    }
  }, [currentStep, hasSeenInstructions]);

  // Sync mobile isolated steps to the 9 underlying Web Steps
  const webStepMap = [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8]; 

  const saveWords = async (wordCount: number) => {
    if (user) {
      try {
        const token = await getToken();
        if (token) {
          const formData = new FormData();
          formData.append("user_id", user.id);
          formData.append("new_words", wordCount.toString());

          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update-words`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        }
      } catch (e) {
        console.error("Failed to save words", e);
      }
    }
  };

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    // Save words on the Vocabulary quiz step (Step 8)
    if (currentStep === 8 && !completed.has(currentWebStep)) {
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
        localStorage.setItem("tibetan_last_active_lesson", "3");
      }
      router.push("/dashboard/lessons/3");
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

  const practiceGroups = useMemo(() => [
    {
      name: "Vowels",
      items: VOWELS.map(v => ({
        id: `v-${v.key}`, 
        tibetan: v.tib, 
        reading: `[${v.translit.toLowerCase()}]`, 
        english: POSITION_META[v.position].label, 
        audioTarget: v.translit
      }))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `voc-${v.tib}`, 
        tibetan: v.tib, 
        reading: `[${v.translit}]`, 
        english: v.en, 
        audioTarget: v.tib, 
        emoji: v.emoji
      }))
    }
  ], []);

  const openInspector = (v: Vowel) => {
    setSelectedVowel(v);
    playAudio(v.translit);
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
                  src="/loplao-hero-scene.jpg" 
                  alt="Himalayan Monastery and Mountains" 
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-5 pt-5">
                <h2 className="font-serif text-[26px] leading-tight font-bold text-ink mb-1">
                  The Four Vowels
                </h2>
                <div className="font-serif text-xl text-ink-light italic tibetan mb-4">
                  དབྱངས་བཞི།
                </div>
                <p className="text-[13.5px] leading-relaxed text-ink/80 mb-3.5">
                  Every Tibetan syllable is voiced through a vowel. Just four diacritic marks — three above the letter and one below — turn the thirty consonants into the full range of spoken sound.
                </p>

                <hr className="border-border-subtle mb-3.5" />

                <div className="grid grid-cols-3 divide-x divide-border-subtle text-center py-0.5">
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">4</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Vowels</div>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">3</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Above</div>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">1</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Below</div>
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
                  { mod: "MODULE 01", title: "The four diacritic marks" },
                  { mod: "MODULE 02", title: "Pronouncing the vowels" },
                  { mod: "MODULE 03", title: "Marks & Sounds Mastery" },
                  { mod: "MODULE 04", title: "Spelling rules" },
                  { mod: "MODULE 05", title: "Spelling Mastery" },
                  { mod: "MODULE 06", title: "Vocabulary & Practice" },
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
      // STEP 2: THE DIACRITIC MARKS (PNGs Only)
      // ---------------------------------------------------------
      case 2:
        return (
          <div className="space-y-6 pb-6 flex flex-col">
            <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle shadow-sm mb-2">
              <p className="text-[15px] leading-relaxed text-ink/90">
                The four diacritic marks attach to root letters. Three sit above, and one sits below.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {VOWELS.map((v) => {
                const pm = POSITION_META[v.position];
                const pngConfig = MARK_CONFIG[v.mark.trim()]; 
                return (
                  <button 
                    key={v.key}
                    onClick={() => openInspector(v)}
                    className="bg-white rounded-[1.5rem] shadow-sm border border-border-subtle flex flex-col items-center justify-center p-6 active:scale-95 transition-transform"
                  >
                     <div className="h-16 flex items-center justify-center mb-4">
                       {pngConfig ? (
                         <img src={pngConfig.src} alt={v.markTib} className="h-full w-auto object-contain opacity-90 drop-shadow-sm" />
                       ) : (
                         <span className="font-tibetan text-5xl">{v.mark}</span>
                       )}
                     </div>
                     <span className="font-tibetan text-2xl text-ink leading-none mb-1">{v.markTib}</span>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{v.markTranslit}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 3: TYPE SPECIMEN + PRONOUNCING
      // ---------------------------------------------------------
      case 3:
        return (
          <div className="space-y-4 pb-6">
            <div className="flex gap-4 p-5 bg-surface rounded-[1.5rem] border border-border-strong shadow-sm mb-6">
              <Info className="mt-0.5 size-5 shrink-0 text-brand" />
              <div className="text-[14px] font-bold leading-relaxed text-ink-light">
                The four diacritics replace the inherent [a] of the root letter.
              </div>
            </div>
            {VOWELS.map((v) => (
              <div key={v.key} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-border-subtle flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <button onClick={() => openInspector(v)} className="w-16 h-16 bg-surface-muted border border-border-subtle rounded-[1.25rem] flex items-center justify-center font-tibetan text-4xl leading-none pt-2 text-ink shadow-sm">{v.tib}</button>
                     <div className="flex flex-col gap-1">
                       <span className="font-mono font-bold text-[18px] text-ink">[{v.translit.toLowerCase()}]</span>
                       <span className="text-[11px] font-bold uppercase tracking-widest text-ink-muted">{v.markTranslit}</span>
                     </div>
                   </div>
                   <button onClick={() => playAudio(v.translit)} className="w-12 h-12 shrink-0 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center text-brand-dark active:scale-95 transition-transform shadow-sm">
                     {playingItem === v.translit ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                   </button>
                </div>
                <div className="pt-3 border-t border-border-subtle">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-ink-muted block mb-1">As in English</span>
                  <div className="text-[15px] font-medium text-ink">{v.english}</div>
                </div>
              </div>
            ))}
          </div>
        );

      // ---------------------------------------------------------
      // STEP 4: INTERIM MASTERY CHECK
      // ---------------------------------------------------------
      case 4:
        return (
          <div className="pb-6">
            <QuizModule
              moduleId={2}
              title="Mastery Check · Marks & Sounds" 
              intro="Test your recognition of the vowel marks." 
              data={VOWELS.map(v => ({ tib: v.tib, pron: v.translit, en: v.markTranslit }))} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              questionCount={8} 
              hideHeader={true}
              isUnlockTest={false}
            />
          </div>
        );

      // ---------------------------------------------------------
      // STEP 5: SPELLING MATH (Typo Fixed to ཨ)
      // ---------------------------------------------------------
      case 5:
        return (
          <div className="space-y-6 pb-6">
            {VOWELS.map((v) => (
              <div key={v.key} className="bg-surface-muted rounded-[1.5rem] p-4 sm:p-5 border border-border-subtle shadow-sm">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="w-3 h-1.5 rounded-full" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted">Spelling {v.translit}</span>
                </div>
                
                <div className="bg-white rounded-[1.25rem] p-4 sm:p-5 flex items-center justify-between border border-border-subtle shadow-sm mb-6">
                  <span className="font-tibetan text-4xl leading-none pt-1 text-ink text-center">{v.tib}</span>
                  {/* FIX: Set base letter to ཨ explicitly */}
                  <SpellingFormula parts={`ཨ + ${v.markTib}`} />
                  <ArrowRight size={14} className="text-border-strong hidden sm:block" />
                  <div className="flex flex-col items-center gap-0.5">
                     <span className="font-tibetan text-4xl leading-none pt-1" style={{ color: POSITION_META[v.position].hex }}>{v.tib}</span>
                     <span className="font-mono text-[11px] font-bold text-ink">[{v.translit.toLowerCase()}]</span>
                  </div>
                  <button onClick={() => playAudio(v.tib)} className="w-10 h-10 shrink-0 rounded-full border border-border-strong flex items-center justify-center text-brand-dark bg-surface-muted active:bg-brand-light">
                    {playingItem === v.tib ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                  </button>
                </div>

                {v.spellings && v.spellings.length > 0 && (
                  <>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3 px-1">Try it with other consonants</div>
                    <div className="flex flex-col gap-3">
                      {v.spellings.map((s) => (
                        <div key={s.word} className="flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-[1.25rem] border border-border-subtle shadow-sm active:border-brand/40 transition-colors">
                          <span className="font-tibetan text-3xl leading-none pt-1 text-ink w-8 text-center">{s.word}</span>
                          <SpellingFormula parts={`${s.spell.charAt(0)} + ${v.markTib}`} />
                          <ArrowRight size={14} className="text-border-strong hidden sm:block" />
                          <div className="flex flex-col items-center gap-0.5">
                             <span className="font-tibetan text-3xl leading-none pt-1" style={{ color: POSITION_META[v.position].hex }}>{s.word}</span>
                             <span className="font-mono text-[11px] font-bold text-ink">[{s.roman.split(' ').pop()}]</span>
                          </div>
                          <button onClick={() => playAudio(s.audio || s.word)} className="w-10 h-10 shrink-0 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center text-brand-dark active:bg-brand/40">
                            {playingItem === (s.audio || s.word) ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        );

      // ---------------------------------------------------------
      // STEP 6: SPELLING MASTERY CHECK
      // ---------------------------------------------------------
      case 6:
        return (
          <div className="pb-6">
            <QuizModule 
              moduleId={2}
              title="Mastery Check · Vowel Spelling" 
              intro="Check your spelling and pronunciation before moving to vocabulary." 
              questions={generateSpellingQuiz()} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              hideHeader={true}
              isUnlockTest={false}
            />
          </div>
        );

      // ---------------------------------------------------------
      // STEP 7: VOCABULARY
      // ---------------------------------------------------------
      case 7:
        return (
          <div className="pb-6">
            <div className="grid grid-cols-2 gap-3">
              {VOCAB.map((v) => {
                const pm = POSITION_META[VOWELS.find((x) => x.key === v.vowel)!.position];
                return (
                  <button key={v.tib} onClick={() => playAudio(v.tib)} className="bg-white border border-border-subtle rounded-[1.5rem] p-5 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform relative overflow-hidden">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: pm.hex }} />
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

      // ---------------------------------------------------------
      // STEP 8: VOCABULARY MASTERY CHECK
      // ---------------------------------------------------------
      case 8:
        return (
          <div className="pb-6">
            <QuizModule
              moduleId={2}
              title="Mastery Check · Vocabulary" 
              intro="Score 80% or higher to prove you know these words and add them to your profile." 
              data={VOCAB} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              questionCount={16} 
              isVocabMatch
              hideHeader={true}
              isUnlockTest={false}
            />
          </div>
        );

      // ---------------------------------------------------------
      // STEP 9: PRACTICE DRILLS
      // ---------------------------------------------------------
      case 9:
        return (
          <div className="pb-6">
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </div>
        );

      // ---------------------------------------------------------
      // STEP 10: FINAL ASSESSMENT
      // ---------------------------------------------------------
      case 10:
        return (
          <div className="pb-6">
            <QuizModule 
              moduleId={2}
              title="Final Assessment" 
              intro="Score 80% or higher to unlock the next step: The Three Superscripts." 
              questions={generateFinalQuiz()} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              hideHeader={true}
              nextLessonPath="/dashboard/lessons/3" 
              onPass={() => markComplete(8)} 
            />
          </div>
        );
    }
  };

  const stepTitles = [
    "Welcome to the Four Vowels", 
    "What you'll learn", 
    "The diacritic marks", 
    "Pronouncing the vowels", 
    "Marks & Sounds Mastery", 
    "Spelling rules", 
    "Spelling Mastery", 
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
        unitContext={`Unit 2 · Step ${currentStep + 1} of ${totalSteps}`} 
        title={stepTitles[currentStep]}
        continueText={currentStep === totalSteps - 1 ? "Finish Unit" : "Continue"}
        hideContinue={currentStep === totalSteps - 1} 
      >
        {renderStepContent()}
      </MobileStepPlayer>

      {/* INSPECTOR */}
      {selectedVowel && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity" onClick={() => setSelectedVowel(null)}></div>
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-5 items-center">
                <span className="font-tibetan text-[5rem] leading-none text-ink pt-2">{selectedVowel.tib}</span>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="font-mono text-2xl font-bold text-ink">[{selectedVowel.translit.toLowerCase()}]</div>
                  <div className="text-[12px] font-bold uppercase tracking-widest text-ink-muted">{selectedVowel.markTranslit}</div>
                </div>
              </div>
              <button onClick={() => playAudio(selectedVowel.translit)} className="w-14 h-14 rounded-full bg-brand flex items-center justify-center text-ink shadow-sm active:scale-95 transition-transform">
                {playingItem === selectedVowel.translit ? <Loader2 size={24} className="animate-spin" /> : <Volume2 size={24} />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className={`p-4 rounded-2xl ${POSITION_META[selectedVowel.position].swatch} bg-opacity-50 border`} style={{ borderColor: POSITION_META[selectedVowel.position].hex + "40" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">Position</div>
                <div className={`font-bold text-sm ${POSITION_META[selectedVowel.position].text}`}>{POSITION_META[selectedVowel.position].label}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-border-subtle relative overflow-hidden flex flex-col justify-center items-center h-20">
                <div className="absolute top-2 left-3 text-[10px] font-bold uppercase tracking-widest text-ink-muted">Mark Name</div>
                {MARK_CONFIG[selectedVowel.mark.trim()] ? (
                   <img src={MARK_CONFIG[selectedVowel.mark.trim()].src} alt={selectedVowel.markTib} className="h-8 w-auto object-contain opacity-80 mt-3" />
                ) : (
                   <div className="font-tibetan text-2xl text-ink leading-none mt-3">{selectedVowel.markTib}</div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-[1.25rem] p-5 border border-border-subtle mb-4 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2">Pronunciation</div>
              <p className="text-[16px] font-bold text-ink leading-relaxed">{selectedVowel.english}</p>
            </div>
            <div className="bg-surface-muted rounded-[1.25rem] p-5 border border-border-subtle">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2">Textbook Note</div>
              <p className="text-[14px] leading-relaxed text-ink/90 italic">"{selectedVowel.note}"</p>
            </div>
            <button onClick={() => setSelectedVowel(null)} className="w-full mt-6 py-4 text-center font-bold text-ink hover:bg-ink/5 rounded-full transition-colors">Close</button>
          </div>
        </>
      )}

      <InstructionModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
    </>
  );
}