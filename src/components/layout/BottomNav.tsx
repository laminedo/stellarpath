import { NavLink } from 'react-router-dom';
import { Home, Hash, Sun, CalendarDays, Heart, User } from 'lucide-react';
import { cn } from '../../utils/helpers';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/numerology', icon: Hash, label: 'Numbers' },
  { to: '/astrology', icon: Sun, label: 'Astro' },
  { to: '/calendar', icon: CalendarDays, label: 'Week' },
  { to: '/compatibility', icon: Heart, label: 'Match' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-2xl border border-white/10 bg-cosmic-800/80 px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <ul className="flex items-center gap-1">
        {items.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] transition-all duration-200 sm:px-4',
                  isActive
                    ? 'bg-gradient-to-br from-nebula-purple/40 to-nebula-pink/30 text-white shadow-[0_0_16px_rgba(139,92,246,0.4)]'
                    : 'text-white/50 hover:text-white/90'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="hidden sm:block">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
