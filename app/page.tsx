"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { ArrowRight, BookOpen, Mic, Play, Check, Navigation } from "lucide-react";

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
          <span>Based on respected Tibetan textbooks</span>
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
            Our comprehensive curriculum, reading materials, and grammar progression draw on a range of respected Tibetan language textbooks authored by both native Tibetan scholars and internationally recognised Tibetan language experts. By integrating the strengths of these diverse teaching traditions with interactive AI, we provide a robust and highly effective path to fluency that is authentically rooted in Tibetan linguistic traditions and Buddhist values.
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
            <p className="text-stone-500 font-sans text-lg">A clear, step-by-step journey from your first letter to fluent discourse.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { num: "I", letter: "ཀ", title: "Beginner", desc: "Script, phonology, and essential daily greetings." },
              { num: "II", letter: "ཁ", title: "Pre-Intermediate", desc: "Build conversational fluency and tense structures." },
              { num: "III", letter: "ག", title: "Intermediate", desc: "Honorifics, register, and reading short prose." },
              { num: "IV", letter: "ང", title: "Upper-Intermediate", desc: "Navigating philosophical and journalistic texts." },
              { num: "V", letter: "ཅ", title: "Advanced", desc: "Independent reading of canonical texts and poetry." }
            ].map((tier, i) => (
              <Link href="/dashboard/lessons" key={i} className="p-8 bg-white border border-[#e8e4d9] rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 group block text-left">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans ${i === 0 ? 'bg-amber-400 text-stone-900 shadow-sm' : 'bg-[#f8f5ee] border border-[#e8e4d9] text-stone-500'}`}>
                    {tier.num}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-800 font-sans">Level {tier.num}</span>
                </div>
                
                <h3 className="text-2xl font-medium text-stone-900 mb-3 group-hover:text-amber-600 transition-colors">{tier.title}</h3>
                <p className="text-sm text-stone-500 font-sans leading-relaxed relative z-10">{tier.desc}</p>
                
                {/* Background Watermark Letter */}
                <div className="absolute -bottom-8 -left-4 text-9xl font-bold text-stone-100 select-none group-hover:scale-110 group-hover:text-amber-50 transition-all duration-700 z-0">
                  {tier.letter}
                </div>
                
                <div className="mt-auto pt-12 text-right relative z-10">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-300 font-sans">Tier</span>
                </div>
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
      <div className="bg-[#61241a] text-white py-24 sm:py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="space-y-8 z-10 relative">
            <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-500 font-sans">Voice AI Tutor</h3>
            <h2 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.1]">
              Meet Dolma — <span className="italic text-amber-400 font-light block mt-2">your patient companion.</span>
            </h2>
            <p className="text-lg text-white/70 font-sans leading-relaxed max-w-md">
              Practice what you learn immediately. Speak naturally and get real-time audio responses and corrections — 24/7, at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 font-sans">
              
              <Show when="signed-out">
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard/chat">
                  <button className="bg-amber-400 text-stone-900 px-8 py-4 rounded-full font-bold text-[15px] hover:bg-amber-500 transition shadow-lg text-center">
                    Talk with Dolma
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard/chat" className="bg-amber-400 text-stone-900 px-8 py-4 rounded-full font-bold text-[15px] hover:bg-amber-500 transition shadow-lg text-center block">
                  Talk with Dolma
                </Link>
              </Show>

              <Link href="/about" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold text-[15px] hover:bg-white/10 transition text-center block">
                How it works
              </Link>
            </div>
          </div>

          {/* Right: UI Mockup (STATIC, NO ANIMATIONS) */}
          <div className="relative z-10 hidden md:block">
            <div className="absolute -left-12 -bottom-6 bg-white rounded-2xl p-4 shadow-2xl z-20 border border-stone-200 font-sans">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Weekly Streak</div>
              <div className="text-3xl font-bold text-stone-800 flex items-baseline gap-1">12 <span className="text-sm font-medium text-stone-500">days</span></div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-200">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#e8e4d9] pb-4 mb-6 font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#85443d] flex items-center justify-center text-white font-serif text-xl shadow-inner">ད</div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">Dolma</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Listening
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                  Lesson 4 · Vowels
                </div>
              </div>

              {/* Chat Bubble 1 (Dolma) */}
              <div className="mb-8">
                <div className="bg-[#f8f5ee] border border-[#e8e4d9] rounded-2xl rounded-tl-none p-5 max-w-[85%]">
                  <div className="text-3xl font-medium text-stone-800 mb-2">ཁྱེད་རང་སྐུ་གཟུགས་བདེ་པོ་ཡིན་པས།</div>
                  <div className="text-sm text-stone-500 font-sans italic border-t border-stone-200/60 pt-2">
                    "How are you today?" — try repeating this.
                  </div>
                </div>
              </div>

              {/* Chat Bubble 2 (User) */}
              <div className="flex justify-end mb-6 font-sans">
                <div className="bg-amber-400 text-amber-900 rounded-2xl rounded-br-none px-5 py-3 shadow-sm font-medium text-[15px]">
                  Khyerang kuzuk depo yin-pä?
                </div>
              </div>

              {/* Feedback Alert */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 font-sans">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-1">
                  <Check size={16} /> Beautiful pronunciation
                </div>
                <div className="text-xs text-emerald-600/80 leading-relaxed">
                  Tiny tip: soften the final "pä" — it's an interrogative particle, not stressed.
                </div>
              </div>

              {/* Audio Controls Mockup */}
              <div className="flex items-center gap-4 text-stone-400 bg-stone-50 border border-stone-200 p-3 rounded-xl font-sans">
                <button className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#85443d] shadow-sm"><Play size={14} className="fill-current" /></button>
                
                {/* Fake Audio Waveform */}
                <div className="flex-1 flex items-center gap-1 h-6">
                   {[40, 70, 30, 90, 60, 40, 80, 50, 100, 30, 20, 60, 80, 40, 20].map((h, i) => (
                     <div key={i} className={`w-1 rounded-full ${i < 6 ? 'bg-amber-400' : 'bg-stone-300'}`} style={{height: `${h}%`}}></div>
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
      <div className="bg-[#fdfbf7] py-24 px-6 relative border-t border-[#e8e4d9]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          
          <Link href="/dashboard/lessons" className="bg-white p-10 rounded-[1.5rem] border border-[#e8e4d9] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-amber-300 transition-colors group block">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-8 shadow-sm">
              <Navigation size={22} className="text-stone-900 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-medium text-stone-900 mb-4 group-hover:text-amber-600 transition-colors">Guided Syllabus</h3>
            <p className="text-stone-500 font-sans leading-relaxed">
              Access original textbook materials, grammar notes, and interactive exercises directly in your dashboard.
            </p>
          </Link>

          <Link href="/dashboard/chat" className="bg-white p-10 rounded-[1.5rem] border border-[#e8e4d9] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-amber-300 transition-colors group block">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-8 shadow-sm">
              <Mic size={22} className="text-stone-900 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-medium text-stone-900 mb-4 group-hover:text-amber-600 transition-colors">Dolma AI Tutor</h3>
            <p className="text-stone-500 font-sans leading-relaxed">
              Practice what you learn immediately. Speak naturally and get real-time audio responses and corrections.
            </p>
          </Link>

          <Link href="/dashboard/progress" className="bg-white p-10 rounded-[1.5rem] border border-[#e8e4d9] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-amber-300 transition-colors group block">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-8 shadow-sm">
              <BookOpen size={22} className="text-stone-900 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-medium text-stone-900 mb-4 group-hover:text-amber-600 transition-colors">Track Progress</h3>
            <p className="text-stone-500 font-sans leading-relaxed">
              Watch your vocabulary grow. Maintain your learning streak and master Tibetan grammar step-by-step.
            </p>
          </Link>

        </div>
      </div>

      {/* 
        ========================================
        TESTIMONIAL SECTION
        ========================================
      */}
      <div className="bg-[#fdfbf7] py-24 px-6 border-t border-[#e8e4d9]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="text-amber-400 mb-6 font-serif text-6xl leading-none">"</div>
          <h2 className="text-3xl md:text-4xl font-serif italic text-stone-800 leading-relaxed max-w-3xl mb-10">
            The structure I always wished for when learning Tibetan — and Dolma makes daily practice actually joyful.
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-sm"></div>
            <div className="text-left font-sans">
              <div className="font-bold text-stone-900">Sarah Jenkins</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Oxford University · Tibetan Studies</div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================
        FOOTER (DARK WITH PRAYER FLAG BORDER)
        ========================================
      */}
      <footer className="bg-[#1a1512] mt-auto relative font-sans">
        
        {/* The 5 Colors Top Border (Blue, Yellow, Red, White, Green) */}
        <div className="flex w-full h-1.5 opacity-90">
          <div className="flex-1 bg-[#1e3a8a]"></div>
          <div className="flex-1 bg-[#d97706]"></div>
          <div className="flex-1 bg-[#b91c1c]"></div>
          <div className="flex-1 bg-stone-200"></div>
          <div className="flex-1 bg-[#047857]"></div>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-stone-900 font-serif text-lg font-bold shadow-sm">
              ད
            </div>
            <span className="font-serif font-medium text-lg text-stone-200">Dolma AI</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-stone-400">
            <Link href="/privacy" className="hover:text-amber-400 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-400 transition">Terms of Service</Link>
          </div>

          <div className="text-xs font-medium text-stone-500">
            &copy; {new Date().getFullYear()} Learn Tibetan UK.
          </div>
          
        </div>
      </footer>

    </div>
  );
}