# Pitch answers — draft 2026-11-10

One short answer for each of the eight questions the team needs to be able to say out loud. Each is written to take 30 to 40 seconds. Items marked **[TEAM]** need facts or words only the team has. Items marked **[ASSUMPTION]** are plans or guesses, not facts, so don't say them as if they were confirmed.

Sources for outside facts are listed at the bottom. Check any funding detail before quoting it.

## 1. Why we made Avasary (the story)

**[TEAM]** Write this in the team's own words. About 60 words fits the 0:00 row in `docs/demo_materials.md`.

Prompts to answer in a sentence each:
- When did money first feel hard or confusing for someone on the team?
- What did nobody teach you that you wish they had?
- Why a game, and not a class or a quiz?

Frame to use once the story is written: *personal moment → the problem in question 2 → "so we built a game where you live it first."*

Borrowed from 1in8b and Oregon Trail: a one-line hook, and a story about how it was made. Our hook could be **"The Oregon Trail of money."** Players manage what they have, then random bad luck hits.

## 2. The problem (one clear sentence)

> Most students never practice money decisions before real ones cost them. 63% of U.S. adults say they could cover a surprise $400 bill with cash, which leaves more than a third who can't.

- The 63% figure is from the Federal Reserve's SHED survey (released May 2026). Ngoc checked it in the Fed's report on Nov 5.
- Why classrooms miss it: a quiz tests recall, but nothing makes a student feel what an emergency does to someone with no savings.
- What Avasary does: answers earn work time, work earns money, and one bad-luck event shows the difference between a saver and a spender.

## 3. The demo works for judges

What is ready:
- **Quick play** on the first screen: one click joins the Block and starts a Workday. No setup.
- The 4-minute script and the judge Q&A are in `docs/demo_materials.md`.
- Three jobs (Restocker, Plumber, Pharmacist) are built and were played by hand on a phone.

What the team still has to do before Nov 13:
- [ ] Record the backup video of a good run.
- [ ] Open `index.html` by double-click and confirm the admin password unlock works there (never tested; Playwright blocks `file://`).
- [ ] Run `localStorage.clear()` and refresh before each judge pair.
- [ ] Practice with a timer: the 4 minutes, a bill, and a lost wallet.
- [ ] Tell judges the Plumber grid scrolls on a laptop, and suggest Restocker first.

## 4. Future plans (what happens to the game)

Say this in order, near to far. **[ASSUMPTION]** All of it is a plan, not a commitment.

1. **Next 1 to 2 weeks (before Nov 18):** bad-luck costs scale with what the player earned, Plumber fits the screen, the shop always shows one affordable item, and 2 or 3 people outside the team play it with no help (`docs/judge_review.md` items 6 to 10).
2. **Next:** a real teacher dashboard, accounts, saved progress and multi-device play. Today the Mayor and Residents share one browser. Children's data needs a privacy plan first.
3. **Then:** a free classroom pilot with a Tennessee teacher, with a short before-and-after check of what students learned.
4. **Later:** more jobs, the credit system with debt and bankruptcy (§13.4 to §13.5), the city map, and more question topics.

## 5. How it gets noticed in the market

**[ASSUMPTION]** Not tested. Ideas ranked by cost:

- **Teacher word of mouth.** Teachers share what works. A one-page teacher guide and a ready lesson plan make Avasary easy to adopt. 1in8b does the same with a teachers' guide and a classroom mode.
- **A memorable hook.** "The Oregon Trail of money." Most adults remember learning from Oregon Trail, which started as an 8th-grade class project.
- **Free pilots.** Other vendors give schools a free first year (WealthWise Kids does). Free first, then pay.
- **Real data in the game.** 1in8b ties every outcome to real statistics. We have the Fed's $400 figure and could add a few more.
- **A visible character.** The Smokey sprite is memorable, but "Go Vols" and Smokey are UT trademarks. Check before publishing outside UT.

## 6. Who the customer is

- **User:** middle and high school students in a financial literacy or economics class.
- **Buyer:** the teacher first, then the school or district.
- **Why Tennessee:** Tennessee has required a half-credit personal finance course for graduation since the Class of 2013 (Tennessee Financial Literacy Act, signed June 23, 2010). A game that supports that course fits an existing requirement. Champlain's report says it is not clear how Tennessee measures financial-literacy achievement, which is where a summary of what each student did could help.
- **Not the customer yet:** parents, and students paying for themselves.

**[TEAM]** Confirm the grade range. The docs say "middle schoolers", while the funding programs I found are aimed at grades 9 to 12.

## 7. Risks and the backup plan

| Risk | Backup |
| --- | --- |
| The live demo breaks | Backup video of a good run; the game runs offline from one file with no server |
| Stale files from an old run (cached jobs, clothes bought earlier) | Ctrl+F5, then `localStorage.clear()` and refresh before every judge pair |
| A judge hits Plumber's scroll or a $0 pay | Suggest Restocker first; warn about the Plumber grid |
| A bad-luck bill looks far bigger than the player's pay | Say that bad luck isn't fair, which is why an emergency fund matters. A fix is planned (item 6) |
| "The bill was forgiven. Doesn't that reward having no money?" | The summary says what would happen in real life. With credit on, the gap becomes a loan repaid from pay |
| "5% every Workday isn't realistic" | True on purpose: real rates would be invisible in one class period. It's one constant we can change. **[TEAM]** agree on this answer |
| Quiz questions were drafted by AI | A teammate reviews them. **[TEAM]** update the "Honest limits" line once done |
| The admin password check runs in the browser | Fine for a demo, not for classrooms. Real educator accounts replace it (§3.1) |
| No student has tested it | Be open about it. Plan: 2 or 3 outside players before Nov 18, then a classroom pilot |
| The team's laptop fails | A second device with the game open (phone playtests worked) |

## 8. Sponsor, funding, and why it's worth investing in

**Where we stand today (fact):** Avasary costs $0 to run. It is plain HTML, CSS and JavaScript, with no server and no database. We have no sponsor and no funding.

**Why it's worth backing:**
- It targets a requirement schools already have (Tennessee's personal finance course).
- It teaches by consequence, not recall: both loops (knowledge and money management) close in one 10-minute Workday.
- Costs stay near zero until accounts and hosting are added.
- AI-assisted building keeps the team small and fast, and the process is disclosed.

**Funding paths [ASSUMPTION — none confirmed for Avasary, check each before quoting]:**
- **School funds:** WealthWise Kids says schools can use federal Title IV-A, Title IV-B (21st Century Community Learning Centers), Title I and Perkins V money for financial literacy products. That is a vendor's claim, so check it with a district.
- **Sponsor-funded programs:** banks and brokerages already fund free classroom financial literacy games. Examples: the H&R Block Budget Challenge (classroom grants up to $5K; the source is about 5 years old), AXA Equitable's $100,000 grant to SADD for a 2019 to 2020 pilot, and Schwab's Moneywise America.
- **State:** the CFPB lists a Tennessee Financial Literacy Commission grant for teacher training (old entry, may no longer be open).
- **Model to copy:** free pilot first, then a paid plan. Credit it to WealthWise Kids, not to ourselves.

**What to say if asked "who funds you?":** "Nobody yet. It costs us nothing to run today. Our plan is a free classroom pilot, then school Title funds or a sponsor like the banks that already fund this."

**[TEAM]** Add any real sponsor, mentor, advisor or university program, and what the money would be spent on (hosting, accounts, privacy review, a teacher pilot).

## What we took from the two reference games

| Idea | From | How we could use it |
| --- | --- | --- |
| A fate you didn't choose | 1in8b ("Who will you be born as?") | Our bad-luck event is the same idea: saving decides how it lands |
| Real statistics behind outcomes | 1in8b (172 countries, UN and World Bank data) | Add 2 or 3 sourced numbers beyond the Fed's 63% |
| A reflection pause | 1in8b (stops at ages 5, 15, 30, 50, 70) | One reflective question on the summary screen |
| Classroom mode and teachers' guide | 1in8b | A one-page teacher guide |
| Telling how it was made | 1in8b ("Eight Lines") | Our "How we built it with AI" slide and logs |
| Manage supplies, then random events | Oregon Trail | The bank-or-buy choice, then the bad-luck event |
| Grew from a classroom | Oregon Trail | Our pilot plan with a real teacher |

Note: I read only 1in8b's landing page, not the game. It names no sponsor.

## Sources

- Federal Reserve SHED: <https://www.federalreserve.gov/consumerscommunities/shed.htm>
- 1in8b: <https://1in8b.life/en/>
- Oregon Trail: <https://en.wikipedia.org/wiki/The_Oregon_Trail_(1985_video_game)>, <https://seriousgamessociety.org/2016/09/22/at-the-roots-of-serious-games-the-oregon-trail/>
- Tennessee requirement: <https://financialliteracy.champlain.edu/?p=1663>, <https://www.personalfinancelab.com/?p=36134>
- WealthWise Kids funding page: <https://wealthwisekids.org/pricing>
- H&R Block Budget Challenge: <https://www.hrbds.org>
- AXA grant: <https://401kspecialistmag.com/axa-grant-gives-high-school-financial-literacy-a-boost/>
- Schwab Moneywise America: <https://www.aboutschwab.com/financial-empowerment>
- CFPB K-12 guide: <https://files.consumerfinance.gov/f/201504_cfpb_advancing-k-12-financial-education-a-guide-for-policymakers.pdf>
