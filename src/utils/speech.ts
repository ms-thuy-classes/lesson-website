/**
 * Speech synthesis utility for English pronunciation
 * Uses Web Speech API with American English (en-US) voice and rate 0.9
 */
export function playEnglishPronunciation(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported by this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  // Try to pick an en-US voice if available
  const voices = window.speechSynthesis.getVoices();
  const usVoice = voices.find(
    (v) => v.lang === 'en-US' || v.lang.startsWith('en-US')
  );
  if (usVoice) {
    utterance.voice = usVoice;
  }

  window.speechSynthesis.speak(utterance);
}
