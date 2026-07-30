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
      "bg-surface border border-border-subtle shadow-sm overflow-hidden p-6 md:p-8 rounded-none",
      hoverable && "transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-md cursor-pointer",
      className
    )}>
      {children}
    </div>
  );
}