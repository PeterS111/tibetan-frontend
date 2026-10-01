// app/components/lesson/MobileStepPlayer.tsx
"use client";

import { X, ChevronLeft } from "lucide-react";
import { Button } from "../ui/Button";

interface MobileStepPlayerProps {
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  onContinue: () => void;
  canContinue?: boolean;
  unitContext: string; 
  title: string;       
  children: React.ReactNode;
  continueText?: string;
  hideContinue?: boolean; 
  onPrevious?: () => void; 
}

export function MobileStepPlayer({
  currentStep,
  totalSteps,
  onClose,
  onContinue,
  canContinue = true,
  unitContext,
  title,
  children,
  continueText = "Continue",
  hideContinue = false,
  onPrevious
}: MobileStepPlayerProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-paper h-[100dvh] w-full overflow-hidden text-ink">
      
      {/* 1. Top Bar: Navigation and Segmented Progress Bar */}
      <div className="flex items-center justify-between px-5 py-4 pt-safe shrink-0">
        
        {/* LEFT BUTTON: Back if available, else Close */}
        {onPrevious ? (
          <button 
            onClick={onPrevious} 
            className="p-1 -ml-1 text-ink-muted active:scale-95 transition-transform"
          >
            <ChevronLeft size={28} />
          </button>
        ) : (
          <button 
            onClick={onClose} 
            className="p-1 -ml-1 text-ink-muted active:scale-95 transition-transform"
          >
            <X size={24} />
          </button>
        )}
        
        {/* Segmented Progress Bar [== == -- --] */}
        <div className="flex-1 flex gap-1.5 h-1.5 mx-4">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isActive = idx === currentStep;
            const isPast = idx < currentStep;
            return (
              <div 
                key={idx} 
                className={`flex-1 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-brand shadow-[0_0_8px_rgba(255,182,0,0.5)]' : 
                  isPast ? 'bg-brand' : 'bg-ink/10'
                }`}
              ></div>
            );
          })}
        </div>

        {/* RIGHT BUTTON: Close if Back is on the left, else Spacer to balance flex layout */}
        {onPrevious ? (
          <button 
            onClick={onClose} 
            className="p-1 -mr-1 text-ink-muted active:scale-95 transition-transform"
          >
            <X size={24} />
          </button>
        ) : (
          <div className="w-[32px]"></div> 
        )}
      </div>

      {/* 2. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-40 custom-scrollbar relative">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-light mb-3">
          {unitContext}
        </div>
        
        <h1 className="font-serif text-[28px] text-ink mb-8 leading-tight">
          {title}
        </h1>
        
        {/* Content injects here */}
        <div 
          key={currentStep} 
          className="animate-in slide-in-from-right-8 fade-in duration-300"
        >
          {children}
        </div>
      </div>

      {/* 3. Floating Bottom Continue Button */}
      {!hideContinue && (
        <div className="absolute bottom-0 inset-x-0 p-6 pb-safe bg-gradient-to-t from-paper via-paper to-transparent shrink-0 flex justify-center">
          <Button 
            onClick={onContinue} 
            disabled={!canContinue}
            className="w-full max-w-sm py-[18px] text-[17px] shadow-[0_8px_20px_rgba(255,182,0,0.3)] disabled:shadow-none disabled:bg-ink/10 disabled:text-ink/30 transition-all"
          >
            {continueText}
          </Button>
        </div>
      )}

    </div>
  );
}