# Demo materials — draft 2026-11-05

Drafts for the team to edit: the lightning demo plan (Friday, Nov 13) and the text for the "How we built it with AI" slide. See `docs/rubric_feedback.md` for why each piece is here, and `docs/FinTech-RockyTop-LightningDemo-Student-Guide.md` for the event format.

## Part 1: Lightning demo (10 minutes, twice)

Each demo is 10 minutes with a pair of judges at our station: **4 minutes that are ours** (no questions), then **6 minutes where judges play and ask questions**. We run it from our own laptop.

### Before you go on

- [ ] Laptop and power cord. A phone with the game open is optional, but judges may try it there.
- [ ] Open `index.html` and press **Ctrl+F5** so no old files are cached. With internet the pixel font loads; without it, headings fall back to plain monospace and everything still works.
- [ ] Clear what the browser remembers (the save percent, the wardrobe look and clothes bought in earlier runs): open the browser console (F12) and run `localStorage.clear()`, then refresh.
- [ ] Practice the 4 minutes with a timer. The bad-luck event is random, so practice the lines for a bill and for a lost wallet (see 3:00).
- [ ] Record a backup video of a good run in case the live one goes wrong.
- [ ] Between judge pairs, run `localStorage.clear()` in the console and refresh, so the next judges start from zero. A refresh alone keeps the clothes the last judges bought.

### The first 4 minutes (ours)

One teammate drives, one talks. Each correct answer buys 15 seconds of work (18 with Food & Shelter), so get **1 or 2 questions right in Round 1 and only 1 in Round 2**. Two right answers in Round 2 give 36 seconds of work, which doesn't fit the 30-second slot.

Drive **Restocker** in both rounds and play it well. It's the easiest job to read from across the table and it pays steadily. Plumber's 3×3 grid runs past the bottom of a laptop screen, and a run with no routes fixed pays $0.

| Time | On screen (driver) | Say (speaker) |
| --- | --- | --- |
| 0:00–0:40 | Portal choice screen | **The problem and our story.** "63% of U.S. adults say they could cover a surprise $400 bill with cash. That leaves more than a third who can't." *(Add one or two sentences on why this matters to us.)* "Avasary lets students feel that problem in class, before they meet it in real life." |
| 0:40–1:00 | Open the **Mayor portal**. Show the job and topic checkboxes, set Emergencies to **Always**, click **Start Workday**. | "The teacher is the Mayor. They pick the jobs and question topics, and whether bad luck can happen today." |
| 1:00–1:20 | Round 1: answer 3 questions, getting 1 or 2 right. | "Students answer money questions. Each right answer is energy, which here means work time. It's the only way to get to work, so the learning can't be skipped." |
| 1:20–1:50 | Pick **Restocker**, read the how-to for a second, and play. | "Work time goes to a job. Each job is a quick game, and pay depends on how well you play." |
| 1:50–2:10 | Payday: tick Food & Shelter and type `50` in the percent box. Point at the green "Save for later" box. | "Payday: spend or save? Food & Shelter makes every right answer worth more. Students can save a percent of their pay, and the game remembers it, like an automatic transfer." |
| 2:10–2:40 | Round 2: questions (get 1 right), then Restocker. | "With Food & Shelter, the same right answer buys more work time. Needs come first, and they pay off quietly." |
| 2:40–3:00 | Payday 2: point at the shop (3 random items each time). Tick one want you can afford and click **Finish the Workday**. If it's clothes, the Resident wears them right away. | "Now the shop. Wants are paid from the wallet only, so saved money is out of reach of impulse buys. And look at the price tags: 'Actual price', 'now only', 'today only'. That's how real ads make a price feel small." **If nothing fits the wallet:** don't tick anything. "Nothing here fits my wallet, and the savings account can't be raided for it. That's the point." |
| 3:00–3:20 | The bad-luck screen. | **A bill** (popcorn money, a gift, a bike repair or a vet bill): "Bad luck: a [bill]. If the wallet is empty, savings can cover it, with a $10 fee for taking the money out." **A lost wallet:** "Lost wallet: the cash is gone, but the savings account is safe." **If part of the bill is waived:** "We couldn't cover it all. Today the rest is waived, and the summary says what would happen in real life: it becomes debt." |
| 3:20–4:00 | The summary. Point at the bold line at the top, then the money table. | "Every Workday ends with one line that ties the bad luck back to saving, then where every dollar went. Savings grow 5% at the end of every Workday, and money carries over. Now it's your turn: try it." |

### Minutes 4–10 (judges play and ask)

- Refresh the page and hand over the laptop (or the phone) on the portal choice screen. Point at **Quick play**: one click joins the Block and starts a Workday with all jobs and topics, and bad luck always happens (which event is still random). No setup, no hand-holding.
- If they ask which job to try, suggest Restocker first. If they pick Plumber on a laptop, tell them the grid scrolls.
- While they play, answer questions. If there's time, walk through a second Workday to show money carrying over.
- Be open about shortcomings and where we're going (the guide encourages it). See "What's not built yet" below.

### Under the hood: ready answers

The guide lists these as examples judges may ask about, not a checklist.

| Question | Answer |
| --- | --- |
| **Database?** | None yet. The game is plain HTML, CSS and JavaScript, and progress lives in the browser for the session. Accounts and a hosted database are the next step after the demo. |
| **How does it get its data? Do users input data?** | The questions are written by the team. Students only input answers, purchases and how much to save. There are no names or real money. |
| **Hosting and cost?** | It runs from a single file on the laptop and costs $0. Hosting it as a static site is free or close to free. |
| **AI tools?** | Claude Code wrote most of the code under our rules (see Part 2). |
| **User data: what's stored, who sees it?** | Nothing leaves the device. The only things saved are the save percent and the wardrobe look (including bought clothes), in this browser. Students are middle schoolers, so collecting accounts needs a privacy plan first, and that's on our roadmap. |
| **Data sources with terms or limits?** | The one outside figure is the Federal Reserve's SHED survey, which is public. |
| **Live vs. stand-in data?** | Everything is stand-in. The Block, Residents and prices are made up. Prices follow real relationships, and the $400 top of the bad-luck range comes from the Fed survey. |

### What's not built yet

- The Mayor and Residents share one browser. Real multi-device play needs a backend.
- No accounts or saved progress between visits.
- The credit system (loans, debt, bankruptcy in the spec) isn't built.
- The 23 questions were drafted by AI and still need a teammate's review.
- Nothing has been tested with students yet.

### Questions judges may ask

- **"Why not just a quiz?"** A quiz checks recall. Here, the answers fuel a small economy where choices have consequences: saving, needs before wants, and emergencies.
- **"Where do the numbers come from?"** The $400 top of the bad-luck range comes from the Federal Reserve survey below. Prices follow real relationships: a vet bill costs more than a gift, which costs more than popcorn money. Job pay was tuned in team playtests so that the jobs earn about the same.
- **"What does the teacher see?"** The Mayor portal sets jobs, topics and emergencies. A full teacher dashboard is planned and not built yet.
- **"Can students see each other's money?"** No. Students see only each other's housing and location, so no one is shamed for being behind.
- **"5% every Workday? No real savings account pays that."** True, and it's on purpose. A real account pays a few percent a year, which a student would never notice in one class period. We made the growth big enough to see on the summary after a single Workday. It's one number in the code, so we can make it realistic later. *(Team: agree on this answer before Nov 13.)*
- **"My bill was forgiven. Doesn't that reward having no money?"** The credit system is off by default for younger students (spec §13), so a balance never goes below $0 and the unpaid part is waived. The summary says so: "In real life, a bill you can't pay becomes debt." With credit on, which is planned but not built yet, that gap would become a loan repaid out of future pay.
- **"Why was the bill bigger than my pay?"** Bills range from $10 to $400. The top of that range matches the Fed's $400 question. A good round of work earns about $300, so a student who saves part of two paydays can cover even the biggest bill. Bad luck isn't fair, and that's why an emergency fund matters.
- **"How many questions are there, and who wrote them?"** There are 23, across six topics (needs and wants, budgeting, saving, banking, credit and earning), and the Mayor turns topics on or off. An AI drafted them and a teammate is reviewing them. *(Update this answer once the review is done.)*

### The $400 figure

- **Claim:** 63% of U.S. adults would cover a $400 emergency expense with cash or its equivalent. The share has been flat since 2024 and is down from 68% in 2021.
- **Source:** Federal Reserve, *Economic Well-Being of U.S. Households in 2025* (Survey of Household Economics and Decisionmaking, released May 2026): <https://www.federalreserve.gov/consumerscommunities/shed.htm>
- **Checked:** Ngoc confirmed the 63% in the Fed's report itself on Nov 5.

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
- When a request was unclear, the agent asked first. One example: how saving should matter. The team chose the shop, interest on savings and the withdrawal fee.
- **Honest limits:** an agent drafted all 23 quiz questions, and a teammate needs to review them. *(Update this line once the review is done.)*
