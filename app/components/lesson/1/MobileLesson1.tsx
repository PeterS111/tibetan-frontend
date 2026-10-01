// app/components/lesson/1/MobileLesson1.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Volume2, Sparkles, Layers, CheckCircle2 } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { CONSONANTS, VOCAB, STEPS, TONE_META, GENDER_META, generateFinalQuiz, Consonant, Tone, Gender } from "@/app/data/lesson1";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson1() {
  const router = useRouter();
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete } = useLessonProgress(STEPS.length);

  // 11 Mobile Steps mapped to 8 Web Steps
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 11; 
  
  // State for the Bottom Sheet Inspector
  const [selectedConsonant, setSelectedConsonant] = useState<Consonant | null>(null);

  // Sync mobile steps to web progress for dashboard accuracy
  const webStepMap = [0, 0, 1, 1, 2, 3, 4, 5, 5, 6, 7]; 

  const handleNext = () => {
    markComplete(webStepMap[currentStep]); 
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push("/dashboard/lessons/2");
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

  // Format data for the Practice Suite
  const practiceGroups = useMemo(() => [
    { name: "Consonants", items: CONSONANTS.map(c => ({ id: `c-${c.tib}`, tibetan: c.tib, reading: c.pron, english: TONE_META[c.tone].short, audioTarget: c.tib })) },
    { name: "Vocabulary", items: VOCAB.map(v => ({ id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji })) }
  ], []);

  const openInspector = (c: Consonant) => {
    setSelectedConsonant(c);
    playAudio(c.tib); // Auto-plays audio immediately when the modal opens!
  };

  const renderStepContent = () => {
    switch (currentStep) {
      // ---------------------------------------------------------
      // STEP 0: INTRO PART 1 (WELCOME)
      // ---------------------------------------------------------
      case 0:
        return (
          <div className="space-y-6 pb-4">
            <p className="font-serif text-[22px] text-ink-light italic tibetan -mt-6">
              གསལ་བྱེད་སུམ་ཅུ།
            </p>
            <p className="text-[16px] leading-relaxed text-ink/80">
              The Tibetan alphabet is built on thirty root letters — the foundation of every word you will read, write, and speak. Move through the lesson one step at a time; every section stays available for review whenever you want to jump ahead.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="border border-border-subtle p-3 bg-surface-muted rounded-2xl">
                <div className="font-serif text-2xl text-ink">30</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-muted mt-1 font-bold">Letters</div>
              </div>
              <div className="border border-border-subtle p-3 bg-surface-muted rounded-2xl">
                <div className="font-serif text-2xl text-ink">4</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-muted mt-1 font-bold">Tones</div>
              </div>
              <div className="border border-border-subtle p-3 bg-surface-muted rounded-2xl">
                <div className="font-serif text-2xl text-ink">5</div>
                <div className="text-[10px] uppercase tracking-widest text-ink-muted mt-1 font-bold">Genders</div>
              </div>
            </div>

            {/* Instructional Bullets */}
            <ul className="space-y-4 text-[14px] text-ink-light pt-2">
              <li className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" /> 
                <span>Tap any letter card to hear its sound and see its details.</span>
              </li>
              <li className="flex items-start gap-3">
                <Layers className="mt-0.5 size-4 shrink-0 text-brand" /> 
                <span>Steps unlock as you continue, but you can peek ahead.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" /> 
                <span>Completed steps are marked and stay open for review.</span>
              </li>
            </ul>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 1: INTRO PART 2 (WHAT YOU'LL LEARN)
      // ---------------------------------------------------------
      case 1:
        return (
          <div className="pb-6">
            <div className="bg-surface rounded-[1.5rem] p-6 shadow-sm border border-border-subtle mt-2">
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-6">What you'll learn</div>
              <ul className="space-y-5 text-[15px] font-bold text-ink-light">
                {STEPS.slice(1, -1).map((s, i) => (
                  <li key={s.id} className="flex items-start gap-4">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-surface-muted border border-border-strong text-ink flex items-center justify-center text-[11px] mt-0.5">
                      {i + 1}
                    </span>
                    <span className="mt-1 leading-snug">{s.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

  // ---------------------------------------------------------
      // STEP 2: THE ALPHABET
      // ---------------------------------------------------------
      case 2:
        return (
          <div className="space-y-6 pb-6 flex flex-col">
            {/* 4-Column Grid to match traditional Tibetan presentation */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {CONSONANTS.map((c) => (
                <button 
                  key={c.tib}
                  onClick={() => openInspector(c)}
                  className="bg-white rounded-[1rem] sm:rounded-[1.25rem] aspect-square shadow-sm border border-border-subtle flex flex-col items-center justify-center text-center active:scale-95 transition-transform overflow-hidden"
                >
                  <span className="font-tibetan text-3xl sm:text-4xl text-ink leading-none mt-1 sm:mt-2">{c.tib}</span>
                  <span className="font-serif text-[10px] sm:text-[12px] italic text-ink-muted mt-1.5 sm:mt-2">{c.translit}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 3: FIRST MASTERY CHECK (LISTENING)
      // ---------------------------------------------------------
      case 3:
        return (
          <div className="pb-6">
            <QuizModule 
              title="Mastery check" 
              intro="Test your listening before you move on." 
              data={CONSONANTS} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              questionCount={30} 
              isUnlockTest={false} 
              isLesson1={true}
              hideHeader={true}
            />
          </div>
        );

      // ---------------------------------------------------------
      // STEP 4: UNDERSTANDING TONE
      // ---------------------------------------------------------
      case 4:
        return (
          <div className="space-y-6 pb-6">
            {(Object.keys(TONE_META) as Tone[]).map((t) => {
              const m = TONE_META[t];
              const letters = CONSONANTS.filter((c) => c.tone === t);
              return (
                <div key={t} className={`p-6 rounded-[1.5rem] border bg-surface ${m.ring} shadow-sm`}>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 ${m.swatch} ${m.text}`}>
                    {m.short}
                  </div>
                  <div className="font-serif text-3xl font-bold text-ink mb-3">{letters.length} letters</div>
                  <p className="text-[14px] leading-relaxed text-ink/80 mb-6">{m.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border-subtle">
                    {letters.map((c) => (
                      <button 
                        key={c.tib} 
                        onClick={() => openInspector(c)} 
                        className="w-11 h-11 flex items-center justify-center bg-surface-muted rounded-full border border-border-strong font-tibetan text-2xl text-ink active:bg-brand/30 transition-colors"
                      >
                        {c.tib}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      // ---------------------------------------------------------
      // STEP 5: THE THREE ROOT SOUNDS
      // ---------------------------------------------------------
      case 5:
        return (
          <div className="space-y-6 pb-6">
            <p className="text-[15px] leading-relaxed text-ink-light mb-6">
              Traditional Tibetan phonology traces every consonant back to one of three root sounds — seed syllables that anchor a whole tone family.
            </p>
            {[
              { tib: "ཨ", translit: "a", label: "Neutral root · High", swatch: "bg-sky-100", text: "text-sky-800", ring: "ring-sky-300", members: "ཨ ཀ ཅ ཏ པ ཙ", desc: "The neutral vowel carrier — a clean ‘a’ with no consonantal onset. Anchors the plain, unaspirated stops." },
              { tib: "ཧ", translit: "ha", label: "Aspirated root · Breath", swatch: "bg-amber-100", text: "text-amber-800", ring: "ring-amber-300", members: "ཁ ཆ ཐ ཕ ཚ ཧ ཤ ས", desc: "The breath root — a light, aspirated ‘h’. Anchors the aspirated stops and fricatives." },
              { tib: "འ", translit: "'a", label: "Glottal root · Voiced flow", swatch: "bg-rose-100", text: "text-rose-800", ring: "ring-rose-300", members: "ག ཇ ད བ ཛ ཞ ཟ འ ཡ ར ལ ང ཉ ན མ", desc: "The glottal root — a soft, voiced ‘a’ that carries the vowel without a hard onset. Anchors the low-register letters." },
            ].map(r => (
              <div key={r.tib} className={`bg-surface rounded-[1.5rem] p-6 shadow-sm border ${r.ring}`}>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 ${r.swatch} ${r.text}`}>
                  {r.label}
                </div>
                
                <div className="flex items-center gap-5 mb-4">
                  <button onClick={() => playAudio(r.tib)} className="font-tibetan text-5xl text-ink active:opacity-50">{r.tib}</button>
                  <div className="flex flex-col gap-1">
                    <div className="font-serif text-2xl italic text-ink-muted">{r.translit}</div>
                    <button 
                      onClick={() => playAudio(r.tib)}
                      className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center border border-border-strong text-ink-muted active:text-brand"
                    >
                      {playingItem === r.tib ? <Loader2 size={14} className="animate-spin text-brand" /> : <Volume2 size={14} />}
                    </button>
                  </div>
                </div>
                
                <p className="text-[14px] text-ink-light leading-relaxed mb-6">{r.desc}</p>
                
                <div className="pt-5 border-t border-border-subtle">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3">Family</div>
                  <div className="flex flex-wrap gap-2">
                     {r.members.split(" ").map(letter => {
                       const c = CONSONANTS.find(con => con.tib === letter);
                       return (
                         <button 
                           key={letter} 
                           onClick={() => c && openInspector(c)} 
                           className="w-10 h-10 flex items-center justify-center bg-surface-muted rounded-full border border-border-strong font-tibetan text-xl text-ink active:bg-brand/30 transition-colors"
                         >
                           {letter}
                         </button>
                       );
                     })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      // ---------------------------------------------------------
      // STEP 6: GENDER CLASSIFICATION
      // ---------------------------------------------------------
      case 6:
        return (
          <div className="space-y-4 pb-6">
            {(Object.keys(GENDER_META) as Gender[]).map(g => {
              const m = GENDER_META[g];
              const letters = CONSONANTS.filter((c) => c.gender === g);
              return (
                <div key={g} className="bg-surface rounded-[1.25rem] border shadow-sm flex flex-col overflow-hidden" style={{ borderColor: m.color + "40" }}>
                  <div className="p-4 border-b flex justify-between items-center" style={{ backgroundColor: m.tint, borderColor: m.color + "40" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: m.color }}></span>
                      <span className="font-bold text-[15px]" style={{ color: m.text }}>{m.label}</span>
                    </div>
                    <span className="font-tibetan text-2xl" style={{ color: m.text }}>{m.tib}</span>
                  </div>
                  <div className="p-5 flex flex-wrap gap-2 bg-white">
                    {letters.map((c) => (
                      <button 
                        key={c.tib} 
                        onClick={() => openInspector(c)}
                        className="w-10 h-10 flex items-center justify-center bg-surface rounded-full border shadow-sm font-tibetan text-xl active:bg-brand/10 transition-colors"
                        style={{ borderColor: m.color + "40", color: m.text }}
                      >
                        {c.tib}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      // ---------------------------------------------------------
      // STEP 7: VOCABULARY
      // ---------------------------------------------------------
      case 7:
        return (
          <div className="pb-6">
            <div className="grid grid-cols-2 gap-3">
              {VOCAB.map((v) => (
                <button 
                  key={v.tib}
                  onClick={() => playAudio(v.tib)}
                  className="bg-white border border-border-subtle rounded-[1.5rem] p-5 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform"
                >
                  <span className="text-[40px] mb-3">{v.emoji}</span>
                  <span className="font-tibetan text-3xl text-ink mb-1">{v.tib}</span>
                  <span className="font-mono text-[11px] tracking-widest text-ink-muted font-bold uppercase mb-1">[{v.translit}]</span>
                  <span className="text-[14px] font-bold text-ink">{v.en}</span>
                </button>
              ))}
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
              title="Vocabulary Mastery" 
              intro="Check your memory of the new words before moving on." 
              data={VOCAB} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              questionCount={18} 
              isVocabMatch={true} 
              hideHeader={true}
            />
          </div>
        );

      // ---------------------------------------------------------
      // STEP 9: PRACTICE DRILLS
      // ---------------------------------------------------------
      case 9:
        return (
          <div className="pb-6">
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isLesson1={true} />
          </div>
        );

      // ---------------------------------------------------------
      // STEP 10: FINAL MASTERY CHECK
      // ---------------------------------------------------------
      case 10:
        return (
          <div className="pb-6">
            <QuizModule 
              title="Final Step Test" 
              intro="Score 80% or higher to unlock the next step: The Four Vowels." 
              questions={generateFinalQuiz()} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              isLesson1={true} 
              nextLessonPath="/dashboard/lessons/2" 
              onPass={() => markComplete(10)} 
              hideHeader={true}
            />
          </div>
        );
    }
  };

  const stepTitles = [
    "Welcome to the 30 consonants", 
    "What you'll learn", 
    "The alphabet", 
    "Mastery check", 
    "Understanding tone", 
    "The three root sounds", 
    "Traditional gender classification", 
    "Vocabulary", 
    "Vocabulary Mastery Check",
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
        unitContext={`Unit 1 · Step ${currentStep + 1} of ${totalSteps}`} 
        title={stepTitles[currentStep]}
        continueText={currentStep === totalSteps - 1 ? "Finish Unit" : "Continue"}
        hideContinue={currentStep === totalSteps - 1} 
      >
        {renderStepContent()}
      </MobileStepPlayer>

      {/* ======================================================== */}
      {/* THE BOTTOM SHEET (INSPECTOR)                             */}
      {/* ======================================================== */}
      {selectedConsonant && (
        <>
          {/* Dark overlay backdrop */}
          <div 
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity"
            onClick={() => setSelectedConsonant(null)}
          ></div>
          
          {/* Sliding Sheet */}
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-5 items-center">
                <span className="font-tibetan text-[4.5rem] leading-none text-ink">{selectedConsonant.tib}</span>
                <div>
                  <div className="font-serif text-2xl italic text-ink">{selectedConsonant.translit}</div>
                  <div className="font-mono text-sm font-bold text-ink-muted">[{selectedConsonant.pron}]</div>
                </div>
              </div>
              <button 
                onClick={() => playAudio(selectedConsonant.tib)}
                className="w-14 h-14 rounded-full bg-brand flex items-center justify-center text-ink shadow-sm active:scale-95 transition-transform"
              >
                {playingItem === selectedConsonant.tib ? <Loader2 size={24} className="animate-spin" /> : <Volume2 size={24} />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className={`p-4 rounded-2xl ${TONE_META[selectedConsonant.tone].swatch} bg-opacity-50`}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">Tone</div>
                <div className={`font-bold text-sm ${TONE_META[selectedConsonant.tone].text}`}>{TONE_META[selectedConsonant.tone].short}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-border-subtle" style={{ borderLeft: `4px solid ${GENDER_META[selectedConsonant.gender].color}` }}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1">Gender</div>
                <div className="font-bold text-sm text-ink">{GENDER_META[selectedConsonant.gender].label}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-border-subtle">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2">Textbook Note</div>
              <p className="text-[15px] leading-relaxed text-ink/90 italic">
                "{selectedConsonant.note}"
              </p>
            </div>
            
            <button 
              onClick={() => setSelectedConsonant(null)}
              className="w-full mt-6 py-4 text-center font-bold text-ink hover:bg-ink/5 rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        </>
      )}
    </>
  );
}