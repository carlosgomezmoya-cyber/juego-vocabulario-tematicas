import React from 'react';
import { Volume2 } from 'lucide-react';

interface SpeakerButtonProps {
  onSpeak: () => void;
  isSpeaking: boolean;
  disabled?: boolean;
  currentPromptText?: string;
  compact?: boolean;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  onSpeak,
  isSpeaking,
  disabled = false,
  currentPromptText = '',
  compact = false,
}) => {
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onSpeak();
  };

  if (compact) {
    return (
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onContextMenu={(e) => e.preventDefault()}
        disabled={disabled}
        aria-label="Escuchar la orden de nuevo"
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300
          text-amber-950 font-black border-b-4 border-amber-600 shadow-md active:translate-y-0.5 active:border-b-2
          transition-all cursor-pointer touch-none select-none
          ${isSpeaking ? 'ring-4 ring-amber-300 animate-pulse scale-105' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Volume2 className={`w-6 h-6 stroke-[3] ${isSpeaking ? 'animate-bounce' : ''}`} />
        <span className="text-base font-extrabold uppercase font-['Outfit']">Repetir</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onContextMenu={(e) => e.preventDefault()}
        disabled={disabled}
        aria-label="Repetir voz"
        className={`
          group relative flex items-center justify-center gap-3.5 px-7 sm:px-9 py-4 sm:py-5
          rounded-3xl border-b-8 border-amber-600 bg-amber-400 hover:bg-amber-300 text-amber-950
          shadow-xl transition-all active:translate-y-1 active:border-b-4 cursor-pointer touch-none select-none
          ${isSpeaking ? 'ring-8 ring-amber-300/80 scale-105' : 'hover:scale-102'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className={`p-2.5 rounded-2xl bg-amber-100/90 text-amber-950 ${isSpeaking ? 'animate-bounce' : ''}`}>
          <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider font-['Outfit']">
            {isSpeaking ? 'Hablando...' : 'Escuchar de nuevo'}
          </span>
          {currentPromptText && (
            <span className="text-sm sm:text-base font-bold text-amber-900/95 max-w-[240px] sm:max-w-[340px] truncate">
              "{currentPromptText}"
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

