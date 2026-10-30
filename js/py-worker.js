// Runs Python (Pyodide) off the main thread so infinite loops can be killed.
const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
importScripts(PYODIDE + 'pyodide.js');

// Helpers available to kids' code: a pretend AI "API" with canned answers.
const PRELUDE = `
import random as _r
def _ask_ai_en(q):
    q = q.lower()
    if 'joke' in q:
        return _r.choice(['Why did the computer go to the doctor? It had a virus! 🤒', 'What did one bit say to the other? See you in a byte! 😄'])
    if 'poem' in q or 'song' in q:
        return 'Code and more code, a loop goes round, one bug is gone, the program is sound 🎵'
    if 'translate' in q:
        return 'Hello = שלום'
    if 'how many' in q and 'legs' in q:
        return 'A spider has 8 legs 🕷️'
    if 'capital' in q:
        return 'Jerusalem is the capital of Israel'
    return "I'm a pretend AI. Try asking for a joke, a poem, a translation or a capital 🙂"
def ask_ai(question):
    q = str(question)
    if not any('\\u0590' <= c <= '\\u05ff' for c in q):
        return _ask_ai_en(q)
    if 'בדיחה' in q or 'joke' in q.lower():
        return _r.choice(['למה המחשב הלך לרופא? כי היה לו וירוס! 🤒', 'מה אומר ביט לביט? נתראה בבייט! 😄'])
    if 'שיר' in q:
        return 'קוד ועוד קוד, לולאה שמסתובבת, באג אחד נעלם, והתוכנה עובדת 🎵'
    if 'תרגם' in q or 'translate' in q.lower():
        return 'Hello = שלום'
    if 'כמה' in q and 'רגליים' in q:
        return 'לעכביש יש 8 רגליים 🕷️'
    if 'בירה' in q:
        return 'ירושלים היא בירת ישראל'
    return 'אני AI מדומה. נסה לשאול על בדיחה, שיר, תרגום או בירה 🙂'
`;

let ready = (async () => {
  self.pyodide = await loadPyodide({ indexURL: PYODIDE });
  await self.pyodide.runPythonAsync(PRELUDE);
})();

self.onmessage = async ({ data }) => {
  const { id, code, stdin = [] } = data;
  let out = '';
  try {
    await ready;
    const py = self.pyodide;
    const lines = [...stdin];
    py.setStdout({ batched: s => { out += s + '\n'; } });
    py.setStderr({ batched: s => { out += s + '\n'; } });
    py.setStdin({ stdin: () => (lines.length ? String(lines.shift()) : undefined), autoEOF: true });
    // Fresh namespace per run, with the prelude helpers.
    const ns = py.globals.get('dict')();
    ns.set('ask_ai', py.globals.get('ask_ai'));
    await py.runPythonAsync(code, { globals: ns });
    ns.destroy();
    self.postMessage({ id, ok: true, out });
  } catch (e) {
    // Keep only the useful last line of a Python traceback.
    const msg = String(e.message || e).trim().split('\n').filter(Boolean).reverse();
    // Line numbers that refer to the kid's code ("<exec>").
    const line = msg.find(l => /File "<exec>", line \d+/.test(l));
    self.postMessage({ id, ok: false, out, err: msg[0], line: line ? Number(line.match(/line (\d+)/)[1]) : null });
  }
};
