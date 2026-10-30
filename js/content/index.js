import { BASE1 } from './module1.js';
import { BASE2 } from './module2.js';
import { BASE3 } from './module3.js';
import { BASE4 } from './module4.js';

export const BASES = [BASE1, BASE2, BASE3, BASE4];

export const ALL_MISSIONS = BASES.flatMap(b => b.missions.map(m => ({ ...m, base: b.id })));
export const findMission = id => ALL_MISSIONS.find(m => m.id === id);
