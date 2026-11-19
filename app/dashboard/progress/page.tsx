// app/dashboard/progress/page.tsx
"use client";

import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

import { WebProgress } from "@/app/components/dashboard/WebProgress";
import { MobileProgress } from "@/app/components/dashboard/MobileProgress";
import { FALLBACK_MODULES } from "@/app/data/syllabus";


export default function ProgressHubRouter() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();

  const [profile, setProfile] = useState<any>({});
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the combined progress data from the backend
  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) { setModules(FALLBACK_MODULES); setLoading(false); }
    }, 5000);

    const fetchData = async () => {
      if (!isLoaded) return;
      if (isLoaded && !user) {
         if (isMounted) { setModules(FALLBACK_MODULES); setLoading(false); }
         clearTimeout(safetyTimer); return;
      }
      try {
        const token = await Promise.race([
          getToken(),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Token timeout")), 4500))
        ]);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (isMounted) {
          if (data.profile) setProfile(data.profile);
          if (data.modules && data.modules.length > 0) setModules(data.modules);
          else setModules(FALLBACK_MODULES);
        }
      } catch(e) {
        if (isMounted) setModules(FALLBACK_MODULES);
      } finally {
        if (isMounted) setLoading(false);
        clearTimeout(safetyTimer);
      }
    };
    
    fetchData();
    return () => { isMounted = false; clearTimeout(safetyTimer); };
  }, [user, isLoaded, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-brand" />
      </div>
    );
  }

  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));

  // Merge local & server scores for each lesson, strictly keeping the highest score
  let totalWordsKnown = 0;

  const mergedModules = visibleModules.map((m) => {
    const modId = Number(m.module_id);
    let serverScores: Record<string, any> = {};

    if (typeof m.mastery_scores === "string") {
      try { serverScores = JSON.parse(m.mastery_scores); } catch {}
    } else if (m.mastery_scores && typeof m.mastery_scores === "object") {
      serverScores = m.mastery_scores;
    }

    let localScores: Record<string, any> = {};
    if (typeof window !== "undefined") {
      try {
        localScores = JSON.parse(localStorage.getItem(`tibetan_mastery_scores_mod_${modId}`) || "{}");
      } catch {}
    }

    // Combine both sources, always choosing the highest score for each test
    const combinedScores: Record<string, any> = { ...localScores };
    for (const [title, sData] of Object.entries(serverScores)) {
      const sScore = typeof sData === "object" && sData !== null ? (sData.score ?? 0) : Number(sData) || 0;
      const lData = combinedScores[title];
      const lScore = typeof lData === "object" && lData !== null ? (lData.score ?? -1) : Number(lData) || -1;
      
      if (sScore >= lScore) {
        combinedScores[title] = sData;
      }
    }

    // Extract ONLY this lesson's own highest vocabulary score
    let lessonVocabScore = 0;
    if (typeof window !== "undefined") {
      const directLocal = parseInt(localStorage.getItem(`tibetan_vocab_score_mod_${modId}`) || "0", 10);
      if (!isNaN(directLocal) && directLocal > lessonVocabScore) lessonVocabScore = directLocal;
    }

    const vocabEntry = Object.entries(combinedScores).find(([title]) =>
      title.toLowerCase().includes("vocabulary")
    );
    if (vocabEntry) {
      const [, vData]: any = vocabEntry;
      const sc = typeof vData === "object" && vData !== null ? (vData.score ?? 0) : Number(vData) || 0;
      if (sc > lessonVocabScore) lessonVocabScore = sc;
    }

    // Accumulate for the top "Words Known" overview card
    totalWordsKnown += lessonVocabScore;

    return {
      ...m,
      mastery_scores: combinedScores
    };
  });

  // Top overview "Words Known" matches the main dashboard calculation
  const updatedProfile = {
    ...profile,
    words_known: Math.max(totalWordsKnown, profile?.words_known || 0)
  };

  if (isNative) {
    return <MobileProgress profile={updatedProfile} modules={mergedModules} />;
  }

  return <WebProgress profile={updatedProfile} modules={mergedModules} />;
}