# Information Architecture — MindSports Academy

## 1. Site/App Map

```
MindSports Academy
├── Auth (login / signup / SSO / role selection)
├── Home (role-specific dashboard)
│   ├── Student Home → continue learning, daily mission, streak, rating snapshot
│   ├── Coach Home → student roster, pending reviews, marketplace bookings
│   ├── Parent Home → child progress, controls, billing
│   ├── School Admin Home → cohorts, licenses, reports
│   └── Platform Admin Home → content ops, moderation, system health
│
├── Academy (game-agnostic shell)
│   ├── Game Selector  → [Chess Academy] (Phase 1) [Go] [Oware] [Shogi] [Xiangqi] [Checkers] (locked/"coming soon")
│   └── Profile
│       ├── Cross-game stats (Strategic Intelligence Rating)
│       ├── Achievements / Badges
│       ├── Certificates
│       └── Settings (language, accessibility, notifications)
│
├── Chess Academy (Game Module #1)
│   ├── Progression Map (12 levels, visual journey)
│   │   └── Level Detail
│   │       ├── Lessons
│   │       ├── Tactical Puzzles
│   │       ├── Opening Training
│   │       ├── Endgame Training
│   │       ├── Assessment
│   │       ├── Ranked Matches (entry point)
│   │       ├── AI Review (of recent games)
│   │       └── Certification Exam
│   ├── Play
│   │   ├── Quick Match / Ranked / Casual
│   │   ├── Puzzle Rush
│   │   ├── Tactical Arena
│   │   └── vs. AI Coach (sparring)
│   ├── Analyze
│   │   ├── Game Review (move-by-move, Stockfish + AI narration)
│   │   ├── Opening Explorer / Repertoire Builder
│   │   └── Endgame Academy
│   ├── Compete
│   │   ├── Leaderboards (global, friends, club)
│   │   ├── Tournaments (Live, Swiss, Arena)
│   │   └── Clubs
│   └── Certifications (Chess Track: Beginner → Club Player → Candidate Master → Master)
│
├── Community
│   ├── Friends
│   ├── Clubs
│   └── Feed/Activity
│
├── Marketplace
│   ├── Coach Directory → Profile → Booking → Payment
│   └── (future) Course Marketplace
│
├── School Portal (School Admin role)
│   ├── Cohorts & Rosters
│   ├── License Management
│   ├── Curriculum Assignment
│   └── Reporting
│
├── Parent Dashboard (Parent role)
│   ├── Child Progress
│   ├── Screen Time / Controls
│   └── Billing
│
└── Platform Admin Console (Admin role)
    ├── Content Management (lessons, puzzles, exam banks)
    ├── User & Role Management
    ├── Moderation Queue
    ├── Tournament Configuration
    └── Analytics & System Health
```

## 2. Navigation Model

- **Global shell**: Game Selector + Profile + Notifications persist across all game modules.
- **Game module nests under the shell** — URL pattern `/academy/{game}/...` (e.g. `/academy/chess/play`). This is the structural seam that lets new games slot in without restructuring routing.
- **Role-based home**: post-login redirect depends on active role; users with multiple roles (e.g., Coach who is also a Parent) get a role switcher.

## 3. Content Taxonomy

- **Curriculum unit** = Level → Module (Lesson/Puzzle Set/Opening Pack/Endgame Pack) → Item.
- **Assessment item bank** tagged by: level, skill tag (tactics/openings/endgames/strategy/calculation), difficulty, game module.
- **Achievement taxonomy**: Progress badges, Mastery badges, Social badges, Event badges — game-agnostic schema with a `game_module` foreign key so badges can be chess-specific or cross-game.

## 4. Cross-Game Abstractions (built now, used later)

- **Strategic Intelligence Rating (SIR)**: composite score; Phase 1 computes it from Chess rating + learning assessments only, but the schema and calculation service support N game ratings.
- **Certification framework**: Academy Track (game-agnostic: Strategic Beginner → Strategic Master) sits above Game Track (chess-specific titles). Adding Go later means adding a Game Track, not a new framework.
- **Game Module interface**: every game implements the same contract (rules engine, rating calculator, AI coach hook, content schema) — see [Microservices Architecture](07-microservices-architecture.md) §4.
