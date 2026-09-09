// app/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export function Button({ 
  children, 
  variant = "primary", 
  className, 
  ...props 
}: ButtonProps) {
  
  // Buttons are now pill-shaped and modern, matching the mobile app concept
  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-sm active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand text-ink hover:brightness-95 border-none",
    secondary: "bg-ink text-paper hover:bg-ink-light border-none",
    outline: "bg-surface text-ink border border-border-strong hover:border-ink hover:bg-surface-muted",
    ghost: "bg-transparent text-ink-light hover:text-ink shadow-none",
  };

  return (
    <button className={twMerge(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}