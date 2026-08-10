import React, { useEffect, useState } from 'react';
import { PuzzleTheme, VoiceGender } from '../types';
import { Trophy, Star, RefreshCw } from 'lucide-react';
import { playFanfareFx, speakText } from '../utils/audio';

interface VictoryModalProps {
  theme: PuzzleTheme;
  childName: string;
  totalHits: number;
  voiceSpeed?: number;
  voicePitch?: number;
  voiceGender?: VoiceGender;
  selectedVoiceURI?: string;
  voiceEnabled?: boolean;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  theme,
  childName,
  totalHits,
  voiceSpeed = 0.85,
  voicePitch = 1.2,
  voiceGender = 'female',
  selectedVoiceURI,
  voiceEnabled = true,
  onPlayAgain,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // 1. Play energetic celebratory fanfare sound
    playFanfareFx();

    // 2. Play spoken audio celebrating completion and inviting to play again
    if (voiceEnabled) {
      const themeName =
        theme === 'doraemon'
          ? 'Doraemon'
          : theme === 'bluey'
          ? 'Bluey y Bingo'
          : theme === 'safari'
          ? 'el Safari'
          : 'las Estrellas';

      const speechMessage = `¡Enhorabuena, ${childName}! ¡Has completado todo el puzzle de ${themeName}! Eres una súper campeona. Toca el botón de jugar de nuevo para continuar.`;

      // Slight delay for fanfare sound to play first
      const timer = setTimeout(() => {
        speakText(
          speechMessage,
          voiceSpeed,
          voicePitch,
          undefined,
          voiceGender as VoiceGender,
          selectedVoiceURI
        );
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [childName, selectedVoiceURI, theme, voiceEnabled, voiceGender, voicePitch, voiceSpeed]);

  useEffect(() => {
    // Generate simple lightweight canvas confetti particles
    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6'];
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 12 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      angle: Math.random() * 360,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += 2;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const themeImageSrc =
    theme === 'doraemon'
      ? 'puzzle_doraemon_1777708203430.png'
      : theme === 'bluey'
      ? 'puzzle_bluey_1777756489789.png'
      : '';

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

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayAgain();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto select-none">
      <canvas id="confetti-canvas" className="absolute inset-0 pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-3xl bg-white rounded-[40px] border-8 border-sky-400 p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center animate-pop my-auto">
        {/* Trophy Icon Header */}
        <div className="bg-amber-400 text-amber-950 p-4 rounded-full shadow-lg -mt-12 sm:-mt-14 border-4 border-white mb-2 animate-bounce">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16 stroke-[2.5]" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-sky-950 mb-1 tracking-wide font-['Outfit'] uppercase">
          ¡FELICIDADES, {childName}! 🎉
        </h2>
        <p className="text-xl sm:text-2xl font-bold text-sky-800 mb-2 font-['Fredoka']">
          ¡HAS COMPLETADO EL PUZZLE! 🧩✨
        </p>

        {/* Completed Puzzle Display - Grand Scale Prize (Guaranteed non-empty) */}
        <div className="w-full max-w-2xl aspect-[4/3] rounded-[32px] overflow-hidden border-8 border-amber-400 shadow-2xl bg-gradient-to-br from-sky-200 to-sky-400 my-4 relative group">
          {themeImageSrc && !imgError ? (
            <img
              src={themeImageSrc}
              alt="Puzzle Completo"
              className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            renderFallbackSvg()
          )}

          {/* Decorative Victory Banner overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-between p-6 bg-gradient-to-t from-black/60 via-transparent to-black/20 text-white pointer-events-none">
            <div className="bg-amber-400/90 text-amber-950 px-6 py-2 rounded-full font-black text-lg sm:text-2xl shadow-lg border-2 border-white uppercase font-['Outfit'] tracking-wider">
              🧩 PUZZLE COMPLETADO DE {childName.toUpperCase()} 🧩
            </div>
            <div className="flex flex-col items-center gap-1 drop-shadow-lg">
              <span className="text-5xl sm:text-7xl animate-bounce">🌟🏆🌟</span>
              <span className="text-3xl sm:text-4xl font-black tracking-widest uppercase font-['Outfit'] text-amber-300">
                ¡ERES UNA CAMPEONA!
              </span>
            </div>
          </div>
        </div>

        {/* Total Hits Star Counter */}
        <div className="flex items-center gap-3 bg-sky-50 px-6 py-3 rounded-2xl border-3 border-sky-200 my-2 shadow-sm text-sky-900 font-black text-xl sm:text-2xl">
          <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
          <span>¡{totalHits} estrellas conseguidas!</span>
        </div>

        {/* Mid-Screen Accessible Play Again Button */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className="
            w-full py-5 sm:py-6 px-8 rounded-3xl bg-amber-400 hover:bg-amber-300 text-amber-950
            border-b-8 border-amber-600 shadow-xl text-2xl sm:text-3xl font-black tracking-wide uppercase
            flex items-center justify-center gap-3 transition-all transform active:translate-y-1 active:border-b-4 cursor-pointer touch-none select-none
          "
        >
          <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
          <span>¡JUGAR DE NUEVO!</span>
        </button>
      </div>
    </div>
  );
};


