# Multi-Game Expansion Framework — MindSports Academy

## 1. Why This Framework Exists

The platform's moat is breadth + depth at once: no competitor combines AI coaching, certification, schools, and a coach marketplace across multiple strategic games. This document defines exactly how a new game gets added without touching Academy-layer services, so the moat is structural, not aspirational.

## 2. Phased Game Rollout

| Phase | Games Added | Rationale |
|---|---|---|
| 1 (MVP) | Chess | Largest addressable market, richest tooling (Stockfish), validates the Academy Layer |
| 2 | Checkers/Draughts, Tic-Tac-Toe (Kids) | Low rules-engine complexity, proves the GameModule contract on a second/third game cheaply |
| 3 | Oware/Ayo, Mancala variants, Connect Four | African cultural positioning — uncontested by major competitors |
| 4 | Go, Shogi, Xiangqi | Asian strategy games, higher engine complexity (KataGo etc.), larger global audience expansion |
| 5 | Backgammon, Reversi/Othello, Gomoku, Hive, Stratego, Mahjong Strategy, Military Wargames | Long-tail breadth, community-requested, partnership-driven |

## 3. Definition of Done for "Adding a Game"

A new game ships when all of the following exist, with zero modifications to Identity, Learning, Certification, Competition, or Analytics services:

1. **Rules engine** implementing the `GameModule` interface (see [Microservices Architecture](07-microservices-architecture.md) §4).
2. **Rating calculator** for that game (ELO/Glicko variant appropriate to the game).
3. **Curriculum content**: levels mapped onto the same 12-stage progression shape (level *count* may flex per game, but the Learn→Practice→Analyze→Test→Certify→Advance loop must hold).
4. **Puzzle/tactical content bank** tagged with skill tags specific to that game.
5. **AI Coach prompt profile**: a game-specific system prompt teaching the LLM *that game's* strategic vocabulary (see [AI Agent Architecture](11-ai-agent-architecture.md)), wired into the shared `explainPosition()` hook.
6. **Engine/analysis backend**: WASM client engine where feasible (Stockfish-style), server-side worker pool for deep analysis otherwise (e.g., KataGo for Go).
7. **Game-specific board UI component** conforming to the shared board-renderer interface (drag/drop, move list, eval bar are shared chrome; board geometry and piece set are game-specific).
8. **Certification track** (Game Track) registered under the existing Academy Track framework — no new certification *system*, just new content.
9. **SIR integration**: rating feeds into the existing Strategic Intelligence Rating calculation with zero changes to the SIR formula's structure (it's already N-game-aware).

## 4. Strategic Intelligence Rating (SIR)

```
SIR = weighted_average(
  game_ratings[],     // normalized per-game (Chess 1750 → percentile, Go 1400 → percentile, etc.)
  learning_assessment_score,
  tournament_performance_index
)
```

- Normalization is required because raw ratings aren't comparable across games (chess 1750 ≠ go 1400 in skill percentile). Each `GameModule` must supply a `normalizeRating(rating): percentile` function as part of onboarding a new game.
- SIR is recomputed on a schedule (nightly) and on significant events (certification earned, rated game completed).
- Displayed as a single number plus a per-game breakdown (matches the example in the brief: Chess 1750 / Go 1400 / Oware 1650 → SIR 1623).

## 5. AI Coach: "Explain the Thinking" Pattern

Every game's coach profile must answer not just *what* move is good but *why*, in that game's own conceptual language:

| Game | Example principle the coach must be able to articulate |
|---|---|
| Chess | Why this move is strong (tactical motif, positional principle) |
| Oware | Why a sowing pattern creates a future capture opportunity |
| Go | Why influence matters more than territory in this position |
| Xiangqi | Why this palace formation defends against a specific attack pattern |
| Shogi | Why this drop creates a mating net given piece-drop rules |

This is implemented as a per-game **strategic concept ontology** (a tagged list of named principles for that game) that the LLM is grounded against, rather than free-form commentary — see [AI Agent Architecture](11-ai-agent-architecture.md) §3.

## 6. Cross-Game Certification Structure

```
Academy Track (game-agnostic, requires breadth across ≥2 games at matching tier)
  Strategic Beginner → Strategic Apprentice → Strategic Practitioner → Strategic Expert → Strategic Master

Game Track (per game, depth in one game)
  Chess:    Beginner → Club Player → Candidate Master → Master
  Go:       30 Kyu → ... → 1 Dan
  Oware:    Beginner → ... → Grand Sower
  Checkers: Beginner → ... → Expert
  Shogi/Xiangqi: analogous game-specific ladders
```

## 7. Go-to-Market Sequencing Rationale

- **Checkers second**: cheapest possible second implementation (simple rules engine, reuses board chrome), de-risks the abstraction before investing in harder games.
- **Oware third, not Go**: differentiation > difficulty — Oware has no serious modern AI-coached platform anywhere; first-mover advantage is larger than in Go (where strong competitors like OGS/KataGo-based tools exist). This also lands the African-market positioning early.
- **Go/Shogi/Xiangqi fourth**: highest engine complexity (KataGo-class compute cost), justified once subscription revenue from Phases 1–3 funds the infrastructure.
- **Phase 5 long tail**: community-vote or partnership-driven, no fixed order.

## 8. Long-Term Structural Vision

```
MindSports Academy → Global MindSports Federation → International Certifications
   → School Partnerships → University Scholarships → Professional Leagues
```

Federation/FIDE-style partnerships are evaluated per game once the certification track for that game has enough volume and credibility to negotiate from strength — the platform's own certification framework is designed to stand independently regardless of whether such partnerships materialize.
