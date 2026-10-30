// Product canvas (Base44 prep): need → audience → features → screens → AI build prompt → user testing.
import { h, mount, rich, sound, shake, toast } from '../ui.js';
import { update } from '../state.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

// Checkbox mark: a check icon when on, an empty ring when off.
const tick = on => on ? icon('circle-check', 18) : h('span', { style: { display: 'inline-block', width: '15px', height: '15px', border: '1.75px solid currentColor', borderRadius: '50%', opacity: '.5', verticalAlign: '-2px', margin: '0 1px' } });

export function run(root, cfg, done) {
  const spec = { problem: '', audience: '', features: [], screens: [], name: '' };
  let step = 0, mistakes = 0;
  const STEPS = () => [L('בעיה', 'Problem'), L('קהל', 'Audience'), L('פיצ׳רים', 'Features'), L('מסכים', 'Screens'), L('בנייה', 'Build'), L('בדיקה', 'Testing')];
  const appName = () => spec.name || L('האפליקציה שלי', 'My App');

  const head = () => h('div', { class: 'level-dots', style: { margin: '0 0 10px', justifyContent: 'center' } },
    STEPS().map((s, i) => h('i', { class: i < step ? 'done' : i === step ? 'on' : '', title: s })));
  const nextBtn = (ok, label = L('הבא ←', 'Next →')) => h('button', { class: 'btn block', style: { marginTop: '12px' }, disabled: !ok, onclick: () => { step++; sound('click'); paint(); } }, label);

  function pickOne(key, title, sub, options, allowOwn) {
    const own = allowOwn ? h('input', { class: 'text-input', placeholder: L('או כתוב רעיון משלך...', 'Or write your own idea...'), value: options.some(o => o.t === spec[key]) ? '' : spec[key] }) : null;
    own?.addEventListener('input', () => { spec[key] = own.value.trim(); btnWrap.replaceChildren(nextBtn(!!spec[key])); });
    const btnWrap = h('div', {}, nextBtn(!!spec[key]));
    return [h('h3', {}, title), h('p', { class: 'muted' }, rich(sub)),
      h('div', { class: 'options' }, options.map(o => h('button', { class: `opt ${spec[key] === o.t ? 'correct' : ''}`, onclick: () => { spec[key] = o.t; if (o.name) spec.name = o.name; sound('click'); paint(); } }, `${o.emoji || ''} ${o.t}`))),
      own, btnWrap];
  }

  function paint() {
    const body = [];
    if (step === 0) body.push(...pickOne('problem', L('1. איזו בעיה האפליקציה פותרת?', '1. What problem does the app solve?'), L('מוצר טוב מתחיל ב**צורך** אמיתי, לא בטכנולוגיה.', 'A good product starts with a real **need**, not with technology.'), cfg.problems, true));
    if (step === 1) body.push(...pickOne('audience', L('2. בשביל מי?', '2. Who is it for?'), L('קהל היעד קובע איך האפליקציה תיראה ותדבר.', 'The target audience decides how the app looks and talks.'), cfg.audiences));
    if (step === 2) {
      const max = cfg.maxFeatures || 3;
      body.push(h('h3', {}, L(`3. בחר עד ${max} פיצ׳רים מרכזיים`, `3. Pick up to ${max} main features`)), h('p', { class: 'muted' }, rich(L('גרסה ראשונה (`MVP`) = רק מה שהכי חשוב. אפשר להוסיף אחר כך!', 'First version (`MVP`) = only what matters most. You can add more later!'))),
        h('div', { class: 'options' }, cfg.features.map(f => {
          const on = spec.features.includes(f.t);
          return h('button', { class: `opt ${on ? 'correct' : ''}`, onclick: () => {
            if (on) spec.features = spec.features.filter(x => x !== f.t);
            else if (spec.features.length >= max) { sound('bad'); toast(L(`רק ${max} בגרסה הראשונה!`, `Only ${max} in the first version!`)); return; }
            else spec.features.push(f.t);
            sound('click'); paint();
          } }, tick(on), ` ${f.emoji} ${f.t}`);
        })), nextBtn(spec.features.length >= 2));
    }
    if (step === 3) {
      body.push(h('h3', {}, L('4. אילו מסכים צריך, ובאיזה סדר?', '4. Which screens are needed, and in what order?')), h('p', { class: 'muted' }, L('לחץ על המסכים לפי הסדר שהמשתמש יראה אותם (3 עד 5).', 'Tap the screens in the order the user will see them (3 to 5).')),
        h('div', { class: 'wire-row' }, spec.screens.map((s, i) => h('div', { class: 'wire' }, h('div', { class: 'wire-top' }, `${i + 1}`), h('div', { class: 'wire-title' }, s)))),
        h('div', { class: 'chips' }, cfg.screens.map(s => h('button', { class: `pchip ${spec.screens.includes(s) ? 'sel' : ''}`, onclick: () => {
          spec.screens.includes(s) ? (spec.screens = spec.screens.filter(x => x !== s)) : spec.screens.length < 5 && spec.screens.push(s);
          sound('click'); paint();
        } }, s))), nextBtn(spec.screens.length >= 3));
    }
    if (step === 4) {
      const prompt = buildPrompt();
      const copy = async () => { try { await navigator.clipboard.writeText(prompt); toast(L('הפרומפט הועתק', 'Prompt copied')); } catch { toast(L('לא הצלחתי להעתיק. סמן והעתק ידנית.', "Couldn't copy. Select it and copy by hand.")); } };
      body.push(h('h3', {}, L('5. הוראות בנייה ל-AI', '5. Build instructions for the AI')), h('p', { class: 'muted' }, rich(L('ב-`Base44` כותבים לבינה המלאכותית מה רוצים, והיא בונה את האפליקציה. הנה הפרומפט שיצרת:', 'In `Base44` you tell the AI what you want, and it builds the app. Here is the prompt you created:'))),
        h('pre', { class: 'prompt-preview', style: { whiteSpace: 'pre-wrap' } }, prompt),
        h('div', { class: 'row' }, h('button', { class: 'btn secondary small', onclick: copy }, icon('copy', 16), L(' העתק פרומפט', ' Copy prompt'))),
        h('p', { class: 'muted', style: { marginTop: '10px' } }, L('כך האפליקציה עשויה להיראות:', 'This is how the app might look:')),
        h('div', { class: 'wire-row' }, spec.screens.map((s, i) => h('div', { class: 'wire big' }, h('div', { class: 'wire-top' }, appName()), h('div', { class: 'wire-title' }, s),
          ...spec.features.slice(0, 2).map(f => h('div', { class: 'wire-line' }, f)), h('div', { class: 'wire-btn' }, i === spec.screens.length - 1 ? L('סיום', 'Done') : L('הבא', 'Next'))))),
        nextBtn(true, L('לבדיקת משתמשים', 'On to user testing')));
    }
    if (step === 5) body.push(...testing());
    mount(root, head(), ...body);
  }

  function buildPrompt() {
    return L(`בנה אפליקציה בשם "${appName()}".\n`, `Build an app called "${appName()}".\n`) +
      `${L('הבעיה', 'The problem')}: ${spec.problem}\n` +
      `${L('קהל היעד', 'Target audience')}: ${spec.audience}\n` +
      `${L('פיצ׳רים בגרסה הראשונה', 'Features in the first version')}:\n${spec.features.map(f => `- ${f}`).join('\n')}\n` +
      `${L('מסכים לפי הסדר', 'Screens in order')}: ${spec.screens.join(L(' ← ', ' → '))}\n` +
      L('עיצוב: צבעוני, כפתורים גדולים, טקסט בעברית מימין לשמאל.\n', 'Design: colorful, big buttons, English text, left to right.\n') +
      L('אל תבקש מהמשתמש מידע אישי שלא צריך.', "Don't ask the user for personal information you don't need.");
  }

  let ti = 0;
  function testing() {
    if (ti >= cfg.feedback.length) {
      update(s => { s.products = [...(s.products || []).slice(-4), { ...spec, prompt: buildPrompt(), at: new Date().toISOString() }]; });
      sound('win');
      return [h('div', { class: 'feedback good' }, h('b', {}, L('ה-Prototype מוכן! ', 'The prototype is ready! ')), rich(cfg.success),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => done(Math.max(0.6, 1 - mistakes * 0.15)) }, L('סיום ←', 'Finish →'))))];
    }
    const F = cfg.feedback[ti];
    const fb = h('div');
    const opts = h('div', { class: 'options' }, F.options.map((o, i) => h('button', { class: 'opt', onclick: () => {
      const ok = i === F.answer;
      [...opts.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === F.answer ? 'correct' : j === i ? 'wrong' : 'dim'); });
      if (ok) sound('good'); else { mistakes++; sound('bad'); shake(opts); }
      mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, rich(F.explain),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { ti++; paint(); } }, L('הבא ←', 'Next →')))));
    } }, rich(o))));
    return [h('h3', {}, L('6. בדיקת משתמשים ושיפור', '6. User testing and improving')), h('p', { class: 'muted' }, L(`משוב ${ti + 1}/${cfg.feedback.length} ממשתמשים שניסו את ה-Prototype:`, `Feedback ${ti + 1}/${cfg.feedback.length} from users who tried the prototype:`)),
      h('div', { class: 'bubble-user', style: { marginBottom: '10px' } }, F.user), h('div', { class: 'muted' }, L('מה עושים?', 'What do you do?')), opts, fb];
  }

  paint();
}
