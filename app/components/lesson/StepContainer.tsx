// app/components/lesson/StepContainer.tsx

import { ReactNode } from "react";
import { ChevronRight, Check } from "lucide-react";
import { Card } from "@/app/components/ui/Card";
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
}

export function StepContainer({ 
  index, 
  step, 
  status, 
  isExpanded, 
  onToggle, 
  children, 
  onContinue, 
  isLast 
}: StepContainerProps) {
  
  const isUnlocked = status !== "upcoming";

  return (
    <Card className={`p-0 ${!isUnlocked ? 'opacity-60 grayscale bg-surface-muted' : ''}`}>
      <button 
        onClick={onToggle} 
        disabled={!isUnlocked} 
        className="w-full flex items-center p-4 md:p-6 text-left hover:bg-surface-muted transition-colors"
      >
        <div className={`w-12 h-12 flex items-center justify-center border font-serif text-xl mr-5 transition-colors ${
          status === "done" ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
          status === "current" ? 'bg-brand-light text-brand-dark border-amber-300' : 
          'bg-transparent border-border-subtle text-ink-muted'
        }`}>
          {status === "done" ? <Check className="size-5" /> : (index + 1 < 10 ? `0${index + 1}` : index + 1)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-eyebrow">{step.eyebrow}</span>
            {status === "done" && <Badge variant="success">Completed</Badge>}
            {status === "current" && <Badge variant="brand">In Progress</Badge>}
          </div>
          <div className={`text-xl font-serif ${isUnlocked ? 'text-ink' : 'text-ink-muted'}`}>{step.title}</div>
        </div>
        
        <ChevronRight className={`text-ink-muted transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-4 md:p-8 border-t border-border-subtle bg-surface animate-in slide-in-from-top-2 fade-in duration-200">
          {children}

          {!isLast && (
            <div className="mt-10 flex justify-end border-t border-border-strong pt-6">
              <Button onClick={onContinue}>
                Mark complete & continue <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}