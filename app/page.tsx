// app/page.tsx
"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { ArrowRight, BookOpen, Mic, Play, Check, Navigation } from "lucide-react";

import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Badge } from "./components/ui/Badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-serif selection:bg-brand-light">
      
      {/* 
        ========================================
        HERO SECTION & DOT GRID 
        ========================================
      */}
      <div 
        className="relative flex flex-col w-full"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border-subtle) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* HEADER */}
        <header className="relative z-10 px-6 py-6 flex items-center justify-between w-full max-w-7xl mx-auto font-sans">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ink flex items-center justify-center text-surface font-serif text-xl shadow-sm">
              ལ
            </div>
            <span className="font-serif font-medium text-xl tracking-tight text-ink">Learn Tibetan UK</span>
          </div>
          
          <nav className="hidden md:flex gap-10 font-medium text-sm text-ink-light tracking-wide">
            <Link href="/about" className="hover:text-brand transition-colors">About</Link>
            <Link href="/donate" className="hover:text-brand transition-colors">Support Us</Link>
            <Link href="/support" className="hover:text-brand transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                {/* Wrapped in a span/div to avoid button-in-button console warnings if SignInButton passes props */}
                <div>
                  <Button variant="ghost" className="hidden sm:inline-flex">
                    Log In
                  </Button>
                </div>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <div>
                  <Button variant="primary">
                    Sign Up
                  </Button>
                </div>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold transition-all rounded-none bg-brand text-ink hover:bg-amber-400 border border-amber-600 shadow-sm">
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
              <Badge variant="brand" className="px-4 py-1.5 text-[10px]">
                <div className="w-1.5 h-1.5 bg-brand-dark"></div> A Complete Scholarly Path
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-medium tracking-tight text-ink leading-[1.1]">
              Master Tibetan with a <br className="hidden sm:block" />
              <span className="text-brand italic font-light font-serif tracking-normal">Structured Curriculum</span>
            </h1>
            
            <p className="text-lg md:text-xl text-ink-light max-w-2xl mx-auto leading-relaxed font-sans">
              Progress through five proficiency tiers. Access authentic textbook materials, gamified exercises, and practice conversationally with Dolma, our voice AI tutor.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 font-sans">
              <Show when="signed-out">
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <div>
                    <Button variant="primary" className="w-full sm:w-auto px-8 py-3.5 text-[15px] hover:-translate-y-0.5 shadow-md">
                      Start Learning Free
                    </Button>
                  </div>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-bold transition-all rounded-none bg-brand text-ink hover:bg-amber-400 hover:-translate-y-0.5 border border-amber-600 shadow-md">
                  Continue Learning
                </Link>
              </Show>
              <Link href="/about" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-bold transition-all rounded-none bg-surface text-ink-light hover:bg-surface-muted hover:text-ink border border-border-subtle shadow-sm">
                Explore Curriculum
              </Link>
            </div>

            <div className="pt-10 flex items-center justify-center gap-3 text-ink-muted text-sm italic">
              <span className="text-ink-muted text-xl font-serif">བཀྲ་ཤིས་བདེ་ལེགས།</span>
              <span className="w-4 h-[1px] bg-border-subtle"></span>
              <span className="font-sans text-ink-muted font-medium text-xs tracking-wide">Tashi Delek — welcome</span>
            </div>
          </div>
        </main>

        {/* GEOMETRIC MOUNTAIN DIVIDER */}
        <div className="w-full relative mt-12 overflow-hidden leading-none z-0">
          <svg viewBox="0 0 1440 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block min-w-[1000px] mx-auto opacity-95">
            {/* Back Layer (Lightest) */}
            <path d="M0 280 L250 80 L550 280 Z" fill="var(--color-surface-muted)" />
            <path d="M400 280 L800 50 L1200 280 Z" fill="var(--color-surface-muted)" />
            <path d="M1000 280 L1250 120 L1440 280 Z" fill="var(--color-surface-muted)" />
            
            {/* Middle Layer (Medium) */}
            <path d="M-100 280 L200 140 L500 280 Z" fill="var(--color-border-subtle)" />
            <path d="M600 280 L950 90 L1300 280 Z" fill="var(--color-border-subtle)" />
            
            {/* Front Layer (Darkest) */}
            <path d="M0 280 L100 200 L250 280 Z" fill="var(--color-ink-light)" />
            <path d="M150 280 L500 120 L850 280 Z" fill="var(--color-ink-light)" />
            <path d="M800 280 L1150 150 L1440 280 Z" fill="var(--color-ink-light)" />
            
            {/* Baseline Cover */}
            <rect x="0" y="279" width="1440" height="2" fill="var(--color-ink-light)" />
          </svg>
        </div>
      </div>

      {/* BANNER TICKER */}
      <div className="bg-surface-muted border-b border-border-subtle py-4 px-6 relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[10px] sm:text-xs font-bold text-ink-light uppercase tracking-[0.2em] font-sans">
          <span>Based on respected Tibetan textbooks</span>
          <span className="w-1.5 h-1.5 bg-border-subtle hidden md:block"></span>
          <span>Voice AI Tutor · Dolma</span>
          <span className="w-1.5 h-1.5 bg-border-subtle hidden lg:block"></span>
          <span>Five Proficiency Tiers</span>
        </div>
      </div>

      {/* 
        ========================================
        ROOTED IN SCHOLARSHIP
        ========================================
      */}
      <div className="bg-paper py-24 px-6 border-b border-border-subtle">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="w-14 h-14 mx-auto bg-surface border border-border-subtle flex items-center justify-center shadow-sm">
            <BookOpen size={24} className="text-ink-light" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-ink tracking-tight">Rooted in Authentic Scholarship</h2>
          <p className="text-lg text-ink-light font-sans leading-relaxed">
            Our comprehensive curriculum, reading materials, and grammar progression draw on a range of respected Tibetan language textbooks authored by both native Tibetan scholars and internationally recognised Tibetan language experts. By integrating the strengths of these diverse teaching traditions with interactive AI, we provide a robust and highly effective path to fluency that is authentically rooted in Tibetan linguistic traditions and Buddhist values.
          </p>
        </div>
      </div>

      {/* 
        ========================================
        FIVE TIERS OF PROFICIENCY
        ========================================
      */}
      <div className="bg-paper py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-medium text-ink tracking-tight">Five Tiers of Proficiency</h2>
            <p className="text-ink-light font-sans text-lg">A clear, step-by-step journey from your first letter to fluent discourse.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { num: "I", letter: "ཀ", title: "Beginner", desc: "Script, phonology, and essential daily greetings." },
              { num: "II", letter: "ཁ", title: "Pre-Intermediate", desc: "Build conversational fluency and tense structures." },
              { num: "III", letter: "ག", title: "Intermediate", desc: "Honorifics, register, and reading short prose." },
              { num: "IV", letter: "ང", title: "Upper-Intermediate", desc: "Navigating philosophical and journalistic texts." },
              { num: "V", letter: "ཅ", title: "Advanced", desc: "Independent reading of canonical texts and poetry." }
            ].map((tier, i) => (
              <Link href="/dashboard/lessons" key={i} className="block group">
                <Card hoverable className="flex flex-col h-full relative p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold font-sans ${i === 0 ? 'bg-brand text-ink shadow-sm' : 'bg-surface-muted border border-border-subtle text-ink-light'}`}>
                      {tier.num}
                    </div>
                    <span className="text-eyebrow text-ink">Level {tier.num}</span>
                  </div>
                  
                  <h3 className="text-2xl font-medium text-ink mb-3 group-hover:text-brand transition-colors">{tier.title}</h3>
                  <p className="text-sm text-ink-light font-sans leading-relaxed relative z-10">{tier.desc}</p>
                  
                  {/* Background Watermark Letter */}
                  <div className="absolute -bottom-8 -left-4 text-9xl font-bold text-surface-muted select-none group-hover:scale-110 group-hover:text-brand-light transition-all duration-700 z-0">
                    {tier.letter}
                  </div>
                  
                  <div className="mt-auto pt-12 text-right relative z-10">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-muted font-sans">Tier</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 
        ========================================
        VOICE AI TUTOR (SPLIT SECTION)
        ========================================
      */}
      <div className="bg-ink text-surface py-24 sm:py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="space-y-8 z-10 relative">
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand font-sans">Voice AI Tutor</h3>
            <h2 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.1]">
              Meet Dolma — <span className="italic text-brand font-light block mt-2">your patient companion.</span>
            </h2>
            <p className="text-lg text-ink-muted font-sans leading-relaxed max-w-md">
              Practice what you learn immediately. Speak naturally and get real-time audio responses and corrections — 24/7, at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 font-sans">
              
              <Show when="signed-out">
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard/chat">
                  <div>
                    <Button variant="primary" className="px-8 py-4 text-[15px] shadow-lg">
                      Talk with Dolma
                    </Button>
                  </div>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard/chat" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-bold transition-all rounded-none bg-brand text-ink hover:bg-amber-400 border border-amber-600 shadow-lg text-center block">
                  Talk with Dolma
                </Link>
              </Show>

              <Link href="/about" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-bold transition-all rounded-none bg-transparent text-surface hover:bg-surface-muted hover:text-ink border border-border-subtle text-center block">
                How it works
              </Link>
            </div>
          </div>

          {/* Right: UI Mockup (STATIC, NO ANIMATIONS, SHARP EDGES) */}
          <div className="relative z-10 hidden md:block">
            <div className="absolute -left-12 -bottom-6 bg-surface p-4 shadow-2xl z-20 border border-border-subtle font-sans">
              <div className="text-eyebrow text-ink-muted mb-1">Weekly Streak</div>
              <div className="text-3xl font-bold text-ink flex items-baseline gap-1">12 <span className="text-sm font-medium text-ink-light">days</span></div>
            </div>

            <div className="bg-surface p-6 md:p-8 shadow-2xl border border-border-subtle">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6 font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-dark flex items-center justify-center text-surface font-serif text-xl shadow-inner">ད</div>
                  <div>
                    <div className="font-bold text-ink text-sm">Dolma</div>
                    <div className="flex items-center gap-1.5 text-eyebrow text-emerald-600 mt-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500"></span> Listening
                    </div>
                  </div>
                </div>
                <div className="text-eyebrow bg-surface-muted px-3 py-1.5 border border-border-subtle">
                  Lesson 4 · Vowels
                </div>
              </div>

              {/* Chat Bubble 1 (Dolma) */}
              <div className="mb-8">
                <div className="bg-surface-muted border border-border-subtle p-5 max-w-[85%]">
                  <div className="text-3xl font-medium text-ink mb-2">ཁྱེད་རང་སྐུ་གཟུགས་བདེ་པོ་ཡིན་པས།</div>
                  <div className="text-sm text-ink-light font-sans italic border-t border-border-subtle pt-2">
                    "How are you today?" — try repeating this.
                  </div>
                </div>
              </div>

              {/* Chat Bubble 2 (User) */}
              <div className="flex justify-end mb-6 font-sans">
                <div className="bg-brand border border-brand-dark text-ink px-5 py-3 shadow-sm font-medium text-[15px]">
                  Khyerang kuzuk depo yin-pä?
                </div>
              </div>

              {/* Feedback Alert */}
              <div className="bg-surface-muted border border-border-subtle p-4 mb-6 font-sans">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-1">
                  <Check size={16} /> Beautiful pronunciation
                </div>
                <div className="text-xs text-ink-light leading-relaxed">
                  Tiny tip: soften the final "pä" — it's an interrogative particle, not stressed.
                </div>
              </div>

              {/* Audio Controls Mockup */}
              <div className="flex items-center gap-4 text-ink-muted bg-surface-muted border border-border-subtle p-3 font-sans">
                <button className="w-8 h-8 bg-surface border border-border-subtle flex items-center justify-center text-ink shadow-sm">
                  <Play size={14} className="fill-current" />
                </button>
                
                {/* Fake Audio Waveform */}
                <div className="flex-1 flex items-center gap-1 h-6">
                   {[40, 70, 30, 90, 60, 40, 80, 50, 100, 30, 20, 60, 80, 40, 20].map((h, i) => (
                     <div key={i} className={`w-1 ${i < 6 ? 'bg-brand' : 'bg-border-subtle'}`} style={{height: `${h}%`}}></div>
                   ))}
                </div>
                
                <span className="text-xs font-medium font-mono">0:04</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 
        ========================================
        THREE FEATURES GRID
        ========================================
      */}
      <div className="bg-paper py-24 px-6 relative border-t border-border-subtle">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          
          <Link href="/dashboard/lessons" className="block group">
            <Card hoverable className="p-10">
              <div className="w-12 h-12 bg-brand flex items-center justify-center mb-8 shadow-sm">
                <Navigation size={22} className="text-ink group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-medium text-ink mb-4 group-hover:text-brand transition-colors">Guided Syllabus</h3>
              <p className="text-ink-light font-sans leading-relaxed">
                Access original textbook materials, grammar notes, and interactive exercises directly in your dashboard.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/chat" className="block group">
            <Card hoverable className="p-10">
              <div className="w-12 h-12 bg-brand flex items-center justify-center mb-8 shadow-sm">
                <Mic size={22} className="text-ink group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-medium text-ink mb-4 group-hover:text-brand transition-colors">Dolma AI Tutor</h3>
              <p className="text-ink-light font-sans leading-relaxed">
                Practice what you learn immediately. Speak naturally and get real-time audio responses and corrections.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/progress" className="block group">
            <Card hoverable className="p-10">
              <div className="w-12 h-12 bg-brand flex items-center justify-center mb-8 shadow-sm">
                <BookOpen size={22} className="text-ink group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-medium text-ink mb-4 group-hover:text-brand transition-colors">Track Progress</h3>
              <p className="text-ink-light font-sans leading-relaxed">
                Watch your vocabulary grow. Maintain your learning streak and master Tibetan grammar step-by-step.
              </p>
            </Card>
          </Link>

        </div>
      </div>

      {/* 
        ========================================
        TESTIMONIAL SECTION
        ========================================
      */}
      <div className="bg-paper py-24 px-6 border-t border-border-subtle">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="text-brand mb-6 font-serif text-6xl leading-none">"</div>
          <h2 className="text-3xl md:text-4xl font-serif italic text-ink leading-relaxed max-w-3xl mb-10">
            The structure I always wished for when learning Tibetan — and Dolma makes daily practice actually joyful.
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand border border-border-strong shadow-sm"></div>
            <div className="text-left font-sans">
              <div className="font-bold text-ink">Sarah Jenkins</div>
              <div className="text-eyebrow text-ink-muted mt-1">Oxford University · Tibetan Studies</div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================
        FOOTER (DARK WITH PRAYER FLAG BORDER)
        ========================================
      */}
      <footer className="bg-ink mt-auto relative font-sans">
        
        {/* The 5 Colors Top Border (Blue, Yellow, Red, White, Green) */}
        <div className="flex w-full h-1.5 opacity-90">
          <div className="flex-1 bg-[#1e3a8a]"></div>
          <div className="flex-1 bg-brand"></div>
          <div className="flex-1 bg-[#b91c1c]"></div>
          <div className="flex-1 bg-surface-muted"></div>
          <div className="flex-1 bg-[#047857]"></div>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand flex items-center justify-center text-ink font-serif text-lg font-bold shadow-sm">
              ད
            </div>
            <span className="font-serif font-medium text-lg text-surface">Dolma AI</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-ink-muted">
            <Link href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand transition-colors">Terms of Service</Link>
          </div>

          <div className="text-xs font-medium text-ink-light">
            &copy; {new Date().getFullYear()} Learn Tibetan UK.
          </div>
          
        </div>
      </footer>

    </div>
  );
}