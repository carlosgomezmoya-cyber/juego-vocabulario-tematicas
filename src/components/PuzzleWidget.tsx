import React, { useState } from 'react';
import { PuzzleTheme } from '../types';
import { Sparkles, Star } from 'lucide-react';

interface PuzzleWidgetProps {
  theme: PuzzleTheme;
  gridSize: 6 | 9; // 6 = 2x3 grid, 9 = 3x3 grid
  unlockedCount: number;
  totalHits: number;
  className?: string;
}

export const PuzzleWidget: React.FC<PuzzleWidgetProps> = ({
  theme,
  gridSize,
  unlockedCount,
  totalHits,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const cols = 3;
  const rows = gridSize === 6 ? 2 : 3;
  const totalPieces = gridSize;

  // Local image paths per user request
  const themeImageSrc =
    theme === 'doraemon'
      ? 'puzzle_doraemon_1777708203430.png'
      : theme === 'bluey'
      ? 'puzzle_bluey_1777756489789.png'
      : '';

  // Fallback SVG artwork generators
  const renderFallbackSvg = () => {
    if (theme === 'doraemon') {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover bg-sky-300">
          <rect width="400" height="300" fill="#38bdf8" />
          <circle cx="200" cy="160" r="110" fill="#0284c7" />
          <circle cx="200" cy="170" r="90" fill="#ffffff" />
          <circle cx="175" cy="110" r="28" fill="#ffffff" stroke="#000" strokeWidth="4" />
          <circle cx="225" cy="110" r="28" fill="#ffffff" stroke="#000" strokeWidth="4" />
          <circle cx="182" cy="115" r="7" fill="#000" />
          <circle cx="218" cy="115" r="7" fill="#000" />
          <circle cx="200" cy="138" r="14" fill="#dc2626" />
          <path d="M 200 152 L 200 200 M 150 185 Q 200 230 250 185" stroke="#000" strokeWidth="4" fill="none" />
          <line x1="120" y1="135" x2="170" y2="145" stroke="#000" strokeWidth="3" />
          <line x1="110" y1="155" x2="168" y2="158" stroke="#000" strokeWidth="3" />
          <line x1="120" y1="175" x2="170" y2="170" stroke="#000" strokeWidth="3" />
          <line x1="280" y1="135" x2="230" y2="145" stroke="#000" strokeWidth="3" />
          <line x1="290" y1="155" x2="232" y2="158" stroke="#000" strokeWidth="3" />
          <line x1="280" y1="175" x2="230" y2="170" stroke="#000" strokeWidth="3" />
          <text x="200" y="45" textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="bold">DORAEMON 🔔</text>
        </svg>
      );
    }
    if (theme === 'bluey') {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover bg-amber-100">
          <rect width="400" height="300" fill="#bae6fd" />
          <rect x="0" y="220" width="400" height="80" fill="#4ade80" />
          <rect x="110" y="90" width="80" height="130" rx="40" fill="#38bdf8" stroke="#0284c7" strokeWidth="6" />
          <rect x="210" y="110" width="70" height="110" rx="35" fill="#fb923c" stroke="#c2410c" strokeWidth="6" />
          <circle cx="135" cy="130" r="10" fill="#fff" />
          <circle cx="165" cy="130" r="10" fill="#fff" />
          <circle cx="137" cy="130" r="4" fill="#000" />
          <circle cx="163" cy="130" r="4" fill="#000" />
          <circle cx="232" cy="145" r="8" fill="#fff" />
          <circle cx="258" cy="145" r="8" fill="#fff" />
          <circle cx="233" cy="145" r="3" fill="#000" />
          <circle cx="257" cy="145" r="3" fill="#000" />
          <text x="200" y="50" textAnchor="middle" fill="#0369a1" fontSize="28" fontWeight="extrabold">BLUEY Y BINGO 🐾</text>
        </svg>
      );
    }
    if (theme === 'safari') {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover bg-amber-200">
          <rect width="400" height="300" fill="#fef08a" />
          <circle cx="130" cy="170" r="60" fill="#fbbf24" />
          <circle cx="270" cy="160" r="50" fill="#a855f7" />
          <text x="200" y="50" textAnchor="middle" fill="#78350f" fontSize="26" fontWeight="bold">SAFARI ANIMALES 🦁🐘</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full object-cover bg-purple-200">
        <rect width="400" height="300" fill="#e0e7ff" />
        <polygon points="200,40 230,120 310,120 245,170 270,250 200,200 130,250 155,170 90,120 170,120" fill="#f59e0b" />
        <text x="200" y="280" textAnchor="middle" fill="#4338ca" fontSize="26" fontWeight="bold">ESTRELLAS MÁGICAS ⭐</text>
      </svg>
    );
  };

  const pieces = Array.from({ length: totalPieces }, (_, i) => i);

  return (
    <div className={`bg-white rounded-3xl p-3 sm:p-4 border-4 border-sky-300 shadow-xl w-full select-none ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-sky-950 font-black text-sm sm:text-base font-['Outfit']">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400" />
          <span className="uppercase tracking-wide">Puzzle Inés</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-300 text-amber-950 font-black px-2.5 py-0.5 rounded-full border-2 border-amber-400 text-xs sm:text-sm shadow-sm">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 fill-amber-500" />
          <span>{unlockedCount} / {totalPieces}</span>
        </div>
      </div>

      {/* Grid Container */}
      <div
        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-3 border-sky-400 bg-sky-100 shadow-inner grid gap-0.5 p-0.5"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {/* Full Image Background Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {themeImageSrc && !imgError ? (
            <img
              src={themeImageSrc}
              alt="Puzzle Background"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            renderFallbackSvg()
          )}
        </div>

        {/* Puzzle Overlay Tiles */}
        {pieces.map((idx) => {
          const isUnlocked = idx < unlockedCount;

          return (
            <div
              key={idx}
              className={`
                relative w-full h-full rounded-md transition-all duration-500 flex items-center justify-center
                ${
                  isUnlocked
                    ? 'bg-transparent border border-white/20'
                    : 'bg-sky-600/90 backdrop-blur-sm border border-sky-400 text-white shadow-sm'
                }
              `}
            >
              {!isUnlocked && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-base sm:text-lg opacity-80">🧩</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

