# סוכן ממר״ם

A Hebrew (RTL) + English (LTR) learning game for the Mamram prep syllabus (grades 5–6), built as an installable web app (PWA) that also works offline. There is no build step: it is plain HTML, CSS and JS modules.

## Run locally
```bash
py -m http.server 5173 --bind 127.0.0.1
```
Open http://localhost:5173

To open it on the phone over home Wi‑Fi, bind to `0.0.0.0` and browse to `http://<pc-ip>:5173`. Installing it as an app needs HTTPS, so deploy it first (see below).

## Deploy (free)
Push the folder to a GitHub repo, then turn on Settings → Pages → Deploy from branch → `/ (root)`.
On Android Chrome: open the URL → ⋮ → "Add to Home screen".

**After changing files**, bump `VERSION` in `sw.js` and add any new files to `SHELL`.

## Content
Four bases (one per syllabus module), each with 6–8 missions plus a boss:
1. **בסיס הרשת** (`module1.js`): cyber, computers, networks/IP/DNS/HTTPS, IoT, encryption, passwords and privacy.
2. **בסיס ההאקרים** (`module2.js`): hacker hats and DoS, phishing, AI impostors/deepfakes, ransomware, firewall/antivirus/2FA, analyst tools (Event Viewer, Wireshark).
3. **בסיס התכנות** (`module3.js`, syllabus module 4): robot algorithms, loops, **real Python** (variables, input, if/while/for, functions), Git, AI APIs and vibe coding.
4. **בסיס הבינה** (`module4.js`, syllabus module 3): how LLMs work, prompt engineering, ML/computer vision and bias, the AI studio and copyright, chatbot design, AI agents and prompt injection, fact-checking, and a Base44 product spec.

The Base44 mission saves a ready-to-paste build prompt to the parent zone, as a real-world quest to do together.

## Languages
The language toggle (EN / עב) is in the top bar, the welcome screen and the profile page. UI strings are inline `L('עברית', 'English')` calls (`js/i18n.js`). Content lives in `js/content/moduleN.js` (Hebrew) and `js/content/en/moduleN.js` (English); both must keep identical ids and structure.

## Video briefings
Each mission's nuggets play as an animated, narrated "video" (`js/pages/video.js`): diagram parts animate in, captions follow the narration, and the first quiz question appears as a checkpoint midway. Narration uses the device's text-to-speech (`js/narrator.js`); without a matching voice it falls back to captions.

## Icons
Line icons from [Lucide](https://lucide.dev) (ISC), bundled in `js/icon-data.js`. Content still uses emoji; `icon()` / the diagram `E()` helper map known emoji to icons.

## Python
Real Python runs in the browser through [Pyodide](https://pyodide.org) 0.26.4, inside a Web Worker (`js/py-worker.js`). Runs are killed after 5 s, so infinite loops are safe.
The first load needs internet (~10 MB). After that the service worker caches it for offline use.
`ask_ai(question)` is a pretend AI API with canned answers, used by the "קוד פוגש AI" mission.

## Structure
- `js/content/` – all the Hebrew content, as data only. Bases are listed in `index.js`. Shared SVG diagram helpers are in `svg.js`.
- `js/engines/` – the mini-games. Each engine runs as `run(root, config, done(score0to1))`:
  `sorter` `fixit` `packet` `cipher` `password` `combo` `inbox` `order` `firewall` `twofa` `logs` `blocks` `python` `git` `promptlab` `predict` `trainer` `chatbot` `canvas`.
- `js/pages/` – the map, mission player, welcome screen, profile, and parent zone (`#/parent`, protected by a PIN).
- `js/state.js` – progress, kept in localStorage. Use export/import in the parent zone to move it to another device.

## Mission schema
```js
{ id, emoji, title, topic, xp, badge?, boss?,
  story: [str], nuggets: [{ kicker, title, text, diagram?, analogy? }],
  game: { engine, title, intro, config }, quiz: [{ q, options, answer, explain }], outro }
```
Text supports `**bold**`, `` `term` `` and `{name}` (the agent's name).
