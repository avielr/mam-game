// Prompt lab (simulated AI): build a prompt from parts, see how output quality changes.
import { h, mount, rich, sound, shake } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

export function run(root, cfg, done) {
  let li = 0;
  const scores = [];

  function level() {
    if (li >= cfg.levels.length) return done(scores.reduce((a, b) => a + b, 0) / scores.length);
    const lv = cfg.levels[li];
    const pick = lv.groups.map(() => -1);
    let sends = 0;
    const preview = h('div', { class: 'prompt-preview' });
    const outBox = h('div');
    const fb = h('div');
    const groupsEl = h('div');

    const paint = () => {
      mount(groupsEl, lv.groups.map((g, gi) => h('div', { class: 'pgroup' },
        h('div', { class: 'pgroup-label' }, icon(g.icon || 'puzzle', 16), ` ${g.label}`),
        h('div', { class: 'chips' }, g.options.map((o, oi) => h('button', { class: `pchip ${pick[gi] === oi ? 'sel' : ''}`, onclick: () => { pick[gi] = pick[gi] === oi ? -1 : oi; sound('click'); paint(); } }, o.t))))));
      const parts = pick.map((p, gi) => p >= 0 ? lv.groups[gi].options[p].t : null).filter(Boolean);
      mount(preview, h('div', { class: 'muted', style: { fontSize: '13px' } }, L('הפרומפט שלך:', 'Your prompt:')),
        parts.length ? h('div', {}, parts.join(' ')) : h('div', { class: 'muted' }, L('בחר חלקים כדי לבנות פרומפט...', 'Pick parts to build a prompt...')));
    };

    async function send() {
      if (pick.every(p => p < 0)) return shake(preview);
      sends++;
      const good = pick.filter((p, gi) => p >= 0 && lv.groups[gi].options[p].good).length;
      const bad = pick.filter((p, gi) => p >= 0 && lv.groups[gi].options[p].bad).length;
      const score = good - bad;
      const out = [...lv.outputs].sort((a, b) => b.min - a.min).find(o => score >= o.min) || lv.outputs[0];
      mount(outBox, h('div', { class: 'ai-out' }, h('div', { class: 'ai-head' }, icon('bot', 16), L(' AI כותב...', ' AI is writing...')), h('div', { class: 'typing' }, h('i'), h('i'), h('i'))));
      await new Promise(r => setTimeout(r, 900));
      const quality = score >= lv.need ? 'great' : score >= Math.ceil(lv.need / 2) ? 'ok' : 'bad';
      mount(outBox, h('div', { class: `ai-out q-${quality}` },
        h('div', { class: 'ai-head' }, icon('bot', 16), L(' תשובת ה-AI', ' AI answer'), h('span', { class: 'spacer' }), h('span', { class: 'chip' }, quality === 'great' ? L('מעולה', 'Great') : quality === 'ok' ? L('בסדר', 'OK') : L('חלש', 'Weak'))),
        h('div', { class: 'ai-body' }, rich(out.text))));
      if (score >= lv.need) {
        sound('win');
        scores.push(Math.max(0.5, 1 - (sends - 1) * 0.2));
        mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('פרומפט מנצח! ', 'Winning prompt! ')), rich(lv.explain),
          h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
      } else {
        sound('bad');
        const tips = lv.groups.map((g, gi) => {
          const o = pick[gi] >= 0 ? g.options[pick[gi]] : null;
          if (o?.bad) return `${L('להוריד', 'Remove')} **${g.label}**: ${o.why || L('החלק הזה מקלקל את הפרומפט.', 'This part spoils the prompt.')}`;
          if (!o?.good && g.options.some(x => x.good)) return `${L('לשפר', 'Improve')} **${g.label}**: ${g.tip || L('אפשר לבחור משהו מדויק יותר.', 'You can pick something more precise.')}`;
          return null;
        }).filter(Boolean);
        mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, L('אפשר טוב יותר! ', 'You can do better! ')), h('ul', { class: 'clue-list' }, tips.slice(0, 3).map(t => h('li', {}, rich(t))))));
      }
      outBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    mount(root,
      h('div', { class: 'mission-box' }, h('b', {}, L(`אתגר ${li + 1}/${cfg.levels.length}: `, `Challenge ${li + 1}/${cfg.levels.length}: `)), rich(lv.goal)),
      groupsEl, preview,
      h('button', { class: 'btn block', style: { marginTop: '10px' }, onclick: send }, L('שלח ל-AI', 'Send to AI')),
      outBox, fb);
    paint();
  }

  level();
}
