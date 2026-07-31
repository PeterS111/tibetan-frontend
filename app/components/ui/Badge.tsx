// app/components/ui/Badge.tsx
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "locked" | "brand";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  // Matched exactly to the tiny "IN PROGRESS" and "READY TO START" badges in the screenshots
  const baseClasses = "inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-none";
  
  const variants = {
    default: "bg-surface-muted text-ink-light",
    brand: "bg-brand-light text-brand-dark",
    warning: "bg-orange-50 text-orange-700",
    success: "bg-emerald-50 text-emerald-700",
    locked: "bg-transparent text-ink-muted border border-border-subtle",
  };

  return (
    <span className={twMerge(baseClasses, variants[variant], className)}>
      {children}
    </span>
  );
}