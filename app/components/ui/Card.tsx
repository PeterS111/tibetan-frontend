// app/components/ui/Card.tsx
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = false }: CardProps) {
  
  return (
    <div className={twMerge(
      "bg-surface border border-border-subtle rounded-[1.25rem] p-6 md:p-8 shadow-sm",
      hoverable && "transition-all duration-200 hover:border-ink hover:shadow-md cursor-pointer active:scale-[0.99]",
      className
    )}>
      {children}
    </div>
  );
  
}