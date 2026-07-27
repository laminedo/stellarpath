import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../../context/ProfileContext';
import { calculateCompatibility } from '../../engines/stellarpath-engines';
import { Constellation } from '../three/Constellation';
import { Scene } from '../three/Scene';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { ProgressRing } from '../ui/ProgressRing';
import { NumberCounter } from '../ui/NumberCounter';
import { initials } from '../../utils/helpers';

function ProfileSelect({
  label,
  value,
  onChange,
  exclude,
  profiles,
}: {
  label: string;
  value: number | null;
  onChange: (i: number) => void;
  exclude: number | null;
  profiles: { name: string; birthDate: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">{label}</span>
      <select
        className="w-full rounded-xl border border-white/10 bg-cosmic-800 px-4 py-2.5 text-white focus:border-nebula-purple focus:outline-none"
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="" disabled>Select a profile…</option>
        {profiles.map((p, i) => (
          <option key={i} value={i} disabled={i === exclude}>
            {p.name} · {p.birthDate}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CompatibilityPage() {
  const { profiles } = useProfiles();
  const [indexA, setIndexA] = useState<number | null>(profiles.length > 0 ? 0 : null);
  const [indexB, setIndexB] = useState<number | null>(profiles.length > 1 ? 1 : null);

  const result = useMemo(() => {
    if (indexA === null || indexB === null) return null;
    const a = profiles[indexA];
    const b = profiles[indexB];
    if (!a || !b) return null;
    return { result: calculateCompatibility(a, b), a, b };
  }, [indexA, indexB, profiles]);

  if (profiles.length < 2) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/60">Save at least two profiles to compare cosmic compatibility.</p>
        <Link to="/profile" className="mt-4 inline-block"><GlowButton>Add profiles</GlowButton></Link>
      </div>
    );
  }

  const scoreColor = (s: number) => (s >= 80 ? '#10b981' : s >= 60 ? '#3b82f6' : s >= 40 ? '#f59e0b' : '#f43f5e');

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-white">Compatibility</h1>
        <p className="mt-1 text-white/50">Two souls, one constellation.</p>
      </header>

      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
        <ProfileSelect label="Person A" value={indexA} onChange={setIndexA} exclude={indexB} profiles={profiles} />
        <ProfileSelect label="Person B" value={indexB} onChange={setIndexB} exclude={indexA} profiles={profiles} />
      </div>

      {result && (
        <>
          <Scene>
            <Constellation
              score={result.result.compositeScore}
              nameA={result.a.name.split(' ')[0]}
              nameB={result.b.name.split(' ')[0]}
            />
          </Scene>

          <div className="text-center">
            <p className="font-serif text-6xl font-semibold" style={{ color: scoreColor(result.result.compositeScore) }}>
              <NumberCounter value={result.result.compositeScore} />
              <span className="text-2xl text-white/40">%</span>
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/60">{result.result.summary}</p>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-white/40">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-nebula-purple/30 font-bold text-white">{initials(result.a.name)}</span>
              ↔
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-nebula-pink/30 font-bold text-white">{initials(result.b.name)}</span>
            </div>
          </div>

          <section className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { label: 'Western', value: result.result.westernScore, hint: 'Sun sign harmony' },
              { label: 'Numerology', value: result.result.numerologyScore, hint: 'Life path resonance' },
              { label: 'Chinese', value: result.result.chineseScore, hint: 'Animal affinity' },
            ].map((c) => (
              <GlassCard key={c.label} className="flex flex-col items-center p-5">
                <ProgressRing value={c.value} color={scoreColor(c.value)} label={c.label} size={104} />
                <p className="mt-2 text-xs text-white/50">{c.hint}</p>
              </GlassCard>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
