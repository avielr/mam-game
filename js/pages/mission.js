import { h, mount, rich, sound, confetti, commanderSays, svgEl, shake } from '../ui.js';
import { getState, startMission, logTime, recordQuiz, completeMission } from '../state.js';
import { RANKS, BADGES } from '../content/meta.js';
import { BASES, findMission } from '../content/index.js';
import { ENGINES } from '../engines/index.js';
import { fill } from './common.js';
import { baseUnlocked, missionUnlocked } from './map.js';

const STEPS = ['תדריך', 'ידע', 'משימה', 'בוחן', 'סיום'];

export function render(app, id) {
  const m = findMission(id);
  const bi = BASES.findIndex(b => b.id === m?.base);
  const mi = m ? BASES[bi].missions.findIndex(x => x.id === id) : -1;
  if (!m || !baseUnlocked(bi) || !missionUnlocked(BASES[bi], mi)) { location.hash = '#/'; return; }

  startMission(id);
  let t0 = Date.now();
  const flushTime = () => { logTime(id, Math.round((Date.now() - t0) / 1000)); t0 = Date.now(); };
  const onLeave = () => { flushTime(); window.removeEventListener('hashchange', onLeave); window.removeEventListener('pagehide', flushTime); };
  window.addEventListener('hashchange', onLeave);
  window.addEventListener('pagehide', flushTime);

  let gameScore = 0, quizScore = 0;
  const bar = h('div', { class: 'progress-steps', 'aria-hidden': 'true' });
  const stage = h('main');
  const setStep = n => mount(bar, STEPS.map((_, i) => h('i', { class: i <= n ? 'on' : '' })));

  mount(app,
    h('header', { class: 'topbar' },
      h('a', { class: 'icon-btn', href: '#/', 'aria-label': 'חזרה למפה' }, '✕'), bar,
      h('span', { class: 'chip' }, m.emoji)),
    stage);

  // 1. Story
  function story() {
    setStep(0);
    let i = 0;
    const box = h('div');
    const btn = h('button', { class: 'btn block' }, 'המשך');
    const paint = () => {
      mount(box, h('h2', {}, m.title), ...m.story.slice(0, i + 1).map(s => commanderSays(fill(s))));
      btn.textContent = i < m.story.length - 1 ? 'המשך' : 'יוצאים לתדריך! 🚀';
    };
    btn.onclick = () => { sound('click'); if (i < m.story.length - 1) { i++; paint(); } else nuggets(); };
    mount(stage, box, btn);
    paint();
  }

  // 2. Nuggets
  function nuggets() {
    setStep(1);
    let i = 0;
    const paint = () => {
      const n = m.nuggets[i];
      mount(stage,
        h('article', { class: 'card nugget' },
          h('div', { class: 'kicker' }, n.kicker),
          h('h2', {}, n.title),
          h('p', {}, rich(fill(n.text))),
          n.diagram ? h('div', { class: 'diagram' }, svgEl(n.diagram)) : null,
          n.analogy ? h('div', { class: 'analogy' }, rich(n.analogy)) : null),
        h('div', { class: 'dots' }, m.nuggets.map((_, j) => h('i', { class: j === i ? 'on' : '' }))),
        h('div', { class: 'row', style: { marginTop: '10px' } },
          i > 0 ? h('button', { class: 'btn secondary', onclick: () => { i--; paint(); } }, '→ הקודם') : null,
          h('span', { class: 'spacer' }),
          h('button', { class: 'btn', onclick: () => { sound('click'); if (i < m.nuggets.length - 1) { i++; paint(); } else game(); } },
            i < m.nuggets.length - 1 ? 'הבא ←' : 'למשימה! 🎮')));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    paint();
  }

  // 3. Game
  function game() {
    setStep(2);
    const g = m.game;
    const area = h('div');
    mount(stage,
      h('div', { class: 'game-title' }, h('span', { class: 'tag' }, 'משימה'), h('h2', { style: { margin: 0 } }, g.title)),
      h('p', { class: 'muted' }, rich(g.intro)),
      h('div', { class: 'card' }, area));
    ENGINES[g.engine](area, g.config, score => {
      gameScore = score;
      sound('win');
      mount(stage, h('div', { class: 'card center fade-in' },
        h('div', { class: 'big-emoji' }, score >= 0.8 ? '🎯' : '💪'),
        h('h2', {}, score >= 0.8 ? 'ביצוע מושלם!' : 'משימה הושלמה!'),
        h('p', { class: 'muted' }, 'עכשיו בוחן קצר כדי לוודא שהכול נקלט.'),
        h('button', { class: 'btn', onclick: quiz }, 'לבוחן ←')));
    });
  }

  // 4. Quiz
  function quiz() {
    setStep(3);
    let i = 0, correct = 0;
    const paint = () => {
      const q = m.quiz[i];
      const fb = h('div');
      const card = h('div', { class: 'card' },
        h('div', { class: 'row' }, h('span', { class: 'muted' }, `שאלה ${i + 1} מתוך ${m.quiz.length}`), h('span', { class: 'spacer' }), h('span', { class: 'chip' }, `✅ ${correct}`)),
        h('h2', { style: { marginTop: '8px' } }, rich(q.q)));
      const opts = h('div', { class: 'options' }, q.options.map((o, oi) => h('button', { class: 'opt', onclick: () => {
        const ok = oi === q.answer;
        [...opts.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === q.answer ? 'correct' : j === oi ? 'wrong' : 'dim'); });
        if (ok) { correct++; sound('good'); } else { sound('bad'); shake(card); }
        mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, ok ? 'נכון! ' : 'לא נכון. '), rich(q.explain),
          h('div', { class: 'row end', style: { marginTop: '10px' } },
            h('button', { class: 'btn small', onclick: () => {
              if (i < m.quiz.length - 1) { i++; paint(); }
              else { quizScore = correct / m.quiz.length; recordQuiz(id, correct, m.quiz.length); finish(); }
            } }, i < m.quiz.length - 1 ? 'הבא ←' : 'סיום 🏁'))));
      } }, rich(o))));
      card.append(opts, fb);
      mount(stage, card);
    };
    paint();
  }

  // 5. Reward
  function finish() {
    setStep(4);
    flushTime();
    const score = gameScore * 0.6 + quizScore * 0.4;
    const r = completeMission(m, score, RANKS);
    confetti(); sound('win');
    const st = getState();
    const next = BASES[bi].missions[mi + 1];
    mount(stage,
      h('div', { class: 'card reward fade-in' },
        h('div', { class: 'big' }, m.boss ? '🏆' : '🎉'),
        h('div', { class: 'stars-big', 'aria-label': `${r.stars} כוכבים` }, '★'.repeat(r.stars) + '☆'.repeat(3 - r.stars)),
        h('div', { class: 'xp' }, `+${r.xpGained} XP`),
        r.rankUp ? h('div', { class: 'feedback good', style: { fontSize: '20px' } }, `🎖️ עלית בדרגה! עכשיו אתה ${r.rankUp.name} ${r.rankUp.icon}`) : null,
        ...r.newBadges.map(b => h('div', { class: 'feedback good' }, `${BADGES[b].emoji} תג חדש: `, h('b', {}, BADGES[b].name))),
        h('div', { class: 'muted', style: { margin: '8px 0' } }, st.streak.count === 1 ? '🔥 יום ראשון ברצף. תחזור מחר!' : `🔥 ${st.streak.count} ימים ברצף`),
        commanderSays(fill(m.outro)),
        h('div', { class: 'row center', style: { marginTop: '14px' } },
          h('a', { class: 'btn secondary', href: '#/' }, '🗺️ למפה'),
          next ? h('a', { class: 'btn', href: `#/mission/${next.id}` }, `למשימה הבאה ${next.emoji}`) : null,
          r.stars < 3 ? h('button', { class: 'btn warn', onclick: () => { onLeave(); render(app, id); } }, '🔁 שוב, ל-3 כוכבים') : null)));
  }

  story();
}
