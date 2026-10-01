// app/dashboard/lessons/3/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLesson3 } from "@/app/components/lesson/3/WebLesson3"; 
import { MobileLesson3 } from "@/app/components/lesson/3/MobileLesson3"; 

export default function Lesson3Router() {
  const { isNative } = usePlatform();

  // If mobile wrapper detected, show the paginated, bottom-sheet native UI
  if (isNative) {
    return <MobileLesson3 />;
  }

  // Otherwise show the expanding desktop Web UI
  return <WebLesson3 />;
}