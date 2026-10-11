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
  
  // Buttons are now pill-shaped and tactile for a native mobile feel
  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[15px] font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-sm";
  
  
  const variants = {
    // Swapped: Primary is now Dark Blue, Secondary is Yellow
    primary: "bg-ink text-white hover:bg-ink-light",
    secondary: "bg-brand text-ink hover:bg-brand-dark",
  
    outline: "bg-transparent text-ink border border-border-subtle hover:border-ink",
    ghost: "bg-transparent text-ink-light hover:text-ink",
  };

  return (
    <button className={twMerge(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}