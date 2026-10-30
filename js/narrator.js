// Voice narration via the device's speech engine (Web Speech API). Silent fallback paces by reading time.
import { getState } from './state.js';
import { lang } from './i18n.js';

const synth = typeof speechSynthesis !== 'undefined' ? speechSynthesis : null;
let voices = [];
const loadVoices = () => { voices = synth?.getVoices() || []; };
loadVoices();
synth?.addEventListener?.('voiceschanged', loadVoices);

export function voiceFor(l = lang()) {
  const pref = l === 'en' ? ['en-US', 'en-GB', 'en'] : ['he-IL', 'he', 'iw'];
  for (const p of pref) {
    const v = voices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith(p.toLowerCase()));
    if (v) return v;
  }
  return null;
}

export const canSpeak = () => !!(synth && voiceFor());
export const plain = t => String(t).replace(/\*\*(.+?)\*\*/g, '$1').replace(/`(.+?)`/g, '$1').replace(/\n+/g, ' ');
export const readMs = t => Math.max(2200, plain(t).length * 62);

// Speaks text; resolves when done (or after reading time when voice is off/unavailable). cancel() stops it.
export function say(text, { onBoundary } = {}) {
  let timer, cancelled = false;
  const p = new Promise(resolve => {
    const fallback = () => { timer = setTimeout(resolve, readMs(text)); };
    if (!getState().narration || !canSpeak()) return fallback();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(plain(text));
    u.voice = voiceFor(); u.lang = u.voice.lang; u.rate = lang() === 'en' ? 1 : 1.05; u.pitch = 1;
    u.onend = () => resolve();
    u.onerror = () => { if (!cancelled) fallback(); };
    if (onBoundary) u.onboundary = onBoundary;
    synth.speak(u);
  });
  return { done: p, cancel: () => { cancelled = true; clearTimeout(timer); synth?.cancel(); } };
}

export const stopSpeech = () => synth?.cancel();
