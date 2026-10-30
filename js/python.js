// Main-thread client for the Pyodide worker, with a kill switch for infinite loops.
let worker = null, ready = null, seq = 0;
const pending = new Map();

function spawn() {
  worker = new Worker('js/py-worker.js');
  worker.onmessage = ({ data }) => { pending.get(data.id)?.(data); pending.delete(data.id); };
  worker.onerror = () => { for (const r of pending.values()) r({ ok: false, out: '', err: 'load-failed' }); pending.clear(); worker = null; ready = null; };
  ready = send('pass', [], 120000);
  return ready;
}

function send(code, stdin, ms) {
  const id = ++seq;
  return new Promise(resolve => {
    const t = setTimeout(() => {
      pending.delete(id);
      worker?.terminate(); worker = null; ready = null;
      resolve({ ok: false, out: '', err: 'timeout' });
    }, ms);
    pending.set(id, res => { clearTimeout(t); resolve(res); });
    worker.postMessage({ id, code, stdin });
  });
}

/** Resolves once Python is loaded. { ok } */
export function warmUp() {
  return ready || spawn();
}

export const isReady = () => !!worker && !!ready;

/** Run code with preset stdin lines. Resolves { ok, out, err, line } ; err 'timeout' if it ran too long. */
export async function runPython(code, stdin = [], ms = 5000) {
  const w = await warmUp();
  if (!w.ok) return w;
  return send(code, stdin, ms);
}
