"use client";


import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Globe } from "lucide-react";

export default function AboutPage() {

  const router = useRouter();

  return (
    <div className="min-h-screen bg-paper text-ink p-6 md:p-12 pb-24 font-sans selection:bg-brand-light selection:text-brand-dark">
      <div className="max-w-3xl mx-auto">
        
        {/* Universal Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-ink transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-eyebrow text-brand-dark mb-4">About the Project</div>
        <h1 className="text-4xl md:text-5xl font-serif mb-12 text-ink leading-tight">
          Preserving Tibetan Through a Structured Syllabus
        </h1>
        
        <div className="space-y-8 text-lg text-ink-light leading-relaxed">
          <p>
            <strong className="text-ink font-serif text-xl">Learn Tibetan UK</strong> is dedicated to the preservation, study, and widespread accessibility of the Tibetan language and culture.
          </p>
          <p>
            In an increasingly digital world, minority and endangered languages often struggle to find representation in modern educational technology. Our mission is to bridge this gap by providing a comprehensive, rigorous, and completely free platform for Tibetan language acquisition.
          </p>
          
          <div className="border-l-2 border-brand pl-6 my-10">
            <h3 className="text-2xl font-serif text-ink mb-3">Rooted in Authentic Scholarship</h3>
            <p className="text-base">
              Rather than relying on disjointed flashcards, our curriculum draws on a range of respected Tibetan language textbooks. By integrating the strengths of diverse teaching traditions, we provide a robust path to fluency that is authentically rooted in Tibetan linguistics.
            </p>
          </div>

          <p>
            The platform is structured into <strong className="text-ink">Six Levels of Proficiency</strong> across three main courses. It guides students from their very first encounter with the thirty consonants, straight through everyday conversation, and ultimately into reading complex classical texts.
          </p>
          
		  
		  <p>
            Whether you are an academic researcher, a practitioner of Tibetan Buddhism, or someone exploring their heritage, this platform is built to support your journey without compromise.
          </p>
        </div>

        {/* THE TEAM SECTION */}
        <div className="mt-20 pt-16 border-t border-border-strong">
          <div className="text-eyebrow text-brand-dark mb-4">Project Credits</div>
          <h2 className="text-3xl font-serif text-ink mb-8">The Team</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Lopen Lao Card */}
            <div className="bg-surface border border-border-subtle p-6 flex flex-col gap-6 shadow-sm">
              <div className="w-20 h-20 shrink-0 border border-border-strong bg-white p-2">
                <img src="/icon.png" alt="Lopen Lao" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex flex-col h-full">
                <h3 className="font-serif text-2xl text-ink">Lopen Lao</h3>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mb-4 mt-1">Curriculum & Content</div>
                <p className="text-sm text-ink-light mb-6 leading-relaxed flex-1">
                  Responsible for the traditional Tibetan language curriculum, academic structure, and all educational content.
                </p>
                <div className="flex flex-col gap-3 pt-4 border-t border-border-subtle">
                  <a href="mailto:loplaoacademy@gmail.com" className="inline-flex items-center gap-3 text-xs font-bold text-ink-muted hover:text-ink transition-colors">
                    <Mail size={16} /> loplaoacademy@gmail.com
                  </a>
                  <a href="https://www.loplao.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-xs font-bold text-ink-muted hover:text-ink transition-colors">
                    <Globe size={16} /> www.loplao.com
                  </a>
                </div>
              </div>
            </div>

            {/* Peter Smith Card */}
            <div className="bg-surface border border-border-subtle p-6 flex flex-col gap-6 shadow-sm">
              <div className="w-20 h-20 shrink-0 border border-border-strong bg-[#F5F5F5] overflow-hidden">
                <img src="/peter.jpg" alt="Peter Smith" className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply" />
              </div>
              <div className="flex flex-col h-full">
                <h3 className="font-serif text-2xl text-ink">Peter Smith</h3>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4 mt-1">Lead Developer</div>
                <p className="text-sm text-ink-light mb-6 leading-relaxed flex-1">
                  Programmer and platform architect. Responsible for building the code, native applications, and digital infrastructure.
                </p>
                <div className="flex flex-col gap-3 pt-4 border-t border-border-subtle">
                  <a href="mailto:p.sm1549c@gmail.com" className="inline-flex items-center gap-3 text-xs font-bold text-ink-muted hover:text-ink transition-colors">
                    <Mail size={16} /> p.sm1549c@gmail.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}