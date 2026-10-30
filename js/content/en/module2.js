// Base 2 — Hackers, attacks & defense
import { T, E, box, arrow, svg } from '../svg.js';

const D = {
  hats: svg(`
    ${box(8, 20, 96, 120, '#12402f', '#4ade80')}${E(56, 64, '🎩', 32)}${T(56, 92, 'White Hat', '#86efac', 13)}${T(56, 110, 'Hacks with', '#bbf7d0', 11, 400)}${T(56, 125, 'permission', '#bbf7d0', 11, 400)}
    ${box(112, 20, 96, 120, '#3b2a10', '#ffb547')}${E(160, 64, '🎩', 32)}${T(160, 92, 'Grey Hat', '#ffd28a', 13)}${T(160, 110, 'No permission,', '#ffe2b0', 11, 400)}${T(160, 125, 'no harm meant', '#ffe2b0', 11, 400)}
    ${box(216, 20, 96, 120, '#3b1825', '#ff6b81')}${E(264, 64, '🎩', 32)}${T(264, 92, 'Black Hat', '#ff9aaa', 13)}${T(264, 110, 'Hacks to', '#ffc2cc', 11, 400)}${T(264, 125, 'steal & harm', '#ffc2cc', 11, 400)}`),
  dos: svg(`
    ${E(270, 90, '🏪', 46)}${T(270, 128, 'Website', '#eef3ff', 13)}
    ${[30, 55, 80, 105, 130].map((y, i) => E(40 + (i % 2) * 30, y, '🤖', 20) + arrow(70 + (i % 2) * 30, y - 6, 240, 84, '#ff6b81')).join('')}
    ${T(160, 152, 'Tons of requests at once = site crashes', '#ffb547', 12)}`),
  phish: svg(`
    ${box(14, 14, 292, 132, '#f4f7ff', '#ff6b81')}
    ${T(160, 40, 'From: support@rob1ox-free.com', '#c0294a', 12)}
    ${T(160, 66, '⚠️ Account deleted in 1 hour!!!', '#14204a', 13)}
    ${T(160, 92, 'Click here and enter your password', '#1d5fd6', 13)}
    ${T(70, 128, '🚩 Pressure', '#c0294a', 12)}${T(160, 128, '🚩 Odd sender', '#c0294a', 12)}${T(255, 128, '🚩 Password?', '#c0294a', 12)}`),
  ransom: svg(`
    ${E(60, 70, '💻', 46)}${E(60, 72, '🔒', 20)}${T(60, 112, 'Files locked', '#ff9aaa', 12)}
    ${arrow(100, 60, 140, 60, '#ff6b81')}
    ${box(150, 22, 160, 76, '#3b1825', '#ff6b81')}${T(230, 48, 'Pay up to get', '#ffc2cc', 12)}${T(230, 66, 'your files back! 💰', '#ffc2cc', 12)}${T(230, 86, '(don\'t pay)', '#ffb547', 11, 400)}
    ${box(150, 108, 160, 40, '#12402f', '#4ade80')}${T(230, 133, '💾 Backup = rescue', '#86efac', 13)}`),
  firewall: svg(`
    ${E(40, 50, '📦', 22)}${E(40, 85, '🦹', 22)}${E(40, 120, '📦', 22)}
    ${arrow(60, 45, 140, 60)}${arrow(60, 80, 140, 80, '#ff6b81')}${arrow(60, 115, 140, 100)}
    ${box(146, 20, 30, 120, '#3b2a10', '#ffb547')}${E(161, 88, '🧱', 22)}
    ${arrow(180, 60, 250, 70)}${arrow(180, 100, 250, 90)}
    ${E(280, 88, '🏠', 40)}${T(160, 156, 'The firewall checks every packet', '#ffb547', 12)}`),
  twofa: svg(`
    ${box(14, 30, 130, 100)}${E(79, 72, '🔑', 32)}${T(79, 104, 'Something you know', '#eef3ff', 12)}${T(79, 120, '(password)', '#9fb0d9', 11, 400)}
    ${T(160, 86, '+', '#ffb547', 28, 800)}
    ${box(176, 30, 130, 100, '#12402f', '#4ade80')}${E(241, 72, '📱', 32)}${T(241, 104, 'Something you have', '#86efac', 12)}${T(241, 120, '(code on phone)', '#bbf7d0', 11, 400)}`),
  analyst: svg(`
    ${box(10, 14, 300, 132, '#0a1430', '#2a4180')}
    ${['08:01 Logon ✅ dana', '08:03 Logon ✅ yossi', '03:12 Failed ❌ admin', '03:12 Failed ❌ admin', '03:13 Success ⚠️ admin'].map((t, i) =>
      T(160, 38 + i * 24, t, i >= 2 ? (i === 4 ? '#ffb547' : '#ff9aaa') : '#9fb0d9', 12, i === 4 ? 800 : 400)).join('')}`),
};

export const BASE2 = {
  id: 2,
  title: 'Hacker Base',
  subtitle: 'Hackers, attacks & defense',
  emblem: '🕵️',
  color: '#d9466b',
  missions: [
    // ───────────────────────── 1
    {
      id: 'm2-1', emoji: '🎩', title: 'Hacker Hats', topic: 'Types of hackers and attacks', xp: 140, badge: 'hats',
      story: [
        'Welcome to Hacker Base, **{name}**. Here you learn to think like a hacker, so you can stop them.',
        'First thing: not every hacker is a "bad guy". Some hackers are exactly **like us**. Let\'s meet the hats.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'Three hats', text: '🤍 **White Hat**: breaks in **with permission** to find holes and fix them. Companies pay them for it!\n🖤 **Black Hat**: breaks in without permission to steal, cause damage or make money.\n🩶 **Grey Hat**: breaks in without permission, but doesn\'t mean any harm. That\'s still **illegal**.', diagram: D.hats, analogy: 'Think of a locksmith. One opens the door for a homeowner who got locked out. A burglar opens someone else\'s door. Same skill, opposite intention.' },
        { kicker: 'Concept 2', title: 'The #1 rule', text: 'In cyber there\'s one red line: **permission**.\nTesting **your own** computer, or a system you got written permission for = allowed.\nTrying to get into a friend\'s account, your school\'s system or some website = **not allowed**. Even "just as a joke".' },
        { kicker: 'Concept 3', title: 'Flood attack (DoS)', text: 'In a `DoS` attack (Denial of Service), the attacker sends a website a **huge** number of requests at once, until it can\'t answer anyone.\nWhen the requests come from thousands of computers together, it\'s called `DDoS`.', diagram: D.dos, analogy: 'A thousand people squeeze into a tiny pizza place and each orders a glass of water. The real customers can\'t order a single pizza.' },
      ],
      game: {
        engine: 'sorter', title: 'Which hat?', intro: 'Read what the hacker did, and decide which hat they\'re wearing.',
        config: {
          bins: [{ id: 'white', label: 'White', emoji: '🤍' }, { id: 'grey', label: 'Grey', emoji: '🩶' }, { id: 'black', label: 'Black', emoji: '🖤' }],
          items: [
            { emoji: '🏦', text: 'A bank hired her to test whether its website can be hacked', bin: 'white', why: 'She has permission, and the goal is to fix things.' },
            { emoji: '💳', text: 'Stole credit card details and sold them', bin: 'black', why: 'Stealing for profit = Black Hat.' },
            { emoji: '📨', text: 'Found a hole in a website without permission, then emailed the company to fix it', bin: 'grey', why: 'Good intentions, but no permission. Still not allowed.' },
            { emoji: '🏆', text: 'Competes in an official contest where hacking a specially built site is allowed', bin: 'white', why: 'CTF competitions are a legal training ground.' },
            { emoji: '🌊', text: 'Crashed a school website with a flood of requests to cancel a test', bin: 'black', why: 'A DoS that causes damage = Black Hat.' },
            { emoji: '🔒', text: 'Locked a hospital\'s files and demanded money', bin: 'black', why: 'A ransomware attack: one of the most harmful there is.' },
            { emoji: '🎮', text: 'Got into a game server without permission "just to look", and didn\'t touch anything', bin: 'grey', why: 'No harm done, but no permission either.' },
            { emoji: '🛡️', text: 'Works in the Cyber Unit testing the defenses of military systems', bin: 'white', why: 'A defender with full permission. Exactly what you\'ll be!' },
          ],
        },
      },
      quiz: [
        { q: 'What\'s the main difference between a White Hat and a Black Hat?', options: ['The color of their computer', 'Permission and intent: the White Hat has permission and wants to fix things', 'The White Hat is faster'], answer: 1, explain: 'Same tools, but with permission and a good goal.' },
        { q: 'A friend asks you to try guessing a classmate\'s password "as a joke". What do you do?', options: ['Try it, it\'s just a joke', 'Say no. That\'s getting in without permission', 'Only try 3 times'], answer: 1, explain: 'No permission = not allowed, even as a joke.' },
        { q: 'What happens in a DoS attack?', options: ['Someone steals a password', 'A website gets flooded with requests until it crashes', 'The internet gets deleted'], answer: 1, explain: 'Flood = the site can\'t answer anyone.' },
      ],
      outro: 'Awesome, {name}! Now you know: we\'re the White Hats. Next up, the Black Hats\' favorite trick: **phishing**.',
    },

    // ───────────────────────── 2
    {
      id: 'm2-2', emoji: '🎣', title: 'The Suspicious Inbox', topic: 'Phishing', xp: 150, badge: 'phish',
      story: [
        'The unit\'s inbox is packed with messages. Some are real... and some are **bait**.',
        'Hackers go "fishing" for passwords: they cast a line with a tempting message and wait for someone to bite. **{name}**, you need to spot every piece of bait.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'What is phishing?', text: '`Phishing` (sounds like "fishing") is a fake message pretending to come from someone you trust: a game, a bank, your school, even a friend.\nThe goal: get you to click a link, type a password or download a file.', diagram: D.phish },
        { kicker: 'Concept 2', title: 'The 5 red flags', text: '🚩 **Pressure and deadlines**: "Within 1 hour!", "URGENT!!!".\n🚩 **Weird address**: `rob1ox` instead of `roblox`.\n🚩 **Too-good-to-be-true gift**: "You won 10,000 Robux!".\n🚩 **Asks for a password or code**: real sites never do.\n🚩 **A link that goes somewhere else** than what it says.' },
        { kicker: 'Concept 3', title: 'What do you do?', text: 'Don\'t click. Don\'t reply. **Show a parent**.\nWant to check? Go to the real website yourself (type the address), never through the link in the message.', analogy: 'A stranger calls and says they\'re from the bank? Hang up and call the bank on a number you already know.' },
      ],
      game: {
        engine: 'inbox', title: 'Bait Hunter', intro: 'For each message, decide: real or fake? If it\'s fake, tap the suspicious part inside it.',
        config: {
          messages: [
            { channel: 'email', time: '10:42', phish: true,
              head: [{ t: 'From: Roblox Support', clue: null }, { t: '`security@rob1ox-gifts.com`', clue: 'The address says **rob1ox**, with the number 1 instead of the letter l. Fake site!' }],
              body: [{ t: '**URGENT!!!** Your account will be deleted in **1 hour**.', clue: 'Time pressure is a trick to stop you from thinking.' }, { t: 'To keep it, log in now and verify your password:' }, { t: 'roblox.com/verify', link: true, clue: 'It says roblox.com, but the link actually goes to `rob1ox-gifts.com`.' }, { t: 'The Roblox Team' }],
              explain: 'Roblox will never ask for your password by email.' },
            { channel: 'email', time: '09:15', phish: false,
              head: [{ t: 'From: School Portal' }, { t: '`no-reply@school.org.il`' }],
              body: [{ t: 'Hi, your math test grade has been updated in the system.' }, { t: 'You can see it when you log in to the school website as usual.' }],
              explain: 'No pressure, no shady link, no password request. It just tells you to log in the normal way.' },
            { channel: 'email', time: '18:03', phish: true,
              head: [{ t: 'From: Fortnite Prize 🎁' }, { t: '`winner@free-vbucks.biz`', clue: 'The site `free-vbucks.biz` has nothing to do with the company that makes the game.' }],
              body: [{ t: '🎉 **Congratulations! You won 10,000 FREE V-Bucks!**', clue: 'An amazing gift for no reason = bait.' }, { t: 'Just reply with your username, password and **the code you got by SMS**.', clue: 'Nobody legit ever asks for your verification code!' }],
              explain: 'Huge prize + asking for your password and code = classic phishing.' },
            { channel: 'sms', time: '13:20', phish: true,
              head: [{ t: 'From: `+44 7700 900123`', clue: 'A foreign number you don\'t know.' }],
              body: [{ t: 'Israel Post: Your package is on hold. Pay a ₪3.90 delivery fee:' }, { t: 'bit.ly/doar-il-pay', link: true, clue: 'A shortened link that hides where it really goes. Israel Post doesn\'t send payment links like this.' }],
              explain: '"Package on hold" texts are one of the most common scams around. Show a parent and delete it.' },
            { channel: 'chat', time: '20:11', phish: false,
              head: [{ t: 'From: Dad ❤️' }],
              body: [{ t: 'Reminder: we leave for the trip tomorrow at 7:30. Pack a water bottle 🙂' }],
              explain: 'A normal message from someone you know. No links, no weird requests.' },
          ],
        },
      },
      quiz: [
        { q: 'What\'s the goal of phishing?', options: ['To send jokes', 'To get you to hand over a password, click a link or download a file', 'To update your computer'], answer: 1, explain: 'Phishing = fishing for information.' },
        { q: 'Which address is suspicious?', options: ['support@roblox.com', 'support@r0blox-help.net', 'Both are real'], answer: 1, explain: 'A zero instead of an o, and a different domain: a dead giveaway.' },
        { q: 'You got a suspicious message. What\'s the right move?', options: ['Click it to check', 'Don\'t click, and show a parent', 'Forward it to friends'], answer: 1, explain: 'Don\'t click, and tell a grown-up.' },
      ],
      outro: 'Not a single piece of bait got you, {name}! But hackers have started using **AI** to impersonate people. That\'s your next mission.',
    },

    // ───────────────────────── 3
    {
      id: 'm2-3', emoji: '🎭', title: 'The Impostors', topic: 'Social engineering and AI', xp: 150, badge: 'deepfake',
      story: [
        'Hot intel: the Shadow Gang has found an AI tool that copies **voices** and **faces**.',
        'Now they can sound like your mom, look like your teacher, or text exactly like your friend. **{name}**, let\'s see if anyone can fool you.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'Social engineering', text: '**Social engineering** means hacking **people**, not computers. The attacker plays on emotions: fear, curiosity, wanting to help, or pressure, to get you to do something you normally wouldn\'t.', analogy: 'The wolf in Little Red Riding Hood didn\'t break down the door. He changed his voice and talked Grandma into opening it.' },
        { kicker: 'Concept 2', title: 'AI fakes (Deepfakes)', text: 'With `AI`, today you can:\n🎙️ Copy someone\'s voice from just a few seconds of recording.\n📹 Make a fake video of a real person\'s face.\n✍️ Write perfect messages in the style of someone you know.\nThat\'s called a `Deepfake`.' },
        { kicker: 'Concept 3', title: 'How to spot them', text: '🚩 An **unusual** request: money, a code, a password, a secret.\n🚩 **Pressure** and "don\'t tell anyone".\n🚩 A **new** number or account ("I got a new phone").\n✅ **The winning rule**: hang up and check another way. Call the person yourself on a number you know, or ask something only the real person would know.\n💡 Tip: agree on a **secret family code word**.' },
      ],
      game: {
        engine: 'inbox', title: 'Real or Impostor?', intro: 'Messages, calls and videos. Who\'s really who they say they are?',
        config: {
          messages: [
            { channel: 'voice', time: '16:05', phish: true,
              head: [{ t: 'Voice message from an unknown number', clue: 'Your real mom would call from her own number.' }],
              body: [{ t: '🎙️ "Hi sweetie, it\'s Mom. **My phone broke**, I\'m calling from a friend\'s number."', clue: '"My phone broke / new number" is a classic impostor excuse.' }, { t: '"Send me the code you just got by SMS, **quick**, I need it."', clue: 'Nobody needs your code, not even Mom. And "quick" on top of that!' }],
              explain: 'A voice can be faked with AI. Hang up and call Mom on her own number.' },
            { channel: 'video', time: '11:30', phish: true,
              head: [{ t: 'Video going around the class group chat' }],
              body: [{ t: '📹 A famous soccer star talking to the camera:' }, { t: '"I\'m giving a **free iPhone** to everyone who clicks this link and enters their details!"', clue: 'A too-good-to-be-true prize from a celebrity = deepfake + bait.' }, { t: 'His lips don\'t always match the words.', clue: 'Unnatural mouth and eye movements are a sign of a Deepfake.' }],
              explain: 'Celebrities don\'t hand out gifts through links. And video can be faked with AI.' },
            { channel: 'chat', time: '19:40', phish: false,
              head: [{ t: 'From: Noa from class (saved contact)' }],
              body: [{ t: 'Do you have the history worksheet? I left mine at home 😅' }],
              explain: 'A friend on her usual number, with a normal request. No password, money or code.' },
            { channel: 'chat', time: '22:15', phish: true,
              head: [{ t: 'From: "Yoav" (new account)', clue: 'A new account pretending to be a friend.' }],
              body: [{ t: 'Bro it\'s me, I made a new account.' }, { t: 'There\'s a game contest and I need your vote. **Just enter your password here**, takes a sec:', clue: 'No vote ever needs your password.' }, { t: 'vote-fortnite-win.co', link: true, clue: 'Not an official site.' }, { t: '**Don\'t tell anyone**, it\'s a secret 🤫', clue: '"Don\'t tell" is a giant red flag.' }],
              explain: 'Ask Yoav by phone or at school if it\'s really him.' },
            { channel: 'email', time: '08:00', phish: false,
              head: [{ t: 'From: Ms. Michal (teacher)' }, { t: '`michal@school.org.il`' }],
              body: [{ t: 'Good morning everyone! Please bring colored pencils to art class tomorrow 🎨' }],
              explain: 'A school address, no weird requests and no links.' },
          ],
        },
      },
      quiz: [
        { q: 'What is a Deepfake?', options: ['A cartoon', 'A fake voice, image or video made with AI', 'A type of firewall'], answer: 1, explain: 'AI can fake voices and faces.' },
        { q: '"Mom" calls from an unknown number and asks for a code. What do you do?', options: ['Send it fast', 'Hang up and call Mom on her own number', 'Send only half the code'], answer: 1, explain: 'Check another way you already trust.' },
        { q: 'Why do impostors say "don\'t tell anyone"?', options: ['They\'re shy', 'So no grown-up can stop the scam', 'It doesn\'t mean anything'], answer: 1, explain: 'Secret = red flag. Always tell a parent.' },
      ],
      outro: 'Nobody can fool you, {name}! Now for the scariest threat in the cyber world: **ransomware**.',
    },

    // ───────────────────────── 4
    {
      id: 'm2-4', emoji: '💰', title: 'Ransomware Attack', topic: 'Ransomware and company security', xp: 160, badge: 'ransom',
      story: [
        '🚨 **ALERT!** This morning, the staff at "Pizza-Tech" came in to find a red message on every screen: "Your files are locked. Pay to get them back."',
        '**{name}**, you\'re the incident commander. You need to decide what to do, and in what order.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'What is ransomware?', text: '`Ransomware` gets into a computer, usually through phishing or a fake file, and **encrypts** all the files. Only the attacker has the key, and they demand money for it.', diagram: D.ransom },
        { kicker: 'Concept 2', title: 'Why not just pay?', text: 'There\'s zero guarantee the attacker will actually unlock the files. Paying also funds their next attack.\nThe real defense is a **backup**: a copy of your files in a separate place the ransomware can\'t reach.', analogy: 'If a thief grabs your notebook but you have a photo of every page at home, he\'s got nothing to threaten you with.' },
        { kicker: 'Concept 3', title: 'Emergency plan', text: 'Organizations practice ahead of time, like a fire drill:\n1️⃣ **Disconnect** infected computers from the network.\n2️⃣ **Report** to the cyber team (in Israel, also the National Cyber Directorate, 119).\n3️⃣ **Clean** the computers.\n4️⃣ **Restore** from backup.\n5️⃣ **Learn** how it happened and fix it.' },
      ],
      game: {
        engine: 'combo', title: 'The War Room', intro: 'Two stages: make calls during the incident, then put the emergency plan in order.',
        config: {
          parts: [
            {
              engine: 'fixit', title: 'War Room Decisions',
              config: {
                items: [
                  { emoji: '💸', name: 'The attacker\'s demand', problem: 'The hackers want a million shekels in Bitcoin within 24 hours.', options: ['Pay fast', 'Don\'t pay, restore from backup', 'Argue with the hackers in chat'], answer: 1, explain: 'Paying guarantees nothing. The backup saves the day.' },
                  { emoji: '🖥️', name: 'A computer not locked yet', problem: 'One computer still works, but it\'s on the same network.', options: ['Disconnect it from the network now', 'Keep working on it', 'Email the whole company from it'], answer: 0, explain: 'Disconnecting stops the spread.' },
                  { emoji: '💾', name: 'The backup', problem: 'The backup is on a drive that\'s always plugged into the main computer.', options: ['Totally fine', 'From now on, keep an offline backup or a separate cloud backup', 'Delete the backup'], answer: 1, explain: 'Ransomware encrypts plugged-in drives too. You need an offline backup.' },
                  { emoji: '📧', name: 'How did it start?', problem: 'Turns out an employee opened "invoice.exe" from an unknown email.', options: ['Fire everyone', 'Train staff to spot phishing and block .exe files in email', 'Stop using email'], answer: 1, explain: 'Teach people and add protections, so it doesn\'t happen again.' },
                ],
              },
            },
            {
              engine: 'order', title: 'The Emergency Plan',
              config: {
                levels: [{
                  q: 'Put the ransomware response steps in order, first to last.',
                  steps: ['🔌 Disconnect infected computers from the network', '📞 Report to the cyber team', '🧹 Clean the malware off the computers', '💾 Restore the files from backup', '📝 Learn what happened and patch the hole'],
                  hints: ['First, stop the spread!', 'Who needs to know about the incident?', 'Before bringing files back, you need a clean computer.', 'Now bring back what got locked.', 'How do you make sure it doesn\'t happen again?'],
                  explain: 'Stop, report, clean, restore, learn.',
                }],
              },
            },
          ],
        },
      },
      quiz: [
        { q: 'What does ransomware do?', options: ['Cleans your computer', 'Encrypts files and demands money', 'Updates the operating system'], answer: 1, explain: 'It locks files with encryption.' },
        { q: 'What\'s the best defense against ransomware?', options: ['An offline, up-to-date backup', 'A big screen', 'Paying in advance'], answer: 0, explain: 'With a backup you can restore without paying.' },
        { q: 'What\'s the first step when you discover ransomware?', options: ['Disconnect from the network', 'Turn off the lights', 'Wait'], answer: 0, explain: 'Disconnecting stops the spread.' },
      ],
      outro: 'Pizza-Tech is back in business, and didn\'t pay a cent! {name}, you ran that incident like a pro. Now let\'s build a **shield wall**.',
    },

    // ───────────────────────── 5
    {
      id: 'm2-5', emoji: '🧱', title: 'The Shield Wall', topic: 'Firewall, antivirus and 2FA', xp: 160, badge: 'firewall',
      story: [
        'Agent {name}, you\'re now posted at the network\'s front gate. Every packet that wants in has to get past **you**.',
        'You\'ve got rules, you\'ve got a clock, and there\'s a ton of traffic. Ready to guard the gate?',
      ],
      nuggets: [
        { kicker: 'Tool 1', title: 'Firewall', text: 'A `Firewall` is a guard at the entrance to the network. It checks every packet against **rules**: where it\'s from, where it\'s going and what it wants. Anything suspicious gets blocked.', diagram: D.firewall, analogy: 'Like a security guard at the mall entrance: checks everyone coming in, and anyone who breaks the rules stays out.' },
        { kicker: 'Tool 2', title: 'Antivirus', text: '**Antivirus** scans files and programs looking for **malware** (harmful software): viruses, Trojan horses and ransomware. It knows the "fingerprints" of known malware, and also spots suspicious behavior.\nKeep it updated, because new malware shows up every day.' },
        { kicker: 'Tool 3', title: 'Two-factor authentication (2FA)', text: 'With `2FA` you need **two** things to log in: something you **know** (a password) + something you **have** (a code on your phone).\nEven if a hacker steals your password, without your phone they\'re stuck outside!', diagram: D.twofa },
      ],
      game: {
        engine: 'combo', title: 'Gatekeeper', intro: 'Stage 1: run the firewall. Stage 2: log in with two-factor authentication.',
        config: {
          parts: [
            {
              engine: 'firewall', title: 'The Firewall',
              config: {
                seconds: 12, minSeconds: 7,
                rules: ['✅ Allow normal browsing to known sites (HTTPS).', '⛔ Block addresses on the **blacklist**: `6.6.6.6`.', '⛔ Block `.exe` files arriving by email.', '⛔ Block **floods**: tons of requests from the same address.', '⛔ Block outside login attempts to cameras and printers.'],
                items: [
                  { emoji: '🎬', from: 'YouTube', ip: '142.250.1.1', desc: 'Request to watch a video (HTTPS)', block: false, why: 'Normal, secure browsing.' },
                  { emoji: '🦹', from: 'Unknown server', ip: '6.6.6.6', desc: 'Wants to connect to your computer', block: true, why: 'That address is on the blacklist.' },
                  { emoji: '📧', from: 'Email: "Invoice"', ip: '91.20.4.8', desc: 'Attachment: `invoice.exe`', block: true, why: '.exe files by email are banned. Possible malware.' },
                  { emoji: '📚', from: 'School website', ip: '18.66.2.40', desc: 'Loading homework (HTTPS)', block: false, why: 'A known, secure site.' },
                  { emoji: '🌊', from: 'Unknown computer', ip: '45.9.9.9', desc: '**5,000 requests per second** to the home page', block: true, why: 'That\'s a flood. DoS attack!' },
                  { emoji: '📷', from: 'Internet', ip: '203.0.113.5', desc: 'Outside login attempt on the home camera', block: true, why: 'Never allow outside access to IoT devices.' },
                  { emoji: '🎮', from: 'Game server', ip: '34.120.8.9', desc: 'Game version update (HTTPS)', block: false, why: 'An update from a known source.' },
                  { emoji: '🌊', from: 'Unknown computer', ip: '45.9.9.9', desc: 'Another **5,000 requests** to the home page', block: true, why: 'The flood keeps coming. Block it!' },
                ],
              },
            },
            {
              engine: 'twofa', title: 'Two-Factor Login',
              config: {
                levels: [
                  { type: 'login', site: 'MyGame.com', intro: 'Your password is already typed in. Now enter **the code shown on the phone**.', success: 'That\'s how 2FA works: even if someone stole your password, they don\'t have the code from your phone.' },
                  { type: 'alert', alert: '🔐 **MyGame**: Your login code is `482913`. Someone is trying to sign in from **Brazil** 🇧🇷.', q: 'You didn\'t just try to log in. What does this mean, and what do you do?', options: ['Someone knows my password! Don\'t share the code, change the password and tell a parent', 'Send the code to whoever asks for it in chat', 'Ignore it, it\'s probably nothing'], answer: 0, explain: 'The code arrived because someone typed in your password. 2FA stopped them. Now change your password.' },
                ],
              },
            },
          ],
        },
      },
      quiz: [
        { q: 'What does a firewall do?', options: ['Cools down the computer', 'Checks traffic against rules and blocks suspicious stuff', 'Boosts your internet'], answer: 1, explain: 'A guard at the network gate.' },
        { q: 'What do you need to log in with 2FA?', options: ['Just a password', 'Password + a code from your phone', 'Just a username'], answer: 1, explain: 'Something you know + something you have.' },
        { q: 'Why is it important to update your antivirus?', options: ['New malware is discovered every day', 'So it gets a new logo', 'It isn\'t important'], answer: 0, explain: 'Updating = knowing about the newest threats.' },
      ],
      outro: 'The gate is shut to attackers, {name}! Now you get a peek at the work of a real **cyber analyst**.',
    },

    // ───────────────────────── 6
    {
      id: 'm2-6', emoji: '🕵️', title: 'Analyst Eyes', topic: 'Traffic and event analysis', xp: 170, badge: 'analyst',
      story: [
        'Something weird happened on the school server last night, but nobody saw a thing.',
        'Lucky for us, computers **log everything**. **{name}**, step into an analyst\'s shoes and find the intruder.',
      ],
      nuggets: [
        { kicker: 'Tool 1', title: 'Event Viewer', text: '`Windows` has a tool called `Event Viewer` that records every **logon**, every **error** and every **change**.\nEvery event has an ID:\n`4624` = logon succeeded ✅\n`4625` = logon failed ❌', diagram: D.analyst },
        { kicker: 'Tool 2', title: 'What are you looking for?', text: 'An analyst hunts for **unusual patterns**:\n🌙 A logon at a strange hour (3 a.m.).\n🔁 Lots of failures in a row. Someone\'s guessing a password!\n🌍 An IP address from a foreign country.\n⚠️ A success **after** lots of failures. The guess probably worked.', analogy: 'Like a detective watching security footage who notices someone walked past the door 20 times in the middle of the night.' },
        { kicker: 'Tool 3', title: 'Wireshark: seeing the packets', text: '`Wireshark` is a tool that shows every packet traveling across the network: where it\'s from, where it\'s going, which protocol, and what\'s inside.\nWith `HTTPS` you only see encrypted gibberish. With `HTTP` you can see **everything**, passwords included!\n⚠️ Only use it on **your own** network, with permission.' },
      ],
      game: {
        engine: 'logs', title: 'Log Detective', intro: 'Go through the logs and tap the suspicious line.',
        config: {
          levels: [
            {
              tool: 'events', q: 'All the staff logged on in the morning as usual. Find the **suspicious** logon that succeeded.',
              columns: ['Time', 'Event ID', 'User', 'Computer / IP', 'Event'], ltrCols: [0, 1, 2, 3],
              rows: [
                { cells: ['07:58', '4624', 'dana', 'PC-12', 'Logon succeeded'] },
                { cells: ['08:02', '4624', 'yossi', 'PC-07', 'Logon succeeded'] },
                { cells: ['08:15', '4624', 'michal', 'PC-03', 'Logon succeeded'] },
                { cells: ['03:14', '4624', 'admin', '185.22.7.1', 'Logon succeeded'], level: 'warn' },
                { cells: ['09:30', '4624', 'principal', 'PC-01', 'Logon succeeded'] },
              ],
              answer: 3, hint: 'Look at the time, and at the computer they logged on from.',
              explain: 'A logon by **admin** at **3:14 a.m.** from an outside IP address, not a school computer. Very suspicious!',
            },
            {
              tool: 'events', q: 'Someone guessed a password. Mark **all** the failed attempts from the attacker\'s address, then tap "Check".',
              columns: ['Time', 'Event ID', 'User', 'Computer / IP', 'Event'], ltrCols: [0, 1, 2, 3],
              rows: [
                { cells: ['03:10', '4625', 'admin', '185.22.7.1', 'Bad password'], level: 'err' },
                { cells: ['03:11', '4625', 'admin', '185.22.7.1', 'Bad password'], level: 'err' },
                { cells: ['07:50', '4625', 'dana', 'PC-12', 'Bad password'], level: 'err' },
                { cells: ['03:12', '4625', 'admin', '185.22.7.1', 'Bad password'], level: 'err' },
                { cells: ['07:51', '4624', 'dana', 'PC-12', 'Logon succeeded'] },
                { cells: ['03:13', '4625', 'admin', '185.22.7.1', 'Bad password'], level: 'err' },
                { cells: ['03:14', '4624', 'admin', '185.22.7.1', 'Logon succeeded'], level: 'warn' },
              ],
              answer: [0, 1, 3, 5], hint: 'Only the failures (4625) from 185.22.7.1. Dana just mistyped once in the morning.',
              explain: '4 failed attempts in 4 minutes, then a **success**. That\'s called `Brute Force`: guessing a password by sheer force. The fix: a strong password, 2FA, and a lockout after a few tries.',
            },
            {
              tool: 'wireshark', q: 'Look at the packets on the network. Which packet carries the password in **plain text**?',
              columns: ['No.', 'Source', 'Destination', 'Protocol', 'Info'], ltrCols: [0, 1, 2, 3, 4],
              rows: [
                { cells: ['1', '10.0.0.7', '8.8.8.8', 'DNS', 'Query: school.org.il'] },
                { cells: ['2', '8.8.8.8', '10.0.0.7', 'DNS', 'Answer: 18.66.2.40'] },
                { cells: ['3', '10.0.0.7', '18.66.2.40', 'TLS', 'Application Data: 8f3a…c91e'] },
                { cells: ['4', '10.0.0.7', '93.184.1.9', 'HTTP', 'POST /login user=dani&pass=Kitty123'], level: 'warn' },
                { cells: ['5', '10.0.0.7', '142.250.1.1', 'TLS', 'Application Data: 1b77…04af'] },
              ],
              answer: 3, hint: 'Look for HTTP (no S) and the word pass.',
              explain: 'In packet 4 the site uses **HTTP** with no encryption, so anyone listening on the network can see the password `Kitty123`! With TLS (the S in HTTPS) all you see is gibberish.',
            },
          ],
        },
      },
      quiz: [
        { q: 'What does Event ID 4625 mean in Event Viewer?', options: ['Logon succeeded', 'Logon failed', 'The computer shut down'], answer: 1, explain: '4625 = failure, 4624 = success.' },
        { q: 'Lots of failed attempts in a row, then a success. What is it probably?', options: ['A tired employee', 'Password guessing (Brute Force)', 'A software update'], answer: 1, explain: 'The attacker kept guessing until it worked.' },
        { q: 'Why can Wireshark show the password over HTTP but not HTTPS?', options: ['With HTTPS the data is encrypted', 'HTTP is faster', 'No reason'], answer: 0, explain: 'Encryption turns the contents into gibberish.' },
      ],
      outro: 'You caught the intruder straight from the logs! {name}, you\'ve got the eyes of a real analyst. Only the **boss** is left.',
    },

    // ───────────────────────── BOSS
    {
      id: 'm2-boss', boss: true, emoji: '🦹', title: 'Boss: The Shadow Returns', topic: 'Final mission: Base 2', xp: 300, badge: 'base2',
      story: [
        '🚨 **The Digital Shadow is back**, and this time he\'s using every trick: phishing, AI fakes, floods and break-ins.',
        'His target: the **Cyber Unit** network. **{name}**, you\'re the last line of defense. Good luck!',
      ],
      nuggets: [
        { kicker: 'Quick recap', title: 'The defender\'s toolkit', text: '🎩 **Hats**: we only hack with permission.\n🎣 **Phishing**: pressure, weird address, password request.\n🎭 **Impostors**: check another way.\n💰 **Ransomware**: disconnect, report, clean, restore.\n🧱 **Firewall & 2FA**: rules + a code on your phone.\n🕵️ **Logs**: strange hours, lots of failures.' },
      ],
      game: {
        engine: 'combo', title: 'Defend the Cyber Unit', intro: '4 stages. The Shadow doesn\'t give up, and neither do you!',
        config: {
          parts: [
            {
              engine: 'inbox', title: 'Stage 1: Phishing attack',
              config: {
                messages: [
                  { channel: 'email', time: '07:00', phish: true,
                    head: [{ t: 'From: IT Department' }, { t: '`it-support@mamram-security.help`', clue: 'That address doesn\'t belong to the Cyber Unit. And a `.help` ending is weird.' }],
                    body: [{ t: 'Your password has **expired**. Update it **within 10 minutes** or your account will be locked.', clue: 'Extreme time pressure.' }, { t: 'Update password', link: true, clue: 'A link that goes to an outside site.' }],
                    explain: 'A real IT department doesn\'t send password links with threats.' },
                  { channel: 'voice', time: '07:20', phish: true,
                    head: [{ t: 'Voice message: "The Commander"' }],
                    body: [{ t: '🎙️ "This is General Bit. **I\'m overseas** and I can\'t get in."', clue: 'An excuse to stop you from checking.' }, { t: '"Send me your login code, **and don\'t tell anyone**."', clue: 'A real commander never asks for your code, and "don\'t tell" = red flag.' }],
                    explain: 'The voice was faked with AI. Verify through another channel.' },
                ],
              },
            },
            {
              engine: 'firewall', title: 'Stage 2: Flood at the gate',
              config: {
                seconds: 9, minSeconds: 6,
                rules: ['✅ Allow known HTTPS traffic.', '⛔ Block floods and blacklisted addresses (`6.6.6.6`).', '⛔ Block unknown `.exe` files.'],
                items: [
                  { emoji: '🌊', from: 'Botnet', ip: '45.9.9.9', desc: '**20,000 requests per second**', block: true, why: 'DDoS!' },
                  { emoji: '🏫', from: 'Learning platform', ip: '18.66.2.40', desc: 'Loading a lesson (HTTPS)', block: false, why: 'Known traffic.' },
                  { emoji: '🦹', from: 'The Shadow', ip: '6.6.6.6', desc: 'Login attempt on the server', block: true, why: 'Blacklisted.' },
                  { emoji: '📎', from: 'External email', ip: '77.3.1.2', desc: 'File: `update_now.exe`', block: true, why: 'Unknown .exe file.' },
                  { emoji: '🛰️', from: 'Windows Update', ip: '13.107.4.50', desc: 'Official security update (HTTPS)', block: false, why: 'An official update. Important to allow.' },
                ],
              },
            },
            {
              engine: 'logs', title: 'Stage 3: Find the intruder',
              config: {
                levels: [{
                  tool: 'events', q: 'The Shadow got into one account. Which one?',
                  columns: ['Time', 'Event ID', 'User', 'Computer / IP', 'Event'], ltrCols: [0, 1, 2, 3],
                  rows: [
                    { cells: ['02:40', '4625', 'ron', '6.6.6.6', 'Bad password'], level: 'err' },
                    { cells: ['02:41', '4625', 'ron', '6.6.6.6', 'Bad password'], level: 'err' },
                    { cells: ['08:05', '4624', 'shira', 'PC-22', 'Logon succeeded'] },
                    { cells: ['02:41', '4625', 'gal', '6.6.6.6', 'Bad password'], level: 'err' },
                    { cells: ['02:42', '4624', 'gal', '6.6.6.6', 'Logon succeeded'], level: 'warn' },
                  ],
                  answer: 4, hint: 'Look for a success (4624) from the Shadow\'s address.',
                  explain: '**gal**\'s account was breached at 02:42. Change the password and turn on 2FA!',
                }],
              },
            },
            {
              engine: 'order', title: 'Stage 4: Close the incident',
              config: {
                levels: [{
                  q: 'gal\'s account was breached. Put the actions in order.',
                  steps: ['🚪 Lock the account and kick the Shadow out', '🔑 Change to a strong password', '📱 Turn on two-factor authentication', '🧱 Add a firewall rule against 6.6.6.6', '📝 Write a report and teach everyone'],
                  explain: 'Stop, strengthen, lock down, learn.',
                }],
              },
            },
          ],
        },
      },
      quiz: [
        { q: 'You got a voice message from "the Commander" asking for a code. What do you do?', options: ['Send it', 'Verify through another channel and don\'t share the code', 'Ask him to sing'], answer: 1, explain: 'Voices can be faked with AI.' },
        { q: 'What stops a DDoS attack at the gate?', options: ['A firewall that blocks floods', 'A dark screen', 'A new keyboard'], answer: 0, explain: 'Rules that detect floods and block them.' },
        { q: 'What\'s the sign of a break-in in the logs?', options: ['Lots of failures, then a success from a foreign address', 'A morning logon from the usual computer', 'There are no signs'], answer: 0, explain: 'The Brute Force pattern.' },
        { q: 'Why don\'t you pay ransom?', options: ['No guarantee they\'ll give the files back, and it funds attackers', 'Because it\'s too cheap', 'You always pay'], answer: 0, explain: 'Restore from backup instead.' },
        { q: 'Which of these is a White Hat?', options: ['Hacks with permission to fix things', 'Steals passwords', 'Crashes websites'], answer: 0, explain: 'Permission + good intent.' },
      ],
      outro: '🏆 **HUGE WIN!** The Shadow is defeated, and the Cyber Unit network is safe. {name}, you\'ve completed **Hacker Base**! Next stop: **Code Base**, where you\'ll write real code.',
    },
  ],
};
