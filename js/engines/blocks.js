// Robot blocks: build a program from command blocks (with ×N repeats) and see it as Python.
import { h, mount, rich, sound, shake } from '../ui.js';

const CMDS = {
  F: { label: 'קדימה', icon: '⬆️', py: 'forward()' },
  L: { label: 'סובב שמאלה', icon: '↪️', py: 'turn_left()' },
  R: { label: 'סובב ימינה', icon: '↩️', py: 'turn_right()' },
};
const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // up, right, down, left
const ROT = ['0deg', '90deg', '180deg', '270deg'];

export function toPython(prog) {
  if (!prog.length) return '# הוסף בלוקים...';
  return prog.map(b => b.times > 1 ? `for i in range(${b.times}):\n    ${CMDS[b.cmd].py}` : CMDS[b.cmd].py).join('\n');
}

export function run(root, cfg, done) {
  let li = 0;
  const scores = [];

  function level() {
    if (li >= cfg.levels.length) return done(scores.reduce((a, b) => a + b, 0) / scores.length);
    const L = cfg.levels[li];
    const rows = L.grid.length, cols = L.grid[0].length;
    const coins = [];
    let goal;
    L.grid.forEach((r, y) => [...r].forEach((c, x) => { if (c === '*') goal = { x, y }; if (c === 'o') coins.push(`${x},${y}`); }));
    let prog = [], fails = 0, running = false;
    const fb = h('div');

    const board = h('div', { class: 'board ltr', style: { gridTemplateColumns: `repeat(${cols}, 1fr)` } });
    const cells = [];
    L.grid.forEach((r, y) => [...r].forEach((c, x) => {
      const cell = h('div', { class: `cell ${c === '#' ? 'wall' : ''}` }, c === '*' ? '⭐' : c === 'o' ? '💎' : c === '#' ? '🧱' : '');
      cells.push(cell); board.append(cell);
    }));
    const robot = h('div', { class: 'robot' }, h('span', {}, '🤖'), h('i', { class: 'robot-dir' }, '▲'));
    board.append(robot);
    const place = st => {
      robot.style.left = `${(st.x / cols) * 100}%`;
      robot.style.top = `${(st.y / rows) * 100}%`;
      robot.style.width = `${100 / cols}%`;
      robot.style.height = `${100 / rows}%`;
      robot.querySelector('.robot-dir').style.transform = `rotate(${ROT[st.dir]})`;
    };
    const resetBoard = () => {
      cells.forEach((c, i) => { const x = i % cols, y = Math.floor(i / cols); if (L.grid[y][x] === 'o') c.textContent = '💎'; });
      place(L.start);
    };

    const progEl = h('div', { class: 'program' });
    const codeEl = h('pre', { class: 'console ltr' });
    const count = h('span', { class: 'chip' });
    const paint = () => {
      mount(progEl, prog.length ? prog.map((b, i) => h('div', { class: 'block' },
        h('span', {}, `${CMDS[b.cmd].icon} ${CMDS[b.cmd].label}`),
        h('button', { class: 'times ltr', title: 'כמה פעמים לחזור', onclick: () => { b.times = b.times >= 9 ? 1 : b.times + 1; sound('click'); paint(); } }, `×${b.times}`),
        h('button', { class: 'del', 'aria-label': 'מחק', onclick: () => { prog.splice(i, 1); paint(); } }, '✕'))) : h('div', { class: 'muted' }, 'התוכנית ריקה. לחץ על הבלוקים למטה.'));
      codeEl.textContent = toPython(prog);
      count.textContent = L.maxBlocks ? `🧱 ${prog.length}/${L.maxBlocks}` : `🧱 ${prog.length}`;
    };
    const add = cmd => {
      if (running) return;
      if (L.maxBlocks && prog.length >= L.maxBlocks) { sound('bad'); shake(progEl); return mount(fb, h('div', { class: 'feedback bad' }, rich(`מותר רק **${L.maxBlocks === 1 ? 'בלוק אחד' : L.maxBlocks + ' בלוקים'}**! טיפ: לחץ על \`×1\` בבלוק כדי שיחזור כמה פעמים. ככה עובדת **לולאה**.`))); }
      const last = prog[prog.length - 1];
      prog.push({ cmd, times: 1 });
      sound('click'); paint();
      if (last && last.cmd === cmd && L.maxBlocks) mount(fb, h('div', { class: 'feedback good' }, rich('💡 שני בלוקים זהים ברצף? אפשר בלוק אחד עם `×2`!')));
    };

    async function go() {
      if (running || !prog.length) return;
      running = true; mount(fb); resetBoard();
      const st = { ...L.start };
      const got = new Set();
      const steps = prog.flatMap(b => Array(b.times).fill(b.cmd));
      let crash = null;
      for (const s of steps) {
        await new Promise(r => setTimeout(r, 330));
        if (s === 'L') st.dir = (st.dir + 3) % 4;
        else if (s === 'R') st.dir = (st.dir + 1) % 4;
        else {
          const nx = st.x + DIRS[st.dir][0], ny = st.y + DIRS[st.dir][1];
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || L.grid[ny][nx] === '#') { crash = nx < 0 || ny < 0 || nx >= cols || ny >= rows ? 'הרובוט כמעט נפל מהלוח!' : 'בום! הרובוט נתקע בקיר 🧱'; break; }
          st.x = nx; st.y = ny;
          const key = `${nx},${ny}`;
          if (coins.includes(key)) { got.add(key); cells[ny * cols + nx].textContent = ''; sound('click'); }
        }
        place(st);
      }
      running = false;
      const atGoal = st.x === goal.x && st.y === goal.y;
      if (!crash && atGoal && got.size === coins.length) {
        sound('win');
        scores.push(Math.max(0.5, 1 - fails * 0.15));
        return mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '⭐ הרובוט הגיע! '), rich(L.explain || ''),
          h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, 'הבא ←'))));
      }
      fails++; sound('bad'); shake(board);
      mount(fb, h('div', { class: 'feedback bad' }, crash || (atGoal ? 'הגעת לכוכב, אבל שכחת לאסוף את כל היהלומים 💎!' : 'הרובוט עצר, אבל לא על הכוכב ⭐. תבדוק את הסדר.'),
        h('div', { class: 'muted', style: { marginTop: '6px' } }, 'תקן את התוכנית ונסה שוב. מתכנתים אמיתיים עושים את זה כל הזמן! 🐞')));
    }

    mount(root,
      h('div', { class: 'mission-box' }, h('b', {}, `🤖 שלב ${li + 1}/${cfg.levels.length}: `), rich(L.task)),
      board,
      h('div', { class: 'row', style: { margin: '10px 0 4px' } }, h('b', {}, '📜 התוכנית שלך'), h('span', { class: 'spacer' }), count),
      progEl,
      h('div', { class: 'palette' }, Object.entries(CMDS).map(([k, c]) => h('button', { class: 'btn secondary small', onclick: () => add(k) }, `${c.icon} ${c.label}`))),
      h('div', { class: 'row', style: { marginTop: '8px' } },
        h('button', { class: 'btn', onclick: go }, '▶ הפעל רובוט'),
        h('button', { class: 'btn secondary small', onclick: () => { if (!running) { prog = []; paint(); resetBoard(); mount(fb); } } }, '🗑️ נקה')),
      h('details', { class: 'mission-box', style: { marginTop: '10px' }, open: !!L.showCode },
        h('summary', {}, h('b', {}, '🐍 ככה זה נראה ב-Python')), codeEl),
      fb);
    paint(); resetBoard();
  }

  level();
}
