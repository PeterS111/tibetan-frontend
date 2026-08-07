import { useState, useCallback, useEffect } from "react";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import { useAuth } from "@clerk/nextjs"; 

export function useLessonProgress(totalSteps: number, bypassAmount: number = 0) {
  const [unlockedStep, setUnlockedStep] = useState<number>(DEV_BYPASS_LOCKS ? bypassAmount || totalSteps : 0);
  const [actualProgress, setActualProgress] = useState<number>(0); 
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [lessonId, setLessonId] = useState<number>(1);

  // Use Clerk's secure hook to get the token
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Fetch progress on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Auto-detect which lesson we are currently on from the URL (e.g., /lessons/2)
    const match = window.location.pathname.match(/lessons\/(\d+)/);
    const id = match ? parseInt(match[1], 10) : 1;
    setLessonId(id);

    // 1. Grab local fallback progress instantly for a snappy UI
    const localProgress = parseInt(localStorage.getItem(`tibetan_lesson_${id}_progress`) || '0', 10);
    
    const applyProgress = (stepValue: number) => {
      setActualProgress(stepValue);
      const finalStep = DEV_BYPASS_LOCKS ? (bypassAmount || totalSteps) : stepValue;
      setUnlockedStep(finalStep);
      
      const completedSet = new Set<number>();
      
      // Mark actual completed steps
      for(let i = 0; i < stepValue; i++) completedSet.add(i);
      
      // If DEV_BYPASS_LOCKS is true, visually treat them all as completed so you can click anything
      if (DEV_BYPASS_LOCKS) {
        for(let i = 0; i < finalStep; i++) completedSet.add(i);
      }
      
      setCompleted(completedSet);
      
      // Auto-expand the exact step you are truly working on
      setExpandedStep(Math.min(stepValue, totalSteps - 1));
    };

    // Wait for Clerk to initialize
    if (!isLoaded) return; 

    const fetchServerProgress = async () => {
      // If not signed in, just use local storage
      if (!isSignedIn) {
        applyProgress(localProgress);
        return;
      }
      
      try {
        const token = await getToken();
        if (!token) {
          applyProgress(localProgress);
          return;
        }
        
        const res = await fetch(`${apiUrl}/api/lesson-progress?module_id=${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        // 🚨 FIX: Extract purely numerical value even if the DB returned a string
        const serverProgress = typeof data.unlocked_step === 'number' 
          ? data.unlocked_step 
          : (parseInt(String(data.unlocked_step).replace(/\D/g, ''), 10) || 0);
        
        // Keep whichever progress is higher (Server vs Local)
        const bestProgress = Math.max(localProgress, serverProgress); 
        applyProgress(bestProgress);
        
        if (serverProgress > localProgress) {
           localStorage.setItem(`tibetan_lesson_${id}_progress`, serverProgress.toString());
        }
      } catch (err) {
        console.error("Failed to load progress from server", err);
        applyProgress(localProgress);
      }
    };

    fetchServerProgress();
  }, [totalSteps, bypassAmount, isLoaded, isSignedIn, getToken, apiUrl]);

  const progressPercent = Math.round((completed.size / totalSteps) * 100);

  const toggleStep = useCallback((index: number) => {
    if (DEV_BYPASS_LOCKS || index <= unlockedStep || completed.has(index)) {
      setExpandedStep(prev => prev === index ? -1 : index);
    }
  }, [unlockedStep, completed]);

  const markComplete = useCallback(async (index: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    const nextIndex = index + 1;
    
    if (nextIndex < totalSteps) {
      setExpandedStep(nextIndex);
    }
    
    if (nextIndex > unlockedStep) {
      setUnlockedStep(nextIndex);
    }
    
    if (nextIndex > actualProgress) {
      setActualProgress(nextIndex);
    }
    
    // ALWAYS update local storage for safety
    if (typeof window !== 'undefined') {
      const currentLocal = parseInt(localStorage.getItem(`tibetan_lesson_${lessonId}_progress`) || '0', 10);
      if (nextIndex > currentLocal) {
        localStorage.setItem(`tibetan_lesson_${lessonId}_progress`, nextIndex.toString());
      }
    }
    
    // ALWAYS notify the server of completion. 
    // The backend is now smart enough to safely ignore it if it's not a new high score.
    try {
      const token = await getToken();
      if (token) {
        const formData = new FormData();
        formData.append('module_id', lessonId.toString());
        formData.append('unlocked_step', nextIndex.toString());
        
        const res = await fetch(`${apiUrl}/api/update-lesson-progress`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (!res.ok) {
           const errText = await res.text();
           console.error("Backend refused to update progress:", errText);
        }
      }
    } catch (e) {
      console.error("Failed to save progress to server", e);
    }
  }, [unlockedStep, actualProgress, lessonId, getToken, apiUrl, totalSteps]);

  const statusOf = useCallback((i: number): "done" | "current" | "upcoming" => {
    if (completed.has(i)) return "done";
    if (i === expandedStep) return "current";
    return "upcoming";
  }, [completed, expandedStep]);

  return { 
    unlockedStep, 
    expandedStep, 
    completed,
    progressPercent,
    toggleStep, 
    markComplete,
    statusOf
  };
}