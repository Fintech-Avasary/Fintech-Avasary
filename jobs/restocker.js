// Restocker job (§8): the grocery list shows each item's aisle and shelf; walk the top-down store and stock them.
// Team decision 2026-11-03: the list stays visible, replacing the memorize-first version.
const RESTOCK_ITEM_COUNT = 4; // per batch; new batches keep coming until work time runs out, so pay scales with time (§7.3)
const RESTOCK_PAY_PER_ITEM = 20; // §7.2: pay scales with correct restocks only
const RESTOCK_GOODS = ['Milk', 'Bread', 'Apples', 'Rice', 'Soap', 'Beans'];

const STORE_COLS = 11;
const STORE_ROWS = 5;
const STORE_TILE = 40;
const STORE_AISLE_COLS = [2, 5, 8]; // Aisle 1, 2, 3
const STORE_SHELF_ROWS = [1, 2, 3]; // Shelf A, B, C
const STORE_SHELF_LETTERS = 'ABC';
const STORE_START = { x: 0, y: 4 };
// Pixel-art Resident: h hair, s skin, e eyes, b shirt, p pants, . empty.
const PLAYER_SPRITE = ['..hhhh..', '.hhhhhh.', '.sesses.', '.ssssss.', 'bbbbbbbb', 'sbbbbbbs', '.pppppp.', '.pp..pp.'];
const SPRITE_COLORS = { h: '#3b2a1a', s: '#e0a878', e: '#23302b', b: '#2f3e8f', p: '#23302b' };

function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shelfAt(x, y) {
  const aisleIndex = STORE_AISLE_COLS.indexOf(x);
  const shelfIndex = STORE_SHELF_ROWS.indexOf(y);
  if (aisleIndex < 0 || shelfIndex < 0) return null;
  return { aisle: aisleIndex + 1, shelf: STORE_SHELF_LETTERS[shelfIndex] };
}

function adjacentShelf(x, y) {
  return shelfAt(x - 1, y) || shelfAt(x + 1, y) || shelfAt(x, y - 1) || shelfAt(x, y + 1);
}

function isWalkable(x, y) {
  return x >= 0 && x < STORE_COLS && y >= 0 && y < STORE_ROWS && !shelfAt(x, y);
}

function makeRestockList() {
  const spots = STORE_AISLE_COLS.flatMap((x) => STORE_SHELF_ROWS.map((y) => shelfAt(x, y)));
  const shuffledSpots = shuffled(spots);
  return shuffled(RESTOCK_GOODS).slice(0, RESTOCK_ITEM_COUNT).map((name, i) => ({ name, ...shuffledSpots[i] }));
}

const shelfName = (spot) => `Aisle ${spot.aisle}, Shelf ${spot.shelf}`;

const PLAYER_SPRITE_STEP = [...PLAYER_SPRITE.slice(0, 7), '..pppp..']; // legs together: second walking frame

// 8x8 sprite centered in the tile at tile position (x, y). Also used by the city scenes in index.html.
function drawResident(context, x, y, tile, sprite = PLAYER_SPRITE, colors = SPRITE_COLORS) {
  const pixel = tile / 10;
  sprite.forEach((row, sy) => [...row].forEach((key, sx) => {
    if (!colors[key]) return;
    context.fillStyle = colors[key];
    context.fillRect(x * tile + (sx + 1) * pixel, y * tile + (sy + 1) * pixel, pixel, pixel);
  }));
}

// How-to animation: walk from the door to Shelf B and stock it.
const RESTOCK_DEMO_PATH = [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [4, 4], [4, 3], [4, 2]];
const RESTOCK_DEMO_HOLD = 4; // frames showing the stocked shelf

console.assert(adjacentShelf(3, 2).aisle === 1 && adjacentShelf(4, 2).aisle === 2, 'walkway touches only its own aisle');
console.assert(adjacentShelf(0, 0) === null && !isWalkable(2, 1) && !isWalkable(-1, 0), 'shelves and walls block the player');

const Restocker = {
  name: 'Restocker',
  howTo: [
    'Your grocery list shows each item with its aisle and shelf, for example "Milk: Aisle 2, Shelf B".',
    'Walk next to that shelf with the arrow keys or WASD (or the on-screen arrows).',
    'Press E (or Stock) to put the item on the shelf. Stock items in list order, marked with →.',
    'A wrong shelf earns nothing, so check the list before you stock.',
    `When the list is done, a new list arrives. You earn $${RESTOCK_PAY_PER_ITEM} per item stocked.`
  ],
  howToFrames: RESTOCK_DEMO_PATH.length + RESTOCK_DEMO_HOLD,

  // Draws one frame of the how-to animation on a 160x120 canvas (20px tiles, 8x6).
  drawHowTo(context, frame) {
    const tile = 20;
    const [x, y] = RESTOCK_DEMO_PATH[Math.min(frame, RESTOCK_DEMO_PATH.length - 1)];
    const stocked = frame >= RESTOCK_DEMO_PATH.length;
    for (let ty = 0; ty < 6; ty++) {
      for (let tx = 0; tx < 8; tx++) {
        context.fillStyle = (tx + ty) % 2 ? '#ebe6d9' : '#f4f1ea';
        context.fillRect(tx * tile, ty * tile, tile, tile);
      }
    }
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 'bold 11px system-ui, sans-serif';
    context.fillStyle = '#23302b';
    context.fillText('Milk: Shelf B', 80, 10);
    [...'ABC'].forEach((letter, i) => {
      const isB = letter === 'B';
      context.fillStyle = stocked && isB ? '#1f6f54' : '#8a6d4b';
      context.fillRect(5 * tile + 1, (i + 1) * tile + 1, tile - 2, tile - 2);
      context.fillStyle = '#ffffff';
      context.fillText(stocked && isB ? '✓' : letter, 5.5 * tile, (i + 1.5) * tile);
    });
    if (x === 4 && y === 2) { // next to Shelf B: the orange outline means E will stock it
      context.strokeStyle = '#d9480f';
      context.lineWidth = 2;
      context.strokeRect(5 * tile + 2, 2 * tile + 2, tile - 4, tile - 4);
    }
    const walking = frame < RESTOCK_DEMO_PATH.length - 1;
    drawResident(context, x, y, tile, walking && frame % 2 ? PLAYER_SPRITE_STEP : PLAYER_SPRITE);
  },

  // Shared job contract: play for the seconds earned, then report through onDone({ earnings, summary }).
  start(container, seconds, onDone) {
    const player = { ...STORE_START };
    let secondsLeft = Math.ceil(seconds); // Food & Shelter can make earned time fractional
    let totalRestocked = 0;
    let items;

    function showStore() {
      let restocked = 0;

      container.innerHTML = `
        <h2>Restocker: stock the shelves</h2>
        <p>Time left: <strong data-role="time"></strong> seconds &middot; Items stocked: <strong data-role="total">0</strong></p>
        <div class="restock-layout">
          <div class="restock-list">
            <h3>Grocery list</h3>
            <ul class="job-checklist" data-role="checklist"></ul>
          </div>
          <div class="restock-store">
            <canvas width="${STORE_COLS * STORE_TILE}" height="${STORE_ROWS * STORE_TILE}"
              role="img" aria-label="Top-down store with three aisles of shelves"></canvas>
          </div>
        </div>
        <p data-role="message" aria-live="polite">Walk next to a shelf, then press Stock.</p>
        <div class="job-controls">
          <button type="button" data-move="up" aria-label="Move up">&uarr;</button>
          <button type="button" data-move="left" aria-label="Move left">&larr;</button>
          <button type="button" data-action="stock">Stock</button>
          <button type="button" data-move="right" aria-label="Move right">&rarr;</button>
          <button type="button" data-move="down" aria-label="Move down">&darr;</button>
        </div>
        <p class="muted">Keyboard: arrow keys or WASD to move, E to stock.</p>`;

      const part = (role) => container.querySelector(`[data-role="${role}"]`);
      const context = container.querySelector('canvas').getContext('2d');

      function draw() {
        for (let y = 0; y < STORE_ROWS; y++) { // checkered floor tiles
          for (let x = 0; x < STORE_COLS; x++) {
            context.fillStyle = (x + y) % 2 ? '#ebe6d9' : '#f4f1ea';
            context.fillRect(x * STORE_TILE, y * STORE_TILE, STORE_TILE, STORE_TILE);
          }
        }
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = 'bold 14px system-ui, sans-serif'; // pixel font made B/C look like 8/0 at this size

        const near = adjacentShelf(player.x, player.y);
        const done = items.slice(0, restocked);
        STORE_AISLE_COLS.forEach((x, aisleIndex) => {
          context.fillStyle = '#23302b';
          context.fillText(`Aisle ${aisleIndex + 1}`, (x + 0.5) * STORE_TILE, 0.5 * STORE_TILE);
          STORE_SHELF_ROWS.forEach((y) => {
            const spot = shelfAt(x, y);
            const stocked = done.some((item) => item.aisle === spot.aisle && item.shelf === spot.shelf);
            context.fillStyle = stocked ? '#1f6f54' : '#8a6d4b';
            context.fillRect(x * STORE_TILE + 1, y * STORE_TILE + 1, STORE_TILE - 2, STORE_TILE - 2);
            context.fillStyle = 'rgba(0, 0, 0, 0.25)'; // plank lines
            context.fillRect(x * STORE_TILE + 1, y * STORE_TILE + 1, STORE_TILE - 2, 4);
            context.fillRect(x * STORE_TILE + 1, (y + 1) * STORE_TILE - 5, STORE_TILE - 2, 4);
            context.fillStyle = '#ffffff';
            context.fillText(stocked ? `${spot.shelf} ✓` : spot.shelf, (x + 0.5) * STORE_TILE, (y + 0.5) * STORE_TILE);
            if (near && near.aisle === spot.aisle && near.shelf === spot.shelf) {
              context.strokeStyle = '#d9480f';
              context.lineWidth = 3;
              context.strokeRect(x * STORE_TILE + 2, y * STORE_TILE + 2, STORE_TILE - 4, STORE_TILE - 4);
            }
          });
        });

        drawResident(context, player.x, player.y, STORE_TILE);
      }

      function showChecklist() {
        part('checklist').replaceChildren(...items.map((item, i) => {
          const row = document.createElement('li');
          if (i < restocked) {
            row.textContent = `✓ ${item.name}: ${shelfName(item)}`;
            row.className = 'muted';
          } else if (i === restocked) {
            row.textContent = `→ ${item.name}: ${shelfName(item)}`;
            row.className = 'job-current';
          } else {
            row.textContent = `${item.name}: ${shelfName(item)}`;
          }
          return row;
        }));
      }

      function move(dx, dy) {
        if (isWalkable(player.x + dx, player.y + dy)) {
          player.x += dx;
          player.y += dy;
          draw();
        }
      }

      function stock() {
        const spot = adjacentShelf(player.x, player.y);
        const item = items[restocked];
        if (!spot) {
          part('message').textContent = 'Walk next to a shelf first.';
        } else if (spot.aisle === item.aisle && spot.shelf === item.shelf) {
          restocked += 1;
          part('message').textContent = `${item.name} stocked!`;
          part('total').textContent = totalRestocked + restocked;
          if (restocked === items.length) {
            part('message').textContent = `${item.name} stocked! List done, here's a new delivery.`;
            nextBatch();
          } else {
            showChecklist();
            draw();
          }
        } else {
          // A wrong shelf costs only the time spent walking to it.
          part('message').textContent = `Wrong shelf for ${item.name}: this is ${shelfName(spot)}.`;
        }
      }

      const MOVES = {
        up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0],
        arrowup: [0, -1], arrowdown: [0, 1], arrowleft: [-1, 0], arrowright: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
      };

      function onKeyDown(event) {
        const key = event.key.toLowerCase();
        if (key === 'e' && !event.repeat) stock();
        else if (key.length === 1 || key.startsWith('arrow')) {
          if (!MOVES[key]) return;
          event.preventDefault(); // stop arrow keys scrolling the page
          move(...MOVES[key]);
        }
      }

      container.querySelector('.job-controls').addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.dataset.action === 'stock') stock();
        else move(...MOVES[button.dataset.move]);
      });
      document.addEventListener('keydown', onKeyDown);

      const timer = setInterval(() => {
        secondsLeft -= 1;
        part('time').textContent = secondsLeft;
        if (secondsLeft <= 0) finish();
      }, 1000);

      function nextBatch() {
        totalRestocked += restocked;
        items = makeRestockList();
        restocked = 0;
        showChecklist();
        draw();
      }

      function finish() {
        clearInterval(timer);
        document.removeEventListener('keydown', onKeyDown);
        totalRestocked += restocked;
        container.replaceChildren();
        onDone({
          earnings: totalRestocked * RESTOCK_PAY_PER_ITEM,
          summary: `You restocked ${totalRestocked} items.`
        });
      }

      part('time').textContent = secondsLeft;
      items = makeRestockList();
      showChecklist();
      draw();
    }

    showStore();
  }
};
