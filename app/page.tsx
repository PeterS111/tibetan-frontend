"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { ArrowRight, BookOpen, Volume2, Mic, Settings, Play, Check, Navigation } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-800 font-serif selection:bg-amber-200">
      
      {/* 
        ========================================
        HERO SECTION & DOT GRID 
        ========================================
      */}
      <div 
        className="relative flex flex-col w-full"
        style={{
          backgroundImage: 'radial-gradient(#e5e1d8 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* HEADER */}
        <header className="relative z-10 px-6 py-6 flex items-center justify-between w-full max-w-7xl mx-auto font-sans">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#85443d] flex items-center justify-center text-white font-serif text-xl shadow-sm">
              ལ
            </div>
            <span className="font-serif font-medium text-xl tracking-tight text-stone-800">Learn Tibetan UK</span>
          </div>
          
          <nav className="hidden md:flex gap-10 font-medium text-sm text-stone-500 tracking-wide">
            <Link href="/about" className="hover:text-amber-600 transition">About</Link>
            <Link href="/donate" className="hover:text-amber-600 transition">Support Us</Link>
            <Link href="/support" className="hover:text-amber-600 transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="text-sm font-semibold text-stone-700 hover:text-amber-600 transition-colors hidden sm:block">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="text-sm font-bold bg-amber-400 text-stone-900 px-6 py-2.5 rounded-full hover:bg-amber-500 transition-colors shadow-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className="text-sm font-bold bg-amber-400 text-stone-900 px-6 py-2.5 rounded-full hover:bg-amber-500 transition-colors shadow-sm flex items-center gap-2">
                Dashboard <ArrowRight size={16} />
              </Link>
              <UserButton />
            </Show>
          </div>
        </header>

        {/* HERO CONTENT */}
        <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 fade-in duration-700">
            
            <div className="flex justify-center">
              <span className="bg-amber-50 text-amber-600 border border-amber-200/60 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> A Complete Scholarly Path
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-medium tracking-tight text-stone-900 leading-[1.1]">
              Master Tibetan with a <br className="hidden sm:block" />
              <span className="text-amber-500 italic font-light font-serif tracking-normal">Structured Curriculum</span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed font-sans">
              Progress through five proficiency tiers. Access authentic textbook materials, gamified exercises, and practice conversationally with Dolma, our voice AI tutor.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 font-sans">
              <Show when="signed-out">
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <button className="w-full sm:w-auto text-[15px] font-bold bg-amber-400 text-stone-900 px-8 py-3.5 rounded-full hover:bg-amber-500 hover:-translate-y-0.5 transition-all shadow-md">
                    Start Learning Free
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="w-full sm:w-auto text-[15px] font-bold bg-amber-400 text-stone-900 px-8 py-3.5 rounded-full hover:bg-amber-500 hover:-translate-y-0.5 transition-all shadow-md">
                  Continue Learning
                </Link>
              </Show>
              <Link href="/about" className="w-full sm:w-auto text-[15px] font-bold bg-white text-stone-700 border border-[#e8e4d9] px-8 py-3.5 rounded-full hover:bg-stone-50 transition-all shadow-sm">
                Explore Curriculum
              </Link>
            </div>

            <div className="pt-10 flex items-center justify-center gap-3 text-stone-400 text-sm italic">
              <span className="text-stone-300 text-xl font-serif">བཀྲ་ཤིས་བདེ་ལེགས།</span>
              <span className="w-4 h-[1px] bg-stone-300"></span>
              <span className="font-sans text-stone-400 font-medium text-xs tracking-wide">Tashi Delek — welcome</span>
            </div>
          </div>
        </main>

        {/* GEOMETRIC MOUNTAIN DIVIDER */}
        <div className="w-full relative mt-12 overflow-hidden leading-none z-0">
          <svg viewBox="0 0 1440 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block min-w-[1000px] mx-auto opacity-95">
            {/* Back Layer (Lightest) */}
            <path d="M0 280 L250 80 L550 280 Z" fill="#e8dad5" />
            <path d="M400 280 L800 50 L1200 280 Z" fill="#e8dad5" />
            <path d="M1000 280 L1250 120 L1440 280 Z" fill="#e8dad5" />
            
            {/* Middle Layer (Medium) */}
            <path d="M-100 280 L200 140 L500 280 Z" fill="#c3978f" />
            <path d="M600 280 L950 90 L1300 280 Z" fill="#c3978f" />
            
            {/* Front Layer (Darkest) */}
            <path d="M0 280 L100 200 L250 280 Z" fill="#9b5a50" />
            <path d="M150 280 L500 120 L850 280 Z" fill="#9b5a50" />
            <path d="M800 280 L1150 150 L1440 280 Z" fill="#9b5a50" />
            
            {/* Baseline Cover */}
            <rect x="0" y="279" width="1440" height="2" fill="#9b5a50" />
          </svg>
        </div>
      </div>

      {/* BANNER TICKER */}
      <div className="bg-[#f8f5ee] border-b border-[#ece6d5] py-4 px-6 relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[10px] sm:text-xs font-bold text-stone-500 uppercase tracking-[0.2em] font-sans">
          <span>Based on the textbook by Franziska Oertle</span>
          <span className="w-1 h-1 rounded-full bg-stone-300 hidden md:block"></span>
          <span>Voice AI Tutor · Dolma</span>
          <span className="w-1 h-1 rounded-full bg-stone-300 hidden lg:block"></span>
          <span>Five Proficiency Tiers</span>
        </div>
      </div>

      {/* 
        ========================================
        ROOTED IN SCHOLARSHIP
        ========================================
      */}
      <div className="bg-[#fdfbf7] py-24 px-6 border-b border-[#e8e4d9]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#f8f5ee] border border-[#e8e4d9] flex items-center justify-center shadow-sm">
            <BookOpen size={24} className="text-[#9b5a50]" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-stone-900 tracking-tight">Rooted in Authentic Scholarship</h2>
          <p className="text-lg text-stone-500 font-sans leading-relaxed">
            Our comprehensive curriculum, reading materials, and grammar progression are proudly based on the acclaimed Tibetan language textbook by <strong>Franziska Oertle</strong>. By combining her proven traditional pedagogy with interactive AI, we offer a robust and highly effective path to fluency.
          </p>
        </div>
      </div>

      {/* 
        ========================================
        FIVE TIERS OF PROFICIENCY
        ========================================
      */}
      <div className="bg-[#fdfbf7] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-medium text-stone-900 tracking-tight">Five Tiers of Proficiency</h2>
            <p cla