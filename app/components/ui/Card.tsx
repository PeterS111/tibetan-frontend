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
      "bg-surface border border-border-subtle rounded-none p-6 md:p-8",
      hoverable && "transition-colors duration-200 hover:border-ink cursor-pointer",
      className
    )}>
      {children}
    </div>
  );
}