# Web App Wireframes — MindSports Academy (Next.js)

Described wireframes for key screens. Visual language: dark academy palette (deep navy/charcoal + gold accents), serif display type for headings (luxury academy feel), sans-serif body, animated progression map as the emotional centerpiece.

## 1. Student Home / Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo] MindSports Academy        [Game: Chess ▾]   [🔔][Avatar▾] │
├──────────────────────────────────────────────────────────────────┤
│  Welcome back, Olan — Day 14 streak 🔥        Rating: 1240 (Bullet)│
│                                                                    │
│  ┌─ Today's Mission ──────────┐  ┌─ Continue Learning ──────────┐ │
│  │ Solve 5 tactics puzzles    │  │ Level 4: Opening Explorer     │ │
│  │ [Progress bar 2/5]         │  │ Lesson 3 of 7 — [Resume →]    │ │
│  └─────────────────────────────┘  └───────────────────────────────┘ │
│                                                                    │
│  ── Your Progression Map (animated, horizontal scroll) ──────────  │
│  [1 Pawn Recruit ✓]─[2 ✓]─[3 ✓]─[●4 Opening Explorer]─[5]─...─[12] │
│                                                                    │
│  ┌─ Quick Actions ───────────────────────────────────────────────┐ │
│  │ [Play Ranked] [Puzzle Rush] [Tactical Arena] [Watch a Tourney]│ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Recent Achievements: [🏆 First Win] [🥇 7-Day Streak] [⭐ Level 3] │
└──────────────────────────────────────────────────────────────────┘
```

## 2. Level Detail Page

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Back to Progression Map         Level 4: Opening Explorer       │
├──────────────────────────────────────────────────────────────────┤
│  Progress: ███████░░░ 70%                                         │
│                                                                    │
│  ┌─ Lessons ──┐ ┌─ Puzzles ──┐ ┌─ Openings ──┐ ┌─ Endgames ──┐    │
│  │ 5/7 done   │ │ 22/30 done │ │ 3/5 packs   │ │ 1/3 packs   │    │
│  │ [Continue] │ │ [Continue] │ │ [Continue]  │ │ [Continue]  │    │
│  └────────────┘ └────────────┘ └─────────────┘ └─────────────┘    │
│                                                                    │
│  ┌─ Assessment ──────────┐  ┌─ Certification Exam ──────────────┐ │
│  │ Not yet attempted     │  │ 🔒 Locked — complete all modules   │ │
│  │ [Start Assessment]    │  │    above to unlock                 │ │
│  └────────────────────────┘  └─────────────────────────────────────┘ │
│                                                                    │
│  Ranked matches at this level: play 3 rated games (1/3 complete)  │
└──────────────────────────────────────────────────────────────────┘
```

## 3. Play / Board Screen

```
┌──────────────────────────────────────────────────────────────────┐
│ vs. Magnus_Bot42 (1255)         Time Control: 10+0     [Resign]   │
├───────────────────────┬────────────────────────────────────────────┤
│                        │  Move list            Eval bar [▮▮▮▯▯]   │
│   ┌──────────────────┐ │  1. e4 e5                                 │
│   │                  │ │  2. Nf3 Nc6                               │
│   │   chessboard      │ │  3. Bb5 a6  ←current                     │
│   │   (8x8, drag/drop)│ │                                          │
│   │                  │ │  [AI Coach 💬]                            │
│   └──────────────────┘ │  "This is the Ruy Lopez. White is..."     │
│   Black: 09:42  ⚪      │  [🔊 Listen] [Beginner|Intermediate|Adv.] │
│   White: 09:51  ⚫      │                                          │
└───────────────────────┴────────────────────────────────────────────┘
```

## 4. Post-Game AI Review

```
┌──────────────────────────────────────────────────────────────────┐
│ Game Review — vs. Magnus_Bot42 — You won (Resignation)            │
├──────────────────────────────────────────────────────────────────┤
│ Accuracy: 87%   Blunders: 1   Mistakes: 2   Best moves: 24/30     │
│                                                                    │
│ ┌─ Move timeline (clickable) ──────────────────────────────────┐  │
│ │ ●●●●●●⚠●●●●●●❌●●●●  (green=best, yellow=inaccuracy,         │  │
│ │                        orange=mistake, red=blunder)           │  │
│ └─────────────────────────────────────────────────────────────────┘  │
│                                                                    │
│ Selected move: 18. Nxd5??  (Blunder, -3.2)                        │
│ "You played this because it looked like it won a pawn, but it     │
│  hangs your knight to a discovered attack. The principle: always  │
│  check what's behind the piece you're capturing with."            │
│ [🔊 Listen]  [Show better move: 18. Qd2]                          │
└──────────────────────────────────────────────────────────────────┘
```

## 5. Profile / Certificates

```
┌──────────────────────────────────────────────────────────────────┐
│ Olan Abraham — Strategic Intelligence Rating: 1623                │
│ Chess: 1750  |  Go: 1400  |  Oware: 1650  (locked tiles for       │
│ games not yet played, shown as "Try it →")                        │
├──────────────────────────────────────────────────────────────────┤
│ ┌─ Certificates (mastery certificate cards, gold-foil styled) ──┐ │
│ │ [Level 3: Tactics Trainee — Certified Mar 2026]                │ │
│ │ [Level 4: Opening Explorer — In Progress]                      │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ ┌─ Trophy Case ──────────────────────────────────────────────────┐ │
│ │ [🏆 Club Arena Winner] [🥈 Spring Swiss 2nd] [🔥 30-Day Streak] │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## 6. Coach Marketplace

```
┌──────────────────────────────────────────────────────────────────┐
│ Find a Coach        [Filters: Rate ▾ | Language ▾ | Specialty ▾] │
├──────────────────────────────────────────────────────────────────┤
│ ┌─ Coach Card ──────────────┐ ┌─ Coach Card ──────────────┐       │
│ │ [Avatar] Sarah K. (CM)    │ │ [Avatar] David O. (FM)    │       │
│ │ ⭐4.9 (120 reviews)        │ │ ⭐4.8 (87 reviews)         │       │
│ │ Specialty: Endgames        │ │ Specialty: Openings        │       │
│ │ $35/hr   [Book Session]    │ │ $28/hr   [Book Session]    │       │
│ └─────────────────────────────┘ └─────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────┘
```

## 7. School Admin Portal

```
┌──────────────────────────────────────────────────────────────────┐
│ Lincoln Middle School — Chess Club Cohort (32 students)            │
├──────────────────────────────────────────────────────────────────┤
│ [Roster] [Assign Curriculum] [Reports] [Licenses: 32/50 seats]    │
│                                                                    │
│ ┌─ Cohort Progress (table) ─────────────────────────────────────┐ │
│ │ Student      Level   Rating  Last Active  Cert. Status        │ │
│ │ A. Smith     L5      1180    Today        ✓ L4 Certified      │ │
│ │ B. Lee       L3      980     2 days ago   In progress          │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## 8. Component Library Notes (Tailwind/Next.js)

- `<ProgressionMap>` — animated horizontal stepper, reusable across games (level count is a prop).
- `<BoardRenderer>` — shared chrome (move list, eval bar, clocks); game-specific board geometry injected per `GameModule`.
- `<AICoachPanel>` — depth-tier switcher + voice playback, game-agnostic.
- `<CertificateCard>` — gold-foil styled card component, parametrized by track/level/game.
- `<AchievementBadge>`, `<TrophyCase>`, `<StreakFlame>` — gamification primitives shared across the whole shell.
