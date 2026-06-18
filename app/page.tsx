"use client";

import Link from "next/link";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';
import { ArrowRight, Mic, BookOpen, BrainCircuit } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-serif selection:bg-amber-200">
      
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      {/* Note: Replace URL below with your actual mountain/monastery image path like url('/mountain.jpg') */}
      <div 
        className="relative flex flex-col min-h-[90vh] bg-stone-900 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548074698-c114e91f09bb?q=80&w=2000&auto=format&fit=crop')` }}
      >
        {/* Dark overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* HEADER (Transparent over the hero image) */}
        <header className="relative z-10 px-6 py-6 flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 shadow-lg">
              <img src="/dakini.png" alt="Tara AI" className="w-full h-full object-cover" />
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
                <button className="text-sm font-semibold bg-amber-500 text-stone-900 px-6 py-2.5 rounded-md hover:bg-amber-400 transition-colors shadow-sm">
                  Log In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link href="/chat" className="text-sm font-bold bg-amber-500 text-stone-900 px-6 py-2.5 rounded-md hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-2">
                Open Tutor <ArrowRight size={16} />
              </Link>
              <UserButton />
            </Show>
          </div>
        </header>

        {/* HERO CONTENT */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
          <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-6 fade-in duration-700">
            <p className="text-amber-400 font-medium tracking-[0.2em] uppercase text-sm md:text-base">
              Promoting and Advancing Tibetan Language
            </p>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Master Tibetan with a <br className="hidden sm:block" />
              <span className="text-amber-500">Voice AI Tutor</span>
            </h1>
            
            <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-light">
              Zero-latency voice conversations. Real-time grammar analysis. Official textbook curriculum. Experience the future of language learning.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-lg font-semibold bg-amber-500 text-stone-900 px-8 py-3.5 rounded-md hover:bg-amber-400 hover:-translate-y-1 transition-all shadow-lg flex items-center gap-2">
                    Explore Courses
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Link href="/chat" className="text-lg font-semibold bg-amber-500 text-stone-900 px-8 py-3.5 rounded-md hover:bg-amber-400 hover:-translate-y-1 transition-all shadow-lg flex items-center gap-2">
                  Enter Chat
                </Link>
              </Show>
              <Link href="/about" className="text-lg font-semibold bg-transparent text-white border border-stone-400 px-8 py-3.5 rounded-md hover:bg-white/10 transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* FEATURES GRID (Clean, warm white cards) */}
      <div className="bg-stone-50 py-24 px-4 border-t border-stone-200">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
          <div className="p-10 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="text-amber-600 mb-6"><Mic size={40} strokeWidth={1.5} /></div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Real-Time Voice</h3>
            <p className="text-stone-600 leading-relaxed">Speak naturally. Tara understands and replies with high-quality native audio instantly, dropping English translation where needed.</p>
          </div>
          
          <div className="p-10 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="text-amber-600 mb-6"><BookOpen size={40} strokeWidth={1.5} /></div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Syllabus Guided</h3>
            <p className="text-stone-600 leading-relaxed">Switch to Study Mode to work through official textbook materials step-by-step with guided, interactive grammar lessons.</p>
          </div>
          
          <div className="p-10 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="text-amber-600 mb-6"><BrainCircuit size={40} strokeWidth={1.5} /></div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Custom Analysis</h3>
            <p className="text-stone-600 leading-relaxed">Paste any Tibetan text. Tara acts as a master grammarian, breaking down syllables, particles, structure, and meaning.</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/dakini.png" alt="Logo" className="w-8 h-8 rounded-full border border-stone-300 shadow-sm" />
            <span className="font-bold text-stone-800 text-lg tracking-wide">Tara AI</span>
          </div>
          <div className="flex gap-8 text-base font-medium text-stone-600">
            <Link href="/privacy" className="hover:text-amber-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-600 transition">Terms of Service</Link>
          </div>
          <p className="text-sm font-medium text-stone-400">&copy; {new Date().getFullYear()} Learn Tibetan UK.</p>
        </div>
      </footer>
    </div>
  );
}