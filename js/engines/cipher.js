// Caesar cipher on the Hebrew alphabet + acrostic (hidden message) levels.
import { h, mount, rich, sound, shake } from '../ui.js';

const AB = 'אבגדהוזחטיכלמנסעפצקרשת';
const FINAL_TO = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const TO_FINAL = { 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' };

const norm = t => [...t].map(c => FINAL_TO[c] || c).join('');
export const shiftText = (t, k) => [...norm(t)].map(c => {
  const i = AB.indexOf(c);
  return i < 0 ? c : AB[((i + k) % 22 + 22) % 22];
}).join('');
const withFinals = t => t.replace(/[כמנפצ](?=$|[^א-ת])/g, c => TO_FINAL[c]);

export function run(root, cfg, done) {
  let li = 0, mistakes = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, cfg.levels.length / (cfg.levels.length + mistakes * 0.5)));
    const L = cfg.levels[li];
    const head = h('div', { class: 'mission-box' }, h('b', {}, `🔎 שלב ${li + 1}/${cfg.levels.length}: `), rich(L.hint));
    const fb = h('div');
    const next = () => h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, 'הבא ←'));

    if (L.type === 'decode') {
      const secret = shiftText(L.plain, L.shift);
      let k = 0, solved = false, tries = 0;
      const out = h('div', { class: 'cipher-text' });
      const num = h('div', { class: 'num' });
      const table = h('div', { class: 'alpha', 'aria-hidden': 'true' });
      const paint = () => {
        const dec = shiftText(secret, -k);
        out.textContent = k === 0 ? secret : withFinals(dec);
        out.classList.toggle('plain', k === L.shift);
        num.textContent = k;
        mount(table, [...AB].map(c => h('div', {}, c, h('small', {}, shiftText(c, -k)))));
        if (k === L.shift && !solved) {
          solved = true; sound('good');
          if (!L.showShift && tries > 18) mistakes++;
          mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '🔓 פוענח! '), `המפתח היה ${L.shift}.`, next()));
        }
      };
      const turn = d => { if (solved) return; k = (k + d + 22) % 22; tries++; sound('click'); paint(); };
      mount(root, head,
        h('div', { class: 'muted center' }, 'ההודעה המוצפנת:'), h('div', { class: 'cipher-text' }, secret),
        h('div', { class: 'wheel-ctrl' },
          h('button', { class: 'btn secondary', 'aria-label': 'הזזה פחות', onclick: () => turn(-1) }, '−'),
          h('div', { class: 'center' }, h('div', { class: 'muted', style: { fontSize: '14px' } }, 'הזזה אחורה'), num),
          h('button', { class: 'btn secondary', 'aria-label': 'הזזה יותר', onclick: () => turn(1) }, '+')),
        h('div', { class: 'muted center' }, 'מה שיוצא:'), out,
        h('details', { style: { marginTop: '10px' } }, h('summary', { class: 'muted' }, 'הצג טבלת אותיות'), table),
        fb);
      paint();
    }

    if (L.type === 'encode' || L.type === 'acrostic') {
      const expected = L.type === 'encode' ? shiftText(L.plain, L.shift) : norm(L.answer);
      const input = h('input', { class: 'text-input', placeholder: 'כתוב כאן...', autocomplete: 'off', enterkeyhint: 'done' });
      const check = () => {
        const v = norm(input.value.replace(/\s+/g, ''));
        if (!v) return;
        if (v === expected) {
          sound('good'); input.disabled = true;
          mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '✅ בדיוק! '),
            L.type === 'encode' ? `"${L.plain}" מוצפן כ-"${expected}".` : `המילה הסודית: "${L.answer}".`, next()));
        } else {
          mistakes++; sound('bad'); shake(input);
          const tip = L.type === 'encode' ? `טיפ: האות ${[...norm(L.plain)][0]} הופכת ל-${expected[0]}. תמשיך ככה.` : 'טיפ: קרא רק את האות הראשונה של כל שורה, מלמעלה למטה.';
          mount(fb, h('div', { class: 'feedback bad' }, 'עוד לא. ', tip));
        }
      };
      input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      const body = L.type === 'encode'
        ? [h('div', { class: 'cipher-text plain' }, L.plain), h('div', { class: 'alpha', 'aria-hidden': 'true' }, [...AB].map(c => h('div', {}, c, h('small', {}, shiftText(c, L.shift)))))]
        : [h('div', { class: 'card', style: { background: '#f4f7ff', color: '#14204a', fontSize: '20px' } }, L.lines.map(l => h('div', {}, rich(l.replace(/\*\*/g, '')))))];
      mount(root, head, ...body, h('div', { class: 'row', style: { marginTop: '12px', flexWrap: 'nowrap' } }, input, h('button', { class: 'btn', onclick: check }, 'בדוק')), fb);
    }
  }

  level();
}
