import { h, mount, commanderSays, sound } from '../ui.js';
import { getState, update } from '../state.js';
import { AVATARS } from '../content/meta.js';

export function render(app) {
  let avatar = getState().avatar;
  const name = h('input', { class: 'text-input', maxlength: 16, placeholder: 'למשל: הנץ, ShadowFox', value: getState().agentName });
  const btn = h('button', { class: 'btn block', style: { marginTop: '16px' } }, 'אני מוכן! 🚀');
  const grid = h('div', { class: 'avatars' });
  const paintAvatars = () => mount(grid, AVATARS.map(a => h('button', { class: a === avatar ? 'sel' : '', 'aria-label': a, onclick: () => { avatar = a; sound('click'); paintAvatars(); } }, a)));
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
    h('div', { class: 'center', style: { padding: '24px 0 8px' } },
      h('img', { src: 'icons/icon.svg', width: 84, height: 84, alt: '' }),
      h('h1', { style: { marginTop: '10px' } }, 'סוכן ממר״ם'),
      h('p', { class: 'muted' }, 'מסע משימות בסייבר, תכנות ובינה מלאכותית')),
    commanderSays('שלום, מגויס! אני **תא״ל ביט**, מפקד יחידת הסייבר. לפני שנתחיל, כל סוכן צריך **שם קוד** ו**סמל**.'),
    h('div', { class: 'card' },
      h('h3', {}, 'שם הקוד שלך'), name,
      h('h3', { style: { marginTop: '16px' } }, 'בחר סמל'), grid,
      btn));
  setTimeout(() => name.focus(), 50);
}
