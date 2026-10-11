// app/components/ui/InstructionModal.tsx
import { Sparkles, Layers, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  const [render, setRender] = useState(isOpen);

  // Allow time for the slide animation before removing from DOM
  useEffect(() => {
    if (isOpen) setRender(true);
    else {
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center">
      {/* Dark overlay */}
      <div 
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} 
        onClick={onClose} 
      />
      
      {/* Top Sheet Panel (Taps anywhere to close) */}
      <div 
        className={`relative bg-paper rounded-b-[2rem] w-full max-w-md shadow-2xl p-6 sm:p-8 pt-safe transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
        onClick={onClose} 
      >
        <div className="w-12 h-1.5 bg-ink/10 rounded-full mx-auto mb-6"></div>
        
        <h2 className="font-serif text-2xl font-bold text-ink mb-6 text-center">App Guide</h2>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm">
              <Sparkles size={18} />
            </div>
            <p className="text-[14px] leading-relaxed text-ink/90 pt-0.5 font-medium">
              Tap any card to hear its sound and inspect it.
            </p>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm">
              <Layers size={18} />
            </div>
            <p className="text-[14px] leading-relaxed text-ink/90 pt-0.5 font-medium">
              Steps unlock as you continue, but you can peek ahead.
            </p>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-light border border-amber-200/60 flex items-center justify-center shrink-0 text-brand-dark shadow-sm">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-[14px] leading-relaxed text-ink/90 pt-0.5 font-medium">
              Completed steps are marked and stay open for review.
            </p>
          </div>
        </div>
        
        <div className="text-center pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Tap anywhere to dismiss</span>
        </div>
      </div>
    </div>
  );
}