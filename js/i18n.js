// Language: Hebrew (RTL, default) or English (LTR). UI strings are written inline as L(he, en).
import { getState, update } from './state.js';

export const lang = () => (getState().lang === 'en' ? 'en' : 'he');
export const isEn = () => lang() === 'en';
export const L = (he, en) => (isEn() ? en : he);

export function applyLang() {
  const el = document.documentElement;
  el.lang = lang();
  el.dir = isEn() ? 'ltr' : 'rtl';
  document.title = L('סוכן ממר״ם', 'Mamram Agent');
}

export function setLang(l) {
  update(s => { s.lang = l; });
  applyLang();
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
