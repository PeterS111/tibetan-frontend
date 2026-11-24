// app/components/lesson/9/MobileLesson9.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Volume2, Eye, EyeOff, Info, Check, Mic, MessageCircle, Lightbulb } from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import {
  VOCAB,
  VOCAB_CATEGORIES,
  USEFUL_PHRASES,
  TEENS_CARDS,
  TENS_PARTICLES,
  WEEKDAYS_CYCLE,
  CLOCK_EXAMPLES,
  DIALOGUES,
  CULTURE_NOTES,
  TIBETAN_DIGITS,
  ROUND_NUMBERS,
  CAN_DO_CHECKLIST,
  SPEAKING_PROMPTS,
  WEB_STEPS,
  generateVocabQuiz,
  generatePhrasesQuiz,
  generateNumbersQuiz,
  generateDaysQuiz,
  generateTimeQuiz,
  generateFinalQuiz,
  type Lesson9Phrase,
  type Vocab9Category,
} from "@/app/data/lesson9";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

function renderTibetanMobile(text: string) {
  const parts = text.split(/([\u0F00-\u0FFF]+)/g);
  return parts.map((part, idx) =>
    /[\u0F00-\u0FFF]/.test(part) ? (
      <span key={idx} className="font-tibetan font-normal text-xl text-ink leading-normal mx-0.5">{part}</span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export function MobileLesson9() {
  const router = useRouter();
  const { playAudio, stopAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete } = useLessonProgress(WEB_STEPS.length);

  const totalSteps = 13;
  const MODULE_ID = 9;

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

  const [vocabFilter, setVocabFilter] = useState<"all" | Vocab9Category>("all");
  const [coverVocabEn, setCoverVocabEn] = useState(false);
  const [coverPhrasesEn, setCoverPhrasesEn] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<Lesson9Phrase | null>(null);
  const [bubbleReveal, setBubbleReveal] = useState<Record<string, number>>({});
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const webStepMap = [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 7];

  const vocabQuiz = useMemo(() => generateVocabQuiz(), []);
  const phrasesQuiz = useMemo(() => generatePhrasesQuiz(), []);
  const numbersQuiz = useMemo(() => generateNumbersQuiz(), []);
  const daysQuiz = useMemo(() => generateDaysQuiz(), []);
  const timeQuiz = useMemo(() => generateTimeQuiz(), []);
  const finalQuiz = useMemo(() => generateFinalQuiz(), []);

  const practiceGroups = useMemo(
    () => [
      { name: "Vocabulary", items: VOCAB.map((v) => ({ id: `b2-l2-v-${v.tib}`, tibetan: v.tib, reading: v.pron, english: v.en, audioTarget: v.tib, emoji: v.emoji })) },
      { name: "Phrases", items: USEFUL_PHRASES.map((p) => ({ id: `b2-l2-p-${p.id}`, tibetan: p.tib, reading: p.pron, english: p.en, audioTarget: p.tib })) },
      { name: "Round Numbers", items: ROUND_NUMBERS.map((r) => ({ id: `b2-l2-r-${r.arabic}`, tibetan: r.tib, reading: r.pron, english: r.arabic, audioTarget: r.tib })) },
    ],
    []
  );

  const handleNext = () => {
    stopAudio();
    markComplete(webStepMap[currentStep], currentStep === 2);
    if (currentStep < totalSteps - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (typeof window !== "undefined") {
        localStorage.setItem(`tibetan_mobile_lesson_${MODULE_ID}_step`, next.toString());
        localStorage.setItem("tibetan_last_active_lesson", MODULE_ID.toString());
      }
    } else {
      if (typeof window !== "undefined") localStorage.setItem(`tibetan_mobile_lesson_${MODULE_ID}_step`, "0");
      router.push("/dashboard/lessons");
    }
  };

  const handlePrevious = () => {
    stopAudio();
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      if (typeof window !== "undefined") localStorage.setItem(`tibetan_mobile_lesson_${MODULE_ID}_step`, prev.toString());
    }
  };

  const handleClose = () => { stopAudio(); router.push("/dashboard/lessons"); };

  const filteredVocab = useMemo(
    () => (vocabFilter === "all" ? VOCAB : VOCAB.filter((v) => v.category === vocabFilter)),
    [vocabFilter]
  );

  const revealThread = (threadId: string, count: number) => {
    setBubbleReveal((prev) => {
      const next = { ...prev };
      for (let i = 0; i < count; i++) next[`${threadId}-${i}`] = 2;
      return next;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="pb-4 space-y-4">
            <div className="bg-surface rounded-[1.5rem] border border-border-subtle shadow-sm overflow-hidden">
              <div className="w-full h-40 bg-surface-muted overflow-hidden relative">
                <img src="/06_suffixes_post_suffixes.jpg" alt="Numbers, Time & Days" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">Beginner 2 · Unit 02</span>
                  <h2 className="font-serif text-2xl text-white font-bold leading-tight">Numbers, Time &amp; Days</h2>
                </div>
              </div>
              <div className="p-5">
                <div className="font-tibetan text-2xl text-ink mb-3 leading-normal">ཨང་གྲངས། ཆུ་ཚོད། གཟའ་འཁོར།</div>
                <p className="text-[13.5px] leading-relaxed text-ink-light mb-4">Count from 0 to 100, learn the seven planetary days of the week, tell the clock time, and exchange phone numbers.</p>
                <hr className="border-border-subtle mb-3.5" />
                <div className="grid grid-cols-3 divide-x divide-border-subtle text-center py-0.5">
                  <div className="px-2"><div className="font-serif text-2xl text-ink">30</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Words</div></div>
                  <div className="px-2"><div className="font-serif text-2xl text-ink">8</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Phrases</div></div>
                  <div className="px-2"><div className="font-serif text-2xl text-ink">3</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Dialogues</div></div>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFDF4] border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
              <Lightbulb size={16} className="text-brand-dark shrink-0 mt-0.5" />
              <div className="text-xs text-ink-light leading-relaxed"><strong className="text-ink">Key pattern:</strong> Learn 0–10 and the linking particles above 20 — they unlock every number up to 100.</div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 pb-6">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-ink-light">Tap any card to hear it.</span>
              <button type="button" onClick={() => setCoverVocabEn(!coverVocabEn)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${coverVocabEn ? "bg-ink text-white border-ink" : "bg-white text-ink border-border-strong"}`}>
                {coverVocabEn ? <Eye size={12} /> : <EyeOff size={12} />} {coverVocabEn ? "Show" : "Cover"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => setVocabFilter("all")} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${vocabFilter === "all" ? "bg-ink text-white border-ink" : "bg-white text-ink-muted border-border-subtle"}`}>All · {VOCAB.length}</button>
              {VOCAB_CATEGORIES.map((cat) => (
                <button key={cat.id} type="button" onClick={() => setVocabFilter(cat.id)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${vocabFilter === cat.id ? "bg-ink text-white border-ink" : "bg-white text-ink-muted border-border-subtle"}`}>
                  <span className="size-2 rounded-full" style={{ backgroundColor: cat.hex }} /> {cat.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filteredVocab.map((v) => (
                <button key={v.tib} type="button" onClick={() => playAudio(v.tib)} className="bg-white border border-border-subtle rounded-[1.25rem] p-4 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform">
                  <span className="text-2xl mb-1.5">{v.emoji}</span>
                  <span className="font-tibetan text-2xl text-ink leading-normal pb-0.5">{v.tib}</span>
                  <span className="font-serif italic text-xs text-ink-muted mb-1">{v.pron}</span>
                  <span className="text-xs font-bold text-ink">{coverVocabEn ? "•••" : v.en}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return <div className="pb-6"><QuizModule moduleId={9} title="Mastery Check · Vocabulary" questions={vocabQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} /></div>;

      case 3:
        return (
          <div className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-light font-medium">Tap any phrase for breakdown &amp; sound</span>
              <button type="button" onClick={() => setCoverPhrasesEn(!coverPhrasesEn)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${coverPhrasesEn ? "bg-ink text-white border-ink" : "bg-white text-ink border-border-strong"}`}>
                {coverPhrasesEn ? <Eye size={12} /> : <EyeOff size={12} />} {coverPhrasesEn ? "Show" : "Cover"}
              </button>
            </div>
            <div className="space-y-2.5">
              {USEFUL_PHRASES.map((p) => (
                <button key={p.id} type="button" onClick={() => { setSelectedPhrase(p); playAudio(p.tib); }} className="w-full bg-white border border-border-subtle rounded-2xl p-4 text-left shadow-2xs active:scale-[0.99]">
                  <div className="flex items-start justify-between gap-2"><span className="font-tibetan text-2xl text-ink leading-normal pb-0.5">{p.tib}</span><Volume2 size={15} className="text-ink-muted shrink-0 mt-1" /></div>
                  <div className="font-serif italic text-xs text-ink-muted mb-1">{p.pron}</div>
                  <div className="text-xs font-bold text-ink">{coverPhrasesEn ? "Tap to inspect" : p.en}</div>
                </button>
              ))}
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs leading-relaxed text-ink-light space-y-1.5">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]"><Info size={13} /> ག་ཚོད་ vs ག་རེ་</div>
              <p><span className="font-tibetan text-lg text-ink">ག་ཚོད་</span> asks &lsquo;how much/many&rsquo; (prices, clock time). <span className="font-tibetan text-lg text-ink">ག་རེ་</span> asks &lsquo;what&rsquo; (phone numbers, days of the week).</p>
            </div>
          </div>
        );

      case 4:
        return <div className="pb-6"><QuizModule moduleId={9} title="Mastery Check · Useful Phrases" questions={phrasesQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} /></div>;

      case 5:
        return (
          <div className="space-y-5 pb-6">
            <div className="text-eyebrow">Numbers 11–20</div>
            <div className="grid grid-cols-2 gap-2.5">
              {TEENS_CARDS.map((c) => (
                <button key={c.num} type="button" onClick={() => playAudio(c.tib)} className={`bg-white border rounded-2xl p-3 text-left ${c.vowelShift ? "border-rose-200 border-l-2 border-l-rose-500" : "border-border-subtle"}`}>
                  <div className="flex items-center justify-between"><span className="font-tibetan text-xl text-ink">{c.tib}</span><span className="text-xs font-bold text-brand-dark">{c.num}</span></div>
                  <div className="text-[11px] font-serif italic text-ink-muted">{c.pron}</div>
                  {c.vowelShift && <div className="text-[8px] font-bold uppercase tracking-widest text-rose-600 mt-1">Vowel Shift</div>}
                </button>
              ))}
            </div>
            <div className="text-eyebrow">Tens &amp; Linking Particles</div>
            <div className="grid grid-cols-2 gap-2.5">
              {TENS_PARTICLES.map((t) => (
                <button key={t.num} type="button" onClick={() => playAudio(t.tenTib)} className="bg-white border border-border-subtle rounded-xl p-3 text-left">
                  <div className="flex items-center justify-between"><span className="text-xs font-bold text-ink">{t.num}</span><span className="font-tibetan text-lg text-brand-dark">{t.particle}</span></div>
                  <div className="font-tibetan text-lg text-ink leading-normal">{t.exampleTib}</div>
                  <div className="text-[10px] text-ink-muted">{t.exampleNum}</div>
                </button>
              ))}
            </div>
            <QuizModule moduleId={9} title="Mastery Check · Numbers 11-99" questions={numbersQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} />
          </div>
        );

      case 6:
        return (
          <div className="space-y-5 pb-6">
            <div className="text-eyebrow">Days of the Week (གཟའ་ + planet)</div>
            <div className="space-y-2">
              {WEEKDAYS_CYCLE.map((d) => (
                <button key={d.num} type="button" onClick={() => playAudio(d.tib)} className="w-full bg-white border border-border-subtle rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`size-7 rounded-full text-[10px] font-bold flex items-center justify-center ${d.tone === "emerald" ? "bg-[#1F5328] text-white" : "bg-brand text-ink"}`}>{d.num}</span>
                    <div className="text-left"><div className="font-tibetan text-xl text-ink leading-normal">{d.tib}</div><div className="text-[11px] font-serif italic text-ink-muted">{d.pron}</div></div>
                  </div>
                  <div className="text-right"><div className="text-xs font-bold text-ink">{d.en}</div><div className="text-[10px] text-ink-muted">{d.planet}</div></div>
                </button>
              ))}
            </div>
            <div className="bg-[#1F5328] text-white rounded-2xl p-4 text-xs space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand">Clock Time Formula</div>
              <div className="font-tibetan text-lg">ཆུ་ཚོད་ + [number] + པ / བ + རེད།</div>
              <p className="text-white/85">Add <span className="font-tibetan text-base">ར་</span> for &lsquo;at&rsquo; (e.g. <span className="font-tibetan text-base">ཆུ་ཚོད་བཅུ་པར་</span> = at 10 o&apos;clock).</p>
            </div>
            <div className="space-y-2">
              {CLOCK_EXAMPLES.map((ex) => (
                <button key={ex.label} type="button" onClick={() => playAudio(ex.tib)} className="w-full bg-white border border-border-subtle rounded-xl px-4 py-3 flex items-center justify-between text-left">
                  <div><div className="text-[11px] font-bold text-brand-dark">{ex.label}</div><div className="font-tibetan text-xl text-ink">{ex.tib}</div></div>
                  <Volume2 size={15} className="text-ink-muted" />
                </button>
              ))}
            </div>
            <QuizModule moduleId={9} title="Mastery Check · Telling the Time" questions={timeQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} />
          </div>
        );

      case 7:
        return (
          <div className="space-y-5 pb-6">
            <p className="text-xs text-ink-light">Tap a bubble once for romanisation, again for English, and a third time to reset.</p>
            {DIALOGUES.map((thread) => (
              <div key={thread.id} className="bg-white border border-border-subtle rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
                  <div className="flex items-center gap-2"><MessageCircle size={15} className="text-brand-dark shrink-0" /><div><div className="font-serif font-bold text-sm text-ink">{thread.title}</div><div className="text-[11px] text-ink-muted">{thread.subtitle}</div></div></div>
                  <button type="button" onClick={() => revealThread(thread.id, thread.lines.length)} className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-border-subtle text-ink-muted">Reveal all</button>
                </div>
                {thread.lines.map((line, idx) => {
                  const key = `${thread.id}-${idx}`;
                  const lvl = bubbleReveal[key] || 0;
                  return (
                    <div key={key} onClick={() => { setBubbleReveal((p) => ({ ...p, [key]: ((p[key] || 0) + 1) % 3 })); playAudio(line.tib); }} className={`p-3.5 rounded-2xl border cursor-pointer ${line.side === "right" ? "bg-brand-light/40 border-brand/30 ml-5" : "bg-paper border-border-subtle mr-5"}`}>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted mb-1">{line.speaker} · <span className="font-tibetan text-xs font-normal">{line.speakerTib}</span></div>
                      <div className="font-tibetan text-2xl text-ink leading-normal">{line.tib}</div>
                      {lvl >= 1 && <div className="text-xs font-serif italic text-ink-muted mt-1">{line.pron}</div>}
                      {lvl >= 2 && <div className="text-xs font-bold text-ink mt-1 pt-1 border-t border-border-subtle">{line.en}</div>}
                      <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted mt-1.5">{lvl === 0 ? "Tap to reveal" : lvl === 1 ? "Tap again for English" : "Tap to reset"}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );

      case 8:
        return (
          <div className="space-y-5 pb-6">
            <div className="bg-[#FFFDF5] border border-amber-200 rounded-2xl p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-3">Tibetan Digits 0–10</div>
              <div className="grid grid-cols-3 gap-2">
                {TIBETAN_DIGITS.map((d) => (
                  <button key={d.arabic} type="button" onClick={() => playAudio(d.word)} className="bg-white border border-border-subtle rounded-xl p-2.5 text-center">
                    <div className="text-[10px] font-bold text-ink-muted">{d.arabic}</div>
                    <div className="font-tibetan text-2xl text-ink">{d.digit}</div>
                    <div className="font-tibetan text-sm text-ink-light">{d.word}</div>
                  </button>
                ))}
              </div>
            </div>
            {CULTURE_NOTES.map((note) => (
              <div key={note.id} className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-4 bg-ink text-white">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-brand mb-1">{note.badge}</div>
                  <div className="font-serif text-lg font-bold">{note.title}</div>
                </div>
                <div className="p-4 space-y-2.5 text-xs leading-relaxed text-ink-light">
                  {note.paragraphs.map((p, i) => <p key={i}>{renderTibetanMobile(p)}</p>)}
                </div>
              </div>
            ))}
          </div>
        );

      case 9:
        return <div className="pb-6"><QuizModule moduleId={9} title="Mastery Check · Days of the Week" questions={daysQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} hideHeader={true} /></div>;

      case 10:
        return <div className="pb-6"><PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} /></div>;

      case 11:
        return (
          <div className="space-y-5 pb-6">
            <div className="bg-white border border-border-subtle rounded-2xl p-5 space-y-3">
              <div className="text-eyebrow">Can-Do Checklist</div>
              {CAN_DO_CHECKLIST.map((item, idx) => {
                const checked = !!checkedItems[idx];
                return (
                  <button key={idx} type="button" onClick={() => setCheckedItems((p) => ({ ...p, [idx]: !p[idx] }))} className="w-full flex items-start gap-3 text-left py-1.5">
                    <div className={`mt-0.5 size-5 rounded-md border flex items-center justify-center shrink-0 ${checked ? "bg-emerald-600 border-emerald-600 text-white" : "border-border-strong bg-white"}`}>{checked && <Check size={12} strokeWidth={3} />}</div>
                    <span className="text-xs leading-relaxed text-ink">{renderTibetanMobile(item)}</span>
                  </button>
                );
              })}
            </div>
            <div className="bg-brand-light/50 border border-brand/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-eyebrow text-brand-dark"><Mic size={13} /> Say It Out Loud</div>
              {SPEAKING_PROMPTS.map((pr, idx) => <div key={idx} className="border-l-2 border-brand pl-3 text-xs font-medium text-ink">{renderTibetanMobile(pr)}</div>)}
            </div>
          </div>
        );

      case 12:
        return (
          <div className="pb-6">
            <QuizModule moduleId={9} title="Final Test" intro="40 questions across numbers, linking particles, weekdays, clock time, phrases, and dialogues. Score 80% or higher to pass." questions={finalQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} isUnlockTest={true} nextLessonPath="/dashboard/lessons" onPass={() => markComplete(7)} hideHeader={true} />
          </div>
        );
    }
  };

  const stepTitles = [
    "Numbers, Time & Days", "Vocabulary", "Vocabulary Check", "Useful Phrases", "Phrases Check",
    "Numbers 11–99", "Weekdays & Clock Time", "Real-Life Dialogues", "Digits & Culture",
    "Days Check", "Practice & Exercises", "Consolidate & Review", "Final Test",
  ];
  const stepTibetanTitles: (string | undefined)[] = [
    undefined, "ཚིག་གསར།", "ཚིག་གསར་སྦྱོང་ཚན།", "བརྗོད་པ།", "སྦྱོང་ཚན།",
    "ཨང་གྲངས།", "གཟའ་དང་ཆུ་ཚོད།", "ཁ་བརྡ།", "དཔྱད་གཞི།",
    "སྦྱོང་ཚན།", "སྦྱོང་ཚན།", "བསྐྱར་ཞིབ།", "མཐའ་མའི་རྒྱུགས་ཞིབ།",
  ];

  return (
    <>
      <MobileStepPlayer currentStep={currentStep} totalSteps={totalSteps} onClose={handleClose} onContinue={handleNext} onPrevious={currentStep > 0 ? handlePrevious : undefined} unitContext={`Beginner 2 · Unit 02 · Step ${currentStep + 1} of ${totalSteps}`} title={stepTitles[currentStep]} tibetanTitle={stepTibetanTitles[currentStep]} continueText={currentStep === totalSteps - 1 ? "Finish Unit" : "Continue"} hideContinue={currentStep === totalSteps - 1}>
        {renderStepContent()}
      </MobileStepPlayer>

      {selectedPhrase && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110]" onClick={() => { stopAudio(); setSelectedPhrase(null); }} />
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-5" />
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="font-tibetan text-3xl text-ink leading-normal pb-1">{selectedPhrase.tib}</div>
                <div className="font-serif italic text-sm text-ink-muted">{selectedPhrase.pron}</div>
                <div className="text-sm font-bold text-ink mt-1">{selectedPhrase.en}</div>
              </div>
              <button type="button" onClick={() => playAudio(selectedPhrase.tib)} className="size-12 rounded-full bg-brand text-ink flex items-center justify-center shrink-0 shadow-sm">
                {playingItem === selectedPhrase.tib ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-border-subtle space-y-2 max-h-60 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Word-by-word breakdown</div>
              {selectedPhrase.breakdown.map((b, i) => (
                <div key={i} className="flex items-baseline gap-2 text-xs">
                  <span className="font-tibetan text-xl text-ink">{b.tib}</span>
                  <span className="italic text-ink-muted">({b.pron})</span>
                  <span className="font-bold text-ink-light">— {b.gloss}</span>
                  {b.pos && <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-brand-dark">{b.pos}</span>}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => { stopAudio(); setSelectedPhrase(null); }} className="w-full mt-5 py-3.5 text-center font-bold text-ink border border-border-strong rounded-full">Close</button>
          </div>
        </>
      )}
    </>
  );
}
