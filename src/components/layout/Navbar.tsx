import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../../context/ProfileContext';
import { initials } from '../../utils/helpers';

export function Navbar() {
  const { activeProfile } = useProfiles();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-cosmic-900/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-400" />
          <span className="font-serif text-xl font-semibold tracking-wide text-white">StellarPath</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:border-nebula-purple/50"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-nebula-purple to-nebula-pink text-[10px] font-bold text-white">
            {activeProfile ? initials(activeProfile.name) : '☆'}
          </span>
          <span className="hidden sm:inline">{activeProfile ? activeProfile.name : 'Create profile'}</span>
        </Link>
      </div>
    </header>
  );
}
