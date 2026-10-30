// Parent zone: PIN gate + progress dashboard + export/import.
import { h, mount, toast } from '../ui.js';
import { getState, update, hashPin, exportJSON, importJSON, resetAll, rankFor, today } from '../state.js';
import { RANKS } from '../content/meta.js';
import { BASES } from '../content/index.js';
import { topbar } from './common.js';

let unlockedThisSession = false;

const fmtMin = sec => sec < 60 ? `${sec} שנ׳` : `${Math.round(sec / 60)} דק׳`;
const fmtDate = iso => iso ? new Date(iso).toLocaleDateString('he-IL') : '—';

export function render(app) {
  if (!unlockedThisSession) return gate(app);
  dashboard(app);
}

function gate(app) {
  const st = getState();
  const creating = !st.parentPin;
  const pin = h('input', { class: 'text-input pin-input ltr', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'off', 'aria-label': 'קוד הורים' });
  const pin2 = creating ? h('input', { class: 'text-input pin-input ltr', type: 'password', inputmode: 'numeric', maxlength: 6, autocomplete: 'off', 'aria-label': 'אימות קוד', style: { marginTop: '10px' } }) : null;
  const err = h('div', { class: 'muted', style: { minHeight: '24px', marginTop: '8px' } });
  const go = async () => {
    const v = pin.value.trim();
    if (!/^\d{4,6}$/.test(v)) { err.textContent = 'קוד של 4 עד 6 ספרות'; return; }
    if (creating) {
      if (v !== pin2.value.trim()) { err.textContent = 'הקודים לא תואמים'; return; }
      const hashed = await hashPin(v);
      update(s => { s.parentPin = hashed; });
      unlockedThisSession = true; render(app);
    } else if (await hashPin(v) === st.parentPin) {
      unlockedThisSession = true; render(app);
    } else { err.textContent = 'קוד שגוי'; pin.value = ''; }
  };
  [pin, pin2].forEach(i => i?.addEventListener('keydown', e => { if (e.key === 'Enter') go(); }));
  mount(app, topbar(),
    h('section', { class: 'card center', style: { maxWidth: '420px', margin: '20px auto' } },
      h('div', { class: 'big-emoji' }, '👨‍👧'),
      h('h2', {}, 'אזור הורים'),
      h('p', { class: 'muted' }, creating ? 'בחרו קוד של 4 עד 6 ספרות. הקוד שומר שרק הורים ייכנסו לכאן.' : 'הקלידו את קוד ההורים'),
      pin, pin2, err,
      h('button', { class: 'btn block', onclick: go }, creating ? 'שמירת קוד' : 'כניסה')));
  setTimeout(() => pin.focus(), 50);
}

// What the kid built: chatbot design + app specs with a ready Base44 prompt (a real-world quest to do together).
function projects(st) {
  const products = st.products || [];
  if (!products.length && !st.chatbot) return null;
  const copy = async text => { try { await navigator.clipboard.writeText(text); toast('הפרומפט הועתק 📋'); } catch { toast('לא הצלחתי להעתיק'); } };
  return h('section', { class: 'card' }, h('h2', {}, '🏭 הפרויקטים שלו'),
    st.chatbot ? h('p', {}, `💬 צ׳אטבוט: ${st.chatbot.bot} (${st.chatbot.topic}), אישיות: ${st.chatbot.persona}.`) : null,
    products.slice().reverse().map(p => h('div', { class: 'mission-box' },
      h('b', {}, `📱 ${p.name || 'אפליקציה'}`), h('div', { class: 'muted' }, `${p.problem} · ${p.audience}`),
      h('pre', { class: 'prompt-preview', style: { whiteSpace: 'pre-wrap', fontSize: '14px' } }, p.prompt),
      h('div', { class: 'row' }, h('button', { class: 'btn secondary small', onclick: () => copy(p.prompt) }, '📋 העתק'),
        h('span', { class: 'muted', style: { fontSize: '14px' } }, 'משימת שטח: הדביקו את הפרומפט ב-Base44 ובנו יחד את האפליקציה.')))));
}

function dashboard(app) {
  const st = getState();
  const rank = rankFor(st.xp, RANKS);
  const missions = BASES.flatMap(b => b.missions);
  const totalSec = Object.values(st.days).reduce((a, b) => a + b, 0);
  const done = missions.filter(m => st.missions[m.id]?.firstDoneAt);
  const q = Object.values(st.quiz).reduce((a, x) => ({ c: a.c + x.correct, t: a.t + x.total }), { c: 0, t: 0 });

  // Last 14 days of play
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return today(d); });
  const maxDay = Math.max(60, ...days.map(d => st.days[d] || 0));
  const chart = h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '4px', height: '90px', direction: 'ltr' }, role: 'img', 'aria-label': 'זמן משחק ב-14 הימים האחרונים' },
    days.map(d => {
      const sec = st.days[d] || 0;
      return h('div', { title: `${d}: ${fmtMin(sec)}`, style: { flex: 1, height: Math.max(3, (sec / maxDay) * 86) + 'px', background: sec ? 'var(--accent)' : 'var(--line)', borderRadius: '4px 4px 0 0' } });
    }));

  const weak = missions
    .filter(m => st.quiz[m.id]?.total)
    .map(m => ({ m, acc: st.quiz[m.id].correct / st.quiz[m.id].total }))
    .filter(x => x.acc < 0.7);

  const rows = missions.map(m => {
    const r = st.missions[m.id];
    const qq = st.quiz[m.id];
    return h('tr', {},
      h('td', {}, `${m.emoji} ${m.title}`),
      h('td', {}, r?.firstDoneAt ? '★'.repeat(r.stars) : r?.attempts ? 'התחיל' : '—'),
      h('td', {}, qq?.total ? `${Math.round(100 * qq.correct / qq.total)}%` : '—'),
      h('td', {}, r?.attempts || 0),
      h('td', {}, r ? fmtMin(r.timeSec) : '—'),
      h('td', {}, fmtDate(r?.firstDoneAt)));
  });

  const file = h('input', { type: 'file', accept: 'application/json', style: { display: 'none' } });
  file.addEventListener('change', async () => {
    try { importJSON(await file.files[0].text()); toast('ההתקדמות יובאה ✅'); render(app); }
    catch { toast('הקובץ לא תקין'); }
  });
  const doExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `mamram-progress-${today()}.json` });
    document.body.append(a); a.click(); a.remove();
  };

  mount(app, topbar(),
    h('h1', {}, '👨‍👧 לוח הורים'),
    h('section', { class: 'card' },
      h('div', { class: 'grid2' },
        h('div', { class: 'stat' }, h('b', {}, `${done.length}/${missions.length}`), 'משימות הושלמו'),
        h('div', { class: 'stat' }, h('b', {}, q.t ? `${Math.round(100 * q.c / q.t)}%` : '—'), 'דיוק בבחנים'),
        h('div', { class: 'stat' }, h('b', {}, fmtMin(totalSec)), 'זמן למידה כולל'),
        h('div', { class: 'stat' }, h('b', {}, `🔥 ${st.streak.count}`), `רצף (שיא ${st.streak.best})`),
        h('div', { class: 'stat' }, h('b', {}, `${rank.icon} ${rank.name}`), `${st.xp} XP`),
        h('div', { class: 'stat' }, h('b', {}, fmtDate(st.streak.last ? st.streak.last + 'T12:00' : '')), 'פעילות אחרונה'))),
    h('section', { class: 'card' }, h('h2', {}, 'זמן למידה, 14 ימים אחרונים'), chart),
    h('section', { class: 'card' }, h('h2', {}, 'נושאים לחיזוק'),
      weak.length
        ? h('ul', {}, weak.map(x => h('li', {}, `${x.m.title} (${x.m.topic}): ${Math.round(x.acc * 100)}% בבוחן`)))
        : h('p', { class: 'muted' }, q.t ? 'אין נושא מתחת ל-70%. מצוין! 👏' : 'עדיין אין נתונים.')),
    projects(st),
    h('section', { class: 'card' }, h('h2', {}, 'פירוט משימות'),
      h('div', { class: 'table-wrap' }, h('table', {},
        h('thead', {}, h('tr', {}, ['משימה', 'כוכבים', 'בוחן', 'ניסיונות', 'זמן', 'הושלם'].map(t => h('th', {}, t)))),
        h('tbody', {}, rows)))),
    h('section', { class: 'card' }, h('h2', {}, 'גיבוי והעברה'),
      h('p', { class: 'muted' }, 'ההתקדמות נשמרת רק במכשיר הזה. אפשר לייצא קובץ ולייבא אותו במכשיר אחר.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn secondary small', onclick: doExport }, '⬇️ ייצוא'),
        h('button', { class: 'btn secondary small', onclick: () => file.click() }, '⬆️ ייבוא'), file,
        h('span', { class: 'spacer' }),
        h('button', { class: 'btn danger small', onclick: () => {
          if (confirm('למחוק את כל ההתקדמות? אי אפשר לבטל.')) { resetAll(); toast('ההתקדמות אופסה'); location.hash = '#/welcome'; }
        } }, '🗑️ איפוס'))));
}
