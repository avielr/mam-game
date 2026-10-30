// Product canvas (Base44 prep): need → audience → features → screens → AI build prompt → user testing.
import { h, mount, rich, sound, shake, toast } from '../ui.js';
import { update } from '../state.js';

export function run(root, cfg, done) {
  const spec = { problem: '', audience: '', features: [], screens: [], name: '' };
  let step = 0, mistakes = 0;
  const STEPS = ['בעיה', 'קהל', 'פיצ׳רים', 'מסכים', 'בנייה', 'בדיקה'];

  const head = () => h('div', { class: 'level-dots', style: { margin: '0 0 10px', justifyContent: 'center' } },
    STEPS.map((s, i) => h('i', { class: i < step ? 'done' : i === step ? 'on' : '', title: s })));
  const nextBtn = (ok, label = 'הבא ←') => h('button', { class: 'btn block', style: { marginTop: '12px' }, disabled: !ok, onclick: () => { step++; sound('click'); paint(); } }, label);

  function pickOne(key, title, sub, options, allowOwn) {
    const own = allowOwn ? h('input', { class: 'text-input', placeholder: 'או כתוב רעיון משלך...', value: options.some(o => o.t === spec[key]) ? '' : spec[key] }) : null;
    own?.addEventListener('input', () => { spec[key] = own.value.trim(); btnWrap.replaceChildren(nextBtn(!!spec[key])); });
    const btnWrap = h('div', {}, nextBtn(!!spec[key]));
    return [h('h3', {}, title), h('p', { class: 'muted' }, sub),
      h('div', { class: 'options' }, options.map(o => h('button', { class: `opt ${spec[key] === o.t ? 'correct' : ''}`, onclick: () => { spec[key] = o.t; if (o.name) spec.name = o.name; sound('click'); paint(); } }, `${o.emoji || ''} ${o.t}`))),
      own, btnWrap];
  }

  function paint() {
    const body = [];
    if (step === 0) body.push(...pickOne('problem', '1️⃣ איזו בעיה האפליקציה פותרת?', 'מוצר טוב מתחיל ב**צורך** אמיתי, לא בטכנולוגיה.', cfg.problems, true));
    if (step === 1) body.push(...pickOne('audience', '2️⃣ בשביל מי?', 'קהל היעד קובע איך האפליקציה תיראה ותדבר.', cfg.audiences));
    if (step === 2) {
      const max = cfg.maxFeatures || 3;
      body.push(h('h3', {}, `3️⃣ בחר עד ${max} פיצ׳רים מרכזיים`), h('p', { class: 'muted' }, rich('גרסה ראשונה (`MVP`) = רק מה שהכי חשוב. אפשר להוסיף אחר כך!')),
        h('div', { class: 'options' }, cfg.features.map(f => {
          const on = spec.features.includes(f.t);
          return h('button', { class: `opt ${on ? 'correct' : ''}`, onclick: () => {
            if (on) spec.features = spec.features.filter(x => x !== f.t);
            else if (spec.features.length >= max) { sound('bad'); toast(`רק ${max} בגרסה הראשונה!`); return; }
            else spec.features.push(f.t);
            sound('click'); paint();
          } }, `${on ? '☑️' : '⬜'} ${f.emoji} ${f.t}`);
        })), nextBtn(spec.features.length >= 2));
    }
    if (step === 3) {
      body.push(h('h3', {}, '4️⃣ אילו מסכים צריך, ובאיזה סדר?'), h('p', { class: 'muted' }, 'לחץ על המסכים לפי הסדר שהמשתמש יראה אותם (3 עד 5).'),
        h('div', { class: 'wire-row' }, spec.screens.map((s, i) => h('div', { class: 'wire' }, h('div', { class: 'wire-top' }, `${i + 1}`), h('div', { class: 'wire-title' }, s)))),
        h('div', { class: 'chips' }, cfg.screens.map(s => h('button', { class: `pchip ${spec.screens.includes(s) ? 'sel' : ''}`, onclick: () => {
          spec.screens.includes(s) ? (spec.screens = spec.screens.filter(x => x !== s)) : spec.screens.length < 5 && spec.screens.push(s);
          sound('click'); paint();
        } }, s))), nextBtn(spec.screens.length >= 3));
    }
    if (step === 4) {
      const prompt = buildPrompt();
      const copy = async () => { try { await navigator.clipboard.writeText(prompt); toast('הפרומפט הועתק 📋'); } catch { toast('לא הצלחתי להעתיק. סמן והעתק ידנית.'); } };
      body.push(h('h3', {}, '5️⃣ הוראות בנייה ל-AI'), h('p', { class: 'muted' }, rich('ב-`Base44` כותבים לבינה המלאכותית מה רוצים, והיא בונה את האפליקציה. הנה הפרומפט שיצרת:')),
        h('pre', { class: 'prompt-preview', style: { whiteSpace: 'pre-wrap' } }, prompt),
        h('div', { class: 'row' }, h('button', { class: 'btn secondary small', onclick: copy }, '📋 העתק פרומפט')),
        h('p', { class: 'muted', style: { marginTop: '10px' } }, '📱 כך האפליקציה עשויה להיראות:'),
        h('div', { class: 'wire-row' }, spec.screens.map((s, i) => h('div', { class: 'wire big' }, h('div', { class: 'wire-top' }, spec.name || 'האפליקציה שלי'), h('div', { class: 'wire-title' }, s),
          ...spec.features.slice(0, 2).map(f => h('div', { class: 'wire-line' }, f)), h('div', { class: 'wire-btn' }, i === spec.screens.length - 1 ? 'סיום' : 'הבא')))),
        nextBtn(true, 'לבדיקת משתמשים 🧪'));
    }
    if (step === 5) body.push(...testing());
    mount(root, head(), ...body);
  }

  function buildPrompt() {
    return `בנה אפליקציה בשם "${spec.name || 'האפליקציה שלי'}".\n` +
      `הבעיה: ${spec.problem}\n` +
      `קהל היעד: ${spec.audience}\n` +
      `פיצ׳רים בגרסה הראשונה:\n${spec.features.map(f => `- ${f}`).join('\n')}\n` +
      `מסכים לפי הסדר: ${spec.screens.join(' ← ')}\n` +
      'עיצוב: צבעוני, כפתורים גדולים, טקסט בעברית מימין לשמאל.\n' +
      'אל תבקש מהמשתמש מידע אישי שלא צריך.';
  }

  let ti = 0;
  function testing() {
    if (ti >= cfg.feedback.length) {
      update(s => { s.products = [...(s.products || []).slice(-4), { ...spec, prompt: buildPrompt(), at: new Date().toISOString() }]; });
      sound('win');
      return [h('div', { class: 'feedback good' }, h('b', {}, '🚀 ה-Prototype מוכן! '), rich(cfg.success),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => done(Math.max(0.6, 1 - mistakes * 0.15)) }, 'סיום ←')))];
    }
    const F = cfg.feedback[ti];
    const fb = h('div');
    const opts = h('div', { class: 'options' }, F.options.map((o, i) => h('button', { class: 'opt', onclick: () => {
      const ok = i === F.answer;
      [...opts.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === F.answer ? 'correct' : j === i ? 'wrong' : 'dim'); });
      if (ok) sound('good'); else { mistakes++; sound('bad'); shake(opts); }
      mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, rich(F.explain),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { ti++; paint(); } }, 'הבא ←'))));
    } }, rich(o))));
    return [h('h3', {}, '6️⃣ בדיקת משתמשים ושיפור'), h('p', { class: 'muted' }, `משוב ${ti + 1}/${cfg.feedback.length} ממשתמשים שניסו את ה-Prototype:`),
      h('div', { class: 'bubble-user', style: { marginBottom: '10px' } }, `🗣️ ${F.user}`), h('div', { class: 'muted' }, 'מה עושים?'), opts, fb];
  }

  paint();
}
