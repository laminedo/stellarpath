import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../../context/ProfileContext';
import { calculateNumerology } from '../../engines/stellarpath-engines';
import meanings from '../../data/numerology-meanings.json';
import { NumberTower } from '../three/NumberTower';
import { Scene } from '../three/Scene';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

type Meaning = { title: string; keywords: string[]; description: string };
const MEANINGS = meanings as Record<string, Meaning>;

export function NumerologyPage() {
  const { activeProfile } = useProfiles();
  const [expanded, setExpanded] = useState<number | null>(null);

  const numerology = useMemo(
    () => (activeProfile ? calculateNumerology(activeProfile) : null),
    [activeProfile]
  );

  if (!activeProfile || !numerology) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/60">Create a profile to reveal your numbers.</p>
        <Link to="/profile" className="mt-4 inline-block"><GlowButton>Go to Profile</GlowButton></Link>
      </div>
    );
  }

  const coreNumbers = [
    { key: 'lifePath', label: 'Life Path', value: numerology.lifePath, master: numerology.lifePathMaster },
    { key: 'expression', label: 'Expression', value: numerology.expression },
    { key: 'soulUrge', label: 'Soul Urge', value: numerology.soulUrge },
    { key: 'personality', label: 'Personality', value: numerology.personality },
    { key: 'birthday', label: 'Birthday', value: numerology.birthday },
  ];

  const subtitle: Record<string, string> = {
    lifePath: 'Your life\'s central theme and direction.',
    expression: 'How you express your natural talents.',
    soulUrge: 'Your inner desires and motivations.',
    personality: 'The face you show to the world.',
    birthday: 'A special gift from your birth day.',
  };

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-white">Numerology</h1>
        <p className="mt-1 text-white/50">Your core numbers, floating in the cosmos. Tap one to focus it.</p>
      </header>

      <Scene>
        <NumberTower
          numbers={coreNumbers}
          selectedIndex={expanded}
          onSelect={(i) => setExpanded(i)}
        />
      </Scene>

      <section className="space-y-3">
        {coreNumbers.map((n, i) => {
          const meaning = MEANINGS[String(n.value)];
          const open = expanded === i;
          return (
            <GlassCard key={n.key} className="overflow-hidden" hover={false}>
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => setExpanded(open ? null : i)}
                aria-expanded={open}
              >
                <div className="flex items-center gap-4">
                  <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl font-serif text-xl font-semibold', n.master ? 'bg-gold-400/15 text-gold-400' : 'bg-nebula-purple/15 text-nebula-purple')}>
                    {n.value}
                  </span>
                  <div>
                    <p className="font-medium text-white">{n.label}{n.master && <span className="ml-2 text-xs text-gold-400">Master Number ✦</span>}</p>
                    <p className="text-sm text-white/50">{meaning?.title} · {meaning?.keywords.join(', ')}</p>
                  </div>
                </div>
                <ChevronDown className={cn('h-5 w-5 text-white/40 transition-transform', open && 'rotate-180')} />
              </button>
              {open && (
                <div className="border-t border-white/5 px-5 py-4">
                  <p className="text-sm leading-relaxed text-white/70">{subtitle[n.key]}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{meaning?.description}</p>
                </div>
              )}
            </GlassCard>
          );
        })}
      </section>

      {/* Personal cycles timeline */}
      <section>
        <h2 className="mb-3 font-serif text-2xl text-white">Personal Cycles</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Personal Year', value: numerology.personalYear, hint: 'This year\'s theme' },
            { label: 'Personal Month', value: numerology.personalMonth, hint: 'This month\'s focus' },
            { label: 'Personal Day', value: numerology.personalDay, hint: 'Today\'s vibration' },
          ].map((c) => (
            <GlassCard key={c.label} className="p-4 text-center">
              <p className="text-[11px] uppercase tracking-widest text-white/40">{c.label}</p>
              <p className="mt-1 font-serif text-3xl font-semibold text-nebula-teal">{c.value}</p>
              <p className="mt-1 text-xs text-white/50">{c.hint}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
