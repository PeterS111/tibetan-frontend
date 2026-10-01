// app/dashboard/lessons/5/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import WebLesson5 from "@/app/components/lesson/5/WebLesson5"; 
import { MobileLesson5 } from "@/app/components/lesson/5/MobileLesson5"; 

export default function Lesson5Router() {
  const { isNative } = usePlatform();

  // If mobile wrapper detected, show the paginated, bottom-sheet native UI
  if (isNative) {
    return <MobileLesson5 />;
  }

  // Otherwise show the expanding desktop Web UI
  return <WebLesson5 />;
}