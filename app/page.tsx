// app/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLanding } from "./components/home/WebLanding";
import { MobileLanding } from "./components/home/MobileLanding";

export default function LandingPageRouter() {
  const { isNative } = usePlatform();

  // If we are running in the native iOS/Android wrapper, show the Mobile UI (Picture 0)
  if (isNative) {
    return <MobileLanding />;
  }

  // Otherwise, show the beautiful desktop web layout
  return <WebLanding />;
}