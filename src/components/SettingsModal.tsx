import React, { useEffect, useState } from 'react';
import { AppSettings, GameStats, PuzzleTheme, CardsMode, VoiceGender } from '../types';
import { speakText, playPopFx, getAvailableSpanishVoices, SpeechVoiceOption } from '../utils/audio';
import { X, Volume2, RotateCcw, ShieldCheck, User, Settings as SettingsIcon, Mic } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  stats: GameStats;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetStats: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  stats,
  onUpdateSettings,
  onResetStats,
  onClose,
}) => {
  const [availableVoices, setAvailableVoices] = useState<SpeechVoiceOption[]>([]);

  useEffect(() => {
    const updateVoices = () => {
      const voices = getAvailableSpanishVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleTestVoice = () => {
    playPopFx();
    speakText(
      `¡Hola ${settings.childName}! Esta es mi voz de juego.`,
      settings.voiceSpeed,
      settings.voicePitch,
      undefined,
      settings.voiceGender,
      settings.selectedVoiceURI
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-sky-400 p-6 sm:p-8 shadow-2xl text-slate-800 my-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200 mb-6">
          <div className="flex items-center gap-3 text-sky-900 font-extrabold text-2xl sm:text-3xl font-['Outfit']">
            <SettingsIcon className="w-8 h-8 text-sky-600" />
            <span>Ajustes para Acompañante / Logopeda</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors cursor-pointer"
            aria-label="Cerrar ajustes"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Child Name */}
          <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200">
            <label className="flex items-center gap-2 text-lg font-extrabold text-sky-900 mb-2">
              <User className="w-5 h-5 text-sky-600" />
              <span>Nombre de la niña / usuario</span>
            </label>
            <input
              type="text"
              value={settings.childName}
              onChange={(e) => onUpdateSettings({ childName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-sky-300 text-xl font-bold bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-300"
            />
          </div>

          {/* Cards Display Mode */}
          <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200">
            <label className="block text-lg font-extrabold text-amber-900 mb-2">
              Número de Tarjetas por Ronda
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: '2_cards', label: '2 Tarjetas (Bajo estímulo)' },
                { id: '3_cards', label: '3 Tarjetas (Estándar)' },
                { id: 'progressive', label: 'Progreso Adaptativo (2 ➔ 3)' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onUpdateSettings({ cardsMode: mode.id as CardsMode })}
                  className={`
                    p-3 rounded-xl font-bold text-sm sm:text-base border-3 transition-all cursor-pointer text-center
                    ${
                      settings.cardsMode === mode.id
                        ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-md font-extrabold scale-102'
                        : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100'
                    }
                  `}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Puzzle Theme */}
          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200">
            <label className="block text-lg font-extrabold text-emerald-900 mb-2">
              Temática del Puzzle de Recompensa
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'doraemon', label: 'Doraemon 🔔' },
                { id: 'bluey', label: 'Bluey 🐾' },
                { id: 'safari', label: 'Safari 🦁' },
                { id: 'stars', label: 'Estrellas ⭐' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onUpdateSettings({ puzzleTheme: theme.id as PuzzleTheme })}
                  className={`
                    p-3 rounded-xl font-bold text-sm border-3 transition-all cursor-pointer text-center
                    ${
                      settings.puzzleTheme === theme.id
                        ? 'bg-emerald-500 border-emerald-700 text-white shadow-md font-black scale-102'
                        : 'bg-white border-emerald-200 text-slate-700 hover:bg-emerald-100'
                    }
                  `}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Controls */}
          <div className="bg-purple-50 p-4 sm:p-5 rounded-2xl border-2 border-purple-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <label className="text-lg font-extrabold text-purple-900 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-purple-600" />
                <span>Configuración de Voz y Género</span>
              </label>
              <button
                type="button"
                onClick={handleTestVoice}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Escuchar Muestra de Voz</span>
              </button>
            </div>

            {/* Voice Gender Selection */}
            <div>
              <span className="text-sm font-bold text-purple-900 block mb-2">
                Género de la Voz Preferida:
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'female', label: '👩‍🏫 Femenina' },
                  { id: 'male', label: '👨‍🏫 Masculina' },
                  { id: 'any', label: '🤖 Sistema / Auto' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onUpdateSettings({ voiceGender: g.id as VoiceGender, selectedVoiceURI: '' })}
                    className={`
                      p-2.5 rounded-xl font-extrabold text-sm border-2 transition-all cursor-pointer text-center
                      ${
                        settings.voiceGender === g.id
                          ? 'bg-purple-600 border-purple-700 text-white shadow-md'
                          : 'bg-white border-purple-200 text-purple-900 hover:bg-purple-100'
                      }
                    `}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tablet Specific System Voices List (if available) */}
            {availableVoices.length > 0 && (
              <div>
                <span className="text-sm font-bold text-purple-900 block mb-1">
                  Voz Específica del Dispositivo/Tablet ({availableVoices.length} disponibles):
                </span>
                <select
                  value={settings.selectedVoiceURI || ''}
                  onChange={(e) => onUpdateSettings({ selectedVoiceURI: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-purple-300 text-sm font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Voz automática según género ({settings.voiceGender})</option>
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} [{v.gender === 'female' ? 'Mujer' : v.gender === 'male' ? 'Hombre' : 'Estándar'}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-sm font-bold text-purple-900 block mb-1">
                  Velocidad: {settings.voiceSpeed}x (Modulación natural)
                </span>
                <input
                  type="range"
                  min="0.6"
                  max="1.1"
                  step="0.05"
                  value={settings.voiceSpeed}
                  onChange={(e) => onUpdateSettings({ voiceSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-sm font-bold text-purple-900 block mb-1">
                  Tono Vocal: {settings.voicePitch}
                </span>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={settings.voicePitch}
                  onChange={(e) => onUpdateSettings({ voicePitch: parseFloat(e.target.value) })}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Session Statistics & Reset */}
          <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-base font-extrabold text-slate-800 block">Estadísticas de la Sesión:</span>
              <span className="text-sm font-semibold text-slate-600">
                Aciertos: {stats.correctAttempts} / Intentos totales: {stats.totalAttempts} | Puzzles completados: {stats.completedPuzzles}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Deseas reiniciar las estadísticas y el puzzle actual?')) {
                  onResetStats();
                }
              }}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-extrabold text-sm shadow cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Progreso</span>
            </button>
          </div>
        </div>

        {/* Done Close Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white border-3 border-sky-600 rounded-2xl font-black text-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-6 h-6" />
            <span>Guardar y Volver al Juego</span>
          </button>
        </div>
      </div>
    </div>
  );
};
