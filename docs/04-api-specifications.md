# API Specifications — MindSports Academy

Style: REST for CRUD/resource operations, WebSocket for live game/matchmaking, GraphQL gateway optional Phase 2 for client aggregation. All services behind an API Gateway; auth via JWT (Supabase/Auth0-issued), service-to-service via mTLS + internal JWT.

Base path convention: `/api/v1/{service}/...`. Game-specific routes are namespaced `/api/v1/games/{gameCode}/...` so the gateway routes by `gameCode` to the correct Game Module service.

## 1. Identity Service

```
POST   /api/v1/identity/signup
POST   /api/v1/identity/login
POST   /api/v1/identity/logout
POST   /api/v1/identity/refresh
GET    /api/v1/identity/me
PATCH  /api/v1/identity/me
POST   /api/v1/identity/roles                 (admin: assign role)
GET    /api/v1/identity/users/:id
POST   /api/v1/identity/parent-links          (link parent↔child)
POST   /api/v1/identity/coach-links           (link coach↔student)
```

## 2. Learning Service

```
GET    /api/v1/learning/curricula/:gameCode
GET    /api/v1/learning/levels/:levelId
GET    /api/v1/learning/levels/:levelId/modules
GET    /api/v1/learning/progress/:userId/:gameCode
POST   /api/v1/learning/progress/:userId/:gameCode/advance
GET    /api/v1/learning/plan/:userId            (personalized plan, weakness-driven)
POST   /api/v1/learning/missions/claim
GET    /api/v1/learning/missions/today
```

## 3. Assessment / Certification Service

```
POST   /api/v1/assessments/:levelId/attempts
PATCH  /api/v1/assessments/attempts/:attemptId/respond
POST   /api/v1/assessments/attempts/:attemptId/submit
GET    /api/v1/certifications/:userId
POST   /api/v1/certifications/issue            (internal, triggered on exam pass)
GET    /api/v1/certifications/verify/:code      (public verification lookup)
```

## 4. Game Module Service — Chess (`gameCode = chess`)

```
POST   /api/v1/games/chess/matches              (create/queue for match)
GET    /api/v1/games/chess/matches/:id
WS     /ws/games/chess/matches/:id               (live move stream)
POST   /api/v1/games/chess/matches/:id/move      {move: san}
POST   /api/v1/games/chess/matches/:id/resign
GET    /api/v1/games/chess/matches/:id/review     (AI move-by-move review)
POST   /api/v1/games/chess/analysis              {fen} → engine eval (Stockfish service)
GET    /api/v1/games/chess/puzzles/next           {level, skillTag}
POST   /api/v1/games/chess/puzzles/:id/attempt
GET    /api/v1/games/chess/openings/explorer      {fen}
POST   /api/v1/games/chess/repertoire
GET    /api/v1/games/chess/endgames/:category
```

Every Game Module exposes the same route shape under its own `gameCode` (`/api/v1/games/oware/...`), implementing the shared `GameModule` contract (see [Microservices Architecture](07-microservices-architecture.md) §4) so client code and the AI Coach gateway are written once.

## 5. AI Coach Service

```
POST   /api/v1/ai-coach/explain
  body: { gameCode, position, move, depthTier: 'beginner'|'intermediate'|'advanced' }
  → { explanationText, principleTag }

POST   /api/v1/ai-coach/voice
  body: { explanationText, voiceProfile }
  → { audioUrl }  (ElevenLabs-backed)

GET    /api/v1/ai-coach/weakness-report/:userId/:gameCode
```

## 6. Competition Service

```
POST   /api/v1/competition/matchmaking/queue
DELETE /api/v1/competition/matchmaking/queue
GET    /api/v1/competition/leaderboards/:gameCode?scope=global|club|friends
GET    /api/v1/competition/tournaments
POST   /api/v1/competition/tournaments/:id/join
GET    /api/v1/competition/tournaments/:id/standings
WS     /ws/competition/tournaments/:id
```

## 7. Community Service

```
GET/POST   /api/v1/community/friends
GET/POST   /api/v1/community/clubs
POST       /api/v1/community/clubs/:id/join
GET        /api/v1/community/feed
```

## 8. Marketplace Service

```
GET    /api/v1/marketplace/coaches?filters=...
GET    /api/v1/marketplace/coaches/:id
POST   /api/v1/marketplace/bookings
PATCH  /api/v1/marketplace/bookings/:id
POST   /api/v1/marketplace/payments/intent      (Stripe payment intent)
POST   /api/v1/marketplace/payments/webhook
```

## 9. Institutional Service (Schools)

```
POST   /api/v1/institutional/schools
GET    /api/v1/institutional/schools/:id/cohorts
POST   /api/v1/institutional/cohorts
POST   /api/v1/institutional/cohorts/:id/members
GET    /api/v1/institutional/schools/:id/reports
POST   /api/v1/institutional/licenses
```

## 10. Analytics Service

```
POST   /api/v1/analytics/events            (server-side event ingestion, mirrors to PostHog/Mixpanel)
GET    /api/v1/analytics/dashboards/:role   (platform admin only)
```

## 11. Common Conventions

- All list endpoints support `?page=&pageSize=&sort=`.
- Errors: `{ error: { code, message, details } }`, standard HTTP status codes.
- Idempotency-Key header required on payment and certification-issuing POSTs.
- Rate limiting headers (`X-RateLimit-*`) on all public endpoints.
- All endpoints versioned via URL path (`/v1/`); breaking changes require `/v2/`.
