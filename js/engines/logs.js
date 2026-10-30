// Log detective: a mini Event Viewer / Wireshark table — tap the suspicious row(s).
import { h, mount, rich, sound, shake } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

export function run(root, cfg, done) {
  let li = 0, mistakes = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, cfg.levels.length / (cfg.levels.length + mistakes * 0.4)));
    const lv = cfg.levels[li];
    const answers = [].concat(lv.answer);
    const multi = answers.length > 1;
    const picked = new Set();
    let solved = false;
    const fb = h('div');
    const rows = lv.rows.map((r, ri) => {
      const tr = h('tr', { class: `log-row ${r.level ? 'lv-' + r.level : ''}`, tabindex: 0, onclick: () => tap(ri, tr), onkeydown: e => { if (e.key === 'Enter') tap(ri, tr); } },
        r.cells.map((c, ci) => h('td', { class: lv.ltrCols?.includes(ci) ? 'ltr mono' : '' }, c)));
      return tr;
    });

    function tap(ri, tr) {
      if (solved) return;
      if (multi) {
        picked.has(ri) ? picked.delete(ri) : picked.add(ri);
        tr.classList.toggle('picked');
        sound('click');
        return;
      }
      if (answers.includes(ri)) win(); else miss(tr);
    }
    function miss(el) {
      mistakes++; sound('bad'); shake(el);
      mount(fb, h('div', { class: 'feedback bad' }, L('לא השורה הזאת. ', 'Not that row. '), lv.hint ? rich(lv.hint) : L('תסתכל שוב על העמודות.', 'Look at the columns again.')));
    }
    function win() {
      solved = true; sound('good');
      answers.forEach(a => rows[a].classList.add('found'));
      mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('תפסת! ', 'Got it! ')), rich(lv.explain),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
    }
    const checkBtn = multi ? h('button', { class: 'btn', style: { marginTop: '10px' }, onclick: () => {
      const ok = picked.size === answers.length && answers.every(a => picked.has(a));
      if (ok) win(); else miss(checkBtn);
    } }, L(`בדוק (${answers.length} שורות)`, `Check (${answers.length} rows)`)) : null;

    mount(root,
      h('div', { class: 'tool-bar' }, h('span', {}, icon(lv.tool === 'wireshark' ? 'radar' : 'scroll-text', 16), lv.tool === 'wireshark' ? ' Wireshark' : ' Event Viewer'), h('span', { class: 'spacer' }), h('span', { class: 'muted' }, L(`תיק ${li + 1}/${cfg.levels.length}`, `Case ${li + 1}/${cfg.levels.length}`))),
      h('div', { class: 'mission-box' }, h('b', {}, icon('search', 16), ' '), rich(lv.q)),
      h('div', { class: 'table-wrap log-wrap' }, h('table', { class: 'log-table' },
        h('thead', {}, h('tr', {}, lv.columns.map(c => h('th', {}, c)))), h('tbody', {}, rows))),
      checkBtn, fb);
  }

  level();
}
