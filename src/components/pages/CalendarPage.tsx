import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useProfiles } from '../../context/ProfileContext';
import { useEnergyForecast } from '../../hooks/useEnergyForecast';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { EnergyBar } from '../ui/EnergyBar';

function dayLabel(iso: string, i: number) {
  if (i === 0) return 'Today';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function CalendarPage() {
  const { activeProfile } = useProfiles();
  const { week } = useEnergyForecast(activeProfile);

  if (!activeProfile || week.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/60">Create a profile to see your 7-day forecast.</p>
        <Link to="/profile" className="mt-4 inline-block"><GlowButton>Go to Profile</GlowButton></Link>
      </div>
    );
  }

  const chartData = week.map((d, i) => ({
    name: dayLabel(d.date, i),
    energy: d.energyScore,
    physical: Math.round(((d.biorhythm.physical + 1) / 2) * 100),
    emotional: Math.round(((d.biorhythm.emotional + 1) / 2) * 100),
    intellectual: Math.round(((d.biorhythm.intellectual + 1) / 2) * 100),
  }));

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-white">7-Day Energy Forecast</h1>
        <p className="mt-1 text-white/50">Ride the wave — plan around your peaks.</p>
      </header>

      {/* Chart */}
      <GlassCard className="p-5" hover={false}>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#12122a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="energy" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#energyGrad)" name="Energy" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Daily cards — horizontal scroll */}
      <section>
        <h2 className="mb-3 font-serif text-2xl text-white">Daily Cards</h2>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 [perspective:800px]">
          {week.map((d, i) => (
            <motion.div
              key={d.date}
              whileHover={{ rotateY: -6, y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-56 shrink-0"
            >
              <GlassCard className="h-full p-4" hover={false}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{dayLabel(d.date, i)}</p>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-cosmic-900"
                    style={{ background: d.color, boxShadow: `0 0 14px ${d.color}` }}
                  >
                    {d.energyScore}
                  </span>
                </div>
                <div className="mt-4 space-y-2.5">
                  <EnergyBar label="Physical" value={d.biorhythm.physical} color="#f43f5e" />
                  <EnergyBar label="Emotional" value={d.biorhythm.emotional} color="#f59e0b" />
                  <EnergyBar label="Intellectual" value={d.biorhythm.intellectual} color="#14b8a6" />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Lucky numbers</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {d.luckyNumbers.slice(0, 3).map((n) => (
                      <span key={n} className="rounded-full bg-gold-400/10 px-2 py-0.5 text-xs text-gold-400">{n}</span>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-xs italic leading-relaxed text-white/50">“{d.affirmation}”</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
