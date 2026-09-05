import { useState, useCallback, useEffect } from "react";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import { useAuth } from "@clerk/nextjs"; 

export function useLessonProgress(totalSteps: number, bypassAmount: number = 0) {
  const [unlockedStep, setUnlockedStep] = useState<number>(DEV_BYPASS_LOCKS ? bypassAmount || totalSteps : 0);
  const [actualProgress, setActualProgress] = useState<number>(0); 
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [lessonId, setLessonId] = useState<number>(1);

  const { getToken, isLoaded, isSignedIn } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // 🛠️ SAFE TOKEN WRAPPER
  const safeGetToken = useCallback(async () => {
    if (typeof window !== 'undefined' && window.location.hostname === '10.0.2.2') {
      return null;
    }
    try {
      return await Promise.race([
        getToken(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500))
      ]);
    } catch (err) {
      return null;
    }
  }, [getToken]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const match = window.location.pathname.match(/lessons\/(\d+)/);
    const id = match ? parseInt(match[1], 10) : 1;
    setLessonId(id);

    const localProgress = parseInt(localStorage.getItem(`tibetan_lesson_${id}_progress`) || '0', 10);
    
    const applyProgress = (stepValue: number) => {
      setActualProgress(stepValue);
      const finalStep = DEV_BYPASS_LOCKS ? (bypassAmount || totalSteps) : stepValue;
      setUnlockedStep(finalStep);
      
      const completedSet = new Set<number>();
      for(let i = 0; i < stepValue; i++) completedSet.add(i);
      
      if (DEV_BYPASS_LOCKS) {
        for(let i = 0; i < finalStep; i++) completedSet.add(i);
      }
      
      setCompleted(completedSet);
      setExpandedStep(Math.min(stepValue, totalSteps - 1));
    };

    // 🛠️ CRITICAL FIX: APPLY LOCAL PROGRESS INSTANTLY. DO NOT WAIT FOR CLERK.
    applyProgress(localProgress);

    // If Clerk isn't ready, we stop here (but the UI is already unlocked because of the line above!)
    if (!isLoaded || !isSignedIn) return; 

    const fetchServerProgress = async () => {
      try {
        const token = await safeGetToken();
        if (!token) return;
        
        const res = await fetch(`${apiUrl}/api/lesson-progress?module_id=${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        const serverProgress = typeof data.unlocked_step === 'number' 
          ? data.unlocked_step 
          : (parseInt(String(data.unlocked_step).replace(/\D/g, ''), 10) || 0);
        
        const bestProgress = Math.max(localProgress, serverProgress); 
        if (bestProgress > localProgress) {
          applyProgress(bestProgress);
          localStorage.setItem(`tibetan_lesson_${id}_progress`, bestProgress.toString());
        }
      } catch (err) {
        console.error("Failed to load progress from server", err);
      }
    };

    fetchServerProgress();
  }, [totalSteps, bypassAmount, isLoaded, isSignedIn, safeGetToken, apiUrl]);

  const progressPercent = Math.round((completed.size / totalSteps) * 100);

  const toggleStep = useCallback((index: number) => {
    if (DEV_BYPASS_LOCKS || index <= unlockedStep || completed.has(index)) {
      setExpandedStep(prev => prev === index ? -1 : index);
    }
  }, [unlockedStep, completed]);

  const markComplete = useCallback(async (index: number) => {
    // INSTANT UI UPDATE
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    const nextIndex = index + 1;
    
    if (nextIndex < totalSteps) setExpandedStep(nextIndex);
    if (nextIndex > unlockedStep) setUnlockedStep(nextIndex);
    if (nextIndex > actualProgress) setActualProgress(nextIndex);
    
    if (typeof window !== 'undefined') {
      const currentLocal = parseInt(localStorage.getItem(`tibetan_lesson_${lessonId}_progress`) || '0', 10);
      if (nextIndex > currentLocal) {
        localStorage.setItem(`tibetan_lesson_${lessonId}_progress`, nextIndex.toString());
      }
    }
    
    // SAFE BACKGROUND SAVE
    try {
      const token = await safeGetToken();
      if (token) {
        const formData = new FormData();
        formData.append('module_id', lessonId.toString());
        formData.append('unlocked_step', nextIndex.toString());
        
        await fetch(`${apiUrl}/api/update-lesson-progress`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
      }
    } catch (e) {
      console.warn("Failed to save progress to server, but local progress is saved.", e);
    }
  }, [unlockedStep, actualProgress, lessonId, safeGetToken, apiUrl, totalSteps]);

  const statusOf = useCallback((i: number): "done" | "current" | "upcoming" => {
    if (completed.has(i)) return "done";
    if (i === expandedStep) return "current";
    return "upcoming";
  }, [completed, expandedStep]);

  return { unlockedStep, expandedStep, completed, progressPercent, toggleStep, markComplete, statusOf };
}