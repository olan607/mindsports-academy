import type { LevelDefinition } from '@mindsports/shared';
import { ProgressionMap } from '@/components/ProgressionMap';

const FALLBACK_LEVELS: LevelDefinition[] = [
  { ordinal: 1, name: 'Pawn Recruit', description: '' },
  { ordinal: 2, name: 'Piece Apprentice', description: '' },
  { ordinal: 3, name: 'Tactics Trainee', description: '' },
  { ordinal: 4, name: 'Opening Explorer', description: '' },
  { ordinal: 5, name: 'Positional Player', description: '' },
  { ordinal: 6, name: 'Endgame Initiate', description: '' },
  { ordinal: 7, name: 'Combination Specialist', description: '' },
  { ordinal: 8, name: 'Strategic Thinker', description: '' },
  { ordinal: 9, name: 'Tournament Competitor', description: '' },
  { ordinal: 10, name: 'Advanced Tactician', description: '' },
  { ordinal: 11, name: 'Candidate Master Path', description: '' },
  { ordinal: 12, name: 'Grandmaster Path', description: '' },
];

async function getLevels(): Promise<LevelDefinition[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  try {
    const res = await fetch(`${apiUrl}/games/chess/levels`, { cache: 'no-store' });
    if (!res.ok) throw new Error('bad response');
    return await res.json();
  } catch {
    return FALLBACK_LEVELS;
  }
}

export default async function HomePage() {
  const levels = await getLevels();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl text-academy-gold">MindSports Academy</h1>
        <span className="text-sm text-white/60">Chess Academy · Level 4 in progress</span>
      </header>

      <section className="mb-8 rounded-xl border border-white/10 bg-academy-charcoal p-6">
        <h2 className="font-display text-lg">Welcome back</h2>
        <p className="mt-1 text-sm text-white/60">14-day streak 🔥 · Rating 1240 (Bullet)</p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg">Your Progression Map</h2>
        <ProgressionMap
          levels={levels}
          statusByOrdinal={{ 1: 'completed', 2: 'completed', 3: 'completed', 4: 'current' }}
        />
      </section>
    </main>
  );
}
