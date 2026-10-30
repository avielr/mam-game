// Shared SVG diagram helpers for content files.
import { iconInSvg } from '../icons.js';

export const T = (x, y, s, fill = '#e6edf7', size = 13, weight = 600) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Rubik, Arial" font-size="${size}" font-weight="${weight}" fill="${fill}">${s}</text>`;
// Emoji slots render as line icons when one is mapped; otherwise the emoji itself.
export const E = (x, y, e, size = 30) =>
  iconInSvg(e, x, y, size * 0.9) || `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}">${e}</text>`;
export const box = (x, y, w, hh, fill = '#121c33', stroke = '#26365c') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
export const arrow = (x1, y1, x2, y2, c = '#3ee0c4') =>
  `<line class="flow" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#ah)"/>`;
export const svg = (body, vb = '0 0 320 160') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#3ee0c4"/></marker></defs>${body}</svg>`;
