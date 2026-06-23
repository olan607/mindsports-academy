# Mobile App Wireframes — MindSports Academy (Flutter)

Mobile mirrors the web IA but optimized for one-handed thumb use, bottom-tab navigation, and offline-first lesson/puzzle caching. Same design tokens as web (dark navy/charcoal + gold), tighter information density per screen.

## 1. Bottom Navigation (persistent shell)

```
┌─────────────────────────────┐
│                             │
│      [Screen Content]       │
│                             │
├─────────────────────────────┤
│ 🏠Home 📈Learn ♟Play 🏆Compete 👤Profile │
└─────────────────────────────┘
```

## 2. Home Screen

```
┌─────────────────────────────┐
│ MindSports Academy   🔔  ⚙  │
├─────────────────────────────┤
│ Game: Chess ▾                │
│                             │
│ 🔥 14-day streak             │
│ Rating: 1240                 │
│                             │
│ ┌─ Today's Mission ────────┐ │
│ │ 5 tactics puzzles  2/5    │ │
│ │ [▓▓▓▓░░░░░░]              │ │
│ └───────────────────────────┘ │
│                             │
│ ┌─ Continue ────────────────┐ │
│ │ Level 4 · Lesson 3 of 7   │ │
│ │ [Resume →]                │ │
│ └───────────────────────────┘ │
│                             │
│ [Play Now]  [Puzzle Rush]   │
└─────────────────────────────┘
```

## 3. Learn Tab — Progression Map (vertical scroll on mobile)

```
┌─────────────────────────────┐
│ Your Journey      Chess ▾   │
├─────────────────────────────┤
│  ✓ 1 Pawn Recruit            │
│  ✓ 2 Piece Apprentice        │
│  ✓ 3 Tactics Trainee         │
│  ● 4 Opening Explorer  70%   │
│    [Continue]                │
│  🔒 5 Positional Player       │
│  🔒 6 Endgame Initiate        │
│  ...                         │
│  🔒 12 Grandmaster Path       │
└─────────────────────────────┘
```

## 4. Lesson Screen (offline-capable)

```
┌─────────────────────────────┐
│ ← Level 4         📥 Saved   │
├─────────────────────────────┤
│ Lesson 3: The Ruy Lopez       │
│                             │
│ [Diagram / board snippet]   │
│                             │
│ Body text...                 │
│                             │
│ [🔊 Play voice narration]    │
│                             │
│ [‹ Prev]      [Next ›]       │
└─────────────────────────────┘
```

## 5. Play Tab — Board Screen

```
┌─────────────────────────────┐
│ vs. Magnus_Bot42   10+0  ⏸  │
├─────────────────────────────┤
│  Black: 09:42                │
│ ┌───────────────────────┐    │
│ │                       │    │
│ │     chessboard         │    │
│ │   (full width, drag)   │    │
│ │                       │    │
│ └───────────────────────┘    │
│  White: 09:51                │
│                             │
│ [Move list ▾]  [AI Coach 💬] │
└─────────────────────────────┘
```

Tapping "AI Coach" expands a bottom sheet with explanation text + depth-tier toggle + voice playback button — keeps the board fully visible while coaching content is consulted.

## 6. AI Coach Bottom Sheet

```
┌─────────────────────────────┐
│ ▼ AI Coach                  │
├─────────────────────────────┤
│ [Beginner|Intermediate|Adv.] │
│                             │
│ "This move hangs your        │
│  knight — check what's       │
│  behind the piece you        │
│  capture."                   │
│                             │
│ [🔊 Listen]  [Show best move]│
└─────────────────────────────┘
```

## 7. Compete Tab

```
┌─────────────────────────────┐
│ Compete                     │
├─────────────────────────────┤
│ [Quick Match] [Tournaments]  │
│ [Leaderboard] [Clubs]        │
│                             │
│ ┌─ Active Tournament ──────┐ │
│ │ Spring Swiss — Round 3/7 │ │
│ │ Your standing: #12        │ │
│ │ [View Bracket →]          │ │
│ └───────────────────────────┘ │
└─────────────────────────────┘
```

## 8. Profile Tab

```
┌─────────────────────────────┐
│ Olan Abraham                 │
│ SIR: 1623                    │
├─────────────────────────────┤
│ Chess 1750 │ Go 1400 │ ...   │
│                             │
│ [Certificates] [Badges]      │
│ [Settings] [Accessibility]   │
│ [Switch Role ▾] (if multi-   │
│  role: Coach/Parent)         │
└─────────────────────────────┘
```

## 9. Parent Dashboard (Parent role, mobile)

```
┌─────────────────────────────┐
│ Children                     │
├─────────────────────────────┤
│ ┌─ Emma (age 9) ────────────┐│
│ │ Level 3 · 45 min today    ││
│ │ Streak: 6 days             ││
│ │ [Screen Time Limit: 30min]││
│ │ [View Full Progress →]    ││
│ └────────────────────────────┘│
└─────────────────────────────┘
```

## 10. Offline Mode Indicator

```
┌─────────────────────────────┐
│ 🔌 Offline — 3 lessons,       │
│    42 puzzles cached          │
│    Live games unavailable     │
└─────────────────────────────┘
```

## 11. Flutter Implementation Notes

- Shared design tokens (`colors.dart`, `typography.dart`) generated from the same source as Tailwind config to keep web/mobile visually consistent.
- `BoardWidget` mirrors web's `<BoardRenderer>` contract — game geometry/piece set injected per game module, drag/drop gesture handling shared.
- Offline-first: lessons/puzzles cached via local SQLite/Hive on download; sync queue replays assessment attempts and progress updates on reconnect.
- Accessibility: dynamic type scaling, screen-reader labels on all board squares and pieces (critical for WCAG 2.1 AA on a drag/drop-heavy UI — also support tap-tap move input as an accessible alternative to drag).
