// app/dashboard/lessons/9/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLesson9 } from "@/app/components/lesson/9/WebLesson9";
import { MobileLesson9 } from "@/app/components/lesson/9/MobileLesson9";

export default function Lesson9Router() {
  const { isNative } = usePlatform();
  if (isNative) return <MobileLesson9 />;
  return <WebLesson9 />;
}
