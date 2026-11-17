// app/components/ui/Reveal.tsx
"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            timer = setTimeout(() => {
              setIsVisible(true);
            }, 16);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -36px 0px",
      }
    );

    observer.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={twMerge("loplao-reveal", isVisible && "is-visible", className)}
    >
      {children}
    </div>
  );
}
