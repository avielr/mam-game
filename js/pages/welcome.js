import { h, mount, commanderSays, sound } from '../ui.js';
import { getState, update } from '../state.js';
import { AVATARS } from '../content/meta.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';
import { langToggle } from './common.js';

export function render(app) {
  let avatar = AVATARS.includes(getState().avatar) ? getState().avatar : AVATARS[0];
  const name = h('input', { class: 'text-input', maxlength: 16, placeholder: L('למשל: הנץ, ShadowFox', 'e.g. Falcon, ShadowFox'), value: getState().agentName });
  const btn = h('button', { class: 'btn block', style: { marginTop: '16px' } }, L('אני מוכן', 'I’m ready'), icon('arrow-right', 18, 'flip-rtl'));
  const grid = h('div', { class: 'avatars' });
  const paintAvatars = () => mount(grid, AVATARS.map(a => h('button', { class: a === avatar ? 'sel' : '', 'aria-label': a, onclick: () => { avatar = a; sound('click'); paintAvatars(); } }, icon(a, 30))));
  paintAvatars();
  const go = () => {
    const n = name.value.trim();
    if (!n) { name.focus(); return; }
    update(s => { s.agentName = n; s.avatar = avatar; });
    location.hash = '#/';
  };
  btn.onclick = go;
  name.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });

  mount(app,
    h('div', { class: 'row end', style: { paddingTop: '12px' } }, langToggle()),
    h('div', { class: 'center', style: { padding: '8px 0' } },
      h('img', { src: 'icons/icon.svg', width: 76, height: 76, alt: '' }),
      h('h1', { style: { marginTop: '10px' } }, L('סוכן ממר״ם', 'Mamram Agent')),
      h('p', { class: 'muted' }, L('מסע משימות בסייבר, תכנות ובינה מלאכותית', 'A mission campaign in cyber, coding and AI'))),
    commanderSays(L('שלום, מגויס! אני **תא״ל ביט**, מפקד יחידת הסייבר. לפני שנתחיל, כל סוכן צריך **שם קוד** ו**סמל**.',
      'Welcome, recruit! I’m **Brigadier General Bit**, commander of the Cyber Unit. Before we start, every agent needs a **code name** and an **emblem**.')),
    h('div', { class: 'card' },
      h('h3', {}, L('שם הקוד שלך', 'Your code name')), name,
      h('h3', { style: { marginTop: '16px' } }, L('בחר סמל', 'Pick an emblem')), grid,
      btn));
  setTimeout(() => name.focus(), 50);
}
