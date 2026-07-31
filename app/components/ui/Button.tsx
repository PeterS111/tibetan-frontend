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
  // Buttons in the dashboard are extremely flat, sharp, and minimal
  const baseClasses = "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none";
  
  const variants = {
    primary: "bg-brand text-ink hover:bg-[#E5AC00]",
    secondary: "bg-ink text-surface hover:bg-ink-light",
    outline: "bg-transparent text-ink border border-border-subtle hover:border-ink",
    ghost: "bg-transparent text-ink-light hover:text-ink",
  };

  return (
    <button className={twMerge(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}