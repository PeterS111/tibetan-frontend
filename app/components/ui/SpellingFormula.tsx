// app/components/ui/SpellingFormula.tsx
import React from "react";

/**
 * CENTRALIZED IMAGE CONFIGURATION
 * Adjust the sizing (w-6, h-6), alignment (object-bottom), 
 * or padding/margins here. It will instantly update across ALL lessons.
 */
export const MARK_CONFIG: Record<string, { src: string; imgClass: string }> = {
  'ི': { src: '/image_i.png',     imgClass: 'h-8 w-8 object-top' },
  'ུ': { src: '/image_u.png',     imgClass: 'h-8 w-8 object-bottom' },
  'ེ': { src: '/image_e.png',     imgClass: 'h-8 w-8 object-top' },
  'ོ': { src: '/image_o.png',     imgClass: 'h-8 w-8 object-top' },
  'ྱ': { src: '/image_yatak.png', imgClass: 'h-8 w-8 object-bottom' },
  'ྲ': { src: '/image_ratak.png', imgClass: 'h-8 w-8 object-bottom' },
  'ྭ': { src: '/image_wazur.png', imgClass: 'h-8 w-8 object-bottom' },
};

interface TibetanPartProps {
  part: string;
  isNightMode?: boolean;
  textClass?: string;
}

export function TibetanPart({ part, isNightMode = false, textClass = "text-[1.75rem]" }: TibetanPartProps) {
  const cleanPart = part.trim();
  
  // 1. If it's in our dictionary, render the image perfectly sized
  if (MARK_CONFIG[cleanPart]) {
    const { src, imgClass } = MARK_CONFIG[cleanPart];
    return (
      <img 
        src={src} 
        alt="Tibetan mark" 
        className={`object-contain ${imgClass}`}
        style={{ filter: isNightMode ? 'invert(1) brightness(2)' : 'none' }}
      />
    );
  }

  // 2. If it's a subjoined consonant (like ྐ), mathematically convert it back to a base letter (ཀ)
  let displayPart = cleanPart;
  if (displayPart.length === 1) {
    const charCode = displayPart.charCodeAt(0);
    if (charCode >= 0x0F90 && charCode <= 0x0FBC) {
      displayPart = String.fromCharCode(charCode - 0x0050);
    }
  }

  // 3. Render standard text, sitting flat on the baseline
  return (
    <span className={`font-tibetan leading-none pt-1 ${textClass}`} style={{ color: isNightMode ? '#fff' : 'inherit' }}>
      {displayPart}
    </span>
  );
}

interface SpellingFormulaProps {
  parts: string; 
  isNightMode?: boolean;
  textClass?: string;
}

export function SpellingFormula({ parts, isNightMode = false, textClass }: SpellingFormulaProps) {
  const tokens = parts.split(' + ');

  return (
    <span className="flex flex-wrap items-center justify-center gap-y-3">
      {tokens.map((part, idx) => (
        <div key={idx} className="flex items-center gap-2 md:gap-3">
          {idx > 0 && <span className={`text-lg font-sans opacity-40 mt-1 ${isNightMode ? "text-stone-400" : "text-ink-light"}`}>+</span>}
          {/* min-w-[28px] and px-1 guarantees generous spacing around the plus signs */}
          <span className="flex items-center justify-center min-w-[28px] px-1">
            <TibetanPart part={part} isNightMode={isNightMode} textClass={textClass} />
          </span>
        </div>
      ))}
    </span>
  );
}