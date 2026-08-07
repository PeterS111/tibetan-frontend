import { useState, useCallback, useEffect } from "react";
import { DEV_BYPASS_LOCKS } from "@/app/config";

// Safely finds the user auth token across standard and Supabase storage configurations
function getAuthToken(): string {
  if (typeof window === 'undefined') return '';
  const t = localStorage.getItem('token');
  if (t) return t;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('-auth-token')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '');
        if (data?.access_token) return data.access_token;
      } catch (e) {}
    }
  }
  return '';
}

export function useLessonProgress(totalSteps: number, bypassAmount: number = 0) {
  const [unlockedStep, setUnlockedStep] = useState<number>(DEV_BYPASS_LOCKS ? bypassAmount || totalSteps : 0);
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [lessonId, setLessonId] = useState<number>(1);

  // Fetch progress from Database on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Auto-detect which lesson we are currently on from the URL (e.g., /lessons/2)
    const match = window.location.pathname.match(/lessons\/(\d+)/);
    const id = match ? parseInt(match[1], 10) : 1;
    setLessonId(id);

    const token = getAuthToken();
    if (!token) return;

    fetch(`/api/lesson-progress?module_id=${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data && typeof data.unlocked_step === 'number') {
        const step = Math.max(0, data.unlocked_step);
        const finalStep = DEV_BYPASS_LOCKS ? (bypassAmount || totalSteps) : step;
        
        setUnlockedStep(finalStep);
        
        // Populate the completed items so earlier sections show as done
        const completedSet = new Set<number>();
        for(let i = 0; i < finalStep; i++) completedSet.add(i);
        setCompleted(completedSet);
        
        // Auto-expand the user's current working step
        setExpandedStep(Math.min(finalStep, totalSteps - 1));
      }
    })
    .catch(err => console.error("Failed to load progress", err));
  }, [totalSteps, bypassAmount]);

  const progressPercent = Math.round((completed.size / totalSteps) * 100);

  const toggleStep = useCallback((index: number) => {
    if (DEV_BYPASS_LOCKS || index <= unlockedStep || completed.has(index)) {
      setExpandedStep(prev => prev === index ? -1 : index);
    }
  }, [unlockedStep, completed]);

  const markComplete = useCallback((index: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    const nextIndex = index + 1;
    setExpandedStep(nextIndex);
    
    if (nextIndex > unlockedStep) {
      setUnlockedStep(nextIndex);
      
      // Save progress quietly to the Database
      const token = getAuthToken();
      if (token) {
        const formData = new FormData();
        formData.append('module_id', lessonId.toString());
        formData.append('unlocked_step', nextIndex.toString());
        
        fetch('/api/update-lesson-progress', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }).catch(e => console.error("Failed to save progress", e));
      }
    }
  }, [unlockedStep, lessonId]);

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