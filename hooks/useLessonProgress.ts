import { useState, useCallback } from "react";
import { DEV_BYPASS_LOCKS } from "@/app/config";

export function useLessonProgress(totalSteps: number, bypassAmount: number = 0) {
  const [unlockedStep, setUnlockedStep] = useState<number>(DEV_BYPASS_LOCKS ? bypassAmount || totalSteps : 0);
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

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
    if (nextIndex > unlockedStep) {
      setUnlockedStep(nextIndex);
    }
    setExpandedStep(nextIndex);
  }, [unlockedStep]);

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