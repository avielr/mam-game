// Prompt lab (simulated AI): build a prompt from parts, see how output quality changes.
import { h, mount, rich, sound, shake } from '../ui.js';

export function run(root, cfg, done) {
  let li = 0;
  const scores = [];

  function level() {
    if (li >= cfg.levels.length) return done(scores.reduce((a, b) => a + b, 0) / scores.length);
    const L = cfg.levels[li];
    const pick = L.groups.map(() => -1);
    let sends = 0;
    const preview = h('div', { class: 'prompt-preview' });
    const outBox = h('div');
    const fb = h('div');
    const groupsEl = h('div');

    const paint = () => {
      mount(groupsEl, L.groups.map((g, gi) => h('div', { class: 'pgroup' },
        h('div', { class: 'pgroup-label' }, `${g.icon || '🧩'} ${g.label}`),
        h('div', { class: 'chips' }, g.options.map((o, oi) => h('button', { class: `pchip ${pick[gi] === oi ? 'sel' : ''}`, onclick: () => { pick[gi] = pick[gi] === oi ? -1 : oi; sound('click'); paint(); } }, o.t))))));
      const parts = pick.map((p, gi) => p >= 0 ? L.groups[gi].options[p].t : null).filter(Boolean);
      mount(preview, h('div', { class: 'muted', style: { fontSize: '13px' } }, '✍️ הפרומפט שלך:'),
        parts.length ? h('div', {}, parts.join(' ')) : h('div', { class: 'muted' }, 'בחר חלקים כדי לבנות פרומפט...'));
    };

    async function send() {
      if (pick.every(p => p < 0)) return shake(preview);
      sends++;
      const good = pick.filter((p, gi) => p >= 0 && L.groups[gi].options[p].good).length;
      const bad = pick.filter((p, gi) => p >= 0 && L.groups[gi].options[p].bad).length;
      const score = good - bad;
      const out = [...L.outputs].sort((a, b) => b.min - a.min).find(o => score >= o.min) || L.outputs[0];
      mount(outBox, h('div', { class: 'ai-out' }, h('div', { class: 'ai-head' }, '🤖 AI כותב...'), h('div', { class: 'typing' }, h('i'), h('i'), h('i'))));
      await new Promise(r => setTimeout(r, 900));
      const quality = score >= L.need ? 'great' : score >= Math.ceil(L.need / 2) ? 'ok' : 'bad';
      mount(outBox, h('div', { class: `ai-out q-${quality}` },
        h('div', { class: 'ai-head' }, '🤖 תשובת ה-AI', h('span', { class: 'spacer' }), h('span', { class: 'chip' }, quality === 'great' ? '🌟 מעולה' : quality === 'ok' ? '😐 בסדר' : '👎 חלש')),
        h('div', { class: 'ai-body' }, rich(out.text))));
      if (score >= L.need) {
        sound('win');
        scores.push(Math.max(0.5, 1 - (sends - 1) * 0.2));
        mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '🎯 פרומפט מנצח! '), rich(L.explain),
          h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, 'הבא ←'))));
      } else {
        sound('bad');
        const tips = L.groups.map((g, gi) => {
          const o = pick[gi] >= 0 ? g.options[pick[gi]] : null;
          if (o?.bad) return `🚫 **${g.label}**: ${o.why || 'החלק הזה מקלקל את הפרומפט.'}`;
          if (!o?.good && g.options.some(x => x.good)) return `➕ **${g.label}**: ${g.tip || 'אפשר לבחור משהו מדויק יותר.'}`;
          return null;
        }).filter(Boolean);
        mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, 'אפשר טוב יותר! '), h('ul', { class: 'clue-list' }, tips.slice(0, 3).map(t => h('li', {}, rich(t))))));
      }
      outBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    mount(root,
      h('div', { class: 'mission-box' }, h('b', {}, `🎯 אתגר ${li + 1}/${cfg.levels.length}: `), rich(L.goal)),
      groupsEl, preview,
      h('button', { class: 'btn block', style: { marginTop: '10px' }, onclick: send }, '🚀 שלח ל-AI'),
      outBox, fb);
    paint();
  }

  level();
}
