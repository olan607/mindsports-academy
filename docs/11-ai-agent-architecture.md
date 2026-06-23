# AI Agent Architecture — MindSports Academy

## 1. Goals

- Explain strategic *thinking*, not just annotate moves.
- Serve three depth tiers (beginner/intermediate/advanced) from one underlying analysis.
- Be game-agnostic at the orchestration layer; game-specific at the prompt/ontology layer.
- Drive personalization (weakness detection → learning plan) from the same analysis pipeline that powers post-game review.
- Support voice output (ElevenLabs) without duplicating logic per game.

## 2. Component Architecture

```
                 ┌────────────────────────┐
                 │   AI Coach Service      │
                 │  (orchestration layer)  │
                 └───────────┬────────────┘
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 Engine Adapter      Concept Ontology      LLM Router
 (Stockfish/KataGo/   (per-game tagged      (GPT / Claude,
  game-specific)       principles)          selected by task)
        │                   │                   │
        └─────────┬─────────┴─────────┬─────────┘
                   ▼                   ▼
           Prompt Assembler      Voice Pipeline
           (depth tier +         (ElevenLabs TTS,
            position + tags)      cached per script)
```

## 3. Pipeline: Move/Position Explanation

1. **Engine Adapter** evaluates the position (centipawn/score, best lines, classification: best/good/inaccuracy/mistake/blunder for chess; game-specific equivalents elsewhere).
2. **Concept Ontology lookup**: given the position + move + engine output, tag the relevant strategic principle(s) from that game's ontology (e.g., chess: "discovered attack", "outpost", "weak back rank"; Oware: "delayed capture setup"; Go: "influence vs. territory tradeoff").
3. **Prompt Assembler** builds an LLM prompt: `{depthTier, position, move, engineEval, conceptTags, playerWeaknessProfile}` → strict instruction to explain the *why*, grounded in the tagged concept, at the requested depth tier.
4. **LLM Router** selects model:
   - **Claude**: primary for explanatory/coaching text (longer-context reasoning, instructional tone) — also used for certification exam item review/generation support.
   - **GPT**: secondary/fallback, used for high-volume short completions (e.g., quick puzzle hints) where cost/latency favors it.
   - Routing config is a swappable policy, not hardcoded per call site — allows cost/quality rebalancing without code changes.
5. **Output**: `{ explanationText, principleTag, depthTier }`, cached by `(position, move, depthTier, gameCode)` since explanations for a given position/move are largely reusable across users.
6. **Voice Pipeline** (optional, on-demand): explanationText → ElevenLabs → cached audio URL, keyed the same way to avoid re-synthesizing identical content.

## 4. Depth Tiers

| Tier | Style |
|---|---|
| Beginner | Plain language, one core idea, avoids notation-heavy jargon, uses analogy |
| Intermediate | Names the principle explicitly, references concrete alternative lines |
| Advanced | Full engine-line citation, multiple candidate moves compared, assumes notation fluency |

Tier is a per-user default (set by current level) but user-overridable per session.

## 5. Personalization Loop

```
Game/Puzzle/Assessment results
        ↓
Weakness Detector (aggregates concept_tags × correctness/eval-loss over rolling window)
        ↓
weakness_vector (JSONB, per user per game) — e.g. {"tactics.fork":0.3, "endgames.king_pawn":0.55}
        ↓
Personalized Learning Plan Generator (Learning Service) — selects next lessons/puzzle sets
        ↓
AI Coach explanation prompts also receive weakness_vector → tailor emphasis
```

This loop is implemented once in the AI Coach + Learning services and consumes the `GameModule.explainPosition()` / concept-tagging output from any game — no duplication per game.

## 6. Voice Coach

- ElevenLabs voices: distinct persona per depth tier (optional) or single consistent "coach" voice across tiers (recommendation: one consistent voice for brand trust, tone shifts via script, not voice swapping).
- Pre-generate voice for static lesson scripts at content-authoring time (no runtime cost).
- Generate-on-demand for dynamic post-game review narration, with caching as in §3.
- Offline mode: pre-cache lesson audio for downloaded levels; live game review narration is unavailable offline (requires connectivity), gracefully degraded to text-only.

## 7. Safety & Cost Controls

- All LLM calls go through the AI Coach Service, never directly from client — enables rate limiting, prompt-injection filtering (especially relevant since minors use this platform), and cost monitoring.
- Per-user daily AI-coach quota tiers (free vs. subscription) enforced at the orchestration layer.
- Content moderation pass on any user-generated input that reaches an LLM (e.g., chat-style "ask the coach" free text, if/when added).
- Exam-related LLM use (item generation/review) is human-reviewed before going live in the item bank — never auto-published.

## 8. Multi-Game Extensibility

Adding a game requires only:
1. A new **Concept Ontology** file (tagged principles for that game).
2. A new **Engine Adapter** implementing the evaluation interface.
3. No changes to Prompt Assembler, LLM Router, Voice Pipeline, or Personalization Loop — confirmed by design (see [Multi-Game Expansion Framework](12-multi-game-expansion-framework.md) §5).
