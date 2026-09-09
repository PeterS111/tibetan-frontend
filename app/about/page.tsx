"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

      </div>
    </div>
  );
}