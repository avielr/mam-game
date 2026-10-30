// Next-word prediction: guess what a language model will say next, then see the probabilities.
import { h, mount, rich, sound } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

export function run(root, cfg, done) {
  let li = 0, correct = 0;

  function level() {
    if (li >= cfg.levels.length) return done(correct / cfg.levels.length);
    const lv = cfg.levels[li];
    const best = lv.options.reduce((a, b) => (b.p > a.p ? b : a));
    const fb = h('div');
    const sentence = h('div', { class: 'llm-sentence' }, rich(lv.text), ' ', h('span', { class: 'llm-blank' }, '___'));
    const opts = h('div', { class: 'options' }, lv.options.map(o => h('button', { class: 'opt', onclick: () => pick(o) }, o.w)));

    function pick(o) {
      const ok = o === best;
      if (ok) { correct++; sound('good'); } else sound('bad');
      sentence.querySelector('.llm-blank').textContent = best.w;
      const max = Math.max(...lv.options.map(x => x.p));
      mount(opts, [...lv.options].sort((a, b) => b.p - a.p).map(x => h('div', { class: `prob ${x === best ? 'top' : ''} ${x === o ? 'mine' : ''}` },
        h('span', { class: 'prob-w' }, x.w, x === o ? L(' (שלך)', ' (yours)') : ''),
        h('span', { class: 'prob-bar' }, h('i', { style: { width: `${(x.p / max) * 100}%` } })),
        h('span', { class: 'prob-p ltr' }, `${x.p}%`))));
      mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, ok ? L('חשבת כמו מודל שפה! ', 'You thought like a language model! ') : L('המודל היה בוחר אחרת. ', 'The model would pick differently. ')), rich(lv.explain || ''),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
    }

    mount(root,
      h('div', { class: 'row', style: { marginBottom: '8px' } }, h('span', { class: 'chip' }, icon('brain', 14), L(' מודל שפה', ' Language model')), h('span', { class: 'spacer' }), h('span', { class: 'muted' }, `${li + 1}/${cfg.levels.length}`)),
      h('div', { class: 'muted' }, L('איזו מילה המודל הכי סביר שיבחור?', 'Which word is the model most likely to pick?')),
      sentence, opts, fb);
  }

  level();
}
