// Git time machine: pick the right git command at each step and watch the history graph grow.
import { h, mount, rich, sound, shake, svgEl } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

const HASHES = ['a1f3', 'b7c2', 'c9e0', 'd4b8', 'e2a6', 'f8d1', '0c5e', '9b3f'];
const MERGE = () => L('מיזוג', 'Merge');

export function run(root, cfg, done) {
  let li = 0, mistakes = 0, total = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, total / (total + mistakes * 0.5)));
    const lv = cfg.levels[li];
    // Repo state
    const commits = [];          // { id, msg, branch, file, parent }
    const tips = { main: null };  // branch -> commit index
    let head = 'main', viewing = null, file = lv.file.slice(), dirty = false, staged = false, showLog = false;
    const commit = msg => {
      const parent = tips[head];
      commits.push({ id: HASHES[commits.length % HASHES.length], msg, branch: head, file: file.slice(), parent });
      tips[head] = commits.length - 1;
      dirty = staged = false;
    };
    (lv.history || []).forEach(c => { file = c.file.slice(); commit(c.msg); });

    const apply = op => {
      if (!op) return;
      if (op.edit) { file = [...file, op.edit]; dirty = true; }
      if (op.add) staged = true;
      if (op.commit) commit(op.commit);
      if (op.log) showLog = true;
      if (op.branch) tips[op.branch] = tips[head];
      if (op.checkout) {
        if (op.checkout in tips) { head = op.checkout; viewing = null; file = commits[tips[head]].file.slice(); }
        else { const c = commits.find(x => x.id === op.checkout); viewing = c; file = c.file.slice(); }
      }
      if (op.merge) {
        const other = commits[tips[op.merge]].file;
        file = [...new Set([...file, ...other])];
        commit(`${MERGE()} ${op.merge}`);
      }
    };

    let si = 0;
    const graphBox = h('div', { class: 'diagram' });
    const fileBox = h('pre', { class: 'console ltr' });
    const logBox = h('div');
    const stepBox = h('div');
    const fb = h('div');

    const paintRepo = () => {
      const branches = Object.keys(tips);
      const laneY = b => 34 + branches.indexOf(b) * 66;
      const W = Math.max(320, 60 + commits.length * 56);
      const xOf = i => 40 + i * 56;
      let s = `<svg viewBox="0 0 ${W} ${40 + branches.length * 66}" xmlns="http://www.w3.org/2000/svg" style="direction:ltr">`;
      branches.forEach(b => { s += `<text x="4" y="${laneY(b) - 16}" font-size="11" fill="#9fb0d9" font-family="Consolas,monospace">${b}</text>`; });
      commits.forEach((c, i) => {
        if (c.parent != null) {
          const p = commits[c.parent];
          s += `<line x1="${xOf(c.parent)}" y1="${laneY(p.branch)}" x2="${xOf(i)}" y2="${laneY(c.branch)}" stroke="#2a4180" stroke-width="4"/>`;
        }
        if (c.msg.startsWith(MERGE())) {
          const from = Object.keys(tips).find(b => b !== c.branch && c.msg.includes(b));
          if (from) s += `<line x1="${xOf(tips[from])}" y1="${laneY(from)}" x2="${xOf(i)}" y2="${laneY(c.branch)}" stroke="#b48cff" stroke-width="3" stroke-dasharray="5 4"/>`;
        }
      });
      commits.forEach((c, i) => {
        const isHead = viewing ? viewing === c : tips[head] === i;
        s += `<circle cx="${xOf(i)}" cy="${laneY(c.branch)}" r="13" fill="${isHead ? '#ffb547' : '#22d3a6'}" stroke="#0b1530" stroke-width="3"/>`;
        s += `<text x="${xOf(i)}" y="${laneY(c.branch) + 28}" font-size="10" text-anchor="middle" fill="#9fb0d9" font-family="Consolas,monospace">${c.id}</text>`;
      });
      s += '</svg>';
      mount(graphBox, svgEl(s), h('div', { class: 'muted', style: { fontSize: '13px', textAlign: 'center' } },
        h('span', { style: { color: '#ffb547' } }, '●'), L(' = איפה אתה עכשיו: ', ' = where you are now: '), h('bdi', { class: 'mono' }, `HEAD → ${viewing ? viewing.id : head}`)));
      fileBox.textContent = `# game.py ${dirty ? L('(שונה, לא נשמר)', '(modified, not saved)') : ''}${staged ? L(' [מוכן לשמירה]', ' [staged]') : ''}\n` + file.join('\n');
      mount(logBox, showLog ? h('pre', { class: 'console ltr' }, commits.slice().reverse().map(c => `${c.id}  ${c.msg}`).join('\n')) : null);
    };

    const stepUI = () => {
      if (si >= lv.steps.length) {
        sound('win');
        return mount(stepBox, h('div', { class: 'feedback good' }, h('b', {}, icon('flag', 16), ' '), rich(lv.explain),
          h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
      }
      const S = lv.steps[si];
      apply(S.before); paintRepo();
      total++;
      const opts = h('div', { class: 'options' }, S.options.map((o, idx) => h('button', { class: 'opt ltr mono', onclick: () => {
        if (idx === S.answer) {
          sound('good'); apply(S.op); paintRepo(); mount(fb, S.explain ? h('div', { class: 'feedback good' }, rich(S.explain)) : null);
          si++; stepUI();
        } else {
          mistakes++; sound('bad'); shake(opts.children[idx]);
          mount(fb, h('div', { class: 'feedback bad' }, rich(S.wrong?.[idx] || L('הפקודה הזו לא עושה את מה שצריך כאן. נסה אחרת.', "That command doesn't do what's needed here. Try another one."))));
        }
      } }, '$ ' + o)));
      mount(stepBox, h('div', { class: 'mission-box' }, h('b', {}, L(`צעד ${si + 1}/${lv.steps.length}: `, `Step ${si + 1}/${lv.steps.length}: `)), rich(S.say)), opts);
    };

    mount(root,
      h('div', { class: 'row', style: { marginBottom: '6px' } }, h('span', { class: 'chip' }, icon('history', 14), ' Git'), h('span', { class: 'spacer' }), h('span', { class: 'muted' }, L(`שלב ${li + 1}/${cfg.levels.length}`, `Level ${li + 1}/${cfg.levels.length}`))),
      h('div', { class: 'mission-box' }, rich(lv.intro)),
      graphBox, fileBox, logBox, stepBox, fb);
    stepUI();
  }

  level();
}
