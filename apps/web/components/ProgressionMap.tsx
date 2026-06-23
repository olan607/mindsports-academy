import type { LevelDefinition } from '@mindsports/shared';

type LevelStatus = 'completed' | 'current' | 'locked';

interface ProgressionMapProps {
  levels: LevelDefinition[];
  statusByOrdinal: Record<number, LevelStatus>;
}

/**
 * Reusable across every game academy (level count comes from props,
 * not hardcoded) — see docs/06-web-app-wireframes.md §8.
 */
export function ProgressionMap({ levels, statusByOrdinal }: ProgressionMapProps) {
  return (
    <div className="flex gap-3 overflow-x-auto py-4">
      {levels.map((level) => {
        const status = statusByOrdinal[level.ordinal] ?? 'locked';
        const base = 'min-w-[160px] rounded-xl border p-4 text-sm transition-colors';
        const style =
          status === 'completed'
            ? 'border-academy-gold bg-academy-gold/10 text-academy-goldLight'
            : status === 'current'
              ? 'border-academy-gold bg-academy-charcoal text-academy-ivory shadow-lg shadow-academy-gold/20'
              : 'border-white/10 bg-academy-charcoal/40 text-white/30';

        return (
          <div key={level.ordinal} className={`${base} ${style}`}>
            <div className="font-display text-xs uppercase tracking-wide opacity-70">
              Level {level.ordinal}
            </div>
            <div className="mt-1 font-semibold">{level.name}</div>
            <div className="mt-2 text-xs opacity-70">
              {status === 'completed' ? '✓ Certified' : status === 'current' ? 'In progress' : '🔒 Locked'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
