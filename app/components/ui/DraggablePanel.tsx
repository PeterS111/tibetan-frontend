// app/components/ui/DraggablePanel.tsx
"use client";

import { useState, useRef, useLayoutEffect, useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface DraggablePanelProps {
  rect: DOMRect | null;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function DraggablePanel({ rect, title, onClose, children }: DraggablePanelProps) {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsoLayoutEffect(() => {
    if (!rect || !panelRef.current) return;
    const panelRect = panelRef.current.getBoundingClientRect();
    const panelWidth = panelRect.width || 384; 
    const panelHeight = panelRect.height || 400; 
    const margin = 16;
    const horizontalGap = 80; 
    
    let startX = rect.right + horizontalGap;
    let startY = rect.top;

    if (startX + panelWidth > window.innerWidth) startX = rect.left - panelWidth - horizontalGap;
    if (startX < margin) {
      startX = Math.max(margin, (window.innerWidth - panelWidth) / 2);
      startY = rect.top - panelHeight - margin;
      if (startY < margin) startY = rect.bottom + margin;
    }
    if (startY + panelHeight > window.innerHeight) startY = window.innerHeight - panelHeight - margin;
    if (startY < margin) startY = margin;

    setPosition({ x: startX, y: startY });
  }, [rect]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        ref={panelRef}
        className="absolute pointer-events-auto flex flex-col sm:w-[24rem] w-[calc(100%-2rem)] max-h-[70vh] bg-paper shadow-2xl border border-border-subtle rounded-none overflow-hidden"
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          opacity: position.x === -9999 ? 0 : 1,
          transition: isDragging ? 'none' : 'opacity 0.2s ease-in-out'
        }}
      >
        <div 
          className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-surface shrink-0 cursor-move select-none"
          onPointerDown={(e) => { setIsDragging(true); dragRef.current = { startX: e.clientX, startY: e.clientY, initX: position.x, initY: position.y }; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => { if (!isDragging || !dragRef.current) return; setPosition({ x: dragRef.current.initX + (e.clientX - dragRef.current.startX), y: dragRef.current.initY + (e.clientY - dragRef.current.startY) }); }}
          onPointerUp={(e) => { setIsDragging(false); e.currentTarget.releasePointerCapture(e.pointerId); }}
        >
          <span className="text-eyebrow pointer-events-none">{title}</span>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} onPointerDown={(e) => e.stopPropagation()} className="p-1.5 -mr-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-paper">
          {children}
        </div>
      </div>
    </div>
  );
}