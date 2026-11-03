// Plumber job (§8): rotate pipe tiles until water runs from the outpipe (left) to the inpipe (right).
const PLUMBER_GRID_SIZES = [3, 4, 4, 5]; // later grids stay at the last size
const PLUMBER_PAY_PER_TILE = 10; // §7.2: only finished routes pay; bigger grids pay more

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

// Cells water reaches, entering the outpipe cell from the left.
function wetCells(grid, startRow) {
  const size = grid.length;
  const wet = new Set();
  if (!(grid[startRow][0] & PIPE_W)) return wet;
  const queue = [[startRow, 0]];
  wet.add(`${startRow},0`);
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
      for (let turns = randomInt(4); turns > 0; turns--) row[c] = rotatePipe(row[c]);
    }));
  } while (isRouted(grid, startRow, endRow));
  return { size, startRow, endRow, grid };
}

console.assert(rotatePipe(PIPE_N | PIPE_E) === (PIPE_E | PIPE_S) && rotatePipe(PIPE_W) === PIPE_N, 'rotation is clockwise');
console.assert(isRouted([[PIPE_W | PIPE_E]], 0, 0) && !isRouted([[PIPE_N | PIPE_S]], 0, 0), 'one-tile route check');
console.assert(isRouted([[PIPE_W | PIPE_S, PIPE_N], [PIPE_N | PIPE_E, PIPE_W | PIPE_E]], 0, 1), 'two-by-two elbow route');

function pipeSvg(mask, wet) {
  const ends = { [PIPE_N]: [20, 0], [PIPE_E]: [40, 20], [PIPE_S]: [20, 40], [PIPE_W]: [0, 20] };
  const color = wet ? '#1c6fd1' : '#7a7f86';
  const lines = PIPE_DIRS.filter((d) => mask & d.bit)
    .map((d) => `<line x1="20" y1="20" x2="${ends[d.bit][0]}" y2="${ends[d.bit][1]}"/>`).join('');
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="${color}" stroke-width="10">${lines}</g>`
    + `<circle cx="20" cy="20" r="5" fill="${color}"/></svg>`;
}

const Plumber = {
  name: 'Plumber',

  // Shared job contract: play for the seconds earned, then report through onDone({ earnings, summary }).
  start(container, seconds, onDone) {
    let secondsLeft = Math.ceil(seconds); // Food & Shelter can make earned time fractional
    let solvedCount = 0;
    let earnings = 0;
    let puzzle;

    container.innerHTML = `
      <h2>Plumber: connect the pipes</h2>
      <p>Time left: <strong data-role="time"></strong> seconds &middot; Routes fixed: <strong data-role="solved">0</strong></p>
      <p class="muted">Tap a pipe to turn it. Get water from <strong>Out</strong> on the left to <strong>In</strong> on the right.</p>
      <div class="pipe-grid" data-role="grid"></div>
      <p data-role="message" aria-live="polite"></p>`;
    const part = (role) => container.querySelector(`[data-role="${role}"]`);

    function nextPuzzle() {
      puzzle = makePipePuzzle(PLUMBER_GRID_SIZES[Math.min(solvedCount, PLUMBER_GRID_SIZES.length - 1)]);
      draw();
    }

    function draw() {
      const { size, startRow, endRow, grid } = puzzle;
      const wet = wetCells(grid, startRow);
      const gridEl = part('grid');
      gridEl.style.gridTemplateColumns = `2.5rem repeat(${size}, 1fr) 2.5rem`;
      const cells = [];
      for (let r = 0; r < size; r++) {
        cells.push(Object.assign(document.createElement('span'), { className: 'pipe-end', textContent: r === startRow ? 'Out →' : '' }));
        for (let c = 0; c < size; c++) {
          const button = document.createElement('button');
          button.type = 'button';
          const isWet = wet.has(`${r},${c}`);
          const opens = PIPE_DIRS.filter((d) => grid[r][c] & d.bit).map((d) => d.name).join(' and ');
          button.setAttribute('aria-label', `Row ${r + 1}, column ${c + 1}: opens ${opens}${isWet ? ', has water' : ''}`);
          button.innerHTML = pipeSvg(grid[r][c], isWet);
          button.addEventListener('click', () => turn(r, c));
          cells.push(button);
        }
        cells.push(Object.assign(document.createElement('span'), { className: 'pipe-end', textContent: r === endRow ? '→ In' : '' }));
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
      part('message').textContent = `Water's flowing! +$${pay}. Here's the next job.`;
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
      onDone({ earnings, summary: `You fixed ${solvedCount} ${solvedCount === 1 ? 'route' : 'routes'}.` });
    }

    part('time').textContent = secondsLeft;
    nextPuzzle();
  }
};
