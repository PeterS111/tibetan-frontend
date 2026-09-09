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
      "bg-surface border border-border-subtle rounded-3xl p-6 md:p-8 shadow-sm",
      hoverable && "transition-all duration-200 hover:border-border-strong hover:shadow-md cursor-pointer",
      className
    )}>
      {children}
    </div>
  );
}