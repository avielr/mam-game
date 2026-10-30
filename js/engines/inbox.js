// Phishing inbox: decide real vs fake, then hunt for the red flag inside the message.
import { h, mount, rich, sound, shake } from '../ui.js';
import { L } from '../i18n.js';
import { icon } from '../icons.js';

const CHANNEL = {
  email: { icon: 'mail', name: () => L('אימייל', 'Email') },
  sms: { icon: 'smartphone', name: () => 'SMS' },
  chat: { icon: 'message-square', name: () => L('צ׳אט', 'Chat') },
  voice: { icon: 'mic', name: () => L('הודעה קולית', 'Voice message') },
  video: { icon: 'video', name: () => L('שיחת וידאו', 'Video call') },
  ai: { icon: 'bot', name: () => L('תשובת AI', 'AI answer') },
  image: { icon: 'image', name: () => L('תמונה ברשת', 'Online image') },
};

export function run(root, cfg, done) {
  const msgs = cfg.messages;
  let i = 0, points = 0;

  function show() {
    if (i >= msgs.length) return done(points / msgs.length);
    const m = msgs[i];
    const ch = CHANNEL[m.channel] || CHANNEL.email;
    const fb = h('div');
    const partEls = [];
    const part = p => {
      const el = h('span', { class: `msg-part ${p.link ? 'msg-link' : ''}` }, rich(p.t));
      partEls.push({ el, p });
      return el;
    };
    const card = h('div', { class: `msg msg-${m.channel}` },
      h('div', { class: 'msg-top' }, h('span', {}, icon(ch.icon, 14), ` ${ch.name()}`), h('span', { class: 'spacer' }), h('span', { class: 'muted' }, m.time || '')),
      h('div', { class: 'msg-head' }, (m.head || []).map(p => h('div', {}, part(p)))),
      h('div', { class: 'msg-body' }, (m.body || []).map(p => h('p', {}, part(p)))));
    const choose = h('div', { class: 'bins' },
      h('button', { class: 'bin', onclick: () => decide(false) }, cfg.labels?.[0] || L('אמיתי', 'Real')),
      h('button', { class: 'bin', onclick: () => decide(true) }, cfg.labels?.[1] || L('מזויף', 'Fake')));

    const next = () => h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => { i++; show(); } }, L('הבא ←', 'Next →')));
    const revealClues = () => partEls.forEach(({ el, p }) => { if (p.clue) { el.classList.add('clue-on'); el.title = p.clue; } });
    const clueList = () => h('ul', { class: 'clue-list' }, partEls.filter(x => x.p.clue).map(x => h('li', {}, icon('flag', 14), ' ', rich(x.p.clue))));

    function decide(sayPhish) {
      choose.querySelectorAll('button').forEach(b => (b.disabled = true));
      const ok = sayPhish === m.phish;
      if (!ok) {
        sound('bad'); shake(card);
        if (m.phish) revealClues();
        return mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, m.phish ? (cfg.missText || L('נפלת בפח! זו הודעה מזויפת. ', 'You fell for it! This message is fake. ')) : (cfg.legitText || L('זו דווקא הודעה אמיתית. ', 'Actually, this message is real. '))), rich(m.explain), m.phish ? clueList() : null, next()));
      }
      sound('good');
      if (!m.phish) { points += 1; return mount(fb, h('div', { class: 'feedback good' }, h('b', {}, cfg.okText || L('נכון, היא אמיתית! ', "Right, it's real! ")), rich(m.explain), next())); }
      // Hunt phase
      let misses = 0;
      card.classList.add('hunting');
      mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('זיהית! ', 'You spotted it! ')), rich(cfg.huntText || L('עכשיו לחץ על **סימן חשוד אחד** בתוך ההודעה.', 'Now tap **one suspicious sign** inside the message.'))));
      partEls.forEach(({ el, p }) => {
        el.onclick = () => {
          if (!card.classList.contains('hunting')) return;
          if (p.clue) {
            card.classList.remove('hunting'); sound('good');
            points += misses === 0 ? 1 : 0.8;
            revealClues();
            mount(fb, h('div', { class: 'feedback good' }, h('b', {}, L('מצאת! ', 'Found it! ')), rich(p.clue), h('div', { class: 'muted', style: { marginTop: '6px' } }, L('כל הסימנים בהודעה:', 'All the signs in the message:')), clueList(), next()));
          } else {
            misses++; sound('bad'); shake(el);
            if (misses >= 3) {
              card.classList.remove('hunting'); points += 0.6; revealClues();
              mount(fb, h('div', { class: 'feedback bad' }, L('הנה הסימנים שהיו שם:', 'Here are the signs that were there:'), clueList(), next()));
            } else mount(fb, h('div', { class: 'feedback bad' }, L('החלק הזה נראה תקין. חפש משהו אחר!', 'This part looks fine. Look for something else!')));
          }
        };
      });
    }

    mount(root,
      h('div', { class: 'row', style: { marginBottom: '10px' } }, h('span', { class: 'muted' }, L(`הודעה ${i + 1} מתוך ${msgs.length}`, `Message ${i + 1} of ${msgs.length}`))),
      card, choose, fb);
  }

  show();
}
