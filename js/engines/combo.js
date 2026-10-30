// Runs several engines in a row; score = average.
import { h, mount, sound } from '../ui.js';
import { ENGINES } from './index.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

export function run(root, cfg, done) {
  const scores = [];
  let i = 0;

  function part() {
    if (i >= cfg.parts.length) return done(scores.reduce((a, b) => a + b, 0) / scores.length);
    const p = cfg.parts[i];
    const stage = h('div');
    mount(root,
      h('div', { class: 'row', style: { marginBottom: '10px' } },
        h('h3', { style: { margin: 0 } }, p.title), h('span', { class: 'spacer' }),
        h('div', { class: 'level-dots' }, cfg.parts.map((_, j) => h('i', { class: j < i ? 'done' : j === i ? 'on' : '' })))),
      stage);
    ENGINES[p.engine](stage, p.config, score => {
      scores.push(score);
      i++;
      if (i < cfg.parts.length) {
        sound('win');
        mount(root, h('div', { class: 'card center fade-in' }, h('div', { class: 'big-emoji' }, icon('circle-check', 56)),
          h('h3', {}, L(`${p.title}: הושלם!`, `${p.title}: complete!`)),
          h('button', { class: 'btn', onclick: part }, L('לשלב הבא ←', 'Next stage →'))));
      } else part();
    });
  }

  part();
}
