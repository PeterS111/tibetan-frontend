"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-ink">Privacy Policy</h1>
        
        <div className="prose prose-stone max-w-none text-ink-light leading-relaxed">
          <p><em>Last updated: September 2026</em></p>
          <p>
            Learn Tibetan UK respects your privacy. We are committed to protecting your personal data and being transparent about what information we hold about you.
          </p>
          <h3 className="text-2xl font-serif text-ink mt-8 mb-4">1. Data We Collect</h3>
          <p>
            We collect the minimum amount of data required to maintain your learning progress. This includes your email address (for authentication purposes) and your curriculum progress metrics (e.g., words known, unlocked lessons).
          </p>
          <h3 className="text-2xl font-serif text-ink mt-8 mb-4">2. How We Use Your Data</h3>
          <p>
            Your data is strictly used to provide the learning service. We do not sell your data, nor do we share it with third-party marketers. Authentication is handled securely by our auth provider, Clerk.
          </p>
          <h3 className="text-2xl font-serif text-ink mt-8 mb-4">3. Contact</h3>
          <p>
            If you wish to have your account and all associated data deleted, please contact us at support@learntibetan.uk.
          </p>
        </div>

      </div>
    </div>
  );
}