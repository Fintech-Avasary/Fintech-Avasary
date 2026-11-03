# Claude Code Request — Implement Avasary 2D Jobs

Read `AGENTS.md` and `docs/avasary_design_spec.md` before editing. This request updates the planned job lineup for the Avasary financial-literacy classroom game.

## Product context

Avasary teaches financial literacy through two required loops:

1. Students answer financial-literacy questions to earn **energy**.
2. Energy is the only way to enter a job mini-game; performance in the job earns in-game currency.
3. Students decide whether to bank their currency or spend it on upgrades, then experience the effects of those choices.

Jobs must be quick, readable **2D mini-games**. They are jobs, not unrelated arcade activities: their reward must be performance-scaled and feed into the money-management loop.

## Portals and roles

Build two clearly separate entry experiences:

- **Educator portal (Mayor):** Creates/manages a Block, sets Workday rules, opens the waiting room, starts the Workday, selects which question topics and jobs are available, and controls emergency frequency (`off`, `sometimes`, or `always`).
- **Student/player portal (Resident):** Joins a Block once with its Block code, then returns directly to that Block's waiting room for each Workday. Students never enter a session code.

Do not expose other students’ balances, debt, or a ranked leaderboard to students. They may eventually see classmates’ housing and current location only. The educator view may show more detail if implemented.

For the current demo, auth, persistence, and full dashboards can be stubs, but the UI must make the educator-versus-student portal distinction obvious.

## Job lineup

Replace the previous job plan with these three 2D jobs. Keep them modular so the selected/unlocked job can be changed without rewriting the game flow.

### 1. Plumber — pipe-routing puzzle

Create a 2D grid puzzle where the player connects a water **outpipe** to a water **inpipe** by rotating pipe tiles.

- Tiles include straight, elbow, T-junction, and/or cross pipes as needed.
- Clicking or tapping a tile rotates it 90 degrees.
- The game validates whether there is a continuous valid path from outpipe to inpipe.
- Use small, progressively more complex grids.
- Make the water path, endpoints, and connected state visually obvious.
- Reward should reflect performance, such as completing the route within the allotted time and/or with fewer rotations.

### 2. Restocker — memorize and navigate

Create a 2D store-restocking game with two pages/screens:

1. A **goods list** showing the items that need restocking and their aisle/shelf locations.
2. A **store navigation view** showing the store layout, aisles, and destination locations.

The player first has a brief period to memorize the goods list, then switches to the navigation view and must navigate to the correct locations from memory.

- This replaces the earlier Grocery Dash direction; call the job **Restocker** in the UI.
- Use a top-down 2D store layout.
- Support keyboard movement (arrow keys/WASD) and on-screen touch controls.
- Clearly show completed versus remaining restock targets.
- The time available is paid for with energy earned from correct questions. Food & Shelter multiplies the time earned per correct answer, per spec §7.3.
- Reward scales with correctly completed restocks, not mere participation.

### 3. Pharmacist — vial-combination puzzle

Create a 2D crafting/logic game where the player combines starting vials according to a visible combination sheet to create a goal vial.

Example puzzle:

- Starting vials: `A`, `B`, `C`
- Combination sheet:
  - `A + B = D`
  - `B + C = E`
  - `E + A = F`
  - `C + A = G`
  - `G + F = H`
- Goal vial: `H`

Requirements:

- Make source vials, recipe sheet, inventory, and target vial visually distinct in a 2D interface.
- Players should select or drag two available vials to combine them.
- Only valid recipes create output vials; invalid combinations should provide clear feedback without being confusing.
- Generated vials should become available for later recipes.
- Include puzzle variations after the example is working.
- Reward scales with reaching the target and efficient use of time/moves.

## Implementation constraints

- Plain HTML, CSS, and JavaScript; no build step.
- The current demo path remains: waiting room → Mayor starts → questions → energy → job → currency → bank-or-buy choice → second round → emergency → summary.
- Preserve the two-loop rule: students cannot enter any job without earned energy.
- Keep money/economy figures, question gaps, job swap delays, and job timers as named tunable constants, not scattered literals.
- Comment mechanics with relevant design-spec citations, especially §7.1 (energy gate), §7.2 (performance-scaled earnings), §7.3 (Food & Shelter multiplier), §7.4 (friction timers), §8 (jobs), §10 (privacy), and §15 (demo scope).
- Use fake data only.
- Do not build on `avasary_demo.html`; use `index.html` as the active demo.
- Do not commit or push changes. Prepare them for human review only.

## Suggested delivery order

1. Make the two portal/role entry points visually clear in the active demo.
2. Finish **Restocker** first, because it directly fits the existing question-earned shopping-time flow.
3. Add Plumber as a selectable 2D job.
4. Add Pharmacist as a selectable 2D job.
5. Ensure every job returns a performance-based currency payout into the common bank-or-spend management flow.

Before beginning implementation, report the files you will change and flag any conflict with `AGENTS.md` or the design spec.
