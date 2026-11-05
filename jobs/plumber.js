// Plumber job (§8): rotate pipe tiles until water runs from the outpipe (left) to the inpipe (right).
const PLUMBER_GRID_SIZES = [3, 4, 4, 5]; // later grids stay at the last size
const PLUMBER_PAY_PER_TILE = 3.30; // 11-05 playtest: cut to ~55% with the other jobs. §7.2: a finished grid pays every tile; bigger grids pay more
// Team decision 2026-11-05: 30% easier. Each tile is scrambled with this chance, so about 30% fewer
// pipes start turned wrong than when every tile was scrambled.
const PLUMBER_SCRAMBLE_SHARE = 0.7;
// Part pay at the whistle: each tile joined to Out or In pays the same rate, so extra seconds (§7.3) always count.

// Tile openings as a bitmask.
const PIPE_N = 1, PIPE_E = 2, PIPE_S = 4, PIPE_W = 8;
const PIPE_DIRS = [
  { bit: PIPE_N, dr: -1, dc: 0, name: 'up' },
  { bit: PIPE_E, dr: 0, dc: 1, name: 'right' },
  { bit: PIPE_S, dr: 1, dc: 0, name: 'down' },
  { bit: PIPE_W, dr: 0, dc: -1, name: 'left' }
];
const PIPE_FILLER = [PIPE_N | PIPE_S, PIPE_N | PIPE_E, PIPE_N | PIPE_E | PIPE_S]; // straight, elbow, T

const rotatePipe = (mask) => ((mask << 1) | (mask >> 3)) & 15; // 90 degrees clockwise
const oppositePipe = (bit) => rotatePipe(rotatePipe(bit));
const randomInt = (n) => Math.floor(Math.random() * n);

// Cells joined to an edge pipe: from the outpipe (left, PIPE_W) this is where water reaches.
function wetCells(grid, startRow, startCol = 0, entryBit = PIPE_W) {
  const size = grid.length;
  const wet = new Set();
  if (!(grid[startRow][startCol] & entryBit)) return wet;
  const queue = [[startRow, startCol]];
  wet.add(`${startRow},${startCol}`);
  while (queue.length) {
    const [r, c] = queue.shift();
    for (const dir of PIPE_DIRS) {
      const nr = r + dir.dr, nc = c + dir.dc, key = `${nr},${nc}`;
      if (nr < 0 || nc < 0 || nr >= size || nc >= size || wet.has(key)) continue;
      if ((grid[r][c] & dir.bit) && (grid[nr][nc] & oppositePipe(dir.bit))) {
        wet.add(key);
        queue.push([nr, nc]);
      }
    }
  }
  return wet;
}

// Tiles joined to Out or to In, so part pay counts work from either end.
const joinedTiles = ({ grid, startRow, endRow }) =>
  new Set([...wetCells(grid, startRow), ...wetCells(grid, endRow, grid.length - 1, PIPE_E)]).size;

const isRouted = (grid, startRow, endRow) =>
  wetCells(grid, startRow).has(`${endRow},${grid.length - 1}`) && Boolean(grid[endRow][grid.length - 1] & PIPE_E);

// Random self-avoiding path from (startRow, 0) to (endRow, size - 1), as a list of [row, col].
function randomPath(size, startRow, endRow) {
  const path = [[startRow, 0]];
  const seen = new Set([`${startRow},0`]);
  function walk() {
    const [r, c] = path[path.length - 1];
    if (r === endRow && c === size - 1) return true;
    for (const dir of shuffledPipeDirs()) {
      const nr = r + dir.dr, nc = c + dir.dc, key = `${nr},${nc}`;
      if (nr < 0 || nc < 0 || nr >= size || nc >= size || seen.has(key)) continue;
      seen.add(key);
      path.push([nr, nc]);
      if (walk()) return true;
      path.pop(); // keep `seen` marked: a dead end stays dead for this search
    }
    return false;
  }
  walk();
  return path;
}

function shuffledPipeDirs() {
  const copy = [...PIPE_DIRS];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makePipePuzzle(size) {
  const startRow = randomInt(size);
  const endRow = randomInt(size);
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => PIPE_FILLER[randomInt(PIPE_FILLER.length)]));
  const path = randomPath(size, startRow, endRow);
  path.forEach(([r, c], i) => {
    const toward = ([r2, c2]) => PIPE_DIRS.find((d) => d.dr === r2 - r && d.dc === c2 - c).bit;
    const inBit = i === 0 ? PIPE_W : toward(path[i - 1]);
    const outBit = i === path.length - 1 ? PIPE_E : toward(path[i + 1]);
    grid[r][c] = inBit | outBit;
  });
  console.assert(isRouted(grid, startRow, endRow), 'generated puzzle has a solution');
  do { // scramble until the route is broken, so there's always work to do
    grid.forEach((row) => row.forEach((_, c) => {
      if (Math.random() >= PLUMBER_SCRAMBLE_SHARE) return; // left as solved
      for (let turns = randomInt(4); turns > 0; turns--) row[c] = rotatePipe(row[c]);
    }));
  } while (isRouted(grid, startRow, endRow));
  return { size, startRow, endRow, grid };
}

console.assert(rotatePipe(PIPE_N | PIPE_E) === (PIPE_E | PIPE_S) && rotatePipe(PIPE_W) === PIPE_N, 'rotation is clockwise');
console.assert(isRouted([[PIPE_W | PIPE_E]], 0, 0) && !isRouted([[PIPE_N | PIPE_S]], 0, 0), 'one-tile route check');
console.assert(isRouted([[PIPE_W | PIPE_S, PIPE_N], [PIPE_N | PIPE_E, PIPE_W | PIPE_E]], 0, 1), 'two-by-two elbow route');
console.assert(joinedTiles({ grid: [[PIPE_W | PIPE_E, PIPE_N | PIPE_S], [PIPE_N | PIPE_E, PIPE_W | PIPE_E]], startRow: 0, endRow: 1 }) === 3, 'joined tiles count from Out and from In');

// Blue: water from Out. Green: joined to In. Both earn part pay, so the player can see it.
const PIPE_COLORS = { out: '#1c6fd1', in: '#1f6f54', none: '#7a7f86' };

function pipeSvg(mask, joinedTo) {
  const ends = { [PIPE_N]: [20, 0], [PIPE_E]: [40, 20], [PIPE_S]: [20, 40], [PIPE_W]: [0, 20] };
  const color = PIPE_COLORS[joinedTo];
  const lines = PIPE_DIRS.filter((d) => mask & d.bit)
    .map((d) => `<line x1="20" y1="20" x2="${ends[d.bit][0]}" y2="${ends[d.bit][1]}"/>`).join('');
  return `<svg viewBox="0 0 40 40" aria-hidden="true" shape-rendering="crispEdges"><g stroke="${color}" stroke-width="12">${lines}</g>`
    + `<rect x="14" y="14" width="12" height="12" fill="${color}"/></svg>`; // square joint for the pixel look
}

const Plumber = {
  name: 'Plumber',
  howTo: [
    'Water comes out at Out on the left and has to reach In on the right.',
    'Tap or click a pipe to turn it a quarter turn. Pipes with water from Out turn blue, and pipes joined to In turn green.',
    'When the blue path joins Out to In, the job is fixed and a new grid appears.',
    `Grids get bigger as you go, and bigger grids pay more ($${PLUMBER_PAY_PER_TILE.toFixed(2)} per tile). If time runs out mid-grid, you're paid for each tile you joined to Out or In.`
  ],
  howToFrames: 8,

  // How-to animation on a 160x120 canvas: tap the middle pipe, it turns, then water flows Out -> In.
  drawHowTo(context, frame) {
    const tile = 28, top = 44, left = 38, half = tile / 2; // leaves room for the Out and In labels
    const turned = frame >= 2;
    const masks = [PIPE_W | PIPE_E, turned ? PIPE_W | PIPE_E : PIPE_N | PIPE_S, PIPE_W | PIPE_E];
    context.fillStyle = '#f4f1ea';
    context.fillRect(0, 0, 160, 120);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 'bold 11px system-ui, sans-serif';
    context.fillStyle = '#23302b';
    context.fillText('Out →', 19, top + half);
    context.fillText('→ In', 141, top + half);
    masks.forEach((mask, i) => {
      const x = left + i * tile;
      context.fillStyle = '#ffffff';
      context.fillRect(x + 1, top + 1, tile - 2, tile - 2);
      context.fillStyle = frame >= 3 + i ? '#1c6fd1' : '#7a7f86'; // water reaches one tile per frame
      context.fillRect(x + half - 4, top + half - 4, 8, 8); // square joint
      if (mask & PIPE_N) context.fillRect(x + half - 4, top, 8, half);
      if (mask & PIPE_S) context.fillRect(x + half - 4, top + half, 8, half);
      if (mask & PIPE_W) context.fillRect(x, top + half - 4, half, 8);
      if (mask & PIPE_E) context.fillRect(x + half, top + half - 4, half, 8);
    });
    if (frame === 1) { // the tap
      context.strokeStyle = '#d9480f';
      context.lineWidth = 3;
      context.strokeRect(left + tile + 2, top + 2, tile - 4, tile - 4);
      context.fillStyle = '#23302b';
      context.fillText('tap!', 80, top + tile + 14);
    }
    if (frame >= 5) {
      context.fillStyle = '#1f6f54';
      context.fillText('Water\'s flowing!', 80, top + tile + 14);
    }
  },

  // Shared job contract: play for the seconds earned, then report through onDone({ earnings, summary }).
  start(container, seconds, onDone) {
    let secondsLeft = Math.ceil(seconds); // Food & Shelter can make earned time fractional
    let solvedCount = 0;
    let earnings = 0;
    let puzzle, startJoined; // tiles already joined when the grid appeared, which don't earn part pay

    container.innerHTML = `
      <h2>Plumber: connect the pipes</h2>
      <p>Time left: <strong data-role="time"></strong> seconds &middot; Routes fixed: <strong data-role="solved">0</strong></p>
      <p class="muted">Tap a pipe to turn it. Get water from <strong>Out</strong> on the left to <strong>In</strong> on the right.</p>
      <div class="pipe-grid" data-role="grid"></div>
      <p data-role="message" aria-live="polite"></p>`;
    const part = (role) => container.querySelector(`[data-role="${role}"]`);

    function nextPuzzle() {
      puzzle = makePipePuzzle(PLUMBER_GRID_SIZES[Math.min(solvedCount, PLUMBER_GRID_SIZES.length - 1)]);
      startJoined = joinedTiles(puzzle);
      draw();
    }

    function draw() {
      const { size, startRow, endRow, grid } = puzzle;
      const wet = wetCells(grid, startRow);
      const toIn = wetCells(grid, endRow, size - 1, PIPE_E);
      const gridEl = part('grid');
      gridEl.style.gridTemplateColumns = `1.75rem repeat(${size}, 1fr) 1.75rem`; // narrow end labels keep 5x5 tiles >= 44px at 360px
      const cells = [];
      for (let r = 0; r < size; r++) {
        cells.push(Object.assign(document.createElement('span'), { className: 'pipe-end', textContent: r === startRow ? 'Out\n→' : '' }));
        for (let c = 0; c < size; c++) {
          const button = document.createElement('button');
          button.type = 'button';
          const key = `${r},${c}`;
          const joinedTo = wet.has(key) ? 'out' : toIn.has(key) ? 'in' : 'none';
          const opens = PIPE_DIRS.filter((d) => grid[r][c] & d.bit).map((d) => d.name).join(' and ');
          const state = { out: ', has water', in: ', joined to In', none: '' }[joinedTo];
          button.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}: opens ${opens}${state}`);
          button.innerHTML = pipeSvg(grid[r][c], joinedTo);
          button.addEventListener('click', () => turn(r, c));
          cells.push(button);
        }
        cells.push(Object.assign(document.createElement('span'), { className: 'pipe-end', textContent: r === endRow ? 'In\n→' : '' }));
      }
      gridEl.replaceChildren(...cells);
    }

    function turn(r, c) {
      puzzle.grid[r][c] = rotatePipe(puzzle.grid[r][c]);
      if (!isRouted(puzzle.grid, puzzle.startRow, puzzle.endRow)) {
        draw();
        container.querySelector(`.pipe-grid button[aria-label^="Row ${r + 1}, column ${c + 1}:"]`).focus();
        return;
      }
      const pay = puzzle.size * puzzle.size * PLUMBER_PAY_PER_TILE;
      earnings += pay;
      solvedCount += 1;
      part('solved').textContent = solvedCount;
      part('message').textContent = `Water's flowing! +$${pay.toFixed(2)}. Here's the next job.`;
      nextPuzzle();
    }

    const timer = setInterval(() => {
      secondsLeft -= 1;
      part('time').textContent = secondsLeft;
      if (secondsLeft <= 0) finish();
    }, 1000);

    function finish() {
      clearInterval(timer);
      container.replaceChildren();
      const partTiles = Math.max(0, joinedTiles(puzzle) - startJoined);
      earnings += partTiles * PLUMBER_PAY_PER_TILE;
      const partNote = partTiles ? ` Part pay: ${partTiles} joined ${partTiles === 1 ? 'tile' : 'tiles'} on the last grid (+$${(partTiles * PLUMBER_PAY_PER_TILE).toFixed(2)}).` : '';
      onDone({ earnings, summary: `You fixed ${solvedCount} ${solvedCount === 1 ? 'route' : 'routes'}.${partNote}` });
    }

    part('time').textContent = secondsLeft;
    nextPuzzle();
  }
};
