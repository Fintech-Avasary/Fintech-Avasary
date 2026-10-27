# Session logs

Each work session ends with a short log, so the next person (or their agent) knows where things stand. When you say "start", the agent reads the three newest logs before it proposes a plan.

## File names

`YYYY-MM-DD_firstname.md`, using the session date and the teammate's first name in lowercase.

Example: `2026-10-27_ngoc.md`

If you have more than one session in a day, add each one to the same file.

## Format

```markdown
# 2026-10-27 — Ngoc

## Did
- What actually got done this session.

## Decided
- Choices made and the reason for each (e.g. "Use plain JS, no framework, so we can just open index.html").

## Open
- Unresolved questions, bugs or blockers.

## Next
- The concrete next steps, so the next session can pick them up.
```

## Rules

- Keep logs short. Bullet points are fine.
- **Fake data only**, and never paste API keys, secrets or `.env` contents into a log.
- Logs get committed with the rest of the session's changes, after review.
