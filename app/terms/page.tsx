"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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

        <div className="text-eyebrow text-brand-dark mb-4">Legal Information</div>
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-ink">Terms of Service</h1>
        
        <div className="prose prose-stone max-w-none text-ink-light leading-relaxed">
          <p><em>Last updated: September 2026</em></p>
          <p>
            By accessing or using Learn Tibetan UK, you agree to be bound by these Terms of Service.
          </p>
          <h3 className="text-2xl font-serif text-ink mt-8 mb-4">1. Educational Use</h3>
          <p>
            The materials provided on this platform are for educational purposes. We strive for accuracy based on traditional Tibetan scholarship, but the platform is provided "as is" without warranty of any kind.
          </p>
          <h3 className="text-2xl font-serif text-ink mt-8 mb-4">2. User Accounts</h3>
          <p>
            You are responsible for safeguarding your account login credentials. We reserve the right to suspend accounts that abuse the platform or attempt to bypass security systems.
          </p>
          <h3 className="text-2xl font-serif text-ink mt-8 mb-4">3. Intellectual Property</h3>
          <p>
            The design, structure, and original curriculum sequencing of the application are the property of Learn Tibetan UK. Traditional Tibetan vocabulary and historical script structures are, naturally, part of the public domain.
          </p>
        </div>

      </div>
    </div>
  );
}