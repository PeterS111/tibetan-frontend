// app/components/lesson/1/MobileLesson1.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Volume2, Sparkles, Layers, CheckCircle2 } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { 
  CONSONANTS, 
  VOCAB, 
  STEPS, 
  TONE_META, 
  TONE_HEX, 
  GENDER_META, 
  generateFinalQuiz, 
  Consonant, 
  Tone, 
  Gender 
} from "@/app/data/lesson1";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson1() {
  const router = useRouter();
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete } = useLessonProgress(STEPS.length);

  const totalSteps = 12; 
  const MODULE_ID = 1;

  // Initialize from saved step so "Resume lesson" jumps to the exact point
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

  // State for the Bottom Sheet Inspector
  const [selectedConsonant, setSelectedConsonant] = useState<Consonant | null>(null);

  // Filter state for Step 3 (The Alphabet)
  const [alphabetFilter, setAlphabetFilter] = useState<"all" | Tone>("all");

  // Sync mobile steps to web progress (Steps 0, 1, and 2 all map to Web Step 0)
  const webStepMap = [0, 0, 0, 1, 1, 2, 3, 4, 5, 5, 6, 7]; 

  const handleNext = () => {
    markComplete(webStepMap[currentStep]); 
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
        localStorage.setItem("tibetan_last_active_lesson", "2");
      }
      router.push("/dashboard/lessons/2");
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

  // Filter consonants according to the active tab
  const filteredConsonants = useMemo(() => {
    return alphabetFilter === "all" 
      ? CONSONANTS 
      : CONSONANTS.filter((c) => c.tone === alphabetFilter);
  }, [alphabetFilter]);

  // Format data for the Practice Suite
  const practiceGroups = useMemo(() => [
    { name: "Consonants", items: CONSONANTS.map(c => ({ id: `c-${c.tib}`, tibetan: c.tib, reading: c.pron, english: TONE_META[c.tone].short, audioTarget: c.tib })) },
    { name: "Vocabulary", items: VOCAB.map(v => ({ id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji })) }
  ], []);

  const openInspector = (c: Consonant) => {
    setSelectedConsonant(c);
    playAudio(c.tib); // Auto-plays audio immediately when the modal opens
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
              <div className="w-full h-28 sm:h-32 bg-surface-muted overflow-hidden relative">
                <img 
                  src="/loplao-hero-scene.jpg" 
                  alt="Himalayan Monastery and Mountains" 
                  className="w-full h-full object-cover object-[50%_75%]"
                />
              </div>

              <div className="p-5 pt-4">
                <h2 className="font-serif text-xl font-bold text-ink mb-1.5">
                  Welcome to the 30 consonants.
                </h2>
                <p className="text-[13.5px] leading-relaxed text-ink/80 mb-3.5">
                  The Tibetan alphabet is built on thirty root letters — the foundation of every word you will read, write, and speak. Move through the lesson one step at a time; every section stays available for review whenever you want to jump ahead.
                </p>
                <hr className="border-border-subtle mb-3.5" />
                <div className="grid grid-cols-3 divide-x divide-border-subtle text-center py-0.5">
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">30</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Letters</div>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">4</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Tones</div>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-2xl text-ink">5</div>
                    <div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Genders</div>
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
                  { mod: "MODULE 01", title: "The alphabet, as a type specimen" },
                  { mod: "MODULE 02", title: "Understanding tone" },
                  { mod: "MODULE 03", title: "The three root sounds" },
                  { mod: "MODULE 04", title: "Traditional gender classification" },
                  { mod: "MODULE 05", title: "Vocabulary built from the 30 consonants" },
                  { mod: "MODULE 06", title: "Practice & exercises" },
                ].map((item, idx) => (
                  <div key={item.mod} className={`flex flex-col gap-1 ${idx !== 0 ? "pt-4 border-t border-border-subtle/70" : ""}`}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">{item.mod}</div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand shrink-0"></span>
                      <span className="font-serif text-[17px] font-bold text-ink leading-snug">{item.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 2: HOW TO USE THIS APP
      // ---------------------------------------------------------
      case 2:
        return (
          <div className="pb-6">
            <div className="bg-surface rounded-[1.5rem] p-6 sm:p-8 shadow-sm border border-border-subtle">
              <h2 className="font-serif text-2xl font-bold text-ink mb-6">How to use this app</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink/80 pt-1 font-medium">Tap any letter card to hear its sound and see its details.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm">
                    <Layers size={20} />
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink/80 pt-1 font-medium">Steps unlock as you continue, but you can peek ahead.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink/80 pt-1 font-medium">Completed steps are marked and stay open for review.</p>
                </div>
              </div>
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 3: THE ALPHABET
      // ---------------------------------------------------------
      case 3:
        return (
          <div className="space-y-5 pb-6 flex flex-col">
            <div className="flex flex-wrap gap-2">
              {(["all", "high-unasp", "high-asp", "low-asp", "low-nasal"] as const).map((k) => {
                const isSelected = alphabetFilter === k;
                return (
                  <button
                    key={k}
                    onClick={() => setAlphabetFilter(k)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      isSelected ? "bg-ink text-white border-ink shadow-sm" : "bg-white text-ink-muted border-border-subtle hover:text-ink active:scale-95"
                    }`}
                  >
                    {k !== "all" && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TONE_HEX[k] }} />}
                    <span>{k === "all" ? `All ${CONSONANTS.length}` : TONE_META[k].short}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {filteredConsonants.map((c) => (
                <button 
                  key={c.tib + c.translit}
                  onClick={() => openInspector(c)}
                  className="group relative bg-white rounded-[1rem] sm:rounded-[1.25rem] aspect-square shadow-sm border border-border-subtle flex flex-col items-center justify-center text-center active:scale-95 transition-all overflow-hidden p-2"
                >
                  <span className="absolute inset-x-0 top-0 h-[4px]" style={{ backgroundColor: TONE_HEX[c.tone] }} />
                  <span className="font-tibetan text-3xl sm:text-4xl text-ink leading-none mt-1 sm:mt-2">{c.tib}</span>
                  <span className="font-serif text-[11px] sm:text-[12px] italic text-ink-muted mt-1.5 sm:mt-2">{c.translit}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 4: FIRST MASTERY CHECK
      // ---------------------------------------------------------
      case 4:
        return (
          <div className="pb-6">
            <QuizModule 
              moduleId={1}
              title="Mastery Check · 30 Consonants" 
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
      // STEP 5: UNDERSTANDING TONE (REFACTORED)
      // ---------------------------------------------------------
      case 5:
        return (
          <div className="pb-6">
            <div className="bg-white rounded-[1.5rem] border border-border-subtle shadow-sm flex flex-col overflow-hidden divide-y divide-border-subtle">
              {(Object.keys(TONE_META) as Tone[]).map((t) => {
                const m = TONE_META[t];
                const hex = TONE_HEX[t];
                const letters = CONSONANTS.filter((c) => c.tone === t);
                return (
                  <div key={t} className="p-6 relative" style={{ borderLeft: `4px solid ${hex}` }}>
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 ${m.swatch} ${m.text}`}>
                      {m.short}
                    </div>
                    <div className="font-serif text-3xl font-bold text-ink mb-3">{letters.length} letters</div>
                    <p className="text-[14px] leading-relaxed text-ink/80 mb-6">{m.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {letters.map((c) => (
                        <button 
                          key={c.tib} 
                          onClick={() => openInspector(c)} 
                          className="w-11 h-11 flex items-center justify-center rounded-full font-tibetan text-2xl transition-transform active:scale-95"
                          style={{ backgroundColor: `${hex}15`, color: hex, border: `1px solid ${hex}40` }}
                        >
                          {c.tib}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 6: THE THREE ROOT SOUNDS (REFACTORED)
      // ---------------------------------------------------------
      case 6:
        return (
          <div className="pb-6">
            <p className="text-[15px] leading-relaxed text-ink/80 mb-6">
              Traditional Tibetan phonology traces every consonant back to one of three root sounds — seed syllables that anchor a whole tone family.
            </p>
            <div className="bg-white rounded-[1.5rem] border border-border-subtle shadow-sm flex flex-col overflow-hidden divide-y divide-border-subtle">
              {[
                { tib: "ཨ", translit: "a", label: "Neutral root · High", swatch: "bg-sky-50", text: "text-sky-800", hex: "#0ea5e9", members: "ཨ ཀ ཅ ཏ པ ཙ", desc: "The neutral vowel carrier — a clean ‘a’ with no consonantal onset. Anchors the plain, unaspirated stops." },
                { tib: "ཧ", translit: "ha", label: "Aspirated root · Breath", swatch: "bg-amber-50", text: "text-amber-800", hex: "#f59e0b", members: "ཁ ཆ ཐ ཕ ཚ ཧ ཤ ས", desc: "The breath root — a light, aspirated ‘h’. Anchors the aspirated stops and fricatives." },
                { tib: "འ", translit: "'a", label: "Glottal root · Voiced flow", swatch: "bg-rose-50", text: "text-rose-800", hex: "#f43f5e", members: "ག ཇ ད བ ཛ ཞ ཟ འ ཡ ར ལ ང ཉ ན མ", desc: "The glottal root — a soft, voiced ‘a’ that carries the vowel without a hard onset. Anchors the low-register letters." },
              ].map(r => (
                <div key={r.tib} className="p-6 relative" style={{ borderLeft: `4px solid ${r.hex}` }}>
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
                  
                  <p className="text-[14px] text-ink/80 leading-relaxed mb-6">{r.desc}</p>
                  
                  <div className="pt-5 border-t border-border-subtle">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3">Family</div>
                    <div className="flex flex-wrap gap-2">
                       {r.members.split(" ").map(letter => {
                         const c = CONSONANTS.find(con => con.tib === letter);
                         return (
                           <button 
                             key={letter} 
                             onClick={() => c && openInspector(c)} 
                             className="w-11 h-11 flex items-center justify-center rounded-full font-tibetan text-2xl transition-transform active:scale-95"
                             style={{ backgroundColor: `${r.hex}15`, color: r.hex, border: `1px solid ${r.hex}40` }}
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
          </div>
        );

      // ---------------------------------------------------------
      // STEP 7: GENDER CLASSIFICATION (REFACTORED)
      // ---------------------------------------------------------
      case 7:
        return (
          <div className="pb-6">
            <div className="bg-white rounded-[1.5rem] border border-border-subtle shadow-sm flex flex-col overflow-hidden divide-y divide-border-subtle">
              {(Object.keys(GENDER_META) as Gender[]).map(g => {
                const m = GENDER_META[g];
                const letters = CONSONANTS.filter((c) => c.gender === g);
                return (
                  <div key={g} className="p-6 relative" style={{ borderLeft: `4px solid ${m.color}` }}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: m.tint, color: m.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        {m.label}
                      </div>
                      <span className="font-tibetan text-2xl" style={{ color: m.color }}>{m.tib}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {letters.map((c) => (
                        <button 
                          key={c.tib} 
                          onClick={() => openInspector(c)}
                          className="w-11 h-11 flex items-center justify-center rounded-full font-tibetan text-2xl transition-transform active:scale-95"
                          style={{ backgroundColor: `${m.color}15`, color: m.color, border: `1px solid ${m.color}40` }}
                        >
                          {c.tib}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // ---------------------------------------------------------
      // STEP 8: VOCABULARY
      // ---------------------------------------------------------
      case 8:
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
      // STEP 9: VOCABULARY MASTERY CHECK
      // ---------------------------------------------------------
      case 9:
        return (
          <div className="pb-6">
            <QuizModule
              moduleId={1}
              title="Mastery Check · Vocabulary" 
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
      // STEP 10: PRACTICE DRILLS
      // ---------------------------------------------------------
      case 10:
        return (
          <div className="pb-6">
            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isLesson1={true} />
          </div>
        );

      // ---------------------------------------------------------
      // STEP 11: FINAL MASTERY CHECK
      // ---------------------------------------------------------
      case 11:
        return (
          <div className="pb-6">
            <QuizModule 
              moduleId={1}
              title="Final Assessment" 
              intro="Score 80% or higher to unlock the next step: The Four Vowels." 
              questions={generateFinalQuiz()} 
              playAudio={playAudio} 
              playingItem={playingItem} 
              playErrorBeep={playErrorBeep} 
              isUnlockTest={true} 
              isLesson1={true} 
              nextLessonPath="/dashboard/lessons/2" 
              onPass={() => markComplete(11)} 
              hideHeader={true}
            />
          </div>
        );
    }
  };

  const stepTitles = [
    "Welcome to the 30 consonants", 
    "What you'll learn", 
    "How to use this app",
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
          <div 
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity"
            onClick={() => setSelectedConsonant(null)}
          ></div>
          
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