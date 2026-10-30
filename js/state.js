// Progress state, persisted to localStorage (wrapped — storage can be unavailable).
const KEY = 'mamram.v1';

const fresh = () => ({
  version: 1,
  agentName: '',
  avatar: 'scan-face',
  lang: 'he',
  narration: true,
  xp: 0,
  sound: true,
  missions: {},        // id -> { stars, bestScore, attempts, timeSec, firstDoneAt, lastAt }
  quiz: {},            // missionId -> { correct, total }
  badges: [],          // badge ids
  streak: { count: 0, best: 0, last: '' },
  days: {},            // 'YYYY-MM-DD' -> seconds of play
  parentPin: '',
  createdAt: new Date().toISOString(),
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return fresh();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const getState = () => state;

export function update(fn) {
  fn(state);
  save();
}

export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function touchStreak() {
  const t = today();
  const s = state.streak;
  if (s.last === t) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  s.count = s.last === today(y) ? s.count + 1 : 1;
  s.best = Math.max(s.best, s.count);
  s.last = t;
}

export function startMission(id) {
  update(st => {
    const m = st.missions[id] ||= { stars: 0, bestScore: 0, attempts: 0, timeSec: 0 };
    m.attempts++;
  });
}

export function logTime(id, sec) {
  if (sec <= 0) return;
  update(st => {
    const m = st.missions[id];
    if (m) m.timeSec += sec;
    st.days[today()] = (st.days[today()] || 0) + sec;
  });
}

export function recordQuiz(id, correct, total) {
  update(st => {
    const q = st.quiz[id] ||= { correct: 0, total: 0 };
    q.correct += correct; q.total += total;
  });
}

/** Returns { xpGained, firstTime, newBadges, rankUp } */
export function completeMission(mission, score, ranks) {
  const stars = score >= 0.9 ? 3 : score >= 0.6 ? 2 : 1;
  const prev = state.missions[mission.id] || {};
  const firstTime = !prev.firstDoneAt;
  const improved = stars > (prev.stars || 0);
  // First clear: full XP. Replays: a little, more if improved.
  const xpGained = Math.round(firstTime ? mission.xp * (0.6 + 0.4 * score) : mission.xp * (improved ? 0.4 : 0.15));
  const rankBefore = rankFor(state.xp, ranks);
  const newBadges = [];
  update(st => {
    const m = st.missions[mission.id] ||= { stars: 0, bestScore: 0, attempts: 1, timeSec: 0 };
    m.stars = Math.max(m.stars, stars);
    m.bestScore = Math.max(m.bestScore, score);
    m.firstDoneAt ||= new Date().toISOString();
    m.lastAt = new Date().toISOString();
    st.xp += xpGained;
    touchStreak();
    if (mission.badge && !st.badges.includes(mission.badge)) { st.badges.push(mission.badge); newBadges.push(mission.badge); }
    if (stars === 3 && !st.badges.includes('perfect')) { st.badges.push('perfect'); newBadges.push('perfect'); }
    if (st.streak.count >= 3 && !st.badges.includes('streak3')) { st.badges.push('streak3'); newBadges.push('streak3'); }
    if (st.streak.count >= 7 && !st.badges.includes('streak7')) { st.badges.push('streak7'); newBadges.push('streak7'); }
  });
  const rankAfter = rankFor(state.xp, ranks);
  return { xpGained, stars, firstTime, newBadges, rankUp: rankAfter.index > rankBefore.index ? rankAfter : null };
}

export function rankFor(xp, ranks) {
  let index = 0;
  ranks.forEach((r, i) => { if (xp >= r.xp) index = i; });
  const cur = ranks[index], next = ranks[index + 1];
  const pct = next ? (xp - cur.xp) / (next.xp - cur.xp) : 1;
  return { ...cur, index, next, pct };
}

export const isDone = id => !!state.missions[id]?.firstDoneAt;

export function exportJSON() {
  return JSON.stringify(state, null, 2);
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (typeof data !== 'object' || data.version !== 1) throw new Error('bad file');
  state = { ...fresh(), ...data };
  save();
}

export function resetAll() {
  const pin = state.parentPin;
  state = fresh();
  state.parentPin = pin;
  save();
}

export async function hashPin(pin) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('mamram:' + pin));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'p:' + btoa(pin);
  }
}
