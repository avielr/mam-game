// Teach the machine: choose training examples, train a (simulated) model, test it.
// Model rule: a test item is recognised if training saw the same "type" with its label;
// otherwise it falls back to the majority label for that colour — which exposes data bias.
import { h, mount, rich, sound, shake } from '../ui.js';

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
    const L = cfg.levels[li];
    const labelOf = id => L.labels.find(l => l.id === id);
    const chosen = new Set(L.preset || []);
    let trainings = 0;
    const fb = h('div');
    const poolEl = h('div', { class: 'tiles' });
    const counts = h('div', { class: 'row', style: { margin: '6px 0' } });
    const results = h('div');

    const paint = () => {
      mount(poolEl, L.pool.map((it, i) => h('button', {
        class: `tile ${chosen.has(i) ? 'sel' : ''} ${(L.preset || []).includes(i) ? 'locked' : ''}`,
        onclick: () => { if ((L.preset || []).includes(i)) return; chosen.has(i) ? chosen.delete(i) : chosen.add(i); sound('click'); paint(); },
      }, h('span', { class: 'em' }, it.e), h('small', {}, `${labelOf(it.label).emoji} ${labelOf(it.label).name}`))));
      mount(counts, L.labels.map(l => h('span', { class: 'chip' }, `${l.emoji} ${[...chosen].filter(i => L.pool[i].label === l.id).length}`)),
        h('span', { class: 'spacer' }), h('span', { class: 'muted', style: { fontSize: '14px' } }, `נבחרו ${chosen.size} דוגמאות`));
    };

    async function train() {
      const min = L.minPerLabel || 2;
      if (L.labels.some(l => [...chosen].filter(i => L.pool[i].label === l.id).length < min)) {
        sound('bad'); shake(poolEl);
        return mount(fb, h('div', { class: 'feedback bad' }, rich(`צריך לפחות **${min} דוגמאות מכל סוג** כדי ללמוד.`)));
      }
      trainings++;
      mount(fb); mount(results, h('div', { class: 'mission-box center' }, '🏋️ המודל מתאמן... ', h('span', { class: 'typing' }, h('i'), h('i'), h('i'))));
      await new Promise(r => setTimeout(r, 1100));
      const training = [...chosen].map(i => L.pool[i]);
      const res = L.test.map(t => ({ t, guess: predict(training, t) }));
      const acc = res.filter(r => r.guess === r.t.label).length / res.length;
      mount(results, h('div', { class: 'mission-box' },
        h('b', {}, '🧪 בדיקה על תמונות חדשות:'),
        h('div', { class: 'tiles', style: { marginTop: '8px' } }, res.map(r => h('div', { class: `tile ${r.guess === r.t.label ? 'ok' : 'bad'}` },
          h('span', { class: 'em' }, r.t.e), h('small', {}, `${r.guess === r.t.label ? '✅' : '❌'} ${labelOf(r.guess)?.name || '?'}`)))),
        h('div', { class: 'big-acc' }, `דיוק: ${Math.round(acc * 100)}%`)));
      if (acc >= (L.need || 0.8)) {
        sound('win');
        scores.push(trainings === 1 ? 1 : Math.max(0.6, 1 - (trainings - 1) * 0.15));
        mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '🎉 המודל למד! '), rich(L.explain),
          h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, 'הבא ←'))));
      } else {
        sound('bad');
        const wrong = res.filter(r => r.guess !== r.t.label).map(r => r.t.e).join(' ');
        mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, `המודל טעה ב: ${wrong}. `), rich(L.failTip || 'אולי חסרות דוגמאות מגוונות? הוסף דוגמאות שדומות למה שהוא טעה בו.')));
      }
    }

    mount(root,
      h('div', { class: 'mission-box' }, h('b', {}, `🤖 שלב ${li + 1}/${cfg.levels.length}: `), rich(L.task)),
      h('div', { class: 'muted', style: { fontSize: '14px' } }, (L.preset || []).length ? 'הדוגמאות עם 🔒 כבר בסט האימון. לחץ כדי להוסיף עוד:' : 'לחץ על דוגמאות כדי להכניס אותן לסט האימון:'),
      poolEl, counts,
      h('button', { class: 'btn block', onclick: train }, '🏋️ אמן את המודל'),
      results, fb);
    paint();
  }

  level();
}
