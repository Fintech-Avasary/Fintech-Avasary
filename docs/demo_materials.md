# Demo materials — draft 2026-11-05

Drafts for the team to edit: the 2-minute script for the lightning demo (Friday, Nov 13) and the text for the "How we built it with AI" slide. See `docs/rubric_feedback.md` for why each piece is here.

## Part 1: Lightning demo script (2 minutes)

Judges watch and don't play, so one teammate drives and one talks.

### Before you go on

- [ ] Use the demo laptop with internet on, so the pixel font loads.
- [ ] Open `index.html` and press **Ctrl+F5** so no old files are cached.
- [ ] Clear the remembered save percent: open the browser console (F12) and run `localStorage.clear()`, then refresh. Otherwise the percent box is already filled in.
- [ ] Join the Block once ahead of time. Go to the Resident portal and enter `MAPLE1`, so the demo starts in the waiting room.
- [ ] Practice the run twice. The bad-luck event is random, so practice the lines for both a bill and a lost wallet (see 1:35).
- [ ] Record a backup video of a good run in case the live one goes wrong.

**Keeping it to 2 minutes:** each correct answer buys 15 seconds of work. Get **1 question right in each round**, so each job lasts 15 seconds. Getting all three right makes a 45-second job, which won't fit.

### Script

| Time | On screen (driver) | Say (speaker) |
| --- | --- | --- |
| 0:00–0:15 | Waiting room with the street scene | "63% of U.S. adults say they could cover a surprise $400 bill with cash. That leaves more than a third who can't. Avasary lets students feel that problem before they meet it in real life." |
| 0:15–0:25 | Switch to the Mayor portal. Show the job and topic checkboxes, set Emergencies to **Always**, click **Start Workday**. | "The teacher is the Mayor. They pick the jobs and the question topics, and whether bad luck can happen today." |
| 0:25–0:40 | Round 1: answer 3 questions, getting 1 right. | "Students answer money questions. Each right answer is energy, which here means work time. You can't skip the learning, because it's the only way to get to work." |
| 0:40–0:55 | Pick **Restocker** and play the 15 seconds. | "Work time goes to a job. Each job is a quick game, and pay depends on how well you play." |
| 0:55–1:05 | Payday: tick Food & Shelter and type `50` in the percent box. Point at the green "Save for later" box. | "Payday. Spend or save? Food & Shelter makes every right answer worth more. Students can also save a percent of their pay, and the game remembers it, like an automatic transfer." |
| 1:05–1:25 | Round 2: questions (1 right), then Restocker for 15 seconds. | "With Food & Shelter, the same right answer now buys more work time. Needs come first, and they pay off quietly." |
| 1:25–1:35 | Payday 2: point at the shop (sneakers, headphones, game console). Tick one want you can afford and click **Finish the Workday**. | "Now the shop. Wants are paid from the wallet only. Saved money is out of reach of impulse buys." |
| 1:35–1:50 | The bad-luck screen. | **If it's a bill:** "Bad luck: a vet bill. If the wallet is empty, savings can cover it, with a $10 fee for taking the money out." **If it's a lost wallet:** "Lost wallet: the cash is gone, but the savings account is safe. That's the whole lesson in one screen." |
| 1:50–2:00 | The summary with the money table. | "Every Workday ends with a summary of where the money went. Savings also grow 10% every three Workdays. Avasary: learn money by living with your own choices." |

### Questions judges may ask

- **"Why not just a quiz?"** A quiz checks recall. Here, the answers fuel a small economy where choices have consequences: saving, needs before wants, and emergencies.
- **"Where do the numbers come from?"** The $400 top of the bad-luck range comes from the Federal Reserve survey above. Prices follow real relationships: a vet bill costs more than a gift, which costs more than popcorn money. Job pay was tuned in team playtests so that the jobs earn about the same.
- **"What does the teacher see?"** The Mayor portal sets jobs, topics and emergencies. A full teacher dashboard is planned and not built yet.
- **"Can students see each other's money?"** No. Students see only each other's housing and location, so no one is shamed for being behind.

### The $400 figure

- **Claim:** 63% of U.S. adults would cover a $400 emergency expense with cash or its equivalent. The share has been flat since 2024 and is down from 68% in 2021.
- **Source:** Federal Reserve, *Economic Well-Being of U.S. Households in 2025* (Survey of Household Economics and Decisionmaking, released May 2026): <https://www.federalreserve.gov/consumerscommunities/shed.htm>
- **Before quoting it:** this figure came from news coverage of the report. A teammate should check it in the Fed's report itself.

## Part 2: "How we built it with AI" slide

### Slide text

**How we built it with AI**

- **Tool:** Claude Code, an AI coding agent, wrote most of the code. People made the design decisions, reviewed every change and playtested the game.
- **Rules the agent follows** (`AGENTS.md`, read at the start of every session):
  - Fake data only.
  - API keys never go in the code.
  - **Nothing is committed without a person reviewing it.**
- **A log for every session** (`logs/`): what was done, what was decided, what's still open and what's next. A new session picks up from the last log.
- **Testing:** the agent writes automated browser tests and checks that the money adds up after every run. People play the jobs by hand, because the test bot can't solve the puzzles.
- **The AI got it wrong, and we caught it:** Plumber part pay first counted only pipes joined to Out, so building from the In side paid $0. A teammate's playtest found it on Nov 3, and it was fixed the same day.

### Speaker notes

- The design spec is human-written, from Andrew Payton's concept. The agent cites spec sections in code comments, so each rule can be traced back to the design.
- When a request was unclear, the agent asked first. One example: how saving should matter. The team chose the shop, interest every 3 Workdays and the withdrawal fee.
- **Honest limits:** an agent drafted all 24 quiz questions, and a teammate needs to review them. *(Update this line once the review is done.)*
