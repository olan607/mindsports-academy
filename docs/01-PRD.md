# Product Requirements Document — MindSports Academy

## 1. Vision

MindSports Academy is the global learning and competition platform for strategic board games. Phase 1 ships as **Chess Academy**, built on an Academy Layer (shared across all games) and a pluggable Game Layer, so each subsequent game (Checkers, Oware, Go, Shogi, Xiangqi) is added as a module rather than a rewrite.

**Positioning:** Duolingo (learning) + Chess.com (competition) + Coursera (certification) + Discord (community) + Steam (game ecosystem), unified under one account, one subscription, one cross-game rating.

## 2. Problem Statement

- Chess.com/Lichess are strong at play and weak at structured pedagogy.
- Duolingo-style learning apps don't scale to deep strategy games or real competition.
- No platform unifies multiple strategic board games under one progression and certification system.
- African and Asian traditional strategy games (Oware, Xiangqi, Shogi) have no modern, AI-coached, certification-backed home.

## 3. Goals (Phase 1 — Chess Academy MVP, 6–9 months)

1. Deliver the full Learn → Practice → Analyze → Test → Certify → Advance loop for chess.
2. Ship 12 mastery levels (Pawn Recruit → Grandmaster Path) with lessons, puzzles, openings, endgames, assessments, ranked play, AI review, and certification exams per level.
3. Support Web, iOS, Android, PWA from a shared design/data layer.
4. Architect every service as if Chess were "Module #1," not the whole product — no chess-specific assumptions leak into Identity, Learning, Certification, Tournament, or Analytics services.
5. Reach functional parity with Chess.com/Lichess on play + Duolingo on learning UX within MVP scope.

## 4. Non-Goals (Phase 1)

- No other games shipped at launch (architecture must support them; content does not).
- No native desktop app.
- No real-money wagering/gambling features.
- No federation-grade FIDE-rated official tournaments at launch (roadmap item, Phase 5+).

## 5. User Roles & Core Jobs-to-be-Done

| Role | Core JTBD |
|---|---|
| Student | Learn chess systematically, track progress, play ranked games, earn certificates |
| Coach | Manage students, assign curriculum, review games, monetize via marketplace |
| Parent | Monitor child progress, manage subscription/screen time, view safety controls |
| School Administrator | Manage cohorts of students/coaches, track class-wide progress, issue bulk licenses |
| Platform Administrator | Manage content, moderate community, configure tournaments, view platform health |

## 6. The 12 Mastery Levels

1. Pawn Recruit
2. Piece Apprentice
3. Tactics Trainee
4. Opening Explorer
5. Positional Player
6. Endgame Initiate
7. Combination Specialist
8. Strategic Thinker
9. Tournament Competitor
10. Advanced Tactician
11. Candidate Master Path
12. Grandmaster Path

Each level is a self-contained curriculum unit with:
- **Lessons** (text/video/interactive, voice-coached)
- **Tactical puzzles** (level-banded difficulty)
- **Opening training** (level-appropriate repertoire)
- **Endgame training**
- **Assessment** (formative quiz/drill)
- **Ranked matches** (minimum games at appropriate time control)
- **AI review** (post-game analysis tied to level objectives)
- **Certification exam** (summative, gates advancement)

Advancement requires passing the certification exam; the system never silently auto-advances a student.

## 7. Functional Requirements

### 7.1 Learning Engine
- Adaptive lesson sequencing based on weakness detection (tactics, openings, endgames, time management).
- Daily missions, streaks, XP, badges.
- Personalized learning plan recomputed weekly from performance data.

### 7.2 Play & Analysis
- Interactive board, Stockfish 17 WASM engine (client-side analysis + server-side authoritative game state).
- Puzzle Rush, Tactical Arena.
- Opening Explorer + Repertoire Builder (book moves, win-rate stats, spaced-repetition drilling).
- Endgame Academy (tablebase-backed where feasible).
- Post-game AI review: move-by-move annotation, blunder/mistake/inaccuracy classification, natural-language explanation at beginner/intermediate/advanced depth.

### 7.3 Competition
- ELO-style rating per time control.
- Matchmaking (rating-banded, role-aware — no Coach-vs-Student rating exploits).
- Friends, clubs, global leaderboards.
- Tournament formats: Swiss, Arena, scheduled live events.

### 7.4 AI Coach
- Text + voice explanations, three depth tiers (beginner/intermediate/advanced).
- "Explain the thinking, not just the move" — model is prompted to articulate the strategic principle, not just annotate.
- Game-layer-agnostic interface (`AICoachService.explainMove(gameModule, position, move, depth)`) so non-chess modules plug into the same coach later.

### 7.5 Certification
- Per-level certification exam (proctored-light: timed, randomized item bank, anti-cheat heuristics).
- Issued certificate (verifiable ID, shareable, PDF + on-platform badge).
- Academy Track (Strategic Beginner → Strategic Master) layered above Game Track (chess-specific titles) — built now so the abstraction is reusable for Go/Oware later.

### 7.6 Marketplace & Institutional
- Coach marketplace: profile, availability, booking, payments, reviews.
- School portal: cohort management, bulk licensing, assignment of curriculum, progress dashboards.
- Parent dashboard: progress view, time controls, spend controls, safety/communication settings.

### 7.7 Platform
- Multi-language (i18n from day one, not retrofitted).
- WCAG 2.1 AA accessibility.
- Offline learning mode (downloaded lessons/puzzles, sync on reconnect).
- Enterprise-grade security (see Non-Functional Requirements).

## 8. Non-Functional Requirements

- **Scale:** architected for 1M+ registered users, 100K+ concurrent at peak (tournament nights).
- **Availability:** 99.9% for core play/learning paths.
- **Latency:** game-move round-trip < 150ms p95 within region.
- **Security:** SOC2-aligned controls, encrypted at rest/in transit, RBAC per role, COPPA/GDPR compliance (student minors + parent data).
- **Accessibility:** WCAG 2.1 AA across web and mobile.
- **Internationalization:** all user-facing strings externalized; RTL support.
- **Extensibility:** adding a new Game Module must not require changes to Identity, Certification, or Analytics services (enforced via module interface contracts — see [Microservices Architecture](07-microservices-architecture.md)).

## 9. Success Metrics (Phase 1)

- D1/D7/D30 retention vs. Duolingo benchmarks (target D7 ≥ 25%).
- % of students completing Level 1 certification within 14 days of signup.
- Coach marketplace GMV.
- Weekly active ranked players.
- NPS ≥ 50 among paying subscribers.

## 10. Open Questions

- Payment/subscription provider (Stripe assumed, to confirm).
- Exact proctoring rigor for certification (legal/anti-cheat tradeoff).
- FIDE/official-body partnership timeline — affects whether certification claims "official" language.
