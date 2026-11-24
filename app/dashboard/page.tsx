// app/dashboard/page.tsx
"use client";

import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

import { WebDashboard } from "../components/dashboard/WebDashboard";
import { MobileHome } from "../components/dashboard/MobileHome";
import { FALLBACK_MODULES, mergeWithFallbackModules } from "@/app/data/syllabus";
import { syncLearnedWordsIfNeeded } from "@/app/data/vocabCatalog";

export default function UnifiedDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();

  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [wordsKnown, setWordsKnown] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setModules(FALLBACK_MODULES);
        setLoading(false);
      }
    }, 5000);

    const fetchData = async () => {
      if (!isLoaded) return;
      if (isLoaded && !user) {
        if (isMounted) {
          setModules(FALLBACK_MODULES);
          setLoading(false);
        }
        clearTimeout(safetyTimer);
        return;
      }
      if (isLoaded && user) {
        try {
          const token = await Promise.race([
            getToken(),
            new Promise<null>((_, reject) =>
              setTimeout(() => reject(new Error("Token timeout")), 4500)
            ),
          ]);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          if (isMounted) {
            const loadedModules =
              data.modules && Array.isArray(data.modules) && data.modules.length > 0
                ? mergeWithFallbackModules(data.modules)
                : FALLBACK_MODULES;

            if (data.profile) setProfile(data.profile);
            setModules(loadedModules);

            const initialWords = Number(data?.profile?.words_known) || 0;
            setWordsKnown(initialWords);

            syncLearnedWordsIfNeeded({
              userId: user.id,
              modules: loadedModules,
              learnedWordModules: data?.learned_word_modules,
              currentWordsKnown: initialWords,
              token,
            }).then((syncedCount) => {
              if (isMounted && syncedCount !== initialWords) {
                setWordsKnown(syncedCount);
              }
            });
          }
        } catch {
          if (isMounted) setModules(FALLBACK_MODULES);
        } finally {
          if (isMounted) setLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [user, isLoaded, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-brand" />
      </div>
    );
  }

  const visibleModules = [...modules].sort(
    (a, b) => Number(a.module_id) - Number(b.module_id)
  );

  const mergedModules = visibleModules.map((m) => {
    const modId = Number(m.module_id);
    let serverScores: Record<string, any> = {};

    if (typeof m.mastery_scores === "string") {
      try {
        serverScores = JSON.parse(m.mastery_scores);
      } catch {}
    } else if (m.mastery_scores && typeof m.mastery_scores === "object") {
      serverScores = m.mastery_scores;
    }

    let localScores: Record<string, any> = {};
    if (typeof window !== "undefined") {
      try {
        localScores = JSON.parse(
          localStorage.getItem(`tibetan_mastery_scores_mod_${modId}`) || "{}"
        );
      } catch {}
    }

    const combinedScores: Record<string, any> = { ...localScores };
    for (const [title, sData] of Object.entries(serverScores)) {
      const sScore =
        typeof sData === "object" && sData !== null
          ? sData.score ?? 0
          : Number(sData) || 0;
      const lData = combinedScores[title];
      const lScore =
        typeof lData === "object" && lData !== null
          ? lData.score ?? -1
          : Number(lData) || -1;
      if (sScore >= lScore) combinedScores[title] = sData;
    }

    return { ...m, mastery_scores: combinedScores };
  });

  const totalCourseSteps = mergedModules.reduce(
    (sum, m) => sum + (Number(m.lesson_count) || 1),
    0
  );
  const completedCourseSteps = mergedModules.reduce(
    (sum, m) =>
      sum + Math.min(Number(m.progress) || 0, Number(m.lesson_count) || 1),
    0
  );
  const courseProgressPercent =
    totalCourseSteps > 0
      ? Math.round((completedCourseSteps / totalCourseSteps) * 100)
      : 0;

  let activeModuleId = 1;
  let activeStep = 0;

  if (typeof window !== "undefined") {
    const savedLastModule = localStorage.getItem("tibetan_last_active_lesson");
    if (savedLastModule) {
      activeModuleId = parseInt(savedLastModule, 10);
    }
  }

  let activeModule = mergedModules.find(
    (m) => Number(m.module_id) === activeModuleId
  );

  const module1 = mergedModules.find((m) => Number(m.module_id) === 1);
  if (
    activeModuleId > 1 &&
    activeModuleId <= 7 &&
    module1 &&
    module1.progress === 0 &&
    module1.status !== "completed"
  ) {
    activeModule = module1;
    activeModuleId = 1;
  }

  if (
    !activeModule ||
    (activeModule.progress >= activeModule.lesson_count &&
      activeModule.status === "completed")
  ) {
    activeModule =
      mergedModules.find(
        (m) => m.status !== "completed" && m.progress < m.lesson_count
      ) ||
      mergedModules[mergedModules.length - 1] ||
      FALLBACK_MODULES[0];
    activeModuleId = Number(activeModule.module_id);
  }

  if (typeof window !== "undefined") {
    const savedStep = localStorage.getItem(
      `tibetan_mobile_lesson_${activeModuleId}_step`
    );
    if (savedStep !== null && activeModule.progress > 0) {
      activeStep = parseInt(savedStep, 10);
    } else {
      activeStep = activeModule.progress || 0;
    }
  }

  const isBrandNew = activeModuleId === 1 && activeModule.progress === 0;

  if (isNative) {
    return (
      <MobileHome
        nextModule={activeModule}
        profile={profile}
        wordsKnown={wordsKnown}
        courseProgressPercent={courseProgressPercent}
        activeStep={activeStep}
        isBrandNew={isBrandNew}
      />
    );
  }

  return (
    <WebDashboard
      modules={mergedModules}
      nextModule={activeModule}
      wordsKnown={wordsKnown}
      isBrandNew={isBrandNew}
    />
  );
}
