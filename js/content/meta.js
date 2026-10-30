// Ranks, badges, avatars. Names are [Hebrew, English]; read them with tr().
import { L } from '../i18n.js';

export const tr = pair => L(pair[0], pair[1]);

export const RANKS = [
  { xp: 0, name: ['טוראי', 'Private'] },
  { xp: 150, name: ['רב״ט', 'Corporal'] },
  { xp: 350, name: ['סמל', 'Sergeant'] },
  { xp: 600, name: ['סמ״ר', 'Staff Sergeant'] },
  { xp: 900, name: ['רס״ל', 'Sergeant First Class'] },
  { xp: 1300, name: ['סג״ם', 'Second Lieutenant'] },
  { xp: 1800, name: ['סגן', 'Lieutenant'] },
  { xp: 2400, name: ['סרן', 'Captain'] },
  { xp: 3000, name: ['רס״ן', 'Major'] },
  { xp: 3600, name: ['סא״ל', 'Lieutenant Colonel'] },
  { xp: 4200, name: ['אל״ם', 'Colonel'] },
  { xp: 4800, name: ['תא״ל', 'Brigadier General'] },
  { xp: 5400, name: ['אלוף', 'Major General'] },
];

export const BADGES = {
  recruit: { icon: 'shield-half', name: ['מגויס חדש', 'New Recruit'], desc: ['סיימת את המשימה הראשונה', 'Finished your first mission'] },
  hardware: { icon: 'cpu', name: ['מכיר את המכונה', 'Machine Insider'], desc: ['למדת מה יש בתוך המחשב', 'Learned what is inside a computer'] },
  router: { icon: 'router', name: ['דוור הרשת', 'Packet Courier'], desc: ['העברת חבילות לכתובת הנכונה', 'Delivered packets to the right address'] },
  iot: { icon: 'house', name: ['שומר הבית החכם', 'Smart Home Guard'], desc: ['אבטחת מכשירים חכמים', 'Secured smart devices'] },
  cipher: { icon: 'lock-keyhole', name: ['פורץ צפנים', 'Code Breaker'], desc: ['פענחת הודעה מוצפנת', 'Decrypted a secret message'] },
  privacy: { icon: 'shield-check', name: ['מגן הפרטיות', 'Privacy Defender'], desc: ['בנית סיסמה חזקה ושמרת על מידע אישי', 'Built a strong password and protected personal info'] },
  base1: { icon: 'castle', name: ['בוגר בסיס הרשת', 'Network Base Graduate'], desc: ['ניצחת את משימת הבוס של בסיס 1', 'Beat the Base 1 boss'] },
  hats: { icon: 'glasses', name: ['כובע לבן', 'White Hat'], desc: ['הכרת את סוגי ההאקרים', 'Learned the types of hackers'] },
  phish: { icon: 'fish', name: ['צייד פיתיונות', 'Phish Hunter'], desc: ['זיהית הודעות פישינג', 'Spotted phishing messages'] },
  deepfake: { icon: 'venetian-mask', name: ['חושף מתחזים', 'Impostor Hunter'], desc: ['זיהית זיופי AI', 'Spotted AI fakes'] },
  ransom: { icon: 'save', name: ['מנהל אירוע', 'Incident Commander'], desc: ['הבסת מתקפת כופר', 'Defeated a ransomware attack'] },
  firewall: { icon: 'brick-wall', name: ['שומר השער', 'Gatekeeper'], desc: ['הפעלת חומת אש ו-2FA', 'Ran a firewall and 2FA'] },
  analyst: { icon: 'scan-eye', name: ['אנליסט', 'Analyst'], desc: ['מצאת פורץ ביומנים', 'Found an intruder in the logs'] },
  base2: { icon: 'swords', name: ['מביס הצל', 'Shadow Slayer'], desc: ['ניצחת את הבוס של בסיס 2', 'Beat the Base 2 boss'] },
  algo: { icon: 'puzzle', name: ['חושב כמו מחשב', 'Thinks Like a Computer'], desc: ['כתבת אלגוריתם ראשון', 'Wrote your first algorithm'] },
  loops: { icon: 'repeat', name: ['אדון הלולאות', 'Loop Master'], desc: ['קיצרת קוד עם לולאות', 'Shortened code with loops'] },
  python: { icon: 'code-xml', name: ['לוחש הנחשים', 'Python Whisperer'], desc: ['כתבת קוד Python ראשון', 'Wrote your first Python code'] },
  logic: { icon: 'scale', name: ['מקבל החלטות', 'Decision Maker'], desc: ['כתבת תנאים ולולאות ב-Python', 'Wrote conditions and loops in Python'] },
  functions: { icon: 'wrench', name: ['בונה מכונות', 'Machine Builder'], desc: ['כתבת פונקציות', 'Wrote functions'] },
  git: { icon: 'history', name: ['נוסע בזמן', 'Time Traveler'], desc: ['השתמשת ב-Git', 'Used Git'] },
  vibe: { icon: 'bot', name: ['מתכנת עם AI', 'AI Pair Coder'], desc: ['חיברת קוד ל-AI', 'Connected code to AI'] },
  base3: { icon: 'trophy', name: ['אלוף ההאקתון', 'Hackathon Champion'], desc: ['ניצחת את הבוס של בסיס 3', 'Beat the Base 3 boss'] },
  brain: { icon: 'brain', name: ['מבין AI', 'AI Insider'], desc: ['למדת איך מודלי שפה עובדים', 'Learned how language models work'] },
  prompter: { icon: 'pen-tool', name: ['לוחש פרומפטים', 'Prompt Whisperer'], desc: ['כתבת פרומפטים מנצחים', 'Wrote winning prompts'] },
  trainer: { icon: 'eye', name: ['מאמן מכונות', 'Model Trainer'], desc: ['אימנת מודל ותיקנת הטיה', 'Trained a model and fixed bias'] },
  studio: { icon: 'palette', name: ['אמן AI', 'AI Artist'], desc: ['יצרת תוכן עם AI בצורה הוגנת', 'Created with AI the fair way'] },
  chatbot: { icon: 'message-square', name: ['מעצב בוטים', 'Bot Designer'], desc: ['תכננת צ׳אטבוט בטוח', 'Designed a safe chatbot'] },
  agent: { icon: 'joystick', name: ['מפקח סוכנים', 'Agent Supervisor'], desc: ['הנחית סוכן AI', 'Directed an AI agent'] },
  factcheck: { icon: 'search', name: ['בודק עובדות', 'Fact Checker'], desc: ['תפסת הזיות והטיות', 'Caught hallucinations and bias'] },
  founder: { icon: 'factory', name: ['יזם צעיר', 'Young Founder'], desc: ['אפיינת אפליקציה ל-Base44', 'Specced an app for Base44'] },
  base4: { icon: 'graduation-cap', name: ['בוגר המסע', 'Graduate'], desc: ['סיימת את כל ארבעת הבסיסים!', 'Finished all four bases!'] },
  perfect: { icon: 'badge-check', name: ['שלמות', 'Flawless'], desc: ['סיימת משימה עם 3 כוכבים', 'Finished a mission with 3 stars'] },
  streak3: { icon: 'flame', name: ['3 ימים ברצף', '3-Day Streak'], desc: ['התאמנת 3 ימים ברצף', 'Trained 3 days in a row'] },
  streak7: { icon: 'zap', name: ['שבוע ברצף', '7-Day Streak'], desc: ['התאמנת 7 ימים ברצף', 'Trained 7 days in a row'] },
};

export const AVATARS = ['scan-face', 'bot', 'ghost', 'skull', 'radar', 'fingerprint', 'cpu', 'orbit', 'satellite-dish', 'crosshair', 'zap', 'swords'];
