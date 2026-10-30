import { h, mount } from '../ui.js';
import { getState, update, rankFor } from '../state.js';
import { RANKS, BADGES } from '../content/meta.js';
import { ALL_MISSIONS } from '../content/index.js';
import { topbar } from './common.js';

export function render(app) {
  const st = getState();
  const rank = rankFor(st.xp, RANKS);
  const done = ALL_MISSIONS.filter(m => st.missions[m.id]?.firstDoneAt).length;
  const stars = Object.values(st.missions).reduce((a, m) => a + (m.stars || 0), 0);

  const soundBtn = h('button', { class: 'btn secondary small', onclick: () => { update(s => { s.sound = !s.sound; }); render(app); } },
    st.sound ? '🔊 צלילים: פועל' : '🔇 צלילים: כבוי');

  mount(app, topbar(),
    h('section', { class: 'card center' },
      h('div', { class: 'big-emoji' }, st.avatar),
      h('h1', { style: { margin: '8px 0 2px' } }, st.agentName),
      h('div', { style: { fontSize: '20px' } }, `${rank.icon} ${rank.name}`),
      h('div', { class: 'xpbar', style: { margin: '10px auto', maxWidth: '320px' } }, h('i', { style: { width: Math.round(rank.pct * 100) + '%' } })),
      h('div', { class: 'muted' }, h('bdi', { class: 'ltr' }, rank.next ? `${st.xp} / ${rank.next.xp} XP` : `${st.xp} XP`))),
    st.missions['m4-boss']?.firstDoneAt ? h('section', { class: 'card certificate center' },
      h('div', { class: 'big-emoji' }, '🎓'),
      h('h2', {}, 'תעודת בוגר המסע'),
      h('p', {}, `מוענקת ל${st.agentName} על השלמת ארבעת הבסיסים: רשת, האקרים, תכנות ובינה מלאכותית.`),
      h('p', { class: 'muted' }, `תא״ל ביט, מפקד היחידה · ${new Date(st.missions['m4-boss'].firstDoneAt).toLocaleDateString('he-IL')}`)) : null,
    h('section', { class: 'card' },
      h('div', { class: 'grid2' },
        h('div', { class: 'stat' }, h('b', {}, done), 'משימות'),
        h('div', { class: 'stat' }, h('b', {}, stars), 'כוכבים'),
        h('div', { class: 'stat' }, h('b', {}, `🔥 ${st.streak.count}`), 'ימים ברצף'),
        h('div', { class: 'stat' }, h('b', {}, st.streak.best), 'שיא רצף'))),
    h('section', { class: 'card' },
      h('h2', {}, 'תגים'),
      h('div', { class: 'badge-grid' }, Object.entries(BADGES).map(([id, b]) =>
        h('div', { class: `badge ${st.badges.includes(id) ? '' : 'off'}`, title: b.desc }, h('span', { class: 'em' }, b.emoji), b.name)))),
    h('section', { class: 'card' },
      h('h2', {}, 'סולם הדרגות'),
      h('div', { class: 'badge-grid' }, RANKS.map((r, i) =>
        h('div', { class: `badge ${i <= rank.index ? '' : 'off'}` }, h('span', { class: 'em' }, r.icon), r.name, h('div', { class: 'muted' }, `${r.xp} XP`))))),
    h('section', { class: 'card' },
      h('h2', {}, 'הגדרות'),
      h('div', { class: 'row' }, soundBtn,
        h('a', { class: 'btn secondary small', href: '#/welcome' }, '✏️ שינוי שם וסמל'),
        h('span', { class: 'spacer' }),
        h('a', { class: 'btn secondary small', href: '#/parent' }, '👨‍👧 אזור הורים'))));
}
