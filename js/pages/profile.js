import { h, mount } from '../ui.js';
import { getState, update, rankFor } from '../state.js';
import { RANKS, BADGES, tr } from '../content/meta.js';
import { allMissions } from '../content/index.js';
import { L, isEn } from '../i18n.js';
import { icon, insignia } from '../icons.js';
import { canSpeak } from '../narrator.js';
import { topbar, avatarIcon, langToggle } from './common.js';

export function render(app) {
  const st = getState();
  const rank = rankFor(st.xp, RANKS);
  const done = allMissions().filter(m => st.missions[m.id]?.firstDoneAt).length;
  const stars = Object.values(st.missions).reduce((a, m) => a + (m.stars || 0), 0);
  const toggle = (key, on, off, ic) => h('button', { class: 'btn secondary small', onclick: () => { update(s => { s[key] = !s[key]; }); render(app); } },
    icon(st[key] ? ic[0] : ic[1], 18), st[key] ? on : off);

  mount(app, topbar(),
    h('section', { class: 'card center' },
      h('div', { class: 'avatar big' }, avatarIcon(52)),
      h('h1', { style: { margin: '10px 0 2px' } }, st.agentName),
      h('div', { class: 'rank-line' }, insignia(rank.index, 26), tr(rank.name)),
      h('div', { class: 'xpbar', style: { margin: '10px auto', maxWidth: '320px' } }, h('i', { style: { width: Math.round(rank.pct * 100) + '%' } })),
      h('div', { class: 'muted' }, h('bdi', { class: 'ltr' }, rank.next ? `${st.xp} / ${rank.next.xp} XP` : `${st.xp} XP`))),
    st.missions['m4-boss']?.firstDoneAt ? h('section', { class: 'card certificate center' },
      h('div', { class: 'hero-icon gold' }, icon('graduation-cap', 44)),
      h('h2', {}, L('תעודת בוגר המסע', 'Certificate of Completion')),
      h('p', {}, L(`מוענקת ל${st.agentName} על השלמת ארבעת הבסיסים: רשת, האקרים, תכנות ובינה מלאכותית.`,
        `Awarded to ${st.agentName} for completing all four bases: networks, hackers, coding and AI.`)),
      h('p', { class: 'muted' }, L('תא״ל ביט, מפקד היחידה', 'Brig. Gen. Bit, Unit Commander'), ' · ', new Date(st.missions['m4-boss'].firstDoneAt).toLocaleDateString(isEn() ? 'en-GB' : 'he-IL'))) : null,
    h('section', { class: 'card' },
      h('div', { class: 'grid2' },
        h('div', { class: 'stat' }, h('b', {}, done), L('משימות', 'Missions')),
        h('div', { class: 'stat' }, h('b', {}, stars), L('כוכבים', 'Stars')),
        h('div', { class: 'stat' }, h('b', {}, st.streak.count), L('ימים ברצף', 'Day streak')),
        h('div', { class: 'stat' }, h('b', {}, st.streak.best), L('שיא רצף', 'Best streak')))),
    h('section', { class: 'card' },
      h('h2', {}, L('תגים', 'Badges')),
      h('div', { class: 'badge-grid' }, Object.entries(BADGES).map(([id, b]) =>
        h('div', { class: `badge ${st.badges.includes(id) ? '' : 'off'}`, title: tr(b.desc) }, h('span', { class: 'hexi' }, icon(b.icon, 24)), h('span', {}, tr(b.name)))))),
    h('section', { class: 'card' },
      h('h2', {}, L('סולם הדרגות', 'Rank ladder')),
      h('div', { class: 'badge-grid' }, RANKS.map((r, i) =>
        h('div', { class: `badge ${i <= rank.index ? '' : 'off'}` }, insignia(i, 34), h('span', {}, tr(r.name)), h('div', { class: 'muted' }, h('bdi', {}, `${r.xp} XP`)))))),
    h('section', { class: 'card' },
      h('h2', {}, L('הגדרות', 'Settings')),
      h('div', { class: 'row' },
        toggle('sound', L('צלילים: פועל', 'Sound: on'), L('צלילים: כבוי', 'Sound: off'), ['volume-2', 'volume-x']),
        toggle('narration', L('קריינות: פועלת', 'Narration: on'), L('קריינות: כבויה', 'Narration: off'), ['mic', 'volume-x']),
        langToggle(),
        h('a', { class: 'btn secondary small', href: '#/welcome' }, icon('pencil', 18), L('שינוי שם וסמל', 'Edit name & emblem')),
        h('span', { class: 'spacer' }),
        h('a', { class: 'btn secondary small', href: '#/parent' }, icon('users', 18), L('אזור הורים', 'Parent zone'))),
      st.narration && !canSpeak() ? h('p', { class: 'muted', style: { fontSize: '14px', marginTop: '10px' } },
        L('לא נמצא קול עברי במכשיר הזה, אז הסרטונים יוצגו עם כתוביות בלבד. אפשר להתקין קול עברי בהגדרות "המרת טקסט לדיבור" של המכשיר.',
          'No English voice was found on this device, so videos show captions only. You can install one in the device’s text-to-speech settings.')) : null));
}
