// app/components/home/MobileLanding.tsx
"use client";

import { SignUpButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { usePlatform } from "@/hooks/usePlatform";

export function MobileLanding() {
  const { isCapacitor } = usePlatform();

  return (
    <div className="relative flex flex-col h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-paper">
      {/* 1. Background Image Wrapper */}
      <div className="absolute top-0 inset-x-0 h-[85vh] z-0 pointer-events-none">
        <img
          src="/hero-mobile.png"
          alt="Himalayas with Prayer Flags"
          className="w-full h-full object-cover object-top brightness-110"
        />
        <div className="absolute bottom-0 inset-x-0 h-[50vh] bg-gradient-to-t from-paper via-paper/90 to-transparent" />
      </div>

      {/* 2. Foreground Content */}
      <div
        className={`relative z-10 flex flex-col h-full w-full px-6 ${
          isCapacitor ? "pb-10" : "pb-6"
        }`}
      >
        {/* Spacer pushing the content down to align with the mountain peak */}
        <div className="flex-1" />

        {/* Middle Section: Logo & Text */}
        <div className="flex flex-col items-center w-full mb-8">
          <img
            src="/icon_t.png"
            alt="Loplao Seal"
            className="w-24 h-24 mb-5 object-contain drop-shadow-sm"
          />

          <h2 className="font-tibetan text-[22px] text-ink mb-2">སློབ་སླའོ།</h2>

          <h1 className="font-serif text-[28px] tracking-[0.3em] text-ink mb-4 pl-2">
            L O P L A O
          </h1>

          <p className="font-serif text-[15px] text-ink text-center leading-[1.6]">
            Learn Tibetan.
            <br />
            Connect with Tibetan culture
          </p>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-7">
            <div className="w-5 h-1.5 rounded-full bg-brand" />
            <div className="w-1.5 h-1.5 rounded-full bg-ink/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-ink/20" />
          </div>
        </div>

        {/* Bottom Section: Call to Action */}
        <div className="w-full pb-safe">
          <SignedOut>
            <SignUpButton mode="modal">
              <Button className="w-full bg-ink text-white hover:bg-ink-light py-[18px] text-[17px] shadow-xl">
                Get started
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-ink text-white hover:bg-ink-light py-[18px] text-[17px] shadow-xl">
                Get started
              </Button>
            </Link>
          </SignedIn>

          {/* Subtle mobile-web-only navigation row for visitors & Google Sitelinks (hidden in Capacitor app) */}
          {!isCapacitor && (
            <nav
              aria-label="Explore Loplao"
              className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-medium text-ink-muted"
            >
              <Link href="/courses" className="hover:text-ink transition-colors">
                Courses
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/shop" className="hover:text-ink transition-colors">
                Shop
              </Link>
              <span aria-hidden="true">·</span>
              <Link
                href="/oxford-visitorship"
                className="hover:text-ink transition-colors"
              >
                Visitorship
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/about" className="hover:text-ink transition-colors">
                About
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/support" className="hover:text-ink transition-colors">
                Contact
              </Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
