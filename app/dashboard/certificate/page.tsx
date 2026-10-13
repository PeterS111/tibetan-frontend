"use client";

import { useUser } from "@clerk/clerk-react";
import { ChevronLeft, Printer, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { usePlatform } from "@/hooks/usePlatform";

export default function CertificatePage() {
  const { user } = useUser();
  const { isNative } = usePlatform();

  // Get the user's name, fallback to 'Dedicated Scholar' if not set
  const fullName = user?.fullName || user?.firstName || "Dedicated Scholar";
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center py-10 px-4">
      
      {/* Top Bar (Hidden during Print) */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 no-print">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-ink-light hover:text-ink transition-colors">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        {!isNative && (
          <Button onClick={() => window.print()} className="gap-2 px-6">
            <Printer size={16} /> Print / Save as PDF
          </Button>
        )}
      </div>

      {/* The Certificate Itself */}
      <div 
        id="print-certificate" 
        className="relative bg-white w-full max-w-[1000px] aspect-[1.414/1] sm:aspect-[1.3/1] md:aspect-[1.4/1] border-[12px] border-surface-muted shadow-2xl p-4 sm:p-8 flex items-center justify-center overflow-hidden mx-auto print:border-none print:shadow-none"
      >
        {/* Inner Gold Border */}
        <div className="w-full h-full border-[3px] border-brand p-8 sm:p-12 flex flex-col items-center text-center relative z-10">
          
          {/* Faded Background Motif */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
            <span className="font-tibetan text-[30rem] leading-none">ཨ</span>
          </div>

          <div className="relative z-10 flex flex-col items-center w-full h-full">
            <div className="w-16 h-1 bg-brand mb-8 sm:mb-12"></div>
            
            <h3 className="text-[11px] sm:text-[14px] font-bold uppercase tracking-[0.3em] text-ink-muted mb-4">
              Certificate of Completion
            </h3>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink mb-6">
              Learn Tibetan
            </h1>
            
            <p className="font-tibetan text-2xl sm:text-3xl text-brand-dark mb-8 sm:mb-12">
              བོད་སྐད་སློབ་སྦྱོང་།
            </p>

            <p className="text-[13px] sm:text-[15px] font-medium text-ink-light italic mb-4">
              This certifies that
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl text-ink mb-8 sm:mb-12 border-b border-border-strong pb-4 px-12 inline-block">
              {fullName}
            </h2>

            <p className="max-w-xl text-[13px] sm:text-[15px] leading-relaxed text-ink-light mb-auto">
              has successfully completed the <strong>Beginner 1: Foundations</strong> curriculum. 
              They have demonstrated mastery of the thirty consonants, four vowels, superscripts, subscripts, 
              prefixes, suffixes, and the core rules of Tibetan phonology.
            </p>

            {/* Signature & Date Area */}
            <div className="w-full flex items-end justify-between mt-12 sm:mt-0 px-4 sm:px-12">
              <div className="flex flex-col items-center w-40">
                <span className="font-serif text-xl text-ink mb-2">{dateStr}</span>
                <div className="w-full border-t border-border-strong pt-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                  Date
                </div>
              </div>
              
              {/* Gold Seal Element */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-light border-2 border-brand flex items-center justify-center shadow-sm">
                <span className="font-tibetan text-4xl text-brand-dark">༄༅།</span>
              </div>

              <div className="flex flex-col items-center w-40">
                <span className="font-serif text-xl italic text-ink mb-2">Loplao</span>
                <div className="w-full border-t border-border-strong pt-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                  Curriculum Team
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Mobile Hint */}
      {isNative && (
        <p className="mt-8 text-[11px] font-bold uppercase tracking-widest text-ink-muted text-center no-print">
          Take a screenshot to save your certificate!
        </p>
      )}

    </div>
  );
}