import React from 'react';
import { Play, Sparkles, Settings, Smartphone } from 'lucide-react';
import { AppSettings } from '../types';

interface WelcomeScreenProps {
  settings: AppSettings;
  onStartGame: () => void;
  onOpenSettings: () => void;
  onOpenInstallModal?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  settings,
  onStartGame,
  onOpenSettings,
  onOpenInstallModal,
}) => {
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onStartGame();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50">
      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border-2 border-sky-300 shadow-sm text-sky-900 font-extrabold text-lg">
          <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
          <span>Juego de Palabras</span>
        </div>
        <div className="flex items-center gap-3">
          {onOpenInstallModal && (
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-full border-2 border-emerald-600 shadow-md text-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-5 h-5" />
              <span className="hidden sm:inline">Instalar en Tablet</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-3 bg-white/90 hover:bg-white rounded-full border-2 border-sky-300 shadow-md text-sky-800 transition-transform active:scale-95 cursor-pointer"
            aria-label="Ajustes"
          >
            <Settings className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Main Welcoming Card */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl border-8 border-sky-400 p-6 sm:p-10 shadow-2xl text-center flex flex-col items-center my-auto animate-pop">
        {/* Floating Icons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-6xl sm:text-7xl animate-bounce">🥖</span>
          <span className="text-6xl sm:text-7xl animate-bounce delay-100">🍎</span>
          <span className="text-6xl sm:text-7xl animate-bounce delay-200">📱</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-sky-950 mb-3 tracking-wide font-['Outfit']">
          ¡HOLA, {settings.childName.toUpperCase()}! 👋
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-sky-800 mb-8 max-w-md font-['Fredoka']">
          Escucha la palabra y toca la tarjeta correcta para completar el puzzle de recompensa. 🧩✨
        </p>

        {/* Massive Start Button for Motor Accessibility */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          className="
            w-full py-6 sm:py-8 px-8 rounded-3xl bg-amber-400 hover:bg-amber-300 text-amber-950
            border-8 border-amber-500 shadow-2xl text-3xl sm:text-4xl font-black tracking-wider uppercase
            flex items-center justify-center gap-4 transition-all transform active:scale-95 cursor-pointer touch-none select-none
            hover:scale-102 mb-4
          "
        >
          <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-amber-950 stroke-amber-950" />
          <span>¡EMPEZAR A JUGAR!</span>
        </button>

        {onOpenInstallModal && (
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="w-full py-3 px-4 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold rounded-2xl border-2 border-sky-300 flex items-center justify-center gap-2 text-base transition-all active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-5 h-5 text-sky-600" />
            <span>📱 ¿Cómo instalar esta app en la Tablet Android?</span>
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs sm:text-sm font-semibold text-sky-700/80 my-2">
        <span>Adaptado para parálisis cerebral motora • Grandes zonas de toque • Sin límite de tiempo</span>
      </div>
    </div>
  );
};
