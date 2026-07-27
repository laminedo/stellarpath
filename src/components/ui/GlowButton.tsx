import React from 'react';
import { cn } from '../../utils/helpers';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'purple' | 'ghost';
}

export function GlowButton({ variant = 'purple', className, children, ...props }: GlowButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'rounded-xl px-5 py-2.5 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-nebula-purple',
        variant === 'gold' &&
          'bg-gradient-to-r from-gold-500 to-gold-400 text-cosmic-900 hover:shadow-[0_0_24px_rgba(251,191,36,0.5)]',
        variant === 'purple' &&
          'bg-gradient-to-r from-nebula-purple to-nebula-pink text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.6)]',
        variant === 'ghost' &&
          'border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:border-nebula-purple/50',
        'disabled:opacity-40 disabled:pointer-events-none',
        className
      )}
    >
      {children}
    </button>
  );
}
