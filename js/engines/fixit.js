// Scenario fixer: each device/situation has a problem; pick the right fix.
import { h, mount, rich, sound, shake } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

export function run(root, cfg, done) {
  let i = 0, correct = 0;

  function show() {
    if (i >= cfg.items.length) return done(correct / cfg.items.length);
    const it = cfg.items[i];
    const fb = h('div');
    const scene = h('div', { class: 'scene' }, h('div', { class: 'em' }, it.emoji),
      h('div', { class: 'problem' }, h('b', {}, it.name), h('div', {}, icon('triangle-alert', 16), ' ', rich(it.problem))));
    const opts = h('div', { class: 'options' }, it.options.map((o, idx) =>
      h('button', { class: 'opt', onclick: e => pick(idx, opts, fb, scene) }, rich(o))));
    mount(root,
      h('div', { class: 'row', style: { marginBottom: '10px' } }, h('span', { class: 'muted' }, L(`תיק ${i + 1} מתוך ${cfg.items.length}`, `Case ${i + 1} of ${cfg.items.length}`)), h('span', { class: 'spacer' }), h('span', { class: 'chip' }, icon('wrench', 14), ` ${correct}`)),
      scene, h('div', { class: 'muted' }, L('מה התיקון הנכון?', "What's the right fix?")), opts, fb);
  }

  function pick(idx, opts, fb, scene) {
    const it = cfg.items[i];
    const ok = idx === it.answer;
    [...opts.children].forEach((b, j) => {
      b.disabled = true;
      if (j === it.answer) b.classList.add('correct');
      else if (j === idx) b.classList.add('wrong');
      else b.classList.add('dim');
    });
    if (ok) { correct++; sound('good'); } else { sound('bad'); shake(scene); }
    mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, ok ? L('תוקן! ', 'Fixed! ') : L('אופס. ', 'Oops. ')), rich(it.explain),
      h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { i++; show(); } }, L('הבא ←', 'Next →')))));
  }

  show();
}
