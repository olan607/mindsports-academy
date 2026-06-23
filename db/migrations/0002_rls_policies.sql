-- RLS policies for tables that were missing them after 0001_init_core_schema.sql.
-- Applied directly to the Supabase project (xbxysrgingwpxtanbmne); this file
-- documents the migration for anyone provisioning a fresh environment.

-- Public catalog/content tables: readable by anyone, writes via service role only.
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "games publicly readable" ON public.games FOR SELECT USING (true);
CREATE POLICY "game_modules publicly readable" ON public.game_modules FOR SELECT USING (true);
CREATE POLICY "curricula publicly readable" ON public.curricula FOR SELECT USING (true);
CREATE POLICY "levels publicly readable" ON public.levels FOR SELECT USING (true);
CREATE POLICY "level_modules publicly readable" ON public.level_modules FOR SELECT USING (true);
CREATE POLICY "achievements publicly readable" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "puzzles publicly readable" ON public.puzzles FOR SELECT USING (true);

-- Exam item bank: RLS enabled, intentionally NO policies for anon/authenticated.
-- Contains correct_answer — must only be read via the service-role-backed API,
-- which strips that field before sending items to clients.
ALTER TABLE public.assessment_items ENABLE ROW LEVEL SECURITY;

-- Owner-scoped personal data: read/write own rows only.
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streaks owner read" ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streaks owner insert" ON public.streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streaks owner update" ON public.streaks FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assessment_attempts owner read" ON public.assessment_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "assessment_attempts owner insert" ON public.assessment_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "assessment_attempts owner update" ON public.assessment_attempts FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assessment_responses owner read" ON public.assessment_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.assessment_attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid())
);
CREATE POLICY "assessment_responses owner insert" ON public.assessment_responses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.assessment_attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid())
);

ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parent_child_links involved read" ON public.parent_child_links FOR SELECT USING (
  auth.uid() = parent_id OR auth.uid() = child_id
);

ALTER TABLE public.coach_student_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coach_student_links involved read" ON public.coach_student_links FOR SELECT USING (
  auth.uid() = coach_id OR auth.uid() = student_id
);

-- Owner-scoped, system-written: owner can read, but cannot write (awarded/computed server-side).
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_achievements owner read" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.strategic_intelligence_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sir owner read" ON public.strategic_intelligence_ratings FOR SELECT USING (auth.uid() = user_id);

-- Match data: read own games' moves; writes only via validated API (service role).
ALTER TABLE public.chess_moves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chess_moves participant read" ON public.chess_moves FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chess_games g
    WHERE g.id = game_id AND (g.white_id = auth.uid() OR g.black_id = auth.uid())
  )
);

-- Lock down the signup trigger function so it can't be invoked directly via
-- the REST API (/rest/v1/rpc/handle_new_user) by anon/authenticated clients.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
