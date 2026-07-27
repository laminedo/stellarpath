import { useState } from 'react';
import { Trash2, Check, UserPlus } from 'lucide-react';
import { useProfiles } from '../../context/ProfileContext';
import type { BirthData } from '../../engines/stellarpath-engines';
import { getSunSign, getMoonSign, parseLocalDate } from '../../engines/stellarpath-engines';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { ZODIAC_SYMBOLS, initials } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

const empty: BirthData = { name: '', birthDate: '', birthTime: '', birthLocation: '' };

export function ProfilePage() {
  const { profiles, activeProfile, addProfile, removeProfile, setActiveProfile } = useProfiles();
  const [form, setForm] = useState<BirthData>(empty);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter a name.');
    if (!form.birthDate) return setError('Please pick a birth date.');
    setError('');
    addProfile({
      name: form.name.trim(),
      birthDate: form.birthDate,
      birthTime: form.birthTime || undefined,
      birthLocation: form.birthLocation?.trim() || undefined,
    });
    setForm(empty);
  };

  const isActive = (p: BirthData) =>
    activeProfile?.name === p.name && activeProfile?.birthDate === p.birthDate;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-white">Profiles</h1>
        <p className="mt-1 text-white/50">Stored only in your browser — nothing ever leaves this device.</p>
      </header>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Form */}
        <GlassCard className="p-6" hover={false}>
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-white">
            <UserPlus className="h-5 w-5 text-nebula-purple" /> New profile
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">Full name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aurora Moon"
                className="w-full rounded-xl border border-white/10 bg-cosmic-800 px-4 py-2.5 text-white placeholder-white/25 focus:border-nebula-purple focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">Birth date</span>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-cosmic-800 px-4 py-2.5 text-white [color-scheme:dark] focus:border-nebula-purple focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">Birth time (optional)</span>
              <input
                type="time"
                value={form.birthTime}
                onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-cosmic-800 px-4 py-2.5 text-white [color-scheme:dark] focus:border-nebula-purple focus:outline-none"
              />
              <span className="mt-1 block text-xs text-white/30">Improves moon & rising accuracy.</span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">Birth location (optional)</span>
              <input
                type="text"
                value={form.birthLocation}
                onChange={(e) => setForm({ ...form, birthLocation: e.target.value })}
                placeholder="Paris, France"
                className="w-full rounded-xl border border-white/10 bg-cosmic-800 px-4 py-2.5 text-white placeholder-white/25 focus:border-nebula-purple focus:outline-none"
              />
            </label>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <GlowButton type="submit" variant="gold" className="w-full">Save profile ✦</GlowButton>
          </form>
        </GlassCard>

        {/* Saved profiles */}
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-white">Saved profiles</h2>
          {profiles.length === 0 && (
            <GlassCard className="p-6 text-center text-sm text-white/40" hover={false}>
              No profiles yet. Your saved souls will appear here.
            </GlassCard>
          )}
          {profiles.map((p, i) => {
            const sun = getSunSign(parseLocalDate(p.birthDate)).sign;
            const moon = getMoonSign(parseLocalDate(p.birthDate), p.birthTime).sign;
            const active = isActive(p);
            return (
              <GlassCard key={`${p.name}-${p.birthDate}-${i}`} className={cn('flex items-center gap-4 p-4', active && 'border-gold-400/50')} hover={false}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nebula-purple to-nebula-pink text-sm font-bold text-white">
                  {initials(p.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{p.name}</p>
                  <p className="text-xs text-white/50">
                    {p.birthDate} · {ZODIAC_SYMBOLS[sun]} {sun} · ☾ {moon}
                  </p>
                </div>
                <button
                  onClick={() => setActiveProfile(p)}
                  aria-label={active ? 'Active profile' : `Set ${p.name} active`}
                  className={cn(
                    'rounded-lg p-2 transition',
                    active ? 'text-gold-400' : 'text-white/40 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeProfile(i)}
                  aria-label={`Delete ${p.name}`}
                  className="rounded-lg p-2 text-white/40 transition hover:bg-rose-500/20 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
