"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-brand-light selection:text-brand-dark overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-paper/90 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Learn Tibetan Logo" className="w-9 h-9 object-contain mix-blend-multiply opacity-90" />	
            <div className="font-serif font-medium text-lg leading-none text-ink">Loplao</div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-light">
            <Link href="#curriculum" className="hover:text-ink transition-colors">Curriculum</Link>
            <Link href="#methodology" className="hover:text-ink transition-colors">Methodology</Link>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-ink hover:text-brand-dark transition-colors">Log In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-brand hover:brightness-95 text-ink text-sm font-bold px-6 py-2.5 transition-all shadow-sm rounded-full active:scale-95">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="bg-brand hover:brightness-95 text-ink text-sm font-bold px-6 py-2.5 transition-all shadow-sm flex items-center gap-2 rounded-full active:scale-95">
                  Dashboard <ArrowRight size={16} strokeWidth={2} />
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-40 pb-0 relative flex flex-col items-center text-center">
        <div className="px-6 relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-light text-ink text-[10px] font-bold uppercase tracking-[0.2em] mb-8 rounded-full shadow-sm border border-brand/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0"></span> A complete scholarly path
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif text-ink leading-[1.1] mb-6">
            Master Tibetan with a <br/><span className="text-brand italic">Structured Curriculum</span>
          </h1>
          
          <p className="text-lg text-ink-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Progress through five proficiency tiers. Access authentic textbook materials, 
            master the script, and build a robust vocabulary through spaced repetition.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto bg-brand hover:brightness-95 text-ink font-bold px-8 py-4 text-sm transition-all shadow-sm flex items-center justify-center gap-2 rounded-full active:scale-95">
                  Start Learning Free <ArrowRight size={16} />
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-brand hover:brightness-95 text-ink font-bold px-8 py-4 text-sm transition-all shadow-sm flex items-center justify-center gap-2 rounded-full active:scale-95">
                  Continue to Dashboard <ArrowRight size={16} />
                </button>
              </Link>
            </SignedIn>
            <Link href="#curriculum" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-surface border border-border-subtle text-ink hover:border-border-strong font-bold px-8 py-4 text-sm transition-all shadow-sm rounded-full active:scale-95">
                Explore Curriculum
              </button>
            </Link>
          </div>

          <div className="mt-12 text-ink-muted text-sm italic font-serif flex items-center justify-center gap-4">
            <span className="font-tibetan text-2xl text-ink-light not-italic">བཀྲ་ཤིས་བདེ་ལེགས།</span> 
            <span className="w-6 h-[1px] bg-border-strong"></span> 
            Tashi Delek — welcome
          </div>
        </div>

        {/* HIMALAYAN LANDSCAPE ARTWORK */}
        <div className="w-full mt-8 pointer-events-none relative z-0 flex justify-center">
          {/* NOTE: Make sure your image is named hero-landscape.jpg and is in the public/ folder! */}
          <img 
            src="/hero-landscape.jpg" 
            alt="Himalayan Landscape" 
            className="w-full max-w-7xl object-cover h-[30vh] md:h-[40vh] object-bottom mix-blend-multiply opacity-90" 
          />
        </div>
      </header>

      {/* METRICS BANNER */}
      <div className="bg-surface border-y border-border-subtle py-8 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 text-center">
           <div>
             <div className="text-3xl font-serif text-ink mb-1">3</div>
             <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">Courses</div>
           </div>
           <div>
             <div className="text-3xl font-serif text-ink mb-1">6</div>
             <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">Levels</div>
           </div>
           <div>
             <div className="text-3xl font-serif text-ink mb-1">70+</div>
             <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">Units</div>
           </div>
        </div>
      </div>

      {/* CURRICULUM SECTION */}
      <section id="curriculum" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <BookOpen className="mx-auto text-brand mb-6" size={32} strokeWidth={1.5} />
          <h2 className="text-4xl font-serif text-ink mb-6">Rooted in Authentic Scholarship</h2>
          <p className="text-ink-light leading-relaxed text-lg">
            Our comprehensive curriculum, reading materials, and grammar progression draw on a range 
            of respected Tibetan language textbooks. By integrating the strengths of diverse 
            teaching traditions, we provide a robust path to fluency that is authentically rooted in 
            Tibetan linguistic traditions.
          </p>
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-serif text-ink mb-2">Six Levels of Proficiency</h2>
          <p className="text-sm text-ink-muted">A clear, step-by-step journey from your first letter to fluent discourse.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { num: "I",   level: "LEVEL 1", title: "Beginner 1",         desc: "Script, phonology, and foundations." },
            { num: "II",  level: "LEVEL 2", title: "Beginner 2",         desc: "Essential daily greetings and conversation." },
            { num: "III", level: "LEVEL 3", title: "Pre-Intermediate",   desc: "Build conversational fluency and tense structures." },
            { num: "IV",  level: "LEVEL 4", title: "Intermediate",       desc: "Honorifics, register, and reading short prose." },
            { num: "V",   level: "LEVEL 5", title: "Upper-Intermediate", desc: "Navigating philosophical and journalistic texts." },
            { num: "VI",  level: "LEVEL 6", title: "Advanced",           desc: "Independent reading of canonical texts and poetry." }
          ].map((item, idx) => (  
            <div key={idx} className="bg-surface border border-border-subtle p-8 flex flex-col h-full hover:border-border-strong hover:shadow-md transition-all rounded-3xl group relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-brand text-ink shadow-sm' : 'bg-surface-muted text-ink-muted border border-border-subtle'}`}>
                  {item.num}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">{item.level}</span>
              </div>
              <h3 className="text-2xl font-serif text-ink mb-3">{item.title}</h3>
              <p className="text-sm text-ink-light leading-relaxed relative z-10">{item.desc}</p>
              <div className="absolute -bottom-8 -right-4 font-serif text-[10rem] text-surface-muted font-bold opacity-50 group-hover:text-border-subtle transition-colors pointer-events-none leading-none">
                {item.num}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION (Updated to Deep Blue) */}
      <section id="methodology" className="bg-ink text-paper py-24">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Layers className="text-brand" size={24} />
                </div>
                <h3 className="text-xl font-serif mb-3">Guided Syllabus</h3>
                <p className="text-sm text-paper/70 leading-relaxed">
                  Access structured lessons, grammar notes, and interactive exercises directly in your dashboard. Zero guesswork required.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="text-brand" size={24} />
                </div>
                <h3 className="text-xl font-serif mb-3">Spaced Repetition</h3>
                <p className="text-sm text-paper/70 leading-relaxed">
                  Lock vocabulary into your long-term memory. Our built-in review system brings words back right before you forget them.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-brand" size={24} />
                </div>
                <h3 className="text-xl font-serif mb-3">Track Progress</h3>
                <p className="text-sm text-paper/70 leading-relaxed">
                  Watch your vocabulary grow. Maintain your learning streak and master Tibetan grammar step-by-step.
                </p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA SECTION (Updated to Deep Blue & Gold) */}
      <section className="py-24 bg-surface text-center px-6">
        <div className="bg-ink rounded-3xl max-w-4xl mx-auto p-12 md:p-16 text-center text-paper relative overflow-hidden shadow-xl">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-4">Begin Today</div>
          <h2 className="text-4xl font-serif mb-6 relative z-10">Start with the thirty consonants.</h2>
          <p className="text-paper/80 mb-10 max-w-lg mx-auto relative z-10">
            Beginner 1 is open now, and Beginner 2 continues straight into everyday conversation.
          </p>
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-brand hover:brightness-95 text-ink font-bold px-8 py-4 text-sm transition-all shadow-sm relative z-10 rounded-full active:scale-95">
                Start Beginner 1 Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="relative z-10">
              <button className="bg-brand hover:brightness-95 text-ink font-bold px-8 py-4 text-sm transition-all shadow-sm rounded-full active:scale-95">
                Open Dashboard
              </button>
            </Link>
          </SignedIn>

          {/* Decorative watermark */}
          <div className="absolute -bottom-20 -right-10 text-[16rem] font-tibetan text-white/5 pointer-events-none">
            ཀ
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-paper/60 py-12 border-t border-white/10 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Learn Tibetan Logo" className="w-8 h-8 object-contain invert mix-blend-screen opacity-70" />	
            <span className="text-paper font-medium">Loplao</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-medium">
            <Link href="/about" className="hover:text-paper transition-colors">About</Link>
            <Link href="/support" className="hover:text-paper transition-colors">Support</Link>
            <Link href="/donate" className="hover:text-brand-light transition-colors text-brand">Donate</Link>
            <Link href="/privacy" className="hover:text-paper transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-paper transition-colors">Terms of Service</Link>
          </div>
          <div className="text-xs opacity-60">
            © {new Date().getFullYear()} Loplao. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}