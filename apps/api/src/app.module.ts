import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { IdentityModule } from './identity/identity.module';
import { ChessModule } from './games/chess/chess.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [SupabaseModule, IdentityModule, ChessModule],
  controllers: [HealthController],
})
export class AppModule {}
