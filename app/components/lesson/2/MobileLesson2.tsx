// app/components/lesson/2/MobileLesson2.tsx
"use client";


import { SpellingFormula } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Loader2, Volume2, Sparkles, Layers, CheckCircle2, ArrowRight, ArrowUp, ArrowDown, Info } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { VOWELS, VOCAB, STEPS, POSITION_META, generateSpellingQuiz, generateFinalQuiz, Vowel, Position } from "@/app/data/lesson2";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson2() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete, completed } = useLessonProgress(STEPS.length);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 11; 
  
  const [selectedVowel, setSelectedVowel] = useState<Vowel | null>(null);

  const webStepMap = [0, 0, 0, 1, 2, 3, 3, 4, 4, 5, 6]; 

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    if (currentStep === 8 && !completed.has(currentWebStep)) {
      saveWords(VOCAB.length);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push("/dashboard/lessons/3");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
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

  const practiceGroups = useMemo(() => [
    {
      name: "Vowels",
      items: VOWELS.map(v => ({
        id: `v-${v.key}`, tibetan: v.tib, reading: `[${v.translit.toLowerCase()}]`, english: POSITION_META[v.position].label, audioTarget: v.translit
      }))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `voc-${v.tib}`, tibetan: v.tib, reading: `[${v.translit}]`, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

  const openInspector = (v: Vowel) => {
    setSelectedVowel(v);
    playAudio(v.translit);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 pb-4">
            <p className="font-serif text-[22px] text-ink-light italic tibetan -mt-6">དབྱངས་བཞི།</p>
            <p className="text-[16px] leading-relaxed text-ink/80">
              Every Tibetan syllable is voiced through a vowel. Just four diacritic marks — three above the letter and one below — turn the thirty consonants into the full range of spoken sound.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="border border-border-subtle p-3 bg-surface-muted rounded-[1.25rem]">
                <div className="font-serif text-2xl text-ink">4</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-muted mt-1 font-bold">Vowels</div>
              </div>
              <div className="border border-border-subtle p-3 bg-surface-muted rounded-[1.25rem]">
                <div className="font-serif text-2xl text-ink">3</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-muted mt-1 font-bold">Above</div>
              </div>
              <div className="border border-border-subtle p-3 bg-surface-muted rounded-[1.25rem]">
                <div className="font-serif text-2xl text-ink">1</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-muted mt-1 font-bold">Below</div>
              </div>
            </div>
            <ul className="space-y-4 text-[14px] text-ink-light pt-2">
              <li className="flex items-start gap-3"><Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /><span>Tap any mark to hear its sound and inspect its rules.</span></li>
              <li className="flex items-start gap-3"><Layers className="mt-0.5 size-4 shrink-0 text-brand" /><span>Steps unlock as you continue, but you can peek ahead.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" /><span>Completed steps are marked and stay open for review.</span></li>
            </ul>
          </div>
        );

      case 1:
        return (
          <div className="pb-6">
            <div className="bg-surface rounded-[1.5rem] p-6 shadow-sm border border-border-subtle mt-2">
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-6">What you'll learn</div>
              <ul className="space-y-5 text-[15px] font-bold text-ink-light">
                {STEPS.slice(1, -1).map((s, i) => (
                  <li key={s.id} className="flex items-start gap-4">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-surface-muted border border-border-strong text-ink flex items-center justify-center text-[11px] mt-0.5">{i + 1}</span>
                    <span className="mt-1 leading-snug">{s.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 pb-6 flex flex-col">
            <div className="grid grid-cols-2 gap-3">
              {VOWELS.map((v) => (
                <button 
                  key={v.key}
                  onClick={() => openInspector(v)}
                  className="bg-white rounded-[1.5rem] aspect-square shadow-sm border border-border-subtle flex flex-col items-center justify-center text-center active:scale-95 transition-transform overflow-hidden relative"
                >
                  <span className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                  <span className="font-tibetan text-6xl text-ink leading-none mt-2">{v.tib}</span>
                  <div className="flex flex-col gap-0.5 mt-4">
                    <span className="font-mono text-[16px] font-bold text-ink">[{v.translit.toLowerCase()}]</span>
                    <span className="font-bold text-[10px] uppercase tracking-widest text-ink-muted">{v.markTranslit}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-6 text-[10px] font-bold text-ink-muted uppercase tracking-widest bg-surface p-4 rounded-[1.25rem] border border-border-subtle shadow-sm">
              <span>Legend</span>
              {(Object.keys(POSITION_META) as Position[]).map((p) => (
                <div key={p} className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: POSITION_META[p].hex }} />
                  <span>{POSITION_META[p].label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 pb-6">
            {VOWELS.map((v) => {
              const pm = POSITION_META[v.position];
              return (
                <div key={v.key} className={`p-6 rounded-[1.5rem] border bg-surface ${pm.ring} shadow-sm`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 ${pm.swatch} ${pm.text}`}>
                    {v.position === "above" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {pm.label}
                  </div>
                  <div className="flex items-center gap-5 mb-6">
                    <button onClick={() => playAudio(v.tib)} className="font-tibetan text-[4.5rem] leading-none pt-2 text-ink active:opacity-50 transition-opacity">{v.tib}</button>
                    <div className="flex flex-col gap-2">
                      <div className="font-mono font-bold text-2xl text-ink">[{v.translit.toLowerCase()}]</div>
                      <button 
                        onClick={() => playAudio(v.tib)}
                        className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center border border-border-strong text-ink-muted active:text-brand"
                      >
                        {playingItem === v.tib ? <Loader2 size={16} className="animate-spin text-brand" /> : <Volume2 size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-border-subtle">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3">Mark Name</div>
                    <button onClick={() => playAudio(v.markTranslit)} className="flex items-center gap-3 active:opacity-60 transition-opacity">
                      <span className="font-tibetan text-3xl text-ink">{v.markTib}</span>
                      <span className="font-serif italic text-lg text-ink-light">{v.markTranslit}</span>
                      <Volume2 size={16} className="text-brand-dark ml-2" />
                    </button>
                    <p className="mt-4 text-[14px] leading-relaxed text-ink/80 bg-surface-muted p-4 rounded-[1.25rem] border border-border-subtle">{v.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 pb-6">
            <div className="flex gap-4 p-5 bg-surface rounded-[1.5rem] border border-border-strong shadow-sm mb-6">
              <Info className="mt-0.5 size-5 shrink-0 text-brand" />
              <div className="text-[14px] font-bold leading-relaxed text-ink-light">
                The absence of a vowel mark on a Tibetan letter is treated as an inherent <span className="font-mono font-bold text-ink">[a]</span> — for example ཀ is read <em>[ka]</em>, not <em>k</em>. The four diacritics replace that inherent [a].
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

      case 5:
        return (
          <div className="space-y-6 pb-6">
            {VOWELS.map((v) => (
              <div key={v.key} className="bg-surface-muted rounded-[1.5rem] p-4 sm:p-5 border border-border-subtle shadow-sm">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="w-3 h-1.5 rounded-full" style={{ backgroundColor: POSITION_META[v.position].hex }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted">Spelling {v.translit}</span>
                </div>
                
                {/* NO SHARP EDGES. Beautiful floating rounded card! */}
                <div className="bg-white rounded-[1.25rem] p-4 sm:p-5 flex items-center justify-between border border-border-subtle shadow-sm mb-6">
                  <span className="font-tibetan text-4xl leading-none pt-1 text-ink text-center">{v.tib}</span>
                  <SpellingFormula parts={`${v.examples?.[0]?.charAt(0) || "ཨ"} + ${v.markTib}`} />
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

      case 6:
        return (
          <div className="pb-6">
            <QuizModule 
              title="Spelling Mastery" 
              intro="Check your spelling and pronunciation before moving to vocabulary." 
              questions={generateSpellingQuiz()} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              hideHeader={true}
              isUnlockTest={false} /* FIX: User is NO LONGER TRAPPED. Yellow continue button stays! */
            />
          </div>
        );

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

      case 8:
        return (
          <div className="pb-6">
            <QuizModule
              title="Vocabulary Mastery" 
              intro="Score 80% or higher to prove you know these words and add them to your profile." 
              data={VOCAB} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              questionCount={16} 
              isVocabMatch
              hideHeader={true}
              isUnlockTest={false} /* FIX: User is NO LONGER TRAPPED. Yellow continue button stays! */
            />
          </div>
        );

      case 9:
        return (
          <div className="pb-6">
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </div>
        );

      case 10:
        return (
          <div className="pb-6">
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: The Three Superscripts." 
              questions={generateFinalQuiz()} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} /* Only the absolute final test traps the user */
              hideHeader={true}
              nextLessonPath="/dashboard/lessons/3" 
              onPass={() => markComplete(6)} 
            />
          </div>
        );
    }
  };

  const stepTitles = [
    "Welcome to the Four Vowels", "What you'll learn", "The four vowels", "The diacritic marks", 
    "Pronouncing the vowels", "Spelling rules", "Spelling Mastery", "Vocabulary", 
    "Vocabulary Mastery", "Practice & exercises", "Final Mastery Check" 
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
        /* FIX: Ensure the yellow continue button is present on ALL steps except the absolute final test! */
        hideContinue={currentStep === totalSteps - 1} 
      >
        {renderStepContent()}
      </MobileStepPlayer>

      {/* INSPECTOR CODE (Unchanged) */}
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
              <div className="p-4 rounded-2xl bg-white border border-border-subtle">
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1.5">Mark Name</div>
                <div className="font-tibetan text-2xl text-ink leading-none">{selectedVowel.markTib}</div>
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
    </>
  );
}