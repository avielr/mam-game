import { h, mount } from '../ui.js';
import { getState, rankFor, isDone } from '../state.js';
import { RANKS } from '../content/meta.js';
import { BASES } from '../content/index.js';
import { topbar } from './common.js';

export function baseUnlocked(idx) {
  if (idx === 0) return true;
  const prev = BASES[idx - 1];
  return !prev.soon && prev.missions.length > 0 && isDone(prev.missions[prev.missions.length - 1].id);
}

export function missionUnlocked(base, mi) {
  return mi === 0 || isDone(base.missions[mi - 1].id);
}

export function render(app) {
  const st = getState();
  const rank = rankFor(st.xp, RANKS);
  const hero = h('section', { class: 'hero' },
    h('div', { class: 'avatar' }, st.avatar),
    h('div', { style: { flex: 1 } },
      h('h1', { style: { margin: 0, fontSize: '23px' } }, `${rank.name} ${st.agentName}`),
      h('div', { class: 'muted', style: { fontSize: '15px', marginBottom: '6px' } },
        rank.next ? `עוד ${rank.next.xp - st.xp} XP לדרגת ${rank.next.name} ${rank.next.icon}` : 'הגעת לדרגה הגבוהה ביותר!'),
      h('div', { class: 'xpbar' }, h('i', { style: { width: Math.round(rank.pct * 100) + '%' } }))));

  const bases = BASES.map((b, bi) => {
    const open = baseUnlocked(bi) && !b.soon;
    const doneCount = b.missions.filter(m => isDone(m.id)).length;
    let currentMarked = false;
    const nodes = b.missions.map((m, mi) => {
      const done = isDone(m.id);
      const unlocked = open && missionUnlocked(b, mi);
      const current = unlocked && !done && !currentMarked;
      if (current) currentMarked = true;
      const stars = st.missions[m.id]?.stars || 0;
      return h('a', {
        class: `node ${done ? 'done' : ''} ${current ? 'current' : ''} ${unlocked ? '' : 'locked'} ${m.boss ? 'boss' : ''}`,
        href: unlocked ? `#/mission/${m.id}` : undefined, 'aria-disabled': unlocked ? undefined : 'true',
      },
        h('div', { class: 'dot' }, unlocked ? m.emoji : '🔒'),
        h('div', { style: { flex: 1 } }, h('div', { class: 't' }, m.title), h('div', { class: 's' }, m.topic)),
        done ? h('span', { class: 'stars' }, '★'.repeat(stars) + '☆'.repeat(3 - stars)) : current ? h('span', { class: 'chip' }, 'שחק ▶') : null);
    });
    return h('section', { class: `base ${open ? '' : 'locked'}`, style: { borderColor: b.color + '88' } },
      h('div', { class: 'base-head' },
        h('div', { class: 'emblem', style: { background: b.color + '33' } }, b.emblem),
        h('div', { style: { flex: 1 } }, h('h2', {}, `בסיס ${b.id}: ${b.title}`), h('div', { class: 'sub' }, b.subtitle)),
        b.soon ? h('span', { class: 'chip' }, '🚧 בקרוב') : h('span', { class: 'chip' }, `${doneCount}/${b.missions.length}`)),
      b.soon
        ? h('p', { class: 'muted', style: { margin: 0 } }, 'המפקד מכין את המשימות של הבסיס הזה. סיים את הבסיס הקודם, והוא ייפתח!')
        : h('div', { class: 'path' }, nodes));
  });

  mount(app, topbar(), hero, ...bases);
}
