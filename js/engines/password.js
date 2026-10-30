// Password forge: pick-the-strongest and build-a-password levels with a live crack-time meter.
import { h, mount, rich, sound, shake } from '../ui.js';
import { getState } from '../state.js';

const COMMON = ['1234', 'password', 'qwerty', 'abcd', '0000', '1111', 'admin', 'iloveyou'];

const RULES = {
  len12: { label: 'לפחות 12 תווים', test: p => p.length >= 12 },
  upper: { label: 'אות גדולה באנגלית `A-Z`', test: p => /[A-Z]/.test(p) },
  lower: { label: 'אות קטנה באנגלית `a-z`', test: p => /[a-z]/.test(p) },
  digit: { label: 'ספרה `0-9`', test: p => /\d/.test(p) },
  symbol: { label: 'סימן מיוחד `!@#$%`', test: p => /[^A-Za-z0-9֐-׿\s]/.test(p) },
  noname: { label: 'בלי השם שלך ובלי רצפים כמו `1234`', test: p => {
    const lo = p.toLowerCase();
    const name = (getState().agentName || '').toLowerCase().trim();
    return p.length > 0 && !COMMON.some(c => lo.includes(c)) && !(name && lo.includes(name));
  } },
};

export function crackSeconds(p) {
  if (!p) return 0;
  let pool = 0;
  if (/[a-z]/.test(p)) pool += 26;
  if (/[A-Z]/.test(p)) pool += 26;
  if (/\d/.test(p)) pool += 10;
  if (/[^A-Za-z0-9]/.test(p)) pool += 33;
  const lo = p.toLowerCase();
  if (COMMON.some(c => lo.includes(c))) return 0.001;
  return Math.pow(pool, p.length) / 2 / 1e10; // 10 billion guesses per second
}

export function humanTime(sec) {
  if (sec < 1) return 'פחות משנייה ⚡';
  const units = [[60, 'שניות'], [60, 'דקות'], [24, 'שעות'], [365, 'ימים'], [1000, 'שנים'], [1000, 'אלפי שנים'], [1000, 'מיליוני שנים']];
  let v = sec, name = 'שניות';
  for (const [div, n] of units) {
    name = n;
    if (v < div) break;
    v /= div;
  }
  if (v >= 1000) return 'יותר מגיל היקום 🌌';
  return `${Math.round(v)} ${name}`;
}

export function run(root, cfg, done) {
  let li = 0, mistakes = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, cfg.levels.length / (cfg.levels.length + mistakes * 0.5)));
    const L = cfg.levels[li];
    const fb = h('div');
    const next = () => h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, 'הבא ←'));
    const head = h('div', { class: 'row', style: { marginBottom: '8px' } }, h('span', { class: 'muted' }, `שלב ${li + 1}/${cfg.levels.length}`));

    if (L.type === 'pick') {
      const opts = h('div', { class: 'options' }, L.options.map((o, i) => h('button', { class: 'opt ltr mono', onclick: () => {
        const ok = i === L.answer;
        [...opts.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === L.answer ? 'correct' : j === i ? 'wrong' : 'dim'); });
        if (ok) sound('good'); else { mistakes++; sound('bad'); }
        mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, ok ? 'נכון! ' : 'לא הפעם. '), rich(L.explain),
          h('div', { class: 'muted', style: { marginTop: '6px' } }, L.options.map(x => h('div', {}, h('bdi', { class: 'mono' }, x), ` ← זמן פריצה: ${humanTime(crackSeconds(x))}`))),
          next()));
      } }, o)));
      mount(root, head, h('h3', {}, L.q), opts, fb);
    }

    if (L.type === 'build') {
      const input = h('input', { class: 'text-input ltr mono', placeholder: 'הקלד סיסמה...', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off' });
      const bar = h('i');
      const time = h('div', { class: 'crack-time' });
      const list = h('ul', { class: 'checks' });
      const btn = h('button', { class: 'btn block', disabled: true }, '🔨 חשל את הסיסמה');
      const paint = () => {
        const p = input.value;
        const res = L.rules.map(r => ({ r, ok: RULES[r].test(p) }));
        const okCount = res.filter(x => x.ok).length;
        mount(list, res.map(({ r, ok }) => h('li', { class: ok ? 'ok' : '' }, ok ? '✅ ' : '⬜ ', rich(RULES[r].label))));
        const sec = crackSeconds(p);
        const pct = Math.min(100, (Math.log10(sec + 1) / 14) * 100);
        bar.style.width = (p ? Math.max(6, pct) : 0) + '%';
        bar.style.background = pct < 35 ? 'var(--bad)' : pct < 70 ? 'var(--warn)' : 'var(--good)';
        time.textContent = p ? `⏱️ זמן לפרוץ: ${humanTime(sec)}` : '';
        btn.disabled = okCount !== res.length;
      };
      input.addEventListener('input', paint);
      btn.addEventListener('click', () => {
        sound('good'); input.disabled = true; btn.disabled = true;
        mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '🛡️ סיסמה בלתי שבירה! '),
          'זכור: באמת אל תשתמש בסיסמה שהקלדת במשחק. תמציא חדשה ותשמור אותה רק לעצמך.', next()));
      });
      mount(root, head, h('div', { class: 'mission-box' }, rich(L.hint)), input, h('div', { class: 'meter' }, bar), time, list, btn, fb);
      paint();
      setTimeout(() => input.focus(), 50);
    }
  }

  level();
}
