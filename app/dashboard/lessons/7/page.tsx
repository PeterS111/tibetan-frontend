// app/dashboard/lessons/7/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLesson7 } from "@/app/components/lesson/7/WebLesson7"; 
import { MobileLesson7 } from "@/app/components/lesson/7/MobileLesson7"; 

export default function Lesson7Router() {
  const { isNative } = usePlatform();

  // If mobile wrapper detected, show the paginated native UI
  if (isNative) {
    return <MobileLesson7 />;
  }

  // Otherwise show the expanding desktop Web UI
  return <WebLesson7 />;
}