// Real Python challenges (Pyodide in a worker): write, run, check.
import { h, mount, rich, sound, shake } from '../ui.js';
import { runPython, warmUp, isReady } from '../python.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

const KEYS = ['(', ')', ':', '"', "'", '=', '+', '-', '*', '<', '>', '[', ']', ',', '⇥'];

function explainError(err, line) {
  const at = line ? L(` (שורה ${line})`, ` (line ${line})`) : '';
  if (err === 'timeout') return L('הקוד רץ יותר מדי זמן. אולי יש **לולאה אינסופית**? בדוק שהתנאי של ה-while משתנה.', 'The code ran for too long. Maybe there is an **infinite loop**? Check that the while condition changes.');
  if (/IndentationError|expected an indented block|unindent/.test(err)) return L(`בעיית **הזחה**${at}: שורות בתוך if / for / def צריכות להתחיל ב-4 רווחים.`, `**Indentation** problem${at}: lines inside if / for / def must start with 4 spaces.`);
  if (/SyntaxError/.test(err)) return L(`**שגיאת תחביר**${at}. אולי חסרות נקודתיים \`:\`, סוגריים או גרשיים?`, `**Syntax error**${at}. Maybe a missing colon \`:\`, bracket or quote?`);
  const name = err.match(/name '(.+?)' is not defined/);
  if (name) return L(`Python לא מכיר את השם \`${name[1]}\`${at}. אולי שגיאת כתיב, או שחסרים גרשיים סביב טקסט?`, `Python doesn't know the name \`${name[1]}\`${at}. Maybe a typo, or missing quotes around text?`);
  if (/can only concatenate str|unsupported operand type/.test(err)) return L(`אי אפשר לחבר **טקסט** ו**מספר**${at}. השתמש ב-\`str()\` או ב-\`int()\`.`, `You can't add **text** and a **number**${at}. Use \`str()\` or \`int()\`.`);
  if (/invalid literal for int/.test(err)) return L(`\`int()\` קיבל משהו שהוא לא מספר${at}.`, `\`int()\` got something that is not a number${at}.`);
  if (/ZeroDivisionError/.test(err)) return L(`אי אפשר לחלק ב-0${at}!`, `You can't divide by 0${at}!`);
  if (/EOFError/.test(err)) return L('הקוד ביקש יותר קלטים (`input`) ממה שהיו.', 'The code asked for more inputs (`input`) than there were.');
  return L(`שגיאה${at}: \`${err}\``, `Error${at}: \`${err}\``);
}

const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();

export function run(root, cfg, done) {
  let li = 0;
  const scores = [];

  function level() {
    if (li >= cfg.levels.length) return done(scores.reduce((a, b) => a + b, 0) / scores.length);
    const lv = cfg.levels[li];
    let fails = 0, revealed = false, solved = false;

    const editor = h('textarea', { class: 'code ltr', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', rows: Math.max(5, (lv.starter || '').split('\n').length + 2), 'aria-label': L('עורך קוד', 'Code editor') });
    editor.value = lv.starter || '';
    editor.addEventListener('keydown', e => {
      if (e.key === 'Tab') { e.preventDefault(); insert('    '); }
    });
    const insert = txt => {
      const { selectionStart: a, selectionEnd: b, value } = editor;
      editor.value = value.slice(0, a) + txt + value.slice(b);
      editor.selectionStart = editor.selectionEnd = a + txt.length;
      editor.focus();
    };
    const keybar = h('div', { class: 'keybar ltr' }, KEYS.map(k => h('button', { type: 'button', onmousedown: e => e.preventDefault(), onclick: () => insert(k === '⇥' ? '    ' : k) }, k)));
    const inputs = (lv.inputs || []).map(inp => h('input', { class: 'text-input', value: inp.value ?? '', 'aria-label': inp.label }));
    const out = h('pre', { class: 'console ltr' }, '');
    const fb = h('div');
    const status = h('div', { class: 'muted', style: { fontSize: '14px', minHeight: '20px' } });

    const setOut = (text, err) => { out.textContent = text || ''; out.classList.toggle('has-err', !!err); };

    async function doRun() {
      status.textContent = isReady() ? L('מריץ...', 'Running...') : L('טוען את Python (רק בפעם הראשונה, כמה שניות)...', 'Loading Python (first time only, a few seconds)...');
      const res = await runPython(editor.value, inputs.map(i => i.value));
      status.textContent = '';
      if (res.err === 'load-failed') return loadFailed();
      setOut(res.out || (res.ok ? L('(הקוד רץ, אבל לא הדפיס כלום)', '(the code ran, but printed nothing)') : ''), !res.ok);
      if (!res.ok) mount(fb, h('div', { class: 'feedback bad' }, rich(explainError(res.err, res.line))));
      else mount(fb);
      sound('click');
    }

    async function doCheck() {
      if (solved) return;
      status.textContent = isReady() ? L('בודק...', 'Checking...') : L('טוען את Python...', 'Loading Python...');
      const code = editor.value;
      const missing = (lv.mustUse || []).filter(w => !code.includes(w));
      let problem = null, lastOut = '';
      for (const t of lv.tests) {
        const res = await runPython(t.append ? `${code}\n${t.append}` : code, t.stdin || []);
        if (res.err === 'load-failed') { status.textContent = ''; return loadFailed(); }
        lastOut = res.out;
        if (!res.ok) { problem = explainError(res.err, res.line); break; }
        const got = norm(res.out);
        const want = [].concat(t.expect);
        const okAll = (t.exact ? got.endsWith(norm(t.exact)) : want.every(w => got.includes(norm(w))))
          && !(t.reject || []).some(r => got.includes(r));
        if (!okAll) {
          problem = `${t.stdin?.length ? L(`עם הקלט \`${t.stdin.join(', ')}\` `, `With the input \`${t.stdin.join(', ')}\` `) : ''}${L('ציפיתי לראות', 'I expected to see')}: \`${t.exact || want.join(' / ')}\``;
          break;
        }
      }
      status.textContent = '';
      setOut(lastOut, !!problem);
      if (!problem && missing.length) problem = L(`התוצאה נכונה, אבל המשימה דורשת להשתמש ב-\`${missing.join('`, `')}\`.`, `The result is right, but the task requires using \`${missing.join('`, `')}\`.`);
      if (problem) {
        fails++; sound('bad'); shake(editor);
        return mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, L('עוד לא. ', 'Not yet. ')), rich(problem),
          fails >= 2 && lv.solution && !revealed ? h('div', { style: { marginTop: '8px' } }, h('button', { class: 'btn secondary small', onclick: reveal }, icon('eye', 16), L(' הראה לי פתרון', ' Show me a solution'))) : null));
      }
      solved = true; sound('win');
      scores.push(revealed ? 0.5 : Math.max(0.6, 1 - fails * 0.1));
      mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('הקוד עובד! ', 'The code works! ')), rich(lv.success || L('כל הבדיקות עברו.', 'All tests passed.')),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
    }

    function reveal() {
      revealed = true;
      editor.value = lv.solution;
      mount(fb, h('div', { class: 'feedback good' }, L('הנה פתרון אפשרי. תקרא אותו, תריץ, ואז תלחץ "בדוק".', 'Here is a possible solution. Read it, run it, then tap "Check".')));
    }

    function loadFailed() {
      mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, L('לא הצלחתי לטעון את Python. ', "Couldn't load Python. ")), L('בפעם הראשונה צריך חיבור לאינטרנט.', 'The first time needs an internet connection.'),
        h('div', { class: 'row', style: { marginTop: '8px' } },
          h('button', { class: 'btn small', onclick: () => { mount(fb); warmUp(); } }, icon('refresh-cw', 16), L(' נסה שוב', ' Try again')),
          h('button', { class: 'btn secondary small', onclick: () => { scores.push(0.3); li++; level(); } }, L('דלג', 'Skip')))));
    }

    mount(root,
      h('div', { class: 'row', style: { marginBottom: '6px' } }, h('span', { class: 'chip' }, icon('code-xml', 14), ' Python'), h('span', { class: 'spacer' }), h('span', { class: 'muted' }, L(`אתגר ${li + 1}/${cfg.levels.length}`, `Challenge ${li + 1}/${cfg.levels.length}`))),
      h('div', { class: 'mission-box' }, h('b', {}, `${lv.title}: `), rich(lv.task)),
      lv.example ? h('details', { class: 'mission-box' }, h('summary', {}, L('דוגמה', 'Example')), h('pre', { class: 'console ltr', style: { margin: '8px 0 0' } }, lv.example)) : null,
      editor, keybar,
      inputs.length ? h('div', { class: 'mission-box' }, h('b', {}, L('קלט להרצה: ', 'Input for the run: ')), (lv.inputs || []).map((inp, i) => h('label', { class: 'inp-row' }, inp.label, inputs[i]))) : null,
      h('div', { class: 'row', style: { marginTop: '8px' } },
        h('button', { class: 'btn secondary', onclick: doRun }, icon('play', 16), L(' הרץ', ' Run')),
        h('button', { class: 'btn', onclick: doCheck }, icon('check', 16), L(' בדוק', ' Check')),
        h('span', { class: 'spacer' }),
        lv.hint ? h('button', { class: 'btn secondary small', onclick: () => mount(fb, h('div', { class: 'feedback good' }, icon('lightbulb', 16), ' ', rich(lv.hint))) }, icon('lightbulb', 16), L(' רמז', ' Hint')) : null),
      status, h('div', { class: 'muted', style: { fontSize: '13px', marginTop: '6px' } }, L('פלט:', 'Output:')), out, fb);
    warmUp();
  }

  level();
}
