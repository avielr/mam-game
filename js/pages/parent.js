// Parent zone: PIN gate + progress dashboard + export/import.
import { h, mount, toast } from '../ui.js';
import { getState, update, hashPin, exportJSON, importJSON, resetAll, rankFor, today } from '../state.js';
import { RANKS, tr } from '../content/meta.js';
import { bases } from '../content/index.js';
import { L, isEn } from '../i18n.js';
import { icon, insignia } from '../icons.js';
import { topbar } from './common.js';

let unlockedThisSession = false;

const fmtMin = sec => sec < 60 ? L(`${sec} שנ׳`, `${sec} sec`) : L(`${Math.round(sec / 60)} דק׳`, `${Math.round(sec / 60)} min`);
const fmtDate = iso => iso ? new Date(iso).toLocaleDateString(isEn() ? 'en-GB' : 'he-IL') : '—';

export function render(app) {
  if (!unlockedThisSession) return gate(app);
  dashboard(app);
}

function gate(app) {
  const st = getState();
  const creating = !st.parentPin;
  const pin = h('input', { class: 'text-input pin-input ltr', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'off', 'aria-label': L('קוד הורים', 'Parent PIN') });
  const pin2 = creating ? h('input', { class: 'text-input pin-input ltr', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'off', 'aria-label': L('אימות קוד', 'Confirm PIN'), style: { marginTop: '10px' } }) : null;
  const err = h('div', { class: 'muted', style: { minHeight: '24px', marginTop: '8px' } });
  const go = async () => {
    const v = pin.value.trim();
    if (!/^\d{4,6}$/.test(v)) { err.textContent = L('קוד של 4 עד 6 ספרות', 'Use 4 to 6 digits'); return; }
    if (creating) {
      if (v !== pin2.value.trim()) { err.textContent = L('הקודים לא תואמים', 'PINs don’t match'); return; }
      const hashed = await hashPin(v);
      update(s => { s.parentPin = hashed; });
      unlockedThisSession = true; render(app);
    } else if (await hashPin(v) === st.parentPin) {
      unlockedThisSession = true; render(app);
    } else { err.textContent = L('קוד שגוי', 'Wrong PIN'); pin.value = ''; }
  };
  [pin, pin2].forEach(i => i?.addEventListener('keydown', e => { if (e.key === 'Enter') go(); }));
  mount(app, topbar(),
    h('section', { class: 'card center', style: { maxWidth: '420px', margin: '20px auto' } },
      h('div', { class: 'hero-icon' }, icon('lock-keyhole', 40)),
      h('h2', {}, L('אזור הורים', 'Parent zone')),
      h('p', { class: 'muted' }, creating ? L('בחרו קוד של 4 עד 6 ספרות. הקוד שומר שרק הורים ייכנסו לכאן.', 'Choose a 4–6 digit PIN so only parents can get in here.') : L('הקלידו את קוד ההורים', 'Enter the parent PIN')),
      pin, pin2, err,
      h('button', { class: 'btn block', onclick: go }, creating ? L('שמירת קוד', 'Save PIN') : L('כניסה', 'Enter'))));
  setTimeout(() => pin.focus(), 50);
}

// What the kid built: chatbot design + app specs with a ready Base44 prompt (a real-world quest to do together).
function projects(st) {
  const products = st.products || [];
  if (!products.length && !st.chatbot) return null;
  const copy = async text => { try { await navigator.clipboard.writeText(text); toast(L('הפרומפט הועתק', 'Prompt copied')); } catch { toast(L('לא הצלחתי להעתיק', 'Couldn’t copy')); } };
  return h('section', { class: 'card' }, h('h2', {}, L('הפרויקטים שלו', 'His projects')),
    st.chatbot ? h('p', {}, icon('message-square', 16), ' ', L(`צ׳אטבוט: ${st.chatbot.bot} (${st.chatbot.topic}), אישיות: ${st.chatbot.persona}.`, `Chatbot: ${st.chatbot.bot} (${st.chatbot.topic}), personality: ${st.chatbot.persona}.`)) : null,
    products.slice().reverse().map(p => h('div', { class: 'mission-box' },
      h('b', {}, p.name || L('אפליקציה', 'App')), h('div', { class: 'muted' }, `${p.problem} · ${p.audience}`),
      h('pre', { class: 'prompt-preview', style: { whiteSpace: 'pre-wrap', fontSize: '14px' } }, p.prompt),
      h('div', { class: 'row' }, h('button', { class: 'btn secondary small', onclick: () => copy(p.prompt) }, icon('copy', 16), L('העתק', 'Copy')),
        h('span', { class: 'muted', style: { fontSize: '14px' } }, L('משימת שטח: הדביקו את הפרומפט ב-Base44 ובנו יחד את האפליקציה.', 'Field quest: paste the prompt into Base44 and build the app together.'))))));
}

function dashboard(app) {
  const st = getState();
  const rank = rankFor(st.xp, RANKS);
  const missions = bases().flatMap(b => b.missions);
  const totalSec = Object.values(st.days).reduce((a, b) => a + b, 0);
  const done = missions.filter(m => st.missions[m.id]?.firstDoneAt);
  const q = Object.values(st.quiz).reduce((a, x) => ({ c: a.c + x.correct, t: a.t + x.total }), { c: 0, t: 0 });

  // Last 14 days of play
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return today(d); });
  const maxDay = Math.max(60, ...days.map(d => st.days[d] || 0));
  const chart = h('div', { class: 'daychart', role: 'img', 'aria-label': L('זמן משחק ב-14 הימים האחרונים', 'Play time over the last 14 days') },
    days.map(d => {
      const sec = st.days[d] || 0;
      return h('div', { title: `${d}: ${fmtMin(sec)}`, style: { height: Math.max(3, (sec / maxDay) * 86) + 'px' }, class: sec ? 'on' : '' });
    }));

  const weak = missions
    .filter(m => st.quiz[m.id]?.total)
    .map(m => ({ m, acc: st.quiz[m.id].correct / st.quiz[m.id].total }))
    .filter(x => x.acc < 0.7);

  const rows = missions.map(m => {
    const r = st.missions[m.id];
    const qq = st.quiz[m.id];
    return h('tr', {},
      h('td', {}, m.title),
      h('td', {}, r?.firstDoneAt ? '★'.repeat(r.stars) : r?.attempts ? L('התחיל', 'Started') : '—'),
      h('td', {}, qq?.total ? `${Math.round(100 * qq.correct / qq.total)}%` : '—'),
      h('td', {}, r?.attempts || 0),
      h('td', {}, r ? fmtMin(r.timeSec) : '—'),
      h('td', {}, fmtDate(r?.firstDoneAt)));
  });

  const file = h('input', { type: 'file', accept: 'application/json', style: { display: 'none' } });
  file.addEventListener('change', async () => {
    try { importJSON(await file.files[0].text()); toast(L('ההתקדמות יובאה', 'Progress imported')); render(app); }
    catch { toast(L('הקובץ לא תקין', 'Invalid file')); }
  });
  const doExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `mamram-progress-${today()}.json` });
    document.body.append(a); a.click(); a.remove();
  };

  mount(app, topbar(),
    h('h1', {}, L('לוח הורים', 'Parent dashboard')),
    h('section', { class: 'card' },
      h('div', { class: 'grid2' },
        h('div', { class: 'stat' }, h('b', {}, h('bdi', {}, `${done.length}/${missions.length}`)), L('משימות הושלמו', 'Missions done')),
        h('div', { class: 'stat' }, h('b', {}, q.t ? `${Math.round(100 * q.c / q.t)}%` : '—'), L('דיוק בבחנים', 'Quiz accuracy')),
        h('div', { class: 'stat' }, h('b', {}, fmtMin(totalSec)), L('זמן למידה כולל', 'Total learning time')),
        h('div', { class: 'stat' }, h('b', {}, st.streak.count), L(`רצף (שיא ${st.streak.best})`, `Streak (best ${st.streak.best})`)),
        h('div', { class: 'stat' }, h('b', { class: 'rank-line' }, insignia(rank.index, 22), tr(rank.name)), h('bdi', {}, `${st.xp} XP`)),
        h('div', { class: 'stat' }, h('b', {}, fmtDate(st.streak.last ? st.streak.last + 'T12:00' : '')), L('פעילות אחרונה', 'Last active')))),
    h('section', { class: 'card' }, h('h2', {}, L('זמן למידה, 14 ימים אחרונים', 'Learning time, last 14 days')), chart),
    h('section', { class: 'card' }, h('h2', {}, L('נושאים לחיזוק', 'Topics to strengthen')),
      weak.length
        ? h('ul', {}, weak.map(x => h('li', {}, L(`${x.m.title} (${x.m.topic}): ${Math.round(x.acc * 100)}% בבוחן`, `${x.m.title} (${x.m.topic}): ${Math.round(x.acc * 100)}% on the quiz`))))
        : h('p', { class: 'muted' }, q.t ? L('אין נושא מתחת ל-70%. מצוין!', 'Nothing below 70%. Great work!') : L('עדיין אין נתונים.', 'No data yet.'))),
    projects(st),
    h('section', { class: 'card' }, h('h2', {}, L('פירוט משימות', 'Mission details')),
      h('div', { class: 'table-wrap' }, h('table', {},
        h('thead', {}, h('tr', {}, [L('משימה', 'Mission'), L('כוכבים', 'Stars'), L('בוחן', 'Quiz'), L('ניסיונות', 'Tries'), L('זמן', 'Time'), L('הושלם', 'Done')].map(t => h('th', {}, t)))),
        h('tbody', {}, rows)))),
    h('section', { class: 'card' }, h('h2', {}, L('גיבוי והעברה', 'Backup & transfer')),
      h('p', { class: 'muted' }, L('ההתקדמות נשמרת רק במכשיר הזה. אפשר לייצא קובץ ולייבא אותו במכשיר אחר.', 'Progress is saved on this device only. Export a file and import it on another device.')),
      h('div', { class: 'row' },
        h('button', { class: 'btn secondary small', onclick: doExport }, icon('download', 16), L('ייצוא', 'Export')),
        h('button', { class: 'btn secondary small', onclick: () => file.click() }, icon('upload', 16), L('ייבוא', 'Import')), file,
        h('span', { class: 'spacer' }),
        h('button', { class: 'btn danger small', onclick: () => {
          if (confirm(L('למחוק את כל ההתקדמות? אי אפשר לבטל.', 'Delete all progress? This can’t be undone.'))) { resetAll(); toast(L('ההתקדמות אופסה', 'Progress reset')); location.hash = '#/welcome'; }
        } }, icon('trash-2', 16), L('איפוס', 'Reset')))));
}
