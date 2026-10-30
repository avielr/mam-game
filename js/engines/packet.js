// Packet router: tap connected stations to move a packet to the right IP.
import { h, mount, rich, sound, shake } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs = {}, text) => {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (text != null) el.textContent = text;
  return el;
};

const HALO = { stroke: '#16264f', 'stroke-width': 5, 'paint-order': 'stroke', 'stroke-linejoin': 'round' };

export function run(root, cfg, done) {
  const byId = Object.fromEntries(cfg.nodes.map(n => [n.id, n]));
  const adj = {};
  cfg.edges.forEach(([a, b]) => { (adj[a] ||= []).push(b); (adj[b] ||= []).push(a); });
  const start = cfg.nodes[0].id;
  const height = Math.max(...cfg.nodes.map(n => n.y)) + 60;
  let li = 0, mistakes = 0;

  function level() {
    if (li >= cfg.levels.length) return done(Math.max(0, cfg.levels.length / (cfg.levels.length + mistakes * 0.4)));
    const lv = cfg.levels[li];
    let cur = start, prev = [], routing = !lv.secure, busy = false;
    const fb = h('div');
    const msg = (text, good) => mount(fb, h('div', { class: `feedback ${good ? 'good' : 'bad'}` }, rich(text)));

    const svg = s('svg', { viewBox: `0 0 320 ${height}` });
    cfg.edges.forEach(([a, b]) => {
      const A = byId[a], B = byId[b];
      svg.append(s('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: '#2a4180', 'stroke-width': 4, 'data-e': `${a}|${b}` }));
    });
    const nodeEls = {};
    cfg.nodes.forEach(n => {
      const g = s('g', { class: 'net-node', role: 'button', tabindex: 0, 'aria-label': `${n.label} ${n.ip}` });
      g.append(s('circle', { cx: n.x, cy: n.y, r: 24, fill: '#1d3163', stroke: '#2a4180', 'stroke-width': 3 }));
      g.append(s('text', { x: n.x, y: n.y + 9, 'text-anchor': 'middle', 'font-size': 24 }, n.emoji));
      g.append(s('text', { x: n.x, y: n.y + 40, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#eef3ff', 'font-family': 'Rubik, Arial', ...HALO }, n.label));
      g.append(s('text', { x: n.x, y: n.y + 54, 'text-anchor': 'middle', 'font-size': 11, fill: '#22d3a6', 'font-family': 'Consolas, monospace', direction: 'ltr', ...HALO }, n.ip));
      g.addEventListener('click', () => tap(n.id));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') tap(n.id); });
      nodeEls[n.id] = g;
      svg.append(g);
    });
    const pkt = s('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': 22, style: 'transition: transform .45s ease; pointer-events:none' }, '📦');
    svg.append(pkt);

    function paint() {
      const c = byId[cur];
      pkt.style.transform = `translate(${c.x + 20}px, ${c.y - 18}px)`;
      cfg.nodes.forEach(n => {
        const circle = nodeEls[n.id].querySelector('circle');
        const near = routing && adj[cur]?.includes(n.id);
        circle.setAttribute('stroke', n.id === cur ? '#ffb547' : near ? '#22d3a6' : '#2a4180');
        circle.setAttribute('r', n.id === cur ? 27 : 24);
      });
      svg.querySelectorAll('line').forEach(l => {
        const [a, b] = l.dataset.e.split('|');
        const on = routing && ((a === cur) || (b === cur));
        l.setAttribute('stroke', on ? '#22d3a6' : '#2a4180');
      });
    }

    function tap(id) {
      if (!routing || busy || id === cur) return;
      if (!adj[cur]?.includes(id)) {
        mistakes++; sound('bad'); shake(wrap);
        return msg(L(`אין חיבור ישיר בין **${byId[cur].label}** ל**${byId[id].label}**. תלך רק לתחנות שמחוברות בקו.`,
          `There's no direct link between **${byId[cur].label}** and **${byId[id].label}**. Only move to stations connected by a line.`));
      }
      prev.push(cur); cur = id; sound('click'); paint();
      const n = byId[id];
      if (lv.avoid && id === lv.avoid) {
        mistakes++; sound('bad');
        busy = true;
        setTimeout(() => { cur = start; prev = []; busy = false; paint(); }, 600);
        return msg(L('החבילה נכנסה לשרת ההאקרים! הם גנבו אותה. חוזרים להתחלה, ובוחרים דרך אחרת.',
          'The packet went into the hackers\' server! They stole it. Back to the start, pick another route.'));
      }
      if (id === lv.to) {
        routing = false; sound('good'); paint();
        return mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('החבילה הגיעה! ', 'Packet delivered! ')),
          rich(L(`המסלול: ${[...prev, cur].map(x => byId[x].label).join(' ← ')}`, `Route: ${[...prev, cur].map(x => byId[x].label).join(' → ')}`)),
          h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { li++; level(); } }, L('הבא ←', 'Next →')))));
      }
      if ((adj[id] || []).length === 1) {
        mistakes++; sound('bad');
        busy = true;
        setTimeout(() => { cur = prev.pop(); busy = false; paint(); }, 600);
        return msg(L(`זה **${n.label}** עם הכתובת \`${n.ip}\`. זה לא היעד. החבילה חוזרת אחורה.`,
          `That's **${n.label}** at address \`${n.ip}\`. Not the destination. The packet goes back.`));
      }
      mount(fb);
    }

    const wrap = h('div', { class: 'net-wrap' }, svg);
    const top = [h('div', { class: 'mission-box' }, h('b', {}, L(`משימה ${li + 1}/${cfg.levels.length}: `, `Mission ${li + 1}/${cfg.levels.length}: `)), rich(lv.text))];
    if (lv.dns) {
      top.push(h('div', { class: 'mission-box' }, h('b', {}, icon('book-open', 16), ' ', L('ספר DNS', 'DNS book')),
        h('table', {}, Object.entries(lv.dns).map(([k, v]) => h('tr', {}, h('td', { class: 'ltr mono' }, k), h('td', { class: 'ltr mono', style: { color: '#22d3a6' } }, v))))));
    }
    const secureBox = h('div');
    if (lv.secure) {
      mount(secureBox, h('div', { class: 'mission-box' }, h('b', {}, L('איך שולחים את החבילה?', 'How do we send the packet?')),
        h('div', { class: 'row', style: { marginTop: '8px' } },
          h('button', { class: 'btn secondary small', onclick: () => { mistakes++; sound('bad'); msg(L('ב-HTTP המידע עובר **גלוי**, וכל מי שבדרך יכול לקרוא אותו! נסה שוב.', 'With HTTP the data travels **in the open**, and anyone along the way can read it! Try again.')); } }, icon('mail', 16), ' HTTP'),
          h('button', { class: 'btn small', onclick: () => { routing = true; sound('good'); mount(secureBox, h('div', { class: 'feedback good' }, L('מעולה! החבילה מוצפנת. עכשיו נתב אותה.', 'Great! The packet is encrypted. Now route it.'))); paint(); mount(fb); } }, icon('lock', 16), ' HTTPS'))));
    }
    mount(root, ...top, secureBox, wrap, fb);
    paint();
  }

  level();
}
