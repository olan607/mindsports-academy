import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

/**
 * Verifies the Supabase access token on incoming requests by delegating to
 * Supabase's own auth.getUser(token) — avoids re-implementing JWT/JWKS
 * verification in the API. Attaches the verified user to req.user.
 * See docs/04-api-specifications.md §1 (Identity Service).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    request.user = { id: data.user.id, email: data.user.email } satisfies AuthenticatedUser;
    return true;
  }
}
