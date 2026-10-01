// app/components/lesson/6/MobileLesson6.tsx
"use client";


import { SpellingFormula } from "@/app/components/ui/SpellingFormula";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Loader2, Volume2, ArrowRight, BookOpen, Info, Sparkles, CheckCircle2, History } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { 
  SUFFIXES, VOCAB, VOWEL_SHIFTS, 
  generateVocabQuiz, generateFinalQuiz, 
  POST_SUFFIX_QUESTIONS, ROOT_LETTER_QUESTIONS, 
  type Suffix, type SuffixExample, type Family, FAMILY_META
} from "@/app/data/lesson6";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule, { QuizQuestion } from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

export function MobileLesson6() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { playAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete, completed } = useLessonProgress(8);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 13; 
  
  const [selectedSuffix, setSelectedSuffix] = useState<Suffix | null>(null);
  const [revealIntro, setRevealIntro] = useState<"ten" | "two">("ten");
  const [activePost, setActivePost] = useState<"da" | "sa">("da");

  const webStepMap = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6, 7]; 

  const handleNext = () => {
    const currentWebStep = webStepMap[currentStep];
    markComplete(currentWebStep); 
    if (currentStep === 10 && !completed.has(currentWebStep)) saveWords(VOCAB.length);
    if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
    else router.push("/dashboard/lessons/7");
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleClose = () => router.push("/dashboard/lessons");

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
    { name: "Words", items: SUFFIXES.flatMap(p => p.examples.map(c => ({ id: `c-${c.word}`, tibetan: c.word, reading: `[${c.read}]`, english: c.gloss ?? FAMILY_META[p.family as Family].label, audioTarget: c.word }))) },
    { name: "Vocabulary", items: VOCAB.map(v => ({ id: `voc-${v.tib}`, tibetan: v.tib, reading: `[${v.read}]`, english: v.en, audioTarget: v.tib, emoji: v.emoji })) }
  ], []);

  const combinedSuffixQuiz = useMemo(() => {
    const qs: QuizQuestion[] = [];
    const allExamples = SUFFIXES.flatMap(s => s.examples);
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
    
    shuffle(allExamples).slice(0, 6).forEach(answer => {
       const wrongs = shuffle(allExamples.filter(x => x.word !== answer.word)).slice(0, 3);
       qs.push({
           questionText: "Listen to the spelling and select the matching word.", isAudioType: true, answer: answer.word, audioString: `${answer.word} spelling`, audioTarget: answer.word,
           choices: shuffle([answer, ...wrongs]).map(x => ({ tib: x.word, value: x.word }))
       });
    });

    shuffle(allExamples).slice(0, 6).forEach(answer => {
       const romanWrongs = shuffle(Array.from(new Set(allExamples.map(x => x.read))).filter(r => r !== answer.read)).slice(0, 3);
       qs.push({
         questionText: `How does ${answer.word} read?`, prominentTibetan: answer.word, answer: answer.read, audioString: answer.word,
         choices: shuffle([answer.read, ...romanWrongs]).map(x => ({ value: x, label: `[${x}]` }))
       });
    });

    return shuffle(qs);
  }, []);

  const vocabQuestions = useMemo(() => generateVocabQuiz(), []);
  const finalQuizQuestions = useMemo(() => generateFinalQuiz(), []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: 
        return (
          <div className="space-y-6 pb-6">
            <p className="text-[15px] leading-relaxed text-ink/90">
              Ten letters may follow the root — the <strong>suffix</strong> closes the syllable. A further <strong>two</strong> may sit beyond that suffix as a <strong>post-suffix</strong>. Together they shape the reading, the tense, and often the meaning of a word.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setRevealIntro("ten")} className={`flex-1 py-3.5 rounded-full font-bold text-[13px] border transition-colors shadow-sm ${revealIntro === "ten" ? "bg-brand-light text-brand-dark border-brand" : "bg-white text-ink-muted border-border-subtle"}`}>10 suffixes</button>
              <button onClick={() => setRevealIntro("two")} className={`flex-1 py-3.5 rounded-full font-bold text-[13px] border transition-colors shadow-sm ${revealIntro === "two" ? "bg-brand-light text-brand-dark border-brand" : "bg-white text-ink-muted border-border-subtle"}`}>2 post-suffixes</button>
            </div>

            {revealIntro === "ten" && (
              <div className="bg-surface-muted p-4 rounded-[1.5rem] border border-border-subtle grid grid-cols-5 gap-2 animate-in fade-in">
                {SUFFIXES.map(x => (
                   <button key={x.key} onClick={() => playAudio(x.head)} className="aspect-[4/5] border border-border-strong bg-white rounded-xl flex flex-col items-center justify-center active:scale-95 transition-transform shadow-sm">
                     <span className="font-serif text-2xl leading-none pt-1" style={{ color: x.accent }}>{x.head}</span>
                     <span className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-1">{x.latin}</span>
                   </button>
                ))}
              </div>
            )}

            {revealIntro === "two" && (
              <div className="bg-surface-muted p-4 rounded-[1.5rem] border border-border-subtle flex flex-col gap-3 animate-in fade-in">
                <button onClick={() => playAudio('ད')} className="flex items-center gap-4 bg-white border border-border-strong rounded-2xl p-4 active:scale-95 transition-transform shadow-sm">
                  <span className="font-serif text-3xl text-fuchsia-600">ད</span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-ink">da · historical</div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-muted">silent · classical only</div>
                  </div>
                </button>
                <button onClick={() => playAudio('ས')} className="flex items-center gap-4 bg-white border border-border-strong rounded-2xl p-4 active:scale-95 transition-transform shadow-sm">
                  <span className="font-serif text-3xl text-sky-600">ས</span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-ink">sa · modern</div>
                    <div className="text-[10px] uppercase tracking-widest text-ink-muted">silent · still written</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 pb-6">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-brand-light text-brand-dark"><ArrowRight size={14} /> After the root</div>
              <p className="text-[15px] leading-relaxed text-ink/90">A suffix — <span className="font-tibetan text-xl text-ink">རྗེས་འཇུག</span> — is a letter written <strong>immediately after</strong> the root. Only ten letters may take this seat.</p>
            </div>
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-brand-light text-brand-dark"><BookOpen size={14} /> Writing</div>
              <p className="text-[15px] leading-relaxed text-ink/90">Any consonant — even itself — may be followed by a suffix (e.g. <span className="font-tibetan text-xl text-ink">དད་</span>). Suffix <span className="font-tibetan text-xl text-ink">འ</span> is special: it may only appear when the root also carries a prefix.</p>
            </div>
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border-subtle">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 bg-brand-light text-brand-dark"><Volume2 size={14} /> Pronunciation</div>
              <p className="text-[15px] leading-relaxed text-ink/90">A suffix closes the syllable. Four of them — <span className="font-tibetan text-xl font-bold text-ink">ད ན ལ ས</span> — recolour the preceding vowel into a fronted <em>[e / ü / ö]</em>.</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="pb-6">
            <div className="bg-surface-muted rounded-[1.5rem] p-5 border border-border-subtle mb-6 shadow-sm text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2">The 10 Suffixes</div>
              <p className="text-[14px] text-ink-light leading-relaxed">Tap each suffix to explore its pronunciation rules, examples, and spelling walk-through.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SUFFIXES.map((s) => (
                <button key={s.key} onClick={() => setSelectedSuffix(s)} className="bg-white rounded-[1.25rem] p-5 flex flex-col items-center justify-center text-center active:scale-95 transition-transform shadow-sm border border-border-subtle relative overflow-hidden">
                  <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: s.accent }} />
                  <span className="font-serif text-[40px] text-ink leading-none mb-3 pt-2" style={{ color: s.accent }}>{s.head}</span>
                  <span className="text-[13px] font-bold text-ink mb-1">Suffix {s.latin}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{s.reads}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3: return <div className="pb-6"><QuizModule title="Mastery Check · Suffixes" questions={combinedSuffixQuiz} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 4:
        return (
          <div className="pb-6">
            <p className="text-[15px] leading-relaxed text-ink/90 mb-6">Four suffixes — <span className="font-serif font-bold text-ink text-lg">ད ན ལ ས</span> — recolour the vowel that precedes them. Listen to how each suffix reshapes the base vowel.</p>
            {VOWEL_SHIFTS.map((vs) => (
               <div key={vs.label} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-border-subtle mb-4">
                  <div className="flex items-center gap-3 mb-4 border-b border-border-subtle pb-3">
                     <button onClick={() => playAudio(vs.audioTarget)} disabled={playingItem !== null} className="w-12 h-12 rounded-full bg-brand text-ink flex items-center justify-center relative active:scale-95 transition-transform">
                        <span className="font-tibetan text-3xl pt-1.5">{vs.vowel}</span>
                        {playingItem === vs.audioTarget && <Loader2 size={16} className="absolute -top-1 -right-1 animate-spin text-brand-dark" />}
                     </button>
                     <div>
                       <span className="block font-bold text-lg text-ink">{vs.label}</span>
                       <span className="block text-[10px] font-bold uppercase tracking-widest text-ink-muted">Base Vowel</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     {vs.cells.map((cell, i) => {
                       const accents = ["#7c3aed", "#0369a1", "#0891b2", "#0284c7"];
                       const sufs = ["ལ", "ན", "ད", "ས"];
                       return (
                         <button key={i} onClick={() => playAudio(cell.word)} className="bg-surface-muted rounded-2xl py-4 flex flex-col items-center justify-center active:scale-95 transition-transform relative">
                           <span className="absolute top-2 left-2 text-[10px] font-bold font-serif opacity-50" style={{ color: accents[i] }}>{sufs[i]}</span>
                           <span className="font-tibetan text-[2rem] font-bold leading-none mb-2" style={{ color: accents[i] }}>{cell.word}</span>
                           <span className="text-xs font-mono font-bold text-ink-muted">[{cell.read}]</span>
                         </button>
                       )
                     })}
                  </div>
               </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 pb-6">
            <p className="text-[15px] leading-relaxed text-ink/90 mb-4">Only two letters — <span className="font-serif font-bold text-ink text-lg">ད</span> and <span className="font-serif font-bold text-ink text-lg">ས</span> — may sit <em>after</em> a suffix. They are <strong>silent</strong>.</p>

            <div className="flex gap-2 mb-2">
              <button onClick={() => setActivePost("da")} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl border transition-colors ${activePost === "da" ? "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-300 shadow-sm" : "bg-white text-ink-muted border-border-subtle"}`}>
                <span className="text-[9px] font-bold uppercase tracking-widest mb-0.5">Historical</span>
                <span className="font-serif text-[26px] leading-none pt-1" style={{ color: activePost === 'da' ? '#c026d3' : 'currentColor' }}>ད</span>
              </button>
              <button onClick={() => setActivePost("sa")} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl border transition-colors ${activePost === "sa" ? "bg-sky-50 text-sky-800 border-sky-300 shadow-sm" : "bg-white text-ink-muted border-border-subtle"}`}>
                <span className="text-[9px] font-bold uppercase tracking-widest mb-0.5">Still in use</span>
                <span className="font-serif text-[26px] leading-none pt-1" style={{ color: activePost === 'sa' ? '#0284c7' : 'currentColor' }}>ས</span>
              </button>
            </div>

            {activePost === "da" && (
              <div className="bg-white rounded-[1.5rem] border border-border-subtle shadow-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-5">
                <p className="text-[13px] font-bold leading-relaxed text-ink-light mb-5">No longer written in modern Tibetan spelling, but grammatically words behave <em>as if</em> it were there.</p>
                <div className="space-y-4">
                  {[
                    ["སྒྱུརད་", "སྒྱུར་", "to change / translate"], 
                    ["ཕྱིནད་", "ཕྱིན་", "went"], 
                    ["སྐྱོནད་", "སྐྱོན་", "flaw"]
                  ].map((r) => (
                    <div key={r[0]} className="bg-surface rounded-[1.25rem] border border-border-subtle overflow-hidden">
                      <div className="flex divide-x divide-border-subtle border-b border-border-subtle">
                        <div className="flex-1 p-4 flex flex-col items-center justify-center bg-surface-muted">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-2">Former</span>
                          <button onClick={() => playAudio(r[0])} disabled={playingItem !== null} className="flex items-center gap-2 text-ink-muted active:text-fuchsia-600 transition-colors">
                            <span className="font-tibetan text-2xl pt-1 leading-none">{r[0]}</span>
                          </button>
                        </div>
                        <div className="flex-1 p-4 flex flex-col items-center justify-center bg-white">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-2">Current</span>
                          <button onClick={() => playAudio(r[1])} disabled={playingItem !== null} className="flex items-center gap-2 text-ink active:text-fuchsia-600 transition-colors">
                            <span className="font-tibetan text-2xl pt-1 leading-none">{r[1]}</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-3 text-center text-[13px] font-bold text-ink-light bg-white">Meaning: <span className="text-ink">{r[2]}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePost === "sa" && (
              <div className="bg-white rounded-[1.5rem] border border-border-subtle shadow-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-5">
                <p className="text-[13px] font-bold leading-relaxed text-ink-light mb-5">Still written today to differentiate near-identical words. Pronunciation remains the same.</p>
                <div className="space-y-4">
                  {[
                    ["མངག་", "མངགས་", "dispatches → dispatched"], 
                    ["གང་", "གངས་", "what(ever) → snow"], 
                    ["ཐབ་", "ཐབས་", "stove → method"]
                  ].map((r) => (
                    <div key={r[0]} className="bg-surface rounded-[1.25rem] border border-border-subtle overflow-hidden">
                      <div className="flex divide-x divide-border-subtle border-b border-border-subtle">
                        <div className="flex-1 p-4 flex flex-col items-center justify-center bg-surface-muted">
                          {/* PERFECTLY SIZED HEADERS */}
                          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 flex items-center justify-center gap-1.5">
                            <span>WITHOUT</span><span className="font-tibetan text-xl normal-case pt-1 leading-none">ས</span>
                          </div>
                          <button onClick={() => playAudio(r[0])} disabled={playingItem !== null} className="flex items-center gap-2 text-ink-muted active:text-sky-600 transition-colors">
                            <span className="font-tibetan text-2xl pt-1 leading-none">{r[0]}</span>
                          </button>
                        </div>
                        <div className="flex-1 p-4 flex flex-col items-center justify-center bg-white">
                          <div className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3 flex items-center justify-center gap-1.5">
                            <span>WITH</span><span className="font-tibetan text-xl normal-case pt-1 leading-none">ས</span>
                          </div>
                          <button onClick={() => playAudio(r[1])} disabled={playingItem !== null} className="flex items-center gap-2 text-ink active:text-sky-600 transition-colors">
                            <span className="font-tibetan text-2xl pt-1 leading-none">{r[1]}</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-3 text-center text-[13px] font-bold text-ink-light bg-white">Meaning: <span className="text-ink">{r[2]}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 6: return <div className="pb-6"><QuizModule title="Mastery Check · Post-Suffixes" questions={POST_SUFFIX_QUESTIONS} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 7:
        return (
          <div className="space-y-4 pb-6">
            <p className="text-[15px] leading-relaxed text-ink/90 mb-4">Now that words can stretch to four horizontal letters, the eye needs a strategy to find the root.</p>
            {[
              { n: "1", rule: "If a letter carries a vowel, superscript, or subscript — it is the root.", words: ["དགེ་", "བཞི་", "འགྲོ་", "བསྒྲིམས་"] },
              { n: "2", rule: "Two bare letters (no vowel, super-/subscript) — the first is the root.", words: ["ཁང་", "ནད་", "ལམ་", "རབ་"] },
              { n: "3", rule: "Three bare letters — the middle is the root, unless the third is post-suffix ད / ས, in which case the first is the root.", words: ["གསལ་", "དཀར་", "ཁམས་", "གངས་"] },
              { n: "4", rule: "Four letters — the second is always the root.", words: ["མངགས་", "བདགས་", "དམངས་"] },
            ].map((r) => (
              <div key={r.n} className="bg-white rounded-[1.5rem] p-6 border border-border-subtle shadow-sm flex flex-col">
                <div className="inline-flex items-center gap-3 bg-brand-light/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-dark self-start rounded-full mb-5">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-brand text-white">{r.n}</span>
                  Rule {r.n}
                </div>
                <div className="flex flex-wrap items-center gap-2 font-tibetan text-3xl leading-normal text-ink mb-5">
                  {r.words.map((w) => (
                    <button key={w} onClick={() => playAudio(w)} className="bg-surface-muted rounded-[1.25rem] px-4 pt-3 pb-4 active:scale-95 transition-transform border border-border-subtle">{w}</button>
                  ))}
                </div>
                <p className="text-[13px] font-bold leading-relaxed text-ink-light pt-4 border-t border-border-subtle">{r.rule}</p>
              </div>
            ))}
          </div>
        );

      case 8: return <div className="pb-6"><QuizModule title="Mastery Check · Root Letters" questions={ROOT_LETTER_QUESTIONS} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;

      case 9:
        return (
          <div className="pb-6">
            <div className="grid grid-cols-2 gap-3">
              {VOCAB.map((v) => {
                const s = SUFFIXES.find(x => x.key === v.suffix)!;
                return (
                  <button key={v.tib} onClick={() => playAudio(v.tib)} className="bg-white border border-border-subtle rounded-[1.5rem] p-5 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform relative overflow-hidden">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: s.accent }} />
                    <span className="text-[40px] mb-3">{v.emoji}</span>
                    <span className="font-tibetan text-4xl text-ink leading-none mb-2 pt-2">{v.tib}</span>
                    <span className="font-mono text-[11px] tracking-widest text-ink-muted font-bold uppercase mb-1">[{v.read}]</span>
                    <span className="text-[14px] font-bold text-ink">{v.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 10: return <div className="pb-6"><QuizModule title="Vocabulary Mastery" intro="Score 80% or higher to prove you know these words." questions={vocabQuestions} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} isUnlockTest={false} /></div>;
      case 11: return <div className="pb-6"><PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} /></div>;
      case 12: return <div className="pb-6"><QuizModule title="Final Step Test" intro="Score 80% or higher to unlock the next step." questions={finalQuizQuestions} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} hideHeader={true} nextLessonPath="/dashboard/lessons/7" onPass={() => markComplete(7)} /></div>;
    }
  };

  const stepTitles = [
    "Suffixes & Post-suffixes", "What is a suffix?", "Meet the ten suffixes", "Mastery Check · Suffixes", 
    "When the vowel meets the suffix", "The Post-suffixes", "Mastery Check · Post-suffixes", 
    "How to recognize the root letter", "Mastery Check · Root Letters", "Vocabulary", 
    "Vocabulary Mastery", "Practice & exercises", "Lesson complete" 
  ];

  return (
    <>
      <MobileStepPlayer
        currentStep={currentStep} totalSteps={totalSteps} onClose={handleClose} onContinue={handleNext}
        onPrevious={currentStep > 0 ? handlePrevious : undefined} unitContext={`Unit 6 · Step ${currentStep + 1} of ${totalSteps}`} 
        title={stepTitles[currentStep]} continueText={currentStep === totalSteps - 1 ? "Finish Unit" : "Continue"} hideContinue={currentStep === totalSteps - 1} 
      >
        {renderStepContent()}
      </MobileStepPlayer>

      {/* BOTTOM SHEET INSPECTOR - THE PERFECT SPELLING WALKTHROUGH FIX */}
      {selectedSuffix && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110] transition-opacity" onClick={() => setSelectedSuffix(null)}></div>
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl pb-safe animate-in slide-in-from-bottom-full duration-300 max-h-[85vh] flex flex-col">
            
            <div className="shrink-0 p-6 pb-2 border-b border-border-subtle bg-white rounded-t-[2rem]">
              <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center font-serif text-[3rem] leading-none pt-2 shadow-sm" style={{ backgroundColor: `${selectedSuffix.accent}15`, color: selectedSuffix.accent }}>{selectedSuffix.head}</div>
                 <div>
                    <div className="font-serif text-2xl font-bold text-ink">Suffix {selectedSuffix.latin}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">{FAMILY_META[selectedSuffix.family as Family].label} · {selectedSuffix.reads}</div>
                 </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              <div className="space-y-3">
                <div className="bg-surface-muted rounded-[1.25rem] p-4 text-[14px] leading-relaxed text-ink/90 border border-border-subtle">{selectedSuffix.hint}</div>
                {selectedSuffix.note && (
                  <div className="flex items-start gap-3 bg-brand-light/50 px-4 py-3 rounded-[1.25rem] border border-amber-200">
                    <Info className="mt-0.5 size-5 shrink-0 text-brand" />
                    <span className="text-[13px] font-medium leading-relaxed text-ink-light">{selectedSuffix.note}</span>
                  </div>
                )}
                {selectedSuffix.vowelShift && (
                  <div className="flex items-start gap-3 bg-sky-50/50 px-4 py-3 rounded-[1.25rem] border border-sky-200">
                    <Sparkles className="mt-0.5 size-5 shrink-0 text-sky-500" />
                    <span className="text-[13px] font-medium leading-relaxed text-ink-light">{selectedSuffix.vowelShift}</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted text-center pt-2">Examples & Spelling</div>
              <div className="space-y-3 pb-6">
                {selectedSuffix.examples.map((ex: SuffixExample) => (
                  <div key={ex.word} className="bg-white p-5 rounded-[1.5rem] border border-border-subtle shadow-sm">
                    
                    {/* PERFECT HORIZONTAL ALIGNMENT LOGIC */}
                    
					
					<div className="flex justify-center mb-5">
<SpellingFormula parts={ex.parts} />
</div>
					

                    <div className="flex items-center justify-center gap-4 mb-6">
                      <ArrowRight className="text-border-strong opacity-50" size={20} />
                      <span className="font-tibetan text-[4rem] leading-none pt-2 text-ink" style={{ color: selectedSuffix.accent }}>{ex.word}</span>
                      <span className="font-mono text-2xl font-bold text-ink">[{ex.read}]</span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => playAudio(ex.word + " spelling")} className="flex-1 py-3 bg-surface-muted text-ink font-bold rounded-xl active:bg-border-subtle transition-colors flex items-center justify-center gap-2 border border-border-subtle">
                        {playingItem === (ex.word + " spelling") ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} className="text-ink-muted" />} 
                        <span className="text-xs">Spelling</span>
                      </button>
                      <button onClick={() => playAudio(ex.word)} className="flex-1 py-3 bg-ink text-white font-bold rounded-xl active:bg-ink-light transition-colors flex items-center justify-center gap-2 shadow-sm">
                        {playingItem === ex.word ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                        <span className="text-xs">Word</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="shrink-0 pt-4 bg-paper">
              <button onClick={() => setSelectedSuffix(null)} className="w-full py-4 text-center font-bold text-ink hover:bg-ink/5 rounded-full transition-colors border border-border-strong">Close</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}