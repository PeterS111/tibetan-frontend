import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "locked" | "brand";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const baseClasses = "inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-none";
  
  const variants = {
    default: "bg-surface-muted text-ink-light border border-border-subtle",
    brand: "bg-brand-light text-brand-dark border border-amber-200",
    warning: "bg-rose-50 text-rose-700 border border-rose-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    locked: "bg-stone-200 text-stone-500 border border-stone-300",
  };

  return (
    <span className={twMerge(baseClasses, variants[variant], className)}>
      {children}
    </span>
  );
}