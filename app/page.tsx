"use client";

import Link from "next/link";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';
import { ArrowRight, Mic, BookOpen, BrainCircuit } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-200">
      
      {/* HEADER */}
      <header className="px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
            <img src="/dakini.png" alt="Tara AI" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Learn Tibetan UK</span>
        </div>
        
        <nav className="hidden md:flex gap-8 font-semibold text-sm text-slate-600">
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
          <Link href="/donate" className="hover:text-blue-600 transition">Support Us</Link>
          <Link href="/support" className="hover:text-blue-600 transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                Log In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link href="/chat" className="text-sm font-bold bg-green-500 text-white px-5 py-2.5 rounded-full hover:bg-green-600 transition-colors shadow-sm flex items-center gap-2">
              Open Tutor <ArrowRight size={16} />
            </Link>
            <UserButton />
          </Show>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold tracking-wide uppercase mb-2 shadow-sm">
            <BrainCircuit size={16} /> Meet Tara AI
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Master Tibetan with a <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Voice AI Tutor</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Zero-latency voice conversations. Real-time grammar analysis. Official textbook curriculum. Experience the future of language learning.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-lg font-bold bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                  Start Learning <ArrowRight size={20} />
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link href="/chat" className="text-lg font-bold bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                Enter Chat <ArrowRight size={20} />
              </Link>
            </Show>
            <Link href="/about" className="text-lg font-bold bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full hover:bg-slate-50 transition-all">
              Learn More
            </Link>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24 sm:mt-32 w-full px-4">
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-inner"><Mic size={28} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Real-Time Voice</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">Speak naturally. Tara understands and replies with high-quality native audio instantly, dropping English translation where needed.</p>
          </div>
          
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 border border-purple-100 shadow-inner"><BookOpen size={28} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Syllabus Guided</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">Switch to Study Mode to work through official textbook materials step-by-step with guided, interactive grammar lessons.</p>
          </div>
          
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 shadow-inner"><BrainCircuit size={28} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Custom Analysis</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">Paste any Tibetan text. Tara acts as a master grammarian, breaking down syllables, particles, structure, and meaning.</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <img src="/dakini.png" alt="Logo" className="w-6 h-6 rounded-full border border-slate-300" />
            <span className="font-bold text-slate-700 text-sm">Tara AI</span>
          </div>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
          </div>
          <p className="text-sm font-medium text-slate-400">&copy; {new Date().getFullYear()} Learn Tibetan UK.</p>
        </div>
      </footer>
    </div>
  );
}