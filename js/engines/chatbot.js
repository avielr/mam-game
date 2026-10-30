// Chatbot designer: choose goal, topic, personality and rules — then test it with tricky users.
import { h, mount, rich, sound, shake } from '../ui.js';
import { update } from '../state.js';

export function run(root, cfg, done) {
  const choice = { topic: null, persona: null, rules: new Set() };
  let fixes = 0;
  const fb = h('div');

  const topicOf = () => cfg.topics[choice.topic];
  const personaOf = () => cfg.personas[choice.persona];
  const fill = t => String(t).replaceAll('{bot}', topicOf()?.bot || 'הבוט').replaceAll('{topic}', topicOf()?.name || '');

  function designer() {
    mount(fb);
    const ready = choice.topic != null && choice.persona != null;
    mount(root,
      h('div', { class: 'mission-box' }, rich(cfg.intro)),
      h('h3', {}, '1️⃣ על מה הבוט מדבר?'),
      h('div', { class: 'chips' }, cfg.topics.map((t, i) => h('button', { class: `pchip ${choice.topic === i ? 'sel' : ''}`, onclick: () => { choice.topic = i; sound('click'); designer(); } }, `${t.emoji} ${t.name}`))),
      h('h3', { style: { marginTop: '12px' } }, '2️⃣ איזו אישיות?'),
      h('div', { class: 'chips' }, cfg.personas.map((p, i) => h('button', { class: `pchip ${choice.persona === i ? 'sel' : ''}`, onclick: () => { choice.persona = i; sound('click'); designer(); } }, `${p.emoji} ${p.name}`))),
      h('h3', { style: { marginTop: '12px' } }, '3️⃣ כללי השיחה (אפשר לבחור כמה)'),
      h('div', { class: 'options' }, cfg.rules.map(r => h('button', { class: `opt ${choice.rules.has(r.key) ? 'correct' : ''}`, onclick: () => { choice.rules.has(r.key) ? choice.rules.delete(r.key) : choice.rules.add(r.key); sound('click'); designer(); } },
        choice.rules.has(r.key) ? '☑️ ' : '⬜ ', rich(r.t)))),
      ready ? h('div', { class: 'prompt-preview', style: { marginTop: '12px' } },
        h('div', { class: 'muted', style: { fontSize: '13px' } }, '🧠 ההוראות שהבוט יקבל (System Prompt):'),
        h('div', {}, fill(`אתה ${topicOf().bot}, עוזר חכם שמומחה ל{topic}. ${personaOf().prompt} `),
          [...choice.rules].map(k => cfg.rules.find(r => r.key === k).prompt).join(' '))) : null,
      h('button', { class: 'btn block', style: { marginTop: '12px' }, disabled: !ready, onclick: test }, '💬 בדוק את הבוט'),
      fb);
  }

  async function test() {
    const chat = h('div', { class: 'chat' });
    mount(root, h('div', { class: 'mission-box' }, h('b', {}, `${topicOf().emoji} ${topicOf().bot}`), ' · ', personaOf().name), chat, fb);
    const problems = [];
    for (const m of cfg.tests) {
      chat.append(h('div', { class: 'bubble-user' }, fill(m.user)));
      await new Promise(r => setTimeout(r, 500));
      let reply, bad = false;
      if (m.type === 'topic') reply = personaOf().replies.topic.replace('{fact}', topicOf().fact);
      else if (m.type === 'off') reply = choice.rules.has('focus') ? personaOf().replies.focus : m.bad;
      else if (m.need) { bad = !choice.rules.has(m.need); reply = bad ? m.bad : m.good; }
      if (m.type === 'off' && !choice.rules.has('focus')) bad = true;
      if (m.avoid && choice.rules.has(m.avoid)) { bad = true; reply = m.badIfAvoid; }
      chat.append(h('div', { class: `bubble-bot ${bad ? 'bad' : ''}` }, rich(fill(reply))));
      if (bad) problems.push(m.avoid && choice.rules.has(m.avoid) ? m.lessonAvoid : m.lesson);
      sound(bad ? 'bad' : 'click');
      chat.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      await new Promise(r => setTimeout(r, 700));
    }
    if (problems.length) {
      fixes++;
      mount(fb, h('div', { class: 'feedback bad' }, h('b', {}, '🐞 הבוט צריך תיקון:'), h('ul', { class: 'clue-list' }, problems.map(p => h('li', {}, rich(p)))),
        h('button', { class: 'btn small', style: { marginTop: '8px' }, onclick: designer }, '🔧 חזור לשנות כללים')));
    } else {
      sound('win');
      update(s => { s.chatbot = { topic: topicOf().name, bot: topicOf().bot, persona: personaOf().name, rules: [...choice.rules] }; });
      mount(fb, h('div', { class: 'feedback good' }, h('b', {}, '🎉 הבוט שלך מוכן! '), rich(cfg.success),
        h('div', { class: 'row end', style: { marginTop: '10px' } }, h('button', { class: 'btn small', onclick: () => done(Math.max(0.6, 1 - fixes * 0.2)) }, 'סיום ←'))));
    }
  }

  designer();
}
