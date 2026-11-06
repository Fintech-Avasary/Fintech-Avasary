# Mock judge review and plan — 2026-11-06

An agent played one Quick play run as a judge and scored it against `docs/Judging_Rubric.md` (fall build phase, five criteria at 20% each). This replaces the plan in `docs/rubric_feedback.md` (2026-11-03), which is now out of date.

**The run:** Restocker in Round 1 (4 items, $44), bought Food & Shelter, Plumber in Round 2 (0 routes, $0), shop (nothing affordable), bike repair of $210 ($4 paid, $206 waived), summary. Desktop browser only, not checked on a phone.

**Verdict:** meets the fall bar and is a likely top-10 pick, with weak spots a finance-minded judge would push on.

## Scorecard

| Criterion | Score | Why |
| --- | --- | --- |
| Aesthetics / UI | 4 / 5 | The pixel style holds together and reads as a game, and the how-to animations help. The Payday and bad-luck screens, which carry the lesson, are plain text. Plumber's 3×3 grid runs past the bottom of a laptop screen. |
| Ease of use | 3.5 / 5 | Quick play gets a judge in with one click, and the whole Workday works without help. Plumber with 0 routes fixed paid $0, which feels bad. Restocker shelves block walking. Payday's two save boxes (dollars and percent) are confusing. |
| Finance understanding | 3.5 / 5 | Strong: wants come from the wallet only, ad-style price tags, a lost wallet can't touch savings, the $10 withdrawal fee, and the Fed $400 figure. Weak: see the judge questions below. |
| AI implementation | 4 / 5 if shown, 2 / 5 if not | `AGENTS.md`, session logs, human review before every commit and fake data only. Judges see none of it without the slide. |
| Creativity / uniqueness | 4 / 5 | Answers buy work time, work earns money, and money choices pay off later. That clearly sets it apart from Kahoot. Visible housing without visible balances is a thoughtful touch. |

## What a judge would ask

1. **"5% every Workday? No real savings account pays that."** The biggest risk with a finance judge. The answer is now in `docs/demo_materials.md`, and the team needs to agree on it.
2. **"I bought the need, the bike repair wiped me out, and $206 was forgiven."** The run ended at $0 either way. A player with nothing loses almost nothing, so waiving looks like a reward for being broke.
3. **"Why was the bill $210 when I earned $44?"** For a weak player, the bill is far bigger than any savings could cover, so the lesson reads as "bad luck is random", not "savers come through".
4. **"Who checked the 23 questions?"** No teammate has reviewed them yet.
5. All three shop items cost more than the $4 wallet, so the impulse-buy choice never came up.

## Plan

### Before Nov 13 (lightning demo): practice and talking points, no risky code

| # | Do | Criterion | Effort |
| --- | --- | --- | --- |
| 1 | Write the 0:00 story (about 60 words). Rehearse the 4 minutes with a timer, covering both bill versions and the lost wallet. | All five | 1 hr |
| 2 | Make the "How we built it with AI" slide. The text is in Part 2 of `docs/demo_materials.md`. | AI | 30 min |
| 3 | Agree on the 5% answer. | Finance | 10 min |
| 4 | A teammate reviews the 23 questions. Then update the "Honest limits" line in the demo script. | Finance | 1 hr |
| 5 | Record the backup video. | Risk | 20 min |

### Before Nov 18 (Final Demo Day, when judges play it themselves): code changes

| # | Do | Criterion | Why |
| --- | --- | --- | --- |
| 6 | **Make bad-luck costs match what the player earned**, for example 30–80% of the Workday's pay, with a minimum. Needs a team decision. | Finance | Fixes "the bill was 5× my pay" and makes saving the thing that decides the outcome. The biggest single lift. |
| 7 | **Make Plumber fit the screen without scrolling.** | Ease of use | Judges play it themselves on Nov 18. |
| 8 | **Make the shop show at least one item the player can afford.** | Finance | So the impulse-buy choice always comes up. |
| 9 | **Ask 2–3 people outside the team to play it with no help.** Note where they get stuck and fix those spots. | Ease of use | The spring rubric asks for evidence of real use, and this starts that story. |
| 10 | **Make the Payday and bad-luck screens look more like the rest of the game**, for example the Resident sprite paying the bill, and money that visibly moves. | Aesthetics | These are the teaching screens and the plainest ones. |
| 11 | Decide on the upgrade price ($40 vs $60–$80). | Finance | Still open from 11-05. |

**Recommended order:** 1–5 this week. The team decides on 6–8 right after Nov 13 so they can be built before Nov 18. Item 6 matters most: it turns "saving helps" from something we say into something the judges see happen.

## Phone playtest — 2026-11-06

Ngoc played each job for a full Workday on a phone, once with Food & Shelter and once without. Pay per Round:

| Job | Upgraded R1 / R2 | Total | Not upgraded R1 / R2 | Total |
| --- | --- | --- | --- | --- |
| Restocker ($11 per item) | $209.00 / $275.00 (19 / 25 items) | $484.00 | $154.00 / $220.00 (14 / 20 items) | $374.00 |
| Plumber ($3.30 per tile) | $181.50 / $237.60 (55 / 72 tiles) | $419.10 | $306.90 / $231.00 (93 / 70 tiles) | $537.90 |
| Pharmacist ($15.40 per mix) | $354.20 / $462.00 (23 / 30 mixes) | $816.20 | $400.40 / $338.80 (26 / 22 mixes) | $739.20 |

What it shows (one run each, so expect noise; assumes 3 of 3 correct each Round):
- All three jobs played to the end on a phone.
- **Pharmacist pays the most**, about 2× Restocker. The 11-05 target was ~$600 a Workday. Could be the "promotion" job (§8), or a balance issue. Not changed.
- **Food & Shelter pays off within one Round**: the extra 9 seconds earned about $46 (Restocker), $40 (Plumber) and $77 (Pharmacist) in R2, against the $40 price. On Plumber it only breaks even. Relevant to item 11.
- **Without the upgrade, R2 swung both ways**: Restocker +43%, Plumber −25%, Pharmacist −15%.
- **Each full Workday covers the biggest bill** (vet bill, up to $400) on a good run, so the loan offer mostly shows for weaker players or big spenders. Relevant to item 6.
