import { Module } from '@nestjs/common';
import { ChessController } from './chess.controller';
import { ChessGameModule } from './chess.game-module';

@Module({
  controllers: [ChessController],
  providers: [ChessGameModule],
  exports: [ChessGameModule],
})
export class ChessModule {}
