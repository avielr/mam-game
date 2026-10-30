import { run as sorter } from './sorter.js';
import { run as fixit } from './fixit.js';
import { run as packet } from './packet.js';
import { run as cipher } from './cipher.js';
import { run as password } from './password.js';
import { run as combo } from './combo.js';
import { run as inbox } from './inbox.js';
import { run as order } from './order.js';
import { run as firewall } from './firewall.js';
import { run as twofa } from './twofa.js';
import { run as logs } from './logs.js';
import { run as blocks } from './blocks.js';
import { run as python } from './python.js';
import { run as git } from './git.js';
import { run as promptlab } from './promptlab.js';
import { run as predict } from './predict.js';
import { run as trainer } from './trainer.js';
import { run as chatbot } from './chatbot.js';
import { run as canvas } from './canvas.js';

export const ENGINES = { sorter, fixit, packet, cipher, password, combo, inbox, order, firewall, twofa, logs, blocks, python, git,
  promptlab, predict, trainer, chatbot, canvas };
