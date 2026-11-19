// app/dashboard/lessons/8/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLesson8 } from "@/app/components/lesson/8/WebLesson8";
import { MobileLesson8 } from "@/app/components/lesson/8/MobileLesson8";

export default function Lesson8Router() {
  const { isNative } = usePlatform();
  if (isNative) return <MobileLesson8 />;
  return <WebLesson8 />;
}
