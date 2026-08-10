export function triggerHaptic(pattern: number | number[] = 80) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration unsupported errors on non-supported platforms
    }
  }
}
