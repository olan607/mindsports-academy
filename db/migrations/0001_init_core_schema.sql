-- MindSports Academy — Core schema (Phase 0/1)
-- Mirrors docs/03-database-architecture-erd.md. UUID PKs throughout for
-- safe future service/database splits per docs/07-microservices-architecture.md.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================== identity =====================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE user_role AS ENUM ('student', 'coach', 'parent', 'school_admin', 'platform_admin');

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  PRIMARY KEY (user_id, role)
);

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  country TEXT
);

CREATE TABLE parent_child_links (
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, child_id)
);

CREATE TABLE coach_student_links (
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  PRIMARY KEY (coach_id, student_id)
);

-- ===================== academy_core =====================

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,           -- 'chess', 'go', 'oware', ...
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked' -- 'active' | 'locked'
);

CREATE TABLE game_modules (
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  rules_engine_ref TEXT,
  PRIMARY KEY (game_id, version)
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  time_control TEXT NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 1200,
  rd NUMERIC NOT NULL DEFAULT 350,
  volatility NUMERIC NOT NULL DEFAULT 0.06,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, game_id, time_control)
);

CREATE TABLE strategic_intelligence_ratings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  sir_value NUMERIC NOT NULL,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  icon_url TEXT
);

CREATE TABLE user_achievements (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_active_date DATE
);

-- ===================== learning =====================

CREATE TABLE curricula (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  version TEXT NOT NULL
);

CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id UUID NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
  ordinal INT NOT NULL CHECK (ordinal BETWEEN 1 AND 12),
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE (curriculum_id, ordinal)
);

CREATE TYPE level_module_type AS ENUM
  ('lesson', 'puzzle_set', 'opening_pack', 'endgame_pack', 'assessment', 'certification_exam');

CREATE TABLE level_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  type level_module_type NOT NULL,
  content_ref TEXT,
  ordinal INT NOT NULL DEFAULT 0
);

CREATE TYPE progress_status AS ENUM ('locked', 'in_progress', 'completed', 'certified');

CREATE TABLE user_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  status progress_status NOT NULL DEFAULT 'locked',
  pct_complete NUMERIC NOT NULL DEFAULT 0,
  weakness_vector JSONB NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (user_id, game_id, level_id)
);

CREATE INDEX idx_user_progress_weakness_vector ON user_progress USING GIN (weakness_vector);

-- ===================== certification =====================

CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  certificate_url TEXT,
  verification_code TEXT UNIQUE NOT NULL
);

CREATE TABLE assessment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  options JSONB,
  correct_answer JSONB,
  skill_tag TEXT,
  difficulty INT NOT NULL DEFAULT 1
);

CREATE TABLE assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  score NUMERIC,
  passed BOOLEAN,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE assessment_responses (
  attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
  response JSONB,
  correct BOOLEAN,
  PRIMARY KEY (attempt_id, item_id)
);

-- ===================== chess_module =====================

CREATE TABLE chess_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  white_id UUID NOT NULL REFERENCES users(id),
  black_id UUID NOT NULL REFERENCES users(id),
  time_control TEXT NOT NULL,
  result TEXT,
  pgn TEXT,
  rated BOOLEAN NOT NULL DEFAULT true,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  rating_white_before NUMERIC,
  rating_black_before NUMERIC
);

CREATE TYPE move_classification AS ENUM ('best', 'good', 'inaccuracy', 'mistake', 'blunder');

CREATE TABLE chess_moves (
  game_id UUID NOT NULL REFERENCES chess_games(id) ON DELETE CASCADE,
  ply INT NOT NULL,
  move_san TEXT NOT NULL,
  fen_after TEXT NOT NULL,
  eval_cp NUMERIC,
  eval_mate INT,
  classification move_classification,
  PRIMARY KEY (game_id, ply)
);

CREATE TABLE puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  solution JSONB NOT NULL,
  difficulty INT NOT NULL DEFAULT 1,
  skill_tags TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_puzzles_skill_tags ON puzzles USING GIN (skill_tags);

-- ===================== seed: games + chess curriculum shell =====================

INSERT INTO games (code, name, status) VALUES
  ('chess', 'Chess', 'active'),
  ('checkers', 'Checkers', 'locked'),
  ('oware', 'Oware/Ayo', 'locked'),
  ('go', 'Go', 'locked'),
  ('shogi', 'Shogi', 'locked'),
  ('xiangqi', 'Xiangqi', 'locked');
