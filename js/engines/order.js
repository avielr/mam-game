// Put steps in the right order: tap them one by one.
import { h, mount, rich, sound, shake, shuffle } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

export function run(root, cfg, done) {
  let li = 0, mistakes = 0, total = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, total / (total + mistakes * 0.5)));
    const lv = cfg.levels[li];
    total += lv.steps.length;
    const pool = shuffle(lv.steps.map((t, idx) => ({ t, idx })));
    let nextIdx = 0;
    const list = h('ol', { class: 'order-list' });
    const fb = h('div');
    const poolEl = h('div', { class: 'options' });

    const paint = () => {
      mount(list, lv.steps.slice(0, nextIdx).map(t => h('li', { class: 'fade-in' }, rich(t))),
        nextIdx < lv.steps.length ? h('li', { class: 'order-empty' }, '?') : null);
      mount(poolEl, pool.filter(p => p.idx >= nextIdx).map(p => {
        const b = h('button', { class: 'opt', onclick: () => tap(p, b) }, rich(p.t));
        return b;
      }));
    };

    function tap(p, b) {
      if (p.idx === nextIdx) {
        nextIdx++; sound('click'); paint();
        if (nextIdx === lv.steps.length) {
          sound('good');
          mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('הסדר נכון! ', 'Right order! ')), rich(lv.explain || ''),
            h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
        } else mount(fb);
      } else {
        mistakes++; sound('bad'); shake(b);
        mount(fb, h('div', { class: 'feedback bad' }, L('עוד לא. מה צריך לקרות ', 'Not yet. What needs to happen '), h('b', {}, L('קודם', 'first')), '?', lv.hints?.[nextIdx] ? h('div', {}, icon('lightbulb', 16), ' ', rich(lv.hints[nextIdx])) : null));
      }
    }

    mount(root,
      h('div', { class: 'mission-box' }, cfg.levels.length > 1 ? h('b', {}, L(`שלב ${li + 1}/${cfg.levels.length}: `, `Level ${li + 1}/${cfg.levels.length}: `)) : null, rich(lv.q)),
      list, h('div', { class: 'muted' }, L('לחץ על הצעד הבא:', 'Tap the next step:')), poolEl, fb);
    paint();
  }

  level();
}
