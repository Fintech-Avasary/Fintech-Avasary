# AGENTS.md

Every teammate's coding agent reads this file first. Keep it short and current.

## What this is

Avasary is a financial literacy game built for our FinTech project. Players learn money skills like budgeting, saving and spending by playing.

## How to run

Plain HTML, CSS and JavaScript. There is no build step and nothing to install.

- Open `index.html` in a web browser.
- After changing a file, refresh the page.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Entry point of the game |
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
