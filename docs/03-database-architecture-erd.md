# Database Architecture & ERD — MindSports Academy

PostgreSQL, single logical database at MVP (schema-per-domain), designed so each domain can be split into its own database/service later without FK redesign (use UUIDs everywhere, no cross-schema FK constraints assumed at the service boundary — enforced via application layer once split).

## 1. Core Domains

```
identity        — users, roles, auth, profiles
academy_core    — games catalog, modules, ratings (SIR), achievements, certifications
learning        — curricula, levels, lessons, assessments, progress
chess_module    — chess-specific: games, moves, openings, puzzles, engine analysis
competition     — matchmaking, tournaments, leaderboards
community       — friends, clubs, messaging
marketplace     — coaches, bookings, payments
institutional   — schools, cohorts, licenses
analytics       — events (mirrored to PostHog/Mixpanel, Postgres copy for internal BI)
```

## 2. Entity-Relationship Diagram (textual)

```
users (id PK, email, password_hash, created_at, locale, status)
 ├─< user_roles (user_id FK, role ENUM[student,coach,parent,school_admin,platform_admin])
 ├─< profiles (user_id FK, display_name, avatar_url, bio, country)
 ├─< parent_child_links (parent_id FK→users.id, child_id FK→users.id)
 └─< coach_student_links (coach_id FK→users.id, student_id FK→users.id, status)

games (id PK, code['chess','go','oware',...], name, status['active','locked'])
 └─< game_modules (game_id FK, version, rules_engine_ref)

ratings (id PK, user_id FK, game_id FK, time_control, rating, rd, volatility, updated_at)
strategic_intelligence_ratings (user_id FK, sir_value, computed_at)  -- derived/cached

curricula (id PK, game_id FK, name, version)
 └─< levels (id PK, curriculum_id FK, ordinal[1-12], name, description)
     └─< level_modules (id PK, level_id FK, type ENUM[lesson,puzzle_set,opening_pack,
                         endgame_pack,assessment,certification_exam], content_ref, ordinal)

lessons (id PK, level_module_id FK, title, body_md, video_url, voice_script_id)
puzzles (id PK, game_id FK, fen/position, solution, difficulty, skill_tags[])
puzzle_sets (id PK, level_module_id FK) ─< puzzle_set_items (puzzle_id FK, ordinal)

assessment_items (id PK, level_id FK, type, prompt, options, correct_answer, skill_tag, difficulty)
assessment_attempts (id PK, user_id FK, level_id FK, score, passed, started_at, completed_at)
 └─< assessment_responses (attempt_id FK, item_id FK, response, correct)

certifications (id PK, user_id FK, level_id FK OR academy_track_stage, game_id FK NULLABLE,
                 issued_at, certificate_url, verification_code UNIQUE)

user_progress (user_id FK, game_id FK, level_id FK, status ENUM[locked,in_progress,
               completed,certified], pct_complete, weakness_vector JSONB)

-- chess_module --
chess_games (id PK, white_id FK, black_id FK, time_control, result, pgn, rated BOOL,
             started_at, ended_at, rating_white_before, rating_black_before)
chess_moves (game_id FK, ply, move_san, fen_after, eval_cp, eval_mate, classification
             ENUM[best,good,inaccuracy,mistake,blunder])
chess_ai_reviews (game_id FK, summary_md, generated_at, depth_tier)
openings (id PK, eco_code, name, moves_pgn)
repertoires (id PK, user_id FK, color, opening_id FK, notes)

-- competition --
matchmaking_queue (user_id FK, game_id FK, time_control, rating, queued_at)
tournaments (id PK, game_id FK, type ENUM[swiss,arena,live], name, start_at, end_at, config JSONB)
tournament_participants (tournament_id FK, user_id FK, score, rank)
leaderboards (game_id FK, scope ENUM[global,club,friends], time_control, snapshot_at) -- materialized

-- community --
friendships (user_a FK, user_b FK, status)
clubs (id PK, name, owner_id FK, description)
club_members (club_id FK, user_id FK, role)

-- marketplace --
coach_profiles (user_id FK, headline, hourly_rate, languages[], specialties[])
bookings (id PK, coach_id FK, student_id FK, scheduled_at, duration_min, status, price)
payments (id PK, booking_id FK NULLABLE, subscription_id FK NULLABLE, amount, currency,
          provider_ref, status)

-- institutional --
schools (id PK, name, country, admin_user_id FK)
cohorts (id PK, school_id FK, name, curriculum_id FK)
cohort_members (cohort_id FK, user_id FK, role)
licenses (id PK, school_id FK, seats, plan, expires_at)

-- gamification (academy_core) --
achievements (id PK, code, name, description, game_id FK NULLABLE, icon_url)
user_achievements (user_id FK, achievement_id FK, earned_at)
streaks (user_id FK, current_streak, longest_streak, last_active_date)
daily_missions (id PK, date, game_id FK NULLABLE, description, reward_xp)
user_missions (user_id FK, mission_id FK, completed_at)
```

## 3. Key Design Decisions

- **Game-agnostic core, game-specific extensions**: `ratings`, `levels`, `level_modules`, `achievements`, `certifications` all key off `game_id` (nullable for cross-game/Academy-Track records). Chess-specific tables (`chess_games`, `chess_moves`, `openings`) live in their own namespace and are never referenced by core services directly — only via the Game Module service contract.
- **UUID primary keys** everywhere for safe future sharding and service splits.
- **`weakness_vector JSONB`** on `user_progress` stores skill-tag-weighted scores (e.g., `{"tactics": 0.62, "endgames": 0.41}`) — input to the personalized learning plan engine.
- **Materialized leaderboards** refreshed on a schedule/event, not computed live, to protect read performance at 1M+ users.
- **Append-only `chess_moves`/`assessment_responses`** for auditability (certification integrity, anti-cheat review).
- **Soft multi-tenancy** for schools: all institutional tables scope by `school_id`; row-level security policies enforce isolation.

## 4. Indexing & Partitioning Notes

- Partition `chess_games` and `chess_moves` by month (`started_at`) once volume justifies it.
- Composite index `(user_id, game_id, time_control)` on `ratings` for fast profile loads.
- GIN index on `weakness_vector` and `skill_tags[]` for personalization queries.
- `leaderboards` stored as materialized views per `(game_id, scope, time_control)`.

## 5. Cache Layer (Redis)

- Session tokens, matchmaking queue state, live game state (authoritative move list mirrored from Postgres for durability), rate limiting, leaderboard hot reads, daily mission state.
