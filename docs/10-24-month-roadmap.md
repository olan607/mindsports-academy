# 24-Month Development Roadmap — MindSports Academy

## Phase 0 — Foundations (Months 1–2)

- Finalize founder package (this document set), confirm tech stack decisions (Auth0 vs Supabase, payment provider).
- Stand up infra: repo structure (monorepo recommended: `apps/web`, `apps/mobile`, `apps/api`, `packages/shared`), CI/CD, environments (dev/staging/prod).
- Identity Service + RBAC skeleton; Academy-layer DB schema (Section 03) provisioned.
- Design system: chess-inspired luxury academy visual language, component library in Tailwind, Flutter design tokens mirrored.

## Phase 1 — Chess Academy MVP (Months 3–9)

**Months 3–5: Core Learning + Play**
- Interactive board (Stockfish 17 WASM), basic game engine, casual play.
- Levels 1–4 curriculum content (lessons, puzzles, openings, endgames, assessments).
- Learning Service, Certification Service skeletons; Level 1 certification exam functional end-to-end.
- AI Coach: beginner-tier explanations live (text only).

**Months 6–7: Competition + Gamification**
- ELO rating, matchmaking, ranked play.
- Levels 5–8 curriculum content.
- Daily missions, streaks, achievements/badges.
- AI Coach: intermediate/advanced tiers, voice (ElevenLabs) integration.
- Mobile app (Flutter) parity with web for core flows.

**Months 8–9: Full 12-Level Curriculum + Launch Hardening**
- Levels 9–12 curriculum content, Grandmaster Path.
- Puzzle Rush, Tactical Arena, Opening Explorer, Repertoire Builder, Endgame Academy.
- Tournaments: Swiss + Arena formats.
- Coach marketplace (booking + payments).
- Accessibility pass (WCAG 2.1 AA), i18n (3–5 launch languages), offline learning mode.
- Security review, load testing toward 1M-user targets.
- **Public launch.**

## Phase 2 — Post-Launch Depth + First Expansion Game (Months 10–14)

- School portal + parent dashboard full feature set (bulk licensing, cohort reporting).
- Live tournament events, club system maturity, global leaderboards at scale.
- Analytics maturity: PostHog/Mixpanel dashboards for retention, funnel, monetization.
- **Checkers/Draughts module** ships (validates `GameModule` contract on a second game per [Multi-Game Expansion Framework](12-multi-game-expansion-framework.md)).
- Kids Strategy Academy (Tic-Tac-Toe) as a lightweight third module — tests onboarding for younger users.

## Phase 3 — Oware/Ayo + Cultural Expansion (Months 15–18)

- Oware/Ayo module: rules engine, sowing simulator, capture training, AI opponent, curriculum, AI Coach concept ontology.
- Mancala variants, Connect Four as lower-effort follow-ons reusing Oware's board/engine patterns.
- Strategic Intelligence Rating (SIR) launches publicly (now meaningful with 3+ games).
- Marketing push around African cultural positioning — partnership outreach (cultural institutions, African school systems).

## Phase 4 — Asian Strategy Games (Months 19–22)

- Go module (KataGo integration — heavier infra investment, dedicated engine worker pool).
- Shogi and Xiangqi modules.
- Academy Track certifications (Strategic Beginner → Strategic Master) launch, now spanning ≥5 games.
- Evaluate first federation/partnership conversations (regional Go associations, Xiangqi federations) per [Multi-Game Expansion Framework](12-multi-game-expansion-framework.md) §8.

## Phase 5 — Scale & Long Tail (Months 23–24)

- Performance/scale hardening for multi-region readiness.
- Long-tail game evaluation (Backgammon, Othello, Gomoku, Hive, Stratego, Mahjong Strategy) — community-vote prioritized.
- Enterprise/school sales motion matured; university scholarship pilot program.
- Series A-readiness metrics package (retention, GMV, NPS, multi-game engagement data).

## Cross-Cutting Workstreams (run continuously, not phase-gated)

- **Security & compliance**: COPPA/GDPR ongoing review (minors data), penetration testing each major release.
- **Content pipeline**: curriculum authoring, puzzle/item bank growth, translation — never stops.
- **AI Coach quality**: concept ontology expansion, prompt iteration, cost/quality tuning.
- **Community moderation**: scales headcount/tooling with user growth, not deferred to "later."

## Milestone Summary

| Month | Milestone |
|---|---|
| 2 | Infra + design system ready |
| 5 | Chess core play + Levels 1–4 live (internal alpha) |
| 7 | Ranked play + gamification + voice coach (closed beta) |
| 9 | **Public launch** — full 12-level Chess Academy |
| 14 | School/parent depth + Checkers module live |
| 18 | Oware module live, SIR public |
| 22 | Go/Shogi/Xiangqi live, Academy Track certifications |
| 24 | Scale hardening, Series A package |
