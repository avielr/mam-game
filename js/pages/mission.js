import { h, mount, rich, sound, confetti, commanderSays, shake } from '../ui.js';
import { getState, startMission, logTime, recordQuiz, completeMission } from '../state.js';
import { RANKS, BADGES, tr } from '../content/meta.js';
import { bases, findMission } from '../content/index.js';
import { ENGINES } from '../engines/index.js';
import { L } from '../i18n.js';
import { icon, insignia } from '../icons.js';
import { fill } from './common.js';
import { baseUnlocked, missionUnlocked } from './map.js';
import { briefing } from './video.js';

const STEPS = 5;

export function render(app, id) {
  const BASES = bases();
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

  // The first quiz question becomes the briefing's checkpoint; the rest come after the game.
  const checkpoint = m.quiz.length > 2 ? m.quiz[0] : null;
  const quizQs = checkpoint ? m.quiz.slice(1) : m.quiz;
  let gameScore = 0, quizCorrect = 0, quizTotal = 0;
  const bar = h('div', { class: 'progress-steps', 'aria-hidden': 'true' });
  const stage = h('main');
  const setStep = n => mount(bar, [...Array(STEPS)].map((_, i) => h('i', { class: i <= n ? 'on' : '' })));

  mount(app,
    h('header', { class: 'topbar' },
      h('a', { class: 'icon-btn', href: '#/', 'aria-label': L('חזרה למפה', 'Back to map') }, icon('x', 20)), bar,
      h('span', { class: 'icon-btn ghost' }, icon(m.emoji, 20))),
    stage);

  // 1. Story
  function story() {
    setStep(0);
    let i = 0;
    const box = h('div');
    const btn = h('button', { class: 'btn block' });
    const paint = () => {
      mount(box, h('div', { class: 'kicker' }, m.boss ? L('משימת בוס', 'Boss mission') : m.topic), h('h1', {}, m.title), ...m.story.slice(0, i + 1).map(s => commanderSays(fill(s))));
      mount(btn, i < m.story.length - 1 ? L('המשך', 'Continue') : [L('לתדריך הווידאו', 'To the video briefing'), icon('play', 18)]);
    };
    btn.onclick = () => { sound('click'); if (i < m.story.length - 1) { i++; paint(); } else video(); };
    mount(stage, box, btn);
    paint();
  }

  // 2. Video briefing (nuggets as animated narrated scenes + checkpoint)
  function video() {
    setStep(1);
    briefing(stage, m, {
      checkpoint,
      onCheckpoint: ok => { quizTotal++; if (ok) quizCorrect++; },
      onDone: game,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 3. Game
  function game() {
    setStep(2);
    const g = m.game;
    const area = h('div');
    mount(stage,
      h('div', { class: 'game-title' }, h('span', { class: 'tag' }, L('משימה', 'Mission')), h('h2', { style: { margin: 0 } }, g.title)),
      h('p', { class: 'muted' }, rich(g.intro)),
      h('div', { class: 'card' }, area));
    window.scrollTo({ top: 0 });
    ENGINES[g.engine](area, g.config, score => {
      gameScore = score;
      sound('win');
      mount(stage, h('div', { class: 'card center fade-in' },
        h('div', { class: 'hero-icon' }, icon(score >= 0.8 ? 'target' : 'circle-check', 40)),
        h('h2', {}, score >= 0.8 ? L('ביצוע מושלם!', 'Flawless execution!') : L('משימה הושלמה!', 'Mission complete!')),
        h('p', { class: 'muted' }, L('עכשיו בוחן קצר כדי לוודא שהכול נקלט.', 'Now a quick quiz to lock it in.')),
        h('button', { class: 'btn', onclick: quiz }, L('לבוחן', 'To the quiz'), icon('arrow-right', 18, 'flip-rtl'))));
    });
  }

  // 4. Quiz
  function quiz() {
    setStep(3);
    let i = 0, correct = 0;
    const paint = () => {
      const q = quizQs[i];
      const fb = h('div');
      const card = h('div', { class: 'card' },
        h('div', { class: 'row' }, h('span', { class: 'kicker' }, L(`שאלה ${i + 1} מתוך ${quizQs.length}`, `Question ${i + 1} of ${quizQs.length}`)), h('span', { class: 'spacer' }), h('span', { class: 'chip' }, icon('circle-check', 16), correct)),
        h('h2', { style: { marginTop: '8px' } }, rich(q.q)));
      const opts = h('div', { class: 'options' }, q.options.map((o, oi) => h('button', { class: 'opt', onclick: () => {
        const ok = oi === q.answer;
        [...opts.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === q.answer ? 'correct' : j === oi ? 'wrong' : 'dim'); });
        if (ok) { correct++; sound('good'); } else { sound('bad'); shake(card); }
        mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, ok ? L('נכון! ', 'Correct! ') : L('לא נכון. ', 'Not quite. ')), rich(q.explain),
          h('div', { class: 'row end', style: { marginTop: '10px' } },
            h('button', { class: 'btn small', onclick: () => {
              if (i < quizQs.length - 1) { i++; paint(); }
              else { quizCorrect += correct; quizTotal += quizQs.length; recordQuiz(id, quizCorrect, quizTotal); finish(); }
            } }, i < quizQs.length - 1 ? [L('הבא', 'Next'), icon('arrow-right', 16, 'flip-rtl')] : L('סיום', 'Finish')))));
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
    const score = gameScore * 0.6 + (quizTotal ? quizCorrect / quizTotal : 0) * 0.4;
    const r = completeMission(m, score, RANKS);
    confetti(); sound('win');
    const st = getState();
    const next = BASES[bi].missions[mi + 1];
    const stars = h('div', { class: 'stars-big', 'aria-label': L(`${r.stars} כוכבים`, `${r.stars} stars`) },
      [0, 1, 2].map(i => icon('star', 40, i < r.stars ? 'star-on' : 'star-off')));
    mount(stage,
      h('div', { class: 'card reward fade-in' },
        h('div', { class: 'kicker' }, m.boss ? L('בוס הובס', 'Boss defeated') : L('משימה הושלמה', 'Mission complete')),
        stars,
        h('div', { class: 'xp' }, h('bdi', {}, `+${r.xpGained} XP`)),
        r.rankUp ? h('div', { class: 'feedback good rankup' }, insignia(r.rankUp.index, 32), L('עלית בדרגה! עכשיו אתה ', 'Promoted! You are now '), h('b', {}, tr(r.rankUp.name))) : null,
        ...r.newBadges.map(b => h('div', { class: 'feedback good badge-new' }, h('span', { class: 'hexi' }, icon(BADGES[b].icon, 20)), L('תג חדש: ', 'New badge: '), h('b', {}, tr(BADGES[b].name)))),
        h('div', { class: 'muted', style: { margin: '8px 0' } }, icon('flame', 16), ' ', st.streak.count === 1 ? L('יום ראשון ברצף. תחזור מחר!', 'Day 1 of your streak. Come back tomorrow!') : L(`${st.streak.count} ימים ברצף`, `${st.streak.count}-day streak`)),
        commanderSays(fill(m.outro)),
        h('div', { class: 'row center', style: { marginTop: '14px' } },
          h('a', { class: 'btn secondary', href: '#/' }, icon('map', 18), L('למפה', 'Map')),
          next ? h('a', { class: 'btn', href: `#/mission/${next.id}` }, L('למשימה הבאה', 'Next mission'), icon('arrow-right', 18, 'flip-rtl')) : null,
          r.stars < 3 ? h('button', { class: 'btn warn', onclick: () => { onLeave(); render(app, id); } }, icon('rotate-ccw', 18), L('שוב, ל-3 כוכבים', 'Retry for 3 stars')) : null)));
  }

  story();
}
