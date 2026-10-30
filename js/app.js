import { getState } from './state.js';
import { render as mapPage } from './pages/map.js';
import { render as missionPage } from './pages/mission.js';
import { render as welcomePage } from './pages/welcome.js';
import { render as profilePage } from './pages/profile.js';
import { render as parentPage } from './pages/parent.js';

const app = document.getElementById('app');

function route() {
  const [, page, arg] = (location.hash || '#/').slice(1).split('/');
  if (!getState().agentName && page !== 'welcome' && page !== 'parent') { location.hash = '#/welcome'; return; }
  window.scrollTo(0, 0);
  if (page === 'mission' && arg) return missionPage(app, arg);
  if (page === 'welcome') return welcomePage(app);
  if (page === 'profile') return profilePage(app);
  if (page === 'parent') return parentPage(app);
  mapPage(app);
}

window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
