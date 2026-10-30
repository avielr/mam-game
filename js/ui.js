// Tiny DOM helpers — no framework.
import { getState } from './state.js';

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export function svgEl(markup) {
  const wrap = document.createElement('div');
  wrap.innerHTML = markup.trim();
  return wrap.firstElementChild;
}

export function mount(container, ...nodes) {
  container.replaceChildren(...nodes.flat().filter(Boolean));
}

// Rich text: **bold**, `term`
export function rich(text) {
  const span = document.createElement('span');
  span.innerHTML = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`(.+?)`/g, '<bdi class="term">$1</bdi>')
    .replace(/\n/g, '<br>');
  return span;
}

export function toast(msg, ms = 2200) {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  setTimeout(() => t.remove(), ms);
}

export function confetti() {
  const colors = ['#22d3a6', '#ffb547', '#60a5fa', '#ff6b81', '#b48cff'];
  const box = h('div', { class: 'confetti', 'aria-hidden': 'true' });
  for (let i = 0; i < 70; i++) {
    box.append(h('i', { style: {
      left: Math.random() * 100 + '%',
      background: colors[i % colors.length],
      animationDuration: 1.6 + Math.random() * 1.8 + 's',
      animationDelay: Math.random() * .5 + 's',
    } }));
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 4200);
}

export function shake(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

let audio;
export function sound(kind) {
  if (!getState().sound) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    const notes = { good: [660, 880], bad: [220, 160], click: [520], win: [523, 659, 784, 1047] }[kind] || [440];
    notes.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = kind === 'bad' ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      const t = audio.currentTime + i * 0.11;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + 0.2);
    });
  } catch { /* audio unavailable */ }
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Commander avatar (תא״ל ביט) — friendly robot.
export function commanderFace() {
  return svgEl(`<svg class="face" viewBox="0 0 80 80" aria-hidden="true">
    <rect x="10" y="18" width="60" height="50" rx="16" fill="#22d3a6"/>
    <rect x="18" y="28" width="44" height="26" rx="10" fill="#0b1530"/>
    <circle cx="31" cy="41" r="5" fill="#7ff5d6"/><circle cx="49" cy="41" r="5" fill="#7ff5d6"/>
    <path d="M32 60q8 5 16 0" stroke="#0b1530" stroke-width="3" fill="none" stroke-linecap="round"/>
    <line x1="40" y1="18" x2="40" y2="8" stroke="#22d3a6" stroke-width="3"/><circle cx="40" cy="7" r="4" fill="#ffb547"/>
    <rect x="12" y="14" width="56" height="9" rx="4" fill="#3c5a2a"/><circle cx="40" cy="18" r="3" fill="#ffd166"/>
  </svg>`);
}

export function commanderSays(text) {
  return h('div', { class: 'commander' }, commanderFace(), h('div', { class: 'bubble' }, rich(text)));
}
