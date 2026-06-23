import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChessGameModule } from './chess.game-module';

@Controller('games/chess')
export class ChessController {
  constructor(private readonly chess: ChessGameModule) {}

  @Get('levels')
  getLevels() {
    return this.chess.getCurriculumLevels();
  }

  @Post('matches')
  createMatch(@Body() body: { playerIds: [string, string]; timeControl: string; rated: boolean }) {
    return this.chess.createMatch(body.playerIds, { timeControl: body.timeControl, rated: body.rated });
  }

  @Post('matches/:id/move')
  move(@Param('id') id: string, @Body() body: { fen: string; move: string }) {
    const match = { id, gameCode: 'chess' as const, playerIds: ['', ''] as [string, string], config: { timeControl: '', rated: false }, state: body.fen, status: 'active' as const };
    return this.chess.applyMove(match, body.move);
  }
}
