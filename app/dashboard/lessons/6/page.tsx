// app/dashboard/lessons/6/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLesson6 } from "@/app/components/lesson/6/WebLesson6"; 
import { MobileLesson6 } from "@/app/components/lesson/6/MobileLesson6"; 

export default function Lesson6Router() {
  const { isNative } = usePlatform();

  // If mobile wrapper detected, show the paginated, bottom-sheet native UI
  if (isNative) {
    return <MobileLesson6 />;
  }

  // Otherwise show the expanding desktop Web UI
  return <WebLesson6 />;
}