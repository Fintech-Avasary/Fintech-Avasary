// Restocker job (§8): memorize the goods list, then find each shelf from memory in a top-down store.
const RESTOCK_MEMORIZE_SECONDS = 10;
const RESTOCK_ITEM_COUNT = 4;
const RESTOCK_PAY_PER_ITEM = 20; // §7.2: pay scales with correct restocks only
const RESTOCK_GOODS = ['Milk', 'Bread', 'Apples', 'Rice', 'Soap', 'Beans'];

const STORE_COLS = 11;
const STORE_ROWS = 5;
const STORE_TILE = 40;
const STORE_AISLE_COLS = [2, 5, 8]; // Aisle 1, 2, 3
const STORE_SHELF_ROWS = [1, 2, 3]; // Shelf A, B, C
const STORE_SHELF_LETTERS = 'ABC';
const STORE_START = { x: 0, y: 4 };

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

console.assert(adjacentShelf(3, 2).aisle === 1 && adjacentShelf(4, 2).aisle === 2, 'walkway touches only its own aisle');
console.assert(adjacentShelf(0, 0) === null && !isWalkable(2, 1) && !isWalkable(-1, 0), 'shelves and walls block the player');

const Restocker = {
  name: 'Restocker',

  // Shared job contract: play for the seconds earned, then report through onDone({ earnings, summary }).
  start(container, seconds, onDone) {
    const items = makeRestockList();

    function showMemorize() {
      const title = document.createElement('h2');
      title.textContent = 'Restocker: memorize the list';
      const list = document.createElement('ol');
      list.append(...items.map((item) => {
        const row = document.createElement('li');
        row.textContent = `${item.name}: ${shelfName(item)}`;
        return row;
      }));
      const countdown = document.createElement('p');
      countdown.className = 'muted';
      container.replaceChildren(title, list, countdown);

      let secondsLeft = RESTOCK_MEMORIZE_SECONDS;
      countdown.textContent = `Store opens in ${secondsLeft}...`;
      const timer = setInterval(() => {
        secondsLeft -= 1;
        countdown.textContent = `Store opens in ${secondsLeft}...`;
        if (secondsLeft === 0) {
          clearInterval(timer);
          showStore();
        }
      }, 1000);
    }

    function showStore() {
      const player = { ...STORE_START };
      let restocked = 0;
      let secondsLeft = Math.ceil(seconds); // Food & Shelter can make earned time fractional

      container.innerHTML = `
        <h2>Restock from memory</h2>
        <p>Time left: <strong data-role="time"></strong> seconds</p>
        <canvas width="${STORE_COLS * STORE_TILE}" height="${STORE_ROWS * STORE_TILE}"
          role="img" aria-label="Top-down store with three aisles of shelves"></canvas>
        <p data-role="message" aria-live="polite">Walk next to a shelf, then press Stock.</p>
        <div class="job-controls">
          <button type="button" data-move="up" aria-label="Move up">&uarr;</button>
          <button type="button" data-move="left" aria-label="Move left">&larr;</button>
          <button type="button" data-action="stock">Stock</button>
          <button type="button" data-move="right" aria-label="Move right">&rarr;</button>
          <button type="button" data-move="down" aria-label="Move down">&darr;</button>
        </div>
        <p class="muted">Keyboard: arrow keys or WASD to move, E to stock.</p>
        <ul class="job-checklist" data-role="checklist"></ul>`;

      const part = (role) => container.querySelector(`[data-role="${role}"]`);
      const context = container.querySelector('canvas').getContext('2d');

      function draw() {
        context.fillStyle = '#f4f1ea';
        context.fillRect(0, 0, STORE_COLS * STORE_TILE, STORE_ROWS * STORE_TILE);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '14px system-ui, sans-serif';

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
            context.fillStyle = '#ffffff';
            context.fillText(stocked ? `${spot.shelf} ✓` : spot.shelf, (x + 0.5) * STORE_TILE, (y + 0.5) * STORE_TILE);
            if (near && near.aisle === spot.aisle && near.shelf === spot.shelf) {
              context.strokeStyle = '#d9480f';
              context.lineWidth = 3;
              context.strokeRect(x * STORE_TILE + 2, y * STORE_TILE + 2, STORE_TILE - 4, STORE_TILE - 4);
            }
          });
        });

        context.fillStyle = '#2f3e8f';
        context.beginPath();
        context.arc((player.x + 0.5) * STORE_TILE, (player.y + 0.5) * STORE_TILE, STORE_TILE * 0.35, 0, Math.PI * 2);
        context.fill();
      }

      function showChecklist() {
        part('checklist').replaceChildren(...items.map((item, i) => {
          const row = document.createElement('li');
          if (i < restocked) {
            row.textContent = `✓ ${item.name} (done)`;
            row.className = 'muted';
          } else if (i === restocked) {
            row.textContent = `→ ${item.name} (stock this now)`;
            row.className = 'job-current';
          } else {
            row.textContent = item.name;
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
          showChecklist();
          draw();
          if (restocked === items.length) finish();
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

      function finish() {
        clearInterval(timer);
        document.removeEventListener('keydown', onKeyDown);
        container.replaceChildren();
        onDone({
          earnings: restocked * RESTOCK_PAY_PER_ITEM,
          summary: `You restocked ${restocked} of ${items.length} items.`
        });
      }

      part('time').textContent = secondsLeft;
      showChecklist();
      draw();
    }

    showMemorize();
  }
};
