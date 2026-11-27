// app/components/home/LandingRouter.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLanding } from "./WebLanding";
import { MobileLanding } from "./MobileLanding";

export function LandingRouter() {
  const { isCapacitor } = usePlatform();

  if (isCapacitor) {
    return <MobileLanding />;
  }

  return <WebLanding />;
}
