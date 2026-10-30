// Base 3: Programming & Development (Module 4 in the syllabus)
import { T, E, box, arrow, svg } from '../svg.js';

const D = {
  algorithm: svg(`
    ${box(10, 50, 70, 60)}${E(45, 85, '🍞', 24)}${T(45, 102, 'Bread', '#9fb0d9', 11, 400)}
    ${arrow(82, 80, 112, 80)}
    ${box(115, 50, 70, 60)}${E(150, 85, '🧈', 24)}${T(150, 102, 'Spread', '#9fb0d9', 11, 400)}
    ${arrow(187, 80, 217, 80)}
    ${box(220, 50, 90, 60, '#12402f', '#4ade80')}${E(265, 85, '🥪', 24)}${T(265, 102, 'Sandwich!', '#86efac', 11)}
    ${T(160, 30, 'Algorithm = exact steps, in order', '#ffb547', 13)}`),
  variable: svg(`
    ${box(20, 40, 120, 80, '#14385a', '#60a5fa')}${T(80, 30, 'name', '#60a5fa', 14)}${T(80, 86, '"Noam"', '#eef3ff', 16)}
    ${box(180, 40, 120, 80, '#3b2a10', '#ffb547')}${T(240, 30, 'score', '#ffb547', 14)}${T(240, 88, '100', '#eef3ff', 22)}
    ${T(160, 148, 'Variable = a named box that holds a value', '#9fb0d9', 12)}`),
  ifelse: svg(`
    ${box(110, 10, 100, 40, '#3b2a10', '#ffb547')}${T(160, 35, 'age >= 12 ?', '#ffd28a', 13)}
    ${arrow(130, 52, 70, 90)}${arrow(190, 52, 250, 90)}
    ${T(88, 76, 'yes', '#86efac', 12)}${T(232, 76, 'no', '#ff9aaa', 12)}
    ${box(10, 95, 120, 50, '#12402f', '#4ade80')}${T(70, 125, 'Movie time 🎬', '#86efac', 12)}
    ${box(190, 95, 120, 50, '#3b1825', '#ff6b81')}${T(250, 125, 'Pick another 🍿', '#ff9aaa', 12)}`),
  loop: svg(`
    <circle cx="160" cy="80" r="52" fill="none" stroke="#22d3a6" stroke-width="4" stroke-dasharray="8 6"/>
    ${E(160, 92, '🔁', 34)}${T(160, 20, 'for i in range(3):', '#22d3a6', 13)}
    ${E(80, 80, '🦘', 22)}${E(240, 80, '🦘', 22)}${E(160, 150, '🦘', 22)}
    ${T(160, 160, '', '#9fb0d9', 12)}`),
  function: svg(`
    ${box(100, 30, 120, 100, '#2a1e4a', '#b48cff')}${T(160, 56, 'def area(w, h):', '#d6c2ff', 12)}${E(160, 96, '⚙️', 30)}
    ${T(50, 70, '3, 4', '#eef3ff', 16)}${arrow(70, 76, 98, 76)}
    ${arrow(222, 76, 250, 76)}${T(275, 82, '12', '#22d3a6', 20)}
    ${T(160, 152, 'Function = a machine: input in, output out', '#9fb0d9', 12)}`),
  git: svg(`
    <line x1="30" y1="60" x2="290" y2="60" stroke="#2a4180" stroke-width="4"/>
    <line x1="150" y1="60" x2="200" y2="120" stroke="#2a4180" stroke-width="4"/><line x1="200" y1="120" x2="250" y2="60" stroke="#b48cff" stroke-width="3" stroke-dasharray="5 4"/>
    ${[40, 95, 150, 250].map(x => `<circle cx="${x}" cy="60" r="12" fill="#22d3a6"/>`).join('')}
    <circle cx="200" cy="120" r="12" fill="#b48cff"/>
    ${T(40, 38, 'v1', '#9fb0d9', 12)}${T(95, 38, 'v2', '#9fb0d9', 12)}${T(150, 38, 'v3', '#9fb0d9', 12)}${T(250, 38, 'v4', '#9fb0d9', 12)}
    ${T(200, 150, 'experiment branch', '#d6c2ff', 12)}${T(70, 150, 'main', '#9fb0d9', 12)}`),
  api: svg(`
    ${E(50, 80, '🐍', 40)}${T(50, 118, 'Your code', '#9fb0d9', 12)}
    ${arrow(80, 66, 230, 66)}${T(155, 56, 'ask_ai("joke")', '#22d3a6', 12)}
    ${arrow(230, 96, 80, 96, '#ffb547')}${T(155, 116, '"Why did the..."', '#ffd28a', 12)}
    ${E(270, 80, '🤖', 40)}${T(270, 118, 'AI server', '#9fb0d9', 12)}`),
};

export const BASE3 = {
  id: 3,
  title: 'Code Base',
  subtitle: 'Algorithmic thinking & Python',
  emblem: '🐍',
  color: '#e0a020',
  missions: [
    // ───────────────────────── 1
    {
      id: 'm3-1', emoji: '🧩', title: 'Your First Robot', topic: 'Algorithmic thinking', xp: 150, badge: 'algo',
      story: [
        'Welcome to Code Base, **{name}**! Here we don’t just protect computers. We **teach them** what to do.',
        'We’ve got a brand-new robot, but it’s... kind of dumb 🤖. It does **exactly** what you tell it. Nothing more, nothing less.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'What’s an algorithm?', text: 'An **algorithm** is a list of exact steps, in the right order, that solves a problem.\nA recipe, LEGO instructions and your route to school are all algorithms!', diagram: D.algorithm },
        { kicker: 'Concept 2', title: 'Computers take everything literally', text: 'Tell the robot "make a sandwich" and it won’t get it.\nYou have to break it down: grab bread → open the jar → spread → close it up.\nThat’s called **breaking a problem into steps**, and it’s a programmer’s superpower.', analogy: 'Like explaining to an alien how to tie shoelaces: every single move, one at a time!' },
        { kicker: 'Concept 3', title: 'Bugs are totally fine', text: 'When a program doesn’t work, it has a **bug** 🐞. Programmers find and fix bugs all day long. That’s called **debugging**.\nTry, mess up, fix it. That’s how you learn!' },
      ],
      game: {
        engine: 'blocks', title: 'Guide the Robot', intro: 'Build a program out of blocks to get the robot to the star ⭐. The yellow arrow shows which way it’s facing.',
        config: {
          levels: [
            { task: 'The robot is facing right. Get it to the star.', grid: ['....*'], start: { x: 0, y: 0, dir: 1 }, showCode: true, explain: 'You just wrote your first program! Every block is a line of code.' },
            { task: 'Walls in the way! Find a path around them.', grid: ['.##*', '.##.', '....'], start: { x: 0, y: 2, dir: 0 }, explain: 'Turns change the direction, and then "forward" moves the new way.' },
            { task: 'Grab the diamond 💎 on the way to the star.', grid: ['o..#', '.#.*', '...#'], start: { x: 0, y: 2, dir: 0 }, explain: 'You planned a route with more than one goal. That’s algorithmic thinking!' },
          ],
        },
      },
      quiz: [
        { q: 'What is an algorithm?', options: ['A type of computer', 'A list of exact steps that solves a problem', 'A video game'], answer: 1, explain: 'Exact steps in the right order.' },
        { q: 'The robot got stuck on a wall. What do you do?', options: ['Give up', 'Find the bug and fix the program', 'Yell at the robot'], answer: 1, explain: 'Debugging = find it and fix it.' },
        { q: 'Why break a problem into small steps?', options: ['Because a computer does only exactly what it’s told', 'To make it longer', 'No reason'], answer: 0, explain: 'Computers don’t guess: they need exact instructions.' },
      ],
      outro: 'Your robot is moving! {name}, now let’s learn the trick that saves tons of work: **loops**.',
    },

    // ───────────────────────── 2
    {
      id: 'm3-2', emoji: '🔁', title: 'Loop Power', topic: 'Loops and efficiency', xp: 160, badge: 'loops',
      story: [
        'The robot’s battery is running low, **{name}**. Every block in the program burns energy!',
        'We need to write **shorter** programs. Lucky for us, there’s a secret tool: the **loop**.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'Loop = repeat something', text: 'Instead of writing "forward" 6 times, you say: **"repeat 6 times: forward"**.\nIn Python it looks like this:\n`for i in range(6):`\n`    forward()`', diagram: D.loop, analogy: 'Your coach doesn’t say "do a push-up, and another, and another". They say "10 push-ups!".' },
        { kicker: 'Concept 2', title: 'How do I use it here?', text: 'Every block has an orange `×1` button. Each tap adds one more repeat.\nOne block with `×6` = 6 steps.\nWatch how the Python code changes!' },
      ],
      game: {
        engine: 'blocks', title: 'Battery Saver', intro: 'There’s a limit on how many blocks you can use. Use the orange repeat button!',
        config: {
          levels: [
            { task: 'Reach the star with just **one block**!', grid: ['......*'], start: { x: 0, y: 0, dir: 1 }, maxBlocks: 1, showCode: true, explain: 'One block with ×6 = a for loop!' },
            { task: 'A snake-shaped path, and you only get **5 blocks**.', grid: ['*....', '####.', '.....'], start: { x: 0, y: 2, dir: 1 }, maxBlocks: 5, showCode: true, explain: 'Three loops and two turns. Short, efficient code!' },
            { task: 'A spiral! Grab the diamond and reach the center. Max **9 blocks**.', grid: ['.....', '.###.', '.#*..', '.####', 'o....'], start: { x: 4, y: 4, dir: 3 }, maxBlocks: 9, showCode: true, explain: 'You cracked a spiral with loops. Programmers call that "clean code".' },
          ],
        },
      },
      quiz: [
        { q: 'What does a loop do?', options: ['Deletes code', 'Repeats an action several times', 'Turns off the computer'], answer: 1, explain: 'It repeats an action.' },
        { q: 'How many times does the code inside `for i in range(4):` run?', options: ['3', '4', '5'], answer: 1, explain: 'range(4) = 0, 1, 2, 3, so 4 times.' },
        { q: 'Why are loops good?', options: ['Shorter code and fewer mistakes', 'They’re colorful', 'They’re slow'], answer: 0, explain: 'Fewer lines = fewer places for bugs to hide.' },
      ],
      outro: 'Battery saved! {name}, now you’re ready for **real code**. Next mission: Python!',
    },

    // ───────────────────────── 3
    {
      id: 'm3-3', emoji: '🐍', title: 'Hello, Python!', topic: 'Variables, input and output', xp: 170, badge: 'python',
      story: [
        'This is it, **{name}**. No more blocks. From now on you write **real code** in `Python`, the same language they use at Google, NASA and Mamram.',
        'Don’t worry: it starts simple. Let’s go, line one!',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'print: talk to the world', text: '`print` shows a message on the screen.\n`print("Hello World")`\nText always goes inside **quotes** `"..."`. Without quotes, Python thinks it’s the name of something.' },
        { kicker: 'Concept 2', title: 'Variables', text: 'A **variable** is a box with a name that stores a value:\n`name = "Dana"`\n`score = 100`\nThen you can use the name:\n`print(name, score)`', diagram: D.variable },
        { kicker: 'Concept 3', title: 'input: ask questions', text: '`input` stops and waits for the user to type:\n`name = input("What is your name? ")`\nWhatever they type is saved as **text**. To do math, turn it into a number with `int(...)`:\n`age = int(input("How old are you? "))`' },
      ],
      game: {
        engine: 'python', title: 'Your First Code', intro: 'Write code, tap ▶ Run to try it, and ✅ Check when you’re ready.',
        config: {
          levels: [
            { title: 'Hello World', task: 'Write a line that prints: `Hello World`', starter: '# Write your code here\n', tests: [{ expect: 'Hello World' }], mustUse: ['print'], hint: 'print("...")', solution: 'print("Hello World")', success: 'It’s tradition: every programmer on the planet started with "Hello World"!' },
            { title: 'Agent Card', task: 'You have the variables `name` and `age`. **Add a line** that prints the age too, so it shows: `And I am 10`.', starter: 'name = "Noam"\nage = 10\nprint("My name is", name)\n', tests: [{ expect: ['My name is', 'And I am 10'] }], hint: 'print("And I am", age)', solution: 'name = "Noam"\nage = 10\nprint("My name is", name)\nprint("And I am", age)', success: 'You used a variable inside print. No quotes around age, because it’s the name of a box!' },
            { title: 'Personal Hello', task: 'Ask the user for their name with `input`, then print `Hello` followed by the name.', starter: 'name = input("What is your name? ")\n# print Hello + the name\n', inputs: [{ label: 'Name', value: 'Noam' }], tests: [{ stdin: ['Dana'], expect: 'Hello Dana' }, { stdin: ['Yossi'], expect: 'Hello Yossi' }], mustUse: ['input'], hint: 'print("Hello", name)', solution: 'name = input("What is your name? ")\nprint("Hello", name)', success: 'Your program talks to the user!' },
            { title: 'Calculator', task: 'Read **two numbers** and print their **sum**.', starter: 'a = int(input("First number: "))\nb = int(input("Second number: "))\n# print a + b\n', inputs: [{ label: 'First number', value: '3' }, { label: 'Second number', value: '4' }], tests: [{ stdin: ['3', '4'], expect: '7' }, { stdin: ['10', '25'], expect: '35' }], hint: 'print(a + b)', solution: 'a = int(input("First number: "))\nb = int(input("Second number: "))\nprint(a + b)', success: 'You built a calculator! `int` turned the text into a number.' },
          ],
        },
      },
      quiz: [
        { q: 'What will `print("5 + 5")` show?', options: ['10', '5 + 5', 'An error'], answer: 1, explain: 'Inside quotes it’s text, not math.' },
        { q: 'What is a variable?', options: ['A named box that stores a value', 'A kind of loop', 'A mistake in the code'], answer: 0, explain: 'name = "Dana" stores "Dana" in a box called name.' },
        { q: 'Why do we need `int()` around `input()` in the calculator?', options: ['input gives back text, and int turns it into a number', 'To make it look nice', 'We don’t'], answer: 0, explain: '"3" + "4" = "34", but 3 + 4 = 7.' },
      ],
      outro: 'You wrote real Python code, {name}! Now let’s teach the computer to **make decisions**.',
    },

    // ───────────────────────── 4
    {
      id: 'm3-4', emoji: '⚖️', title: 'Decisions and Loops', topic: 'Conditions and loops in Python', xp: 180, badge: 'logic',
      story: [
        'Smart software has to know how to **decide**: if the password is right, let them in. If not, block them.',
        '**{name}**, today you write code that makes decisions and repeats itself. That’s the heart of every game and app.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'if / else: if... otherwise', text: '`if age >= 12:`\n`    print("Come in")`\n`else:`\n`    print("Pick another movie")`\nNotice: a **colon** `:` at the end of the line, and **4 spaces** at the start of the lines inside. That’s called **indentation**.', diagram: D.ifelse },
        { kicker: 'Concept 2', title: 'Comparisons', text: '`==` equal (two equals signs!)\n`!=` not equal\n`>` `<` greater / less than\n`>=` `<=` greater or equal / less or equal\n`%` remainder: `8 % 2` = 0, so 8 is even.' },
        { kicker: 'Concept 3', title: 'for and while', text: '`for i in range(1, 4):` runs with i = 1, 2, 3.\n`while guess != secret:` runs **as long as** the condition is true.\n⚠️ Inside a while you must change something, or you get an **infinite loop**!' },
      ],
      game: {
        engine: 'python', title: 'The Decision Machine', intro: 'Four challenges. At the end you build a guessing game!',
        config: {
          levels: [
            { title: 'Movie Bouncer', task: 'Read an age. If it’s **12 or older**, print `You can watch the movie`. Otherwise, print `This movie is 12+`.', starter: 'age = int(input("How old are you? "))\nif age >= 12:\n    print("You can watch the movie")\n# add an else\n', inputs: [{ label: 'Age', value: '10' }], tests: [{ stdin: ['13'], expect: 'You can watch the movie', reject: ['This movie is 12+'] }, { stdin: ['9'], expect: 'This movie is 12+', reject: ['You can watch'] }, { stdin: ['12'], expect: 'You can watch the movie' }], mustUse: ['if', 'else'], hint: 'else:\n    print("This movie is 12+")', solution: 'age = int(input("How old are you? "))\nif age >= 12:\n    print("You can watch the movie")\nelse:\n    print("This movie is 12+")', success: 'Your program makes decisions!' },
            { title: 'Even or Odd', task: 'Read a number and print `Even` if it’s even, or `Odd` if it’s not. Hint: `%`.', starter: 'n = int(input("Number: "))\n', inputs: [{ label: 'Number', value: '8' }], tests: [{ stdin: ['8'], expect: 'Even', reject: ['Odd'] }, { stdin: ['7'], expect: 'Odd' }, { stdin: ['0'], expect: 'Even', reject: ['Odd'] }], mustUse: ['%'], hint: 'if n % 2 == 0:', solution: 'n = int(input("Number: "))\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")', success: 'The remainder % is a programmer’s secret weapon.' },
            { title: 'Countdown', task: 'Using `for`, print the numbers from **10 down to 1** (one per line), and at the end `Liftoff! 🚀`.', starter: 'for i in range(10, 0, -1):\n    # print i\n\n', tests: [{ expect: ['10\n9\n8\n7\n6\n5\n4\n3\n2\n1', 'Liftoff'] }], mustUse: ['for'], hint: 'Inside the loop: print(i). After the loop, with no spaces in front: print("Liftoff! 🚀")', solution: 'for i in range(10, 0, -1):\n    print(i)\nprint("Liftoff! 🚀")', success: '`range(10, 0, -1)` counts backwards. 3... 2... 1... 🚀' },
            { title: 'Guessing Game', task: 'The secret number is 7. Keep asking for a guess **as long as** it’s wrong. If the guess is too high, print `Too high`, if too low `Too low`, and at the end `Bullseye!`.', starter: 'secret = 7\nguess = int(input("Guess: "))\nwhile guess != secret:\n    if guess > secret:\n        print("Too high")\n    else:\n        print("Too low")\n    # ask for a new guess here!\n\nprint("Bullseye!")\n', inputs: [{ label: 'Guess 1', value: '3' }, { label: 'Guess 2', value: '9' }, { label: 'Guess 3', value: '7' }], tests: [{ stdin: ['3', '9', '7'], expect: ['Too low', 'Too high', 'Bullseye!'] }, { stdin: ['7'], expect: 'Bullseye!', reject: ['Too'] }], mustUse: ['while'], hint: 'Inside the while, at the end: guess = int(input("Guess: "))', solution: 'secret = 7\nguess = int(input("Guess: "))\nwhile guess != secret:\n    if guess > secret:\n        print("Too high")\n    else:\n        print("Too low")\n    guess = int(input("Guess: "))\nprint("Bullseye!")', success: 'You built a real game! Run it and let a friend guess.' },
          ],
        },
      },
      quiz: [
        { q: 'What’s the difference between `=` and `==`?', options: ['No difference', '`=` puts a value in a variable, `==` checks if equal', '`==` deletes'], answer: 1, explain: 'age = 10 stores. age == 10 asks.' },
        { q: 'What happens if nothing changes inside a while?', options: ['An infinite loop', 'The code runs once', 'Nothing'], answer: 0, explain: 'The condition stays true forever.' },
        { q: 'Why do lines after `if` need spaces at the start?', options: ['Just for decoration', 'That’s how Python knows what belongs inside the if', 'It slows the code down'], answer: 1, explain: 'Indentation defines blocks in Python.' },
      ],
      outro: 'Your computer decides and repeats, {name}. Now let’s organize code like a pro: **functions**.',
    },

    // ───────────────────────── 5
    {
      id: 'm3-5', emoji: '🧰', title: 'Code Machines', topic: 'Functions and organizing code', xp: 180, badge: 'functions',
      story: [
        'The unit’s code has turned into a giant mess: the same lines copied over and over.',
        '**{name}**, time to clean up! We’ll build **functions**: little machines that do one thing, and you can switch them on whenever you want.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'What’s a function?', text: 'A function is code with a **name** that you can run again and again:\n`def greet(name):`\n`    print("Hello", name)`\nYou call it like this: `greet("Dana")`', diagram: D.function },
        { kicker: 'Concept 2', title: 'return: give back an answer', text: 'A function can also **return** a value:\n`def double(x):`\n`    return x * 2`\n`print(double(5))` prints 10.', analogy: 'A juicer: oranges go in (input), and juice comes back out (return).' },
        { kicker: 'Concept 3', title: 'Why does it matter?', text: '✅ No copying code: you write it once.\n✅ Bugs are easy to find, because every machine is small.\n✅ A team can work together: each person builds a different function.' },
      ],
      game: {
        engine: 'python', title: 'The Workshop', intro: 'Build functions. The checker will run them with different values!',
        config: {
          levels: [
            { title: 'Greeting Machine', task: 'Finish the `greet` function so it prints `Hello` and the name, followed by `!`. For example: `Hello Noa!`', starter: 'def greet(name):\n    # print Hello + name + !\n    pass\n\ngreet("Noam")\n', tests: [{ append: 'greet("Noa")', expect: 'Hello Noa!' }, { append: 'greet("Ron")', expect: 'Hello Ron!' }], mustUse: ['def'], hint: 'print("Hello " + name + "!")', solution: 'def greet(name):\n    print("Hello " + name + "!")\n\ngreet("Noam")', success: 'One function, endless greetings!' },
            { title: 'Area Calculator', task: 'Write a function `area(w, h)` that **returns** (`return`) the area of a rectangle: width times height.', starter: 'def area(w, h):\n    # return w times h\n    pass\n\nprint(area(3, 4))\n', tests: [{ append: 'print(area(5, 5))', expect: '25' }, { append: 'print(area(2, 9))', expect: '18' }], mustUse: ['return'], hint: 'return w * h', solution: 'def area(w, h):\n    return w * h\n\nprint(area(3, 4))', success: 'return hands back the answer, so you can keep using it.' },
            { title: 'Password Checker', task: 'Cyber connection! Write `is_strong(password)` that returns `True` if the password is **12 characters or longer**, and `False` otherwise. Hint: `len(password)`.', starter: 'def is_strong(password):\n    pass\n\nprint(is_strong("1234"))\nprint(is_strong("Pizza!Dragon7Moon"))\n', tests: [{ append: 'print(is_strong("abc"))', expect: 'False' }, { append: 'print(is_strong("Taco!Rocket9Cloud"))', expect: 'True' }, { append: 'print(is_strong("123456789012"))', expect: 'True' }], mustUse: ['def', 'len'], hint: 'return len(password) >= 12', solution: 'def is_strong(password):\n    return len(password) >= 12\n\nprint(is_strong("1234"))\nprint(is_strong("Pizza!Dragon7Moon"))', success: 'You just wrote part of a real security system! That’s how websites check passwords.' },
          ],
        },
      },
      quiz: [
        { q: 'How do you define a function in Python?', options: ['function hello()', 'def hello():', 'make hello'], answer: 1, explain: 'def = define.' },
        { q: 'What does `return` do?', options: ['Gives a value back from the function', 'Deletes the function', 'Prints'], answer: 0, explain: 'return hands the result to whoever called the function.' },
        { q: 'Why do functions help?', options: ['No copying code, and easy to fix', 'They make code slow', 'They’re useless'], answer: 0, explain: 'Organized code = fewer bugs.' },
      ],
      outro: 'Your code is as tidy as a toolbox, {name}! But what happens when you mess up code that used to work? That’s what the **time machine** is for.',
    },

    // ───────────────────────── 6
    {
      id: 'm3-6', emoji: '⏳', title: 'The Git Time Machine', topic: 'Version control and teamwork', xp: 170, badge: 'git',
      story: [
        'Disaster! Someone in the unit changed the game code, and now **nothing works**. And there’s no old version...',
        '**{name}**, real programmers don’t panic. They have `Git`, a time machine for code. Let’s learn to use it.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'What’s Git?', text: '`Git` keeps a **history** of every change to the code. Each save is called a `commit`, and it has a message explaining what changed.\nYou can always go back to an older version!', diagram: D.git, analogy: 'Like save points in a game: if you fail a level, you go back to your last save.' },
        { kicker: 'Concept 2', title: 'The basic commands', text: '`git add` gets a file ready to save 📥\n`git commit -m "message"` saves a version 💾\n`git log` shows the history 📜\n`git checkout` jumps to another version or branch ⏪' },
        { kicker: 'Concept 3', title: 'Branches and teamwork', text: 'A **branch** (`branch`) is a separate copy for experiments. You try out an idea without breaking the main code (`main`). When the idea works, you **merge** it (`merge`).\nThat’s how hundreds of programmers work on the same project without getting in each other’s way. `GitHub` stores projects in the cloud.' },
      ],
      game: {
        engine: 'git', title: 'Time Machine Operator', intro: 'At each step, pick the right command. Watch the history grow!',
        config: {
          levels: [
            {
              intro: 'You have a game saved in one version. Now add a character and save a new version.',
              file: ['print("Welcome to the game")'], history: [{ msg: 'Start', file: ['print("Welcome to the game")'] }],
              steps: [
                { before: { edit: 'hero = "🐉 dragon"' }, say: 'You added a dragon to the game! First you need to **stage** the file for saving.', options: ['git add game.py', 'git delete game.py', 'git sleep'], answer: 0, op: { add: 1 }, explain: '`git add` puts the change in the "save box" 📥' },
                { say: 'Now **save a version** with a message that explains what you did.', options: ['git commit -m "Added a dragon"', 'git undo', 'git print'], answer: 0, op: { commit: 'Added a dragon' }, explain: 'A new point was added to the history 💾' },
              ],
              explain: 'You saved your first version! Always write a clear message so everyone gets what changed.',
            },
            {
              intro: 'Someone added a line that broke the game. Time to use the time machine!',
              file: [], history: [
                { msg: 'Start', file: ['print("Welcome to the game")'] },
                { msg: 'Added a dragon', file: ['print("Welcome to the game")', 'hero = "🐉 dragon"'] },
                { msg: 'Super speed (bug!)', file: ['print("Welcome to the game")', 'hero = "🐉 dragon"', 'speed = 9999999  # 💥'] },
              ],
              steps: [
                { say: 'The game crashes! How do you **see** all the saved versions?', options: ['git log', 'git push', 'git explode'], answer: 0, op: { log: 1 }, explain: 'Here’s the history: every commit with its ID code.' },
                { say: 'The "Added a dragon" version worked great. **Jump to it** to check.', options: ['git checkout b7c2', 'git checkout c9e0', 'git checkout a1f3'], answer: 0, op: { checkout: 'b7c2' }, wrong: { 1: 'c9e0 is actually the version with the bug!', 2: 'a1f3 is the start, before the dragon even showed up.' }, explain: '⏪ You jumped back in time! The code is back to when it worked.' },
                { say: 'You found the bug: the speed line. Now **come back to the present**, on the main branch.', options: ['git checkout main', 'git log', 'git commit -m "Back"'], answer: 0, op: { checkout: 'main' } },
                { before: { edit: 'speed = 5  # ✅ fixed' }, say: 'You fixed the speed. **Stage** the file for saving:', options: ['git add game.py', 'git checkout b7c2', 'git log'], answer: 0, op: { add: 1 } },
                { say: 'And **save** the fix:', options: ['git commit -m "Fixed speed"', 'git delete', 'git add game.py'], answer: 0, op: { commit: 'Fixed speed' } },
              ],
              explain: 'Thanks to Git you found the version that worked, spotted the bug and saved a fix. That’s how dev teams work!',
            },
            {
              intro: 'You want to try adding **spells** without breaking the game that works. That’s what **branches** are for!',
              file: [], history: [
                { msg: 'Start', file: ['print("Welcome to the game")'] },
                { msg: 'Added a dragon', file: ['print("Welcome to the game")', 'hero = "🐉 dragon"'] },
              ],
              steps: [
                { say: '**Create a new branch** called magic:', options: ['git branch magic', 'git commit magic', 'git merge magic'], answer: 0, op: { branch: 'magic' } },
                { say: '**Switch** to the new branch:', options: ['git checkout magic', 'git checkout main', 'git log'], answer: 0, op: { checkout: 'magic' }, explain: 'Now every change is saved only on the magic branch.' },
                { before: { edit: 'spell = "🔥 fireball"' }, say: 'You wrote a new spell! **Stage it**:', options: ['git add game.py', 'git merge magic', 'git branch main'], answer: 0, op: { add: 1 } },
                { say: '**Save** it on the branch:', options: ['git commit -m "Added spells"', 'git checkout main', 'git log'], answer: 0, op: { commit: 'Added spells' } },
                { say: 'The spell works! **Go back** to the main branch:', options: ['git checkout main', 'git branch magic', 'git add game.py'], answer: 0, op: { checkout: 'main' }, explain: 'The main branch still has no spells. The experiment didn’t touch it.' },
                { say: 'And now **merge** the spells into the main game:', options: ['git merge magic', 'git delete magic', 'git commit magic'], answer: 0, op: { merge: 'magic' } },
              ],
              explain: 'A branch to experiment, then a merge. That’s exactly how they work at Google, Microsoft and Mamram!',
            },
          ],
        },
      },
      quiz: [
        { q: 'What does `git commit` do?', options: ['Deletes the code', 'Saves a version with a message', 'Runs the game'], answer: 1, explain: 'A save point in the history.' },
        { q: 'Why work on a branch?', options: ['To try things without breaking the main code', 'Because it’s green', 'No reason'], answer: 0, explain: 'The main branch stays stable.' },
        { q: 'The code broke after a change. What does Git let you do?', options: ['Go back to the version that worked', 'Nothing', 'Buy a new computer'], answer: 0, explain: 'Time machine!' },
      ],
      outro: 'You control time, {name}! In the last mission before the boss, we hook our code up to **artificial intelligence**.',
    },

    // ───────────────────────── 7
    {
      id: 'm3-7', emoji: '🤖', title: 'Code Meets AI', topic: 'APIs and Vibe Coding', xp: 180, badge: 'vibe',
      story: [
        'We’ve reached the cutting edge, **{name}**. Programmers today don’t work alone. They connect their code to **artificial intelligence**.',
        'We’ll learn two things: how code **talks** to AI, and how to code **with help from** AI, without forgetting to think for yourself.',
      ],
      nuggets: [
        { kicker: 'Concept 1', title: 'What’s an API?', text: 'An `API` is a software "order counter". Your code sends a **request** and gets back a **response**.\nHere we have a ready-made function: `ask_ai("question")`, which returns an answer from a pretend AI.\n`answer = ask_ai("Tell me a joke")`\n`print(answer)`', diagram: D.api, analogy: 'Ordering at a restaurant: you don’t walk into the kitchen. You ask the waiter, and the food shows up.' },
        { kicker: 'Concept 2', title: 'Vibe Coding', text: '**Vibe Coding** means programming by chatting with AI: you explain in plain words what you want, and the AI writes the code.\nBut careful! AI **gets things wrong** sometimes. It can write a bug, or unsafe code.' },
        { kicker: 'Concept 3', title: 'The golden rules', text: '1️⃣ Ask **clearly and precisely**: what goes in, what comes out and what the goal is.\n2️⃣ **Read and understand** every line the AI wrote.\n3️⃣ **Run it and test it**.\n4️⃣ Never paste **passwords** or personal info into an AI.\nThe AI is a helper. **You** are the programmer.' },
      ],
      game: {
        engine: 'combo', title: 'Coding with AI', intro: 'Part 1: code that uses an API. Part 2: the calls a smart Vibe Coder makes.',
        config: {
          parts: [
            {
              engine: 'python', title: 'Connecting to AI',
              config: {
                levels: [
                  { title: 'First Request', task: 'Use `ask_ai` to ask for a **joke**, and **print** the answer.', starter: 'answer = ask_ai("Tell me a joke")\n# print answer\n', tests: [{ expect: '?' }], mustUse: ['ask_ai', 'print'], hint: 'print(answer)', solution: 'answer = ask_ai("Tell me a joke")\nprint(answer)', success: 'Your code sent a request to the AI and got an answer back. That’s an API!' },
                  { title: 'Your Own Chatbot', task: 'Build a chatbot: **3 times**, read a question with `input` and print the answer from `ask_ai`.', starter: 'for i in range(3):\n    question = input("Ask me: ")\n    # send question to ask_ai and print it\n', inputs: [{ label: 'Question 1', value: 'Tell me a joke' }, { label: 'Question 2', value: 'Write a poem' }, { label: 'Question 3', value: 'What is the capital of Israel?' }], tests: [{ stdin: ['Tell me a joke', 'Write a poem', 'What is the capital of Israel?'], expect: ['loop', 'Jerusalem'] }], mustUse: ['ask_ai', 'input'], hint: 'print(ask_ai(question))', solution: 'for i in range(3):\n    question = input("Ask me: ")\n    print(ask_ai(question))', success: 'You built a chatbot! That’s how the smart assistants you know are built, just with a real AI behind them.' },
                ],
              },
            },
            {
              engine: 'fixit', title: 'Smart Vibe Coder',
              config: {
                items: [
                  { emoji: '💬', name: 'The request to the AI', problem: 'You want an AI to write a guessing game. Which request is best?', options: ['"Write a game"', '"Write a Python game where the computer picks a number from 1 to 100 and the player keeps guessing until they get it. After each guess, say higher or lower"', '"game game game!!!"'], answer: 1, explain: 'A precise request: language, rules, input and output.' },
                  { emoji: '🐞', name: 'The code the AI wrote', problem: 'The AI wrote `while guess != secret:` but forgot to ask for a new guess inside the loop.', options: ['Copy it and hand it in, AI is always right', 'I spotted an infinite loop! Ask for a fix or fix it myself', 'Delete everything'], answer: 1, explain: 'Because you understand loops, you caught the AI’s bug!' },
                  { emoji: '🔑', name: 'Help with a bug', problem: 'Your code connects to a server with a password, and it has a bug. You want help from an AI.', options: ['Paste everything, including the real password', 'Replace the password with "XXXX" before sending', 'Send just the password'], answer: 1, explain: 'Never share passwords with AI tools.' },
                  { emoji: '🤔', name: 'Code you don’t understand', problem: 'The AI wrote 30 lines that work, but you don’t get what some of them do.', options: ['Whatever, it works', 'Ask the AI to explain it line by line until you get it', 'Delete the parts you don’t understand'], answer: 1, explain: 'A good programmer understands their code. AI is also a great teacher!' },
                ],
              },
            },
          ],
        },
      },
      quiz: [
        { q: 'What is an API?', options: ['A way for programs to send requests and get answers', 'A kind of virus', 'A keyboard'], answer: 0, explain: 'A software order counter.' },
        { q: 'An AI wrote code for you. What’s next?', options: ['Read it, understand it and test it', 'Send it to everyone without checking', 'Delete it'], answer: 0, explain: 'AI can make mistakes.' },
        { q: 'What should you never send to an AI tool?', options: ['Questions about Python', 'Passwords and personal info', 'A request to explain code'], answer: 1, explain: 'Whatever you send to an AI leaves your computer.' },
      ],
      outro: 'You’re a programmer of the future, {name}: code + AI + common sense. All that’s left is the **Code Base boss**!',
    },

    // ───────────────────────── BOSS
    {
      id: 'm3-boss', boss: true, emoji: '👾', title: 'Boss: Hackathon', topic: 'Final mission: Base 3', xp: 320, badge: 'base3',
      story: [
        '🏆 **Welcome to the Mamram Hackathon!** A hackathon means little time, lots of challenges, and one working product at the end.',
        'The judges want to see that you can plan an algorithm, write Python and work with Git. **{name}, the clock is ticking!**',
      ],
      nuggets: [
        { kicker: 'Quick recap', title: 'The programmer’s toolbox', text: '🧩 **Algorithm**: break it into steps.\n🔁 **Loop**: `for i in range(n):`\n⚖️ **Condition**: `if ... elif ... else:`\n`%` **Remainder**: `14 % 7 == 0`\n📦 `str(n)` turns a number into text. `"7" in "17"` is `True`.\n⏳ **Git**: add → commit.' },
      ],
      game: {
        engine: 'combo', title: 'Hackathon', intro: '3 challenges. Show the judges what you’ve got!',
        config: {
          parts: [
            {
              engine: 'blocks', title: 'Challenge 1: Diamond Maze',
              config: { levels: [{ task: 'Grab **both** diamonds and reach the star. Max **9 blocks**!', grid: ['*...o', '####.', 'o....', '.####', '.....'], start: { x: 4, y: 4, dir: 3 }, maxBlocks: 9, explain: 'A snake maze with loops. The judges are impressed!' }] },
            },
            {
              engine: 'python', title: 'Challenge 2: 7 Boom!',
              config: {
                levels: [{
                  title: '7 Boom', task: '**7 Boom** is a counting game: everyone counts up, but instead of certain numbers you say "Boom". Print the numbers from **1 to 20**, but for every number that divides by 7 **or** has the digit 7 in it, print `Boom` instead.', starter: 'for i in range(1, 21):\n    if i % 7 == 0 or "7" in str(i):\n        # print Boom\n        pass\n    else:\n        # print i\n        pass\n',
                  tests: [{ exact: '1\n2\n3\n4\n5\n6\nBoom\n8\n9\n10\n11\n12\n13\nBoom\n15\n16\nBoom\n18\n19\n20' }], mustUse: ['for', 'if'], hint: 'Replace pass: print("Boom") on top, and print(i) below.',
                  solution: 'for i in range(1, 21):\n    if i % 7 == 0 or "7" in str(i):\n        print("Boom")\n    else:\n        print(i)', success: '7 Boom in Python! You combined a loop, a condition, remainder and text.',
                }],
              },
            },
            {
              engine: 'git', title: 'Challenge 3: Submit',
              config: {
                levels: [{
                  intro: 'The code is ready. Now submit it to the judges with Git.',
                  file: [], history: [{ msg: 'Hackathon start', file: ['# hackathon'] }],
                  steps: [
                    { before: { edit: 'def seven_boom(): ...' }, say: 'Stage the code for saving:', options: ['git add game.py', 'git log', 'git checkout main'], answer: 0, op: { add: 1 } },
                    { say: 'Save a version with a good message:', options: ['git commit -m "7 Boom works"', 'git commit -m "asdfgh"', 'git delete'], answer: 0, op: { commit: '7 Boom works' }, wrong: { 1: 'A message like "asdfgh" tells your team nothing!' } },
                  ],
                  explain: 'Submitted! A clear commit message = a pro programmer.',
                }],
              },
            },
          ],
        },
      },
      quiz: [
        { q: 'What will `print(14 % 7)` show?', options: ['2', '0', '7'], answer: 1, explain: '14 divides by 7 with no remainder.' },
        { q: 'What happens with `while True:` and no break?', options: ['An infinite loop', 'Nothing', 'It runs once'], answer: 0, explain: 'True is always true.' },
        { q: 'Which commit message is best?', options: ['"Fix"', '"Fixed a bug where the game crashed on an empty guess"', '"aaaa"'], answer: 1, explain: 'It explains exactly what changed.' },
        { q: 'What does `def` do?', options: ['Defines a function', 'Deletes a variable', 'Prints'], answer: 0, explain: 'def = define.' },
        { q: 'An AI wrote code for you. Who’s responsible for making sure it works?', options: ['The AI', 'You, the programmer', 'Nobody'], answer: 1, explain: 'You check it, understand it and sign off on it.' },
      ],
      outro: '🏆 **You won the Hackathon!** {name}, you’ve completed **Code Base**. The last base is waiting: **AI Base**, where you’ll build artificial intelligence and digital products.',
    },
  ],
};
