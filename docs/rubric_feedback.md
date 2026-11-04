# Rubric feedback and plan — 2026-11-03

How Avasary stands against `docs/Judging_Rubric.md` (fall build phase, five criteria at 20% each), and what to do before the two judging dates.

- **Lightning demo:** Friday, Nov 13. Judges watch, they don't play.
- **Final Demo Day:** Wednesday, Nov 18. Judges play it themselves.
- The last build Friday is Nov 6.

The weakest criterion is **Finance understanding**: in the current demo, putting money in the bank does no better than keeping it in the wallet.

## Feedback by criterion

### 1. Aesthetics / UI ("clear and reasonably polished for a working prototype")

On track.

- The pixel look, street scenes and "How to work" animations make it read as a game, not a form.
- The Payday, emergency and summary screens are mostly plain text, and those are the screens that carry the finance lesson.
- The Press Start 2P font (about 12px on buttons) hasn't been checked on a real phone.
- Plumber pipes joined to In stay grey, so players can't see that those tiles earn part pay.

### 2. Ease of use ("a real user can complete the core task without hand-holding")

At risk.

- Only the team has played it. On Nov 18, judges play it themselves.
- Switching between the Mayor and Resident portals in one browser needs explaining.
- The new bank-amount box starts at $0, and a first-timer may miss it.

### 3. Finance understanding ("sound finance reasoning: a real problem, credible assumptions and data")

Weakest area.

- **Logic hole:** the emergency can be paid from the wallet or the bank, and there's nothing else to spend wallet money on. So "I saved" and "I didn't save" end the same. A judge may ask "what's the point of the bank?" The spec's core lesson (§12: the saver absorbs the hit, the spender doesn't) can't show yet.
- The numbers are tuned for play, not grounded in real data. Spec §7.2 asks for realistic price relationships.
- All 25 questions were written by an agent and no teammate has reviewed them. One wrong answer on screen costs credibility.
- Easy win: the $400 top of the emergency range matches the Federal Reserve's well-known survey question about covering an unexpected $400 expense (Survey of Household Economics and Decisionmaking). Look up the current figure before quoting it.

### 4. AI implementation ("effective, appropriate, and disclosed use of AI and vibe-coding")

Strong, but not on display.

- Existing evidence: `AGENTS.md`, a log for every session in `logs/`, the human-review rule before any commit, and the fake-data rule.
- Judges won't see any of it unless the team shows it.

### 5. Creativity / uniqueness ("original framing, differentiated from off-the-shelf tools")

A good story that needs sharpening.

- The two linked loops, jobs as mini-games, and choices that carry consequences set it apart from quiz games like Kahoot.
- The pitch should name that difference in one sentence.
- The credit toggle in §15 would be the most memorable moment, but it's blocked on the §11.5 borrowing-limit question.

## Plan

### Before Nov 13 (lightning demo)

1. **Make saving matter.** This needs a team decision first. One option: after Round 2, offer one "want" purchase (for example a phone upgrade or a bike paint job) that only wallet money can pay for. Banking then protects money, and the emergency splits savers from spenders.
2. **Ground the numbers.** Find the real survey figure behind $400, and be ready to explain why jobs pay what they do.
3. **Have a teammate review all 25 questions.**
4. **Write and rehearse a 2-minute script:** Mayor sets emergency to Always → 1 round of questions → Restocker → bank or buy → emergency → summary. Practice on the demo laptop, with Ctrl+F5 first and internet on for the pixel font.
5. **Make one "How we built it with AI" slide.** Show the log routine, the review gate, and one honest example of the AI getting something wrong. For example, Plumber part pay counted only tiles joined to Out, and a playtest caught it on 11-03.

### Before Nov 18 (Final Demo Day)

6. **Hallway test:** have 2–3 people outside the team play it with no help, write down where they get stuck, and fix those spots.
7. **Host it at a URL** (for example GitHub Pages, which suits a static site) so judges can play on their own phones. That publishes the site, so it's a team call.
8. **Credit toggle, as a stretch goal,** if the team settles §11.5 first.
