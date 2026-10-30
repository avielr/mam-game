import { h } from '../ui.js';
import { getState, rankFor } from '../state.js';
import { RANKS, tr } from '../content/meta.js';
import { L, isEn, setLang } from '../i18n.js';
import { icon, insignia } from '../icons.js';

export const fill = (text) => String(text).replaceAll('{name}', getState().agentName || L('סוכן', 'Agent'));

export const langToggle = () => h('button', { class: 'chip lang', 'aria-label': L('Switch to English', 'החלף לעברית'), onclick: () => setLang(isEn() ? 'he' : 'en') },
  icon('languages', 16), isEn() ? 'עב' : 'EN');

export const avatarIcon = (size = 22) => icon(getState().avatar || 'scan-face', size);

export function topbar() {
  const st = getState();
  const rank = rankFor(st.xp, RANKS);
  return h('header', { class: 'topbar' },
    h('a', { class: 'brand', href: '#/' }, h('img', { src: 'icons/icon.svg', width: 30, height: 30, alt: '' }), h('span', {}, L('סוכן ממר״ם', 'Mamram Agent'))),
    langToggle(),
    h('span', { class: 'chip', title: L('ימים ברצף', 'Day streak') }, icon('flame', 16), st.streak.count),
    h('span', { class: 'chip', title: tr(rank.name) }, insignia(rank.index, 18), h('bdi', {}, st.xp)),
    h('a', { class: 'icon-btn', href: '#/profile', 'aria-label': L('הפרופיל שלי', 'My profile') }, avatarIcon()));
}
