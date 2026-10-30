// Shared SVG diagram helpers for content files.
export const T = (x, y, s, fill = '#eef3ff', size = 13, weight = 700) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Rubik, Arial" font-size="${size}" font-weight="${weight}" fill="${fill}">${s}</text>`;
export const E = (x, y, e, size = 30) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}">${e}</text>`;
export const box = (x, y, w, hh, fill = '#1d3163', stroke = '#2a4180') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
export const arrow = (x1, y1, x2, y2, c = '#22d3a6') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#ah)"/>`;
export const svg = (body, vb = '0 0 320 160') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#22d3a6"/></marker></defs>${body}</svg>`;

