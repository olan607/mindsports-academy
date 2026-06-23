import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt-auth.guard';

/**
 * Real identity endpoints backed by Supabase Auth + public.users/profiles/
 * user_roles (provisioned by the on_auth_user_created trigger on signup).
 * See docs/04-api-specifications.md §1.
 */
@Controller('identity')
export class IdentityController {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    const [{ data: profile }, { data: roles }] = await Promise.all([
      this.supabase.from('profiles').select('display_name, avatar_url, bio, country').eq('user_id', user.id).maybeSingle(),
      this.supabase.from('user_roles').select('role').eq('user_id', user.id),
    ]);

    return {
      id: user.id,
      email: user.email,
      profile: profile ?? null,
      roles: roles?.map((r) => r.role) ?? [],
    };
  }
}
