// Pharmacist job (§8): combine vials using the recipe sheet until you make the goal vial.
// Vials aren't used up when mixed, so a starting vial can go into several recipes.
const PHARMACIST_PAY_PER_RECIPE = 20; // §7.2: only a finished goal pays; longer recipe chains pay more
const PHARMACIST_START_VIALS = ['A', 'B', 'C'];
const PHARMACIST_ORDER_STEPS = [2, 3]; // recipes per order: first order, then every later one (kept short on purpose)
const PHARMACIST_DECOYS = 1; // recipes on the sheet that don't lead to the goal

const vialPairKey = (a, b) => [a, b].sort().join('+');

// Recipes the goal depends on, so a puzzle's pay matches its real length.
function neededRecipeCount(recipes, goal) {
  const byOutput = new Map(recipes.map(([a, b, out]) => [out, [a, b]]));
  const needed = new Set();
  (function visit(vial) {
    if (!byOutput.has(vial) || needed.has(vial)) return;
    needed.add(vial);
    byOutput.get(vial).forEach(visit);
  })(goal);
  return needed.size;
}

// A chain of `steps` recipes ending at the goal, plus decoys, in shuffled sheet order.
function makeVialPuzzle(steps) {
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const letters = 'DEFGHIJKLMNOPQRSTUVWXYZ'.split('').sort(() => Math.random() - 0.5); // so the goal letter gives nothing away
  const available = [...PHARMACIST_START_VIALS];
  const usedPairs = new Set();
  const recipes = [];
  function addRecipe(a, b) {
    const out = letters.shift();
    usedPairs.add(vialPairKey(a, b));
    recipes.push([a, b, out]);
    available.push(out);
    return out;
  }
  function freshPair(first) {
    for (let tries = 0; tries < 50; tries++) {
      const a = first || pick(available);
      const b = pick(available.filter((v) => v !== a));
      if (!usedPairs.has(vialPairKey(a, b))) return [a, b];
    }
    return null;
  }
  let last = null;
  for (let i = 0; i < steps; i++) {
    const pair = freshPair(last); // each step uses the one before, so the whole chain is needed
    if (!pair) break;
    last = addRecipe(...pair);
  }
  const goal = last;
  for (let i = 0; i < PHARMACIST_DECOYS; i++) {
    const pair = freshPair(null);
    if (pair) addRecipe(...pair);
  }
  for (let i = recipes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [recipes[i], recipes[j]] = [recipes[j], recipes[i]];
  }
  return { recipes, goal };
}

console.assert(neededRecipeCount([['A', 'B', 'D'], ['D', 'C', 'E'], ['A', 'C', 'F']], 'E') === 2, 'decoy recipes are not counted');
console.assert((() => {
  const { recipes, goal } = makeVialPuzzle(5);
  return neededRecipeCount(recipes, goal) === 5 && new Set(recipes.map(([a, b]) => vialPairKey(a, b))).size === recipes.length;
})(), 'generated puzzle: 5 needed recipes, no pair with two results');

const vialColor = (vial) => `hsl(${(vial.charCodeAt(0) - 65) * 47 % 360} 55% 42%)`;

const Pharmacist = {
  name: 'Pharmacist',
  howTo: [
    'Each order asks for a goal vial. You start with vials A, B and C.',
    'The recipe sheet shows which two vials mix into a new one, for example A + B = D.',
    'Tap two of your vials to mix them. You keep both vials and get the new one too.',
    'Some orders need a few mixes in a row, and one recipe on the sheet is a decoy you don\'t need.',
    `Make the goal vial to fill the order. You earn $${PHARMACIST_PAY_PER_RECIPE} for each mix the order needs.`
  ],
  howToFrames: 8,

  // How-to animation on a 160x120 canvas: tap A, tap B, drops fall and make D, and A and B stay.
  drawHowTo(context, frame) {
    function bottle(vial, x, y, filled, picked) {
      context.fillStyle = filled ? vialColor(vial) : '#ffffff';
      context.fillRect(x + 7, y, 10, 6); // neck
      context.fillRect(x, y + 6, 24, 26); // body
      context.strokeStyle = picked ? '#d9480f' : '#23302b';
      context.lineWidth = picked ? 3 : 2;
      context.strokeRect(x, y + 6, 24, 26);
      context.fillStyle = filled ? '#ffffff' : '#23302b';
      context.fillText(filled ? vial : '?', x + 12, y + 20);
    }
    context.fillStyle = '#f4f1ea';
    context.fillRect(0, 0, 160, 120);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 'bold 12px system-ui, sans-serif';
    context.fillStyle = '#23302b';
    context.fillText('Recipe: A + B = D', 80, 10);
    bottle('A', 20, 24, true, frame === 1 || frame === 2);
    bottle('B', 116, 24, true, frame === 2);
    if (frame === 3 || frame === 4) { // drops fall toward the new vial
      const step = frame - 2; // 1 then 2
      context.fillStyle = vialColor('A');
      context.fillRect(46 + step * 10, 52 + step * 10, 6, 6);
      context.fillStyle = vialColor('B');
      context.fillRect(108 - step * 10, 52 + step * 10, 6, 6);
    }
    bottle('D', 68, 78, frame >= 5, false);
  },

  // Shared job contract: play for the seconds earned, then report through onDone({ earnings, summary }).
  start(container, seconds, onDone) {
    let secondsLeft = Math.ceil(seconds); // Food & Shelter can make earned time fractional
    let solvedCount = 0;
    let earnings = 0;
    let puzzle, owned, selected;

    container.innerHTML = `
      <h2>Pharmacist: mix the goal vial</h2>
      <p>Time left: <strong data-role="time"></strong> seconds &middot; Orders filled: <strong data-role="solved">0</strong></p>
      <p class="vial-goal">Goal: <span data-role="goal"></span></p>
      <div class="vial-sheet">
        <h3>Recipe sheet</h3>
        <ul data-role="recipes"></ul>
      </div>
      <h3>Your vials <span class="muted">(tap two to mix them)</span></h3>
      <div class="vial-shelf" data-role="shelf"></div>
      <p data-role="message" aria-live="polite"></p>`;
    const part = (role) => container.querySelector(`[data-role="${role}"]`);

    function vialBadge(vial) {
      const badge = document.createElement('span');
      badge.className = 'vial';
      badge.style.background = vialColor(vial);
      badge.textContent = vial;
      return badge;
    }

    function nextPuzzle() {
      puzzle = makeVialPuzzle(PHARMACIST_ORDER_STEPS[Math.min(solvedCount, PHARMACIST_ORDER_STEPS.length - 1)]);
      owned = [...PHARMACIST_START_VIALS];
      selected = [];
      part('goal').replaceChildren(vialBadge(puzzle.goal));
      part('recipes').replaceChildren(...puzzle.recipes.map(([a, b, out]) => {
        const row = document.createElement('li');
        row.append(vialBadge(a), ' + ', vialBadge(b), ' = ', vialBadge(out));
        return row;
      }));
      drawShelf();
    }

    function drawShelf() {
      part('shelf').replaceChildren(...owned.map((vial) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'vial';
        button.style.background = vialColor(vial);
        button.textContent = vial;
        button.setAttribute('aria-pressed', selected.includes(vial));
        button.setAttribute('aria-label', `Vial ${vial}`);
        button.addEventListener('click', () => select(vial));
        return button;
      }));
    }

    function select(vial) {
      if (selected.includes(vial)) {
        selected = selected.filter((v) => v !== vial);
        drawShelf();
        return;
      }
      selected.push(vial);
      if (selected.length === 2) mix(...selected);
      drawShelf();
    }

    function mix(a, b) {
      selected = [];
      const recipe = puzzle.recipes.find(([x, y]) => vialPairKey(x, y) === vialPairKey(a, b));
      if (!recipe) {
        part('message').textContent = `${a} + ${b} isn't on the recipe sheet. Try another pair.`;
        return;
      }
      const out = recipe[2];
      if (out === puzzle.goal) {
        const pay = neededRecipeCount(puzzle.recipes, puzzle.goal) * PHARMACIST_PAY_PER_RECIPE;
        earnings += pay;
        solvedCount += 1;
        part('solved').textContent = solvedCount;
        part('message').textContent = `You made ${out}! Order filled: +$${pay}. Here's the next order.`;
        nextPuzzle();
        return;
      }
      if (owned.includes(out)) {
        part('message').textContent = `You already have ${out}.`;
        return;
      }
      owned.push(out);
      part('message').textContent = `${a} + ${b} made ${out}.`;
    }

    const timer = setInterval(() => {
      secondsLeft -= 1;
      part('time').textContent = secondsLeft;
      if (secondsLeft <= 0) finish();
    }, 1000);

    function finish() {
      clearInterval(timer);
      container.replaceChildren();
      onDone({ earnings, summary: `You filled ${solvedCount} ${solvedCount === 1 ? 'order' : 'orders'}.` });
    }

    part('time').textContent = secondsLeft;
    nextPuzzle();
  }
};
