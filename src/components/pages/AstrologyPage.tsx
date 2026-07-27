import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../../context/ProfileContext';
import { calculateWesternAstro, calculateChineseZodiac } from '../../engines/stellarpath-engines';
import zodiacData from '../../data/zodiac-signs.json';
import chineseData from '../../data/chinese-zodiac.json';
import { ZodiacWheel } from '../three/ZodiacWheel';
import { Scene } from '../three/Scene';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { ZODIAC_SYMBOLS, CHINESE_ANIMAL_EMOJI, elementColor } from '../../utils/helpers';

type SignInfo = { dates: string; element: string; modality: string; rulingPlanet: string; traits: string[]; description: string };
const ZODIAC = zodiacData as Record<string, SignInfo>;
const CHINESE = chineseData as Record<string, { traits: string[]; luckyNumbers: number[]; luckyColors: string[] }>;

export function AstrologyPage() {
  const { activeProfile } = useProfiles();

  const data = useMemo(() => {
    if (!activeProfile) return null;
    const birth = new Date(activeProfile.birthDate);
    return {
      western: calculateWesternAstro(activeProfile),
      chinese: calculateChineseZodiac(birth),
    };
  }, [activeProfile]);

  if (!activeProfile || !data) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/60">Create a profile to reveal your chart.</p>
        <Link to="/profile" className="mt-4 inline-block"><GlowButton>Go to Profile</GlowButton></Link>
      </div>
    );
  }

  const { western, chinese } = data;
  const sunInfo = ZODIAC[western.sunSign];
  const chineseInfo = CHINESE[chinese.animal];

  const placements = [
    { label: 'Sun', sign: western.sunSign, degree: western.sunDegree, note: 'Core identity', available: true },
    { label: 'Moon', sign: western.moonSign, degree: western.moonDegree, note: 'Emotional nature', available: true },
    { label: 'Rising', sign: western.risingSign, degree: 0, note: activeProfile.birthTime ? 'Outer persona' : 'Add birth time for accuracy', available: !!activeProfile.birthTime },
  ];

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-white">Astrology</h1>
        <p className="mt-1 text-white/50">The wheel turns to your sign — {western.sunSign} {ZODIAC_SYMBOLS[western.sunSign]}</p>
      </header>

      <Scene>
        <ZodiacWheel selectedSign={western.sunSign} />
      </Scene>

      {/* Sun / Moon / Rising */}
      <section className="grid gap-4 md:grid-cols-3">
        {placements.map((p) => (
          <GlassCard key={p.label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-white/40">{p.label}</p>
              <span className="text-2xl" style={{ color: elementColor(ZODIAC[p.sign]?.element ?? '') }}>{ZODIAC_SYMBOLS[p.sign]}</span>
            </div>
            <p className="mt-2 font-serif text-2xl font-semibold text-white">{p.sign}</p>
            <p className="text-sm text-white/50">
              {p.available ? `${Math.floor(p.degree)}° · ` : ''}{ZODIAC[p.sign]?.element} · {ZODIAC[p.sign]?.modality}
            </p>
            <p className="mt-1 text-xs text-white/40">{p.note}</p>
          </GlassCard>
        ))}
      </section>

      {/* Sun sign detail */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-white">{western.sunSign} <span className="text-white/40 text-base">{sunInfo?.dates}</span></h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{sunInfo?.description}</p>
          </div>
          <div className="text-sm text-white/60">
            <p>Ruled by <span className="text-gold-400">{sunInfo?.rulingPlanet}</span></p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sunInfo?.traits.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Chinese zodiac */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex flex-wrap items-center gap-5">
          <span className="text-6xl">{CHINESE_ANIMAL_EMOJI[chinese.animal]}</span>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-semibold text-white">
              {chinese.element} {chinese.animal}
              <span className="ml-3 rounded-full border border-nebula-purple/40 bg-nebula-purple/10 px-3 py-0.5 align-middle text-xs text-nebula-purple">{chinese.yinYang}</span>
            </h2>
            <p className="mt-1 text-sm text-white/50">Stem-Branch: {chinese.stemBranch}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chineseInfo?.traits.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/70">{t}</span>
              ))}
            </div>
          </div>
          <div className="text-sm text-white/60">
            <p className="text-xs uppercase tracking-widest text-white/40">Lucky</p>
            <p className="mt-1">Numbers: {chineseInfo?.luckyNumbers.join(', ')}</p>
            <p>Colors: {chineseInfo?.luckyColors.join(', ')}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
