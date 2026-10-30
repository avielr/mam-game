// Put steps in the right order: tap them one by one.
import { h, mount, rich, sound, shake, shuffle } from '../ui.js';

export function run(root, cfg, done) {
  let li = 0, mistakes = 0, total = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, total / (total + mistakes * 0.5)));
    const L = cfg.levels[li];
    total += L.steps.length;
    const pool = shuffle(L.steps.map((t, idx) => ({ t, idx })));
    let nextIdx = 0;
    const list = h('ol', { class: 'order-list' });
    const fb = h('div');
    const poolEl = h('div', { class: 'options' });

    const paint = () => {
      mount(list, L.steps.slice(0, nextIdx).map(t => h('li', { class: 'fade-in' }, rich(t))),
        nextIdx < L.steps.length ? h('li', { class: 'order-empty' }, '?') : null);
      mount(poolEl, pool.filter(p => p.idx >= nextIdx).map(p => {
        const b = h('button', { class: 'opt', onclick: () => tap(p, b) }, rich(p.t));
        return b;
      }));
    };

    function tap(p, b) {
      if (p.idx === nextIdx) {
        nextIdx++; sound('click'); paint();
        if (nextIdx === L.steps.length) {
          sound('good');
          mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '✅ הסדר נכון! '), rich(L.explain || ''),
            h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, 'הבא ←'))));
        } else mount(fb);
      } else {
        mistakes++; sound('bad'); shake(b);
        mount(fb, h('div', { class: 'feedback bad' }, 'עוד לא. מה צריך לקרות ', h('b', {}, 'קודם'), '?', L.hints?.[nextIdx] ? h('div', {}, '💡 ', rich(L.hints[nextIdx])) : null));
      }
    }

    mount(root,
      h('div', { class: 'mission-box' }, h('b', {}, `📋 ${cfg.levels.length > 1 ? `שלב ${li + 1}/${cfg.levels.length}: ` : ''}`), rich(L.q)),
      list, h('div', { class: 'muted' }, 'לחץ על הצעד הבא:'), poolEl, fb);
    paint();
  }

  level();
}
