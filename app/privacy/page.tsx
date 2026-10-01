// app/privacy/page.tsx
"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

export default function PrivacyPolicy() {
  const { isNative } = usePlatform();

  return (
    <div className={`min-h-[100dvh] bg-paper text-ink pb-24 ${isNative ? 'pt-12' : 'pt-24'} animate-in fade-in`}>
      <div className="max-w-3xl mx-auto px-6">
        
        <Link 
          href={isNative ? "/dashboard/profile" : "/"} 
          className="inline-flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Back
        </Link>
        
        <h1 className="text-4xl font-serif text-ink mb-6">Privacy Policy</h1>
        
        <div className="text-[17px] text-ink/90 leading-relaxed space-y-8">
          <p className="italic text-ink-muted">Last updated: September 2026</p>
          <p>
            Learn Tibetan UK respects your privacy. We are committed to protecting your personal data and being transparent about what information we hold about you.
          </p>

          <div>
            <h2 className="text-2xl font-serif text-ink mb-4">1. Data We Collect</h2>
            <p>
              We collect the minimum amount of data required to maintain your learning progress. This includes your email address (for authentication purposes) and your curriculum progress metrics (e.g., words known, unlocked lessons).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-ink mb-4">2. How We Use Your Data</h2>
            <p>
              Your data is strictly used to provide the learning service. We do not sell your data, nor do we share it with third-party marketers. Authentication is handled securely by our auth provider, Clerk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-ink mb-4">3. Contact</h2>
            <p>
              If you wish to have your account and all associated data deleted, please contact us at 
              <a href="mailto:p.sm1549c@gmail.com" className="text-brand-dark font-medium hover:underline ml-1.5">
                p.sm1549c@learntibetan.uk
              </a>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}