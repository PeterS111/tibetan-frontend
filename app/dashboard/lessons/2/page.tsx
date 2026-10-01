// app/dashboard/lessons/2/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLesson2 } from "@/app/components/lesson/2/WebLesson2"; 
import { MobileLesson2 } from "@/app/components/lesson/2/MobileLesson2"; 

export default function Lesson2Router() {
  const { isNative } = usePlatform();

  // Route to the new Mobile Step Player with isolated steps!
  if (isNative) {
    return <MobileLesson2 />;
  }

  // Desktop users get the original long-scrolling textbook
  return <WebLesson2 />;
}