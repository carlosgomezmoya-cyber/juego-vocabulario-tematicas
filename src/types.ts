export interface WordItem {
  id: string;
  word: string;
  audioPrompt: string; // e.g. "el pan", "a la mamá"
  emoji: string;
  rewardEmoji: string;
  rewardPhrase: string; // e.g. "¡Qué rico el pan con fuet!"
}

export type PuzzleTheme = 'doraemon' | 'bluey' | 'safari' | 'stars';

export type CardsMode = '2_cards' | '3_cards' | 'progressive';

export type GameState = 'welcome' | 'playing' | 'reward_modal' | 'puzzle_complete';

export type VoiceGender = 'female' | 'male' | 'any';

export interface AppSettings {
  childName: string;
  voiceSpeed: number; // default 0.85
  voicePitch: number; // default 1.2
  voiceGender: VoiceGender;
  selectedVoiceURI?: string;
  cardsMode: CardsMode;
  puzzleTheme: PuzzleTheme;
  puzzleGridSize: 6 | 9;
  soundFxEnabled: boolean;
  vibrationEnabled: boolean;
  voiceEnabled: boolean;
  autoAdvanceSeconds: number; // 0 = manual tap, >0 = auto advance
}

export interface GameStats {
  totalAttempts: number;
  correctAttempts: number;
  consecutiveHits: number;
  completedPuzzles: number;
  wordMisses: Record<string, number>; // word id -> count
}
