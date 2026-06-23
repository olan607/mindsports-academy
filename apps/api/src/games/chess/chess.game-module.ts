import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';
import type {
  GameModule,
  Match,
  MatchConfig,
  MoveResult,
  RatingDelta,
  EngineEvaluation,
  Puzzle,
  LevelDefinition,
  DepthTier,
} from '@mindsports/shared';

const LEVELS: LevelDefinition[] = [
  { ordinal: 1, name: 'Pawn Recruit', description: 'Piece movement, basic rules, board orientation.' },
  { ordinal: 2, name: 'Piece Apprentice', description: 'Piece value, basic captures, simple tactics.' },
  { ordinal: 3, name: 'Tactics Trainee', description: 'Forks, pins, skewers, discovered attacks.' },
  { ordinal: 4, name: 'Opening Explorer', description: 'Opening principles, common opening lines.' },
  { ordinal: 5, name: 'Positional Player', description: 'Pawn structure, weak squares, piece activity.' },
  { ordinal: 6, name: 'Endgame Initiate', description: 'King and pawn endgames, basic checkmates.' },
  { ordinal: 7, name: 'Combination Specialist', description: 'Multi-move tactical combinations.' },
  { ordinal: 8, name: 'Strategic Thinker', description: 'Planning, prophylaxis, imbalances.' },
  { ordinal: 9, name: 'Tournament Competitor', description: 'Time management, tournament preparation.' },
  { ordinal: 10, name: 'Advanced Tactician', description: 'Calculation depth, complex middlegames.' },
  { ordinal: 11, name: 'Candidate Master Path', description: 'Deep opening prep, advanced endgames.' },
  { ordinal: 12, name: 'Grandmaster Path', description: 'Mastery-level strategy and calculation.' },
];

/**
 * Chess implementation of the GameModule contract.
 * See docs/07-microservices-architecture.md §4 and
 * docs/12-multi-game-expansion-framework.md §3 for the "definition of done"
 * this module is implementing against.
 */
@Injectable()
export class ChessGameModule implements GameModule {
  readonly code = 'chess' as const;

  createMatch(playerIds: [string, string], config: MatchConfig): Match {
    const chess = new Chess();
    return {
      id: crypto.randomUUID(),
      gameCode: this.code,
      playerIds,
      config,
      state: chess.fen(),
      status: 'active',
    };
  }

  applyMove(match: Match, move: unknown): MoveResult {
    const chess = new Chess(match.state as string);
    const m = move as string; // SAN
    try {
      chess.move(m);
    } catch {
      return { state: match.state, isLegal: false, isTerminal: false };
    }

    const isTerminal = chess.isGameOver();
    let result: '1-0' | '0-1' | '1/2-1/2' | undefined;
    if (isTerminal) {
      if (chess.isCheckmate()) {
        result = chess.turn() === 'w' ? '0-1' : '1-0';
      } else {
        result = '1/2-1/2';
      }
    }

    return { state: chess.fen(), isLegal: true, isTerminal, result };
  }

  validateMove(state: unknown, move: unknown): boolean {
    const chess = new Chess(state as string);
    try {
      const applied = chess.move(move as string);
      return Boolean(applied);
    } catch {
      return false;
    }
  }

  computeRatingDelta(result: '1-0' | '0-1' | '1/2-1/2', ratingA: number, ratingB: number): RatingDelta {
    const K = 32;
    const expectedA = 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
    const scoreA = result === '1-0' ? 1 : result === '0-1' ? 0 : 0.5;
    const deltaA = Math.round(K * (scoreA - expectedA));
    return { deltaA, deltaB: -deltaA };
  }

  normalizeRating(rating: number): number {
    // Placeholder percentile curve; replace with real population distribution.
    return Math.min(100, Math.max(0, ((rating - 400) / (2800 - 400)) * 100));
  }

  async getAnalysis(position: unknown): Promise<EngineEvaluation> {
    // TODO: wire to Stockfish 17 WASM worker pool (docs/07-microservices-architecture.md §6).
    return { bestLine: [], classification: undefined };
  }

  async getPuzzle(criteria: { difficulty?: number; skillTags?: string[] }): Promise<Puzzle> {
    // TODO: query puzzles table (docs/03-database-architecture-erd.md).
    return {
      id: crypto.randomUUID(),
      gameCode: this.code,
      position: new Chess().fen(),
      solution: [],
      difficulty: criteria.difficulty ?? 1,
      skillTags: criteria.skillTags ?? [],
    };
  }

  async explainPosition(position: unknown, move: unknown, depthTier: DepthTier): Promise<string> {
    // TODO: route through AI Coach Service (docs/11-ai-agent-architecture.md).
    return `[${depthTier}] Explanation for move ${String(move)} pending AI Coach integration.`;
  }

  getCurriculumLevels(): LevelDefinition[] {
    return LEVELS;
  }
}
