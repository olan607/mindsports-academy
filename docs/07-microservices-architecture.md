# Microservices Architecture — MindSports Academy

## 1. Principles

- Services split along **domain boundaries**, not technical layers.
- **Academy Layer** services are permanently game-agnostic — they must never import or depend on chess-specific types.
- **Game Layer** services implement a shared `GameModule` contract; the platform treats Chess as the first of N implementations.
- Start as a **modular monolith with strict module boundaries** inside NestJS (one deployable, internally namespaced by domain), with extraction to true microservices triggered by load/team-scaling, not speculatively at MVP. Module boundaries are designed so extraction is a deployment change, not a rewrite.

## 2. Service Map

```
                         ┌─────────────────┐
                         │   API Gateway   │  (auth, rate limit, routing)
                         └────────┬────────┘
        ┌───────────────┬────────┼────────┬───────────────┬───────────────┐
        ▼               ▼        ▼        ▼               ▼               ▼
   Identity      Learning   Certification  Competition   AI Coach    Community
   Service       Service    Service        Service       Service     Service
        │               │        │                │           │           │
        └───────┬───────┴────────┴────────┬───────┴───────────┴───────────┘
                ▼                          ▼
        Analytics Service          Marketplace Service
                                            │
                                    Institutional Service
                                            │
        ┌───────────────────────────────────────────────────┐
        ▼                  ▼                  ▼              ▼
  Chess Module       Go Module         Oware Module    Checkers Module ...
  (Phase 1)          (Phase 4)         (Phase 3)       (Phase 2)
```

## 3. Service Responsibilities

| Service | Owns | Depends on |
|---|---|---|
| Identity | auth, users, roles, parent/coach links | — |
| Learning | curricula, levels, progress, personalized plans, missions | Identity, Game Modules (read-only) |
| Certification | exams, certificates, verification | Identity, Learning |
| Competition | matchmaking, tournaments, leaderboards | Identity, Game Modules |
| AI Coach | move explanation, weakness reports, voice generation | Game Modules, Learning |
| Community | friends, clubs, feed | Identity |
| Marketplace | coach profiles, bookings, payments | Identity |
| Institutional | schools, cohorts, licenses | Identity, Learning |
| Analytics | event ingestion, internal BI, mirrors to PostHog/Mixpanel | all services (event consumers) |
| Game Modules | rules engine, game state, ratings, game-specific content | Identity (read-only) |

## 4. The `GameModule` Contract

Every game (Chess, Go, Oware, Shogi, Xiangqi, Checkers) implements the same interface so Academy-layer services never special-case a game:

```typescript
interface GameModule {
  code: string;                          // 'chess' | 'go' | 'oware' | ...
  createMatch(players, config): Match;
  applyMove(matchId, move): MatchState;
  validateMove(state, move): boolean;
  computeRatingDelta(result, ratingA, ratingB): { deltaA: number; deltaB: number };
  getAnalysis(position): EngineEvaluation;       // Stockfish / KataGo / custom engine
  getPuzzle(criteria): Puzzle;
  explainPosition(position, move, depthTier): string;  // feeds AI Coach
  getCurriculumLevels(): LevelDefinition[];
}
```

Adding a new game = implementing this interface + content authoring. Zero changes required to Identity, Learning, Certification, Competition, or Analytics services.

## 5. Communication Patterns

- **Synchronous**: REST/gRPC for request/response (gateway → service, service → service for reads).
- **Asynchronous**: event bus (Redis Streams at MVP scale; migrate to Kafka/SNS-SQS if cross-region/high-throughput needed) for: `match.completed`, `level.certified`, `payment.succeeded`, `achievement.earned` — Learning, Certification, Analytics, Community all subscribe without tight coupling.
- **Live game state**: WebSocket gateway backed by Redis Pub/Sub for horizontal scaling across gateway instances.

## 6. Infrastructure (target: 1M+ users)

```
CDN (static assets, PWA shell) 
  → Load Balancer 
    → API Gateway (autoscaled, stateless)
      → NestJS service pods (autoscaled per domain, Kubernetes)
        → PostgreSQL (primary + read replicas, eventual sharding by user_id range)
        → Redis (cluster mode: sessions, matchmaking, live state, cache)
        → S3-compatible storage (lesson media, voice audio, certificates, game replays)
        → Stockfish/KataGo workers (separate autoscaled pool, CPU-optimized, WASM also runs client-side for low-latency casual analysis)
```

- **Stateless services** behind the gateway scale horizontally; only Postgres and Redis require careful scaling strategy (read replicas, connection pooling via PgBouncer, Redis Cluster).
- **Engine workers** (Stockfish for deep server-side analysis, future KataGo for Go) run in an isolated autoscaled pool so engine load never starves API request handling.
- **Multi-region** readiness: stateless services + CDN deploy multi-region; Postgres primary stays single-region at MVP scale (1M users is comfortably single-region with read replicas), revisit at 10M+.

## 7. Security Boundaries

- API Gateway terminates TLS, enforces JWT validation and RBAC per route.
- Service-to-service traffic on a private network (VPC), mTLS between services.
- Secrets in a managed secret store (not env files in repo).
- Payment data never touches application DB directly — Stripe handles PCI scope; we store only references/tokens.
