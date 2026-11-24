// app/dashboard/progress/page.tsx
"use client";

import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

import { WebProgress } from "@/app/components/dashboard/WebProgress";
import { MobileProgress } from "@/app/components/dashboard/MobileProgress";
import { FALLBACK_MODULES, mergeWithFallbackModules } from "@/app/data/syllabus";
import { syncLearnedWordsIfNeeded } from "@/app/data/vocabCatalog";

export default function ProgressHubRouter() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();

  const [profile, setProfile] = useState<any>({});
  const [modules, setModules] = useState<any[]>([]);
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
            data.modules && data.modules.length > 0
              ? mergeWithFallbackModules(data.modules)
              : FALLBACK_MODULES;
          const loadedProfile = data.profile || {};

          setProfile(loadedProfile);
          setModules(loadedModules);

          const initialWords = Number(loadedProfile.words_known) || 0;
          syncLearnedWordsIfNeeded({
            userId: user.id,
            modules: loadedModules,
            learnedWordModules: data?.learned_word_modules,
            currentWordsKnown: initialWords,
            token,
          }).then((syncedCount) => {
            if (isMounted && syncedCount !== initialWords) {
              setProfile((prev: any) => ({ ...prev, words_known: syncedCount }));
            }
          });
        }
      } catch {
        if (isMounted) setModules(FALLBACK_MODULES);
      } finally {
        if (isMounted) setLoading(false);
        clearTimeout(safetyTimer);
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

      if (sScore >= lScore) {
        combinedScores[title] = sData;
      }
    }

    return {
      ...m,
      mastery_scores: combinedScores,
    };
  });

  if (isNative) {
    return <MobileProgress profile={profile} modules={mergedModules} />;
  }

  return <WebProgress profile={profile} modules={mergedModules} />;
}
