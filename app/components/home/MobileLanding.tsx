// app/components/home/MobileLanding.tsx
"use client";

import { SignUpButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Link from "next/link";
import { Button } from "../ui/Button";

export function MobileLanding() {
  return (
    <div className="relative flex flex-col h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-paper">
      
      {/* 1. Background Image Wrapper */}
      <div className="absolute top-0 inset-x-0 h-[85vh] z-0 pointer-events-none">
        <img 
          src="/hero-mobile.png" 
          alt="Himalayas with Prayer Flags" 
          // Added brightness-110 to lighten the background image as requested
          className="w-full h-full object-cover object-top brightness-110" 
        />
        {/* Taller fade gradient (50vh) to ensure the text and logo sit on a clean, bright background */}
        <div className="absolute bottom-0 inset-x-0 h-[50vh] bg-gradient-to-t from-paper via-paper/90 to-transparent"></div>
      </div>

      {/* 2. Foreground Content */}
      <div className="relative z-10 flex flex-col h-full w-full pb-10 px-6">
        
        {/* Spacer pushing the content down to align with the mountain peak */}
        <div className="flex-1"></div>
        
        {/* Middle Section: Logo & Text */}
        <div className="flex flex-col items-center w-full mb-10">
          
          {/* Using the new transparent icon_t.png without mix-blend tricks */}
          <img 
            src="/icon_t.png" 
            alt="Loplao Seal" 
            className="w-24 h-24 mb-5 object-contain drop-shadow-sm"
          />
          
          <h2 className="font-tibetan text-[22px] text-ink mb-2">སློབ་སླའོ།</h2>
          
          <h1 className="font-serif text-[28px] tracking-[0.3em] text-ink mb-4 pl-2">
            L O P L A O
          </h1>
          
          {/* Enforced serif font and precise line-height matching the mockup */}
          <p className="font-serif text-[15px] text-ink text-center leading-[1.6]">
            Learn Tibetan.<br />
            Connect with Tibetan culture
          </p>
          
          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <div className="w-5 h-1.5 rounded-full bg-brand"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-ink/20"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-ink/20"></div>
          </div>
        </div>

        {/* Bottom Section: Call to Action */}
        <div className="w-full pb-safe">
          
          {/* ========================================================= */}
          {/* 🔴 STANDARD CLERK LOGIN (Use for Windows/Android/Production) */}
          {/* ========================================================= */}
          <SignedOut>
            <SignUpButton mode="modal">
              <Button className="w-full bg-ink text-white hover:bg-ink-light py-[18px] text-[17px] shadow-xl">
                Get started
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            {/* Even when signed in, button says 'Get started' as per mobile design specs */}
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-ink text-white hover:bg-ink-light py-[18px] text-[17px] shadow-xl">
                Get started
              </Button>
            </Link>
          </SignedIn>

          {/* ========================================================= */}
          {/* 🟢 MAC / iOS DEVELOPER BYPASS (Uncomment when coding on Mac) */}
          {/* ========================================================= */}
          {/* To use: Comment out the 🔴 blocks above, and uncomment this block below: */}
          
          {/* 
          <Link href="/dashboard" className="w-full">
            <Button className="w-full bg-ink text-white hover:bg-ink-light py-[18px] text-[17px] shadow-xl">
              Get started
            </Button>
          </Link> 
          */}
          
        </div>

      </div>
    </div>
  );
}