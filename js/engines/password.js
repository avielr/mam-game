// Password forge: pick-the-strongest and build-a-password levels with a live crack-time meter.
import { h, mount, rich, sound, shake } from '../ui.js';
import { getState } from '../state.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

const COMMON = ['1234', 'password', 'qwerty', 'abcd', '0000', '1111', 'admin', 'iloveyou'];

const RULES = {
  len12: { label: () => L('לפחות 12 תווים', 'At least 12 characters'), test: p => p.length >= 12 },
  upper: { label: () => L('אות גדולה באנגלית `A-Z`', 'An uppercase letter `A-Z`'), test: p => /[A-Z]/.test(p) },
  lower: { label: () => L('אות קטנה באנגלית `a-z`', 'A lowercase letter `a-z`'), test: p => /[a-z]/.test(p) },
  digit: { label: () => L('ספרה `0-9`', 'A digit `0-9`'), test: p => /\d/.test(p) },
  symbol: { label: () => L('סימן מיוחד `!@#$%`', 'A special symbol `!@#$%`'), test: p => /[^A-Za-z0-9֐-׿\s]/.test(p) },
  noname: { label: () => L('בלי השם שלך ובלי רצפים כמו `1234`', 'Not your name, and no sequences like `1234`'), test: p => {
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
  if (sec < 1) return L('פחות משנייה', 'Less than a second');
  const units = [[60, L('שניות', 'seconds')], [60, L('דקות', 'minutes')], [24, L('שעות', 'hours')], [365, L('ימים', 'days')], [1000, L('שנים', 'years')], [1000, L('אלפי שנים', 'thousand years')], [1000, L('מיליוני שנים', 'million years')]];
  let v = sec, name = units[0][1];
  for (const [div, n] of units) {
    name = n;
    if (v < div) break;
    v /= div;
  }
  if (v >= 1000) return L('יותר מגיל היקום', 'Longer than the age of the universe');
  return `${Math.round(v)} ${name}`;
}

export function run(root, cfg, done) {
  let li = 0, mistakes = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, cfg.levels.length / (cfg.levels.length + mistakes * 0.5)));
    const lv = cfg.levels[li];
    const fb = h('div');
    const next = () => h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')));
    const head = h('div', { class: 'row', style: { marginBottom: '8px' } }, h('span', { class: 'muted' }, L(`שלב ${li + 1}/${cfg.levels.length}`, `Level ${li + 1}/${cfg.levels.length}`)));

    if (lv.type === 'pick') {
      const opts = h('div', { class: 'options' }, lv.options.map((o, i) => h('button', { class: 'opt ltr mono', onclick: () => {
        const ok = i === lv.answer;
        [...opts.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === lv.answer ? 'correct' : j === i ? 'wrong' : 'dim'); });
        if (ok) sound('good'); else { mistakes++; sound('bad'); }
        mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, ok ? L('נכון! ', 'Correct! ') : L('לא הפעם. ', 'Not this time. ')), rich(lv.explain),
          h('div', { class: 'muted', style: { marginTop: '6px' } }, lv.options.map(x => h('div', {}, h('bdi', { class: 'mono' }, x), L(` ← זמן פריצה: ${humanTime(crackSeconds(x))}`, ` → time to crack: ${humanTime(crackSeconds(x))}`)))),
          next()));
      } }, o)));
      mount(root, head, h('h3', {}, lv.q), opts, fb);
    }

    if (lv.type === 'build') {
      const input = h('input', { class: 'text-input ltr mono', placeholder: L('הקלד סיסמה...', 'Type a password...'), autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off' });
      const bar = h('i');
      const time = h('div', { class: 'crack-time' });
      const list = h('ul', { class: 'checks' });
      const btn = h('button', { class: 'btn block', disabled: true }, L('חשל את הסיסמה', 'Forge the password'));
      const paint = () => {
        const p = input.value;
        const res = lv.rules.map(r => ({ r, ok: RULES[r].test(p) }));
        const okCount = res.filter(x => x.ok).length;
        mount(list, res.map(({ r, ok }) => h('li', { class: ok ? 'ok' : '' }, icon(ok ? 'circle-check' : 'circle-x', 16), ' ', rich(RULES[r].label()))));
        const sec = crackSeconds(p);
        const pct = Math.min(100, (Math.log10(sec + 1) / 14) * 100);
        bar.style.width = (p ? Math.max(6, pct) : 0) + '%';
        bar.style.background = pct < 35 ? 'var(--bad)' : pct < 70 ? 'var(--warn)' : 'var(--good)';
        if (p) mount(time, icon('timer', 16), ' ', L(`זמן לפרוץ: ${humanTime(sec)}`, `Time to crack: ${humanTime(sec)}`)); else mount(time);
        btn.disabled = okCount !== res.length;
      };
      input.addEventListener('input', paint);
      btn.addEventListener('click', () => {
        sound('good'); input.disabled = true; btn.disabled = true;
        mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('סיסמה בלתי שבירה! ', 'Unbreakable password! ')),
          L('זכור: באמת אל תשתמש בסיסמה שהקלדת במשחק. תמציא חדשה ותשמור אותה רק לעצמך.', "Remember: don't actually use the password you typed in the game. Make up a new one and keep it to yourself."), next()));
      });
      mount(root, head, h('div', { class: 'mission-box' }, rich(lv.hint)), input, h('div', { class: 'meter' }, bar), time, list, btn, fb);
      paint();
      setTimeout(() => input.focus(), 50);
    }
  }

  level();
}
