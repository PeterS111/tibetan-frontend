"use client";

import Link from "next/link";
import { Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';

export default function DonatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-800 font-serif selection:bg-amber-200">
      
      <header className="px-6 py-4 border-b border-stone-200 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-50 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-300 shadow-sm">
            <img src="/dakini.png" alt="Dolma AI" className="w-full h-full object-cover" />
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight text-stone-800 font-serif">Learn Tibetan UK</Link>
        </div>
        
        <nav className="hidden md:flex gap-8 font-medium text-sm text-stone-600">
          <Link href="/about" className="hover:text-amber-600 transition">About</Link>
          <Link href="/donate" className="text-amber-600 font-semibold transition">Support Us</Link>
          <Link href="/support" className="hover:text-amber-600 transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm font-semibold bg-amber-500 text-stone-900 px-5 py-2.5 rounded-md hover:bg-amber-400 transition-colors shadow-sm">
                Log In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link href="/chat" className="text-sm font-bold bg-amber-500 text-stone-900 px-5 py-2.5 rounded-md hover:bg-amber-400 transition-colors shadow-sm flex items-center gap-2">
              Open Tutor <ArrowRight size={16} />
            </Link>
            <UserButton />
          </Show>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-24">
        <div className="max-w-4xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900">Support Our Mission</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Running ultra-fast AI Voice models and global servers is expensive. If you find value in Dolma AI, please consider supporting the project to keep it accessible for everyone.
          </p>

          <div className="grid md:grid-cols-2 gap-8 pt-12 text-left">
            {/* One Time Donation */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col h-full">
              <h3 className="text-2xl font-bold text-stone-900 mb-2">One-Time Gift</h3>
              <p className="text-stone-500 font-sans mb-8 flex-1">
                Help us cover this month's server costs and API usage with a single contribution.
              </p>
              <button className="w-full bg-stone-900 text-white font-sans font-semibold py-3.5 rounded-xl hover:bg-stone-800 transition shadow-md flex items-center justify-center gap-2">
                Donate Now <ArrowRight size={18} />
              </button>
            </div>

            {/* Monthly Patron */}
            <div className="bg-[#fdfbf7] p-8 rounded-2xl border-2 border-amber-300 shadow-md flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-200 text-amber-800 font-sans text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Become a Patron</h3>
              <p className="text-stone-600 font-sans mb-8 flex-1">
                Ensure the long-term survival of the project. Monthly supporters receive early access to new syllabus modules.
              </p>
              <button className="w-full bg-amber-500 text-stone-900 font-sans font-semibold py-3.5 rounded-xl hover:bg-amber-400 transition shadow-md flex items-center justify-center gap-2">
                Support Monthly <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-stone-400 font-sans text-sm pt-12">
            <ShieldCheck size={16} /> Secure payments processed via Stripe
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-10 px-6 font-sans mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <img src="/dakini.png" alt="Logo" className="w-6 h-6 rounded-full border border-stone-300" />
            <span className="font-bold text-stone-700 text-sm font-serif">Dolma AI</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-stone-500">
            <Link href="/privacy" className="hover:text-amber-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-600 transition">Terms of Service</Link>
          </div>
          <p className="text-sm font-medium text-stone-400">&copy; {new Date().getFullYear()} Learn Tibetan UK.</p>
        </div>
      </footer>
    </div>
  );
}