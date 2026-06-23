import { Controller, Get, Req } from '@nestjs/common';

/**
 * Stub identity endpoints per docs/04-api-specifications.md §1.
 * Auth provider (Supabase/Auth0) integration TODO — JWT verification
 * should sit here as a guard once a provider is chosen.
 */
@Controller('identity')
export class IdentityController {
  @Get('me')
  me(@Req() req: any) {
    return {
      id: 'stub-user-id',
      email: 'student@example.com',
      roles: ['student'],
      note: 'Replace with real JWT-derived session once auth provider is wired up.',
    };
  }
}
