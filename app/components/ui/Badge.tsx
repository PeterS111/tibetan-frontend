// app/components/ui/Badge.tsx
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "locked" | "brand";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  
  
  // Updated to modern pill badges with soft backgrounds matching the mobile concepts
  const baseClasses = "inline-flex items-center justify-center px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full";
  
  const variants = {
    default: "bg-surface border border-border-strong text-ink-light",
    brand: "bg-brand-light text-ink border border-transparent",
    warning: "bg-brand-light text-ink border border-transparent",
    success: "bg-[#E6F4EA] text-[#1E4620] border border-transparent", // Soft green for completions
    locked: "bg-surface-muted text-ink-muted border border-transparent",
  };

  return (
    <span className={twMerge(baseClasses, variants[variant], className)}>
      {children}
    </span>
  );
}