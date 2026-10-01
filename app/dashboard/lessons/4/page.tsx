// app/dashboard/lessons/4/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLesson4 } from "@/app/components/lesson/4/WebLesson4"; 
import { MobileLesson4 } from "@/app/components/lesson/4/MobileLesson4"; 

export default function Lesson4Router() {
  const { isNative } = usePlatform();

  // If mobile wrapper detected, show the paginated, bottom-sheet native UI
  if (isNative) {
    return <MobileLesson4 />;
  }

  // Otherwise show the expanding desktop Web UI
  return <WebLesson4 />;
}