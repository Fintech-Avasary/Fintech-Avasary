# AGENTS.md

Every teammate's coding agent reads this file first. Keep it short and current.

## What this is

Avasary is a financial literacy game built for our FinTech project. Players learn money skills like budgeting, saving and spending by playing.

It's a classroom web game (Kahoot/Prodigy-style). Students answer questions → earn **energy** → spend energy on **mini-games (jobs)** → earn **currency** → manage it across needs, wants, savings, and bad-luck events.

Full design spec (source of truth for all mechanics): @docs/avasary_design_spec.md

### Non-negotiables from the spec

- Two loops must both close: Knowledge (questions → energy) and Management (currency → spending). Energy is the **only** way into mini-games.
- Hierarchy: Account → Block (Mayor + Residents) → Session/Workday. One Block code, used once per student; Workdays start from a waiting room. No session codes.
- Bad-luck absorption order: wallet → bank by default, and the student may choose bank → wallet instead (they can't refuse the charge). Then debt (only if credit system on) → hard floor of 0. Balance never goes negative; unpayable charges are waived. *(Team decision 2026-10-30; overrides §11.3 and §12 until the spec is updated.)*
- The Mayor sets emergencies for each Workday: off, sometimes or always. *(Team decision 2026-10-30; overrides §12 until the spec is updated.)*
- Credit system is an **educator toggle, off by default**. Loans: fixed total owed (principal + rate), repaid by garnishing earnings (20% base + rate). No compounding, no accrual ticks.
- Food & Shelter is a **yield multiplier** on per-answer payout (tokens or seconds), not a flat bonus.
- Residents see each other's housing and location only — never balances, debt, or a leaderboard.
- More expensive = better with diminishing returns; prices follow realistic real-world cost relationships.

### Current scope: demo slice (spec §15)

Build the thinnest path that shows both loops:
waiting room → Mayor starts → 3 questions → energy → 1 job → currency → **bank or buy upgrade** → one bad-luck event → end-of-session summary.
Login, educator dashboard, persistence, city landscape, multiple jobs may be stubbed. The bank-or-spend choice must not be stubbed.

The demo runs 2 rounds of questions and job, with the bank-or-buy choice between them, so an upgrade pays off before the emergency.

Jobs are 2D games. Planned: Grocery Dash (demo job: 10 seconds to memorize the list, then run the aisles on a job budget, using shopping time earned from answers) and Pipe Fixer (buy and rotate pipes on a budget to fix the map). The third job is undecided.

### Working rules

- When the spec is ambiguous, ask rather than guess. Known flag: §11.5 borrowing limit is read as *greater of* 25% of bank or $50 — confirm before relying on it.
- `avasary_demo.html` (village + daily tasks build) is superseded. Do not build on it.
- Keep friction timers (~5s between questions, ~15s on job swap) and loan/bankruptcy numbers as tunable constants, not hardcoded literals.
- Cite the spec section (e.g. §13.2) in comments when implementing a mechanic.

## How to run

Plain HTML, CSS and JavaScript. There is no build step and nothing to install.

- Open `index.html` in a web browser.
- After changing a file, refresh the page.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Entry point of the game |
| `docs/avasary_design_spec.md` | Design spec, the source of truth for all mechanics |
| `logs/` | Session logs, one file per work session (see `logs/README.md`) |
| `AGENTS.md` | This file: instructions for agents |
| `CLAUDE.md` | Imports this file for Claude Code. Don't add anything else to it. |
| `git.sh` | Teammates' manual commit-and-push helper. Agents don't run it (see Git). |

## Rules

1. **Fake data only.** Every name, balance, transaction, account number and similar value in the code, tests, screenshots or logs must be made up. Never use real personal or financial data.
2. **API keys go only in `.env`.** Never hard-code keys or secrets in source files, and never paste them into logs or commit messages. `.env` and `.env.*` are listed in `.gitignore`. Never commit them, and never force-add them.
3. **Nothing gets committed or pushed without a human reviewing it.** The agent prepares the changes and waits for the teammate to approve.

## Git

- We work on `main` and push straight to `origin main`.
- Stage specific files by name. Don't use `git add .`, because it can pick up files that shouldn't go in.
- Don't run `git.sh`. It stages everything and pushes with no review step.
- Never force-push, rewrite history or skip hooks.

## Session routine

### On "start"

1. **Pull if it's safe.** Run `git status`. If the working tree is clean, run `git pull --ff-only origin main`. If there are local changes, or the pull can't fast-forward, stop: tell the teammate what's going on and ask before doing anything else.
2. **Read** this file (`AGENTS.md`).
3. **Read the three newest files in `logs/`** (by date in the filename). Skip `README.md`.
4. **Propose a plan** for this session. Base it on the "Open" and "Next" items in those logs plus whatever the teammate asks for, and wait for them to confirm before starting.

### On "wrap up"

1. **Write the log** to `logs/YYYY-MM-DD_firstname.md`, using today's date and the teammate's first name in lowercase (for example `logs/2026-10-27_ngoc.md`). If you don't know their first name, ask. If that file already exists, add to it instead of overwriting it. Use the format in `logs/README.md`: **Did / Decided / Open / Next**.
2. **Update `AGENTS.md`** if anything here changed this session: how to run the game, the project layout, rules or workflow. Keep the edits small.
3. **Prepare the changes for review.** Stage the files by name. Show the teammate `git status` and `git diff --staged`, then suggest a commit message. **Don't commit or push** until the teammate approves. Once they do, commit and run `git push origin main`.
