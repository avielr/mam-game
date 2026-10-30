// Tap-to-sort: one card at a time, choose the right bin.
import { h, mount, rich, shuffle, sound, shake } from '../ui.js';

export function run(root, cfg, done) {
  const items = shuffle(cfg.items);
  let i = 0, correct = 0;

  function show() {
    if (i >= items.length) return done(correct / items.length);
    const it = items[i];
    const card = h('div', { class: 'sort-item' }, h('div', {}, h('span', { class: 'em' }, it.emoji), rich(it.text)));
    const fb = h('div');
    const bins = h('div', { class: 'bins', style: cfg.bins.length > 2 ? { gridTemplateColumns: '1fr 1fr' } : {} },
      cfg.bins.map(b => h('button', { class: 'bin', onclick: () => pick(b.id, card, bins, fb) }, `${b.emoji} ${b.label}`)));
    mount(root,
      h('div', { class: 'row', style: { marginBottom: '10px' } }, h('span', { class: 'muted' }, `${i + 1} / ${items.length}`), h('span', { class: 'spacer' }), h('span', { class: 'chip' }, `✅ ${correct}`)),
      card, bins, fb);
  }

  function pick(binId, card, bins, fb) {
    const it = items[i];
    const ok = binId === it.bin;
    bins.querySelectorAll('button').forEach(b => (b.disabled = true));
    const right = cfg.bins.find(b => b.id === it.bin);
    if (ok) { correct++; sound('good'); } else { sound('bad'); shake(card); }
    mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` },
      h('b', {}, ok ? 'נכון! ' : `לא בדיוק. התשובה: ${right.emoji} ${right.label}. `), rich(it.why || ''),
      h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { i++; show(); } }, 'הבא ←'))));
  }

  show();
}
