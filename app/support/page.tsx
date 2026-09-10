"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-paper text-ink p-6 md:p-12 pb-24 font-sans selection:bg-brand-light selection:text-brand-dark">
      <div className="max-w-3xl mx-auto">
        
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-ink transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-eyebrow text-brand-dark mb-4">Help & Contact</div>
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-ink">Support</h1>
        
        <div className="space-y-8 text-lg text-ink-light leading-relaxed">
          <p>
            Whether you've found a typo in the curriculum, are experiencing a technical bug, or just want to say hello, we are always happy to hear from students.
          </p>
          
          <div className="bg-surface border border-border-subtle p-8 mt-8 shadow-sm">
            <h3 className="text-xl font-serif text-ink mb-4 flex items-center gap-3">
              <Mail className="text-brand" size={24} /> Email Us
            </h3>
            
			
			<p className="text-base mb-6">
              For all inquiries, technical support, and curriculum feedback, please reach out to us directly via email.
            </p>
            <a href="mailto:p.sm1549c@gmail.com" className="inline-block bg-ink text-white hover:bg-ink-light font-bold px-6 py-3 text-sm transition-colors shadow-sm">
              p.sm1549c@gmail.com
            </a>
          </div>
        </div>

      </div>
			
    </div>
  );
}