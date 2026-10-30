// Teach the machine: choose training examples, train a (simulated) model, test it.
// Model rule: a test item is recognised if training saw the same "type" with its label;
// otherwise it falls back to the majority label for that colour — which exposes data bias.
import { h, mount, rich, sound, shake } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

export function predict(training, item) {
  const same = training.find(t => t.type === item.type);
  if (same) return same.label;
  const byColor = training.filter(t => t.color === item.color);
  const pool = byColor.length ? byColor : training;
  const counts = {};
  pool.forEach(t => { counts[t.label] = (counts[t.label] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

export function run(root, cfg, done) {
  let li = 0;
  const scores = [];

  function level() {
    if (li >= cfg.levels.length) return done(scores.reduce((a, b) => a + b, 0) / scores.length);
    const lv = cfg.levels[li];
    const labelOf = id => lv.labels.find(l => l.id === id);
    const chosen = new Set(lv.preset || []);
    let trainings = 0;
    const fb = h('div');
    const poolEl = h('div', { class: 'tiles' });
    const counts = h('div', { class: 'row', style: { margin: '6px 0' } });
    const results = h('div');

    const paint = () => {
      mount(poolEl, lv.pool.map((it, i) => h('button', {
        class: `tile ${chosen.has(i) ? 'sel' : ''} ${(lv.preset || []).includes(i) ? 'locked' : ''}`,
        onclick: () => { if ((lv.preset || []).includes(i)) return; chosen.has(i) ? chosen.delete(i) : chosen.add(i); sound('click'); paint(); },
      }, h('span', { class: 'em' }, it.e), h('small', {}, `${labelOf(it.label).emoji} ${labelOf(it.label).name}`))));
      mount(counts, lv.labels.map(l => h('span', { class: 'chip' }, `${l.emoji} ${[...chosen].filter(i => lv.pool[i].label === l.id).length}`)),
        h('span', { class: 'spacer' }), h('span', { class: 'muted', style: { fontSize: '14px' } }, L(`נבחרו ${chosen.size} דוגמאות`, `${chosen.size} examples chosen`)));
    };

    async function train() {
      const min = lv.minPerLabel || 2;
      if (lv.labels.some(l => [...chosen].filter(i => lv.pool[i].label === l.id).length < min)) {
        sound('bad'); shake(poolEl);
        return mount(fb, h('div', { class: 'feedback bad' }, rich(L(`צריך לפחות **${min} דוגמאות מכל סוג** כדי ללמוד.`, `It needs at least **${min} examples of each kind** to learn.`))));
      }
      trainings++;
      mount(fb); mount(results, h('div', { class: 'mission-box center' }, L('המודל מתאמן... ', 'The model is training... '), h('span', { class: 'typing' }, h('i'), h('i'), h('i'))));
      await new Promise(r => setTimeout(r, 1100));
      const training = [...chosen].map(i => lv.pool[i]);
      const res = lv.test.map(t => ({ t, guess: predict(training, t) }));
      const acc = res.filter(r => r.guess === r.t.label).length / res.length;
      mount(results, h('div', { class: 'mission-box' },
        h('b', {}, L('בדיקה על תמונות חדשות:', 'Test on new pictures:')),
        h('div', { class: 'tiles', style: { marginTop: '8px' } }, res.map(r => h('div', { class: `tile ${r.guess === r.t.label ? 'ok' : 'bad'}` },
          h('span', { class: 'em' }, r.t.e), h('small', {}, icon(r.guess === r.t.label ? 'circle-check' : 'circle-x', 13), ` ${labelOf(r.guess)?.name || '?'}`)))),
        h('div', { class: 'big-acc' }, L(`דיוק: ${Math.round(acc * 100)}%`, `Accuracy: ${Math.round(acc * 100)}%`))));
      if (acc >= (lv.need || 0.8)) {
        sound('win');
        scores.push(trainings === 1 ? 1 : Math.max(0.6, 1 - (trainings - 1) * 0.15));
        mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('המודל למד! ', 'The model learned! ')), rich(lv.explain),
          h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
      } else {
        sound('bad');
        const wrong = res.filter(r => r.guess !== r.t.label).map(r => r.t.e).join(' ');
        mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, L(`המודל טעה ב: ${wrong}. `, `The model got these wrong: ${wrong}. `)), rich(lv.failTip || L('אולי חסרות דוגמאות מגוונות? הוסף דוגמאות שדומות למה שהוא טעה בו.', 'Maybe it lacks varied examples? Add examples similar to the ones it got wrong.'))));
      }
    }

    mount(root,
      h('div', { class: 'mission-box' }, h('b', {}, L(`שלב ${li + 1}/${cfg.levels.length}: `, `Level ${li + 1}/${cfg.levels.length}: `)), rich(lv.task)),
      h('div', { class: 'muted', style: { fontSize: '14px' } }, (lv.preset || []).length ? L('הדוגמאות עם 🔒 כבר בסט האימון. לחץ כדי להוסיף עוד:', 'The examples with 🔒 are already in the training set. Tap to add more:') : L('לחץ על דוגמאות כדי להכניס אותן לסט האימון:', 'Tap examples to put them in the training set:')),
      poolEl, counts,
      h('button', { class: 'btn block', onclick: train }, L('אמן את המודל', 'Train the model')),
      results, fb);
    paint();
  }

  level();
}
