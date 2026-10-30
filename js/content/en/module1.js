// Base 1 — Cyber & Networks (English)
// Placeholders: {name} = agent name.

import { T, E, box, arrow, svg } from '../svg.js';

const D = {
  connected: svg(`
    ${E(160, 90, '☁️', 54)}${T(160, 118, 'Internet', '#9fb0d9', 12)}
    ${E(40, 45, '📱')}${E(280, 45, '💻')}${E(40, 140, '🎮')}${E(280, 140, '📷')}
    ${arrow(60, 45, 125, 75)}${arrow(260, 45, 195, 75)}${arrow(60, 128, 125, 98)}${arrow(260, 128, 195, 98)}`),
  attackDefend: svg(`
    ${box(10, 30, 130, 100, '#3b1825', '#ff6b81')}${E(75, 75, '🦹', 34)}${T(75, 105, 'Attacker', '#ff9aaa', 15)}${T(75, 122, 'Tries to break in', '#ffc2cc', 11, 400)}
    ${box(180, 30, 130, 100, '#12402f', '#4ade80')}${E(245, 75, '🛡️', 34)}${T(245, 105, 'Defender', '#86efac', 15)}${T(245, 122, 'Guards & fixes', '#bbf7d0', 11, 400)}
    ${T(160, 86, 'VS', '#ffb547', 20, 800)}`),
  computer: svg(`
    ${box(10, 14, 145, 62)}${E(40, 54, '🧠', 26)}${T(105, 42, 'CPU', '#eef3ff', 13)}${T(105, 60, 'Does the math', '#9fb0d9', 11, 400)}
    ${box(165, 14, 145, 62)}${E(195, 54, '🗒️', 26)}${T(260, 42, 'RAM', '#eef3ff', 13)}${T(260, 60, 'Temporary desk', '#9fb0d9', 11, 400)}
    ${box(10, 86, 145, 62)}${E(40, 126, '🗄️', 26)}${T(105, 114, 'Storage', '#eef3ff', 13)}${T(105, 132, 'Permanent files', '#9fb0d9', 11, 400)}
    ${box(165, 86, 145, 62, '#14385a', '#60a5fa')}${E(195, 126, '🎼', 26)}${T(260, 114, 'The OS', '#eef3ff', 13)}${T(260, 132, 'Runs the show', '#9fb0d9', 11, 400)}`),
  ip: svg(`
    ${E(50, 70, '💻', 38)}${T(50, 100, '192.168.1.5', '#22d3a6', 12)}${T(50, 118, 'Your computer', '#9fb0d9', 11, 400)}
    ${E(160, 70, '📡', 38)}${T(160, 100, 'Router', '#eef3ff', 13)}${T(160, 118, 'Home mail carrier', '#9fb0d9', 11, 400)}
    ${E(270, 70, '🖥️', 38)}${T(270, 100, '34.120.8.9', '#22d3a6', 12)}${T(270, 118, 'Game server', '#9fb0d9', 11, 400)}
    ${arrow(78, 60, 132, 60)}${arrow(188, 60, 242, 60)}
    ${E(105, 45, '📦', 18)}${E(215, 45, '📦', 18)}`),
  https: svg(`
    ${box(10, 20, 140, 120, '#3b1825', '#ff6b81')}${T(80, 44, 'HTTP', '#ff9aaa', 16, 800)}${E(80, 84, '✉️', 32)}${T(80, 112, 'Open postcard', '#ffc2cc', 12, 400)}${T(80, 128, 'Anyone can read it', '#ffc2cc', 11, 400)}
    ${box(170, 20, 140, 120, '#12402f', '#4ade80')}${T(240, 44, 'HTTPS', '#86efac', 16, 800)}${E(240, 84, '🔒', 32)}${T(240, 112, 'Locked envelope', '#bbf7d0', 12, 400)}${T(240, 128, 'Only server opens', '#bbf7d0', 11, 400)}`),
  iot: svg(`
    ${box(90, 10, 140, 140, '#14385a', '#60a5fa')}${E(160, 40, '🏠', 26)}
    ${E(120, 80, '📷', 24)}${E(160, 80, '🔊', 24)}${E(200, 80, '💡', 24)}
    ${E(120, 125, '🧸', 24)}${E(160, 125, '🚪', 24)}${E(200, 125, '❄️', 24)}
    ${E(40, 60, '🦹', 32)}${arrow(60, 66, 100, 78, '#ff6b81')}${T(40, 100, 'Hunting', '#ff9aaa', 12)}${T(40, 116, 'open doors', '#ff9aaa', 12)}
    ${E(280, 60, '🛡️', 32)}${T(280, 100, 'Password', '#86efac', 12)}${T(280, 116, '+ updates', '#86efac', 12)}`),
  caesar: svg(`
    ${['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((l, i) => box(14 + i * 42, 22, 36, 36) + T(32 + i * 42, 46, l, '#eef3ff', 16)).join('')}
    ${['D', 'E', 'F', 'G', 'H', 'I', 'J'].map((l, i) => box(14 + i * 42, 100, 36, 36, '#12402f', '#22d3a6') + T(32 + i * 42, 124, l, '#22d3a6', 16)).join('')}
    ${[0, 1, 2, 3, 4, 5, 6].map(i => arrow(32 + i * 42, 62, 32 + i * 42, 94)).join('')}
    ${T(160, 156, 'Each letter moves 3 places forward', '#ffb547', 12)}`, '0 0 320 165'),
  password: svg(`
    ${box(10, 20, 300, 34, '#3b1825', '#ff6b81')}${T(70, 43, '1234', '#ff9aaa', 15)}${T(230, 43, 'Cracked in 1 sec ⚡', '#ffc2cc', 12, 400)}
    ${box(10, 64, 300, 34, '#3b2a10', '#ffb547')}${T(70, 87, 'yoav2015', '#ffd28a', 15)}${T(230, 87, 'A few minutes ⏱️', '#ffe2b0', 12, 400)}
    ${box(10, 108, 300, 34, '#12402f', '#4ade80')}${T(80, 131, 'Pizza!Dragon7Moon', '#86efac', 13)}${T(230, 131, 'Thousands of years 🏔️', '#bbf7d0', 12, 400)}`),
};

export const BASE1 = {
  id: 1,
  title: 'Network Base',
  subtitle: 'Cyber & Networks',
  emblem: '🌐',
  color: '#1f6feb',
  missions: [
    // ───────────────────────── 1
    {
      id: 'm1-1', emoji: '🪖', title: 'Welcome to the Unit', topic: 'Intro to cyber', xp: 100, badge: 'recruit',
      story: [
        'Hey **{name}**! I\'m Brigadier General Bit, commander of the Cyber Unit. I hear you\'re sharp and fast. That\'s exactly what we need.',
        'Every day someone tries to break into computers, steal passwords and crash websites. Our job: **defend**.',
        'Before you get your gear, a quick briefing. Ready? Let\'s move!',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'What is cyber, anyway?', text: '**Cyber** is the whole digital world: computers, phones, consoles, cameras, and the internet that connects them all.\nWhen everything is connected, you can message a friend in a second. But someone bad can also try to get in.', diagram: D.connected, analogy: 'A huge city with tons of roads: every house connects to every other house. Super handy, but you need police and guards.' },
        { kicker: 'Concept 2', title: 'Attackers and defenders', text: 'The cyber world has two sides:\n**Attackers** try to break in, steal or destroy.\n**Defenders** guard, spot break-ins and patch holes.', diagram: D.attackDefend, analogy: 'Like soccer: the other team\'s striker tries to score, and the goalie and defenders stop him. We\'re the goalie!' },
        { kicker: 'Concept 3', title: 'What does a cyber expert do?', text: 'Cyber experts work like detectives:\n🔎 **Investigator**: figures out how the attackers got in.\n📊 **Analyst**: looks at data and spots anything suspicious.\n🧱 **Defense developer**: builds walls and tools.\nThe IDF has whole units that do this, and **Mamram** is the IDF\'s computing and technology unit.' },
      ],
      game: {
        engine: 'sorter', title: 'Attacker or Defender?', intro: 'For each action, decide: who did it? An attacker or a defender?',
        config: {
          bins: [{ id: 'atk', label: 'Attacker', emoji: '🦹' }, { id: 'def', label: 'Defender', emoji: '🛡️' }],
          items: [
            { emoji: '🔑', text: 'Tries to guess someone else\'s password', bin: 'atk', why: 'Guessing someone else\'s password is a break-in attempt.' },
            { emoji: '⬆️', text: 'Updates the computer to the latest version', bin: 'def', why: 'Updates close the holes attackers look for.' },
            { emoji: '🎣', text: 'Sends a fake message to steal a password', bin: 'atk', why: 'That\'s "phishing": fishing for passwords.' },
            { emoji: '🕵️', text: 'Checks who tried to log in to the system in the middle of the night', bin: 'def', why: 'That\'s how an analyst catches a break-in.' },
            { emoji: '🦠', text: 'Spreads a virus to other people\'s computers', bin: 'atk', why: 'A virus is harmful software.' },
            { emoji: '💾', text: 'Backs up important files to a separate drive', bin: 'def', why: 'A backup saves your files if something goes wrong.' },
            { emoji: '🌊', text: 'Floods a website with tons of requests to crash it', bin: 'atk', why: 'That\'s a flood attack: the site crashes under the load.' },
            { emoji: '🧱', text: 'Installs a firewall that blocks suspicious connections', bin: 'def', why: 'A firewall is a guard at the gate.' },
          ],
        },
      },
      quiz: [
        { q: 'What is a cyber defender\'s job?', options: ['Breaking into other people\'s computers', 'Guarding systems and patching holes', 'Deleting the internet'], answer: 1, explain: 'Defenders guard, spot break-ins and fix them.' },
        { q: 'What is Mamram?', options: ['A computer game', 'The IDF\'s computing and technology unit', 'A type of virus'], answer: 1, explain: 'Mamram is the unit that builds and defends the IDF\'s systems.' },
        { q: 'Why is it important to update software?', options: ['To get new colors', 'Updates close security holes', 'No reason'], answer: 1, explain: 'Lots of updates fix weaknesses that attackers exploit.' },
      ],
      outro: 'Excellent, {name}! Now you know who\'s who. Next mission, we crack open a computer and see what\'s inside.',
    },

    // ───────────────────────── 2
    {
      id: 'm1-2', emoji: '🧠', title: 'Inside the Computer', topic: 'Computer parts & operating systems', xp: 110, badge: 'hardware',
      story: [
        'Agent {name}, before you can defend a computer, you need to understand **how it\'s built**.',
        'I put a computer on your desk. Let\'s open it up and meet the crew inside.',
      ],
      nuggets: [
        { kicker: 'Part 1', title: 'The processor (CPU): the brain', text: 'The `CPU` does billions of calculations every second. Every click, every game, every video: it does the work.', analogy: 'A brain that thinks super fast, but only about what\'s right in front of it.' },
        { kicker: 'Part 2', title: 'Memory (RAM) and storage', text: '`RAM` holds what you\'re working on **right now**, and it\'s wiped when you shut down.\n**Storage** (disk / `SSD`) keeps files **forever**: photos, games, homework.', diagram: D.computer, analogy: 'RAM is the desk in your room: today\'s work sits on it. Storage is the closet: that\'s where everything is kept.' },
        { kicker: 'Part 3', title: 'The operating system', text: 'An operating system like `Windows`, `Android` or `iOS` is the manager: it decides which program gets memory, shows windows, and makes sure one program doesn\'t mess with another.\n**Defense** starts here too: users, permissions and updates.', analogy: 'An orchestra conductor: every instrument plays, but he decides who plays and when.' },
      ],
      game: {
        engine: 'sorter', title: 'Who Does What?', intro: 'Each sentence describes a part. Send it to the right place!',
        config: {
          bins: [
            { id: 'cpu', label: 'CPU', emoji: '🧠' }, { id: 'ram', label: 'RAM', emoji: '🗒️' },
            { id: 'disk', label: 'Storage', emoji: '🗄️' }, { id: 'os', label: 'Operating system', emoji: '🎼' },
          ],
          items: [
            { emoji: '➗', text: 'Does 2,000,000,000 calculations per second', bin: 'cpu', why: 'Calculations = CPU.' },
            { emoji: '📸', text: 'Keeps your trip photos even after you shut down', bin: 'disk', why: 'Permanent saving = storage.' },
            { emoji: '🎮', text: 'Holds the level you\'re playing right now', bin: 'ram', why: 'Whatever is open right now lives in RAM.' },
            { emoji: '🔐', text: 'Asks for a password when you log in to the computer', bin: 'os', why: 'The operating system manages users.' },
            { emoji: '🧹', text: 'Gets wiped when you turn off the computer', bin: 'ram', why: 'RAM is temporary memory.' },
            { emoji: '🪟', text: 'Opens windows and decides which program runs', bin: 'os', why: 'That\'s the manager\'s job: the operating system.' },
            { emoji: '💽', text: 'A 1000GB SSD drive', bin: 'disk', why: 'An SSD is a type of storage.' },
            { emoji: '🔥', text: 'Heats up when you play a heavy game', bin: 'cpu', why: 'The CPU works hard and gets hot.' },
          ],
        },
      },
      quiz: [
        { q: 'You turned off the computer without saving. What\'s gone?', options: ['Whatever was in RAM', 'All the files on the disk', 'The operating system'], answer: 0, explain: 'RAM is wiped at shutdown. Whatever was saved to storage stays.' },
        { q: 'Which of these is an operating system?', options: ['Minecraft', 'Android', 'YouTube'], answer: 1, explain: 'Android runs the phone. The others are apps that run on it.' },
        { q: 'Why is the CPU called "the brain"?', options: ['Because it\'s pink', 'Because it does the calculations', 'Because it stores files'], answer: 1, explain: 'The CPU thinks and calculates. Storage keeps things.' },
      ],
      outro: 'Nice work! Now you know the crew inside the computer. But a computer on its own is boring... let\'s connect it to a network!',
    },

    // ───────────────────────── 3
    {
      id: 'm1-3', emoji: '📦', title: 'The Packet\'s Journey', topic: 'Networks, IP & HTTPS', xp: 130, badge: 'router',
      story: [
        'Agent {name}, we have a problem: data packets are getting lost on the network!',
        'I need someone who knows how to **route**: send every packet down the right path to the right address. Briefing first.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'Networks and IP addresses', text: 'A **network** is a bunch of devices that are connected and talking.\nEvery device has an **IP address**, like `192.168.1.5`. Without an address, nobody knows where to send anything.', diagram: D.ip, analogy: 'A home address: street, number and city. The mail carrier needs it to deliver a letter.' },
        { kicker: 'Concept 2', title: 'Packets and routers', text: 'When you send a photo, it gets split into lots of small **packets**. Each packet hops between **routers** until it reaches its destination, where it\'s put back together.', analogy: 'A puzzle sent by mail: every piece in its own envelope, and you assemble it at home.' },
        { kicker: 'Concept 3', title: 'DNS: the phone book', text: 'Numbers are hard to remember, so we use names like `games.co.il`. The **DNS** service translates a name into an IP address.', analogy: 'The contacts on your phone: you tap "Grandma", and the phone knows the number.' },
        { kicker: 'Concept 4', title: 'HTTP vs. HTTPS', text: 'Websites talk in a language called `HTTP`. When there\'s an **S** at the end (`HTTPS`), the data is **encrypted** and you see a 🔒 in the browser.\nSend passwords **only** over HTTPS!', diagram: D.https, analogy: 'A postcard (HTTP): any mail carrier can read it. A letter in a locked envelope (HTTPS): only the recipient can open it.' },
      ],
      game: {
        engine: 'packet', title: 'Packet Router', intro: 'Tap the stations in order to move the packet 📦 from your computer to the destination. You can only move to a connected station!',
        config: {
          nodes: [
            { id: 'pc', label: 'Your computer', ip: '192.168.1.5', emoji: '💻', x: 270, y: 60 },
            { id: 'home', label: 'Home router', ip: '192.168.1.1', emoji: '📡', x: 270, y: 170 },
            { id: 'isp', label: 'Internet provider', ip: '80.179.0.1', emoji: '🏢', x: 160, y: 170 },
            { id: 'r1', label: 'North router', ip: '62.0.0.1', emoji: '🔀', x: 160, y: 60 },
            { id: 'r2', label: 'South router', ip: '62.0.0.2', emoji: '🔀', x: 160, y: 280 },
            { id: 'game', label: 'Game server', ip: '34.120.8.9', emoji: '🎮', x: 45, y: 60 },
            { id: 'video', label: 'Video server', ip: '142.250.1.1', emoji: '🎬', x: 45, y: 200 },
            { id: 'bank', label: 'School server', ip: '18.66.2.40', emoji: '🏫', x: 45, y: 300 },
          ],
          edges: [['pc', 'home'], ['home', 'isp'], ['isp', 'r1'], ['isp', 'r2'], ['r1', 'game'], ['r1', 'video'], ['r2', 'video'], ['r2', 'bank']],
          levels: [
            { text: 'Send a request to the server at `34.120.8.9`.', to: 'game' },
            { text: 'You want to watch a video on `video.com`. Look up the address in the DNS book, then send it there.', dns: { 'video.com': '142.250.1.1', 'games.co.il': '34.120.8.9', 'school.org.il': '18.66.2.40' }, to: 'video' },
            { text: 'You\'re logging in to `school.org.il` with a **password**. First choose how to send it, then find the address and route it.', dns: { 'video.com': '142.250.1.1', 'games.co.il': '34.120.8.9', 'school.org.il': '18.66.2.40' }, secure: true, to: 'bank' },
          ],
        },
      },
      quiz: [
        { q: 'What do you need an IP address for?', options: ['To know where to send data', 'To make the computer faster', 'It\'s the name of a game'], answer: 0, explain: 'An IP is the device\'s address on the network.' },
        { q: 'What does DNS do?', options: ['Deletes viruses', 'Translates a website name into an IP address', 'Charges the battery'], answer: 1, explain: 'DNS is the internet\'s phone book.' },
        { q: 'On which site is it safer to type a password?', options: ['http://game-login.com', 'https://game-login.com', 'No difference'], answer: 1, explain: 'HTTPS encrypts the data. You see a 🔒 in the address bar.' },
        { q: 'You sent a photo to a friend. What happens to it on the way?', options: ['It travels whole, all at once', 'It splits into small packets that arrive separately', 'It gets saved in the CPU'], answer: 1, explain: 'Data travels the network in packets and is reassembled at the destination.' },
      ],
      outro: 'Wow, {name}! Every packet made it. You\'re the best network mail carrier in the unit.',
    },

    // ───────────────────────── 4
    {
      id: 'm1-4', emoji: '🏠', title: 'The Smart Home', topic: 'Smart devices & IoT', xp: 120, badge: 'iot',
      story: [
        'Urgent call! The Cohen family bought a smart home, and everything\'s connected to the internet: camera, speaker, light bulbs, even a doll.',
        'But nobody secured the devices. An attacker is already prowling their network. **{name}, get out in the field!**',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'What is IoT?', text: '`IoT` = the **Internet of Things**. Everyday devices that connect to the network: cameras, smart speakers, watches, air conditioners, even fridges.', diagram: D.iot },
        { kicker: 'Concept 2', title: 'Why are they in danger?', text: 'Lots of devices come with a **default password** like `admin` or `1234`, and nobody changes it. Some never get **updates**. And an attacker who gets into one device can jump from it to others on the network.', analogy: 'A house with an armored door, but one window wide open. The burglar comes in through the window.' },
        { kicker: 'Concept 3', title: 'The 4 golden rules', text: '1️⃣ Change the default password.\n2️⃣ Turn on automatic updates.\n3️⃣ Give the device only the permissions it really needs.\n4️⃣ Connect it only to a password-protected home network.' },
      ],
      game: {
        engine: 'fixit', title: 'Operation Smart Home', intro: 'Every device in the house is exposed. Pick the right fix for each one!',
        config: {
          items: [
            { emoji: '📷', name: 'Security camera', problem: 'The password is still the factory `admin`.', options: ['Change it to a long, strong password', 'Cover the camera with a sock', 'Write the password on the camera'], answer: 0, explain: 'Every hacker knows factory passwords. Always change them.' },
            { emoji: '🔊', name: 'Smart speaker', problem: 'Hasn\'t been updated in two years, and has a known security hole.', options: ['Turn down the volume', 'Turn on automatic updates', 'Unplug it forever'], answer: 1, explain: 'Updates close known holes.' },
            { emoji: '💡', name: 'Smart bulb', problem: 'The bulb\'s app wants access to your contacts and location.', options: ['Allow everything, what could happen?', 'Deny it: a light bulb doesn\'t need contacts', 'Delete the phone'], answer: 1, explain: 'Only give a device the permissions it really needs.' },
            { emoji: '🧸', name: 'Talking doll', problem: 'The doll is on the neighbors\' open Wi-Fi, no password.', options: ['Connect it to the protected home network', 'Leave it, the signal is great there', 'Yell at the neighbors'], answer: 0, explain: 'On an open network, anyone can see what\'s passing through.' },
            { emoji: '🚪', name: 'Video doorbell', problem: 'The videos are shared with the whole world on a public site.', options: ['Change privacy settings to "Only me"', 'Record only at night', 'No problem, it\'s funny'], answer: 0, explain: 'Privacy! Only the people who live there should see it.' },
          ],
        },
      },
      quiz: [
        { q: 'What is IoT?', options: ['Everyday devices connected to the internet', 'A type of processor', 'An online game'], answer: 0, explain: 'IoT = the Internet of Things.' },
        { q: 'You bought a new smart camera. What do you do first?', options: ['Change the default password', 'Take a selfie', 'Wait for something to happen'], answer: 0, explain: 'Factory password = open door.' },
        { q: 'Why is one hacked IoT device dangerous for the whole house?', options: ['Because it uses lots of electricity', 'Because the attacker can jump from it to other devices on the network', 'It\'s not dangerous'], answer: 1, explain: 'One weak device lets the attacker into the whole network.' },
      ],
      outro: 'The Cohen family sends a huge thank-you! Their home is safe because of you, {name}.',
    },

    // ───────────────────────── 5
    {
      id: 'm1-5', emoji: '🔐', title: 'The Secret Code', topic: 'Encryption & hiding data', xp: 140, badge: 'cipher',
      story: [
        'We intercepted a message from a hacker gang! But it\'s pure gibberish...',
        '**{name}**, they encrypted it. You need to learn how encryption works and crack the message.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'Why encrypt?', text: '**Encryption** turns a normal message into gibberish, so only someone with the **key** can read it.\nThanks to encryption, nobody can read your WhatsApp messages or the password you send.', analogy: 'A diary with a lock: anyone can see the diary, but only the person with the key can read it.' },
        { kicker: 'Concept 2', title: 'The Caesar cipher', text: '2,000 years ago, Julius Caesar encrypted his letters like this: every letter moves a few places forward in the alphabet.\nWith a shift of 3: A→D, B→E, C→F.\n**The key** is the number of places you shift.', diagram: D.caesar },
        { kicker: 'Concept 3', title: 'Encryption today', text: 'Today computers use much stronger encryption, with very long keys. Even a supercomputer would need millions of years to guess them. That\'s how the 🔒 in `HTTPS` works.' },
        { kicker: 'Concept 4', title: 'Hiding data', text: 'There\'s another trick: instead of encrypting, you **hide**. You tuck a message inside an innocent picture or text, so nobody even knows there\'s a secret. That\'s called **steganography**.', analogy: 'Invisible ink made of lemon juice: the page looks blank until you heat it up.' },
      ],
      game: {
        engine: 'cipher', title: 'Code Breaker', intro: 'Turn the shift wheel until the message makes sense!',
        config: {
          levels: [
            { type: 'decode', plain: 'ATTACK AT MIDNIGHT', shift: 3, showShift: true, hint: 'Intel says the shift is 3. Turn back 3 places.' },
            { type: 'decode', plain: 'THE PASSWORD IS DRAGON', shift: 5, showShift: false, hint: 'This time nobody knows the key. Try different shifts until you see real words.' },
            { type: 'encode', plain: 'HELLO', shift: 2, hint: 'Your turn: encrypt the word "HELLO" with a shift of 2. Every letter moves 2 forward.' },
            { type: 'acrostic', lines: ['**K**itty napped in the sun,', '**E**veryone ate cake,', '**Y**oav read a book in the garden.'], answer: 'KEY', hint: 'The hackers hid a word inside an innocent poem! Look at the first letter of each line.' },
          ],
        },
      },
      quiz: [
        { q: 'What is the goal of encryption?', options: ['To make the file smaller', 'So only someone with the key can read it', 'To make the message colorful'], answer: 1, explain: 'Encryption keeps things secret.' },
        { q: 'In a Caesar cipher with a shift of 1, how do you write "AB"?', options: ['BC', 'AA', 'ZY'], answer: 0, explain: 'A→B, B→C.' },
        { q: 'What\'s the difference between encryption and hiding (steganography)?', options: ['No difference', 'Encryption shows gibberish; hiding means nobody knows there\'s a secret at all', 'Hiding only works in pictures'], answer: 1, explain: 'Hiding conceals the fact that a message even exists.' },
      ],
      outro: 'You cracked the message! Now we know what the hackers are planning. Great job, code breaker.',
    },

    // ───────────────────────── 6
    {
      id: 'm1-6', emoji: '🛡️', title: 'Careful Agent Online', topic: 'Privacy & passwords', xp: 140, badge: 'privacy',
      story: [
        'Agent {name}, the most important thing in cyber isn\'t a supercomputer. It\'s **you**.',
        'Most break-ins happen because someone picked a weak password or shared too much. Today you learn to be a **careful agent**.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'A strong password', text: 'A hacker\'s computer can guess **billions** of passwords per second.\nA strong password is **long** (12+ characters), mixes letters, numbers and symbols, and doesn\'t include your name or birthday.', diagram: D.password },
        { kicker: 'Concept 2', title: 'The silly-words trick', text: 'The easiest password to remember is a few funny words stuck together: `Pizza!Dragon7Moon`.\nAnd an important rule: **a different password for every site**. If one site gets hacked, the rest stay safe.', analogy: 'You don\'t use the same key for your house, your bike and your mailbox.' },
        { kicker: 'Concept 3', title: 'Personal info', text: 'Some things you don\'t share online with people you don\'t know: your **address**, **school**, **phone number**, **passwords** and **photos that show where you live**.\nSomething feels off? **Tell a parent.** That\'s always the right move.' },
      ],
      game: {
        engine: 'combo', title: 'Careful Agent Training', intro: 'Two stages: build a strong password, then decide what\'s safe to share.',
        config: {
          parts: [
            {
              engine: 'password', title: 'Password Forge',
              config: {
                levels: [
                  { type: 'pick', q: 'Which password is the strongest?', options: ['123456', 'yoav2015', 'Taco!Rocket9Cloud'], answer: 2, explain: 'Long, mixed, and no personal info.' },
                  { type: 'pick', q: 'An agent named Dani was born in 2015. Which password is the worst for him?', options: ['Dani2015', 'Blue#Hippo44Jump', 'Moon7!Banana!Star'], answer: 0, explain: 'Name + birth year = the first thing a hacker will try.' },
                  { type: 'build', rules: ['len12', 'upper', 'lower', 'digit', 'symbol', 'noname'], hint: 'Build a password that passes every rule. Tip: join 3 funny words with a number and a symbol.' },
                ],
              },
            },
            {
              engine: 'sorter', title: 'Share or Keep?',
              config: {
                bins: [{ id: 'ok', label: 'OK to share', emoji: '👍' }, { id: 'no', label: 'Keep it private', emoji: '🤐' }],
                items: [
                  { emoji: '🍕', text: 'My favorite food', bin: 'ok', why: 'General info that doesn\'t reveal where you are.' },
                  { emoji: '🏠', text: 'My home address', bin: 'no', why: 'Address = where you are. Don\'t share it.' },
                  { emoji: '🔑', text: 'My game password, with my best friend', bin: 'no', why: 'You don\'t share passwords, not even with a friend.' },
                  { emoji: '🎨', text: 'A drawing I made (no personal details)', bin: 'ok', why: 'Your own creation with no identifying info: fine.' },
                  { emoji: '🏫', text: 'My school and class name', bin: 'no', why: 'That reveals where someone can find you.' },
                  { emoji: '📞', text: 'My phone number, to someone I met in a game', bin: 'no', why: 'People online aren\'t always who they say they are.' },
                  { emoji: '⚽', text: 'Which team I root for', bin: 'ok', why: 'General, safe info.' },
                ],
              },
            },
          ],
        },
      },
      quiz: [
        { q: 'What matters most in a password?', options: ['Short and easy', 'Long and mixed', 'It includes your name'], answer: 1, explain: 'Length + mixing = way harder to guess.' },
        { q: 'Why do you need a different password for every site?', options: ['To make it complicated', 'If one site gets hacked, the others are still safe', 'No reason'], answer: 1, explain: 'One password for everything = one key for every door.' },
        { q: 'Someone in a game asks for your address so they can send you a gift. What do you do?', options: ['Send it, gifts are fun!', 'Don\'t give it, and tell a parent', 'Give just the street name'], answer: 1, explain: 'Never hand out personal details, and always tell a parent.' },
      ],
      outro: 'Now you\'re a truly careful agent, {name}. Just one mission left: **the boss mission**.',
    },

    // ───────────────────────── BOSS
    {
      id: 'm1-boss', boss: true, emoji: '👾', title: 'Boss: Operation Secure Network', topic: 'Final mission: Base 1', xp: 250, badge: 'base1',
      story: [
        '🚨 **Alert!** The hacker gang "Digital Shadow" is attacking the school network!',
        'They left an encrypted message, broke into devices, and important packets are stuck on the network.',
        '{name}, use everything you\'ve learned. **Only you can stop them.**',
      ],
      nuggets: [
        { kicker: 'Quick recap', title: 'The agent\'s toolkit', text: '🔀 **IP and DNS**: where to send.\n🔒 **HTTPS**: encryption on the way.\n🔐 **Cipher**: a key unlocks a message.\n🏠 **IoT**: change factory passwords and update.\n🛡️ **Privacy**: strong passwords, and don\'t share personal details.' },
      ],
      game: {
        engine: 'combo', title: 'Operation Secure Network', intro: '4 stages. No giving up!',
        config: {
          parts: [
            { engine: 'cipher', title: 'Stage 1: Decode the threat', config: { levels: [{ type: 'decode', plain: 'WE ATTACK THE SERVER TOMORROW', shift: 4, showShift: false, hint: 'The hackers used a secret key. Find it!' }] } },
            {
              engine: 'fixit', title: 'Stage 2: Close the gaps',
              config: {
                items: [
                  { emoji: '🖨️', name: 'School printer', problem: 'Connected to the internet with the password `1234`.', options: ['Change it to a strong password', 'Print less', 'Turn off the lights'], answer: 0, explain: 'Weak password = open door.' },
                  { emoji: '💻', name: 'Teacher\'s computer', problem: 'A message pops up: "Important security update available". The teacher has clicked "Later" for a month.', options: ['Keep putting it off', 'Install the update now', 'Delete the operating system'], answer: 1, explain: 'A security update closes a hole the hackers are exploiting.' },
                  { emoji: '📋', name: 'Grades site login page', problem: 'The address starts with `http://`, no lock.', options: ['Switch to HTTPS', 'Add colors', 'Type faster'], answer: 0, explain: 'Without HTTPS, passwords travel in plain sight.' },
                ],
              },
            },
            {
              engine: 'packet', title: 'Stage 3: Rescue the packet',
              config: {
                nodes: [
                  { id: 'pc', label: 'Agent\'s PC', ip: '10.0.0.7', emoji: '💻', x: 270, y: 60 },
                  { id: 'fw', label: 'Firewall', ip: '10.0.0.1', emoji: '🧱', x: 270, y: 190 },
                  { id: 'isp', label: 'Internet provider', ip: '80.179.0.1', emoji: '🏢', x: 160, y: 120 },
                  { id: 'r1', label: 'Router A', ip: '62.0.0.1', emoji: '🔀', x: 160, y: 250 },
                  { id: 'evil', label: 'Hacker server', ip: '6.6.6.6', emoji: '🦹', x: 45, y: 60 },
                  { id: 'school', label: 'School server', ip: '18.66.2.40', emoji: '🏫', x: 45, y: 300 },
                ],
                edges: [['pc', 'fw'], ['fw', 'isp'], ['fw', 'r1'], ['isp', 'evil'], ['isp', 'r1'], ['r1', 'school']],
                levels: [{ text: 'Return the grades file to the `school.org.il` server over an encrypted connection, without passing through the hacker server!', dns: { 'school.org.il': '18.66.2.40', 'free-prizes.biz': '6.6.6.6' }, secure: true, to: 'school', avoid: 'evil' }],
              },
            },
            {
              engine: 'password', title: 'Stage 4: Lock down the system',
              config: { levels: [{ type: 'build', rules: ['len12', 'upper', 'lower', 'digit', 'symbol', 'noname'], hint: 'A new admin password for the network. It has to be unbreakable!' }] },
            },
          ],
        },
      },
      quiz: [
        { q: 'The hackers left a link: http://free-prizes.biz. What do you do?', options: ['Click it, maybe there\'s a prize', 'Don\'t click, and report it', 'Send it to the whole class'], answer: 1, explain: 'A suspicious link from hackers? Don\'t click!' },
        { q: 'What closes a known security hole in software?', options: ['An update', 'A new wallpaper', 'Turning off the screen'], answer: 0, explain: 'Updates fix weaknesses.' },
        { q: 'What protects a password sent to a website?', options: ['HTTPS', 'A big font', 'A short IP'], answer: 0, explain: 'HTTPS encrypts the route.' },
        { q: 'What is the key in a Caesar cipher?', options: ['The color of the letters', 'The number of shifts', 'The length of the message'], answer: 1, explain: 'Whoever knows the shift can decode it.' },
        { q: 'Which device is part of IoT?', options: ['A smart camera', 'A paper book', 'A pencil'], answer: 0, explain: 'It\'s a device connected to the internet.' },
      ],
      outro: '🏆 **Victory!** "Digital Shadow" has been stopped, and the school network is secure. {name}, you\'ve completed the Network Base! The next base, **Hacker Base**, opens soon.',
    },
  ],
};
