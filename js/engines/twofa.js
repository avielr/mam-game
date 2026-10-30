// Two-factor login simulation: password + rotating code on a mock phone.
import { h, mount, rich, sound, shake } from '../ui.js';

const newCode = () => String(Math.floor(100000 + Math.random() * 900000));

export function run(root, cfg, done) {
  let li = 0, mistakes = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, cfg.levels.length / (cfg.levels.length + mistakes * 0.5)));
    const L = cfg.levels[li];
    const fb = h('div');
    const next = () => h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, 'הבא ←'));

    if (L.type === 'login') {
      let code = newCode(), left = 30, timer;
      const codeEl = h('div', { class: 'phone-code ltr mono' });
      const ring = h('div', { class: 'phone-timer' });
      const phone = h('div', { class: 'phone' }, h('div', { class: 'phone-notch' }),
        h('div', { class: 'muted', style: { fontSize: '13px' } }, '🔐 אפליקציית אימות'), h('div', { style: { fontSize: '14px' } }, L.site), codeEl, ring);
      const paint = () => { codeEl.textContent = code.slice(0, 3) + ' ' + code.slice(3); ring.textContent = `⏳ קוד חדש בעוד ${Math.ceil(left)} שנ׳`; };
      const input = h('input', { class: 'text-input ltr mono pin-input', inputmode: 'numeric', maxlength: 7, placeholder: '••••••', autocomplete: 'one-time-code' });
      const check = () => {
        const v = input.value.replace(/\D/g, '');
        if (v === code) {
          clearInterval(timer); sound('good'); input.disabled = true;
          mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '🔓 התחברת! '), rich(L.success), next()));
        } else { mistakes++; sound('bad'); shake(input); mount(fb, h('div', { class: 'feedback bad' }, 'קוד שגוי. תסתכל על הטלפון, הקוד מתחלף כל 30 שניות.')); }
      };
      input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      timer = setInterval(() => {
        if (!root.isConnected) return clearInterval(timer);
        left -= 1;
        if (left <= 0) { code = newCode(); left = 30; }
        paint();
      }, 1000);
      mount(root,
        h('div', { class: 'mission-box' }, rich(L.intro)),
        h('div', { class: 'login-row' },
          h('div', { class: 'card', style: { flex: 1, minWidth: '200px' } },
            h('b', {}, `🌐 ${L.site}`),
            h('div', { class: 'muted', style: { margin: '8px 0 4px' } }, 'סיסמה ✅'),
            h('div', { class: 'text-input ltr mono', style: { opacity: .7 } }, '••••••••••••'),
            h('div', { class: 'muted', style: { margin: '10px 0 4px' } }, 'קוד אימות מהטלפון:'),
            input, h('button', { class: 'btn block', style: { marginTop: '10px' }, onclick: check }, 'התחבר')),
          phone),
        fb);
      paint();
    }

    if (L.type === 'alert') {
      const opts = h('div', { class: 'options' }, L.options.map((o, idx) => h('button', { class: 'opt', onclick: () => {
        const ok = idx === L.answer;
        [...opts.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === L.answer ? 'correct' : j === idx ? 'wrong' : 'dim'); });
        if (ok) sound('good'); else { mistakes++; sound('bad'); }
        mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, ok ? 'בדיוק! ' : 'לא! '), rich(L.explain), next()));
      } }, rich(o))));
      mount(root,
        h('div', { class: 'phone', style: { margin: '0 auto 12px' } }, h('div', { class: 'phone-notch' }),
          h('div', { class: 'phone-alert' }, rich(L.alert))),
        h('h3', {}, rich(L.q)), opts, fb);
    }
  }

  level();
}
