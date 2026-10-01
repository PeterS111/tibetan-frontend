// app/components/lesson/5/MobileLesson5.tsx
"use client";


import { SpellingFormula } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Loader2, Volume2, ArrowRight, ArrowUp, ArrowDown, ChevronLeft, Info, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { PREFIXES, VOCAB, STEPS, TONE_META, generateVocabQuiz, generateFinalQuiz, generatePrefixQuiz, generateExceptionsQuiz, Combo, Prefix, Tone } from "@/app/data/lesson5";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson5() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete, completed } = useLessonProgress(7);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 19; 
  
  const [selectedCombo, setSelectedCombo] = useState<(Combo & { pref: Prefix }) | null>(null);

  // Map 19 mobile steps to the 7 web steps so global progress unlocks correctly
  const webStepMap = [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 6]; 

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    
    // Save new vocabulary words to the user's global progress ONLY on Step 16
    if (currentStep === 16 && !completed.has(currentWebStep)) {
      saveWords(VOCAB.length);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push("/dashboard/lessons/6");
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
      items: PREFIXES.flatMap(p => p.combos.map(c => ({
        id: `c-${c.word}`, tibetan: c.word, reading: `[${c.read}]`, english: c.gloss ?? TONE_META[c.tone].label, audioTarget: c.word
      })))
    },
    {
      name: "Vocabulary",
      items: VOCAB.map(v => ({
        id: `voc-${v.tib}`, tibetan: v.tib, reading: `[${v.translit}]`, english: v.en, audioTarget: v.tib, emoji: v.emoji
      }))
    }
  ], []);

  const openComboInspector = (c: Combo, pref: Prefix) => {
    setSelectedCombo({ ...c, pref });
    playAudio(c.word + " spelling");
  };

  const gaQuiz = useMemo(() => generatePrefixQuiz("ga"), []);
  const daQuiz = useMemo(() => generatePrefixQuiz("da"), []);
  const baQuiz = useMemo(() => generatePrefixQuiz("ba"), []);
  const maQuiz = useMemo(() => generatePrefixQuiz("ma"), []);
  const aQuiz = useMemo(() => generatePrefixQuiz("a"), []);
  const exceptionsQuiz = useMemo(() => generateExceptionsQuiz(), []);
  const vocabQuestions = useMemo(() => generateVocabQuiz(), []);
  const finalQuizQuestions = useMemo(() => generateFinalQuiz(), []);

  const renderPrefixGrid = (prefIndex: number) => {
    const pref = PREFIXES[prefIndex];
    return (
      <div className="pb-6">
        <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle mb-6 shadow-sm">
          <div className="flex items-center gap-4 mb-3">
             <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center font-serif text-[3rem] leading-none pt-2 shadow-sm" style={{ backgroundColor: `${pref.accent.hex}15`, color: pref.accent.hex }}>{pref.head}</div>
             <div>
                <div className="font-serif text-2xl font-bold text-ink">{pref.title}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{pref.count} · {pref.family === 'nasal' ? 'Nasalising' : 'Silent'}</div>
             </div>
          </div>
          <p className="text-[15px] leading-relaxed text-ink/90">
            {pref.intro}
          </p>
        </div>
        
        <div className="flex items-start gap-3 border-l-4 px-4 py-3 text-[14px] bg-white rounded-r-[1.25rem] border-y border-r border-border-subtle shadow-sm mb-6" style={{ borderLeftColor: pref.accent.hex }}>
           <Info className="mt-0.5 size-5 shrink-0" style={{ color: pref.accent.hex }} />
           <span className="font-medium leading-relaxed text-ink/80">{pref.usage}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {pref.combos.map((c) => {
            const TM = TONE_META[c.tone];
            const Icon = TM.Icon;
            return (
              <button 
                key={c.word} 
                onClick={() => openComboInspector(c, pref)} 
                className="bg-white rounded-[1.25rem] py-5 px-3 flex flex-col items-center justify-center text-center active:scale-95 transition-transform shadow-sm border border-border-subtle relative overflow-hidden"
              >
                <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: pref.accent.hex }} />
                <span className="font-tibetan text-[40px] text-ink leading-none mb-3 pt-2">{c.word}</span>
                <span className="text-[11px] font-mono font-bold text-ink mb-1">[{c.read}]</span>
                {c.gloss && <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2 line-clamp-1">{c.gloss}</span>}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${TM.bg} ${TM.text} mt-1`}>
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
          <div className="space-y-6 pb-6">
            <div className="mb-2 px-1">
              <h1 className="font-serif text-4xl text-ink leading-tight tracking-tight mb-2">
                The Five Prefixes
              </h1>
              <div className="font-tibetan text-[2rem] text-ink-light mb-6">སྔོན་འཇུག་ལྔ།</div>
              <p className="text-[16px] leading-relaxed text-ink/90">
                Five consonants — <span className="font-tibetan text-xl">ག ད བ མ འ</span> — may sit <strong>before</strong> a root letter. They shape both <strong>spelling</strong> and <strong>pronunciation</strong> (deepening feminine roots, adding a nasal onset with <span className="font-tibetan text-xl">མ</span> and <span className="font-tibetan text-xl">འ</span>).
              </p>
            </div>

            <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4 text-center">The 5 Prefixes</div>
              <div className="grid grid-cols-5 gap-2">
                {PREFIXES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => playAudio(s.nameTib)}
                    disabled={playingItem !== null}
                    className="flex flex-col items-center justify-center gap-1.5 bg-white border border-border-strong py-3 rounded-[1rem] active:scale-95 transition-all shadow-sm"
                  >
                    <span className="font-serif text-[1.75rem] leading-none pt-1" style={{ color: s.accent.hex }}>{s.head}</span>
                    <span className="text-[9px] uppercase tracking-widest text-ink-muted">{s.latin}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5 pb-6">
            <div className="bg-surface-muted border border-border-subtle rounded-[1.5rem] p-5 text-center shadow-sm relative mb-4">
               <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-3">A full syllable</div>
               
               <button 
                 onClick={() => playAudio("བསྒྲིམས་")} 
                 disabled={playingItem !== null} 
                 className="relative w-full max-w-[240px] mx-auto h-[120px] my-4 flex items-center justify-center active:scale-95 transition-transform"
               >
                 <img 
                   src="/colored-syllable.png"
                   alt="bsgrims" 
                   className="w-full h-full object-contain" 
                 />
                 {playingItem === "བསྒྲིམས་" && (
                   <div className="absolute inset-0 flex items-center justify-center bg-paper/60 backdrop-blur-[2px] rounded-2xl z-10">
                     <Loader2 size={40} className="animate-spin text-brand" />
                   </div>
                 )}
               </button>

               <div className="mt-4 text-[15px] italic text-ink-light font-medium"><span className="not-italic font-bold text-ink">bsgrims</span> — read <span className="not-italic font-bold text-ink">drim</span></div>
            </div>

            <div>
               <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 px-2">The 7 Slots</div>
               <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { letter: "བ", role: "Prefix", pos: "Before root", accent: "#c2410c", highlight: true },
                    { letter: "ས", role: "Superscript", pos: "Above root", accent: "#7c3aed" },
                    { letter: "ག", role: "Root letter", pos: "The heart", accent: "#111827" },
                    // 🚀 FIXED: Using PNG images directly for combining marks
                    { imgSrc: "/slot-subscript.png", role: "Subscript", pos: "Below root", accent: "#0284c7" },
                    { imgSrc: "/slot-vowel.png", role: "Vowel", pos: "Above / below", accent: "#059669" },
                    { letter: "མ", role: "Suffix", pos: "After root", accent: "#b45309" },
                  ].map((s) => (
                    <div key={s.role} className={`flex items-center gap-3 p-3 rounded-[1.25rem] border ${s.highlight ? "bg-brand-light border-brand/40 shadow-sm" : "bg-white border-border-subtle shadow-sm"}`}>
                       <div className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-tibetan border border-border-strong bg-surface-muted overflow-hidden" style={{ color: s.accent }}>
                         
                         {/* 🚀 Render the PNG if provided, otherwise render the standard text letter */}
                         {s.imgSrc ? (
  <img src={s.imgSrc} alt={s.role} className="w-9 h-9 object-contain" />
) : (
  <span className="block text-2xl pt-1.5">{s.letter}</span>
)}

                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5 truncate" style={{ color: s.accent }}>{s.role}</div>
                         <div className="text-[11px] text-ink-light font-medium truncate">{s.pos}</div>
                       </div>
                    </div>
                  ))}
                  <div className="col-span-2 flex items-center gap-3 p-3 rounded-[1.25rem] border bg-white border-border-subtle shadow-sm">
                       <div className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-tibetan text-2xl pt-1.5 border border-border-strong bg-surface-muted" style={{ color: "#9333ea" }}>
                         ས
                       </div>
                       <div className="flex-1 min-w-0 flex items-center justify-between pr-2">
                         <div>
                           <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5 truncate" style={{ color: "#9333ea" }}>Post-suffix</div>
                           <div className="text-[11px] text-ink-light font-medium truncate">Far right</div>
                         </div>
                       </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 pb-6">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-brand-light text-brand-dark">
                <ChevronLeft size={14} /> Before the root
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                A prefix is a letter written <strong>to the left</strong> of the root. Only five letters — <span className="font-tibetan text-xl">ག ད བ མ འ</span> — may take that seat.
              </p>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-rose-50 text-rose-700">
                <BookOpen size={14} /> Writing
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                Prefixes disambiguate words on the page — e.g. <span className="font-tibetan text-xl">བཞི་</span> vs <span className="font-tibetan text-xl">གཞི་</span>.
              </p>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-sky-50 text-sky-700">
                <Volume2 size={14} /> Pronunciation
              </div>
              <p className="text-[15px] leading-relaxed text-ink/90">
                Prefixes never change <strong>masculine</strong> letters. They <span className="font-bold text-sky-700">deepen</span> feminine roots and <span className="font-bold text-rose-700">nasalise</span> very-feminine roots.
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

      case 3: return renderPrefixGrid(0); // Ga
      case 4: return <div className="pb-6"><QuizModule title="Mastery Check · Prefix Ga" questions={gaQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 5: return renderPrefixGrid(1); // Da
      case 6: return <div className="pb-6"><QuizModule title="Mastery Check · Prefix Da" questions={daQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 7: return renderPrefixGrid(2); // Ba
      case 8: return <div className="pb-6"><QuizModule title="Mastery Check · Prefix Ba" questions={baQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 9: return renderPrefixGrid(3); // Ma
      case 10: return <div className="pb-6"><QuizModule title="Mastery Check · Prefix Ma" questions={maQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;
      
      case 11: return renderPrefixGrid(4); // 'A
      case 12: return <div className="pb-6"><QuizModule title="Mastery Check · Prefix 'A" questions={aQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 13: // Exceptions
        return (
          <div className="space-y-4 pb-6">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle flex flex-col gap-4">
              <div className="inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start rounded-full shadow-sm">
                <AlertTriangle size={16} /> <span className="font-tibetan text-xl font-normal normal-case leading-none pt-1">ད + བ</span> <ArrowRight size={14} /> [WA]
              </div>
              <div className="flex items-center gap-2 font-tibetan text-[2rem] leading-normal text-ink">
                <button onClick={() => playAudio('དབུ་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">དབུ་</button>
                <button onClick={() => playAudio('དབྱེ་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">དབྱེ་</button>
                <button onClick={() => playAudio('དབྲ་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">དབྲ་</button>
              </div>
              <p className="text-[15px] text-ink-light leading-relaxed">When ད precedes བ, the stack reads as the <span className="font-bold text-ink">wa</span> family in a high tone: [wu], [ye], [ra].</p>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle flex flex-col gap-4">
              <div className="inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start rounded-full shadow-sm">
                <AlertTriangle size={16} /> <span className="font-tibetan text-xl font-normal normal-case leading-none pt-1">འ + བ</span> <ArrowRight size={14} /> [BA]
              </div>
              <div className="flex items-center gap-2 font-tibetan text-[2rem] leading-normal text-ink">
                <button onClick={() => playAudio('འབུ་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">འབུ་</button>
                <button onClick={() => playAudio('འབྲི་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">འབྲི་</button>
                <button onClick={() => playAudio('འབྲུ་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">འབྲུ་</button>
              </div>
              <p className="text-[15px] text-ink-light leading-relaxed">With prefix འ the root བ retains its [b-] onset in a low nasal tone.</p>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle flex flex-col gap-4">
              <div className="inline-flex items-center gap-3 bg-rose-50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-700 self-start rounded-full shadow-sm">
                <AlertTriangle size={16} /> <span className="font-tibetan text-xl font-normal normal-case leading-none pt-1">ག + ཡ</span> <ArrowRight size={14} /> [YO]
              </div>
              <div className="flex items-center gap-2 font-tibetan text-[2rem] leading-normal text-ink">
                <button onClick={() => playAudio('གཡོ་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">གཡོ་</button>
                <button onClick={() => playAudio('གཡུ་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">གཡུ་</button>
                <button onClick={() => playAudio('གཡི་')} disabled={playingItem !== null} className="border border-border-strong rounded-2xl px-3 pt-3 pb-4 active:bg-surface-muted transition-all">གཡི་</button>
              </div>
              <p className="text-[15px] text-ink-light leading-relaxed">Prefix ག lifts the feminine ཡ to a <span className="font-bold text-ink">high</span> tone.</p>
            </div>
          </div>
        );

      case 14: return <div className="pb-6"><QuizModule title="Mastery Check · Exceptions" questions={exceptionsQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 15: // Vocab
        return (
          <div className="pb-6">
            <div className="grid grid-cols-2 gap-3">
              {VOCAB.map((v) => {
                const pref = PREFIXES.find(s => s.key === v.prefix)!;
                return (
                  <button key={v.tib} onClick={() => playAudio(v.tib)} className="bg-white border border-border-subtle rounded-[1.5rem] p-5 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform relative overflow-hidden">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: pref.accent.hex }} />
                    <span className="text-[40px] mb-3">{v.emoji}</span>
                    <span className="font-tibetan text-4xl text-ink leading-none mb-2 pt-2">{v.tib}</span>
                    <span className="font-mono text-[11px] tracking-widest text-ink-muted font-bold uppercase mb-1">[{v.translit}]</span>
                    <span className="text-[14px] font-bold text-ink">{v.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 16: return <div className="pb-6"><QuizModule title="Vocabulary Mastery" intro="Score 80% or higher to prove you know these words." data={VOCAB} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} questionCount={16} isVocabMatch hideHeader={true} isUnlockTest={false} /></div>;

      case 17: return <div className="pb-6"><PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} /></div>;

      case 18: return <div className="pb-6"><QuizModule title="Final Step Test" intro="Score 80% or higher to unlock the next step." questions={finalQuizQuestions} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} hideHeader={true} nextLessonPath="/dashboard/lessons/6" onPass={() => markComplete(6)} /></div>;
    }
  };

  const stepTitles = [
    "The Five Prefixes", "Anatomy of a syllable", "What is a prefix?", "The Prefix Ga", "Mastery Check · Ga",
    "The Prefix Da", "Mastery Check · Da", "The Prefix Ba", "Mastery Check · Ba",
    "The Prefix Ma", "Mastery Check · Ma", "The Prefix 'a", "Mastery Check · 'A",
    "Exceptions to memorise", "Mastery Check · Exceptions", "Vocabulary", "Vocabulary Mastery", 
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
        unitContext={`Unit 5 · Step ${currentStep + 1} of ${totalSteps}`} 
        title={stepTitles[currentStep]}
        continueText={currentStep === totalSteps - 1 ? "Finish Unit" : "Continue"}
        hideContinue={currentStep === totalSteps - 1} 
      >
        {renderStepContent()}
      </MobileStepPlayer>

      {/* BOTTOM SHEET INSPECTOR FOR PREFIX COMBOS */}
      {selectedCombo && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity" onClick={() => setSelectedCombo(null)}></div>
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
            
            <div className="flex flex-col mb-6 bg-white p-6 rounded-[1.5rem] border border-border-subtle shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-6 text-center">Spelling Walkthrough</div>
              
              <div className="flex justify-center mb-6">
  <SpellingFormula parts={selectedCombo.parts} />
</div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <ArrowRight className="text-border-strong opacity-50" size={20} />
                <span className="font-tibetan text-[4.5rem] leading-none pt-2 text-ink" style={{ color: selectedCombo.pref.accent.hex }}>{selectedCombo.word}</span>
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
              <button onClick={() => playAudio(selectedCombo.word + " spelling")} className="flex-1 py-4 bg-brand-light text-brand-dark font-bold rounded-full border border-brand/20 active:bg-brand/30 transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === (selectedCombo.word + " spelling") ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />} 
                <span className="text-sm">Spelling</span>
              </button>
              <button onClick={() => playAudio(selectedCombo.word)} className="flex-1 py-4 bg-ink text-white font-bold rounded-full active:bg-ink-light transition-colors flex items-center justify-center gap-2 shadow-sm">
                {playingItem === selectedCombo.word ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                <span className="text-sm">Word</span>
              </button>
            </div>

            <button onClick={() => setSelectedCombo(null)} className="w-full mt-4 py-4 text-center font-bold text-ink hover:bg-ink/5 rounded-full transition-colors">Close</button>
          </div>
        </>
      )}
    </>
  );
}