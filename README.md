# MindSports Academy — Monorepo

Founder-level planning docs live in [docs/](docs/) (PRD, architecture, roadmap, etc.). This is the Phase 0/1 code scaffold described in [docs/10-24-month-roadmap.md](docs/10-24-month-roadmap.md).

## Structure

```
apps/
  web/        Next.js + TypeScript + Tailwind (student/coach/parent/admin web app)
  api/        NestJS backend (Identity, Chess Game Module, ...)
packages/
  shared/     GameModule contract + shared types (docs/07-microservices-architecture.md §4)
db/
  migrations/ SQL migrations (docs/03-database-architecture-erd.md)
```

## Prerequisites

- Node.js 20+ (tested on Node 24)
- PostgreSQL 15+
- Redis (for later phases — not required to run the current scaffold)

## Setup

```bash
npm install            # installs all workspaces
npm run build -w packages/shared
```

### Run the API

```bash
createdb mindsports_academy
psql mindsports_academy -f db/migrations/0001_init_core_schema.sql
cp apps/api/.env.example apps/api/.env   # fill in DATABASE_URL etc.
npm run dev:api
# → http://localhost:4000/health
# → http://localhost:4000/games/chess/levels
```

### Run the web app

```bash
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
# → http://localhost:3000
```

The home page fetches `/games/chess/levels` from the API and renders the 12-level progression map; if the API isn't running it falls back to static level data so the UI still renders.

## What's implemented vs. stubbed

**Implemented**
- Monorepo workspace wiring (npm workspaces).
- `GameModule` shared contract (`packages/shared`).
- `ChessGameModule`: real chess rules via `chess.js` (move validation, FEN state, basic Elo rating delta, terminal/result detection).
- Core Postgres schema migration matching the ERD doc.
- Web: Tailwind design tokens (academy navy/gold palette), `ProgressionMap` component, home dashboard page wired to the API.
- API: health check, identity stub, chess levels/match/move endpoints.

**Stubbed — next to build (see docs for the target design)**
- Auth (Supabase/Auth0) — `identity.controller.ts` has a TODO; no real session/JWT yet.
- Stockfish 17 WASM integration for analysis (`getAnalysis()` in `chess.game-module.ts`).
- AI Coach Service / LLM routing (`explainPosition()`).
- Puzzle bank persistence (`getPuzzle()` currently returns a placeholder).
- Matchmaking, tournaments, marketplace, school portal, parent dashboard — not yet scaffolded.
- Flutter mobile app — not yet started.

## Why the architecture looks the way it does

Every Academy-layer concept (levels, ratings, achievements, certifications) is keyed by `game_id`/`gameCode`, and game-specific logic only exists behind the `GameModule` interface. This is so Checkers, Oware, Go, Shogi, and Xiangqi (see [docs/12-multi-game-expansion-framework.md](docs/12-multi-game-expansion-framework.md)) can be added as new modules implementing that same interface, without modifying Identity, Learning, Certification, Competition, or Analytics code.
