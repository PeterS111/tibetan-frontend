import { useState, useCallback, useEffect } from "react";
import { DEV_BYPASS_LOCKS } from "@/app/config";
import { useAuth } from "@clerk/nextjs"; // <-- We bring in Clerk here

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
    
    // Auto-detect which lesson we are currently on from the URL
    const match = window.location.pathname.match(/lessons\/(\d+)/);
    const id = match ? parseInt(match[1], 10) : 1;
    setLessonId(id);

    // 1. Grab local fallback progress instantly
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

    // Wait for Clerk to initialize
    if (!isLoaded) return; 

    const fetchServerProgress = async () => {
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
        
        const serverProgress = typeof data.unlocked_step === 'number' ? data.unlocked_step : 0;
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
    setExpandedStep(nextIndex);
    
    if (nextIndex > unlockedStep) {
      setUnlockedStep(nextIndex);
    }
    
    // Save to database only if it's a new high-water mark for the user's TRUE progress
    if (nextIndex > actualProgress) {
      setActualProgress(nextIndex);
      
      // Save locally immediately for snappy UI
      if (typeof window !== 'undefined') {
        localStorage.setItem(`tibetan_lesson_${lessonId}_progress`, nextIndex.toString());
      }
      
      // Securely save to database via Clerk token
      try {
        const token = await getToken();
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
        console.error("Failed to save progress to server", e);
      }
    }
  }, [unlockedStep, actualProgress, lessonId, getToken, apiUrl]);

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