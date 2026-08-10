import React, { useEffect } from 'react';
import { WordItem } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface RewardModalProps {
  item: WordItem;
  childName: string;
  onNext: () => void;
  autoAdvanceSeconds: number;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  item,
  childName,
  onNext,
  autoAdvanceSeconds,
}) => {
  useEffect(() => {
    if (autoAdvanceSeconds > 0) {
      const timer = setTimeout(() => {
        onNext();
      }, autoAdvanceSeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoAdvanceSeconds, onNext]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onNext();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-pop select-none">
      <div className="relative w-full max-w-lg bg-white rounded-[36px] border-8 border-sky-400 p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center my-auto">
        {/* Floating sparkles background */}
        <div className="absolute -top-6 -left-6 bg-amber-400 p-3 sm:p-4 rounded-full shadow-lg text-3xl sm:text-4xl animate-bounce border-4 border-white">
          ⭐
        </div>
        <div className="absolute -top-6 -right-6 bg-amber-400 p-3 sm:p-4 rounded-full shadow-lg text-3xl sm:text-4xl animate-bounce border-4 border-white">
          ✨
        </div>

        {/* Celebration Header */}
        <div className="flex items-center justify-center gap-2 text-sky-950 font-black text-2xl sm:text-3xl mb-2 font-['Outfit']">
          <Sparkles className="w-8 h-8 text-amber-500 fill-amber-400" />
          <span className="uppercase tracking-wider">¡MUY BIEN, {childName}!</span>
        </div>

        {/* Main Reward Emoji Showcase */}
        <div className="my-4 p-6 bg-sky-50 rounded-3xl border-4 border-sky-200 shadow-inner flex items-center justify-center gap-4 w-full">
          <span className="text-7xl sm:text-8xl animate-pulse filter drop-shadow">{item.emoji}</span>
          <span className="text-5xl sm:text-6xl text-amber-500 font-black">+</span>
          <span className="text-7xl sm:text-8xl animate-bounce filter drop-shadow">{item.rewardEmoji}</span>
        </div>

        {/* Reward Motivational Sentence */}
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 my-3 leading-snug font-['Fredoka']">
          {item.rewardPhrase}
        </p>

        {/* Mid-Screen Accessible Next Button */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className="
            mt-4 w-full py-5 sm:py-6 px-8 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-white
            border-b-8 border-emerald-700 shadow-xl text-2xl sm:text-3xl font-black tracking-wider uppercase
            flex items-center justify-center gap-3 transition-all transform active:translate-y-1 active:border-b-4 cursor-pointer touch-none select-none
          "
        >
          <span>¡SIGUIENTE!</span>
          <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

