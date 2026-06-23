export type GameCode = 'chess' | 'checkers' | 'oware' | 'go' | 'shogi' | 'xiangqi';

export type DepthTier = 'beginner' | 'intermediate' | 'advanced';

export interface MatchConfig {
  timeControl: string;
  rated: boolean;
}

export interface Match {
  id: string;
  gameCode: GameCode;
  playerIds: [string, string];
  config: MatchConfig;
  state: unknown;
  status: 'pending' | 'active' | 'completed' | 'aborted';
}

export interface MoveResult {
  state: unknown;
  isLegal: boolean;
  isTerminal: boolean;
  result?: '1-0' | '0-1' | '1/2-1/2';
}

export interface RatingDelta {
  deltaA: number;
  deltaB: number;
}

export interface EngineEvaluation {
  scoreCp?: number;
  mateIn?: number;
  bestLine: string[];
  classification?: 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
}

export interface Puzzle {
  id: string;
  gameCode: GameCode;
  position: unknown;
  solution: unknown;
  difficulty: number;
  skillTags: string[];
}

export interface LevelDefinition {
  ordinal: number;
  name: string;
  description: string;
}

/**
 * Every strategic game (chess, go, oware, ...) implements this contract.
 * Identity, Learning, Certification, Competition, and Analytics services
 * depend only on this interface — never on a specific game's internals.
 * See docs/07-microservices-architecture.md §4.
 */
export interface GameModule {
  readonly code: GameCode;

  createMatch(playerIds: [string, string], config: MatchConfig): Match;
  applyMove(match: Match, move: unknown): MoveResult;
  validateMove(state: unknown, move: unknown): boolean;
  computeRatingDelta(result: '1-0' | '0-1' | '1/2-1/2', ratingA: number, ratingB: number): RatingDelta;
  normalizeRating(rating: number): number; // → percentile, for Strategic Intelligence Rating
  getAnalysis(position: unknown): Promise<EngineEvaluation>;
  getPuzzle(criteria: { difficulty?: number; skillTags?: string[] }): Promise<Puzzle>;
  explainPosition(position: unknown, move: unknown, depthTier: DepthTier): Promise<string>;
  getCurriculumLevels(): LevelDefinition[];
}
