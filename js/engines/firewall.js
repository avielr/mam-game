// Firewall gate (arcade): traffic arrives on a timer — allow or block each one.
import { h, mount, rich, sound, shake } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

export function run(root, cfg, done) {
  const items = cfg.items;
  let i = 0, correct = 0, combo = 0, best = 0, timer = null;
  const base = cfg.seconds || 8, min = cfg.minSeconds || 4;

  const rules = h('details', { class: 'mission-box', open: true },
    h('summary', {}, h('b', {}, icon('scroll-text', 16), ' ', L('חוקי חומת האש', 'Firewall rules'))),
    h('ul', { class: 'rules' }, cfg.rules.map(r => h('li', {}, rich(r)))));

  function show() {
    clearInterval(timer);
    if (i >= items.length) return finish();
    const it = items[i];
    const limit = Math.max(min, base - i * ((base - min) / Math.max(1, items.length - 1)));
    let left = limit;
    const bar = h('i', { style: { width: '100%' } });
    const fb = h('div');
    const pkt = h('div', { class: 'packet-card fade-in' },
      h('div', { class: 'row' }, h('span', { class: 'big-emoji', style: { fontSize: '38px' } }, it.emoji || '📦'),
        h('div', { style: { flex: 1 } },
          h('div', { class: 'ltr mono', style: { textAlign: 'end', color: '#22d3a6' } }, it.ip),
          h('b', {}, it.from))),
      h('div', { style: { marginTop: '8px' } }, rich(it.desc)));
    const btns = h('div', { class: 'bins' },
      h('button', { class: 'bin fw-allow', onclick: () => answer(false) }, icon('circle-check', 18), ' ', L('לאשר', 'Allow')),
      h('button', { class: 'bin fw-block', onclick: () => answer(true) }, icon('octagon-x', 18), ' ', L('לחסום', 'Block')));

    function answer(block, timeout) {
      clearInterval(timer);
      btns.querySelectorAll('button').forEach(b => (b.disabled = true));
      const ok = !timeout && block === it.block;
      if (ok) { correct++; combo++; best = Math.max(best, combo); sound('good'); }
      else { combo = 0; sound('bad'); shake(pkt); }
      const head = timeout ? L('לא הספקת! ', 'Too slow! ') : ok ? (combo >= 3 ? L(`קומבו x${combo}! `, `Combo x${combo}! `) : L('נכון! ', 'Correct! ')) : L('אופס! ', 'Oops! ');
      mount(fb, h('div', { class: `feedback ${ok ? 'good' : 'bad'}` }, h('b', {}, head), it.block ? L('צריך לחסום. ', 'It should be blocked. ') : L('צריך לאשר. ', 'It should be allowed. '), rich(it.why),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { i++; show(); } }, L('הבא ←', 'Next →')))));
    }

    mount(root, rules,
      h('div', { class: 'row', style: { margin: '8px 0' } }, h('span', { class: 'muted' }, L(`תעבורה ${i + 1}/${items.length}`, `Traffic ${i + 1}/${items.length}`)), h('span', { class: 'spacer' }),
        h('span', { class: 'chip' }, icon('shield', 14), ` ${correct}`), combo >= 2 ? h('span', { class: 'chip' }, icon('flame', 14), ` x${combo}`) : null),
      h('div', { class: 'meter' }, bar), pkt, btns, fb);
    timer = setInterval(() => {
      if (!root.isConnected) return clearInterval(timer);
      left -= 0.1;
      bar.style.width = Math.max(0, (left / limit) * 100) + '%';
      bar.style.background = left / limit < 0.3 ? 'var(--bad)' : 'var(--accent)';
      if (left <= 0) answer(null, true);
    }, 100);
  }

  function finish() {
    done(correct / items.length);
  }

  // Read the rules first; the clock starts only when ready.
  mount(root, rules, h('p', { class: 'muted' }, L(`יגיעו ${items.length} חבילות, ולכל אחת יש זמן מוגבל. השעון מתחיל כשתלחץ.`, `${items.length} packets are coming, each with a time limit. The clock starts when you tap.`)),
    h('button', { class: 'btn block', onclick: () => { rules.open = false; show(); } }, L('מוכן? פותחים את השער!', 'Ready? Open the gate!')));
}
