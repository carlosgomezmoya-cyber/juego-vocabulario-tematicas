import React from 'react';
import { WordItem } from '../types';

interface CardProps {
  item: WordItem;
  status: 'idle' | 'correct' | 'incorrect';
  isLocked: boolean;
  onSelect: (item: WordItem) => void;
  index: number;
}

const RIBBON_COLORS = [
  'bg-sky-500 hover:bg-sky-600 border-sky-600',
  'bg-sky-600 hover:bg-sky-700 border-sky-700',
  'bg-amber-500 hover:bg-amber-600 border-amber-600',
];

export const Card: React.FC<CardProps> = ({ item, status, isLocked, onSelect, index }) => {
  const ribbonColor = RIBBON_COLORS[index % RIBBON_COLORS.length];

  let cardBorder = 'border-transparent hover:border-sky-400 shadow-2xl';
  let ribbonBg = ribbonColor;

  if (status === 'correct') {
    cardBorder = 'border-emerald-500 ring-8 ring-emerald-200/80 scale-105 shadow-2xl transition-all duration-200';
    ribbonBg = 'bg-emerald-500 border-emerald-600';
  } else if (status === 'incorrect') {
    cardBorder = 'border-rose-500 ring-8 ring-rose-200/80 animate-shake shadow-2xl';
    ribbonBg = 'bg-rose-500 border-rose-600';
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    onSelect(item);
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onContextMenu={(e) => e.preventDefault()}
      disabled={isLocked}
      aria-label={`Tarjeta: ${item.word}`}
      className={`
        relative w-full flex-1 flex flex-col bg-white rounded-[32px] sm:rounded-[40px] border-8
        overflow-hidden transition-all transform active:scale-95 touch-none cursor-pointer select-none
        min-h-[260px] sm:min-h-[320px] lg:min-h-[360px]
        ${cardBorder}
        ${isLocked ? 'pointer-events-none opacity-90' : 'active:translate-y-1'}
      `}
    >
      {/* Visual Indicator Badge on Correct */}
      {status === 'correct' && (
        <div className="absolute top-4 right-4 z-10 bg-emerald-500 text-white p-3 sm:p-4 rounded-full shadow-lg text-3xl sm:text-4xl animate-bounce border-4 border-white">
          ✨
        </div>
      )}

      {/* Visual Indicator Badge on Incorrect */}
      {status === 'incorrect' && (
        <div className="absolute top-4 right-4 z-10 bg-rose-500 text-white p-3 sm:p-4 rounded-full shadow-lg text-3xl sm:text-4xl border-4 border-white">
          🤔
        </div>
      )}

      {/* Giant Central Emoji Display */}
      <div className="flex-1 flex items-center justify-center p-4 bg-white">
        <span className="text-8xl sm:text-9xl md:text-[130px] lg:text-[150px] filter drop-shadow-md transition-transform duration-200 hover:scale-105">
          {item.emoji}
        </span>
      </div>

      {/* High Contrast Immersive Bottom Ribbon */}
      <div className={`h-24 sm:h-28 md:h-32 w-full ${ribbonBg} flex items-center justify-center px-4 border-t-4 shadow-inner`}>
        <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-widest uppercase text-center font-['Outfit'] drop-shadow-md">
          {item.word}
        </span>
      </div>
    </button>
  );
};

