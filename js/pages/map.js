import { h, mount } from '../ui.js';
import { getState, rankFor, isDone } from '../state.js';
import { RANKS, tr } from '../content/meta.js';
import { bases } from '../content/index.js';
import { L } from '../i18n.js';
import { icon, insignia } from '../icons.js';
import { topbar, avatarIcon } from './common.js';

export function baseUnlocked(idx) {
  if (idx === 0) return true;
  const prev = bases()[idx - 1];
  return !prev.soon && prev.missions.length > 0 && isDone(prev.missions[prev.missions.length - 1].id);
}

export function missionUnlocked(base, mi) {
  return mi === 0 || isDone(base.missions[mi - 1].id);
}

export function render(app) {
  const st = getState();
  const rank = rankFor(st.xp, RANKS);
  const hero = h('section', { class: 'hero' },
    h('div', { class: 'avatar' }, avatarIcon(38)),
    h('div', { style: { flex: 1, minWidth: 0 } },
      h('div', { class: 'kicker' }, insignia(rank.index, 18), tr(rank.name)),
      h('h1', { style: { margin: '2px 0 4px', fontSize: '24px' } }, st.agentName),
      h('div', { class: 'muted', style: { fontSize: '14px', marginBottom: '6px' } },
        rank.next ? L(`עוד ${rank.next.xp - st.xp} XP לדרגת ${tr(rank.next.name)}`, `${rank.next.xp - st.xp} XP to ${tr(rank.next.name)}`) : L('הגעת לדרגה הגבוהה ביותר!', 'Top rank reached!')),
      h('div', { class: 'xpbar' }, h('i', { style: { width: Math.round(rank.pct * 100) + '%' } }))));

  const sections = bases().map((b, bi) => {
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
        h('div', { class: 'dot' }, icon(unlocked ? m.emoji : 'lock', 22)),
        h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { class: 't' }, m.title), h('div', { class: 's' }, m.topic)),
        done ? h('span', { class: 'stars' }, [0, 1, 2].map(i => icon('star', 15, i < stars ? 'star-on' : 'star-off')))
          : current ? h('span', { class: 'chip play' }, L('שחק', 'Play'), icon('play', 14)) : null);
    });
    return h('section', { class: `base ${open ? '' : 'locked'}`, style: `--base:${b.color}` },
      h('div', { class: 'base-head' },
        h('div', { class: 'emblem' }, icon(b.emblem, 30)),
        h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { class: 'kicker' }, L(`בסיס ${b.id}`, `Base ${b.id}`)), h('h2', {}, b.title), h('div', { class: 'sub' }, b.subtitle)),
        h('span', { class: 'chip' }, open ? h('bdi', {}, `${doneCount}/${b.missions.length}`) : icon('lock', 16))),
      h('div', { class: 'path' }, nodes));
  });

  mount(app, topbar(), hero, ...sections);
}
