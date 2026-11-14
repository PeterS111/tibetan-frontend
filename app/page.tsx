// app/page.tsx
"use client";

import { usePlatform } from "@/hooks/usePlatform";
import { WebLanding } from "./components/home/WebLanding";
import { MobileLanding } from "./components/home/MobileLanding";

export default function LandingPageRouter() {
  const { isNative, isReady } = usePlatform();

  // Before client JS finishes checking device size:
  // - Keep WebLanding in the static HTML for SEO & instant Desktop paint (hidden on <768px phones so it never flashes)
  if (!isReady) {
    return (
      <div className="min-h-[100dvh] bg-paper">
        <div className="hidden md:block">
          <WebLanding />
        </div>
      </div>
    );
  }

  // Native iOS/Android app OR mobile phone web browser -> show Mobile App UI
  if (isNative) {
    return <MobileLanding />;
  }

  // Desktop & tablet web browsers -> show full Web Landing layout
  return <WebLanding />;
}