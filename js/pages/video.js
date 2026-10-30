// Briefing "video": the mission's knowledge nuggets as animated, narrated scenes with a question checkpoint midway.
import { h, mount, rich, sound, svgEl, shake } from '../ui.js';
import { getState, update } from '../state.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';
import { say, stopSpeech, canSpeak } from '../narrator.js';
import { fill } from './common.js';

const sentences = t => String(t).split(/\n+|(?<=[.!?])\s+(?=\S)/).map(s => s.trim()).filter(Boolean);

export function briefing(stage, m, { checkpoint, onCheckpoint, onDone }) {
  const scenes = [{ kind: 'intro', lines: [L(`משימה: ${m.title}.`, `Mission: ${m.title}.`), L(`הנושא: ${m.topic}. בוא נבין את זה לפני שיוצאים לשטח.`, `Topic: ${m.topic}. Let's get the idea before we go into the field.`)] }];
  m.nuggets.forEach(n => scenes.push({ kind: 'nugget', n, lines: [/[.!?]$/.test(n.title) ? n.title : n.title + '.',...sentences(fill(n.text)), ...(n.analogy ? [L('כמו ש... ', 'Think of it like this: ') + n.analogy] : [])] }));
  if (checkpoint) scenes.splice(Math.min(scenes.length, 1 + Math.ceil(m.nuggets.length / 2)), 0, { kind: 'check', q: checkpoint, lines: [] });
  scenes.push({ kind: 'outro', lines: [L('סוף התדריך. עכשיו תורך להפעיל את זה במשימה.', 'End of briefing. Now it is your turn to use it in the mission.')] });

  let si = 0, li = 0, playing = false, token = 0, speech = null, answered = false;
  const screen = h('div', { class: 'vscreen' });
  const caption = h('div', { class: 'vcap', 'aria-live': 'polite' });
  const bar = h('div', { class: 'vbar' });
  const playBtn = h('button', { class: 'vbtn main', 'aria-label': L('נגן / השהה', 'Play / pause'), onclick: () => (playing ? pause() : play()) });
  const voiceBtn = h('button', { class: 'vbtn', onclick: () => { update(s => { s.narration = !s.narration; }); paintVoice(); if (playing) { pause(); play(); } } });
  const paintVoice = () => mount(voiceBtn, icon(getState().narration && canSpeak() ? 'volume-2' : 'volume-x', 20));
  voiceBtn.setAttribute('aria-label', L('קריינות', 'Narration'));
  const paintPlay = () => mount(playBtn, icon(playing ? 'pause' : 'play', 22));

  const goto = (i, autoplay = playing) => {
    token++; speech?.cancel();
    si = Math.max(0, Math.min(scenes.length - 1, i)); li = 0;
    renderScene();
    if (autoplay && scenes[si].kind !== 'check') play(); else { playing = false; paintPlay(); }
  };
  const ctrl = h('div', { class: 'vctrl' },
    h('button', { class: 'vbtn', 'aria-label': L('סצנה קודמת', 'Previous scene'), onclick: () => goto(si - 1) }, icon(L('skip-forward', 'rotate-ccw'), 20)),
    playBtn,
    h('button', { class: 'vbtn', 'aria-label': L('סצנה הבאה', 'Next scene'), onclick: () => { if (scenes[si].kind === 'check' && !answered) return; goto(si + 1); } }, icon('skip-forward', 20, 'flip-rtl')),
    h('span', { class: 'spacer' }),
    voiceBtn,
    h('button', { class: 'btn small secondary', onclick: finish }, L('דלג למשימה', 'Skip to mission')));
  // In RTL the "previous" control is the mirrored skip icon; in LTR use a rewind-style icon.
  ctrl.firstChild.replaceChildren(icon('skip-forward', 20, L('', 'flip')));

  function renderScene() {
    const sc = scenes[si];
    mount(bar, scenes.map((s, i) => h('i', { class: `${i < si ? 'done' : ''} ${i === si ? 'on' : ''} ${s.kind === 'check' ? 'q' : ''}` }, i === si ? h('b', { style: { width: '0%' } }) : null)));
    let body;
    if (sc.kind === 'intro') body = h('div', { class: 'vintro' },
      h('div', { class: 'vemblem' }, icon(m.emoji, 44)),
      h('div', { class: 'vkicker' }, L('תדריך משימה', 'Mission briefing')),
      h('h2', {}, m.title), h('div', { class: 'muted' }, m.topic));
    else if (sc.kind === 'nugget') {
      const d = sc.n.diagram ? svgEl(sc.n.diagram) : null;
      if (d) [...d.children].filter(c => c.tagName !== 'defs').forEach((c, i) => { c.classList.add('va'); c.style.setProperty('--i', i); });
      body = h('div', { class: 'vnugget' },
        h('div', { class: 'vkicker' }, sc.n.kicker), h('h2', {}, sc.n.title),
        d ? h('div', { class: 'vdiagram' }, d) : h('div', { class: 'vtext' }, rich(fill(sc.n.text))),
        sc.n.analogy ? h('div', { class: 'analogy vhidden', 'data-label': L('כמו ש... ', 'Like... ') }, rich(sc.n.analogy)) : null);
    } else if (sc.kind === 'check') body = checkView(sc.q);
    else body = h('div', { class: 'vintro' },
      h('div', { class: 'vemblem done' }, icon('circle-check', 44)),
      h('div', { class: 'vkicker' }, L('התדריך הושלם', 'Briefing complete')),
      h('button', { class: 'btn', onclick: finish }, L('יוצאים למשימה', 'Start the mission'), icon('arrow-right', 20, 'flip-rtl')));
    mount(screen, h('div', { class: `vlayer v-${sc.kind}` }, body), caption);
    mount(caption, sc.kind === 'check' ? null : rich(fill(sc.lines[0] || '')));
    caption.hidden = sc.kind === 'check';
  }

  function checkView(q) {
    const fb = h('div');
    const card = h('div', { class: 'vcheck' }, h('div', { class: 'vkicker' }, icon('circle-help', 16), ' ', L('עצירה לבדיקה', 'Checkpoint')), h('h3', {}, rich(q.q)));
    const opts = h('div', { class: 'options' }, q.options.map((o, oi) => h('button', { class: 'opt', onclick: () => {
      if (answered) return;
      answered = true;
      const ok = oi === q.answer;
      [...opts.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === q.answer ? 'correct' : j === oi ? 'wrong' : 'dim'); });
      sound(ok ? 'good' : 'bad'); if (!ok) shake(card);
      onCheckpoint?.(ok);
      mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, ok ? L('נכון! ', 'Correct! ') : L('לא בדיוק. ', 'Not quite. ')), rich(q.explain),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => goto(si + 1, true) }, L('המשך בסרטון', 'Continue'), icon('play', 16)))));
    } }, rich(o))));
    card.append(opts, fb);
    return card;
  }

  async function play() {
    const sc = scenes[si];
    if (sc.kind === 'check') return;
    playing = true; paintPlay();
    const my = ++token;
    while (my === token && si < scenes.length) {
      const s = scenes[si];
      if (s.kind === 'check') { playing = false; paintPlay(); return; }
      for (; li < s.lines.length; li++) {
        if (my !== token) return;
        mount(caption, rich(fill(s.lines[li])));
        if (s.kind === 'nugget' && s.n.analogy && li === s.lines.length - 1) screen.querySelector('.analogy')?.classList.remove('vhidden');
        const seg = bar.querySelector('i.on b'); if (seg) seg.style.width = Math.round(100 * (li + 1) / s.lines.length) + '%';
        speech = say(s.lines[li]);
        await speech.done;
      }
      if (my !== token) return;
      await new Promise(r => setTimeout(r, 700));
      if (my !== token) return;
      if (si === scenes.length - 1) { playing = false; paintPlay(); return; }
      si++; li = 0; renderScene();
    }
  }

  function pause() { token++; speech?.cancel(); playing = false; paintPlay(); }
  function finish() { token++; stopSpeech(); onDone(); }

  const start = h('button', { class: 'vstart', 'aria-label': L('הפעל תדריך', 'Play briefing'), onclick: () => { start.remove(); play(); } },
    h('span', { class: 'vstart-ring' }, icon('play', 34)), h('span', {}, L('הפעל תדריך', 'Play briefing')));
  const player = h('div', { class: 'vplayer' }, screen, bar, ctrl);
  mount(stage, player);
  renderScene(); paintPlay(); paintVoice();
  screen.append(start);
  window.addEventListener('hashchange', () => { token++; stopSpeech(); }, { once: true });
}
