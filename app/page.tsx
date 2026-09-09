"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-brand-light selection:text-brand-dark">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-paper/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
			
		<img src="/icon.png" alt="Learn Tibetan Logo" className="w-9 h-9 object-contain mix-blend-multiply opacity-90" />	
			
            <div className="font-serif font-medium text-lg leading-none text-ink">Learn Tibetan</div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-light">
            <Link href="#curriculum" className="hover:text-ink transition-colors">Curriculum</Link>
            <Link href="#methodology" className="hover:text-ink transition-colors">Methodology</Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-ink hover:text-brand-dark transition-colors">Log In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-brand hover:bg-[#E5AC00] text-ink text-sm font-bold px-5 py-2.5 transition-colors shadow-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="bg-brand hover:bg-[#E5AC00] text-ink text-sm font-bold px-5 py-2.5 transition-colors shadow-sm flex items-center gap-2">
                  Dashboard <ArrowRight size={16} strokeWidth={2} />
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-40 pb-0 relative overflow-hidden flex flex-col items-center text-center px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-light border border-brand/20 text-brand-dark text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0"></span> A complete scholarly path
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif text-ink max-w-4xl mx-auto leading-[1.1] mb-6">
          Master Tibetan with a <br/><span className="text-brand italic">Structured Curriculum</span>
        </h1>
        
        <p className="text-lg text-ink-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Progress through five proficiency tiers. Access authentic textbook materials, 
          master the script, and build a robust vocabulary through spaced repetition.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto bg-brand hover:bg-[#E5AC00] text-ink font-bold px-8 py-4 text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
                Start Learning Free <ArrowRight size={16} />
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-brand hover:bg-[#E5AC00] text-ink font-bold px-8 py-4 text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
                Continue to Dashboard <ArrowRight size={16} />
              </button>
            </Link>
          </SignedIn>
          <Link href="#curriculum" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-transparent border border-border-strong text-ink hover:bg-surface-muted font-bold px-8 py-4 text-sm transition-colors">
              Explore Curriculum
            </button>
          </Link>
        </div>

        <div className="mt-16 text-ink-muted text-sm italic font-serif flex items-center gap-4">
          <span className="font-tibetan text-2xl text-ink-light not-italic">བཀྲ་ཤིས་བདེ་ལེགས།</span> 
          <span className="w-6 h-[1px] bg-border-strong"></span> 
          Tashi Delek — welcome
        </div>

        {/* Minimalist Mountains Vector */}
        <div className="w-full mt-12 opacity-60 pointer-events-none translate-y-1">
          <svg viewBox="0 0 1440 200" className="w-full h-auto drop-shadow-sm" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200V120L150 70L300 140L500 40L750 160L950 60L1200 150L1440 80V200H0Z" fill="#F5F5F5"/>
            <path d="M0 200V150L200 110L400 170L650 90L850 160L1100 110L1440 160V200H0Z" fill="#E7E5E4"/>
            <path d="M300 200V160L450 120L600 180L750 140L900 190L1050 150L1440 190V200H300Z" fill="#D6D3D1"/>
          </svg>
        </div>
      </header>

      
	  {/* METRICS BANNER */}
      <div className="bg-surface border-y border-border-subtle py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 text-center">
           <div>
             <div className="text-2xl font-serif text-ink mb-1">3</div>
             <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-muted">Courses</div>
           </div>
           <div>
             <div className="text-2xl font-serif text-ink mb-1">6</div>
             <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-muted">Levels</div>
           </div>
           <div>
             <div className="text-2xl font-serif text-ink mb-1">70+</div>
             <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-muted">Units</div>
           </div>
        </div>
      </div>
	  

      {/* CURRICULUM SECTION */}
      <section id="curriculum" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <BookOpen className="mx-auto text-brand mb-6" size={32} strokeWidth={1.5} />
          <h2 className="text-4xl font-serif text-ink mb-6">Rooted in Authentic Scholarship</h2>
          <p className="text-ink-light leading-relaxed">
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
		  
            <div key={idx} className="bg-surface border border-border-subtle p-8 flex flex-col h-full hover:border-brand transition-colors group relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-brand text-ink shadow-sm' : 'bg-surface-muted text-ink-muted border border-border-strong'}`}>
                  {item.num}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">{item.level}</span>
              </div>
              <h3 className="text-2xl font-serif text-ink mb-3">{item.title}</h3>
              <p className="text-sm text-ink-light leading-relaxed relative z-10">{item.desc}</p>
              <div className="absolute -bottom-8 -right-4 font-serif text-[10rem] text-surface-muted font-bold opacity-30 group-hover:text-brand-light transition-colors pointer-events-none leading-none">
                {item.num}
              </div>
            </div>
          ))}
        </div>
		
		
      </section>

      {/* FEATURES SECTION */}
      <section id="methodology" className="bg-[#1a2332] text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-6">
                  <Layers className="text-brand" size={24} />
                </div>
                <h3 className="text-xl font-serif mb-3">Guided Syllabus</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Access structured lessons, grammar notes, and interactive exercises directly in your dashboard. Zero guesswork required.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="text-brand" size={24} />
                </div>
                <h3 className="text-xl font-serif mb-3">Spaced Repetition</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Lock vocabulary into your long-term memory. Our built-in review system brings words back right before you forget them.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-brand" size={24} />
                </div>
                <h3 className="text-xl font-serif mb-3">Track Progress</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Watch your vocabulary grow. Maintain your learning streak and master Tibetan grammar step-by-step.
                </p>
              </div>
           </div>
        </div>
      </section>

      {/* TESTIMONIAL / CTA */}
      <section className="py-24 bg-surface text-center px-6">
        <div className="max-w-2xl mx-auto mb-16">
          <div className="text-4xl text-brand font-serif mb-6">"</div>
          <p className="text-2xl md:text-3xl font-serif text-ink italic leading-relaxed mb-8">
            The structure I always wished for when learning Tibetan — it makes daily practice actually joyful.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-dark"></div>
            <div className="text-left">
              <div className="text-sm font-bold text-ink">Sarah Jenkins</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted mt-0.5">Oxford University · Tibetan Studies</div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2332] max-w-4xl mx-auto p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-4">Begin Today</div>
          <h2 className="text-4xl font-serif mb-6 relative z-10">Start with the thirty consonants.</h2>
          <p className="text-slate-300 mb-10 max-w-lg mx-auto relative z-10">
            Beginner 1 is open now, and Beginner 2 continues straight into everyday conversation.
          </p>
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-brand hover:bg-[#E5AC00] text-ink font-bold px-8 py-4 text-sm transition-colors shadow-sm relative z-10">
                Start Beginner 1 Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="relative z-10">
              <button className="bg-brand hover:bg-[#E5AC00] text-ink font-bold px-8 py-4 text-sm transition-colors shadow-sm">
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
      <footer className="bg-ink text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            
		<img src="/icon.png" alt="Learn Tibetan Logo" className="w-8 h-8 object-contain invert mix-blend-screen opacity-70" />	
			
            <span className="text-white font-medium">Learn Tibetan UK</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div className="text-xs opacity-60">
            © {new Date().getFullYear()} Learn Tibetan UK. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}