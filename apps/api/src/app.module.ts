import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { IdentityModule } from './identity/identity.module';
import { ChessModule } from './games/chess/chess.module';

@Module({
  imports: [IdentityModule, ChessModule],
  controllers: [HealthController],
})
export class AppModule {}
