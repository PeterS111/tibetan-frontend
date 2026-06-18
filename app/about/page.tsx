"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-800 font-serif selection:bg-amber-200">
      
      <header className="px-6 py-4 border-b border-stone-200 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-50 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-300 shadow-sm">
            <img src="/dakini.png" alt="Tara AI" className="w-full h-full object-cover" />
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight text-stone-800 font-serif">Learn Tibetan UK</Link>
        </div>
        
        <nav className="hidden md:flex gap-8 font-medium text-sm text-stone-600">
          <Link href="/about" className="text-amber-600 font-semibold transition">About</Link>
          <Link href="/donate" className="hover:text-amber-600 transition">Support Us</Link>
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
        <div className="max-w-3xl w-full space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
              Preserving Tibetan <br/> Through Technology
            </h1>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-6"></div>
          </div>

          <div className="prose prose-stone prose-lg max-w-none text-stone-700 leading-relaxed space-y-6 bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-stone-200">
            <p>
              <strong>Learn Tibetan UK</strong> is dedicated to the preservation, study, and widespread accessibility of the Tibetan language and culture. 
            </p>
            <p>
              In an increasingly digital world, minority and endangered languages often struggle to find representation in modern educational technology. Our mission is to bridge this gap by bringing state-of-the-art Artificial Intelligence to the realm of Tibetan language acquisition.
            </p>
            <h3 className="text-2xl font-bold text-stone-900 mt-8 mb-4">Tara AI: The First of Its Kind</h3>
            <p>
              Tara is an advanced, multilingual AI Voice Tutor trained on official textbook curricula. By utilizing zero-latency voice models and cutting-edge grammatical analysis, Tara allows students from across the globe to practice conversational Tibetan as if they were speaking with a native instructor.
            </p>
            <p>
              Whether you are an academic researcher, a practitioner of Tibetan Buddhism, or someone exploring their heritage, this platform is built to support your journey.
            </p>
          </div>

        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-10 px-6 font-sans mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <img src="/dakini.png" alt="Logo" className="w-6 h-6 rounded-full border border-stone-300" />
            <span className="font-bold text-stone-700 text-sm font-serif">Tara AI</span>
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