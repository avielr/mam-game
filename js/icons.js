// Line icons. icon('shield') or icon('🛡️') → <svg>; unknown emoji falls back to the emoji itself.
import { ICONS, EMOJI_ICON } from './icon-data.js';

export const iconName = x => (ICONS[x] ? x : EMOJI_ICON[x] || EMOJI_ICON[String(x).replace(/️/g, '')] || null);

export function iconMarkup(x, size = 24, cls = '') {
  const n = iconName(x);
  if (!n) return null;
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;
}

export function icon(x, size = 24, cls = '') {
  const m = iconMarkup(x, size, cls);
  const wrap = document.createElement('span');
  if (m) { wrap.className = 'ic-wrap'; wrap.innerHTML = m; return wrap.firstElementChild; }
  wrap.className = `emoji ${cls}`;
  wrap.textContent = x ?? '';
  return wrap;
}

// Diagram helper: an icon placed like an emoji glyph (centered on x, baseline y).
export function iconInSvg(x, cx, cy, size, color = '#cfe0ff') {
  const n = iconName(x);
  if (!n) return null;
  return `<svg x="${cx - size / 2}" y="${cy - size * 0.82}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;
}

// Rank insignia: chevrons for enlisted, bars for junior officers, leaves for field officers, stars for generals.
export function insignia(index, size = 28) {
  const g = '#f5c451', s = `stroke="${g}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  let body = '';
  if (index === 0) body = `<rect x="7" y="14" width="18" height="4" rx="2" fill="${g}" opacity=".55"/>`;
  else if (index <= 4) {
    const n = Math.min(index + 1, 3);
    for (let i = 0; i < n; i++) body += `<path d="M7 ${10 + i * 6}l9 -5l9 5" ${s}/>`;
    if (index === 4) body += `<circle cx="16" cy="28" r="2.4" fill="${g}"/>`;
  } else if (index <= 7) {
    const n = index - 4;
    for (let i = 0; i < n; i++) body += `<rect x="${16 - n * 4 + i * 8 + 1}" y="9" width="6" height="14" rx="1.5" fill="${g}"/>`;
  } else if (index <= 10) {
    const n = index - 7;
    for (let i = 0; i < n; i++) { const cx = 16 - (n - 1) * 5.5 + i * 11; body += `<path d="M${cx} 7c4 4 4 10 0 16c-4 -6 -4 -12 0 -16z" fill="${g}"/>`; }
  } else {
    const n = index - 10;
    for (let i = 0; i < n; i++) { const cx = 16 - (n - 1) * 6 + i * 12; body += `<path d="M${cx} 8l1.9 4.2l4.6 .5l-3.4 3.1l1 4.5l-4.1 -2.4l-4.1 2.4l1 -4.5l-3.4 -3.1l4.6 -.5z" fill="${g}"/>`; }
  }
  const wrap = document.createElement('span');
  wrap.innerHTML = `<svg class="insignia" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">${body}</svg>`;
  return wrap.firstElementChild;
}
