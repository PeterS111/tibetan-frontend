// app/components/dashboard/WebDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Lock, CheckCircle2, Play, Check, Clock, Trophy, Award, Target } from "lucide-react";
import { Badge } from "@/app/components/ui/Badge";
import { useDevBypass } from "@/hooks/useDevBypass";
import {
  BEGINNER_2_UPCOMING,
  isBeginner1Module,
  isBeginner2Module,
  getDisplayUnitNumber,
} from "@/app/data/syllabus";

interface CourseLevelCard {
  id: number;
  partLabel: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: [string, string, string, string];
  symbol: string;
  status: "active" | "coming_soon" | "locked";
}

interface CourseGroup {
  courseNumber: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  levels: CourseLevelCard[];
}

const COURSE_PROGRESSION: CourseGroup[] = [
  {
    courseNumber: 1,
    eyebrow: "COURSE 1",
    title: "Beginner Course",
    subtitle: "Script, sounds, and daily conversation.",
    levels: [
      {
        id: 1,
        partLabel: "PART 1",
        title: "Beginner 1",
        subtitle: "Foundations of the script",
        description: "The Tibetan script from the ground up: 30 consonants, four vowels, stacks, prefixes and suffixes.",
        bullets: ["30 consonants", "4 vowels", "Prefixes & suffixes", "Read simple syllables"],
        symbol: "/motif_butter_lamp.png",
        status: "active",
      },
      {
        id: 2,
        partLabel: "PART 2",
        title: "Beginner 2",
        subtitle: "Everyday Tibetan",
        description: "Put the script to work: classroom language, numbers & time, greetings, self-introduction, shopping, and daily life.",
        bullets: ["Classroom & greetings", "Numbers, time & days", "Family & home", "Shopping basics"],
        symbol: "/motif_prayer_wheel.png",
        status: "active",
      },
    ],
  },
  {
    courseNumber: 2,
    eyebrow: "COURSE 2",
    title: "Intermediate Course",
    subtitle: "Register, tenses, and reading longer texts.",
    levels: [
      {
        id: 3,
        partLabel: "PART 1",
        title: "Pre-Intermediate",
        subtitle: "Daily narratives",
        description: "Build conversational fluency. Past and future tenses through traditional storytelling.",
        bullets: ["Past tense", "Future tense", "500 words", "Short dialogues"],
        symbol: "/motif_wind_horse.png",
        status: "locked",
      },
      {
        id: 4,
        partLabel: "PART 2",
        title: "Intermediate",
        subtitle: "Discourse & nuance",
        description: "Honorifics, register, and reading short prose from contemporary Tibetan writers.",
        bullets: ["Honorific register", "Conditionals", "1,200 words", "Short news articles"],
        symbol: "/motif_stupa.png",
        status: "locked",
      },
    ],
  },
  {
    courseNumber: 3,
    eyebrow: "COURSE 3",
    title: "Advanced Course",
    subtitle: "Classical grammar and the scholar's path.",
    levels: [
      {
        id: 5,
        partLabel: "PART 1",
        title: "Upper-Intermediate",
        subtitle: "Literary register",
        description: "Classical grammar fundamentals; navigating philosophical and journalistic texts.",
        bullets: ["Classical particles", "Literary verbs", "2,500 words", "Philosophical excerpts"],
        symbol: "/motif_snow_lion.png",
        status: "locked",
      },
      {
        id: 6,
        partLabel: "PART 2",
        title: "Advanced",
        subtitle: "Scholar's path",
        description: "Independent reading of canonical texts, poetry, and fluent discourse on abstract subjects.",
        bullets: ["Independent reading", "Formal debate", "5,000+ words", "Canonical texts"],
        symbol: "/symbol_pecha_gold.png",
        status: "locked",
      },
    ],
  },
];

export function WebDashboard({ modules, nextModule, wordsKnown, isBrandNew }: any) {
  const { isDevUnlocked } = useDevBypass();
  const [activeView, setActiveView] = useState<"progression" | "beginner1_hub" | "beginner2_hub">("progression");

  // Support direct return links such as /dashboard?hub=beginner2 without SSR/Suspense constraints
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hub = params.get("hub");
    if (hub === "beginner2") setActiveView("beginner2_hub");
    else if (hub === "beginner1") setActiveView("beginner1_hub");
  }, []);

  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));
  const b1Modules = visibleModules.filter((m) => isBeginner1Module(m.module_id));
  const b2Modules = visibleModules.filter((m) => isBeginner2Module(m.module_id));

  const allBeginner1Completed = b1Modules.length > 0 && b1Modules.every((m) => m.status === "completed");
  const isB2Unlocked = isDevUnlocked || allBeginner1Completed || b2Modules.some((m) => m.status !== "locked");

  const b1NextModule = b1Modules.find((m) => m.status !== "completed") || b1Modules[0] || nextModule;
  const b2PassedCount = b2Modules.filter((m) => m.status === "completed").length;
  const b2TotalSteps = 10;
  const b2Percent = Math.round((b2PassedCount / b2TotalSteps) * 100);

  const upcomingRegular = BEGINNER_2_UPCOMING.filter((u) => !u.isCapstone);
  const upcomingCapstone = BEGINNER_2_UPCOMING.find((u) => u.isCapstone);

  const handleOpenHub = (levelId: number) => {
    setActiveView(levelId === 2 ? "beginner2_hub" : "beginner1_hub");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToProgression = () => {
    setActiveView("progression");
    if (typeof window !== "undefined") {
      if (window.location.search) {
        window.history.replaceState({}, "", "/dashboard");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={`${activeView === "beginner2_hub" ? "max-w-5xl" : "max-w-4xl"} mx-auto animate-in fade-in duration-500 pb-24`}>
      {activeView !== "beginner2_hub" && (
        <>
          <div className="flex flex-col items-center justify-center text-center mb-10 pt-4">
            <div className="font-tibetan text-4xl text-brand-dark mb-3 opacity-90">བཀྲ་ཤིས་བདེ་ལེགས།</div>
            <h1 className="text-3xl font-serif font-normal text-ink">
              Tashi Delek, welcome {isBrandNew ? "to Loplao" : "back"}
            </h1>
          </div>

          <div className="border-y border-border-subtle py-8 mb-12 flex justify-center">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="text-4xl md:text-5xl font-serif font-normal text-ink mb-2">{wordsKnown}</div>
              <div className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em]">Words Known</div>
            </div>
          </div>
        </>
      )}

      {/* VIEW A: PROGRESSION TIMELINE */}
      {activeView === "progression" && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-ink text-white rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden shadow-lg">
            <img src="/motif_mandala_gold.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 -top-10 w-64 h-64 md:w-80 md:h-80 object-contain opacity-10" />
            <div className="relative z-10 max-w-xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3">The Progression</div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl md:text-[42px] leading-[1.15] text-white mb-4">
                From your first syllable to reading the canon.
              </h2>
              <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed">
                Three courses, each with focused levels. Finish one level to unlock the next; finish a whole course to earn its Certificate of Completion.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            {COURSE_PROGRESSION.map((course) => (
              <div key={course.courseNumber}>
                <div className="mb-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1">{course.eyebrow}</div>
                  <h3 className="font-serif font-normal text-2xl sm:text-3xl text-ink mb-1">{course.title}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted">{course.subtitle}</p>
                </div>

                <div className="relative pl-6 sm:pl-10 space-y-6 before:content-[''] before:absolute before:left-[15px] sm:before:left-[19px] before:top-4 before:bottom-4 before:w-[1px] before:border-l before:border-dashed before:border-border-strong">
                  {course.levels.map((level) => {
                    const isB2Card = level.id === 2;
                    const canEnterHub = level.id === 1 || (isB2Card && isB2Unlocked);
                    const isCardCompleted = level.id === 1 && allBeginner1Completed;

                    return (
                      <div key={level.id} className="relative">
                        <div
                          className={`absolute -left-6 sm:-left-10 top-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-xs ${
                            canEnterHub
                              ? isCardCompleted
                                ? "bg-emerald-600 text-white"
                                : "bg-brand text-ink"
                              : "bg-surface border border-border-strong text-ink-muted"
                          }`}
                        >
                          {canEnterHub ? (isCardCompleted ? <Check size={16} strokeWidth={2.5} /> : level.id) : <Lock size={14} />}
                        </div>

                        <div
                          onClick={canEnterHub ? () => handleOpenHub(level.id) : undefined}
                          className={`bg-surface rounded-3xl p-6 sm:p-8 border transition-all ${
                            canEnterHub
                              ? "border-border-subtle hover:border-brand shadow-sm hover:shadow-md cursor-pointer"
                              : "border-border-subtle/70 opacity-85"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-paper border border-border-subtle flex items-center justify-center shrink-0">
                                <img src={level.symbol} alt={level.title} className="w-9 h-9 object-contain" />
                              </div>
                              <div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-0.5">{level.partLabel}</div>
                                <h4 className={`font-serif font-normal text-2xl leading-snug ${canEnterHub ? "text-ink" : "text-ink-light"}`}>{level.title}</h4>
                                <div className="text-xs text-ink-muted">{level.subtitle}</div>
                              </div>
                            </div>

                            <div className="self-start">
                              {level.id === 1 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-ink text-white">
                                  {allBeginner1Completed ? "Completed" : isBrandNew ? "Start Here" : "In Progress"}
                                </span>
                              )}
                              {level.id === 2 && (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${canEnterHub ? "bg-ink text-white" : "bg-surface-muted text-ink-muted border border-border-subtle"}`}>
                                  {canEnterHub ? (b2Modules.some((m) => m.progress > 0) ? "In Progress" : "Unlocked") : "Finish Beginner 1"}
                                </span>
                              )}
                              {level.id > 2 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-surface-muted text-ink-muted border border-border-subtle">
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-ink-light leading-relaxed mb-5">{level.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-8 mb-2">
                            {level.bullets.map((bullet) => (
                              <div key={bullet} className="flex items-center gap-2.5 text-xs text-ink-light">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                                <span>{bullet}</span>
                              </div>
                            ))}
                          </div>

                          {canEnterHub && (
                            <div className="mt-6 pt-2">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleOpenHub(level.id); }}
                                className="bg-brand hover:bg-brand-dark text-ink font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
                              >
                                Enter {level.title} hub <ArrowRight size={15} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW B: BEGINNER 1 HUB (Unchanged) */}
      {activeView === "beginner1_hub" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8">
            <button type="button" onClick={handleBackToProgression} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-light hover:text-ink transition-colors cursor-pointer">
              <ArrowLeft size={15} /> Back to All Courses
            </button>
          </div>

          <div className="bg-ink text-white p-8 md:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-14 rounded-2xl">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-brand" /> {isBrandNew ? "Start your journey" : "Resume Beginner 1"}
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-normal mb-2">{b1NextModule.title}</h3>
              <p className="text-sm text-slate-300 max-w-md opacity-90">{b1NextModule.description}</p>
            </div>
            <Link href={`/dashboard/lessons/${b1NextModule.module_id || 1}`} className="w-full md:w-auto shrink-0">
              <button className="w-full bg-brand hover:bg-brand-dark text-ink font-bold text-sm px-8 py-4 rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                {isBrandNew ? "Start Learning" : "Continue Learning"} <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-surface border border-border-subtle flex items-center justify-center shrink-0 shadow-xs">
              <img src="/motif_butter_lamp.png" alt="Beginner 1" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-1">Course 1 · Part 1</div>
              <h2 className="text-3xl font-serif font-normal text-ink">Beginner 1 · Foundations of the script</h2>
            </div>
          </div>

          <div className="space-y-4">
            {b1Modules.map((module) => {
              const lessonUrl = `/dashboard/lessons/${Number(module.module_id)}`;
              const isLocked = module.status === "locked" && !isDevUnlocked;
              const isCompleted = module.status === "completed";

              return (
                <div key={module.id || module.module_id} className={`flex flex-col md:flex-row bg-surface border rounded-2xl p-6 gap-5 ${isCompleted ? "border-border-subtle" : isLocked ? "border-transparent bg-surface-muted/50 opacity-60" : "border-brand/40 shadow-sm"}`}>
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-serif text-xl border border-border-strong rounded-full bg-white text-ink">{module.module_id}</div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-serif font-normal text-ink">{module.title}</h3>
                      {isCompleted && <Badge variant="success">Completed</Badge>}
                    </div>
                    <p className="text-sm text-ink-light">{module.description}</p>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0 md:pl-4">
                    {isLocked ? (
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-ink-muted"><Lock size={14} /> Locked</div>
                    ) : (
                      <Link href={lessonUrl} className="w-full md:w-auto">
                        <button className={`w-full flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-full transition-colors uppercase tracking-wider border cursor-pointer ${isCompleted ? "bg-transparent text-ink border-border-strong hover:bg-surface-muted" : "bg-ink text-white border-ink hover:bg-ink-light shadow-sm"}`}>
                          {isCompleted ? <><CheckCircle2 size={14} /> Review</> : <><Play size={14} /> Continue</>}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW C: BEGINNER 2 HUB (Lovable Everyday Tibetan Redesign) */}
      {activeView === "beginner2_hub" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-6">
            <button
              type="button"
              onClick={handleBackToProgression}
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to All Courses
            </button>
          </div>

          {/* Hub Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-1.5">
                Beginner 2 · A1+ · Practical Topics
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-ink">Everyday Tibetan</h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-ink-light font-medium pb-1">
              <Trophy size={14} className="text-brand-dark" />
              <span>{b2PassedCount} / {b2TotalSteps} steps passed · {b2Percent}%</span>
            </div>
          </div>

          <div className="h-1 w-full max-w-md bg-border-subtle/70 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-brand transition-all duration-500" style={{ width: `${Math.max(b2Percent, 2)}%` }} />
          </div>

          {/* Unit Cards List */}
          <div className="space-y-3.5">
            {b2Modules.map((module) => {
              const lessonUrl = `/dashboard/lessons/${Number(module.module_id)}`;
              const isLocked = module.status === "locked" && !isDevUnlocked;
              const isCompleted = module.status === "completed";
              const unitLabel = getDisplayUnitNumber(module.module_id);
              const isCurrent = !isLocked && !isCompleted;

              return (
                <div
                  key={module.id || module.module_id}
                  className={`flex flex-col md:flex-row md:items-center justify-between bg-surface border rounded-xl px-6 py-5 gap-5 transition-all ${
                    isCurrent
                      ? "border-amber-300 shadow-xs"
                      : isCompleted
                      ? "border-border-subtle"
                      : "border-border-subtle/70 bg-surface-muted/40 opacity-75"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-5">
                    <div
                      className={`size-11 shrink-0 rounded-lg flex items-center justify-center font-serif text-base font-medium border ${
                        isCurrent
                          ? "bg-brand-light/70 border-amber-300 text-brand-dark"
                          : isCompleted
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-surface-muted border-border-subtle text-ink-muted"
                      }`}
                    >
                      {isCompleted ? <Check size={17} strokeWidth={2.5} /> : unitLabel}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-serif text-lg font-normal text-ink">{module.title}</h3>
                        {isCompleted && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded bg-brand-light text-brand-dark border border-amber-200">
                            In Progress
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded bg-surface-muted text-ink-muted border border-border-subtle">
                            Locked
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-[13px] text-ink-light mb-2">
                        <Target size={13} className="text-brand-dark shrink-0" />
                        <span>{module.description}</span>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                        <span className="inline-flex items-center gap-1"><Clock size={11} /> {module.time_est || "1h"}</span>
                        <span>1 Assessment</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center md:pl-4 shrink-0">
                    {isLocked ? (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ink-muted px-4 py-2">
                        <Lock size={13} /> Locked
                      </div>
                    ) : (
                      <Link href={lessonUrl} className="w-full md:w-auto">
                        <button
                          type="button"
                          className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            isCurrent
                              ? "bg-brand hover:bg-brand-dark text-ink shadow-xs"
                              : "bg-brand-light/40 hover:bg-brand-light text-ink border border-amber-200"
                          }`}
                        >
                          {isCompleted ? <><CheckCircle2 size={13} /> Review step</> : <><Play size={13} /> Continue</>}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            {upcomingRegular.map((upcoming) => (
              <div
                key={upcoming.unitNumber}
                className="flex flex-col md:flex-row md:items-center justify-between bg-surface/85 border border-border-subtle rounded-xl px-6 py-5 gap-5"
              >
                <div className="flex items-start sm:items-center gap-5">
                  <div className="size-11 shrink-0 rounded-lg flex items-center justify-center font-serif text-base bg-surface-muted border border-border-subtle text-ink-muted">
                    {upcoming.unitNumber}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-normal text-ink">{upcoming.title}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded bg-surface-muted text-ink-muted border border-border-subtle">
                        Coming Soon
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-[13px] text-ink-light mb-2">
                      <Target size={13} className="text-brand-dark/70 shrink-0" />
                      <span>{upcoming.description}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                      <span className="inline-flex items-center gap-1"><Clock size={11} /> {upcoming.time_est}</span>
                      <span>1 Assessment</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center md:pl-4 shrink-0">
                  <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-ink-muted bg-paper border border-border-subtle select-none">
                    <Clock size={12} /> Coming Soon
                  </span>
                </div>
              </div>
            ))}

            {upcomingCapstone && (
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#FFFDF8] border border-amber-300/80 rounded-xl px-6 py-5 gap-5 mt-4">
                <div className="flex items-start sm:items-center gap-5">
                  <div className="size-11 shrink-0 rounded-lg flex items-center justify-center bg-amber-100/70 border border-amber-300/70 text-amber-900">
                    <Award size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-normal text-ink">{upcomingCapstone.title}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded bg-amber-100/70 text-amber-900 border border-amber-200">
                        Capstone
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-[13px] text-ink-light mb-2">
                      <Target size={13} className="text-brand-dark shrink-0" />
                      <span>{upcomingCapstone.description}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                      <span className="inline-flex items-center gap-1"><Clock size={11} /> {upcomingCapstone.time_est}</span>
                      <span>1 Assessment</span>
                      <span>Recommended after steps 1–10</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center md:pl-4 shrink-0">
                  <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-amber-900/70 bg-amber-100/60 border border-amber-300/60 select-none">
                    <Lock size={12} /> Coming Soon
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
