// app/components/ui/ProgressBar.tsx
import { twMerge } from "tailwind-merge";

interface ProgressBarProps {
  progress: number;
  total?: number;
  className?: string;
  colorClass?: string;
  trackClass?: string;
}

export function ProgressBar({ 
  progress, 
  total = 100, 
  className, 
  colorClass = "bg-brand", 
  trackClass = "bg-ink/10" 
}: ProgressBarProps) {
  // Ensure the progress is between 0 and 100, with a 4% minimum so the bar is always visible
  const percentage = Math.min(Math.max((progress / total) * 100, 4), 100); 

  return (
    <div className={twMerge("h-2 w-full rounded-full overflow-hidden", trackClass, className)}>
      <div 
        className={twMerge("h-full rounded-full transition-all duration-1000 ease-out", colorClass)} 
        style={{ width: `${percentage}%` }} 
      />
    </div>
  );
}