import { lang } from '../i18n.js';
import { BASE1 } from './module1.js';
import { BASE2 } from './module2.js';
import { BASE3 } from './module3.js';
import { BASE4 } from './module4.js';
import { BASE1 as EN1 } from './en/module1.js';
import { BASE2 as EN2 } from './en/module2.js';
import { BASE3 as EN3 } from './en/module3.js';
import { BASE4 as EN4 } from './en/module4.js';

const SETS = { he: [BASE1, BASE2, BASE3, BASE4], en: [EN1, EN2, EN3, EN4] };
const ALL = Object.fromEntries(Object.entries(SETS).map(([k, bases]) => [k, bases.flatMap(b => b.missions.map(m => ({ ...m, base: b.id })))]));

export const bases = () => SETS[lang()];
export const allMissions = () => ALL[lang()];
export const findMission = id => allMissions().find(m => m.id === id);
