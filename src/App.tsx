import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WordItem, AppSettings, GameStats, PuzzleTheme, CardsMode } from './types';
import { VOCABULARY, GENERIC_ERRORS } from './data/words';
import { Card } from './components/Card';
import { SpeakerButton } from './components/SpeakerButton';
import { PuzzleWidget } from './components/PuzzleWidget';
import { RewardModal } from './components/RewardModal';
import { VictoryModal } from './components/VictoryModal';
import { SettingsModal } from './components/SettingsModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { InstallModal } from './components/InstallModal';
import { playSuccessFx, playErrorFx, playFanfareFx, speakText, stopSpeech } from './utils/audio';
import { triggerHaptic } from './utils/vibrate';
import { Settings as SettingsIcon, Home, Sparkles, Star } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  childName: 'Inés',
  voiceSpeed: 0.85,
  voicePitch: 1.2,
  voiceGender: 'female',
  selectedVoiceURI: '',
  cardsMode: '2_cards',
  puzzleTheme: 'doraemon',
  puzzleGridSize: 6,
  soundFxEnabled: true,
  vibrationEnabled: true,
  voiceEnabled: true,
  autoAdvanceSeconds: 0,
};

const DEFAULT_STATS: GameStats = {
  totalAttempts: 0,
  correctAttempts: 0,
  consecutiveHits: 0,
  completedPuzzles: 0,
  wordMisses: {},
};

export default function App() {
  // -----------------------------------------------------------------------
  // State Initialization with LocalStorage Persistence
  // -----------------------------------------------------------------------
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ines_vocab_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('ines_vocab_stats');
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'reward' | 'victory'>('welcome');
  const [showSettings, setShowSettings] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Round State
  const [targetItem, setTargetItem] = useState<WordItem>(VOCABULARY[0]);
  const [roundCards, setRoundCards] = useState<WordItem[]>([]);
  const [cardStatuses, setCardStatuses] = useState<Record<string, 'idle' | 'correct' | 'incorrect'>>({});
  const [isLocked, setIsLocked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [unlockedPieces, setUnlockedPieces] = useState(0);

  const previousTargetIdRef = useRef<string | null>(null);

  // Save Settings & Stats
  useEffect(() => {
    try {
      localStorage.setItem('ines_vocab_settings', JSON.stringify(settings));
    } catch {
      // Ignore storage errors in restricted file:// environments
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('ines_vocab_stats', JSON.stringify(stats));
    } catch {
      // Ignore storage errors in restricted file:// environments
    }
  }, [stats]);

  // Determine current cards count based on settings and scaffolding
  const getCardCount = useCallback(() => {
    if (settings.cardsMode === '2_cards') return 2;
    if (settings.cardsMode === '3_cards') return 3;
    // progressive mode: 2 cards under 3 consecutive hits, 3 cards at >= 3 consecutive hits
    return stats.consecutiveHits >= 3 ? 3 : 2;
  }, [settings.cardsMode, stats.consecutiveHits]);

  // -----------------------------------------------------------------------
  // Word Picker with Spaced Repetition & No Consecutive Repeats
  // -----------------------------------------------------------------------
  const setupNewRound = useCallback(() => {
    setCardStatuses({});
    setIsLocked(false);

    // Filter out previous target to avoid direct consecutive repetition
    const candidates = VOCABULARY.filter((w) => w.id !== previousTargetIdRef.current);

    // Weighted selection based on word miss count
    const weightedPool: WordItem[] = [];
    candidates.forEach((item) => {
      const misses = stats.wordMisses[item.id] || 0;
      const weight = 1 + misses * 2; // Words missed more often appear with higher weight
      for (let i = 0; i < weight; i++) {
        weightedPool.push(item);
      }
    });

    const selectedTarget = weightedPool[Math.floor(Math.random() * weightedPool.length)] || candidates[0];
    previousTargetIdRef.current = selectedTarget.id;
    setTargetItem(selectedTarget);

    // Pick distractors
    const cardCount = getCardCount();
    const otherItems = VOCABULARY.filter((w) => w.id !== selectedTarget.id);
    const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);
    const distractors = shuffledOthers.slice(0, cardCount - 1);

    const cardsPool = [selectedTarget, ...distractors].sort(() => Math.random() - 0.5);
    setRoundCards(cardsPool);

    // Enunciate prompt speech
    const promptText = `Busca: ${selectedTarget.audioPrompt}, ${settings.childName}`;
    if (settings.voiceEnabled) {
      setIsSpeaking(true);
      speakText(
        promptText,
        settings.voiceSpeed,
        settings.voicePitch,
        () => setIsSpeaking(false),
        settings.voiceGender,
        settings.selectedVoiceURI
      );
    }
  }, [getCardCount, settings.childName, settings.selectedVoiceURI, settings.voiceEnabled, settings.voiceGender, settings.voicePitch, settings.voiceSpeed, stats.wordMisses]);

  // Start playing from welcome
  const handleStartGame = () => {
    setGameState('playing');
    setupNewRound();
  };

  // Re-speak instruction
  const handleSpeakInstruction = () => {
    if (!targetItem) return;
    setIsSpeaking(true);
    const promptText = `Busca: ${targetItem.audioPrompt}, ${settings.childName}`;
    speakText(
      promptText,
      settings.voiceSpeed,
      settings.voicePitch,
      () => setIsSpeaking(false),
      settings.voiceGender,
      settings.selectedVoiceURI
    );
  };

  // -----------------------------------------------------------------------
  // Handle Card Selection (Pointer Down)
  // -----------------------------------------------------------------------
  const handleSelectCard = (selectedItem: WordItem) => {
    if (isLocked) return;

    // Lock UI for ~800ms to prevent double-tap accidental spasms
    setIsLocked(true);

    if (selectedItem.id === targetItem.id) {
      // --- CORRECT ANSWER ---
      setCardStatuses((prev) => ({ ...prev, [selectedItem.id]: 'correct' }));

      if (settings.soundFxEnabled) playSuccessFx();
      if (settings.vibrationEnabled) triggerHaptic(100);

      const nextConsecutive = stats.consecutiveHits + 1;
      const nextTotalAttempts = stats.totalAttempts + 1;
      const nextCorrectAttempts = stats.correctAttempts + 1;

      setStats((prev) => ({
        ...prev,
        consecutiveHits: nextConsecutive,
        totalAttempts: nextTotalAttempts,
        correctAttempts: nextCorrectAttempts,
      }));

      const newUnlocked = unlockedPieces + 1;
      setUnlockedPieces(newUnlocked);

      // Voice praise
      if (settings.voiceEnabled) {
        setIsSpeaking(true);
        const praiseSentence = `${selectedItem.rewardPhrase} ¡Muy bien, ${settings.childName}!`;
        speakText(
          praiseSentence,
          settings.voiceSpeed,
          settings.voicePitch,
          () => setIsSpeaking(false),
          settings.voiceGender,
          settings.selectedVoiceURI
        );
      }

      // Check puzzle completion
      setTimeout(() => {
        if (newUnlocked >= settings.puzzleGridSize) {
          if (settings.soundFxEnabled) playFanfareFx();
          setStats((prev) => ({ ...prev, completedPuzzles: prev.completedPuzzles + 1 }));
          setGameState('victory');
        } else {
          setGameState('reward');
        }
      }, 700);

    } else {
      // --- INCORRECT ANSWER ---
      setCardStatuses((prev) => ({ ...prev, [selectedItem.id]: 'incorrect' }));

      if (settings.soundFxEnabled) playErrorFx();
      if (settings.vibrationEnabled) triggerHaptic([50, 50, 50]);

      // Record miss
      setStats((prev) => ({
        ...prev,
        consecutiveHits: 0,
        totalAttempts: prev.totalAttempts + 1,
        wordMisses: {
          ...prev.wordMisses,
          [targetItem.id]: (prev.wordMisses[targetItem.id] || 0) + 1,
        },
      }));

      // Voice encouragement with specific prompt & selected item guidance
      if (settings.voiceEnabled) {
        setIsSpeaking(true);
        const targetText = targetItem.audioPrompt;
        const selectedText = selectedItem.audioPrompt;
        const errSentence = `No, esto no es ${targetText}, es ${selectedText}. Prueba de nuevo, busca ${targetText}, ${settings.childName}.`;

        speakText(
          errSentence,
          settings.voiceSpeed,
          settings.voicePitch,
          () => setIsSpeaking(false),
          settings.voiceGender,
          settings.selectedVoiceURI
        );
      }

      // Clear card error state & unlock after 1200ms mandatory debounce to absorb secondary touches
      setTimeout(() => {
        setCardStatuses((prev) => ({ ...prev, [selectedItem.id]: 'idle' }));
        setIsLocked(false);
      }, 1200);
    }
  };

  // Next Round after Reward Modal
  const handleNextRound = () => {
    setGameState('playing');
    setupNewRound();
  };

  // Reset puzzle for another game
  const handlePlayAgainFromVictory = () => {
    setUnlockedPieces(0);
    setGameState('playing');
    setupNewRound();
  };

  // Reset full stats & puzzle
  const handleResetStats = () => {
    setStats(DEFAULT_STATS);
    setUnlockedPieces(0);
    if (gameState === 'playing') {
      setupNewRound();
    }
  };

  // Render Welcome Screen
  if (gameState === 'welcome') {
    return (
      <>
        <WelcomeScreen
          settings={settings}
          onStartGame={handleStartGame}
          onOpenSettings={() => setShowSettings(true)}
          onOpenInstallModal={() => setShowInstallModal(true)}
        />
        {showSettings && (
          <SettingsModal
            settings={settings}
            stats={stats}
            onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
            onResetStats={handleResetStats}
            onClose={() => setShowSettings(false)}
          />
        )}
        <InstallModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
        />
      </>
    );
  }

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 bg-sky-50 select-none overflow-x-hidden"
    >
      {/* Immersive Navigation & Header Bar */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 mb-2 sm:mb-4">
        {/* Left: Child Greeting & Home Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              stopSpeech();
              setGameState('welcome');
            }}
            onContextMenu={(e) => e.preventDefault()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-sky-100 rounded-2xl border-3 border-sky-300 shadow-md text-sky-950 font-black text-base sm:text-lg transition-all active:translate-y-0.5 cursor-pointer"
          >
            <Home className="w-6 h-6 text-sky-600 stroke-[2.5]" />
            <span className="hidden sm:inline">Inicio</span>
          </button>

          <div className="bg-white px-4 py-2 rounded-2xl border-3 border-sky-300 shadow-md flex items-center gap-2 text-sky-950 font-black text-lg sm:text-xl font-['Outfit']">
            <span>🌟</span>
            <span>¡Hola, {settings.childName}!</span>
          </div>
        </div>

        {/* Center/Right: Stars Counter & Parent Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-amber-300 text-amber-950 font-black px-4 py-2 rounded-2xl border-3 border-amber-400 text-lg sm:text-xl shadow-md">
            <Star className="w-6 h-6 text-amber-600 fill-amber-500" />
            <span>{stats.correctAttempts}</span>
          </div>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              setShowSettings(true);
            }}
            onContextMenu={(e) => e.preventDefault()}
            className="p-3 bg-white hover:bg-sky-100 rounded-2xl border-3 border-sky-300 shadow-md text-sky-900 transition-all active:translate-y-0.5 cursor-pointer"
            aria-label="Ajustes de Terapeuta"
          >
            <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Playing Area with Top-Right Puzzle Placement */}
      <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row gap-6 my-auto items-stretch">
        {/* Left / Central Game Playing Canvas */}
        <div className="flex-1 flex flex-col justify-around gap-4 sm:gap-6 my-auto">
          {/* Instruction & Speaker Button Section at Mid-Screen Height */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white/80 p-4 rounded-3xl border-4 border-sky-200 shadow-md">
            <div className="text-center sm:text-left flex-1">
              <span className="text-sm font-bold text-sky-600 uppercase tracking-widest block font-['Outfit']">
                Instrucción activa:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-sky-950 uppercase tracking-wide font-['Fredoka']">
                {settings.childName}, busca: <span className="text-sky-600 underline decoration-amber-400 decoration-4">{targetItem ? targetItem.word : ''}</span>
              </h2>
            </div>
            <SpeakerButton
              onSpeak={handleSpeakInstruction}
              isSpeaking={isSpeaking}
              disabled={isLocked}
              compact={false}
              currentPromptText={targetItem ? `Busca: ${targetItem.audioPrompt}` : ''}
            />
          </div>

          {/* Large Accessible Cards Layout */}
          <div
            className={`
              grid gap-4 sm:gap-8 w-full items-center justify-center my-2
              ${roundCards.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}
            `}
          >
            {roundCards.map((item, idx) => (
              <Card
                key={`${item.id}-${idx}`}
                item={item}
                status={cardStatuses[item.id] || 'idle'}
                isLocked={isLocked}
                onSelect={handleSelectCard}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* Right Area: Top-Right Puzzle Widget Placement */}
        <div className="w-full lg:w-72 xl:w-80 flex flex-col justify-start">
          <PuzzleWidget
            theme={settings.puzzleTheme}
            gridSize={settings.puzzleGridSize}
            unlockedCount={unlockedPieces}
            totalHits={stats.correctAttempts}
          />
        </div>
      </main>

      {/* Reward Modal after a correct answer */}
      {gameState === 'reward' && targetItem && (
        <RewardModal
          item={targetItem}
          childName={settings.childName}
          onNext={handleNextRound}
          autoAdvanceSeconds={settings.autoAdvanceSeconds}
        />
      )}

      {/* Full Victory Celebration Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          theme={settings.puzzleTheme}
          childName={settings.childName}
          totalHits={stats.correctAttempts}
          voiceSpeed={settings.voiceSpeed}
          voicePitch={settings.voicePitch}
          voiceGender={settings.voiceGender}
          selectedVoiceURI={settings.selectedVoiceURI}
          voiceEnabled={settings.voiceEnabled}
          onPlayAgain={handlePlayAgainFromVictory}
        />
      )}

      {/* Therapist & Parent Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          stats={stats}
          onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
          onResetStats={handleResetStats}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* PWA Install Modal */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
