// app/components/lesson/8/MobileLesson8.tsx
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
  PRONOUNS,
  DEMONSTRATIVES,
  COPULA_ROWS,
  COPULA_EXAMPLES,
  DIALOGUES,
  CLASSROOM_COMMANDS,
  CULTURE_NOTES,
  CAN_DO_CHECKLIST,
  SPEAKING_PROMPTS,
  WEB_STEPS,
  generateVocabQuiz,
  generatePhrasesQuiz,
  generateCopulaQuiz,
  generateCommandsQuiz,
  generateFinalQuiz,
  type UsefulPhrase,
  type ClassroomCommand,
  type VocabCategory,
} from "@/app/data/lesson8";

import { MobileStepPlayer } from "../MobileStepPlayer";
import QuizModule from "@/app/components/QuizModule";
import PracticeSuite from "@/app/components/practice/PracticeSuite";

function renderTibetanMobile(text: string) {
  const parts = text.split(/([\u0F00-\u0FFF]+)/g);
  return parts.map((part, idx) =>
    /[\u0F00-\u0FFF]/.test(part) ? (
      <span key={idx} className="font-tibetan font-normal text-xl text-ink leading-normal mx-0.5">
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export function MobileLesson8() {
  const router = useRouter();
  const { playAudio, stopAudio, playErrorBeep, playingItem } = useAudio();
  const { markComplete } = useLessonProgress(WEB_STEPS.length);

  const totalSteps = 13;
  const MODULE_ID = 8;

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

  const [vocabFilter, setVocabFilter] = useState<"all" | VocabCategory>("all");
  const [coverVocabEn, setCoverVocabEn] = useState(false);
  const [coverPhrasesEn, setCoverPhrasesEn] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState<UsefulPhrase | ClassroomCommand | null>(null);
  const [bubbleReveal, setBubbleReveal] = useState<Record<string, number>>({});
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Maps all 13 thumb-friendly mobile screens onto the 8 canonical Beginner 2 sections (0..7)
  const webStepMap = [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 7];

  const vocabQuiz = useMemo(() => generateVocabQuiz(), []);
  const phrasesQuiz = useMemo(() => generatePhrasesQuiz(), []);
  const copulaQuiz = useMemo(() => generateCopulaQuiz(), []);
  const commandsQuiz = useMemo(() => generateCommandsQuiz(), []);
  const finalQuiz = useMemo(() => generateFinalQuiz(), []);

  const practiceGroups = useMemo(
    () => [
      {
        name: "Vocabulary",
        items: VOCAB.map((v) => ({
          id: `b2-l1-v-${v.tib}`,
          tibetan: v.tib,
          reading: v.pron,
          english: v.en,
          audioTarget: v.tib,
          emoji: v.emoji,
        })),
      },
      {
        name: "Phrases",
        items: USEFUL_PHRASES.map((p) => ({
          id: `b2-l1-p-${p.id}`,
          tibetan: p.tib,
          reading: p.pron,
          english: p.en,
          audioTarget: p.tib,
        })),
      },
      {
        name: "Commands",
        items: CLASSROOM_COMMANDS.map((c) => ({
          id: `b2-l1-c-${c.num}`,
          tibetan: c.tib,
          reading: c.pron,
          english: c.en,
          audioTarget: c.tib,
        })),
      },
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
      if (typeof window !== "undefined") {
        localStorage.setItem(`tibetan_mobile_lesson_${MODULE_ID}_step`, prev.toString());
      }
    }
  };

  const handleClose = () => {
    stopAudio();
    router.push("/dashboard/lessons");
  };

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
                <img src="/loplao-hero-scene.jpg" alt="Welcome to the Class" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">Beginner 2 · Unit 01</span>
                  <h2 className="font-serif text-2xl text-white font-bold leading-tight">Welcome to the Class</h2>
                </div>
              </div>
              <div className="p-5">
                <div className="font-tibetan text-2xl text-ink mb-3 leading-normal">འཛིན་གྲྭར་ཕེབས་པར་དགའ་བསུ་ཞུ།</div>
                <p className="text-[13.5px] leading-relaxed text-ink-light mb-4">
                  Classroom objects, everyday greetings and goodbyes, polite pronouns, the verb “to be” (ཡིན་ / རེད་), and four first-day dialogues.
                </p>
                <hr className="border-border-subtle mb-3.5" />
                <div className="grid grid-cols-3 divide-x divide-border-subtle text-center py-0.5">
                  <div className="px-2"><div className="font-serif text-2xl text-ink">18</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Words</div></div>
                  <div className="px-2"><div className="font-serif text-2xl text-ink">14</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Phrases</div></div>
                  <div className="px-2"><div className="font-serif text-2xl text-ink">4</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold mt-0.5">Dialogues</div></div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFDF4] border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
              <Lightbulb size={16} className="text-brand-dark shrink-0 mt-0.5" />
              <div className="text-xs text-ink-light leading-relaxed">
                <strong className="text-ink">Tip for mobile:</strong> Tap any word or phrase card to hear audio, and tap phrases or commands to open their word-by-word breakdown sheet.
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 pb-6">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-ink-light">Tap any card to hear it.</span>
              <button
                type="button"
                onClick={() => setCoverVocabEn(!coverVocabEn)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  coverVocabEn ? "bg-ink text-white border-ink" : "bg-white text-ink border-border-strong"
                }`}
              >
                {coverVocabEn ? <Eye size={12} /> : <EyeOff size={12} />}
                {coverVocabEn ? "Show English" : "Cover"}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setVocabFilter("all")}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  vocabFilter === "all" ? "bg-ink text-white border-ink" : "bg-white text-ink-muted border-border-subtle"
                }`}
              >
                All · {VOCAB.length}
              </button>
              {VOCAB_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setVocabFilter(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    vocabFilter === cat.id
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-ink-muted border-border-subtle"
                  }`}
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: cat.hex }} />
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredVocab.map((v) => (
                <button
                  key={v.tib}
                  type="button"
                  onClick={() => playAudio(v.tib)}
                  className="bg-white border border-border-subtle rounded-[1.25rem] p-4 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform"
                >
                  <span className="text-3xl mb-1.5">{v.emoji}</span>
                  <span className="font-tibetan text-3xl text-ink leading-normal pb-0.5">{v.tib}</span>
                  <span className="font-serif italic text-xs text-ink-muted mb-1">{v.pron}</span>
                  <span className="text-xs font-bold text-ink">{coverVocabEn ? "•••" : v.en}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="pb-6">
            <QuizModule
              moduleId={8}
              title="Mastery Check · Vocabulary"
              questions={vocabQuiz}
              playAudio={playAudio}
              stopAudio={stopAudio}
              playingItem={playingItem}
              playErrorBeep={playErrorBeep}
              hideHeader={true}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-light font-medium">Tap a card for breakdown & sound</span>
              <button
                type="button"
                onClick={() => setCoverPhrasesEn(!coverPhrasesEn)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  coverPhrasesEn ? "bg-ink text-white border-ink" : "bg-white text-ink border-border-strong"
                }`}
              >
                {coverPhrasesEn ? <Eye size={12} /> : <EyeOff size={12} />}
                {coverPhrasesEn ? "Show" : "Cover"}
              </button>
            </div>

            <div className="space-y-2.5">
              {USEFUL_PHRASES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedBreakdown(p);
                    playAudio(p.tib);
                  }}
                  className="w-full bg-white border border-border-subtle rounded-2xl p-4 text-left shadow-2xs active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-tibetan text-2xl text-ink leading-normal pb-0.5">{p.tib}</span>
                    <Volume2 size={15} className="text-ink-muted shrink-0 mt-1" />
                  </div>
                  <div className="font-serif italic text-xs text-ink-muted mb-1">{p.pron}</div>
                  <div className="text-xs font-bold text-ink">{coverPhrasesEn ? "Tap to inspect" : p.en}</div>
                </button>
              ))}
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs leading-relaxed text-ink-light space-y-2">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Info size={13} /> Politeness Particle ལགས། (la)
              </div>
              <p>
                Add <span className="font-tibetan text-lg text-ink">ལགས་</span> after names/titles (
                <span className="font-tibetan text-lg text-ink">དགེ་རྒན་ལགས།</span>) or before copulas in polite replies (
                <span className="font-tibetan text-lg text-ink">ལགས་ཡིན།</span>).
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="pb-6">
            <QuizModule
              moduleId={8}
              title="Mastery Check · Useful Phrases"
              questions={phrasesQuiz}
              playAudio={playAudio}
              stopAudio={stopAudio}
              playingItem={playingItem}
              playErrorBeep={playErrorBeep}
              hideHeader={true}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-5 pb-6">
            <div className="bg-[#FFFDF4] border border-amber-200/80 rounded-2xl p-3.5 text-xs leading-relaxed text-ink">
              <strong className="text-brand-dark uppercase tracking-wider text-[10px] block mb-1">Rule of thumb</strong>
              <span className="font-tibetan text-lg">ང་</span> for me,{" "}
              <span className="font-tibetan text-lg">ཁྱེད་རང་</span> for you,{" "}
              <span className="font-tibetan text-lg">ཁོང་</span> for anyone you respect.
            </div>

            {(["singular", "plural"] as const).map((grp) => (
              <div key={grp}>
                <div className="text-eyebrow mb-2.5">{grp}</div>
                <div className="grid grid-cols-2 gap-2.5">
                  {PRONOUNS.filter((p) => p.number === grp).map((p) => (
                    <button
                      key={p.tib}
                      type="button"
                      onClick={() => playAudio(p.tib)}
                      className="bg-white border border-border-subtle rounded-2xl p-3.5 flex flex-col items-center text-center shadow-2xs active:scale-95 transition-transform"
                    >
                      {p.honorific && (
                        <span className="text-[8px] font-bold uppercase tracking-widest bg-brand text-ink px-2 py-0.5 rounded-full mb-1">
                          Honorific
                        </span>
                      )}
                      <span className="font-tibetan text-2xl text-ink leading-normal">{p.tib}</span>
                      <span className="font-serif italic text-[11px] text-ink-muted">{p.pron}</span>
                      <span className="text-xs font-bold text-ink mt-0.5">{p.en}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="text-eyebrow mb-2.5">Demonstratives</div>
              <div className="grid grid-cols-2 gap-2.5">
                {DEMONSTRATIVES.map((d) => (
                  <button
                    key={d.tib}
                    type="button"
                    onClick={() => playAudio(d.tib)}
                    className="bg-white border border-border-subtle rounded-xl p-3 flex items-center justify-between active:scale-95 transition-transform"
                  >
                    <span className="font-tibetan text-2xl text-ink">{d.tib}</span>
                    <span className="text-xs font-bold text-ink">{d.en}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-5 pb-6">
            <div className="bg-brand-light/60 border border-brand/40 rounded-2xl p-4 text-xs font-bold text-ink leading-relaxed">
              First person (<span className="font-tibetan text-lg font-normal">ང་ / ང་ཚོ་</span>):{" "}
              <span className="font-tibetan text-lg font-normal text-brand-dark">ཡིན། / མིན།</span>
              <br />
              Everyone else: <span className="font-tibetan text-lg font-normal text-ink-light">རེད། / མ་རེད།</span>
            </div>

            <div className="bg-white border border-border-subtle rounded-2xl divide-y divide-border-subtle overflow-hidden">
              {COPULA_ROWS.map((r) => (
                <div key={r.subjectTib} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-tibetan text-2xl text-ink leading-normal">{r.subjectTib}</div>
                    <div className="text-ink-muted">{r.subjectEn}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-tibetan text-xl text-brand-dark">+ {r.affirmativeTib}</div>
                    <div className="font-tibetan text-xl text-rose-700">− {r.negativeTib}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {COPULA_EXAMPLES.map((ex) => (
                <button
                  key={ex.tib}
                  type="button"
                  onClick={() => playAudio(ex.tib)}
                  className="w-full bg-white border border-border-subtle rounded-xl p-3.5 text-left flex items-center justify-between active:scale-[0.99] transition-transform"
                >
                  <div>
                    <div className="font-tibetan text-2xl text-ink leading-normal">{ex.tib}</div>
                    <div className="text-xs font-bold text-ink-light">{ex.en}</div>
                  </div>
                  <Volume2 size={15} className="text-ink-muted shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2">
              <QuizModule
                moduleId={8}
                title="Mastery Check · Verb To Be"
                questions={copulaQuiz}
                playAudio={playAudio}
                stopAudio={stopAudio}
                playingItem={playingItem}
                playErrorBeep={playErrorBeep}
                hideHeader={true}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-5 pb-6">
            <p className="text-xs text-ink-light">
              Tap a bubble once for romanisation, and a second time for the English meaning.
            </p>
            {DIALOGUES.map((thread) => (
              <div key={thread.id} className="bg-white border border-border-subtle rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={15} className="text-brand-dark shrink-0" />
                    <div>
                      <div className="font-serif font-bold text-sm text-ink">{thread.title}</div>
                      <div className="text-[11px] text-ink-muted">{thread.subtitle}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => revealThread(thread.id, thread.lines.length)}
                    className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-border-subtle text-ink-muted"
                  >
                    Reveal all
                  </button>
                </div>

                {thread.lines.map((line, idx) => {
                  const key = `${thread.id}-${idx}`;
                  const lvl = bubbleReveal[key] || 0;
                  return (
                    <div
                      key={key}
                      onClick={() => {
                        setBubbleReveal((prev) => ({ ...prev, [key]: ((prev[key] || 0) + 1) % 3 }));
                        playAudio(line.tib);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer ${
                        line.side === "right"
                          ? "bg-brand-light/40 border-brand/30 ml-6"
                          : "bg-paper border-border-subtle mr-6"
                      }`}
                    >
                      <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted mb-1">
                        {line.speaker}
                      </div>
                      <div className="font-tibetan text-2xl text-ink leading-normal">{line.tib}</div>
                      {lvl >= 1 && <div className="text-xs font-serif italic text-ink-muted mt-0.5">{line.pron}</div>}
                      {lvl >= 2 && (
                        <div className="text-xs font-bold text-ink mt-1 pt-1 border-t border-border-subtle">
                          {line.en}
                        </div>
                      )}
                      <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted mt-1.5">
                        {lvl === 0 ? "Tap to reveal" : lvl === 1 ? "Tap again for English" : "Tap to reset"}
                      </div>
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
            <div className="space-y-2.5">
              {CLASSROOM_COMMANDS.map((cmd) => (
                <button
                  key={cmd.num}
                  type="button"
                  onClick={() => {
                    setSelectedBreakdown(cmd);
                    playAudio(cmd.tib);
                  }}
                  className="w-full bg-white border border-border-subtle rounded-2xl p-4 text-left flex items-center justify-between active:scale-[0.99] transition-transform"
                >
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-brand-dark">
                      Command {cmd.num}
                    </div>
                    <div className="font-tibetan text-2xl text-ink leading-normal">{cmd.tib}</div>
                    <div className="text-xs font-bold text-ink-light">
                      {cmd.pron} · {cmd.en}
                    </div>
                  </div>
                  <Volume2 size={16} className="text-ink-muted shrink-0" />
                </button>
              ))}
            </div>

            {CULTURE_NOTES.map((note) => (
              <div key={note.id} className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-4 bg-ink text-white">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-brand mb-1">{note.badge}</div>
                  <div className="font-serif text-lg font-bold">{note.title}</div>
                </div>
                <div className="p-4 space-y-2.5 text-xs leading-relaxed text-ink-light">
                  {note.paragraphs.map((p, i) => (
                    <p key={i}>{renderTibetanMobile(p)}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 9:
        return (
          <div className="pb-6">
            <QuizModule
              moduleId={8}
              title="Mastery Check · Classroom Commands"
              questions={commandsQuiz}
              playAudio={playAudio}
              stopAudio={stopAudio}
              playingItem={playingItem}
              playErrorBeep={playErrorBeep}
              hideHeader={true}
            />
          </div>
        );

      case 10:
        return (
          <div className="pb-6">
            <PracticeSuite
              groups={practiceGroups}
              playAudio={playAudio}
              playingItem={playingItem}
              playErrorBeep={playErrorBeep}
            />
          </div>
        );

      case 11:
        return (
          <div className="space-y-5 pb-6">
            <div className="bg-white border border-border-subtle rounded-2xl p-5 space-y-3">
              <div className="text-eyebrow">Can-Do Checklist</div>
              {CAN_DO_CHECKLIST.map((item, idx) => {
                const checked = !!checkedItems[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCheckedItems((p) => ({ ...p, [idx]: !p[idx] }))}
                    className="w-full flex items-start gap-3 text-left py-1.5"
                  >
                    <div
                      className={`mt-0.5 size-5 rounded-md border flex items-center justify-center shrink-0 ${
                        checked ? "bg-emerald-600 border-emerald-600 text-white" : "border-border-strong bg-white"
                      }`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="text-xs leading-relaxed text-ink">{renderTibetanMobile(item)}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-brand-light/50 border border-brand/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-eyebrow text-brand-dark">
                <Mic size={13} /> Say It Out Loud
              </div>
              {SPEAKING_PROMPTS.map((pr, idx) => (
                <div key={idx} className="border-l-2 border-brand pl-3 text-xs font-medium text-ink">
                  {renderTibetanMobile(pr)}
                </div>
              ))}
            </div>

            <div className="bg-[#FAF5E8] border border-amber-200/70 rounded-2xl p-4 text-center">
              <div className="font-tibetan text-xl text-ink leading-normal">ཁ་བ་ཆེན་པོའི་མེ་ཕུང་ཆུང་ངུ།</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mt-1">
                A small fire warms in great snow.
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <div className="pb-6">
            <QuizModule
              moduleId={8}
              title="Final Test"
              intro="40 questions across vocabulary, phrases, pronouns, copula, dialogues, and commands. Score 80% or higher to pass."
              questions={finalQuiz}
              playAudio={playAudio}
              stopAudio={stopAudio}
              playingItem={playingItem}
              playErrorBeep={playErrorBeep}
              isUnlockTest={true}
              nextLessonPath="/dashboard/lessons"
              onPass={() => markComplete(7)}
              hideHeader={true}
            />
          </div>
        );
    }
  };

  const stepTitles = [
    "Welcome to the Class",
    "Vocabulary",
    "Vocabulary Check",
    "Useful Phrases",
    "Phrases Check",
    "Personal Pronouns",
    "Verb 'To Be' (ཡིན་ / རེད་)",
    "Classroom Dialogues",
    "Commands & Culture",
    "Commands Check",
    "Practice & Exercises",
    "Consolidate & Review",
    "Final Test",
  ];

  const stepTibetanTitles: (string | undefined)[] = [
    undefined,
    "ཚིག་གསར།",
    "ཚིག་གསར་སྦྱོང་ཚན།",
    "བརྗོད་པ།",
    "སྦྱོང་ཚན།",
    "མིང་ཚབ།",
    "ཡིན་དང་རེད།",
    "ཁ་བརྡ།",
    "དཔྱད་གཞི།",
    "སྦྱོང་ཚན།",
    "སྦྱོང་ཚན།",
    "བསྐྱར་ཞིབ།",
    "མཐའ་མའི་རྒྱུགས་ཞིབ།",
  ];

  return (
    <>
      <MobileStepPlayer
        currentStep={currentStep}
        totalSteps={totalSteps}
        onClose={handleClose}
        onContinue={handleNext}
        onPrevious={currentStep > 0 ? handlePrevious : undefined}
        unitContext={`Beginner 2 · Unit 01 · Step ${currentStep + 1} of ${totalSteps}`}
        title={stepTitles[currentStep]}
        tibetanTitle={stepTibetanTitles[currentStep]}
        continueText={currentStep === totalSteps - 1 ? "Finish Unit" : "Continue"}
        hideContinue={currentStep === totalSteps - 1}
      >
        {renderStepContent()}
      </MobileStepPlayer>

      {selectedBreakdown && (
        <>
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[110]"
            onClick={() => {
              stopAudio();
              setSelectedBreakdown(null);
            }}
          />
          <div className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[2rem] z-[120] shadow-2xl p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-5" />
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="font-tibetan text-3xl text-ink leading-normal pb-1">{selectedBreakdown.tib}</div>
                <div className="font-serif italic text-sm text-ink-muted">{selectedBreakdown.pron}</div>
                <div className="text-sm font-bold text-ink mt-1">{selectedBreakdown.en}</div>
              </div>
              <button
                type="button"
                onClick={() => playAudio(selectedBreakdown.tib)}
                className="size-12 rounded-full bg-brand text-ink flex items-center justify-center shrink-0 shadow-sm"
              >
                {playingItem === selectedBreakdown.tib ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-border-subtle space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                Word-by-word breakdown
              </div>
              {selectedBreakdown.breakdown.map((b, i) => (
                <div key={i} className="flex items-baseline gap-2 text-xs">
                  <span className="font-tibetan text-xl text-ink">{b.tib}</span>
                  <span className="italic text-ink-muted">({b.pron})</span>
                  <span className="font-bold text-ink-light">— {b.gloss}</span>
                  {b.pos && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-brand-dark">
                      {b.pos}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                stopAudio();
                setSelectedBreakdown(null);
              }}
              className="w-full mt-5 py-3.5 text-center font-bold text-ink border border-border-strong rounded-full"
            >
              Close
            </button>
          </div>
        </>
      )}
    </>
  );
}
