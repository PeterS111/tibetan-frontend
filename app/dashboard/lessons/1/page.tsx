// app/dashboard/lessons/1/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLesson1 } from "@/app/components/lesson/1/WebLesson1";
import { MobileLesson1 } from "@/app/components/lesson/1/MobileLesson1"; 

export default function Lesson1Router() {
  const { isNative } = usePlatform();

  // Route to the new Mobile Step Player with Pill Tabs!
  if (isNative) {
    return <MobileLesson1 />;
  }

  // Desktop users get the original long-scrolling textbook
  return <WebLesson1 />;
}