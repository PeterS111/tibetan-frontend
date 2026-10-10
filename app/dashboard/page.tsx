// app/dashboard/page.tsx
"use client";

import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

import { WebDashboard } from "../components/dashboard/WebDashboard";
import { MobileHome } from "../components/dashboard/MobileHome";

const FALLBACK_MODULES = [
  { id: 1, module_id: 1, title: "The 30 Consonants", description: "The foundation of the Tibetan alphabet, script, tones, and essential root vocabulary.", progress: 0, status: "active", lesson_count: 8, mastery_scores: {} },
  { id: 2, module_id: 2, title: "The Four Vowels", description: "The four diacritic marks, their shapes, positions, pronunciation, and spelling math.", progress: 0, status: "locked", lesson_count: 7, mastery_scores: {} },
  { id: 3, module_id: 3, title: "The Three Superscripts", description: "The superscripts ར, ལ, and ས, their consonant combinations, tone changes, and vocabulary.", progress: 0, status: "locked", lesson_count: 5, mastery_scores: {} },
  { id: 4, module_id: 4, title: "The Four Subscripts", description: "The Subscripts (ya-ra-la-wa) and their complex sound shifts.", progress: 0, status: "locked", lesson_count: 6, mastery_scores: {} },
  { id: 5, module_id: 5, title: "The Prefix Letters", description: "The five prefix letters and their complex role in Tibetan spelling and pronunciation.", progress: 0, status: "locked", lesson_count: 7, mastery_scores: {} },
  { id: 6, module_id: 6, title: "The Suffix Letters", description: "The ten suffix letters and the two secondary suffixes.", progress: 0, status: "locked", lesson_count: 9, mastery_scores: {} },
  { id: 7, module_id: 7, title: "Final Assessment", description: "A short mixed assessment drawing on every step so far. Score 80% or higher to pass.", progress: 0, status: "locked", lesson_count: 3, mastery_scores: {} }
];

export default function UnifiedDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { isNative } = usePlatform();

  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      if (isLoaded && user) {
        try {
          const token = await Promise.race([
            getToken(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Token timeout")), 4500))
          ]);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress?user_id=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (isMounted) {
            if (data.profile) setProfile(data.profile);
            if (data.modules && Array.isArray(data.modules) && data.modules.length > 0) {
              setModules(data.modules);
            } else {
              setModules(FALLBACK_MODULES);
            }
          }
        } catch(e) {
          if (isMounted) setModules(FALLBACK_MODULES);
        } finally {
          if (isMounted) setLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; clearTimeout(safetyTimer); };
  }, [user, isLoaded, getToken]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-brand" /></div>;

  const visibleModules = [...modules].sort((a, b) => Number(a.module_id) - Number(b.module_id));

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
      try { localScores = JSON.parse(localStorage.getItem(`tibetan_mastery_scores_mod_${modId}`) || "{}"); } catch {}
    }

    const combinedScores: Record<string, any> = { ...localScores };
    for (const [title, sData] of Object.entries(serverScores)) {
      const sScore = typeof sData === "object" && sData !== null ? (sData.score ?? 0) : Number(sData) || 0;
      const lData = combinedScores[title];
      const lScore = typeof lData === "object" && lData !== null ? (lData.score ?? -1) : Number(lData) || -1;
      if (sScore >= lScore) combinedScores[title] = sData;
    }

    let lessonVocabScore = 0;
    if (typeof window !== "undefined") {
      const directLocal = parseInt(localStorage.getItem(`tibetan_vocab_score_mod_${modId}`) || "0", 10);
      if (!isNaN(directLocal) && directLocal > lessonVocabScore) lessonVocabScore = directLocal;
    }

    const vocabEntry = Object.entries(combinedScores).find(([title]) => title.toLowerCase().includes("vocabulary"));
    if (vocabEntry) {
      const [, vData]: any = vocabEntry;
      const sc = typeof vData === "object" && vData !== null ? (vData.score ?? 0) : Number(vData) || 0;
      if (sc > lessonVocabScore) lessonVocabScore = sc;
    }
    totalWordsKnown += lessonVocabScore;

    return { ...m, mastery_scores: combinedScores };
  });

  const effectiveWordsKnown = totalWordsKnown > 0 ? totalWordsKnown : (profile?.words_known || 0);

  const totalCourseSteps = mergedModules.reduce((sum, m) => sum + (Number(m.lesson_count) || 1), 0);
  const completedCourseSteps = mergedModules.reduce((sum, m) => sum + Math.min(Number(m.progress) || 0, Number(m.lesson_count) || 1), 0);
  const courseProgressPercent = totalCourseSteps > 0 ? Math.round((completedCourseSteps / totalCourseSteps) * 100) : 0;

  let activeModuleId = 1;
  let activeStep = 0;

  if (typeof window !== "undefined") {
    const savedLastModule = localStorage.getItem("tibetan_last_active_lesson");
    if (savedLastModule) {
      activeModuleId = parseInt(savedLastModule, 10);
    }
  }

  let activeModule = mergedModules.find(m => Number(m.module_id) === activeModuleId);
  
  // FIX: Safety check! If the phone remembers Module 2+, but the user hasn't even started Module 1, force them to Module 1!
  const module1 = mergedModules.find(m => Number(m.module_id) === 1);
  if (activeModuleId !== 1 && module1 && module1.progress === 0 && module1.status !== "completed") {
      activeModule = module1;
      activeModuleId = 1;
  }

  if (!activeModule || (activeModule.progress >= activeModule.lesson_count && activeModule.status === "completed")) {
    activeModule = mergedModules.find(m => m.status !== "completed" && m.progress < m.lesson_count) 
      || mergedModules[mergedModules.length - 1] 
      || FALLBACK_MODULES[0];
    activeModuleId = Number(activeModule.module_id);
  }

  if (typeof window !== "undefined") {
    const savedStep = localStorage.getItem(`tibetan_mobile_lesson_${activeModuleId}_step`);
    if (savedStep !== null) {
      activeStep = parseInt(savedStep, 10);
    } else {
      activeStep = activeModule.progress || 0;
    }
  }

  if (isNative) {
    return (
      <MobileHome 
        nextModule={activeModule} 
        profile={profile} 
        wordsKnown={effectiveWordsKnown} 
        courseProgressPercent={courseProgressPercent}
        activeStep={activeStep}
      />
    );
  }

  return <WebDashboard modules={mergedModules} nextModule={activeModule} wordsKnown={effectiveWordsKnown} />;
}