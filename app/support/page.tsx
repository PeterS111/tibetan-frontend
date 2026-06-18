"use client";

import Link from "next/link";
import { Mail, MessageSquarePlus, ArrowRight } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-800 font-serif selection:bg-amber-200">
      
      {/* Light Header for interior pages */}
      <header className="px-6 py-4 border-b border-stone-200 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-50 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-300 shadow-sm">
            <img src="/dakini.png" alt="Tara AI" className="w-full h-full object-cover" />
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight text-stone-800 font-serif">Learn Tibetan UK</Link>
        </div>
        
        <nav className="hidden md:flex gap-8 font-medium text-sm text-stone-600">
          <Link href="/about" className="hover:text-amber-600 transition">About</Link>
          <Link href="/donate" className="hover:text-amber-600 transition">Support Us</Link>
          <Link href="/support" className="text-amber-600 font-semibold transition">Contact</Link>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <Link href="/" className="text-amber-600 hover:text-amber-700 font-sans text-sm font-medium mb-8 flex items-center gap-2 transition-colors self-start max-w-4xl mx-auto w-full">
           &larr; Back to Home
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 sm:p-12 max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Support & Contact</h1>
          <p className="text-lg text-stone-600 mb-12 font-sans max-w-2xl leading-relaxed">
            Need assistance with your Tara AI account, encountered a bug, or have a feature request? We are here to help.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Card */}
            <div className="p-8 rounded-xl bg-[#fdfbf7] border border-stone-200 hover:border-amber-300 transition-colors group">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h2 className="text-xl font-bold text-stone-800 mb-2">Email Us</h2>
              <a href="mailto:support@learntibetan.uk" className="text-amber-600 font-sans font-medium hover:underline block mb-4">
                support@learntibetan.uk
              </a>
              <p className="text-stone-500 font-sans text-sm">We typically reply within 24 hours.</p>
            </div>

            {/* In-App Feedback Card */}
            <div className="p-8 rounded-xl bg-white border border-stone-200 hover:border-amber-300 transition-colors group">
              <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquarePlus size={24} />
              </div>
              <h2 className="text-xl font-bold text-stone-800 mb-2">In-App Feedback</h2>
              <p className="text-stone-800 font-sans font-medium mb-4">
                Use the Feedback Icon
              </p>
              <p className="text-stone-500 font-sans text-sm leading-relaxed">
                Click the message bubble inside the chat app to report bugs directly.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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