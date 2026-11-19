// app/components/lesson/8/WebLesson8.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight, ChevronLeft, ChevronDown, Sparkles, Layers, CheckCircle2,
  Volume2, Loader2, ArrowRight, Eye, EyeOff, Info, MessageCircle, BookOpen, Mic, Check,
} from "lucide-react";

import { useAudio } from "@/hooks/useAudio";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import {
  VOCAB, VOCAB_CATEGORIES, USEFUL_PHRASES, PRONOUNS, DEMONSTRATIVES,
  COPULA_ROWS, COPULA_EXAMPLES, DIALOGUES, CLASSROOM_COMMANDS, CULTURE_NOTES,
  CAN_DO_CHECKLIST, SPEAKING_PROMPTS, WEB_STEPS,
  generateVocabQuiz, generatePhrasesQuiz, generatePronounsQuiz,
  generateCopulaQuiz, generateCommandsQuiz, generatePracticeDrills, generateFinalQuiz,
} from "@/app/data/lesson8";

import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { StepContainer } from "@/app/components/lesson/StepContainer";
import { VocabGrid } from "@/app/components/lesson/VocabGrid";
import PracticeSuite from "@/app/components/practice/PracticeSuite";
import QuizModule from "@/app/components/QuizModule";

function renderTibetanText(text: string) {
  const parts = text.split(/([\u0F00-\u0FFF]+)/g);
  return parts.map((part, idx) =>
    /[\u0F00-\u0FFF]/.test(part) ? (
      <span key={idx} className="font-tibetan font-normal text-xl text-ink leading-normal">{part}</span>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

export function WebLesson8() {
  const { playAudio, stopAudio, playErrorBeep, playingItem } = useAudio();
  const { completed, expandedStep, progressPercent, toggleStep, markComplete, statusOf } =
    useLessonProgress(WEB_STEPS.length);

  const [coverPhrasesEn, setCoverPhrasesEn] = useState(false);
  const [expandedPhraseId, setExpandedPhraseId] = useState<string | null>(null);
  const [showAllDialogues, setShowAllDialogues] = useState(false);
  const [bubbleReveal, setBubbleReveal] = useState<Record<string, number>>({});
  const [expandedCmdNum, setExpandedCmdNum] = useState<string | null>(null);
  const [activeDrillTab, setActiveDrillTab] = useState<"copula" | "pronouns" | "conversation">("copula");
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const vocabQuiz = useMemo(() => generateVocabQuiz(), []);
  const phrasesQuiz = useMemo(() => generatePhrasesQuiz(), []);
  const pronounsQuiz = useMemo(() => generatePronounsQuiz(), []);
  const copulaQuiz = useMemo(() => generateCopulaQuiz(), []);
  const commandsQuiz = useMemo(() => generateCommandsQuiz(), []);
  const practiceDrills = useMemo(() => generatePracticeDrills(), []);
  const finalQuiz = useMemo(() => generateFinalQuiz(), []);

  const practiceGroups = useMemo(
    () => [
      { name: "Vocabulary", items: VOCAB.map((v) => ({ id: `b2-l1-v-${v.tib}`, tibetan: v.tib, reading: v.pron, english: v.en, audioTarget: v.tib, emoji: v.emoji })) },
      { name: "Useful Phrases", items: USEFUL_PHRASES.map((p) => ({ id: `b2-l1-p-${p.id}`, tibetan: p.tib, reading: p.pron, english: p.en, audioTarget: p.tib })) },
      { name: "Class Commands", items: CLASSROOM_COMMANDS.map((c) => ({ id: `b2-l1-c-${c.num}`, tibetan: c.tib, reading: c.pron, english: c.en, audioTarget: c.tib })) },
    ],
    []
  );

  const cycleBubbleReveal = (key: string) => {
    setBubbleReveal((prev) => ({ ...prev, [key]: ((prev[key] || 0) + 1) % 3 }));
  };

  const revealThread = (threadId: string, lineCount: number) => {
    setBubbleReveal((prev) => {
      const next = { ...prev };
      for (let i = 0; i < lineCount; i++) next[`${threadId}-${i}`] = 2;
      return next;
    });
  };

  return (
    <div className="bg-paper min-h-screen text-ink pb-40 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-2 text-eyebrow">
          <Link href="/dashboard" className="hover:text-ink transition-colors">Beginner 2</Link>
          <ChevronRight className="size-3" />
          <span>Unit 01</span>
          <ChevronRight className="size-3" />
          <span className="text-ink font-bold">Welcome to the Class</span>
        </div>

        <Card className="mb-8 p-0 overflow-hidden shadow-sm border border-border-subtle">
          <div className="w-full h-72 sm:h-96 md:h-[380px] bg-surface-muted overflow-hidden relative">
            <img src="/loplao-hero-scene.jpg" alt="Welcome to the Class" className="w-full h-full object-cover object-center" />
          </div>

          <div className="p-6 md:p-10 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
            <div>
              <div className="text-eyebrow text-brand-dark mb-2">Beginner 2 · Everyday Tibetan · Unit 01</div>
              <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight tracking-tight">Welcome to the Class</h1>
              <p className="mt-2 font-tibetan text-3xl text-ink-light leading-normal pb-1">འཛིན་གྲྭར་ཕེབས་པར་དགའ་བསུ་ཞུ།</p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-light">
                Put the Tibetan script into spoken action. Learn 18 essential classroom, people, and time words, everyday greetings and goodbyes, polite vs. informal pronouns, the verb “to be” (<span className="font-tibetan text-xl text-ink">ཡིན་</span> / <span className="font-tibetan text-xl text-ink">རེད་</span>), and four real classroom dialogues.
              </p>
            </div>

            <div className="w-full md:w-72">
              <div className="mb-2 flex items-center justify-between text-eyebrow">
                <span>Step progress</span>
                <span className="text-brand-dark">{Math.min(completed.size, WEB_STEPS.length)} of {WEB_STEPS.length} sections</span>
              </div>
              <div className="h-1.5 w-full bg-border-subtle overflow-hidden rounded-full">
                <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 divide-x divide-border-subtle border border-border-subtle p-3 bg-surface-muted rounded-xl text-center">
                <div><div className="font-serif text-2xl text-ink">18</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Words</div></div>
                <div><div className="font-serif text-2xl text-ink">14</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Phrases</div></div>
                <div><div className="font-serif text-2xl text-ink">4</div><div className="text-[9px] uppercase tracking-widest text-ink-muted font-bold">Dialogues</div></div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {/* STEP 0: WELCOME */}
          <StepContainer index={0} step={WEB_STEPS[0]} status={statusOf(0)} isExpanded={expandedStep === 0} onToggle={() => toggleStep(0)} onContinue={() => markComplete(0)}>
            <div className="grid gap-8 md:grid-cols-[1.15fr,1fr] items-start">
              <div className="space-y-6">
                <p className="text-[15px] leading-relaxed text-ink-light">
                  Welcome to <strong className="text-ink">Beginner 2: Everyday Tibetan</strong>. Now that you can read Tibetan syllables, each unit brings the script into real conversation — starting with the language you will hear and speak in a Tibetan classroom.
                </p>
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5"><Sparkles size={15} /></div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">Use <strong className="text-ink">Cover translation</strong> in Vocabulary and Phrases to test your reading recall before checking the English.</p>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5"><Layers size={15} /></div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">Tap any phrase or classroom command to open its word-by-word grammatical breakdown.</p>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center shrink-0 text-brand-dark mt-0.5"><CheckCircle2 size={15} /></div>
                    <p className="text-sm leading-relaxed text-ink-light pt-1">Every section includes an interactive checkpoint, culminating in a 40-question Final Test.</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border-strong shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-5">What you&apos;ll learn in Unit 01</div>
                <div className="space-y-3">
                  {[
                    "Vocabulary · 18 classroom, people & time words",
                    "Useful phrases · Greetings, apologies & goodbyes",
                    "Grammar · Pronouns & the copula ཡིན་ / རེད་",
                    "Conversation · Four classroom dialogues",
                    "Reference · Classroom commands & Culture Corner",
                    "Practice, Review & 40-question Final Test",
                  ].map((title, idx) => (
                    <div key={title} className={`flex items-center gap-3.5 ${idx !== 0 ? "pt-3 border-t border-border-subtle" : ""}`}>
                      <span className="w-6 h-6 rounded-md bg-brand-light border border-brand/30 text-brand-dark text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                      <span className="font-serif text-[15px] font-bold text-ink leading-snug">{renderTibetanText(title)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </StepContainer>

          {/* STEP 1: VOCABULARY */}
          <StepContainer index={1} step={WEB_STEPS[1]} status={statusOf(1)} isExpanded={expandedStep === 1} onToggle={() => toggleStep(1)} onContinue={() => markComplete(1)}>
            <p className="mb-6 text-[15px] leading-relaxed text-ink-light">
              Tap any card to hear the reading. Use <strong className="text-ink">Cover translation</strong> to hide the English column and test yourself before moving on.
            </p>
            <VocabGrid
              items={VOCAB.map((v) => ({
                tib: v.tib, pron: v.pron, en: v.en, emoji: v.emoji, groupId: v.category,
                accentHex: VOCAB_CATEGORIES.find((c) => c.id === v.category)?.hex,
              }))}
              groups={VOCAB_CATEGORIES}
              playAudio={playAudio}
              playingItem={playingItem}
              enableCoverTranslation={true}
              groupBySection={true}
            />
            <div className="mt-10 border border-border-strong bg-surface-muted p-6 md:p-8 rounded-[1.5rem]">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="size-5 text-brand-dark" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">Checkpoint · Vocabulary Check (18 Words)</span>
              </div>
              <QuizModule moduleId={8} title="Mastery Check · Vocabulary" variant="panel" questions={vocabQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
            </div>
          </StepContainer>

          {/* STEP 2: USEFUL PHRASES */}
          <StepContainer index={2} step={WEB_STEPS[2]} status={statusOf(2)} isExpanded={expandedStep === 2} onToggle={() => toggleStep(2)} onContinue={() => markComplete(2)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="max-w-2xl text-[15px] leading-relaxed text-ink-light">
                Tibetan has two different goodbyes: the person leaving says <span className="font-tibetan text-xl text-ink">བཞུགས་ཨ།</span>, and the person staying says <span className="font-tibetan text-xl text-ink">ག་ལེར་ཕེབས།</span> (literally &lsquo;go slowly&rsquo;).
              </p>
              <button
                type="button"
                onClick={() => setCoverPhrasesEn(!coverPhrasesEn)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border rounded-full transition-colors shrink-0 ${coverPhrasesEn ? "bg-ink text-white border-ink" : "bg-surface text-ink border-border-strong hover:bg-surface-muted"}`}
              >
                {coverPhrasesEn ? <Eye size={14} /> : <EyeOff size={14} />}
                {coverPhrasesEn ? "Show translation" : "Cover translation"}
              </button>
            </div>

            <div className="border border-border-strong bg-surface rounded-[1.5rem] overflow-hidden divide-y divide-border-subtle shadow-sm">
              {USEFUL_PHRASES.map((p) => {
                const isOpen = expandedPhraseId === p.id;
                return (
                  <div key={p.id} className="transition-colors hover:bg-surface-muted/40">
                    <div className="p-4 sm:px-6 sm:py-4 grid grid-cols-1 md:grid-cols-[1.35fr,0.9fr,1.25fr,auto] items-center gap-3 md:gap-4">
                      <button type="button" onClick={() => setExpandedPhraseId(isOpen ? null : p.id)} className="text-left font-tibetan text-2xl sm:text-[1.65rem] text-ink leading-normal pb-1 hover:text-brand-dark transition-colors">{p.tib}</button>
                      <span className="text-xs sm:text-sm italic font-serif text-ink-muted">{p.pron}</span>
                      <div className="text-sm font-bold text-ink">
                        {coverPhrasesEn ? <span className="inline-block bg-surface-muted text-ink-muted text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border border-border-subtle select-none">Hidden</span> : p.en}
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button type="button" onClick={() => playAudio(p.tib)} className="size-9 rounded-full border border-border-strong bg-surface flex items-center justify-center text-ink-light hover:border-brand hover:text-brand-dark transition-colors">
                          {playingItem === p.tib ? <Loader2 size={15} className="animate-spin text-brand" /> : <Volume2 size={15} />}
                        </button>
                        <button type="button" onClick={() => setExpandedPhraseId(isOpen ? null : p.id)} className="size-9 rounded-full border border-border-subtle bg-surface-muted/60 flex items-center justify-center text-ink-muted hover:text-ink transition-colors">
                          <ChevronDown size={15} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 bg-surface-muted/50 border-t border-border-subtle animate-in fade-in duration-200">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2.5">Word-by-word breakdown</div>
                        <div className="flex flex-wrap gap-2.5">
                          {p.breakdown.map((part, i) => (
                            <div key={i} className="bg-surface border border-border-strong rounded-xl px-3.5 py-2 flex items-baseline gap-2 shadow-2xs">
                              <span className="font-tibetan text-xl text-ink leading-normal">{part.tib}</span>
                              <span className="font-serif italic text-xs text-ink-muted">({part.pron})</span>
                              <span className="text-xs font-bold text-ink-light">— {part.gloss}</span>
                            </div>
                          ))}
                        </div>
                        {p.contextNote && <p className="mt-3 text-xs font-medium text-brand-dark">{p.contextNote}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-ink-muted">Tap any phrase for its word-by-word breakdown</div>

            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-800 mb-3">
                <Info size={15} /> Word Note: <span className="font-tibetan text-xl normal-case leading-none">ལགས།</span> (la)
              </div>
              <div className="space-y-2.5 text-sm leading-relaxed text-ink-light">
                <p><span className="font-tibetan text-xl text-ink">ལགས་</span> (<em>la</em>) is the politeness particle you will hear constantly. It has two everyday uses:</p>
                <p><strong className="text-ink">1 —</strong> After a name, profession, or title to show respect: <span className="font-tibetan text-xl text-ink">དགེ་རྒན་ལགས།</span> (teacher), <span className="font-tibetan text-xl text-ink">བཀྲ་ཤིས་ལགས།</span></p>
                <p><strong className="text-ink">2 —</strong> In polite answers, together with the copula: <span className="font-tibetan text-xl text-ink">ལགས་ཡིན།</span> (I am), <span className="font-tibetan text-xl text-ink">ལགས་ཡོད།</span> (I do / I have), <span className="font-tibetan text-xl text-ink">ལགས་རེད།</span> (it is).</p>
                <p className="pt-1 text-xs text-ink-muted">Note: Tibetans rarely ask <span className="font-tibetan text-lg text-ink">ཁྱེད་རང་སུ་ཡིན།</span> (&lsquo;Who are you?&rsquo;) face to face — it sounds harsh. On the phone it is fine, or simply say <span className="font-tibetan text-lg text-ink">སུ་ཡིན་པས།</span></p>
              </div>
            </div>

            <div className="mt-10 border border-border-strong bg-surface-muted p-6 md:p-8 rounded-[1.5rem]">
              <div className="flex items-center gap-2 mb-6"><Sparkles className="size-5 text-brand-dark" /><span className="text-[11px] font-bold uppercase tracking-widest text-ink">Checkpoint · Phrases Check</span></div>
              <QuizModule moduleId={8} title="Mastery Check · Useful Phrases" variant="panel" questions={phrasesQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
            </div>
          </StepContainer>

          {/* STEP 3: GRAMMAR */}
          <StepContainer index={3} step={WEB_STEPS[3]} status={statusOf(3)} isExpanded={expandedStep === 3} onToggle={() => toggleStep(3)} onContinue={() => markComplete(3)}>
            <div className="border border-border-strong bg-surface rounded-[1.5rem] p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-ink mb-2">Personal pronouns</h3>
              <p className="text-sm text-ink-light leading-relaxed mb-6">
                Use this set for everyone you address or refer to, except yourself — for &lsquo;I&rsquo; and &lsquo;we,&rsquo; always use <span className="font-tibetan text-xl text-ink">ང་</span> / <span className="font-tibetan text-xl text-ink">ང་ཚོ་</span>.
              </p>

              {(["singular", "plural"] as const).map((grp) => (
                <div key={grp} className="mb-6">
                  <div className="text-eyebrow mb-3">{grp}</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    {PRONOUNS.filter((p) => p.number === grp).map((p) => (
                      <button key={p.tib} type="button" onClick={() => playAudio(p.tib)} className="relative bg-paper/60 hover:bg-brand-light/40 border border-border-strong rounded-2xl p-4 flex flex-col items-center text-center transition-all hover:-translate-y-0.5">
                        {p.honorific && <Badge variant="brand" className="absolute -top-2.5 right-3 text-[8px]">Honorific</Badge>}
                        <span className="font-tibetan text-3xl text-ink leading-normal pb-1 mt-1">{p.tib}</span>
                        <span className="font-serif italic text-xs text-ink-muted mb-1">{p.pron}</span>
                        <span className="text-xs font-bold text-ink">{p.en}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mb-6">
                <div className="text-eyebrow mb-3">Demonstratives</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEMONSTRATIVES.map((d) => (
                    <button key={d.tib} type="button" onClick={() => playAudio(d.tib)} className="flex items-center justify-between border border-border-subtle bg-surface-muted/50 hover:border-brand px-4 py-3 rounded-xl transition-colors">
                      <div className="flex items-baseline gap-3">
                        <span className="font-tibetan text-2xl text-ink leading-normal">{d.tib}</span>
                        <span className="font-serif italic text-xs text-ink-muted">{d.pron}</span>
                      </div>
                      <div className="flex items-center gap-2.5"><span className="text-sm font-bold text-ink">{d.en}</span><Volume2 size={14} className="text-ink-muted" /></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs font-medium text-ink-light mb-5">
                <div className="flex items-start gap-2"><Check size={15} className="text-emerald-600 shrink-0 mt-0.5" /><span>When you talk about yourself, <span className="font-tibetan text-lg text-ink">ང་</span> and <span className="font-tibetan text-lg text-ink">ང་ཚོ་</span> are normal even in polite speech.</span></div>
                <div className="flex items-start gap-2"><Check size={15} className="text-emerald-600 shrink-0 mt-0.5" /><span>Honorific <span className="font-tibetan text-lg text-ink">ཁོང་</span> / <span className="font-tibetan text-lg text-ink">ཁོང་ཚོ་</span> is used for teachers, elders, monastics, and guests.</span></div>
              </div>

              <div className="bg-brand-light/60 border border-brand/30 rounded-xl px-4 py-3 text-xs font-bold text-ink">
                Rule of thumb for a beginner: <span className="font-tibetan text-lg font-normal">ང་</span> for me, <span className="font-tibetan text-lg font-normal">ཁྱེད་རང་</span> for you, <span className="font-tibetan text-lg font-normal">ཁོང་</span> for anyone you respect.
              </div>

              <div className="mt-8 border-t border-border-subtle pt-6">
                <div className="flex items-center gap-2 mb-5"><Sparkles className="size-4 text-brand-dark" /><span className="text-[11px] font-bold uppercase tracking-widest text-ink">Checkpoint · Personal Pronouns</span></div>
                <QuizModule moduleId={8} title="Mastery Check · Personal Pronouns" variant="panel" questions={pronounsQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
              </div>
            </div>

            <div className="mt-8 border border-border-strong bg-surface rounded-[1.5rem] p-6 md:p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-ink mb-2 flex items-baseline gap-2">
                <span>To be —</span>
                <span className="font-tibetan font-normal text-3xl text-brand-dark">ཡིན། / རེད།</span>
              </h3>
              <p className="text-sm text-ink-light leading-relaxed mb-5">One rule decides the copula, then you only swap it to make the sentence negative.</p>

              <div className="bg-brand-light/50 border border-brand/40 rounded-2xl p-4 mb-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-1">The Rule</div>
                <p className="text-sm font-bold text-ink">
                  First person (<span className="font-tibetan text-xl font-normal">ང་ / ང་ཚོ་</span>): <span className="font-tibetan text-xl font-normal text-brand-dark">ཡིན། / མིན།</span> · Everyone else: <span className="font-tibetan text-xl font-normal text-ink-light">རེད། / མ་རེད།</span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div className="border border-amber-200 bg-brand-light/20 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 bg-brand-light/60 border-b border-amber-200 text-[10px] font-bold uppercase tracking-widest text-brand-dark">+ Affirmative</div>
                  <div className="divide-y divide-border-subtle">
                    {COPULA_ROWS.map((r) => (
                      <div key={`aff-${r.subjectTib}`} className="px-5 py-3.5 flex items-center justify-between">
                        <div><div className="font-tibetan text-2xl text-ink leading-normal">{r.subjectTib}</div><div className="text-[11px] text-ink-muted">{r.subjectEn}</div></div>
                        <ArrowRight size={14} className="text-ink-muted" />
                        <button type="button" onClick={() => playAudio(r.affirmativeTib)} className="text-right group">
                          <div className="font-tibetan text-2xl text-brand-dark leading-normal group-hover:underline">{r.affirmativeTib}</div>
                          <div className="text-[11px] font-serif italic text-ink-muted">{r.affirmativePron}</div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-rose-200 bg-rose-50/30 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 bg-rose-50 border-b border-rose-200 text-[10px] font-bold uppercase tracking-widest text-rose-700">− Negative</div>
                  <div className="divide-y divide-border-subtle">
                    {COPULA_ROWS.map((r) => (
                      <div key={`neg-${r.subjectTib}`} className="px-5 py-3.5 flex items-center justify-between">
                        <div><div className="font-tibetan text-2xl text-ink leading-normal">{r.subjectTib}</div><div className="text-[11px] text-ink-muted">{r.subjectEn}</div></div>
                        <ArrowRight size={14} className="text-ink-muted" />
                        <button type="button" onClick={() => playAudio(r.negativeTib)} className="text-right group">
                          <div className="font-tibetan text-2xl text-rose-700 leading-normal group-hover:underline">{r.negativeTib}</div>
                          <div className="text-[11px] font-serif italic text-ink-muted">{r.negativePron}</div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5 mb-5">
                {COPULA_EXAMPLES.map((ex) => (
                  <button key={ex.tib} type="button" onClick={() => playAudio(ex.tib)} className="border border-border-strong bg-paper/50 hover:border-brand p-4 rounded-xl text-left flex items-center justify-between gap-3 transition-colors">
                    <div>
                      <div className="font-tibetan text-2xl text-ink leading-normal pb-0.5">{ex.tib}</div>
                      <div className="text-xs font-serif italic text-ink-muted mb-0.5">{ex.pron}</div>
                      <div className="text-xs font-bold text-ink-light">{ex.en}</div>
                    </div>
                    <Volume2 size={16} className="text-ink-muted shrink-0" />
                  </button>
                ))}
              </div>

              <div className="bg-surface-muted border border-border-subtle rounded-xl px-4 py-3 text-xs font-bold text-ink-light">
                Word order: The copula always comes last. <strong className="text-ink">Subject → Complement → </strong><span className="font-tibetan text-lg font-normal text-ink">ཡིན་ / རེད་</span>.
              </div>

              <div className="mt-8 border-t border-border-subtle pt-6">
                <div className="flex items-center gap-2 mb-5"><Sparkles className="size-4 text-brand-dark" /><span className="text-[11px] font-bold uppercase tracking-widest text-ink">Checkpoint · To Be (ཡིན་ / རེད་)</span></div>
                <QuizModule moduleId={8} title="Mastery Check · Verb To Be" variant="panel" questions={copulaQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
              </div>
            </div>
          </StepContainer>

          {/* STEP 4: CONVERSATION */}
          <StepContainer index={4} step={WEB_STEPS[4]} status={statusOf(4)} isExpanded={expandedStep === 4} onToggle={() => toggleStep(4)} onContinue={() => markComplete(4)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="max-w-2xl text-sm leading-relaxed text-ink-light">
                You&apos;ve learned every word and grammar pattern in this dialogue — see how much you can read first! <strong className="text-ink">Tap a bubble once</strong> for romanisation, and <strong className="text-ink">again</strong> for the English.
              </p>
              <button
                type="button"
                onClick={() => setShowAllDialogues(!showAllDialogues)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border rounded-full transition-colors shrink-0 ${showAllDialogues ? "bg-ink text-white border-ink" : "bg-surface text-ink border-border-strong hover:bg-surface-muted"}`}
              >
                {showAllDialogues ? <EyeOff size={14} /> : <Eye size={14} />}
                {showAllDialogues ? "Hide translations" : "Show translations"}
              </button>
            </div>

            <div className="space-y-6">
              {DIALOGUES.map((thread) => (
                <Card key={thread.id} className="p-6 bg-surface border-border-strong">
                  <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-brand-light border border-brand/30 flex items-center justify-center text-brand-dark"><MessageCircle size={16} /></div>
                      <div><h4 className="font-serif text-lg font-bold text-ink">{thread.title}</h4><p className="text-xs text-ink-muted">{thread.subtitle}</p></div>
                    </div>
                    <button type="button" onClick={() => revealThread(thread.id, thread.lines.length)} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-border-strong text-ink-light hover:bg-surface-muted transition-colors">Reveal all</button>
                  </div>

                  <div className="space-y-4">
                    {thread.lines.map((line, idx) => {
                      const key = `${thread.id}-${idx}`;
                      const level = showAllDialogues ? 2 : bubbleReveal[key] || 0;
                      const isRight = line.side === "right";
                      return (
                        <div key={key} className={`flex items-end gap-3 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
                          <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isRight ? "bg-brand-light text-brand-dark border border-brand/40" : "bg-surface-muted text-ink border border-border-strong"}`}>{line.speakerInitial}</div>
                          <div className={`max-w-lg flex flex-col ${isRight ? "items-end" : "items-start"}`}>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-ink-muted mb-1 px-1">{line.speaker}</span>
                            <div className="flex items-center gap-2">
                              {isRight && (
                                <button type="button" onClick={() => playAudio(line.tib)} className="size-8 rounded-full border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark">
                                  {playingItem === line.tib ? <Loader2 size={13} className="animate-spin text-brand" /> : <Volume2 size={13} />}
                                </button>
                              )}
                              <button type="button" onClick={() => cycleBubbleReveal(key)} className={`text-left rounded-2xl px-5 py-3.5 border transition-all ${isRight ? "bg-brand-light/40 border-brand/30 hover:border-brand" : "bg-paper border-border-strong hover:border-ink-muted"}`}>
                                <div className="font-tibetan text-2xl text-ink leading-normal pb-1">{line.tib}</div>
                                {level >= 1 && <div className="text-xs font-serif italic text-ink-muted mt-0.5">{line.pron}</div>}
                                {level >= 2 && <div className="text-xs font-bold text-ink mt-1 pt-1 border-t border-border-subtle">{line.en}</div>}
                                {level === 0 && <div className="text-[9px] font-bold uppercase tracking-widest text-ink-muted mt-1">Tap to reveal</div>}
                              </button>
                              {!isRight && (
                                <button type="button" onClick={() => playAudio(line.tib)} className="size-8 rounded-full border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-brand-dark">
                                  {playingItem === line.tib ? <Loader2 size={13} className="animate-spin text-brand" /> : <Volume2 size={13} />}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </StepContainer>

          {/* STEP 5: REFERENCE & CULTURE CORNER */}
          <StepContainer index={5} step={WEB_STEPS[5]} status={statusOf(5)} isExpanded={expandedStep === 5} onToggle={() => toggleStep(5)} onContinue={() => markComplete(5)}>
            <p className="mb-6 text-[15px] leading-relaxed text-ink-light">These are the instructions your teacher will use every day. Tap any card for its word-by-word breakdown, then read the Culture Corner below.</p>
            <div className="flex items-center gap-2 mb-4"><BookOpen size={16} className="text-brand-dark" /><span className="font-serif text-xl font-bold text-ink">Classroom Commands</span></div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {CLASSROOM_COMMANDS.map((cmd) => {
                const isOpen = expandedCmdNum === cmd.num;
                return (
                  <div key={cmd.num} className="border border-border-strong bg-surface rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">{cmd.num}</span>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => playAudio(cmd.tib)} className="size-8 rounded-full border border-border-subtle bg-surface-muted flex items-center justify-center text-ink-light hover:text-brand-dark">
                            {playingItem === cmd.tib ? <Loader2 size={13} className="animate-spin text-brand" /> : <Volume2 size={13} />}
                          </button>
                          <button type="button" onClick={() => setExpandedCmdNum(isOpen ? null : cmd.num)} className="size-8 rounded-full border border-border-subtle bg-surface flex items-center justify-center text-ink-muted hover:text-ink">
                            <ChevronDown size={13} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      </div>
                      <div className="font-tibetan text-3xl text-ink leading-normal pb-1">{cmd.tib}</div>
                      <div className="inline-block bg-brand-light/70 text-brand-dark font-serif italic text-xs px-2 py-0.5 rounded-md mb-2">{cmd.pron}</div>
                      <div className="text-sm font-bold text-ink">{cmd.en}</div>
                    </div>
                    {isOpen && (
                      <div className="mt-4 pt-3 border-t border-border-subtle space-y-1.5">
                        {cmd.breakdown.map((b, i) => (
                          <div key={i} className="text-xs text-ink-light flex items-baseline gap-1.5">
                            <span className="font-tibetan text-lg text-ink">{b.tib}</span>
                            <span className="italic text-ink-muted">({b.pron})</span>
                            <span>— {b.gloss}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mb-12 border border-border-strong bg-surface-muted p-6 md:p-8 rounded-[1.5rem]">
              <div className="flex items-center gap-2 mb-5"><Sparkles className="size-4 text-brand-dark" /><span className="text-[11px] font-bold uppercase tracking-widest text-ink">Checkpoint · Classroom Commands Check</span></div>
              <QuizModule moduleId={8} title="Mastery Check · Classroom Commands" variant="panel" questions={commandsQuiz} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
            </div>

            <div className="flex items-center gap-2 mb-5"><Sparkles size={16} className="text-emerald-700" /><span className="font-serif text-xl font-bold text-ink">Culture Corner</span></div>
            <div className="grid md:grid-cols-2 gap-6">
              {CULTURE_NOTES.map((note) => (
                <Card key={note.id} className="p-0 overflow-hidden bg-surface border-border-strong">
                  <div className="relative h-44 w-full overflow-hidden bg-ink">
                    <img src={note.fallbackImage} alt={note.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-5 flex flex-col justify-end">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand mb-1">{note.badge}</span>
                      <h4 className="font-serif text-xl text-white font-bold">{renderTibetanText(note.title)}</h4>
                    </div>
                  </div>
                  <div className="p-6 space-y-3 text-sm leading-relaxed text-ink-light">
                    {note.paragraphs.map((para, i) => <p key={i}>{renderTibetanText(para)}</p>)}
                  </div>
                </Card>
              ))}
            </div>
          </StepContainer>

          {/* STEP 6: PRACTICE */}
          <StepContainer index={6} step={WEB_STEPS[6]} status={statusOf(6)} isExpanded={expandedStep === 6} onToggle={() => toggleStep(6)} onContinue={() => markComplete(6)}>
            <div className="mb-10 border border-border-strong bg-surface rounded-[1.5rem] p-6 md:p-8 shadow-sm">
              <div className="text-eyebrow text-brand-dark mb-2">Targeted Grammar & Usage Drills</div>
              <h3 className="font-serif text-2xl font-bold text-ink mb-5">Lock in the copula, pronouns, and classroom replies</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: "copula", label: "1 · Copula Drills" },
                  { id: "pronouns", label: "2 · Pronouns & Register" },
                  { id: "conversation", label: "3 · Conversation Replies" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveDrillTab(t.id as any)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${activeDrillTab === t.id ? "bg-ink text-white border-ink" : "bg-surface-muted text-ink-light border-border-strong hover:text-ink"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <QuizModule key={`drill-${activeDrillTab}`} moduleId={8} title={`Practice Drill · ${activeDrillTab}`} variant="panel" questions={practiceDrills[activeDrillTab]} playAudio={playAudio} stopAudio={stopAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
            </div>

            <PracticeSuite groups={practiceGroups} playAudio={playAudio} playingItem={playingItem} playErrorBeep={playErrorBeep} />
          </StepContainer>

          {/* STEP 7: REVIEW */}
          <StepContainer index={7} step={WEB_STEPS[7]} status={statusOf(7)} isExpanded={expandedStep === 7} onToggle={() => toggleStep(7)} onContinue={() => markComplete(7)}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border-strong rounded-2xl p-6">
                <div className="text-eyebrow mb-4">Can-Do Checklist</div>
                <div className="space-y-3">
                  {CAN_DO_CHECKLIST.map((item, idx) => {
                    const checked = !!checkedItems[idx];
                    return (
                      <button key={idx} type="button" onClick={() => setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }))} className="w-full flex items-start gap-3 text-left p-2.5 rounded-xl hover:bg-surface-muted/60 transition-colors">
                        <div className={`mt-0.5 size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-emerald-600 border-emerald-600 text-white" : "border-border-strong bg-white"}`}>{checked && <Check size={13} strokeWidth={3} />}</div>
                        <span className={`text-sm leading-relaxed ${checked ? "text-ink font-semibold" : "text-ink-light"}`}>{renderTibetanText(item)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-brand-light/40 border border-brand/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-eyebrow text-brand-dark mb-4"><Mic size={14} /> Say It Out Loud</div>
                <div className="space-y-4">
                  {SPEAKING_PROMPTS.map((prompt, idx) => (
                    <div key={idx} className="border-l-2 border-brand pl-4 py-1 text-sm leading-relaxed text-ink font-medium">{renderTibetanText(prompt)}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-surface-muted/70 border border-border-subtle rounded-2xl p-5 text-center">
              <span className="font-tibetan text-2xl text-ink mr-3">ལམ་རིང་པོའི་གོམ་པས་བརྩི་དགོས།</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">A long road is counted in steps.</span>
            </div>
          </StepContainer>

          {/* STEP 8: FINAL TEST */}
          <StepContainer index={8} step={WEB_STEPS[8]} status={statusOf(8)} isExpanded={expandedStep === 8} onToggle={() => toggleStep(8)} onContinue={() => markComplete(8)} isLast>
            <QuizModule
              moduleId={8}
              title="Final Test"
              intro="40 questions drawn from vocabulary, romanisation, phrases, conversation, grammar, and classroom commands. Score 80% or higher to pass."
              questions={finalQuiz}
              playAudio={playAudio}
              stopAudio={stopAudio}
              playingItem={playingItem}
              playErrorBeep={playErrorBeep}
              isUnlockTest={true}
              nextLessonPath="/dashboard"
              onPass={() => markComplete(8)}
            />
          </StepContainer>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-paper border-t border-border-subtle p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors"><ChevronLeft size={16} /> Beginner 2 Hub</Link>
          {expandedStep !== WEB_STEPS.length - 1 && (
            <Button className="flex-1 sm:flex-none" onClick={() => markComplete(expandedStep)}><CheckCircle2 size={18} /> Mark step complete</Button>
          )}
          <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-bold text-ink hover:text-brand-dark transition-colors">Back to Syllabus <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
