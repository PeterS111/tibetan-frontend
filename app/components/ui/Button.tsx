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
  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-none";
  
  const variants = {
    primary: "bg-brand text-ink hover:bg-amber-400 border border-amber-600 shadow-sm",
    secondary: "bg-ink text-white hover:bg-stone-800 shadow-sm",
    outline: "bg-surface text-ink-light border border-border-subtle hover:bg-surface-muted hover:text-ink",
    ghost: "bg-transparent text-ink-light hover:bg-surface-muted hover:text-ink",
  };

  return (
    <button className={twMerge(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}