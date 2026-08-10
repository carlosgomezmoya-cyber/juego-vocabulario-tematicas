// Web Audio API Synthesizer and Web Speech API Handler

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// -------------------------------------------------------------------------
// Sound Effects Synthesizer
// -------------------------------------------------------------------------

export function playPopFx() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio FX play error:', e);
  }
}

export function playSuccessFx() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.35);
    });
  } catch (e) {
    console.warn('Success FX error:', e);
  }
}

export function playErrorFx() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Soft gentle non-punitive two notes
    const freqs = [329.63, 261.63]; // E4 -> C4
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.2, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.22);
    });
  } catch (e) {
    console.warn('Error FX error:', e);
  }
}

export function playFanfareFx() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Energetic fanfare notes: C5, E5, G5, C6 (longer), G5, C6
    const sequence = [
      { f: 523.25, t: 0, d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.12 },
      { f: 1046.50, t: 0.36, d: 0.35 },
      { f: 783.99, t: 0.72, d: 0.12 },
      { f: 1046.50, t: 0.85, d: 0.60 },
    ];

    sequence.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(0.4, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + t);
      osc.stop(now + t + d);
    });
  } catch (e) {
    console.warn('Fanfare FX error:', e);
  }
}

// -------------------------------------------------------------------------
// Web Speech API Handler
// -------------------------------------------------------------------------

import { VoiceGender } from '../types';

export interface SpeechVoiceOption {
  voiceURI: string;
  name: string;
  lang: string;
  gender: VoiceGender;
}

function detectVoiceGender(name: string): VoiceGender {
  const lower = name.toLowerCase();
  const femaleKeywords = ['female', 'monica', 'helena', 'lucia', 'laura', 'marta', 'sabina', 'victoria', 'alva', 'paulina', 'paloma', 'sora', 'zira', 'karen', 'elena'];
  const maleKeywords = ['male', 'jorge', 'pablo', 'enrique', 'diego', 'manuel', 'carlos', 'juan', 'raul', 'david', 'miguel', 'alvaro'];

  if (femaleKeywords.some((kw) => lower.includes(kw))) return 'female';
  if (maleKeywords.some((kw) => lower.includes(kw))) return 'male';
  return 'any';
}

export function getAvailableSpanishVoices(): SpeechVoiceOption[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices() || [];
  
  const spanishVoices = voices.filter(
    (v) => v.lang.startsWith('es') || v.lang.startsWith('ES')
  );

  return spanishVoices.map((v) => ({
    voiceURI: v.voiceURI,
    name: `${v.name} (${v.lang})`,
    lang: v.lang,
    gender: detectVoiceGender(v.name),
  }));
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(
  text: string,
  rate = 0.88,
  pitch = 1.1,
  onEnd?: () => void,
  voiceGender: VoiceGender = 'any',
  selectedVoiceURI?: string
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    
    // Smooth, friendly natural pitch & rate calculation
    let adjustedPitch = pitch;
    if (voiceGender === 'female' && pitch === 1.2) adjustedPitch = 1.15;
    if (voiceGender === 'male' && pitch === 1.2) adjustedPitch = 0.95;

    utterance.rate = rate;
    utterance.pitch = adjustedPitch;

    const voices = window.speechSynthesis.getVoices() || [];
    let chosenVoice: SpeechSynthesisVoice | null = null;

    if (selectedVoiceURI) {
      chosenVoice = voices.find((v) => v.voiceURI === selectedVoiceURI) || null;
    }

    if (!chosenVoice) {
      const spanishVoices = voices.filter((v) => v.lang.startsWith('es'));
      
      if (voiceGender === 'female') {
        chosenVoice =
          spanishVoices.find((v) => detectVoiceGender(v.name) === 'female') ||
          spanishVoices.find((v) => v.name.includes('Google')) ||
          spanishVoices[0] ||
          null;
      } else if (voiceGender === 'male') {
        chosenVoice =
          spanishVoices.find((v) => detectVoiceGender(v.name) === 'male') ||
          spanishVoices.find((v) => v.name.includes('Jorge') || v.name.includes('Pablo')) ||
          spanishVoices[0] ||
          null;
      } else {
        chosenVoice =
          spanishVoices.find((v) => v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google')) ||
          spanishVoices[0] ||
          null;
      }
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('Speech error:', e);
    if (onEnd) onEnd();
    return false;
  }
}
