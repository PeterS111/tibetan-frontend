

import { ReactNode } from "react";
import { ChevronDown, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";

interface StepContainerProps {
  index: number;
  step: { eyebrow: string; title: string; description?: string };
  status: "done" | "current" | "upcoming";
  isExpanded: boolean;
  onToggle: () => void;
  onContinue: () => void;
  isLast?: boolean;
  children: ReactNode;
  
  // Optional props to support the pagination seen in the design
  onPrevious?: () => void;
  totalSteps?: number;
}

export function StepContainer({ 
  index, 
  step, 
  status, 
  isExpanded, 
  onToggle, 
  children, 
  onContinue, 
  isLast,
  onPrevious,
  totalSteps
}: StepContainerProps) {
  
  const isUnlocked = status !== "upcoming";
  const stepNumber = index + 1 < 10 ? `0${index + 1}` : index + 1;

  // Determine container styling based on state
  let containerClasses = "flex flex-col transition-all duration-200 border bg-surface ";
  
  if (status === "current") {
    containerClasses += "border-2 border-brand shadow-sm z-10 relative";
  } else if (status === "upcoming") {
    containerClasses += "border-border-subtle bg-[#FAFAFA] opacity-75";
  } else if (status === "done") {
    containerClasses += "border-border-subtle hover:border-ink/20";
  }

  // Determine number box styling
  let numberBoxClasses = "w-12 h-12 flex items-center justify-center font-serif text-lg mr-5 transition-colors ";
  
  if (status === "current") {
    numberBoxClasses += "border border-brand text-brand-dark bg-brand/5";
  } else if (status === "upcoming") {
    numberBoxClasses += "border border-border-subtle text-ink-muted bg-transparent";
  } else if (status === "done") {
    numberBoxClasses += "border border-border-subtle text-ink-light bg-surface-muted";
  }

  return (
    <div className={containerClasses}>
      <button 
        onClick={onToggle} 
        disabled={!isUnlocked} 
        className="w-full flex items-center p-6 text-left group"
      >
        <div className={numberBoxClasses}>
          {status === "done" ? <Check className="size-5 text-ink-light" strokeWidth={2.5} /> : stepNumber}
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-eyebrow group-hover:text-ink-light transition-colors">
              {step.eyebrow}
            </span>
            {status === "done" && <span className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">Completed</span>}
            {status === "current" && <Badge variant="brand">In Progress</Badge>}
            {status === "upcoming" && <span className="text-[9px] font-bold uppercase tracking-widest text-ink-muted">Up Next</span>}
          </div>
          <div className={`text-xl font-serif font-bold ${status === 'upcoming' ? 'text-ink-light' : 'text-ink'}`}>
            {step.title}
          </div>
        </div>
        
        <div className="ml-4 pl-4 border-l border-border-subtle h-8 flex items-center justify-center">
          <ChevronDown className={`text-ink-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
        </div>
      </button>
      
      {isExpanded && (
        <div className="flex flex-col animate-in slide-in-from-top-2 fade-in duration-200">
          
          <div className="p-6 md:p-8 pt-2">
            {children}
          </div>

          <div className={`mt-4 px-6 md:px-8 py-5 flex items-center justify-between border-t ${status === 'current' ? 'border-brand/20' : 'border-border-subtle bg-surface-muted/30'}`}>
            
            {/* Previous Button (if provided) */}
            <div>
              {onPrevious && index > 0 ? (
                <button 
                  onClick={onPrevious}
                  className="flex items-center gap-2 text-sm font-medium text-ink-light hover:text-ink transition-colors"
                >
                  <ChevronLeft className="size-4" /> Previous
                </button>
              ) : (
                <div className="w-20"></div> /* Spacer */
              )}
            </div>

            {/* Step Counter (if provided) */}
            {totalSteps && (
              <div className="text-[11px] font-bold tracking-[0.15em] text-ink-muted">
                {index + 1} / {totalSteps}
              </div>
            )}

            {/* Next / Complete Button */}
            <div>
              {!isLast ? (
                <Button onClick={onContinue} className="px-6 shadow-sm">
                  Mark complete & continue <ChevronRight className="size-4" strokeWidth={2.5} />
                </Button>
              ) : (
                <Button onClick={onContinue} className="px-6 shadow-sm">
                  Finish Unit <Check className="size-4" strokeWidth={2.5} />
                </Button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}