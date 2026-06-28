"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { ArrowRight, Mic, BookOpen, BrainCircuit, Route, GraduationCap, PenTool } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-serif selection:bg-amber-200">
      
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <div 
        className="relative flex flex-col min-h-[90vh] bg-stone-900 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548074698-c114e91f09bb?q=80&w=2000&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-black/65"></div>

        {/* HEADER */}
        <header className="relative z-10 px-6 py-6 flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 shadow-lg">
              <img src="/dakini.png" alt="Dolma AI" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-2xl tracking-wide text-white">Learn Tibetan UK</span>
          </div>
          
          <nav className="hidden md:flex gap-8 font-medium text-lg text-stone-200">
            <Link href="/about" className="hover:text-amber-400 transition">About</Link>
            <Link href="/donate" className="hover:text-amber-400 transition">Support Us</Link>
            <Link href="/support" className="hover:text-amber-400 transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-stone-200 hover:text-amber-400 transition-colors hidden sm:block">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-semibold bg-amber-500 text-stone-900 px-6 py-2.5 rounded-md hover:bg-amber-400 transition-colors shadow-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              {/* NOW POINTS TO DASHBOARD */}
              <Link href="/dashboard" className="text-sm font-bold bg-amber-500 text-stone-900 px-6 py-2.5 rounded-md hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-2">
                Go to Dashboard <ArrowRight size={16} />
              </Link>
              <UserButton />
            </Show>
          </div>
        </header>

        {/* HERO CONTENT */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-6 fade-in duration-700">
            
            <div className="flex justify-center mb-4">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-1 rounded-full text-xs font-bold tracking-[0.15em] uppercase backdrop-blur-sm shadow-sm font-sans">
                A Complete Scholarly Path
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Master Tibetan with a <br className="hidden sm:block" />
              <span className="text-amber-500">Structured Curriculum</span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-light font-sans">
              Progress through five proficiency tiers. Access authentic textbook materials, gamified exercises, and practice conversationally with Dolma, our voice AI tutor.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button className="text-lg font-semibold bg-amber-500 text-stone-900 px-8 py-3.5 rounded-md hover:bg-amber-400 hover:-translate-y-1 transition-all shadow-lg flex items-center gap-2">
                    Start Learning Free
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="text-lg font-semibold bg-amber-500 text-stone-900 px-8 py-3.5 rounded-md hover:bg-amber-400 hover:-translate-y-1 transition-all shadow-lg flex items-center gap-2">
                  Continue Journey
                </Link>
              </Show>
              <Link href="/about" className="text-lg font-semibold bg-transparent text-white border border-stone-400 px-8 py-3.5 rounded-md hover:bg-white/10 transition-all font-sans">
                Explore Curriculum
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* TEXTBOOK CREDIT BANNER */}
      <div className="bg-[#f8f6f0] border-b border-[#e8e4d9] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <BookOpen size={40} className="text-amber-700 mx-auto opacity-80" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-stone-800">Rooted in Authentic Scholarship</h2>
          <p className="text-lg text-stone-600 font-sans leading-relaxed">
            Our comprehensive curriculum, reading materials, and grammar progression are proudly based on the acclaimed Tibetan language textbook by <strong>Franziska Oertle</strong>. By combining her proven traditional pedagogy with interactive AI, we offer a robust and highly effective path to fluency.
          </p>
        </div>
      </div>

      {/* 5 TIERS OF PROGRESSION */}
      <div className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Five Tiers of Proficiency</h2>
            <p className="text-stone-500 font-sans text-lg">A clear, step-by-step journey from your first letter to fluent discourse.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { level: "Level I", title: "Beginner", desc: "Script, phonology, and essential daily greetings." },
              { level: "Level II", title: "Pre-Intermediate", desc: "Build conversational fluency and tense structures." },
              { level: "Level III", title: "Intermediate", desc: "Honorifics, register, and reading short prose." },
              { level: "Level IV", title: "Upper-Intermediate", desc: "Navigating philosophical and journalistic texts." },
              { level: "Level V", title: "Advanced", desc: "Independent reading of canonical texts and poetry." }
            ].map((tier, i) => (
              <div key={i} className="p-6 bg-stone-50 border border-stone-200 rounded-xl hover:border-amber-300 transition-colors flex flex-col h-full">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 font-sans mb-3">{tier.level}</span>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{tier.title}</h3>
                <p className="text-sm text-stone-600 font-sans leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="bg-stone-50 py-24 px-6 border-t border-stone-200">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
          <div className="p-10 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="text-amber-600 mb-6"><Route size={40} strokeWidth={1.5} /></div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Guided Syllabus</h3>
            <p className="text-stone-600 leading-relaxed font-sans">Access original textbook materials, grammar notes, and interactive exercises directly in your dashboard.</p>
          </div>
          
          <div className="p-10 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="text-amber-600 mb-6"><Mic size={40} strokeWidth={1.5} /></div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Dolma AI Tutor</h3>
            <p className="text-stone-600 leading-relaxed font-sans">Practice what you learn immediately. Speak naturally and get real-time audio responses and corrections.</p>
          </div>
          
          <div className="p-10 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="text-amber-600 mb-6"><GraduationCap size={40} strokeWidth={1.5} /></div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Track Progress</h3>
            <p className="text-stone-600 leading-relaxed font-sans">Watch your vocabulary grow. Maintain your learning streak and master Tibetan grammar step-by-step.</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/dakini.png" alt="Logo" className="w-8 h-8 rounded-full border border-stone-300 shadow-sm" />
            <span className="font-bold text-stone-800 text-lg tracking-wide">Dolma AI</span>
          </div>
          <div className="flex gap-8 text-base font-medium text-stone-600 font-sans">
            <Link href="/privacy" className="hover:text-amber-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-600 transition">Terms of Service</Link>
          </div>
          <p className="text-sm font-medium text-stone-400 font-sans">&copy; {new Date().getFullYear()} Learn Tibetan UK.</p>
        </div>
      </footer>
    </div>
  );
}