// Caesar cipher on the Hebrew (or English A–Z) alphabet + acrostic (hidden message) levels.
import { h, mount, rich, sound, shake } from '../ui.js';
import { L, isEn } from '../i18n.js';

const HE_AB = 'אבגדהוזחטיכלמנסעפצקרשת';
const EN_AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const FINAL_TO = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const TO_FINAL = { 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' };

const ab = () => (isEn() ? EN_AB : HE_AB);
const norm = t => (isEn() ? String(t).toUpperCase() : [...t].map(c => FINAL_TO[c] || c).join(''));
export const shiftText = (t, k) => {
  const AB = ab(), N = AB.length;
  return [...norm(t)].map(c => {
    const i = AB.indexOf(c);
    return i < 0 ? c : AB[((i + k) % N + N) % N];
  }).join('');
};
const withFinals = t => (isEn() ? t : t.replace(/[כמנפצ](?=$|[^א-ת])/g, c => TO_FINAL[c]));

export function run(root, cfg, done) {
  let li = 0, mistakes = 0;
  const AB = ab(), N = AB.length;
  const alphaProps = { class: 'alpha', 'aria-hidden': 'true', dir: isEn() ? 'ltr' : 'rtl', style: isEn() ? { direction: 'ltr', gridTemplateColumns: 'repeat(13, 1fr)' } : null };

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, cfg.levels.length / (cfg.levels.length + mistakes * 0.5)));
    const lv = cfg.levels[li];
    const head = h('div', { class: 'mission-box' }, h('b', {}, L(`שלב ${li + 1}/${cfg.levels.length}: `, `Level ${li + 1}/${cfg.levels.length}: `)), rich(lv.hint));
    const fb = h('div');
    const next = () => h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')));

    if (lv.type === 'decode') {
      const secret = shiftText(lv.plain, lv.shift);
      let k = 0, solved = false, tries = 0;
      const out = h('div', { class: 'cipher-text' });
      const num = h('div', { class: 'num' });
      const table = h('div', alphaProps);
      const paint = () => {
        const dec = shiftText(secret, -k);
        out.textContent = k === 0 ? secret : withFinals(dec);
        out.classList.toggle('plain', k === lv.shift);
        num.textContent = k;
        mount(table, [...AB].map(c => h('div', {}, c, h('small', {}, shiftText(c, -k)))));
        if (k === lv.shift && !solved) {
          solved = true; sound('good');
          if (!lv.showShift && tries > 18) mistakes++;
          mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('פוענח! ', 'Decoded! ')), L(`המפתח היה ${lv.shift}.`, `The key was ${lv.shift}.`), next()));
        }
      };
      const turn = d => { if (solved) return; k = (k + d + N) % N; tries++; sound('click'); paint(); };
      mount(root, head,
        h('div', { class: 'muted center' }, L('ההודעה המוצפנת:', 'The encrypted message:')), h('div', { class: 'cipher-text' }, secret),
        h('div', { class: 'wheel-ctrl' },
          h('button', { class: 'btn secondary', 'aria-label': L('הזזה פחות', 'Shift less'), onclick: () => turn(-1) }, '−'),
          h('div', { class: 'center' }, h('div', { class: 'muted', style: { fontSize: '14px' } }, L('הזזה אחורה', 'Shift back')), num),
          h('button', { class: 'btn secondary', 'aria-label': L('הזזה יותר', 'Shift more'), onclick: () => turn(1) }, '+')),
        h('div', { class: 'muted center' }, L('מה שיוצא:', 'Result:')), out,
        h('details', { style: { marginTop: '10px' } }, h('summary', { class: 'muted' }, L('הצג טבלת אותיות', 'Show letter table')), table),
        fb);
      paint();
    }

    if (lv.type === 'encode' || lv.type === 'acrostic') {
      const expected = lv.type === 'encode' ? shiftText(lv.plain, lv.shift) : norm(lv.answer);
      const plain = isEn() ? norm(lv.plain || '') : lv.plain;
      const input = h('input', { class: 'text-input', placeholder: L('כתוב כאן...', 'Type here...'), autocomplete: 'off', enterkeyhint: 'done' });
      const check = () => {
        const v = norm(input.value.replace(/\s+/g, ''));
        if (!v) return;
        if (v === expected) {
          sound('good'); input.disabled = true;
          mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('בדיוק! ', 'Exactly! ')),
            lv.type === 'encode' ? L(`"${lv.plain}" מוצפן כ-"${expected}".`, `"${plain}" encrypts to "${expected}".`) : L(`המילה הסודית: "${lv.answer}".`, `The secret word: "${lv.answer}".`), next()));
        } else {
          mistakes++; sound('bad'); shake(input);
          const tip = lv.type === 'encode'
            ? L(`טיפ: האות ${[...norm(lv.plain)][0]} הופכת ל-${expected[0]}. תמשיך ככה.`, `Tip: the letter ${[...norm(lv.plain)][0]} becomes ${expected[0]}. Keep going like that.`)
            : L('טיפ: קרא רק את האות הראשונה של כל שורה, מלמעלה למטה.', 'Tip: read only the first letter of each line, top to bottom.');
          mount(fb, h('div', { class: 'feedback bad' }, L('עוד לא. ', 'Not yet. '), tip));
        }
      };
      input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      const body = lv.type === 'encode'
        ? [h('div', { class: 'cipher-text plain' }, plain), h('div', alphaProps, [...AB].map(c => h('div', {}, c, h('small', {}, shiftText(c, lv.shift)))))]
        : [h('div', { class: 'card', style: { background: '#f4f7ff', color: '#14204a', fontSize: '20px' } }, lv.lines.map(l => h('div', {}, rich(l.replace(/\*\*/g, '')))))];
      mount(root, head, ...body, h('div', { class: 'row', style: { marginTop: '12px', flexWrap: 'nowrap' } }, input, h('button', { class: 'btn', onclick: check }, L('בדוק', 'Check'))), fb);
    }
  }

  level();
}
