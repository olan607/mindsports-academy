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
- A Supabase project (auth + Postgres) — see below
- Redis (for later phases — not required to run the current scaffold)

## Setup

```bash
npm install            # installs all workspaces
npm run build -w packages/shared
```

### Database & Auth (Supabase)

The schema in `db/migrations/` is written for Supabase: `public.users` links 1:1 to
`auth.users`, and a trigger (`handle_new_user`) auto-provisions a `users`/`profiles`/
default `student` role row on signup. Apply both migrations to your Supabase project
(via the SQL editor, the Supabase CLI, or the Supabase MCP `apply_migration` tool):

```
db/migrations/0001_init_core_schema.sql
db/migrations/0002_rls_policies.sql
```

`0002` enables RLS on every table that was missing it after `0001` — see the comments in
that file for the policy rationale (public catalog tables are read-only-to-everyone;
personal data is owner-scoped; `assessment_items` has RLS with **no** policies at all,
intentionally, so exam answers are only ever readable via the service-role-backed API).

### Run the API

```bash
cp apps/api/.env.example apps/api/.env
# fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
# (Project Settings → API in the Supabase dashboard — this is a secret, never commit it)
npm run dev:api
# → http://localhost:4000/health
# → http://localhost:4000/games/chess/levels
# → http://localhost:4000/identity/me   (requires Authorization: Bearer <supabase access token>)
```

### Run the web app

```bash
cp apps/web/.env.example apps/web/.env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# (Project Settings → API in the Supabase dashboard — anon key is safe for the browser)
npm run dev:web
# → http://localhost:3000 (redirects to /login if not signed in)
```

Sign up at `/login`, confirm the email (or disable email confirmation in Supabase Auth
settings for local testing), then you're redirected to the dashboard. The home page
fetches `/games/chess/levels` and `/identity/me` from the API; if the API isn't running,
levels fall back to static data and identity info falls back to the session email.

## What's implemented vs. stubbed

**Implemented**
- Monorepo workspace wiring (npm workspaces).
- `GameModule` shared contract (`packages/shared`).
- `ChessGameModule`: real chess rules via `chess.js` (move validation, FEN state, basic Elo rating delta, terminal/result detection).
- Core Postgres schema + RLS policies, applied to a live Supabase project.
- **Auth**: Supabase Auth signup/login/logout (web), session-gating middleware, a `JwtAuthGuard` on the API that verifies Supabase access tokens via `auth.getUser()`, and a real `/identity/me` backed by `public.users`/`profiles`/`user_roles`.
- Web: Tailwind design tokens (academy navy/gold palette), `ProgressionMap` component, home dashboard wired to the API and to the authenticated session.
- API: health check, chess levels/match/move endpoints, identity endpoint.

**Stubbed — next to build (see docs for the target design)**
- Role-based authorization (guards exist for "is logged in," not yet "is this role allowed to do this").
- Stockfish 17 WASM integration for analysis (`getAnalysis()` in `chess.game-module.ts`).
- AI Coach Service / LLM routing (`explainPosition()`).
- Puzzle bank persistence (`getPuzzle()` currently returns a placeholder).
- Matchmaking, tournaments, marketplace, school portal, parent dashboard — not yet scaffolded.
- Flutter mobile app — not yet started.

## Why the architecture looks the way it does

Every Academy-layer concept (levels, ratings, achievements, certifications) is keyed by `game_id`/`gameCode`, and game-specific logic only exists behind the `GameModule` interface. This is so Checkers, Oware, Go, Shogi, and Xiangqi (see [docs/12-multi-game-expansion-framework.md](docs/12-multi-game-expansion-framework.md)) can be added as new modules implementing that same interface, without modifying Identity, Learning, Certification, Competition, or Analytics code.
