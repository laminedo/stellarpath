import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfiles } from '../../context/ProfileContext';
import { useEnergyForecast } from '../../hooks/useEnergyForecast';
import { calculateNumerology, calculateWesternAstro, calculateChineseZodiac } from '../../engines/stellarpath-engines';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { NumberCounter } from '../ui/NumberCounter';
import { EnergyBar } from '../ui/EnergyBar';
import { EnergyOrb } from '../three/EnergyOrb';
import { Scene } from '../three/Scene';
import { ZODIAC_SYMBOLS, CHINESE_ANIMAL_EMOJI, initials } from '../../utils/helpers';

function Welcome() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-5xl font-semibold text-white md:text-6xl"
      >
        Chart your <span className="bg-gradient-to-r from-gold-400 to-nebula-pink bg-clip-text text-transparent">cosmic path</span>
      </motion.h1>
      <p className="mt-4 max-w-md text-white/60">
        Immersive numerology and astrology insights — computed entirely in your browser, private by design.
      </p>
      <Link to="/profile" className="mt-8">
        <GlowButton variant="gold">Create your profile ✦</GlowButton>
      </Link>
    </div>
  );
}

export function Dashboard() {
  const { activeProfile } = useProfiles();
  const { today } = useEnergyForecast(activeProfile);

  const derived = useMemo(() => {
    if (!activeProfile) return null;
    const birth = new Date(activeProfile.birthDate);
    return {
      numerology: calculateNumerology(activeProfile),
      western: calculateWesternAstro(activeProfile),
      chinese: calculateChineseZodiac(birth),
    };
  }, [activeProfile]);

  if (!activeProfile || !today || !derived) return <Welcome />;

  const bioAvg = (today.biorhythm.physical + today.biorhythm.emotional + today.biorhythm.intellectual) / 3;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center">
        <Scene>
          <EnergyOrb score={today.energyScore} color={today.color} biorhythmPhase={bioAvg} />
        </Scene>
        <h1 className="font-serif text-3xl font-semibold text-white">
          Today's Energy:{' '}
          <span style={{ color: today.color }}>
            <NumberCounter value={today.energyScore} />
            /100
          </span>
        </h1>
        <div className="mx-auto mt-1 flex items-center justify-center gap-2 text-sm text-white/50">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-nebula-purple to-nebula-pink text-[10px] font-bold">
            {initials(activeProfile.name)}
          </span>
          {activeProfile.name}
        </div>
      </section>

      {/* Biorhythm bars */}
      <GlassCard className="mx-auto max-w-xl p-5">
        <div className="space-y-3">
          <EnergyBar label="Physical" value={today.biorhythm.physical} color="#f43f5e" />
          <EnergyBar label="Emotional" value={today.biorhythm.emotional} color="#f59e0b" />
          <EnergyBar label="Intellectual" value={today.biorhythm.intellectual} color="#14b8a6" />
        </div>
      </GlassCard>

      {/* Summary cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <GlassCard className="p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40">Life Path</p>
          <p className="mt-2 font-serif text-4xl font-semibold text-gold-400">
            {derived.numerology.lifePath}
            {derived.numerology.lifePathMaster && <span className="ml-1 text-sm text-nebula-pink">✦</span>}
          </p>
          <p className="mt-1 text-xs text-white/50">{derived.numerology.lifePathMaster ? 'Master Number' : 'Core number'}</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40">Sun Sign</p>
          <p className="mt-2 font-serif text-4xl text-nebula-purple">{ZODIAC_SYMBOLS[derived.western.sunSign]}</p>
          <p className="mt-1 text-xs text-white/50">{derived.western.sunSign} · {derived.western.element}</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40">Chinese Zodiac</p>
          <p className="mt-2 text-4xl">{CHINESE_ANIMAL_EMOJI[derived.chinese.animal]}</p>
          <p className="mt-1 text-xs text-white/50">{derived.chinese.element} {derived.chinese.animal} · {derived.chinese.yinYang}</p>
        </GlassCard>
        <GlassCard className="p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40">Lucky Numbers</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {today.luckyNumbers.slice(0, 5).map((n) => (
              <span key={n} className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/40 bg-gold-400/10 text-sm font-semibold text-gold-400">
                {n}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-white/50">Refreshes daily</p>
        </GlassCard>
      </section>

      {/* Affirmation */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="font-serif text-2xl italic leading-relaxed text-white/80">“{today.affirmation}”</p>
        <cite className="mt-2 block text-xs uppercase tracking-widest text-white/30">Today's affirmation</cite>
      </motion.blockquote>
    </div>
  );
}
