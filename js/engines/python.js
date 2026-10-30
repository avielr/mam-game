// Real Python challenges (Pyodide in a worker): write, run, check.
import { h, mount, rich, sound, shake } from '../ui.js';
import { runPython, warmUp, isReady } from '../python.js';

const KEYS = ['(', ')', ':', '"', "'", '=', '+', '-', '*', '<', '>', '[', ']', ',', '⇥'];

function explainError(err, line) {
  const at = line ? ` (שורה ${line})` : '';
  if (err === 'timeout') return '⏰ הקוד רץ יותר מדי זמן. אולי יש **לולאה אינסופית**? בדוק שהתנאי של ה-while משתנה.';
  if (/IndentationError|expected an indented block|unindent/.test(err)) return `📏 בעיית **הזחה**${at}: שורות בתוך if / for / def צריכות להתחיל ב-4 רווחים.`;
  if (/SyntaxError/.test(err)) return `✏️ **שגיאת תחביר**${at}. אולי חסרות נקודתיים \`:\`, סוגריים או גרשיים?`;
  const name = err.match(/name '(.+?)' is not defined/);
  if (name) return `❓ Python לא מכיר את השם \`${name[1]}\`${at}. אולי שגיאת כתיב, או שחסרים גרשיים סביב טקסט?`;
  if (/can only concatenate str|unsupported operand type/.test(err)) return `🧩 אי אפשר לחבר **טקסט** ו**מספר**${at}. השתמש ב-\`str()\` או ב-\`int()\`.`;
  if (/invalid literal for int/.test(err)) return `🔢 \`int()\` קיבל משהו שהוא לא מספר${at}.`;
  if (/ZeroDivisionError/.test(err)) return `➗ אי אפשר לחלק ב-0${at}!`;
  if (/EOFError/.test(err)) return '⌨️ הקוד ביקש יותר קלטים (`input`) ממה שהיו.';
  return `🐞 שגיאה${at}: \`${err}\``;
}

const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();

export function run(root, cfg, done) {
  let li = 0;
  const scores = [];

  function level() {
    if (li >= cfg.levels.length) return done(scores.reduce((a, b) => a + b, 0) / scores.length);
    const L = cfg.levels[li];
    let fails = 0, revealed = false, solved = false;

    const editor = h('textarea', { class: 'code ltr', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', rows: Math.max(5, (L.starter || '').split('\n').length + 2), 'aria-label': 'עורך קוד' });
    editor.value = L.starter || '';
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
    const inputs = (L.inputs || []).map(inp => h('input', { class: 'text-input', value: inp.value ?? '', 'aria-label': inp.label }));
    const out = h('pre', { class: 'console ltr' }, '');
    const fb = h('div');
    const status = h('div', { class: 'muted', style: { fontSize: '14px', minHeight: '20px' } });

    const setOut = (text, err) => { out.textContent = text || ''; out.classList.toggle('has-err', !!err); };

    async function doRun() {
      status.textContent = isReady() ? '▶ מריץ...' : '⏳ טוען את Python (רק בפעם הראשונה, כמה שניות)...';
      const res = await runPython(editor.value, inputs.map(i => i.value));
      status.textContent = '';
      if (res.err === 'load-failed') return loadFailed();
      setOut(res.out || (res.ok ? '(הקוד רץ, אבל לא הדפיס כלום)' : ''), !res.ok);
      if (!res.ok) mount(fb, h('div', { class: 'feedback bad' }, rich(explainError(res.err, res.line))));
      else mount(fb);
      sound('click');
    }

    async function doCheck() {
      if (solved) return;
      status.textContent = isReady() ? '🔍 בודק...' : '⏳ טוען את Python...';
      const code = editor.value;
      const missing = (L.mustUse || []).filter(w => !code.includes(w));
      let problem = null, lastOut = '';
      for (const t of L.tests) {
        const res = await runPython(t.append ? `${code}\n${t.append}` : code, t.stdin || []);
        if (res.err === 'load-failed') { status.textContent = ''; return loadFailed(); }
        lastOut = res.out;
        if (!res.ok) { problem = explainError(res.err, res.line); break; }
        const got = norm(res.out);
        const want = [].concat(t.expect);
        const okAll = (t.exact ? got.endsWith(norm(t.exact)) : want.every(w => got.includes(norm(w))))
          && !(t.reject || []).some(r => got.includes(r));
        if (!okAll) {
          problem = `${t.stdin?.length ? `עם הקלט \`${t.stdin.join(', ')}\` ` : ''}ציפיתי לראות: \`${t.exact || want.join(' / ')}\``;
          break;
        }
      }
      status.textContent = '';
      setOut(lastOut, !!problem);
      if (!problem && missing.length) problem = `התוצאה נכונה, אבל המשימה דורשת להשתמש ב-\`${missing.join('`, `')}\`.`;
      if (problem) {
        fails++; sound('bad'); shake(editor);
        return mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, 'עוד לא. '), rich(problem),
          fails >= 2 && L.solution && !revealed ? h('div', { style: { marginTop: '8px' } }, h('button', { class: 'btn secondary small', onclick: reveal }, '👀 הראה לי פתרון')) : null));
      }
      solved = true; sound('win');
      scores.push(revealed ? 0.5 : Math.max(0.6, 1 - fails * 0.1));
      mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '✅ הקוד עובד! '), rich(L.success || 'כל הבדיקות עברו.'),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, 'הבא ←'))));
    }

    function reveal() {
      revealed = true;
      editor.value = L.solution;
      mount(fb, h('div', { class: 'feedback good' }, 'הנה פתרון אפשרי. תקרא אותו, תריץ, ואז תלחץ "בדוק".'));
    }

    function loadFailed() {
      mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, '📡 לא הצלחתי לטעון את Python. '), 'בפעם הראשונה צריך חיבור לאינטרנט.',
        h('div', { class: 'row', style: { marginTop: '8px' } },
          h('button', { class: 'btn small', onclick: () => { mount(fb); warmUp(); } }, '🔄 נסה שוב'),
          h('button', { class: 'btn secondary small', onclick: () => { scores.push(0.3); li++; level(); } }, 'דלג'))));
    }

    mount(root,
      h('div', { class: 'row', style: { marginBottom: '6px' } }, h('span', { class: 'chip' }, '🐍 Python'), h('span', { class: 'spacer' }), h('span', { class: 'muted' }, `אתגר ${li + 1}/${cfg.levels.length}`)),
      h('div', { class: 'mission-box' }, h('b', {}, `${L.title}: `), rich(L.task)),
      L.example ? h('details', { class: 'mission-box' }, h('summary', {}, '📖 דוגמה'), h('pre', { class: 'console ltr', style: { margin: '8px 0 0' } }, L.example)) : null,
      editor, keybar,
      inputs.length ? h('div', { class: 'mission-box' }, h('b', {}, '⌨️ קלט להרצה: '), (L.inputs || []).map((inp, i) => h('label', { class: 'inp-row' }, inp.label, inputs[i]))) : null,
      h('div', { class: 'row', style: { marginTop: '8px' } },
        h('button', { class: 'btn secondary', onclick: doRun }, '▶ הרץ'),
        h('button', { class: 'btn', onclick: doCheck }, '✅ בדוק'),
        h('span', { class: 'spacer' }),
        L.hint ? h('button', { class: 'btn secondary small', onclick: () => mount(fb, h('div', { class: 'feedback good' }, '💡 ', rich(L.hint))) }, '💡 רמז') : null),
      status, h('div', { class: 'muted', style: { fontSize: '13px', marginTop: '6px' } }, 'פלט:'), out, fb);
    warmUp();
  }

  level();
}
