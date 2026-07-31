
"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { BookOpen, Mic, Play, Check, Navigation } from "lucide-react";

import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Badge } from "./components/ui/Badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-brand-light">
      
      {/* 
        ========================================
        HERO SECTION 
        ========================================
      */}
      <div className="relative flex flex-col w-full overflow-hidden">
        
        {/* Subtle Watermark Letter on the Right */}
        <div className="absolute top-0 right-0 -mr-20 -mt-10 text-[24rem] leading-none font-tibetan text-surface-muted select-none z-0">
          ཨ
        </div>

        {/* HEADER */}
        <header className="relative z-10 px-6 py-6 flex items-center justify-between w-full max-w-7xl mx-auto border-b-2 border-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#8A3022] flex items-center justify-center text-surface font-tibetan text-xl shadow-sm">
              ལ
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-ink">Learn Tibetan UK</span>
          </div>
          
          <nav className="hidden md:flex gap-10 font-medium text-sm text-ink-light tracking-wide">
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
            <Link href="/donate" className="hover:text-ink transition-colors">Support Us</Link>
            <Link href="/support" className="hover:text-ink transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="text-sm font-bold text-ink hover:text-ink-light transition-colors hidden sm:block">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <div>
                  <Button variant="primary" className="rounded-full px-6 py-2 shadow-sm font-bold">
                    Sign Up
                  </Button>
                </div>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className="text-sm font-bold bg-brand text-ink px-6 py-2.5 rounded-full hover:bg-[#E5AC00] transition-colors shadow-sm inline-flex items-center gap-2">
                Dashboard
              </Link>
              <UserButton />
            </Show>
          </div>
        </header>

        {/* HERO CONTENT */}
        <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-12">
          <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-6 fade-in duration-700">
            
            <div className="flex justify-center mb-6">
              <Badge variant="brand" className="px-4 py-1.5 text-[10px] rounded-full border border-brand/20 shadow-sm bg-brand-light">
                <div className="w-1.5 h-1.5 rounded-full bg-brand mr-2"></div> A Complete Scholarly Path
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[5rem] font-bold font-serif text-ink leading-[1.1] tracking-tight">
              Master Tibetan with a <br className="hidden sm:block" />
              <span className="text-brand italic font-medium font-serif tracking-normal">Structured Curriculum</span>
            </h1>
            
            <p className="text-[17px] text-ink-light max-w-2xl mx-auto leading-relaxed font-sans pt-2">
              Progress through five proficiency tiers. Access authentic textbook materials, gamified exercises, and practice conversationally with Dolma, our voice AI tutor.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 font-sans">
              <Show when="signed-out">
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <div>
                    <Button variant="primary" className="w-full sm:w-auto px-8 py-3.5 text-[15px] font-bold rounded-full shadow-md">
                      Start Learning Free
                    </Button>
                  </div>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-bold transition-all rounded-full bg-brand text-ink hover:bg-[#E5AC00] shadow-md">
                  Continue Learning
                </Link>
              </Show>
              <Link href="/about" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-bold transition-all rounded-full bg-surface text-ink-light hover:bg-surface-muted border border-border-subtle shadow-sm">
                Explore Curriculum
              </Link>
            </div>

            <div className="pt-10 flex items-center justify-center gap-3 text-ink-muted text-sm italic font-serif">
              <span className="text-ink-muted text-xl font-tibetan">བཀྲ་ཤིས་བདེ་ལེགས།</span>
              <span className="w-4 h-[1px] bg-border-strong"></span>
              <span className="font-sans text-ink-muted font-medium text-xs tracking-wide not-italic">Tashi Delek — welcome</span>
            </div>
          </div>
        </main>

        {/* GEOMETRIC MOUNTAINS */}
        <div className="w-full relative mt-8 overflow-hidden leading-none z-0">
          <svg viewBox="0 0 1440 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block min-w-[1000px] mx-auto opacity-90">
            {/* Back Layer */}
            <path d="M0 220 L250 80 L550 220 Z" fill="#EAE0D8" />
            <path d="M400 220 L800 50 L1200 220 Z" fill="#EAE0D8" />
            <path d="M1000 220 L1250 120 L1440 220 Z" fill="#EAE0D8" />
            
            {/* Middle Layer */}
            <path d="M-100 220 L200 140 L500 220 Z" fill="#D9B7B0" />
            <path d="M600 220 L950 90 L1300 220 Z" fill="#D9B7B0" />
            
            {/* Front Layer */}
            <path d="M0 220 L100 170 L250 220 Z" fill="#A86E65" />
            <path d="M150 220 L500 120 L850 220 Z" fill="#A86E65" />
            <path d="M800 220 L1150 150 L1440 220 Z" fill="#A86E65" />
            
            {/* Baseline Cover */}
            <rect x="0" y="219" width="1440" height="2" fill="#A86E65" />
          </svg>
        </div>
      </div>

      {/* BANNER TICKER */}
      <div className="bg-paper border-b border-border-subtle py-4 px-6 relative z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[10px] sm:text-[11px] font-bold text-ink-muted uppercase tracking-[0.2em] font-sans">
          <span>Based on the textbook by Franziska Oertle</span>
          <span className="w-1.5 h-1.5 rounded-full bg-border-strong hidden md:block"></span>
          <span>Voice AI Tutor · Dolma</span>
          <span className="w-1.5 h-1.5 rounded-full bg-border-strong hidden lg:block"></span>
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
          <div className="w-12 h-12 mx-auto border-2 border-brand text-brand-dark flex items-center justify-center rounded-full shadow-sm">
            <BookOpen size={20} strokeWidth={2} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-ink tracking-tight">Rooted in Authentic Scholarship</h2>
          <p className="text-[17px] text-ink-light font-sans leading-relaxed">
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
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-ink tracking-tight">Five Tiers of Proficiency</h2>
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
                <Card hoverable className="flex flex-col h-full relative p-6 rounded-3xl border border-border-subtle shadow-sm bg-surface">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans ${i === 0 ? 'bg-brand text-ink shadow-sm' : 'bg-surface-muted border border-border-strong text-ink-muted'}`}>
                      {tier.num}
                    </div>
                    <span className="text-eyebrow text-ink-muted">Level {tier.num}</span>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-ink mb-3 group-hover:text-brand-dark transition-colors">{tier.title}</h3>
                  <p className="text-[13px] text-ink-light font-sans leading-relaxed relative z-10">{tier.desc}</p>
                  
                  {/* Background Watermark Letter */}
                  <div className="absolute bottom-4 left-4 text-6xl font-tibetan text-surface-muted select-none group-hover:scale-110 group-hover:text-border-subtle transition-all duration-700 z-0">
                    {tier.letter}
                  </div>
                  
                  <div className="mt-auto pt-16 text-right relative z-10">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-border-strong font-sans">Tier</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 
        ========================================
        VOICE AI TUTOR (RED SECTION)
        ========================================
      */}
      <div className="bg-[#661E14] text-surface py-24 sm:py-32 px-6 overflow-hidden relative">
        {/* Subtle Background shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#75261A] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#53160E] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 opacity-60"></div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left: Copy */}
          <div className="space-y-8">
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand font-sans">Voice AI Tutor</h3>
            <h2 className="text-5xl md:text-[4rem] font-bold font-serif tracking-tight leading-[1.1]">
              Meet Dolma — <br />
              <span className="italic text-brand font-medium">your patient companion.</span>
            </h2>
            <p className="text-[17px] text-surface/80 font-sans leading-relaxed max-w-md">
              Practice what you learn immediately. Speak naturally and get real-time audio responses and corrections — 24/7, at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 font-sans">
              
              <Show when="signed-out">
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard/chat">
                  <div>
                    <Button variant="primary" className="rounded-full px-8 py-3.5 text-[15px] font-bold shadow-lg">
                      Talk with Dolma
                    </Button>
                  </div>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard/chat" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-bold transition-all rounded-full bg-brand text-ink hover:bg-[#E5AC00] shadow-lg text-center block">
                  Talk with Dolma
                </Link>
              </Show>

              <Link href="/about" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-bold transition-all rounded-full bg-transparent text-surface hover:bg-surface/10 border border-surface/30 text-center block">
                How it works
              </Link>
            </div>
          </div>

          {/* Right: UI Mockup */}
          <div className="relative z-10 hidden md:block">
            {/* Overlay Badge */}
            <div className="absolute -left-6 -bottom-6 bg-surface p-4 rounded-2xl shadow-2xl z-20 font-sans w-32 border border-border-subtle">
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-1 text-center">Weekly Streak</div>
              <div className="text-3xl font-serif font-bold text-ink flex items-baseline justify-center gap-1">12 <span className="text-sm font-medium font-sans text-ink-light">days</span></div>
            </div>

            <div className="bg-surface rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-6 mb-6 font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8A3022] flex items-center justify-center text-surface font-tibetan text-xl shadow-inner">ད</div>
                  <div>
                    <div className="font-bold text-ink text-sm">Dolma</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-muted mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Listening
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                  Step 4 · Vowels
                </div>
              </div>

              {/* Chat Bubble 1 (Dolma) */}
              <div className="mb-6">
                <div className="bg-surface-muted rounded-2xl rounded-tl-none p-5 max-w-[85%] border border-border-subtle">
                  <div className="text-2xl font-bold font-tibetan text-ink mb-2">ཁྱེད་རང་སྐུ་གཟུགས་བདེ་པོ་ཡིན་པས།</div>
                  <div className="text-[13px] text-ink-muted font-sans italic pt-1">
                    "How are you today?" — try repeating this.
                  </div>
                </div>
              </div>

              {/* Chat Bubble 2 (User) */}
              <div className="flex justify-end mb-6 font-sans">
                <div className="bg-brand text-ink rounded-2xl rounded-br-none px-5 py-3 shadow-sm font-medium text-[14px]">
                  Khyerang kuzuk depo yin-pä?
                </div>
              </div>

              {/* Feedback Alert */}
              <div className="bg-surface border border-border-subtle rounded-xl p-4 mb-6 font-sans relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
                <div className="flex items-center gap-2 text-sm font-bold text-ink mb-1 pl-2">
                  <Check size={16} className="text-emerald-500" /> Beautiful pronunciation
                </div>
                <div className="text-xs text-ink-light leading-relaxed pl-2">
                  Tiny tip: soften the final 'pä' — it's an interrogative particle, not stressed.
                </div>
              </div>

              {/* Audio Controls Mockup */}
              <div className="flex items-center gap-4 text-ink-muted bg-surface-muted border border-border-subtle p-3 rounded-full font-sans">
                <button className="w-8 h-8 rounded-full bg-[#661E14] text-surface flex items-center justify-center shadow-sm">
                  <Play size={12} className="fill-current ml-0.5" />
                </button>
                
                {/* Fake Audio Waveform */}
                <div className="flex-1 flex items-center gap-1 h-5">
                   {[40, 70, 30, 90, 60, 40, 80, 50, 100, 30, 20, 60, 80, 40, 20].map((h, i) => (
                     <div key={i} className={`w-1 rounded-full ${i < 6 ? 'bg-[#661E14]' : 'bg-border-strong'}`} style={{height: `${h}%`}}></div>
                   ))}
                </div>
                
                <span className="text-xs font-medium font-mono pr-2">0:04</span>
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
      <div className="bg-paper py-24 px-6 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          
          <Link href="/dashboard/lessons" className="block group">
            <Card hoverable className="p-10 rounded-3xl shadow-sm border border-border-subtle bg-surface">
              <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center mb-8 shadow-sm">
                <Navigation size={20} className="text-ink group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold font-serif text-ink mb-4 group-hover:text-brand-dark transition-colors">Guided Syllabus</h3>
              <p className="text-ink-light font-sans leading-relaxed text-[15px]">
                Access original textbook materials, grammar notes, and interactive exercises directly in your dashboard.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/chat" className="block group">
            <Card hoverable className="p-10 rounded-3xl shadow-sm border border-border-subtle bg-surface">
              <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center mb-8 shadow-sm">
                <Mic size={20} className="text-ink group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold font-serif text-ink mb-4 group-hover:text-brand-dark transition-colors">Dolma AI Tutor</h3>
              <p className="text-ink-light font-sans leading-relaxed text-[15px]">
                Practice what you learn immediately. Speak naturally and get real-time audio responses and corrections.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/progress" className="block group">
            <Card hoverable className="p-10 rounded-3xl shadow-sm border border-border-subtle bg-surface">
              <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center mb-8 shadow-sm">
                <BookOpen size={20} className="text-ink group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold font-serif text-ink mb-4 group-hover:text-brand-dark transition-colors">Track Progress</h3>
              <p className="text-ink-light font-sans leading-relaxed text-[15px]">
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
          <div className="text-brand mb-6 font-serif text-5xl font-bold leading-none">"</div>
          <h2 className="text-3xl md:text-4xl font-serif italic text-ink leading-relaxed max-w-3xl mb-12">
            The structure I always wished for when learning Tibetan — and Dolma makes daily practice actually joyful.
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B45309] shadow-sm"></div>
            <div className="text-left font-sans">
              <div className="font-bold text-ink text-sm">Sarah Jenkins</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mt-0.5">Oxford University · Tibetan Studies</div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================
        FOOTER
        ========================================
      */}
      <footer className="bg-[#242424] mt-auto relative font-sans text-surface">
        
        {/* The 5 Colors Top Border */}
        <div className="flex w-full h-1.5 opacity-100">
          <div className="flex-1 bg-[#1e3a8a]"></div>
          <div className="flex-1 bg-brand"></div>
          <div className="flex-1 bg-[#b91c1c]"></div>
          <div className="flex-1 bg-surface-muted"></div>
          <div className="flex-1 bg-[#047857]"></div>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-ink font-tibetan text-lg shadow-sm">
              ད
            </div>
            <span className="font-serif font-bold text-lg text-surface">Dolma AI</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-ink-muted">
            <Link href="/privacy" className="hover:text-surface transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-surface transition-colors">Terms of Service</Link>
          </div>

          <div className="text-xs font-medium text-ink-light">
            &copy; {new Date().getFullYear()} Learn Tibetan UK.
          </div>
          
        </div>
      </footer>

    </div>
  );
}