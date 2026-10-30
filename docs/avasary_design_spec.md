# Avasary — Design Spec v3

**Status:** All open decisions resolved · **Replaces** the "village \+ daily tasks" build and brief **Author of concept:** Andrew Payton · Organized Oct 26, 2026

---

## 1\. One-line pitch

Avasary is a Kahoot/Prodigy-style classroom web game where students answer financial literacy questions to earn **energy**, spend that energy on **mini-games** to earn **in-game currency**, and then manage that currency across needs, wants, and unexpected events — learning money management by living with their own decisions.

## 2\. The two learning loops

The whole design rests on two loops that feed each other:

| Loop | Student action | What it teaches |
| :---- | :---- | :---- |
| **Loop A — Knowledge** | Answer financial questions → earn energy | Direct financial literacy content (recall, concepts) |
| **Loop B — Management** | Spend currency on upgrades, needs, wants, savings | Applied decision-making, tradeoffs, consequences |

Loop A gates Loop B: you can't play mini-games without energy, and you can't earn currency without mini-games. Loop B feeds back into Loop A: upgrades make the question-and-play cycle more efficient, so good money management literally makes you better at the game.

---

## 3\. Structural hierarchy

```
Account (student or educator)
  └── Block          — a class/section. Educator = Mayor. Students = Residents.
        └── Session  — a "Workday." One class period of play.
              └── Rounds of: Questions → Energy → Mini-games → Currency → Spending
```

### 3.1 Account

- Email \+ password login. School email typical but **not required**.  
- **Default role: Student.** Educator status exists but is deliberately out of the way (not a toggle on the signup screen).  
- **Educators are ordinary users who opt in.** There is no approval queue, no domain check, no admin tier. Anyone can flag their own account as an educator and create a Block. This is safe because **Blocks are fully isolated** — a Mayor has authority over their own Block and zero reach into anyone else's. The worst a bad actor can do is create a Block nobody joins.  
- Session persistence via cookies — ideally sign in once, stay signed in.

### 3.2 Block

- Modeled on a city block. Educator is the **Mayor**, students are **Residents**.  
- **Joined once, permanently.** A user cannot join the same Block twice.  
- Joining a Block creates a **fresh base character** for that Block.  
- **Currency and progress persist across Sessions** within a Block (unless the Mayor disables persistence for a given Session).  
- The Mayor can manage Residents and set the rules for each Session.

### 3.3 Session (Workday)

- A single class period. Entered through the Block's **waiting room**, started by the Mayor.  
- Contains the full Questions → Energy → Mini-games → Currency → Spending cycle.  
- Mayor-configurable rules (length, event schedule, which upgrades are available, etc.).

---

## 4\. Entry — one code, then a waiting room

**There is only one code in the system: the Block code.** It is used once, ever, by each student. After that, a Resident never types a code again.

| Step | Mechanism |
| :---- | :---- |
| Join a Block | **Block code** — one time per student, creates their base character |
| Enter a Workday | Open the Block → **waiting room** → Mayor starts the Workday |

The waiting room replaces the old session code entirely. Residents gather there; the Mayor sees who has arrived and presses start when the class is ready. This also gives the educator a natural roll-call and a moment to set the Session rules before play begins.

---

## 5\. Student workflow

**First time ever**

1. Sign up / log in  
2. Enter **Block code** → base character created in that Block  
3. Open the Block → **waiting room** → Mayor starts → play

**Every time after**

1. Auto-signed in (cookie)  
2. Open the Block → waiting room → play

The target is: *returning student opens the site and is in the waiting room in one click.*

## 6\. Educator workflow

1. Log in and **opt in to educator status** (self-service, one time)  
2. Create a Block  
3. Generate \+ share the **Block code** → roster fills (one time)  
4. For each class period: configure Session rules → open the waiting room → **Start Workday**  
5. During the Session: monitor Residents, trigger planned events  
6. After: review progress (persists to next Session)

---

## 7\. Core economy

### 7.1 Energy

- Earned by answering financial literacy questions correctly.  
- Spent to play mini-games.  
- The **only** path to mini-games — this is what keeps the educational content from being skippable.

### 7.2 Currency

- Earned by performing well in mini-games (performance-scaled, not participation-scaled).  
- Spent across five categories:

| Category | Effect | Concept taught |
| :---- | :---- | :---- |
| **Education** | Unlocks additional mini-games | Investing in yourself / long-term payoff |
| **Food & Shelter** | **Yield multiplier** on what each correct answer is worth *(see §7.3)* | Needs come first |
| **Travel** | Reduces delay between questions and between mini-game swaps | Infrastructure / convenience spending |
| **Customization** | Cosmetic upgrades to travel, food, shelter | Wants, status spending |
| **Bank / savings** | Interest-free safety net, cheaper loans, debt shield *(see §11)* | Emergency fund, banking |

- **More expensive \= better, with diminishing returns.** This is deliberate: it teaches that the top-tier option is rarely the best value.  
- **Prices should be realistic** — scaled to the in-game economy, but recognizably modeled on real-world cost relationships (rent \> groceries \> a cosmetic item).

### 7.3 Food & Shelter — how the multiplier works

Food & Shelter is a **multiplier on the reward a correct answer pays out**, not a separate bonus. What it multiplies depends on how the mini-game is structured:

| Mini-game type | What a correct answer pays | What Food & Shelter does |
| :---- | :---- | :---- |
| **Attempt-based** | Mini-game tokens (e.g. 0.5 per correct answer) | Raises the per-answer payout — 0.5 → 0.6 |
| **Time-based** | Seconds of play time | Raises the seconds granted per correct answer |

Worked example: at base, two correct answers buy one token. With a 1.2× Food & Shelter level, each answer pays 0.6, so **every fifth correct answer is effectively free** — the fractions accumulate into a whole extra run.

This is why the multiplier reads as "needs come first": it isn't flashy, it compounds quietly, and a student who skips it to buy cosmetics falls behind without ever seeing a single dramatic penalty.

### 7.4 Friction timers (tunable)

- \~**5 seconds** between questions  
- \~**15 seconds** when swapping mini-games

These are small on purpose — they exist so Travel upgrades have something real to buy down, not to stall the student.

---

## 8\. Mini-games — jobs *(WIP)*

- **Mini-games are jobs.** Each one is a 2D game representing a job a Resident works in the city. Earning currency means going to work.  
- **2D in nature** — simple, readable, quick to play and quick to build.  
- Primary currency source. Performance-scaled.  
- Students choose which job to work; more jobs are unlocked via **Education** spending, which makes the education → better job → more income chain legible without ever stating it as a lesson.  
- Structure per job is either **attempt-based** (N tries) or **time-based** (N seconds), which is what Food & Shelter multiplies against *(§7.3)*.

**Still WIP:** the specific job list, how many ship at launch, and the difficulty curve. Recommend 2–3 at launch with obviously different job identities so the Education unlock feels like a promotion.

## 9\. Question bank

- **Authored by the team.** A large internally written bank, not educator-sourced and not open-ended at launch.  
- **Separated by topic**, so topics are addressable units.  
- **Educators control which topics are active** for their Block or for a given Workday — a teacher covering budgeting can turn on budgeting and leave credit off.  
- Size matters more than cleverness here: the bank needs to be big enough that a Resident answering questions all period doesn't start seeing repeats.

## 10\. The city — presence and visibility

The Block is rendered as a **city landscape**, not an abstract menu. This is what makes Travel a real mechanic rather than an invisible stat — there are places, and getting between them takes time.

- Residents **can see each other, but in a limited way.** Presence, not surveillance.  
- Visible: **where a Resident lives** (their housing, which reflects Food & Shelter spending) and **where they currently are** in the city.  
- Not visible by default: exact balances, debt status, or a ranked leaderboard.

This gives social texture — your housing is publicly legible, so spending on shelter has a visible payoff — without turning the class period into a wealth scoreboard, which would single out whoever is struggling.

**Open:** whether the Mayor can see the full picture (balances, debt) that Residents can't. Recommend yes — the educator needs it to intervene.

## 11\. The Bank

A real, separate place in the city — not just a savings number on the HUD.

### 11.1 Deposits

- **No restrictions.** A Resident can deposit any amount, any time.

### 11.2 Withdrawals

- **Direct withdrawals have a cooldown.** You cannot treat the bank as a wallet.  
- This is the entire design tension: banked money is safer and unlocks better terms, but it isn't instantly available. Choosing how much to bank *is* the emergency-fund lesson.

### 11.3 The debt shield

If a Resident would go into debt, **the charge is taken directly from their bank balance instead** — and they do **not** enter debt. The only cost is losing the money.

This is the single most important mechanic in the economy. It means a student with savings experiences an emergency as *expensive*, and a student without savings experiences it as *a crisis*. Same event, two different lessons, no lecture required.

### 11.4 Better loan terms

Having a bank balance improves borrowing: rates drop to **as low as 10%** *(vs. the 15–20% baseline, §12.1)*.

### 11.5 Borrowing limit against the bank

A Resident can borrow up to the **greater of 25% of their banked balance or \$50** — a small floor so someone with nothing banked still has access to a starter amount, and scaling access for someone who has saved.

> **Flag:** "25% of money in the bank **or** 50" is ambiguous in the source note — this spec reads it as *greater of*, which gives a floor. If you meant *lesser of* (a hard \$50 ceiling), that caps borrowing much harder and makes loans nearly irrelevant for wealthy Residents. Confirm which.

---

## 12\. Bad-luck events

- Hit **all users** in a Block — either simultaneously or spread across the Session.  
- Two kinds:  
  - **Planned** — Mayor-scheduled (e.g., rent is due at minute 20\)  
  - **Unplanned** — randomized (emergency expense, insurance claim)  
- Examples: rent, insurance payments, emergencies.  
- These are the sharpest teaching moment in the game: the student who saved absorbs it, the student who bought the premium hat does not.

**Design note:** events should never be able to zero a student out permanently. Order of absorption: **bank balance first** (§11.3), then debt if the credit system is on, then a hard floor of **0** if it's off — balance never goes negative and unpayable charges are simply waived.

---

## 13\. Credit system — loans, debt, bankruptcy

**This entire system is an educator toggle.** Off by default is recommended for younger groups. When off, the minimum balance is **0** and none of the mechanics below exist.

### 13.1 Loans

- Rate **15%–20%** baseline; **as low as 10%** with a bank balance *(§11.4)*.  
- **One loan at a time.** The current loan must be fully repaid before another is issued.  
- **Intended use:** borrow to buy a productive upgrade (Education → a better job, Travel → faster cycles) that earns back more than the loan costs.  
- **Framing in-game:** heavily discouraged. The confirmation screen should state the total repayment and the garnishment rate in plain numbers, not just the percentage. Easy to misuse is the point; misusing it is the lesson.

### 13.2 How repayment actually works — garnished earnings, not accruing interest

**There is no compounding interest and no running balance that grows.** The loan is a fixed debt, and it is repaid automatically out of income.

Two numbers define every loan:

|  | Formula | At 20% | At 10% (bank) |
| :---- | :---- | :---- | :---- |
| **Total owed** | 100% \+ rate | **120%** of principal | **110%** of principal |
| **Earnings garnished** | 20% base \+ rate | **40%** of all income | **30%** of all income |

Every payout a Resident earns is split: the garnished share goes straight to the loan, the rest lands in their pocket. The loan closes when the total owed is paid. Nothing grows, nothing accrues, nothing surprises them.

**Worked example (20% loan, \$100 borrowed):**

- Total owed: **\$120**  
- Garnishment: **40%** of every payout  
- Earn \$50 → \$20 to the loan, \$30 to you  
- Loan clears after \$300 of gross earnings

**Why this model is the right call:** a middle schooler can hold "I owe 120 and my paychecks are 40% smaller until it's gone" in their head. They *feel* the loan every single time they get paid — which is exactly how real debt feels — without anyone having to teach compound interest. It also sidesteps the accrual-timing question entirely: there's no per-round or per-Workday tick to schedule or explain.

### 13.3 Loan cap

The cap is computed from three inputs, all **educator-customizable**:

| Input | Effect on cap |
| :---- | :---- |
| **Savings** (banked balance) | Raises it — see §11.5 |
| **Debt history** (has this Resident been in debt / filed bankruptcy?) | Lowers it |
| **Recent earnings** | Raises it — demonstrated ability to repay |

This is deliberately a **realistic** model: real lenders look at assets, credit history, and income. A Resident who has saved and is earning gets more; one who has defaulted gets less. Prices and loan amounts throughout should sit at realistic magnitudes *(§7.2)* so the numbers mean something when a student sees them.

### 13.4 Debt

Triggered by a negative balance (an event charge you couldn't cover, with no bank balance to shield it). **A Resident with money in the bank does not enter debt** — §11.3.

While in debt:

- **Cannot purchase anything** — no upgrades, no customization, no education.  
- **All bonuses are removed** — efficiency, travel speed, and any upgrade effects are suspended until the balance is back above 0\.

Debt is intentionally harsh. It's recoverable purely by earning, so the path out is always visible: keep answering questions, keep playing, dig out.

### 13.5 Bankruptcy

An opt-in escape hatch, available to any Resident in debt.

|  | Effect |
| :---- | :---- |
| **Immediate** | All debt cleared. Balance resets to 0\. |
| **Grace period** | Immune to emergency/unplanned expenses for **3 minutes, or until the Resident reaches \$1,000 — whichever comes first** |
| **Repeatable** | **Yes, as many times as needed** — but each filing stacks worse consequences |
| **Lasting cost** | A **very minor** ongoing penalty to future expenses (everything costs slightly more) |
| **Lasting cost** | Higher loan rate → higher garnishment *(§13.2)* |
| **Lasting cost** | Smaller loan cap *(§13.3)* |

**The grace period has two exits on purpose.** Three minutes keeps a struggling student from being locked out of a class period. The \$1,000 ceiling closes the exploit: a Resident can't file, get immunity, and then farm safely with a real balance. Whichever happens first ends it.

**Escalating consequences.** Filing is never blocked, but the second and third filings deepen the scars — worse rates, smaller caps, higher costs. This is the honest model: the door stays open, it just gets more expensive to walk through each time. A student who keeps filing learns the lesson by the third one without ever being removed from play.

**Design note:** the scar must be visible. Recommend a small persistent badge showing the Resident's current rate and cap rather than burying it in the math — a penalty nobody notices teaches nothing.

### 13.6 Educator controls

- Master on/off for the whole credit system  
- Interest rate / range (and whether the bank discount applies)  
- Loan cap inputs and weighting *(§13.3)*  
- Whether bankruptcy is available at all  
- Grace period duration and dollar ceiling  
- Severity and escalation rate of the bankruptcy penalty

---

## 14\. Decision record

**All twelve open items are now resolved.**

| \# | Question | Resolution |
| :---- | :---- | :---- |
| 1 | Invite code auto-starts a session? | One Block code \+ waiting room. No session code. *(§4)* |
| 2 | Floor on bad-luck events? | Bank → debt (credit on) → hard 0 (credit off). *(§11.3, §12)* |
| 3 | Launch mini-games? | **Mini-games are jobs**, 2D. Count and list still WIP. *(§8)* |
| 4 | How does Food & Shelter work? | **Yield multiplier** on per-answer payout — tokens or seconds. *(§7.3)* |
| 5 | Explicit savings mechanic? | **Yes — a Bank**, with cooldown withdrawals and a debt shield. *(§11)* |
| 6 | Educator flagging? | **Self-serve opt-in.** Safe because Blocks are isolated. *(§3.1)* |
| 7 | Question bank authorship? | **Team-authored**, topic-separated, educator-controlled. *(§9)* |
| 8 | Do Residents see each other? | **Limited visibility** — housing and location, not balances. *(§10)* |
| 9 | Does v2 replace the demo build? | **Replaces it.** *(see below)* |
| 10 | Loan cap formula? | Savings \+ debt history \+ recent earnings, customizable. *(§13.3)* |
| 11 | When does interest accrue? | **It doesn't** — fixed total owed \+ garnished earnings. *(§13.2)* |
| 12 | Bankruptcy grace period? | 3 min or \$1,000, whichever first. Repeatable, escalating. *(§13.5)* |

### 14.1 On item 9 — v2 replaces the previous build

The "village \+ daily tasks \+ owner picks expenses" demo is **superseded**. The Living Project Brief in the Project Log should be rewritten to this spec rather than appended to, and the existing `avasary_demo.html` should be treated as a throwaway prototype, not a foundation.

What carries forward conceptually: educator-controlled expenses, a shared group with an authority figure, bad-luck events, and the end-of-session summary with discussion questions. Everything else — the day counter, the savings-goal framing, the 3-option decision cards — is replaced by the energy/mini-game economy.

---

## 15\. Scope recommendation for the demo

Everything above is the full vision. For a demo, build the thinnest slice that shows both loops closing:

> One Block → waiting room → Mayor starts → answer 3 questions → earn energy → work 1 job (mini-game) → earn currency → **choose: bank it or buy an upgrade** → one bad-luck event hits → end-of-session summary.

Login, educator dashboard, persistence, the city landscape, and multiple jobs can all be faked or stubbed. The two loops cannot — and **the bank-or-spend choice should survive into the demo**, because that single decision followed by an emergency is the clearest 30 seconds of teaching in the whole design.

**On the credit system:** recommend leaving it **off** in the demo's default run, with a toggle visible so you can flip it on during the pitch and show a loan being taken and the debt penalty landing. It's a strong 30-second moment, but it shouldn't be the thing the audience has to understand before they understand the core loops.