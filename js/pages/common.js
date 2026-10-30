import { h } from '../ui.js';
import { getState, rankFor } from '../state.js';
import { RANKS } from '../content/meta.js';

export const fill = (text) => String(text).replaceAll('{name}', getState().agentName || 'סוכן');

export function topbar() {
  const st = getState();
  const rank = rankFor(st.xp, RANKS);
  return h('header', { class: 'topbar' },
    h('a', { class: 'brand', href: '#/' }, h('img', { src: 'icons/icon.svg', width: 32, height: 32, alt: '' }), 'סוכן ממר״ם'),
    h('span', { class: 'chip', title: 'ימים ברצף' }, '🔥 ', st.streak.count),
    h('span', { class: 'chip', title: 'נקודות ניסיון' }, `${rank.icon} ${st.xp}`),
    h('a', { class: 'icon-btn', href: '#/profile', 'aria-label': 'הפרופיל שלי' }, st.avatar));
}
