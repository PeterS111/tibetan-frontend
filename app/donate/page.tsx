"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";

export default function DonatePage() {
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

        <div className="text-eyebrow text-brand-dark mb-4">Support the Project</div>
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-ink flex items-center gap-4">
          Donate <Heart className="text-brand fill-brand" size={32} />
        </h1>
        
        <div className="space-y-8 text-lg text-ink-light leading-relaxed">
          <p>
            Learn Tibetan UK is a free, open-access platform. We believe that financial barriers should never prevent someone from learning this beautiful and historically significant language.
          </p>
          <p>
            However, maintaining the servers, recording native speaker audio, and developing the curriculum takes significant time and resources. 
          </p>
          <p>
            If this platform has helped you in your studies, please consider making a contribution. Your support directly funds server costs and the development of the Intermediate and Advanced courses.
          </p>
          
          <div className="pt-8">
            <button className="bg-brand hover:bg-[#E5AC00] text-ink font-bold px-8 py-4 text-sm transition-colors shadow-sm">
              Donate via PayPal / Card
            </button>
            <p className="text-xs text-ink-muted mt-4 uppercase tracking-widest font-bold">
              Secure processing — One-time or Monthly
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}