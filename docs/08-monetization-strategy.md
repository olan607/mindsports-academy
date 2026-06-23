# Monetization Strategy — MindSports Academy

## 1. Revenue Streams

| Stream | Description | Phase |
|---|---|---|
| Consumer subscription | Core SaaS revenue, gates AI coach depth, voice, advanced analytics, unlimited puzzles | 1 |
| Coach marketplace take rate | % commission on coach bookings | 1 |
| School/institutional licenses | Per-seat or per-cohort annual licenses | 1 (light), 2 (full) |
| Certification fees | Optional premium/proctored certification exam fee tier | 1 |
| Tournament entry fees | Premium tournaments with prizes | 2 |
| Advertising | None at MVP; reserved as a lever only if subscription growth underperforms (avoid degrading learning UX) | Not planned |
| Multi-game subscription upsell | Single subscription unlocks all academies as they ship — increases LTV without new pricing complexity | 2+ |

## 2. Consumer Pricing Tiers

**Free**
- Levels 1–3 access, limited daily puzzles, beginner-tier AI coach (text only), ranked play with rating cap visibility but limited monthly ranked games.

**Plus** (~$9.99/mo or ~$79/yr)
- Full 12-level curriculum, unlimited puzzles, intermediate AI coach tier, voice coach, full Opening Explorer/Repertoire Builder, full tournament access.

**Pro** (~$19.99/mo or ~$159/yr)
- Advanced AI coach tier, priority/deeper engine analysis, personalized weekly coaching report, early access to new game academies, discounted marketplace coaching credits.

**Family** (~$29.99/mo)
- Up to 4 linked accounts (Parent dashboard included), shared billing, individual progress tracking.

Pricing is regionally adjusted (PPP-indexed) given African/Asian market ambitions in Phases 3–4.

## 3. Coach Marketplace Economics

- Platform take rate: 15–20% of booking value (benchmark: comparable two-sided marketplaces 15–25%).
- Coaches set their own rates; platform provides scheduling, payments, reviews, and lead generation (discovery surface).
- Verified/credentialed coach tier (platform-certified per Game Track) commands a "Certified Coach" badge — creates an upsell path for coaches to invest in platform certification themselves.

## 4. Institutional (School) Pricing

- Per-seat annual licensing, tiered by cohort size (volume discounts at 50/200/500+ seats).
- Includes: bulk roster management, curriculum assignment, cohort-level reporting, dedicated onboarding support at higher tiers.
- Land-and-expand motion: schools often start with a pilot cohort (chess club) and expand to full-curriculum adoption.

## 5. Certification Monetization

- Standard certification (in-app exam) included in Plus/Pro subscription.
- "Verified/Proctored" certification (stricter anti-cheat, shareable verification page, suitable for resumes/college applications) — one-time fee (~$15–25) per exam, available to free-tier users too (low-friction upsell path into subscription).

## 6. Unit Economics Targets (Phase 1 planning assumptions)

- Target blended CAC payback < 6 months on annual plans.
- Target gross margin on subscription revenue > 75% (AI/voice inference cost is the primary variable cost — managed via the LLM Router cost-routing policy in [AI Agent Architecture](11-ai-agent-architecture.md) §3).
- Marketplace and institutional revenue are higher-margin distribution/relationship-driven lines, not infra-cost-sensitive.

## 7. Multi-Game Monetization Leverage

Because the subscription is account-wide (not per-game), every new game module added (Checkers → Oware → Go/Shogi/Xiangqi) increases the value of an *existing* subscription without a new pricing negotiation — this is the core monetization argument for the MindSports Academy architecture over a single-game product: expansion compounds LTV instead of requiring net-new acquisition per game.

## 8. Key Risks

- Free tier must be generous enough to drive Duolingo-style viral growth without cannibalizing conversion — requires careful telemetry-driven tuning post-launch.
- Coach marketplace cold-start (need supply before demand justifies it) — mitigate via direct coach recruitment/seeding pre-launch.
- Certification credibility (vs. FIDE-titled credentials) builds over time; pricing/positioning should not over-claim "official" status until federation partnerships exist (see [Multi-Game Expansion Framework](12-multi-game-expansion-framework.md) §8).
