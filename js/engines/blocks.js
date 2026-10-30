// Robot blocks: build a program from command blocks (with ×N repeats) and see it as Python.
import { h, mount, rich, sound, shake } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

const CMDS = {
  F: { label: () => L('קדימה', 'Forward'), icon: 'arrow-up', py: 'forward()' },
  L: { label: () => L('סובב שמאלה', 'Turn left'), icon: 'rotate-ccw', py: 'turn_left()' },
  R: { label: () => L('סובב ימינה', 'Turn right'), icon: 'rotate-ccw', flip: true, py: 'turn_right()' },
};
const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // up, right, down, left
const ROT = ['0deg', '90deg', '180deg', '270deg'];

const cmdLabel = c => c.label();
const cmdIcon = c => { const s = icon(c.icon, 16); if (c.flip) s.style.transform = 'scaleX(-1)'; s.style.verticalAlign = '-3px'; return s; };
// Board piece: a line icon that scales with its cell.
const piece = (name, w = '62%') => { const s = icon(name, 24); s.style.width = w; s.style.height = 'auto'; return s; };

export function toPython(prog) {
  if (!prog.length) return L('# הוסף בלוקים...', '# add blocks...');
  return prog.map(b => b.times > 1 ? `for i in range(${b.times}):\n    ${CMDS[b.cmd].py}` : CMDS[b.cmd].py).join('\n');
}

export function run(root, cfg, done) {
  let li = 0;
  const scores = [];

  function level() {
    if (li >= cfg.levels.length) return done(scores.reduce((a, b) => a + b, 0) / scores.length);
    const lv = cfg.levels[li];
    const rows = lv.grid.length, cols = lv.grid[0].length;
    const coins = [];
    let goal;
    lv.grid.forEach((r, y) => [...r].forEach((c, x) => { if (c === '*') goal = { x, y }; if (c === 'o') coins.push(`${x},${y}`); }));
    let prog = [], fails = 0, running = false;
    const fb = h('div');

    const board = h('div', { class: 'board ltr', style: { gridTemplateColumns: `repeat(${cols}, 1fr)` } });
    const cells = [];
    lv.grid.forEach((r, y) => [...r].forEach((c, x) => {
      const cell = h('div', { class: `cell ${c === '#' ? 'wall' : ''}` }, c === '*' ? piece('star') : c === 'o' ? piece('gem') : c === '#' ? piece('brick-wall') : '');
      cells.push(cell); board.append(cell);
    }));
    const robot = h('div', { class: 'robot' }, piece('bot', '70%'), h('i', { class: 'robot-dir' }, '▲'));
    board.append(robot);
    const place = st => {
      robot.style.left = `${(st.x / cols) * 100}%`;
      robot.style.top = `${(st.y / rows) * 100}%`;
      robot.style.width = `${100 / cols}%`;
      robot.style.height = `${100 / rows}%`;
      robot.querySelector('.robot-dir').style.transform = `rotate(${ROT[st.dir]})`;
    };
    const resetBoard = () => {
      cells.forEach((c, i) => { const x = i % cols, y = Math.floor(i / cols); if (lv.grid[y][x] === 'o') c.replaceChildren(piece('gem')); });
      place(lv.start);
    };

    const progEl = h('div', { class: 'program' });
    const codeEl = h('pre', { class: 'console ltr' });
    const count = h('span', { class: 'chip' });
    const paint = () => {
      mount(progEl, prog.length ? prog.map((b, i) => h('div', { class: 'block' },
        h('span', {}, cmdIcon(CMDS[b.cmd]), ` ${cmdLabel(CMDS[b.cmd])}`),
        h('button', { class: 'times ltr', title: L('כמה פעמים לחזור', 'How many times to repeat'), onclick: () => { b.times = b.times >= 9 ? 1 : b.times + 1; sound('click'); paint(); } }, `×${b.times}`),
        h('button', { class: 'del', 'aria-label': L('מחק', 'Delete'), onclick: () => { prog.splice(i, 1); paint(); } }, '✕'))) : h('div', { class: 'muted' }, L('התוכנית ריקה. לחץ על הבלוקים למטה.', 'The program is empty. Tap the blocks below.')));
      codeEl.textContent = toPython(prog);
      mount(count, icon('toy-brick', 14), lv.maxBlocks ? ` ${prog.length}/${lv.maxBlocks}` : ` ${prog.length}`);
    };
    const add = cmd => {
      if (running) return;
      if (lv.maxBlocks && prog.length >= lv.maxBlocks) { sound('bad'); shake(progEl); return mount(fb, h('div', { class: 'feedback bad' }, rich(L(`מותר רק **${lv.maxBlocks === 1 ? 'בלוק אחד' : lv.maxBlocks + ' בלוקים'}**! טיפ: לחץ על \`×1\` בבלוק כדי שיחזור כמה פעמים. ככה עובדת **לולאה**.`, `Only **${lv.maxBlocks === 1 ? 'one block' : lv.maxBlocks + ' blocks'}** allowed! Tip: tap \`×1\` on a block to repeat it several times. That is how a **loop** works.`)))); }
      const last = prog[prog.length - 1];
      prog.push({ cmd, times: 1 });
      sound('click'); paint();
      if (last && last.cmd === cmd && lv.maxBlocks) mount(fb, h('div', { class: 'feedback good' }, rich(L('שני בלוקים זהים ברצף? אפשר בלוק אחד עם `×2`!', 'Two identical blocks in a row? Use one block with `×2`!'))));
    };

    async function go() {
      if (running || !prog.length) return;
      running = true; mount(fb); resetBoard();
      const st = { ...lv.start };
      const got = new Set();
      const steps = prog.flatMap(b => Array(b.times).fill(b.cmd));
      let crash = null;
      for (const s of steps) {
        await new Promise(r => setTimeout(r, 330));
        if (s === 'L') st.dir = (st.dir + 3) % 4;
        else if (s === 'R') st.dir = (st.dir + 1) % 4;
        else {
          const nx = st.x + DIRS[st.dir][0], ny = st.y + DIRS[st.dir][1];
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || lv.grid[ny][nx] === '#') { crash = nx < 0 || ny < 0 || nx >= cols || ny >= rows ? L('הרובוט כמעט נפל מהלוח!', 'The robot almost fell off the board!') : L('בום! הרובוט נתקע בקיר', 'Boom! The robot hit a wall'); break; }
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
        return mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('הרובוט הגיע! ', 'The robot made it! ')), rich(lv.explain || ''),
          h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
      }
      fails++; sound('bad'); shake(board);
      mount(fb, h('div', { class: 'feedback bad' }, crash || (atGoal ? L('הגעת לכוכב, אבל שכחת לאסוף את כל היהלומים!', 'You reached the star, but forgot to collect all the gems!') : L('הרובוט עצר, אבל לא על הכוכב. תבדוק את הסדר.', 'The robot stopped, but not on the star. Check the order.')),
        h('div', { class: 'muted', style: { marginTop: '6px' } }, L('תקן את התוכנית ונסה שוב. מתכנתים אמיתיים עושים את זה כל הזמן!', 'Fix the program and try again. Real programmers do this all the time!'))));
    }

    mount(root,
      h('div', { class: 'mission-box' }, h('b', {}, L(`שלב ${li + 1}/${cfg.levels.length}: `, `Level ${li + 1}/${cfg.levels.length}: `)), rich(lv.task)),
      board,
      h('div', { class: 'row', style: { margin: '10px 0 4px' } }, h('b', {}, L('התוכנית שלך', 'Your program')), h('span', { class: 'spacer' }), count),
      progEl,
      h('div', { class: 'palette' }, Object.entries(CMDS).map(([k, c]) => h('button', { class: 'btn secondary small', onclick: () => add(k) }, cmdIcon(c), ` ${cmdLabel(c)}`))),
      h('div', { class: 'row', style: { marginTop: '8px' } },
        h('button', { class: 'btn', onclick: go }, icon('play', 16), L(' הפעל רובוט', ' Run robot')),
        h('button', { class: 'btn secondary small', onclick: () => { if (!running) { prog = []; paint(); resetBoard(); mount(fb); } } }, icon('trash-2', 16), L(' נקה', ' Clear'))),
      h('details', { class: 'mission-box', style: { marginTop: '10px' }, open: !!lv.showCode },
        h('summary', {}, h('b', {}, L('ככה זה נראה ב-Python', 'This is how it looks in Python'))), codeEl),
      fb);
    paint(); resetBoard();
  }

  level();
}
