// app/components/ui/StatCard.tsx
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
  valueClass?: string;
}

export function StatCard({ title, value, icon, subtitle, className, valueClass }: StatCardProps) {
  return (
    <div className={twMerge("bg-surface border border-border-subtle rounded-[1.25rem] p-5 shadow-sm flex flex-col", className)}>
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="text-brand-dark flex-shrink-0">{icon}</div>}
        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted truncate">{title}</div>
      </div>
      <div className={twMerge("font-serif text-3xl text-ink mb-1", valueClass)}>{value}</div>
      {subtitle && <div className="text-xs font-medium text-ink-light truncate">{subtitle}</div>}
    </div>
  );
}